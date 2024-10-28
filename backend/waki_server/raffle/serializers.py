from rest_framework import serializers
from core.models import MonthlyRaffle

class RaffleSerializer(serializers.ModelSerializer):

    class Meta:
        model = MonthlyRaffle
        fields = '__all__'  # Incluye todos los campos del modelo

