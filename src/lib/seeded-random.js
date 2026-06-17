export function seededUnit(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453123
  return value - Math.floor(value)
}

export function seededBetween(seed, min, max) {
  return min + seededUnit(seed) * (max - min)
}
