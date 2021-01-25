import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivelectureComponent } from './livelecture.component';

describe('LivelectureComponent', () => {
  let component: LivelectureComponent;
  let fixture: ComponentFixture<LivelectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivelectureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivelectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
