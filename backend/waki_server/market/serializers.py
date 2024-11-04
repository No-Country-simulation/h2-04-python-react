from rest_framework import serializers
from core.models import Order, Token, Players

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ['id', 'user', 'token', 'quantity', 'order_type', 'price', 'status', 'token_name']
        read_only_fields = ['user', 'token']

    def create(self, validated_data):
        token_name = validated_data.pop('token_name')

        # Aquí buscamos el token usando el nombre proporcionado
        try:
            player = Players.objects.get(token_name=token_name)  # Obtén el jugador con el token_name
            token = Token.objects.get(player=player)  # Obtén el token asociado a ese jugador correcto
        except Token.DoesNotExist:
            raise serializers.ValidationError({"token_name": "El token especificado no existe."})

        # Ahora podemos agregar el token al validated_data
        validated_data['token'] = token

        return super().create(validated_data)
    

class BuyTokenSerializer(serializers.Serializer):
    token_name = serializers.CharField(required=True, help_text="Nombre del token que se desea comprar.")
    quantity = serializers.IntegerField(required=True, help_text="Cantidad de tokens que se desea comprar.")
    price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2, help_text="Precio total que el usuario está dispuesto a pagar.")



class SellTokenSerializer(serializers.Serializer):
    token_name = serializers.CharField(required=True, help_text="Nombre del token que se desea vender.")
    quantity = serializers.IntegerField(required=True, help_text="Cantidad de tokens que se desea vender.")
    price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2, help_text="Precio total que el usuario está dispuesto para vender.")