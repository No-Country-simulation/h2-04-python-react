from rest_framework import generics, viewsets
from user.serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from utils.apiresponse import ApiResponse
from rest_framework.views import APIView
from .serializers import UserSerializer, UserUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from core.models import User

class RegisterView(generics.CreateAPIView):
    """
    Clase para manejar el registro de usuarios.
    
    Utiliza el serializer `RegisterSerializer` para validar los datos de registro y, 
    si son válidos, crear un nuevo usuario. Devuelve una respuesta de éxito con los 
    datos del usuario recién creado o un error de validación.
    """

    serializer_class = RegisterSerializer

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
