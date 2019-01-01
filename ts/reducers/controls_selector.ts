import {createSelector} from 'reselect';
import {AppState, DataState, SongState} from '../interfaces';

const getSongState = (state:AppState): SongState => state.song;
const getSamplesState = (state:AppState): SamplesState => state.samples;

export default createSelector(
  [getSongState, getSamplesState],
  (songState: SongState, samplesState: SamplesState) => {
    const {
      tempo
    } = songState;

    const {
      numSamples,
    } = samplesState;


    return {
      tempo,
      numSamples,
    };
  }
);
