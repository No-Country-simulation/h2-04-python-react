from rest_framework import generics, filters, status
from rest_framework.response import Response
from core.models import MonthlyRaffle
from .serializers import RaffleSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from utils.apiresponse import ApiResponse

@extend_schema(
    parameters=[
        OpenApiParameter('language', str, description='Lenguaje ES/EN', required=False),
        OpenApiParameter('ligue', str, description='Liga de usuarios', required=False),
    ],
    responses={200:  RaffleSerializer(many=True)},
)
class RaffleListView(generics.ListAPIView):
    queryset =  MonthlyRaffle.objects.all()
    serializer_class = RaffleSerializer


    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(is_active=True)
        # Filtro por equipo
        language = self.request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language=language)

        
        ligue = self.request.query_params.get('ligue', None)
        if ligue:
            queryset = queryset.filter(ligue=ligue)

        return queryset
