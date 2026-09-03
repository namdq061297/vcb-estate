import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, type IconName } from '@icons';

@Component({
  selector: 'app-icon',
  template: `
    @if (useMaskMode()) {
      <span
        class="app-icon app-icon--mask"
        [attr.role]="alt() ? 'img' : null"
        [attr.aria-label]="alt() || null"
        [style.width.px]="resolvedWidth()"
        [style.height.px]="resolvedHeight()"
        [style.background-color]="color()"
        [style.mask-image]="maskImage()"
        [style.mask-repeat]="'no-repeat'"
        [style.mask-position]="'center'"
        [style.mask-size]="'contain'"
        [style.-webkit-mask-image]="maskImage()"
        [style.-webkit-mask-repeat]="'no-repeat'"
        [style.-webkit-mask-position]="'center'"
        [style.-webkit-mask-size]="'contain'"
      ></span>
    } @else {
      <img
        [src]="src()"
        [alt]="alt()"
        [style.width.px]="resolvedWidth()"
        [style.height.px]="resolvedHeight()"
        class="app-icon"
      />
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .app-icon {
        display: block;
        object-fit: contain;
      }

      .app-icon--mask {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(24);
  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);
  alt = input<string>('');
  color = input<string>('');

  src = computed(() => ICONS[this.name()]);
  useMaskMode = computed(() => Boolean(this.color().trim()));
  maskImage = computed(() => `url('${this.src()}')`);
  resolvedWidth = computed(() => this.width() ?? this.size());
  resolvedHeight = computed(() => this.height() ?? this.size());
}
