import requests

# URL de login y la URL a la que necesitas hacer el GET
login_url = 'https://h2-04-python-react.onrender.com/api/token/'
get_url = 'https://h2-04-python-react.onrender.com/update-match/'

# Credenciales del usuario
login_data = {
    'username': 'admin',  # Reemplaza con tu usuario
    'password': 'admin' # Reemplaza con tu contraseña
}

# Hacer login y obtener el token
response = requests.post(login_url, json=login_data)

print(response.json())

if response.status_code == 200:
    # Suponiendo que el token viene en el campo 'token'
    token = response.json().get('access')

    if token:
        # Configurar los headers con el token
        headers = {
            'Authorization': f'Bearer {token}'
        }

        # Hacer el GET con el token incluido en los headers
        get_response = requests.get(get_url, headers=headers)

        if get_response.status_code == 200:
            print("Respuesta:", get_response.json())
        else:
            print(f"Error en el GET: {get_response.status_code}")
    else:
        print("No se recibió token en la respuesta de autenticación")
else:
    print(f"Error en el login: {response.status_code}")