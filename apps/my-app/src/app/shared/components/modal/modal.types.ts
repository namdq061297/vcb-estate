import { Type, ComponentRef } from '@angular/core';

export interface ModalConfig<TInput = any> {
  /** Tiêu đề hiển thị trên header modal */
  title: string;
  /** Component sẽ render bên trong modal */
  component: Type<any>;
  /** Data truyền vào component (input) */
  data?: TInput;
  /** Chiều rộng modal, vd: '500px', '80vw'. Mặc định: '520px' */
  width?: string;
  /** Có thể đóng bằng cách click backdrop không. Mặc định: true */
  closeOnBackdrop?: boolean;
  /** Có hiện nút close góc phải không. Mặc định: true */
  showCloseButton?: boolean;
}

export interface ModalRef<TOutput = any> {
  /** Observable phát ra data khi modal đóng */
  afterClosed$: Promise<TOutput | undefined>;
  /** Đóng modal từ bên ngoài, truyền data tùy chọn */
  close: (result?: TOutput) => void;
}

/** Interface component bên trong modal nên implement để gửi data ra ngoài */
export interface ModalInnerComponent<TInput = any, TOutput = any> {
  /** Data nhận vào (inject từ MODAL_DATA token) */
  modalData?: TInput;
  /** Gọi hàm này để đóng modal và trả data */
  closeModal?: (result?: TOutput) => void;
}
