import { Action } from "redux";

export interface SongState {
  ppq: number
  bpm: number
  nominator: number
  denominator: number
  grid: null | Array<Array<GridCell>>
  trackList: Array<Track>
  instrumentList: Array<string>
  songs: Array<HeartbeatSong>
  songList: Array<string>
  position?: SongPosition
  bar?: number
  beat?: number
  sixteenth?: number
  ticks?: number
  barsAsString?: string
  timestamp: number
  activeNotes: Array<MIDINote>
  granularity: number
  granularityTicks: number
  updateInterval: number
  trackIndex: number
  songIndex: number
  activeColumn: number
  renderAction: string
  sequencerReady: boolean
  timeEvents: Array<MIDIEvent>
  freshMidiEvents: Array<MIDIEvent>
  staleMidiEvents: Array<MIDIEvent>
  currentMidiEvents: Array<MIDIEvent>
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
  tick?: number
  ticks: number
  timestamp: number
  barsAsString: string
  activeColumn: number,
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
  bars: number // number of bars in Song
  events: Array<MIDIEvent>
  timeEvents: Array<MIDIEvent>
  play: () => void
  pause: () => void
  stop: () => void
  update: () => void
  setTempo: (bpm: number, update?: boolean) => void
  addEventListener: (event: string, typeOrCallback: any, callback?: () => void) => void
  removeEventListener: (type: string) => void
  setLoop: (loop?: boolean) => void
  setLeftLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void
  setRightLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void
  addEvents: (events: Array<MIDIEvent>) => void
  addTimeEvents: (events: Array<MIDIEvent>) => void
  removeTimeEvents: () => void
};

export interface MIDIEvent {
  id: string
  bar: number
  type: number
  data1: number
  data2: number
  ticks: number
  noteName: string
  noteNumber: number
  velocity: number
  midiNote: MIDINote,
  song: null | HeartbeatSong,
  track: null | Track,
  part: null | Part,
};

export interface MIDINote extends MIDIEvent {
  trackId: string
  track: Track
  number: number
  noteOn: MIDIEvent,
  noteOff: MIDIEvent,
}

export interface Part {
  id: string
  name: string
  events: Array<MIDIEvent>
  addEvents: (events: Array<MIDIEvent>) => void
  removeEvents: (events: Array<MIDIEvent>, part?: Part) => void
}

export interface Track {
  id: string
  name: string
  parts: Array<Part>
  events: Array<MIDIEvent>
  addPart: (part: Part) => void
  removeEvents: (events: Array<MIDIEvent>) => void
  removeAllEvents: () => void
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

export interface SongInfo {
  tracks: Array<any>
  bars: number
  ppq: number
  nominator: number
  denominator: number
}

export interface GridCellData {
  ticks: number
  noteNumber: number
  midiEventId: null | string
  active: boolean
  selected: boolean
}

export type GridType = {
  cells: Array<GridCellData>
  rows: number
  cols: number
}
