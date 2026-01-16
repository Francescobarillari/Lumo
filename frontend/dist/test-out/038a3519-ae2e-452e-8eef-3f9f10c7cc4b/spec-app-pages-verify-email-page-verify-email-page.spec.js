import {
  ActivatedRoute,
  RouterModule,
  init_router
} from "./chunk-YRK3FYDE.js";
import {
  AuthService,
  init_auth_service
} from "./chunk-4RP5LXF2.js";
import "./chunk-T2MDPWXL.js";
import "./chunk-UCB5EEGK.js";
import "./chunk-ZVVPXCFC.js";
import "./chunk-KDPE43GH.js";
import {
  Component,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/app/pages/verify-email-page/verify-email-page.html
var verify_email_page_default;
var init_verify_email_page = __esm({
  "angular:jit:template:src/app/pages/verify-email-page/verify-email-page.html"() {
    verify_email_page_default = `<div class="container">
    <div class="verify-container">
        <div class="header">
            <h1>Email Verification</h1>
            <p>{{ message }}</p>
        </div>
        
        @if(!verified){<a class="button" (click)="verifyEmail()">Verify Email</a>}
        @else{<a class="button" [routerLink]="['/']">Back to Home</a>}
    </div>
</div>
`;
  }
});

// angular:jit:style:src/app/pages/verify-email-page/verify-email-page.css
var verify_email_page_default2;
var init_verify_email_page2 = __esm({
  "angular:jit:style:src/app/pages/verify-email-page/verify-email-page.css"() {
    verify_email_page_default2 = "/* src/app/pages/verify-email-page/verify-email-page.css */\n.container {\n  background-color: var(--color-dark-gray);\n  width: 100%;\n  height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.container .verify-container {\n  text-align: center;\n  position: relative;\n  align-items: center;\n  width: 30%;\n  height: auto;\n  background-color: var(--color-gray);\n  border-radius: 20px;\n  padding: 40px;\n  border: 2px solid var(--color-dark-gray);\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n/*# sourceMappingURL=verify-email-page.css.map */\n";
  }
});

// src/app/pages/verify-email-page/verify-email-page.ts
var VerifyEmailPage;
var init_verify_email_page3 = __esm({
  "src/app/pages/verify-email-page/verify-email-page.ts"() {
    "use strict";
    init_tslib_es6();
    init_verify_email_page();
    init_verify_email_page2();
    init_core();
    init_router();
    init_auth_service();
    init_router();
    VerifyEmailPage = class VerifyEmailPage2 {
      route;
      authService;
      token = "";
      verified = false;
      message = "Click the button to verify your email.";
      constructor(route, authService) {
        this.route = route;
        this.authService = authService;
      }
      ngOnInit() {
        this.route.queryParams.subscribe((params) => {
          this.token = params["token"] || "";
        });
      }
      verifyEmail() {
        if (!this.token)
          return;
        this.authService.verifyEmail(this.token).subscribe({
          next: (res) => {
            this.verified = true;
            this.message = "You have been successfully registered! Signing you in...";
            if (res.data) {
              localStorage.setItem("user", JSON.stringify(res.data));
            }
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          },
          error: (err) => {
            this.verified = false;
            this.message = err.error?.error || "Token is invalid or expired.";
          }
        });
      }
      static ctorParameters = () => [
        { type: ActivatedRoute },
        { type: AuthService }
      ];
    };
    VerifyEmailPage = __decorate([
      Component({
        selector: "VerifyEmailPage",
        standalone: true,
        imports: [RouterModule],
        template: verify_email_page_default,
        styles: [verify_email_page_default2]
      })
    ], VerifyEmailPage);
  }
});

// src/app/pages/verify-email-page/verify-email-page.spec.ts
var require_verify_email_page_spec = __commonJS({
  "src/app/pages/verify-email-page/verify-email-page.spec.ts"(exports) {
    init_testing();
    init_verify_email_page3();
    describe("VerifyEmailPage", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [VerifyEmailPage]
        }).compileComponents();
        fixture = TestBed.createComponent(VerifyEmailPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_verify_email_page_spec();
//# sourceMappingURL=spec-app-pages-verify-email-page-verify-email-page.spec.js.map
