import {Controller, Get, Inject} from '@nestjs/common';
import {BuildService} from './build.service';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('Infrastructure')
@Controller()
export class BuildController {
  public constructor(@Inject(BuildService) private readonly buildService: BuildService) {}

  @Get('version')
  public version(): string {
    return this.buildService.version();
  }
}
