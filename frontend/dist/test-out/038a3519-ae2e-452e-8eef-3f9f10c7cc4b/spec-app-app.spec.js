import {
  ConfirmationService,
  init_confirmation_service
} from "./chunk-M3ZD2GP7.js";
import {
  RouterOutlet,
  init_router
} from "./chunk-YRK3FYDE.js";
import "./chunk-T2MDPWXL.js";
import "./chunk-UCB5EEGK.js";
import {
  CommonModule,
  init_common
} from "./chunk-ZVVPXCFC.js";
import "./chunk-KDPE43GH.js";
import {
  Component,
  HostListener,
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

// angular:jit:style:src/app/app.css
var app_default;
var init_app = __esm({
  "angular:jit:style:src/app/app.css"() {
    app_default = "/* src/app/app.css */\n/*# sourceMappingURL=app.css.map */\n";
  }
});

// angular:jit:template:src/components/confirm-dialog/confirm-dialog.html
var confirm_dialog_default;
var init_confirm_dialog = __esm({
  "angular:jit:template:src/components/confirm-dialog/confirm-dialog.html"() {
    confirm_dialog_default = `<div class="confirm-backdrop" *ngIf="state$ | async as state" (click)="onCancel()">
  <div class="confirm-modal" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
    <div class="confirm-header">
      <h2>{{ state.title }}</h2>
    </div>
    <p class="confirm-message">{{ state.message }}</p>
    <div class="confirm-actions">
      <button class="button cancel-button" type="button" (click)="onCancel()">
        {{ state.cancelText }}
      </button>
      <button class="button confirm-button" [class.danger]="state.tone === 'danger'"
        [class.confirm-white-text]="state.confirmClass === 'white-text'" type="button"
        (click)="onConfirm()">
        {{ state.confirmText }}
      </button>
    </div>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/components/confirm-dialog/confirm-dialog.css
var confirm_dialog_default2;
var init_confirm_dialog2 = __esm({
  "angular:jit:style:src/components/confirm-dialog/confirm-dialog.css"() {
    confirm_dialog_default2 = "/* src/components/confirm-dialog/confirm-dialog.css */\n.confirm-backdrop {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: 100000;\n}\n.confirm-modal {\n  width: min(480px, 92vw);\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: 24px;\n  border: var(--modal-border);\n  box-shadow: var(--modal-shadow);\n  animation: confirmPop 0.18s ease-out;\n}\n.confirm-header h2 {\n  margin: 0;\n  color: var(--color-accent);\n  font-size: 22px;\n  font-weight: 700;\n}\n.confirm-message {\n  margin: 12px 0 0 0;\n  color: var(--color-white);\n  font-size: 15px;\n  line-height: 1.5;\n}\n.confirm-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  flex-wrap: wrap;\n}\nbutton.button.cancel-button {\n  background: transparent;\n  border: 1px solid var(--color-bit-gray);\n  color: var(--color-white);\n  box-shadow: none;\n}\nbutton.button.cancel-button:hover {\n  border-color: var(--color-light-gray);\n  transform: translateY(-1px);\n}\nbutton.button.confirm-button {\n  background: var(--color-accent);\n  color: var(--color-black);\n}\nbutton.button.confirm-button.confirm-white-text {\n  color: #ffffff;\n}\nbutton.button.confirm-button.danger {\n  background: var(--color-error);\n  color: var(--color-white);\n}\nbutton.button.confirm-button:hover {\n  transform: translateY(-1px);\n}\n@keyframes confirmPop {\n  from {\n    transform: scale(0.98);\n    opacity: 0;\n  }\n  to {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n@media (max-width: 640px) {\n  .confirm-modal {\n    width: calc(100% - 32px);\n    padding: 20px;\n    border-radius: var(--modal-radius);\n  }\n  .confirm-actions {\n    flex-direction: column-reverse;\n    align-items: stretch;\n  }\n}\n/*# sourceMappingURL=confirm-dialog.css.map */\n";
  }
});

// src/components/confirm-dialog/confirm-dialog.ts
var ConfirmDialog;
var init_confirm_dialog3 = __esm({
  "src/components/confirm-dialog/confirm-dialog.ts"() {
    "use strict";
    init_tslib_es6();
    init_confirm_dialog();
    init_confirm_dialog2();
    init_core();
    init_common();
    init_confirmation_service();
    ConfirmDialog = class ConfirmDialog2 {
      confirmation;
      state$;
      isOpen = false;
      subscription;
      constructor(confirmation) {
        this.confirmation = confirmation;
        this.state$ = this.confirmation.state$;
        this.subscription = this.confirmation.state$.subscribe((state) => {
          this.isOpen = !!state;
        });
      }
      ngOnDestroy() {
        this.subscription.unsubscribe();
      }
      onConfirm() {
        this.confirmation.resolve(true);
      }
      onCancel() {
        this.confirmation.resolve(false);
      }
      onEscape() {
        if (this.isOpen) {
          this.onCancel();
        }
      }
      static ctorParameters = () => [
        { type: ConfirmationService }
      ];
      static propDecorators = {
        onEscape: [{ type: HostListener, args: ["document:keydown.escape"] }]
      };
    };
    ConfirmDialog = __decorate([
      Component({
        selector: "app-confirm-dialog",
        standalone: true,
        imports: [CommonModule],
        template: confirm_dialog_default,
        styles: [confirm_dialog_default2]
      })
    ], ConfirmDialog);
  }
});

// src/app/app.ts
var App;
var init_app2 = __esm({
  "src/app/app.ts"() {
    "use strict";
    init_tslib_es6();
    init_app();
    init_core();
    init_router();
    init_confirm_dialog3();
    App = class App2 {
    };
    App = __decorate([
      Component({
        selector: "app-root",
        standalone: true,
        imports: [RouterOutlet, ConfirmDialog],
        template: `
    <router-outlet></router-outlet>
    <app-confirm-dialog></app-confirm-dialog>
  `,
        styles: [app_default]
      })
    ], App);
  }
});

// src/app/app.spec.ts
var require_app_spec = __commonJS({
  "src/app/app.spec.ts"(exports) {
    init_testing();
    init_app2();
    describe("App", () => {
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [App]
        }).compileComponents();
      }));
      it("should create the app", () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      });
      it("should render title", () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("h1")?.textContent).toContain("Hello, frontend");
      });
    });
  }
});
export default require_app_spec();
//# sourceMappingURL=spec-app-app.spec.js.map
