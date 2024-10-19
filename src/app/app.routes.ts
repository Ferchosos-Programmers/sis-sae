import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    {path:'usuarios', component: UsuariosComponent, canActivate:[ loginGuard], data:{role:'Administrador'}},
    {path:'cursos', component: CursosComponent,canActivate:[loginGuard], data:{role:['Administrador','Profesor']}},
    {path:'materias', component: MateriasComponent,canActivate:[loginGuard], data:{role:['Administrador','Alumno']}},
    {path:'login', component: LoginComponent,},

    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'**', component:Error404Component}
];
