import { Action } from "redux";

export interface SongState {
  sequencerReady: boolean,
  song: null | HeartbeatSong,
  playing: boolean,
  position?: SongPosition,
  loop: boolean,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
};

export interface DataState {
  loading: null | string
  midiFile?: null | ArrayBuffer,
  instrument?: null | Object,
  instrumentIndex: number,
  assetPack?: null | Object
  tracks: Array<any>,
  songReady: boolean,
  track: number,
};

export interface AppState {
  song: SongState,
  data: DataState,
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