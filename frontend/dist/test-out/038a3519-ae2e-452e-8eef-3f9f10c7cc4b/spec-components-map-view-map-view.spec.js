import {
  MapView,
  init_map_view
} from "./chunk-XCYCWIXC.js";
import "./chunk-VUUQL5BF.js";
import "./chunk-LIEZZHZR.js";
import "./chunk-SRAAVOWE.js";
import "./chunk-UGYQJEAL.js";
import "./chunk-TAO542U6.js";
import "./chunk-T2MDPWXL.js";
import "./chunk-UCB5EEGK.js";
import "./chunk-AO23D4OF.js";
import "./chunk-ZVVPXCFC.js";
import "./chunk-KDPE43GH.js";
import {
  TestBed,
  init_testing
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __commonJS
} from "./chunk-6TRXNEZQ.js";

// src/components/map-view/map-view.spec.ts
var require_map_view_spec = __commonJS({
  "src/components/map-view/map-view.spec.ts"(exports) {
    init_testing();
    init_map_view();
    describe("MapView", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [MapView]
        }).compileComponents();
        fixture = TestBed.createComponent(MapView);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_map_view_spec();
//# sourceMappingURL=spec-components-map-view-map-view.spec.js.map
