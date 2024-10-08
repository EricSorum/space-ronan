import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import Bullet from './Bullet';

interface EnemyType {
  id: number;
  x: number;
  y: number;
}

interface BulletType {
  id: number;
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [bullets, setBullets] = useState<BulletType[]>([]);

  // Handle player movement and shooting
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
      case ' ': // Spacebar for shooting
        setBullets(prev => [...prev, { id: Date.now(), x: playerPosition.x, y: playerPosition.y }]);
        break;
    }
  }, [playerPosition]);

  // Set up event listener for keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll the background
  // useEffect(() => {
  //   const scrollInterval = setInterval(() => {
  //     setScrollPosition(prev => (prev + 1) % 200);
  //   }, 50);

  //   return () => clearInterval(scrollInterval);
  // }, []);

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

  // Move enemies and bullets
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + 1,
      })).filter(enemy => enemy.y < 110));

      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        y: bullet.y - 2,
      })).filter(bullet => bullet.y > -10));
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* Background grid */}
      <div
        className="absolute w-full h-[400%] top-0 left-0 animate-scroll"
        style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      {/* Player */}
      <Player x={playerPosition.x} y={playerPosition.y} />
      
      {/* Enemies */}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
      ))}

      {/* Bullets */}
      {bullets.map(bullet => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
      ))}
      
      {/* Debug information */}
      <div className="absolute top-4 left-4 text-white text-xl">
        Player Position: x={playerPosition.x.toFixed(2)}, y={playerPosition.y.toFixed(2)}
        <br />
        Bullets: {bullets.length}
        <br />
        Enemies: {enemies.length}
      </div>
    </div>
  );
};

export default Game;