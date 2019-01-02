import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { SessionService } from 'src/services/session.service';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { ConfigService } from 'src/services/config.service';
import { Observable, interval, from } from 'rxjs';
import { repeatWhen, takeUntil, takeWhile } from 'rxjs/operators';
import { Config } from 'src/models/config';

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
  currentBTBuffer = {};
  targets;
  currentConfig: Config;
  configEmail;
  currentBT;
  currentBTDevices = [];
  isMonitoring: boolean = false;
  isGettingState: boolean = false;
  targetToUpdate: Target = null;
  state = "";
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
    //this.getBT();
    let that = this;
    /**$('.ui.checkbox').checkbox({
      onChecked: function () {
        that.currentBTBuffer = ''
      },
      onUnchecked: function () {
        that.currentBTBuffer = undefined
      }
    });**/
    $('.ui.dropdown')
      .dropdown()
      ;
    $('.right.menu .bt-devices')
      .popup({
        inline: true,
        hoverable: false,
        position: 'bottom right',
        on: 'click'
      })
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
    $('.ui.modal.warning').modal({
      closable: false,
      onDeny: function(){},
      onApprove: function(){}
    })
    this.sessionService.getSessions().subscribe(res => {
      this.archiveSessions = res;
      if (res.find(el => { return el.state == 'active' })) {
        this.currentSession = res.find(el => { return el.state == 'active' });
        this.selectedSessionId = this.currentSession.session_id;
        this.getTargets(this.currentSession.session_id).then(targets => {
          if (targets['length'] == 0) {
            this.initId = 100;
          } else {
            this.initId = +targets[targets['length'] - 1].target_id;
          }
          console.log(this.initId);
          this.targets = targets;

        });
        this.runExistingMonitoring();

      } else if (res.find(el => { return el.state == 'opened' })) {
        this.currentSession = res.find(el => { return el.state == 'opened' });
        this.selectedSessionId = this.currentSession.session_id;
        this.getTargets(this.currentSession.session_id).then(targets => {
          if (targets['length'] == 0) {
            this.initId = 100;
          } else {
            this.initId = +targets[targets['length'] - 1].target_id;
          }
          console.log(this.initId);
          this.targets = targets;

        });
      } else {
        $('.ui.modal.notification').modal('show');
      }
    });

    this.configService.getCurrentConfig().toPromise().then(config => {
      this.currentConfig = config;
      this.setBT();
      //this.configEmail = thi.email;
      console.log('get mail');
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

  checkDelta(target) {
    return Math.abs(target.dX) > Math.abs(this.currentSession.tolerance) || Math.abs(target.dY) > Math.abs(this.currentSession.tolerance) || Math.abs(target.dH) > Math.abs(this.currentSession.tolerance)
  }
  isEmpty(obj){
    return Object.keys(obj).length === 0;
  }
  selectBT(BTDevice, index) {
    //$('.ui.checkbox').checkbox('set unchecked');
    this.currentBTBuffer = {};
    let addr;
    addr = { adr: BTDevice.mac_addr, name: BTDevice.name };
    $(`.bt-devices-popup .ui.button`).removeClass('loading').removeClass('green').removeClass('red').addClass('blue');
    $(`#${index}`).removeClass('blue').addClass('loading').addClass('yellow');
    this.configService.selectBT(addr.adr).toPromise().then(bt => {
      if (bt.status == "Ok") {
        $(`#${index}`).removeClass('yellow').removeClass('loading').addClass('green');
        this.currentBTBuffer = bt;
        this.currentBTBuffer['name'] = BTDevice.name;
        this.currentBTBuffer['mac_addr'] = BTDevice.mac_addr;
        //console.log(`Buffer: ${this.currentBTBuffer}`)
      }else{
        $(`#${index}`).removeClass('yellow').removeClass('loading').addClass('red');
      }
    }, err=>{
      console.log('error');
      $(`#${index}`).removeClass('yellow').removeClass('loading').addClass('red');
    });      
    //this.configService.selectBT(addr.adr).toPromise().then(bt => {
    //  if (bt.status == "Ok") {
  }

  openModalArchive() {
    setTimeout(()=>{
      if(this.currentSession == undefined){
        $('.ui.modal.history').modal('show');
      }else{
        $('.ui.modal.warning').modal('show');
      }
    }, 2000)
    

  }

  closeBTPopup(){
    $('.right.menu .bt-devices').popup('hide');
  }

  openSessionCreation() {
    setTimeout(()=>{
      this.stopMonitoring();
      $('.ui.modal.creator').modal('show');
    }, 2000);
  }

  openMailCreation() {
    setTimeout(()=>{
      if ($("#alarmEmail").val() == "") {
        $("#alarmEmail").val(this.currentConfig.email);
      }
      $('.ui.modal.email').modal('show');
    }, 2000);
  }

  openModalEditSession() {
    $("#editDopusk").val(this.currentSession.tolerance);
    $('.ui.modal.edit.session').modal('show');
  }
  selectSessionId(session_id) {
    this.selectedSessionId = session_id;
  }

  editSession() {
    let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, this.currentSession.state, +$("#editDopusk").val());

    this.sessionService.updateSession(sessionUpdate).toPromise().then(update => {
      if (update.stauts = "Ok") {
        this.currentSession.tolerance = +$("#editDopusk").val();
      }

    })
  }

  editMail() {

    let updateConfig = new Config(this.currentConfig.bt_addr, this.currentConfig.bt_name, $("#alarmEmail").val(), "ua");
    this.configService.updateConfig(updateConfig).toPromise().then(config => {
      this.configService.getCurrentConfig().toPromise().then(config => {
        // console.log(config.email);
        this.currentConfig = config
        // this.configEmail = config.email;
        console.log('mail updated');
      });

    });
  }

  getBT() {
    $('.bt-devices-popup .ui.dimmer').addClass('active');
    this.configService.getBT().toPromise().then(bt => {
      $('.bt-devices-popup .ui.dimmer').removeClass('active');
      this.currentBTDevices = bt.bt_devices;
      console.log(this.currentBTDevices);
    },err=>{
      $('.bt-devices-popup .ui.dimmer').removeClass('active');
    });
  }

  setBT(bt?) {

    // let addr;
    // if (bt) {
    //   addr = { adr: bt.mac_addr, name: bt.name };
    // } else {
    //   addr = { adr: this.currentConfig.bt_addr, name: this.currentConfig.bt_name };
    // }
    // //  let addr = bt ? bt : { adr: this.currentConfig.bt_addr, name: this.currentConfig.bt_name }
    // this.configService.selectBT(addr.adr).toPromise().then(bt => {
    //   //this.currentBT = addr;
    //   if (bt.status == "Ok") {
    //     this.configService.updateConfig(new Config(addr.adr, addr.name, this.currentConfig.email, this.currentConfig.language)).toPromise().then(res => {
    //       console.log('config updated');
    //       if (res.status == "Ok") {
    //         this.configService.getCurrentConfig().toPromise().then(config => {
    //           this.currentConfig = config;
    //           //this.configEmail = thi.email;
    //           console.log('get mail');
    //         });
    //       }
    //     });
    //   }
    // });
    console.log(bt);
   let  addr = { adr: bt.mac_addr, name: bt.name };
    this.configService.updateConfig(new Config(addr.adr, addr.name, this.currentConfig.email, this.currentConfig.language)).toPromise().then(res => {
      this.currentBTBuffer = {}
      if (res.status == 'Ok'){
        this.configService.getCurrentConfig().toPromise().then(config => {
          this.currentConfig = config;
          console.log('get mail');
        })
      }

    }, err=>{
      this.currentBTBuffer = {}
    });
  }

  openOtherSession(){
    this.stopMonitoring()
    $('.ui.modal.history').modal('show');
  }

  openSession() {
    this.sessionService.getSessions().toPromise().then(result => {
      this.currentSession = result.find(el => { return el.session_id == this.selectedSessionId });
      let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "opened", this.currentSession.tolerance);

      this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
        console.log('update to opened');
        this.sessionService.getSessions().toPromise().then(res => {
          console.log('req on open');
          this.currentSession = res.find(el => { return el.session_id == this.selectedSessionId });
          this.selectedSessionId = this.currentSession.session_id;

          let opened = res.find(el => { return el.session_id != this.selectedSessionId && el.state == "opened" });
          if (opened) {
            let sessionUpdate = new Session(opened.session_id, opened.description, +opened.lat, +opened.lon, +opened.hgt, opened.timestamp, "string", opened.tolerance);
            this.sessionService.updateSession(sessionUpdate).toPromise().then(res => { });
          }

        });
      });
    })

    //this.targets = this.getTargets(this.selectedSessionId)
    this.getTargets(this.selectedSessionId).then(res => {
      if (res['length'] == 0) {
        this.initId = 100;
      } else {
        this.initId = +res[res['length'] - 1].target_id;
      }
      console.log(this.initId);
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
        this.isGettingState = false;
        this.state="";
        let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "opened", this.currentSession.tolerance);

        this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
          console.log('update to opened');
        });
      }
    })
  }
  runMonitoring() {

    this.monitoringService.runMonitoringProcess(this.selectedSessionId, this.currentConfig.bt_addr).toPromise().then(res => {
      if (res.status == 'Ok') {

        let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "active", this.currentSession.tolerance);

        this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
          console.log('update to active');
        });
        this.isGettingState = true;
        this.monitoringService.getMonitoringProcessState(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isGettingState)).subscribe(st => {
          this.state = st.state;
        });

        this.isMonitoring = true;
        this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
          this.targets = res;
        });
      }
    })
  }

  runExistingMonitoring() {
    let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "active", this.currentSession.tolerance);


    this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
      console.log('update to active');
      this.isGettingState = true;
      this.monitoringService.getMonitoringProcessState(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isGettingState)).subscribe(st => {
        this.state = st.state;
      });
      this.isMonitoring = true;
      this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
        this.targets = res;
      });
    });
  }

  addTarget() {

    this.targetService.createTarget(this.selectedSessionId, this.initId.toString(), new Target((++this.initId).toString(), this.params.x, this.params.y, this.params.h, this.params.ha, this.params.va, 0.0, 0.0, 0.0, "2018-12-19 16:56:22")).then(res => {
      if (res.status == 'Ok') {
        console.log('created');
        this.params.x = null;
        this.params.y = null;
        this.params.h = null;
        this.params.ha = null;
        this.params.va = null;

        this.getTargets(this.selectedSessionId).then(res => {
          this.targets = res;
        })

      }
    })
  }

  getCoordinates() {
    this.configService.getCoordinates(this.currentConfig.bt_addr).subscribe(res => {
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

  compare(a, b) {
    if (+a.session_id < +b.session_id)
      return -1;
    if (+a.session_id > +b.session_id)
      return 1;
    return 0;
  }


  createSession() {
    this.sessionService.getSessions().toPromise().then(res => {
      if (res['length'] == 0) {
        this.initSessionId = 10;
      } else {
        res.sort(this.compare);
        this.initSessionId = +res[res['length'] - 1].session_id;

      }

      let tmp = this.initSessionId + 1;
      let session = new Session(tmp.toString(), "string", 0, 0, 0, "12-12-12", "opened", +$("#dopusk").val());
      this.sessionService.createSession(session).toPromise().then(res => {
        this.targets = [];
        this.sessionService.getSessions().toPromise().then(res => {
          this.archiveSessions = res;
          console.log('req on create');
          this.currentSession = res.find(el => { return el.session_id == session.session_id });
          this.selectedSessionId = this.currentSession.session_id;
          let opened = res.find(el => { return el.session_id != this.selectedSessionId && el.state == "opened" });
          let sessionUpdate = new Session(opened.session_id, opened.description, +opened.lat, +opened.lon, +opened.hgt, opened.timestamp, "string", opened.tolerance);
          if (opened) {
            this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
              console.log('update to string in create');
            });
          }
        });
      });
    });

  }


}
