import { createSelector } from 'reselect';
import { State, AppState, SongState } from '../interfaces';

const getSongState = (state: State): SongState => state.song;
const getAppState = (state: State): AppState => state.app;

export default createSelector(
  [getSongState, getAppState],
  (songState: SongState, appState: AppState) => {
    const {
      tempo,
      loop,
      playing,
      stopped,
    } = songState;

    const {
      trackIndex,
      assetPack,
      midiFile,
      instrumentIndex,
      controlsEnabled,
    } = appState;
    
    return {
      tempo,
      loop,
      playing,
      stopped,
      trackIndex,
      assetPack,
      midiFile,
      controlsEnabled,
      instrumentIndex,
    };
  }
);
