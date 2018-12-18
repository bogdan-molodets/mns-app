import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private httpClient: HttpClient) { }


  getCurrentConfig(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/config`);
  }

  /**
   * create config
   * @param language 
   * @param email 
   */
  updateConfig(language: string, email: string): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/config`, { config: { language: language, email: email } });
  }
}
