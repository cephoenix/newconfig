// exports = async function(arg){
//   let key = "603082712271C525E087BD999A4E0738";
//   let encryptedText = utils.crypto.encrypt("aes", arg, key);
//   return encryptedText.toBase64();
// };

// const crypt = (salt, text) => {
//   const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
//   const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
//   const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

//   return text
//     .split("")
//     .map(textToChars)
//     .map(applySaltToChar)
//     .map(byteHex)
//     .join("");
// };

exports = async function(salt, text){
  text += "WDTA@955C2E606B96D82886"
  text = Buffer.from(text).toString('base64');
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};