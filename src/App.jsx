import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, RotateCcw, Trophy, Waves, Keyboard, Delete, Hand, Maximize2, Minimize2, Download, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas'; // <-- NEW DEPENDENCY IMPORTED HERE

// --- Data & Generators ---

const WORD_LIST = [
  "react", "component", "hook", "state", "effect", "neon", "cyber", "punk", "logic", "render",
  "browser", "client", "server", "interface", "abstract", "design", "system", "grid", "flex",
  "water", "bubble", "drop", "keyboard", "mouse", "screen", "code", "syntax", "error", "debug",
  "future", "light", "dark", "mode", "switch", "toggle", "input", "output", "stream", "data",
  "algorithm", "binary", "pixel", "vector", "matrix", "terminal", "script", "compile"
];

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog",
  "React is awesome",
  "Keep coding everyday",
  "Neon lights shine",
  "Waves differ in size",
  "Practice makes perfect",
  "Hello world again",
  "Clean code matters",
  "Do not give up",
  "Frontend is fun"
];

const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// --- Finger Mapping ---
const FINGER_MAP = {
  // Left Hand (Shortened for brevity)
  '1': 'L-Pinky', 'q': 'L-Pinky', 'a': 'L-Pinky', 'z': 'L-Pinky',
  '2': 'L-Ring', 'w': 'L-Ring', 's': 'L-Ring', 'x': 'L-Ring',
  '3': 'L-Middle', 'e': 'L-Middle', 'd': 'L-Middle', 'c': 'L-Middle',
  '4': 'L-Index', 'r': 'L-Index', 'f': 'L-Index', 'v': 'L-Index',
  '5': 'L-Index', 't': 'L-Index', 'g': 'L-Index', 'b': 'L-Index',
  
  // Right Hand (Shortened for brevity)
  '6': 'R-Index', 'y': 'R-Index', 'h': 'R-Index', 'n': 'R-Index',
  '7': 'R-Index', 'u': 'R-Index', 'j': 'R-Index', 'm': 'R-Index',
  '8': 'R-Middle', 'i': 'R-Middle', 'k': 'R-Middle', ',': 'R-Middle', '<': 'R-Middle',
  '9': 'R-Ring', 'o': 'R-Ring', 'l': 'R-Ring', '.': 'R-Ring', '>': 'R-Ring',
  '0': 'R-Pinky', 'p': 'R-Pinky', ';': 'R-Pinky', ':': 'R-Pinky', '/': 'R-Pinky', '?': 'R-Pinky',
  '-': 'R-Pinky', '_': 'R-Pinky', '=': 'R-Pinky', '+': 'R-Pinky', '[': 'R-Pinky', '{': 'R-Pinky', ']': 'R-Pinky', '}': 'R-Pinky', "'": 'R-Pinky', '"': 'R-Pinky',
  
  // Thumb
  ' ': 'Thumb'
};

const generateContent = (mode) => {
  if (mode === 'words') {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  } else if (mode === 'sentences') {
    return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  } else if (mode === 'numbers') {
    return Math.floor(Math.random() * 10000).toString();
  } 
  // --- START: NEW ALPHANUMERIC MODE ---
  else if (mode === 'alphanumeric') {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    // Sirf ek random character generate karein
    return chars.charAt(Math.floor(Math.random() * chars.length)); 
  }
  // --- END: NEW ALPHANUMERIC MODE ---
  else if (mode === 'mixed') {
    let result = '';
    const length = 5 + Math.floor(Math.random() * 5);
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const all = alpha + nums + SPECIAL_CHARS;
    
    result += alpha[Math.floor(Math.random() * alpha.length)];
    result += nums[Math.floor(Math.random() * nums.length)];
    result += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
    
    for (let i = 3; i < length; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }
    return result.split('').sort(() => 0.5 - Math.random()).join('');
  }
  return "error";
};

// --- Hand Component (omitted for brevity) ---
const HandGuide = ({ nextChar }) => {
  const finger = nextChar ? FINGER_MAP[nextChar.toLowerCase()] : null;

  const getFingerColor = (targetFinger, currentFinger) => {
    if (targetFinger === currentFinger) return "bg-cyan-400 shadow-[0_0_15px_#22d3ee] scale-110";
    return "bg-gray-700 border border-gray-600";
  };

  return (
    <div className="flex items-center justify-center gap-4 md:gap-12 mt-4 select-none opacity-90">
      
      {/* Left Hand - Hidden on small screens */}
      <div className="hidden sm:flex relative w-32 md:w-40 h-32 bg-gray-800/30 rounded-xl border border-gray-700 p-2 flex-col items-center">
        <span className="text-[10px] text-gray-500 uppercase mb-2">Left Hand</span>
        <div className="flex items-end justify-center gap-2 h-20">
           {/* Pinky */}
           <div className={`w-3 h-12 rounded-full transition-all duration-200 ${getFingerColor('L-Pinky', finger)}`} title="Pinky (Q, A, Z, 1)"></div>
           {/* Ring */}
           <div className={`w-3 h-16 rounded-full transition-all duration-200 ${getFingerColor('L-Ring', finger)}`} title="Ring (W, S, X, 2)"></div>
           {/* Middle */}
           <div className={`w-3 h-20 rounded-full transition-all duration-200 ${getFingerColor('L-Middle', finger)}`} title="Middle (E, D, C, 3)"></div>
           {/* Index */}
           <div className={`w-3 h-16 rounded-full transition-all duration-200 ${getFingerColor('L-Index', finger)}`} title="Index (R, F, V, T, G, B, 4, 5)"></div>
           {/* Thumb */}
           <div className={`w-4 h-8 rounded-full mb-[-5px] rotate-45 translate-x-2 transition-all duration-200 ${getFingerColor('Thumb', finger)}`}></div>
        </div>
      </div>

      {/* Key Indicator */}
      <div className="flex flex-col items-center justify-center w-20">
        <div className="w-16 h-16 rounded-xl bg-gray-900 border-2 border-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          {nextChar === ' ' ? '␣' : (nextChar || '?')}
        </div>
        <span className="text-[10px] text-cyan-400 mt-2 uppercase tracking-widest">Target</span>
      </div>

      {/* Right Hand - Hidden on small screens */}
      <div className="hidden sm:flex relative w-32 md:w-40 h-32 bg-gray-800/30 rounded-xl border border-gray-700 p-2 flex-col items-center">
        <span className="text-[10px] text-gray-500 uppercase mb-2">Right Hand</span>
        <div className="flex items-end justify-center gap-2 h-20">
           {/* Thumb */}
           <div className={`w-4 h-8 rounded-full mb-[-5px] -rotate-45 -translate-x-2 transition-all duration-200 ${getFingerColor('Thumb', finger)}`}></div>
           {/* Index */}
           <div className={`w-3 h-16 rounded-full transition-all duration-200 ${getFingerColor('R-Index', finger)}`} title="Index (Y, U, H, J, N, M, 6, 7)"></div>
           {/* Middle */}
           <div className={`w-3 h-20 rounded-full transition-all duration-200 ${getFingerColor('R-Middle', finger)}`} title="Middle (I, K, ,, 8)"></div>
           {/* Ring */}
           <div className={`w-3 h-16 rounded-full transition-all duration-200 ${getFingerColor('R-Ring', finger)}`} title="Ring (O, L, ., 9)"></div>
           {/* Pinky */}
           <div className={`w-3 h-12 rounded-full transition-all duration-200 ${getFingerColor('R-Pinky', finger)}`} title="Pinky (P, ;, /, 0, -, =)"></div>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---

export default function NeonWaveTyper() {
  // Constants for localStorage keys
  const HIGH_SCORE_KEY = 'neonWaveHighScore';
  const HIGH_WPM_KEY = 'neonWaveHighWPM';

  // Game State
  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState('words');
  const [speedMode, setSpeedMode] = useState('normal');
  const [showHands, setShowHands] = useState(true); 
  const [isPaused, setIsPaused] = useState(false); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [level, setLevel] = useState(1); // <-- LEVEL STATE ADDED HERE
  
  const [drops, setDrops] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [wpm, setWpm] = useState(0);
  
  // High Score State
  const [highScore, setHighScore] = useState(0);
  const [highWPM, setHighWPM] = useState(0);
  
  // Input State
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [nextChar, setNextChar] = useState(null);
  const inputRef = useRef(null);

  // Refs
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const spawnTimerRef = useRef(0);
  const startTimeRef = useRef(0);
  const totalCharsTypedRef = useRef(0);
  const gameContainerRef = useRef(null); 
  const certificateRef = useRef(null); // <-- REF FOR CERTIFICATE

  // Constants
  const GAME_HEIGHT = 450; 

  // --- Fullscreen API Listener (omitted for brevity) ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Load High Scores from localStorage on mount (omitted for brevity)
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
      const savedWPM = localStorage.getItem(HIGH_WPM_KEY);

      if (savedScore) {
        setHighScore(parseInt(savedScore, 10));
      }
      if (savedWPM) {
        setHighWPM(parseInt(savedWPM, 10));
      }
    } catch (error) {
      console.error("Could not load high scores from localStorage:", error);
    }
  }, []); 

  // Function to check and save new high scores (omitted for brevity)
  const checkAndSaveHighScore = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      } catch (error) {
        console.error("Could not save high score to localStorage:", error);
      }
    }
    
    if (wpm > highWPM) {
      setHighWPM(wpm);
      try {
        localStorage.setItem(HIGH_WPM_KEY, wpm.toString());
      } catch (error) {
        console.error("Could not save high WPM to localStorage:", error);
      }
    }
  }, [score, wpm, highScore, highWPM]);


  // --- Logic: Dynamic Level Scaling ---
  useEffect(() => {
    // Score thresholds for level up
    let newLevel = 1;
    if (score >= 1000) newLevel = 2;
    if (score >= 3000) newLevel = 3;
    
    // Custom logic for levels 4 and above (every 3000 points)
    if (score >= 6000) {
      newLevel = 3 + Math.floor((score - 6000) / 3000);
    }
    
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [score, level]);


  // --- Logic: Determine Next Character (omitted for brevity) ---
  useEffect(() => {
    if (gameState !== 'playing') {
      setNextChar(null);
      return;
    }

    if (inputValue.length > 0 && !inputError) {
      const matchingDrop = drops.find(d => d.text.startsWith(inputValue));
      if (matchingDrop) {
        const char = matchingDrop.text[inputValue.length];
        setNextChar(char);
        return;
      }
    }
    if (inputValue.length === 0 && drops.length > 0) {
       const sortedDrops = [...drops].sort((a, b) => b.y - a.y); 
       if (sortedDrops.length > 0) {
         setNextChar(sortedDrops[0].text[0]);
         return;
       }
    }
    setNextChar(null);
  }, [inputValue, drops, gameState, inputError]);


  // --- Physics & Timing ---

  const getSpawnRate = () => {
    let baseRate = 1600; 
    if (mode === 'sentences') baseRate = 3000; 
    if (mode === 'mixed') baseRate = 2000;
    // --- START: NEW ALPHANUMERIC SETTING ---
    if (mode === 'alphanumeric') baseRate = 800; // Single character, fast spawn
    // --- END: NEW ALPHANUMERIC SETTING ---
    
    // --- SCALING LOGIC ---
    let rateFactor = 1;
    if (level === 2) rateFactor = 0.90; // 10% faster spawn
    if (level === 3) rateFactor = 0.80; // 20% faster spawn
    if (level >= 4) {
      // 5% faster spawn per level after 3
      rateFactor = 0.80 - ((level - 3) * 0.05); 
    }
    // ---------------------
    
    if (speedMode === 'zen') return (baseRate * 1.6) * rateFactor;
    if (speedMode === 'hyper') return (baseRate * 0.6) * rateFactor;
    return baseRate * rateFactor;
  };

  const getFallSpeed = () => {
    let baseSpeed = 0.7; 
    if (mode === 'sentences') baseSpeed = 0.4; 
    // --- START: NEW ALPHANUMERIC SETTING ---
    if (mode === 'alphanumeric') baseSpeed = 1.0; // Single character, fast fall
    // --- END: NEW ALPHANUMERIC SETTING ---
    
    // --- SCALING LOGIC ---
    let speedFactor = 1;
    if (level === 2) speedFactor = 1.10; // 10% faster drop
    if (level === 3) speedFactor = 1.20; // 20% faster drop
    if (level >= 4) {
      // 5% faster drop per level after 3
      speedFactor = 1.20 + ((level - 3) * 0.05);
    }
    // ---------------------

    if (speedMode === 'zen') return (baseSpeed * 0.6) * speedFactor;
    if (speedMode === 'hyper') return (baseSpeed * 1.6) * speedFactor;
    return baseSpeed * speedFactor;
  };

  const spawnDrop = useCallback(() => {
    const id = Date.now() + Math.random();
    const text = generateContent(mode);
    const isSentence = mode === 'sentences';
    
    const minX = isSentence ? 20 : 10;
    const maxX = isSentence ? 80 : 90;
    const initialX = minX + Math.random() * (maxX - minX);
    
    setDrops(prev => [...prev, {
      id,
      text,
      initialX,
      x: initialX,
      y: -60,
      speed: getFallSpeed() + (Math.random() * 0.2),
      waveOffset: Math.random() * Math.PI * 2,
      waveAmp: isSentence ? 5 : 15 + Math.random() * 10,
      waveFreq: isSentence ? 0.01 : 0.02 + Math.random() * 0.01,
    }]);
  }, [mode, speedMode, level]); // <-- Added level dependency here

  const updateGame = useCallback((time) => {
    if (gameState !== 'playing' || isPaused) {
      previousTimeRef.current = time; 
      return;
    }
    // ... (rest of updateGame function omitted for brevity)
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      spawnTimerRef.current += deltaTime;
      if (spawnTimerRef.current > getSpawnRate()) {
        spawnDrop();
        spawnTimerRef.current = 0;
      }

      setDrops(prevDrops => {
        const newDrops = [];
        let lifeLost = false;

        prevDrops.forEach(drop => {
          const newY = drop.y + (drop.speed * (deltaTime / 16));
          const newX = drop.initialX + Math.sin((newY * drop.waveFreq) + drop.waveOffset) * drop.waveAmp;

          if (newY > GAME_HEIGHT - 30) {
            lifeLost = true;
          } else {
            newDrops.push({ ...drop, y: newY, x: newX });
          }
        });

        if (lifeLost) {
           setLives(l => {
             const newLives = l - 1;
             if (newLives <= 0) {
                setGameState('gameover');
                checkAndSaveHighScore(); 
             }
             return newLives;
           });
           setInputValue('');
        }
        return newDrops;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, isPaused, spawnDrop, checkAndSaveHighScore]); 

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
      if (inputRef.current) inputRef.current.focus();
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameState, updateGame]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      const interval = setInterval(() => {
        const timeElapsedMin = (Date.now() - startTimeRef.current) / 60000;
        if (timeElapsedMin > 0) {
          setWpm(Math.round((totalCharsTypedRef.current / 5) / timeElapsedMin));
        }
      }, 1000);
      return () => clearInterval(interval);
    } 
  }, [gameState, isPaused]); 

  // --- Certificate Function ---
  const handleDownloadCertificate = () => {
    // Target the specific template element by ID
    const elementToCapture = document.getElementById('certificate-template');

    html2canvas(elementToCapture, {
        allowTaint: true,
        useCORS: true,
        scale: 2, // Use a higher scale for better quality image
        backgroundColor: '#0f172a', // Set background to match theme
    }).then(canvas => {
      // Create a link to trigger the download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `NeonWaveTyper_WPM-${wpm}_Score-${score}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // --- Control Functions (omitted for brevity) ---
  const handleInputChange = (e) => {
    if (gameState !== 'playing' || isPaused) return;
    const val = e.target.value;
    setInputValue(val);

    if (val === '') {
      setInputError(false);
      return;
    }

    const matchingDrop = drops.find(drop => drop.text.startsWith(val));

    if (matchingDrop) {
      setInputError(false);
      if (val === matchingDrop.text) {
        setScore(s => s + (matchingDrop.text.length * 10));
        totalCharsTypedRef.current += matchingDrop.text.length;
        setDrops(prev => prev.filter(d => d.id !== matchingDrop.id));
        setInputValue('');
      }
    } else {
      setInputError(true);
    }
  };

  const startGame = () => {
    setDrops([]);
    setScore(0);
    setLives(5);
    setWpm(0);
    setInputValue('');
    setInputError(false);
    setNextChar(null);
    setIsPaused(false); 
    setLevel(1); // <-- Reset Level
    totalCharsTypedRef.current = 0;
    startTimeRef.current = Date.now();
    previousTimeRef.current = undefined;
    spawnTimerRef.current = 0;
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  
  const handlePauseToggle = () => {
    if (gameState !== 'playing') return;
    setIsPaused(p => !p);
    if (inputRef.current) inputRef.current.focus(); 
  };
  
  const handleStopGame = () => {
    checkAndSaveHighScore(); 
    setGameState('menu');
    setInputValue('');
    setIsPaused(false);
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true); 
    } else {
      document.exitFullscreen();
      setIsFullscreen(false); 
    }
  };

  // --- Styles (omitted for brevity) ---
  const getModeTabClass = (tabMode) => {
    const active = mode === tabMode;
    const disabled = gameState === 'playing' && !isPaused; 
    return `px-3 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 border-b-2 
      ${active ? 'text-cyan-400 border-cyan-500 bg-cyan-900/20' : 'text-gray-500 border-transparent hover:text-gray-300'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  };

  const getSpeedTabClass = (tabSpeed) => {
    const active = speedMode === tabSpeed;
    const disabled = gameState === 'playing' && !isPaused; 
    let color = "text-gray-600 border-transparent";
    if (active) {
      if (tabSpeed === 'zen') color = "text-emerald-400 border-emerald-500 bg-emerald-900/20";
      if (tabSpeed === 'normal') color = "text-cyan-400 border-cyan-500 bg-cyan-900/20";
      if (tabSpeed === 'hyper') color = "text-red-400 border-red-500 bg-red-900/20";
    }
    return `px-3 py-1 text-[10px] font-bold uppercase border rounded transition-all ${color}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center justify-center relative overflow-hidden p-2">
      
      {/* Background Grid - Hides when fullscreen for a cleaner look */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
      )}

      {/* Fullscreen Wrapper (The container for all visible game UI) */}
      <div 
          ref={gameContainerRef}
          className={`flex flex-col items-center z-50 p-2 
            ${isFullscreen ? 'w-full h-full bg-gray-950' : 'w-full max-w-4xl'}
          `}
      >
      
        {/* --- Header --- */}
        <div className="z-10 w-full flex justify-between items-center mb-2 gap-4">
          {/* Banner: Neon Wave Typer */}
          <h1 className="text-2xl md:text-3xl font-black italic text-cyan-400 flex items-center gap-2">
            <Waves className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" /> NEON WAVE TYPER 
          </h1>
          
          {/* Score/WPM Display with High Scores */}
          <div className="flex gap-2 md:gap-4 bg-gray-900/60 p-2 rounded-xl border border-gray-800">
             <div className="text-center px-1 md:px-2">
               <div className="text-[8px] md:text-[9px] text-gray-500 uppercase">Lives</div>
               <div className="flex gap-1 mt-1">{[...Array(5)].map((_,i) => (<div key={i} className={`w-1 h-3 rounded-full ${i < lives ? 'bg-pink-500' : 'bg-gray-800'}`} />))}</div>
             </div>
             
             <div className="text-center px-1 md:px-2 border-l border-gray-700">
               <div className="text-[8px] md:text-[9px] text-gray-500 uppercase">Score</div>
               <div className="font-bold text-base md:text-lg">{score}</div>
               {highScore > 0 && highScore > score && <div className="text-[7px] md:text-[8px] text-yellow-400">H: {highScore}</div>}
             </div>
             
             <div className="text-center px-1 md:px-2 border-l border-gray-700">
               <div className="text-[8px] md:text-[9px] text-gray-500 uppercase">WPM</div>
               <div className="font-bold text-base md:text-lg text-cyan-400">{wpm}</div>
               {highWPM > 0 && highWPM > wpm && <div className="text-[7px] md:text-[8px] text-yellow-400">H: {highWPM}</div>}
             </div>
          </div>
        </div>

        {/* --- Settings Bar --- */}
        <div className="z-10 w-full flex flex-wrap gap-2 md:gap-3 mb-3 items-center justify-between bg-gray-900/50 p-2 rounded-lg border border-gray-800">
          
          {/* Mode Tabs */}
          <div className="flex gap-1">
            {['alphanumeric', 'words', 'sentences', 'numbers', 'mixed'].map(m => (
              <button key={m} onClick={() => setMode(m)} disabled={gameState === 'playing' && !isPaused} className={getModeTabClass(m)}>{m}</button>
            ))}
          </div>

          {/* Level Display (NEW) */}
          {gameState === 'playing' && (
             <div className="flex items-center gap-1 bg-gray-950/50 px-3 py-1 rounded border border-yellow-500/50 text-yellow-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" /> LEVEL {level}
             </div>
          )}

          <div className="flex items-center gap-2">
             {/* Speed Tabs */}
             <div className="flex gap-1">
               {['zen', 'normal', 'hyper'].map(s => (
                 <button key={s} onClick={() => setSpeedMode(s)} disabled={gameState === 'playing' && !isPaused} className={getSpeedTabClass(s)}>{s}</button>
               ))}
             </div>
             
             {/* Hand Toggle & Pause/Stop/Maximize Buttons (omitted for brevity) */}
             <button 
               onClick={() => setShowHands(!showHands)} 
               className={`p-1 md:p-2 rounded border transition-all flex items-center gap-2 text-xs font-bold uppercase
                 ${showHands ? 'bg-purple-900/30 text-purple-300 border-purple-500' : 'bg-gray-800 text-gray-500 border-gray-700'}
               `}
             >
               <Hand className="w-4 h-4" /> <span className="hidden md:inline">{showHands ? 'Hands On' : 'Hands Off'}</span>
             </button>
             
             {gameState === 'playing' && (
               <button
                 onClick={handlePauseToggle}
                 className={`p-1 md:p-2 rounded border transition-all flex items-center gap-2 text-xs font-bold uppercase
                   ${isPaused ? 'bg-green-600/30 text-green-300 border-green-500' : 'bg-yellow-600/30 text-yellow-300 border-yellow-500'}
                 `}
               >
                 {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                 <span className="hidden md:inline">{isPaused ? 'Resume' : 'Pause'}</span>
               </button>
             )}
             
             {gameState === 'playing' && (
               <button
                 onClick={handleStopGame}
                 className="p-1 md:p-2 rounded border transition-all flex items-center gap-2 text-xs font-bold uppercase bg-red-600/30 text-red-300 border-red-500"
               >
                 <X className="w-4 h-4" />
                 <span className="hidden md:inline">Stop</span>
               </button>
             )}
             
             <button
               onClick={handleFullscreenToggle}
               className={`p-1 md:p-2 rounded border transition-all flex items-center gap-2 text-xs font-bold uppercase
                 ${isFullscreen ? 'bg-purple-900/30 text-purple-300 border-purple-500' : 'bg-gray-800 text-gray-400 border-gray-700'}
               `}
               title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Go Fullscreen'}
             >
               {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
               <span className="hidden md:inline">{isFullscreen ? 'Exit Max' : 'Maximize'}</span>
             </button>

          </div>
        </div>

        {/* --- Game Canvas --- */}
        <div 
          className={`relative z-10 bg-gray-900/40 w-full overflow-hidden backdrop-blur-sm 
            ${isFullscreen 
              ? 'flex-grow rounded-none border-x-0 border-t-0' 
              : 'rounded-t-2xl border-x-2 border-t-2 border-cyan-500/20'
            }
          `}
          style={{ height: isFullscreen ? 'auto' : GAME_HEIGHT }} 
        >
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 z-50 backdrop-blur-md">
               <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce"><Keyboard className="w-8 h-8 text-cyan-400" /></div>
               <h2 className="text-2xl font-bold text-white mb-2">Ready?</h2>
               <button onClick={startGame} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Start</button>
            </div>
          )}

          {/* Pause Overlay (omitted for brevity) */}
          {gameState === 'playing' && isPaused && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/70 z-40 backdrop-blur-sm">
               <Pause className="w-12 h-12 text-yellow-500 mb-2" />
               <h2 className="text-3xl font-black text-white mb-4">PAUSED</h2>
               <button onClick={handlePauseToggle} className="px-6 py-2 bg-yellow-600 text-white font-bold rounded-full flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Resume</button>
            </div>
          )}

          {/* Game Over Screen + Certificate Logic (UPDATED) */}
          {gameState === 'gameover' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 z-50 backdrop-blur-lg">
                
                {/* --- Certificate Template: Target for html2canvas --- */}
                <div 
                   id="certificate-template" // <-- TARGET ID
                   className="p-8 border-4 border-cyan-500 shadow-2xl bg-gray-900/90 flex flex-col items-center"
                   style={{ width: '300px', margin: '0 auto', transform: 'scale(1)' }} 
                >
                   <Waves className="w-8 h-8 text-cyan-400 mb-2" />
                   <h3 className="text-xl font-black text-cyan-400 mb-2">NEON WAVE TYPER</h3>
                   <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
                   <h2 className="text-3xl font-black text-white mb-2">SCORE ACHIEVED</h2>
                   <div className="text-4xl font-extrabold text-yellow-400 mb-4">{score}</div>
                   <div className="text-lg font-mono text-gray-300">WPM: {wpm}</div>
                   <div className="text-sm text-gray-500 mt-4">Date: {new Date().toLocaleDateString()}</div>
                </div>
                
                <div className="flex gap-4 mt-6">
                   <button 
                     onClick={handleDownloadCertificate} 
                     className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg"
                   >
                       <Download className="w-4 h-4" /> Get Certificate
                   </button>
                   <button onClick={startGame} className="px-6 py-2 bg-white text-red-900 font-bold rounded-full flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Retry</button>
                </div>
             </div>
           )}

          {drops.map(drop => {
            const isMatched = inputValue.length > 0 && drop.text.startsWith(inputValue);
            return (
              <div key={drop.id} className={`className={`absolute px-4 py-2 rounded-full font-mono font-bold text-2xl border flex items-center justify-center whitespace-nowrap ${isMatched ? 'bg-cyan-600 text-white border-cyan-300 z-20 scale-110' : 'bg-gray-800 text-gray-300 border-gray-600 z-10'}`} style={{ left: `${drop.x}%`, top: drop.y, transform: `translate(-50%, 0)` }}>
                <span className="relative z-10">{isMatched ? <><span className="text-yellow-300">{inputValue}</span><span>{drop.text.substring(inputValue.length)}</span></> : drop.text}</span>
              </div>
            );
          })}
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-cyan-900/40 to-transparent pointer-events-none"></div>
        </div>

        {/* --- INPUT & HANDS AREA (omitted for brevity) --- */}
        <div className={`z-20 w-full bg-gray-900 p-2 md:p-4 shadow-xl 
          ${isFullscreen 
            ? 'rounded-none border-0 border-t-2 border-cyan-500/20' 
            : 'rounded-b-2xl border-x-2 border-b-2 border-cyan-500/20'
          }
        `}>
          {/* Input */}
          <div className="relative mb-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={gameState !== 'playing' || isPaused}
              placeholder={gameState === 'playing' && !isPaused ? "" : "..."}
              className={`w-full bg-gray-950 text-xl md:text-2xl font-mono text-center py-3 rounded-xl border-2 outline-none transition-all duration-200 ${inputError ? 'border-red-500 text-red-400' : 'border-cyan-700 text-cyan-400 focus:border-cyan-400'}`}
              autoComplete="off" spellCheck="false"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
              {inputError && <Delete className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          {/* Hand Guide */}
          {showHands && gameState === 'playing' && (
             <HandGuide nextChar={nextChar} />
          )}
          
          {!showHands && gameState === 'playing' && (
             <div className="text-center mt-4 text-gray-600 text-xs font-mono uppercase tracking-widest">
               Hand Guide Disabled
             </div>
          )}
        </div>

      </div> {/* END Fullscreen Wrapper */}

    </div> // END Main Outer Container
  );
}
