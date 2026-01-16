import {
  GoogleIdentityService,
  adultValidator,
  emailFormatValidator,
  init_google_identity_service,
  init_validators,
  onlyLettersValidator,
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

// angular:jit:template:src/components/sign-up-popup/sign-up-popup.html
var sign_up_popup_default;
var init_sign_up_popup = __esm({
  "angular:jit:template:src/components/sign-up-popup/sign-up-popup.html"() {
    sign_up_popup_default = `<div class="backdrop" (click)="closePopup()" [class.mobile]="responsive.screen() === 'mobile'"
  [class.tablet]="responsive.screen() === 'tablet'" [class.desktop]="responsive.screen() === 'desktop'"></div>

<div class="popup-container" [class.mobile]="responsive.screen() === 'mobile'"
  [class.tablet]="responsive.screen() === 'tablet'" [class.desktop]="responsive.screen() === 'desktop'">

  <div class="mobile-popup-container">
    <div class="mobile-header">
      <mat-icon (click)="closePopup()">arrow_back</mat-icon>
      <h1>Sign Up</h1>
    </div>

    <div class="centered-content">
      <div class="popup-content">
        <button class="close-btn close" (click)="closePopup()">
          <mat-icon>close</mat-icon>
        </button>

        <div class="header desktop-header">
          <h1>Join LUMO</h1>
          @if(generalError) { <p class="error">{{ generalError }}</p> }
          @else if(errors['name']) { <p class="error">{{ errors['name'] }}</p> }
          @else if(errors['birthdate']) { <p class="error">{{ errors['birthdate'] }}</p> }
          @else if(errors['email']) { <p class="error">{{ errors['email'] }}</p> }
          @else if(errors['password']) { <p class="error">{{ errors['password'] }}</p> }
          @else {<p>Start joining events</p>}
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <FormField [error]="hasError('name')" [control]="form.get('name')!" [type]="'text'" placeholder="Full name">
          </FormField>
          <FormField [error]="hasError('birthdate')" [control]="form.get('birthdate')!" [type]="'date'"
            placeholder="Birthday"></FormField>
          <FormField [error]="hasError('email')" [control]="form.get('email')!" [type]="'text'" placeholder="Email">
          </FormField>
          <FormField [error]="hasError('password')" [control]="form.get('password')!" [type]="'password'"
            placeholder="Password" [showToggle]="true"></FormField>
          <button type="submit" class="button">Sign Up</button>
        </form>

        <div class="other-sign-up-methods">
          <p>or sign up with</p>
          <a class="button generic" (click)="signUpWithGoogle()">
            <img class="google-logo" src="assets/img/google-logo.webp" height="20" />
          </a>
        </div>

        <p>
          Already have an account?
          <span class="click-text" (click)="goToSignIn()">Sign In</span>
        </p>
      </div>
    </div>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/components/sign-up-popup/sign-up-popup.css
var sign_up_popup_default2;
var init_sign_up_popup2 = __esm({
  "angular:jit:style:src/components/sign-up-popup/sign-up-popup.css"() {
    sign_up_popup_default2 = "/* src/components/sign-up-popup/sign-up-popup.css */\n.backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: var(--z-backdrop);\n}\n.popup-container.desktop {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: var(--z-popup);\n}\n.popup-container.desktop .popup-content {\n  position: relative;\n  align-items: center;\n  width: 30%;\n  height: auto;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: var(--spacing-2xl) 5%;\n  border: var(--modal-border);\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-lg);\n}\n.popup-container.tablet,\n.popup-container.mobile {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100vw;\n  height: 100vh;\n  z-index: var(--z-popup);\n}\n.popup-container.tablet .popup-content,\n.popup-container.mobile .popup-content {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: var(--spacing-2xl);\n  height: 100%;\n  width: 100%;\n  background: var(--modal-surface);\n  border-radius: 0;\n  overflow-y: auto;\n  gap: var(--spacing-lg);\n  border: none;\n}\n.popup-container.mobile .mobile-popup-container,\n.popup-container.tablet .mobile-popup-container {\n  background-color: transparent;\n}\n.form {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.form * {\n  width: 100%;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.close {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n}\n.header {\n  text-align: center;\n}\n.google-logo {\n  height: 20px;\n}\n.other-sign-up-methods {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.other-sign-up-methods > * {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--spacing-lg);\n}\n.form-field.error {\n  border: 2px solid var(--color-error);\n}\n.error {\n  color: var(--color-error);\n}\n.mobile-back,\n.mobile-header {\n  display: none;\n}\n.popup-container.mobile .mobile-header,\n.popup-container.tablet .mobile-header {\n  background-color: transparent;\n}\n@media (max-width: 767px) {\n  .popup-container.desktop {\n    display: none;\n  }\n  .popup-container.tablet,\n  .popup-container.mobile {\n    display: flex;\n  }\n  .popup-content {\n    padding: var(--spacing-2xl) var(--spacing-xl);\n    justify-content: flex-start;\n    align-items: center;\n    padding-top: 0;\n  }\n  .header h1 {\n    font-size: 32px;\n  }\n  .header p {\n    font-size: 18px;\n  }\n  .form button.button {\n    height: 60px;\n    font-size: 20px;\n    border-radius: var(--radius-lg);\n  }\n  .close,\n  .desktop-header,\n  .mobile-back {\n    display: none;\n  }\n  .mobile-header {\n    display: flex;\n  }\n}\n/*# sourceMappingURL=sign-up-popup.css.map */\n";
  }
});

// src/components/sign-up-popup/sign-up-popup.ts
var SignUpPopup;
var init_sign_up_popup3 = __esm({
  "src/components/sign-up-popup/sign-up-popup.ts"() {
    "use strict";
    init_tslib_es6();
    init_sign_up_popup();
    init_sign_up_popup2();
    init_core();
    init_responsive_service();
    init_form_field();
    init_forms();
    init_validators();
    init_auth_service();
    init_google_identity_service();
    init_icon();
    init_common();
    init_forms();
    SignUpPopup = class SignUpPopup2 {
      fb;
      auth;
      googleIdentity;
      responsive;
      close = new EventEmitter();
      switchToSignIn = new EventEmitter();
      signUpSuccess = new EventEmitter();
      signInSuccess = new EventEmitter();
      form;
      errors = {};
      generalError = null;
      constructor(fb, auth, googleIdentity, responsive) {
        this.fb = fb;
        this.auth = auth;
        this.googleIdentity = googleIdentity;
        this.responsive = responsive;
        this.form = this.fb.group({
          name: ["", [onlyLettersValidator]],
          birthdate: ["", [adultValidator]],
          email: ["", [emailFormatValidator]],
          password: ["", [strongPasswordValidator]]
        });
      }
      onSubmit() {
        this.errors = {};
        this.generalError = null;
        const controls = this.form.controls;
        const nameErr = onlyLettersValidator(controls["name"]);
        if (nameErr)
          this.errors["name"] = "Il nome deve contenere solo lettere.";
        const birthErr = adultValidator(controls["birthdate"]);
        if (birthErr)
          this.errors["birthdate"] = "Devi essere maggiore di 18 anni.";
        const emailErr = emailFormatValidator(controls["email"]);
        if (emailErr)
          this.errors["email"] = "Email non valida.";
        const passwordErr = strongPasswordValidator(controls["password"]);
        if (passwordErr) {
          this.errors["password"] = "La password deve avere almeno 8 caratteri, una maiuscola, un numero e un simbolo.";
        }
        if (Object.keys(this.errors).length > 0)
          return;
        const payload = {
          name: this.form.value.name,
          birthdate: this.form.value.birthdate,
          email: this.form.value.email,
          password: this.form.value.password
        };
        this.auth.signUp(payload).subscribe({
          next: (res) => {
            this.errors = {};
            this.generalError = null;
            if (!res?.success) {
              this.generalError = res?.error || "Registrazione non riuscita.";
              return;
            }
            this.signUpSuccess.emit({
              email: this.form.value.email,
              token: res?.data?.token || ""
            });
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
      hasError(field) {
        return !!this.errors[field];
      }
      closePopup() {
        this.close.emit();
      }
      goToSignIn() {
        this.switchToSignIn.emit();
      }
      signUpWithGoogle() {
        return __async(this, null, function* () {
          this.errors = {};
          this.generalError = null;
          try {
            const code = yield this.googleIdentity.getAuthCode();
            this.auth.loginWithGoogleCode({ code }).subscribe({
              next: (res) => {
                this.signInSuccess.emit({
                  id: res?.data?.id || "",
                  name: res?.data?.name || "",
                  email: res?.data?.email || ""
                });
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
      static ctorParameters = () => [
        { type: FormBuilder },
        { type: AuthService },
        { type: GoogleIdentityService },
        { type: ResponsiveService }
      ];
      static propDecorators = {
        close: [{ type: Output }],
        switchToSignIn: [{ type: Output }],
        signUpSuccess: [{ type: Output }],
        signInSuccess: [{ type: Output }]
      };
    };
    SignUpPopup = __decorate([
      Component({
        selector: "SignUpPopup",
        standalone: true,
        imports: [FormField, MatIconModule, CommonModule, ReactiveFormsModule],
        template: sign_up_popup_default,
        styles: [sign_up_popup_default2]
      })
    ], SignUpPopup);
  }
});

export {
  SignUpPopup,
  init_sign_up_popup3 as init_sign_up_popup
};
//# sourceMappingURL=chunk-7TVTZCMN.js.map
