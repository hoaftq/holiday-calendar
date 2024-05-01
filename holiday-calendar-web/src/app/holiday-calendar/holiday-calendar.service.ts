import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestDto, ResponseDto } from '../types/api-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidayCalendarService {
  constructor(private httpClient: HttpClient) {}

  public getHolidayData(request: RequestDto): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(
      'http://127.0.0.1:3000/holiday-calendar',
      request,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
