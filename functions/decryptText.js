// exports = async function(arg){
  
//   let key = "603082712271C525E087BD999A4E0738";
//   let encryptedMessage;
//   if(typeof arg === "string") {
//       encryptedMessage = BSON.Binary.fromBase64(arg)
//   }

//   let encryptedText = utils.crypto.decrypt("aes", encryptedMessage, key);
//   return encryptedText.text();
// };

exports = async function(salt, encoded){
  
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  var temp = encoded
              .match(/.{1,2}/g)
              .map((hex) => parseInt(hex, 16))
              .map(applySaltToChar)
              .map((charCode) => String.fromCharCode(charCode))
              .join("");


  temp = temp.toLowerCase()
  
  temp = Buffer.from(temp, 'base64').toString('utf8');

  return temp;
};


// const decrypt = (salt, encoded) => {
//   const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
//   const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
//   return encoded
//     .match(/.{1,2}/g)
//     .map((hex) => parseInt(hex, 16))
//     .map(applySaltToChar)
//     .map((charCode) => String.fromCharCode(charCode))
//     .join("");
// };