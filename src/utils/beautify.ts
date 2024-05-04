export const beautifyWord = (word: string): string => {
  const positions = []
  for (let i = 0; i < word.length; i++) {
    if (word[i] === word[i].toUpperCase()) {
      positions.push(i)
    }
  }
  for (let i = 0; i < positions.length; i++) {
    word = word.slice(0, positions[i] + i) + ' ' + word.slice(positions[i] + i);
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}