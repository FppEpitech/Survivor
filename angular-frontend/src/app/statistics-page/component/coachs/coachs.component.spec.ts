import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachsComponent } from './coachs.component';

describe('CoachsComponent', () => {
  let component: CoachsComponent;
  let fixture: ComponentFixture<CoachsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
