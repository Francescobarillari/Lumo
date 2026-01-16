import {
  Router,
  init_router
} from "./chunk-YRK3FYDE.js";
import {
  GoogleIdentityService,
  emailFormatValidator,
  init_google_identity_service,
  init_validators,
  strongPasswordValidator
} from "./chunk-XGGBA6TN.js";
import {
  AuthService,
  init_auth_service
} from "./chunk-4RP5LXF2.js";
import {
  FormField,
  init_form_field
} from "./chunk-HXKXDHCN.js";
import {
  FormBuilder,
  ReactiveFormsModule,
  init_forms
} from "./chunk-SRAAVOWE.js";
import {
  ResponsiveService,
  init_responsive_service
} from "./chunk-JGCT3QTW.js";
import {
  MatIconModule,
  init_icon
} from "./chunk-TAO542U6.js";
import {
  CommonModule,
  init_common
} from "./chunk-ZVVPXCFC.js";
import {
  Component,
  EventEmitter,
  Output,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __esm
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/components/sign-in-popup/sign-in-popup.html
var sign_in_popup_default;
var init_sign_in_popup = __esm({
  "angular:jit:template:src/components/sign-in-popup/sign-in-popup.html"() {
    sign_in_popup_default = `<div class="backdrop" (click)="closePopup()" [class.mobile]="responsive.screen() === 'mobile'"
  [class.tablet]="responsive.screen() === 'tablet'" [class.desktop]="responsive.screen() === 'desktop'"></div>

<div class="popup-container" [class.mobile]="responsive.screen() === 'mobile'"
  [class.tablet]="responsive.screen() === 'tablet'" [class.desktop]="responsive.screen() === 'desktop'">

  <div class="mobile-popup-container">
    <div class="mobile-header">
      <mat-icon (click)="closePopup()">arrow_back</mat-icon>
      <h1>Sign In</h1>
    </div>

    <div class="centered-content">
      <div class="popup-content">
        <button class="close-btn close" (click)="closePopup()">
          <mat-icon>close</mat-icon>
        </button>

        <div class="header">
          <h1>Welcome back!</h1>
          @if(generalError) { <p class="error">{{ generalError }}</p> }
          @else if(errors['email']) { <p class="error">{{ errors['email'] }}</p> }
          @else if(errors['password']) { <p class="error">{{ errors['password'] }}</p> }
          @else if(infoMessage) { <p class="info">{{ infoMessage }}</p> }
          @else{<p>Sign in to LUMO</p>}
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <FormField [error]="hasError('email')" [control]="form.get('email')!" placeholder="Email" [type]="'text'"
            [title]="'Email'"></FormField>
          <FormField [error]="hasError('password')" [control]="form.get('password')!" placeholder="Password"
            [type]="'password'" [title]="'Password'" [showToggle]="true"></FormField>
          <p>
            <button type="button" class="click-text text-link" (click)="onForgotPassword()">Forgot password?</button>
          </p>
          <button type="submit" class="button">Sign In</button>
        </form>

        <div class="other-sign-up-methods">
          <p>or sign in with</p>
          <a class="button generic" (click)="signInWithGoogle()">
            <img class="google-logo" src="assets/img/google-logo.webp" height="20" />
          </a>
        </div>

        <p>
          Don\u2019t have an account?
          <span class="click-text" (click)="goToSignUp()">Sign Up</span>
        </p>
      </div>
    </div>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/components/sign-in-popup/sign-in-popup.css
var sign_in_popup_default2;
var init_sign_in_popup2 = __esm({
  "angular:jit:style:src/components/sign-in-popup/sign-in-popup.css"() {
    sign_in_popup_default2 = "/* src/components/sign-in-popup/sign-in-popup.css */\n.backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: var(--z-backdrop);\n}\n.popup-container.desktop {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: var(--z-popup);\n}\n.popup-container.desktop .popup-content {\n  position: relative;\n  align-items: center;\n  width: 30%;\n  height: auto;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: var(--spacing-2xl) 5%;\n  border: var(--modal-border);\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-lg);\n}\n.popup-container.tablet,\n.popup-container.mobile {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100vw;\n  height: 100vh;\n  z-index: var(--z-popup);\n}\n.popup-container.tablet .popup-content,\n.popup-container.mobile .popup-content {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: var(--spacing-2xl);\n  height: 100%;\n  width: 100%;\n  background: var(--modal-surface);\n  border-radius: 0;\n  overflow-y: auto;\n  gap: var(--spacing-lg);\n  border: none;\n}\n.popup-container.mobile .mobile-popup-container,\n.popup-container.tablet .mobile-popup-container {\n  background-color: transparent;\n}\n.form {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.form * {\n  text-align: right;\n  width: 100%;\n}\n.text-link {\n  background: transparent;\n  border: none;\n  padding: 0;\n  font: inherit;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.close {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n}\n.header {\n  text-align: center;\n}\n.google-logo {\n  height: 20px;\n}\n.other-sign-up-methods {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.other-sign-up-methods > * {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.form-field.error {\n  border: 2px solid var(--color-error);\n}\n.error {\n  color: var(--color-error);\n}\n.info {\n  color: var(--color-accent);\n}\n.mobile-back,\n.mobile-header {\n  display: none;\n}\n.popup-container.mobile .mobile-header,\n.popup-container.tablet .mobile-header {\n  background-color: transparent;\n}\n@media (max-width: 767px) {\n  .popup-container.desktop {\n    display: none;\n  }\n  .popup-container.tablet,\n  .popup-container.mobile {\n    display: flex;\n  }\n  .popup-content {\n    padding: var(--spacing-2xl) var(--spacing-xl);\n    justify-content: flex-start;\n    align-items: center;\n    padding-top: 0;\n  }\n  .header h1 {\n    font-size: 32px;\n  }\n  .header p {\n    font-size: 18px;\n  }\n  .form {\n    gap: var(--spacing-xl);\n  }\n  .form button.button {\n    height: 60px;\n    font-size: 20px;\n    border-radius: var(--radius-lg);\n  }\n  .close,\n  .desktop-header,\n  .mobile-back {\n    display: none;\n  }\n  .mobile-header {\n    display: flex;\n  }\n}\n/*# sourceMappingURL=sign-in-popup.css.map */\n";
  }
});

// src/components/sign-in-popup/sign-in-popup.ts
var SignInPopup;
var init_sign_in_popup3 = __esm({
  "src/components/sign-in-popup/sign-in-popup.ts"() {
    "use strict";
    init_tslib_es6();
    init_sign_in_popup();
    init_sign_in_popup2();
    init_core();
    init_router();
    init_responsive_service();
    init_form_field();
    init_validators();
    init_forms();
    init_auth_service();
    init_google_identity_service();
    init_icon();
    init_common();
    init_forms();
    SignInPopup = class SignInPopup2 {
      fb;
      auth;
      googleIdentity;
      router;
      responsive;
      close = new EventEmitter();
      switchToSignUp = new EventEmitter();
      signInSuccess = new EventEmitter();
      form;
      errors = {};
      generalError = null;
      infoMessage = null;
      constructor(fb, auth, googleIdentity, router, responsive) {
        this.fb = fb;
        this.auth = auth;
        this.googleIdentity = googleIdentity;
        this.router = router;
        this.responsive = responsive;
        this.form = this.fb.group({
          email: ["", [emailFormatValidator]],
          password: ["", [strongPasswordValidator]]
        });
      }
      closePopup() {
        this.close.emit();
      }
      goToSignUp() {
        this.switchToSignUp.emit();
      }
      onSubmit() {
        this.errors = {};
        this.generalError = null;
        this.infoMessage = null;
        const controls = this.form.controls;
        const emailErr = emailFormatValidator(controls["email"]);
        if (emailErr)
          this.errors["email"] = "Email non valida.";
        const passwordErr = strongPasswordValidator(controls["password"]);
        if (passwordErr)
          this.errors["password"] = "La password deve avere almeno 8 caratteri, una maiuscola, un numero e un simbolo.";
        if (Object.keys(this.errors).length > 0)
          return;
        const payload = {
          email: this.form.value.email,
          password: this.form.value.password
        };
        this.auth.login(payload).subscribe({
          next: (res) => {
            this.errors = {};
            this.generalError = null;
            this.signInSuccess.emit({
              id: res?.data?.id || "",
              name: res?.data?.name || "",
              email: res?.data?.email || payload.email,
              profileImage: res?.data?.profileImage
            });
            localStorage.setItem("user", JSON.stringify({
              id: res?.data?.id || "",
              name: res?.data?.name || "",
              email: res?.data?.email || payload.email,
              profileImage: res?.data?.profileImage,
              isAdmin: res?.data?.isAdmin
            }));
            if (res?.data?.isAdmin === "true") {
              this.router.navigate(["/admin"]);
            }
            this.closePopup();
          },
          error: (err) => {
            this.errors = {};
            this.generalError = null;
            if (err && typeof err === "object" && "error" in err) {
              const body = err.error;
              if (body && typeof body === "object") {
                if (body.data && typeof body.data === "object") {
                  this.errors = body.data;
                  return;
                }
                if (body.error && typeof body.error === "string") {
                  this.generalError = body.error;
                  return;
                }
              }
              if (typeof err.error === "string") {
                this.generalError = err.error;
                return;
              }
            }
            if (typeof err === "string") {
              this.generalError = err;
              return;
            }
            this.generalError = "Unexpected error.";
            console.warn("Unhandled error shape", err);
          }
        });
      }
      onForgotPassword() {
        this.errors = {};
        this.generalError = null;
        this.infoMessage = null;
        const controls = this.form.controls;
        const emailErr = emailFormatValidator(controls["email"]);
        if (emailErr) {
          this.errors["email"] = "Email non valida.";
          return;
        }
        const payload = { email: this.form.value.email };
        this.auth.requestPasswordReset(payload).subscribe({
          next: () => {
            this.infoMessage = "If the email exists, a reset link has been sent.";
          },
          error: (err) => {
            const body = err?.error;
            if (body?.data && typeof body.data === "object") {
              this.errors = body.data;
              return;
            }
            if (typeof body?.error === "string") {
              this.generalError = body.error;
              return;
            }
            if (typeof err?.error === "string") {
              this.generalError = err.error;
              return;
            }
            if (typeof err === "string") {
              this.generalError = err;
              return;
            }
            this.generalError = "Unable to send reset email.";
          }
        });
      }
      signInWithGoogle() {
        return __async(this, null, function* () {
          this.errors = {};
          this.generalError = null;
          this.infoMessage = null;
          try {
            const code = yield this.googleIdentity.getAuthCode();
            this.auth.loginWithGoogleCode({ code }).subscribe({
              next: (res) => {
                this.signInSuccess.emit({
                  id: res?.data?.id || "",
                  name: res?.data?.name || "",
                  email: res?.data?.email || "",
                  profileImage: res?.data?.profileImage
                });
                localStorage.setItem("user", JSON.stringify(res.data));
                if (res?.data?.isAdmin === "true") {
                  this.router.navigate(["/admin"]);
                }
                this.closePopup();
              },
              error: (err) => {
                const body = err?.error;
                if (body?.data && typeof body.data === "object") {
                  this.errors = body.data;
                  return;
                }
                if (typeof body?.error === "string") {
                  this.generalError = body.error;
                  return;
                }
                this.generalError = "Google sign-in failed.";
              }
            });
          } catch (e) {
            if (e?.code === "google_cancelled") {
              return;
            }
            this.generalError = e?.message || "Google sign-in failed.";
          }
        });
      }
      hasError(field) {
        return !!this.errors[field];
      }
      static ctorParameters = () => [
        { type: FormBuilder },
        { type: AuthService },
        { type: GoogleIdentityService },
        { type: Router },
        { type: ResponsiveService }
      ];
      static propDecorators = {
        close: [{ type: Output }],
        switchToSignUp: [{ type: Output }],
        signInSuccess: [{ type: Output }]
      };
    };
    SignInPopup = __decorate([
      Component({
        selector: "SignInPopup",
        standalone: true,
        imports: [FormField, MatIconModule, CommonModule, ReactiveFormsModule],
        template: sign_in_popup_default,
        styles: [sign_in_popup_default2]
      })
    ], SignInPopup);
  }
});

export {
  SignInPopup,
  init_sign_in_popup3 as init_sign_in_popup
};
//# sourceMappingURL=chunk-34S66VQB.js.map
