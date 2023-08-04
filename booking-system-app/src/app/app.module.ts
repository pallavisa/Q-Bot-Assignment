import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    BookingListComponent,
    BookingDetailsComponent,
    BookingCreateComponent,
    PageNotFoundComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports:[BookingCreateComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
