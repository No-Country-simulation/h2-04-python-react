from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    full_name = models.CharField(max_length=150, blank=True, null=False)
    type_user = models.CharField(max_length=10,blank=False, default='Basic')
    total_points = models.IntegerChoices()




    def __str__(self):
        return self.username
    
