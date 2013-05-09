// Generated by CoffeeScript 1.6.2
(function() {
  var JSOG, nextId, stripIds;

  JSOG = {};

  nextId = 1;

  stripIds = function(obj) {
    var key, val, _i, _len, _results, _results1;

    if (Array.isArray(obj)) {
      _results = [];
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        val = obj[_i];
        _results.push(stripIds(val));
      }
      return _results;
    } else if (typeof obj === 'object') {
      delete obj['@id'];
      _results1 = [];
      for (key in obj) {
        val = obj[key];
        _results1.push(stripIds(val));
      }
      return _results1;
    }
  };

  JSOG.encode = function(original) {
    var doEncode, result;

    doEncode = function(original) {
      var encodeArray, encodeObject;

      encodeObject = function(original) {
        var key, result, value;

        if (original['@id'] != null) {
          return {
            '@ref': original['@id']
          };
        }
        result = {};
        original['@id'] = "" + (nextId++);
        for (key in original) {
          value = original[key];
          result[key] = doEncode(value);
        }
        return result;
      };
      encodeArray = function(original) {
        var val;

        return (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = original.length; _i < _len; _i++) {
            val = original[_i];
            _results.push(encode(val));
          }
          return _results;
        })();
      };
      if (Array.isArray(original)) {
        return encodeArray(original);
      } else if (typeof original === 'object') {
        return encodeObject(original);
      } else {
        return original;
      }
    };
    result = doEncode(original);
    stripIds(original);
    return result;
  };

  JSOG.decode = function(encoded) {
    var doDecode, found;

    found = {};
    doDecode = function(encoded) {
      var decodeArray, decodeObject;

      console.log("decoding " + (JSON.stringify(encoded)));
      decodeObject = function(encoded) {
        var key, result, value;

        if (encoded['@ref'] != null) {
          return found[encoded['@ref']];
        }
        result = {};
        found[encoded['@id']] = result;
        for (key in encoded) {
          value = encoded[key];
          if (key !== '@id') {
            result[key] = doDecode(value);
          }
        }
        return result;
      };
      decodeArray = function(encoded) {
        var result, value, _i, _len;

        result = [];
        for (_i = 0, _len = encoded.length; _i < _len; _i++) {
          value = encoded[_i];
          result.push(decode(value));
        }
        return result;
      };
      if (Array.isArray(encoded)) {
        return decodeArray(encoded);
      } else if (typeof encoded === 'object') {
        return decodeObject(encoded);
      } else {
        return encoded;
      }
    };
    return doDecode(encoded);
  };

  if (module && module.exports) {
    module.exports = JSOG;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.JSOG = JSOG;
  }

}).call(this);
