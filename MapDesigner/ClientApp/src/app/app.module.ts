import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { MaterialModule } from './module/material-module';
import { GlobalConfigComponent } from './config-bar/global-config/global-config.component';
import { SvgConfigComponent } from './config-bar/svg-config/svg-config.component';
import { ScaleBarZoomConfigComponent } from './config-bar/scale-bar-zoom-config/scale-bar-zoom-config.component';
import { RectConfigComponent } from './config-bar/rect-config/rect-config.component';
import { BubblesConfigComponent } from './config-bar/bubbles-config/bubbles-config.component';
import { PathsConfigComponent } from './config-bar/paths-config/paths-config.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AceEditorComponent, AceEditorModule } from 'ng2-ace-editor';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    GlobalConfigComponent,
    SvgConfigComponent,
    ScaleBarZoomConfigComponent,
    RectConfigComponent,
    BubblesConfigComponent,
    PathsConfigComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MaterialModule,
    AceEditorModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
