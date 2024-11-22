import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Notyf } from 'notyf';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private notyf: Notyf | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.notyf = new Notyf();
    }
  }

  showSuccess(message: string): void {
    if (this.notyf) {
      this.notyf.success(message);
    }
  }

  showError(message: string): void {
    if (this.notyf) {
      this.notyf.error(message);
    }
  }
}
