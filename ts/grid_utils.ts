import { MIDIEvent, HeartbeatSong, GridItem } from "./interfaces";
import { uniq } from "ramda";

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

const createGrid = (song: null | HeartbeatSong, trackIndex: number, granularity: number) => {
  if (song === null) {
    return null;
  }

  const events = filterEvents(song.tracks[trackIndex].events);
  const granularityTrack = getGranularity(events, song.ppq);
  const newGranularity = Math.max(granularity, granularityTrack);
  
  const numBars = events[events.length - 1].bar;
  const notes = getUniqNotes(events);
  const totalTicks = numBars * (song.nominator * (4 / song.denominator) * song.ppq);
  const granularityTicks = (4 / newGranularity) * song.ppq;
  
  const grid: Array<Array<GridItem>> = [];
  for (let i = 0; i < totalTicks; i += granularityTicks) {
    const column = [];
      for (let j = 0; j < notes.length; j++) {
      const noteNumber = notes[j];
      const item: GridItem = {
        ticks: i,
        noteNumber,
        midiEvent: getEvent(events, i, noteNumber),
      }
      column.push(item);
    }
    grid.push(column);
  }
  // console.log(totalTicks, granularityTicks, grid);
  return {
    grid,
    granularity: newGranularity,
  }
}

export {
  createGrid,
}
