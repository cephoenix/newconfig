// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {

  console.log("USER: ", JSON.stringify(context.user))

  return context

};
