from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from user.views import RegisterView, UserMeView, UpdateUserView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from user.views import UserViewSet


router = DefaultRouter()
router.register(r'user', UserViewSet)

urlpatterns = [
    #panel administrador
    path('admin/', admin.site.urls),

    # Registro de usuarios
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/me/',UserMeView.as_view(), name='me'),
     path('', include(router.urls)),
    # Obtener tokens (login)
    path('user/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refrescar tokens
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #documentacion
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/doc/',SpectacularSwaggerView.as_view(url_name='schema'), name='doc'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)