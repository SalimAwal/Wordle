// Three rows of letters as strings; split('') turns one into letters.
const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

// Every key is a real <button>. Each calls onKey with the same name a
// physical key press has - 'A', 'Backspace', 'Enter' - and App passes
// handleKey as onKey. Two ways in, one function.
// statuses is { A: 'correct', B: 'absent', ... } worked out in App.
export default function Keyboard({ statuses, onKey }) {
  function keyClass(letter) {
    return statuses[letter] ? `key key-${statuses[letter]}` : 'key';
  }

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {rows[0].split('').map((letter) => (
          <button type="button" key={letter} className={keyClass(letter)} onClick={() => onKey(letter)}>
            {letter}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {rows[1].split('').map((letter) => (
          <button type="button" key={letter} className={keyClass(letter)} onClick={() => onKey(letter)}>
            {letter}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        <button type="button" className="key key-wide" onClick={() => onKey('Enter')}>
          Enter
        </button>
        {rows[2].split('').map((letter) => (
          <button type="button" key={letter} className={keyClass(letter)} onClick={() => onKey(letter)}>
            {letter}
          </button>
        ))}
        <button type="button" className="key key-wide" aria-label="Delete" onClick={() => onKey('Backspace')}>
          &#9003;
        </button>
      </div>
    </div>
  );
}
