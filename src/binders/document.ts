import { StrictEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { GlobalEvents } from '..';

export default (emitter: StrictEmitter<GlobalEvents>, win: Window) => {
  emitter.addListener('changeDocumentTitle', title => win.document.title = title)
}