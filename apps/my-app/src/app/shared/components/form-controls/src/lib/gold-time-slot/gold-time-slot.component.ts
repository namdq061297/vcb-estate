import { Component, forwardRef, Input, ViewChild } from '@angular/core';
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
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiFilterModule,
} from '@taiga-ui/kit';
import { ErrorMessages } from '../const';
import {
  TuiErrorModule,
  TuiLabelModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { AfternoonSlots, MorningSlots } from './const';
import { ClickStopPropagationModule } from '@vcb/shared/directives';
import { isFutureOfTimeRange } from '@vcb/utils';

@Component({
  selector: 'vcb-gold-time-slot',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiErrorModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiFilterModule,
    ClickStopPropagationModule,
    TuiLoaderModule,
  ],
  templateUrl: './gold-time-slot.component.html',
  styleUrls: ['./gold-time-slot.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoldTimeSlotComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class GoldTimeSlotComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';

  Slots = [MorningSlots, AfternoonSlots];

  @Input() placeholder = '';
  @Input() disableTimes: number[] = [];
  @Input() label = '';
  private _disabledControl = false;
  get disabledControl() {
    return this._disabledControl;
  }
  @Input() set disabledControl(value: boolean) {
    this._disabledControl = value;
    const action = value ? 'disable' : 'enable';
    if (this.control) {
      (this.control as any)[action]();
    }
  }
  @Input() loading = false;

  get required() {
    return this.control.hasValidator(Validators.required);
  }

  get control(): FormControl {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }

  constructor(protected controlContainer: ControlContainer) {}

  onTimeSlotSelect(id: number) {
    this.control.setValue(id);
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
}
