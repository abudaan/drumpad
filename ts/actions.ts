import {SongPosition} from './interfaces';

export const SEQUENCER_READY = 'sequencer ready';
export const SEQUENCER_PLAY = 'sequencer play';
export const SEQUENCER_STOP = 'sequencer stop';
export const UPDATE_BEATS = 'update beats';
export const UPDATE_SAMPLES = 'update sanples';
export const CHOOSING_TEMPO = 'choosing tempo'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'update tempo'; // while releasing the thumb
export const UPDATE_POSITION = 'update position';
export const SET_LOOP = 'set loop';

export const sequencerReady = () => {
  return {
    type: SEQUENCER_READY,
  };
};

export const play = () => {
  return {
    type: SEQUENCER_PLAY,
  };
};

export const stop = () => {
  return {
    type: SEQUENCER_STOP,
  };
};

export const updateBeats = (beats:number) => {
  return {
    type: UPDATE_BEATS,
    payload: {
      beats,
    }
  };
};

export const updateSamples = (samples:number) => {
  return {
    type: UPDATE_SAMPLES,
    payload: {
      samples,
    }
  };
};

export const choosingTempo = (tempo:number) => {
  return {
    type: CHOOSING_TEMPO,
    payload: {
      tempo,
    }
  };
};

export const updateTempo = (tempo:number) => {
  return {
    type: UPDATE_TEMPO,
    payload: {
      tempo,
    }
  };
};

export const setLoop = (loop:boolean) => {
  return {
    type: SET_LOOP,
    payload: {
      loop,
    }
  };
};

export const updatePosition = (position:SongPosition) => {
  return {
    type: UPDATE_POSITION,
    payload: {
      position,
    }
  };
};


