import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectItem } from './type';
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
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import {
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { ErrorMessages } from '../const';
import {
  TuiContextWithImplicit,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { DisabledControlModule } from '@vcb/shared/directives';

@Component({
  selector: 'vcb-select',
  standalone: true,
  imports: [
    CommonModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiLabelModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiDataListModule,
    TuiLoaderModule,
    DisabledControlModule,
  ],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input()
  formControl!: FormControl;
  @Input()
  formControlName = '';

  @Input() items: SelectItem<any>[] = [];
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

  @tuiPure
  stringify(
    items: readonly SelectItem<any>[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ value, label }) => [value, label] as [any, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<number>) =>
      map.get($implicit) || ``;
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
}
