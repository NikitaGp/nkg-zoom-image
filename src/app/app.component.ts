import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nkg-zoom-image';
  showZoomBox = false;
  openZoomBox() {
    this.showZoomBox = true;
  }

  hideZoomBox(event: boolean) {
    this.showZoomBox = event;
  }
}
