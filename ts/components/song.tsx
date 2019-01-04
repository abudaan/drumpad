import React from 'react';
import { HeartbeatSong } from '../interfaces';

interface Song {
  props: SongPropTypes,
};

export type SongPropTypes = {
  loop: boolean,
  tempo: number,
  playing: boolean,
  stopped: boolean,
  trackIndex: number,
  instrumentName: string,
  song: null | HeartbeatSong,
};

class Song extends React.PureComponent {
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log('<Song> render');
    if (this.props.song === null) {
      return false;
    } else {
      this.props.song.tracks.forEach((track, index) => {
        track.mute = index !== this.props.trackIndex;
        track.setInstrument(this.props.instrumentName);
      });

      this.props.song.setTempo(this.props.tempo);
      
      this.props.song.setLoop(this.props.loop);

      if (this.props.playing === true && this.props.song.playing === false) {
        this.props.song.play()
      } else if(this.props.playing === false && this.props.song.playing === true) {
        this.props.song.pause()
      }
      return false;
    }
  }
}

export default Song;