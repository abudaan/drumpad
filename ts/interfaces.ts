import { Action } from "redux";

export interface SongState {
  song: null | HeartbeatSong
  grid: null | Array<Array<GridItem>>
  trackList: Array<Track>
  instrumentList: Array<string>
  songList: Array<HeartbeatSong>
  position?: SongPosition
  bar?: number
  beat?: number
  sixteenth?: number
  ticks?: number
  barsAsString?: string
  timestamp: number
  activeNotes: Array<MIDINote>
  granularity: number
  updateInterval: number
  trackIndex: number
};

export interface ControlsState {
  playing: boolean
  stopped: boolean
  loop: boolean
  tempo: number
  bars: number
  trackIndex: number
  songIndex: number
  instrumentIndex: number
  controlsEnabled: boolean
  tempoTmp: number
  tempoMin: number
  tempoMax: number
  granularity: number
  granularityOptions: Array<number>
  timestamp: number
};

export interface State {
  song: SongState
  controls: ControlsState
};

export interface IAction<T> extends Action {
  type: string
  payload?: T
  // error?: boolean
  // meta?: any
}

export interface SongPosition {
  bar?: number
  beat?: number
  sixteenth?: number
  ticks?: number
  barsAsString: string
  activeNotes: Array<MIDIEvent>
};

export type Listener = {
  [key: string]: any
}

export interface HeartbeatSong {
  bar: number
  ppq: number
  nominator: number
  denominator: number
  beat: number
  sixteenth: number
  tick: number
  ticks: number
  barsAsString: string
  activeNotes: Array<MIDIEvent>
  id: string
  name: string
  loop: boolean
  playing: boolean
  bpm: number
  durationTicks: number
  millisPerTick: number
  tracks: Array<Track>
  listeners: Listener
  loopEndPosition: SongPosition
  play: () => void
  pause: () => void
  stop: () => void
  setTempo: (bpm: number, update?: boolean) => void
  addEventListener: (event: string, typeOrCallback: any, callback?: () => void) => void
  removeEventListener: (type: string) => void
  setLoop: (loop?: boolean) => void
  setLeftLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void
  setRightLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void
};

export interface MIDIEvent {
  bar: number
  type: number
  data1: number
  data2: number
  ticks: number
  noteName: string
  noteNumber: number
  velocity: number
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
  instruments: Array<Instrument>
  midifiles: Array<string>
}

export interface MIDIFileJSON {
  id: string,
  url: string,
  name: string,
}

// config file that gets loaded when the app starts
export interface Config {
  midiFile: string
  assetPack: string
  instrument: string
  tempoMin: number
  tempoMax: number
  granularity: number
  granularityOptions: Array<number>
};

// result of parsing the config file
export interface ConfigData {
  assetPack: null | AssetPack
};

export interface SongInfo {
  tracks: Array<any>
  bars: number
  ppq: number
  nominator: number
  denominator: number
}

export interface GridItem {
  ticks: number
  noteNumber: number
  midiEvent: null | MIDIEvent
  active: boolean
}

export type GridType = Array<Array<GridItem>>;
