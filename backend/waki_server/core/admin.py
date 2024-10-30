from django.contrib import admin

from .models import User, League, Match, Prediction, PredictionDetail, ConfigModel, Teams, Players, MonthlyRaffle, Achievements, Token
from django.contrib import messages
from .resources import AchievementsResource
from import_export.admin import ImportExportModelAdmin
# Register your models here.

@admin.action(description="Poner en cero los puntos de los usuarios")
def reset_user_points(modeladmin, request, queryset):
    # Poner en cero los puntos de todos los usuarios seleccionados
    updated_count = queryset.update(total_points=0, rewards_points=0)

    # Mensaje de éxito
    modeladmin.message_user(request, f"Puntos de {updated_count} usuarios han sido puestos en cero.")

@admin.register(Achievements)
class AchievementsAdmin(ImportExportModelAdmin):
    resource_class = AchievementsResource
    list_display = ('player', 'description', 'year', 'teams')  # Campos a mostrar en la lista


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'total_points', 'rewards_points', 'type_user')
    actions = [reset_user_points]  # Agrega la acción personalizada


class PlayersAdmin(admin.ModelAdmin):
    search_fields = ['name', 'lastname', 'teams__name'] 

class TeamsAdmin(admin.ModelAdmin):
    search_fields = ['name']

class LeagueAdmin(admin.ModelAdmin):
    search_fields = ['name']


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'player', 'year', 'created_at', 'is_burned')
    search_fields = ['player__name', 'year']
    actions = ['delete_all_tokens']

    list_filter = ('is_burned',)
    
    def delete_all_tokens(self, request, queryset):
        # Asegúrate de que el usuario quiere borrar todos los registros

        count, _ = Token.objects.all().delete()  # Borrar todos los registros de Token
        self.message_user(request, f"{count} registros de Token han sido eliminados.")
        return None
    delete_all_tokens.short_description = "Eliminar todos los tokens"

admin.site.register(User, UserAdmin)
admin.site.register(League, LeagueAdmin)
admin.site.register(Match)
admin.site.register(Prediction)
admin.site.register(PredictionDetail)
admin.site.register(ConfigModel)
admin.site.register(Players, PlayersAdmin)
admin.site.register(Teams, TeamsAdmin)
admin.site.register(MonthlyRaffle)
