import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'kite-zoom-image',
  templateUrl: './zoom-image.component.html',
  styleUrls: ['./zoom-image.component.scss']
})
export class ZoomImageComponent {
  imgMinWidth = 400;
  imgMaxWidth = 0;
  width = 400;
  offset = [0, 0];
  horizontalDirection = 'left';
  verticalDirection = 'top';
  showGrabbingCursor = false;
  showGrabCursor = false;
  mouseOldX;
  mouseOldY;
  mousePosition;
  @Input() imageUrl: string;
  @Input() showPopup = false;
  @Input() title = '';
  @Output() closePopup = new EventEmitter<boolean>();

  @ViewChild('ImgContainer') imgContainer: ElementRef;

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.mouseWheelFunc(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.mouseWheelFunc(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.mouseWheelFunc(event);
  }

  constructor(private renderer2: Renderer2) {
  }

  mouseWheelFunc(event: any) {
    event = window.event || event; // old IE support
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
      this.zoomIn();
    } else if (delta < 0) {
      this.zoomOut();
    }
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  hidePopup() {
    this.showPopup = false;
    this.closePopup.emit(false);
  }

  grabCursor() {
    const clientX = document.body.clientWidth;
    const clientY = document.body.clientHeight;
    if (clientX <= this.imgContainer.nativeElement.width || clientY <= this.imgContainer.nativeElement.height) {
      this.showGrabCursor = true;
    } else {
      this.showGrabCursor = false;
    }
  }

  zoomIn() {
    const previousWidth = this.imgContainer.nativeElement.width;
    this.width = this.imgContainer.nativeElement.width + 100;
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'left');
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'top');
    this.renderer2.setStyle(this.imgContainer.nativeElement, 'width', this.width + 'px');
    this.grabCursor();
    if (this.imgContainer.nativeElement.width === previousWidth) {
      this.imgMaxWidth = previousWidth;
      this.width = previousWidth;
      return;
    }
  }

  zoomOut() {
    if (this.width <= this.imgMinWidth) {
      return;
    }
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'left');
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'top');
    this.width = this.imgContainer.nativeElement.width - 100;
    this.grabCursor();
    this.renderer2.setStyle(this.imgContainer.nativeElement, 'width', this.width + 'px');
  }

  zoomReset() {
    this.width = 400;
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'left');
    this.renderer2.removeStyle(this.imgContainer.nativeElement, 'top');
    this.grabCursor();
    this.renderer2.setStyle(this.imgContainer.nativeElement, 'width', '400px');
    this.offset = [0, 0];
  }

  imgMouseDown(e) {
    this.offset = [
      document.getElementById('image').offsetLeft - e.clientX,
      document.getElementById('image').offsetTop - e.clientY
    ];
  }

  setMouseOldPosition(axis, value) {
    if (axis === 'x') {
      this.mouseOldX = value;
    } else {
      this.mouseOldY = value;
    }
  }

  getMouseMovingDirection(event) {
    if (event.pageX < this.mouseOldX) {
      this.horizontalDirection = 'left';
    } else if (event.pageX > this.mouseOldX) {
      this.horizontalDirection = 'right';
    }
    if (event.pageY < this.mouseOldY) {
      this.verticalDirection = 'top';
    } else if (event.pageY >= this.mouseOldY) {
      this.verticalDirection = 'bottom';
    }
    return {
      'horizontal_direction': this.horizontalDirection,
      'vertical_direction': this.verticalDirection
    };
  }

  imgMouseMove(event) {
    event.preventDefault();
    const clientX = document.body.clientWidth;
    const clientY = document.body.clientHeight;
    if (event.buttons > 0) {
      const direction = this.getMouseMovingDirection(event);
      const x_limit = clientX / 2;
      const y_limit = clientY / 2;
      const imgCoordinates = this.imgCoordinate();
      this.mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      this.showGrabCursor = false;
      if (clientX >= this.imgContainer.nativeElement.width && clientY >= this.imgContainer.nativeElement.height) {
        this.offset = [0, 0];
        return;
      } else {
        this.showGrabbingCursor = true;
      }
      if (clientX <= this.imgContainer.nativeElement.width) {
        if (imgCoordinates.x < 0) {
          if (imgCoordinates.right >= x_limit || direction.horizontal_direction === 'right') {
            this.setMouseOldPosition('x', event.pageX);
            this.renderer2.setStyle(this.imgContainer.nativeElement, 'left', (this.mousePosition.x + this.offset[0]) + 'px');
          }
        } else {
          if (imgCoordinates.left <= x_limit || direction.horizontal_direction === 'left') {
            this.setMouseOldPosition('x', event.pageX);
            this.renderer2.setStyle(this.imgContainer.nativeElement, 'left', (this.mousePosition.x + this.offset[0]) + 'px');
          }
        }
      }
      if (clientY <= this.imgContainer.nativeElement.height) {
        if (imgCoordinates.y < 0) {
          if (imgCoordinates.bottom >= y_limit || direction.vertical_direction === 'bottom') {
            this.setMouseOldPosition('y', event.pageY);
            this.renderer2.setStyle(this.imgContainer.nativeElement, 'top', (this.mousePosition.y + this.offset[1]) + 'px');
          }
        } else {
          if (imgCoordinates.top <= y_limit || direction.vertical_direction === 'top') {
            this.setMouseOldPosition('y', event.pageY);
            this.renderer2.setStyle(this.imgContainer.nativeElement, 'top', (this.mousePosition.y + this.offset[1]) + 'px');
          }
        }
      }
    } else {
      this.showGrabbingCursor = false;
      this.grabCursor();
    }

  }

  preventKeyEvent(e) {
    e.preventDefault();
  }

  imgCoordinate() {
    const img = (document.getElementById('image'));
    return <any>img.getBoundingClientRect();
  }

}
