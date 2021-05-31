//no audio yet

let previous = document.querySelector('#pre');
let play = document.querySelector('#play');
let next = document.querySelector('#next');
let title = document.querySelector('#title');
let recent_volume = document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
let slider = document.querySelector('#duration_slider');
let show_duration = document.querySelector('#show_duration');
let present = document.querySelector('#present');
let total = document.querySelector('#total');
let artist = document.querySelector('#artist');



let timer;
let autoplay = 0;

let index_no = 0;
let Playing_song = false;

//create a audio Element
let track = document.createElement('audio');


//All songs list
let All_song = [
  {
    name: "first song",
    path: "music/song1.mp3",
    singer: "1"
  },
  {
    name: "second song",
    path: "music/song2.mp3",
    singer: "2"
  },
  {
    name: "third song",
    path: "music/song3.mp3",
    singer: "3"
  },
  {
    name: "fourth song",
    path: "music/song4.mp3",
    singer: "4"
  },
  {
    name: "fifth song",
    path: "music/song5.mp3",
    singer: "5"
  }
];


// All functions


// function load the track
function load_track(index_no) {
  clearInterval(timer);
  reset_slider();

  track.src = All_song[index_no].path;
  title.innerHTML = All_song[index_no].name;
  artist.innerHTML = All_song[index_no].singer;
  track.load();

  timer = setInterval(range_slider, 1000);
  total.innerHTML = All_song.length;
  present.innerHTML = index_no + 1;
}

load_track(index_no);


//mute sound function
function mute_sound() {
  track.volume = 0;
  volume.value = 0;
  volume_show.innerHTML = 0;
}


// checking.. the song is playing or not
function justplay() {
  if (Playing_song == false) {
    playsong();

  } else {
    pausesong();
  }
}


// reset song slider
function reset_slider() {
  slider.value = 0;
}

// play song
function playsong() {
  track.play();
  Playing_song = true;
  play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
}

//pause song
function pausesong() {
  track.pause();
  Playing_song = false;
  play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}


// next song
function next_song() {
  if (index_no < All_song.length - 1) {
    index_no += 1;
    load_track(index_no);
    playsong();
  } else {
    index_no = 0;
    load_track(index_no);
    playsong();

  }
}

// previous song
function previous_song() {
  if (index_no > 0) {
    index_no -= 1;
    load_track(index_no);
    playsong();

  } else {
    index_no = All_song.length;
    load_track(index_no);
    playsong();
  }
}


// change volume
function volume_change() {
  track.volume = recent_volume.value / 100;
}

// change slider position 
function change_duration() {
  slider_position = track.duration * (slider.value / 100);
  track.currentTime = slider_position;
}


function range_slider() {
  let position = 0;

  // update slider position
  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    slider.value = position;
  }


  // function will run when the song is over
  if (track.ended) {
    play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    if (autoplay == 1) {
      index_no += 1;
      load_track(index_no);
      playsong();
    }
  }
}

// STOPWATCH

class State {
  constructor(startTimestamp, difference, suspended) {
    this.startTimestamp = startTimestamp;
    this.difference = difference;
    this.suspended = suspended;
  }

  static ready() {
    return new State(null, 0, 0);
  }
}

class Stopwatch {
  constructor(state) {
    this.state = state;
    this.requestAnimationId = null;
    this.handleClickStart = this.handleClickStart.bind(this);
    document
      .getElementById("start")
      .addEventListener("click", this.handleClickStart);
    this.handleClickStop = this.handleClickStop.bind(this);
    document
      .getElementById("stop")
      .addEventListener("click", this.handleClickStop);
    this.handleClickReset = this.handleClickReset.bind(this);
    document
      .getElementById("reset")
      .addEventListener("click", this.handleClickReset);
    this.tick = this.tick.bind(this);
    this.render();
  }

  static ready() {
    return new Stopwatch(State.ready());
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  tick() {
    this.setState({
      difference: new Date(new Date() - this.state.startTimestamp)
    });
    this.requestAnimationId = requestAnimationFrame(this.tick);
  }

  handleClickStart() {
    if (this.state.startTimestamp) {
      // Prevent multi clicks on start
      return;
    }
    this.setState({
      startTimestamp: new Date() - this.state.suspended,
      suspended: 0
    });
    this.requestAnimationId = requestAnimationFrame(this.tick);
  }

  handleClickStop() {
    cancelAnimationFrame(this.requestAnimationId);
    this.setState({
      startTimestamp: null,
      suspended: this.state.difference
    });
  }

  handleClickReset() {
    cancelAnimationFrame(this.requestAnimationId);
    this.setState(State.ready());
  }

  render() {
    const { difference } = this.state;
    const hundredths = (difference
      ? Math.floor(difference.getMilliseconds() / 10)
      : 0
    )
      .toString()
      .padStart(2, "0");
    const seconds = (difference ? Math.floor(difference.getSeconds()) : 0)
      .toString()
      .padStart(2, "0");
    const minutes = (difference ? Math.floor(difference.getMinutes()) : 0)
      .toString()
      .padStart(2, "0");

    // Render screen
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }
}

const STOPWATCH = Stopwatch.ready();

// POMODORO

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
const el = document.querySelector(".clock");
const bell = document.querySelector("audio");

const mindiv = document.querySelector(".mins");
const secdiv = document.querySelector(".secs");

const startBtn = document.querySelector(".start");
localStorage.setItem("btn", "focus");

let initial, totalsecs, perc, paused, mins, seconds;

startBtn.addEventListener("click", () => {
  let btn = localStorage.getItem("btn");

  if (btn === "focus") {
    mins = +localStorage.getItem("focusTime") || 1;
  } else {
    mins = +localStorage.getItem("breakTime") || 1;
  }

  seconds = mins * 60;
  totalsecs = mins * 60;
  setTimeout(decremenT(), 60);
  startBtn.style.transform = "scale(0)";
  paused = false;
});

function decremenT() {
  mindiv.textContent = Math.floor(seconds / 60);
  secdiv.textContent = seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`;
  if (circle.classList.contains("danger")) {
    circle.classList.remove("danger");
  }

  if (seconds > 0) {
    perc = Math.ceil(((totalsecs - seconds) / totalsecs) * 100);
    setProgress(perc);
    seconds--;
    initial = window.setTimeout("decremenT()", 1000);
    if (seconds < 10) {
      circle.classList.add("danger");
    }
  } else {
    mins = 0;
    seconds = 0;
    bell.play();
    let btn = localStorage.getItem("btn");

    if (btn === "focus") {
      startBtn.textContent = "start break";
      startBtn.classList.add("break");
      localStorage.setItem("btn", "break");
    } else {
      startBtn.classList.remove("break");
      startBtn.textContent = "Start Focus";
      localStorage.setItem("btn", "focus");
    }
    startBtn.style.transform = "scale(1)";
  }
}

const focusTimeInput = document.querySelector("#focusTime");
const breakTimeInput = document.querySelector("#breakTime");
const pauseBtn = document.querySelector(".pause");

focusTimeInput.value = localStorage.getItem("focusTime");
breakTimeInput.value = localStorage.getItem("breakTime");

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("focusTime", focusTimeInput.value);
  localStorage.setItem("breakTime", breakTimeInput.value);
});

document.querySelector(".reset").addEventListener("click", () => {
  startBtn.style.transform = "scale(1)";
  clearTimeout(initial);
  setProgress(0);
  mindiv.textContent = 0;
  secdiv.textContent = 0;
});

pauseBtn.addEventListener("click", () => {
  if (paused === undefined) {
    return;
  }
  if (paused) {
    paused = false;
    initial = setTimeout("decremenT()", 60);
    pauseBtn.textContent = "Pause";
    pauseBtn.classList.remove("Resume");
  } else {
    clearTimeout(initial);
    pauseBtn.textContent = "Resume";
    pauseBtn.classList.add("Resume");
    paused = true;
  }
});
  