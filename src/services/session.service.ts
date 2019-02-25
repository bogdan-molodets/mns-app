import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';
import { Session } from 'src/models/session';
// import { activeSession, archiveSessions } from 'src/models/mock';
import { filter, map } from 'rxjs/operators';
import { sessions } from 'src/models/mock';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  apiUrl = "";
  constructor(private httpClient: HttpClient) {
    this.apiUrl= window.location.origin + '/api'; 
  }

  

  getSessions(): Observable<any> {
    //return of(sessions);
    return this.httpClient.get<any>(`${this.apiUrl}/session`);   
  }


  /**
   * create new session
   * @param sessionId 
   */
  createSession(session: Session): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/session`, session);
  }

  /**
   * delete all sessions
   */
  deleteAllSessions(): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/session`);
  }

  /**
   * delete session by id
   * @param sessionId 
   */
  deleteSelectedSession(sessionId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/session/${sessionId}`);
  }

  updateSession(session: Session): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/session/${session.session_id}`, session);
  }

  getHistoryFileUrl(sessionId: string) {    
    return `${this.apiUrl}/session/${sessionId}/history`;
  }
}
