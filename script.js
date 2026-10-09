"use strict";

/* 1. Built-in word bank: over 300 distinct A-Z words. */
const WORDS = `
apple banana cherry orange lemon lime peach pear mango grape
melon kiwi papaya coconut apricot plum berry fig guava avocado
pineapple strawberry blueberry raspberry grapefruit tangerine
pomegranate cranberry nectarine blackberry

tiger lion zebra giraffe elephant monkey gorilla panda koala
kangaroo leopard cheetah jaguar panther rabbit squirrel fox
wolf bear otter beaver dolphin whale shark octopus penguin
flamingo eagle owl falcon parrot turtle crocodile

forest jungle desert mountain valley canyon island ocean river
lake waterfall volcano glacier meadow prairie swamp beach
coast cliff cave reef lagoon tundra savanna peninsula
continent woodland hillside rainforest summit horizon
wilderness

computer laptop keyboard monitor mouse printer scanner tablet
smartphone camera speaker microphone headphone charger battery
circuit software hardware browser website network server
router database program algorithm pixel cursor display
internet processor technology

guitar piano violin trumpet trombone flute clarinet saxophone
drum cymbal harmonica accordion banjo ukulele cello harp
orchestra melody rhythm harmony chorus concert festival
singer musician composer instrument symphony opera jazz
reggae acoustic

soccer football basketball baseball tennis cricket hockey
volleyball badminton swimming cycling running boxing archery
bowling skating surfing skiing wrestling gymnastics fencing
rowing climbing karate judo rugby marathon stadium athlete
referee tournament

school teacher student classroom library notebook pencil
eraser ruler backpack homework lesson subject science history
geography mathematics chemistry physics biology language
grammar dictionary encyclopedia alphabet sentence paragraph
question answer education knowledge university

kitchen bedroom bathroom livingroom garden balcony garage
basement attic hallway staircase window curtain carpet
mirror sofa chair table cabinet wardrobe bookshelf pillow
blanket mattress lamp ceiling doorway chimney fireplace
furniture

airplane helicopter airport rocket spaceship satellite planet
asteroid galaxy universe star comet meteor astronaut telescope
orbit gravity eclipse nebula constellation moon earth mars
venus jupiter saturn mercury neptune uranus cosmos
spacecraft

summer winter spring autumn sunshine rainbow thunder
lightning storm hurricane tornado blizzard drizzle snowfall
breeze mist fog cloud temperature weather climate humidity
forecast umbrella snowflake raindrop sunshine daylight
sunrise sunset

adventure mystery journey treasure compass explorer pirate
captain kingdom castle dragon wizard knight princess prince
monster legend hero villain magic potion crystal dungeon
sword shield crown quest battle victory secret

happiness laughter friendship kindness courage wisdom
patience honesty freedom justice peace loyalty respect trust
hope dream imagination creativity curiosity confidence
gratitude generosity empathy ambition determination bravery
serenity harmony excitement wonder

bicycle motorcycle automobile tractor submarine sailboat
canoe kayak skateboard scooter train subway tram bus taxi
truck van wagon carriage ferry yacht spaceship locomotive
vehicle highway railway station traffic journey

bread butter cheese yogurt cereal pancake waffle sandwich
pizza burger pasta noodles rice soup salad cookie biscuit
chocolate caramel vanilla cinnamon pepper garlic onion
potato carrot broccoli spinach mushroom

diamond emerald ruby sapphire pearl silver gold copper iron
bronze marble granite quartz crystal sandstone limestone
obsidian amethyst turquoise platinum titanium nickel cobalt
carbon oxygen hydrogen nitrogen helium silicon

doctor nurse dentist surgeon pharmacist engineer architect
scientist astronaut pilot farmer baker chef artist painter
writer poet journalist lawyer judge detective firefighter
police officer mechanic electrician plumber carpenter
photographer designer programmer developer

yellow purple orange indigo violet crimson scarlet magenta
turquoise lavender maroon beige ivory amber coral peach
mint olive bronze silver golden colorful bright dark light
shadow sparkle glitter shimmer reflection

clock calendar minute second hour morning evening midnight
afternoon yesterday tomorrow weekend weekday holiday
birthday anniversary century decade millennium season
schedule appointment deadline moment lifetime duration era
future past present timeless

bridge tower palace temple museum theater cinema restaurant
market hospital bakery pharmacy bookstore supermarket
factory warehouse office hotel hostel apartment cottage
mansion skyscraper monument fountain stadium aquarium
zoo cathedral lighthouse

puzzle riddle mystery challenge strategy solution victory
failure attempt success effort practice progress skill talent
memory logic reason thought idea concept theory experiment
discovery invention creation innovation research analysis
pattern sequence number symbol

astronomy botany zoology geology ecology anatomy medicine
surgery nutrition psychology philosophy sociology economics
literature poetry fiction fantasy biography mythology
archaeology anthropology linguistics mathematics statistics
engineering robotics genetics chemistry

anchor harbor dock boat ship vessel sailor voyage navigation
compass lighthouse ocean wave tide current whirlpool
seashell coral reef shoreline seagull pelican dolphin
jellyfish lobster shrimp crab oyster starfish plankton

festival carnival parade celebration ceremony tradition
culture costume decoration lantern confetti balloon ribbon
present surprise invitation gathering entertainment
performance audience applause stage spotlight magician
comedian dancer orchestra theater spectacle

hammer screwdriver wrench pliers saw drill chisel ladder
shovel rake broom bucket toolbox nail screw bolt hinge
handle rope chain pulley wheel gear engine motor machine
generator turbine magnet sensor switch

coffee tea lemonade smoothie milkshake water juice cocoa
espresso cappuccino latte mocha beverage drink cup mug
glass pitcher kettle teapot straw bottle flask thermos
syrup honey sugar cream icecube refreshment
`.trim().split(/\s+/);

const WORD_BANK = [...new Set(
  WORDS.map(word => word.toUpperCase()).filter(word => /^[A-Z]+$/.test(word))
)];

/* 2. Single mutable state object. */
const MAX_WRONG = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const state = {
  word: "",
  guessed: new Set(),
  wrongGuesses: 0,
  finished: false,
  outcome: null
};

/* 3. Page elements. */
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const remaining = document.getElementById("remaining");
const message = document.getElementById("message");
const playAgain = document.getElementById("play-again");
const bodyParts = Array.from(
  { length: MAX_WRONG }, (_, i) => document.getElementById(`part-${i}`)
);

/* 4. Build the on-screen keyboard once. */
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

/* 5. Start a new round without immediately repeating the old word. */
function startGame() {
  const previousWord = state.word;
  let newWord;
  do {
    newWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  } while (WORD_BANK.length > 1 && newWord === previousWord);
  state.word = newWord;
  state.guessed = new Set();
  state.wrongGuesses = 0;
  state.finished = false;
  state.outcome = null;
  message.textContent = "Choose a letter to begin!";
  message.className = "game-message";
  updateDisplay();
}

/* 6. Process a single valid, not-yet-guessed letter. */
function handleGuess(input) {
  if (state.finished || typeof input !== "string") return;
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
}

/* 7. Re-render word, remaining attempts, figure, and keys. */
function updateDisplay() {
  const guessesLeft = MAX_WRONG - state.wrongGuesses;
  remaining.textContent = guessesLeft;
  remaining.classList.toggle("danger", guessesLeft <= 2);
  wordDisplay.innerHTML = "";
  for (const letter of state.word) {
    const slot = document.createElement("span");
    slot.className = "letter-slot";
    const guessed = state.guessed.has(letter);
    if (guessed || state.outcome === "lose") {
      slot.textContent = letter;
      slot.classList.add("revealed");
    } else {
      slot.textContent = "\u00A0";
    }
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

/* 8. Determine whether the round has ended. */
function checkGameOver() {
  if ([...state.word].every(letter => state.guessed.has(letter))) {
    state.finished = true;
    state.outcome = "win";
    message.className = "game-message win";
    message.textContent = "🎉 You won! Amazing job!";
  } else if (state.wrongGuesses >= MAX_WRONG) {
    state.finished = true;
    state.outcome = "lose";
    message.className = "game-message lose";
    message.textContent = `Game over! The word was ${state.word}.`;
  }
}

/* 9. Physical keyboard and restart controls. */
document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (/^[a-zA-Z]$/.test(event.key)) handleGuess(event.key);
});
playAgain.addEventListener("click", startGame);
buildKeyboard();
startGame();
