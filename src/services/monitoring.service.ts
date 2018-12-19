import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {

  constructor(private httpClient: HttpClient) { }

  /**
   * get monitoring process state
   * @param sessionId 
   */
  getMonitoringProcessState(sessionId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/session/${sessionId}/monprc`);
  }

  /**
   * run monitoring process
   * @param sessionId 
   */
  runMonitoringProcess(sessionId: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/session/${sessionId}/monprc`, {});
  }

  /**
   * update monitoring process
   * @param sessionId 
   * @param state 
   */
  updateMonitoringProcess(sessionId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.apiUrl}/session/${sessionId}/monprc`, { state: state });
  }
  /**
   * delete monitoring process
   * @param sessionId 
   */
  deleteMonitoringProcess(sessionId: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.apiUrl}/session/${sessionId}/monprc`);
  }





}