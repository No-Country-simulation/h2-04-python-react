from django.contrib import admin

from .models import User, League, Match, Prediction, PredictionDetail, ConfigModel, Teams, Players
# Register your models here.


class PlayersAdmin(admin.ModelAdmin):
    search_fields = ['name']  # Campos que quieres que sean buscables

class TeamsAdmin(admin.ModelAdmin):
    search_fields = ['name']


admin.site.register(User)
admin.site.register(League)
admin.site.register(Match)
admin.site.register(Prediction)
admin.site.register(PredictionDetail)
admin.site.register(ConfigModel)
admin.site.register(Players, PlayersAdmin)
admin.site.register(Teams, TeamsAdmin)