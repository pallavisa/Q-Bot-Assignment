import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking } from './booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl =
    'https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/UGFsbGF2aSBT';

  private currentBookingSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  public currentBooking$: Observable<any> =
    this.currentBookingSubject.asObservable();

  constructor(private http: HttpClient) {}

  setCurrentBooking(booking: Booking | null) {
    this.currentBookingSubject.next(booking);
  }

  getCurrentBooking(): Observable<Booking> {
    return this.currentBookingSubject.asObservable(); // Return the observable to components
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  getBookingById(bookingId: string): Observable<Booking[]> {
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.get<Booking[]>(url);
  }

  addBooking(booking: Booking): Observable<any> {
    return this.http.post(this.baseUrl, booking);
  }

  updateBooking(bookingId: string, booking: any): Observable<any> {
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.put(url, booking);
  }

  deleteBooking(bookingId: string): Observable<any> {
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.delete(url);
  }
}
