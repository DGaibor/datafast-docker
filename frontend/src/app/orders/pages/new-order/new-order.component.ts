import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FormOrderComponent } from '../../components/form-order/form-order.component';


@Component({
  selector: 'app-new-order',
  imports: [HeaderComponent, FormOrderComponent],
  templateUrl: './new-order.component.html',
  standalone: true,
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {
  title = 'New Order';
}
