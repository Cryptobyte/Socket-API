const auth = require('./auth');
const example = require('./example');

/**
 * Match a handler with the client's specified route and execute it
 * returning the handler's result to the caller
 * 
 * @param {string} route Route to match with a handler
 * @param {*} data Data for handler
 * @returns Handler's result or error if no match
 */
exports.route = async(route, data) => {
  /*
   * This could be handled in many ways, but for simplicity 
   * we'll use a switch statement. This attempts to match the 
   * route specified by the client with an available route in 
   * the handlers. The issue is that this must be updated 
   * manually at the moment.
   */
  switch (route) {
    case 'signup': return await auth.signup(data);
    case 'signin': return await auth.signin(data);
    case 'get-data': return await example.getData(data);
    
    default: return { error: 'Invalid route' }
  }
};