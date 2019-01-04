import { Action } from "redux";

export interface SongState {
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
};

export interface AppState {
  assetPack?: null | Object
  midiFile?: null | ArrayBuffer,
  instrument?: null | Object,
  instrumentIndex: number,
  trackIndex: number,
  songReady: () => void,
  controlsEnabled: boolean,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  rows: number,
  columns: number,
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
  addEventListener: (event: string, callback: () => void) => void,
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
  midiFile?: void | ArrayBuffer
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