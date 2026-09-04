// modal.component.ts
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modalize',
  imports: [CommonModule, IconComponent],
  templateUrl: './modalize.component.html',
  styleUrls: ['./modalize.component.scss'],
})
export class AppModalizeComponent {
  @Input() title = '';
  @Input() open = false;
  @Input() showBackIcon = true;
  @Input() maxWidth = '440px';
  @Input() desktopMaxWidth = '580px';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  // dùng để trigger animation đúng lúc — không cho display:none ngay lập tức
  @HostBinding('class.is-open')
  get isOpenClass(): boolean {
    return this.open;
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit();
  }

  onOverlayMousedown(): void {
    this.close();
  }
}
