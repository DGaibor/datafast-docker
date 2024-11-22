import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorService } from '../../../core/services/form-error.service';
import { ErrorMessages } from '../../../shared/interfaces/error-form.interface';
import { NgForOf } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-order',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './form-order.component.html',
  standalone: true,
  styleUrl: './form-order.component.scss'
})
export class FormOrderComponent implements OnInit {
  @Input() id?: string | null;

  errorMessages: ErrorMessages = {};
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });

  constructor(
    private formErrorService: FormErrorService,
    private orderService: OrderService,
    private alertService: AlertService,
    private router: Router) {
  }
  ngOnInit(): void {
    this.loadOrderData();
  }

  async loadOrderData() {
    if (this.id) {
      try {
        const order = await firstValueFrom(this.orderService.getOrderById(this.id));
        this.form.patchValue(order);
      } catch (error) {
        console.log('Error loading order', error);
        this.alertService.showError( 'Error loading order');
      }
    }
  }

  async submit() {
    if (this.form.invalid) {
      this.errorMessages = this.formErrorService.getInvalidError(this.form.controls);
      return;
    }
    const order: Order = this.form.value

    if (this.id) {
      try {
        await firstValueFrom(this.orderService.updateOrder(this.id, order));
        this.alertService.showSuccess( 'Order updated successfully');
        this.redirectToOrders();
      } catch (error) {
        this.alertService.showError( 'An error occurred while updating the order. Please try again later');
        console.error(error)
      }
      return;
    }else{
      try {
        await firstValueFrom(this.orderService.createOrder(order));
        this.alertService.showSuccess( 'Order created successfully');
        this.redirectToOrders();
      } catch (error) {
        this.alertService.showError( 'An error occurred while creating the order. Please try again later');
        console.error(error)
      }
    }

  }

  redirectToOrders(){
    this.router.navigate(['/']);
  }

}
