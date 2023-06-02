exports = async function (encodedPassword) {
  let key = context.values.get("encryptionKey")
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);
  temp = Buffer.from(encodedPassword, 'base64').toString('utf8');
  var temp = temp
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
  return temp;
};