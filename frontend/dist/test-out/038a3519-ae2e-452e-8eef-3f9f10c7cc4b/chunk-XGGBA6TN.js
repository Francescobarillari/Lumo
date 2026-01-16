import {
  Environment,
  init_environment
} from "./chunk-LIEZZHZR.js";
import {
  Injectable,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __esm
} from "./chunk-6TRXNEZQ.js";

// src/validators/validators.ts
function onlyLettersValidator(control) {
  const value = control.value?.trim();
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? null : { onlyLetters: true };
}
function adultValidator(control) {
  const value = control.value;
  if (!value)
    return { adult: true };
  const birthDate = new Date(value);
  const today = /* @__PURE__ */ new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18)
    return { adult: true };
  return null;
}
function emailFormatValidator(control) {
  const value = control.value?.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? null : { emailInvalid: true };
}
function strongPasswordValidator(control) {
  const value = control.value;
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(value) ? null : { weakPassword: true };
}
var init_validators = __esm({
  "src/validators/validators.ts"() {
    "use strict";
  }
});

// src/services/google-identity.service.ts
var GoogleIdentityService;
var init_google_identity_service = __esm({
  "src/services/google-identity.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_environment();
    GoogleIdentityService = class GoogleIdentityService2 {
      scriptLoadingPromise = null;
      loadScript() {
        if (this.scriptLoadingPromise)
          return this.scriptLoadingPromise;
        this.scriptLoadingPromise = new Promise((resolve, reject) => {
          if (document.getElementById("google-identity")) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.id = "google-identity";
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Unable to load Google Identity Services"));
          document.head.appendChild(script);
        });
        return this.scriptLoadingPromise;
      }
      getAuthCode() {
        return __async(this, null, function* () {
          yield this.loadScript();
          if (!Environment.googleClientId) {
            throw new Error("Configure the Google Client ID.");
          }
          const redirectUri = Environment.googleRedirectUri || window.location.origin;
          return new Promise((resolve, reject) => {
            const client = google.accounts.oauth2.initCodeClient({
              client_id: Environment.googleClientId,
              scope: "openid email profile",
              ux_mode: "popup",
              redirect_uri: redirectUri,
              state: "signin",
              callback: (response) => {
                if (response && response.code) {
                  resolve(response.code);
                } else if (response && response.error) {
                  const err = new Error(response.error_description || response.error || "Google sign-in cancelled.");
                  err.code = response.error;
                  reject(err);
                } else {
                  reject(new Error("Google sign-in cancelled."));
                }
              }
            });
            client.requestCode();
          });
        });
      }
      getIdToken() {
        return __async(this, null, function* () {
          yield this.loadScript();
          if (!Environment.googleClientId) {
            throw new Error("Configure the Google Client ID.");
          }
          return new Promise((resolve, reject) => {
            let handled = false;
            const mapReason = (reason) => {
              const normalized = (reason || "").toLowerCase();
              if (normalized.includes("invalid"))
                return { message: "Configure the Google Client ID.", code: "google_config" };
              if (normalized.includes("missing"))
                return { message: "Configure the Google Client ID.", code: "google_config" };
              if (normalized.includes("suppressed"))
                return { message: "Google sign-in cancelled: Google suppressed the prompt (cookie).", code: "google_cancelled" };
              if (normalized.includes("user_cancel"))
                return { message: "Google sign-in cancelled by the user.", code: "google_cancelled" };
              return { message: "Google sign-in cancelled.", code: "google_cancelled" };
            };
            const finish = (error, credential) => {
              if (handled)
                return;
              handled = true;
              if (credential)
                resolve(credential);
              else {
                const message = typeof error === "string" ? error : error?.message;
                const code = typeof error === "string" ? void 0 : error?.code;
                const errObj = new Error(message || "Google sign-in cancelled.");
                if (code)
                  errObj.code = code;
                reject(errObj);
              }
            };
            google.accounts.id.initialize({
              client_id: Environment.googleClientId,
              callback: (response) => {
                if (response && response.credential) {
                  finish(void 0, response.credential);
                } else {
                  finish({ message: "Google sign-in cancelled.", code: "google_cancelled" });
                }
              },
              ux_mode: "popup",
              use_fedcm_for_prompt: true,
              itp_support: true,
              cancel_on_tap_outside: true,
              auto_select: false
            });
            google.accounts.id.prompt((notification) => {
              const notDisplayed = notification?.isNotDisplayed?.();
              const skipped = notification?.isSkippedMoment?.();
              if (notDisplayed || skipped) {
                const reason = notification?.getNotDisplayedReason?.() || notification?.getSkippedReason?.() || "Google sign-in cancelled.";
                finish(mapReason(reason));
              }
            });
          });
        });
      }
    };
    GoogleIdentityService = __decorate([
      Injectable({ providedIn: "root" })
    ], GoogleIdentityService);
  }
});

export {
  onlyLettersValidator,
  adultValidator,
  emailFormatValidator,
  strongPasswordValidator,
  init_validators,
  GoogleIdentityService,
  init_google_identity_service
};
//# sourceMappingURL=chunk-XGGBA6TN.js.map
