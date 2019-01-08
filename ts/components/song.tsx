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
export const SET_INSTRUMENT = 'SET_INSTRUMENT';
export const SOLO_TRACK = 'SOLO_TRACK';

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

      case SOLO_TRACK:
        this.soloTrack(this.props.song);
        break;

      case SET_LOOP:
        this.props.song.setLoop(this.props.loop);
        break;

      case SET_INSTRUMENT:
        this.setInstrument(this.props.song);
        break;

    }
    return false;
  }

  setupSong(song: HeartbeatSong) {
    this.setLocators(song);
    this.setInstrument(song);
    this.soloTrack(song);
  }

  setInstrument(song: HeartbeatSong) {
    song.tracks.forEach((track: any) => {
      track.setInstrument(this.props.instrumentName);
    });
  }

  soloTrack(song: HeartbeatSong) {
    song.tracks.forEach((track: any, index: number) => {
      track.mute = index !== this.props.trackIndex;
    });
    this.setLocators(song);
  }

  setLocators(song: HeartbeatSong) {
    const events = song.tracks[this.props.trackIndex].events.filter((e: MIDIEvent) => e.type === 144);
    const lastBar = events[events.length - 1].bar;
    // this.song.update();
    song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    song.setRightLocator('barsbeats', lastBar + 1, 1, 1, 0);
    song.setLoop(this.props.loop);
  }
}

export default Song;