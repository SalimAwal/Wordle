// Pure functions: the same input always gives the same output, and they
// change nothing else. Easy to test in the console.

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

// Scores one guess against the solution. Returns 5 results, each one of
// 'correct' (green), 'present' (yellow) or 'absent' (gray).
// Two passes handle repeated letters: SPEED vs ABIDE gives only ONE yellow E.
export function evaluateGuess(guess, solution) {
  const result = Array(WORD_LENGTH).fill('absent');
  const unmatched = {}; // solution letters not used up by a green

  // Pass 1: greens. Count the solution letters that are not green.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct';
    } else {
      unmatched[solution[i]] = (unmatched[solution[i]] || 0) + 1;
    }
  }

  // Pass 2: yellows, only while an unmatched copy of the letter is left.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] !== 'correct' && unmatched[guess[i]] > 0) {
      result[i] = 'present';
      unmatched[guess[i]] -= 1;
    }
  }
  return result;
}

// The colour each keyboard letter should show, from ALL guesses so far.
// Colours only improve: green beats yellow beats gray.
const rank = { absent: 1, present: 2, correct: 3 };

export function getKeyStatuses(pastGuesses, solution) {
  const statuses = {};
  pastGuesses.forEach((guess) => {
    const results = evaluateGuess(guess, solution);
    guess.split('').forEach((letter, i) => {
      const current = statuses[letter];
      if (!current || rank[results[i]] > rank[current]) {
        statuses[letter] = results[i];
      }
    });
  });
  return statuses;
}

// The result in words, for the screen-reader status line.
export function describeGuess(guess, solution) {
  const results = evaluateGuess(guess, solution);
  return guess
    .split('')
    .map((letter, i) => `${letter} ${results[i]}`)
    .join(', ');
}
