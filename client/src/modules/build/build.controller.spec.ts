import {Test, TestingModule} from '@nestjs/testing';
import {BuildModule} from './build.module';
import {BuildController} from './build.controller';

describe('BuildController', () => {
  let controller: BuildController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BuildModule],
    }).compile();

    controller = module.get<BuildController>(BuildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should read version.txt file', () => {
    const res = controller.version();
    expect(res.trim()).toBeDefined();
  });
});
