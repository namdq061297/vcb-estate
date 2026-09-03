import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[vcbClickStopPropagation]',
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
