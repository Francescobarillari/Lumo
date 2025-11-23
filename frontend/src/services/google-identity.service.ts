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

  async getAuthCode(): Promise<string> {
    await this.loadScript();

    if (!Environment.googleClientId) {
        throw new Error('Configura il Google Client ID.');
    }

    const redirectUri = Environment.googleRedirectUri || window.location.origin;

    return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: Environment.googleClientId,
        scope: 'openid email profile',
        ux_mode: 'popup',
        redirect_uri: redirectUri,
        state: 'signin',
        callback: (response: any) => {
          if (response && response.code) {
            resolve(response.code);
          } else if (response && response.error) {
            const err = new Error(response.error_description || response.error || 'Accesso Google annullato.');
            (err as any).code = response.error;
            reject(err);
          } else {
            reject(new Error('Accesso Google annullato.'));
          }
        }
      });

      client.requestCode();
    });
  }

  async getIdToken(): Promise<string> {
    await this.loadScript();

    if (!Environment.googleClientId) {
      throw new Error('Configura il Google Client ID.');
    }

    return new Promise((resolve, reject) => {
      let handled = false;
      const mapReason = (reason?: string) => {
        const normalized = (reason || '').toLowerCase();
        if (normalized.includes('invalid')) return { message: 'Configura il Google Client ID.', code: 'google_config' };
        if (normalized.includes('missing')) return { message: 'Configura il Google Client ID.', code: 'google_config' };
        if (normalized.includes('suppressed')) return { message: 'Accesso Google annullato: Google ha soppresso il prompt (cookie).', code: 'google_cancelled' };
        if (normalized.includes('user_cancel')) return { message: 'Accesso Google annullato dall’utente.', code: 'google_cancelled' };
        return { message: 'Accesso Google annullato.', code: 'google_cancelled' };
      };
      const finish = (error?: { message: string; code?: string } | string, credential?: string) => {
        if (handled) return;
        handled = true;
        if (credential) resolve(credential);
        else {
          const message = typeof error === 'string' ? error : error?.message;
          const code = typeof error === 'string' ? undefined : error?.code;
          const errObj: any = new Error(message || 'Accesso Google annullato.');
          if (code) errObj.code = code;
          reject(errObj);
        }
      };

      google.accounts.id.initialize({
        client_id: Environment.googleClientId,
        callback: (response: any) => {
          if (response && response.credential) {
            finish(undefined, response.credential);
          } else {
            finish({ message: 'Accesso Google annullato.', code: 'google_cancelled' });
          }
        },
        // Modal popup: evita la soppressione One Tap dovuta a cookie/3rd-party blocking
        ux_mode: 'popup',
        use_fedcm_for_prompt: true,
        itp_support: true,
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
          finish(mapReason(reason));
        }
      });
    });
  }
}
