import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  
  // Verificar si estamos en un entorno de navegador
  if (typeof window === 'undefined') {
    return false; // Si no estamos en un entorno de navegador, retornar false
  }

  const token = sessionStorage.getItem('token');  // Obtener token
  const userRole = sessionStorage.getItem('role'); // Obtener rol del usuario

  // Verificar si el token existe
  if (!token) {
    const router = inject(Router);
    router.navigate(['/login']); // Redirigir a login si no hay token
    return false;
  }

  // Obtener los roles permitidos para la ruta
  const expectedRoles = route.data['role']; // Usamos 'role' (singular)
  
  // Verificar si el rol es un array o un string
  if (Array.isArray(expectedRoles)) {
    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }
  } else if (userRole === expectedRoles) {
    return true;
  }

  // Si el rol no coincide, redirigir a la URL almacenada en sessionStorage
  const router = inject(Router);
  const redirectUrl = sessionStorage.getItem('redirectUrl') || '/home'; // URL por defecto si no hay redirección
  router.navigate([redirectUrl]); // Redirigir a la URL correspondiente
  return false;
};
