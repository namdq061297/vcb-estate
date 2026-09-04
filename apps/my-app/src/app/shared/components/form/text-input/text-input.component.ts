import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import 'iconify-icon';
import { ErrorMessages } from '../../form-controls.const';

let nextInputId = 0;

@Component({
  selector: 'app-text-input',
  imports: [],
  template: `
    <label class="text-input" [attr.for]="resolvedId()">
      <span class="text-input__label">
        {{ label() }}
        @if (required()) {
          <span class="text-input__required" aria-hidden="true">*</span>
        }
      </span>
      <span class="text-input__field" [class.text-input__field--search]="isSearch()">
        @if (isCurrencyInput()) {
          <div class="vnd-input-wrapper">
            <p>VND</p>
          </div>
        }
        @if (isSearch()) {
          <iconify-icon
            class="text-input__search-icon"
            icon="lucide:search"
            aria-hidden="true"
          ></iconify-icon>
        }
        <input
          class="text-input__control"
          [class.text-input__control--invalid]="showError()"
          [id]="resolvedId()"
          [type]="type()"
          [value]="displayValue()"
          [placeholder]="placeholder()"
          [attr.autocomplete]="autocomplete()"
          [attr.inputmode]="inputmode()"
          [attr.pattern]="resolvedPattern()"
          [disabled]="disabled()"
          [required]="required()"
          [attr.aria-required]="required()"
          [attr.aria-invalid]="showError() ? 'true' : null"
          [attr.aria-describedby]="showError() ? resolvedId() + '-error' : null"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur($event)"
        />
      </span>

      @if (showError()) {
        <span class="text-input__error" [id]="resolvedId() + '-error'" role="alert">
          {{ errorMessage() }}
        </span>
      }
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .text-input {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 6px;
      }

      .text-input__field {
        position: relative;
        display: block;
      }

      .text-input__field--search .text-input__control {
        padding-left: 40px;
      }

      .text-input__search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-icon-subtle, #5a5a5a);
        pointer-events: none;
      }

      .text-input__label {
        color: var(--color-text-primary, #181d27);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        font-style: normal;
        font-weight: 500;
        // line-height: 1.42857;
        // letter-spacing: -0.2px;
      }

      .text-input__required {
        color: var(--color-text-error, #d92d20);
      }

      .text-input__error {
        color: var(--color-text-error, #d92d20);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-12, 0.75rem);
        font-weight: 500;
      }

      .text-input__control {
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--color-border-primary-brand, #d5d7da);
        background: var(--color-bg-surface-primary, #ffffff);
        padding: 12px 10px;
        color: var(--color-text-primary, #181d27);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        font-style: normal;
        font-weight: 400;
        // line-height: 1.42857;
        // letter-spacing: -0.2px;
      }

      .text-input__control::placeholder,
      .text-input__control::-webkit-input-placeholder,
      .text-input__control::-moz-placeholder,
      .text-input__control:-ms-input-placeholder,
      .text-input__control::-ms-input-placeholder {
        color: var(--color-text-placeholder, #717680) !important;
        -webkit-text-fill-color: var(--color-text-placeholder, #717680);
        opacity: 1;
        font-weight: 400;
      }

      .text-input__control:focus-visible {
        outline: 2px solid var(--color-border-brand-primary, #006b3b);
        // outline-offset: 2px;
      }

      .text-input__control.text-input__control--invalid:focus-visible {
        outline: 2px solid var(--color-border-error-subtle, #fda29b);
      }

      .text-input__control:disabled {
        cursor: not-allowed;
        background: var(--color-bg-disable, #f5f5f5);
        border-color: var(--color-border-disable, #d5d7da);
      }

      .text-input__control:invalid:not(.text-input__control--invalid):not(:disabled) {
        border-color: var(--color-border-primary-brand, #d5d7da);
        box-shadow: none;
      }

      .text-input__control.text-input__control--invalid:not(:disabled) {
        border-color: var(--color-border-error-subtle, #fda29b);
      }
      .vnd-input-wrapper {
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background:  var(--color-bg-secondary, #FAFAFA);
        height: 100%;
        border-width: 1px;
        border-top-right-radius: 8px;
        padding: 8px;
        border-bottom-right-radius: 8px;
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent {
  private readonly generatedId = `app-text-input-${nextInputId++}`;
  private readonly hasFocus = signal(false);

  private readonly normalizedValue = computed(() => (this.value() ?? '').trim());
  protected readonly displayValue = computed(() => {
    if (!this.isNumberInput()) {
      return this.value() ?? '';
    }

    const digitsOnly = (this.value() ?? '').replace(/\D+/g, '');
    if (!digitsOnly) {
      return '';
    }

    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  });
  protected readonly resolvedPattern = computed(
    () => this.pattern() ?? (this.inputmode() === 'numeric' ? '[0-9]*' : undefined),
  );
  private readonly hasRequiredError = computed(
    () => this.required() && this.normalizedValue().length === 0,
  );
  private readonly hasPatternError = computed(() => {
    const value = this.normalizedValue();
    const pattern = this.resolvedPattern();

    if (!pattern || value.length === 0) {
      return false;
    }

    try {
      return !new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  });

  protected readonly showError = computed(() => {
    return (
      this.submitted() &&
      !this.hasFocus() &&
      !this.disabled() &&
      (this.hasRequiredError() || this.hasPatternError())
    );
  });

  protected readonly errorMessage = computed(() => {
    if (this.hasRequiredError()) {
      return this.requiredErrorMessage();
    }

    return this.patternErrorMessage();
  });

  label = input<string>();
  type = input('text');
  value = input<string | null>('');
  placeholder = input('');
  autocomplete = input<string | undefined>(undefined);
  inputmode = input<string | undefined>(undefined);
  pattern = input<string | undefined>(undefined);
  requiredErrorMessage = input(ErrorMessages.required);
  patternErrorMessage = input('Giá trị không đúng định dạng');
  isSearch = input(false);
  submitted = input(false);
  disabled = input(false);
  required = input(false);
  inputId = input<string | undefined>(undefined);
  isNumberInput = input(false);
  isCurrencyInput = input(false);

  readonly valueChange = output<string>();

  readonly resolvedId = computed(() => this.inputId() ?? this.generatedId);

  protected onInput(event: Event): void {
    const element = event.target as HTMLInputElement;

    if (!this.isNumberInput()) {
      this.valueChange.emit(element.value);
      return;
    }

    this.valueChange.emit(element.value.replace(/\D+/g, ''));
  }

  protected onFocus(): void {
    this.hasFocus.set(true);
  }

  protected onBlur(event: Event): void {
    this.hasFocus.set(false);
  }
}
