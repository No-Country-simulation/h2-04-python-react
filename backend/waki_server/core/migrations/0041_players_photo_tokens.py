# Generated by Django 4.2.16 on 2024-11-01 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0040_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='players',
            name='photo_tokens',
            field=models.URLField(blank=True, max_length=250),
        ),
    ]
