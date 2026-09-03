import { WA_IS_MOBILE } from '@ng-web-apis/platform';
import { tuiPure } from '@taiga-ui/legacy';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Inject,
  Injector,
  Input,
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
import { tuiInputDateOptionsProvider, TuiInputDate } from '@taiga-ui/kit';
import { ErrorMessages } from '../form-controls.const';
import {
  TuiDialogService,
  TuiError,
  TuiLoader,
  TUI_VALIDATION_ERRORS,
} from '@taiga-ui/core';
import { tuiControlValue, TuiDay, TuiValueTransformer } from '@taiga-ui/cdk';
import { DisabledControlDirective } from '@vcb/shared/directives';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiMobileCalendar, TUI_CALENDAR_DATE_STREAM } from '@taiga-ui/addon-mobile';
import { map, Observable } from 'rxjs';

class NativeDateTransformer extends TuiValueTransformer<TuiDay | null, Date | null> {
  fromControlValue(controlValue: Date | null): TuiDay | null {
    return controlValue && TuiDay.fromLocalNativeDate(controlValue);
  }

  toControlValue(componentValue: TuiDay | null): Date | null {
    return componentValue?.toLocalNativeDate() || null;
  }
}

@Component({
  selector: 'vcb-input-date',
  imports: [
    CommonModule,
    ...TuiInputDate,
    ReactiveFormsModule,
    ...TuiError,
    DisabledControlDirective,
    TuiLoader,
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
    tuiInputDateOptionsProvider({ valueTransformer: new NativeDateTransformer() }),
  ],
})
export class InputDateComponent implements ControlValueAccessor, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';

  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabledControl = false;
  @Input() loading = false;
  @Input() set disablePastDate(value: boolean) {
    this.min = !value ? new TuiDay(0, 0, 1) : TuiDay.currentLocal();
  }
  @Input() set disableFutureDate(value: boolean) {
    this._max = !value ? new TuiDay(2100, 0, 1) : TuiDay.currentLocal();
  }

  get required() {
    return this.control.hasValidator(Validators.required);
  }
  min = new TuiDay(0, 0, 1);

  @Input() set maxDate(value: Date) {
    this._max = TuiDay.fromLocalNativeDate(value);
  }
  get max() {
    return this._max;
  }
  private _max = new TuiDay(2100, 0, 1);
  private dialog$!: Observable<TuiDay>;

  get control(): FormControl {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }

  @Input() disableItemHandle: (item: Date) => boolean = (_) => false;

  @tuiPure
  disableDateHandle(day: TuiDay): boolean {
    return this.disableItemHandle(day.toLocalNativeDate());
  }

  constructor(
    protected controlContainer: ControlContainer,
    @Inject(WA_IS_MOBILE) private isMobile: boolean,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector
  ) {}

  ngAfterViewInit() {
    const computedInjector = Injector.create({
      providers: [
        {
          provide: TUI_CALENDAR_DATE_STREAM,
          useValue: tuiControlValue<Date>(this.control).pipe(
            map((v) => (v ? TuiDay.fromLocalNativeDate(v) : null))
          ),
        },
      ],
      parent: this.injector,
    });
    const content = new PolymorpheusComponent(TuiMobileCalendar, computedInjector);

    this.dialog$ = this.dialogService.open(content, {
      appearance: 'fullscreen',
      closable: false,
      data: {
        min: this.min,
        max: this.max,
        disabledItemHandler: this.disableDateHandle,
      },
    });
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

  onClick() {
    if (this.isMobile && !this.disabledControl) {
      this.dialog$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        this.control.setValue(value.toLocalNativeDate());
        setTimeout(() => {
          if (
            document.activeElement &&
            document.activeElement instanceof HTMLInputElement
          ) {
            document.activeElement.blur();
          }
        });
      });
    }
  }
}
