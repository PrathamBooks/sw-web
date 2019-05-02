function camelCaseToDashCase(str) {
  return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

module.exports = {
  camelCaseToDashCase: camelCaseToDashCase
}
