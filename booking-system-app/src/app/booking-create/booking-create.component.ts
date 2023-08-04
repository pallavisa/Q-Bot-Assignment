import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Subscription } from 'rxjs';
import { Booking } from '../booking.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.css'],
})
export class BookingCreateComponent implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  bookingStart: string = '';
  duration: number = 30;
  description: string = '';
  minBookingDateTime: string = '';

  isUpdateMode: boolean = false;
  bookingToUpdate: any;
  originalBookingData: any;
  private bookingSubscription: Subscription | undefined;

  constructor(
    private bookingService: BookingService,
    private formBuilder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setupMinBookingDateTime();
    this.initForm();
  
    this.router.paramMap.subscribe((params) => {
      const bookingId = params.get('id');
      if (bookingId) {
        this.getBookingDetails(bookingId);
      }
    });
  
    this.bookingSubscription = this.bookingService
      .getCurrentBooking()
      .subscribe((bookingData) => {
        if (bookingData) {
          this.handleExistingBooking(bookingData);
        } else {
          this.handleNewBooking();
        }
      });
  }
  
  private getBookingDetails(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (data) => {
        this.handleBookingUpdate(data);
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
      }
  });
  }

  private handleBookingUpdate(data: any): void {
    this.isUpdateMode = true;
    this.bookingToUpdate = data;
    this.originalBookingData = { ...this.bookingToUpdate };
    this.populateFormFields(this.bookingToUpdate);
  }
  
  private handleExistingBooking(bookingData: any): void {
    this.handleBookingUpdate(bookingData);
  }
  
  private handleNewBooking(): void {
    this.isUpdateMode = false;
    this.bookingToUpdate = null;
    this.originalBookingData = null;
    this.resetForm();
  }

  initForm(): void {
    this.bookingForm = this.formBuilder.group({
      bookingStart: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setupMinBookingDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    this.minBookingDateTime = now.toISOString().slice(0, 16);
  }

  populateFormFields(booking: any) {
    // Format the date to 'yyyy-MM-ddTHH:mm'
    const bookingStartDateTime = new Date(booking.bookingStart);
    const year = bookingStartDateTime.getFullYear();
    const month = ('0' + (bookingStartDateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + bookingStartDateTime.getDate()).slice(-2);
    const hours = ('0' + bookingStartDateTime.getHours()).slice(-2);
    const minutes = ('0' + bookingStartDateTime.getMinutes()).slice(-2);
    this.bookingStart = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.duration =
      (new Date(booking.bookingEnd).getTime() -
        bookingStartDateTime.getTime()) /
      60000;
    this.description = booking.description;
  }

  submitBooking() {
    if (!this.bookingForm.valid) {
      alert('Please fill in all required fields.');
      return;
    }

    const bookingStartTime = new Date(this.bookingStart);
    const bookingEndTime = new Date(
      bookingStartTime.getTime() + this.duration * 60000
    );

    if (!this.isValidBookingTime(bookingStartTime, bookingEndTime)) {
      alert(
        'Invalid booking time! Bookings are only allowed between 09:00 and 17:00 on weekdays.'
      );
      return;
    }

    const booking = {
      bookingId: this.generateBookingId(), // Generate a new bookingId
      bookingStart: bookingStartTime.toISOString(),
      bookingEnd: bookingEndTime.toISOString(),
      description: this.description,
    };

    if (this.isUpdateMode) {
      booking.bookingId = this.bookingToUpdate.bookingId;
      this.updateBooking(booking);
    } else {
      this.createBooking(booking);
    }
  }

  createBooking(booking: Booking) {
    this.bookingService.addBooking(booking).subscribe({
      next: () => {
        alert('Booking successfully added!');
        this.resetForm();
      },
      error: (error:any) => {
        alert('Error while adding booking: ' + error.message);
      }
    });
  }

  updateBooking(booking: any) {
    // Update the existing booking using the bookingService

    this.bookingService
      .updateBooking(this.bookingToUpdate.bookingId, booking)
      .subscribe({
        next: () => {
          alert('Booking successfully updated!');
          this.isUpdateMode = false;
          this.route.navigate(['/bookings']);
        },
        error: (error:any) => {
          alert('Error while updating booking: ' + error.message);
        },
      });
  }

  updateCurrentBookingData(booking: any) {
    this.bookingService.setCurrentBooking(booking);
  }

  resetForm() {
    this.bookingStart = '';
    this.duration = 30;
    this.description = '';
    this.isUpdateMode = false;
  }

  private isValidBookingTime(startTime: Date, endTime: Date): boolean {
    // Check if the booking starts and ends within 09:00–17:00 on weekdays (Monday–Friday)
    if (
      startTime.getHours() < 9 ||
      startTime.getHours() >= 17 ||
      endTime.getHours() < 9 ||
      endTime.getHours() >= 17 ||
      startTime.getDay() === 0 ||
      startTime.getDay() === 6 ||
      endTime.getDay() === 0 ||
      endTime.getDay() === 6 // Sunday (0) and Saturday (6)
    ) {
      return false;
    }
    return true;
  }

  generateBookingId(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let bookingId = '';
    for (let i = 0; i < 8; i++) {
      bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return bookingId;
  }

  ngOnDestroy() {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }
}
