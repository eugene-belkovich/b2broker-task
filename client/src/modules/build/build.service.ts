import {Injectable} from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class BuildService {
  public version(): string {
    const path = `${process.cwd()}/package.json`;
    const content = fs.readFileSync(path, 'utf8');

    const packageJson = JSON.parse(content);
    return packageJson.version;
  }
}
