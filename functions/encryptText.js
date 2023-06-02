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

exports = async function (text) {
  // let key = "ALKNTLGHAYGSAGGGAGAÇLJKHOPIALS"
  let key = context.values.get("encryptionKey")
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);

  var ret = text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("")
  ret = Buffer.from(ret).toString('base64');
  return ret;
};