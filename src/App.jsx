import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, ChevronRight } from 'lucide-react';

const BeginnerTypingTool = () => {
  const [mode, setMode] = useState('finger-guide');
  const [category, setCategory] = useState('words');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, wpm: 0, accuracy: 0 });
  const [startTime, setStartTime] = useState(null);
  const [testActive, setTestActive] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');

  const inputRef = useRef(null);

  // Practice texts for different categories
  const WORD_LIST = [
    "Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett",
    "Kilo", "lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango",
    "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu", "Crash", "Immediate", "Most Immediate",
    "react", "component", "hook", "state", "effect", "neon", "cyber", "punk", "logic", "render",
    "browser", "client", "server", "interface", "abstract", "design", "system", "grid", "flex",
    "water", "bubble", "drop", "keyboard", "mouse", "screen", "code", "syntax", "error", "debug",
    "future", "light", "dark", "mode", "switch", "toggle", "input", "output", "stream", "data",
    "algorithm", "binary", "pixel", "vector", "matrix", "terminal", "script", "compile"
  ];

  const practiceTexts = {
    letters: "the quick brown fox jumps over the lazy dog",
    numbers: "1234567890 1357924680 9876543210 0123456789",
    specialChar: "!@#$%^&*()-_=+[]{}|;:',.<>?/`~",
    email: "user@example.com john.doe@company.org test_123@email.co.uk",
    password: "Pass@123 MyP@ss2024 Secure#Pwd$2024",
    mixed: "Hello123! @user2024 Test#Pass my-email_123@test.com",
    words: WORD_LIST.join(" ")
  };

  const categoryInfo = {
    letters: { label: '📝 Letters (A-Z)', emoji: '📝', desc: 'सभी अक्षर सीखें' },
    numbers: { label: '🔢 Numbers (0-9)', emoji: '🔢', desc: 'सभी नंबर सीखें' },
    specialChar: { label: '⚡ Special Chars', emoji: '⚡', desc: '!@#$%^&* आदि' },
    email: { label: '✉️ Email Format', emoji: '✉️', desc: 'Email address टाइपिंग' },
    password: { label: '🔐 Password Format', emoji: '🔐', desc: 'Strong password बनाएं' },
    mixed: { label: '🎯 Mixed Practice', emoji: '🎯', desc: 'सब कुछ एक साथ' },
    words: { label: '📚 Words Practice', emoji: '📚', desc: 'Morse + Custom words' }
  };

  const practiceText = practiceTexts[category];
  const currentChar = practiceText[currentCharIndex];
  const nextChars = practiceText.slice(currentCharIndex, currentCharIndex + 5);

  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
    ['Shift+1=!', 'Shift+2=@', 'Shift+3=#', 'Shift+4=$', 'Shift+5=%', 'Shift+6=^', 'Shift+7=&', 'Shift+8=*', 'Shift+9=(', 'Shift+0=)']
  ];

  const fingerMap = {
    'A': 'बाएं तर्जनी', 'S': 'बाएं मध्यमा', 'D': 'बाएं अनामिका', 'F': 'बाएं छोटी',
    'Z': 'बाएं तर्जनी', 'X': 'बाएं मध्यमा', 'C': 'बाएं अनामिका', 'V': 'बाएं छोटी',
    'Q': 'बाएं तर्जनी', 'W': 'बाएं मध्यमा', 'E': 'बाएं अनामिका', 'R': 'बाएं छोटी',
    '1': 'बाएं तर्जनी', '2': 'बाएं मध्यमा', '3': 'बाएं अनामिका', '4': 'बाएं छोटी',
    
    'J': 'दाएं तर्जनी', 'K': 'दाएं मध्यमा', 'L': 'दाएं अनामिका', ';': 'दाएं छोटी',
    'M': 'दाएं तर्जनी', ',': 'दाएं मध्यमा', '.': 'दाएं अनामिका', '/': 'दाएं छोटी',
    'P': 'दाएं तर्जनी', 'O': 'दाएं मध्यमा', 'I': 'दाएं अनामिका', 'U': 'दाएं छोटी',
    '0': 'दाएं तर्जनी', '9': 'दाएं मध्यमा', '8': 'दाएं अनामिका', '7': 'दाएं छोटी',
    '-': 'दाएं छोटी', '=': 'दाएं छोटी',
    '[': 'दाएं छोटी', ']': 'दाएं छोटी',
    "'": 'दाएं छोटी',
    '!': 'Shift + 1', '@': 'Shift + 2', '#': 'Shift + 3', '$': 'Shift + 4',
    '%': 'Shift + 5', '^': 'Shift + 6', '&': 'Shift + 7', '*': 'Shift + 8',
    '(': 'Shift + 9', ')': 'Shift + 0'
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    const shiftKey = e.shiftKey;
    const spaceKey = e.code === 'Space';
    
    if (spaceKey) {
      e.preventDefault();
      if (currentChar === ' ') {
        handleCorrectKey(' ');
      } else {
        handleIncorrectKey(' ');
      }
      return;
    }

    if (!testActive && mode === 'practice') {
      setStartTime(new Date());
      setTestActive(true);
    }

    const displayKey = key.toUpperCase();
    setSelectedKey(displayKey);
    setTimeout(() => setSelectedKey(''), 300);

    // Check if the key matches
    const keyMatch = key === currentChar || key.toUpperCase() === currentChar.toUpperCase();
    
    if (keyMatch) {
      handleCorrectKey(key);
    } else {
      handleIncorrectKey(key);
    }
  };

  const handleCorrectKey = (key) => {
    setStats(prev => ({
      ...prev,
      correct: prev.correct + 1
    }));
    
    if (currentCharIndex < practiceText.length - 1) {
      setCurrentCharIndex(currentCharIndex + 1);
    } else {
      completeTest();
    }
  };

  const handleIncorrectKey = (key) => {
    setStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
  };

  const completeTest = () => {
    const endTime = new Date();
    const timeInMinutes = (endTime - startTime) / 60000;
    const totalWords = practiceText.split(' ').length;
    const wpm = Math.round(totalWords / timeInMinutes);
    const accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) || 0;
    
    setStats(prev => ({
      ...prev,
      wpm: wpm,
      accuracy: accuracy
    }));
    setTestActive(false);
  };

  const resetTest = () => {
    setCurrentCharIndex(0);
    setStats({ correct: 0, incorrect: 0, wpm: 0, accuracy: 0 });
    setStartTime(null);
    setTestActive(false);
    setSelectedKey('');
    inputRef.current?.focus();
  };

  const changeCategory = (newCategory) => {
    setCategory(newCategory);
    resetTest();
  };

  const getFingerColor = (key) => {
    const finger = fingerMap[key];
    if (finger?.includes('बाएं')) return 'bg-blue-300';
    if (finger?.includes('दाएं')) return 'bg-red-300';
    if (finger?.includes('Shift')) return 'bg-purple-300';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-900 mb-2">⌨️ सभी Keys सीखें</h1>
          <p className="text-gray-600 text-lg">Letters, Numbers, Special Characters - सब कुछ एक जगह</p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {[
            { id: 'finger-guide', label: '👆 उंगली गाइड' },
            { id: 'practice', label: '✍️ प्रैक्टिस' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                resetTest();
              }}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition ${
                mode === m.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => changeCategory(key)}
                disabled={testActive}
                className={`p-3 rounded-lg transition font-semibold text-sm ${
                  category === key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 hover:bg-indigo-50'
                } ${testActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="block text-lg mb-1">{info.emoji}</span>
                <span className="text-xs line-clamp-2">{info.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
          {mode === 'finger-guide' ? (
            // Finger Guide Mode
            <div>
              <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">👆 कौन सी उंगली दबाएं?</h2>
              <p className="text-center text-gray-600 mb-6 text-lg font-semibold">{categoryInfo[category].label}</p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
                <div className="text-center mb-4">
                  <p className="text-gray-600 mb-2">यह अक्षर दबाएं:</p>
                  <div className="text-8xl font-bold text-indigo-600 mb-4 font-mono">
                    {practiceText[Math.floor(Math.random() * practiceText.length)] === ' ' ? '␣' : practiceText[Math.floor(Math.random() * practiceText.length)]}
                  </div>
                  <p className="text-xl text-gray-700">अपनी कीबोर्ड पर दबाएं और देखें कौन सी उंगली है</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {keyboardRows.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2 justify-center flex-wrap">
                    {row.map(key => (
                      <div key={key} className="text-center">
                        <div className={`
                          px-3 py-2 flex items-center justify-center rounded-lg font-bold text-sm min-w-[50px]
                          transition-all duration-200 cursor-pointer
                          ${selectedKey === key.split('=')[0] ? 'ring-4 ring-yellow-400 scale-110' : ''}
                          ${getFingerColor(key)}
                        `}>
                          {key.includes('=') ? key.split('=')[1] : key}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 max-w-[60px]">
                          {fingerMap[key.includes('=') ? key.split('=')[1] : key] || 'अन्य'}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-indigo-900 font-semibold mb-2">🎯 हर category के लिए सीखें!</p>
                <p className="text-gray-600 text-sm">उपर category चुनें और कीबोर्ड पर अलग-अलग keys दबाएं</p>
              </div>
            </div>
          ) : (
            // Practice Mode
            <div>
              <h2 className="text-3xl font-bold text-indigo-900 mb-2 text-center">{categoryInfo[category].label}</h2>
              <p className="text-center text-gray-600 mb-6">{categoryInfo[category].desc}</p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl mb-6">
                <p className="text-center text-gray-600 mb-3">अगला character दबाएं:</p>
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {nextChars.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`
                        w-16 h-20 flex items-center justify-center rounded-lg font-bold text-2xl
                        transition-all duration-200 font-mono
                        ${idx === 0 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 scale-110' 
                          : 'bg-white text-gray-400'
                        }
                      `}
                    >
                      {char === ' ' ? '␣' : char}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <p className="text-green-600 font-bold text-2xl">{stats.correct}</p>
                    <p className="text-gray-600 text-sm">✅ सही</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <p className="text-red-600 font-bold text-2xl">{stats.incorrect}</p>
                    <p className="text-gray-600 text-sm">❌ गलत</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <p className="text-blue-600 font-bold text-2xl">{Math.round((currentCharIndex / practiceText.length) * 100)}%</p>
                    <p className="text-gray-600 text-sm">📊 प्रगति</p>
                  </div>
                </div>
              </div>

              {/* Full Text */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 max-h-40 overflow-y-auto">
                <p className="text-center text-gray-700 text-lg font-mono leading-relaxed break-all">
                  {practiceText.split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={`
                        transition-all duration-200
                        ${idx < currentCharIndex 
                          ? 'text-green-600 bg-green-100' 
                          : idx === currentCharIndex 
                          ? 'text-indigo-600 bg-indigo-200 text-2xl font-bold'
                          : 'text-gray-400'
                        }
                      `}
                    >
                      {char === ' ' ? '␣' : char}
                    </span>
                  ))}
                </p>
              </div>

              {/* Completion Message */}
              {currentCharIndex === practiceText.length && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center mb-6">
                  <p className="text-2xl font-bold text-green-700 mb-4">🎉 बधाई हो!</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">WPM</p>
                      <p className="text-3xl font-bold text-indigo-600">{stats.wpm}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">शुद्धता</p>
                      <p className="text-3xl font-bold text-indigo-600">{stats.accuracy}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden Input */}
              <input
                ref={inputRef}
                type="text"
                onKeyDown={handleKeyPress}
                autoFocus
                className="opacity-0 absolute"
              />

              {/* Reset Button */}
              <button
                onClick={resetTest}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> फिर से शुरू करें
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <h3 className="font-bold text-lg text-yellow-900 mb-3">💡 शुरुआती के लिए सुझाव:</h3>
          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            <li>✅ एक category से शुरू करें - पहले Letters, फिर Numbers</li>
            <li>✅ फिर Special Characters सीखें</li>
            <li>✅ Mixed Practice से सब कुछ एक साथ सीखें</li>
            <li>✅ धीरे-धीरे टाइप करें, गति बाद में आएगी</li>
            <li>✅ हर दिन 20-30 मिनट प्रैक्टिस करें</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BeginnerTypingTool;
