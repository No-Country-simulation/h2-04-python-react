# Generated by Django 4.2.16 on 2024-10-22 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_match_winner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='winner',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
