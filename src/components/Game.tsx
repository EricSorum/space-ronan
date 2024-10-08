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
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
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
      case ' ':
        setBullets(prev => [...prev, { id: Date.now(), x: playerPosition.x, y: playerPosition.y }]);
        break;
    }
  }, [playerPosition, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;
    const spawnInterval = setInterval(() => {
      const newEnemy: EnemyType = {
        id: Date.now(),
        x: Math.random() * 100,
        y: -10,
      };
      setEnemies(prev => [...prev, newEnemy]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
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
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    if (gameOver) return;

    // Check for bullet-enemy collisions
    bullets.forEach(bullet => {
      enemies.forEach(enemy => {
        if (Math.abs(bullet.x - enemy.x) < 5 && Math.abs(bullet.y - enemy.y) < 5) {
          setEnemies(prev => prev.filter(e => e.id !== enemy.id));
          setBullets(prev => prev.filter(b => b.id !== bullet.id));
          setScore(prev => prev + 10);
        }
      });
    });

    // Check for player-enemy collisions
    enemies.forEach(enemy => {
      if (Math.abs(playerPosition.x - enemy.x) < 5 && Math.abs(playerPosition.y - enemy.y) < 5) {
        setGameOver(true);
      }
    });
  }, [bullets, enemies, playerPosition, gameOver]);

  const restartGame = () => {
    setPlayerPosition({ x: 50, y: 75 });
    setEnemies([]);
    setBullets([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div
        className="absolute w-full h-[400%] top-0 left-0 animate-scroll"
        style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <Player x={playerPosition.x} y={playerPosition.y} />
      
      {enemies.map(enemy => (
        <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
      ))}

      {bullets.map(bullet => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
      ))}
      
      <div className="absolute top-4 left-4 text-white text-xl">
        Score: {score}
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center">
            <h2 className="text-4xl mb-4">Game Over</h2>
            <p className="text-2xl mb-4">Your Score: {score}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;