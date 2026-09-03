import { HttpParams } from '@angular/common/http';

export const formatQueryParams = (params: object): string => {
  return new HttpParams({
    fromObject: Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    )
  }).toString();
};
