import {
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiComboBox, TuiDataListWrapper } from '@taiga-ui/kit';
import { ErrorMessages } from '../form-controls.const';
import { SelectItem } from '../select/select.component';
import {
  TuiDataList,
  TuiError,
  TuiLoader,
  TuiScrollable,
  TUI_VALIDATION_ERRORS,
  TuiFilterByInputOptions,
  TuiFilterByInputPipe,
  TuiDropdown,
} from '@taiga-ui/core';
import { DisabledControlDirective } from '@app/shared/directives';
import Fuse from 'fuse.js';
import { combineLatest, filter, ReplaySubject, startWith } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'vcb-combo-box',
  imports: [
    CommonModule,
    TuiLoader,
    ...TuiError,
    ReactiveFormsModule,
    ...TuiComboBox,
    DisabledControlDirective,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    ScrollingModule,
    TuiScrollable,
    ...TuiDataList,
    TuiDropdown,
  ],
  templateUrl: './combo-box.component.html',
  styleUrl: './combo-box.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboBoxComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class ComboBoxComponent implements ControlValueAccessor, OnInit {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';

  private _items: SelectItem<any>[] = [];
  get items() {
    return this._items;
  }
  @Input() set items(value: SelectItem<any>[]) {
    this.options = value.map((i) => i.label);
    this.fuse = new Fuse<string>(this.options, { threshold: 0.1 });
    this._items = value;
    this.alreadyHaveItems$.next(true);
  }
  @Input() placeholder = '';
  @Input() label = '';
  @Input() loading = false;
  @Input() disabledControl = false;
  get required() {
    return this.control.hasValidator(Validators.required);
  }
  get control(): FormControl {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }
  fuse!: Fuse<string>;
  options: string[] = [];
  searchControl = new FormControl('');
  alreadyHaveItems$ = new ReplaySubject(1);

  private readonly destroyRef = inject(DestroyRef);

  constructor(protected controlContainer: ControlContainer) {}

  readonly matcher = (name: string, search: string): boolean => {
    if (!search) return true;
    return this.fuse
      .search(search)
      .map((i) => i.item)
      .includes(name);
  };

  ngOnInit() {
    if (this.control) {
      combineLatest([
        this.alreadyHaveItems$.pipe(takeUntilDestroyed(this.destroyRef)),
        this.valueChangesOf(this.control),
      ]).subscribe(([, value]) => {
        if (!value) {
          this.searchControl.setValue(null, { emitEvent: false });
          return;
        }
        const [foundItem] = this.items.filter((i) => i.value === value);
        this.searchControl.setValue(foundItem ? foundItem.label : null, {
          emitEvent: false,
        });
      });
      this.valueChangesOf(this.searchControl)
        .pipe(filter((v) => !!v))
        .subscribe((searchValue) => {
          if (searchValue) {
            const [foundItem] = this.items.filter(
              (i) => i.label.trim() === searchValue.trim()
            );
            this.control.setValue(foundItem.value);
            if (
              document.activeElement &&
              document.activeElement instanceof HTMLInputElement
            ) {
              document.activeElement.blur();
            }
            this.control.markAsTouched();
          }
        });
    }
  }

  valueChangesOf(control: FormControl) {
    return control.valueChanges.pipe(
      startWith(control.value),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  searchChange(search: string | null) {
    if (!search) {
      this.control.setValue(null);
    }
  }

  registerOnChange(fn: never): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor) {
      this.formControlDirective.valueAccessor.registerOnChange(fn);
    }
  }

  registerOnTouched(fn: never): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor) {
      this.formControlDirective.valueAccessor.registerOnTouched(fn);
    }
  }

  writeValue(obj: never): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor) {
      this.formControlDirective.valueAccessor.writeValue(obj);
    }
  }

  setDisabledState(isDisabled: boolean) {
    if (
      this.formControlDirective &&
      this.formControlDirective.valueAccessor?.setDisabledState
    ) {
      this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
  }

    filterWithMatcher: TuiFilterByInputOptions['filter'] = (items, query) => items.filter((item) => this.matcher(item, query));
}
