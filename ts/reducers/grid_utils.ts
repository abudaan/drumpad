import sequencer from 'heartbeat-sequencer';
import { MIDIEvent, MIDIFileData } from "../interfaces";
import { uniq, reduce, Reduced } from "ramda";

const getUniqNotes = (events: Array<MIDIEvent>): Array<number> => uniq(events.map(e => e.noteNumber)).sort((a, b) => b - a);

const updateGranularity = (events: Array<MIDIEvent>, ppq: number, currentGranularity: number) => {
  let ticks = 0;
  let newGranularity = Number.MAX_VALUE;
  events.sort((a, b) => a.ticks - b.ticks).forEach(event => {
    var diff = event.ticks - ticks;
    ticks = event.ticks;
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

type CreateGrid = {
  numRows: number,
  numCols: number,
  noteNumbers: Array<number>,
  granularity: number,
  updateInterval: number,
  granularityTicks: number,
  allMIDIEvents: Array<MIDIEvent>
};
const createGrid = (song: MIDIFileData, events: Array<MIDIEvent>, currentGranularity: number): CreateGrid => {
  const granularity = updateGranularity(events, song.ppq, currentGranularity);
  const numBars = 1; // events[events.length - 1].ticks -> do something here!
  const noteNumbers = getUniqNotes(events);
  const totalTicks = numBars * (song.nominator * (4 / song.denominator) * song.ppq);
  const granularityTicks = (4 / granularity) * song.ppq;
  const updateInterval = Math.round((granularityTicks / 2) * (60000 / song.bpm / song.ppq));
  const allMIDIEvents: Array<MIDIEvent> = [];
  const numRows = noteNumbers.length;
  const numCols = totalTicks / granularityTicks;

  for (let ticks = 0; ticks < totalTicks; ticks += granularityTicks) {
    for (let n = 0; n < noteNumbers.length; n++) {
      const noteNumber = noteNumbers[n];
      const noteOn = sequencer.createMidiEvent(ticks, 144, noteNumber, 100);
      const noteOff = sequencer.createMidiEvent(ticks + granularityTicks, 128, noteNumber, 0);
      noteOn.muted = true;
      noteOff.muted = true;
      // const noteOn = [ticks, 144, noteNumber, 100];
      // const noteOff = [ticks + granularityTicks, 128, noteNumber, 0];
      allMIDIEvents.push(noteOn, noteOff);
    }
  }

  return {
    numRows,
    numCols,
    noteNumbers,
    granularity,
    granularityTicks,
    updateInterval,
    allMIDIEvents,
  }
};

const getUniqueNoteNumber = (noteNumbers: Array<number>): number => {
  let noteNumber = noteNumbers[noteNumbers.length - 1] - 1;
  // console.log(noteNumbers);
  if (noteNumber === 127) {
    noteNumber = noteNumbers[0] - 1;
  } else if (noteNumber < 0) {
    for (let i = 0; i < 127; i++) {
      if (noteNumbers.includes(i) === false) {
        noteNumber = i;
        break;
      }
    }
  }
  return noteNumber;
}

type AddRow = {
  midiEvents: Array<MIDIEvent>
  noteNumbers: Array<number>
}
const addRow = (numCols: number, noteNumbers: Array<number>, granularityTicks: number): AddRow => {
  const noteNumber = 20 // getUniqueNoteNumber(noteNumbers);  
  const midiEvents = [];
  for (let i = 0; i < numCols; i++) {
    let ticks = i * granularityTicks;
    const noteOn = sequencer.createMidiEvent(ticks, 144, noteNumber, 100);
    const noteOff = sequencer.createMidiEvent(ticks + granularityTicks, 128, noteNumber, 0);
    noteOn.muted = true;
    noteOff.muted = true;
    midiEvents.push(noteOn, noteOff);
  }

  const newNoteNumbers = [
    ...noteNumbers,
    noteNumber
  ];

  return {
    midiEvents,
    noteNumbers: newNoteNumbers.sort((a, b) => b - a),
  }
};

const getSelectedCells = (midiEvents: Array<MIDIEvent>, granularityTicks: number, noteNumbers: Array<number>) => {

  type CellType = {
    [id: string]: boolean
  };
  type AccType = CellType | Reduced<CellType>
  const reducer = (accumulator: CellType, cell: [number, number]): AccType => {
    accumulator[`${cell[0]}-${cell[1]}`] = true;
    return accumulator;
  }

  const selected: Array<[number, number]> = midiEvents.map(e => {
    const { ticks, noteNumber } = e;
    const row = noteNumbers.indexOf(noteNumber)
    const col = ticks / granularityTicks;
    return <[number, number]>[row, col];
  });
  return reduce(reducer, {}, selected);
}

/*
const sortRows = (numCols: number, granularityTicks: number, cells: Array<GridCellData>): Array<GridCellData> => {
  const sorted = [];
  for (let i = 0; i < numCols; i++) {
    const ticks = i * granularityTicks;
    const column = cells.filter(c => c.ticks === ticks).sort((a, b) => b.noteNumber - a.noteNumber);
    sorted.push(...column);
  }
  return sorted;
};
*/

const cellIndexToMIDIIndex = (key: string, granularityTicks: number, noteNumbers: Array<number>): string => {
  const converted = key.split('-').map((a):number => parseInt(a, 10));
  const ticks = converted[1] * granularityTicks;
  const noteNumber = noteNumbers[converted[0]];
  // console.log(ticks, noteNumber);
  return `${ticks}-${noteNumber}`
}


export {
  cellIndexToMIDIIndex,
  getSelectedCells,
  createGrid,
  addRow,
};

