import { createSelector } from 'reselect';
import { State, AppState, SongState } from '../interfaces';
import { uniq } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getAppState = (state: State): AppState => state;

const getGranularity = (tracks: Array<any>, trackIndex: number) => {
  let ticks = 0;
  let quantize = Number.MAX_VALUE;
  const events = tracks[trackIndex].events;
  events.forEach(event => {
    if (event.type === 144 && event.data2 !== 0) {
      var diff = event.ticks - ticks;
      ticks = event.ticks;
      // console.log(ticks, event.ticks);
      if (diff !== 0 && diff < quantize) {
        quantize = diff;
      }
    }
  });
  return quantize;
}

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

const getUniqNotes = (tracks: Array<any>, trackIndex: number) => {
  const events = tracks[trackIndex].events
    .filter(e => typeof e.noteName !== 'undefined')
    .map(e => e.noteNumber);
  // console.log(uniq(events).sort());
  return uniq(events).sort((a, b) => a - b);
}


export default createSelector(
  [getSongState, getAppState],
  (songState: SongState, appState: AppState) => {
    const {
    } = songState;

    const {
      tempo,
      loop,
      playing,
      stopped,
      bar,
      beat,
      barsAsString,
      trackIndex,
      assetPack,
      midiFile,
      instrumentName,
      instrumentIndex,
      controlsEnabled,
      tempoTmp,
      tempoMin,
      tempoMax,
      song,
    } = appState;

    let {
      granularity,
      beats,
      notes,
      activeNotes,
    } = appState;

    let trackList = [];
    let activeNotesArray = [];
    if (song !== null && song.tracks.length > 0) {
      granularity = getGranularity(song.tracks, trackIndex);
      notes = getUniqNotes(song.tracks, trackIndex);
      beats = getBeats(song.bars, song.ppq, song.nominator, song.denominator, granularity);
      trackList = song.tracks.map((track: any) => track.name)
      const trackId = song.tracks[trackIndex].id;
      activeNotesArray = Object.values(activeNotes).filter(note => {
        if (note.trackId === trackId) {
          return note;
        }
      });
    }

    return {
      beat,
      tempo,
      tempoTmp,
      loop,
      playing,
      stopped,
      trackList,
      trackIndex,
      assetPack,
      midiFile,
      controlsEnabled,
      instrumentName,
      tempoMin,
      tempoMax,
      notes,
      beats,
      song,
      activeNotes: activeNotesArray,
      granularity,
    };
  }
);
