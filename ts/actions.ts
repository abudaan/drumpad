export const UPDATE_BEATS = 'update beats';
export const UPDATE_SOUNDS = 'update sounds';
export const UPDATE_LOOP = 'update loop';
export const UPDATE_TEMPO = 'update tempo';

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

export const updateLoop = (loop:boolean) => {
  return {
    type: UPDATE_LOOP,
    payload: {
      loop,
    }
  };
};


