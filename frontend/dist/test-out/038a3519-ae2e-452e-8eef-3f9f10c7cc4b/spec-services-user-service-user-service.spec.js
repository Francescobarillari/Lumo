import {
  UserService,
  init_user_service
} from "./chunk-VUUQL5BF.js";
import "./chunk-KDPE43GH.js";
import {
  TestBed,
  init_testing
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __commonJS
} from "./chunk-6TRXNEZQ.js";

// src/services/user-service/user-service.spec.ts
var require_user_service_spec = __commonJS({
  "src/services/user-service/user-service.spec.ts"(exports) {
    init_testing();
    init_user_service();
    describe("UserService", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [UserService]
        }).compileComponents();
        fixture = TestBed.createComponent(UserService);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_user_service_spec();
//# sourceMappingURL=spec-services-user-service-user-service.spec.js.map
