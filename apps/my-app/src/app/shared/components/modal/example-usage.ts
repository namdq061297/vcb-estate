// ─────────────────────────────────────────────────────────────────
// EXAMPLE: confirm-delete.component.ts
// Component hiển thị bên trong modal
// ─────────────────────────────────────────────────────────────────
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODAL_CLOSE_FN, MODAL_DATA } from './modal.tokens';
import { ModalService } from './modal.service';

export interface ConfirmDeleteInput {
  itemName: string;
}

export interface ConfirmDeleteOutput {
  confirmed: boolean;
}

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="message">
      Bạn có chắc muốn xoá <strong>{{ data.itemName }}</strong> không?
      Hành động này không thể hoàn tác.
    </p>
    <div class="actions">
      <button class="btn btn-ghost" (click)="cancel()">Huỷ</button>
      <button class="btn btn-danger" (click)="confirm()">Xoá</button>
    </div>
  `,
  styles: [`
    .message { margin: 0 0 24px; color: #374151; line-height: 1.6; }
    .actions { display: flex; gap: 10px; justify-content: flex-end; }
    .btn { padding: 8px 18px; border-radius: 8px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; }
    .btn-ghost { background: #f3f4f6; color: #374151; }
    .btn-ghost:hover { background: #e5e7eb; }
    .btn-danger { background: #ef4444; color: #fff; }
    .btn-danger:hover { background: #dc2626; }
  `],
})
export class ConfirmDeleteComponent {
  // Inject data và close function từ modal service
  data = inject<ConfirmDeleteInput>(MODAL_DATA);
  private closeFn = inject<(r?: ConfirmDeleteOutput) => void>(MODAL_CLOSE_FN);

  confirm() { this.closeFn({ confirmed: true }); }
  cancel()  { this.closeFn({ confirmed: false }); }
}


// ─────────────────────────────────────────────────────────────────
// EXAMPLE: parent.component.ts
// Component gọi modal
// ─────────────────────────────────────────────────────────────────


@Component({
  selector: 'app-parent',
  standalone: true,
  template: `
    <button (click)="openDeleteModal()">Xoá item</button>
  `,
})
export class ParentComponent {
  private modalService = inject(ModalService);

  async openDeleteModal() {
    const ref = this.modalService.open<ConfirmDeleteInput, ConfirmDeleteOutput>({
      title: 'Xác nhận xoá',
      component: ConfirmDeleteComponent,
      data: { itemName: 'Sản phẩm A' },
      width: '420px',
      closeOnBackdrop: true,
    });

    // Chờ kết quả (output) từ modal
    const result = await ref.afterClosed$;

    if (result?.confirmed) {
      console.log('Đã xác nhận xoá!');
      // gọi API xoá...
    } else {
      console.log('Người dùng huỷ.');
    }
  }
}
