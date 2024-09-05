import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  transform(url : any): Observable<any> {
      return this.http
          .get(url, { responseType: 'blob' })
          .pipe(
            map(
              ((val : any) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)))
              )
          );
  }

}
