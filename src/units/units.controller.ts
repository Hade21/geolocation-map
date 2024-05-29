import { Body, Controller } from '@nestjs/common';
import { UnitsRequest, UnitsResponse } from 'src/model/units.model';
import { WebResponse } from 'src/model/web.model';
import { UnitsService } from './units.service';

@Controller('/api/units')
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  async create(
    @Body() request: UnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    const result = await this.unitsService.create(request);
    return { data: result };
  }
}
