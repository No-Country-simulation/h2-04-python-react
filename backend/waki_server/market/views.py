from rest_framework import viewsets, status
from rest_framework.response import Response
from core.models import Order, Token, Players, User
from .serializers import OrderSerializer, BuyTokenSerializer, BuyTokenSerializer
from django.db import transaction
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Count


#metodo para validar match de ordenes
def match_order(new_order):
    # Definir el tipo de orden opuesto y construir el filtro de precio dinámicamente
    opposite_type = 'sell' if new_order.order_type == 'buy' else 'buy'
    price_filter = {'price__lte': new_order.price} if new_order.order_type == 'buy' else {'price__gte': new_order.price}
    
    # Aplicar los filtros dinámicos en la consulta
    matching_orders = Order.objects.filter(
        token_name=new_order.token_name,
        order_type=opposite_type,
        status='open',
        **price_filter  # Aquí se aplica el filtro de precio de forma dinámica
    ).order_by('price' if new_order.order_type == 'buy' else '-price', 'created_at')
    
    for opposite_order in matching_orders:
        transaction_quantity = min(new_order.quantity, opposite_order.quantity)

        # Actualizar cantidades de las órdenes
        new_order.quantity -= transaction_quantity
        opposite_order.quantity -= transaction_quantity

        # Transferir tokens entre usuarios
        buyer = new_order.user if new_order.order_type == 'buy' else opposite_order.user
        seller = opposite_order.user if new_order.order_type == 'buy' else new_order.user

        with transaction.atomic():
            # Transferir propiedad de los tokens
            tokens_to_transfer = Token.objects.filter(
                player__token_name=new_order.token_name, user=seller, is_in_order=True
            )[:transaction_quantity]
            
            for token in tokens_to_transfer:
                token.user = buyer
                token.is_in_order = False  # Marcar el token como no en orden
                token.save()

            # Marcar órdenes como completadas si se completan
            if opposite_order.quantity == 0:
                opposite_order.status = 'completed'
                opposite_order.save()

            if new_order.quantity == 0:
                new_order.status = 'completed'
                new_order.save()
                break  # Salir si la orden actual se completa
    new_order.save()


###ESTO ES EL GET PARA TRAER LOS TOKENS QUE ESTAN EN ORDENES
@extend_schema(
        parameters=[
            OpenApiParameter('token_name', str, OpenApiParameter.QUERY, description="Nombre del token a filtrar"),
            OpenApiParameter('user', str, OpenApiParameter.QUERY, description="Filtrar órdenes por usuario"),
        ]
    )
class OrdenViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    
    def get_queryset(self):
        queryset = Order.objects.all()
        token_name = self.request.query_params.get('token_name', None)
        user_r = self.request.query_params.get('user', None)
        if user_r:
            user = User.objects.get(id=user_r)
            if user.is_authenticated:
                queryset = queryset.filter(user=user)

        if token_name:
            queryset = queryset.filter(token_name=token_name)

        return queryset



#para vender un token de mi propiedad
class SellTokenViewSet(viewsets.ViewSet):
    serializer_class = BuyTokenSerializer
    def create(self, request):
        user = request.user
        token_name = request.data.get('token_name')
        quantity = request.data.get('quantity')
        price = request.data.get('price')

        # Verifica si el token existe y la cantidad que el usuario tiene
        try:
            player = Players.objects.get(token_name=token_name)
            tokens = Token.objects.filter(player=player,user=user,is_in_order=False)
            count_my_tokens = tokens.count()
            if count_my_tokens < quantity:
                return Response({"error": "No tienes suficientes tokens para vender."}, status=status.HTTP_400_BAD_REQUEST)

            tokens_to_sell = tokens[:quantity]
            order = Order.objects.create(user=user, token_name=token_name, quantity=quantity, price=price,order_type = 'sell')

            order.save()

            for token in tokens_to_sell:
                token.is_in_order = True
                token.save()
            match_order(order)

            return Response({"message": "Tokens generados en orden exitosamente."}, status=status.HTTP_200_OK)

        except Token.DoesNotExist:
            return Response({"error": "Token no encontrado."}, status=status.HTTP_404_NOT_FOUND)


#esto es para comprar un tokens
class BuyTokenViewSet(viewsets.ViewSet):
    serializer_class = BuyTokenSerializer
    def create(self, request):
        user = request.user
        token_name = request.data.get('token_name')
        quantity = request.data.get('quantity')
        price = request.data.get('price')

        # Validar que se proporcionaron todos los datos necesarios
        if not token_name or quantity is None or price is None:
            return Response({"error": "Se requiere token_name, quantity y price."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Buscar el jugador por el nombre del token
            player = Players.objects.get(token_name=token_name)

            # Obtener todos los tokens asociados a este jugador
            tokens = Token.objects.filter(player=player)

            # Validar que hay tokens disponibles
            if not tokens.exists():
                return Response({"error": "No hay tokens disponibles para este jugador."}, status=status.HTTP_404_NOT_FOUND)

            # Crear la orden de compra
            order = Order.objects.create(user=user, token_name=token_name, quantity=quantity, price=price,order_type = 'buy')


            order.save()
            match_order(order)

            return Response({"message": "Orden Creada exitosamente"}, status=status.HTTP_200_OK)

        except Players.DoesNotExist:
            return Response({"error": "Jugador no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class UserTokensViewSet(viewsets.ViewSet):
    """
    Endpoint para obtener la cantidad y tipo de tokens que posee el usuario autenticado,
    incluyendo los que están en órdenes.
    """

    def list(self, request):
        user = request.user

        # Filtra los tokens que pertenecen al usuario y agrupa por aquellos que están o no en orden
        tokens_in_possession = Token.objects.filter(user=user, is_in_order=False).values(
            'player__token_name', 'player__id'
        ).annotate(count=Count('id'))
        
        tokens_in_order = Token.objects.filter(user=user, is_in_order=True).values(
            'player__token_name', 'player__id'
        ).annotate(in_order_count=Count('id'))

        # Crear un diccionario para almacenar la información de los tokens
        token_info = {}

        # Añadir los tokens en posesión al diccionario
        for token in tokens_in_possession:
            player_id = token['player__id']
            token_info[player_id] = {
                "player_id": player_id,
                "token_name": token['player__token_name'],
                "quantity": token['count'],
                "in_order": 0  # Inicialmente en 0, si se encuentra en la otra consulta se actualizará
            }

        # Añadir los tokens en órdenes al diccionario o actualizar la información existente
        for token in tokens_in_order:
            player_id = token['player__id']
            if player_id in token_info:
                token_info[player_id]["in_order"] = token['in_order_count']
            else:
                token_info[player_id] = {
                    "player_id": player_id,
                    "token_name": token['player__token_name'],
                    "quantity": 0,  # No posee tokens fuera de orden
                    "in_order": token['in_order_count']
                }

        # Convertir el diccionario a una lista para la respuesta
        response_data = list(token_info.values())
        
        return Response(response_data, status=status.HTTP_200_OK)
