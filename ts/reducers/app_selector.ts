import { createSelector } from 'reselect';
import { State, AppState, SongState } from '../interfaces';
import { uniq } from 'ramda';

const getSongState = (state: State): SongState => state.song;
const getAppState = (state: State): AppState => state.app;

const getQuantizeValue = (tracks: Array<any>, trackIndex: number) => {
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

const getNumBeats = (tracks: Array<any>, trackIndex: number, ppq: number, nominator: number, denominator: number) => {
  const q = getQuantizeValue(tracks, trackIndex);
  const ticksPerBar = nominator * ((4 / denominator) * ppq);
  // console.log(ticksPerBar, ppq, nominator, denominator, q);
  const numBeats = ticksPerBar / q;
  return numBeats;
}

const getNumUniqNotes = (tracks: Array<any>, trackIndex: number) => {
  const events = tracks[trackIndex].events
    .filter(e => typeof e.noteName !== 'undefined')
    .map(e => e.noteNumber);
  return uniq(events).length;
}


export default createSelector(
  [getSongState, getAppState],
  (songState: SongState, appState: AppState) => {
    const {
      tempo,
      loop,
      playing,
      stopped,
    } = songState;
    
    const {
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
      rows,
      columns,
    } = appState;

    let trackList = [];
    if (song !== null && song.tracks.length > 0) {
      rows = getNumUniqNotes(song.tracks, trackIndex);
      columns = getNumBeats(song.tracks, trackIndex, song.ppq, song.nominator, song.denominator);
      trackList = song.tracks.map((track: any) => track.name)
    }

    return {
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
      rows,
      columns,
      song,
    };
  }
);
