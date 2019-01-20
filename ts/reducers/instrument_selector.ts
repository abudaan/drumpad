import { createSelector } from 'reselect';
import { State, ControlsState, SongState, Instrument } from '../interfaces';
import { isNil } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getControlsState = (state: State): ControlsState => state.controls;

export default createSelector(
  [getSongState, getControlsState],
  (songState: SongState, controlsState: ControlsState) => {
    const {
      instrumentList,
    } = songState;

    const {
      instrumentIndex
    } = controlsState;

    let instrumentName: string = '';
    if (!isNil(instrumentList) && !isNil(instrumentList[instrumentIndex])) {
      instrumentName = instrumentList[instrumentIndex][1];
    }

    return {
      instrumentName,
    };
  }
);

