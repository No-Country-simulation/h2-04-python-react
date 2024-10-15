# Generated by Django 4.2.16 on 2024-10-11 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0008_match"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="match",
            name="id",
        ),
        migrations.AddField(
            model_name="match",
            name="id_fixture",
            field=models.IntegerField(default=0, primary_key=True, serialize=False),
            preserve_default=False,
        ),
    ]