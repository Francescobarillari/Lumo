import {
  SignUpPopup,
  init_sign_up_popup
} from "./chunk-7TVTZCMN.js";
import "./chunk-XGGBA6TN.js";
import "./chunk-4RP5LXF2.js";
import "./chunk-HXKXDHCN.js";
import "./chunk-LIEZZHZR.js";
import "./chunk-SRAAVOWE.js";
import "./chunk-JGCT3QTW.js";
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

// src/components/sign-up-popup/sign-up-popup.spec.ts
var require_sign_up_popup_spec = __commonJS({
  "src/components/sign-up-popup/sign-up-popup.spec.ts"(exports) {
    init_testing();
    init_sign_up_popup();
    describe("SignUpPopup", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [SignUpPopup]
        }).compileComponents();
        fixture = TestBed.createComponent(SignUpPopup);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_sign_up_popup_spec();
//# sourceMappingURL=spec-components-sign-up-popup-sign-up-popup.spec.js.map
