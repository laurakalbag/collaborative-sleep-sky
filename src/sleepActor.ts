import { actorFromStately } from '@statelyai/sky';
import { starGraphicOne, starGraphicTwo, starGraphicThree } from './graphics';
import { skyConfig } from './sleepActor.sky';
import './styles.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="background">
<div id="starscape"></div>
<div id="wrapper">
  <div id="content">
    <h1>Collaborative sleep</h1>
    <p>There <span id="star-number">are 0 stars</span> online.</p>
    <p>Your current background<br/> colour is <span id="colour-name">black</span>.</p>
    <ul id="buttons">
      <li><button id="sound-toggle">Turn sound on</button></li>
      <li><button id="colour-toggle">Toggle colour</button></li>
    </ul>
  </div>
  <audio id="audio-player" loop>
    <p>
      Sorry your browser does not support the audio player.
    </p>
  </audio>
</div>
</div>
`;

const starscape = document.querySelector('#starscape') as Element;

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

function addNewStar() {
  var starPosition = starCoOrdinates();
  interface Star {
    style: any;
  }
  let newStar = document.createElement('div') as Element & Star;
  const chooseStarGraphic: number = getRandomInt(1, 3);
  let graphic = starGraphicOne;
  if (chooseStarGraphic === 1) {
    graphic = starGraphicOne;
  } else if (chooseStarGraphic === 2) {
    graphic = starGraphicTwo;
  } else if (chooseStarGraphic === 3) {
    graphic = starGraphicThree;
  }
  newStar.innerHTML = graphic;
  newStar.className = 'star';
  newStar.style.left = starPosition.x + `dvw`;
  newStar.style.top = starPosition.y + `dvh`;
  starscape.prepend(newStar);
}

function addStarToStarscape(numberOfPlayers: number) {
  const existingPlayers = numberOfPlayers;
  let stars = starscape.querySelectorAll('.star');
  while (stars.length < existingPlayers) {
    addNewStar();

    stars = starscape.querySelectorAll('.star');

  }
}

function removeStarFromStarscape(numberOfPlayers: number) {
  const existingPlayers = numberOfPlayers;
  const star = starscape.querySelector('.star');
  let stars = starscape.querySelectorAll('.star');
  while (stars.length > existingPlayers) {
    if (star !== null) {
      starscape.removeChild(star);
  
    }
    stars = starscape.querySelectorAll('.star');
    console.log('Removing: New stars length', stars.length);
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
    url: 'https://sky.stately.ai/YRV2Un',
    sessionId: 'shared-session',
    onPlayerJoined(info) {
      numberOfPlayers = info.numberOfPlayers;
      updateStarsCount(numberOfPlayers);
      addStarToStarscape(numberOfPlayers);
    },
    onPlayerLeft(info) {
      numberOfPlayers = info.numberOfPlayers;
      updateStarsCount(numberOfPlayers);
      removeStarFromStarscape(numberOfPlayers);
    },
  },
  skyConfig,
);

actor.subscribe((snapshot) => {
  // console.log('Actor changed:', snapshot);
});

actor.start();

const soundButton = document.querySelector('#sound-toggle') as Element;
const audio = document.querySelector('#audio-player') as any;
const colourButton = document.querySelector('#colour-toggle') as Element

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
  // console.log('Randomised audio', audio.src);
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

interface Background {
  style: any;
}

const background = document.querySelector('#background') as Element & Background;
const colourName = document.querySelector('#colour-name') as Element;

function updateColour(state: any) {
  const colourBlack = state.matches({
    Colour: 'Black',
  });
  const colourBlue = state.matches({
    Colour: 'Blue',
  });
  const colourPurple = state.matches({
    Colour: 'Purple',
  });
  if (colourBlack === true) {
    background.style.background = "var(--background-black) var(--background-black-gradient)";
    colourName.innerHTML = 'black';
  } else if (colourBlue === true) {
    background.style.background = "var(--background-blue) var(--background-blue-gradient)";
    colourName.innerHTML = 'blue';
  } else if (colourPurple === true) {
    background.style.background = "var(--background-purple) var(--background-purple-gradient)";
    colourName.innerHTML = 'purple';
  }
}

soundButton?.addEventListener('click', () => {
  actor.send({ type: 'toggle sound' });

  updateSoundButtonText(actor.getSnapshot());
});

colourButton?.addEventListener('click', () => {
  actor.send({ type: 'toggle colour' });

  updateColour(actor.getSnapshot());
});

