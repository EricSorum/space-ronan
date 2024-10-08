import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import Bullet from './Bullet';

interface EnemyType {
  id: number;
  x: number;
  y: number;
  dx: number; // horizontal speed
  dy: number; // vertical speed
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
  const [difficulty, setDifficulty] = useState(1);
  const [lastSpawnTime, setLastSpawnTime] = useState(Date.now());
  const [gameStartTime] = useState(Date.now());

  const updateDifficulty = useCallback(() => {
    const elapsedTime = (Date.now() - gameStartTime) / 1000; // time in seconds
    const newDifficulty = 1 + Math.floor(elapsedTime / 15) * 0.1; // Increase by 0.1 every 15 seconds
    setDifficulty(newDifficulty);
  }, [gameStartTime]);
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

  const spawnVFormation = useCallback(() => {
    const centerX = Math.random() * 80 + 10; // Center of the V formation
    const newEnemies: EnemyType[] = [];
    for (let i = 0; i < 5; i++) {
      newEnemies.push({
        id: Date.now() + i,
        x: centerX + (i - 2) * 5,
        y: -10 - Math.abs(i - 2) * 5,
        dx: 0,
        dy: 0.5 * difficulty,
      });
    }
    setEnemies(prev => [...prev, ...newEnemies]);
  }, [difficulty]);

  const spawnDiagonalFormation = useCallback(() => {
    const startFromRight = Math.random() < 0.5;
    const newEnemies: EnemyType[] = [];
    for (let i = 0; i < 5; i++) {
      const enemy: EnemyType = {
        id: Date.now() + i,
        x: startFromRight ? 110 + i * 2 : -10 - i * 5,
        y: -10 - i * 2,
        dx: startFromRight ? -0.5 : 0.5,
        dy: 0.3 * difficulty,
      };
      newEnemies.push(enemy);
    }
    
    setEnemies(prev => {
      const updated = [...prev, ...newEnemies];
      return updated;
    });
  }, [difficulty]);

  useEffect(() => {
    if (gameOver) return;
  
    const spawnInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastSpawn = currentTime - lastSpawnTime;
      const baseSpawnInterval = 3000; // 3 seconds
      const adjustedSpawnInterval = baseSpawnInterval / difficulty;
  
      if (timeSinceLastSpawn >= adjustedSpawnInterval) {
        Math.random() < 0.5 ? spawnVFormation() : spawnDiagonalFormation();
        setLastSpawnTime(currentTime);
      }
  
      updateDifficulty();
    }, 1000); // Check every second
  
    return () => clearInterval(spawnInterval);
  }, [gameOver, spawnVFormation, spawnDiagonalFormation, difficulty, lastSpawnTime, updateDifficulty]);

  useEffect(() => {
    if (gameOver) return;
    const moveInterval = setInterval(() => {
      setEnemies(prev => {
        const movedEnemies = prev.map(enemy => {
          const newX = enemy.x + enemy.dx * difficulty;
          const newY = enemy.y + enemy.dy * difficulty;
          return { ...enemy, x: newX, y: newY };
        });
        
        return movedEnemies.filter(enemy => 
          enemy.y < 110 && enemy.x > -20 && enemy.x < 120
        );
      });
  
      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        y: bullet.y - 2,
      })).filter(bullet => bullet.y > -10));
    }, 50);
  
    return () => clearInterval(moveInterval);
  }, [gameOver, difficulty]);

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
        <Enemy 
          key={enemy.id} 
          x={enemy.x} 
          y={enemy.y}     
        />
      ))}

      {bullets.map(bullet => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
      ))}
      
      <div className="absolute top-4 left-4 text-white text-xl">
        Score: {score}
        <br />
        Difficulty: {difficulty.toFixed(1)}        
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