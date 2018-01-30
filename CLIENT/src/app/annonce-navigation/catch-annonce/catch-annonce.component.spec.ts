import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchAnnonceComponent } from './catch-annonce.component';

describe('CatchAnnonceComponent', () => {
  let component: CatchAnnonceComponent;
  let fixture: ComponentFixture<CatchAnnonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchAnnonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
