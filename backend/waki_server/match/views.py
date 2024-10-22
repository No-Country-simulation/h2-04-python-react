from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PredictionSerializer, PredictionDetailSerializer, PredictionDetailSerializerGet
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from utils.apiresponse import ApiResponse
from core.models import Prediction, PredictionDetail
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta, date
from django.http import JsonResponse

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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def predicciones_disponibles(request):
    """
    Retorna la cantidad de predicciones disponibles para una fecha específica basada en los partidos.
    """
    # Obtener la fecha pasada como parámetro
    fecha_str = request.query_params.get('fecha')
    
    if not fecha_str:
        return JsonResponse({"error": "Se requiere el parámetro 'fecha'."}, status=400)

    try:
        # Convertir el string de la fecha en objeto datetime.date
        fecha = date.fromisoformat(fecha_str)
    except ValueError:
        return JsonResponse({"error": "Formato de fecha inválido. Use 'YYYY-MM-DD'."}, status=400)

    # Obtener el usuario autenticado
    user = request.user

    # Filtrar los PredictionDetail para la fecha del partido
    predicciones_realizadas = PredictionDetail.objects.filter(
        prediction__user=user,
        match__date__date=fecha  # Filtrar por la fecha del partido en la tabla Match
    ).count()

    # Definir las reglas de predicciones según la fecha
    hoy = date.today()

    if fecha == hoy:
        max_predicciones = 5
    elif hoy < fecha <= hoy + timedelta(days=5):
        max_predicciones = 2
    else:
        max_predicciones = 0  # Fuera del rango permitido

    # Calcular las predicciones disponibles
    predicciones_disponibles = max_predicciones - predicciones_realizadas

    return JsonResponse({
        "fecha": fecha_str,
        "predicciones_disponibles": max(0, predicciones_disponibles),  # Evitar valores negativos
        "predicciones_realizadas": predicciones_realizadas,
        "max_predicciones": max_predicciones,
    })