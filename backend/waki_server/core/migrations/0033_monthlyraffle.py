# Generated by Django 4.2.16 on 2024-10-28 17:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_players_nationality'),
    ]

    operations = [
        migrations.CreateModel(
            name='MonthlyRaffle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('language', models.CharField(choices=[('ES', 'Español'), ('EN', 'English')], default='ES', max_length=2, verbose_name='Idioma')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('raffle_date', models.DateField(verbose_name='Fecha del Sorteo')),
                ('image', models.ImageField(upload_to='raffles/', verbose_name='Imagen del Premio')),
                ('ligue', models.CharField(choices=[('ES', 'Español'), ('EN', 'English')], max_length=15)),
            ],
        ),
    ]
