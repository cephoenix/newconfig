exports = async function(payload){

  var parsedInfo
  try {
    parsedInfo = JSON.parse(payload.body.text())
  } catch (error) {
    return { success: false, data: error}
  }

  let resp = []
  parsedInfo.forEach(element => {
    const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`)
    const dbquery2 = context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`)

    let client = dbquery.findOne({id: element.id})
    resp.push(element)
    if(client == undefined || client == null || client == ``) {
      resp.push(element)
      dbquery2.insertOne(element)
    }
  });
  return resp
};