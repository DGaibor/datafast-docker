import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AllOrdersComponent } from './all-orders.component';
import { of } from 'rxjs';

describe('AllOrdersComponent', () => {
  let component: AllOrdersComponent;
  let fixture: ComponentFixture<AllOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrdersComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrders on ngOnInit', async () => {
    spyOn(component, 'getOrders');
    await component.ngOnInit();
    expect(component.getOrders).toHaveBeenCalled();
  });

  it('should load orders from the service', async () => {
    const mockOrders = [
      { id: '1', email: 'diego@example.com', firstName: 'Diego', lastName: 'Gaibor', price: 100, quantity: 2 },
      { id: '2', email: 'jore@example.com', firstName: 'Jorge', lastName: 'Sanchez', price: 200, quantity: 1 },
    ];

    spyOn(component['orderService'], 'getOrders').and.returnValue(of(mockOrders));
    await component.getOrders();
    expect(component.orders).toEqual(mockOrders);
  });

  it('should delete an order and update the list', async () => {
    const mockOrders = [
      { id: '1', email: 'test1@example.com', firstName: 'John', lastName: 'Doe', price: 100, quantity: 2 },
      { id: '2', email: 'test2@example.com', firstName: 'Jane', lastName: 'Smith', price: 200, quantity: 1 },
    ];

    component.orders = [...mockOrders];
    spyOn(component['orderService'], 'deleteOrder').and.returnValue(of(void 0));
    spyOn(component['alertService'], 'showSuccess');

    await component.deleteOrder('1');

    expect(component.orders).toEqual([{ id: '2', email: 'test2@example.com', firstName: 'Jane', lastName: 'Smith', price: 200, quantity: 1 }]);
    expect(component['alertService'].showSuccess).toHaveBeenCalledWith('Order deleted successfully');
  });

  it('should show error if deleteOrder fails', async () => {
    spyOn(component['orderService'], 'deleteOrder').and.throwError('Error');
    spyOn(component['alertService'], 'showError');

    await component.deleteOrder('1');

    expect(component['alertService'].showError).toHaveBeenCalledWith('An error occurred while deleting the order. Please try again later');
  });

  it('should navigate to the edit page when editOrder is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.editOrder('1');
    expect(routerSpy).toHaveBeenCalledWith(['/order', '1']);
  });

});
