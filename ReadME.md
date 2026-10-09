# 🎮 Hangman Game

A fun, interactive word-guessing game built using **HTML, CSS, and JavaScript**. Test your vocabulary and try to guess the hidden word before the hangman drawing is completed!

## 📖 About the Game

Hangman is a classic word-guessing game where players attempt to uncover a hidden word by guessing one letter at a time.

Each incorrect guess adds a new body part to the hangman drawing. You have **6 chances** to guess incorrectly before the game ends.

Can you figure out the word before it's too late?

## 🚀 How to Start

1. Download the `hangman-game.zip` file.
2. Extract the ZIP file to a folder on your computer.
3. Open the extracted folder.
4. Double-click `index.html` to launch the game in your web browser.
5. Start guessing letters and have fun!

**Note:** No software installation or internet connection is required.

## 🕹️ How to Play

### Step 1: Start the Game
When the game opens, a random word is selected from a built-in list of over 300 words.

The word appears as blank spaces representing its letters.

For example, if the hidden word is **APPLE**, you will see:

`_ _ _ _ _`

### Step 2: Guess a Letter
Choose a letter using either:

- The on-screen A–Z keyboard.
- Your computer's physical keyboard.

### Step 3: Reveal the Hidden Word
If your guessed letter is in the word, it will appear in its correct position.

For example:

Hidden word: `APPLE`

Guess: `P`

Result: `_ P P _ _`

If the letter is incorrect, you lose one chance and a new part of the hangman figure appears.

### Step 4: Watch Your Remaining Chances
You have **6 incorrect guesses** available.

Every incorrect guess reveals another part of the hangman:

1. Head
2. Body
3. Left arm
4. Right arm
5. Left leg
6. Right leg

The game displays how many incorrect guesses you have remaining.

### Step 5: Win or Lose

🏆 **You Win!**

If you successfully reveal every letter before using all 6 incorrect guesses, you win!

A congratulatory message will appear.

💀 **Game Over!**

If you make 6 incorrect guesses, the hangman drawing is completed and the game ends.

The correct word will be revealed so you can see what you missed.

### Step 6: Play Again
Click the **Play Again** button to start a fresh round with a new random word.

Your previous guesses and the hangman drawing will reset automatically.

## ⌨️ Game Controls

| Action | Control |
|---|---|
| Guess a letter | Click an A–Z button |
| Guess using keyboard | Press any letter A–Z |
| Start a new round | Click Play Again |
| View remaining attempts | Check the counter |

**Tip:** Letters that have already been guessed become disabled. Correct guesses are highlighted in green, while incorrect guesses are highlighted in red.

## ✨ Game Features

- Over 300 built-in words.
- Random word selection for every round.
- Interactive on-screen alphabet keyboard.
- Physical keyboard support.
- Six incorrect guesses per round.
- Hangman drawing that updates with each mistake.
- Automatic win and loss detection.
- Correct word revealed after losing.
- Play Again button for unlimited rounds.
- Responsive design for mobile, tablet, and desktop.
- No external frameworks or libraries.
- Works offline.

## 📁 Project Structure

```text
hangman/
├── index.html
├── style.css
├── script.js
└── README.md
```

**File Descriptions**

- `index.html` — Contains the structure of the game interface.
- `style.css` — Controls the visual appearance, colors, layout, and responsive styling.
- `script.js` — Handles word selection, guesses, keyboard input, scoring, and game results.
- `README.md` — Contains the game instructions and project information.

## 🛠️ Technologies Used

- **HTML5** — Game structure and SVG hangman illustration.
- **CSS3** — Design, animations, and responsive layout.
- **JavaScript (ES6)** — Game mechanics and user interactions.

## 💡 Tips for Winning

- Start by guessing common vowels such as A, E, I, O, and U.
- Try frequently used consonants like R, S, T, L, and N.
- Pay attention to the letters already revealed.
- Look for common word patterns and endings.
- Use your remaining chances wisely!

## 🌐 Browser Compatibility

The game works in modern web browsers, including:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## 📜 License

This project is available for personal, educational, and learning purposes.

## 🎉 Enjoy the Game!

Challenge yourself, improve your vocabulary, and see how many words you can guess correctly.

**Good luck, and happy guessing! 🎯**
