export class LocationsResponse {
  id: string;
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
}
