import { createSelector } from 'reselect';
import { State, SongState, ControlsState, MIDINote, MIDIEvent } from '../../interfaces';

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
      trackIndex
    } = controlsState;

    let activeNotesArray:Array<MIDINote> = [];
    
    if (song !== null && song.tracks.length > 0) {
      const trackId = song.tracks[trackIndex].id;
      activeNotesArray = Object.values(activeNotes).filter((note: MIDINote) => {
        if (note.trackId === trackId) {
          return note;
        }
      });
    }
    return {
      activeNotes: activeNotesArray,
    };
  }
);
