import { Body, Controller, Post } from '@nestjs/common';
import { UnitsRequest, UnitsResponse } from '../model/units.model';
import { WebResponse } from '../model/web.model';
import { UnitsService } from './units.service';

@Controller('/api/v1/units')
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @Post()
  async create(
    @Body() request: UnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    const result = await this.unitsService.create(request);
    return { data: result };
  }
}
