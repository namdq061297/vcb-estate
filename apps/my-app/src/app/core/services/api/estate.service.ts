import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import {
  EstateKccValuationRequest,
  EstateKccValuationResponse,
  EstateKdtValuationRequest,
  EstateKdtValuationResponse,
} from '../../models/estate.model';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  private readonly api = inject(ApiService);

  getValuationKcc(payload: EstateKccValuationRequest): Observable<EstateKccValuationResponse> {
    return this.api.post<EstateKccValuationResponse>(API_ENDPOINTS.avm.getValuationKcc, payload);
  }

  getValuationKdt(payload: EstateKdtValuationRequest): Observable<EstateKdtValuationResponse> {
    return this.api.post<EstateKdtValuationResponse>(API_ENDPOINTS.avm.getValuationKdt, payload);
  }
}
