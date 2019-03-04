import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { SessionService } from 'src/services/session.service';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { ConfigService } from 'src/services/config.service';
import { Observable, interval, from, Subscription } from 'rxjs';
import { repeatWhen, takeUntil, takeWhile, timeout, take } from 'rxjs/operators';
import { Config } from 'src/models/config';
import { TargetType } from 'src/models/types';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  showPasswordInput = false;
  initId: number = 101;
  initSessionId: number = 10;
  notification: string = '';
  selectedSessionId = '';
  selectedSessionIdDelete = '';
  selectedSessionIdExport = '';
  lastMonitoringData = [];
  currentConn;
  symbols = ['$', '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '.'];
  alphabetUa = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ї', 'ф', 'і', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'є', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'];
  alphabetEn = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
  alphabets = {
    'UA': this.alphabetUa,
    'EN': this.alphabetEn
  }
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  numberPattern = '[0-9]{3}$'
  realNumberPattern = '[0]{1}+\.[0-9]{4,5}$'
  defaultControl = new FormControl('', Validators.required);
  emailControl = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
  smtpControl = new FormControl('', [Validators.required, Validators.pattern(this.numberPattern)]);
  descriptionControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]);
  deltaControl = new FormControl(0.01, [Validators.required, Validators.min(0.001), Validators.max(0.9)]);
  userForm: FormGroup;
  sessionForm: FormGroup;
  sessionEditorForm: FormGroup;
  wifiPasswordForm: FormGroup;
  keyboardSettings = {
    id: null,
    multipleLanguage: true,
    caretPosition: 0,
    isShift: false,
    currentAlphabet: '',
    isNumber: false,
    isRealNumber: false,
    currentControl: this.defaultControl,
    resetValue: ''
  };
  connectBT = false;
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
  monprcStateSubscription: Subscription;
  targetMonprcSubscription: Subscription;

  connections: any[] = [];
  ips: any[] = [];
  constructor(private sessionService: SessionService,
    private monitoringService: MonitoringService,
    private targetService: TargetService,
    private configService: ConfigService,
    private deviceService: DeviceDetectorService) {
    this.initForm();
    //this.targets.push(new Target('s1',1,2,2,'ww','sd',0.2,0.9,0.8,'09-07-18'));
  }

  params = {
    x: null,
    y: null,
    h: null,
    ha: null,
    va: null,
    type: 'prism'
  }
  target = {}
  ngOnInit() {
    // init semantic elements
    this.configService.getIp().toPromise().then(ips => {
      if (ips.status === 'Ok') {
        this.ips = ips.if_list;
      }
    });
    $('.message .close')
      .on('click', function () {
        $(this)
          .closest('.message')
          .transition('fade')
          ;
      })
      ;
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('attach events', '.menu .item.sidebarToggle');

    $('.ui.dropdown')
      .dropdown();
    $('.right.menu .bt-devices')
      .popup({
        inline: true,
        hoverable: false,
        position: 'bottom right',
        on: 'click'
      });
    $('.right.menu .bt-wifi')
      .popup({
        inline: true,
        hoverable: false,
        position: 'bottom right',
        on: 'click'
      });
    $('.ui.modal.creator').modal({
      allowMultiple: true,
      closable: false,
      onDeny: function () {
        console.log('deny');
      },
      onApprove: function () {
        $('.ui.modal.history').modal('hide');
      }
    });
    $('.ui.modal.email').modal({
      allowMultiple: true
    });
    $('.ui.modal.keyboard').modal({
      allowMultiple: true,
      closable: false,
      onDeny: function () {
      },
      onApprove: function () {
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
    });
    $('.ui.modal.warning').modal({
      closable: false,
      onDeny: function () { },
      onApprove: function () { }
    });
    $('.ui.modal.close').modal({
      closable: false,
      onDeny: function () { },
      onApprove: function () { }
    });
    $('.ui.modal.delete').modal({
      closable: false,
      onDeny: function () { },
      onApprove: function () { }
    });
    $('.ui.modal.confirm').modal({
      closable: false,
      onDeny: function () { },
      onApprove: function () { }
    });
    $('.ui.modal.export').modal({
      closable: false,
      onDeny: function () { },
      onApprove: function () { }
    });
    //////////////
    this.notification = 'Активні сесії відсутні. Створіть нову або оберіть сесію з архіву.'
    this.sessionService.getSessions().subscribe(res => {
      this.archiveSessions = res;
      // open active session and run monitoring
      if (res.find(el => { return el.state == 'active' || el.state == 'monitoring' })) {
        let session = res.find(el => { return el.state == 'active' || el.state == 'monitoring' });
        // get config
        this.configService.getCurrentConfig().toPromise().then(config => {
          this.currentConfig = config;
        });
        this.activateSession(session);
        this.runExistingMonitoring();
      } else {
        // open opened session and update targets table
        if (res.find(el => { return el.state == 'opened' })) {
          let session = res.find(el => { return el.state == 'opened' });
          this.activateSession(session);
          this.updateTargetsTable();
        } else {
          $('.ui.modal.notification').modal('show');
        }
        // get config and connect to BT
        this.configService.getCurrentConfig().toPromise().then(config => {
          this.currentConfig = config;
          this.configService.selectBT(this.currentConfig.bt_addr).toPromise().then(bt => {
            if (bt.status == "Ok") {
              this.connectBT = true;
            }
          }, err => { this.connectBT = false; });
        });
      }
    });

    this.activeSessionSearch();


  }

  initForm() {
    this.userForm = new FormGroup({
      alarmEmail: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      mailServer: new FormControl('', Validators.required),
      mailPort: new FormControl('', [Validators.required, Validators.pattern(this.numberPattern)]),
      mailLogin: new FormControl('', Validators.required),
      mailPassword: new FormControl('', Validators.required)
    });
    this.sessionForm = new FormGroup({
      dopusk: new FormControl(0.01, [Validators.required, Validators.min(0.001), Validators.max(0.9)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
    });
    this.sessionEditorForm = new FormGroup({
      dopusk: new FormControl(0.01, [Validators.required, Validators.min(0.001), Validators.max(0.9)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
    });
    this.wifiPasswordForm = new FormGroup({ password: new FormControl('', [Validators.maxLength(100), Validators.minLength(8), Validators.required]) });
  }

  changeTargetType(type) {
    let index = TargetType.findIndex((el) => { return el == type });
    this.params.type = TargetType[(index + 1 < TargetType.length) ? index + 1 : 0]
  }

  checkDelta(target) {
    return Math.abs(target.dX) > Math.abs(this.currentSession.tolerance) || Math.abs(target.dY) > Math.abs(this.currentSession.tolerance) || Math.abs(target.dH) > Math.abs(this.currentSession.tolerance)
  }
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /**
   * try to connect clicked BT device from BT devices list. set selected bt to buffer
   * @param BTDevice 
   * @param index 
   */
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
      } else {
        $(`#${index}`).removeClass('yellow').removeClass('loading').addClass('red');
      }
    }, err => {
      console.log('error');
      $(`#${index}`).removeClass('yellow').removeClass('loading').addClass('red');
    });

  }

  openModalArchive() {
    setTimeout(() => {
      if (this.currentSession == undefined) {
        $('.ui.modal.history').modal('show');
      } else {
        $('.ui.modal.warning').modal('show');
      }
    }, 2000)


  }

  closeBTPopup() {
    $('.right.menu .bt-devices').popup('hide');
  }

  closeWifiPopup() {
    $('.right.menu .bt-wifi').popup('hide');
  }

  openSessionCreation() {
    setTimeout(() => {
      $('.ui.modal.creator').modal('show');
    }, 2000);
  }

  /**
   * update mail form
   */
  openMailCreation() {
    setTimeout(() => {
      this.configService.getCurrentConfig().toPromise().then(config => {
        this.currentConfig = config;
        console.log(this.currentConfig);
        if (this.currentConfig && this.currentConfig.email) {

          /*$("#alarmEmail").val(this.currentConfig.email);
          $("#mailServer").val(this.currentConfig.MAIL_SERVER);
          $("#mailPort").val(this.currentConfig.MAIL_PORT);
          $("#mailLogin").val(this.currentConfig.MAIL_USERNAME);
          $("#mailPassword").val(this.currentConfig.MAIL_PASSWORD);
          $("#mailSsl").prop("checked", this.currentConfig.MAIL_USE_SSL);
          $("#mailTls").prop("checked", this.currentConfig.MAIL_USE_TLS);*/
          this.userForm.controls.alarmEmail.setValue(this.currentConfig.email);
          this.userForm.controls.mailServer.setValue(this.currentConfig.MAIL_SERVER);
          this.userForm.controls.mailPort.setValue(this.currentConfig.MAIL_PORT);
          this.userForm.controls.mailLogin.setValue(this.currentConfig.MAIL_USERNAME);
          this.userForm.controls.mailPassword.setValue(this.currentConfig.MAIL_PASSWORD);
          $("#mailSsl").prop("checked", this.currentConfig.MAIL_USE_SSL);
          $("#mailTls").prop("checked", this.currentConfig.MAIL_USE_TLS);
        }
        $('.ui.modal.email').modal('show');
      });

    }, 2000);
  }

  /**
   * update session edit form in modal
   */
  openModalEditSession() {
    //$("#editDopusk").val(this.currentSession.tolerance);
    //$("#editDescription").val(this.currentSession.description);
    this.sessionEditorForm.controls.dopusk.setValue(this.currentSession.tolerance);
    this.sessionEditorForm.controls.description.setValue(this.currentSession.description);
    console.log(this.sessionEditorForm);
    $('.ui.modal.edit.session').modal('show');
  }

  /**
   * set selected session id from archive dropdown
   * @param session_id string
   */
  selectSessionId(session_id) {
    this.selectedSessionId = session_id;
  }

  /**
   * update session req and set updated session values to html
   */
  editSession() {
    let sessionUpdate = new Session(this.currentSession.session_id, $("#editDescription").val(), +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, this.currentSession.state, +$("#editDopusk").val());

    this.sessionService.updateSession(sessionUpdate).toPromise().then(update => {
      if (update.status == "Ok") {
        this.currentSession.tolerance = +$("#editDopusk").val();
        this.currentSession.description = $("#editDescription").val();
      }

    })
  }

  /**
   * update email req
   */
  editMail() {
    let updateConfig = new Config(this.currentConfig.bt_addr,
      this.currentConfig.bt_name,
      $("#alarmEmail").val(),
      "ua",
      $("#mailPassword").val(),
      +$("#mailPort").val(),
      $("#mailServer").val(),
      $("#mailLogin").val(),
      $("#mailSsl").is(':checked'),
      $("#mailTls").is(':checked'));
    this.configService.updateConfig(updateConfig).toPromise().then(config => {
      this.configService.getCurrentConfig().toPromise().then(config => {
        // console.log(config.email);
        this.currentConfig = config
        // this.configEmail = config.email;
        console.log('mail updated');
      });

    });
  }

  /**
   * get list of available BT devices
   */
  getBT() {
    $('.bt-devices-popup .ui.dimmer').addClass('active');
    this.configService.getBT().toPromise().then(bt => {
      $('.bt-devices-popup .ui.dimmer').removeClass('active');
      this.currentBTDevices = bt.bt_devices;
      console.log(this.currentBTDevices);
    }, err => {
      $('.bt-devices-popup .ui.dimmer').removeClass('active');
    });
  }

  /**
   * update config with selected BT
   * @param bt 
   */
  setBT(bt?) {
    console.log(bt);
    let addr = { adr: bt.mac_addr, name: bt.name };
    this.configService.updateConfig(new Config(addr.adr,
      addr.name,
      this.currentConfig.email,
      this.currentConfig.language,
      this.currentConfig.MAIL_PASSWORD,
      this.currentConfig.MAIL_PORT,
      this.currentConfig.MAIL_SERVER,
      this.currentConfig.MAIL_USERNAME,
      this.currentConfig.MAIL_USE_SSL,
      this.currentConfig.MAIL_USE_TLS)).toPromise().then(res => {
        this.currentBTBuffer = {}
        if (res.status == 'Ok') {
          this.connectBT = true;
          this.configService.getCurrentConfig().toPromise().then(config => {
            this.currentConfig = config;
          })
        }

      }, err => {
        this.currentBTBuffer = {}
      });
  }

  openOtherSession() {
    $('.ui.modal.history').modal('show');
  }

  /**
   * get session by selected id and update it's state to opened. Find another opened session and update it status to string. Start targets table update
   * get targets list
   */
  openSession() {
    $('.ui.selection.dropdown').dropdown('clear');
    this.sessionService.getSessions().toPromise().then(result => {
      if (result.find(el => { return el.state == 'active' })) {
        console.log('can\'t open! session is active');
        $('.ui.modal.history').modal('hide');
      } else {
        this.currentSession = result.find(el => { return el.session_id == this.selectedSessionId });

        let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "opened", this.currentSession.tolerance);

        this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
          console.log('update to opened');
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
            this.updateTargetsTable();
          });
          this.sessionService.getSessions().toPromise().then(res => {
            console.log('req on open');
            this.currentSession = res.find(el => { return el.session_id == this.selectedSessionId });
            this.selectedSessionId = this.currentSession.session_id;
            // this.targetsSubscription.unsubscribe();
            let opened = res.find(el => { return el.session_id != this.selectedSessionId && el.state == "opened" });
            if (opened) {
              let sessionUpdate = new Session(opened.session_id, opened.description, +opened.lat, +opened.lon, +opened.hgt, opened.timestamp, "string", opened.tolerance);
              this.sessionService.updateSession(sessionUpdate).toPromise().then(res => { });
            }

          });
        });
      }
    })



  }


  getTargets(session_id) {
    return new Promise((resolve, reject) => {
      this.targetService.getTargetList(session_id).toPromise().then(res => {
        resolve(res);
      })

    })
  }

  updateTargetsTable() {
    // if (this.targetsSubscription) {
    //   this.targetsSubscription.unsubscribe();
    // }
    // this.targetsSubscription = 
    this.targetService.getTargetList(this.selectedSessionId).toPromise().then(res => {
      this.targets = res;
    });
  }
  /**
   * stop monitoring process and getting monitoring process state. Updates session from active to opened.
   */
  stopMonitoring() {
    this.monitoringService.deleteMonitoringProcess(this.selectedSessionId).toPromise().then(res => {
      if (res.status == "Ok") {
        $(`.target-table tr`).removeClass('updated');
        $('.startWaiting').removeClass('active');
        console.log("stopped");
        let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "opened", this.currentSession.tolerance);

        this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
          console.log('update to opened');
          this.isMonitoring = false;
          this.isGettingState = false;
        });

        this.updateTargetsTable();
        this.state = "";
        if (this.targetMonprcSubscription && this.monprcStateSubscription) {
          this.targetMonprcSubscription.unsubscribe();
          this.monprcStateSubscription.unsubscribe();
        }


      }
    })
  }

  stopExistingMonitoring() {
    $(`.target-table tr`).removeClass('updated');
    $('.startWaiting').removeClass('active');
    console.log("stopped");
    let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "opened", this.currentSession.tolerance);
    this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
      console.log('update to opened');
      this.isMonitoring = false;
      this.isGettingState = false;
    });
    this.updateTargetsTable();
    this.state = "";
    if (this.targetMonprcSubscription && this.monprcStateSubscription) {
      this.targetMonprcSubscription.unsubscribe();
      this.monprcStateSubscription.unsubscribe();
    }

  }

  /**
   * start monitoring process, getting its state,updating targets array. Updates session state from opened to active
   */
  runMonitoring() {
    $('.startWaiting').addClass('active');
    $('.calcTarget.errors').removeClass('visible');
    if (this.connectBT != true) {
      this.configService.selectBT(this.currentConfig.bt_addr).toPromise().then(bt => {
        if (bt.status == "Ok") {
          this.connectBT = true;
          this.monitoringProcess();
        }
      }, err => {
        this.connectBT = false;
        $('.startWaiting').removeClass('active');
      });
    } else {
      this.monitoringProcess();

    }
  }

  monitoringProcess() {
    // check if there are started sessions 
    this.monitoringService.runMonitoringProcess(this.selectedSessionId, this.currentConfig.bt_addr).toPromise().then(res => {
      console.log('init monprc');
      if (res.status == 'Ok') {

        let sessionUpdate = new Session(this.currentSession.session_id, this.currentSession.description, +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "active", this.currentSession.tolerance);

        this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
          console.log('update to active');
          this.isGettingState = true;
          if (this.targetMonprcSubscription && this.monprcStateSubscription) {
            this.targetMonprcSubscription.unsubscribe();
            this.monprcStateSubscription.unsubscribe();
          }
          this.lastMonitoringData = Object.assign(this.lastMonitoringData, this.targets)
          this.monprcStateSubscription = this.monitoringService.getMonitoringProcessState(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isGettingState)).subscribe(st => {
            this.state = st.state;
            if (st.state == 'runing') { $('.startWaiting').removeClass('active'); }
            if (this.state == "stopped") {
              this.stopExistingMonitoring();
            }
          });

          this.isMonitoring = true;
          this.targetMonprcSubscription = this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
            this.targets = res;
            let index = this.lastMonitoringData.findIndex((val, index, arr) => {
              if (val && this.targets[index]) {
                return val.last_upd != this.targets[index].last_upd
              } else {
                return false;
              }
            });
            if (index != -1) {
              $(`.target-table tr`).removeClass('updated');
              $(`.target-table #${index}`).addClass('updated');
            }
            this.lastMonitoringData = Object.assign(this.lastMonitoringData, this.targets);
          });
        });
      }
    }, err => {
      $('.startWaiting').removeClass('active');
      console.log('monprc already started');
    });


  }

  /**
   * if user opens app from another client getting monitoring state,updating targets array. Updates session to active. 
   */
  runExistingMonitoring() {

    $('.calcTarget.errors').removeClass('visible');
    console.log('run existing monitoring');
    this.isGettingState = true;

    if (this.targetMonprcSubscription && this.monprcStateSubscription) {
      this.targetMonprcSubscription.unsubscribe();
      this.monprcStateSubscription.unsubscribe();
    }
    this.connectBT = true;
    this.lastMonitoringData = Object.assign(this.lastMonitoringData, this.targets)
    this.monprcStateSubscription = this.monitoringService.getMonitoringProcessState(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isGettingState)).subscribe(st => {
      this.state = st.state;
      console.log(st.state);
      if (st.state == 'runing') { $('.startWaiting').removeClass('active'); }
      if (this.state == "stopped") {
        this.stopExistingMonitoring();
      }
    });
    this.isMonitoring = true;
    this.targetMonprcSubscription = this.targetService.getTargetList(this.selectedSessionId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.isMonitoring)).subscribe(res => {
      this.targets = res;
      let index = this.lastMonitoringData.findIndex((val, index, arr) => {
        if (val && this.targets[index]) {
          return val.last_upd != this.targets[index].last_upd
        } else {
          return false;
        }
      });
      if (index != -1) {
        $(`.target-table tr`).removeClass('updated');
        $(`.target-table #${index}`).addClass('updated');
      }
      this.lastMonitoringData = Object.assign(this.lastMonitoringData, this.targets);
    });


  }



  /**
   * add target to targets array req. 
   */
  addTarget() {
    $('.calcTarget.errors').removeClass('visible');
    $('.calcTargetButton').addClass('disabled');
    $('.addTargetButton').addClass('loading').addClass('disabled');
    this.targetService.createTarget(this.selectedSessionId, this.initId.toString(), new Target((++this.initId).toString(), this.params.x, this.params.y, this.params.h, this.params.ha, this.params.va, 0.0, 0.0, 0.0, "2018-12-19 16:56:22", this.params.type)).then(res => {
      $('.calcTargetButton').removeClass('disabled');
      $('.addTargetButton').removeClass('loading').removeClass('disabled');
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

      } else { $('.calcTarget.errors').addClass('visible'); }
    }, err => { $('.calcTargetButton').removeClass('disabled'); $('.addTargetButton').removeClass('loading').removeClass('disabled'); $('.calcTarget.errors').addClass('visible'); })
  }

  /**
   * measure coordinates req
   */
  getCoordinates() {
    $('.calcTarget.errors').removeClass('visible');
    $('.addTargetButton').addClass('disabled');
    $('.calcTargetButton').addClass('loading').addClass('disabled');
    this.params.x = null;
    this.params.y = null;
    this.params.h = null;
    this.params.ha = null;
    this.params.va = null;
    this.configService.getCoordinates(this.currentConfig.bt_addr, this.params.type).subscribe(res => {
      $('.addTargetButton').removeClass('disabled');
      $('.calcTargetButton').removeClass('loading').removeClass('disabled');
      if (res.point.X) {
        this.params.x = res.point.X;
        this.params.y = res.point.Y;
        this.params.h = res.point.H;
        this.params.ha = res.point.HA;
        this.params.va = res.point.VA;
      } else { $('.calcTarget.errors').addClass('visible'); }
    }, err => { $('.addTargetButton').removeClass('disabled'); $('.calcTargetButton').removeClass('loading').removeClass('disabled'); $('.calcTarget.errors').addClass('visible'); });
  }


  deleteTarget(target: Target) {
    this.targetService.deleteTarget(this.selectedSessionId, target.target_id, target).toPromise().then(res => {
      if (res.status == 'Ok') {
        console.log('deleted');
        this.getTargets(this.selectedSessionId).then(res => {
          this.targets = res;
        })
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


  /**
   * creates new session with opened state. Updates previously session from opened to string
   */
  createSession() {
    this.sessionService.getSessions().toPromise().then(res => {
      if (res.find(el => { return el.state == 'active' })) {
        console.log('can\'t create! session is active');
        $('.ui.modal.creator').modal('hide');
      } else {
        // if array has values, sort array by id ascending and generate new session id
        if (res['length'] == 0) {
          this.initSessionId = 10;
        } else {
          res.sort(this.compare);
          this.initSessionId = +res[res['length'] - 1].session_id;
        }

        let tmp = this.initSessionId + 1;
        let session = new Session(tmp.toString(), $("#description").val(), 0, 0, 0, new Date(Date.now()).toLocaleString(), "opened", +$("#dopusk").val());
        this.sessionService.createSession(session).toPromise().then(res => {
          this.targets = [];
          this.sessionService.getSessions().toPromise().then(res => {
            this.archiveSessions = res;
            console.log('req on create');
            this.currentSession = res.find(el => { return el.session_id == session.session_id });
            this.selectedSessionId = this.currentSession.session_id;
            this.updateTargetsTable();
            let opened = res.find(el => { return el.session_id != this.selectedSessionId && el.state == "opened" });
            if (opened) {
              let sessionUpdate = new Session(opened.session_id, opened.description, +opened.lat, +opened.lon, +opened.hgt, opened.timestamp, "string", opened.tolerance);
              this.sessionService.updateSession(sessionUpdate).toPromise().then(res => {
                console.log('update to string in create');
              });
            }
          });
        });
      }
    });

  }

  /**
   * show modal requesting session closing
   */
  openSessionClosing() {
    $('.ui.modal.close').modal('show');
  }
  /**
   * show modal requesting session deletion with session ids dropdown except current one
   */
  openSessionDeletion() {
    $('.ui.modal.delete').modal('show');
  }

  /**
   * show modal requesting session export with session ids dropdown 
   */
  openExport() {
    $('.ui.modal.export').modal('show');
  }

  /**
   * show modal confirms selected session deletion. clear delete dropdown
   */
  openDeleteConfirm() {
    $('.ui.modal.confirm').modal('show');
    $('.ui.deletion.dropdown').dropdown('clear');
  }

  /**
   * show modal confirms selected session export
   */
  exportConfirm(e: any) {
    $("#export").attr('href', this.sessionService.getHistoryFileUrl(this.selectedSessionIdExport));
    $('.ui.export.dropdown').dropdown('clear');

  }

  closeModal(selector: string) {
    $(selector).modal('hide');
  }

  deleteSession() {
    this.sessionService.deleteSelectedSession(this.selectedSessionIdDelete).toPromise().then(res => {
      if (res.status = "Ok") {
        this.sessionService.getSessions().toPromise().then(res => {
          this.archiveSessions = res;
        });
        console.log('session deleted');
      }
    });
  }

  /**
   * set selected session id to delete from delete modal dropdown
   * @param id 
   */
  selectSessionIdDelete(id: string) {
    this.selectedSessionIdDelete = id;
  }

  /**
   * set selected session id to export
   * @param id 
   */
  selectSessionIdExport(id: string) {
    this.selectedSessionIdExport = id;
  }

  /**
   * close session and update its status to string.
   */
  closeSession() {
    let sessionUpdate = new Session(this.currentSession.session_id, $("#editDescription").val(), +this.currentSession.lat, +this.currentSession.lon, +this.currentSession.hgt, this.currentSession.timestamp, "string", +$("#editDopusk").val());

    this.sessionService.updateSession(sessionUpdate).toPromise().then(update => {
      if (update.status == "Ok") {
        // request to close computer
        this.configService.shutdownSystem().toPromise().then(res => {
          console.log('shutdown');
        });
      }

    })
  }

  showKeyboard(event, currentAlphabet, multipleLanguage, type, control = this.defaultControl) {
    console.log(this.deviceService);
    if (this.deviceService.os != 'Android') {
      this.keyboardSettings.isNumber = (type == 'number' || type == 'real') ? true : false;
      this.keyboardSettings.isRealNumber = (type == 'real') ? true : false;
      this.keyboardSettings.currentControl = control;
      this.defaultControl.setValue($(`#${event.target.id}`).val());
      this.keyboardSettings.resetValue = $(`#${event.target.id}`).val();
      $('.ui.modal.keyboard').modal('show');
      $('#write').val($(`#${event.target.id}`).val());
      this.keyboardSettings.caretPosition = $(`#${event.target.id}`).val().length;
      console.log(this.keyboardSettings.currentControl);
      this.keyboardSettings.id = event.target.id;
      this.keyboardSettings.currentAlphabet = currentAlphabet;
      this.keyboardSettings.multipleLanguage = multipleLanguage;
    }

  }
  toggleShift() {
    this.keyboardSettings.isShift = !this.keyboardSettings.isShift;
  }

  changeAlphabet() {
    this.keyboardSettings.currentAlphabet = (this.keyboardSettings.currentAlphabet == 'UA') ? 'EN' : 'UA';
  }

  addChar(event) {
    let content = $('#write').val();
    let res = content.split('')
    res.splice(this.keyboardSettings.caretPosition, 0, event.target.innerText);
    this.keyboardSettings.currentControl.setValue(res.join(''));
    $('#write').val(res.join(''));
    this.keyboardSettings.caretPosition++; console.log('Caret position: ' + this.keyboardSettings.caretPosition);
    console.log(this.keyboardSettings.currentControl);
  }
  addWhiteSpace() {
    let content = $('#write').val();
    this.keyboardSettings.currentControl.setValue(content + ' ');
    $('#write').val(content + ' ');
    this.keyboardSettings.caretPosition++; console.log('Caret position: ' + this.keyboardSettings.caretPosition);
    console.log(this.keyboardSettings.currentControl);
  }
  deleteChar(event) {
    let content = $('#write').val();
    let res = content.split('')
    res.splice(this.keyboardSettings.caretPosition - 1, 1);
    this.keyboardSettings.currentControl.setValue(res.join(''));
    $('#write').val(res.join(''));
    this.keyboardSettings.caretPosition = (this.keyboardSettings.caretPosition > 0) ? this.keyboardSettings.caretPosition - 1 : 0;
    console.log(this.keyboardSettings.currentControl);
  }
  selectArea($event) {
    this.keyboardSettings.caretPosition = this.getCaretPosition(document.getElementById('write'));
    console.log('Caret position: ' + this.keyboardSettings.caretPosition);
  }

  getCaretPosition(input) {
    return input.selectionStart;
  }

  approveChanges() {
    console.log(this.keyboardSettings.id);
    //$(`#${this.keyboardSettings.id}`).val($('#write').val());
    this.keyboardSettings.currentControl.setValue($('#write').val());
    $('.ui.modal.keyboard').modal('hide');
    this.keyboardSettings.caretPosition = 0;
    this.keyboardSettings.isShift = false;
    this.keyboardSettings.isRealNumber = false;
    this.keyboardSettings.isNumber = false;
    console.log(this.userForm);
    $('#write').val('')
  }

  cancelChanges() {
    $('.ui.modal.keyboard').modal('hide');
    this.keyboardSettings.currentControl.setValue(this.keyboardSettings.resetValue);
    this.keyboardSettings.caretPosition = 0;
    this.keyboardSettings.isShift = false;
    this.keyboardSettings.isRealNumber = false;
    this.keyboardSettings.isNumber = false;
    $('#write').val('');
  }

  getFormControl(control) {
    return control as FormControl
  }

  activeSessionSearch() {
    // if another active session found update current to string and switch to found. start monitoring
    // if another opened session found update current to string and switch to found
    this.sessionService.getSessions().pipe(repeatWhen(() => interval(4000))).subscribe(session => {
      let active = session.find(el => { return el.state == 'active' });
      let opened = session.find(el => { return el.state == 'opened' });
      if (active && active.session_id == this.selectedSessionId && (!this.isMonitoring && !this.isGettingState)) {
        console.log('current session become activated');

        this.currentSession = active;
        this.runExistingMonitoring();
      }
      if (active && active.session_id != this.selectedSessionId && (!this.isMonitoring && !this.isGettingState)) {
        console.log('another session was activated');
        this.activateSession(active);
        this.runExistingMonitoring();
      }
      if (opened && opened.session_id != this.selectedSessionId) {
        console.log('another session was opened ');
        this.activateSession(opened);
        this.updateTargetsTable();
      }
      if (opened && opened.session_id == this.selectedSessionId) {
        console.log('current session become opened');
        this.currentSession = opened;
        this.updateTargetsTable();
      }

    });
  }

  /**
   * get list of available networks. If already connected connect with fake data and get list again
   */
  searchConnections() {
    $('.searchConnection').addClass('loading');
    $(`.bt-wifi-popup .ui.button:not(.removeConnection)`).addClass('disabled');
    this.configService.getConnections().toPromise().then(connections => {
      if (connections.status === 'Ok') {
        if (connections.wifi_list.length > 0) {
          $('.searchConnection').removeClass('loading');
          $(`.bt-wifi-popup .ui.button:not(.removeConnection)`).removeClass('disabled');
          this.connections = connections.wifi_list;
        } else {
          this.configService.connect('123456789', 'lalka').toPromise().then(conn => {
            console.log(conn);
            this.configService.getConnections().toPromise().then(connections => {
              $('.searchConnection').removeClass('loading');
              $(`.bt-wifi-popup .ui.button:not(.removeConnection)`).removeClass('disabled');
              if (connections.wifi_list.length > 0) {
                this.connections = connections.wifi_list;
              }
            });
          }, error => {
            this.configService.getConnections().toPromise().then(connections => {
              $('.searchConnection').removeClass('loading');
              $(`.bt-wifi-popup .ui.button:not(.removeConnection)`).removeClass('disabled');
              if (connections.wifi_list.length > 0) {
                this.connections = connections.wifi_list;
              }
            });
          });
        }
      }
    });
  }

  /**
   * connect to wifi and get list of ip adresses
   * @param password 
   * @param ssid 
   */
  connect(ssid: any, password: any) {
    $('.bt-wifi-popup .ui.form .ui.button').addClass('loading');
    $('.bt-wifi-popup .ui.button').addClass('disabled');
    this.configService.connect(password, ssid).toPromise().then(conn => {
      $('.bt-wifi-popup .ui.button').removeClass('loading');
      $('.bt-wifi-popup .ui.button:not(.searchConnection)').addClass('disabled');
      if (conn.status === 'Ok') {
        this.showPasswordInput = false;
        console.log(conn);
        this.configService.getIp().toPromise().then(ips => {
          if (ips.status === 'Ok') {
            this.connections = [];
            this.ips = ips.if_list;
            this.runningCheck();
          }
        });
      } else {
        console.log("Error!");
      }

    }, err => {
      this.configService.connect(password, ssid).toPromise().then(conn => {
        $('.bt-wifi-popup .ui.button').removeClass('loading');
        $('.bt-wifi-popup .ui.button:not(.searchConnection)').addClass('disabled');
        if (conn.status === 'Ok') {
          this.showPasswordInput = false;
          console.log(conn);
          this.configService.getIp().toPromise().then(ips => {
            if (ips.status === 'Ok') {
              this.connections = [];
              this.ips = ips.if_list;
              this.runningCheck();
            }
          });
        }
      }, err => {
        $('.bt-wifi-popup .ui.button').removeClass('loading').removeClass('yellow');
        $('.bt-wifi-popup .ui.button:not(.searchConnection)').addClass('disabled');
      });
    });
  }

  runningCheck() {
    let wlan = this.ips.find(el => {
      return el.interface == "wlan0"
    });
    if (wlan && wlan['RUNNING'] == undefined) {
      $('.bt-wifi-popup .ui.button:not(.removeConnection)').removeClass('disabled');
    }
  }

  disconnect() {
    $('.removeConnection').addClass('loading')
    this.configService.disconnect().toPromise().then(conn => {
      $('.removeConnection').removeClass('loading')
      if (conn.status === 'Ok') {
        console.log(conn);
        this.configService.getIp().toPromise().then(ips => {
          if (ips.status === 'Ok') {
            this.ips = ips.if_list;
          }
        });
      }

    });
  }

  /**
   * session init
   * @param session 
   */
  activateSession(session: any) {
    this.currentSession = session;
    this.selectedSessionId = session.session_id;
    this.getTargets(this.currentSession.session_id).then(targets => {
      if (targets['length'] == 0) {
        this.initId = 100;
      } else {
        this.initId = +targets[targets['length'] - 1].target_id;
      }
      console.log(this.initId);
      this.targets = targets;

    });
  }


  onSubmit() { }

  trackByFn(index, item) {
    return index;
  }

  checkWlan0(ips) {
    return (!ips || (ips && ips[1] && !ips[1].hasOwnProperty('ip')));
  }

  checkEth0(ips) {
    return (!ips || (ips && ips[1] && ips[1].hasOwnProperty('ip')));
  }

  updateIps() {
    this.configService.getIp().toPromise().then(ips => {
      if (ips.status === 'Ok') {
        this.ips = ips.if_list;
      }
    });
  }

  getUnique(wifi) {
    let unique = [''], res = [];
    for (let i = 0; i < wifi.length; i++) {
      if (unique.indexOf(wifi[i]['ssid']) > -1 || wifi[i]['ssid'] == '') {
      } else {
        unique.push(wifi[i]['ssid'])
        res.push(wifi[i]);
      }
    }
    return res;
  }

  selectWifi(conn, i) {
    this.showPasswordInput = false;
    this.wifiPasswordForm.controls.password.setValue('');
    this.currentConn = conn;
    if (conn.encrypted) {
      this.showPasswordInput = true;
    } else {
      $(`.bt-wifi-popup #${i}`).addClass('loading');
      this.connect(this.currentConn.ssid, '');
    }
  }

}
