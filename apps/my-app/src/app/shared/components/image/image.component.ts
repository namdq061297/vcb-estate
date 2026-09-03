import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IMAGES, type ImageName } from '@images';

@Component({
  selector: 'app-image',
  template: `
    <img [src]="src()" [alt]="alt()" [width]="width()" [height]="height()" class="app-image" />
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .app-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        max-width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  name = input.required<ImageName>();
  alt = input<string>('');
  width = input<number | string | undefined>(undefined);
  height = input<number | string | undefined>(undefined);

  src = computed(() => IMAGES[this.name()]);
}
