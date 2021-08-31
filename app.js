const midi = new Midi();

class Application {
  constructor () {
    this.initA4()
    this.tuner = new Tuner(this.a4);
    this.notes = new Notes('.notes', this.tuner);
    this.meter = new Meter('.meter');
    this.frequencyBars = new FrequencyBars('.frequency-bars');
    this.update({name: 'A', frequency: this.a4, octave: 4, value: 69, cents: 0});
    this.trackIdx = 0;
    this.noteIdx = 0;
  }

  initA4() {
    this.$a4 = document.querySelector('.a4 span');
    this.a4 = parseInt(localStorage.getItem('a4')) || 440;
    this.$a4.innerHTML = this.a4;
  }

  start() {
    this.tuner.onNoteDetected = (note) => {
      if (this.notes.isAutoMode) {
        if (this.lastNote === note.name) {
          this.update(note);
          const correct = this.tracks[this.trackIdx].notes[this.noteIdx].name;
          const current = note.name + note.octave;
          if (current === correct) {
            console.log(`${this.noteIdx}: ${current} - Nice!`);
            this.noteIdx++;
          } else {
            console.log(`${this.noteIdx}: Sorry, that's a ${current}, not a ${correct}`);
          }
        } else {
          this.lastNote = note.name
        }
      }
    }

    this.readMidi("london_bridge.mid").then(()=>{
      this.tuner.init()
      this.frequencyData = new Uint8Array(this.tuner.analyser.frequencyBinCount)
      this.updateFrequencyBars()
    });
  }

  async readMidi(path) {"tchaikovsky_seasons.mid"
    // load a midi file in the browser
    const midi = await Midi.fromUrl(path);
    //the file name decoded from the first track
    const name = midi.name
    //get the tracks

    this.tracks = midi.tracks;

    console.log("Tracks: "+this.tracks.map((t,i)=>`${i}: ${t.instrument.name}`));
  }

  updateFrequencyBars() {
    if (this.tuner.analyser) {
      this.tuner.analyser.getByteFrequencyData(this.frequencyData);
      this.frequencyBars.update(this.frequencyData);
    }
    requestAnimationFrame(this.updateFrequencyBars.bind(this));
  }

  update(note) {
    this.notes.update(note);
    this.meter.update((note.cents / 50) * 45);
  }

  toggleAutoMode() {
    this.notes.toggleAutoMode();
  }
}

const app = new Application()
app.start()
