import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#d81b60', '#ffeb3b', '#9c27b0', '#00e676', '#ffffff'],
  });

  // Side cannons
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ffeb3b', '#d81b60', '#9c27b0'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#00e676', '#ffeb3b', '#ff4081'],
    });
  }, 250);
};

export const triggerStarReward = () => {
  confetti({
    particleCount: 40,
    spread: 60,
    shapes: ['star'],
    origin: { y: 0.7 },
    colors: ['#ffeb3b', '#ffd700', '#ffffff'],
  });
};
