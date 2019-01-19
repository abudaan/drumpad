

// NOT IN USE, KEPT FOR REFERENCE


import { createSelector } from 'reselect';
import { State, ControlsState, SongState, Track, MIDIEvent, HeartbeatSong, GridCell } from '../../interfaces';
import { uniq, isNil } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getControlsState = (state: State): ControlsState => state.controls;

export default createSelector(
  [getSongState, getControlsState],
  (songState: SongState, controlsState: ControlsState) => {
    const {
      song,
    } = songState;

    const {
      trackIndex,
      granularity,
    } = controlsState;

    let grid = null;
    let granularityTrack: number = Number.MAX_VALUE;
    let newGranularity = granularity;

    if (!isNil(song) && song.tracks.length > 0) {
      const track = song.tracks[trackIndex];
      const events = filterEvents(track.events);
      granularityTrack = getGranularity(events, song.ppq);
      newGranularity = Math.max(granularity, granularityTrack);
      // console.log(granularity, granularityTrack, newGranularity);
      grid = getGrid(events, newGranularity, song);
    }

    return {
      grid,
    };
  }
);

const filterEvents = (events: Array<MIDIEvent>) => events.filter((e: MIDIEvent) => typeof e.noteName !== 'undefined');

const getUniqNotes = (events: Array<MIDIEvent>): Array<number> => uniq(events.map(e => e.noteNumber)).sort((a, b) => b - a);

const getGranularity = (events: Array<MIDIEvent>, ppq: number) => {
  let ticks = 0;
  let granularity = Number.MAX_VALUE;
  events.forEach(event => {
    if (event.type === 144 && event.data2 !== 0) {
      var diff = event.ticks - ticks;
      ticks = event.ticks;
      // console.log(ticks, event.ticks);
      if (diff !== 0 && diff < granularity) {
        granularity = diff;
      }
    }
  });
  return ppq / granularity;
}

const getEvent = (events: Array<MIDIEvent>, ticks: number, noteNumber: number): null | MIDIEvent => {
  const match = events.filter(event => event.ticks === ticks && event.noteNumber === noteNumber);
  return match[0] || null;
}

const getGrid = (events: Array<MIDIEvent>, granularity: number, song: HeartbeatSong) => {
  const numBars = events[events.length - 1].bar;
  const notes = getUniqNotes(events);
  const totalTicks = numBars * (song.nominator * (4 / song.denominator) * song.ppq);
  const granularityTicks = (4 / granularity) * song.ppq;
  const grid = [];
  for (let i = 0; i < totalTicks; i += granularityTicks) {
    const column = [];
      for (let j = 0; j < notes.length; j++) {
      const noteNumber = notes[j];
      const item: GridCell = {
        ticks: i,
        noteNumber,
        midiEvent: getEvent(events, i, noteNumber),
      }
      column.push(item);
    }
    grid.push(column);
  }
  // console.log(totalTicks, granularityTicks, grid);
  return grid;
}

/*
const getBeats = (
  bars: number,
  ppq: number,
  nominator: number,
  denominator: number,
  granularity: number,
) => {
  const ticksPerBar = nominator * ((4 / denominator) * ppq);
  const numBeats = (ticksPerBar / granularity) * (bars - 1);
  const beats = [];
  let ticks = 0;
  for (let i = 0; i < numBeats; i++) {
    beats.push(ticks + (i * granularity))
  }
  return beats;
}
*/