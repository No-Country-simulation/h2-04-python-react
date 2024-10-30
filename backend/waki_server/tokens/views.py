from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import Players, Token
from .serializers import PlayerSerializer
from utils.tokens import calculate_total_token_burn 
from rest_framework import status
from django.db import transaction, models
from utils.apiresponse import ApiResponse

class PlayerTokenBurnAPIView(APIView):
    def get(self, request, year):
        try:
            # Obtener todos los jugadores que son tokenizables
            players = Players.objects.filter(tokenizable=True)
            user_count = players.count()  # Total de jugadores tokenizables
            
            if user_count == 0:
                return ApiResponse.error(
                    message="No hay jugadores para procesar.",
                    error_code="NO_PLAYERS_FOUND",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            total_burned_tokens = 0  # Acumular tokens quemados
            print(f"Total de jugadores tokenizables: {user_count}")

            for player in players:
                # Calcular los tokens quemados para el jugador
                burn_tokens = calculate_total_token_burn(player)
                print(f"Jugador: {player.name}, Tokens quemados: {burn_tokens}")

                # Si el año es 2022, crear 10,000 tokens
            
                tokens_to_create = 10000
                
                # Crear los tokens en una transacción para mejorar la eficiencia
                with transaction.atomic():
                    tokens = [
                        Token(user=None, player=player, year=year)  # Crea tokens sin usuario
                        for _ in range(tokens_to_create)
                    ]
                    Token.objects.bulk_create(tokens)  # Crear todos los tokens a la vez

                # Calcular cuántos tokens se queman usando el porcentaje de `burn_tokens`
                tokens_to_burn_count = int(tokens_to_create * (burn_tokens / 100))  # Usamos el porcentaje calculado

                # Marcar los tokens como quemados (solo los primeros tokens_to_burn_count)
                for token in Token.objects.filter(player=player, year=year).order_by('id')[:tokens_to_burn_count]:
                    token.is_burned = True
                    token.save()
                    total_burned_tokens += 1  # Acumular la cantidad de tokens quemados

            return ApiResponse.success(
                data={
                    "total_burned_tokens": total_burned_tokens,
                    "message": f"{user_count} jugadores procesados para el año {year}."
                }
            )

        except Exception as e:
            return ApiResponse.error(
                message="Error procesando los tokens de los jugadores.",
                error_code="PROCESSING_ERROR",
                description=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class PlayerStatisticsAPIView(APIView):
    def get(self, request):
        # Obtener estadísticas de los tokens por jugador
        players_statistics = []

        tokens = Token.objects.values('player_id').annotate(
            total_tokens=models.Count('id'),
            burned_tokens=models.Count('id', filter=models.Q(is_burned=True)),
            token_assign=models.Count('id', filter=models.Q(user__isnull=False))
        )

        if not tokens:  # Comprobar si no hay tokens
            return ApiResponse.error(
                message="No se encontraron registros de tokens.",
                error_code="NO_TOKEN_RECORDS",
                status_code=status.HTTP_404_NOT_FOUND
            )

        for token in tokens:
            price = 10000 / (10000 - token['burned_tokens'])
            player = Players.objects.get(id=token['player_id'])  # Obtiene el jugador usando el ID
            players_statistics.append({
                'player_id': token['player_id'],
                'player_name': player.name,
                'player_last_name': player.lastname,
                'token_assign': token['token_assign'],
                'total_tokens': token['total_tokens'],
                'burned_tokens': token['burned_tokens'],
                'price': price
            })

        # Ordenar por precio en orden descendente
        players_statistics = sorted(players_statistics, key=lambda x: x['price'], reverse=True)

        # Dividir en terciles para asignar categorías
        total_players = len(players_statistics)
        tercile_size = total_players // 3

        # Asignar categorías
        for i, player in enumerate(players_statistics):
            if i < tercile_size:
                player['category'] = 'Gold'
            elif i < tercile_size * 2:
                player['category'] = 'Silver'
            else:
                player['category'] = 'Bronze'

        return ApiResponse.success(data=players_statistics)