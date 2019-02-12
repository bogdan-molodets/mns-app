import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config, bt, wifi, ips } from 'src/models/mock';
import { Config } from 'src/models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = "";
  constructor(private httpClient: HttpClient) {
    this.apiUrl = window.location.origin + '/api';
  }


  getCurrentConfig(): Observable<any> {
    return of(config)
    // return this.httpClient.get<any>(`${this.apiUrl}/config`);
  }

  getBT(): Observable<any> {
    return of(bt)
    // return this.httpClient.get<any>(`${this.apiUrl}/BT`);
  }

  selectBT(mac_addr: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/BT`, { mac_addr: mac_addr });
  }

  /**
   * create config
   * @param language 
   * @param email 
   */
  updateConfig(config: Config): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/config`, config);
  }

  getCoordinates(mac_adr: string, target: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/TS/${mac_adr}/${target}/data`);
  }

  getConnections(): Observable<any> {
    return of(wifi);
    //return this.httpClient.get(`${this.apiUrl}/network/wifi`);
  }

  connect(password: any, ssid: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/network/wifi`, { key: password, ssid: ssid });
  }
  disconnect() {
    return this.httpClient.delete<any>(`${this.apiUrl}/network/wifi`)
  }

  getIp(): Observable<any> {
    return of(ips);
    //return this.httpClient.get(`${this.apiUrl}/network/ifconfig`);
  }

  shutdownSystem(): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/system/shutdown`, {});
  }

}
