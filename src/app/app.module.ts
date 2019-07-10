import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZoomImageComponent } from './zoom-image/zoom-image.component';


@NgModule({
  declarations: [
    AppComponent,
    ZoomImageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
