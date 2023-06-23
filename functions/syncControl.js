exports = async function(payload){

  var parsedInfo
  try {
    parsedInfo = JSON.parse(payload.body.text())
  } catch (error) {
    return { success: false, data: error}
  }

  parsedInfo.array.forEach(element => {
    const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(`clients`)
    const dbquery2 = context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`)
    dbquery2.insertOne(element)

    // let client = dbquery.findOne({oldDatabaseId: element.id})
    // if(client == undefined || client == null || client == ``) {
    //   dbquery2.insertOne(element)
    // }
  });
  return {parsed: parsedInfo}

};