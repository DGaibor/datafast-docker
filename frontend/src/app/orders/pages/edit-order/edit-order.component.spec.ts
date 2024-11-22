import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditOrderComponent } from './edit-order.component';
import { ActivatedRoute } from '@angular/router';

describe('EditOrderComponent', () => {
  let component: EditOrderComponent;
  let fixture: ComponentFixture<EditOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrderComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null), // Simula que el parámetro 'id' devuelve '123'
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set orderId from route parameters on ngOnInit', () => {
    component.ngOnInit();
    expect(component.orderId).toBe('123');
  });

  it('should have the title "Edit Order"', () => {
    expect(component.title).toBe('Edit Order');
  });
});
