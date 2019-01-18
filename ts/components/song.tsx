import React from 'react';
import sequencer from 'heartbeat-sequencer';
import { HeartbeatSong, MIDIEvent, SongPosition, Track, Part, MIDINote } from '../interfaces';

// render actions
export const PASS = 'PASS';
export const INIT = 'INIT';
export const SONG = 'SONG';
export const TRACK = 'TRACK';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const TEMPO = 'TEMPO';
export const SET_LOOP = 'SET_LOOP';
export const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const PROCESS_MIDI_EVENT = 'PROCESS_MIDI_EVENT';

interface Song {
  part: Part
  track: Track
  song: HeartbeatSong
  props: SongPropTypes
};

export type SongPropTypes = {
  bpm: number,
  ppq: number,
  nominator: number,
  denominator: number,
  timestamp: number,
  updateInterval: number,
  granularityTicks: number,
  loop: boolean,
  tempo: number,
  playing: boolean,
  stopped: boolean,
  trackIndex: number,
  instrumentName: string,
  renderAction: string,
  midiEvent: MIDIEvent,
  timeEvents: Array<MIDIEvent>,
  allMIDIEvents: Array<MIDIEvent>,
  activeMIDIEventIds: Array<string>,
  updatePosition: (pos: SongPosition) => void,
};

class Song extends React.PureComponent {
  componentDidMount() {
    requestAnimationFrame(this.updatePosition.bind(this));
  }

  render() {
    console.log('<Song> render', this.props.renderAction);
    switch (this.props.renderAction) {
      case INIT:
        this.initSong();
        this.updateTrack();
        this.song.update();
        this.unmuteEvents();
        this.selectInstrument();
        this.setLocators();
        break;

      case SONG:
        this.updateSong();
        this.updateTrack();
        this.song.update();
        this.unmuteEvents();
        this.setLocators();
        break;

      case TRACK:
        this.muteAllEvents();
        this.updateTrack();
        this.song.update();
        this.unmuteEvents();
        this.setLocators();
        break;

      case UPDATE_EVENTS:
        this.muteAllEvents();
        this.unmuteEvents();
        break;

      case PLAY:
        this.song.play();
        break;

      case PAUSE:
        this.song.pause();
        break;

      case STOP:
        this.song.stop();
        break;

      case TEMPO:
        this.song.setTempo(this.props.tempo);
        break;

      case SET_LOOP:
        this.song.setLoop(this.props.loop);
        break;

      case SELECT_INSTRUMENT:
        this.selectInstrument();
        break;

      case PROCESS_MIDI_EVENT:
        this.track.processMidiEvent(sequencer.createMidiEvent(this.props.midiEvent));
        break;

    }
    return false;
  }

  initSong() {
    this.track = sequencer.createTrack();
    this.part = sequencer.createPart();
    this.part.addEvents(this.props.allMIDIEvents);
    this.track.addPart(this.part);
    this.song = sequencer.createSong({
      tracks: [this.track],
      timeEvents: this.props.timeEvents,
      useMetronome: false,
    });
  }

  updateSong() {
    ({
      ppq: this.song.ppq,
      bpm: this.song.bpm,
      nominator: this.song.nominator,
      denominator: this.song.denominator,
    } = this.props);
    // this.song.removeTimeEvents();
    // this.song.addTimeEvents(this.props.timeEvents);
    // API doesn't work so here's a hack:
    this.song.timeEvents = this.props.timeEvents; 
    this.song.setTempo(this.props.tempo);
  }

  updateTrack() {
    this.part.removeEvents(this.part.events, this.part);
    this.part.addEvents(this.props.allMIDIEvents);
    this.part.needsUpdate = true;
    this.track.needsUpdate = true;
  }

  muteAllEvents() {
    this.part.events.forEach((e) => {
      e.muted = true;
    });
  }

  unmuteEvents() {
    this.props.activeMIDIEventIds.forEach((id) => {
      const noteOn = this.part.eventsById[id];
      if (noteOn) {
        const noteOff = noteOn.midiNote.noteOff;
        noteOn.muted = false;
        noteOff.muted = false;
      }
    })
  }

  selectInstrument() {
    this.song.tracks.forEach((track: any) => {
      track.setInstrument(this.props.instrumentName);
    });
  }

  setLocators() {
    this.song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    // song.setRightLocator('barsbeats', song.bars + 1, 1, 1, 0);
    const lastBar = this.part.events[this.part.events.length - 1].bar;
    this.song.setRightLocator('barsbeats', lastBar, 1, 1, 0);
    // this.song.setRightLocator('barsbeats', 2, 1, 1, 0);
    this.song.setLoop(this.props.loop);
  }

  updatePosition() {
    if (this.song !== null) {
      const {
        ticks,
        barsAsString,
      } = this.song;

      const timestamp = performance.now();

      if (this.props.playing && (timestamp - this.props.timestamp) >= this.props.updateInterval) {
        // console.log(timestamp, ticks, barsAsString);
        this.props.updatePosition({
          ticks,
          timestamp,
          barsAsString,
          activeColumn: Math.floor(ticks / this.props.granularityTicks),
        });
      }
    }
    requestAnimationFrame(this.updatePosition.bind(this));
  }
}

export default Song;