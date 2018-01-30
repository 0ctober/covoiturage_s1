import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetTypeComponent } from './trajet-type.component';

describe('TrajetTypeComponent', () => {
  let component: TrajetTypeComponent;
  let fixture: ComponentFixture<TrajetTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
