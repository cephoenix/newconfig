exports = async function(payload){

  var parsedInfo
  try {
    parsedInfo = JSON.parse(payload.body.text())
  } catch (error) {
    return { success: false, data: error}
  }

  return {payload: payload, parsed: parsedInfo}

};