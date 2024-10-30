from django.contrib import admin

from .models import User, League, Match, Prediction, PredictionDetail, ConfigModel, Teams, Players, MonthlyRaffle, Achievements


# Register your models here.

@admin.action(description="Poner en cero los puntos de los usuarios")
def reset_user_points(modeladmin, request, queryset):
    # Poner en cero los puntos de todos los usuarios seleccionados
    updated_count = queryset.update(total_points=0, rewards_points=0)

    # Mensaje de éxito
    modeladmin.message_user(request, f"Puntos de {updated_count} usuarios han sido puestos en cero.")


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'total_points', 'rewards_points', 'type_user')
    actions = [reset_user_points]  # Agrega la acción personalizada


class PlayersAdmin(admin.ModelAdmin):
    search_fields = ['name', 'lastname', 'teams__name'] 

class TeamsAdmin(admin.ModelAdmin):
    search_fields = ['name']

class LeagueAdmin(admin.ModelAdmin):
    search_fields = ['name']

admin.site.register(User, UserAdmin)
admin.site.register(League, LeagueAdmin)
admin.site.register(Match)
admin.site.register(Prediction)
admin.site.register(PredictionDetail)
admin.site.register(ConfigModel)
admin.site.register(Players, PlayersAdmin)
admin.site.register(Teams, TeamsAdmin)
admin.site.register(MonthlyRaffle)
admin.site.register(Achievements)