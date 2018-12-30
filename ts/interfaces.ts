export interface SongState {
  beats: number,
  sounds: number,
  tempo: number,
  loop: boolean,
  minBeats: number,
  maxBeats: number,
  minSounds: number,
  maxSounds: number,
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
