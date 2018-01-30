import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAnnonceComponent } from './search-annonce.component';

describe('SearchAnnonceComponent', () => {
  let component: SearchAnnonceComponent;
  let fixture: ComponentFixture<SearchAnnonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAnnonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
