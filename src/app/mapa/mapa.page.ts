import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

declare const L: any;  // Leaflet

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, OnDestroy {

  latitud: number | null = null;
  longitud: number | null = null;
  precision: number | null = null;
  errorGeo = '';
  private map: any = null;
  private marker: any = null;
  private watchId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.iniciarMapa();
    this.iniciarGeolocalizacion();
  }

  ionViewWillLeave() {
    // Al salir del page, dejar de obtener ubicación
    this.detenerGeolocalizacion();
    if (this.map) { this.map.remove(); this.map = null; }
  }

  ngOnDestroy() { this.detenerGeolocalizacion(); }

  iniciarMapa() {
    if (this.map) return;
    // Santiago de Chile como posición inicial
    this.map = L.map('mapa-container').setView([-33.4489, -70.6693], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  iniciarGeolocalizacion() {
    if (!navigator.geolocation) {
      this.errorGeo = 'Geolocalización no disponible en este dispositivo.';
      return;
    }
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.latitud = pos.coords.latitude;
        this.longitud = pos.coords.longitude;
        this.precision = Math.round(pos.coords.accuracy);
        this.errorGeo = '';
        this.actualizarMarcador();
      },
      (err) => {
        this.errorGeo = `Error de geolocalización: ${err.message}`;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  actualizarMarcador() {
    if (!this.map || !this.latitud || !this.longitud) return;
    const pos = [this.latitud, this.longitud];
    if (this.marker) {
      this.marker.setLatLng(pos);
    } else {
      this.marker = L.marker(pos).addTo(this.map)
        .bindPopup('📍 Tu ubicación actual').openPopup();
    }
    this.map.setView(pos, 15);
  }

  detenerGeolocalizacion() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  volver() { this.router.navigate(['/home']); }
}
