import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { createRes, monitoringActive } from 'src/models/mock';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  apiUrl = "";
  constructor(private httpClient: HttpClient) {
    this.apiUrl= window.location.origin + '/api'; 
   }

  /**
   * get monitoring process state
   * @param sessionId 
   */
  getMonitoringProcessState(sessionId: string): Observable<any> {
    //return of(monitoringActive);
    return this.httpClient.get<any>(`${this.apiUrl}/session/${sessionId}/monprc`);
  }

  /**
   * run monitoring process
   * @param sessionId 
   */
  runMonitoringProcess(sessionId: string, mac_addr: string): Observable<any> {
    //return of(createRes);
    return this.httpClient.post<any>(`${this.apiUrl}/session/${sessionId}/monprc`, { mac_addr: mac_addr });
  }

  /**
   * update monitoring process
   * @param sessionId 
   * @param state 
   */
  updateMonitoringProcess(sessionId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/session/${sessionId}/monprc`, { state: state });
  }
  /**
   * delete monitoring process
   * @param sessionId 
   */
  deleteMonitoringProcess(sessionId: string): Observable<any> {
    //return of(createRes);
    return this.httpClient.delete<any>(`${this.apiUrl}/session/${sessionId}/monprc`);
  }





}
