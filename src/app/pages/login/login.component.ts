import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  servicio = inject(UsuariosService);
  email: any;
  password: any;
  token: any;

  login(formulario: any) {
    this.servicio.postUser(formulario.value).subscribe(u => {
      this.token = u.accessToken; // Asegúrate de que la API retorna el accessToken
  
      if (this.token) {
        sessionStorage.setItem('token', this.token); // Almacena el token
        sessionStorage.setItem('role', u.user.role); // Almacena el rol del usuario
        
        // Almacena la URL de redirección según el rol
        let redirectUrl = '/home'; // URL por defecto
        const rol = u.user.role; // Obtén el rol del usuario
  
        if (rol === 'Administrador') {
          redirectUrl = '/usuarios'; // Redirige a la página de usuarios
        } else if (rol === 'Profesor') {
          redirectUrl = '/cursos'; // Redirige a la página de cursos
        } else if (rol === 'Alumno') {
          redirectUrl = '/materias'; // Redirige a la página de materias
        }

        sessionStorage.setItem('redirectUrl', redirectUrl); // Almacena la URL de redirección
        window.location.href = redirectUrl; // Redirige a la página correspondiente
      }
    }, error => {
      console.error('Error al iniciar sesión:', error); // Maneja el error aquí
    });
  }
}
