from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from user.views import RegisterView, UserMeView, UserRewards
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from user.views import UserViewSet, LoginView

from football_api.views import fetch_leagues, search_leagues, fetch_match, search_match, update_match, update_match_odds, fetch_teams, fetch_players, fetch_players_statistics
from match.views import PredictionCreateView, PredictionListView, predicciones_disponibles
from players.views import PlayersListView
from tokens.views import PlayerTokenBurnAPIView

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
    path('user/me/rewards/', UserRewards.as_view(), name='rewards'),
    

    # Obtener tokens (login)
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),

    #path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

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
    path('fetch_players_statistics/', fetch_players_statistics, name='fetch-players-statistics'),

    path('fetch-teams/', fetch_teams, name='fetch-match'),
    path('fetch-players/', fetch_players, name='fetch-players'),

    #path('createsuper/', createsuper, name='createsuper'),

    #predicciones
    path('predictions/', PredictionListView.as_view(), name='predictions-list'),
    path('predictions/create/', PredictionCreateView.as_view(), name='create_predictions'),
    path('predictions/available/', predicciones_disponibles, name='predictions-available'),


    path('players/', PlayersListView.as_view(), name='players-list'),
    path('players/<int:player_id>/token-burn/', PlayerTokenBurnAPIView.as_view(), name='player-token-burn'),



]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)