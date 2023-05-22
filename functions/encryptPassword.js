exports = async function(arg){
  let key = "B374A26A71490437AA024E4FADD5B497FDFF1A8EA6FF12F6FB65AF2720B59CCF";
  let encryptedText = utils.crypto.encrypt("aes", arg, key);
  return encryptedText.toBase64();
};


// exports = async function(arg){
//   let key = "603082712271C525E087BD999A4E0738";
//   let encryptedText = utils.crypto.encrypt("aes", arg, key);
//   return encryptedText.toBase64();
// };