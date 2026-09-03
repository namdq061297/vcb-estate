import {
  AfterViewInit,
  Component,
  forwardRef,
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
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiInputNumberModule,
  TuiInputNumberComponent,
} from '@taiga-ui/kit';
import { ErrorMessages, InputNumberMaxValue } from '../const';
import {
  TUI_NUMBER_FORMAT,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { DisabledControlModule } from '@vcb/shared/directives';

@Component({
  selector: 'vcb-input-number',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiErrorModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiInputNumberModule,
    DisabledControlModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './input-number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
    {
      provide: TUI_NUMBER_FORMAT,
      useValue: { decimalSeparator: `.`, thousandSeparator: `,` },
    },
  ],
})
export class InputNumberComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';
  @Input()
  min = 0;
  max = InputNumberMaxValue.amount;

  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabledControl = false;
  @Input() postfix = '';
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

  onValueChange(value: number) {
    this.max = InputNumberMaxValue.amount;
    if (value && value.toString().length === InputNumberMaxValue.length) {
      this.max = Number(value);
    }
  }
}
