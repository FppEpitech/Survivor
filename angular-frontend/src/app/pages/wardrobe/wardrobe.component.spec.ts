import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardrobeComponent } from './wardrobe.component';

describe('WardrobeComponent', () => {
  let component: WardrobeComponent;
  let fixture: ComponentFixture<WardrobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardrobeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardrobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
