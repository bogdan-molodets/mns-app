import { Component, OnInit } from '@angular/core';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentSession: Promise<any>;

  constructor() {
    this.currentSession = this.getCurrentSesion();
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
  }

  getCurrentSesion(){
    return new Promise((resolve,reject)=>{
      resolve('Test');
    })
  }
}
