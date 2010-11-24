var events = require('events'), URI = require('./lib/URI/uris.js');

module.exports = XMLHttpRequest = (function() {
  function nodeXHR(xhr) {
    console.log(xhr._vars.method + 'ing ' + xhr._vars.url);
    var port = xhr._vars.url.heirpart().authority().port(),
        scheme = xhr._vars.url.scheme(),
        host = xhr._vars.url.heirpart().authority().host(),
        path = xhr._vars.url.heirpart().path(),
        query = xhr._vars.url.querystring(),
        secure = scheme == 'https:';
    if(!port) {
      if(scheme == 'http:') port = 80;
      if(scheme == 'https:') port = 443;
    }
    if(!path) path = '/';
    if(query) path += query;
    console.log([port,scheme,host,secure,path]);
    xhr._vars.headers['Host'] = host;
    xhr._vars.redirects.push(xhr._vars.url.toString());
    var client = require('http').createClient(port, host, secure);
    var request = client.request(xhr._vars.method, path.toString(), xhr._vars.headers);
    request.end();
    request.on('response', function (response) {
      if([301,302,303,307].indexOf(response.statusCode) > -1) {
        response.destroy();
        var newurl = xhr._vars.url.resolveReference(response.headers.location).toAbsolute();
        if(xhr._vars.redirects.indexOf(newurl.toString()) > -1) throw new Error('NETWORK_ERR: DOM Exception 19 - Redirect Loop');
        xhr._vars.url = newurl;
        nodeXHR(xhr);
      } else {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      }
    });
  };
  XMLHttpRequest = function() {
    function _(v) { return { writable: false, configurable : false, enumerable: true, value: v }};
    function __(v) { return { writable: true, configurable : false, enumerable: false, value: v }};
    function createEvent(type, target, augment) {
      if(!augment) augment = {};
      augment.type = type;
      augment.target = target;
      augment.timeStamp = new Date;
      return augment;
    };
    Object.defineProperties(this, {
      _readyState: __(0), readyState: {configurable : false, enumerable: true,
        get: function() { return this._readyState; },
      },
      _timeout: __(0), timeout: {configurable : false, enumerable: true,
        get: function() { return this._timeout; },
        set: function(v) {
          if(this.readyState != XMLHttpRequest.OPENED || this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
          this._timeout = v;
        }
      },
      _asBlob: __(false), asBlob: {configurable : false, enumerable: true,
        get: function() { return this._asBlob; },
        set: function(v) {
          if(this.readyState != XMLHttpRequest.OPENED || this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
          this._asBlob = v;
        }
      },
      _followRedirects: __(false), followRedirects: {configurable : false, enumerable: true,
        get: function() { return this._followRedirects; },
        set: function(v) {
          if(this.readyState != XMLHttpRequest.OPENED || this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
          this._followRedirects = v;
        }
      },
      _withCredentials: __(false), withCredentials: {configurable : false, enumerable: true,
        get: function() { return this._withCredentials; },
        set: function(v) {
          if(this.readyState != XMLHttpRequest.OPENED || this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
          this._withCredentials = v;
        }
      },
      //TODO maybe move these to be defined on response..?
      _status: __(null), status: {configurable : false, enumerable: true,
        get: function() {
          if(this.readyState <= 1 || this._vars.errorflag) return 0;
          return this._status;
        },
      },
      _statusText: __(null), statusText: {configurable : false, enumerable: true,
        get: function() {
          if(this.readyState <= 1 || this._vars.errorflag) return 0;
          return this._statusText;
        },
      },
      _responseText: __(null), responseText: {configurable : false, enumerable: true,
        get: function() { return this._responseText; },
      },
      //TODO responseBody, responseBlob, responseXML
      _vars: __({
        method: null, url: null, async: null, user: null, pass: null, headers: null,
        sendflag: false, errorflag: false, uploadcomplete: false, abortsend: false,
        response: null, redirects: []
      }),
      _changeState: __(function(state) {
        this._readyState = state;
        ev = createEvent('readystatechange',this);
        this.emit('readystatechange', ev);
        if(this.onreadystatechange) this.onreadystatechange(ev);
      }),
      _sendProgressEvent: __(function(type, computable, loaded, total) {
        var ev = createEvent(type, this, { lengthComputable: computable, loaded: loaded, total: total });
        this.emit( type , ev );
        if(this['on' + type]) this['on' + type](ev);
      }),
    });
    this.onloadstart = null;
    this.onprogress = null;
    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.ontimeout = null;
    this.onloadend = null;
    this.onreadystatechange = null;
  };
  // states
  XMLHttpRequest.UNSENT = 0;
  XMLHttpRequest.OPENED = 1;
  XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3;
  XMLHttpRequest.DONE = 4;
  XMLHttpRequest.prototype = {
    __proto__: events.EventEmitter.prototype,
    //TODO add .upload
    open: function(method, url, async, user, password ) {
      var tempuser, temppass, temp;
      for(i in method) if(method.charCodeAt(i) > 0xFF) throw new Error('SYNTAX_ERR: DOM Exception 12 - invalid method ' + method);
      method = (['CONNECT','DELETE','GET','HEAD','OPTIONS','POST','PUT','TRACE','TRACK'].indexOf(method.toUpperCase()) > -1) ? method.toUpperCase() : method;
      if(['CONNECT','TRACE','TRACK'].indexOf(method) > -1) throw new Error('SECURITY_ERR: DOM Exception 18 - method not allowed ' + method);
      url = new URI(url).toAbsolute();
      if(['http:','https:'].indexOf(url.scheme()) == -1) throw new Error('SYNTAX_ERR: DOM Exception 12 - invalid url scheme ' + url.scheme());
      temp = url.heirpart().authority().userinfo();
      if(temp) {
        temp = temp.split(':');
        tempuser = temp[0];
        temppass = temp[1] ? temp[1] : temppass;
      }
      async = async == null ? true : async;
      if(!async) {
        async = true;
        require('util').debug('Sorry, async only');
      }
      if(user) tempuser = user;
      if(password) tempuser = user;
      // TODO 15. abort send algo, 16. cancel, 17. remove tasks
      this._vars.abortsend = true;
      // cancel network activity?
      // remove tasks?
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
      if(this.readyState != XMLHttpRequest.OPENED) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
      if(this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
      for(i in header) if(header.charCodeAt(i) > 0XFF) throw new Error('SYNTAX_ERR: DOM Exception 12 - invalid header ' + header);
      for(i in value) if(value.charCodeAt(i) > 0XFF) throw new Error('SYNTAX_ERR: DOM Exception 12 - invalid value ' + header);
      if(['accept-charset','accept-encoding','access-control-request-headers','access-control-request-method',
          'connection','content-length','cookie','cookie2','content-transfer-encoding','date','expect','host',
          'keep-alive','origin','referer','te','trailer','transfer-encoding','upgrade','user-agent','via']
      .indexOf(header.toLowerCase()) > -1) return;
      if(header.toLowerCase().substring(0,6) == 'proxy-' || header.toLowerCase().substring(0,4) == 'sec-') return;
      if(!this._vars.headers[header]) this._vars.headers[header] = [];
      this._vars.headers[header].unshift(value);
    },
    send: function(data) {
      if(this.readyState != XMLHttpRequest.OPENED) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
      if(this._vars.sendflag) throw new Error('INVALID_STATE_ERR: DOM Exception 11');
      if(['GET','HEADER'].indexOf(this._vars.method) == -1) {
        data = null;
      } else {
        // handle data
      }
      // TODO 5. If the asynchronous flag is true and one or more event listeners are registered on the XMLHttpRequestUpload object set the upload events flag to true. Otherwise, set the upload events flag to false.
      this._vars.errorflag = false;
      this._vars.uploadComplete = true; // TODO set to false when request body
      
      this._vars.sendflag = true;
      this._changeState(this.readyState);
      this._sendProgressEvent('loadstart', false, 0, 0);
      // TODO 8.4 If the upload complete flag is false dispatch a progress event called loadstart on the XMLHttpRequestUpload object.
      nodeXHR(this);
      return;
    },
    abort: function() {
      this._vars.abortsend = true;
      // cancel network activity?
      // remove tasks?
      this._vars.response = null;
      this._vars.headers = null;
      this._vars.errorflag = true;
      if( !(this.readyState == XMLHttpRequest.UNSENT || (this.readyState == XMLHttpRequest.OPENED && !this.sendflag) || this.readyState == XMLHttpRequest.DONE) ) {
        this._vars.sendflag = false;
        this._changeState(XMLHttpRequest.DONE);
        this._sendProgressEvent('abort',false,0,0);
        this._sendProgressEvent('loadend',false,0,0);
        // TODO 6. If the upload complete flag is false run these substeps:
      }
      this._readyState = XMLHttpRequest.UNSENT;
    },
    //TODO maybe move these to be defined on response..?
    getResponseHeader: function(header) {
      if(this.readyState <= 1 || this._vars.errorflag) return null;
    },
    getAllResponseHeaders: function(header) {
      if(this.readyState <= 1 || this._vars.errorflag) return null;
    },
    overrideMimeType: function(mime) {
      
    }
  };
  return XMLHttpRequest;
})();

x = new XMLHttpRequest;
x.onreadystatechange = function(e) {
  console.log(e);
};
x.open('get','http://dbpedia.org/resource/Edinburgh');
x.send();