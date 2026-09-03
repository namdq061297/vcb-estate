import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[disabledControl]',
})
export class DisabledControlDirective {
  @Input() set disabledControl(isDisabled: boolean) {
    if (isDisabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'disabled');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
  }

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}
}
