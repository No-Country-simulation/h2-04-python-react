# Generated by Django 4.2.16 on 2024-10-24 21:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_teams_export_alter_user_total_points'),
    ]

    operations = [
        migrations.AddField(
            model_name='players',
            name='assists',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='goals',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='matches_played',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='national_team_matches',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='national_team_ranking',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='rating',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='total_club_matches',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='players',
            name='trophies',
            field=models.TextField(default=0),
        ),
        migrations.AddField(
            model_name='teams',
            name='confederation',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='teams',
            name='ranking',
            field=models.IntegerField(default=0),
        ),
    ]
