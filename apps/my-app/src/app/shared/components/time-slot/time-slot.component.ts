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
import { ErrorMessages } from '../form-controls.const';
import { TuiError, TUI_VALIDATION_ERRORS } from '@taiga-ui/core';
import { ClickStopPropagationDirective } from '@app/shared/directives';

export interface TimeSlot {
  label: string;
  value: number;
}

const MAX_SELECTED = 2;

// TODO: thay bằng dữ liệu thật từ @app/http-access/customer/models khi lib đó được tạo
const LabelByTimeSlotId: Record<number, string> = {
  1: '07:00 - 08:00',
  2: '08:00 - 09:00',
  3: '09:00 - 10:00',
  4: '10:00 - 11:00',
  5: '13:00 - 14:00',
  6: '14:00 - 15:00',
  7: '15:00 - 16:00',
  8: '16:00 - 17:00',
};

const TimeSlots: TimeSlot[] = [
  { value: 1, label: LabelByTimeSlotId[1] },
  { value: 2, label: LabelByTimeSlotId[2] },
  { value: 3, label: LabelByTimeSlotId[3] },
  { value: 4, label: LabelByTimeSlotId[4] },
  { value: 5, label: LabelByTimeSlotId[5] },
  { value: 6, label: LabelByTimeSlotId[6] },
  { value: 7, label: LabelByTimeSlotId[7] },
  { value: 8, label: LabelByTimeSlotId[8] },
];

@Component({
  selector: 'vcb-time-slot',
  imports: [
    CommonModule,
    ...TuiError,
    ReactiveFormsModule,
    ClickStopPropagationDirective,
  ],
  templateUrl: './time-slot.component.html',
  styleUrl: './time-slot.component.scss',
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
