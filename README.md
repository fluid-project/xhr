# XMLHttpRequest 1.5 #

A Hybrid XMLHttpRequest implementation for node.js, half way between XHR and XHR 2,

Matches common new browser functionality (progress events, follow redirects etc) - with three primary differences:

*   async only
*   responseXML is missing
*   CORS restrictions don't apply.

note: this lib does support https, but https is currently flaked in node.js v 0.3, as soon as ryah et al fix, then this lib will work for https too.

## Usage ##
Just like normal:

    var XMLHttpRequest = require('./XMLHttpRequest');
    // use as normal!

This should *just work* as you expect, and with your existing XHR-based clientside code, it does with mine.


## Implementation ##
Here are the implemented interfaces:

    [NoInterfaceObject]
    interface XMLHttpRequestEventTarget : EventTarget {
      // event handler attributes
               attribute Function onloadstart;
               attribute Function onprogress;
               attribute Function onabort;
               attribute Function onerror;
               attribute Function onload;
               attribute Function ontimeout;
               attribute Function onloadend;
    };
    
    interface XMLHttpRequestUpload : XMLHttpRequestEventTarget {
    
    };
    
    [Constructor]
    interface XMLHttpRequest : XMLHttpRequestEventTarget {
    
      attribute Function onreadystatechange;
    
      const unsigned short UNSENT = 0;
      const unsigned short OPENED = 1;
      const unsigned short HEADERS_RECEIVED = 2;
      const unsigned short LOADING = 3;
      const unsigned short DONE = 4;
      
      readonly attribute unsigned short readyState;
    
      // request
      void open(DOMString method, DOMString url);
      void open(DOMString method, DOMString url, boolean async);
      void open(DOMString method, DOMString url, boolean async, DOMString? user);
      void open(DOMString method, DOMString url, boolean async, DOMString? user, DOMString? password);
      
      void setRequestHeader(DOMString header, DOMString value);
      
      attribute unsigned long timeout;   // * has no effect
      attribute boolean asBlob;          // * has no effect
      attribute boolean followRedirects; 
      attribute boolean withCredentials; // * has no effect
      
      readonly attribute XMLHttpRequestUpload upload;
      
      void send();
      void send(data); // string (and buffer)

      void abort();
    
      // response
      readonly attribute unsigned short status;
      readonly attribute DOMString statusText;
      DOMString getResponseHeader(DOMString header);
      DOMString getAllResponseHeaders();
      
      void overrideMimeType(DOMString mime); // does nothing    
      
      readonly attribute DOMString responseText;
      
    };
    
