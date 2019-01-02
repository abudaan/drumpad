# drumpad app

Song reducer
- change number of beats (columns) -> slider
- change number of sounds (rows) -> slider
- change tempo -> slider
- set granularity: one row is one quarter note (default), or a 8th or a 16th note -> dropdown
- set loop on/off -> button
- start/stop -> button
- update instrument (if new samples have been loaded)

Sample reducer
- add loaded samples to instrument -> button

Load samples:
- click on instrument icon in the left-most column and select a sample



## loading

initial load:
- sequencer ready
- load config -> fetch json
- load midifile -> fetch binary
- load instrument -> fetch json
- add midifile to song -> sequencer.addMidiFile(ArrayBuffer)
- add instrument to song -> sequencer.addInstrument(json)
- song ready


add sample:
- load sample -> fetch binary
- add sample to instrument -> sequencer.addSamplePack(base64) = append action to existing instrument


load new instrument:
- load instrument -> fetch json
- add instrument to song -> sequencer.addInstrument(json)


load new midifile
- load midifile -> fetch binary
- add midifile to song -> sequencer.addMidiFile(ArrayBuffer)


save midifile:
- export as midi (binary)


## TODO:

Add midi file sanity check to sequencer.createMidiFile();

