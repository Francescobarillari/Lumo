import {
  HttpClient,
  init_http
} from "./chunk-KDPE43GH.js";
import {
  Component,
  Injectable,
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

// angular:jit:style:inline:src/services/event-service/event-service.ts;
var event_service_default;
var init_event_service = __esm({
  "angular:jit:style:inline:src/services/event-service/event-service.ts;"() {
    event_service_default = "/* angular:styles/component:css;e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855;/Users/giuseppemuriale/Documents/GitHub/Lumo/frontend/src/services/event-service/event-service.ts */\n/*# sourceMappingURL=event-service.css.map */\n";
  }
});

// src/services/event-service/event-service.ts
var EventService;
var init_event_service2 = __esm({
  "src/services/event-service/event-service.ts"() {
    "use strict";
    init_tslib_es6();
    init_event_service();
    init_core();
    init_core();
    init_http();
    EventService = class EventService2 {
      http;
      apiUrl = "http://localhost:8080/api/events";
      constructor(http) {
        this.http = http;
      }
      getAll() {
        return this.http.get(this.apiUrl);
      }
      getById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
      }
      create(event) {
        return this.http.post(this.apiUrl, event);
      }
      update(id, event) {
        return this.http.put(`${this.apiUrl}/${id}`, event);
      }
      delete(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    EventService = __decorate([
      Component({
        selector: "app-event-service",
        imports: [],
        template: ``,
        styles: [event_service_default]
      }),
      Injectable({
        providedIn: "root"
      })
    ], EventService);
  }
});

// src/services/event-service/event-service.spec.ts
var require_event_service_spec = __commonJS({
  "src/services/event-service/event-service.spec.ts"(exports) {
    init_testing();
    init_event_service2();
    describe("EventService", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [EventService]
        }).compileComponents();
        fixture = TestBed.createComponent(EventService);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_event_service_spec();
//# sourceMappingURL=spec-services-event-service-event-service.spec.js.map
