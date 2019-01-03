import { createSelector } from 'reselect';
import { AppState, SongState } from '../interfaces';
import { SongPropTypes } from '../components/song';

const getSongState = (state: AppState): SongState => state.song;
const getDataState = (state: AppState): AppState => state.data;

export default createSelector(
  [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  (songState: SongState, props: SongPropTypes, dataState: AppState) => {
    // console.log('selector', props);    
    const {
      tempo,
      loop,
      playing,
      stopped,
    } = songState;

    const {
      track,
      assetPack,
      midiFile,
      instrumentIndex,
    } = dataState;
    
    return {
      tempo,
      loop,
      playing,
      stopped,
      track,
      assetPack,
      midiFile,
      instrumentIndex,
    };
  }
);
