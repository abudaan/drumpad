import {SongPosition} from './interfaces';

export const SEQUENCER_READY = 'sequencer ready';
export const SEQUENCER_PLAY = 'sequencer play';
export const SEQUENCER_STOP = 'sequencer stop';
export const UPDATE_BEATS = 'update beats';
export const UPDATE_SOUNDS = 'update sounds';
export const UPDATE_TEMPO = 'update tempo';
export const UPDATE_POSITION = 'update position';
export const SET_LOOP = 'update loop';
export const SET_TEMPO = 'set tempo';

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

export const updateSounds = (sounds:number) => {
  return {
    type: UPDATE_SOUNDS,
    payload: {
      sounds,
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

export const setTempo = (tempo:number) => {
  return {
    type: SET_TEMPO,
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


