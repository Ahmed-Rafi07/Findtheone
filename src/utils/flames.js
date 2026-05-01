const FLAMES = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemy', 'Siblings'];

const RESULT_WEIGHT = {
  Friends: 45,
  Love: 85,
  Affection: 65,
  Marriage: 95,
  Enemy: 12,
  Siblings: 20,
};

export function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

// Special easter egg logic for Rafi & Faleela
export function checkSpecialMatch(userA, userB) {
  const u = userA.toLowerCase().trim();
  const f = userB.toLowerCase().trim();
  
  return (
    (u === 'rafi' && f === 'faleela') ||
    (u === 'faleela' && f === 'rafi')
  );
}

function countLetters(value) {
  const counts = new Map();
  for (const letter of value) {
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return counts;
}

export function calculateFlames(nameA, nameB) {
  // Check for special match easter egg
  if (checkSpecialMatch(nameA, nameB)) {
    return {
      remaining: 0,
      result: 'Marriage',
      emoji: 'Marriage',
      message: 'Perfect match. Made for each other.\n\nStill didn\'t tell your crush? Go and propose.\nDon\'t overthink—some chances are meant to be taken.',
      weight: 100,
      isSpecialMatch: true,
    };
  }

  const first = normalizeName(nameA);
  const second = normalizeName(nameB);
  const firstCounts = countLetters(first);
  const secondCounts = countLetters(second);

  let remaining = 0;
  const allLetters = new Set([...firstCounts.keys(), ...secondCounts.keys()]);

  for (const letter of allLetters) {
    const shared = Math.min(firstCounts.get(letter) ?? 0, secondCounts.get(letter) ?? 0);
    remaining += (firstCounts.get(letter) ?? 0) - shared;
    remaining += (secondCounts.get(letter) ?? 0) - shared;
  }

  const steps = FLAMES.slice();
  const stepSize = Math.max(remaining, 1);
  let index = 0;

  while (steps.length > 1) {
    index = (index + stepSize - 1) % steps.length;
    steps.splice(index, 1);
  }

  const result = steps[0] ?? 'Friends';

  return {
    remaining,
    result,
    emoji: {
      Friends: 'Friends',
      Love: 'Love',
      Affection: 'Affection',
      Marriage: 'Marriage',
      Enemy: 'Enemy',
      Siblings: 'Siblings',
    }[result],
    message: {
      Friends: 'Result: Friends - solid connection, keep it light.',
      Love: 'Result: Love - there might be something here.',
      Affection: 'Result: Affection - a little extra warmth is in the air.',
      Marriage: 'Result: Marriage - this is getting serious in a suspicious way.',
      Enemy: 'Result: Enemy - a dramatic arc, but maybe not the rom-com kind.',
      Siblings: 'Result: Siblings - the universe said no, and it was very direct.',
    }[result],
    weight: RESULT_WEIGHT[result] ?? 40,
  };
}
