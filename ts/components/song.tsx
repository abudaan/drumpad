import React from 'react';
import sequencer from 'heartbeat-sequencer';
import { HeartbeatSong, MIDIEvent, SongPosition, Track, Part } from '../interfaces';

// render actions
export const PASS = 'PASS';
export const INIT = 'INIT';
export const SONG = 'SONG';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const TEMPO = 'TEMPO';
export const SET_LOOP = 'SET_LOOP';
export const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';

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
  timeEvents: Array<MIDIEvent>,
  midiEvents: Array<MIDIEvent>,
  updatePosition: (pos: SongPosition) => void,
};

class Song extends React.PureComponent {
  componentDidMount() {
    requestAnimationFrame(this.updatePosition.bind(this));
  }

  render() {
    console.log('<Song> render', this.props.renderAction, this.props);
    switch (this.props.renderAction) {
      case INIT:
        this.initSong();
        this.updateSong();
        this.updateEvents();
        console.log(this.song);
        break;

      case SONG:
        this.song.pause();
        this.updateSong();
        this.updateEvents();
        this.song.play();
        break;

      case UPDATE_EVENTS:
        this.song.pause();
        this.updateEvents();
        this.song.play();
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

    }
    return false;
  }

  initSong() {
    this.track = sequencer.createTrack();
    this.part = sequencer.createPart();
    this.track.addPart(this.part);
    this.song = sequencer.createSong({
      tracks: [this.track],
    });
  }

  updateSong() {
    ({
      ppq: this.song.ppq,
      bpm: this.song.bpm,
      nominator: this.song.nominator,
      denominator: this.song.denominator,
    } = this.props);
    this.song.removeTimeEvents();
    this.song.addTimeEvents(this.props.timeEvents);
  }

  updateEvents() {
    this.part.removeEvents(this.part.events);
    this.part.addEvents(this.props.midiEvents);
    this.song.update();
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
    this.song.setRightLocator('barsbeats', lastBar + 1, 1, 1, 0);
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
        console.log(timestamp, ticks, barsAsString);
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