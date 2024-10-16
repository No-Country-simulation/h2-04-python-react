from django.contrib import admin

from .models import User, League, Match, Prediction, PredictionDetail
# Register your models here.

admin.site.register(User)
admin.site.register(League)
admin.site.register(Match)
admin.site.register(Prediction)
admin.site.register(PredictionDetail)