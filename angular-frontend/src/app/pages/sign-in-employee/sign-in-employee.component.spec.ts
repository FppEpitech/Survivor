import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInEmployeeComponent } from './sign-in-employee.component';

describe('SignInEmployeeComponent', () => {
  let component: SignInEmployeeComponent;
  let fixture: ComponentFixture<SignInEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
