from rest_framework import generics, filters, status
from rest_framework.response import Response
from core.models import Players
from .serializers import PlayersSerializer  # Asegúrate de que este serializer esté definido
from drf_spectacular.utils import extend_schema, OpenApiParameter
from utils.apiresponse import ApiResponse

@extend_schema(
    parameters=[
        OpenApiParameter('team', str, description='Nombre del equipo para filtrar jugadores', required=False),
        OpenApiParameter('search', str, description='Nombre del jugador para buscar', required=False),
        OpenApiParameter('tokenizable', bool, description='Es un jugador tokenizable', required=False),
    ],
    responses={200: PlayersSerializer(many=True)},
)
class PlayersListView(generics.ListAPIView):
    queryset = Players.objects.all()
    serializer_class = PlayersSerializer


    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por equipo
        team_name = self.request.query_params.get('team', None)
        if team_name:
            queryset = queryset.filter(teams__name__icontains=team_name)
        
        # Filtro por nombre del jugador
        player_name = self.request.query_params.get('search', None)
        if player_name:
            queryset = queryset.filter(lastname__icontains=player_name)

        # Filtro por tokenizable
        tokenizable_param = self.request.query_params.get('tokenizable', None)
        if tokenizable_param is not None:
            # Convierte el valor a un booleano
            player_tokenizable = tokenizable_param.lower() == 'true'
            queryset = queryset.filter(tokenizable=player_tokenizable)
        
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)  # Paginación de la consulta
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)  # Respuesta paginada

        serializer = self.get_serializer(queryset, many=True)
        return ApiResponse.success(data=serializer.data, status_code=status.HTTP_200_OK)