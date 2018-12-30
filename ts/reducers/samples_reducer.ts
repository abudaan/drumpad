import * as Actions from '../actions';
import {ReduxAction} from '../interfaces'

const samplesInitialState = {
  noteNumberStart: 60, // first sample is at note number 60 -> central C
  noteNumberStep: 1, // next sample is at note number 61, and so on
  numSamples: 8, // actual number of samples
  minSamples: 4,
  maxSamples: 16,
};

const samples = (state = samplesInitialState, action:ReduxAction) => {
  if (action.type === Actions.DATA_LOADED) {
    console.log(action.payload.data);
    return {
      ...state,
      data: {...action.payload.data}
    };
  } else if (action.type === Actions.UPDATE_SAMPLES) {
    return {
      ...state,
      numSamples: parseInt(action.payload.samples, 10)
    };
  }
  return state;
};

export {
  samples,
  samplesInitialState,
};