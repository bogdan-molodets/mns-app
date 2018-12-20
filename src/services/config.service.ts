import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/models/mock';
import { Config } from 'src/models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private httpClient: HttpClient) { }


  getCurrentConfig(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/config`);
  }

  getBT(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/BT`);
  }

  selectBT(mac_addr: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/BT`, {}, { params: { mac_addr: mac_addr } });
  }

  /**
   * create config
   * @param language 
   * @param email 
   */
  updateConfig(config: Config): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/config`, { config: config });
  }

  getCoordinates(mac_adr:string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/TS/${mac_adr}/data`);
  }
}
