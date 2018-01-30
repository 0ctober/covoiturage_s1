import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeAnnonceComponent } from './subscribe-annonce.component';

describe('SubscribeAnnonceComponent', () => {
  let component: SubscribeAnnonceComponent;
  let fixture: ComponentFixture<SubscribeAnnonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeAnnonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
