import http.client
import json
import sqlite3

# Conectar a SQLite
db_conn = sqlite3.connect('futbol.db')
cursor = db_conn.cursor()

# Crear la tabla si no existe
cursor.execute('''CREATE TABLE IF NOT EXISTS fixtures (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_fixture INTEGER,
                    date TEXT,
                    league TEXT,
                    home_team TEXT,
                    away_team TEXT
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


# Recorrer los fixtures y guardar en la base de datos
for fixture in data_json['response']:
    id_fixture = fixture['fixture']['id']
    date = fixture['fixture']['date']
    league = fixture['league']['name']
    home = fixture['teams']['home']['name']
    away = fixture['teams']['away']['name']

    # Insertar los datos en la base de datos
    cursor.execute('''INSERT INTO fixtures (id_fixture, date, league, home_team, away_team)
                    VALUES (?, ?, ?, ?, ?)''', 
                    (id_fixture, date, league, home, away))

# Guardar los cambios
db_conn.commit()

# Cerrar la conexión a la base de datos
db_conn.close()
