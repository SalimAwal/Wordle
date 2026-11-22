import Row from './Row.jsx';
import { evaluateGuess, MAX_GUESSES } from './evaluate.js';

const rowNumbers = [0, 1, 2, 3, 4, 5]; // six attempts

// The 6 x 5 grid. It owns no state: it only draws what App gives it.
// Row r is a scored guess, the guess being typed, or empty.
export default function GameBoard({ pastGuesses, currentGuess, solutionWord, gameStatus }) {
  return (
    <div className="board" aria-label="Game board">
      {rowNumbers.map((r) => {
        if (r < pastGuesses.length) {
          return (
            <Row
              key={r}
              letters={pastGuesses[r]}
              statuses={evaluateGuess(pastGuesses[r], solutionWord)}
            />
          );
        }
        // The row being typed in, only while the game is running.
        if (r === pastGuesses.length && gameStatus === 'IN_PROGRESS' && r < MAX_GUESSES) {
          return <Row key={r} letters={currentGuess} statuses={null} />;
        }
        return <Row key={r} letters="" statuses={null} />;
      })}
    </div>
  );
}
