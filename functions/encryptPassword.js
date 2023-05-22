exports = async function(arg){
  let key = "5C682AB579F931CA863318B8999DD788";
  let encryptedText = utils.crypto.encrypt("aes", arg, key);
  return encryptedText.toBase64();
};