/* jshint ignore:start */
/* 
Adapted from https://code.google.com/p/ie-web-worker/
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
  Create a fake worker thread of IE and other browsers
  Remember: Only pass in primitives, and there is none of the native
      security happening
*/

module.exports = function ( scriptFile )
{
  var self = this ;
  var __timer = null ;
  var __text = null ;
  var __fileContent = null ;
  var onmessage ;

  self.onerror = null ;
  self.onmessage = null ;

  // child has run itself and called for it's parent to be notified
  var postMessage = function( text )
  {
    if ( "function" == typeof self.onmessage )
    {
      return self.onmessage( { "data" : text } ) ;
    }
    return false ;
  } ;

  // Method that starts the threading
  self.postMessage = function( text )
  {
    __text = text ;
    __iterate() ;
    return true ;
  } ;

  var __iterate = function()
  {
    // Execute on a timer so we dont block (well as good as we can get in a single thread)
    __timer = setTimeout(__onIterate,1);
    return true ;
  } ;

  var __onIterate = function()
  {
    try
    {
      if ( "function" == typeof onmessage )
      {
        onmessage({ "data" : __text });
      }
      return true ;
    }
    catch( ex )
    {
      if ( "function" == typeof self.onerror )
      {
        return self.onerror( ex ) ;
      }
    }
    return false ;
  } ;


  self.terminate = function ()
  {
    clearTimeout( __timer ) ;
    return true ;
  } ;


  /* HTTP Request*/
  var getHTTPObject = function () 
  {
    var xmlhttp;
    try 
    {
      xmlhttp = new XMLHttpRequest();
    }
    catch (e) 
    {
      try 
      {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e) 
      {
        xmlhttp = false;
      }
    }
    return xmlhttp;
  }

  var http = getHTTPObject()
  http.open("GET", scriptFile, false)
  http.send(null);

  if (http.readyState == 4) 
  {
    var strResponse = http.responseText;
    //var strResponse = http.responseXML;
    switch (http.status) 
    {
      case 404: // Page-not-found error
        alert('Error: Not Found. The requested function could not be found.');
        break;
      case 500: // Display results in a full window for server-side errors
        alert(strResponse);
        break;
      default:
        __fileContent = strResponse ;
        // IE functions will become delagates of the instance of Worker
        eval( __fileContent ) ;
        /*
        at this point we now have:
        a delagate "onmessage(event)"
        */
        break;
    }
  }

  self.importScripts = function(src)
  {
    // hack time, this will import the script but not wait for it to load...
    var script = document.createElement("SCRIPT") ;
    script.src = src ;
    script.setAttribute( "type", "text/javascript" ) ;
    document.getElementsByTagName("HEAD")[0].appendChild(script)
    return true ;
  } ;

  return true ;
} ;
/* jshint ignore:end */
