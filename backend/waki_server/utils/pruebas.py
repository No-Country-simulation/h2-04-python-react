import http.client
import json

conn = http.client.HTTPSConnection("v3.football.api-sports.io")
headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "3340e6dc57da7cc7c941644d11f7ef1c"
    }

conn.request("GET", "/players/squads?team=1", headers=headers)


# Obtener la respuesta
res = conn.getresponse()
data = res.read()

# Decodificar los datos de la respuesta
decoded_data = data.decode("utf-8")

# Convertir los datos a formato JSON
json_data = json.loads(decoded_data)

# Guardar los datos en un archivo JSON
with open("player_profile.json", "w") as json_file:
    json.dump(json_data, json_file, indent=4)

print("Datos guardados en player_profile.json")