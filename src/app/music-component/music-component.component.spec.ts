import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicComponentComponent } from './music-component.component';

describe('musicComponentComponent', () => {
  let component: MusicComponentComponent;
  let fixture: ComponentFixture<MusicComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
