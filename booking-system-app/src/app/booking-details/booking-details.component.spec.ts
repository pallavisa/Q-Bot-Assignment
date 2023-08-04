import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingDetailsComponent } from './booking-details.component';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';

describe('BookingDetailsComponent', () => {
  let component: BookingDetailsComponent;
  let fixture: ComponentFixture<BookingDetailsComponent>;
  let mockActivatedRoute: any;
  let mockBookingService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (param: string) => '123', // replace '123' with a valid booking ID for your test
        },
      },
    };

    mockBookingService = {
      getBookingById: jasmine.createSpy('getBookingById').and.returnValue(
        of({
          // mocked booking data
          id: '123',
          name: 'John Doe',
          status: 'confirmed',
        })
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [BookingDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BookingService, useValue: mockBookingService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBookingDetails() on ngOnInit', () => {
    spyOn(component, 'getBookingDetails');
    component.ngOnInit();
    expect(component.getBookingDetails).toHaveBeenCalled();
  });

  it('should fetch booking details for a valid bookingId', () => {
    component.getBookingDetails();
    expect(mockBookingService.getBookingById).toHaveBeenCalledWith('123'); // Replace '123' with the valid booking ID used in mockActivatedRoute
    expect(component.booking).toEqual({
      id: '123',
      name: 'John Doe',
      status: 'confirmed',
    });
  });
});
