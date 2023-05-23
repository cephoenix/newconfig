exports = async function (arg) {
  let salt = "B374A26A71490437AA024E4FADD5B497";
  let encryptedPassword = utils.crypto.hash(
    "sha1",
    salt + arg,
  ).toHex().toUpperCase();
  return encryptedPassword
};