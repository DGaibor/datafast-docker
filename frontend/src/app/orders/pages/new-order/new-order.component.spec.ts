import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NewOrderComponent } from './new-order.component';

describe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "New Order"', () => {
    expect(component.title).toBe('New Order');
  });

  it('should render app-form-order component', () => {
    const formOrderElement = fixture.debugElement.query(By.css('app-form-order'));
    expect(formOrderElement).toBeTruthy();
  });

});
