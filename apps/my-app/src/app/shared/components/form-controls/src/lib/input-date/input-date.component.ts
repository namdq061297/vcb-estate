import {
  AfterViewInit,
  Component,
  forwardRef,
  Inject,
  Injector,
  Input,
  ViewChild,
} from '@angular/core';
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
import {
  TUI_CALENDAR_DATE_STREAM,
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
} from '@taiga-ui/kit';
import { ErrorMessages } from '../const';
import {
  TuiDialogService,
  TuiErrorModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TUI_DATE_SEPARATOR,
  TUI_IS_MOBILE,
  tuiControlValue,
  TuiDay,
  TuiDestroyService,
  tuiPure,
} from '@taiga-ui/cdk';
import { DisabledControlModule } from '@vcb/shared/directives';
import { NativeDateTransformerModule } from './native-date-transformer.module';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiMobileCalendarDialogComponent } from '@taiga-ui/addon-mobile';
import { map, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'vcb-input-date',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiInputDateModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextfieldControllerModule,
    DisabledControlModule,
    NativeDateTransformerModule,
    TuiLoaderModule,
  ],
  templateUrl: './input-date.component.html',
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
    { provide: TUI_DATE_SEPARATOR, useValue: `/` },
    TuiDestroyService,
  ],
})
export class InputDateComponent implements ControlValueAccessor, AfterViewInit {
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
    @Inject(TUI_IS_MOBILE) private isMobile: boolean,
    @Inject(TuiDialogService) private dialogService: TuiDialogService,
    @Inject(Injector) private injector: Injector,
    @Inject(TuiDestroyService) private destroy$: TuiDestroyService
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
    const content = new PolymorpheusComponent(
      TuiMobileCalendarDialogComponent,
      computedInjector
    );

    this.dialog$ = this.dialogService.open(content, {
      size: `fullscreen`,
      closeable: false,
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
      this.dialog$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
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
