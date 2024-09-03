import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Charts } from './charts.component';

describe('ChartsComponent', () => {
  let component: Charts;
  let fixture: ComponentFixture<Charts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Charts ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Charts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
