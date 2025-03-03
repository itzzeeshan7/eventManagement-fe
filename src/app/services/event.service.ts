import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

 
  getEvents(pageNumber: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${pageNumber}`);
  }
  

  getEventById(eventId: string): Observable<any> {
    console.log(eventId,'event id in service ')
    return this.http.get(`${this.apiUrl}/getEvent/${eventId}`);
  }


  createEvent(event: any): Observable<any> {
    console.log(event,'event in service')
    return this.http.post(`${this.apiUrl}/create`, event, { headers: this.getAuthHeaders() });
  }

  
  updateEvent(eventId: string, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${eventId}`, event, { headers: this.getAuthHeaders() });
  }


  deleteEvent(eventId: string): Observable<any> {
    console.log(eventId, 'this is event id to delete in service')
    return this.http.delete(`${this.apiUrl}/delete/${eventId}`, { headers: this.getAuthHeaders() });
  }

  joinEvent(eventId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/${eventId}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  leaveEvent(eventId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/${eventId}/leave`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  approveEvent(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    });
  console.log(id, ' this is event id in serice')
    return this.http.patch(`${this.apiUrl}/approve/${id}`, {}, { headers });
  }
  
  
}
