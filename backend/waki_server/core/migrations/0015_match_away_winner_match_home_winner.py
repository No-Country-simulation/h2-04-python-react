# Generated by Django 4.2.16 on 2024-10-22 02:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_prediction_potential_gain_prediction_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='away_winner',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='home_winner',
            field=models.IntegerField(null=True),
        ),
    ]
