import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaivanbanComponent } from './Loaivanban.component';

describe('VanbanComponent', () => {
  let component: LoaivanbanComponent;
  let fixture: ComponentFixture<LoaivanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaivanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaivanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
