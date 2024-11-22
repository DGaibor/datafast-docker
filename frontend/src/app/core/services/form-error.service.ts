import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ErrorMessages } from '../../shared/interfaces/error-form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {

  getInvalidError(controls: Record<string, AbstractControl>) {

    let errorMessages: ErrorMessages = {};

    for (const key in controls) {
      const elementInvalid = controls[key];
      if (elementInvalid instanceof FormGroup) {
        this.getInvalidError(elementInvalid.controls);
      } else {

        if (elementInvalid?.hasError('required')) {
          errorMessages = this.addError(key, 'This field is required.',errorMessages)
        }
        if (elementInvalid?.hasError('email')) {
          errorMessages = this.addError(key, 'This field must be an email.',errorMessages)
        }
      }
    }
    return errorMessages;
  }

  addError(key: string, error: string, errorMessages:ErrorMessages) {

    let arrayErrors: string[] = [];
    if (errorMessages[key] && Array.isArray(errorMessages[key])) {
      arrayErrors = errorMessages[key];
    }
    arrayErrors.push(error);
    errorMessages[key] = arrayErrors;
    return errorMessages;
  }
}
