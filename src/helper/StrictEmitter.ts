import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'strict-event-emitter-types';


export type StrictEmitter<Evts> = StrictEventEmitter<EventEmitter, Evts>
export const makeEmitter = <Events>() => new EventEmitter() as StrictEmitter<Events>


