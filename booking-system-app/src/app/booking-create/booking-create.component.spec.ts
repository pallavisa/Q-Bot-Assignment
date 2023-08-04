import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs'; // Import 'of' function for creating mock observables
import { BookingService } from '../booking.service';
import { BookingCreateComponent } from './booking-create.component';

describe('BookingCreateComponent', () => {
  let component: BookingCreateComponent;
  let fixture: ComponentFixture<BookingCreateComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'addBooking',
      'getCurrentBooking',
      'getBookingById', // Add the getBookingById function to the spy
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Provide a mock implementation for getCurrentBooking
    const mockBookingData = { bookingId: '123', bookingStart: '2023-07-23T09:00', /* ... Other properties ... */ };
    bookingServiceSpy.getCurrentBooking.and.returnValue(of(mockBookingData));

    // Provide a mock implementation for getBookingById
    const mockBooking = { bookingId: '456', bookingStart: '2023-07-24T10:00', /* ... Other properties ... */ };
    bookingServiceSpy.getBookingById.and.returnValue(of(mockBooking));

    await TestBed.configureTestingModule({
      declarations: [BookingCreateComponent],
      imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '123' }) } }, // Mock the ActivatedRoute paramMap
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCreateComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Manually trigger ngOnInit and setupMinBookingDateTime
    component.ngOnInit();
    component.setupMinBookingDateTime();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should show an alert for invalid booking time', () => {
    spyOn(window, 'alert');

    // Set the form to valid values
    component.bookingForm.controls['bookingStart'].setValue('2023-07-23T18:00');
    component.bookingForm.controls['duration'].setValue(30);
    component.bookingForm.controls['description'].setValue('Test booking');

    component.submitBooking();

    expect(window.alert).toHaveBeenCalledWith(
      'Invalid booking time! Bookings are only allowed between 09:00 and 17:00 on weekdays.'
    );
    expect(bookingService.addBooking).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
