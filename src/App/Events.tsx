import { StrictEmitter } from '../helper/StrictEmitter';

export interface Events {
  changeDocumentTitle: string
}

export type Emitter = StrictEmitter<Events>

