# Generated by Django 4.2.16 on 2024-10-16 02:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_alter_match_away_team_goals_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bet_type', models.CharField(choices=[('simple', 'Simple'), ('combinada', 'Combinada')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='match',
            name='away_odds',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='draw_odds',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='home_odds',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.CreateModel(
            name='PredictionDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prediction_text', models.CharField(max_length=255)),
                ('selected_odds', models.DecimalField(decimal_places=2, max_digits=10)),
                ('potential_gain', models.DecimalField(decimal_places=2, max_digits=10)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.match')),
                ('prediction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.prediction')),
            ],
        ),
    ]
