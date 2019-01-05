import { createSelector } from 'reselect';
import { State, ControlsState, SongState, Track, MIDIEvent } from '../interfaces';
import { uniq } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getControlsState = (state: State): ControlsState => state.controls;

export default createSelector(
  [getSongState, getControlsState],
  (songState: SongState, controlsState: ControlsState) => {
    const {
      song,
    } = songState;

    const {
      granularity,
      trackIndex,
    } = controlsState;

    let noteNumbers: Array<number> = [];
    let granularityTrack: number = Number.MAX_VALUE;
    if (song !== null && song.tracks.length > 0) {
      const track = song.tracks[trackIndex];
      granularityTrack = getGranularity(track);
      noteNumbers = getUniqNotes(track);
    }

    return {
      noteNumbers,
      granularity: Math.min(granularity, granularityTrack),
    };
  }
);

const getGranularity = (track: Track) => {
  let ticks = 0;
  let granularity = Number.MAX_VALUE;
  const events = track.events;
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
  return granularity;
}

const getUniqNotes = (track: Track): Array<number> => {
  const events = track.events.filter((e:MIDIEvent) => typeof e.noteName !== 'undefined')
    .map(e => e.noteNumber);
  // console.log(uniq(events).sort());
  return uniq(events).sort((a, b) => a - b);
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