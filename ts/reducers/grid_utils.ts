import sequencer from 'heartbeat-sequencer';
import { MIDIEvent, MIDIFileData, GridCellData, GridType } from "../interfaces";
import { uniq, reduce, Reduced } from "ramda";

const getUniqNotes = (events: Array<MIDIEvent>): Array<number> => uniq(events.map(e => e.noteNumber)).sort((a, b) => b - a);

const updateGranularity = (events: Array<MIDIEvent>, ppq: number, currentGranularity: number) => {
  let ticks = 0;
  let newGranularity = Number.MAX_VALUE;
  events.sort((a, b) => a.ticks - b.ticks).forEach(event => {
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

type CreateGrid = { 
  grid: GridType, 
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

  const grid: GridType = {
    numRows: noteNumbers.length,
    numCols: totalTicks / granularityTicks,
    cells: [],
  };

  for (let ticks = 0; ticks < totalTicks; ticks += granularityTicks) {
    for (let n = 0; n < noteNumbers.length; n++) {
      const noteNumber = noteNumbers[n];  
      const event = getEvent(events, ticks, noteNumber)
      const item: GridCellData = {
        ticks,
        noteNumber,
        midiEventId: event === null ? null : event.id,
        selected: event !== null,
        active: false,
      }
      const noteOn = sequencer.createMidiEvent(ticks, 144, noteNumber, 100);
      const noteOff = sequencer.createMidiEvent(ticks + granularityTicks, 128, noteNumber, 0);
      noteOn.muted = true;
      noteOff.muted = true;
      // const noteOn = [ticks, 144, noteNumber, 100];
      // const noteOff = [ticks + granularityTicks, 128, noteNumber, 0];
      allMIDIEvents.push(noteOn, noteOff);
      grid.cells.push(item);
    }
  }

  return {
    grid,
    noteNumbers,
    granularity,
    granularityTicks,
    updateInterval,
    allMIDIEvents,
  }
};

type AddRow = { 
  cells: Array<GridCellData>, 
  midiEvents: Array<MIDIEvent> 
  noteNumbers: Array<number>
}
const addRow = (grid: GridType, noteNumbers: Array<number>, granularityTicks: number): AddRow => {
  
  let noteNumber = noteNumbers[noteNumbers.length - 1] - 1;
  // console.log(noteNumbers);
  if (noteNumber === 127) {
    noteNumber = noteNumbers[0] - 1;
  } else if (noteNumber < 0) {
    for(let i = 0; i < 127; i++) {
      if(noteNumbers.includes(i) === false) {
        noteNumber = i;
        break;
      }
    }
  }
  const cells = [...grid.cells];
  const midiEvents = [];
  for (let i = 0; i < grid.numCols; i++) {
    let ticks = i * granularityTicks;
    const item: GridCellData = {
      ticks,
      noteNumber,
      midiEventId: null,
      selected: false,
      active: false,
    }
    const noteOn = sequencer.createMidiEvent(ticks, 144, noteNumber, 100);
    const noteOff = sequencer.createMidiEvent(ticks + granularityTicks, 128, noteNumber, 0);
    noteOn.muted = true;
    noteOff.muted = true;
    midiEvents.push(noteOn, noteOff);
    cells.push(item);
  }

  const newNoteNumbers = [
    ...noteNumbers,
    noteNumber
  ];

  
  return {
    cells: sortRows(grid.numCols, granularityTicks, cells),
    midiEvents,
    noteNumbers: newNoteNumbers.sort((a, b) => b - a),
  }
};

const sortRows = (numCols: number, granularityTicks: number, cells: Array<GridCellData>): Array<GridCellData> => {
  const sorted = [];
  for (let i = 0; i < numCols; i++) {
    const ticks = i * granularityTicks;
    const column = cells.filter(c => c.ticks === ticks).sort((a, b) => b.noteNumber - a.noteNumber);
    sorted.push(...column);
  }
  return sorted;
};


export {
  createGrid,
  addRow,
};


/*    
    type CellType = {
      [id: string]: GridCellData
    };
    type AccType = CellType | Reduced<CellType>
    const reducer = (accumulator: CellType, cell: GridCellData): AccType => {
      accumulator[`${cell.ticks}-${cell.noteNumber}`] = cell;
      return accumulator;
    }
    grid.cells = reduce(reducer, {}, cells);    
*/