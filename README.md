# FinanzApp – PGY4221

## Ejecutar la app
```bash
npm install
ionic serve
```
Usuarios de prueba: `admin / 1234` | `juan01 / 4321`

## json-server (Semana 5)
Para simular la API local con el archivo `db.json`:
```bash
npm install -g json-server
json-server --watch db.json
```
API disponible en: `http://localhost:3000/posts`

## Stack
- Ionic 7 + Angular 17
- @ionic/storage-angular (SQLite en dispositivo / IndexedDB en web)
- HttpClient + JSONPlaceholder
- Leaflet (mapa OpenStreetMap)
- Geolocalización nativa del navegador
