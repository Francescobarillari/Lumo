import {
  ResponsiveService,
  init_responsive_service
} from "./chunk-JGCT3QTW.js";
import {
  MatIconModule,
  init_icon
} from "./chunk-TAO542U6.js";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/components/verify-email-popup/verify-email-popup.html
var verify_email_popup_default;
var init_verify_email_popup = __esm({
  "angular:jit:template:src/components/verify-email-popup/verify-email-popup.html"() {
    verify_email_popup_default = `<div class="backdrop" [class.mobile]="responsive.screen() === 'mobile'" 
  [class.tablet]="responsive.screen() === 'tablet'" 
  [class.desktop]="responsive.screen() === 'desktop'"></div>

<div class="popup-container" [class.mobile]="responsive.screen() === 'mobile'" 
  [class.tablet]="responsive.screen() === 'tablet'" 
  [class.desktop]="responsive.screen() === 'desktop'">
    <div class="popup-content">
      <button class="close-btn close" (click)="closePopup()">
        <mat-icon>close</mat-icon>
      </button>
      <div class="header">
        <h1>Verify your email</h1>
        @if (verified) {<p class="success">You have been successfully registered</p>}
        @else {<p>Check your email and click the button</p>}
      </div>
      <a class="button" (click)="resend()">Resend verification email</a>
    </div>
</div>
`;
  }
});

// angular:jit:style:src/components/verify-email-popup/verify-email-popup.css
var verify_email_popup_default2;
var init_verify_email_popup2 = __esm({
  "angular:jit:style:src/components/verify-email-popup/verify-email-popup.css"() {
    verify_email_popup_default2 = "/* src/components/verify-email-popup/verify-email-popup.css */\n.backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: 900;\n}\n.popup-container.desktop {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 950;\n}\n.popup-container.desktop .popup-content {\n  position: relative;\n  align-items: center;\n  width: 30%;\n  height: auto;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: 40px;\n  border: var(--modal-border);\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.popup-container.tablet {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 950;\n}\n.popup-container.tablet .popup-content {\n  position: relative;\n  align-items: center;\n  width: 40%;\n  height: auto;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: 40px;\n  border: var(--modal-border);\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.backdrop.mobile {\n  display: none;\n}\n.popup-container.mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100vw;\n  height: 100vh;\n}\n.popup-container.mobile .popup-content {\n  position: fixed;\n  background: var(--modal-surface);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: 1.5rem;\n  height: 100%;\n  width: 100%;\n  border-radius: 0;\n  overflow-y: auto;\n  gap: 24px;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.close {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n}\n.header {\n  text-align: center;\n}\n.error {\n  color: var(--color-error);\n}\n.success {\n  color: #14c972;\n}\n/*# sourceMappingURL=verify-email-popup.css.map */\n";
  }
});

// src/components/verify-email-popup/verify-email-popup.ts
var VerifyEmailPopup;
var init_verify_email_popup3 = __esm({
  "src/components/verify-email-popup/verify-email-popup.ts"() {
    "use strict";
    init_tslib_es6();
    init_verify_email_popup();
    init_verify_email_popup2();
    init_core();
    init_responsive_service();
    init_icon();
    VerifyEmailPopup = class VerifyEmailPopup2 {
      responsive;
      email;
      token;
      verified = false;
      close = new EventEmitter();
      resendVerification = new EventEmitter();
      constructor(responsive) {
        this.responsive = responsive;
      }
      onClose() {
        this.close.emit();
      }
      resend() {
        this.resendVerification.emit();
      }
      closePopup() {
        this.close.emit();
      }
      static ctorParameters = () => [
        { type: ResponsiveService }
      ];
      static propDecorators = {
        email: [{ type: Input }],
        token: [{ type: Input }],
        verified: [{ type: Input }],
        close: [{ type: Output }],
        resendVerification: [{ type: Output }]
      };
    };
    VerifyEmailPopup = __decorate([
      Component({
        selector: "VerifyEmailPopup",
        standalone: true,
        imports: [MatIconModule],
        template: verify_email_popup_default,
        styles: [verify_email_popup_default2]
      })
    ], VerifyEmailPopup);
  }
});

export {
  VerifyEmailPopup,
  init_verify_email_popup3 as init_verify_email_popup
};
//# sourceMappingURL=chunk-VAYPB4TI.js.map
