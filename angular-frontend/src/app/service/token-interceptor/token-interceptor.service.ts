import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('access_token');

    // Si le token existe, cloner la requête et ajouter le header Authorization
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // Transmettre la requête clonée avec le token
      return next.handle(cloned);
    } else {
      // Si pas de token, transmettre la requête sans modification
      return next.handle(req);
    }
  }
}
