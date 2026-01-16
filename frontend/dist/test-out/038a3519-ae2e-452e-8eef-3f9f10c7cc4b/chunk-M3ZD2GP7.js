import {
  BehaviorSubject,
  Injectable,
  __decorate,
  init_core,
  init_esm,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// src/services/confirmation.service.ts
var ConfirmationService;
var init_confirmation_service = __esm({
  "src/services/confirmation.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_esm();
    ConfirmationService = class ConfirmationService2 {
      stateSubject = new BehaviorSubject(null);
      state$ = this.stateSubject.asObservable();
      pendingResolve = null;
      confirm(options) {
        if (!options.message) {
          return Promise.resolve(false);
        }
        if (this.pendingResolve) {
          this.pendingResolve(false);
        }
        return new Promise((resolve) => {
          this.pendingResolve = resolve;
          this.stateSubject.next({
            title: options.title ?? "Confirm action",
            message: options.message,
            confirmText: options.confirmText ?? "Confirm",
            cancelText: options.cancelText ?? "Cancel",
            tone: options.tone ?? "accent",
            confirmClass: options.confirmClass
          });
        });
      }
      resolve(result) {
        if (this.pendingResolve) {
          this.pendingResolve(result);
          this.pendingResolve = null;
        }
        this.stateSubject.next(null);
      }
    };
    ConfirmationService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], ConfirmationService);
  }
});

export {
  ConfirmationService,
  init_confirmation_service
};
//# sourceMappingURL=chunk-M3ZD2GP7.js.map
