from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.http import JsonResponse
import http.client
import json
from core.models import League, Match, PredictionDetail, Prediction, User
from utils.apiresponse import ApiResponse
from .serializers import LeagueSerializer, MatchSerializer
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q
from rest_framework.request import Request
from django.db.models import F

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

def fetch_match(league):
    """Actualiza la base de datos de partidos"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "3340e6dc57da7cc7c941644d11f7ef1c"
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
    ruta = f"/fixtures?season={season}&league={league}"
    conn.request("GET",ruta , headers=headers)
    contador = 0
    
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
            return ApiResponse.error(error_code=status.HTTP_400_BAD_REQUEST,
                message=f"Missing field in fixture data: {e}",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Si no hay goles, establecerlos en 0
        home_goals = home_goals if home_goals is not None else None
        away_goals = away_goals if away_goals is not None else None


        if home_goals is not None and away_goals is not None:
            if home_goals > away_goals:
                winner = 'home'
            elif home_goals < away_goals:
                winner = 'away'
            else:
                winner = 'draw'
        else:
            winner = None

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
                winner = winner,
                home_odds=0,
                draw_odds=0,  
                away_odds=0
                )
            contador = contador +1



    return ApiResponse.success(data={
                    'message': f'Fixture fetched and saved successfully. league {league}, register create {contador}'
                }, status_code=status.HTTP_201_CREATED)

def update_user_points():
    """Revisa todas las predicciones pendientes y actualiza los puntos del usuario si la predicción fue acertada."""
    
    # Obtener todas las predicciones pendientes
    pending_predictions = PredictionDetail.objects.filter(status='pendiente')

    for detail in pending_predictions:
        match = detail.match
        prediction_text = detail.prediction_text.lower()

        # Verificar si la predicción fue acertada
        if match.winner is not None:
            if (
                (prediction_text == "home" and match.winner == "home") or
                (prediction_text == "away" and match.winner == "away") or
                (prediction_text == "draw" and match.winner == "draw")
            ):
                # Si la predicción fue acertada, actualizamos el detalle
                print('ganada')
                detail.status = 'ganada'
                detail.save()

            else:
                # Si la predicción fue incorrecta
                detail.status = 'perdida'
                detail.save()
        print(f'la prediccion de la base es {prediction_text} el resultado real es {match.winner}')

    # Procesar predicciones simples y combinadas
    update_simple_predictions()
    update_combinada_predictions()
    

    return "Puntos actualizados correctamente"

def update_simple_predictions():
    """Suma puntos para predicciones simples si han sido acertadas."""
    simple_predictions = Prediction.objects.filter(bet_type='simple', status='pendiente')

    for prediction in simple_predictions:
        # Verificar si todas las predicciones asociadas han sido ganadas
        all_details_won = all(detail.status == 'ganada' for detail in prediction.details)
        
        if all_details_won:
            # Actualizar el estado de la predicción a 'ganada'
            prediction.status = 'ganada'
            prediction.save()

            # Sumar puntos al usuario
            prediction.user.total_points = F('total_points') + prediction.potential_gain
            prediction.user.save()

        else:
            # Si alguna predicción fue perdida, actualizar el estado a 'perdida'
            any_lost = any(detail.status == 'perdida' for detail in prediction.details)
            if any_lost:
                prediction.status = 'perdida'
                prediction.save()

def update_combinada_predictions():
    """Suma puntos para predicciones combinadas si todas las predicciones asociadas han sido acertadas."""
    
    # Obtener todas las predicciones combinadas con estado pendiente
    combinada_predictions = Prediction.objects.filter(bet_type='combinada', status='pendiente')

    for prediction in combinada_predictions:
        # Verificar si alguna predicción dentro de la combinada está pendiente
        any_pending = any(detail.status == 'pendiente' for detail in prediction.details)
        
        if any_pending:
            # Si hay alguna predicción pendiente, no hacer nada en este ciclo
            continue
        
        # Verificar si todas las predicciones asociadas han sido ganadas
        all_details_won = all(detail.status == 'ganada' for detail in prediction.details)

        if all_details_won:
            # Si todas las predicciones de la combinada son correctas, actualizar la predicción
            prediction.status = 'ganada'
            prediction.save()

            # Sumar los puntos al usuario
            prediction.user.total_points = F('total_points') + prediction.potential_gain
            prediction.user.save()

        else:
            # Verificar si alguna predicción fue perdida
            any_lost = any(detail.status == 'perdida' for detail in prediction.details)
            if any_lost:
                # Si alguna fue perdida, la combinada se pierde
                prediction.status = 'perdida'
                prediction.save()

@extend_schema(
    tags=["api-connect"],
    )
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def update_match(request):
    """Actualiza la base de datos de partidos"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "3340e6dc57da7cc7c941644d11f7ef1c"
    }

    season = 2024
    leagues = Match.objects.values_list('league', flat=True).distinct()
    '''for league in leagues:
        ruta = f"/fixtures?season={season}&league={league}"
        contador = 0
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
                home_winner = fixture['teams']['home']['winner']
                away_goals = fixture['goals']['away']  # Puede ser None, verificar
                away = fixture['teams']['away']['name']
                away_logo = fixture['teams']['away']['logo']
                away_winner = fixture['teams']['away']['winner']
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
            home_goals = home_goals if home_goals is not None else None
            away_goals = away_goals if away_goals is not None else None

            if home_goals is not None and away_goals is not None:
                if home_goals > away_goals:
                    winner = 'home'
                elif home_goals < away_goals:
                    winner = 'away'
                else:
                    winner = 'draw'
            else:
                winner = None


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
                    match.winner = winner
                    match.league = league_instance
                    match.save()
                    contador = contador+1
    '''
    #llamo a evaluar los resultados de las predicciones
    contador=0
    update_user_points()
    return ApiResponse.success(data={
                    f'message': f'Fixture fetched and saved successfully. register update {contador}'
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
        if not matchs.exists(): 
            fetch_match(league)
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
    tags=["api-connect"],
    )
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def update_match_odds(request):
    """Actualiza la base de datos de partidos con todas las páginas de cuotas"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "3340e6dc57da7cc7c941644d11f7ef1c"
    }

    leagues = Match.objects.values_list('league', flat=True).distinct()
    for league in leagues:
        page = 1
        total_pages = 1  # Inicializamos a 1 para comenzar el bucle
        registros_actualizados = 0
        while page <= total_pages:
            ruta = f"/odds?season=2024&bet=1&bookmaker=8&league={league}&page={page}"

            conn.request("GET", ruta, headers=headers)
            res = conn.getresponse()
            data = res.read()

            # Decodificar y convertir la respuesta a un diccionario JSON
            data_json = json.loads(data.decode("utf-8"))
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









@extend_schema(
    tags=["api-connect"],
    )
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Solo superusuarios pueden acceder
def createsuper(request):
    """Actualiza la base de datos de partidos"""
    user = User.objects.create_superuser(username='admin', email='admin@admin.com', password='admin')
    user.save()

    return ApiResponse.success(data={
                    f'message': f'Fixture fetched and saved successfully. register update {user}'
                }, status_code=status.HTTP_201_CREATED)
