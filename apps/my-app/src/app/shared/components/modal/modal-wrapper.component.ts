import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Injector,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfig } from './modal.types';
import { MODAL_CLOSE_FN, MODAL_DATA } from './modal.tokens';
import 'iconify-icon';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  @Input() config!: ModalConfig;
  @Input() instanceId!: string;
  @Input() closeFn!: (result?: any) => void;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.renderInnerComponent();
  }

  ngOnDestroy(): void {
    this.contentHost.clear();
  }

  private renderInnerComponent(): void {
    const childInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: MODAL_DATA, useValue: this.config.data },
        { provide: MODAL_CLOSE_FN, useValue: (result?: any) => this.closeFn(result) },
      ],
    });

    const ref = this.contentHost.createComponent(this.config.component, {
      injector: childInjector,
    });

    // Truyền closeModal callback vào instance nếu có
    const instance = ref.instance;
    if (typeof instance.closeModal === 'undefined') {
      instance.closeModal = (result?: any) => this.closeFn(result);
    }

    ref.changeDetectorRef.markForCheck();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.config.closeOnBackdrop !== false) {
      this.closeFn(undefined);
    }
  }

  onClose(): void {
    this.closeFn(undefined);
  }
}
