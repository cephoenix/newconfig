exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");
  let parameters

  // if (data) {
  //   try {
  //     parameters = EJSON.parse(data)
  //   } catch (e) {
  //     throw (e)
  //   }
  // } else {
  //   parameters = {}
  // }

  try {
    dbResponse = await dbquery.find(data, {
      _id: 0,
      name: 1,
      firmwareVersion: 1,
      clientChannel: 1,
      recordingDate: {
        $dateToString: {
          date: "$recordingDate",
          format: "%H:%M:%S %d/%m/%Y",
        }
      }
    })
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};