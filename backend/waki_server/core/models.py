from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib import admin

class User(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    full_name = models.CharField(max_length=150, blank=True, null=False)
    type_user = models.CharField(max_length=10,blank=False, default='Basic')
    total_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)#ver para cambiar
    rewards_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username

class League(models.Model):
    id_league = models.IntegerField(primary_key=True)  
    name = models.CharField(max_length=255)
    logo = models.URLField(max_length=500, blank=True, null=True) 
    country = models.CharField(max_length=255)
    confederacion = models.CharField(max_length=55)
    is_active = models.BooleanField(default=False)

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
    ranking = models.IntegerField(default=0)  # Ranking del club a nivel global
    league = models.ForeignKey(League, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
    
class Players(models.Model):
    id = models.AutoField(primary_key=True)  # ID del jugador
    name = models.CharField(max_length=255, blank=True)
    lastname = models.CharField(null=True, max_length=255)
    age = models.IntegerField(null=True, blank=True) 
    number = models.IntegerField(null=True, blank=True)  # Número puede ser nulo
    position = models.CharField(max_length=50)
    photo = models.URLField(max_length=200)  # URL para la foto del jugador
    teams = models.ManyToManyField(Teams, related_name='players')  # Relación con Teams
    height = models.CharField(max_length=25, blank=True)
    weight =  models.CharField(max_length=25, blank=True)
    matches_played = models.IntegerField(default=0)
    total_club_matches = models.IntegerField(default=0)
    rating = models.FloatField(default=0)  # Calificación del jugador
    goals = models.IntegerField(default=0)  # Goles marcados
    assists = models.IntegerField(default=0)  # Asistencias
    nationality = models.CharField(null=True, max_length=50)
    national_team_matches = models.IntegerField(default=0)  # Partidos con la selección
    national_team_ranking = models.IntegerField(default=0)  # Ranking FIFA de la selección
    trophies = models.TextField(default=0)  
    minutes = models.IntegerField(default=0)
    cards_yellow = models.IntegerField(default=0)
    cards_red = models.IntegerField(default=0)
    tokenizable = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.name or ''} {self.lastname or ''}"


class MonthlyRaffle(models.Model):
    LANGUAGE_CHOICES = [
        ('ES', 'Español'),
        ('EN', 'English'),
    ]

    LIGUE_CHOICES = [
        ('oro', 'Oro'),
        ('plata', 'Plata'),
        ('bronce', 'Bronce'),
        ]

    title = models.CharField(max_length=255)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='ES', verbose_name="Idioma")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    raffle_date = models.DateField(verbose_name="Fecha del Sorteo")
    image = models.ImageField(upload_to='raffles/', verbose_name="Imagen del Premio")
    ligue = models.CharField(max_length=15, choices=LIGUE_CHOICES)

    def __str__(self):
        return f"{self.title} - {self.raffle_date}"


