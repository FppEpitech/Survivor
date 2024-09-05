import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInCoachComponent } from './sign-in-coach.component';

describe('SignInCoachComponent', () => {
  let component: SignInCoachComponent;
  let fixture: ComponentFixture<SignInCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInCoachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
