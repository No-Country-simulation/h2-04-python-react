from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PredictionSerializer, PredictionDetailSerializer, PredictionDetailSerializerGet
from drf_spectacular.utils import extend_schema, OpenApiParameter
from utils.apiresponse import ApiResponse
from core.models import Prediction
from rest_framework.permissions import IsAuthenticated

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
        responses={200: PredictionSerializer(many=True), 400: 'Bad Request'},  # Respuesta esperada
        description="Devuelve una lista de todas las predicciones del usuario autenticado."
    )
    def get(self, request):
        predictions = Prediction.objects.filter(user=request.user)
        serializer = PredictionSerializer(predictions, many=True)

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