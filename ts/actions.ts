export const UPDATE_BEATS = 'update rows';
export const UPDATE_SOUNDS = 'update columns';
export const UPDATE_LOOP = 'update loop';
export const UPDATE_TEMPO = 'update tempo';

export const updateBeats = (rows:number) => {
  return {
    type: UPDATE_BEATS,
    payload: {
      rows,
    }
  };
};

export const updateSounds = (columns:number) => {
  return {
    type: UPDATE_SOUNDS,
    payload: {
      columns,
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


