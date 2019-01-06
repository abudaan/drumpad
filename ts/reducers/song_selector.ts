// NOT IN USE, KEPT FOR REFERENCE


import { createSelector } from 'reselect';
import { SongState, State, ControlsState, Track } from '../interfaces';
import { isNil } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getControlsState = (state: State): ControlsState => state.controls;

export default createSelector(
  // [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  // (songState: SongState, props: SongPropTypes, dataState: DataState) => {
  [getSongState, getControlsState],
  (songState: SongState, controlsState: ControlsState) => {
    const {
      songList,
    } = songState;

    const {
      songIndex,
    } = controlsState;

    const song = songList[songIndex];
    let trackList: Array<string> = [];
    if (!isNil(song)) {
      trackList = song.tracks.map((t: Track) => t.name);
    }

    return {
      song: typeof song !== 'undefined' ? song : null,
      trackList,
    };
  }
);
