import * as Actions from '../actions';
import {ReduxAction} from '../interfaces'

const samplesInitialState = {
};

const samples = (state = samplesInitialState, action:ReduxAction) => {
  if (action.type === Actions.UPDATE_SAMPLES) {
    return {
      ...state,
      numSamples: parseInt(action.payload.samples, 10)
    };
  // } else if (action.type === Actions.DATA_LOADED) {
  //   return {
  //     ...state,
  //     ...action.payload.data,
  //   };
  }
  return state;
};

export {
  samples,
  samplesInitialState,
};