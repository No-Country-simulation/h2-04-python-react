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
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            "status_code": 200,
            "data": serializer.data,
            "errors": []
        })
    
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
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

    def get_serializer_class(self):
        if self.action == 'update':
            return UserUpdateSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return ApiResponse.success(data=serializer.data)

    def update(self, request, *args, **kwargs):
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
        instance = self.get_object()
        instance.delete()
        return ApiResponse.success(message="User deleted successfully.")