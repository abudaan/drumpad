import * as Actions from '../actions/actions';
import { ControlsState, IAction } from '../interfaces'

const controlsInitialState = {
  controlsEnabled: false,
  playing: false,
  stopped: true,
  loop: true,
  trackIndex: 0,
  songIndex: 0,
  instrumentIndex: 0,
  tempo: 120,
  tempoTmp: 120,
  tempoMin: 20,
  tempoMax: 200,
  bars: 1,
  granularity: 960 / 4,
  granularityOptions: [
    4,
    8,
    16,
    32
  ],
  timestamp: 0,
  midiOutLatencyTmp: 0,
  midiOutLatency: 0,
};

const controls = (state: ControlsState = controlsInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    return {
      ...state,
      controlsEnabled: false,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    const {
      loop,
      tempoMin,
      tempoMax,
      granularityOptions,
    } = action.payload;
    return {
      ...state,
      granularityOptions,
      loop,
      tempoMin,
      tempoMax,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    return {
      ...state,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.CHOOSING_TEMPO) {
    return {
      ...state,
      tempoTmp: action.payload.tempoTmp,
    };
  } else if (action.type === Actions.UPDATE_TEMPO) {
    return {
      ...state,
      tempo: action.payload.tempo
    };
  } else if (action.type === Actions.CHOOSING_MIDI_OUT_LATENCY) {
    return {
      ...state,
      midiOutLatencyTmp: action.payload.latencyTmp,
    };
  } else if (action.type === Actions.UPDATE_MIDI_OUT_LATENCY) {
    return {
      ...state,
      midiOutLatency: action.payload.latency
    };
  } else if (action.type === Actions.SELECT_TRACK) {
    return {
      ...state,
      trackIndex: action.payload.trackIndex,
    };
  } else if (action.type === Actions.SELECT_INSTRUMENT) {
    return {
      ...state,
      instrumentIndex: action.payload.instrumentIndex,
    };
  } else if (action.type === Actions.SELECT_SONG) {
    return {
      ...state,
      trackIndex: 0,
      songIndex: action.payload.songIndex,
    };
  } else if (action.type === Actions.SEQUENCER_PLAY) {
    return {
      ...state,
      playing: !state.playing,
      stopped: false,
      timestamp: performance.now(),
    };
  } else if (action.type === Actions.SEQUENCER_STOP) {
    return {
      ...state,
      playing: false,
      stopped: true,
    };
  } else if (action.type === Actions.SET_LOOP) {
    return {
      ...state,
      loop: action.payload.loop,
    };
  }
  return state;
};

export {
  controls,
  controlsInitialState,
};