import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { SessionService } from 'src/services/session.service';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { ConfigService } from 'src/services/config.service';
import { Observable } from 'rxjs';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentSession: Observable<any>;
  notification: string = '';
  targets: Promise<any>;// = [];
  archiveSessions: Observable<any>;
  selectedSessionId = '';
  openedSession: Observable<any>;

  constructor(private sessionService: SessionService,
    private monitoringService: MonitoringService,
    private targetService: TargetService,
    private configService: ConfigService) {
    //this.targets.push(new Target('s1',1,2,2,'ww','sd',0.2,0.9,0.8,'09-07-18'));
  }

  params = {
    x: null,
    y: null,
    z: null
  }
  target = {}
  ngOnInit() {
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('attach events', '.menu .item.sidebarToggle')
      ;
    $('.ui.dropdown')
      .dropdown()
      ;
    this.currentSession = this.sessionService.getActiveSession();
    this.openedSession = this.sessionService.getOpenedSession();
    this.notification = 'Активні сесії відсутні. Створіть нову або оберіть сесію з архіву.'
    $('.ui.modal.creator').modal({
      closable: false,
      onDeny: function () {
        console.log('deny');
      },
      onApprove: function () {
        $('.ui.modal.history').modal('hide');
      }
    });
    $('.ui.modal.history').modal({
      closable: false,
      onDeny: function () {
      },
      onApprove: function () {
      }
    });

    $('.ui.modal.notification').modal({
      closable: false,
      onDeny: function () {
        console.log('deny');
        $('.ui.modal.notification').modal('hide');
        $('.ui.modal.creator').modal('show');
      },
      onApprove: function () {
        console.log('ok');
        $('.ui.modal.notification').modal('hide');
        $('.ui.modal.history').modal('show');
      }
    })
    this.archiveSessions = this.sessionService.getSessions();
    this.currentSession.subscribe(res => {
      console.log(res);
      if (typeof res == 'undefined') {
        this.openedSession.subscribe(result=>{
          if (typeof result == 'undefined') {
            $('.ui.modal.notification').modal('show');
          }else{
            this.targets = this.getTargets(result.session_id);
            this.selectedSessionId = result.session_id;
          }
        })
      } else {
        this.targets = this.getTargets(res.session_id);
        this.selectedSessionId = res.session_id;
      }
    })
  }

  openModalArchive(){
    $('.ui.modal.history').modal('show');
  }

  selectSessionId(session_id){
    this.selectedSessionId = session_id;
  }

  openSession(){
    this.targets = this.getTargets(this.selectedSessionId)
    $('.ui.modal.history').modal('hide');
  }

  getCurrentSesion() {
    return new Promise((resolve, reject) => {
      resolve('Test');
    })
  }

  getTargets(session_id) {
    return new Promise((resolve, reject) => {
      //let tmp = [new Target('s1', 1, 2, 2, 'ww', 'sd', 0.2, 0.9, 0.8, '09-07-18')];
      this.targetService.getTargetList(session_id).then(res => {
        resolve(res.target);
      })

    })
  }

  getActiveSession() {
    // return new Promise((resolve, reject) => {
    //   this.sessionService.getSessions().then(res => {
    //     let activeSession = res.sessions.find(el => { return el.state == 'active' });      
    //     resolve(activeSession);
    //   });
    // })

  }


}
