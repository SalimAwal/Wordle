// One letter box. Its class is worked out from the props, like Square in
// tic-tac-toe: 'tile tile-correct', 'tile tile-present' ...
export default function Tile({ letter, status, index }) {
  let className = 'tile';
  if (status) {
    className += ` tile-${status}`;
  } else if (letter) {
    className += ' tile-filled';
  }
  // The delay makes a revealed row colour in one tile after another.
  return (
    <div className={className} style={{ animationDelay: `${index * 120}ms` }}>
      {letter}
    </div>
  );
}
