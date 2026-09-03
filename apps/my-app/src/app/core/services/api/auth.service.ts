import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import {
  InquiryCustomerProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../../models/customer-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  inquiryCustomerProfile(): Observable<InquiryCustomerProfileResponse> {
    return this.api.post<InquiryCustomerProfileResponse>(API_ENDPOINTS.auth.inquiryCustomerProfile, {});
  }

  updateProfile(payload: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    return this.api.post<UpdateProfileResponse>(API_ENDPOINTS.auth.updateProfile, payload);
  }
}