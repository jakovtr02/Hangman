# Hangman — Word Guessing Game

A simple, browser-based Hangman game made with HTML, CSS, and JavaScript. No frameworks, installations, or internet connection required.

## Getting Started

1. Download and extract `hangman-game.zip`.
2. Open the `hangman` folder.
3. Double-click `index.html` to launch the game in your web browser.

Keep `index.html`, `style.css`, and `script.js` together in the same folder.

## How to Play

1. The game randomly chooses a secret word from a built-in collection of more than 300 words.
2. Each blank on the screen represents a letter in the secret word.
3. Guess a letter by **clicking or tapping** an on-screen A–Z key, or by **typing a letter** on your physical keyboard.
4. If the letter is in the word, every occurrence of that letter is revealed. The on-screen key turns green.
5. If the letter is not in the word, you lose one remaining guess. The on-screen key turns red, and another part of the hangman is drawn.
6. You can make **up to six incorrect guesses**. The remaining guess count is displayed above the word.
7. **Win** by revealing every letter before you run out of guesses. **Lose** when the sixth incorrect guess completes the hangman; the secret word is then revealed.
8. Select **Play Again** at any time to start a new round with a different word.

### Helpful Tips

- You cannot guess the same letter twice: used keys are disabled, and repeated physical-keyboard guesses are ignored.
- Correct guesses do not reduce your remaining guesses.
- Try common vowels like A, E, I, O, and U early in the round.
- The game works on desktop and mobile screens.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Game page structure and hangman SVG |
| `style.css` | Layout, colors, responsive styling, and animations |
| `script.js` | Word selection, guesses, game state, keyboard controls, and win/loss rules |
| `README.md` | Instructions and game overview |

## Requirements

A modern web browser such as Chrome, Firefox, Edge, or Safari. No server or additional software is needed.

## New features

- **Wins and losses:** Completed games update the tally, which is saved in your browser so it remains after a refresh. Starting another round early does not count as a loss.
- **Categories:** Choose a topic from the Word category dropdown to start a new round using words from that topic. Choose **All categories** to mix them.
- **Winning popup:** After guessing the word, see the word, category, completion time, remaining wrong guesses out of six, and overall record.
- **Share Result:** Use your device's share sheet where supported. Otherwise, the result is copied to the clipboard (or displayed for manual copying).
- **Timer:** Starts when each new round begins and stops when you win or lose.

The game is entirely local. No score or result is sent to a server by the game.
