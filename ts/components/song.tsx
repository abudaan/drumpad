import React from 'react';
import { HeartbeatSong, SongState, MIDIEvent } from '../interfaces';

// render actions
export const PASS = 'PASS';
export const SONG = 'SONG';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const TEMPO = 'TEMPO';
export const SET_LOOP = 'SET_LOOP';
export const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';

interface Song {
  props: SongPropTypes,
};

export type SongPropTypes = {
  song: null | HeartbeatSong,
  loop: boolean,
  tempo: number,
  playing: boolean,
  stopped: boolean,
  trackIndex: number,
  instrumentName: string,
  renderAction: string,
  midiEvents: Array<MIDIEvent>
};

class Song extends React.PureComponent {

  render() {
    console.log('<Song> render', this.props.renderAction);
    if (this.props.song === null || this.props.renderAction === PASS) {
      return false;
    }
    switch (this.props.renderAction) {
      case SONG:
        this.setupSong(this.props.song);
        break;

      case PLAY:
        this.props.song.play();
        break;

      case PAUSE:
        this.props.song.pause();
        break;

      case STOP:
        this.props.song.stop();
        break;

      case TEMPO:
        this.props.song.setTempo(this.props.tempo);
        break;

      case UPDATE_EVENTS:
        this.updateEvents(this.props.song);
        break;

      case SET_LOOP:
        this.props.song.setLoop(this.props.loop);
        break;

      case SELECT_INSTRUMENT:
        this.selectInstrument(this.props.song);
        break;

    }
    return false;
  }

  setupSong(song: HeartbeatSong) {
    this.updateEvents(song);
    this.setLocators(song);
  }
  
  selectInstrument(song: HeartbeatSong) {
    song.tracks.forEach((track: any) => {
      track.setInstrument(this.props.instrumentName);
    });
  }
  
  updateEvents(song: HeartbeatSong) {
    song.tracks[0].removeAllEvents();
    song.addEvents(this.props.midiEvents);
    song.update();
    this.selectInstrument(song);
  }

  setLocators(song: HeartbeatSong) {
    song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    // song.setRightLocator('barsbeats', song.bars + 1, 1, 1, 0);
    const lastBar = song.events[song.events.length - 1].bar;
    song.setRightLocator('barsbeats', lastBar + 1, 1, 1, 0);
    song.setLoop(this.props.loop);
  }
}

export default Song;