import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
  checked = input(false);
  disabled = input(false);
  ariaLabel = input('Toggle');

  readonly checkedChange = output<boolean>();

  protected onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checkedChange.emit(!this.checked());
  }
}
