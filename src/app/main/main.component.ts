import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentSession: Promise<any>;
  notification: string = '';
  targets: Promise<any>;// = [];

  constructor() {
    //this.targets.push(new Target('s1',1,2,2,'ww','sd',0.2,0.9,0.8,'09-07-18'));
  }

  params = {
    x: 1,
    y: 2,
    z: 3
  }
  target = {}
  ngOnInit() {
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('attach events', '.menu .item.sidebarToggle')
      ;
    this.currentSession = this.getCurrentSesion();
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

  getTargets(){
    return new Promise((resolve, reject)=>{
      let tmp = [new Target('s1',1,2,2,'ww','sd',0.2,0.9,0.8,'09-07-18')];
      resolve(tmp);
    })
  }


}
