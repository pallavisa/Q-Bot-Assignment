import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private bookingService: BookingService) {}

  navigateToCreateBooking() {
    this.bookingService.setCurrentBooking(null); // Clear any existing booking data
    this.router.navigate(['/booking/create']);
  }
}
