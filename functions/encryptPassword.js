exports = async function(arg){
            // 603082712271C525E087BD999A4E0738
  let key = "B374A26A71490437AA024E4FADD5B497";
  let encryptedText = utils.crypto.encrypt("aes", arg, key);
  return encryptedText.toBase64();
};


// exports = async function(arg){
//   let key = "603082712271C525E087BD999A4E0738";
//   let encryptedText = utils.crypto.encrypt("aes", arg, key);
//   return encryptedText.toBase64();
// };