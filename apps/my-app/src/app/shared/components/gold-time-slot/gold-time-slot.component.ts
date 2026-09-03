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
import { TuiError, TuiLoader, TUI_VALIDATION_ERRORS } from '@taiga-ui/core';
import { ClickStopPropagationDirective } from '@app/shared/directives';

export interface GoldTimeSlot {
  label: string;
  value: number;
}

// TODO: thay bằng dữ liệu thật từ @app/http-access/customer/models khi lib đó được tạo
const LabelByTimeSlotIdGold: Record<number, string> = {
  3: '09:00 - 10:00',
  4: '10:00 - 11:00',
  5: '11:00 - 12:00',
  6: '13:00 - 14:00',
  7: '14:00 - 15:00',
  8: '15:00 - 16:00',
  9: '16:00 - 17:00',
  10: '17:00 - 18:00',
};

const MorningSlots: GoldTimeSlot[] = [
  { value: 3, label: LabelByTimeSlotIdGold[3] },
  { value: 4, label: LabelByTimeSlotIdGold[4] },
  { value: 5, label: LabelByTimeSlotIdGold[5] },
];

const AfternoonSlots: GoldTimeSlot[] = [
  { value: 6, label: LabelByTimeSlotIdGold[6] },
  { value: 7, label: LabelByTimeSlotIdGold[7] },
  { value: 8, label: LabelByTimeSlotIdGold[8] },
  { value: 9, label: LabelByTimeSlotIdGold[9] },
  { value: 10, label: LabelByTimeSlotIdGold[10] },
];

@Component({
  selector: 'vcb-gold-time-slot',
  imports: [
    CommonModule,
    ...TuiError,
    ReactiveFormsModule,
    ClickStopPropagationDirective,
    TuiLoader,
  ],
  templateUrl: './gold-time-slot.component.html',
  styleUrl: './gold-time-slot.component.scss',
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
