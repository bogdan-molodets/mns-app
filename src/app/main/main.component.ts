import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { SessionService } from 'src/services/session.service';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { ConfigService } from 'src/services/config.service';
import { Observable, interval, from } from 'rxjs';
import { repeatWhen, takeUntil, takeWhile } from 'rxjs/operators';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  initId: number = 101;
  initSessionId: number = 10;
  // currentSession: Observable<any>;
  notification: string = '';
  // targets: Promise<any>;
  // archiveSessions: Observable<any>;
  selectedSessionId = '';
  // openedSession: Observable<any>;
  currentSession;
  archiveSessions;
  targets;

  isMonitoring: boolean = false;
  targetToUpdate: Target = null;
  constructor(private sessionService: SessionService,
    private monitoringService: MonitoringService,
    private targetService: TargetService,
    private configService: ConfigService) {
    //this.targets.push(new Target('s1',1,2,2,'ww','sd',0.2,0.9,0.8,'09-07-18'));
  }

  params = {
    x: null,
    y: null,
    h: null,
    ha: null,
    va: null
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
    //this.currentSession = this.sessionService.getActiveSession();
    //this.openedSession = this.sessionService.getOpenedSession();

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
    this.sessionService.getSessions().subscribe(res => {
      this.archiveSessions = res;
      if (res.find(el => { return el.state == 'active' })) {
        this.currentSession = res.find(el => { return el.state == 'active' });
        this.selectedSessionId = this.currentSession.session_id;
        this.getTargets(this.currentSession.session_id).then(res => {
          this.targets = res;
        })
      } else if (res.find(el => { return el.state == 'opened' })) {
        this.currentSession = res.find(el => { return el.state == 'opened' });
        this.selectedSessionId = this.currentSession.session_id;
        this.getTargets(this.currentSession.session_id).then(res => {
          this.targets = res;
        })
      } else {
        $('.ui.modal.notification').modal('show');
      }
    });
    //this.archiveSessions = this.sessionService.getSessions();
    /**this.currentSession.subscribe(res => {
      console.log(res);
      if (typeof res == 'undefined') {
        this.openedSession.subscribe(result => {
          if (typeof result == 'undefined') {
            $('.ui.modal.notification').modal('show');
          } else {
            this.targets = this.getTargets(result.session_id);
            this.selectedSessionId = result.session_id;
          }
        })
      } else {
        this.targets = this.getTargets(res.session_id);
        this.selectedSessionId = res.session_id;
      }
    })**/
  }

  openModalArchive() {
    $('.ui.modal.history').modal('show');
  }

  selectSessionId(session_id) {
    this.selectedSessionId = session_id;
  }


  openSession() {
    this.sessionService.updateSession(this.selectedSessionId, "opened").toPromise().then(res => {
      console.log('update to opened');
      this.sessionService.getSessions().toPromise().then(res => {
        this.currentSession = res.find(el => { return el.session_id == this.selectedSessionId });
        this.selectedSessionId = this.currentSession.session_id;
      });
    });

    //this.targets = this.getTargets(this.selectedSessionId)
    this.getTargets(this.selectedSessionId).then(res => {
      if (res['length'] == 0) {
        this.initId = 100;
      } else {
        this.initId = +res[res['length'] - 1].target_id;
      }
      this.targets = res;
      $('.ui.modal.history').modal('hide');
    });

  }

  getCurrentSesion() {
    return new Promise((resolve, reject) => {
      resolve('Test');
    })
  }

  getTargets(session_id) {
    return new Promise((resolve, reject) => {
      //let tmp = [new Target('s1', 1, 2, 2, 'ww', 'sd', 0.2, 0.9, 0.8, '09-07-18')];
      this.targetService.getTargetList(session_id).toPromise().then(res => {
        resolve(res);
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

  stopMonitoring() {
    this.monitoringService.deleteMonitoringProcess(this.selectedSessionId).toPromise().then(res => {
      if (res.status == "Ok") {
        console.log("stopped");
        this.isMonitoring = false;
        this.sessionService.updateSession(this.selectedSessionId, "opened").toPromise().then(res => {
          console.log('update to opened');
        });
      }
    })
  }
  runMonitoring() {

    this.monitoringService.runMonitoringProcess(this.selectedSessionId).toPromise().then(res => {
      if (res.status == 'Ok') {
        this.sessionService.updateSession(this.selectedSessionId, "active").toPromise().then(res => {
          console.log('update to active');
        });
        this.isMonitoring = true;
        this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
          this.targets = res;
        });
      }
    })
  }

  runExistingMonitoring() {
    this.sessionService.updateSession(this.selectedSessionId, "active").toPromise().then(res => {
      console.log('update to active');
    });
    this.isMonitoring = true;
    this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
      this.targets = res;
    });
  }

  addTarget() {

    this.targetService.createTarget(this.selectedSessionId, this.initId.toString(), new Target((++this.initId).toString(), this.params.x, this.params.y, this.params.h, this.params.ha, this.params.va, 0.0, 0.0, 0.0, "2018-12-19 16:56:22")).then(res => {
      if (res.status == 'Ok') {
        console.log('created');
        this.getTargets(this.selectedSessionId).then(res => {
          this.targets = res;
        })

      }
    })
  }

  getCoordinates() {
    this.configService.getCoordinates().subscribe(res => {
      if (res.point.X) {
        this.params.x = res.point.X;
        this.params.y = res.point.Y;
        this.params.h = res.point.H;
        this.params.ha = res.point.HA;
        this.params.va = res.point.VA;
      }
    });
  }


  deleteTarget(target: Target) {
    this.targetService.deleteTarget(this.selectedSessionId, target.target_id, target).toPromise().then(res => {
      if (res.status == 'Ok') {
        console.log('deleted');
      }
    });
  }


  createSession(tolerance) {
    this.sessionService.getSessions().toPromise().then(res => {
      if (res['length'] == 0) {
        this.initSessionId = 10;
      } else {
        this.initSessionId = +res[res['length'] - 1].session_id;

      }
      let session = new Session((++this.initSessionId).toString(), "string", 0, 0, 0, "12-12-12", "opened", +$("#dopusk").val());
      this.sessionService.createSession(session).toPromise().then(res => {
        this.targets = [];
        this.sessionService.getSessions().toPromise().then(res => {
          this.currentSession = res.find(el => { return el.session_id == session.session_id });
          this.selectedSessionId = this.currentSession.session_id;
        });
      });
    });

  }


}
