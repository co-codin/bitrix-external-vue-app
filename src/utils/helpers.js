function declOfNumber(number, words) {
  const numberDigit2 = Math.abs(number) % 100
  const numberDigit1 = numberDigit2 % 10

  if (numberDigit2 > 10 && numberDigit2 < 20) {
    return words[2]
  }
  if (numberDigit1 > 1 && numberDigit1 < 5) {
    return words[1]
  }
  if (numberDigit1 === 1) {
    return words[0]
  }

  return words[2]
}

export { declOfNumber }
