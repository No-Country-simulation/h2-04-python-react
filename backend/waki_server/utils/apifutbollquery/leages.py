import http.client
import json
import sqlite3

# Conectar a SQLite
db_conn = sqlite3.connect('futbol.db')
cursor = db_conn.cursor()

# Crear la tabla si no existe
cursor.execute('''CREATE TABLE IF NOT EXISTS league (
                    id_league INTEGER PRIMARY KEY,
                    name TEXT,
                    logo TEXT, 
                    country TEXT
                )''')

# Conexión HTTP para la API
conn = http.client.HTTPSConnection("v3.football.api-sports.io")

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "33e976d6787480b32a1208914e80d636"
}

conn.request("GET", "/leagues", headers=headers)

res = conn.getresponse()
data = res.read()

# Decodificar y convertir la respuesta a un diccionario JSON
data_json = json.loads(data.decode("utf-8"))

with open('leagues_data.txt', 'w') as json_file:
    json.dump(data_json, json_file, indent=4)  # Guardar el JSON con una sangría para legibilidad


# Recorrer los fixtures y guardar en la base de datos
for liga in data_json['response']:
    id_league = liga['league']['id']
    name = liga['league']['name']
    logo = liga['league']['logo']
    country = liga['country']['name']

    # Insertar los datos en la base de datos
    cursor.execute('''INSERT INTO league (id_league, name, logo, country)
                      VALUES (?, ?, ?, ?)''', 
                   (id_league,name, logo, country))

# Guardar los cambios
db_conn.commit()

# Cerrar la conexión a la base de datos
db_conn.close()
