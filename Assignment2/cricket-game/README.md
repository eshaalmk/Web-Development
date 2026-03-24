# 🏏 Cricket Blast — CS-4032 Web Programming Assignment 2

A **2D Cricket Web Application** built with React, HTML5 Canvas, CSS, and JavaScript.

---

## Project Structure

```
cricket-game/
├── index.html                        ← Vite HTML entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                      ← React root mount
    ├── App.jsx                       ← Screen router (menu → game → gameover)
    │
    ├── components/
    │   ├── CricketField.jsx          ← HTML5 Canvas: full 2D field + animations
    │   ├── PowerBar.jsx              ← Probability power bar + moving slider
    │   ├── Scoreboard.jsx            ← Live runs / wickets / overs / strike-rate
    │   ├── BallHistory.jsx           ← Per-ball coloured dot history
    │   ├── MenuScreen.jsx            ← Start screen with style selector
    │   ├── GameScreen.jsx            ← Main gameplay orchestrator
    │   └── GameOverScreen.jsx        ← End-of-innings summary
    │
    ├── hooks/
    │   ├── useSlider.js              ← Bouncing slider RAF loop
    │   ├── useBowlingAnimation.js    ← Ball travel animation
    │   └── useHitAnimation.js        ← Bat swing animation
    │
    ├── utils/
    │   ├── constants.js              ← Game rules, probability tables, commentary
    │   ├── gameLogic.js              ← Outcome lookup, overs formatting, helpers
    │   └── drawField.js              ← All Canvas drawing primitives
    │
    └── styles/
        ├── global.css                ← CSS variables, reset, fonts
        ├── GameScreen.css            ← Game layout, controls, play button
        ├── PowerBar.css              ← Power bar segments + slider
        ├── Scoreboard.css            ← Score display
        ├── BallHistory.css           ← History row
        ├── MenuScreen.css            ← Start screen
        └── GameOverScreen.css        ← End screen
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or later

### Install & Run
```bash
# 1. Navigate into the project folder
cd cricket-game

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## Game Rules

| Rule             | Value     |
|------------------|-----------|
| Total Overs      | 2 (12 balls) |
| Total Wickets    | 3         |
| Batting Styles   | Aggressive / Defensive |

---

## Probability Distributions

### Aggressive (high risk / high reward)
| Outcome | Probability | Power Bar % |
|---------|-------------|-------------|
| Wicket  | 0.40        | 40%         |
| Dot (0) | 0.10        | 10%         |
| 1 Run   | 0.10        | 10%         |
| 2 Runs  | 0.10        | 10%         |
| 3 Runs  | 0.05        |  5%         |
| 4 Runs  | 0.10        | 10%         |
| 6 Runs  | 0.15        | 15%         |
| **Total** | **1.00**  | **100%**    |

### Defensive (low risk / steady runs)
| Outcome | Probability | Power Bar % |
|---------|-------------|-------------|
| Wicket  | 0.15        | 15%         |
| Dot (0) | 0.30        | 30%         |
| 1 Run   | 0.25        | 25%         |
| 2 Runs  | 0.15        | 15%         |
| 3 Runs  | 0.08        |  8%         |
| 4 Runs  | 0.05        |  5%         |
| 6 Runs  | 0.02        |  2%         |
| **Total** | **1.00**  | **100%**    |

---

## How the Power Bar Works

1. Each outcome is assigned a probability (sum = 1.00 exactly).  
2. The power bar is divided into coloured segments **proportional** to these probabilities.  
3. A white slider bounces left-to-right across the bar continuously.  
4. When the player clicks **PLAY SHOT** (or presses `SPACE`), the slider stops and the outcome is determined by **which segment the slider is in** — no randomness whatsoever.

---

## Technologies Used

- **React 18** — component architecture and state management (hooks)  
- **HTML5 Canvas** — 2D field, sprites, ball, and animations  
- **CSS** — layout, power bar, scoreboard, animations, responsive design  
- **JavaScript (ES2022)** — game logic, RAF animation loops, custom hooks  
- **Vite** — build tool and dev server  

---

## Features

- ✅ 2D Canvas cricket field with night sky, floodlights, crowd, and mowing stripes  
- ✅ Animated batsman (bat swing) and bowler (arm raise)  
- ✅ Ball bowling animation (eased travel from bowler to batsman)  
- ✅ Probability-based power bar with moving slider  
- ✅ Outcome determined strictly by slider position (no random selection)  
- ✅ Live scoreboard: runs, wickets, overs, strike rate  
- ✅ Ball-by-ball history row  
- ✅ Dynamic commentary (4–5 lines per outcome, randomly selected)  
- ✅ Aggressive vs Defensive batting style with different probability distributions  
- ✅ Game over screen with full stats (4s, 6s, dots, S/R)  
- ✅ Restart and Menu navigation  
- ✅ Keyboard shortcut: `SPACE` to play shot  
- ✅ Mobile responsive  

---

*CS-4032: Web Programming — Assignment #02*
