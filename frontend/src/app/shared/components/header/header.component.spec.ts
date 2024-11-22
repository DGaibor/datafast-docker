import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title input', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('nav a');
    expect(navLinks.length).toBe(2);

    expect(navLinks[0].textContent).toContain('Orders');
    expect(navLinks[0].getAttribute('href')).toBe('/');

    expect(navLinks[1].textContent).toContain('Create Order');
    expect(navLinks[1].getAttribute('href')).toBe('/order/new');
  });

});
