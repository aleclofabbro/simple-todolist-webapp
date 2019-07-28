import { StrictEmitter } from '../helper/StrictEmitter';
import { GlobalEvents } from '..';

export default (emitter: StrictEmitter<GlobalEvents>) => {
  emitter.addListener('changeDocumentTitle', title => window.document.title = title)
}