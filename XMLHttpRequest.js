var events = require('events'), URI = require('./lib/URI/uris.js');

module.exports = XMLHttpRequest = (function() {
  function _(v) { return { writable: false, configurable : false, enumerable: false, value: v }};
  XMLHttpRequest = function(){};
  // states
  XMLHttpRequest.UNSENT = 0;
  XMLHttpRequest.OPENED = 1;
  XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3;
  XMLHttpRequest.DONE = 4;
  XMLHttpRequest.prototype = {
    __proto__: events.EventEmitter.prototype,
    onloadstart: null, onprogress: null, onabort: null, onerror: null, onload: null, ontimeout: null, onloadend: null,
    onreadystatechange: null,
    //TODO add .upload
    open: function(method, url, async, user, password ) {
      var tempuser, temppass, temp;
      for(i in method) if(method.charCodeAt(i) > 0xFF) console.log('SYNTAX_ERR ' + method);
      method = (['CONNECT','DELETE','GET','HEAD','OPTIONS','POST','PUT','TRACE','TRACK'].indexOf(method.toUpperCase()) > -1) ? method.toUpperCase() : method;
      if(['CONNECT','TRACE','TRACK'].indexOf(method) > -1) console.log('SECURITY_ERR ' + method);
      url = new URI(url).toAbsolute();
      temp = url.heirpart().authority().userinfo();
      if(temp) {
        temp = temp.split(':');
        tempuser = temp[0];
        temppass = temp[1] ? temp[1] : temppass;
      }
      async = async == null ? true : async;
      if(user) tempuser = user;
      if(password) tempuser = user;
      // TODO 15. abort send algo, 16. cancel, 17. remove tasks
      this._vars.method = method;
      this._vars.url = url;
      this._vars.async = async;
      this._vars.user = tempuser;
      this._vars.pass = temppass;
      this._vars.headers = {};
      this._timeout = 0;
      this._asBlob = false;
      this._followRedirects = false;
      this._withCredentials = false;
      this._vars.sendflag = false;
      this._vars.response = null;
      this._changeState(XMLHttpRequest.OPENED);      
    },
    setRequestHeader: function(header, value) {
      if(this.readyState != XMLHttpRequest.OPENED) console.log('INVALID_STATE_ERR');
      if(this.vars.sendflag) console.log('INVALID_STATE_ERR');
      for(i in header) if(header.charCodeAt(i) > 0XFF) console.log('SYNTAX_ERR ' + header);
      for(i in value) if(value.charCodeAt(i) > 0XFF) console.log('SYNTAX_ERR ' + value);
      if(['accept-charset','accept-encoding','access-control-request-headers','access-control-request-method',
          'connection','content-length','cookie','cookie2','content-transfer-encoding','date','expect','host',
          'keep-alive','origin','referer','te','trailer','transfer-encoding','upgrade','user-agent','via']
      .indexOf(header.toLowerCase()) > -1) return;
      if(header.toLowerCase().substring(0,6) == 'proxy-' || header.toLowerCase().substring(0,4) == 'sec-') return;
      if(!this._vars.headers[header]) this._vars.headers[header] = [];
      this._vars.headers[header].unshift(value);
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
  Object.defineProperties(XMLHttpRequest.prototype, {
    readyState: _(0),
    _timeout: _(0), timeout: {configurable : false, enumerable: false,
      get: function() { return this._timeout; },
      set: function(v) {
        if(this.readyState != XMLHttpRequest.OPENED) console.log('INVALID_STATE_ERR');
        if(this._vars.sendflag) console.log('INVALID_STATE_ERR');
        this._timeout = v;
      }
    },
    _asBlob: _(false), asBlob: {configurable : false, enumerable: false,
      get: function() { return this._asBlob; },
      set: function(v) {
        if(this.readyState != XMLHttpRequest.OPENED) console.log('INVALID_STATE_ERR');
        if(this._vars.sendflag) console.log('INVALID_STATE_ERR');
        this._asBlob = v;
      }
    },
    _followRedirects: _(false), followRedirects: {configurable : false, enumerable: false,
      get: function() { return this._followRedirects; },
      set: function(v) {
        if(this.readyState != XMLHttpRequest.OPENED) console.log('INVALID_STATE_ERR');
        if(this._vars.sendflag) console.log('INVALID_STATE_ERR');
        this._followRedirects = v;
      }
    },
    _withCredentials: _(false), withCredentials: {configurable : false, enumerable: false,
      get: function() { return this._withCredentials; },
      set: function(v) {
        if(this.readyState != XMLHttpRequest.OPENED) console.log('INVALID_STATE_ERR');
        if(this._vars.sendflag) console.log('INVALID_STATE_ERR');
        this._withCredentials = v;
      }
    },
    //TODO maybe move these to be defined on response..?
    status: _(null), statusText: _(null), responseText: _(null),
    //TODO responseBody, responseBlob, responseXML
    _vars: _({
      method: null, url: null, async: null, user: null, pass: null,
      headers: null, sendflag: false,
      response: null
    }),
    _changeState: _(function(state) {
      this.readyState = state;
      this.emit('readystatechange', this);
      if(this.onreadystatechange) this.onreadystatechange(this);
    })
  });
  return XMLHttpRequest;
})();

x = new XMLHttpRequest;
x.onreadystatechange = function(e) {
  console.log(e.readyState);
};
x.timeout = 10;
x.open('get','http://webr3.org/nathan#me');