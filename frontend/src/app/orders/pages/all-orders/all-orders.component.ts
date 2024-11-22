import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { OrderService } from '../../../core/services/order.service';
import { firstValueFrom } from 'rxjs';
import { Order } from '../../../core/models/oder.interface';
import { AlertService } from '../../../core/services/alert.service';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  imports: [HeaderComponent, NgForOf],
  templateUrl: './all-orders.component.html',
  standalone: true,
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit {

  title = 'All Orders';
  orders: Order[] = []

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.getOrders();
  }
  async getOrders() {
    try {
      this.orders = await firstValueFrom(this.orderService.getOrders());
    }catch (error) {
      this.alertService.showError('An error occurred while getting orders. Please try again later');
      console.error('Error getting orders', error);

    }

  }

  editOrder(id: string) {
    this.router.navigate(['/order', id]);

  }
  async deleteOrder(id: string) {
    try {
      await firstValueFrom(this.orderService.deleteOrder(id));
      this.orders = this.orders.filter(order => order.id !== id);
      this.alertService.showSuccess('Order deleted successfully');
    } catch (error) {
      this.alertService.showError('An error occurred while deleting the order. Please try again later');
      console.error('Error deleting order', error);
    }
  }

}
