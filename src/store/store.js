import { createStore } from 'redux';
import reducer, {initialState} from './reducer';

const store = createStore(reducer, initialState);

const dispatch = store.dispatch;

export { store, dispatch };