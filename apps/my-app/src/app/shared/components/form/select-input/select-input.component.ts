import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import 'iconify-icon';
import { ErrorMessages } from '../../form-controls.const';

export interface SelectInputOption<T = string> {
  label: string;
  value: T;
}

let nextInputId = 0;

@Component({
  selector: 'app-select-input',
  imports: [],
  template: `
    <div class="select-input" [class.select-input--open]="isOpen()">
      <span class="select-input__label">
        {{ label() }}
        @if (required()) {
          <span class="select-input__required" aria-hidden="true">*</span>
        }
      </span>

      <button
        type="button"
        class="select-input__control"
        [class.select-input__control--invalid]="showError()"
        [id]="resolvedId()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-required]="required()"
        [attr.aria-invalid]="showError() ? 'true' : null"
        (click)="toggle()"
      >
        <span class="select-input__value" [class.select-input__value--placeholder]="!selectedOption()">
          {{ selectedOption()?.label ?? placeholder() }}
        </span>
        <iconify-icon
          class="select-input__chevron"
          icon="lucide:chevron-down"
          aria-hidden="true"
        ></iconify-icon>
      </button>

      @if (isOpen()) {
        <div class="select-input__panel" role="listbox">
          <div class="select-input__search-wrap">
            <iconify-icon
              class="select-input__search-icon"
              icon="lucide:search"
              aria-hidden="true"
            ></iconify-icon>
            <input
              #searchInput
              class="select-input__search"
              type="text"
              [placeholder]="searchPlaceholder()"
              [value]="searchTerm()"
              (input)="onSearch($event)"
              (click)="$event.stopPropagation()"
            />
          </div>

          <div class="select-input__options">
            @for (option of filteredOptions(); track option.value) {
              <button
                type="button"
                role="option"
                class="select-input__option"
                [class.select-input__option--selected]="option.value === value()"
                [attr.aria-selected]="option.value === value()"
                (click)="selectOption(option)"
              >
                {{ option.label }}
              </button>
            } @empty {
              <div class="select-input__empty">{{ emptyMessage() }}</div>
            }
          </div>
        </div>
      }

      @if (showError()) {
        <span class="select-input__error" [id]="resolvedId() + '-error'" role="alert">
          {{ requiredErrorMessage() }}
        </span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .select-input {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 6px;
      }

      .select-input__label {
        color: var(--color-text-primary, #181d27);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        font-weight: 500;
      }

      .select-input__required {
        color: var(--color-text-error, #d92d20);
      }

      .select-input__control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--color-border-primary-brand, #d5d7da);
        background: var(--color-bg-surface-primary, #ffffff);
        padding: 10px 14px;
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        cursor: pointer;
        text-align: left;
      }

      .select-input__value {
        color: var(--color-text-primary, #181d27);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .select-input__value--placeholder {
        color: var(--color-text-placeholder, #717680);
      }

      .select-input__chevron {
        flex-shrink: 0;
        color: var(--color-icon-subtle, #5a5a5a);
        transition: transform 0.15s ease;
      }

      .select-input--open .select-input__chevron {
        transform: rotate(180deg);
      }

      .select-input--open .select-input__control {
        outline: 2px solid var(--color-border-brand-primary, #006b3b);
      }

      .select-input__control:disabled {
        cursor: not-allowed;
        background: var(--color-bg-disable, #f5f5f5);
        border-color: var(--color-border-disable, #d5d7da);
      }

      .select-input__control--invalid {
        border-color: var(--color-border-error-subtle, #fda29b);
      }

      .select-input__error {
        color: var(--color-text-error, #d92d20);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-12, 0.75rem);
        font-weight: 500;
      }

      .select-input__panel {
        position: absolute;
        inset-inline: 0;
        top: calc(100% + 4px);
        z-index: 20;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        border: 1px solid var(--color-border-disable-subtle, #e9eaeb);
        background: var(--color-bg-surface-primary, #ffffff);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }

      .select-input__search-wrap {
        position: relative;
        border-bottom: 1px solid var(--color-border-disable-subtle, #e9eaeb);
      }

      .select-input__search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-icon-subtle, #5a5a5a);
        pointer-events: none;
      }

      .select-input__search {
        color-scheme: light;
        width: 100%;
        border: none;
        outline: none;
        padding: 10px 12px 10px 36px;
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        color: var(--color-text-primary, #181d27);
        background-color: var(--color-bg-surface-primary, #ffffff);
      }

      .select-input__search::placeholder {
        color: var(--color-text-placeholder, #717680);
      }

      .select-input__options {
        max-height: 220px;
        overflow-y: auto;
        padding: 4px;
      }

      .select-input__option {
        display: block;
        width: 100%;
        border: none;
        background: transparent;
        border-radius: 6px;
        padding: 8px 10px;
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        color: var(--color-text-primary, #181d27);
        text-align: left;
        cursor: pointer;
      }

      .select-input__option:hover {
        background: var(--color-bg-select, #e4f3ec);
      }

      .select-input__option--selected {
        background: var(--color-bg-select, #e4f3ec);
        font-weight: 500;
      }

      .select-input__empty {
        padding: 12px;
        text-align: center;
        color: var(--color-text-placeholder, #717680);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent<T = string> {
  private readonly elementRef = inject(ElementRef);
  private readonly generatedId = `app-select-input-${nextInputId++}`;

  @ViewChild('searchInput') private searchInputRef?: ElementRef<HTMLInputElement>;

  label = input<string>();
  items = input<SelectInputOption<T>[]>([]);
  value = input<T | undefined>(undefined);
  placeholder = input('Chọn giá trị');
  searchPlaceholder = input('Tìm kiếm...');
  emptyMessage = input('Không tìm thấy kết quả');
  disabled = input(false);
  required = input(false);
  submitted = input(false);
  requiredErrorMessage = input(ErrorMessages.required);
  inputId = input<string | undefined>(undefined);

  readonly valueChange = output<T>();

  protected readonly isOpen = signal(false);
  protected readonly searchTerm = signal('');

  protected readonly resolvedId = computed(() => this.inputId() ?? this.generatedId);

  protected readonly selectedOption = computed(() =>
    this.items().find((option) => option.value === this.value()),
  );

  protected readonly filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.items();
    }
    return this.items().filter((option) => option.label.toLowerCase().includes(term));
  });

  protected readonly showError = computed(
    () => this.submitted() && !this.disabled() && this.required() && this.value() == null,
  );

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.isOpen.update((open) => !open);
    if (this.isOpen()) {
      this.searchTerm.set('');
      queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
    }
  }

  protected onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected selectOption(option: SelectInputOption<T>): void {
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.isOpen.set(false);
  }
}
