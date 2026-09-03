export interface CustomerProfile {
  id: number;
  firstName: string;
  midName: string | null;
  lastName: string;
  fullName: string;
  listService: string | null;
  customerCIF: string;
  dob: string;
  national: string;
  gender: string;
  maritalStatus: string;
  email: string;
  idType: string;
  customerID: string;
  customerID1: string | null;
  customerID2: string | null;
  customerID3: string | null;
  idType1: string | null;
  idType2: string | null;
  idType3: string | null;
  issDate: string;
  issDate1: string | null;
  issDate2: string | null;
  issDate3: string | null;
  expDate: string;
  expDate1: string | null;
  expDate2: string | null;
  expDate3: string | null;
  nationalId: string;
  nationalId1: string | null;
  nationalId2: string | null;
  nationalId3: string | null;
  placeId: string;
  placeId1: string | null;
  placeId2: string | null;
  placeId3: string | null;
  phone: string;
  otherPhone: string | null;
  address: string;
  lastProcess: string;
  source: string;
  monthlyIncome: string;
  checkSmsActive: boolean;
  taxCode: string | null;
  job: string | null;
  jobTitle: string | null;
  priority: boolean;
}

export interface InquiryCustomerProfileResponse {
  code: number;
  desc: string;
  data: CustomerProfile;
}

export interface UpdateProfileRequest {
  customerID: string;
  email?: string;
  phone?: string;
}

export interface UpdateProfileResponse {
  code: number;
  desc: string;
  data: {
    success: boolean;
  };
}