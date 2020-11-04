import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanbanComponent } from './Vanban.component';

describe('VanbanComponent', () => {
  let component: VanbanComponent;
  let fixture: ComponentFixture<VanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
