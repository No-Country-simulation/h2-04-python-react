# Generated by Django 4.2.16 on 2024-10-11 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_user_profile_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="phone",
            field=models.CharField(blank=True, max_length=15, null=True, unique=True),
        ),
    ]
