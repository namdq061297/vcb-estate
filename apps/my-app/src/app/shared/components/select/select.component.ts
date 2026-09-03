import { tuiPure } from "@taiga-ui/legacy";
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
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { TuiDataList, TuiError, TuiLoader, TUI_VALIDATION_ERRORS, TuiDropdown } from '@taiga-ui/core';
import { ErrorMessages } from '../form-controls.const';
import { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import { DisabledControlDirective } from '@app/shared/directives';

export interface SelectItem<T = string> {
  value: T;
  label: string;
  extras?: { [K: string]: any };
}

@Component({
  selector: 'vcb-select',
  imports: [
    CommonModule,
    ...TuiSelect,
    ReactiveFormsModule,
    TuiDataListWrapper,
    ...TuiError,
    ...TuiDataList,
    TuiLoader,
    DisabledControlDirective,
    TuiDropdown,
    TuiChevron,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
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
  ): TuiStringHandler<TuiContext<number>> {
    const map = new Map(
      items.map(({ value, label }) => [value, label] as [any, string])
    );

    return ({ $implicit }: TuiContext<number>) => map.get($implicit) || ``;
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
