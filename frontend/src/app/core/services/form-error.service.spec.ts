import { TestBed } from '@angular/core/testing';
import { FormErrorService } from './form-error.service';
import { FormGroup, FormControl } from '@angular/forms';

describe('FormErrorService', () => {
  let service: FormErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error messages for invalid controls', () => {
    const formGroup = new FormGroup({
      email: new FormControl('', { validators: [control => control.value ? null : { required: true }] }),
      name: new FormControl('', { validators: [control => control.value ? null : { required: true }] }),
    });

    const errors = service.getInvalidError(formGroup.controls);

    expect(errors).toEqual({
      email: ['This field is required.'],
      name: ['This field is required.']
    });
  });

  it('should handle nested FormGroup controls', () => {
    const formGroup = new FormGroup({
      firstName: new FormControl('', { validators: [control => control.value ? null : { required: true }] }),
      lastName: new FormControl('', { validators: [control => control.value ? null : { required: true }] }),
    });

    const errors = service.getInvalidError(formGroup.controls);

    expect(errors).toEqual({
      firstName: ['This field is required.'],
      lastName: ['This field is required.'],
    });
  });

  it('should add an error message to an existing key', () => {
    const errorMessages = {};
    service.addError('email', 'This field must be an email.', errorMessages);

    expect(errorMessages).toEqual({
      email: ['This field must be an email.']
    });

    service.addError('email', 'Another error message.', errorMessages);

    expect(errorMessages).toEqual({
      email: ['This field must be an email.', 'Another error message.']
    });
  });

  it('should handle a new key correctly', () => {
    const errorMessages = {};
    service.addError('password', 'Password is too short.', errorMessages);

    expect(errorMessages).toEqual({
      password: ['Password is too short.']
    });
  });
});
