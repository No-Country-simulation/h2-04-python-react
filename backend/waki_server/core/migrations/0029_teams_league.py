# Generated by Django 4.2.16 on 2024-10-26 04:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0028_alter_players_height_alter_players_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='teams',
            name='league',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.league'),
        ),
    ]
