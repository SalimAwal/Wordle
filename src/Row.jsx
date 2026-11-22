import Tile from './Tile.jsx';

const columns = [0, 1, 2, 3, 4]; // never changes, so it lives outside

// One guess attempt: five tiles. letters is a string (maybe shorter than 5),
// statuses is an array of results, or null while the row is not scored yet.
export default function Row({ letters, statuses }) {
  return (
    <div className="row">
      {columns.map((col) => (
        <Tile
          key={col}
          index={col}
          letter={letters[col] || ''}
          status={statuses ? statuses[col] : null}
        />
      ))}
    </div>
  );
}
