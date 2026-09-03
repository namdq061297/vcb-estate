import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import 'iconify-icon';

@Component({
  selector: 'app-button',
  template: `
    <button
      type="button"
      class="app-button"
      [class.linear]="isLinear()"
      [class.fullWidth]="isFullWidth()"
      [class.secondary]="resolvedType() === 'secondary'"
      [class.secondary-grey]="resolvedType() === 'secondary-grey'"
      [class.default]="resolvedType() === 'default'"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      @if (leftIconName()) {
        <iconify-icon class="app-button__icon" [icon]="leftIconName()" width="20" height="20" aria-hidden="true"></iconify-icon>
      }

      {{ label() }}
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .app-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: none;
        border-radius: 10px;
        padding: 10px 16px;
        background: linear-gradient(
          90deg,
          var(--gradient-bg-solid-leading, #84bd00) 0%,
          var(--gradient-bg-solid-trailing, #008047) 100%
        );
        color: var(--color-text-inverse, #ffffff);
        font: inherit;
        font-size: var(--font-size-16);
        font-weight: 600;
        line-height: 1.5;
        cursor: pointer;
        transition:
          filter 120ms ease,
          transform 120ms ease;
      }

      .app-button.fullWidth {
        width: 100%;
      }

      .app-button.linear {
        color: var(--color-text-default, #262626);
        font-weight: 400;
        border-radius: 999px;
        font-size: var(--font-size-12);
        background: var(--gradient-button, linear-gradient(246deg, #F6FFE5 15.23%, #B6E99C 46.88%, #91D9BA 84.77%));
      }

      .app-button.secondary {
        border: 1px solid var(--color-border-brand-primary, #006B3B);
        background: var(--color-bg-surface-primary, #ffffff);
        color: var(--color-text-brand-primary, #006b3b);
      }

      .app-button:not(.secondary):not(.secondary-grey):not(:disabled):hover {
        background: var(--Gradient-Hover, linear-gradient(90deg, var(--Gradient-bg-solid-leading_hover, #99C82A) 0%, var(--Gradient-bg-solid-trailing_hover, #2A9566) 100%));
      }

      .app-button:disabled {
        color: var(--color-fg-disable, #717680);
        background: var(--color-bg-disable, #F5F5F5);
        cursor: not-allowed;
        font-weight: 500;
      }

      .app-button.secondary:disabled {
        border: 1px solid var(--color-border-primary-bold, #A4A7AE);
        background: var(--color-bg-surface-primary, #ffffff);
        color: var(--color-text-disable, #717680);
      }

      .app-button.secondary-grey {
        border: 1px solid var(--color-border-input-primary, #D9D9D9);
        background: var(--color-bg-surface-primary, #ffffff);
        color: var(--color-text-primary, #262626);
      }

      .app-button.secondary-grey:disabled {
        background: var(--color-bg-disable, #F5F5F5);
        color: var(--color-text-disable, #717680);
      }
    
      .app-button.default {
        background: var(--color-fg-brand-secondary, #6E9E00);
      }

      .app-button__icon {
        flex: 0 0 auto;
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input.required<string>();
  type = input<'primary' | 'secondary' | 'secondary-grey' | 'default'>('primary');
  variant = input<'primary' | 'secondary' | 'secondary-grey' | 'default' | undefined>(undefined);
  leftIconName = input<string | undefined>(undefined);
  disabled = input(false);
  isLinear = input(false);
  isFullWidth = input(true);

  protected readonly resolvedType = computed(() => this.variant() ?? this.type());

  readonly pressed = output<void>();
}
