exports = async function(arg){
  let key = "603082712271C525E087BD999A4E0738";
  let encryptedText = utils.crypto.encrypt("aes", arg, key);
  return encryptedText.toBase64();
};