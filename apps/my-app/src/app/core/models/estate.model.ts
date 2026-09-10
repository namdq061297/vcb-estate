export interface EstateKccValuationRequest {
  Tinh_Thanh_Pho: string;
  Phuong_xa?: string;
  Ten_du_an: string;
  Ten_toa_nha: string;
  So_can_ho: string;
}

export interface EstateKccValuationResult {
  Ten_du_an: string;
  Ten_toa_nha: string;
  So_can_ho: string;
  Dien_tich: number;
  So_phong_ngu: number;
  So_phong_ve_sinh: number;
  Tang: string;
  Vi_tri: string;
  Don_gia_du_doan: number;
  Min_don_gia_du_doan: number;
  Max_don_gia_du_doan: number;
  Min_uoc_gia: number;
  Max_uoc_gia: number;
}

export interface EstateKdtValuationRequest {
  Tinh_Thanh_Pho: string;
  Phuong_xa?: string;
  Ten_du_an: string;
  So_nha_ma_can: string;
}

export interface EstateKdtValuationResult {
  Ten_du_an: string;
  Phan_khu: string;
  So_nha_ma_can: string;
  Dien_tich: number;
  So_mat_tien: number;
  Don_gia_du_doan: number;
  Min_don_gia_du_doan: number;
  Max_don_gia_du_doan: number;
  Min_uoc_gia: number;
  Max_uoc_gia: number;
}

export interface EstateValuationSuccessResponse<TResult> {
  request_id: string;
  status: 'SUCCESS';
  result: TResult;
  recommendation: TResult[];
}

export type EstateKccValuationResponse = EstateValuationSuccessResponse<EstateKccValuationResult>;

export type EstateKdtValuationResponse = EstateValuationSuccessResponse<EstateKdtValuationResult>;

export type EstateValuationErrorCode =
  | 'INVALID_JSON'
  | 'INVALID_REQUEST'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'KCC_PROPERTY_NOT_FOUND'
  | 'KDT_PROPERTY_NOT_FOUND'
  | 'AMBIGUOUS_PROPERTY'
  | 'PROPERTY_DATA_INCOMPLETE'
  | 'VALUATION_NOT_AVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface EstateValuationErrorDetail {
  field: string;
  reason: string;
}

export interface EstateValuationErrorResponse {
  request_id: string;
  status: 'ERROR';
  error: {
    code: EstateValuationErrorCode;
    message: string;
    details?: EstateValuationErrorDetail[];
  };
}
