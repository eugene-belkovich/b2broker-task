import {Test, TestingModule} from '@nestjs/testing';
import {BuildService} from './build.service';
import {BuildModule} from './build.module';

describe('BuildService', () => {
  let service: BuildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BuildModule],
    }).compile();

    service = module.get<BuildService>(BuildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read version.txt file', () => {
    const res = service.version();
    expect(res.trim()).toBeDefined();
  });
});
