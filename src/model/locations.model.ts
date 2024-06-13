import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class LocationsResponse {
  @ApiProperty({ type: String, description: 'Location ID' })
  id: string;
  @ApiProperty({ type: String, description: 'Longitude' })
  long: string;
  @ApiProperty({ type: String, description: 'Latitude' })
  lat: string;
  @ApiProperty({ type: String, description: 'Altitude' })
  alt: string;
  @ApiProperty({ type: String, description: 'Location name' })
  location: string;
  @ApiProperty({ type: Date, description: 'Date and time' })
  dateTime: Date;
  @ApiProperty({ type: String, description: 'User ID' })
  createdBy: string;
}

export class AddLocationRequest {
  @ApiHideProperty()
  id: string;
  @ApiProperty({ type: String, description: 'Longitude', example: '1' })
  long: string;
  @ApiProperty({ type: String, description: 'Latitude', example: '1' })
  lat: string;
  @ApiProperty({ type: String, description: 'Altitude', example: '1' })
  alt: string;
  @ApiProperty({
    type: String,
    description: 'Location name',
    example: 'example location',
  })
  location: string;
  @ApiProperty({
    type: Date,
    description: 'Date and time',
    example: new Date(),
  })
  dateTime: Date;
  @ApiHideProperty()
  unitId: string;
  @ApiHideProperty()
  createdBy: string;
}
