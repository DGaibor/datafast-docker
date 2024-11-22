import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should fetch orders as an Observable', () => {
    const dummyOrders: Order[] = [
      { id: '1', email: 'diego@example.com', firstName: 'Diego', lastName: 'Gaibor', price: 100, quantity: 2 },
      { id: '2', email: 'jorge@example.com', firstName: 'Jorge', lastName: 'Sanchez', price: 200, quantity: 1 },
    ];

    service.getOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(dummyOrders);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrders);
  });

  it('should create a new order', () => {
    const newOrder: Order = { id: '3', email: 'diego@example.com', firstName: 'Diego', lastName: 'Gaibor', price: 300, quantity: 1 };

    service.createOrder(newOrder).subscribe(order => {
      expect(order).toEqual(newOrder);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);
    req.flush(newOrder);
  });

  it('should delete the specified order', () => {
    const orderId = '1';

    service.deleteOrder(orderId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${orderId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update an existing order', () => {
    const updatedOrder: Order = { id: '1', email: 'diego@example.com', firstName: 'Diego', lastName: 'Gaibor', price: 150, quantity: 3 };

    service.updateOrder('1', updatedOrder).subscribe(order => {
      expect(order).toEqual(updatedOrder);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedOrder);
    req.flush(updatedOrder);
  });

});
