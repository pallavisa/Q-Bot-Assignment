import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit,OnDestroy{
  booking: any;
  bookingDetails!:Subscription;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.getBookingDetails();
  }

  getBookingDetails(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.bookingDetails= this.bookingService.getBookingById(bookingId).subscribe({
        next: (data) => {
          this.booking = data;
        },
        error: (error) => {
          console.error('Error fetching booking details:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(this.bookingDetails){
      this.bookingDetails.unsubscribe();
    }
  }
}
