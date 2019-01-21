import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MonitoringService } from 'src/services/monitoring.service';
import { TargetService } from 'src/services/target.service';
import { SessionService } from 'src/services/session.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { ShiftLetterPipe } from './pipes/shift-letter.pipe';
import { ShiftSymbolPipe } from './pipes/shift-symbol.pipe';
import { OnlyNumberPipe } from './pipes/only-number.pipe';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FilterPipe,
    ShiftLetterPipe,
    ShiftSymbolPipe,
    OnlyNumberPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [MonitoringService,TargetService,SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
