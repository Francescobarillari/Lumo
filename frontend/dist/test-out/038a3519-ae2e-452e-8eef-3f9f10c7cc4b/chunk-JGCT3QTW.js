import {
  init_layout
} from "./chunk-UGYQJEAL.js";
import {
  BreakpointObserver
} from "./chunk-AO23D4OF.js";
import {
  Injectable,
  __decorate,
  init_core,
  init_tslib_es6,
  signal
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// src/services/responsive-service.ts
var ResponsiveService;
var init_responsive_service = __esm({
  "src/services/responsive-service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_layout();
    ResponsiveService = class ResponsiveService2 {
      bp;
      screen = signal("desktop");
      constructor(bp) {
        this.bp = bp;
        this.bp.observe([
          "(max-width: 979px)",
          "(min-width: 980px) and (max-width: 1399px)",
          "(min-width: 1400px)"
        ]).subscribe((state) => {
          if (state.breakpoints["(max-width: 979px)"]) {
            this.screen.set("mobile");
          } else if (state.breakpoints["(min-width: 980px) and (max-width: 1399px)"]) {
            this.screen.set("tablet");
          } else {
            this.screen.set("desktop");
          }
        });
      }
      static ctorParameters = () => [
        { type: BreakpointObserver }
      ];
    };
    ResponsiveService = __decorate([
      Injectable({ providedIn: "root" })
    ], ResponsiveService);
  }
});

export {
  ResponsiveService,
  init_responsive_service
};
//# sourceMappingURL=chunk-JGCT3QTW.js.map
