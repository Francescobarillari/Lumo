import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPopup } from './sign-up-popup';

describe('SignUpPopup', () => {
  let component: SignUpPopup;
  let fixture: ComponentFixture<SignUpPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
