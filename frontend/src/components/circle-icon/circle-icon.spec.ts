import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleIcon } from './circle-icon';

describe('CircleIcon', () => {
  let component: CircleIcon;
  let fixture: ComponentFixture<CircleIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
