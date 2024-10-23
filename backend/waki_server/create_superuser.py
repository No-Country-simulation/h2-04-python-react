import os
import django
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'waki_server.settings')
django.setup()

# Cambia estos valores según tu configuración
username = 'admin'
email = 'admin@example.com'
password = 'admin'

call_command('createsuperuser', interactive=False, username=username, email=email, password=password)