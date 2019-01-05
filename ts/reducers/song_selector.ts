

// NOT IN USE, KEPT FOR REFERENCE


import { createSelector } from 'reselect';
import { SongState, State, Instrument, Track } from '../interfaces';

const getSongState = (state: State): SongState => state.song;

export default createSelector(
  // [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  // (songState: SongState, props: SongPropTypes, dataState: DataState) => {
  [getSongState],
  (songState: SongState) => {
    let {
      song,
      assetPack,
    } = songState;

    let trackList: Array<string> = [];
    let instrumentList: Array<string> = [];
    if (song !== null) {
      trackList = song.tracks.map((t: Track) => t.name);
    }
    if (assetPack !== null) {
      instrumentList = assetPack.instruments.map((i: Instrument) => i.name);
    }

    return {
      song,
      trackList,
      instrumentList,
    };
  }
);
