import { ChangeDetectionStrategy, Component } from '@angular/core';
import { loadingVisible } from './loading.state';

@Component({
  selector: 'app-loading',
  template: `
    @if (visible()) {
      <div class="app-loading" role="status" aria-live="polite">
        <span class="app-loading__spinner"></span>
        <p class="app-loading__text">Loading</p>
      </div>
    }
  `,
  styles: [
    `
      .app-loading {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(2px);
      }

      .app-loading__spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 4px solid color-mix(in srgb, #006b3b 20%, transparent);
        border-top-color: #006b3b;
        animation: app-loading-spin 0.8s linear infinite;
      }

      .app-loading__text {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #006b3b;
      }

      @keyframes app-loading-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  protected readonly visible = loadingVisible;
}
