export class LocationsResponse {
  id: string;
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: Date;
  createdBy: string;
}

export class AddLocationRequest {
  id: string;
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: Date;
  unitId: string;
  createdBy: string;
}
