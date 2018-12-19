import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';
import { Session } from 'src/models/session';
import { activeSession } from 'src/models/mock';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Retrieve a list of existing monitoring sessions
   */
  getSessions(): Promise<any> {
    return of(activeSession).toPromise();
    //return this.httpClient.get<any>(`${environment.apiUrl}/session`);
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
