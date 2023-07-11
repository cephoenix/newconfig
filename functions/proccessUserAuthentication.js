 exports = async function(authEvent) {

  const {
    user: { id },
  } = authEvent;

  const customUserData = context.services
    .get("mongodb-atlas")
    .db("configRadio")
    .collection("customUserData");
  const query = { _id: id };
  const update = {
    $set: {
      lastLogIn: new Date(),
    },
  };
  const options = { upsert: true };
  await customUserData.updateOne(query, update, options);
}
