import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import bootstrap from '../../../main.server';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent {

  servicio = inject(UsuariosService)

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtroCedula: string = '';
  filtroRol: string = '';

  // Propiedades para el formulario
  id: any;
  name: string = '';
  lastname: string = '';
  cedula: string = '';
  telefono: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  ngOnInit(): void {
    this.servicio.getUsuarios().subscribe(u => {
      this.usuarios = u;
      this.usuariosFiltrados = u; // Inicialmente mostrar todos los usuarios
    });

    // Limpiar el formulario cuando el modal se cierra
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement?.addEventListener('hidden.bs.modal', () => {
      this.limpiarFormulario();
    });
  }

  filtrarUsuarios(): void {
    const cedula = this.filtroCedula.toLowerCase();
    const rol = this.filtroRol;

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const coincideCedula = cedula === '' || usuario.cedula?.toLowerCase().includes(cedula);
      const coincideRol = rol === '' || usuario.role === rol;
      return coincideCedula && coincideRol; // Solo mostrar usuarios que coincidan con ambos filtros
    });
  }

  // Guardar usuario (crear o editar)
  // Guardar usuario (crear o editar)
guardarUsuario(form: any) {
  let usuarioT = {
    id: this.id, // Usa el id para la edición
    name: form.value.name,
    lastname: form.value.lastname,
    cedula: form.value.cedula,
    telefono: form.value.telefono,
    email: form.value.email,
    password: form.value.password,
    role: form.value.role
  };

  if (this.id) { // Si hay un id, se está editando
    this.servicio.putUsuario(usuarioT).subscribe(response => {
      Swal.fire('Éxito', 'Editado correctamente', 'success').then(() => {
        this.limpiarFormulario();
        this.ngOnInit(); // Refrescar la lista de usuarios

        // Cerrar el modal
        const modalElement = document.getElementById('crearUsuarioModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement); // Obtiene la instancia del modal
          if (modal) {
            modal.hide(); // Cierra el modal
          }
        }
      });
    }, error => {
      Swal.fire('Error', 'No se pudo editar. Por favor, inténtelo de nuevo.', 'error');
    });
  } else { // Si no hay un id, se está creando
    this.servicio.postUsers(usuarioT).subscribe(response => {
      Swal.fire('Éxito', 'Registrado correctamente', 'success').then(() => {
        this.limpiarFormulario();
        this.ngOnInit(); // Refrescar la lista de usuarios

        // Cerrar el modal
        const modalElement = document.getElementById('crearUsuarioModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement); // Obtiene la instancia del modal
          if (modal) {
            modal.hide(); // Cierra el modal
          }
        }
      });
    }, error => {
      Swal.fire('Error', 'No se pudo registrar. Por favor, inténtelo de nuevo.', 'error');
    });
  }
}


  // Método para abrir el modal de edición y llenar los campos
  editar(usuario: any) {
    this.id = usuario.id; // Almacenar el id del usuario a editar
    this.name = usuario.name;
    this.lastname = usuario.lastname;
    this.cedula = usuario.cedula;
    this.telefono = usuario.telefono;
    this.email = usuario.email;
    this.password = ''; // No llenamos la contraseña por seguridad
    this.role = usuario.role;
  }

  // Limpiar el formulario
  limpiarFormulario() {
    this.id = null;
    this.name = '';
    this.lastname = '';
    this.cedula = '';
    this.telefono = '';
    this.email = '';
    this.password = '';
    this.role = '';
  }

  actualizarEmail() {
    if (this.name) {
      const apellidoPrimero = this.lastname.split(' ')[0]; // Toma solo la primera parte del apellido
      this.email = `${this.name.charAt(0).toLowerCase()}${apellidoPrimero.toLowerCase()}@sae.edu.com`;
    } else {
      this.email = ''; // Limpiar el email si no hay nombre
    }
  }

  actualizarPassword() {
    if (this.cedula) {
      this.password = `${this.cedula.toLowerCase()}`;
    } else {
      this.password = ''; // Limpiar el password si no hay nombre
    }
  }
  

  eliminar(id: any): void {
    // Mostrar mensaje de confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteUsuario(id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success').then(() => {
            this.ngOnInit(); // Refrescar la lista de usuarios
          });
        }, error => {
          Swal.fire('Error', 'Ocurrió un error al eliminar el usuario. Intenta de nuevo más tarde.', 'error');
        });
      }
    });
  }
}
