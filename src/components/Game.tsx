import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';

const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });

  // Handle player movement
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const speed = 5;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case '8':
        setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - speed) }));
        break;
      case 'ArrowDown':
      case 's':
      case '2':
        setPlayerPosition(prev => ({ ...prev, y: Math.min(95, prev.y + speed) }));
        break;
      case 'ArrowLeft':
      case 'a':
      case '4':
        setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - speed) }));
        break;
      case 'ArrowRight':
      case 'd':
      case '6':
        setPlayerPosition(prev => ({ ...prev, x: Math.min(95, prev.x + speed) }));
        break;
    }
  }, []);

  // Set up event listener for keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900"><h1>yoyoyo</h1>
      {/* Background grid */}
      <div
        className="absolute w-full h-full top-0 left-0"
        style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      {/* Player */}
      <Player x={playerPosition.x} y={playerPosition.y} />
      
      {/* Debug information */}
      <div className="absolute top-4 left-4 text-red-500 text-xl">
        Player Position: x={playerPosition.x.toFixed(2)}, y={playerPosition.y.toFixed(2)}
      </div>
    </div>
  );
};

export default Game;