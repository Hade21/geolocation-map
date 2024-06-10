export class UnitsResponse {
  id: string;
  name: string;
  type: string;
  egi: string;
}

export class CreateUnitsRequest {
  id: string;
  name: string;
  type: string;
  egi: string;
  createdBy: string;
}

export class UpdateUnitsRequest {
  id: string;
  name?: string;
  type?: string;
  egi?: string;
}
