import {
  init_breakpoints_observer
} from "./chunk-AO23D4OF.js";
import {
  FactoryTarget,
  NgModule,
  core_exports,
  init_core,
  ɵɵngDeclareClassMetadata,
  ɵɵngDeclareFactory,
  ɵɵngDeclareInjector,
  ɵɵngDeclareNgModule
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule, Breakpoints;
var init_layout = __esm({
  "node_modules/@angular/cdk/fesm2022/layout.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_breakpoints_observer();
    LayoutModule = class _LayoutModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: LayoutModule, decorators: [{
      type: NgModule,
      args: [{}]
    }] });
    Breakpoints = {
      XSmall: "(max-width: 599.98px)",
      Small: "(min-width: 600px) and (max-width: 959.98px)",
      Medium: "(min-width: 960px) and (max-width: 1279.98px)",
      Large: "(min-width: 1280px) and (max-width: 1919.98px)",
      XLarge: "(min-width: 1920px)",
      Handset: "(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",
      Tablet: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
      Web: "(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",
      HandsetPortrait: "(max-width: 599.98px) and (orientation: portrait)",
      TabletPortrait: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",
      WebPortrait: "(min-width: 840px) and (orientation: portrait)",
      HandsetLandscape: "(max-width: 959.98px) and (orientation: landscape)",
      TabletLandscape: "(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
      WebLandscape: "(min-width: 1280px) and (orientation: landscape)"
    };
  }
});

export {
  Breakpoints,
  init_layout
};
//# sourceMappingURL=chunk-UGYQJEAL.js.map
