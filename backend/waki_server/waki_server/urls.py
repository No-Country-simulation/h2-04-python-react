from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from user.views import RegisterView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from django.contrib import admin



urlpatterns = [
    #panel administrador
    path('admin/', admin.site.urls),

    # Registro de usuarios
    path('user/register/', RegisterView.as_view(), name='register'),

    # Obtener tokens (login)
    path('user/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refrescar tokens
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #documentacion
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/doc/',SpectacularSwaggerView.as_view(url_name='schema'), name='doc'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]