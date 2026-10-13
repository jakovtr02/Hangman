"use strict";

/* 1. Built-in word bank: over 300 distinct A-Z words. */
const CATEGORIES = {
  'Fruits': `apple banana cherry orange lemon lime peach pear mango grape melon kiwi papaya coconut apricot plum berry fig guava avocado pineapple strawberry blueberry raspberry grapefruit tangerine pomegranate cranberry nectarine blackberry`,
  'Animals': `tiger lion zebra giraffe elephant monkey gorilla panda koala kangaroo leopard cheetah jaguar panther rabbit squirrel fox wolf bear otter beaver dolphin whale shark octopus penguin flamingo eagle owl falcon parrot turtle crocodile`,
  'Nature': `forest jungle desert mountain valley canyon island ocean river lake waterfall volcano glacier meadow prairie swamp beach coast cliff cave reef lagoon tundra savanna peninsula continent woodland hillside rainforest summit horizon wilderness`,
  'Technology': `computer laptop keyboard monitor mouse printer scanner tablet smartphone camera speaker microphone headphone charger battery circuit software hardware browser website network server router database program algorithm pixel cursor display internet processor technology`,
  'Music': `guitar piano violin trumpet trombone flute clarinet saxophone drum cymbal harmonica accordion banjo ukulele cello harp orchestra melody rhythm harmony chorus concert festival singer musician composer instrument symphony opera jazz reggae acoustic`,
  'Sports': `soccer football basketball baseball tennis cricket hockey volleyball badminton swimming cycling running boxing archery bowling skating surfing skiing wrestling gymnastics fencing rowing climbing karate judo rugby marathon stadium athlete referee tournament`,
  'Education': `school teacher student classroom library notebook pencil eraser ruler backpack homework lesson subject science history geography mathematics chemistry physics biology language grammar dictionary encyclopedia alphabet sentence paragraph question answer education knowledge university`,
  'Home': `kitchen bedroom bathroom livingroom garden balcony garage basement attic hallway staircase window curtain carpet mirror sofa chair table cabinet wardrobe bookshelf pillow blanket mattress lamp ceiling doorway chimney fireplace furniture`,
  'Space': `airplane helicopter airport rocket spaceship satellite planet asteroid galaxy universe star comet meteor astronaut telescope orbit gravity eclipse nebula constellation moon earth mars venus jupiter saturn mercury neptune uranus cosmos spacecraft`,
  'Weather': `summer winter spring autumn sunshine rainbow thunder lightning storm hurricane tornado blizzard drizzle snowfall breeze mist fog cloud temperature weather climate humidity forecast umbrella snowflake raindrop sunshine daylight sunrise sunset`,
  'Fantasy': `adventure mystery journey treasure compass explorer pirate captain kingdom castle dragon wizard knight princess prince monster legend hero villain magic potion crystal dungeon sword shield crown quest battle victory secret`,
  'Feelings': `happiness laughter friendship kindness courage wisdom patience honesty freedom justice peace loyalty respect trust hope dream imagination creativity curiosity confidence gratitude generosity empathy ambition determination bravery serenity harmony excitement wonder`,
  'Transport': `bicycle motorcycle automobile tractor submarine sailboat canoe kayak skateboard scooter train subway tram bus taxi truck van wagon carriage ferry yacht spaceship locomotive vehicle highway railway station traffic journey`,
  'Food': `bread butter cheese yogurt cereal pancake waffle sandwich pizza burger pasta noodles rice soup salad cookie biscuit chocolate caramel vanilla cinnamon pepper garlic onion potato carrot broccoli spinach mushroom`,
  'Materials': `diamond emerald ruby sapphire pearl silver gold copper iron bronze marble granite quartz crystal sandstone limestone obsidian amethyst turquoise platinum titanium nickel cobalt carbon oxygen hydrogen nitrogen helium silicon`,
  'Professions': `doctor nurse dentist surgeon pharmacist engineer architect scientist astronaut pilot farmer baker chef artist painter writer poet journalist lawyer judge detective firefighter police officer mechanic electrician plumber carpenter photographer designer programmer developer`,
  'Colors': `yellow purple orange indigo violet crimson scarlet magenta turquoise lavender maroon beige ivory amber coral peach mint olive bronze silver golden colorful bright dark light shadow sparkle glitter shimmer reflection`,
  'Time': `clock calendar minute second hour morning evening midnight afternoon yesterday tomorrow weekend weekday holiday birthday anniversary century decade millennium season schedule appointment deadline moment lifetime duration era future past present timeless`,
  'Places': `bridge tower palace temple museum theater cinema restaurant market hospital bakery pharmacy bookstore supermarket factory warehouse office hotel hostel apartment cottage mansion skyscraper monument fountain stadium aquarium zoo cathedral lighthouse`,
  'Brain Teasers': `puzzle riddle mystery challenge strategy solution victory failure attempt success effort practice progress skill talent memory logic reason thought idea concept theory experiment discovery invention creation innovation research analysis pattern sequence number symbol`,
  'Sciences': `astronomy botany zoology geology ecology anatomy medicine surgery nutrition psychology philosophy sociology economics literature poetry fiction fantasy biography mythology archaeology anthropology linguistics mathematics statistics engineering robotics genetics chemistry`,
  'Ocean Life': `anchor harbor dock boat ship vessel sailor voyage navigation compass lighthouse ocean wave tide current whirlpool seashell coral reef shoreline seagull pelican dolphin jellyfish lobster shrimp crab oyster starfish plankton`,
  'Celebrations': `festival carnival parade celebration ceremony tradition culture costume decoration lantern confetti balloon ribbon present surprise invitation gathering entertainment performance audience applause stage spotlight magician comedian dancer orchestra theater spectacle`,
  'Tools': `hammer screwdriver wrench pliers saw drill chisel ladder shovel rake broom bucket toolbox nail screw bolt hinge handle rope chain pulley wheel gear engine motor machine generator turbine magnet sensor switch`,
  'Drinks': `coffee tea lemonade smoothie milkshake water juice cocoa espresso cappuccino latte mocha beverage drink cup mug glass pitcher kettle teapot straw bottle flask thermos syrup honey sugar cream icecube refreshment`
};
const WORD_BANKS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([name, words]) => [
    name, [...new Set(words.toUpperCase().split(/\s+/).filter(word => /^[A-Z]+$/.test(word)))]
  ])
);


/* 2. Single mutable state object, including local scoreboard. */
const MAX_WRONG = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STORAGE_KEY = "hangman-score-v2";
function readScores() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      wins: Number.isInteger(saved?.wins) && saved.wins >= 0 ? saved.wins : 0,
      losses: Number.isInteger(saved?.losses) && saved.losses >= 0 ? saved.losses : 0
    };
  } catch { return { wins: 0, losses: 0 }; }
}
const scores = readScores();
const state = {
  word: "", category: "All categories", guessed: new Set(),
  wrongGuesses: 0, finished: false, outcome: null,
  startedAt: 0, elapsedSeconds: 0,
  wins: scores.wins, losses: scores.losses
};

/* 3. DOM references and category menu. */
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const remaining = document.getElementById("remaining");
const message = document.getElementById("message");
const playAgain = document.getElementById("play-again");
const categorySelect = document.getElementById("category");
const winsCount = document.getElementById("wins");
const lossesCount = document.getElementById("losses");
const winDialog = document.getElementById("win-dialog");
const winDetails = document.getElementById("win-details");
const shareButton = document.getElementById("share-result");
const closeDialog = document.getElementById("close-dialog");
const shareStatus = document.getElementById("share-status");
const bodyParts = Array.from(
  { length: MAX_WRONG }, (_, i) => document.getElementById(`part-${i}`)
);

function buildCategories() {
  for (const category of Object.keys(WORD_BANKS)) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

/* 4. Build keyboard once. */
function buildKeyboard() {
  keyboard.innerHTML = "";
  for (const letter of ALPHABET) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.setAttribute("aria-label", `Guess ${letter}`);
    button.addEventListener("click", () => handleGuess(letter));
    keyboard.appendChild(button);
  }
}

/* 5. Start or switch category, without repeating the last word. */
function startGame() {
  const previousWord = state.word;
  state.category = categorySelect.value;
  const bank = state.category === "All categories"
    ? [...new Set(Object.values(WORD_BANKS).flat())]
    : WORD_BANKS[state.category];
  let newWord;
  do {
    newWord = bank[Math.floor(Math.random() * bank.length)];
  } while (bank.length > 1 && newWord === previousWord);
  state.word = newWord;
  state.guessed = new Set();
  state.wrongGuesses = 0;
  state.finished = false;
  state.outcome = null;
  state.startedAt = performance.now();
  state.elapsedSeconds = 0;
  if (winDialog.open) winDialog.close();
  shareStatus.textContent = "";
  message.textContent = "Choose a letter to begin!";
  message.className = "game-message";
  updateDisplay();
}

/* 6. Process valid, unique guesses. */
function handleGuess(input) {
  if (state.finished || winDialog.open || typeof input !== "string") return;
  const letter = input.toUpperCase();
  if (!/^[A-Z]$/.test(letter) || state.guessed.has(letter)) return;
  state.guessed.add(letter);
  const isCorrect = state.word.includes(letter);
  if (!isCorrect) state.wrongGuesses++;
  checkGameOver();
  if (!state.finished) {
    message.className = "game-message";
    message.textContent = isCorrect
      ? "Nice guess! Keep going."
      : "Not quite! Try another letter.";
  }
  updateDisplay();
  if (state.outcome === "win") showWinDialog();
}

/* 7. Draw word, hangman, keyboard, and score tally. */
function updateDisplay() {
  winsCount.textContent = state.wins;
  lossesCount.textContent = state.losses;
  const guessesLeft = MAX_WRONG - state.wrongGuesses;
  remaining.textContent = guessesLeft;
  remaining.classList.toggle("danger", guessesLeft <= 2);
  wordDisplay.innerHTML = "";
  for (const letter of state.word) {
    const slot = document.createElement("span");
    slot.className = "letter-slot";
    const guessed = state.guessed.has(letter);
    slot.textContent = guessed || state.outcome === "lose" ? letter : "\u00A0";
    if (guessed || state.outcome === "lose") slot.classList.add("revealed");
    if (state.outcome === "lose" && !guessed) slot.classList.add("missed");
    wordDisplay.appendChild(slot);
  }
  wordDisplay.setAttribute("aria-label", [...state.word]
    .map(letter => state.guessed.has(letter) || state.finished ? letter : "blank")
    .join(" "));
  bodyParts.forEach((part, index) => {
    part.classList.toggle("visible", index < state.wrongGuesses);
  });
  keyboard.querySelectorAll(".key").forEach(button => {
    const letter = button.dataset.letter;
    const guessed = state.guessed.has(letter);
    button.disabled = guessed || state.finished;
    button.classList.toggle("correct", guessed && state.word.includes(letter));
    button.classList.toggle("incorrect", guessed && !state.word.includes(letter));
  });
}

/* 8. End game once; tally finished rounds only. */
function checkGameOver() {
  if (![...state.word].every(letter => state.guessed.has(letter)) &&
      state.wrongGuesses < MAX_WRONG) return;
  state.finished = true;
  state.elapsedSeconds = Math.max(0, Math.round((performance.now() - state.startedAt) / 1000));
  if ([...state.word].every(letter => state.guessed.has(letter))) {
    state.outcome = "win";
    state.wins++;
    message.className = "game-message win";
    message.textContent = "🎉 You won! Amazing job!";
  } else {
    state.outcome = "lose";
    state.losses++;
    message.className = "game-message lose";
    message.textContent = `Game over! The word was ${state.word}.`;
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({wins: state.wins, losses: state.losses})); }
  catch { /* The game still works if browser storage is unavailable. */ }
}

/* 9. Shareable win result and accessible popup. */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
}
function getShareText() {
  return `🎉 I won Hangman!\nCategory: ${state.category}\nWord: ${state.word}\nTime: ${formatTime(state.elapsedSeconds)}\nGuesses remaining: ${MAX_WRONG - state.wrongGuesses}/${MAX_WRONG}\nRecord: ${state.wins} wins, ${state.losses} losses`;
}
function showWinDialog() {
  winDetails.textContent = `You found ${state.word} (${state.category}) in ${formatTime(state.elapsedSeconds)} with ${MAX_WRONG - state.wrongGuesses} of ${MAX_WRONG} guesses left! Your record: ${state.wins} wins, ${state.losses} losses.`;
  winDialog.showModal();
}
async function shareResult() {
  const text = getShareText();
  try {
    if (navigator.share) {
      await navigator.share({ title: "My Hangman result", text });
      shareStatus.textContent = "Result shared!";
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      shareStatus.textContent = "Result copied to clipboard!";
    } else {
      window.prompt("Copy your result:", text);
      shareStatus.textContent = "Copy the text to share your result.";
    }
  } catch (error) {
    if (error.name === "AbortError") return;
    window.prompt("Copy your result:", text);
    shareStatus.textContent = "Copy the text to share your result.";
  }
}

/* 10. Keyboard and button listeners. */
document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey || winDialog.open) return;
  if (/^[a-zA-Z]$/.test(event.key)) handleGuess(event.key);
});
categorySelect.addEventListener("change", startGame);
playAgain.addEventListener("click", startGame);
shareButton.addEventListener("click", shareResult);
closeDialog.addEventListener("click", () => winDialog.close());
buildCategories();
buildKeyboard();
startGame();
