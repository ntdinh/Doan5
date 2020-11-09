import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongviecComponent } from './congviec.component';

describe('CongviecComponent', () => {
  let component: CongviecComponent;
  let fixture: ComponentFixture<CongviecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongviecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
