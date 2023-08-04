import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking } from '../booking.interface';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
})
export class BookingListComponent implements OnInit, OnDestroy {
  bookings: any[] = [];
  subscribeBooking!: Subscription;
  deleteSubscribe: any;

  constructor(private bookingService: BookingService, private route: Router) {}

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.subscribeBooking = this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (error) => {
        console.error('Error fetching all bookings:', error);
      },
    });
  }

  deleteBooking(bookingId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this booking?'
    );

    if (confirmed) {
      this.deleteSubscribe = this.bookingService
        .deleteBooking(bookingId)
        .subscribe({
          next: () => {
            this.getBookings();
          },
          error: (error) => {
            console.error('Error while deleting booking:', error);
          },
        });
    }
  }

  updateBooking(booking: Booking) {
    this.bookingService.setCurrentBooking(booking);
    this.route.navigate(['/booking/update', booking.bookingId]);
  }

  viewBooking(bookingId: string) {
    this.route.navigate(['/booking', bookingId]);
  }

  ngOnDestroy(): void {
    if (this.subscribeBooking) {
      this.subscribeBooking.unsubscribe();
    }
    if (this.deleteSubscribe) {
      this.deleteSubscribe.unsubscribe();
    }
  }
}
