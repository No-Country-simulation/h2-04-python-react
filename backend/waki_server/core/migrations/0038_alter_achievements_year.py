# Generated by Django 4.2.16 on 2024-10-30 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0037_achievements_teams'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievements',
            name='year',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
