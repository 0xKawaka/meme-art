function bigIntToHexString(bigIntValue: bigint): string {
  return '0x' + bigIntValue.toString(16);  // Convert BigInt to hex and prepend '0x'
}

function hexToString(hex: string | undefined) {
  if(hex === undefined){
    return "";
  }
  let str = '';
  // Remove the '0x' prefix if it's present
  if (hex.startsWith('0x')) {
      hex = hex.slice(2);
  }
  for (let i = 0; i < hex.length; i += 2) {
      // Get the next two characters (a byte) from the hex string
      let byte = hex.substring(i, i + 2);
      
      // Convert the byte to a decimal number and then to a character
      str += String.fromCharCode(parseInt(byte, 16));
  }
  return str;
}

export { bigIntToHexString, hexToString };