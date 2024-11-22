import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormOrderComponent } from './form-order.component';

describe('FormOrderComponent', () => {
  let component: FormOrderComponent;
  let fixture: ComponentFixture<FormOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrderComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with controls', () => {
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('firstName')).toBeTrue();
    expect(component.form.contains('lastName')).toBeTrue();
    expect(component.form.contains('price')).toBeTrue();
    expect(component.form.contains('quantity')).toBeTrue();
  });

  it('should make the controls invalid initially', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();

    const firstNameControl = component.form.get('firstName');
    firstNameControl?.setValue('');
    expect(firstNameControl?.valid).toBeFalse();
  });

  it('should load order data if id is provided', async () => {
    spyOn(component['orderService'], 'getOrderById').and.returnValue(
      of({ id:'id' ,email: 'diego@example.com', firstName: 'Diego', lastName: 'Gaibor', price: 100, quantity: 2 })
    );
    component.id='id'

    await component.loadOrderData();

    expect(component.form.value).toEqual({
      email: 'diego@example.com',
      firstName: 'Diego',
      lastName: 'Gaibor',
      price: 100,
      quantity: 2
    });
  });

  it('should call createOrder on submit if no id is present', async () => {
    const mockOrder = {
      id:'id',
      email: 'diego@example.com',
      firstName: 'Diego',
      lastName: 'Gaibor',
      price: 100,
      quantity: 2
    };
    spyOn(component['orderService'], 'createOrder').and.returnValue(of(mockOrder));
    spyOn(component['alertService'], 'showSuccess');

    component.form.setValue({
      email: 'diego@example.com',
      firstName: 'Diego',
      lastName: 'Gaibor',
      price: 100,
      quantity: 2
    });

    await component.submit();

    expect(component['orderService'].createOrder).toHaveBeenCalled();
    expect(component['alertService'].showSuccess).toHaveBeenCalledWith('Order created successfully');
  });

  it('should show error if submit fails', async () => {
    spyOn(component['orderService'], 'createOrder').and.throwError('Error');
    spyOn(component['alertService'], 'showError');

    component.form.setValue({
      email: 'diego@example.com',
      firstName: 'Diego',
      lastName: 'Gaibor',
      price: 100,
      quantity: 2
    });

    await component.submit();

    expect(component['alertService'].showError).toHaveBeenCalledWith(
      'An error occurred while creating the order. Please try again later'
    );
  });

  it('should navigate to orders list after successful submission', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.redirectToOrders();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

});
