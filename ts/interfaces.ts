import { Action } from "redux";

export interface SongState {
  song: null | HeartbeatSong
  trackList: Array<Track>
  instrumentList: Array<string>
  songList: Array<HeartbeatSong>
  position?: SongPosition,
  bar: number,
  beat: number,
  sixteenth: number,
  tick: number,
  barsAsString: string,
  activeNotes: Array<MIDINote>
};

export interface ControlsState {
  playing: boolean,
  stopped: boolean,
  loop: boolean,
  tempo: number,
  bars: number,
  trackIndex: number,
  songIndex: number,
  instrumentIndex: number,
  controlsEnabled: boolean,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  granularity: number,
  granularityOptions: Array<number>,
  beats: Array<any>,
  notes: Array<any>,
};

export interface State {
  song: SongState,
  controls: ControlsState,
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
  sixteenth: number,
  barsAsString: string,
  activeNotes: Array<MIDIEvent>,
};

export type Listener = {
  [key: string]: any,
}

export interface HeartbeatSong {
  bar: number,
  beat: number,
  sixteenth: number,
  tick: number,
  barsAsString: string,
  activeNotes: Array<MIDIEvent>,
  id: string,
  name: string,
  loop: boolean;
  playing: boolean,
  bpm: number,
  durationTicks: number
  tracks: Array<Track>
  listeners: Listener
  play: () => void
  pause: () => void
  stop: () => void
  setTempo: (bpm: number, update?: boolean) => void,
  addEventListener: (event: string, typeOrCallback: any, callback?: () => void) => void,
  removeEventListener: (type: string) => void,
  setLoop: (loop?: boolean) => void,
  setLeftLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void,
  setRightLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void,
};

export interface MIDIEvent {
  bar: number
  type: number
  data1: number
  data2: number
  ticks: number
  noteName: string
  noteNumber: number
};

export interface MIDINote extends MIDIEvent {
  trackId: string
  track: Track
  number: number
}

export interface Track {
  id: string
  name: string
  events: Array<MIDIEvent>
};

export interface Instrument {
  name: string
};

export interface AssetPack {
  instruments: Array<Instrument>,
  midifiles: Array<string>,
}

export interface MIDIFileJSON {
  id: string,
  url: string,
  name: string,
}

// config file that gets loaded when the app starts
export interface Config {
  midiFile: string,
  assetPack: string,
  instrument: string,
  tempoMin: number,
  tempoMax: number,
  granularity: number,
  granularityOptions: Array<number>,
};

// result of parsing the config file
export interface ConfigData {
  assetPack: null | AssetPack,
};

export interface SongInfo {
  tracks: Array<any>,
  bars: number,
  ppq: number,
  nominator: number,
  denominator: number,
}