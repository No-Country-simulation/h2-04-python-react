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
def update_match(request):
    """Actualiza la base de datos de partidos"""
    # Conexión HTTP para la API
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
            'x-rapidapi-host': "v3.football.api-sports.io",
            'x-rapidapi-key': "33e976d6787480b32a1208914e80d636"
    }

    season = 2021
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

    # Filtrar las ligas en base a los parámetros recibidos
    matchs = Match.objects.all()
    
    if teams:
        matchs = matchs.filter(Q(home_team__icontains=teams) | Q(away_team__icontains=teams))
    if date:
        matchs = matchs.filter(date__icontains=date)  

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