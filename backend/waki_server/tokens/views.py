from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import Players
from .serializers import PlayerSerializer

class PlayerTokenBurnAPIView(APIView):
    def get(self, request, player_id):
        player = Players.objects.get(id=player_id)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)