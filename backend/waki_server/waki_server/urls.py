from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from user.views import RegisterView, UserMeView, UpdateUserView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from user.views import UserViewSet, LoginView

from football_api.views import fetch_leagues, search_leagues, fetch_match, search_match, update_match, update_match_odds
from match.views import PredictionCreateView, PredictionUpdateView ,PredictionListView

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)


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
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),

    #path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Refrescar tokens
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #documentacion
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/doc/',SpectacularSwaggerView.as_view(url_name='schema'), name='doc'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    path('fetch-leagues/', fetch_leagues, name='fetch-leagues'),
    path('search-leagues/', search_leagues, name='search-leagues'),
    path('fetch-match/', fetch_match, name='fetch-match'),
    path('update-match/', update_match, name='update-match'),
    path('search-match/', search_match, name='search-match'),
    path('update-match-odds/', update_match_odds, name='update-match-odds'),

    #predicciones
    path('prediccion/', PredictionCreateView.as_view(), name='crear_prediccion'),
    path('predictions/', PredictionListView.as_view(), name='prediction-list'),
    path('predictions/<int:pk>/update/', PredictionUpdateView.as_view(), name='prediction-update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)