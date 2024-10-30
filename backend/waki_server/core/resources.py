from import_export import resources
from .models import Achievements, Players
from import_export.fields import Field
from django.core.exceptions import ObjectDoesNotExist

class AchievementsResource(resources.ModelResource):
    player = Field(attribute='player', column_name='player')  # Campo para el ID del jugador

    class Meta:
        model = Achievements
        fields = ('id','player', 'description', 'year', 'teams')  # Define los campos a importar/exportar
        import_id_fields = ('id',)

    def before_import_row(self, row, **kwargs):
        player_id = row.get('player')
        if player_id:
            try:
                # Busca el jugador en la base de datos por ID
                player = Players.objects.get(id=player_id)
                row['player'] = player  # Asigna la instancia del jugador a la fila
            except ObjectDoesNotExist:
                row['player'] = None  # Si no se encuentra, establece como None

    def import_obj(self, bundle, **kwargs):
        # Asegúrate de que el objeto a importar no tiene un ID asignado
        bundle.obj.id = None  # Resetea el ID para que Django genere uno nuevo
        return super().import_obj(bundle, **kwargs)