from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib import admin

class User(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    full_name = models.CharField(max_length=150, blank=True, null=False)
    type_user = models.CharField(max_length=10,blank=False, default='Basic')
    total_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username

class League(models.Model):
    id_league = models.IntegerField(primary_key=True)  
    name = models.CharField(max_length=255)
    logo = models.URLField(max_length=500, blank=True, null=True) 
    country = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Match(models.Model):
    id_fixture = models.IntegerField(primary_key=True) 
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    date = models.DateTimeField()
    home_team = models.CharField(max_length=120)
    home_team_logo = models.URLField()  # O FileField
    away_team = models.CharField(max_length=120)
    away_team_logo = models.URLField()  # O FileField
    home_team_goals = models.IntegerField(null=True)
    away_team_goals = models.IntegerField(null=True)
    winner = models.CharField(max_length=120, null=True)
    match_status = models.CharField(max_length=100)
    home_odds = models.DecimalField(max_digits=15, decimal_places=2,null=True, blank=True,default=None)
    draw_odds = models.DecimalField(max_digits=15, decimal_places=2,null=True, blank=True,default=None)
    away_odds = models.DecimalField(max_digits=15, decimal_places=2,null=True, blank=True,default=None)

    def __str__(self):
        return f"{self.home_team} vs {self.away_team}"

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bet_type = models.CharField(max_length=20, choices=[
        ('simple', 'Simple'),
        ('combinada', 'Combinada'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    potential_gain = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('ganada', 'Ganada'),
        ('perdida', 'Perdida'),
        ('pendiente', 'Pendiente'),
    ],default='pendiente')
    

    def __str__(self):
        return f"{self.user.full_name} - {self.bet_type}"
    
    @property
    def details(self):
        return self.predictiondetail_set.all()  # Obtiene todos los detalles relacionados


class PredictionDetail(models.Model):
    prediction = models.ForeignKey(Prediction, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    prediction_text = models.CharField(max_length=255)
    selected_odds = models.DecimalField(max_digits=10, decimal_places=2)
    potential_gain = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('ganada', 'Ganada'),
        ('perdida', 'Perdida'),
        ('pendiente', 'Pendiente'),
    ],default='pendiente')

    def __str__(self):
        return f"{self.prediction} - {self.match}"


class ConfigModel(models.Model):
    clave = models.CharField(max_length=25)
    valor = models.CharField(max_length=10)

    def __str__(self):
        return self.clave
    

class Teams(models.Model):
    id = models.IntegerField(primary_key=True)  # ID del equipo (proporcionado por la API)
    name = models.CharField(max_length=100)  # Nombre del equipo
    country = models.CharField(max_length=100)  # País del equipo
    founded = models.IntegerField(null=True, blank=True)  # Año de fundación (opcional)
    national = models.BooleanField(default=False)  # Indica si es selección nacional
    logo = models.URLField(max_length=255, null=True, blank=True)  # URL del logo del equipo
    export = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Players(models.Model):
    id = models.AutoField(primary_key=True)  # ID del jugador
    name = models.CharField(max_length=255)
    age = models.IntegerField(null=True, blank=True) 
    number = models.IntegerField(null=True, blank=True)  # Número puede ser nulo
    position = models.CharField(max_length=50)
    photo = models.URLField(max_length=200)  # URL para la foto del jugador
    teams = models.ManyToManyField(Teams, related_name='players')  # Relación con Teams

    def __str__(self):
        return self.name




