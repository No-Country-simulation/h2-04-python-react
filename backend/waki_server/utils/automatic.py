import requests
import time

login_url = 'https://h2-04-python-react.onrender.com/api/token/'
get_url = 'https://h2-04-python-react.onrender.com/update-match/'

login_data = {
    'username': 'admin',
    'password': 'admin'
}

while True:
    response = requests.post(login_url, json=login_data)
    if response.status_code == 200:
        token = response.json().get('access')
        if token:
            headers = {'Authorization': f'Bearer {token}'}
            get_response = requests.get(get_url, headers=headers)
            if get_response.status_code == 201:
                print("Respuesta:", get_response.json())
            else:
                print(f"Error en el GET: {get_response.status_code}")
        else:
            print("No se recibió token en la respuesta de autenticación")
    else:
        print(f"Error en el login: {response.status_code}")

    # Esperar 5 minutos (300 segundos) antes de volver a ejecutar
    time.sleep(1500)