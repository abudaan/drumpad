export interface SongState {
  sequencerReady: boolean,
  loop: boolean,
  beats: number,
  minBeats: number,
  maxBeats: number,
  sounds: number,
  minSounds: number,
  maxSounds: number,
  tempo: number,
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
  isPlaying: () => boolean,
  play: () => void,
  pause: () => void,
  stop: () => void,
};