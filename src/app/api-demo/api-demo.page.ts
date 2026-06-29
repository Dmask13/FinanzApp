import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService, Post } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-api-demo',
  templateUrl: './api-demo.page.html',
  styleUrls: ['./api-demo.page.scss'],
})
export class ApiDemoPage implements OnInit {

  // Lista de posts (READ)
  posts: Post[] = [];
  sinConexion = false;

  // Formulario CREATE
  nuevoTitulo = '';
  nuevoCuerpo = '';

  // Formulario UPDATE (edición inline)
  postEditando: Post | null = null;
  editTitulo = '';
  editCuerpo = '';

  // READ por ID
  buscarId: number = 1;
  postEncontrado: Post | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    await this.storage.init();
    await this.cargarPosts();
  }

  // ── READ: GET todos los posts ─────────────────────────────────
  async cargarPosts() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando posts...' });
    await loading.present();

    this.api.getPosts().subscribe({
      next: async (data) => {
        this.posts = data.slice(0, 10);
        this.sinConexion = false;
        await this.storage.set('cache_posts', this.posts);
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        this.sinConexion = true;
        // Sin conexión → mostrar datos almacenados (código de error / 404)
        const cached = await this.storage.get('cache_posts');
        this.posts = cached || [];
        if (this.posts.length > 0) {
          const a = await this.alertCtrl.create({
            header: 'Sin conexión',
            message: 'Mostrando datos almacenados previamente (modo offline).',
            buttons: ['OK'],
          });
          await a.present();
        }
      }
    });
  }

  // ── READ: GET por ID ──────────────────────────────────────────
  buscarPorId() {
    if (!this.buscarId) return;
    this.api.getPost(this.buscarId).subscribe({
      next: (data) => { this.postEncontrado = data; },
      error: async () => {
        this.postEncontrado = null;
        const a = await this.alertCtrl.create({
          header: 'No encontrado', message: `No existe el post #${this.buscarId}.`, buttons: ['OK']
        });
        await a.present();
      }
    });
  }

  // ── CREATE: POST ──────────────────────────────────────────────
  async crearPost() {
    if (!this.nuevoTitulo.trim() || !this.nuevoCuerpo.trim()) {
      const a = await this.alertCtrl.create({ header: 'Campos vacíos', message: 'Completa título y cuerpo.', buttons: ['OK'] });
      await a.present(); return;
    }

    const nuevoPost: Post = { title: this.nuevoTitulo, body: this.nuevoCuerpo, userId: 1 };
    this.api.createPost(nuevoPost).subscribe({
      next: async (data) => {
        this.posts.unshift(data);
        this.nuevoTitulo = '';
        this.nuevoCuerpo = '';
        const a = await this.alertCtrl.create({
          header: '✅ Post creado',
          message: `Post #${data.id} creado correctamente vía POST.`,
          buttons: ['OK']
        });
        await a.present();
      },
      error: async () => {
        const a = await this.alertCtrl.create({ header: 'Error', message: 'No se pudo crear el post.', buttons: ['OK'] });
        await a.present();
      }
    });
  }

  // ── UPDATE: PUT ───────────────────────────────────────────────
  iniciarEdicion(post: Post) {
    this.postEditando = post;
    this.editTitulo = post.title;
    this.editCuerpo = post.body;
  }

  cancelarEdicion() {
    this.postEditando = null;
    this.editTitulo = '';
    this.editCuerpo = '';
  }

  guardarEdicion() {
    if (!this.postEditando?.id) return;
    const postActualizado: Post = {
      ...this.postEditando,
      title: this.editTitulo,
      body: this.editCuerpo
    };
    this.api.updatePost(this.postEditando.id, postActualizado).subscribe({
      next: async (data) => {
        // Actualizar en la lista local
        const idx = this.posts.findIndex(p => p.id === data.id);
        if (idx !== -1) this.posts[idx] = data;
        this.cancelarEdicion();
        const a = await this.alertCtrl.create({
          header: '✅ Post actualizado',
          message: `Post #${data.id} modificado correctamente vía PUT.`,
          buttons: ['OK']
        });
        await a.present();
      },
      error: async () => {
        const a = await this.alertCtrl.create({ header: 'Error', message: 'No se pudo actualizar el post.', buttons: ['OK'] });
        await a.present();
      }
    });
  }

  // ── DELETE ────────────────────────────────────────────────────
  async eliminarPost(id: number) {
    const confirm = await this.alertCtrl.create({
      header: 'Eliminar post',
      message: `¿Eliminar el post #${id}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.api.deletePost(id).subscribe({
              next: async () => {
                this.posts = this.posts.filter(p => p.id !== id);
                const a = await this.alertCtrl.create({
                  header: '✅ Eliminado', message: `Post #${id} eliminado vía DELETE.`, buttons: ['OK']
                });
                await a.present();
              },
              error: () => {}
            });
          }
        }
      ]
    });
    await confirm.present();
  }

  volver() { this.router.navigate(['/home']); }
}
