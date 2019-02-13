import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';
import { Target } from 'src/models/target';
import {  targets, } from 'src/models/mock';
@Injectable({
  providedIn: 'root'
})
export class TargetService {
  apiUrl = "";
  constructor(private httpClient: HttpClient) {
    this.apiUrl= window.location.origin + '/api';  
  }

  /**
   * create new target
   * @param sessionId 
   * @param targetId 
   */
  createTarget(sessionId: string, targetId: string, target: Target): Promise<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/session/${sessionId}/target`, target).toPromise();
  }

  /**
   * get list of targets by session id
   * @param sessionId 
   */
  getTargetList(sessionId: string): Observable<any> {
    //return of(targets)
    return this.httpClient.get<any>(`${this.apiUrl}/session/${sessionId}/target`);
  }

  /**
   * get one target info
   * @param sessionId 
   * @param targetId 
   */
  getTargetState(sessionId: string, targetId: string): Observable<any> {
    return of(null);
    // return this.httpClient.get(`${environment.apiUrl}/session/${sessionId}/target/${targetId}`);
  }

  /**
   * update target
   * @param sessionId 
   * @param targetId 
   * @param target new Target object
   */
  updateTarget(sessionId: string, targetId: string, target: Target): Observable<any> {
    return of(null);
    //return this.httpClient.put<any>(`${environment.apiUrl}/session/${sessionId}/target/${targetId}`, { target: target });
  }

  /**
   * delete target
   * @param sessionId 
   * @param targetId 
   * @param target 
   */
  deleteTarget(sessionId: string, targetId: string, target: Target): Observable<any> {

    return this.httpClient.delete<any>(`${this.apiUrl}/session/${sessionId}/target/${targetId}`);
    //return this.httpClient.request('delete', `${environment.apiUrl}/session/${sessionId}/target/${targetId}`, { body: target });
  }




}
