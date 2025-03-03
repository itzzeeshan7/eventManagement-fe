import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent implements OnInit {
  event: any = { name: '', location: '', date: '' };
  isEditMode: boolean = false;
  isLoading: boolean = false;
  eventForm:FormGroup
  usersList: any[] = []
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private fb:FormBuilder,
    private userService:UserService,
    private toastr:ToastrService,

  ) {
    this.eventForm= this.fb.group({
      name:[ '',Validators.required],
      location:[ '',Validators.required],
       date:[ '',Validators.required],
       participants: [[]],
    })
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.usersList = users;
    });
   this.getEventById()
    console.log(this.isEditMode)
  }
  getEventById() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.isLoading = true;
  
        this.eventService.getEventById(params['id']).subscribe(event => {
          this.isLoading = false;
          
          if (event) {
            console.log('this is event to update', event);
            const formattedDate = event.date ? event.date.split('T')[0] : '';
            this.event = event; 
  
            this.eventForm.patchValue({
              name: event.name || '',
              location: event.location || '',
              date: formattedDate, 
              participants: event.participants ? event.participants.map((user: any) => user._id) : []
            });
          }
        }, error => {
          this.isLoading = false;
          console.error("Error fetching event:", error);
          this.toastr.error("Failed to load event details");
        });
      }
    });
  }
  
  saveEvent() {
    console.log('here')
    this.isLoading = true;
    const event = {
      name: this.eventForm.value.name,
      location: this.eventForm.value.location,
      date: this.eventForm.value.date,
      participants: this.eventForm.value.participants,
    }
    if (this.isEditMode) {
      this.eventService.updateEvent(this.event._id, event).subscribe(() => {
        this.isLoading=false;
        this.toastr.success('Event Updated Successfully');
        this.router.navigate(['/events']);
      });
    } else {
      console.log('creating new event')
      this.eventService.createEvent(event).subscribe(() => {
        this.isLoading=false;
        this.toastr.success('Event Created Successfully');
        this.router.navigate(['/events']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/events']);
  }

  addParticipient(id:any){
    this.eventForm.value.participants.push(id)
  }

  
}
