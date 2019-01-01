import * as Actions from '../actions';
import { DataState, IAction } from '../interfaces'

const dataInitialState = {
  loading: true,
  assetPack: null,
  instrument: null,
  midiFile: null,
};

const data = (state: DataState = dataInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      ...action.payload.data,
      loading: false,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      assetPack: action.payload.assetPack,
      loading: false,
    };
  } else if (action.type === Actions.INSTRUMENT_LOADED) {
    return {
      ...state,
      instrument: action.payload.instrument,
      loading: false,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    return {
      ...state,
      midiFile: action.payload.midiFile,
      loading: false,
    };
  }
  return state;
};

export {
  data,
  dataInitialState,
};