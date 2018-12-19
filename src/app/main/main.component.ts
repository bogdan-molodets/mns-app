import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { SessionService } from 'src/services/session.service';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { ConfigService } from 'src/services/config.service';
import { Observable, interval } from 'rxjs';
import { repeatWhen, takeUntil, takeWhile } from 'rxjs/operators';

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
    z: null
  }
  target = {}
  ngOnInit() {
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('attach events', '.menu .item.sidebarToggle')
      ;

    this.currentSession = this.sessionService.getActiveSession();// this.getActiveSession();  
    this.targets = this.getTargets();
    this.notification = 'Активні сесії відсутні. Створіть нову або оберіть сесію з архіву.'
    $('.ui.modal.creator').modal({
      closable: false,
      onDeny: function () {
        console.log('deny');
        $('.ui.modal.creator').modal('hide');
        $('.ui.modal.notification').modal('show');
      },
      onApprove: function () {
        $('.ui.modal.history').modal('hide');
      }
    });
    $('.ui.modal.history').modal({
      closable: false,
      onDeny: function () {
        $('.ui.modal.history').modal('hide');
        $('.ui.modal.notification').modal('show');
      },
      onApprove: function () {
        $('.ui.modal.history').modal('hide');
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
    }).modal('show');
  }

  getCurrentSesion() {
    return new Promise((resolve, reject) => {
      resolve('Test');
    })
  }

  getTargets() {
    return new Promise((resolve, reject) => {
      //let tmp = [new Target('s1', 1, 2, 2, 'ww', 'sd', 0.2, 0.9, 0.8, '09-07-18')];
      this.targetService.getTargetList("123").then(res => {
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

  stopMonitoring() {
    this.monitoringService.deleteMonitoringProcess("123").toPromise().then(res => {
      if (res.status == "Ok") {
        console.log("stopped");
        this.isMonitoring = false;
      }
    })
  }
  runMonitoring() {
    this.monitoringService.runMonitoringProcess("123").toPromise().then(res => {
      if (res.status == 'Ok') {
        this.isMonitoring = true;
        this.monitoringService.getMonitoringProcessState("123").pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
          if (res.state == "alarm") {
            console.log("alarm");
          }
          console.log(res);
        })
      }
    })
  }

  runExistingMonitoring() {
    this.isMonitoring = true;
    this.monitoringService.getMonitoringProcessState("123").pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
      if (res.state == "alarm") {
        console.log("alarm");
      }
      console.log(res);
    })
  }

  addTarget() {
    if (this.targetToUpdate) {
      let updatedTarget = new Target(this.targetToUpdate.target_id,
        this.params.x,
        this.params.y,
        this.params.z,
        this.targetToUpdate.HA,
        this.targetToUpdate.VA,
        this.targetToUpdate.dX,
        this.targetToUpdate.dY,
        this.targetToUpdate.dH,
        this.targetToUpdate.last_upd);
      this.targetService.updateTarget("123", "1234", updatedTarget).toPromise().then(res => {
        if (res.status == 'Ok') {
          this.targetToUpdate = null;
          console.log('updated');
          this.params.x = "";
          this.params.y = "";
          this.params.z = "";
        }
      });
    } else {
      this.targetService.createTarget("123", "1234", new Target("124", this.params.x, this.params.y, this.params.z, "", "", 0, 0, 0, "12-12-12")).then(res => {
        if (res.status == 'Ok') {
          console.log('created');
        }
      })
    }
  }

  editTarget(target: Target) {
    this.targetToUpdate = target;
    this.params.x = target.X0;
    this.params.y = target.Y0;
    this.params.z = target.H0;
  }

  deleteTarget(target: Target) {
    this.targetService.deleteTarget("123", target.target_id, target).toPromise().then(res => {
      if (res.status == 'Ok') {
        console.log('deleted');
      }
    });
  }

}
