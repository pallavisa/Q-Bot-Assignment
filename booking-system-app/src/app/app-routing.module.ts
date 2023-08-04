import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', redirectTo: 'bookings', pathMatch: 'full' },
  { path: 'bookings', component: BookingListComponent },
  { path: 'booking/create', component: BookingCreateComponent,pathMatch:'full' },
  { path: 'booking/update/:id', component: BookingCreateComponent,pathMatch:'full' },
  { path: 'booking/:id', component: BookingDetailsComponent },
  { path: '**', component: PageNotFoundComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
