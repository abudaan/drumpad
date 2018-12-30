export interface SongState {
  sequencerReady: boolean,
  playing: boolean,
  position: SongPosition,
  loop: boolean,
  beats: number,
  minBeats: number,
  maxBeats: number,
  sounds: number,
  minSounds: number,
  maxSounds: number,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
};

export interface AppState {
  song: SongState,
};

export interface ReduxAction {
  type: string,
  payload: {
    [key:string]: any,
  },
}

export interface SongPosition {
  bar: number,
  beat: number,
  barsAsString: string,
};

export interface HeartbeatSong {
  playing: boolean,
  bpm: number,
  play: () => void,
  pause: () => void,
  stop: () => void,
  setTempo: (bpm: number, update?:boolean) => void,
  addEventListener: (event:string, callback:() => void) => void,
};