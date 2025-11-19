import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPopup } from './verify-email-popup';

describe('VerifyPage', () => {
  let component: VerifyEmailPopup;
  let fixture: ComponentFixture<VerifyEmailPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
