exports = async function(payload){
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`)

  var parsedInfo
  try {
    parsedInfo = JSON.parse(payload.body.text())
  } catch (error) {
    return { success: false, data: error}
  }

  let client = dbquery.findOne({id: parsedInfo[0].id})
  return { parsed: parsedInfo[0], client: client}
  let resp = []
  parsedInfo.forEach(element => {
    
    // const dbquery2 = context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`)

    // resp.push(element)
    if(client == undefined || client == null || client == ``) {
      resp.push(element)
      dbquery.insertOne(element)
    }
  });
  return resp
};