import { signal } from '@angular/core';

export const loadingVisible = signal(false);

let requestCount = 0;

export function showLoading(): void {
  requestCount += 1;
  loadingVisible.set(true);
}

export function hideLoading(): void {
  requestCount = Math.max(requestCount - 1, 0);

  if (requestCount === 0) {
    loadingVisible.set(false);
  }
}
