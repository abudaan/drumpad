import { createSelector } from 'reselect';
import { State, ControlsState, SongState, Track, MIDIEvent } from '../interfaces';
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
      instrumentName = instrumentList[instrumentIndex];
    }

    return {
      instrumentName,
    };
  }
);

