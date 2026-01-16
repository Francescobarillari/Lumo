import {
  VerifyEmailPopup,
  init_verify_email_popup
} from "./chunk-VAYPB4TI.js";
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

// src/components/verify-email-popup/verify-email-popup.spec.ts
var require_verify_email_popup_spec = __commonJS({
  "src/components/verify-email-popup/verify-email-popup.spec.ts"(exports) {
    init_testing();
    init_verify_email_popup();
    describe("VerifyPage", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [VerifyEmailPopup]
        }).compileComponents();
        fixture = TestBed.createComponent(VerifyEmailPopup);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_verify_email_popup_spec();
//# sourceMappingURL=spec-components-verify-email-popup-verify-email-popup.spec.js.map
