import { useEffect, useRef } from 'react';

// A modal is the browser's job; state tells it when (Session 6).
export default function GameOverDialog({ open, solutionWord, onPlayAgain }) {
  // After the render, dialogRef.current is the real <dialog> element.
  const dialogRef = useRef(null);

  // Runs only when `open` changes. showModal() dims the page, traps focus
  // and handles Escape; <dialog open> would do none of that.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Escape: start a new game instead of letting the browser close the
  // dialog on its own, so React and the dialog never disagree.
  function handleCancel(event) {
    event.preventDefault();
    onPlayAgain();
  }

  return (
    <dialog ref={dialogRef} className="dialog" onCancel={handleCancel}>
      <h2>Game over</h2>
      <p>The word was</p>
      <p className="dialog-word">{solutionWord}</p>
      <button type="button" className="button" onClick={onPlayAgain}>
        Play again
      </button>
    </dialog>
  );
}
