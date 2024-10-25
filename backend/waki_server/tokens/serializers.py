from rest_framework import serializers
from core.models import Players
from utils.tokens import calculate_total_token_burn  # Asegúrate de importar esta función

class PlayerSerializer(serializers.ModelSerializer):
    total_burn = serializers.SerializerMethodField()

    class Meta:
        model = Players
        fields = ['name', 'teams', 'matches_played', 'goals', 'assists', 'total_burn']

    def get_total_burn(self, obj):
        return calculate_total_token_burn(obj)