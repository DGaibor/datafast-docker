import { Routes } from '@angular/router';
import { AllOrdersComponent } from './orders/pages/all-orders/all-orders.component';
import { NewOrderComponent } from './orders/pages/new-order/new-order.component';
import { EditOrderComponent } from './orders/pages/edit-order/edit-order.component';

export const routes: Routes = [
  {
    component: AllOrdersComponent,
    path: ''
  },
  {
    component: NewOrderComponent,
    path: 'order/new'
  },
  {
    component: EditOrderComponent,
    path: 'order/:id'
  }
];
