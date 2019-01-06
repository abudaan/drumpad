import { MIDIEvent, HeartbeatSong, GridItem, GridType, MIDINote, Track } from "../interfaces";
import { uniq, clone } from "ramda";

const filterEvents = (events: Array<MIDIEvent>) => events.filter((e: MIDIEvent) => typeof e.noteName !== 'undefined');

const getUniqNotes = (events: Array<MIDIEvent>): Array<number> => uniq(events.map(e => e.noteNumber)).sort((a, b) => b - a);

const updateGranularity = (events: Array<MIDIEvent>, ppq: number, currentGranularity: number) => {
  let ticks = 0;
  let newGranularity = Number.MAX_VALUE;
  events.forEach(event => {
    if (event.type === 144 && event.data2 !== 0) {
      var diff = event.ticks - ticks;
      ticks = event.ticks;
      // console.log(ticks, event.ticks);
      if (diff !== 0 && diff < newGranularity) {
        newGranularity = diff;
      }
    }
  });
  return Math.max((ppq / newGranularity), currentGranularity);
}

const getEvent = (events: Array<MIDIEvent>, ticks: number, noteNumber: number): null | MIDIEvent => {
  const match = events.filter(event => event.ticks === ticks && event.noteNumber === noteNumber);
  return match[0] || null;
}

const createGrid = (song: HeartbeatSong, trackIndex: number, currentGranularity: number): { grid: GridType, granularity: number } => {
  const events = filterEvents(song.tracks[trackIndex].events);
  const granularity = updateGranularity(events, song.ppq, currentGranularity);
  const numBars = events[events.length - 1].bar;
  const notes = getUniqNotes(events);
  const totalTicks = numBars * (song.nominator * (4 / song.denominator) * song.ppq);
  const granularityTicks = (4 / granularity) * song.ppq;

  const grid: Array<Array<GridItem>> = [];
  for (let i = 0; i < totalTicks; i += granularityTicks) {
    const column = [];
    for (let j = 0; j < notes.length; j++) {
      const noteNumber = notes[j];
      const item: GridItem = {
        ticks: i,
        noteNumber,
        midiEvent: getEvent(events, i, noteNumber),
        active: false,
      }
      column.push(item);
    }
    grid.push(column);
  }
  // console.log(grid);
  return {
    grid,
    granularity,
  }
};

const filterTrackNotes = (trackId: string, activeNotes: Array<MIDINote>): Array<MIDINote> => {
  const activeNotesArray = Object.values(activeNotes).filter((note: MIDINote) => {
    if (note.trackId === trackId) {
      return note;
    }
  });
  return activeNotesArray;
};

const checkActive = (event: MIDIEvent, notes: Array<MIDINote>) => {
  for(let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.ticks === event.ticks && note.number === event.noteNumber) {
      return true;
    }
  }
  return false;
}

const updateGrid = (oldGrid: GridType, trackId: string, activeNotes: Array<MIDINote>) => {
  // const copy = JSON.parse(JSON.stringify(oldGrid));
  // const copy = clone(oldGrid);
  const copy = [...oldGrid];
  const events = filterTrackNotes(trackId, activeNotes);
  copy.forEach(column => {
    column.forEach(cell => {
      if (cell.midiEvent !== null) {
        checkActive(cell.midiEvent, events);
      }
    })
  });
  return copy;
};

export {
  createGrid,
  updateGrid,
};
