# Generated by Django 4.2.16 on 2024-10-26 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0027_players_height_players_weight'),
    ]

    operations = [
        migrations.AlterField(
            model_name='players',
            name='height',
            field=models.CharField(blank=True, default=1, max_length=25),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='players',
            name='weight',
            field=models.CharField(blank=True, default=1, max_length=25),
            preserve_default=False,
        ),
    ]