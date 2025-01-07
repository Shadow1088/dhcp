function generateMAC() {
  const hex = "0123456789ABCDEF";
  let output = "";
  for (let i = 0; i < 12; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
    if ((i % 2) - 1 == 0 && i < 10) {
      output += "-";
    }
  }
  return output;
}
