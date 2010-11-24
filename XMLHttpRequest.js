
module.exports = (function() {
  XMLHttpRequest = function(){};
  // states
  XMLHttpRequest.UNSENT = 0;
  XMLHttpRequest.OPENED = 1;
  XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3;
  XMLHttpRequest.DONE = 4;
  XMLHttpRequest.prototype = {
    onloadstart: null, onprogress: null, onabort: null, onerror: null, onload: null, ontimeout: null, onloadend: null,
    onreadystatechange: null,
    timeout: 0,
    asBlob: false,
    followRedirects: false,
    withCredentials: false,
    //@TODO add .upload
    open: function(method, url, async, user, password ) {
    
    },
    setRequestHeader: function(header, value) {
      
    },
    send: function(data) {
      
    },
    abort: function() {
      
    },
    //TODO maybe move these to be defined on response..?
    getResponseHeader: function(header) {
      
    },
    getAllResponseHeaders: function(header) {
      
    },
    overrideMimeType: function(mime) {
      
    }
  };
  return Object.defineProperties(XMLHttpRequest.prototype, {
    readyState: { writable: false, configurable : false, enumerable: false, value: null },
    //TODO maybe move these to be defined on response..?
    status: { writable: false, configurable : false, enumerable: false, value: null },
    statusText: { writable: false, configurable : false, enumerable: false, value: null },
    responseText: { writable: false, configurable : false, enumerable: false, value: null },
    //TODO responseBody, responseBlob, responseXML
  });
})();
