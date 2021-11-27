const Utils = {
  // generate uuidv4
  uuidv4: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // generate random string
  randomString: (length = 8) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}

module.exports = Utils;