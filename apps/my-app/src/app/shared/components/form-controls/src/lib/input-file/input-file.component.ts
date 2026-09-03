import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
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
  tuiGetAcceptArray,
  TuiInputFilesModule,
} from '@taiga-ui/kit';
import { ErrorMessages } from '../const';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiDroppableModule } from '@taiga-ui/cdk';
import { FileSizePipe } from '@vcb/shared/pipes';

@Component({
  selector: 'vcb-input-file',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiErrorModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiDroppableModule,
    TuiInputFilesModule,
    TuiLinkModule,
    TuiLoaderModule,
    TuiButtonModule,
    FileSizePipe,
  ],
  templateUrl: './input-file.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: ErrorMessages,
    },
  ],
})
export class InputFileComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input() formControl!: FormControl;
  @Input() formControlName = '';
  @Input() label = '';
  @Input() disabledControl = false;

  @Input() multiple = false;
  @Input() accept = '';
  @Input() maxFileSizeInMb = 10;
  @Output() reject = new EventEmitter<File[]>();
  maxFileSize = false;
  invalidFileType = false;

  get required() {
    return this.control.hasValidator(Validators.required);
  }
  private dataTransfer: DataTransfer | null = null;

  get control(): FormControl {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }

  get fileDragged(): boolean {
    return !!this.dataTransfer?.types.includes(`Files`);
  }

  constructor(protected controlContainer: ControlContainer) {}

  private processSelectedFiles(files: FileList | null): void {
    // IE11 after selecting a file through the open dialog generates a second event passing an empty FileList.
    if (!files?.length) {
      return;
    }
    this.maxFileSize = false;
    this.invalidFileType = false;
    const newFiles = this.multiple ? Array.from(files) : [Array.from(files)[0]];
    const tooBigFiles = newFiles.filter(
      (file) => file.size > this.maxFileSizeInMb * 1024 * 1024
    );
    const wrongFormatFiles = newFiles.filter(
      (file) => !this.isFormatAcceptable(file) && !tooBigFiles.includes(file)
    );
    const acceptedFiles = newFiles.filter(
      (file) => !tooBigFiles.includes(file) && !wrongFormatFiles.includes(file)
    );

    if (tooBigFiles.length || wrongFormatFiles.length) {
      this.maxFileSize = Boolean(tooBigFiles.length);
      this.invalidFileType = Boolean(wrongFormatFiles.length);
      this.reject.emit([...tooBigFiles, ...wrongFormatFiles]);
    }

    this.control.setValue(
      this.multiple
        ? [
            ...(Array.isArray(this.control.value) ? this.control.value : []),
            ...acceptedFiles,
          ]
        : acceptedFiles[0]
        ? [acceptedFiles[0]]
        : null
    );
    this.control.markAsTouched();
  }

  private isFormatAcceptable(file: File): boolean {
    if (!this.accept) {
      return true;
    }

    const extension = `.${(file.name.split(`.`).pop() || ``).toLowerCase()}`;

    return tuiGetAcceptArray(this.accept).some(
      (format) =>
        format === extension ||
        format === file.type ||
        (format.split(`/`)[1] === `*` &&
          file.type.split(`/`)[0] === format.split(`/`)[0])
    );
  }

  onChange($event: Event) {
    const element = $event.target as HTMLInputElement;
    this.processSelectedFiles(element.files);
  }

  onDropped(event: DataTransfer) {
    this.processSelectedFiles(event.files);
  }

  onDragOver(dataTransfer: DataTransfer | null) {
    this.dataTransfer = dataTransfer;
  }

  removeFile(i: number) {
    if (!this.multiple) {
      this.control.setValue(null);
    } else {
      const value = this.control.value;
      value.splice(i, 1);
      this.control.setValue(value.length ? value : null);
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
