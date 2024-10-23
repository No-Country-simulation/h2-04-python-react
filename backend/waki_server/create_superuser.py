import os
import django

# Configura el entorno de Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "waki_server.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    username = "admin"  # Cambia el nombre de usuario si lo deseas
    email = "admin@example.com"  # Cambia la dirección de correo si lo deseas
    password = "admin"  # Cambia la contraseña si lo deseas

    if not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(username=username, email=email, password=password)
        user.save()  # Guarda el superusuario
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_superuser()