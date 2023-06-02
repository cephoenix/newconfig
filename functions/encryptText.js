exports = async function (text) {
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