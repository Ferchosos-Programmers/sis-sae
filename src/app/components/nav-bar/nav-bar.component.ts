import { Component, inject, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  servicio = inject(UsuariosService);
  constructor(private router: Router, private cd: ChangeDetectorRef) {} // Inyecta ChangeDetectorRef

  token: string | null = null;
  ocultar: boolean = false;
  rol: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('token');
      this.ocultar = !!this.token; // Si hay un token, ocultar las ventanas
      this.rol = sessionStorage.getItem('role');
      this.cd.detectChanges(); // Fuerza la detección de cambios
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('redirectUrl');
      window.location.href=('login')
    }
  }
}
