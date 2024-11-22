import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FormOrderComponent } from '../../components/form-order/form-order.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-order',
  imports: [HeaderComponent, FormOrderComponent],
  templateUrl: './edit-order.component.html',
  standalone: true,
  styleUrl: './edit-order.component.scss'
})
export class EditOrderComponent implements OnInit {
  orderId: string | null = null;
  title = 'Edit Order';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }

}
