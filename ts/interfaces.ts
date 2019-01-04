import { Action } from "redux";

export interface SongState {
};

export interface AppState {
  tracks: Array<any>,
  playing: boolean,
  stopped: boolean,
  loop: boolean,
  tempo: number,
  bars: number,
  ppq: number,
  nominator: number,
  denominator: number,
  position?: SongPosition,
  song: null | HeartbeatSong,
  assetPack?: null | Object
  midiFile?: null | ArrayBuffer,
  instrument?: null | Object,
  instrumentIndex: number,
  trackIndex: number,
  controlsEnabled: boolean,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  rows: number,
  columns: number,
  granularity: number,
  beats: Array<any>,
  notes: Array<any>,
};

export interface State {
  song: SongState,
  app: AppState,
};

export interface IAction<T> extends Action {
  type: string;
  payload?: T;
  // error?: boolean;
  // meta?: any;
}

export interface SongPosition {
  bar: number,
  beat: number,
  barsAsString: string,
};


export interface HeartbeatSong {
  loop: boolean;
  playing: boolean,
  bpm: number,
  durationTicks: number,
  play: () => void,
  pause: () => void,
  stop: () => void,
  setTempo: (bpm: number, update?: boolean) => void,
  addEventListener: (event: string, typeOrCallback: any, callback?: () => void) => void,
  setLoop: () => void,
  setLeftLocator: (type: string, value: number) => void,
  setRightLocator: (type: string, value: number) => void,
};

export interface Config {
  midiFile: string,
  instrument: string,
  assetPack: string,
};

export interface ConfigData {
  song?: null | HeartbeatSong,
  instrument?: Object,
  assetPack?: Object,
};

export interface SongInfo {
  tracks: Array<any>,
  bars: number,
  ppq: number,
  nominator: number,
  denominator: number,
}