import { createActor, fromCallback } from 'xstate';
import { actorFromStately } from '@statelyai/sky';
import { v4 as uuidv4 } from 'uuid';
import { skyConfig } from './sleepActor.sky';
import { starGraphic } from './graphics';
import './styles.css';

let session: string = uuidv4();
// console.log('Session:', session);

const actor = actorFromStately(
  {
    url: 'https://sky.stately.ai/YKYFNR',
    sessionId: session,
  },
  skyConfig,
);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="starscape"></div>
<div id="wrapper">
  <div id="content">
    <h1>Collaborative sleep</h1>
    <p>There are <span id="star-number">0</span> stars online.</p>
    <ul id="buttons">
      <li><button id="sound-toggle">Sound off</button></li>
    </ul>
  </div>
  <audio id="audio-player" loop>
    <p>
      Sorry your browser does not support the audio player.
    </p>
  </audio>
</div>
`;

const starscape = document.querySelector('#starscape') as any;

interface SoundButton {
    value: string;
}
const soundButton = document.querySelector('#sound-toggle') as Element &
  SoundButton;
const audio = document.querySelector('#audio-player') as any;

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Randomise audio tracks

function randomAudio() {
    const audioUrlPrefix =
      'https://ascelcgzufjyvdzuplwo.supabase.co/storage/v1/object/public/demo-assets/laura/';
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
}

function updateSoundButtonText(state: any) {
    const soundOn = state.matches({
      Sound: 'On',
    });
    if (soundOn === true) {
      soundButton.innerHTML = 'Turn sound off';
    } else {
      soundButton.innerHTML = 'Turn sound on';
    }
  }
  

// Add stars

function starCoOrdinates() {
    let xAxis = getRandomInt(1, 90);
    let yAxis = getRandomInt(1, 90);
  
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
    newStar.innerHTML = starGraphic;
    newStar.className = 'star';
    newStar.style.left = starPosition.x + `vw`;
    newStar.style.top = starPosition.y + `vh`;
    starscape.prepend(newStar);
  }

  function updateNumberofStars() {
    // TODO
    // starNumber.innerHTML = numberOfStarsAsText;
  }

  function createSession() {
    // TODO
  }

  function removeSession() {
    // TODO
  }
  
  function addStar() {
    addStarToStarscape();
  }
  
  function removeStar() {
  
  }

  const sleepMachine = createActor(
    actor.provide({
      actions: {
        createSession: ({}) => {
          createSession();
        },
        addStar: ({}) => {
          addStar();
        },
        removeSession: ({}) => {
          removeSession();
        },
        removeStar: ({}) => {
          removeStar();
        },
        randomAudio: ({}) => {
          randomAudio();
          audio.load();
        },
      },
      actors: {
        audioPlayer: fromCallback(({ receive }) => {
          receive((event: any) => {
            if (event.type === 'play') {
              audio.play();
            } else if (event.type === 'pause') {
              audio.pause();
            }
          });
        }),
      },
    }),
  );
  

  sleepMachine.subscribe((state) => {
    updateSoundButtonText(state);
  });

  sleepMachine.start();

soundButton?.addEventListener('click', () => {
  sleepMachine.send({ type: 'toggle sound' });
});