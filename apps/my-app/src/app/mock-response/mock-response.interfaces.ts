export interface MockResponseEnvelope<TBody = unknown> {
  statusCode?: number;
  delayMs?: number;
  headers?: Record<string, string>;
  body: TBody;
}

export interface ApiMessageResponse<TData = unknown> {
  code: number;
  desc: string;
  data: TData;
}

export interface CaptchaGenerateMockBody {
  captchaId: string;
  imageData: string;
  expiresIn: number;
}

export interface CaptchaVerifyMockBody {
  success: boolean;
  reason?: 'invalid_payload' | 'not_found' | 'expired' | 'mismatch';
}

export interface ApiStatusMockBody {
  success: boolean;
  message?: string;
}

export interface CaptchaVerifyResponseData {
  success: boolean;
  reason: string | null;
}

export interface CaptchaVerifyResponse extends ApiMessageResponse<CaptchaVerifyResponseData> {}

export interface VerifySessionResponse extends ApiMessageResponse<CaptchaVerifyResponseData> {}

export interface UpdateDocumentResponseData {
  success: boolean;
  documentId: string;
}

export interface UpdateDocumentResponse extends ApiMessageResponse<UpdateDocumentResponseData> {}

export interface HolidayItem {
  date: string;
  name: string;
}

export interface HolidayListResponseData extends Array<HolidayItem> {}

export interface HolidayListResponse extends ApiMessageResponse<HolidayListResponseData> {}

export interface MockResponseFile<TBody = unknown> extends MockResponseEnvelope<TBody> {}