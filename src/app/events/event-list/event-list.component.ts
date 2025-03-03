import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  paginatedEvents: any[] = [];
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedDate: string = '';

  currentPage: number = 1;
  pageNumber: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  isAdmin: boolean = false;
  isOwner: boolean = false;
  isJoined: boolean = false;
  userId: string = '';
  eventId: string = '';
  showDeleteConfirmation = false
  createdBy:any
  isLoading: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService:AuthService,
    private toastr: ToastrService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.isAdmin();
    console.log(this.isAdmin,'is role is admin');
    console.log(this.userId,'this is a user Id');
    this.fetchEvents();
  }

 
  fetchEvents() {
    this.isLoading = true;
    this.eventService.getEvents(this.currentPage).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        console.log("API Response", data); 
  
        if (data) {
          if (this.isAdmin) {
            this.events = data.events;
          } else {
            this.events = data.events.filter((event: any) => 
              event.status === "Approved" || event.createdBy.toString() === this.userId.toString() || event.participants.includes(this.userId)
            );
          }
        } 
        this.totalPages = data.totalPages;
        this.filterEvents();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error("Error fetching events:", error);
        this.toastr.error('Error fetching events');
      },
    });
  }
  
  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      return (
        (this.searchQuery ? event.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true) &&
        (this.selectedLocation ? event.location === this.selectedLocation : true) &&
        (this.selectedDate ? event.date.startsWith(this.selectedDate) : true)
      );
    });
  }
  isEventOwner(event: any): boolean {
    return event.createdBy.toString() === this.userId.toString();
  }



  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchEvents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchEvents();
    }
  }

  canJoin(event: any): boolean {
    return new Date(event.date) >= new Date() && event.createdBy.toString() !== this.userId.toString();
  }

  isParticipant(event: any):boolean {
    return event.participants.includes(this.userId);
  }

  editEvent(event: any) {
    this.router.navigate(['/event-form'], { queryParams: { id: event._id } });
  }
 
  deleteEvent(eventId: string) {
    this.isLoading = true;
    console.log(eventId, ' this is event id to delete ')
      this.eventService.deleteEvent(eventId).subscribe({
        next:(response:any) =>{
          this.isLoading = false;
          console.log('Delete Event success')
          this.toastr.success('Event Deleted Successfully');
          this.showDeleteConfirmation=false;
          this.fetchEvents()
        },
        error:(error:any) =>{
          this.isLoading = false;
          console.log('Delete Event error', error)
          this.toastr.error('Event Deleted Error');
        }
      })
  }

  openEventForm() {
    this.router.navigate(['/event-form']);
  }

  get uniqueLocations(): string[] {
    return [...new Set(this.events.map(event => event.location))];
  }

  joinEvent(eventId: string) {
    this.isLoading = true;
    this.eventService.joinEvent(eventId).subscribe({
      next:(response:any) =>{
        console.log(response, 'join event response')
        this.isJoined=true;
        this.isLoading = false;
        this.toastr.success('Event Joined Successfully');
        this.fetchEvents();
      },
      error:(error:any) =>{
        this.isLoading = false;
        console.log('joinEvent error', error)
        this.isJoined=false;
        this.toastr.error('Event Joined Error');
      }
    })
  }

  approveEvent(eventId: string) {
    this.isLoading = true;
    this.eventService.approveEvent(eventId).subscribe({
      next:(response:any) =>{
        this.isLoading = false;
        console.log('approveEvent success')
        this.toastr.success('Event Approved Successfully');
        this.fetchEvents();
      },
      error:(error:any) =>{
        this.isLoading = false;
        console.log('approveEvent error', error)
        this.toastr.error('Event Approved Error');
      }
    })
  }
  openModel(id:any){
    this.eventId = id;
    this.showDeleteConfirmation = true;
  }
  confirmDelete(){
    if(this.eventId){
      this.deleteEvent(this.eventId)
    }
  }
  leaveEvent(eventId: string) {
    this.isLoading = true;
    this.eventService.leaveEvent(eventId).subscribe({
      next:(response:any) =>{
        this.isLoading = false;
        console.log(response,'leaveEvent success')
        this.toastr.success('Event Leave Successfully');
        this.isJoined=false;
        this.fetchEvents();
        this.filterEvents()
      },
      error:(error:any) =>{
        this.isLoading = false;
        console.log('leaveEvent error', error)
        this.isJoined=true;
        this.toastr.error('Event Leave Error');
      }
    })
}
}