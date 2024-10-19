import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  private API_USUARIOS = "http://localhost:3000/users"

  ////Leer - GET
  getUsuarios(): Observable<any> {
    return this.http.get(this.API_USUARIOS);
  }

  getUsuarioUnico(id: any): Observable<any> {
    return this.http.get(this.API_USUARIOS + "/" + id);
  }

  ////Editar - PUT
  putUsuario(usuarios: any): Observable<any> {
    return this.http.put(this.API_USUARIOS + "/" + usuarios.id, usuarios)
  }

  ////Eliminar - DELETE
  deleteUsuario(id: any): Observable<any> {
    return this.http.delete(this.API_USUARIOS + "/" + id);
  }

  getUserRole(): string | null {
    // Supongamos que el rol se guarda en sessionStorage
    return sessionStorage.getItem('role');
  }

  postUsers(user:any):Observable<any>{
    return this.http.post(this.API_USUARIOS,user)
  }

  // PARA LOGIN GUARDS
  private API_USERS = "http://localhost:3000/login";

  postUser(usuarios: any): Observable<any> {
    return this.http.post(this.API_USERS, usuarios)
  }
}
