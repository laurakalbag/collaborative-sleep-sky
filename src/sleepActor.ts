import { actorFromStately } from '@statelyai/sky';
import { starGraphic } from './graphics';
import { skyConfig } from './sleepActor.sky';
import './styles.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="starscape"></div>
<div id="wrapper">
  <div id="content">
    <h1>Collaborative sleep</h1>
    <p>There <span id="star-number">are 0 stars</span> online.</p>
    <ul id="buttons">
      <li><button id="sound-toggle">Turn sound on</button></li>
    </ul>
  </div>
  <audio id="audio-player" loop>
    <p>
      Sorry your browser does not support the audio player.
    </p>
  </audio>
</div>
`;

const starscape = document.querySelector('#starscape') as Element;
const starmap: Map<string, { x: number; y: number }> = new Map();

// Add stars

function starCoOrdinates() {
  let xAxis = getRandomInt(1, 80);
  let yAxis = getRandomInt(1, 80);

  interface CoOrdinates {
    x: number;
    y: number;
  }

  let cooridinates = {} as CoOrdinates;
  cooridinates.x = xAxis;
  cooridinates.y = yAxis;

  return cooridinates;
}

function addStarToStarscape() {
  var starPosition = starCoOrdinates();
  interface Star {
    style: any;
  }
  let newStar = document.createElement('div') as Element & Star;
  const starId = newStar.id;
  starmap.set(starId, starPosition);
  newStar.innerHTML = starGraphic;
  newStar.className = 'star';
  newStar.style.left = starPosition.x + `dvw`;
  newStar.style.top = starPosition.y + `dvh`;
  starscape.prepend(newStar);
}

function removeStarFromStarscape() {
  const star = starscape.querySelector('.star');
  if (star) {
    starmap.delete(star.id);
    starscape.removeChild(star);
  }
}

const starNumber = document.querySelector('#star-number') as Element;

function updateStarsCount(numberOfPlayers: number) {
  var number = numberOfPlayers.toString();
  if (numberOfPlayers === 1) {
    starNumber.innerHTML = `is ${number} star`;
  } else if (numberOfPlayers > 1) {
    starNumber.innerHTML = `are ${number} stars`;
  }
}

let numberOfPlayers: number;

const actor = await actorFromStately(
  {
    url: 'https://sky.stately.ai/GK0FU3',
    sessionId: 'shared-session',
    onPlayerJoined(info) {
      numberOfPlayers = info.numberOfPlayers;
      addStarToStarscape();
      updateStarsCount(numberOfPlayers);
    },
    onPlayerLeft(info) {
      numberOfPlayers = info.numberOfPlayers;
      removeStarFromStarscape();
      updateStarsCount(numberOfPlayers);
    },
  },
  skyConfig,
);

actor.subscribe((snapshot) => {
  console.log('Actor changed:', snapshot);
});

actor.start();

interface SoundButton {
  value: string;
}
const soundButton = document.querySelector('#sound-toggle') as Element &
  SoundButton;
const audio = document.querySelector('#audio-player') as any;

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// // Randomise audio tracks

function randomAudio() {
  const audioUrlPrefix =
    'https://ascelcgzufjyvdzuplwo.supabase.co/storage/v1/object/public/demo-assets/laura';
  const chooseTrack: number = getRandomInt(1, 3);
  let track;
  if (chooseTrack === 1) {
    track = 'one.mp3';
  } else if (chooseTrack === 2) {
    track = 'two.mp3';
  } else if (chooseTrack === 3) {
    track = 'three.mp3';
  }
  audio.src = `${audioUrlPrefix}/${track}`;
  console.log('Randomised audio', audio.src);
}

randomAudio();
audio.load();

function updateSoundButtonText(state: any) {
  const soundOn = state.matches({
    Sound: 'On',
  });
  if (soundOn === true) {
    soundButton.innerHTML = 'Turn sound off';
    audio.play();
  } else {
    soundButton.innerHTML = 'Turn sound on';
    audio.pause();
  }
}

soundButton?.addEventListener('click', () => {
  actor.send({ type: 'toggle sound' });

  updateSoundButtonText(actor.getSnapshot());
});
