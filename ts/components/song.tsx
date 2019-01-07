import React from 'react';
import { HeartbeatSong, SongState, MIDIEvent } from '../interfaces';

const PASS = 'PASS';
const SONG = 'SONG';
const PLAY = 'PLAY';
const PAUSE = 'PAUSE';
const STOP = 'STOP';
const TEMPO = 'TEMPO';
const SET_LOOP = 'SET_LOOP';
const SET_INSTRUMENT = 'SET_INSTRUMENT';
const SOLO_TRACK = 'SOLO_TRACK';

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
};

class Song extends React.Component {
  songAction: string;

  constructor(props: any) {
    super(props);
    this.songAction = PASS;
  }

  shouldComponentUpdate(nextProps: SongPropTypes, nextState: SongState) {
    this.songAction = PASS;

    if (nextProps.song !== null && 
       (this.props.song === null || (this.props.song !== null && nextProps.song.id !== this.props.song.id))
    ) {
      this.songAction = SONG;

    } else if (nextProps.playing === true && this.props.playing === false) {
      this.songAction = PLAY;

    } else if (nextProps.stopped === true && this.props.stopped === false) {
      this.songAction = STOP;

    } else if (nextProps.playing === false && this.props.playing === true) {
      this.songAction = PAUSE;

    } else if (nextProps.tempo !== this.props.tempo) {
      this.songAction = TEMPO;

    } else if (nextProps.trackIndex !== this.props.trackIndex) {
      this.songAction = SOLO_TRACK;

    } else if (nextProps.instrumentName !== this.props.instrumentName) {
      this.songAction = SET_INSTRUMENT;

    } else if (nextProps.loop !== this.props.loop) {
      this.songAction = SET_LOOP;
    }
    return this.songAction !== PASS;
  }

  render() {
    console.log('<Song> render', this.songAction);
    if (this.props.song === null || this.songAction === PASS) {
      return false;
    }
    switch (this.songAction) {
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
    song.tracks.forEach((track: any, index: number) => {
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
    const lastBar =  events[events.length - 1].bar;
    // this.song.update();
    song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    song.setRightLocator('barsbeats', lastBar + 1, 1, 1, 0);
    song.setLoop(this.props.loop);
  }
}

export default Song;