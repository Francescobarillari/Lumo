import {
  HttpClient,
  init_http
} from "./chunk-KDPE43GH.js";
import {
  Injectable,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// src/services/auth.service.ts
var AuthService;
var init_auth_service = __esm({
  "src/services/auth.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    AuthService = class AuthService2 {
      http;
      baseUrl = "http://localhost:8080/api/auth";
      constructor(http) {
        this.http = http;
      }
      signUp(payload) {
        console.log("Payload inviato:", payload);
        return this.http.post(`${this.baseUrl}/signup`, payload);
      }
      login(payload) {
        return this.http.post(`${this.baseUrl}/login`, payload);
      }
      loginWithGoogle(payload) {
        return this.http.post(`${this.baseUrl}/login/google`, payload);
      }
      loginWithGoogleCode(payload) {
        return this.http.post(`${this.baseUrl}/login/google/code`, payload);
      }
      requestPasswordReset(payload) {
        return this.http.post(`${this.baseUrl}/password-reset/request`, payload);
      }
      confirmPasswordReset(payload) {
        return this.http.post(`${this.baseUrl}/password-reset/confirm`, payload);
      }
      verifyEmail(token) {
        return this.http.get(`${this.baseUrl}/verify?token=${token}`);
      }
      resendEmail(payload) {
        return this.http.post(`${this.baseUrl}/resend-token`, payload);
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    AuthService = __decorate([
      Injectable({ providedIn: "root" })
    ], AuthService);
  }
});

export {
  AuthService,
  init_auth_service
};
//# sourceMappingURL=chunk-4RP5LXF2.js.map
