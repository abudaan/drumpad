// utils used by ./reducers/song_reducer.ts

import sequencer from 'heartbeat-sequencer';
import { MIDIEvent, MIDIFileData, HeartbeatSong } from "../interfaces";
import { uniq, reduce, Reduced, isNil } from "ramda";


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


const getNextNoteNumber = (instrumentNoteNumber: Array<number>, noteNumbers: Array<number>): number => {
  let i = 0;
  for (i = 0; i < 127; i++) {
    if (instrumentNoteNumber.includes(i) === true && !noteNumbers.includes(i)) {
      break;
    }
  }
  return i;
}


type AddRow = {
  midiEvents: Array<MIDIEvent>
  noteNumbers: Array<number>
}
const addRow = (numCols: number, noteNumbers: Array<number>, instrumentNoteNumbers: Array<number>, granularityTicks: number): AddRow => {
  const noteNumber = getNextNoteNumber(instrumentNoteNumbers, noteNumbers);
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


const getSelectedPads = (midiEvents: Array<MIDIEvent>, granularityTicks: number, noteNumbers: Array<number>) => {
  type PadType = {
    [id: string]: boolean
  };
  type AccType = PadType | Reduced<PadType>
  const reducer = (accumulator: PadType, pad: [number, number]): AccType => {
    accumulator[`${pad[0]}-${pad[1]}`] = true;
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


const padIndexToMIDIIndex = (key: string, granularityTicks: number, noteNumbers: Array<number>): string => {
  const converted = key.split('-').map((a): number => parseInt(a, 10));
  const ticks = converted[1] * granularityTicks;
  const noteNumber = noteNumbers[converted[0]];
  // console.log(ticks, noteNumber);
  return `${ticks}-${noteNumber}`
}


const padIndexToMIDIEvent = (key: string, type: number, noteNumbers: Array<number>): MIDIEvent => {
  const converted = key.split('-').map((a): number => parseInt(a, 10));
  const noteNumber = noteNumbers[converted[0]];
  return sequencer.createMidiEvent(0, type, noteNumber, type === 144 ? 100 : 0);
}


const noteNumberToMIDIEvent = (noteNumber: number, type: number): MIDIEvent => sequencer.createMidiEvent(0, type, noteNumber, type === 144 ? 100 : 0);


type UpdateNoteNumber = { allMIDIEvents: Array<MIDIEvent>, unmuted: Array<string>, noteNumbers: Array<number> };
const updateNoteNumber = (oldNoteNumber: number, newNoteNumber: number, midiEvents: Array<MIDIEvent>, unmuted: Array<string>, noteNumbers: Array<number>): UpdateNoteNumber => {
  const newMIDIEvents = midiEvents.map((e: MIDIEvent) => {
    if (e.noteNumber === oldNoteNumber) {
      const clone = sequencer.createMidiEvent(e.ticks, e.type, newNoteNumber, e.data2);
      clone.muted = true;
      return clone;
    } else {
      return e;
    }
  });
  const newNoteNumbers = noteNumbers.map(n => n === oldNoteNumber ? newNoteNumber : n).sort((a, b) => b - a);
  const newUnmuted = unmuted.map(id => {
    const [
      ticks,
      noteNumber,
    ] = id.split('-');
    if (parseInt(noteNumber, 10) === oldNoteNumber) {
      return `${ticks}-${newNoteNumber}`;
    }
    return id;
  });
  return {
    allMIDIEvents: newMIDIEvents,
    noteNumbers: newNoteNumbers,
    unmuted: newUnmuted,
  };
}


const stopAllSongs = () => {
  const songs = sequencer.getSongs();
  Object.values(songs).forEach((s) => {
    const song = s as HeartbeatSong;
    song.stop();
    // song.removeEventListener('end');
    // sequencer.deleteSong(song);
  });
};


const addEndListener = (songList: Array<HeartbeatSong>, action: () => void) => {
  const songs = sequencer.getSongs();
  songs.forEach((song: HeartbeatSong) => {
    if (isNil(song.listeners['end'])) {
      song.addEventListener('end', () => {
        action();
      })
    }
  });
}


export {
  padIndexToMIDIIndex,
  padIndexToMIDIEvent,
  noteNumberToMIDIEvent,
  getSelectedPads,
  createGrid,
  addRow,
  updateNoteNumber,
  stopAllSongs,
  addEndListener,
};



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