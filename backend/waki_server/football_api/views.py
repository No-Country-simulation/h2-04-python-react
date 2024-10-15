from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.http import JsonResponse
import http.client
import json
from core.models import League, Match
from utils.apiresponse import ApiResponse
from .serializers import LeagueSerializer, MatchSerializer
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q

@extend_schema(
    tags=["api-connect"],)
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def fetch_leagues(request):
    """Actualiza la base de datos de leagues"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
            'x-rapidapi-host': "v3.football.api-sports.io",
            'x-rapidapi-key': "33e976d6787480b32a1208914e80d636"
    }

    conn.request("GET", "/leagues", headers=headers)

    res = conn.getresponse()
    data = res.read()

    # Decodificar y convertir la respuesta a un diccionario JSON
    data_json = json.loads(data.decode("utf-8"))

    # Recorrer las ligas y guardar en la base de datos
    for liga in data_json['response']:
        id_league = liga['league']['id']
        name = liga['league']['name']
        logo = liga['league']['logo']
        country = liga['country']['name']

        # Verificar si el id_league ya existe en la base de datos
        if not League.objects.filter(id_league=id_league).exists():
            League.objects.create(id_league=id_league, name=name, logo=logo, country=country)

    return ApiResponse.success(data={
                    'message': 'Leagues fetched and saved successfully.'
                }, status_code=status.HTTP_201_CREATED)

@extend_schema(
    tags=["Match"],
    summary="Buscar ligas por nombre o país",
    description=(
        "Este endpoint permite buscar ligas de fútbol por nombre o país. "
        "También implementa paginación para devolver resultados en bloques de 10 ligas por página."
    ),
    parameters=[
        OpenApiParameter(
            name="name", description="Filtrar ligas que contienen este valor en su nombre", required=False, type=str
        ),
        OpenApiParameter(
            name="country", description="Filtrar ligas cuyo país contiene este valor", required=False, type=str
        ),
        OpenApiParameter(
            name="page", description="Número de página a devolver en la paginación", required=False, type=int
        ),
    ],
    responses={
        200: {
            "description": "Lista paginada de ligas que coinciden con los filtros aplicados",
            "examples": {
                "application/json": {
                    "success": True,
                    "data": {
                        "count": 25,
                        "next": "http://api.example.com/api/leagues/search/?page=2",
                        "previous": "null",
                        "results": [
                            {
                                "id_league": 39,
                                "name": "Premier League",
                                "logo": "https://media.api-sports.io/football/leagues/39.png",
                                "country": "England"
                            },
                            {
                                "id_league": 140,
                                "name": "La Liga",
                                "logo": "https://media.api-sports.io/football/leagues/140.png",
                                "country": "Spain"
                            }
                        ]
                    },
                    "status_code": 200
                }
            }
        },
        400: {
            "description": "Solicitud incorrecta: parámetros no válidos"
        },
        404: {
            "description": "No se encontraron ligas que coincidan con los filtros"
        }
    }
)
@api_view(['GET'])
def search_leagues(request):

    """Endpoint para buscar ligas por nombre o país"""
    # Obtener los parámetros de búsqueda
    name = request.query_params.get('name', None)
    country = request.query_params.get('country', None)

    # Filtrar las ligas en base a los parámetros recibidos
    leagues = League.objects.all()
    
    if name:
        leagues = leagues.filter(name__icontains=name)  
    if country:
        leagues = leagues.filter(country__icontains=country)  

    paginator = PageNumberPagination()
    paginator.page_size = 10  
    result_page = paginator.paginate_queryset(leagues, request)

    serializer = LeagueSerializer(result_page, many=True)

    paginated_response = {
        'count': paginator.page.paginator.count,  
        'next': paginator.get_next_link(),        
        'previous': paginator.get_previous_link(),
        'results': serializer.data                  
    }

    return ApiResponse.success(data=paginated_response, status_code=status.HTTP_200_OK)

@extend_schema(
    tags=["api-connect"],)
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def fetch_match(request):
    """Actualiza la base de datos de partidos"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")
    headers = {
            'x-rapidapi-host': "api-football-v1.p.rapidapi.com",
            'x-rapidapi-key': "425a2f8650msh2c93977c1d9775fp1d700djsnccb1675c3877"
    }

    lista_ligas = {
        "id":1, "name": "World Cup",#no en este año
        "id":39, "name": "Premier League",#ok
        "id":140, "name": "La liga",#ok
        "id":78, "name": "Bundesliga",#ok
        "id":135, "name": "Serie A", #ok
        "id":61, "name": "Ligue 1",#ok
        "id":128, "name": "Liga Profesional Argentina",#ok
        "id":13, "name": "CONMEBOL Libertadores",#ok
        "id":2, "name": "UEFA Champions League",#ok
    }    
    season = 2024
    league = 2
    ruta = f"/v3/fixtures?season={season}&league={league}"

    conn.request("GET",ruta , headers=headers)

    res = conn.getresponse()
    data = res.read()

    # Decodificar y convertir la respuesta a un diccionario JSON
    data_json = json.loads(data.decode("utf-8"))

    print(data_json)
    # Recorrer las ligas y guardar en la base de datos
    for fixture in data_json['response']:
        try:
            id_fixture = fixture['fixture']['id']
            date = fixture['fixture']['date']
            league = fixture['league']['id']
            home = fixture['teams']['home']['name']
            home_logo = fixture['teams']['home']['logo']
            home_goals = fixture['goals']['home']  # Puede ser None, verificar
            away_goals = fixture['goals']['away']  # Puede ser None, verificar
            away = fixture['teams']['away']['name']
            away_logo = fixture['teams']['away']['logo']
            match_status = fixture['fixture']['status']

            try:
                league_instance = League.objects.get(id_league=league)
            except League.DoesNotExist:
                return ApiResponse.error(
                    message=f"League with ID {league} does not exist.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        except KeyError as e:
            # Si falta algún dato en la API, capturamos el error
            return ApiResponse.error(error_code=status.HTTP_400_BAD_REQUEST,
                message=f"Missing field in fixture data: {e}",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Si no hay goles, establecerlos en 0
        home_goals = home_goals if home_goals is not None else None
        away_goals = away_goals if away_goals is not None else None


        # Verificar si el id_league ya existe en la base de datos
        if not Match.objects.filter(id_fixture=id_fixture).exists():
            Match.objects.create(
                id_fixture= int(id_fixture),
                date=date,
                league= league_instance, 
                home_team = home,
                home_team_logo = home_logo,
                away_team = away,
                away_team_logo = away_logo,
                home_team_goals = home_goals,
                away_team_goals = away_goals,
                match_status = match_status,
                home_odds=0,
                draw_odds=0,  
                away_odds=0
                )

    return ApiResponse.success(data={
                    'message': f'Fixture fetched and saved successfully. league {league}'
                }, status_code=status.HTTP_201_CREATED)


@extend_schema(
    tags=["api-connect"],)
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def update_match(request):
    """Actualiza la base de datos de partidos"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
            'x-rapidapi-host': "v3.football.api-sports.io",
            'x-rapidapi-key': "33e976d6787480b32a1208914e80d636"
    }

    season = 2022
    league = 128
    ruta = f"/fixtures?season={season}&league={league}"

    conn.request("GET",ruta , headers=headers)

    res = conn.getresponse()
    data = res.read()

    # Decodificar y convertir la respuesta a un diccionario JSON
    data_json = json.loads(data.decode("utf-8"))

    # Recorrer las ligas y guardar en la base de datos
    for fixture in data_json['response']:
        try:
            id_fixture = fixture['fixture']['id']
            date = fixture['fixture']['date']
            league = fixture['league']['id']
            home = fixture['teams']['home']['name']
            home_logo = fixture['teams']['home']['logo']
            home_goals = fixture['goals']['home']  # Puede ser None, verificar
            away_goals = fixture['goals']['away']  # Puede ser None, verificar
            away = fixture['teams']['away']['name']
            away_logo = fixture['teams']['away']['logo']
            match_status = fixture['fixture']['status']

            try:
                league_instance = League.objects.get(id_league=league)
            except League.DoesNotExist:
                return ApiResponse.error(
                    message=f"League with ID {league} does not exist.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        except KeyError as e:
            # Si falta algún dato en la API, capturamos el error
            return ApiResponse.error(
                message=f"Missing field in fixture data: {e}",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Si no hay goles, establecerlos en 0
        home_goals = home_goals if home_goals is not None else 0
        away_goals = away_goals if away_goals is not None else 0


        # Verificar si el id_league ya existe en la base de datos
        match = Match.objects.filter(id_fixture=id_fixture).first()
        if match:
            # Si el partido existe, verificar si algún campo cambió
            if (match.date != date or 
                match.home_team != home or 
                match.away_team != away or 
                match.home_team_goals != home_goals or 
                match.away_team_goals != away_goals or 
                match.match_status != match_status):
                
                # Actualizar los datos del partido
                match.date = date
                match.home_team = home
                match.home_team_logo = home_logo
                match.away_team = away
                match.away_team_logo = away_logo
                match.home_team_goals = home_goals
                match.away_team_goals = away_goals
                match.match_status = match_status
                match.league = league_instance
                match.save()

    return ApiResponse.success(data={
                    'message': 'Fixture fetched and saved successfully.'
                }, status_code=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Match"],
    summary="Buscar partidos por fecha o equipo",
    description=(
        "Este endpoint permite buscar los partidos que se van a disputar o ya estan finalizados por fecha o por nombre de equipo. "
        "También implementa paginación para devolver resultados en bloques de 10 ligas por página."
    ),
    parameters=[
        OpenApiParameter(
            name="teams", description="Filtrar partidos con este valor en su nombre tanto de local como de visitante", required=False, type=str
        ),
        OpenApiParameter(
            name="date", description="Filtrar los partidos por fecha", required=False, type=str
        ),
        OpenApiParameter(
            name="league", description="Filtrar los partidos por id de liga", required=False, type=str
        ),
        OpenApiParameter(
            name="page", description="Número de página a devolver en la paginación", required=False, type=int
        ),
    ],
)
@api_view(['GET'])
def search_match(request):
    """Endpoint para buscar ligas por nombre o país"""
    # Obtener los parámetros de búsqueda
    teams = request.query_params.get('teams', None)
    date = request.query_params.get('date', None)
    league = request.query_params.get('league', None)

    # Filtrar las ligas en base a los parámetros recibidos
    matchs = Match.objects.all()
    
    if teams:
        matchs = matchs.filter(Q(home_team__icontains=teams) | Q(away_team__icontains=teams))
    if date:
        matchs = matchs.filter(date__icontains=date)  
    if league:
        matchs = matchs.filter(league=league)  

    paginator = PageNumberPagination()
    paginator.page_size = 10  
    result_page = paginator.paginate_queryset(matchs, request)

    serializer = MatchSerializer(result_page, many=True)

    paginated_response = {
        'count': paginator.page.paginator.count,  
        'next': paginator.get_next_link(),        
        'previous': paginator.get_previous_link(),
        'results': serializer.data                  
    }

    return ApiResponse.success(data=paginated_response, status_code=status.HTTP_200_OK)



@extend_schema(
    tags=["api-connect"],)
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def update_match_odds(request):
    """Actualiza la base de datos de partidos con todas las páginas de cuotas"""
    
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")
    headers = {
        'x-rapidapi-host': "api-football-v1.p.rapidapi.com",
        'x-rapidapi-key': "425a2f8650msh2c93977c1d9775fp1d700djsnccb1675c3877"
    }

    page = 1
    total_pages = 1  # Inicializamos a 1 para comenzar el bucle
    registros_actualizados = 0
    
    while page <= total_pages:
        ruta = f"/v3/odds?season=2024&bet=1&bookmaker=6&league=128&page={page}&fixture=1158911"

        conn.request("GET", ruta, headers=headers)
        res = conn.getresponse()
        data = res.read()

        # Decodificar y convertir la respuesta a un diccionario JSON
        data_json = json.loads(data.decode("utf-8"))
        print(data_json)
        # Procesar los fixtures y actualizar la base de datos
        for fixture in data_json.get('response', []):
            try:
                id_fixture = fixture['fixture']['id']
                bookmakers = fixture.get('bookmakers', [])
                
                home_odds = None
                draw_odds = None
                away_odds = None
                
                # Recorrer los bookmakers y encontrar las odds
                for bookmaker in bookmakers:
                    if bookmaker['id'] == 8:  # Bet365 tiene id 8
                        for bet in bookmaker['bets']:
                            if bet['name'] == "Match Winner":
                                for value in bet['values']:
                                    if value['value'] == "Home":
                                        home_odds = value['odd']
                                    elif value['value'] == "Draw":
                                        draw_odds = value['odd']
                                    elif value['value'] == "Away":
                                        away_odds = value['odd']

                if home_odds and draw_odds and away_odds:
                    # Verificar si el id_fixture ya existe en la base de datos
                    match = Match.objects.filter(id_fixture=id_fixture).first()

                    if match:
                        # Actualizar las cuotas del partido
                        match.home_odds = home_odds
                        match.draw_odds = draw_odds
                        match.away_odds = away_odds
                        match.save()
                        registros_actualizados = registros_actualizados + 1

            except Exception as e:
                print(f"Error al procesar el fixture {id_fixture}: {e}")

        # Obtener la información de paginación
        pagination = data_json.get('paging', {})
        total_pages = pagination.get('total', 1)
        current_page = pagination.get('current', 1)

        print(f"Procesando página {current_page} de {total_pages}")
        
        # Avanzar a la siguiente página
        page += 1
    messange = f'All fixtures fetched and saved successfully. registros: {registros_actualizados}'
    return ApiResponse.success(data={
        'message': messange
    }, status_code=status.HTTP_201_CREATED)
