import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class UnitsResponse {
  @ApiProperty({ type: String, description: 'Unit ID' })
  id: string;
  @ApiProperty({
    type: String,
    description: 'Unit Name',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Unit Type',
  })
  type: string;
  @ApiProperty({ type: String, description: 'Unit EGI' })
  egi: string;
}

export class CreateUnitsRequest {
  @ApiHideProperty()
  id: string;
  @ApiProperty({
    type: String,
    example: 'TL001-0001',
    description: 'Unit Name',
    minLength: 1,
    maxLength: 100,
  })
  name: string;
  @ApiProperty({
    type: String,
    example: 'Tower Lamp',
    description: 'Unit Type',
    minLength: 1,
    maxLength: 100,
  })
  type: string;
  @ApiProperty({
    type: String,
    example: 'B5+SV1',
    description: 'Unit EGI',
    minLength: 1,
    maxLength: 100,
  })
  egi: string;
  @ApiHideProperty()
  createdBy: string;
}

export class UpdateUnitsRequest {
  @ApiProperty({ type: String, example: '1', description: 'Unit ID' })
  id: string;
  @ApiProperty({
    type: String,
    example: 'TL001-0001',
    description: 'Unit Name',
    minLength: 1,
    maxLength: 100,
  })
  name?: string;
  @ApiPropertyOptional({
    type: String,
    example: 'Tower Lamp',
    description: 'Unit Type',
    minLength: 1,
    maxLength: 100,
  })
  type?: string;
  @ApiPropertyOptional({
    type: String,
    example: 'B5+SV1',
    description: 'Unit EGI',
    minLength: 1,
    maxLength: 100,
  })
  egi?: string;
}
