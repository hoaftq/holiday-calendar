import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestDto, ResponseDto } from '../types/api-types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayCalendarService {
  constructor(private httpClient: HttpClient) { }

  public getHolidayData(request: RequestDto): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(
      environment.apiUrl,
      request,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
