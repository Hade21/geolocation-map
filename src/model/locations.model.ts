export class LocationsResponse {
  id: number;
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: Date;
}

export class AddLocationRequest {
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: Date;
  unitId: string;
}
