import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';

interface EnemyType {
  id: number;
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [enemies, setEnemies] = useState<EnemyType[]>([]);

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
  // Spawn enemies
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newEnemy: EnemyType = {
        id: Date.now(),
        x: Math.random() * 100,
        y: -10,
      };
      setEnemies(prev => [...prev, newEnemy]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, []);

  // Move enemies
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + 1,
      })).filter(enemy => enemy.y < 110));
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);
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
      {enemies.map(enemy => (
        <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
      ))}      
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