import {ResponseType, StatusType} from '../enums';

export interface ResponseMessage {
  type: ResponseType;
  status?: StatusType;
  count?: number;
  updatedAt?: string;
  error?: string;
}
