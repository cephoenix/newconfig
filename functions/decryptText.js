exports = async function(arg){
  
  let key = "603082712271C525E087BD999A4E0738";
  let encryptedMessage;
  if(typeof arg === "string") {
      encryptedMessage = BSON.Binary.fromBase64(arg)
  }

  let encryptedText = utils.crypto.decrypt("aes", encryptedMessage, key);
  return encryptedText.text();
};