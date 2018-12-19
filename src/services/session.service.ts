import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';
import { Session } from 'src/models/session';
import { activeSession, archiveSessions } from 'src/models/mock';
import {filter, map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient) { }

  /**
   * get active session
   */
  getActiveSession(): Observable<any> {
    return of(activeSession).pipe(map(val=>val.sessions.find(el => { return el.state == 'active' })))
    //return this.httpClient.get<any>(`${environment.apiUrl}/session`)
  }

  getSessions():Observable<any>{
    return of(archiveSessions).pipe(map(val=>val.sessions));
    //return this.httpClient.get<any>(`${environment.apiUrl}/session`)
  }


  /**
   * create new session
   * @param sessionId 
   */
  createSession(session: Session): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/session`, { session: session });
  }

  /**
   * delete all sessions
   */
  deleteAllSessions(): Observable<any> {
    return this.httpClient.delete<any>(`${environment.apiUrl}/session`);
  }

  /**
   * delete session by id
   * @param sessionId 
   */
  deleteSelectedSession(sessionId: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.apiUrl}/session/${sessionId}`);
  }
}
