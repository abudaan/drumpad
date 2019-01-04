
// NOT IN USE, KEEP FOR REFERENCE!

import { createSelector } from 'reselect';
import { AppState, SongState, State } from '../interfaces';

const getAppState = (state: State): AppState => state.app;
const getSongState = (state: State): SongState => state.song;

export default createSelector(
  // [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  // (songState: SongState, props: SongPropTypes, dataState: AppState) => {
  [getAppState, getSongState],
  (appState: AppState, songState: SongState) => {
    const {
      assetPack,
      midiFile,
    } = appState;

    let {
      song,
    } = songState;

    return {
      song,
    };
  }
);
