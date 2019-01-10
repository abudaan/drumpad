import { MIDIEvent, HeartbeatSong, GridCellData, GridType } from "../interfaces";
import { uniq } from "ramda";

const getUniqNotes = (events: Array<MIDIEvent>): Array<number> => uniq(events.map(e => e.noteNumber)).sort((a, b) => b - a);

const updateGranularity = (events: Array<MIDIEvent>, ppq: number, currentGranularity: number) => {
  let ticks = 0;
  let newGranularity = Number.MAX_VALUE;
  events.filter(e => e.type === 144).forEach(event => {
    var diff = event.ticks - ticks;
    ticks = event.ticks;
    // console.log(ticks, event.ticks);
    if (diff !== 0 && diff < newGranularity) {
      newGranularity = diff;
    }
  });
  return Math.max((ppq / newGranularity), currentGranularity);
}

const getEvent = (events: Array<MIDIEvent>, ticks: number, noteNumber: number): null | MIDIEvent => {
  const match = events.filter(event => event.type === 144 && event.velocity > 0 && event.ticks === ticks && event.noteNumber === noteNumber);
  return match[0] || null;
}

type cg = { grid: GridType, granularity: number, updateInterval: number, granularityTicks: number };
const createGrid = (song: HeartbeatSong, events: Array<MIDIEvent>, currentGranularity: number): cg => {
  const granularity = updateGranularity(events, song.ppq, currentGranularity);
  const numBars = events[events.length - 1].bar;
  const notes = getUniqNotes(events);
  const totalTicks = numBars * (song.nominator * (4 / song.denominator) * song.ppq);
  const granularityTicks = (4 / granularity) * song.ppq;
  const updateInterval = Math.round((granularityTicks / 2) * song.millisPerTick);

  const grid: GridType = {
    rows: notes.length,
    cols: totalTicks / granularityTicks,
    cells: [],
  };

  for (let i = 0; i < totalTicks; i += granularityTicks) {
    for (let j = 0; j < notes.length; j++) {
      const noteNumber = notes[j];
      const item: GridCellData = {
        ticks: i,
        noteNumber,
        midiEvent: getEvent(events, i, noteNumber),
        active: false,
      }
      grid.cells.push(item);
    }
  }
  // console.log(granularity, granularityTicks, updateInterval);
  return {
    grid,
    granularity,
    granularityTicks,
    updateInterval,
  }
};

export {
  createGrid,
};
