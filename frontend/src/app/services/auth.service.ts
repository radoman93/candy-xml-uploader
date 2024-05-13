import {Injectable} from '@angular/core';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = '/auth/login';  // URL to backend login endpoint
  private getAllFilesUrl = '/upload/files'
  private uploadFileUrl = '/upload'

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    const body = {username, password};
    return this.http.post<any>(this.loginUrl, body);
  }

  getFiles(): Observable<any> {
    return this.http.get<any>(this.getAllFilesUrl);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.uploadFileUrl, formData);
  }


}
