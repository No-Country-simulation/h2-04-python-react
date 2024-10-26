# Generated by Django 4.2.16 on 2024-10-26 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_players_assists_players_goals_players_matches_played_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='players',
            name='cards_red',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='cards_yellow',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='lastname',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='players',
            name='minutes',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='tokenizable',
            field=models.BooleanField(default=False),
        ),
    ]
