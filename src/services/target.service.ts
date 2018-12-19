import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';
import { Target } from 'src/models/target';
import { createRes, targets, target } from 'src/models/mock';
@Injectable({
  providedIn: 'root'
})
export class TargetService {

  constructor(private httpClient: HttpClient) { }

  /**
   * create new target
   * @param sessionId 
   * @param targetId 
   */
  createTarget(sessionId: string, targetId: string, target: Target): Promise<any> { 
    return this.httpClient.post<any>(`${environment.apiUrl}/session/${sessionId}/target`, target ).toPromise();
  }

  /**
   * get list of targets by session id
   * @param sessionId 
   */
  getTargetList(sessionId: string): Promise<any> {   
    return this.httpClient.get<any>(`${environment.apiUrl}/session/${sessionId}/target`).toPromise();
  }

  /**
   * get one target info
   * @param sessionId 
   * @param targetId 
   */
  getTargetState(sessionId: string, targetId: string): Observable<any> {
    return of(target);
   // return this.httpClient.get(`${environment.apiUrl}/session/${sessionId}/target/${targetId}`);
  }

  /**
   * update target
   * @param sessionId 
   * @param targetId 
   * @param target new Target object
   */
  updateTarget(sessionId: string, targetId: string, target: Target): Observable<any> {
    return of(createRes);
    //return this.httpClient.put<any>(`${environment.apiUrl}/session/${sessionId}/target/${targetId}`, { target: target });
  }

  /**
   * delete target
   * @param sessionId 
   * @param targetId 
   * @param target 
   */
  deleteTarget(sessionId: string, targetId: string, target: Target): Observable<any> {
   
    return this.httpClient.delete<any>(`${environment.apiUrl}/session/${sessionId}/target/${targetId}`);
    //return this.httpClient.request('delete', `${environment.apiUrl}/session/${sessionId}/target/${targetId}`, { body: target });
  }




}
