import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SignInPopup } from './sign-in-popup';

describe('SignInPopup', () => {
  let component: SignInPopup;
  let fixture: ComponentFixture<SignInPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInPopup, HttpClientTestingModule],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ breakpoints: {}, matches: false }) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
