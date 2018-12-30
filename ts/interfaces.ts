export interface SongState {
  sequencerReady: boolean,
  playing: boolean,
  position: SongPosition,
  loop: boolean,
  beats: number,
  minBeats: number,
  maxBeats: number,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
};

export interface SamplesState {
  numSamples: number,
  minSamples: number,
  maxSamples: number,
};

export interface AppState {
  song: SongState,
  samples: SamplesState,
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
  durationTicks: number,
  play: () => void,
  pause: () => void,
  stop: () => void,
  setTempo: (bpm: number, update?:boolean) => void,
  addEventListener: (event:string, callback:() => void) => void,
  setLoop: () => void,
  setLeftLocator: (type: string, value: number) => void,
  setRightLocator: (type: string, value: number) => void,
};