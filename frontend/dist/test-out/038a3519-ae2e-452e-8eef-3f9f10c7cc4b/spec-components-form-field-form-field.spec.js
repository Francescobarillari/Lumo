import {
  FormField,
  init_form_field
} from "./chunk-HXKXDHCN.js";
import "./chunk-SRAAVOWE.js";
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

// src/components/form-field/form-field.spec.ts
var require_form_field_spec = __commonJS({
  "src/components/form-field/form-field.spec.ts"(exports) {
    init_testing();
    init_form_field();
    describe("FormField", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [FormField]
        }).compileComponents();
        fixture = TestBed.createComponent(FormField);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_form_field_spec();
//# sourceMappingURL=spec-components-form-field-form-field.spec.js.map
