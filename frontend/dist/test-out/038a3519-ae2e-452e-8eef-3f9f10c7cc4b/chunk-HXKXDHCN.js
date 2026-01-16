import {
  ReactiveFormsModule,
  init_forms
} from "./chunk-SRAAVOWE.js";
import {
  MatIconModule,
  init_icon
} from "./chunk-TAO542U6.js";
import {
  CommonModule,
  init_common
} from "./chunk-ZVVPXCFC.js";
import {
  Component,
  Input,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/components/form-field/form-field.html
var form_field_default;
var init_form_field = __esm({
  "angular:jit:template:src/components/form-field/form-field.html"() {
    form_field_default = `<div class="input-wrapper" [ngClass]="customClass" [class.error]="error">
    @if (type === 'textarea') {
    <textarea [formControl]="control!" [placeholder]="placeholder" class="input-field"></textarea>
    } @else {
    <div class="input-with-toggle" [class.with-toggle]="showToggle && type === 'password'">
        <input [formControl]="control!" [type]="inputType" [placeholder]="placeholder" class="input-field"
            [class.date-input]="type === 'date'" [class.has-value]="type === 'date' && !!control?.value"
            [attr.min]="min" />
        @if (type === 'date' && !control?.value) {
        <span class="date-placeholder">{{ placeholder }}</span>
        }
        @if (showToggle && type === 'password') {
        <button type="button" class="toggle-btn" (click)="togglePasswordVisibility($event)">
            <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        }
    </div>
    }
</div>
`;
  }
});

// angular:jit:style:src/components/form-field/form-field.css
var form_field_default2;
var init_form_field2 = __esm({
  "angular:jit:style:src/components/form-field/form-field.css"() {
    form_field_default2 = "/* src/components/form-field/form-field.css */\n.form-field {\n  font: var(--font-stack-headline);\n  display: block;\n  min-width: 0;\n  min-height: 50px;\n  max-width: 500px;\n  padding: 0 var(--spacing-md);\n  border-radius: var(--radius-lg);\n  background-color: var(--color-gray);\n  border: none;\n  color: var(--color-white);\n  font-size: 16px;\n}\n.form-field::placeholder {\n  color: var(--color-light-gray);\n  font-weight: var(--font-weight-light);\n}\n.form-field:focus {\n  outline: none;\n}\ninput[type=date] {\n  color: var(--color-light-gray);\n}\n.input-wrapper {\n  width: 100%;\n  position: relative;\n  box-sizing: border-box;\n}\n.input-wrapper.tall-field {\n  height: 80px;\n}\n.input-wrapper.tall-field .input-field {\n  height: 100%;\n  resize: none;\n  padding-top: 12px;\n}\n.input-with-toggle {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.date-input {\n  color: transparent;\n}\n.date-input:not(.has-value)::-webkit-datetime-edit,\n.date-input:not(.has-value)::-webkit-datetime-edit-text,\n.date-input:not(.has-value)::-webkit-datetime-edit-month-field,\n.date-input:not(.has-value)::-webkit-datetime-edit-day-field,\n.date-input:not(.has-value)::-webkit-datetime-edit-year-field {\n  color: transparent;\n}\n.date-input.has-value {\n  color: var(--color-white);\n}\n.date-input.has-value::-webkit-datetime-edit,\n.date-input.has-value::-webkit-datetime-edit-text,\n.date-input.has-value::-webkit-datetime-edit-month-field,\n.date-input.has-value::-webkit-datetime-edit-day-field,\n.date-input.has-value::-webkit-datetime-edit-year-field {\n  color: var(--color-white);\n}\n.date-placeholder {\n  position: absolute;\n  left: var(--spacing-md);\n  top: 50%;\n  transform: translateY(-50%);\n  color: var(--color-light-gray);\n  font-weight: var(--font-weight-light);\n  pointer-events: none;\n}\n.input-with-toggle.with-toggle .input-field {\n  padding-right: 42px;\n}\n.toggle-btn {\n  position: absolute;\n  right: 10px;\n  background: transparent;\n  border: none;\n  color: #bbbbbb;\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  padding: 4px;\n}\n.toggle-btn mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.input-field {\n  width: 100%;\n  height: 50px;\n  padding: 0 var(--spacing-md);\n  background-color: var(--color-gray);\n  border: 2px solid rgba(255, 255, 255, 0.12);\n  border-radius: var(--radius-lg);\n  color: var(--color-white);\n  font-size: 16px;\n  font-family: inherit;\n  font-weight: var(--font-weight-light);\n  outline: none;\n  box-sizing: border-box;\n  transition: border-color 0.2s;\n}\n.input-field:focus {\n  border-color: var(--color-accent);\n}\n.input-field::placeholder {\n  color: var(--color-light-gray);\n}\n.input-wrapper.error .input-field {\n  border-color: var(--color-error);\n}\ninput:-webkit-autofill,\ninput:-webkit-autofill:hover,\ninput:-webkit-autofill:focus,\ninput:-webkit-autofill:active {\n  -webkit-box-shadow: 0 0 0 30px var(--color-gray) inset !important;\n  -webkit-text-fill-color: var(--color-white) !important;\n  transition: background-color 5000s ease-in-out 0s;\n  caret-color: var(--color-white);\n}\n/*# sourceMappingURL=form-field.css.map */\n";
  }
});

// src/components/form-field/form-field.ts
var FormField;
var init_form_field3 = __esm({
  "src/components/form-field/form-field.ts"() {
    "use strict";
    init_tslib_es6();
    init_form_field();
    init_form_field2();
    init_core();
    init_common();
    init_forms();
    init_icon();
    FormField = class FormField2 {
      control = null;
      type = "text";
      placeholder = "";
      error = false;
      customClass = "";
      showToggle = false;
      min = null;
      showPassword = false;
      get inputType() {
        if (this.showToggle && this.type === "password") {
          return this.showPassword ? "text" : "password";
        }
        return this.type;
      }
      togglePasswordVisibility(event) {
        event.stopPropagation();
        if (this.showToggle && this.type === "password") {
          this.showPassword = !this.showPassword;
        }
      }
      static propDecorators = {
        control: [{ type: Input }],
        type: [{ type: Input }],
        placeholder: [{ type: Input }],
        error: [{ type: Input }],
        customClass: [{ type: Input }],
        showToggle: [{ type: Input }],
        min: [{ type: Input }]
      };
    };
    FormField = __decorate([
      Component({
        selector: "FormField",
        imports: [ReactiveFormsModule, CommonModule, MatIconModule],
        template: form_field_default,
        styles: [form_field_default2]
      })
    ], FormField);
  }
});

export {
  FormField,
  init_form_field3 as init_form_field
};
//# sourceMappingURL=chunk-HXKXDHCN.js.map
