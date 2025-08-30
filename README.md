# Shiritori Game

> **A modern, multiplayer implementation of the classic Japanese word game Shiritori built with Next.js**

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4)

---

## Table of Contents

- [Game Overview](#-game-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [How to Play](#-how-to-play)
- [Technical Details](#️-technical-details)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)

---

## Game Overview

Shiritori is a classic Japanese word game where players take turns creating words that start with the last letter of the previous word. This implementation features:

- **Countdown scoring system**: Start with 100 points, lose points based on time taken
- **Real-time word validation**: Using DictionaryAPI.dev
- **Multiplayer gameplay**: Two players on the same screen
- **Smart retry system**: Keep trying invalid words within your turn time

---

##  Features

###  Core Gameplay
-  **Turn-based gameplay** - Automatic player switching
-  **3-second countdown** - Game starts with animated countdown
-  **15-second timer** - Each turn has a 15-second limit
-  **Retry system** - Invalid words don't end your turn
-  **Pass tracking** - Timeouts add "PASS" to word history
-  **Auto-focus** - Input fields focus automatically on turn switch

###  Word Validation
-  **Dictionary API** - Real-time word validation
-  **Structure validation** - 4+ letters, correct starting letter
-  **No repetition** - Words cannot be used twice
-  **Random starting letter** - Each game starts with A-Z

###  User Interface
-  **Two-column layout** - Separate areas for each player
-  **Visual timer** - Color-coded countdown (Green→Yellow→Red)
-  **Word history** - Personal word lists with PASS tracking
-  **Dark mode support** - Automatic theme detection
-  **Responsive design** - Works on desktop and mobile

###  Scoring System
-  **Countdown points** - Start with 100, lose time used per turn
-  **Win condition** - First to reach 0 points loses
-  **Real-time updates** - Points update instantly

---

##  Quick Start

### Prerequisites
- **Node.js 18+** installed on your system
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fms-byte/shiritori-game
   cd shiritori-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build
```bash
npm run build
npm start
```

---

##  How to Play

### Game Setup
1. **Page loads** → 3-second countdown appears automatically
2. **Edit player names** → Click on "Player 1" or "Player 2" to customize
3. **Starting letter** → Random letter (A-Z) is generated for the first word

###  Gameplay Flow
1. **Countdown ends** → Player 1's input field auto-focuses
2. **Enter first word** → Must start with the displayed letter (min 4 letters)
3. **Timer starts** → 15-second countdown begins immediately
4. **Take turns** → Players alternate, each word starts with last letter of previous word
5. **Win condition** → First player to reach 0 points loses

### Word Rules
-  **Minimum length**: 4 letters
-  **Starting letter**: Must start with correct letter
-  **Dictionary check**: Must be a valid English word
-  **No repetition**: Cannot reuse words
-  **Retry allowed**: Invalid words don't end your turn

### Timing & Scoring
- **Starting points**: 100 points each
- **Turn duration**: 15 seconds maximum
- **Point deduction**: Time used (in seconds) subtracted from total
- **Timeout penalty**: Full 15 points lost + "PASS" added to history
- **Retry system**: Keep trying different words within your 15 seconds

### Controls
- **Enter key**: Submit your word
- **Skip countdown**: Click button during initial countdown
- **Name editing**: Click on player names before game starts
- **New game**: Click "Play Again" after game ends

---

## Technical Details

### Architecture
```
app/
├── components/
│   ├── ShiritoriGame.tsx      # Main game component
│   ├── PlayerCard.tsx         # Individual player interface
│   └── CountDownModal.tsx     # Initial countdown overlay
├── hooks/
│   └── useShiritoriGame.ts    # Game state management
├── types/
│   └── game.ts                # TypeScript interfaces
├── globals.css                # Global styles
├── layout.tsx                 # Root layout
└── page.tsx                   # Home page
```

###  Technologies Used
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **API Integration**: DictionaryAPI.dev
- **Build Tool**: Turbopack

###  API Integration
- **Endpoint**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Purpose**: Real-time word validation
- **Fallback**: Graceful error handling if API unavailable
- **Response**: Simplified interface with essential word data

###  Styling Features
- **Responsive design**: Mobile-first approach
- **Dark mode**: Automatic system preference detection
- **Color coding**: Blue (Player 1), Green (Player 2), Red (PASS entries)
- **Animations**: Smooth transitions, countdown pulse effects
- **Accessibility**: Proper contrast ratios, keyboard navigation

###  Performance Optimizations
- **useCallback**: Prevents unnecessary re-renders
- **Efficient timers**: Clean up intervals on component unmount
- **Minimal re-renders**: Optimized state updates
- **Fast refresh**: Development-friendly hot reloading

---