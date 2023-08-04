import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingListComponent } from './booking-list.component';
import { BookingService } from '../booking.service';
import { of } from 'rxjs';

describe('BookingListComponent', () => {
  let component: BookingListComponent;
  let fixture: ComponentFixture<BookingListComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;

  beforeEach(async () => {
    // Create a mock BookingService
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['getAllBookings', 'deleteBooking']);

    await TestBed.configureTestingModule({
      declarations: [BookingListComponent],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingListComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch bookings during initialization', () => {
    const mockBookings = [
      {
        bookingStart: '2023-07-23T12:00:00',
        bookingEnd: '2023-07-23T14:00:00',
        description: 'Test Booking 1',
        bookingId: 'abc123'
      },
      {
        bookingStart: '2023-07-24T09:00:00',
        bookingEnd: '2023-07-24T11:00:00',
        description: 'Test Booking 2',
        bookingId: 'def456'
      }
    ];

    bookingService.getAllBookings.and.returnValue(of(mockBookings));

    component.ngOnInit();

    expect(component.bookings).toEqual(mockBookings);

    expect(bookingService.getAllBookings).toHaveBeenCalled();
  });
});
