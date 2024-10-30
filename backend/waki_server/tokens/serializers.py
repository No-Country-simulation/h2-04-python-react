from rest_framework import serializers
from core.models import Players
from utils.tokens import calculate_total_token_burn  # Asegúrate de importar esta función

class PlayerSerializer(serializers.ModelSerializer):
    total_burn = serializers.SerializerMethodField()

    class Meta:
        model = Players
        fields = '__all__'

class PlayerStatisticsSerializer(serializers.Serializer):
    player_id = serializers.IntegerField()
    player_name = serializers.CharField() 
    total_tokens = serializers.IntegerField()
    burned_tokens = serializers.IntegerField()
