import {
  ResponsiveService,
  init_responsive_service
} from "./chunk-JGCT3QTW.js";
import "./chunk-UGYQJEAL.js";
import "./chunk-AO23D4OF.js";
import "./chunk-ZVVPXCFC.js";
import {
  Component,
  Input,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6,
  input
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/components/circle-icon/circle-icon.html
var circle_icon_default;
var init_circle_icon = __esm({
  "angular:jit:template:src/components/circle-icon/circle-icon.html"() {
    circle_icon_default = `<div [class.mobile]="responsive.screen() === 'mobile'" [class.tablet]="responsive.screen() === 'tablet'"
    class="circle-container">
    <img class="icon" src="{{path()}}" alt="{{iconAlt()}}">
</div>`;
  }
});

// angular:jit:style:src/components/circle-icon/circle-icon.css
var circle_icon_default2;
var init_circle_icon2 = __esm({
  "angular:jit:style:src/components/circle-icon/circle-icon.css"() {
    circle_icon_default2 = "/* src/components/circle-icon/circle-icon.css */\n.circle-container {\n  padding: 3px;\n  height: auto;\n  width: auto;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: var(--color-light-gray);\n  cursor: pointer;\n}\n.icon {\n  height: 20px;\n  width: 20px;\n  color: var(--color-accent, #FCC324);\n}\n.circle-container.tablet .icon,\n.circle-container.mobile .icon {\n  height: 30px;\n  width: 30px;\n}\n/*# sourceMappingURL=circle-icon.css.map */\n";
  }
});

// src/components/circle-icon/circle-icon.ts
var CircleIcon;
var init_circle_icon3 = __esm({
  "src/components/circle-icon/circle-icon.ts"() {
    "use strict";
    init_tslib_es6();
    init_circle_icon();
    init_circle_icon2();
    init_core();
    init_responsive_service();
    init_core();
    CircleIcon = class CircleIcon2 {
      responsive;
      constructor(responsive) {
        this.responsive = responsive;
      }
      path = input("");
      iconAlt = input("icon");
      static ctorParameters = () => [
        { type: ResponsiveService }
      ];
      static propDecorators = {
        path: [{ type: Input, args: [{ isSignal: true, alias: "path", required: false, transform: void 0 }] }],
        iconAlt: [{ type: Input, args: [{ isSignal: true, alias: "iconAlt", required: false, transform: void 0 }] }]
      };
    };
    CircleIcon = __decorate([
      Component({
        selector: "CircleIcon",
        imports: [],
        template: circle_icon_default,
        styles: [circle_icon_default2]
      })
    ], CircleIcon);
  }
});

// src/components/circle-icon/circle-icon.spec.ts
var require_circle_icon_spec = __commonJS({
  "src/components/circle-icon/circle-icon.spec.ts"(exports) {
    init_testing();
    init_circle_icon3();
    describe("CircleIcon", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [CircleIcon]
        }).compileComponents();
        fixture = TestBed.createComponent(CircleIcon);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_circle_icon_spec();
//# sourceMappingURL=spec-components-circle-icon-circle-icon.spec.js.map
