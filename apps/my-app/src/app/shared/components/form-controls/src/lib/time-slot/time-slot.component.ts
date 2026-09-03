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
import { TuiErrorModule, TuiLabelModule } from '@taiga-ui/core';
import { TimeSlots } from './const';
import { ClickStopPropagationModule } from '@vcb/shared/directives';

const MAX_SELECTED = 2;

@Component({
  selector: 'vcb-time-slot',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiErrorModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiFilterModule,
    ClickStopPropagationModule,
  ],
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeSlotComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class TimeSlotComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';

  @Input() placeholder = '';
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

  private _allowMultipleSelect = true;
  get allowMultipleSelect() {
    return this._allowMultipleSelect;
  }
  @Input() set allowMultipleSelect(value: boolean) {
    this._allowMultipleSelect = value;
    if (!value && this.control.value.length) {
      this.control.setValue([]);
    }
  }

  get required() {
    return this.control.hasValidator(Validators.required);
  }
  TimeSlots = TimeSlots;

  selected = true;

  get control(): FormControl {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }

  constructor(protected controlContainer: ControlContainer) {}

  onTimeSlotSelect(id: number) {
    const value = this.control.value;
    if (!this.allowMultipleSelect) {
      this.control.setValue(value.length && value[0] === id ? [] : [id]);
    } else {
      if (value.includes(id)) {
        this.control.setValue(value.filter((i: unknown) => i !== id));
      } else if (value.length < MAX_SELECTED) {
        this.control.setValue([...value, id]);
      }
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
}
