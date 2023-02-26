import {RequestType} from '../enums';

export interface RequestMessage {
  type: RequestType;
  data?: string;
}
