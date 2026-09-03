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
  TuiInputModule,
} from '@taiga-ui/kit';
import { ErrorMessages } from '../const';
import {
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { DisabledControlModule } from '@vcb/shared/directives';

@Component({
  selector: 'vcb-input',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    DisabledControlModule,
  ],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input() formControl!: FormControl;
  @Input() formControlName = '';

  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabledControl = false;
  @Input() maxLength = 0;

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

  modelChange() {
    if (this.maxLength && this.control.value && this.control.value.length > this.maxLength) {
      const value = this.control.value.substring(0, this.maxLength);
      this.control.setValue(value, {onlySelf: true});
    }
  }
}
