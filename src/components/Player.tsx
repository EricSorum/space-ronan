import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return (
    <div
      className="absolute w-12 h-12 bg-blue-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
      }}
    />
  );
};

export default Player;