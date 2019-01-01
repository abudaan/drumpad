import * as Actions from '../actions';
import { DataState, IAction } from '../interfaces'

const dataInitialState = {
  loading: true,
  instrument: null,
};

const data = (state: DataState = dataInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    console.log('LOADING')
    return {
      loading: true,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      instrument: action.payload.instrument,
      loading: false,
    };
  }
  return state;
};

export {
  data,
  dataInitialState,
};