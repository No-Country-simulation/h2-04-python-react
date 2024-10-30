from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PredictionSerializer, PredictionDetailSerializer, PredictionDetailSerializerGet
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, OpenApiExample
from utils.apiresponse import ApiResponse
from core.models import Prediction, PredictionDetail, ConfigModel
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta, date
from django.http import JsonResponse
import pytz
from datetime import datetime, timedelta, date
def get_config_value(clave):
    """ Helper para obtener el valor de ConfigModel por clave. """
    try:
        return int(ConfigModel.objects.get(clave=clave).valor)
    except ConfigModel.DoesNotExist:
        return None  # Maneja el caso de que la clave no exista




class PredictionCreateView(APIView):
    @extend_schema(
        request=PredictionSerializer,  # El serializador que maneja la solicitud
        responses={201: PredictionSerializer, 400: 'Bad Request'},  # Respuesta esperada
        description="Crea una nueva predicción (simple o combinada) con los detalles asociados."
    )
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        print(data)
        serializer = PredictionSerializer(data=data)
        if serializer.is_valid():
            prediction = serializer.save()  # Guarda la predicción
            details = PredictionDetailSerializer(prediction.details.all(), many=True).data
            # Construye la respuesta con los datos que quieres devolver
            response_data = {
                "user": {
                    "full_name": request.user.get_full_name(),  # Suponiendo que tienes este método
                    "email": request.user.email,
                    "phone": request.user.phone,  # Asegúrate de que este campo exista en tu modelo User
                    "profile_image": request.user.profile_image.url if request.user.profile_image else None,
                },
                "prediction_id": prediction.id,  # Incluye el ID de la predicción si lo necesitas
                "bet_type": prediction.bet_type,
                "created_at" : prediction.created_at,
                "potential_gain" : prediction.potential_gain,
                "status" : prediction.status,
                "details":details,
                # Aquí puedes incluir más datos de la predicción si es necesario
            }
            return ApiResponse.success(data=response_data, status_code=status.HTTP_201_CREATED)
        return ApiResponse.error(message="User registration failed.",
                    error_code="VALIDATION_ERROR",
                    description=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )

class PredictionListView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='status', 
                type=OpenApiTypes.STR, 
                description='Filtrar las predicciones por status (e.g., "ganada", "perdida", "pendiente")',
                required=False
            )
        ],
        responses={200: PredictionSerializer(many=True), 400: 'Bad Request'},
        description="Devuelve una lista de todas las predicciones del usuario autenticado, con opción de filtrar por status."
    )
    def get(self, request):
        predictions = Prediction.objects.filter(user=request.user)
        serializer = PredictionSerializer(predictions, many=True)
        status_filter = request.query_params.get('status')
        if status_filter:
            predictions = predictions.filter(status=status_filter)

        # Agregar detalles a cada predicción
        response_data = []
        for prediction in predictions:
            details = PredictionDetailSerializerGet(prediction.details.all(), many=True).data
            response_data.append({
                "user": {
                    "full_name": request.user.get_full_name(),
                    "email": request.user.email,
                    "phone": request.user.phone,
                    "profile_image": request.user.profile_image.url if request.user.profile_image else None,
                },
                "prediction_id": prediction.id,  # Incluye el ID de la predicción si lo necesitas
                "bet_type": prediction.bet_type,
                "created_at" : prediction.created_at,
                "potential_gain" : prediction.potential_gain,
                "status" : prediction.status,
                "details":details,
            })

        return ApiResponse.success(data=response_data, status_code=status.HTTP_200_OK)
    



@extend_schema(
    parameters=[
        OpenApiParameter(
            name='fecha',
            description="Fecha de la prediccion 'YYYY-MM-DD'",
            required=True,
            type=str,
            location=OpenApiParameter.QUERY
        )
    ],
    responses={
        200: OpenApiExample(
            name="Predicción exitosa",
            value={
                "status_code": 200,
                "data": {
                    "fecha": "2024-10-19",
                    "predicciones_disponibles": 2,
                    "predicciones_realizadas": 0,
                    "max_predicciones": 2
                },
                "errors": None
            }
        ),
        400: OpenApiExample(
            name="Error de solicitud",
            value={
                "status_code": 400,
                "data": None,
                "errors": [
                    {
                        "error": "missing_date_parameter",
                        "description": "Se requiere el parámetro 'fecha' en el formato 'YYYY-MM-DD'.",
                        "message": "El parámetro 'fecha' es requerido."
                    }
                ]
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predicciones_disponibles(request):
    """
    Retorna la cantidad de predicciones disponibles para una fecha específica basada en los partidos
    y en el tipo de usuario (Basic o Premium).
    """
    # Obtener la fecha pasada como parámetro
    fecha_str = request.query_params.get('fecha')
    argentina_tz = pytz.timezone("America/Argentina/Buenos_Aires")

    if not fecha_str:
        return ApiResponse.error(
            message="El parámetro 'fecha' es requerido.",
            error_code="missing_date_parameter",
            description="Se requiere el parámetro 'fecha' en el formato 'YYYY-MM-DD'.",
            status_code=400
        )

    try:
        # Convertir el string de la fecha en datetime en la zona horaria de Argentina
        fecha_argentina = argentina_tz.localize(datetime.strptime(fecha_str, '%Y-%m-%d'))
        # Convertir la fecha de Argentina a UTC
        fecha_utc_inicio = fecha_argentina.astimezone(pytz.UTC)
        fecha_utc_fin = (fecha_argentina + timedelta(days=1)).astimezone(pytz.UTC)
    except ValueError:
        return ApiResponse.error(
            message="Formato de fecha inválido.",
            error_code="invalid_date_format",
            description="El formato de fecha debe ser 'YYYY-MM-DD'.",
            status_code=400
        )

    # Obtener el usuario autenticado
    user = request.user

    # Determinar los valores de configuración según el tipo de usuario
    if user.type_user == 'Premium':
        max_predicciones_hoy = get_config_value('MAX_PREDICIONES_HOY_PREM')
        max_predicciones_fut = get_config_value('MAX_PREDICIONES_FUT_PREM')
    else:  # Caso para usuarios 'Basic'
        max_predicciones_hoy = get_config_value('MAX_PREDICIONES_HOY')
        max_predicciones_fut = get_config_value('MAX_PREDICIONES_FUT')

    # Verificar si los valores de configuración existen
    if max_predicciones_hoy is None or max_predicciones_fut is None:
        return ApiResponse.error(
            message="No se encontraron los valores de configuración.",
            error_code="missing_config",
            description="Verifica que las claves de configuración existan en la base de datos.",
            status_code=500
        )

    # Filtrar los PredictionDetail para la fecha del partido
    predicciones_realizadas = PredictionDetail.objects.filter(
        prediction__user=user,
        match__date__range=(fecha_utc_inicio, fecha_utc_fin)  # Filtrar por el rango UTC de la fecha
    ).count()

    # Definir las reglas de predicciones según la fecha
    hoy = date.today()

    if fecha_utc_inicio.date() == hoy:
        max_predicciones = max_predicciones_hoy
    elif hoy < fecha_utc_inicio.date() <= hoy + timedelta(days=5):
        max_predicciones = max_predicciones_fut
    else:
        max_predicciones = 0  # Fuera del rango permitido

    # Calcular las predicciones disponibles
    predicciones_disponibles = max_predicciones - predicciones_realizadas
    data = {
        "fecha": fecha_str,
        "predicciones_disponibles": max(0, predicciones_disponibles),  # Evitar valores negativos
        "predicciones_realizadas": predicciones_realizadas,
        "max_predicciones": max_predicciones,
    }
    
    return ApiResponse.success(data=data, status_code=200)