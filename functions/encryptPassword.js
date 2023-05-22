exports = async function(arg){
  let key = "RApnoLHr1tRBCFnKVAhTOw==";
  let encryptedText = utils.crypto.encrypt("aes", arg, key);
  return encryptedText.toBase64();
};