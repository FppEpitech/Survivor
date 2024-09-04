import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstrologicalCompatibilityComponent } from './astrological-compatibility.component';

describe('AstrologicalCompatibilityComponent', () => {
  let component: AstrologicalCompatibilityComponent;
  let fixture: ComponentFixture<AstrologicalCompatibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AstrologicalCompatibilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstrologicalCompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
