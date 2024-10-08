import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return (
    <div
      className="absolute w-12 h-12 bg-blue-500 rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    />
  );
};

export default Player;