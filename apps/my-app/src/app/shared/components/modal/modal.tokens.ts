import { InjectionToken } from '@angular/core';

/** Token để inject data vào component bên trong modal */
export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');

/** Token để inject hàm close vào component bên trong modal */
export const MODAL_CLOSE_FN = new InjectionToken<(result?: any) => void>('MODAL_CLOSE_FN');
