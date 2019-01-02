import { createSelector } from 'reselect';
import { AppState, DataState, SongState } from '../interfaces';
import { SongPropTypes } from '../containers/song';

const getSongState = (state: AppState): SongState => state.song;
const getDataState = (state: AppState): DataState => state.data;

export default createSelector(
  [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  (songState: SongState, props: SongPropTypes, dataState: DataState) => {
    // console.log('selector', props);    
    const {
      tempo,
      loop,
      playing,
    } = songState;

    const {
      track,
      loading,
      assetPack,
      midiFile,
      instrumentIndex,
    } = dataState;
    
    return {
      tempo,
      loop,
      playing,
      track,
      loading,
      assetPack,
      midiFile,
      instrumentIndex,
    };
  }
);
