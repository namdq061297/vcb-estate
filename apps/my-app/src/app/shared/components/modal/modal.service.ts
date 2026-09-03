import {
  Injectable,
  ApplicationRef,
  Injector,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { ModalConfig, ModalRef } from './modal.types';
import { ModalWrapperComponent } from './modal-wrapper.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private openCount = 0;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector
  ) {}

  /**
   * Mở một modal với config tuỳ chọn.
   *
   * @example
   * const ref = this.modalService.open<InputType, OutputType>({
   *   title: 'Chỉnh sửa',
   *   component: EditUserComponent,
   *   data: { userId: 1 },
   * });
   *
   * const result = await ref.afterClosed$;
   * if (result) { ... }
   */
  open<TInput = any, TOutput = any>(config: ModalConfig<TInput>): ModalRef<TOutput> {
    const instanceId = `modal-${Date.now()}-${++this.openCount}`;

    let resolveClose!: (value: TOutput | undefined) => void;
    const afterClosed$ = new Promise<TOutput | undefined>((res) => {
      resolveClose = res;
    });

    // Tạo host element gắn vào body
    const hostEl = document.createElement('div');
    hostEl.setAttribute('id', instanceId);
    document.body.appendChild(hostEl);
    document.body.style.overflow = 'hidden';

    const close = (result?: TOutput) => {
      this.destroyModal(hostEl, compRef);
      resolveClose(result);
    };

    // Tạo ModalWrapperComponent động
    const compRef = createComponent(ModalWrapperComponent, {
      environmentInjector: this.envInjector,
      hostElement: hostEl,
    });

    compRef.setInput('config', config);
    compRef.setInput('instanceId', instanceId);
    compRef.setInput('closeFn', close);

    this.appRef.attachView(compRef.hostView);
    compRef.changeDetectorRef.detectChanges();

    return { afterClosed$, close };
  }

  private destroyModal(hostEl: HTMLElement, compRef: any): void {
    this.appRef.detachView(compRef.hostView);
    compRef.destroy();
    hostEl.remove();

    // Khôi phục scroll nếu không còn modal nào
    const remaining = document.querySelectorAll('[id^="modal-"]');
    if (remaining.length === 0) {
      document.body.style.overflow = '';
    }
  }
}
