from rest_framework import serializers
from core.models import Players

class PlayersSerializer(serializers.ModelSerializer):
    team_names = serializers.SerializerMethodField()

    class Meta:
        model = Players
        fields = ['id', 'name', 'age', 'number', 'position', 'photo', 'team_names']  # Incluye team_names

    def get_team_names(self, obj):
        # Devuelve una lista de nombres de equipos para el jugador
        return [team.name for team in obj.teams.all()]  # Accede a los nombres de los equipos