from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib import admin
from django.db.models import F, Sum, F, DecimalField, ExpressionWrapper
from decimal import Decimal
from django.db.models.functions import Coalesce

class User(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    full_name = models.CharField(max_length=150, blank=True, null=False)
    type_user = models.CharField(max_length=10,blank=False, default='Basic')
    total_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)#ver para cambiar
    rewards_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username
    
    @classmethod
    def calculate_points_thresholds(cls):
        # Filtrar usuarios con al menos 1 punto
        users_with_points = cls.objects.annotate(
            total_user_points=F('total_points') + F('rewards_points')
        ).filter(total_user_points__gt=0)

        user_count = users_with_points.count()

        if user_count == 0:
            return {
                "bronze_min": 0,
                "bronze_max": 0,
                "silver_min": 0,
                "silver_max": 0,
                "gold_min": 0,
                "gold_max": 0
            }
        
        # Obtener todos los puntos y ordenarlos
        points_list = sorted([usuario.total_user_points for usuario in users_with_points])

        # Calcular el índice para los umbrales
        one_third_index = user_count // 3
        two_third_index = one_third_index * 2

        # Definir umbrales
        bronze_min = points_list[0]
        bronze_max = points_list[one_third_index - 1] if one_third_index > 0 else points_list[0]

        silver_min = points_list[one_third_index]
        silver_max = points_list[two_third_index - 1] if two_third_index > one_third_index else points_list[one_third_index]

        gold_min = points_list[two_third_index]
        gold_max = points_list[-1]

        return {
            "bronze_min": bronze_min,
            "bronze_max": bronze_max,
            "silver_min": silver_min,
            "silver_max": silver_max,
            "gold_min": gold_min,
            "gold_max": gold_max
        }


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
    photo_tokens = models.URLField(max_length=250, blank=True)  # URL para la foto del jugador
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

class Achievements(models.Model):
    id = models.AutoField(primary_key=True) 
    player = models.ForeignKey(Players, on_delete=models.CASCADE)
    description = models.CharField(max_length=155) 
    year = models.CharField(max_length=100, null=True, blank=True)
    teams = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.description} - {self.year}"
    

class Token(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)  # Usuario que posee el token
    player = models.ForeignKey(Players, on_delete=models.PROTECT)
    year = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación del token
    is_burned = models.BooleanField(default=False)  # Estado del token (si ha sido quemado o no)

    class Meta:
        verbose_name = "Token"
        verbose_name_plural = "Tokens"

    def __str__(self):
        return f"Token {self.id} - {self.player.name} {'Burned' if self.is_burned else 'Available'}"