

// NOT IN USE, KEPT FOR REFERENCE


import { createSelector } from 'reselect';
import { SongState, State, ControlsState, Track, MIDINote } from '../../interfaces';
import { isNil } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getControlsState = (state: State): ControlsState => state.controls;

export default createSelector(
  [getSongState, getControlsState],
  (songState: SongState, controlsState: ControlsState) => {
    const {
      song,
      activeNotes,
    } = songState;

    const {
      playing,
      trackIndex,
    } = controlsState;

    if (song === null) {
      return {};
    }
    const events = song.tracks[trackIndex].events;
    const grid = [];
    return {
      grid,
    };
  }
);


const checkActive = (ticks: number, noteNumber: number, activeNotes: Array<MIDINote>, playing: boolean): string => {
  if (playing === false) {
    return 'cell';
  }
  const notes = activeNotes;
  for(let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.ticks === ticks && note.number === noteNumber) {
      return 'cell active';
    }
  }
  return 'cell';
}
