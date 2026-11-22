import { useState, useEffect } from 'react';
import GameBoard from './GameBoard.jsx';
import Keyboard from './Keyboard.jsx';
import GameOverDialog from './GameOverDialog.jsx';
import { WORDS } from './words.js';
import {
  WORD_LENGTH,
  MAX_GUESSES,
  getKeyStatuses,
  describeGuess,
} from './evaluate.js';

// Picks one hidden word. Used as useState(pickWord) so it runs ONCE,
// not on every render (Lesson 5, Session 3 - "a value chosen once").
function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function App() {
  // 1. State -----------------------------------------------------------
  const [solutionWord, setSolutionWord] = useState(pickWord); // hidden target
  const [currentGuess, setCurrentGuess] = useState(''); // being typed
  const [pastGuesses, setPastGuesses] = useState([]); // submitted words
  const [gameStatus, setGameStatus] = useState('IN_PROGRESS'); // WON | LOST
  const [notice, setNotice] = useState(''); // e.g. "Not enough letters"

  // 2. Worked out from state - none of this is state ----------------------
  const keyStatuses = getKeyStatuses(pastGuesses, solutionWord);
  const lastGuess = pastGuesses[pastGuesses.length - 1];

  let message;
  if (notice) {
    message = notice;
  } else if (!lastGuess) {
    message = 'Type a five-letter word, then press Enter.';
  } else {
    // The result in words, so colour is never the only signal.
    const result = describeGuess(lastGuess, solutionWord);
    if (gameStatus === 'WON') {
      message = `You won in ${pastGuesses.length} of ${MAX_GUESSES}! ${result}.`;
    } else if (gameStatus === 'LOST') {
      message = `Out of guesses. The word was ${solutionWord}. ${result}.`;
    } else {
      message = `Guess ${pastGuesses.length} of ${MAX_GUESSES}: ${result}.`;
    }
  }

  // 3. Handlers ---------------------------------------------------------
  function typeLetter(letter) {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + letter);
      setNotice('');
    }
  }

  function deleteLetter() {
    // slice makes a new string; on an empty row it stays empty.
    setCurrentGuess(currentGuess.slice(0, -1));
    setNotice('');
  }

  function submitGuess() {
    if (currentGuess.length < WORD_LENGTH) {
      setNotice('Not enough letters.');
      return;
    }
    // Copy, add, set - never push into state.
    const nextGuesses = [...pastGuesses, currentGuess];
    setPastGuesses(nextGuesses);
    setCurrentGuess('');
    setNotice('');

    // gameStatus is set HERE, from the guess we are adding - never in an
    // effect that watches the guesses (Session 3).
    if (currentGuess === solutionWord) {
      setGameStatus('WON');
    } else if (nextGuesses.length === MAX_GUESSES) {
      setGameStatus('LOST');
    }
  }

  function newGame() {
    setSolutionWord(pickWord());
    setCurrentGuess('');
    setPastGuesses([]);
    setGameStatus('IN_PROGRESS');
    setNotice('');
  }

  // One function for every key, physical or on-screen (Session 5).
  function handleKey(key) {
    if (gameStatus !== 'IN_PROGRESS') {
      return; // won or lost: halt further input
    }
    if (/^[a-z]$/i.test(key)) {
      typeLetter(key.toUpperCase());
    } else if (key === 'Backspace') {
      deleteLetter();
    } else if (key === 'Enter') {
      submitGuess();
    }
  }

  // 4. The physical keyboard: an effect with cleanup (Session 4). No
  // dependency array, so the listener is replaced after every render and
  // always sees the current state.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) {
        return;
      }
      // Without this, a focused on-screen key would ALSO be clicked by the
      // same Enter and the guess would be handled twice (Session 5).
      if (event.key === 'Enter' && gameStatus === 'IN_PROGRESS') {
        event.preventDefault();
      }
      handleKey(event.key);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <main className="game">
      <h1>Wordle</h1>
      <p className={`status status-${gameStatus.toLowerCase()}`} role="status">
        {message}
      </p>
      <GameBoard
        pastGuesses={pastGuesses}
        currentGuess={currentGuess}
        solutionWord={solutionWord}
        gameStatus={gameStatus}
      />
      <Keyboard statuses={keyStatuses} onKey={handleKey} />
      <button type="button" className="button" onClick={newGame}>
        New game
      </button>
      <GameOverDialog
        open={gameStatus === 'LOST'}
        solutionWord={solutionWord}
        onPlayAgain={newGame}
      />
    </main>
  );
}
