import { Injectable } from '@angular/core';
import { Environment } from '../environment/environment';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private scriptLoadingPromise: Promise<void> | null = null;

  private loadScript(): Promise<void> {
    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      if (document.getElementById('google-identity')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Impossibile caricare Google Identity Services'));
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  async getIdToken(): Promise<string> {
    await this.loadScript();

    if (!Environment.googleClientId) {
      throw new Error('Configura il Google Client ID.');
    }

    return new Promise((resolve, reject) => {
      let handled = false;
      const finish = (errorMessage?: string, credential?: string) => {
        if (handled) return;
        handled = true;
        if (credential) resolve(credential);
        else reject(new Error(errorMessage || 'Accesso Google annullato.'));
      };

      google.accounts.id.initialize({
        client_id: Environment.googleClientId,
        callback: (response: any) => {
          if (response && response.credential) {
            finish(undefined, response.credential);
          } else {
            finish('Accesso Google annullato.');
          }
        },
        cancel_on_tap_outside: true,
        auto_select: false
      });

      google.accounts.id.prompt((notification: any) => {
        const notDisplayed = notification?.isNotDisplayed?.();
        const skipped = notification?.isSkippedMoment?.();
        if (notDisplayed || skipped) {
          const reason =
            notification?.getNotDisplayedReason?.() ||
            notification?.getSkippedReason?.() ||
            'Accesso Google annullato.';
          finish(reason);
        }
      });
    });
  }
}
