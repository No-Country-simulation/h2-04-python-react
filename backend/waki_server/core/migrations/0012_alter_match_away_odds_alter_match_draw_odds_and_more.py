# Generated by Django 4.2.16 on 2024-10-16 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_prediction_alter_match_away_odds_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='away_odds',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='draw_odds',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='home_odds',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
