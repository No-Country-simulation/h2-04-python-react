from rest_framework import serializers
from core.models import Players, Achievements

class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = ['description', 'year', 'teams']


class PlayersSerializer(serializers.ModelSerializer):
    team_names = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()

    class Meta:
        model = Players
        fields = '__all__'  # Incluye todos los campos del modelo

    def get_team_names(self, obj):
        # Devuelve una lista de nombres de equipos para el jugador
        return [team.name for team in obj.teams.all()] 
    
    def get_achievements(self, obj):
        # Obtiene todos los logros asociados al jugador
        achievements = obj.achievements_set.all()  # Relación inversa para obtener los logros
        return AchievementsSerializer(achievements, many=True).data