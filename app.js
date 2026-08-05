(() => {
  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/saxen/parser.js
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function Parser_(options) {
    var fromCharCode = String.fromCharCode;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var ENTITY_PATTERN = /&#(\d+);|&#x([0-9a-f]+);|&(\w+);/ig;
    var ENTITY_MAPPING = {
      "amp": "&",
      "apos": "'",
      "gt": ">",
      "lt": "<",
      "quot": '"'
    };
    Object.keys(ENTITY_MAPPING).forEach(function(k) {
      ENTITY_MAPPING[k.toUpperCase()] = ENTITY_MAPPING[k];
    });
    function replaceEntities(_, d, x, z) {
      if (z) {
        if (hasOwnProperty.call(ENTITY_MAPPING, z)) {
          return ENTITY_MAPPING[z];
        } else {
          return "&" + z + ";";
        }
      }
      if (d) {
        return fromCharCode(d);
      }
      return fromCharCode(parseInt(x, 16));
    }
    function decodeEntities(s) {
      if (s.length > 3 && s.indexOf("&") !== -1) {
        return s.replace(ENTITY_PATTERN, replaceEntities);
      }
      return s;
    }
    var NON_WHITESPACE_OUTSIDE_ROOT_NODE = "non-whitespace outside of root node";
    function error(msg) {
      return new Error(msg);
    }
    function missingNamespaceForPrefix(prefix) {
      return "missing namespace for prefix <" + prefix + ">";
    }
    function getter(getFn) {
      return {
        "get": getFn,
        "enumerable": true
      };
    }
    function cloneNsMatrix(nsMatrix) {
      var clone = {}, key;
      for (key in nsMatrix) {
        clone[key] = nsMatrix[key];
      }
      return clone;
    }
    var NAME_CACHE = Symbol("nameCache");
    function uriPrefix(prefix) {
      return prefix + "$uri";
    }
    function buildNsMatrix(nsUriToPrefix) {
      var nsMatrix = {}, uri, prefix;
      for (uri in nsUriToPrefix) {
        prefix = nsUriToPrefix[uri];
        nsMatrix[prefix] = prefix;
        nsMatrix[uriPrefix(prefix)] = uri;
      }
      return nsMatrix;
    }
    function noopGetContext() {
      return {
        line: 0,
        column: 0
      };
    }
    function throwFunc(err2) {
      throw err2;
    }
    function Parser(options2) {
      if (!this) {
        return new Parser(options2);
      }
      var proxy = options2 && options2["proxy"];
      var onText, onOpenTag, onCloseTag, onCDATA, onError = throwFunc, onWarning, onComment, onQuestion, onAttention;
      var getContext = noopGetContext;
      var streaming = false;
      var rootTagFound = false;
      var leftoverXml = "";
      var maybeNS = false;
      var isNamespace = false;
      var returnError = null;
      var parseStop = false;
      var nsMatrixStack, nsMatrix, nodeStack;
      var nsUriToPrefix;
      function handleError(err2) {
        if (!(err2 instanceof Error)) {
          err2 = error(err2);
        }
        returnError = err2;
        onError(err2, getContext);
      }
      function handleWarning(err2) {
        if (!onWarning) {
          return;
        }
        if (!(err2 instanceof Error)) {
          err2 = error(err2);
        }
        onWarning(err2, getContext);
      }
      this["on"] = function(name, cb) {
        if (typeof cb !== "function") {
          throw error("required args <name, cb>");
        }
        switch (name) {
          case "openTag":
            onOpenTag = cb;
            break;
          case "text":
            onText = cb;
            break;
          case "closeTag":
            onCloseTag = cb;
            break;
          case "error":
            onError = cb;
            break;
          case "warn":
            onWarning = cb;
            break;
          case "cdata":
            onCDATA = cb;
            break;
          case "attention":
            onAttention = cb;
            break;
          // <!XXXXX zzzz="eeee">
          case "question":
            onQuestion = cb;
            break;
          // <? ....  ?>
          case "comment":
            onComment = cb;
            break;
          default:
            throw error("unsupported event: " + name);
        }
        return this;
      };
      this["ns"] = function(nsMap) {
        if (typeof nsMap === "undefined") {
          nsMap = {};
        }
        if (_typeof(nsMap) !== "object") {
          throw error("required args <nsMap={}>");
        }
        var _nsUriToPrefix = {}, k;
        for (k in nsMap) {
          _nsUriToPrefix[k] = nsMap[k];
        }
        isNamespace = true;
        nsUriToPrefix = _nsUriToPrefix;
        return this;
      };
      function resetState() {
        nsMatrixStack = isNamespace ? [] : null;
        nsMatrix = isNamespace ? buildNsMatrix(nsUriToPrefix) : null;
        nodeStack = [];
        getContext = noopGetContext;
        parseStop = false;
        returnError = null;
        rootTagFound = false;
        leftoverXml = "";
      }
      this["parse"] = function(xml) {
        if (typeof xml !== "string") {
          throw error("required args <xml=string>");
        }
        if (streaming) {
          throw error("parse during stream; call end() first");
        }
        resetState();
        parse(xml);
        getContext = noopGetContext;
        parseStop = false;
        return returnError;
      };
      this["write"] = function(xml) {
        if (typeof xml !== "string") {
          throw error("required args <xml=string>");
        }
        if (!streaming) {
          resetState();
          streaming = true;
        }
        if (!returnError) {
          leftoverXml = parse(leftoverXml + xml, true) || "";
        }
        return this;
      };
      this["end"] = function() {
        if (!streaming) {
          resetState();
        }
        streaming = false;
        if (!returnError) {
          parse(leftoverXml);
        }
        leftoverXml = "";
        getContext = noopGetContext;
        parseStop = false;
        return returnError;
      };
      this["stop"] = function() {
        parseStop = true;
      };
      function parse(xml) {
        var streaming2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var elNameCache = null, elNameCacheMatrix = null;
        var _nsMatrix, anonymousNsCount = 0, tagStart = false, tagEnd = false, i = 0, j = 0, x, y, q, w, v, xmlns, elementName, _elementName, elementProxy;
        var attrsString = "", attrsStart = 0, cachedAttrs;
        function normalizeAttrName(name, defaultAlias) {
          var w2 = name.indexOf(":");
          if (w2 === -1) {
            return name;
          }
          var nsName = nsMatrix[name.substring(0, w2)];
          if (!nsName) {
            handleWarning(missingNamespaceForPrefix(name.substring(0, w2)));
            return null;
          }
          return defaultAlias === nsName ? name.substr(w2 + 1) : nsName + name.substr(w2);
        }
        function getAttrs() {
          if (cachedAttrs !== null) {
            return cachedAttrs;
          }
          var nsUri, nsUriPrefix, defaultAlias = isNamespace && nsMatrix["xmlns"], attrList = isNamespace && maybeNS ? [] : null, i2 = attrsStart, s = attrsString, l = s.length, hasNewMatrix, newalias, value, alias, name, attrs = {}, seenAttrs = /* @__PURE__ */ new Set(), skipAttr, w2, j2;
          parseAttr: for (; i2 < l; i2++) {
            skipAttr = false;
            w2 = s.charCodeAt(i2);
            if (w2 === 32 || w2 < 14 && w2 > 8) {
              continue;
            }
            if (w2 < 65 || w2 > 122 || w2 > 90 && w2 < 97) {
              if (w2 !== 95 && w2 !== 58) {
                handleWarning("illegal first char attribute name");
                skipAttr = true;
              }
            }
            for (j2 = i2 + 1; j2 < l; j2++) {
              w2 = s.charCodeAt(j2);
              if (w2 > 96 && w2 < 123 || w2 > 64 && w2 < 91 || w2 > 47 && w2 < 59 || w2 === 46 || // '.'
              w2 === 45 || // '-'
              w2 === 95) {
                continue;
              }
              if (w2 === 32 || w2 < 14 && w2 > 8) {
                handleWarning("missing attribute value");
                i2 = j2;
                continue parseAttr;
              }
              if (w2 === 61) {
                break;
              }
              handleWarning("illegal attribute name char");
              skipAttr = true;
            }
            name = s.substring(i2, j2);
            if (name === "xmlns:xmlns") {
              handleWarning("illegal declaration of xmlns");
              skipAttr = true;
            }
            w2 = s.charCodeAt(j2 + 1);
            if (w2 === 34) {
              j2 = s.indexOf('"', i2 = j2 + 2);
              if (j2 === -1) {
                j2 = s.indexOf("'", i2);
                if (j2 !== -1) {
                  handleWarning("attribute value quote missmatch");
                  skipAttr = true;
                }
              }
            } else if (w2 === 39) {
              j2 = s.indexOf("'", i2 = j2 + 2);
              if (j2 === -1) {
                j2 = s.indexOf('"', i2);
                if (j2 !== -1) {
                  handleWarning("attribute value quote missmatch");
                  skipAttr = true;
                }
              }
            } else {
              handleWarning("missing attribute value quotes");
              skipAttr = true;
              for (j2 = j2 + 1; j2 < l; j2++) {
                w2 = s.charCodeAt(j2 + 1);
                if (w2 === 32 || w2 < 14 && w2 > 8) {
                  break;
                }
              }
            }
            if (j2 === -1) {
              handleWarning("missing closing quotes");
              j2 = l;
              skipAttr = true;
            }
            if (!skipAttr) {
              value = s.substring(i2, j2);
            }
            i2 = j2;
            for (; j2 + 1 < l; j2++) {
              w2 = s.charCodeAt(j2 + 1);
              if (w2 === 32 || w2 < 14 && w2 > 8) {
                break;
              }
              if (i2 === j2) {
                handleWarning("illegal character after attribute end");
                skipAttr = true;
              }
            }
            i2 = j2 + 1;
            if (skipAttr) {
              continue parseAttr;
            }
            if (seenAttrs.has(name)) {
              handleWarning("attribute <" + name + "> already defined");
              continue;
            }
            seenAttrs.add(name);
            if (!isNamespace) {
              attrs[name] = value;
              continue;
            }
            if (maybeNS) {
              newalias = name === "xmlns" ? "xmlns" : name.charCodeAt(0) === 120 && name.substr(0, 6) === "xmlns:" ? name.substr(6) : null;
              if (newalias !== null) {
                nsUri = decodeEntities(value);
                nsUriPrefix = uriPrefix(newalias);
                alias = nsUriToPrefix[nsUri];
                if (!alias) {
                  if (newalias === "xmlns" || nsUriPrefix in nsMatrix && nsMatrix[nsUriPrefix] !== nsUri) {
                    do {
                      alias = "ns" + anonymousNsCount++;
                    } while (typeof nsMatrix[alias] !== "undefined");
                  } else {
                    alias = newalias;
                  }
                  nsUriToPrefix[nsUri] = alias;
                }
                if (nsMatrix[newalias] !== alias) {
                  if (!hasNewMatrix) {
                    nsMatrix = cloneNsMatrix(nsMatrix);
                    hasNewMatrix = true;
                  }
                  nsMatrix[newalias] = alias;
                  if (newalias === "xmlns") {
                    nsMatrix[uriPrefix(alias)] = nsUri;
                    defaultAlias = alias;
                  }
                  nsMatrix[nsUriPrefix] = nsUri;
                }
                attrs[name] = value;
                continue;
              }
              attrList.push(name, value);
              continue;
            }
            name = normalizeAttrName(name, defaultAlias);
            if (name === null) {
              continue;
            }
            attrs[name] = value;
          }
          if (maybeNS) {
            for (i2 = 0, l = attrList.length; i2 < l; i2++) {
              name = normalizeAttrName(attrList[i2++], defaultAlias);
              value = attrList[i2];
              if (name === null) {
                continue;
              }
              attrs[name] = value;
            }
          }
          return cachedAttrs = attrs;
        }
        function getParseContext() {
          var splitsRe = /(\r\n|\r|\n)/g;
          var line = 0;
          var column = 0;
          var startOfLine = 0;
          var endOfLine = j;
          var match;
          var data;
          while (i >= startOfLine) {
            match = splitsRe.exec(xml);
            if (!match) {
              break;
            }
            endOfLine = match[0].length + match.index;
            if (endOfLine > i) {
              break;
            }
            line += 1;
            startOfLine = endOfLine;
          }
          if (i == -1) {
            column = endOfLine;
            data = xml.substring(j);
          } else if (j === 0) {
            data = xml.substring(j, i);
          } else {
            column = i - startOfLine;
            data = j == -1 ? xml.substring(i) : xml.substring(i, j + 1);
          }
          return {
            "data": data,
            "line": line,
            "column": column
          };
        }
        getContext = getParseContext;
        if (proxy) {
          elementProxy = Object.create({}, {
            "name": getter(function() {
              return elementName;
            }),
            "originalName": getter(function() {
              return _elementName;
            }),
            "attrs": getter(getAttrs),
            "ns": getter(function() {
              return nsMatrix;
            })
          });
        }
        while (j !== -1) {
          if (xml.charCodeAt(j) === 60) {
            i = j;
          } else {
            i = xml.indexOf("<", j);
          }
          if (i === -1) {
            if (streaming2) {
              return xml.substring(j);
            }
            if (nodeStack.length) {
              return handleError("unexpected end of file");
            }
            if (!rootTagFound) {
              return handleError("missing start tag");
            }
            if (j < xml.length) {
              if (xml.substring(j).trim()) {
                handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);
              }
            }
            return;
          }
          if (!rootTagFound) {
            rootTagFound = true;
          }
          if (j !== i) {
            if (nodeStack.length) {
              if (onText) {
                onText(xml.substring(j, i), decodeEntities, getContext);
                if (parseStop) {
                  return;
                }
              }
            } else {
              if (xml.substring(j, i).trim()) {
                handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);
                if (parseStop) {
                  return;
                }
              }
            }
          }
          w = xml.charCodeAt(i + 1);
          if (w === 33) {
            q = xml.charCodeAt(i + 2);
            if (q === 91 && xml.substr(i + 3, 6) === "CDATA[") {
              j = xml.indexOf("]]>", i);
              if (j === -1) {
                if (streaming2) {
                  return xml.substring(i);
                }
                return handleError("unclosed cdata");
              }
              if (onCDATA) {
                onCDATA(xml.substring(i + 9, j), getContext);
                if (parseStop) {
                  return;
                }
              }
              j += 3;
              continue;
            }
            if (q === 45 && xml.charCodeAt(i + 3) === 45) {
              j = xml.indexOf("-->", i);
              if (j === -1) {
                if (streaming2) {
                  return xml.substring(i);
                }
                return handleError("unclosed comment");
              }
              if (onComment) {
                onComment(xml.substring(i + 4, j), decodeEntities, getContext);
                if (parseStop) {
                  return;
                }
              }
              j += 3;
              continue;
            }
          }
          if (w === 63) {
            j = xml.indexOf("?>", i);
            if (j === -1) {
              if (streaming2) {
                return xml.substring(i);
              }
              return handleError("unclosed question");
            }
            if (onQuestion) {
              onQuestion(xml.substring(i, j + 2), getContext);
              if (parseStop) {
                return;
              }
            }
            j += 2;
            continue;
          }
          for (x = i + 1; ; x++) {
            v = xml.charCodeAt(x);
            if (isNaN(v)) {
              if (streaming2) {
                return xml.substring(i);
              }
              j = -1;
              return handleError("unclosed tag");
            }
            if (v === 34) {
              q = xml.indexOf('"', x + 1);
              x = q !== -1 ? q : x;
            } else if (v === 39) {
              q = xml.indexOf("'", x + 1);
              x = q !== -1 ? q : x;
            } else if (v === 62) {
              j = x;
              break;
            }
          }
          if (w === 33) {
            if (onAttention) {
              onAttention(xml.substring(i, j + 1), decodeEntities, getContext);
              if (parseStop) {
                return;
              }
            }
            j += 1;
            continue;
          }
          cachedAttrs = {};
          if (w === 47) {
            tagStart = false;
            tagEnd = true;
            if (!nodeStack.length) {
              return handleError("missing open tag");
            }
            x = elementName = nodeStack.pop();
            q = i + 2 + x.length;
            if (xml.substring(i + 2, q) !== x) {
              return handleError("closing tag mismatch");
            }
            for (; q < j; q++) {
              w = xml.charCodeAt(q);
              if (w === 32 || w > 8 && w < 14) {
                continue;
              }
              return handleError("close tag");
            }
          } else {
            if (xml.charCodeAt(j - 1) === 47) {
              x = elementName = xml.substring(i + 1, j - 1);
              tagStart = true;
              tagEnd = true;
            } else {
              x = elementName = xml.substring(i + 1, j);
              tagStart = true;
              tagEnd = false;
            }
            if (!(w > 96 && w < 123 || w > 64 && w < 91 || w === 95 || w === 58)) {
              return handleError("illegal first char nodeName");
            }
            for (q = 1, y = x.length; q < y; q++) {
              w = x.charCodeAt(q);
              if (w > 96 && w < 123 || w > 64 && w < 91 || w > 47 && w < 59 || w === 45 || w === 95 || w == 46) {
                continue;
              }
              if (w === 32 || w < 14 && w > 8) {
                elementName = x.substring(0, q);
                cachedAttrs = null;
                break;
              }
              return handleError("invalid nodeName");
            }
            if (!tagEnd) {
              nodeStack.push(elementName);
            }
          }
          if (isNamespace) {
            _nsMatrix = nsMatrix;
            if (tagStart) {
              if (!tagEnd) {
                nsMatrixStack.push(_nsMatrix);
              }
              if (cachedAttrs === null) {
                if (maybeNS = x.indexOf("xmlns", q) !== -1) {
                  attrsStart = q;
                  attrsString = x;
                  getAttrs();
                  maybeNS = false;
                }
              }
            }
            _elementName = elementName;
            if (elNameCacheMatrix !== nsMatrix) {
              elNameCache = nsMatrix[NAME_CACHE];
              if (elNameCache === void 0) {
                elNameCache = nsMatrix[NAME_CACHE] = {};
              }
              elNameCacheMatrix = nsMatrix;
            }
            var _cachedName = elNameCache[elementName];
            if (_cachedName !== void 0) {
              elementName = _cachedName;
            } else {
              w = elementName.indexOf(":");
              if (w !== -1) {
                xmlns = nsMatrix[elementName.substring(0, w)];
                if (!xmlns) {
                  return handleError("missing namespace on <" + _elementName + ">");
                }
                elementName = elementName.substr(w + 1);
              } else {
                xmlns = nsMatrix["xmlns"];
              }
              if (xmlns) {
                elementName = xmlns + ":" + elementName;
              }
              elNameCache[_elementName] = elementName;
            }
          }
          if (tagStart) {
            attrsStart = q;
            attrsString = x;
            if (onOpenTag) {
              if (proxy) {
                onOpenTag(elementProxy, decodeEntities, tagEnd, getContext);
              } else {
                onOpenTag(elementName, getAttrs, decodeEntities, tagEnd, getContext);
              }
              if (parseStop) {
                return;
              }
            }
          }
          if (tagEnd) {
            if (onCloseTag) {
              onCloseTag(proxy ? elementProxy : elementName, decodeEntities, tagStart, getContext);
              if (parseStop) {
                return;
              }
            }
            if (isNamespace) {
              if (!tagStart) {
                nsMatrix = nsMatrixStack.pop();
              } else {
                nsMatrix = _nsMatrix;
              }
            }
          }
          j += 1;
        }
      }
    }
    return new Parser(options);
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xml/parseXmlStream.saxen.js
  function parseXmlStream(state2, onOpenTag, onCloseTag, onText) {
    var errored = false;
    var mustNotHaveErrored = function mustNotHaveErrored2() {
      if (errored) {
        throw new Error("Errored");
      }
    };
    var resolvePromise;
    var xmlns = true;
    var parser = new Parser_({
      proxy: true
    });
    if (xmlns) {
      parser.ns();
    }
    var write = function write2(xml) {
      mustNotHaveErrored();
      parser.write(xml);
    };
    var end = function end2() {
      mustNotHaveErrored();
      parser.end();
      resolvePromise();
    };
    var promise = new Promise(function(resolve, reject) {
      resolvePromise = resolve;
      var onerror = function onerror2(error) {
        errored = true;
        throw error;
      };
      var ontext = function ontext2(text, decodeEntities) {
        if (onText) {
          onText(decodeEntities(text), state2);
        }
      };
      var onopentag = function onopentag2(element, decodeEntities, selfClosing, getContext) {
        if (onOpenTag) {
          var attributes = element.attrs;
          for (var name in attributes) {
            attributes[name] = decodeEntities(attributes[name]);
          }
          onOpenTag(xmlns ? trimXmlnsPrefix(element.originalName) : element.name, attributes, state2);
        }
      };
      var onclosetag = function onclosetag2(element) {
        if (onCloseTag) {
          var tagName = xmlns ? trimXmlnsPrefix(element.originalName) : element.name;
          onCloseTag(tagName, state2);
        }
      };
      parser.on("error", onerror);
      parser.on("text", ontext);
      parser.on("openTag", onopentag);
      parser.on("closeTag", onclosetag);
    });
    return {
      promise,
      write,
      end
    };
  }
  var TAG_NAME_PREFIX = /.+:/;
  function trimXmlnsPrefix(tagName) {
    return tagName.replace(TAG_NAME_PREFIX, "");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/InvalidSpreadsheetError.js
  function _typeof2(o) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof2(o);
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof2(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (_typeof2(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof2(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    Object.defineProperty(subClass, "prototype", { writable: false });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof2(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper5(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct5(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2) _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf5(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf5(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var InvalidSpreadsheetError = /* @__PURE__ */ function(_Error) {
    _inherits(InvalidSpreadsheetError2, _Error);
    var _super = _createSuper(InvalidSpreadsheetError2);
    function InvalidSpreadsheetError2(message) {
      var _this;
      _classCallCheck(this, InvalidSpreadsheetError2);
      _this = _super.call(this, message);
      _this.name = "InvalidSpreadsheetError";
      return _this;
    }
    return _createClass(InvalidSpreadsheetError2);
  }(/* @__PURE__ */ _wrapNativeSuper(Error));

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xml/parseXml.js
  function parseXml(xml, state2, onOpenTag, onCloseTag, onText, onProgress) {
    var parser = parseXmlStream(state2, onOpenTag, onCloseTag, onText);
    if (onProgress) {
      parseXmlInChunks(parser, xml, onProgress);
    } else {
      parser.write(xml);
      parser.end();
    }
    return parser.promise.then(function(result) {
      return result;
    }, function(error) {
      var spreadsheetError = new InvalidSpreadsheetError(error.message);
      spreadsheetError.stack = error.stack;
      spreadsheetError.cause = error;
      throw spreadsheetError;
    });
    function parseXmlInChunks(parser2, xml2, onProgress2, nonBlocking) {
      var MAX_CHUNK_PROCESSING_TIME = 7;
      var INITIAL_CHUNK_SIZE = 64 * 1024;
      var chunksCount = 0;
      var chunkSize = INITIAL_CHUNK_SIZE;
      var parseNextChunk = function parseNextChunk2() {
        chunksCount++;
        var startedAt = Date.now();
        if (xml2.length > chunkSize) {
          parser2.write(xml2.slice(0, chunkSize));
          if (onProgress2) {
            onProgress2(false);
          }
          xml2 = xml2.slice(chunkSize);
          var chunkProcessingTime = Date.now() - startedAt;
          if (chunkProcessingTime < MAX_CHUNK_PROCESSING_TIME * 0.5) {
            chunkSize *= 2;
          } else if (chunkProcessingTime > MAX_CHUNK_PROCESSING_TIME) {
            chunkSize /= 2;
          }
          return true;
        } else {
          parser2.write(xml2);
          parser2.end();
          if (onProgress2) {
            onProgress2(true);
          }
          return false;
        }
      };
      var loop = function loop2() {
        if (parseNextChunk()) {
          if (nonBlocking) {
            if (typeof setImmediate !== "undefined") {
              setImmediate(loop2);
            } else {
              setTimeout(loop2, 0);
            }
          } else {
            loop2();
          }
        } else {
        }
      };
      loop();
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/fflate/esm/browser.js
  var ch2 = {};
  var wk = function(c, id, msg, transfer, cb) {
    var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
      c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
    ], { type: "text/javascript" }))));
    w.onmessage = function(e) {
      var d = e.data, ed = d.$e$;
      if (ed) {
        var err2 = new Error(ed[0]);
        err2["code"] = ed[1];
        err2.stack = ed[2];
        cb(err2, null);
      } else
        cb(null, d);
    };
    w.postMessage(msg, transfer);
    return w;
  };
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
      b[i] = start += 1 << eb[i - 1];
    }
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
      for (var j = b[i]; j < b[i + 1]; ++j) {
        r[j] = j - b[i] << 5 | i;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = function(cd, mb, r) {
    var s = cd.length;
    var i = 0;
    var l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          var sv = i << 4 | cd[i];
          var r_1 = mb - cd[i];
          var v = le[cd[i] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
        }
      }
    }
    return co;
  };
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
      if (a[i] > m)
        m = a[i];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    return new u8(v.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i = 0; i < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b = fleb[i];
            add = bits(dat, pos, (1 << b) - 1) + fl[i];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var mrg = function(a, b) {
    var o = {};
    for (var k in a)
      o[k] = a[k];
    for (var k in b)
      o[k] = b[k];
    return o;
  };
  var wcln = function(fn, fnStr, td2) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
    for (var i = 0; i < dt.length; ++i) {
      var v = dt[i], k = ks[i];
      if (typeof v == "function") {
        fnStr += ";" + k + "=";
        var st_1 = v.toString();
        if (v.prototype) {
          if (st_1.indexOf("[native code]") != -1) {
            var spInd = st_1.indexOf(" ", 8) + 1;
            fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
          } else {
            fnStr += st_1;
            for (var t in v.prototype)
              fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
          }
        } else
          fnStr += st_1;
      } else
        td2[k] = v;
    }
    return fnStr;
  };
  var ch = [];
  var cbfs = function(v) {
    var tl = [];
    for (var k in v) {
      if (v[k].buffer) {
        tl.push((v[k] = new v[k].constructor(v[k])).buffer);
      }
    }
    return tl;
  };
  var wrkr = function(fns, init, id, cb) {
    if (!ch[id]) {
      var fnStr = "", td_1 = {}, m = fns.length - 1;
      for (var i = 0; i < m; ++i)
        fnStr = wcln(fns[i], fnStr, td_1);
      ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
    }
    var td2 = mrg({}, ch[id].e);
    return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
  };
  var bInflt = function() {
    return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
  };
  var pbf = function(msg) {
    return postMessage(msg, [msg.buffer]);
  };
  var gopt = function(o) {
    return o && {
      out: o.size && new u8(o.size),
      dictionary: o.dictionary
    };
  };
  var cbify = function(dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function(err2, dat2) {
      w.terminate();
      cb(err2, dat2);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function() {
      w.terminate();
    };
  };
  var b2 = function(d, b) {
    return d[b] | d[b + 1] << 8;
  };
  var b4 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var b8 = function(d, b) {
    return b4(d, b) + b4(d, b + 4) * 4294967296;
  };
  function inflate(data, opts, cb) {
    if (!cb)
      cb = opts, opts = {};
    if (typeof cb != "function")
      err(7);
    return cbify(data, opts, [
      bInflt
    ], function(ev) {
      return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
    }, 1, cb);
  }
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var dutf8 = function(d) {
    for (var r = "", i = 0; ; ) {
      var c = d[i++];
      var eb = (c > 127) + (c > 223) + (c > 239);
      if (i + eb > d.length)
        return { s: r, r: slc(d, i - 1) };
      if (!eb)
        r += String.fromCharCode(c);
      else if (eb == 3) {
        c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
      } else if (eb & 1)
        r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
      else
        r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
    }
  };
  function strFromU8(dat, latin1) {
    if (latin1) {
      var r = "";
      for (var i = 0; i < dat.length; i += 16384)
        r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
      return r;
    } else if (td) {
      return td.decode(dat);
    } else {
      var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
      if (r.length)
        err(8);
      return s;
    }
  }
  var slzh = function(d, b) {
    return b + 30 + b2(d, b + 26) + b2(d, b + 28);
  };
  var zh = function(d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
  };
  var z64hs = function(d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
      for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
        if (b2(d, b) == 1) {
          return [
            nsc ? b8(d, b + 4 + 8 * nsu) : sc,
            nsu ? b8(d, b + 4) : su,
            noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
            1
          ];
        }
      }
      if (z < 2)
        err(13);
    }
    return [sc, su, off, 0];
  };
  var mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
    fn();
  };
  function unzip(data, opts, cb) {
    if (!cb)
      cb = opts, opts = {};
    if (typeof cb != "function")
      err(7);
    var term = [];
    var tAll = function() {
      for (var i2 = 0; i2 < term.length; ++i2)
        term[i2]();
    };
    var files = {};
    var cbd = function(a, b) {
      mt(function() {
        cb(a, b);
      });
    };
    mt(function() {
      cbd = cb;
    });
    var e = data.length - 22;
    for (; b4(data, e) != 101010256; --e) {
      if (!e || data.length - e > 65558) {
        cbd(err(13, 0, 1), null);
        return tAll;
      }
    }
    ;
    var lft = b2(data, e + 8);
    if (lft) {
      var c = lft;
      var o = b4(data, e + 16);
      var z = b4(data, e - 20) == 117853008;
      if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 101075792;
        if (z) {
          c = lft = b4(data, ze + 32);
          o = b4(data, ze + 48);
        }
      }
      var fltr = opts && opts.filter;
      var _loop_3 = function(i2) {
        var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
        o = no;
        var cbl = function(e2, d) {
          if (e2) {
            tAll();
            cbd(e2, null);
          } else {
            if (d)
              files[fn] = d;
            if (!--lft)
              cbd(null, files);
          }
        };
        if (!fltr || fltr({
          name: fn,
          size: sc,
          originalSize: su,
          compression: c_1
        })) {
          if (!c_1)
            cbl(null, slc(data, b, b + sc));
          else if (c_1 == 8) {
            var infl = data.subarray(b, b + sc);
            if (su < 524288 || sc > 0.8 * su) {
              try {
                cbl(null, inflateSync(infl, { out: new u8(su) }));
              } catch (e2) {
                cbl(e2, null);
              }
            } else
              term.push(inflate(infl, { size: su }, cbl));
          } else
            cbl(err(14, "unknown compression type " + c_1, 1), null);
        } else
          cbl(null, null);
      };
      for (var i = 0; i < c; ++i) {
        _loop_3(i);
      }
    } else
      cbd(null, {});
    return tAll;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/zip/UnzipError.js
  function _typeof3(o) {
    "@babel/helpers - typeof";
    return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof3(o);
  }
  function _defineProperties2(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey2(descriptor.key), descriptor);
    }
  }
  function _createClass2(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties2(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties2(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey2(arg) {
    var key = _toPrimitive2(arg, "string");
    return _typeof3(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive2(input, hint) {
    if (_typeof3(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof3(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _classCallCheck2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits2(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    Object.defineProperty(subClass, "prototype", { writable: false });
    if (superClass) _setPrototypeOf2(subClass, superClass);
  }
  function _createSuper2(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct2();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf2(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf2(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn2(this, result);
    };
  }
  function _possibleConstructorReturn2(self, call) {
    if (call && (_typeof3(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized2(self);
  }
  function _assertThisInitialized2(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _wrapNativeSuper2(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper2 = function _wrapNativeSuper5(Class2) {
      if (Class2 === null || !_isNativeFunction2(Class2)) return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct2(Class2, arguments, _getPrototypeOf2(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf2(Wrapper, Class2);
    };
    return _wrapNativeSuper2(Class);
  }
  function _construct2(Parent, args, Class) {
    if (_isNativeReflectConstruct2()) {
      _construct2 = Reflect.construct.bind();
    } else {
      _construct2 = function _construct5(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2) _setPrototypeOf2(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct2.apply(null, arguments);
  }
  function _isNativeReflectConstruct2() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction2(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf2(o, p) {
    _setPrototypeOf2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf5(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf2(o, p);
  }
  function _getPrototypeOf2(o) {
    _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf5(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf2(o);
  }
  var UnzipError = /* @__PURE__ */ function(_Error) {
    _inherits2(UnzipError2, _Error);
    var _super = _createSuper2(UnzipError2);
    function UnzipError2() {
      _classCallCheck2(this, UnzipError2);
      return _super.apply(this, arguments);
    }
    return _createClass2(UnzipError2);
  }(/* @__PURE__ */ _wrapNativeSuper2(Error));
  function createUnzipError(error) {
    var unzipError = new UnzipError(error.message);
    if (error.stack) {
      unzipError.stack = error.stack;
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(unzipError, createUnzipError);
    }
    unzipError.cause = error;
    return unzipError;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/zip/unzipFromArrayBuffer.js
  function unzipFromArrayBuffer(input, options) {
    return unzipFromArrayBufferUsingFunction(input, options, unzipAsync, true);
  }
  function unzipFromArrayBufferUsingFunction(input) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _filter = _ref.filter;
    var unzip2 = arguments.length > 2 ? arguments[2] : void 0;
    var isAsync = arguments.length > 3 ? arguments[3] : void 0;
    return unzip2(new Uint8Array(input), {
      // Ignore certain types of files.
      filter: function filter(file) {
        if (_filter) {
          return _filter({
            path: file.name
          });
        }
        return true;
      }
    }).then(function(result) {
      return result;
    }, function(error) {
      if (isFlateError(error)) {
        throw createUnzipError(error);
      } else {
        throw error;
      }
    });
  }
  function unzipAsync(archive) {
    return new Promise(function(resolve, reject) {
      unzip(archive, function(error, files) {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  }
  function isFlateError(error) {
    return typeof error.code === "number";
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/file/InvalidInputError.js
  function _typeof4(o) {
    "@babel/helpers - typeof";
    return _typeof4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof4(o);
  }
  function _defineProperties3(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey3(descriptor.key), descriptor);
    }
  }
  function _createClass3(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties3(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties3(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey3(arg) {
    var key = _toPrimitive3(arg, "string");
    return _typeof4(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive3(input, hint) {
    if (_typeof4(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof4(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _classCallCheck3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits3(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    Object.defineProperty(subClass, "prototype", { writable: false });
    if (superClass) _setPrototypeOf3(subClass, superClass);
  }
  function _createSuper3(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct3();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf3(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf3(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn3(this, result);
    };
  }
  function _possibleConstructorReturn3(self, call) {
    if (call && (_typeof4(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized3(self);
  }
  function _assertThisInitialized3(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _wrapNativeSuper3(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper3 = function _wrapNativeSuper5(Class2) {
      if (Class2 === null || !_isNativeFunction3(Class2)) return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct3(Class2, arguments, _getPrototypeOf3(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf3(Wrapper, Class2);
    };
    return _wrapNativeSuper3(Class);
  }
  function _construct3(Parent, args, Class) {
    if (_isNativeReflectConstruct3()) {
      _construct3 = Reflect.construct.bind();
    } else {
      _construct3 = function _construct5(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2) _setPrototypeOf3(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct3.apply(null, arguments);
  }
  function _isNativeReflectConstruct3() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction3(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf3(o, p) {
    _setPrototypeOf3 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf5(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf3(o, p);
  }
  function _getPrototypeOf3(o) {
    _getPrototypeOf3 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf5(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf3(o);
  }
  var MESSAGES = {
    XLS_FILE_NOT_SUPPORTED: "You passed a legacy `.xls` file. Only `.xlsx` files are supported",
    FILE_NOT_SUPPORTED: "Doesn't look like an `.xlsx` file",
    INVALID_ZIP: "Couldn't unzip `.xlsx` file contents",
    NO_DATA: "No data"
  };
  var InvalidInputError = /* @__PURE__ */ function(_Error) {
    _inherits3(InvalidInputError2, _Error);
    var _super = _createSuper3(InvalidInputError2);
    function InvalidInputError2(code, cause) {
      var _this;
      _classCallCheck3(this, InvalidInputError2);
      _this = _super.call(this, MESSAGES[code] || code);
      _this.code = code;
      _this.name = "InvalidInputError";
      _this.cause = cause;
      return _this;
    }
    return _createClass3(InvalidInputError2);
  }(/* @__PURE__ */ _wrapNativeSuper3(Error));

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/export/filterZipArchiveEntry.js
  function filterZipArchiveEntry(_ref) {
    var path = _ref.path;
    return path.endsWith(".xml") || path.endsWith(".xml.rels");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/file/createFileTypeDetector.js
  var ZIP_FILE_SIGNATURE = [80, 75];
  var XLS_FILE_SIGNATURE = [208, 207, 17, 224];
  var FILE_TYPE_SIGNATURES = [ZIP_FILE_SIGNATURE, XLS_FILE_SIGNATURE];
  var XLSX_FILE_TYPE = FILE_TYPE_SIGNATURES.indexOf(ZIP_FILE_SIGNATURE);
  var XLS_FILE_TYPE = FILE_TYPE_SIGNATURES.indexOf(XLS_FILE_SIGNATURE);
  function createFileTypeDetector() {
    var type;
    var possibleTypes = indexesOf(FILE_TYPE_SIGNATURES);
    var i = 0;
    return function(_byte) {
      if (isNaN(type)) {
        var t;
        possibleTypes = possibleTypes.filter(function(typeIndex) {
          if (_byte === FILE_TYPE_SIGNATURES[typeIndex][i]) {
            if (FILE_TYPE_SIGNATURES[typeIndex].length === i + 1) {
              t = typeIndex;
            }
            return true;
          }
        });
        if (possibleTypes.length === 1) {
          type = t;
        } else if (possibleTypes.length === 0) {
          type = -1;
        }
      }
      i++;
      return type;
    };
  }
  function indexesOf(array) {
    var indexes = [];
    var i = 0;
    while (i < array.length) {
      indexes.push(i);
      i++;
    }
    return indexes;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/file/validateLeadingBytes.js
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function validateLeadingBytes(bytes) {
    var fileTypeDetector = createFileTypeDetector();
    for (var _iterator = _createForOfIteratorHelperLoose(bytes), _step; !(_step = _iterator()).done; ) {
      var _byte = _step.value;
      if (validateByte(_byte, fileTypeDetector)) {
        return;
      }
    }
    noFileTypeCouldBeDetermined(bytes.length);
  }
  function validateByte(_byte2, fileTypeDetector) {
    var fileType = fileTypeDetector(_byte2);
    if (fileType !== void 0) {
      if (fileType === XLS_FILE_TYPE) {
        throw new InvalidInputError("XLS_FILE_NOT_SUPPORTED");
      }
      if (fileType < 0) {
        throw new InvalidInputError("FILE_NOT_SUPPORTED");
      }
      return true;
    }
  }
  function noFileTypeCouldBeDetermined(byteCount) {
    throw new InvalidInputError(byteCount === 0 ? "NO_DATA" : "FILE_NOT_SUPPORTED");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/utility/checkpoint.js
  var latestCheckpointTimestamp;
  function checkpoint(name) {
    var now = Date.now();
    var shouldOutputLog = typeof global !== "undefined" ? Boolean(global.READ_EXCEL_FILE_CHECKPOINTS) : typeof window !== "undefined" ? Boolean(window.READ_EXCEL_FILE_CHECKPOINTS) : false;
    if (shouldOutputLog) {
      if (latestCheckpointTimestamp) {
        console.log("  -", now - latestCheckpointTimestamp, "ms");
      }
      console.log("*", name);
    }
    latestCheckpointTimestamp = now;
  }
  function resetCheckpoint() {
    latestCheckpointTimestamp = void 0;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/export/unpackXlsxFileUniversal.js
  function unpackXlsxFile(input) {
    resetCheckpoint();
    checkpoint("unpack files");
    return getArrayBuffer(input).then(function(arrayBuffer) {
      validateLeadingBytes(new Uint8Array(arrayBuffer));
      return unzipFromArrayBuffer(arrayBuffer, {
        filter: filterZipArchiveEntry
      }).then(function(result) {
        return result;
      }, function(error) {
        if (error instanceof UnzipError) {
          throw new InvalidInputError("INVALID_ZIP", error.cause);
        } else {
          throw error;
        }
      });
    });
  }
  function getArrayBuffer(input) {
    if (input instanceof Blob) {
      return input.arrayBuffer();
    }
    if (input instanceof ArrayBuffer) {
      return Promise.resolve(input);
    }
    throw new TypeError("Unuspported input. Expected a `Blob` or an `ArrayBuffer`");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseSpreadsheetInfo.js
  function parseSpreadsheetInfo(content, parseXml2) {
    var state2 = createInitialState();
    return parseXml2(content, state2, onOpenTag, null, null).then(function() {
      return getResultFromState(state2);
    });
    function createInitialState() {
      return {
        workbookPr: void 0,
        sheets: []
      };
    }
    function getResultFromState(state3) {
      return {
        epoch1904: state3.workbookPr ? state3.workbookPr.epoch1904 : false,
        sheets: state3.sheets
      };
    }
    function onOpenTag(tagName, attributes, state3) {
      if (tagName === "workbookPr") {
        if (!state3.workbookPr) {
          state3.workbookPr = {
            epoch1904: attributes.date1904 === "1"
          };
        }
      } else if (tagName === "sheet") {
        if (attributes.name) {
          state3.sheets.push({
            // `sheetId` attribute value is an arbitrary, `1`-based unique positive integer
            // assigned to a worksheet, typically starting at `1` for the first sheet.
            //  Deleting and adding new sheets might cause the sheetId values to become non-sequential.
            // For example, `sheetId`s could be `1`, `2`, `4`, if sheet `3` was deleted.
            id: Number(attributes.sheetId),
            name: attributes.name,
            relationId: attributes["r:id"]
          });
        }
      }
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseFilePaths.js
  function parseFilePaths(content, parseXml2) {
    var state2 = createInitialState();
    return parseXml2(content, state2, onOpenTag, null, null).then(function() {
      return getResultFromState(state2);
    });
    function createInitialState() {
      return {
        sheets: {},
        sharedStrings: void 0,
        styles: void 0
      };
    }
    function getResultFromState(state3) {
      return state3;
    }
    function onOpenTag(tagName, attributes, state3) {
      if (tagName === "Relationship") {
        addFilePathForRelation(state3, attributes.Id, attributes.Type, attributes.Target);
      }
    }
    function addFilePathForRelation(state3, id, type, target) {
      switch (type) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
          state3.styles = getFilePathFromRelationTarget(target);
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings":
          state3.sharedStrings = getFilePathFromRelationTarget(target);
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet":
          state3.sheets[id] = getFilePathFromRelationTarget(target);
          break;
      }
    }
    function getFilePathFromRelationTarget(path) {
      if (path[0] === "/") {
        return path.slice("/".length);
      }
      return "xl/" + path;
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseStyles.js
  function _typeof5(o) {
    "@babel/helpers - typeof";
    return _typeof5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof5(o);
  }
  var _excluded = ["xfId"];
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey4(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey4(arg) {
    var key = _toPrimitive4(arg, "string");
    return _typeof5(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive4(input, hint) {
    if (_typeof5(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof5(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function parseStyles(content, parseXml2) {
    var state2 = createInitialState();
    return parseXml2(content, state2, onOpenTag, onCloseTag, null).then(function() {
      return getResultFromState(state2);
    });
    function createInitialState() {
      return {
        numberFormats: {},
        baseStyles: [],
        // The first `164` elements of the `styles` array are going to be `undefined`
        // because those represent the built-in "default" styles in `.xlsx` specification.
        // These "default" styles have IDs from `0` to `163`, i.e. according to their index.
        styles: [],
        cellStyleXfs: false,
        cellXfs: false
      };
    }
    function getResultFromState(state3) {
      return state3.styles.map(function(style) {
        if (style.xfId) {
          var xfId = style.xfId, styleProperties = _objectWithoutProperties(style, _excluded);
          return _objectSpread(_objectSpread({}, state3.baseStyles[xfId]), styleProperties);
        } else {
          return style;
        }
      });
    }
    function onOpenTag(tagName, attributes, state3) {
      if (tagName === "numFmt") {
        state3.numberFormats[attributes.numFmtId] = {
          id: Number(attributes.numFmtId),
          template: attributes.formatCode
        };
      } else if (tagName === "cellStyleXfs") {
        state3.cellStyleXfs = true;
      } else if (tagName === "cellXfs") {
        state3.cellXfs = true;
      } else if (tagName === "xf") {
        if (state3.cellStyleXfs) {
          state3.baseStyles.push(parseCellStyle(attributes));
        } else if (state3.cellXfs) {
          var style = parseCellStyle(attributes, state3.numberFormats);
          if (attributes.xfId) {
            style.xfId = Number(attributes.xfId);
          }
          state3.styles.push(style);
        }
      }
    }
    function onCloseTag(tagName, state3) {
      if (tagName === "cellStyleXfs") {
        state3.cellStyleXfs = false;
      } else if (tagName === "cellXfs") {
        state3.cellXfs = false;
      }
    }
    function parseCellStyle(attributes, numberFormats) {
      var style = {};
      var numFmtId = attributes.numFmtId;
      if (numFmtId) {
        if (numberFormats && numberFormats[numFmtId]) {
          style.numberFormat = numberFormats[numFmtId];
        } else {
          style.numberFormat = {
            id: Number(numFmtId)
          };
        }
      }
      return style;
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseSharedStrings.js
  function parseSharedStrings(content, parseXml2) {
    var state2 = createInitialState();
    return parseXml2(content, state2, onOpenTag, onCloseTag, onText).then(function() {
      return getResultFromState(state2);
    });
    function createInitialState() {
      return {
        si: void 0,
        strings: []
      };
    }
    function getResultFromState(state3) {
      return state3.strings;
    }
    function onOpenTag(tagName, attributes, state3) {
      if (tagName === "si") {
        state3.si = createInitialStateInSharedString();
      } else if (state3.si) {
        onOpenTagInSharedString(tagName, attributes, state3.si);
      }
    }
    function onCloseTag(tagName, state3) {
      if (tagName === "si") {
        state3.strings.push(state3.si.string);
        state3.si = void 0;
      } else if (state3.si) {
        onCloseTagInSharedString(tagName, state3.si);
      }
    }
    function onText(text, state3) {
      if (state3.si) {
        onTextInSharedString(text, state3.si);
      }
    }
    function createInitialStateInSharedString() {
      return {
        t: false,
        r: false,
        rPh: false,
        string: ""
      };
    }
    function onOpenTagInSharedString(tagName, attributes, state3) {
      if (tagName === "t") {
        state3.t = true;
      } else if (tagName === "r") {
        state3.r = true;
      } else if (tagName === "rPh") {
        state3.rPh = true;
      }
    }
    function onCloseTagInSharedString(tagName, state3) {
      if (tagName === "t") {
        state3.t = false;
      } else if (tagName === "r") {
        state3.r = false;
      } else if (tagName === "rPh") {
        state3.rPh = false;
      }
    }
    function onTextInSharedString(text, state3) {
      if (state3.rPh) {
      } else if (state3.t) {
        if (state3.r) {
          state3.string += text;
        } else {
          state3.string = text;
        }
      }
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseExcelTimestamp.js
  function parseExcelTimestamp(excelSerialDate, epoch1904) {
    var NUMBER_OF_LEAP_YEARS_BETWEEN_1900_AND_1970 = 17;
    var JANUARY_0TH_1900_DAY = 1;
    var ERRONEOUS_FEBRUARY_29_1990_DAY = 1;
    var DAY = 24 * 60 * 60 * 1e3;
    var DAYS_IN_YEAR = 365;
    if (epoch1904) {
      excelSerialDate += (1904 - 1900) * DAYS_IN_YEAR + JANUARY_0TH_1900_DAY + ERRONEOUS_FEBRUARY_29_1990_DAY;
    }
    var daysBeforeUnixEpoch = JANUARY_0TH_1900_DAY + ERRONEOUS_FEBRUARY_29_1990_DAY + (1970 - 1900) * DAYS_IN_YEAR + NUMBER_OF_LEAP_YEARS_BETWEEN_1900_AND_1970;
    return Math.floor((excelSerialDate - daysBeforeUnixEpoch) * DAY);
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/isDateFormat.js
  var DATE_FORMAT_SPECIFIC_LOCALE_PREFIX = /^\[\$-[^\]]+\]/;
  var DATE_FORMAT_ALLOW_ANY_OTHER_TEXT_SUFFIX = /;@$/;
  var IS_DATE_FORMAT_CACHE = {};
  function isDateFormatCached(template) {
    if (template in IS_DATE_FORMAT_CACHE) {
      return IS_DATE_FORMAT_CACHE[template];
    }
    template = template.toLowerCase();
    template = template.replace(DATE_FORMAT_SPECIFIC_LOCALE_PREFIX, "");
    template = template.replace(DATE_FORMAT_ALLOW_ANY_OTHER_TEXT_SUFFIX, "");
    var tokens = template.split(/\W+/);
    var result = tokens.length === 0 ? false : tokens.every(function(token) {
      return DATE_TEMPLATE_TOKENS.indexOf(token) >= 0;
    });
    IS_DATE_FORMAT_CACHE[template] = result;
    return result;
  }
  var DATE_TEMPLATE_TOKENS = [
    // Seconds (min two digits). Example: "05".
    "ss",
    // Minutes (min two digits). Example: "05". Could also be "Months". Weird.
    "mm",
    // Hours. Example: "1".
    "h",
    // Hours (min two digits). Example: "01".
    "hh",
    // "AM" part of "AM/PM". Lowercased just in case.
    "am",
    // "PM" part of "AM/PM". Lowercased just in case.
    "pm",
    // Day. Example: "1"
    "d",
    // Day (min two digits). Example: "01"
    "dd",
    // Month (numeric). Example: "1".
    "m",
    // Month (numeric, min two digits). Example: "01". Could also be "Minutes". Weird.
    "mm",
    // Month (shortened month name). Example: "Jan".
    "mmm",
    // Month (full month name). Example: "January".
    "mmmm",
    // Two-digit year. Example: "20".
    "yy",
    // Full year. Example: "2020".
    "yyyy",
    // I don't have any idea what "e" means.
    // It's used in "built-in" XLSX formats:
    // * 27 '[$-404]e/m/d';
    // * 36 '[$-404]e/m/d';
    // * 50 '[$-404]e/m/d';
    // * 57 '[$-404]e/m/d';
    "e"
  ];

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/isDateFormatStyle.js
  function isDateFormatStyle(style, defaultDateFormat, shouldGuessDateFormatFromNumberFormatTemplate) {
    if (!style.numberFormat) {
      return false;
    }
    if (
      // Whether it's a "number format" that's conventionally used for storing date timestamps.
      BUILT_IN_DATE_FORMAT_IDS.indexOf(style.numberFormat.id) >= 0 || // Whether it's a "number format" that uses a "formatting template"
      // that the developer is certain is a date formatting template.
      defaultDateFormat && style.numberFormat.template === defaultDateFormat || // Whether the "smart formatting template" feature is not disabled
      // and it has detected that it's a date formatting template by looking at it.
      shouldGuessDateFormatFromNumberFormatTemplate && style.numberFormat.template && isDateFormatCached(style.numberFormat.template)
    ) {
      return true;
    }
    return false;
  }
  var LOCALE_INDEPENDENT_BUILT_IN_DATE_FORMAT_IDS = [
    14,
    // mm-dd-yy
    15,
    // d-mmm-yy
    16,
    // d-mmm
    17,
    // mmm-yy
    18,
    // h:mm AM/PM
    19,
    // h:mm:ss AM/PM
    20,
    // h:mm
    21,
    // h:mm:ss
    22,
    // m/d/yy h:mm
    45,
    // mm:ss
    46,
    // [h]:mm:ss
    47
    // mmss.0
  ];
  var MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
    27,
    // [$-404]e/m/d OR yyyy"年"m"月"
    28,
    // [$-404]e"年"m"月"d"日" OR m"月"d"日"
    29,
    // [$-404]e"年"m"月"d"日" OR m"月"d"日"
    30,
    // m/d/yy OR m-d-yy
    31,
    // yyyy"年"m"月"d"日" OR yyyy"年"m"月"d"日"
    32,
    // hh"時"mm"分" OR h"时"mm"分"
    33,
    // hh"時"mm"分"ss"秒" OR h"时"mm"分"ss"秒"
    34,
    // 上午/下午hh"時"mm"分" OR 上午/下午h"时"mm"分"
    35,
    // 上午/下午hh"時"mm"分"ss"秒" OR 上午/下午h"时"mm"分"ss"秒"
    36,
    // [$-404]e/m/d OR yyyy"年"m"月"
    50,
    // [$-404]e/m/d OR yyyy"年"m"月"
    51,
    // [$-404]e"年"m"月"d"日" OR m"月"d"日"
    52,
    // 上午/下午hh"時"mm"分" OR yyyy"年"m"月"
    53,
    // 上午/下午hh"時"mm"分"ss"秒" OR m"月"d"日"
    54,
    // [$-404]e"年"m"月"d"日" OR m"月"d"日"
    55,
    // 上午/下午hh"時"mm"分" OR 上午/下午h"时"mm"分"
    56,
    // 上午/下午hh"時"mm"分"ss"秒" OR 上午/下午h"时"mm"分"ss"秒"
    57,
    // [$-404]e/m/d OR yyyy"年"m"月"
    58
    // [$-404]e"年"m"月"d"日" OR m"月"d"日"
  ];
  var JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
    27,
    // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
    28,
    // [$-411]ggge"年"m"月"d"日" OR mm-dd
    29,
    // [$-411]ggge"年"m"月"d"日" OR mm-dd
    30,
    // m/d/yy OR mm-dd-yy
    31,
    // yyyy"年"m"月"d"日" OR yyyy"년" mm"월" dd"일"
    32,
    // h"時"mm"分" OR h"시" mm"분"
    33,
    // h"時"mm"分"ss"秒" OR h"시" mm"분" ss"초"
    34,
    // yyyy"年"m"月" OR yyyy-mm-dd
    35,
    // m"月"d"日" OR yyyy-mm-dd
    36,
    // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
    50,
    // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
    51,
    // [$-411]ggge"年"m"月"d"日" OR mm-dd
    52,
    // yyyy"年"m"月" OR yyyy-mm-dd
    53,
    // m"月"d"日" OR yyyy-mm-dd
    54,
    // [$-411]ggge"年"m"月"d"日" OR mm-dd
    55,
    // yyyy"年"m"月" OR yyyy-mm-dd
    56,
    // m"月"d"日" OR yyyy-mm-dd
    57,
    // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
    58
    // [$-411]ggge"年"m"月"d"日" OR mm-dd
  ];
  var THAI_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
    71,
    // ว/ด/ปปปป
    72,
    // ว-ดดด-ปป
    73,
    // ว-ดดด
    74,
    // ดดด-ปป
    75,
    // ช:นน
    76,
    // ช:นน:ทท
    77,
    // ว/ด/ปปปป ช:นน
    78,
    // นน:ทท
    79,
    // [ช]:นน:ทท
    80,
    // นน:ทท.0
    81
    // d/m/bb
  ];
  var BUILT_IN_DATE_FORMAT_IDS = LOCALE_INDEPENDENT_BUILT_IN_DATE_FORMAT_IDS.concat(
    // Add Mainland Chinese or Taiwanese date format IDs that haven't already been added.
    MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS
  ).concat(
    // Add Japanese or Korean date format IDs that haven't already been added.
    JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS.filter(function(numberFormatId) {
      return MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
    })
  ).concat(
    // Add Thai date format IDs that haven't already been added.
    THAI_LOCALE_BUILT_IN_DATE_FORMAT_IDS.filter(function(numberFormatId) {
      return MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
    }).filter(function(numberFormatId) {
      return JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
    })
  );

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseCell.js
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray2(o, minLen);
  }
  function _arrayLikeToArray2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  var EMPTY_CELL_VALUE = null;
  var EMPTY_CELL = [null, EMPTY_CELL_VALUE];
  function parseCell(t, s, v, inlineString, _ref) {
    var _ref2 = _slicedToArray(_ref, 6), sharedStrings = _ref2[0], styles = _ref2[1], epoch1904 = _ref2[2], defaultDateFormat = _ref2[3], dateTemplateParser = _ref2[4], parseNumberCustom = _ref2[5];
    switch (t || "n") {
      // `t="str"` means that the cell value is calculated using a formula.
      // The formula is defined as the text of a child `<f/>` element.
      //
      // It could optionally include a `<v/>` element whose text is the cached result
      // of the calculation from the last time the file was saved in a spreadsheet editor application.
      //
      // An optional `<v/>` element holds a pre-computed result of the formula defined by `<f/>`.
      //
      // Example:
      //
      // <c r="B3" t="str">
      // 	<f>CONCATENATE(C1,D1)</f>
      // 	<v>C1ValueD1Value</v>
      // </c>
      //
      // Here's a guide on formulas in XLSX files:
      // https://github.com/MiniMax-AI/skills/blob/main/skills/minimax-xlsx/references/validate.md
      //
      case "str":
        if (v === void 0) {
          return "VALUE_MISSING";
        }
        if (!v) {
          return EMPTY_CELL;
        }
        return ["s", v];
      // `t="inlineStr"` means that `<is/>` holds the string value.
      //
      // Inside a `<c t="inlineStr"/>`, the specification requires there to exist an `<is/>` element,
      // and within that `<is/>` element it requires to exist a `<t/>` element.
      //
      // Example:
      //
      // <c r="A1" s="1" t="inlineStr">
      //   <is>
      //     <t>
      //       Test 123
      //     </t>
      //   </is>
      // </c>
      //
      case "inlineStr":
        if (inlineString === void 0) {
          return "VALUE_MISSING";
        }
        return ["s", inlineString];
      // `type="s"` means that the string value is stored in the Shared Strings Table.
      // This way it attempts to compress the `.xlsx` file by reusing all string values
      // in case they repeat throughout the spreadsheet.
      //
      // This optimization can't be used when writing an `.xlsx` file in a "streaming"
      // fashion, i.e. when the entire spreadsheet data is not known in adavance
      // at the start of writing the file.
      // But it can be used in all other situations. And hence, it is used.
      // So this is the most common cell type, actually.
      //
      // Example:
      //
      // <c r="A3" t="s">
      //   <v>3</v>
      // </c>
      //
      case "s":
        if (!v) {
          return "VALUE_MISSING";
        }
        var sharedStringIndex = Number(v);
        if (isNaN(sharedStringIndex) || sharedStrings[sharedStringIndex] === void 0) {
          return "VALUE_INVALID";
        }
        return ["s", sharedStrings[sharedStringIndex]];
      // Boolean (TRUE/FALSE) values are stored as either "1" or "0" in cells of type "b".
      //
      // Example:
      //
      // <c r="A1" t="b">
      //   <v>1</v>
      // </c>
      //
      case "b":
        if (!v) {
          return "VALUE_MISSING";
        }
        if (v === "1") {
          return ["b", true];
        }
        if (v === "0") {
          return ["b", false];
        }
        return "VALUE_INVALID";
      // If cell type is "e", the `<v/>` element's text is an error code string (required).
      //
      // Example:
      //
      // <c r="A1" t="e">
      //   <f>1/0</f>
      //   <v>#DIV/0!</v>
      // </c>
      //
      case "e":
        if (!v) {
          return "VALUE_MISSING";
        }
        return ["e", v];
      // XLSX supports date cells of type "d", though it seems like it (almost?) never
      // uses type "d" for storing dates, preferring type "n" and numeric timestamp instead.
      // The value of a "d" cell is supposedly a string in "ISO 8601" format.
      // I haven't seen an `.xlsx` file having such cells.
      //
      // Example:
      //
      // <c r="A1" s="1" t="d">
      //   <v>
      //     2021-06-10T00:47:45.700Z
      //   </v>
      // </c>
      //
      case "d":
        if (!v) {
          return EMPTY_CELL;
        }
        var parsedDate = new Date(v);
        if (isNaN(parsedDate.valueOf())) {
          return "VALUE_INVALID";
        }
        return ["d", parsedDate.getTime()];
      // type "n" is used for numeric cells.
      //
      // An optional `s` attribute defines how this number should be formatted — 
      // it should be a zero-based index of the style (XF record) in `styles.xml`.
      //
      // Example:
      //
      // <c r="A1" s="1" t="n">
      //   <v>123.45</v>
      // </c>
      //
      case "n":
        if (!v) {
          return EMPTY_CELL;
        }
        if (s) {
          var styleId = Number(s);
          if (isNaN(styleId) || styles[styleId] === void 0) {
            return "FORMAT_INVALID";
          }
          if (isDateFormatStyle(styles[styleId], defaultDateFormat, dateTemplateParser)) {
            var timestamp = Number(v);
            if (isNaN(timestamp)) {
              return "VALUE_INVALID";
            }
            return ["d", parseExcelTimestamp(timestamp, epoch1904)];
          }
        }
        if (parseNumberCustom) {
          return ["n", v];
        }
        var number = Number(v);
        if (isNaN(number)) {
          return "VALUE_INVALID";
        }
        return ["n", number];
      default:
        return "TYPE_INVALID";
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseCellAddress.js
  function _slicedToArray2(arr, i) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray3(arr, i) || _nonIterableRest2();
  }
  function _nonIterableRest2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray3(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray3(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray3(o, minLen);
  }
  function _arrayLikeToArray3(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _iterableToArrayLimit2(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles2(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function parseCellAddress(coordinatesString) {
    var _coordinatesString$sp = coordinatesString.split(/(\d+)/), _coordinatesString$sp2 = _slicedToArray2(_coordinatesString$sp, 2), columnLetters = _coordinatesString$sp2[0], rowNumberString = _coordinatesString$sp2[1];
    var n = 0;
    var i = 0;
    while (i < columnLetters.length) {
      n *= 26;
      n += LETTERS.indexOf(columnLetters[i]);
      i++;
    }
    var columnNumberFromColumnLetters = n;
    return [
      // Row number (starting at `1`).
      Number(rowNumberString),
      // Column number (starting at `1`).
      columnNumberFromColumnLetters
    ];
  }
  var LETTERS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseSheet.js
  function _slicedToArray3(arr, i) {
    return _arrayWithHoles3(arr) || _iterableToArrayLimit3(arr, i) || _unsupportedIterableToArray4(arr, i) || _nonIterableRest3();
  }
  function _nonIterableRest3() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _iterableToArrayLimit3(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _arrayWithHoles3(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _createForOfIteratorHelperLoose2(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray4(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray4(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray4(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray4(o, minLen);
  }
  function _arrayLikeToArray4(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  var EMPTY_CELL_VALUE2 = null;
  function parseSheet(content, parseXml2, _ref) {
    var sharedStrings = _ref.sharedStrings, styles = _ref.styles, epoch1904 = _ref.epoch1904, options = _ref.options;
    var parseCellParameters = [
      sharedStrings,
      styles,
      epoch1904,
      options.dateFormat,
      // defaultDateFormat
      options.smartDateParser !== false,
      // dateTemplateParser
      options.parseNumber
      // parseNumberCustom
    ];
    var rows = [];
    var errors = [];
    var state2 = createInitialState();
    return parseXml2(content, state2, onOpenTag, onCloseTag, onText, onProgress).then(function() {
      var _state$sheetData = state2.sheetData, rowCount = _state$sheetData.rowCount, columnCount = _state$sheetData.columnCount, dataRowCount = _state$sheetData.dataRowCount, dataColumnCount = _state$sheetData.dataColumnCount;
      if (dataRowCount < rowCount) {
        rows = rows.slice(0, dataRowCount);
      }
      if (dataColumnCount < columnCount) {
        var i = 0;
        while (i < rows.length) {
          if (rows[i].length > dataColumnCount) {
            rows[i] = rows[i].slice(0, dataColumnCount);
          }
          i++;
        }
      }
      var startedAt = Date.now();
      for (var _iterator = _createForOfIteratorHelperLoose2(rows), _step; !(_step = _iterator()).done; ) {
        var row = _step.value;
        while (row.length < dataColumnCount) {
          row.push(EMPTY_CELL_VALUE2);
        }
      }
      return rows;
    });
    function createInitialState() {
      return {
        dimension: void 0,
        sheetData: void 0
      };
    }
    function getRowsFromState(state3) {
      return state3.sheetData.rows;
    }
    function setRowsInState(state3, rows2) {
      state3.sheetData.rowIndexShift += state3.sheetData.rows.length - rows2.length;
      state3.sheetData.rows = rows2;
    }
    function getErrorsFromState(state3) {
      return state3.sheetData.errors;
    }
    function setErrorsInState(state3, errors2) {
      state3.sheetData.errors = errors2;
    }
    var THROW_ON_FIRST_CELL_ERROR = true;
    function throwInvalidCellError(_ref2) {
      var row = _ref2.row, column = _ref2.column, error = _ref2.error;
      throw new InvalidSpreadsheetError("<c/> at row ".concat(row, ", col ").concat(column, ": ").concat(error));
    }
    function onProgress(end) {
      var rowsRead = getRowsFromState(state2);
      var errorsEncountered = getErrorsFromState(state2);
      if (end) {
        rows = rows.concat(rowsRead);
        errors = errors.concat(errorsEncountered);
        if (errors.length > 0) {
          throwInvalidCellError(errors[0]);
        }
      } else {
        if (rowsRead.length > 1) {
          var finalizedRows = rowsRead.slice(0, -1);
          rows = rows.concat(finalizedRows);
          errors = errors.concat(errorsEncountered);
          setRowsInState(state2, rowsRead.slice(-1));
          setErrorsInState(state2, []);
        }
      }
    }
    function onOpenTag(tagName, attributes, state3) {
      if (tagName === "dimension") {
        state3.dimension = parseSheetDimensionRef(attributes.ref);
      } else if (tagName === "sheetData") {
        state3.sheetData = createInitialStateInSheetData();
      } else if (state3.sheetData) {
        onOpenTagInSheetData(tagName, attributes, state3.sheetData);
      }
    }
    function onCloseTag(tagName, state3) {
      if (state3.sheetData) {
        onCloseTagInSheetData(tagName, state3.sheetData);
      }
    }
    function onText(text, state3) {
      if (state3.sheetData) {
        onTextInSheetData(text, state3.sheetData);
      }
    }
    function parseSheetDimensionRef(ref) {
      var dimensions = ref.split(":").map(parseCellAddress);
      if (dimensions.length === 1) {
        dimensions = [dimensions[0], dimensions[0]];
      }
      return dimensions;
    }
    function createInitialStateInSheetData() {
      return {
        c: void 0,
        rows: [],
        row: void 0,
        rowNumber: void 0,
        // How many rows have been removed from the start of `state.rows`
        // as part of `onProgress()` handler calls.
        rowIndexShift: 0,
        // Current position in the sheet.
        cursor: [0, 0],
        // Total row count.
        rowCount: 0,
        // Total column count.
        columnCount: 0,
        // Non-empty row count.
        dataRowCount: 0,
        // Non-empty column count.
        dataColumnCount: 0,
        // Cell with errors.
        errors: []
      };
    }
    function onOpenTagInSheetData(tagName, attributes, state3) {
      if (tagName === "row") {
        if (attributes.r) {
          state3.rowNumber = Number(attributes.r);
        }
        state3.row = [];
      } else if (tagName === "c") {
        state3.c = createInitialStateInCell();
        state3.c.attributes = attributes;
      } else if (state3.c) {
        onOpenTagInCell(tagName, attributes, state3.c);
      }
    }
    function onCloseTagInSheetData(tagName, state3) {
      if (tagName === "row") {
        if (state3.rowNumber) {
          var previousRowNumber = state3.rowIndexShift + state3.rows.length;
          if (state3.rowNumber <= previousRowNumber) {
            throw new InvalidSpreadsheetError("Out-of-place <row/> number ".concat(state3.rowNumber, " follows <row/> number ").concat(previousRowNumber));
          }
          while (state3.rowNumber > state3.rowIndexShift + state3.rows.length + 1) {
            state3.rows.push([]);
          }
        }
        state3.rows.push(state3.row);
        if (state3.row.length > 0) {
          state3.dataRowCount = state3.rowNumber;
        }
        if (state3.rowNumber > state3.rowCount) {
          state3.rowCount = state3.rowNumber;
        }
        state3.row = void 0;
        state3.rowNumber = void 0;
      } else if (tagName === "c") {
        var cell = parseCellFromXmlData(state3.c);
        if (cell.row < state3.cursor[0] || cell.row === state3.cursor[0] && cell.column <= state3.cursor[1]) {
          throw new InvalidSpreadsheetError("Out-of-place <c/> at row ".concat(cell.row, " col ").concat(cell.column, " follows <c/> at row ").concat(state3.cursor[0], " col ").concat(state3.cursor[1]));
        }
        state3.cursor[0] = cell.row;
        state3.cursor[1] = cell.column;
        if (!state3.rowNumber) {
          state3.rowNumber = cell.row;
        }
        if (cell.error) {
          if (THROW_ON_FIRST_CELL_ERROR) {
            throwInvalidCellError(cell);
          }
          state3.errors.push(cell);
        } else if (cell.value !== EMPTY_CELL_VALUE2) {
          while (cell.column > state3.row.length + 1) {
            state3.row.push(EMPTY_CELL_VALUE2);
          }
          state3.row.push(cell.value);
          if (cell.column > state3.dataColumnCount) {
            state3.dataColumnCount = cell.column;
          }
        }
        if (cell.column > state3.columnCount) {
          state3.columnCount = cell.column;
        }
        state3.c = void 0;
      } else if (state3.c) {
        onCloseTagInCell(tagName, state3.c);
      }
    }
    function onTextInSheetData(text, state3) {
      if (state3.c) {
        onTextInCell(text, state3.c);
      }
    }
    function parseCellFromXmlData(_ref3) {
      var attributes = _ref3.attributes, inlineString = _ref3.inlineString, vText = _ref3.vText;
      var _parseCellAddress = parseCellAddress(attributes.r), _parseCellAddress2 = _slicedToArray3(_parseCellAddress, 2), row = _parseCellAddress2[0], column = _parseCellAddress2[1];
      var errorOrTypeAndValue = parseCellAndTrimValue(attributes.t, attributes.s, vText, inlineString, parseCellParameters, options.trim !== false);
      if (typeof errorOrTypeAndValue === "string") {
        return {
          row,
          column,
          error: errorOrTypeAndValue
          // // Report the "raw" unparsed value of the cell for potential debugging.
          // // Also report the cell type and the format in case of a numeric value.
          // //
          // // For "inline string" cells, the value should actually be the `inlineString` argument
          // // rather than `vText` argument, but the only case when it could throw an error
          // // when parsing an "inline string" cell is `VALUE_MISSING` which means that
          // // `inlineString` argument is `undefined`, same as `vText` argument in this case,
          // // so the resulting `value` property is correct anyway.
          // //
          // value: vText,
          // type: attributes.t,
          // formatId: attributes.s
        };
      }
      return {
        row,
        column,
        value: parseCellValue(errorOrTypeAndValue[1], errorOrTypeAndValue[0])
      };
    }
    function parseCellAndTrimValue(t, s, v, inlineString, parameters, trimStrings) {
      var errorOrTypeAndValue = parseCellWithRepairAbility(t, s, v, inlineString, parameters);
      if (Array.isArray(errorOrTypeAndValue) && errorOrTypeAndValue[0] === "s") {
        if (trimStrings) {
          errorOrTypeAndValue[1] = errorOrTypeAndValue[1].trim();
        }
        if (errorOrTypeAndValue[1] === "") {
          return EMPTY_CELL;
        }
      }
      return errorOrTypeAndValue;
    }
    function parseCellWithRepairAbility(t, s, v, inlineString, parameters) {
      var errorOrTypeAndValue = parseCell(t, s, v, inlineString, parameters);
      if (errorOrTypeAndValue === "VALUE_MISSING") {
        switch (t || "n") {
          // * If the cell is defined by a formula.
          // * Or contains an inline string.
          // * Or contains a shared string.
          // * Or contains a boolean value.
          case "str":
          case "inlineStr":
          case "s":
          case "b":
            return EMPTY_CELL;
        }
      }
      if (t === "e") {
        return EMPTY_CELL;
      }
      return errorOrTypeAndValue;
    }
    function parseCellValue(value, type) {
      if (type === "n") {
        if (options.parseNumber) {
          return options.parseNumber(value);
        }
        return value;
      } else if (type === "d") {
        return new Date(value);
      } else {
        return value;
      }
    }
    function createInitialStateInCell() {
      return {
        v: false,
        is: false,
        t: false,
        r: false,
        rPh: false,
        vText: void 0,
        inlineString: void 0,
        attributes: void 0
      };
    }
    function onOpenTagInCell(tagName, attributes, state3) {
      if (tagName === "v") {
        state3.v = true;
      } else if (tagName === "is") {
        state3.is = true;
        state3.inlineString = "";
      } else if (tagName === "t") {
        state3.t = true;
      } else if (tagName === "r") {
        state3.r = true;
      } else if (tagName === "rPh") {
        state3.rPh = true;
      }
    }
    function onCloseTagInCell(tagName, state3) {
      if (tagName === "v") {
        state3.v = false;
        state3.vText || (state3.vText = "");
      } else if (tagName === "is") {
        state3.is = false;
      } else if (tagName === "t") {
        state3.t = false;
      } else if (tagName === "r") {
        state3.r = false;
      } else if (tagName === "rPh") {
        state3.rPh = false;
      }
    }
    function onTextInCell(text, state3) {
      if (state3.v) {
        state3.vText = text;
      } else if (state3.is) {
        if (state3.rPh) {
        } else if (state3.t) {
          if (state3.r) {
            state3.inlineString += text;
          } else {
            state3.inlineString = text;
          }
        }
      }
    }
    function getSheetDimensions(cells) {
      var minRow = cells.length === 0 ? 0 : 1;
      var minCol = cells.length === 0 ? 0 : 1;
      var maxRow = 0;
      var maxCol = 0;
      for (var _iterator2 = _createForOfIteratorHelperLoose2(cells), _step2; !(_step2 = _iterator2()).done; ) {
        var cell = _step2.value;
        if (maxRow < cell.row) {
          maxRow = cell.row;
        }
        if (maxCol < cell.column) {
          maxCol = cell.column;
        }
      }
      return [[minRow, minCol], [maxRow, maxCol]];
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/utility/convertValuesFromUint8ArraysToStrings.js
  function convertValuesFromUint8ArraysToStrings(entries) {
    checkpoint("convert files to strings");
    var convertedEntries = {};
    for (var _i = 0, _Object$keys = Object.keys(entries); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      convertedEntries[key] = strFromU82(entries[key]);
    }
    return convertedEntries;
  }
  function strFromU82(data) {
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(data);
    } else {
      return strFromU8(data);
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/utility/isPromise.js
  function _typeof6(o) {
    "@babel/helpers - typeof";
    return _typeof6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof6(o);
  }
  function isPromise(anything) {
    return _typeof6(anything) === "object" && typeof anything.then === "function";
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/SheetNotFoundError.js
  function _typeof7(o) {
    "@babel/helpers - typeof";
    return _typeof7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof7(o);
  }
  function _defineProperties4(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey5(descriptor.key), descriptor);
    }
  }
  function _createClass4(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties4(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties4(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey5(arg) {
    var key = _toPrimitive5(arg, "string");
    return _typeof7(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive5(input, hint) {
    if (_typeof7(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof7(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _classCallCheck4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits4(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    Object.defineProperty(subClass, "prototype", { writable: false });
    if (superClass) _setPrototypeOf4(subClass, superClass);
  }
  function _createSuper4(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct4();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf4(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf4(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn4(this, result);
    };
  }
  function _possibleConstructorReturn4(self, call) {
    if (call && (_typeof7(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized4(self);
  }
  function _assertThisInitialized4(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _wrapNativeSuper4(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper4 = function _wrapNativeSuper5(Class2) {
      if (Class2 === null || !_isNativeFunction4(Class2)) return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct4(Class2, arguments, _getPrototypeOf4(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf4(Wrapper, Class2);
    };
    return _wrapNativeSuper4(Class);
  }
  function _construct4(Parent, args, Class) {
    if (_isNativeReflectConstruct4()) {
      _construct4 = Reflect.construct.bind();
    } else {
      _construct4 = function _construct5(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2) _setPrototypeOf4(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct4.apply(null, arguments);
  }
  function _isNativeReflectConstruct4() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction4(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf4(o, p) {
    _setPrototypeOf4 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf5(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf4(o, p);
  }
  function _getPrototypeOf4(o) {
    _getPrototypeOf4 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf5(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf4(o);
  }
  var SheetNotFoundError = /* @__PURE__ */ function(_Error) {
    _inherits4(SheetNotFoundError2, _Error);
    var _super = _createSuper4(SheetNotFoundError2);
    function SheetNotFoundError2(message) {
      var _this;
      _classCallCheck4(this, SheetNotFoundError2);
      _this = _super.call(this, message);
      _this.name = "SheetNotFoundError";
      return _this;
    }
    return _createClass4(SheetNotFoundError2);
  }(/* @__PURE__ */ _wrapNativeSuper4(Error));

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xlsx/parseSpreadsheetContents.js
  function _typeof8(o) {
    "@babel/helpers - typeof";
    return _typeof8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof8(o);
  }
  function _createForOfIteratorHelperLoose3(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray5(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray5(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray5(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray5(o, minLen);
  }
  function _arrayLikeToArray5(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function ownKeys2(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
        _defineProperty2(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _defineProperty2(obj, key, value) {
    key = _toPropertyKey6(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey6(arg) {
    var key = _toPrimitive6(arg, "string");
    return _typeof8(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive6(input, hint) {
    if (_typeof8(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof8(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var CAN_USE_WORKER = false;
  function parseSpreadsheetContents(parseXml2, contents_) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var contents = convertValuesFromUint8ArraysToStrings(contents_);
    checkpoint("parse spreadsheet info and file paths");
    return readFiles(getXmlFilesAtFixedPaths(), contents, parseXml2).then(function(_ref) {
      var spreadsheetInfo = _ref.spreadsheetInfo, filePaths = _ref.filePaths;
      checkpoint('parse "shared strings" and "styles"');
      return readFiles(getXmlFilesAtNonFixedPaths(filePaths), contents, parseXml2).then(function(_ref2) {
        var sharedStrings = _ref2.sharedStrings, styles = _ref2.styles;
        var sheetRelationIdsToRead = options.sheets ? options.sheets.map(function(sheet) {
          return getSheetRelationId(sheet, spreadsheetInfo.sheets);
        }) : spreadsheetInfo.sheets.map(function(_) {
          return _.relationId;
        });
        checkpoint("parse sheet".concat(sheetRelationIdsToRead.length === 1 ? "" : "s", " data"));
        return readFiles(getSheetDataXmlFiles(filePaths, sheetRelationIdsToRead, {
          sharedStrings,
          styles,
          epoch1904: spreadsheetInfo.epoch1904,
          options
        }), contents, parseXml2).then(function(sheetsData) {
          checkpoint("end");
          return sheetRelationIdsToRead.map(function(sheetRelationId) {
            return {
              sheet: getSheetNameByRelationId(sheetRelationId, spreadsheetInfo.sheets),
              data: sheetsData[sheetRelationId]
            };
          });
        });
      });
    });
  }
  function parseSpreadsheetContentsInWorker(createWorkerFunction2, parseXml2, contents, options) {
    if (!(options && options.parseNumber)) {
      options = _objectSpread2(_objectSpread2({}, options), {}, {
        parseNumber: null
      });
    }
    if (!createWorkerFunction2 || !CAN_USE_WORKER) {
      return parseSpreadsheetContents(parseXml2, contents, options);
    }
  }
  function getSheetRelationId(sheet, sheets) {
    if (typeof sheet === "string") {
      for (var _iterator = _createForOfIteratorHelperLoose3(sheets), _step; !(_step = _iterator()).done; ) {
        var _sheet = _step.value;
        if (_sheet.name === sheet) {
          return _sheet.relationId;
        }
      }
      throw new SheetNotFoundError('Sheet "'.concat(sheet, '" not found. Available sheets: ').concat(sheets.map(function(_ref3) {
        var name = _ref3.name;
        return '"'.concat(name, '"');
      }).join(", ")));
    } else {
      if (sheet <= sheets.length) {
        return sheets[sheet - 1].relationId;
      }
      throw new SheetNotFoundError("Sheet number out of bounds: ".concat(sheet, ". Available sheets count: ").concat(sheets.length));
    }
  }
  function getSheetNameByRelationId(sheetRelationId, sheets) {
    for (var _iterator2 = _createForOfIteratorHelperLoose3(sheets), _step2; !(_step2 = _iterator2()).done; ) {
      var sheet = _step2.value;
      if (sheet.relationId === sheetRelationId) {
        return sheet.name;
      }
    }
    throw new Error("Sheet relation ID not found: ".concat(sheetRelationId));
  }
  function getXmlFilesAtFixedPaths() {
    return {
      // Read the paths to certain files inside the `.xlsx` file, which is itself just a `.zip` archive.
      // These paths aren't standardized between different spreadsheet editors.
      // https://github.com/tidyverse/readxl/issues/104
      "xl/_rels/workbook.xml.rels": {
        name: "filePaths",
        parse: parseFilePaths
      },
      // General info on the spreadsheet.
      "xl/workbook.xml": {
        name: "spreadsheetInfo",
        parse: parseSpreadsheetInfo
      }
    };
  }
  function getXmlFilesAtNonFixedPaths(filePaths) {
    var _ref4;
    return _ref4 = {}, _defineProperty2(_ref4, filePaths.sharedStrings || "xl/sharedStrings.xml", {
      name: "sharedStrings",
      // `parseSharedStrings()` returns a `Promise`.
      parse: parseSharedStrings,
      // It seems that "sharedStrings.xml" is not required to exist.
      // For example, that could be the case when a spreadsheet doesn't contain any strings.
      // https://github.com/catamphetamine/read-excel-file/issues/85
      fallback: []
    }), _defineProperty2(_ref4, filePaths.styles || "xl/styles.xml", {
      name: "styles",
      parse: parseStyles,
      fallback: {}
    }), _ref4;
  }
  function getSheetDataXmlFiles(filePaths, sheetRelationIdsToRead, sheetDataParserParameters) {
    return Object.keys(filePaths.sheets).filter(function(sheetRelationId) {
      return sheetRelationIdsToRead.includes(sheetRelationId);
    }).reduce(function(filesInfo, sheetRelationId) {
      return _objectSpread2(_objectSpread2({}, filesInfo), {}, _defineProperty2({}, filePaths.sheets[sheetRelationId], {
        name: sheetRelationId,
        // `parseSheet()` returns a `Promise`.
        parse: function parse(content, parseXml2) {
          return parseSheet(content, parseXml2, sheetDataParserParameters);
        }
      }));
    }, {});
  }
  function readFiles(filesInfo, contents, parseXml2) {
    var results = {};
    var _loop = function _loop3() {
      var filePath = _Object$keys[_i];
      var fileInfo = filesInfo[filePath];
      results[fileInfo.name] = contents[filePath] === void 0 ? fileInfo.fallback === void 0 ? function() {
        throw new InvalidSpreadsheetError('"'.concat(filePath, '" file not found inside the `.xlsx` file'));
      }() : fileInfo.fallback : fileInfo.parse(contents[filePath], parseXml2);
    };
    for (var _i = 0, _Object$keys = Object.keys(filesInfo); _i < _Object$keys.length; _i++) {
      _loop();
    }
    var promises = [];
    var _loop2 = function _loop22() {
      var name = _Object$keys2[_i2];
      if (isPromise(results[name])) {
        promises.push(results[name].then(function(result) {
          results[name] = result;
        }));
      }
    };
    for (var _i2 = 0, _Object$keys2 = Object.keys(results); _i2 < _Object$keys2.length; _i2++) {
      _loop2();
    }
    if (promises.length > 0) {
      return Promise.all(promises).then(function() {
        return results;
      });
    }
    return results;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/export/readXlsxFileUniversal.js
  var createWorkerFunction = void 0;
  function readXlsxFile(input, options) {
    return unpackXlsxFile(input).then(function(contents) {
      return parseSpreadsheetContentsInWorker(createWorkerFunction, parseXml, contents, options);
    });
  }

  // app.source.js
  var API_URL = window.TINPLATE_API_URL || "https://tinplate-flow-api.eugenelim831-1b3.workers.dev";
  var APP_BUILD = "20260805-import-fix-1";
  var PIN_STORAGE_KEY = "movementAppPin";
  var LOCATIONS = ["STORAGE", "PRINTING", "SLITTER", "PRODUCTION_LINE"];
  var LOCATION_LABELS = {
    STORAGE: "Storage",
    PRINTING: "Printing",
    SLITTER: "Slitter",
    PRODUCTION_LINE: "Production Line",
    EXCEL_IMPORT: "Excel Import"
  };
  var PURPOSE_LABELS = {
    CUSTOMER_BRAND: "Customer / Brand",
    COATING: "Coating",
    INTERNAL: "Stock / Internal"
  };
  var state = {
    lots: [],
    records: [],
    knownBatchNumbers: /* @__PURE__ */ new Set(),
    currentLocation: "STORAGE",
    selectedLotIds: /* @__PURE__ */ new Set(),
    selectedRecord: null,
    signatureUrls: [],
    importPreview: null
  };
  var $ = function(selector) {
    return document.querySelector(selector);
  };
  var $$ = function(selector) {
    return Array.from(document.querySelectorAll(selector));
  };
  document.documentElement.dataset.appBuild = APP_BUILD;
  function showToast(message, error) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.className = "toast show" + (error ? " error" : "");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function() {
      toast.className = "toast";
    }, 4500);
  }
  function getPin() {
    return localStorage.getItem(PIN_STORAGE_KEY) || "";
  }
  async function api(path, options, pinOverride) {
    const settings = options || {};
    const headers = Object.assign(
      { "Content-Type": "application/json", "X-App-Pin": pinOverride == null ? getPin() : pinOverride },
      settings.headers || {}
    );
    const response = await fetch(API_URL.replace(/\/$/, "") + path, Object.assign({}, settings, { headers }));
    const body = await response.json().catch(function() {
      return {};
    });
    if (!response.ok) throw new Error(body.error || "Request failed (" + response.status + ").");
    return body;
  }
  async function apiBlob(path) {
    const response = await fetch(API_URL.replace(/\/$/, "") + path, {
      headers: { "X-App-Pin": getPin() }
    });
    if (!response.ok) {
      const body = await response.json().catch(function() {
        return {};
      });
      throw new Error(body.error || "Unable to load signature.");
    }
    return response.blob();
  }
  function setLoggedIn(loggedIn) {
    $("#loginScreen").classList.toggle("hidden", loggedIn);
    $("#appShell").classList.toggle("hidden", !loggedIn);
    if (!loggedIn) {
      $("#loginPin").value = "";
      setTimeout(function() {
        $("#loginPin").focus();
      }, 50);
    }
  }
  async function authenticate(pin, quiet) {
    const button = $("#loginButton");
    button.disabled = true;
    button.textContent = "Checking\u2026";
    try {
      await api("/health", { method: "GET" }, pin);
      localStorage.setItem(PIN_STORAGE_KEY, pin);
      setLoggedIn(true);
      await Promise.all([loadInventory(), loadRecords(false)]);
      if (!quiet) showToast("Logged in successfully.");
      return true;
    } catch (error) {
      localStorage.removeItem(PIN_STORAGE_KEY);
      setLoggedIn(false);
      if (!quiet) showToast(error.message, true);
      return false;
    } finally {
      button.disabled = false;
      button.textContent = "Log In";
    }
  }
  $("#loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    authenticate($("#loginPin").value, false);
  });
  $("#logoutButton").addEventListener("click", function() {
    localStorage.removeItem(PIN_STORAGE_KEY);
    state.lots = [];
    state.records = [];
    state.knownBatchNumbers.clear();
    state.importPreview = null;
    state.selectedLotIds.clear();
    setLoggedIn(false);
    showToast("Logged out.");
  });
  function setupSignature(canvas) {
    const context = canvas.getContext("2d");
    let drawing = false;
    let hasInk = false;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const saved = hasInk ? canvas.toDataURL("image/png") : "";
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2.2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#18312b";
      if (saved) {
        const image = new Image();
        image.onload = function() {
          context.drawImage(image, 0, 0, rect.width, rect.height);
        };
        image.src = saved;
      }
    }
    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    canvas.addEventListener("pointerdown", function(event) {
      drawing = true;
      hasInk = true;
      canvas.setPointerCapture(event.pointerId);
      const p = point(event);
      context.beginPath();
      context.moveTo(p.x, p.y);
    });
    canvas.addEventListener("pointermove", function(event) {
      if (!drawing) return;
      const p = point(event);
      context.lineTo(p.x, p.y);
      context.stroke();
    });
    canvas.addEventListener("pointerup", function() {
      drawing = false;
    });
    canvas.addEventListener("pointercancel", function() {
      drawing = false;
    });
    canvas.clearSignature = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      hasInk = false;
    };
    canvas.signatureData = function() {
      return hasInk ? canvas.toDataURL("image/png") : "";
    };
    canvas.prepareSignature = function() {
      requestAnimationFrame(resize);
    };
    if (typeof ResizeObserver === "function") {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener("resize", resize);
      resize();
    }
  }
  $$(".signature").forEach(setupSignature);
  $$(".clear-signature").forEach(function(button) {
    button.addEventListener("click", function() {
      document.getElementById(button.dataset.canvas).clearSignature();
    });
  });
  $$(".close-dialog").forEach(function(button) {
    button.addEventListener("click", function() {
      button.closest("dialog").close();
    });
  });
  $("#recordDialog").addEventListener("close", revokeSignatureUrls);
  function revokeSignatureUrls() {
    state.signatureUrls.forEach(function(url) {
      URL.revokeObjectURL(url);
    });
    state.signatureUrls = [];
  }
  function activateLocation(location) {
    state.currentLocation = location;
    state.selectedLotIds.clear();
    $$(".tab").forEach(function(button) {
      button.classList.toggle("active", button.dataset.location === location);
    });
    $("#inventoryPanel").classList.add("active");
    $("#recordsPanel").classList.remove("active");
    $("#locationTitle").textContent = LOCATION_LABELS[location];
    $("#importStock").classList.toggle("hidden", location !== "STORAGE");
    $("#slitSelected").classList.toggle("hidden", location !== "SLITTER");
    renderInventory();
  }
  $$(".tab[data-location]").forEach(function(button) {
    button.addEventListener("click", function() {
      activateLocation(button.dataset.location);
    });
  });
  $(".tab[data-view='records']").addEventListener("click", function(event) {
    $$(".tab").forEach(function(button) {
      button.classList.toggle("active", button === event.currentTarget);
    });
    $("#inventoryPanel").classList.remove("active");
    $("#recordsPanel").classList.add("active");
    loadRecords(true);
  });
  async function loadInventory() {
    $("#inventoryBody").innerHTML = '<tr><td colspan="9" class="empty-cell">Loading current stock\u2026</td></tr>';
    try {
      const result = await api("/inventory");
      state.lots = Array.isArray(result.lots) ? result.lots : [];
      state.knownBatchNumbers = new Set(Array.isArray(result.knownBatchNumbers) ? result.knownBatchNumbers : state.lots.map(function(lot) {
        return lot.batchNumber;
      }));
      removeInvalidSelections();
      renderInventory();
    } catch (error) {
      $("#inventoryBody").innerHTML = '<tr><td colspan="9" class="empty-cell">' + escapeHtml(error.message) + "</td></tr>";
      showToast(error.message, true);
    }
  }
  function removeInvalidSelections() {
    const valid = new Set(state.lots.filter(function(lot) {
      return lot.location === state.currentLocation && Number(lot.quantity) > 0;
    }).map(function(lot) {
      return lot.lotId;
    }));
    Array.from(state.selectedLotIds).forEach(function(id) {
      if (!valid.has(id)) state.selectedLotIds.delete(id);
    });
  }
  function currentLocationLots() {
    return state.lots.filter(function(lot) {
      return lot.location === state.currentLocation && Number(lot.quantity) > 0;
    });
  }
  function filteredLots() {
    const term = $("#inventorySearch").value.trim().toLowerCase();
    const unit = $("#inventoryUnitFilter").value;
    return currentLocationLots().filter(function(lot) {
      const text = [
        lot.lotId,
        lot.batchNumber,
        lot.dimensions,
        lot.customer,
        lot.brand,
        lot.description,
        lot.coatingDescription,
        lot.supplierName,
        lot.temper,
        lot.tinCoating,
        lot.dateReceived
      ].join(" ").toLowerCase();
      return (!term || text.includes(term)) && (!unit || lot.unit === unit);
    });
  }
  function renderInventory() {
    const all = currentLocationLots();
    const lots = filteredLots();
    $("#lotCount").textContent = formatNumber(all.length);
    $("#sheetCount").textContent = formatNumber(sumUnit(all, "SHEETS"));
    $("#blankCount").textContent = formatNumber(sumUnit(all, "BLANKS"));
    $("#selectedCount").textContent = formatNumber(state.selectedLotIds.size);
    $("#openingStockNotice").classList.toggle("hidden", state.lots.length !== 0);
    if (!lots.length) {
      const message = state.lots.length ? "No stock matches this location and filter." : "No opening stock has been loaded.";
      $("#inventoryBody").innerHTML = '<tr><td colspan="9" class="empty-cell">' + message + "</td></tr>";
    } else {
      $("#inventoryBody").innerHTML = lots.map(function(lot) {
        const customerBrand = [lot.customer, lot.brand].filter(Boolean).join(" / ") || "\u2014";
        const description = [lot.description, lot.coatingDescription].filter(Boolean).join(" \xB7 ") || "\u2014";
        const supplierSpec = [
          lot.supplierName,
          lot.temper ? "Temper " + lot.temper : "",
          lot.tinCoating ? "Tin " + lot.tinCoating : "",
          lot.dateReceived ? "Received " + lot.dateReceived : ""
        ].filter(Boolean).join(" \xB7 ") || "\u2014";
        return '<tr><td class="select-column"><input class="lot-checkbox" type="checkbox" data-lot-id="' + escapeHtml(lot.lotId) + '"' + (state.selectedLotIds.has(lot.lotId) ? " checked" : "") + ' aria-label="Select ' + escapeHtml(lot.lotId) + '"></td><td><strong>' + escapeHtml(lot.lotId) + "</strong></td><td>" + escapeHtml(lot.batchNumber) + "</td><td>" + escapeHtml(lot.dimensions) + '</td><td class="quantity-cell"><strong>' + formatNumber(lot.quantity) + "</strong><span>" + unitLabel(lot.unit) + '</span></td><td class="description-cell">' + escapeHtml(supplierSpec) + '</td><td class="description-cell">' + escapeHtml(customerBrand) + '</td><td class="description-cell">' + escapeHtml(description) + "</td><td>" + formatDate(lot.updatedAt) + "</td></tr>";
      }).join("");
      $$("#inventoryBody .lot-checkbox").forEach(function(checkbox) {
        checkbox.addEventListener("change", function() {
          if (checkbox.checked) state.selectedLotIds.add(checkbox.dataset.lotId);
          else state.selectedLotIds.delete(checkbox.dataset.lotId);
          updateSelectionControls();
        });
      });
    }
    updateSelectionControls();
  }
  function updateSelectionControls() {
    const selected = selectedLots();
    $("#selectedCount").textContent = formatNumber(selected.length);
    $("#transferSelected").disabled = selected.length === 0;
    $("#slitSelected").disabled = selected.length !== 1 || selected[0].unit !== "SHEETS";
  }
  function selectedLots() {
    return state.lots.filter(function(lot) {
      return state.selectedLotIds.has(lot.lotId);
    });
  }
  function sumUnit(lots, unit) {
    return lots.filter(function(lot) {
      return lot.unit === unit;
    }).reduce(function(total, lot) {
      return total + Number(lot.quantity || 0);
    }, 0);
  }
  $("#refreshInventory").addEventListener("click", loadInventory);
  $("#inventorySearch").addEventListener("input", renderInventory);
  $("#inventoryUnitFilter").addEventListener("change", renderInventory);
  var STOCK_COLUMN_ALIASES = {
    batchNumber: ["BATCHNO", "BATCHNUMBER", "BATCH"],
    supplierName: ["SUPPLIERNAME", "SUPPLIER"],
    dimensions: ["SIZE", "DIMENSIONS", "DIMENSION"],
    temper: ["TEMP", "TEMPER"],
    tinCoating: ["TINCOATING", "COATING"],
    sheets: ["SHEETS", "SHEETQUANTITY", "QUANTITY", "QTY"],
    kg: ["KG", "WEIGHTKG", "WEIGHT"],
    price: ["PRICE", "UNITPRICE"],
    totalAmount: ["TOTALAMOUNT", "AMOUNT", "TOTAL"],
    dateReceived: ["DATERECEIVED", "DATERECVED", "RECEIVEDDATE", "RECEIPTDATE"]
  };
  $("#importStock").addEventListener("click", openImportDialog);
  $("#stockFile").addEventListener("change", handleStockFile);
  function openImportDialog() {
    if (state.currentLocation !== "STORAGE") return showToast("Stock files can be imported only from the Storage tab.", true);
    $("#importForm").reset();
    $("#importSignature").clearSignature();
    $("#importPreview").classList.add("hidden");
    $("#importApproval").classList.add("hidden");
    $("#importReading").classList.add("hidden");
    $("#submitImport").disabled = true;
    $("#submitImport").textContent = "Import New Batches";
    state.importPreview = null;
    $("#importDialog").showModal();
    $("#importSignature").prepareSignature();
  }
  async function handleStockFile(event) {
    const file = event.target.files && event.target.files[0];
    state.importPreview = null;
    $("#importPreview").classList.add("hidden");
    $("#importApproval").classList.add("hidden");
    $("#submitImport").disabled = true;
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) {
      event.target.value = "";
      return showToast("Select an Excel .xlsx file.", true);
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      return showToast("The Excel file must be 10 MB or smaller.", true);
    }
    $("#importReading").classList.remove("hidden");
    try {
      const workbook = await readXlsxFile(await readFileAsArrayBuffer(file));
      const preview = buildStockImportPreview(workbook, file.name);
      state.importPreview = preview;
      renderStockImportPreview(preview);
    } catch (error) {
      showToast(error.message || "The Excel file could not be read.", true);
    } finally {
      $("#importReading").classList.add("hidden");
    }
  }
  function readFileAsArrayBuffer(file) {
    if (typeof file.arrayBuffer === "function") return file.arrayBuffer();
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(new Error("The Excel file could not be read."));
      };
      reader.readAsArrayBuffer(file);
    });
  }
  function buildStockImportPreview(workbook, fileName) {
    if (!Array.isArray(workbook) || workbook.length === 0) throw new Error("The Excel workbook contains no worksheets.");
    let match = null;
    workbook.some(function(sheet) {
      const data = Array.isArray(sheet.data) ? sheet.data : [];
      for (let rowIndex = 0; rowIndex < Math.min(data.length, 40); rowIndex += 1) {
        const headerMap = stockHeaderMap(data[rowIndex] || []);
        if (headerMap.batchNumber != null && headerMap.dimensions != null && headerMap.sheets != null) {
          match = { sheet: sheet.sheet || "Sheet " + (workbook.indexOf(sheet) + 1), data, headerIndex: rowIndex, headerMap };
          return true;
        }
      }
      return false;
    });
    if (!match) throw new Error("No worksheet has the required Batch No, Size and Sheets headers.");
    const rows = [];
    const seenInFile = /* @__PURE__ */ new Set();
    const dataRows = match.data.slice(match.headerIndex + 1);
    if (dataRows.length > 1e3) throw new Error("The worksheet has more than 1,000 rows. Split it into smaller import files.");
    dataRows.forEach(function(cells, offset) {
      const rawBatch = stockCell(cells, match.headerMap.batchNumber);
      const rawDimensions = stockCell(cells, match.headerMap.dimensions);
      const rawSheets = stockCell(cells, match.headerMap.sheets);
      if (isBlankCell(rawBatch) && isBlankCell(rawDimensions)) return;
      const errors = [];
      const batchNumber = normalizeImportedBatch(rawBatch);
      const dimensions = normalizeImportedDimensions(rawDimensions);
      const sheets = importedWholeNumber(rawSheets);
      if (!/^\d+\/\d+$/.test(batchNumber)) errors.push("Batch must use integer/integer format");
      if (!/^0\.\d+\*\d+\*\d+$/.test(dimensions)) errors.push("Size must use 0.integer*integer*integer format");
      if (!Number.isSafeInteger(sheets) || sheets <= 0) errors.push("Sheets must be a positive whole number");
      const kgResult = importedOptionalNumber(stockCell(cells, match.headerMap.kg));
      const priceResult = importedOptionalNumber(stockCell(cells, match.headerMap.price));
      const amountResult = importedOptionalNumber(stockCell(cells, match.headerMap.totalAmount));
      if (kgResult.invalid) errors.push("KG must be a non-negative number");
      if (priceResult.invalid) errors.push("Price must be a non-negative number");
      if (amountResult.invalid) errors.push("Total amount must be a non-negative number");
      let result = "NEW";
      if (errors.length) result = "INVALID";
      else if (seenInFile.has(batchNumber)) result = "DUPLICATE_IN_FILE";
      else if (state.knownBatchNumbers.has(batchNumber)) result = "DUPLICATE_EXISTING";
      if (!errors.length) seenInFile.add(batchNumber);
      rows.push({
        sourceRow: match.headerIndex + offset + 2,
        batchNumber,
        supplierName: importedText(stockCell(cells, match.headerMap.supplierName), 180),
        dimensions,
        temper: importedText(stockCell(cells, match.headerMap.temper), 80),
        tinCoating: importedText(stockCell(cells, match.headerMap.tinCoating), 80),
        sheets: Number.isSafeInteger(sheets) ? sheets : null,
        kg: kgResult.value,
        price: priceResult.value,
        totalAmount: amountResult.value,
        dateReceived: normalizeImportedDate(stockCell(cells, match.headerMap.dateReceived)),
        result,
        errors
      });
    });
    if (!rows.length) throw new Error("No stock rows were found below the worksheet headers.");
    const invalidCount = rows.filter(function(row) {
      return row.result === "INVALID";
    }).length;
    const newCount = rows.filter(function(row) {
      return row.result === "NEW";
    }).length;
    const ignoredCount = rows.filter(function(row) {
      return row.result === "DUPLICATE_EXISTING" || row.result === "DUPLICATE_IN_FILE";
    }).length;
    return {
      fileName: fileName.slice(0, 180),
      sourceSheet: String(match.sheet).slice(0, 120),
      headerRow: match.headerIndex + 1,
      rows,
      validRows: rows.filter(function(row) {
        return row.result !== "INVALID";
      }),
      invalidCount,
      newCount,
      ignoredCount
    };
  }
  function stockHeaderMap(row) {
    const normalized = row.map(normalizeStockHeader);
    const result = {};
    Object.keys(STOCK_COLUMN_ALIASES).forEach(function(field) {
      const index = normalized.findIndex(function(header) {
        return STOCK_COLUMN_ALIASES[field].includes(header);
      });
      if (index >= 0) result[field] = index;
    });
    return result;
  }
  function normalizeStockHeader(value) {
    return String(value == null ? "" : value).toUpperCase().replace(/[^A-Z0-9]/g, "");
  }
  function stockCell(row, index) {
    return index == null || !Array.isArray(row) ? null : row[index];
  }
  function isBlankCell(value) {
    return value == null || String(value).trim() === "";
  }
  function normalizeImportedBatch(value) {
    return String(value == null ? "" : value).trim().replace(/\s/g, "");
  }
  function normalizeImportedDimensions(value) {
    return String(value == null ? "" : value).trim().replace(/[×x]/gi, "*").replace(/\s/g, "");
  }
  function importedWholeNumber(value) {
    if (typeof value === "number") return value;
    return Number(String(value == null ? "" : value).replace(/,/g, "").trim());
  }
  function importedOptionalNumber(value) {
    if (isBlankCell(value)) return { value: null, invalid: false };
    const number = typeof value === "number" ? value : Number(String(value).replace(/RM/gi, "").replace(/,/g, "").trim());
    return { value: Number.isFinite(number) && number >= 0 ? number : null, invalid: !Number.isFinite(number) || number < 0 };
  }
  function importedText(value, maximum) {
    return String(value == null ? "" : value).trim().replace(/\u0000/g, "").slice(0, maximum);
  }
  function normalizeImportedDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    const text = importedText(value, 40).replace(/\/{2,}/g, "/");
    const match = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2}|\d{4})$/);
    if (!match) return text;
    const year = Number(match[3]) < 100 ? 2e3 + Number(match[3]) : Number(match[3]);
    const month = Number(match[2]);
    const day = Number(match[1]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return text;
    return String(year).padStart(4, "0") + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }
  function renderStockImportPreview(preview) {
    $("#importFoundCount").textContent = formatNumber(preview.rows.length);
    $("#importNewCount").textContent = formatNumber(preview.newCount);
    $("#importIgnoredCount").textContent = formatNumber(preview.ignoredCount);
    $("#importInvalidCount").textContent = formatNumber(preview.invalidCount);
    $("#importSheetInfo").textContent = preview.fileName + " \xB7 " + preview.sourceSheet + " \xB7 headers on row " + preview.headerRow;
    $("#importPreviewBody").innerHTML = preview.rows.map(function(row) {
      const resultLabel = row.result === "NEW" ? "Add to Storage" : row.result === "DUPLICATE_EXISTING" ? "Ignore \u2014 already in records" : row.result === "DUPLICATE_IN_FILE" ? "Ignore \u2014 repeated in file" : "Invalid \u2014 " + row.errors.join("; ");
      return '<tr class="' + row.result + '"><td>' + row.sourceRow + "</td><td>" + escapeHtml(row.batchNumber || "\u2014") + "</td><td>" + escapeHtml(row.dimensions || "\u2014") + "</td><td>" + (row.sheets == null ? "\u2014" : formatNumber(row.sheets)) + "</td><td>" + escapeHtml(row.supplierName || "\u2014") + '</td><td class="import-result ' + row.result + '">' + escapeHtml(resultLabel) + "</td></tr>";
    }).join("");
    const ready = preview.invalidCount === 0 && preview.newCount > 0;
    const message = preview.invalidCount ? "Correct the invalid Excel rows before importing. No stock has been saved." : preview.newCount === 0 ? "Every valid batch is already in the system or repeated in this file. There is nothing new to import." : preview.newCount + " new batch" + (preview.newCount === 1 ? " is" : "es are") + " ready. " + preview.ignoredCount + " duplicate row" + (preview.ignoredCount === 1 ? " will" : "s will") + " be ignored.";
    $("#importValidationMessage").textContent = message;
    $("#importValidationMessage").className = "info-banner" + (preview.invalidCount ? " error" : "");
    $("#importPreview").classList.remove("hidden");
    $("#importApproval").classList.toggle("hidden", !ready);
    $("#submitImport").disabled = !ready;
    if (ready) $("#importSignature").prepareSignature();
  }
  $("#importForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const preview = state.importPreview;
    if (!preview || preview.invalidCount || preview.newCount < 1) return showToast("Select and validate a stock workbook first.", true);
    const signature = $("#importSignature").signatureData();
    if (!signature) return showToast("Importing PIC signature is required.", true);
    const picName = $("#importPic").value.trim();
    if (!picName) return showToast("Importing PIC is required.", true);
    const button = $("#submitImport");
    button.disabled = true;
    button.textContent = "Importing\u2026";
    try {
      const rows = preview.validRows.map(function(row) {
        return {
          sourceRow: row.sourceRow,
          batchNumber: row.batchNumber,
          supplierName: row.supplierName,
          dimensions: row.dimensions,
          temper: row.temper,
          tinCoating: row.tinCoating,
          sheets: row.sheets,
          kg: row.kg,
          price: row.price,
          totalAmount: row.totalAmount,
          dateReceived: row.dateReceived
        };
      });
      const result = await api("/records", {
        method: "POST",
        body: JSON.stringify({
          type: "STOCK_IMPORT",
          fileName: preview.fileName,
          sourceSheet: preview.sourceSheet,
          rows,
          picName,
          signature
        })
      });
      const counts = result.record.importResult || {};
      $("#importDialog").close();
      state.importPreview = null;
      state.selectedLotIds.clear();
      showToast("Record " + result.record.id + " posted: " + formatNumber(counts.added || 0) + " new batch(es), " + formatNumber(counts.ignored || 0) + " ignored.");
      await Promise.all([loadInventory(), loadRecords(false)]);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = "Import New Batches";
    }
  });
  function purposeFieldsHtml() {
    return '<div class="form-grid purpose-block"><label>Purpose type<select class="purpose-type" required><option value="CUSTOMER_BRAND">Customer / Brand</option><option value="COATING">Coating</option><option value="INTERNAL">Stock / Internal</option></select></label><label class="purpose-customer">Customer<input class="customer" maxlength="160" required placeholder="Customer name"></label><label class="purpose-brand">Brand / design<input class="brand" maxlength="160" required placeholder="Brand or printed design"></label><label class="purpose-coating hidden">Coating description<input class="coating-description" maxlength="240" placeholder="e.g. White coat or epoxy gold"></label></div>';
  }
  function setupPurposeFields(container) {
    container.innerHTML = purposeFieldsHtml();
    const select = container.querySelector(".purpose-type");
    select.addEventListener("change", function() {
      updatePurposeFields(container);
    });
    updatePurposeFields(container);
  }
  function updatePurposeFields(container) {
    const type = container.querySelector(".purpose-type").value;
    const customerLabel = container.querySelector(".purpose-customer");
    const brandLabel = container.querySelector(".purpose-brand");
    const coatingLabel = container.querySelector(".purpose-coating");
    customerLabel.classList.toggle("hidden", type !== "CUSTOMER_BRAND");
    brandLabel.classList.toggle("hidden", type !== "CUSTOMER_BRAND");
    coatingLabel.classList.toggle("hidden", type !== "COATING");
    container.querySelector(".customer").required = type === "CUSTOMER_BRAND";
    container.querySelector(".brand").required = type === "CUSTOMER_BRAND";
    container.querySelector(".coating-description").required = type === "COATING";
  }
  function collectPurpose(container) {
    const type = container.querySelector(".purpose-type").value;
    const purpose = {
      type,
      customer: container.querySelector(".customer").value.trim(),
      brand: container.querySelector(".brand").value.trim(),
      coatingDescription: container.querySelector(".coating-description").value.trim()
    };
    if (type === "CUSTOMER_BRAND" && (!purpose.customer || !purpose.brand)) {
      throw new Error("Customer and brand / design are required for customer work.");
    }
    if (type === "COATING" && !purpose.coatingDescription) {
      throw new Error("Enter the coating description.");
    }
    if (type !== "CUSTOMER_BRAND") {
      purpose.customer = "";
      purpose.brand = "";
    }
    if (type !== "COATING") purpose.coatingDescription = "";
    return purpose;
  }
  $("#transferSelected").addEventListener("click", openTransferDialog);
  function openTransferDialog() {
    const lots = selectedLots();
    if (!lots.length) return showToast("Select at least one stock lot.", true);
    $("#transferForm").reset();
    $("#transferSignature").clearSignature();
    $("#transferFromLabel").value = LOCATION_LABELS[state.currentLocation];
    $("#transferDestination").innerHTML = LOCATIONS.filter(function(location) {
      return location !== state.currentLocation;
    }).map(function(location) {
      return '<option value="' + location + '">' + LOCATION_LABELS[location] + "</option>";
    }).join("");
    $("#transferItems").innerHTML = lots.map(function(lot, index) {
      return '<article class="item-card transfer-item" data-lot-id="' + escapeHtml(lot.lotId) + '"><div class="item-card-head"><strong>Item ' + (index + 1) + " \u2014 " + escapeHtml(lot.lotId) + "</strong></div>" + stockSnapshotHtml(lot) + "<label>Quantity to transfer (" + unitLabel(lot.unit).toLowerCase() + ')<input class="transfer-quantity" type="number" inputmode="numeric" min="1" max="' + Number(lot.quantity) + '" step="1" value="' + Number(lot.quantity) + '" required></label></article>';
    }).join("");
    setupPurposeFields($("#transferPurposeFields"));
    $("#transferDialog").showModal();
    $("#transferSignature").prepareSignature();
  }
  function stockSnapshotHtml(lot) {
    return '<div class="stock-snapshot"><div><span>Batch</span><strong>' + escapeHtml(lot.batchNumber) + "</strong></div><div><span>Dimensions</span><strong>" + escapeHtml(lot.dimensions) + "</strong></div><div><span>Available</span><strong>" + formatNumber(lot.quantity) + " " + unitLabel(lot.unit) + "</strong></div><div><span>Location</span><strong>" + escapeHtml(LOCATION_LABELS[lot.location] || lot.location) + "</strong></div></div>";
  }
  $("#transferForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const signature = $("#transferSignature").signatureData();
    if (!signature) return showToast("PIC signature is required.", true);
    let purpose;
    let items;
    try {
      purpose = collectPurpose($("#transferPurposeFields"));
      items = $$("#transferItems .transfer-item").map(function(card, index) {
        const lot = state.lots.find(function(candidate) {
          return candidate.lotId === card.dataset.lotId;
        });
        const quantity = Number(card.querySelector(".transfer-quantity").value);
        if (!lot) throw new Error("Selected stock is no longer available. Refresh and try again.");
        if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Item " + (index + 1) + ": quantity must be a whole number.");
        if (quantity > Number(lot.quantity)) throw new Error("Item " + (index + 1) + ": quantity exceeds the available balance.");
        return { sourceLotId: lot.lotId, quantity };
      });
    } catch (error) {
      return showToast(error.message, true);
    }
    const payload = {
      type: "TRANSFER",
      sourceLocation: state.currentLocation,
      destinationLocation: $("#transferDestination").value,
      items,
      purpose,
      description: $("#transferDescription").value.trim(),
      picName: $("#transferPic").value.trim(),
      signature
    };
    await submitMovement($("#submitTransfer"), payload, $("#transferDialog"), "Post Transfer");
  });
  async function submitMovement(button, payload, dialog, idleText) {
    button.disabled = true;
    button.textContent = "Posting\u2026";
    try {
      const result = await api("/records", { method: "POST", body: JSON.stringify(payload) });
      dialog.close();
      state.selectedLotIds.clear();
      showToast("Record " + result.record.id + " posted.");
      await Promise.all([loadInventory(), loadRecords(false)]);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = idleText;
    }
  }
  $("#slitSelected").addEventListener("click", openSlittingDialog);
  $("#addBlankOutput").addEventListener("click", function() {
    addBlankOutput();
  });
  $("#sheetsConsumed").addEventListener("input", updateSlittingCalculations);
  function openSlittingDialog() {
    const lots = selectedLots();
    if (state.currentLocation !== "SLITTER" || lots.length !== 1 || lots[0].unit !== "SHEETS") {
      return showToast("Select exactly one sheet stock lot from the Slitter tab.", true);
    }
    const lot = lots[0];
    $("#slittingForm").reset();
    $("#slittingSignature").clearSignature();
    $("#slittingSource").dataset.lotId = lot.lotId;
    $("#slittingSource").innerHTML = "<h3>" + escapeHtml(lot.lotId) + "</h3>" + stockSnapshotHtml(lot);
    $("#sheetsConsumed").max = Number(lot.quantity);
    $("#sheetsConsumed").value = "";
    $("#sourceBalanceAfter").value = formatNumber(lot.quantity) + " sheets";
    $("#blankOutputs").innerHTML = "";
    addBlankOutput();
    setupPurposeFields($("#slittingPurposeFields"));
    $("#areaCheck").className = "info-banner";
    $("#areaCheck").textContent = "Enter the sheets consumed and blank outputs to check material area.";
    $("#slittingDialog").showModal();
    $("#slittingSignature").prepareSignature();
  }
  function addBlankOutput(initial) {
    const fragment = $("#blankOutputTemplate").content.cloneNode(true);
    const card = fragment.querySelector(".blank-output");
    $("#blankOutputs").appendChild(fragment);
    if (initial) {
      card.querySelector(".blank-width").value = initial.width || "";
      card.querySelector(".blank-length").value = initial.length || "";
      card.querySelector(".blank-quantity").value = initial.quantity || "";
    }
    card.querySelector(".remove-output").addEventListener("click", function() {
      card.remove();
      renumberBlankOutputs();
      updateSlittingCalculations();
    });
    card.querySelectorAll("input").forEach(function(input) {
      input.addEventListener("input", updateSlittingCalculations);
    });
    renumberBlankOutputs();
    updateSlittingCalculations();
  }
  function renumberBlankOutputs() {
    const cards = $$("#blankOutputs .blank-output");
    cards.forEach(function(card, index) {
      card.querySelector(".item-number").textContent = "Blank size " + (index + 1);
      card.querySelector(".remove-output").disabled = cards.length === 1;
    });
  }
  function selectedSlittingLot() {
    return state.lots.find(function(lot) {
      return lot.lotId === $("#slittingSource").dataset.lotId;
    });
  }
  function updateSlittingCalculations() {
    const lot = selectedSlittingLot();
    if (!lot) return;
    const parts = parseDimensions(lot.dimensions);
    const consumed = Number($("#sheetsConsumed").value || 0);
    $("#sourceBalanceAfter").value = formatNumber(Math.max(0, Number(lot.quantity) - consumed)) + " sheets";
    let outputArea = 0;
    let complete = consumed > 0;
    $$("#blankOutputs .blank-output").forEach(function(card) {
      const width = Number(card.querySelector(".blank-width").value || 0);
      const length = Number(card.querySelector(".blank-length").value || 0);
      const quantity = Number(card.querySelector(".blank-quantity").value || 0);
      card.querySelector(".blank-dimensions").value = width && length && parts ? parts.thickness + "*" + width + "*" + length : "";
      if (!width || !length || !quantity) complete = false;
      outputArea += width * length * quantity;
    });
    if (!parts || !complete) {
      $("#areaCheck").className = "info-banner";
      $("#areaCheck").textContent = "Enter the sheets consumed and every blank output to check material area.";
      return;
    }
    const inputArea = parts.width * parts.length * consumed;
    const utilization = inputArea ? outputArea / inputArea * 100 : 0;
    const exceeded = outputArea > inputArea;
    $("#areaCheck").className = "info-banner" + (exceeded ? " error" : "");
    $("#areaCheck").textContent = exceeded ? "Blank output area exceeds the consumed sheet area. Correct the quantities or dimensions." : "Recorded blank area uses " + utilization.toFixed(1) + "% of the consumed sheet area.";
  }
  $("#slittingForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const lot = selectedSlittingLot();
    if (!lot) return showToast("The selected sheet stock is no longer available.", true);
    const signature = $("#slittingSignature").signatureData();
    if (!signature) return showToast("PIC signature is required.", true);
    let purpose;
    let outputs;
    const sheetsConsumed = Number($("#sheetsConsumed").value);
    try {
      purpose = collectPurpose($("#slittingPurposeFields"));
      if (!Number.isInteger(sheetsConsumed) || sheetsConsumed < 1) throw new Error("Sheets consumed must be a whole number.");
      if (sheetsConsumed > Number(lot.quantity)) throw new Error("Sheets consumed exceed the available balance.");
      outputs = $$("#blankOutputs .blank-output").map(function(card, index) {
        const width = Number(card.querySelector(".blank-width").value);
        const length = Number(card.querySelector(".blank-length").value);
        const quantity = Number(card.querySelector(".blank-quantity").value);
        if (![width, length, quantity].every(function(value) {
          return Number.isInteger(value) && value > 0;
        })) {
          throw new Error("Blank size " + (index + 1) + ": width, length and quantity must be positive whole numbers.");
        }
        return { width, length, quantity };
      });
      const dimensions = parseDimensions(lot.dimensions);
      const inputArea = dimensions.width * dimensions.length * sheetsConsumed;
      const outputArea = outputs.reduce(function(total, output) {
        return total + output.width * output.length * output.quantity;
      }, 0);
      if (outputArea > inputArea) throw new Error("Blank output area cannot exceed the consumed sheet area.");
    } catch (error) {
      return showToast(error.message, true);
    }
    const payload = {
      type: "SLITTING",
      sourceLocation: "SLITTER",
      sourceLotId: lot.lotId,
      sheetsConsumed,
      outputs,
      purpose,
      description: $("#slittingDescription").value.trim(),
      picName: $("#slittingPic").value.trim(),
      signature
    };
    await submitMovement($("#submitSlitting"), payload, $("#slittingDialog"), "Post Slitting Record");
  });
  async function loadRecords(showErrors) {
    if (showErrors) $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">Loading records\u2026</td></tr>';
    try {
      const result = await api("/records");
      state.records = Array.isArray(result.records) ? result.records : [];
      renderRecords();
    } catch (error) {
      if (showErrors) {
        $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">' + escapeHtml(error.message) + "</td></tr>";
        showToast(error.message, true);
      }
    }
  }
  function filteredRecords() {
    const term = $("#recordSearch").value.trim().toLowerCase();
    const type = $("#recordTypeFilter").value;
    const status = $("#recordStatusFilter").value;
    return state.records.filter(function(record) {
      const text = [
        record.id,
        record.type,
        record.sourceLocation,
        record.destinationLocation,
        record.picName,
        record.description,
        record.purpose && record.purpose.customer,
        record.purpose && record.purpose.brand,
        record.purpose && record.purpose.coatingDescription,
        record.fileName,
        record.sourceSheet
      ].concat((record.lines || []).reduce(function(values, line) {
        return values.concat([
          line.sourceLotId,
          line.destinationLotId,
          line.lotId,
          line.batchNumber,
          line.dimensions,
          line.supplierName,
          line.temper,
          line.tinCoating,
          line.dateReceived
        ]);
      }, [])).join(" ").toLowerCase();
      return (!term || text.includes(term)) && (!type || record.type === type) && (!status || record.status === status);
    });
  }
  function renderRecords() {
    const records = filteredRecords();
    if (!records.length) {
      $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">No matching movement records.</td></tr>';
      return;
    }
    $("#recordsBody").innerHTML = records.map(function(record) {
      const destination = recordDestinationLabel(record);
      const purpose = record.type === "STOCK_IMPORT" ? formatNumber(record.importResult && record.importResult.added) + " new \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored" : purposeSummary(record.purpose);
      return "<tr><td><strong>" + escapeHtml(record.id) + "</strong></td><td>" + escapeHtml(recordTypeLabel(record.type)) + "</td><td>" + escapeHtml(locationLabel(record.sourceLocation)) + "</td><td>" + escapeHtml(destination) + "</td><td>" + formatNumber((record.lines || []).length) + '</td><td class="description-cell">' + escapeHtml(purpose) + "</td><td>" + escapeHtml(record.picName) + "</td><td>" + formatDate(record.createdAt) + '</td><td class="status-cell ' + escapeHtml(record.status) + '">' + titleCase(record.status) + '</td><td><button class="secondary table-action view-record" type="button" data-record-id="' + escapeHtml(record.id) + '">View</button></td></tr>';
    }).join("");
    $$("#recordsBody .view-record").forEach(function(button) {
      button.addEventListener("click", function() {
        openRecord(button.dataset.recordId);
      });
    });
  }
  $("#refreshRecords").addEventListener("click", function() {
    loadRecords(true);
  });
  $("#recordSearch").addEventListener("input", renderRecords);
  $("#recordTypeFilter").addEventListener("change", renderRecords);
  $("#recordStatusFilter").addEventListener("change", renderRecords);
  async function openRecord(id) {
    revokeSignatureUrls();
    $("#recordDialogTitle").textContent = id;
    $("#recordDetail").innerHTML = '<p class="empty-cell">Loading record\u2026</p>';
    $("#cancelSection").classList.add("hidden");
    $("#recordDialog").showModal();
    try {
      const record = await api("/records/" + encodeURIComponent(id));
      state.selectedRecord = record;
      renderRecordDetail(record);
      $("#cancelSection").classList.toggle("hidden", record.status !== "POSTED");
      $("#cancelForm").reset();
      $("#cancelSignature").clearSignature();
      $("#cancelSignature").prepareSignature();
      loadRecordSignatures(record);
    } catch (error) {
      $("#recordDetail").innerHTML = '<p class="info-banner error">' + escapeHtml(error.message) + "</p>";
    }
  }
  function renderRecordDetail(record) {
    const destination = recordDestinationLabel(record);
    let html = '<dl class="detail-grid">' + detailCell("Record ID", record.id) + detailCell("Type", recordTypeLabel(record.type)) + detailCell("Status", titleCase(record.status)) + detailCell("From", locationLabel(record.sourceLocation)) + detailCell("To / Process", destination) + detailCell("Worker date & time", formatDate(record.createdAt)) + detailCell("PIC", record.picName) + detailCell("Purpose", record.type === "STOCK_IMPORT" ? "Opening stock import" : purposeSummary(record.purpose)) + detailCell("Description", record.description) + (record.type === "STOCK_IMPORT" ? detailCell("Excel file", record.fileName) + detailCell("Worksheet", record.sourceSheet) + detailCell("Import result", formatNumber(record.importResult && record.importResult.added) + " added \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored") : "") + "</dl>";
    if (record.type === "TRANSFER") {
      html += '<section class="record-items"><h3>Transferred stock</h3><div class="table-wrap"><table><thead><tr><th>Source stock ID</th><th>Destination stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + escapeHtml(item.sourceLotId) + "</td><td>" + escapeHtml(item.destinationLotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + formatNumber(item.quantity) + " " + escapeHtml(unitLabel(item.unit)) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";
    } else if (record.type === "STOCK_IMPORT") {
      html += '<section class="record-items"><h3>Stock batches added to Storage</h3><div class="table-wrap"><table><thead><tr><th>Excel row</th><th>Stock ID</th><th>Batch</th><th>Supplier</th><th>Size</th><th>Temper</th><th>Tin coating</th><th>Sheets</th><th>KG</th><th>Price</th><th>Total amount</th><th>Date received</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + item.sourceRow + "</td><td>" + escapeHtml(item.lotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.supplierName || "\u2014") + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + escapeHtml(item.temper || "\u2014") + "</td><td>" + escapeHtml(item.tinCoating || "\u2014") + "</td><td>" + formatNumber(item.quantity) + "</td><td>" + formatDecimal(item.kg) + "</td><td>" + formatMoney(item.price) + "</td><td>" + formatMoney(item.totalAmount) + "</td><td>" + escapeHtml(item.dateReceived || "\u2014") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
      if (Array.isArray(record.ignoredRows) && record.ignoredRows.length) {
        html += '<h3>Rows ignored by the Worker</h3><div class="table-wrap"><table><thead><tr><th>Excel row</th><th>Batch</th><th>Reason</th></tr></thead><tbody>' + record.ignoredRows.map(function(row) {
          const reason = row.reason === "DUPLICATE_IN_FILE" ? "Repeated in this Excel file" : "Batch already exists in current or historical records";
          return "<tr><td>" + row.sourceRow + "</td><td>" + escapeHtml(row.batchNumber) + "</td><td>" + escapeHtml(reason) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      }
      html += "</section>";
    } else {
      html += '<section class="record-items"><h3>Source sheets consumed</h3><div class="record-summary">' + stockSnapshotHtml({
        batchNumber: record.source.batchNumber,
        dimensions: record.source.dimensions,
        quantity: record.source.quantity,
        unit: record.source.unit,
        location: record.sourceLocation
      }) + "<strong>Source stock ID: " + escapeHtml(record.source.sourceLotId) + '</strong></div><h3>Blank outputs</h3><div class="table-wrap"><table><thead><tr><th>New stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th></tr></thead><tbody>' + record.outputs.map(function(output) {
        return "<tr><td>" + escapeHtml(output.lotId) + "</td><td>" + escapeHtml(output.batchNumber) + "</td><td>" + escapeHtml(output.dimensions) + "</td><td>" + formatNumber(output.quantity) + " Blanks</td></tr>";
      }).join("") + "</tbody></table></div></section>";
    }
    html += '<section class="record-items"><h3>Audit trail</h3>' + (record.audit || []).map(function(entry, index) {
      const cancelled = entry.action === "CANCELLED";
      return '<article class="audit-entry' + (cancelled ? " cancelled" : "") + '"><strong>' + escapeHtml(titleCase(entry.action)) + "</strong><p>" + escapeHtml(entry.by) + " \xB7 " + formatDate(entry.at) + "</p>" + (entry.reason ? "<p><strong>Reason:</strong> " + escapeHtml(entry.reason) + "</p>" : "") + '<div class="signature-slot" data-signature-index="' + index + '"><span>Loading signature\u2026</span></div></article>';
    }).join("") + "</section>";
    $("#recordDetail").innerHTML = html;
  }
  async function loadRecordSignatures(record) {
    (record.audit || []).forEach(async function(entry, index) {
      const slot = $("#recordDetail .signature-slot[data-signature-index='" + index + "']");
      if (!slot || !entry.signaturePath) return;
      try {
        const blob = await apiBlob("/signatures/" + encodeURIComponent(entry.signaturePath.split("/").pop()));
        const url = URL.createObjectURL(blob);
        state.signatureUrls.push(url);
        slot.innerHTML = '<img class="signature-preview" alt="' + escapeHtml(titleCase(entry.action)) + ' PIC signature">';
        slot.querySelector("img").src = url;
      } catch (error) {
        slot.textContent = "Signature unavailable: " + error.message;
      }
    });
  }
  $("#cancelForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    if (!state.selectedRecord || state.selectedRecord.status !== "POSTED") {
      return showToast("Only a posted record can be cancelled.", true);
    }
    const signature = $("#cancelSignature").signatureData();
    if (!signature) return showToast("Cancellation signature is required.", true);
    const payload = {
      reason: $("#cancelReason").value.trim(),
      picName: $("#cancelPic").value.trim(),
      signature
    };
    const button = $("#submitCancellation");
    button.disabled = true;
    button.textContent = "Reversing\u2026";
    try {
      const result = await api("/records/" + encodeURIComponent(state.selectedRecord.id) + "/cancel", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      $("#recordDialog").close();
      showToast("Record " + result.record.id + " cancelled and reversed.");
      state.selectedRecord = null;
      state.selectedLotIds.clear();
      await Promise.all([loadInventory(), loadRecords(false)]);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = "Cancel and Reverse Record";
    }
  });
  $("#exportCsv").addEventListener("click", function() {
    const records = filteredRecords();
    if (!records.length) return showToast("There are no matching records to export.", true);
    const headings = [
      "Record ID",
      "Type",
      "Status",
      "Worker Date Time",
      "From",
      "To / Process",
      "PIC",
      "Purpose Type",
      "Customer",
      "Brand / Design",
      "Coating Description",
      "Movement Description",
      "Source Stock ID",
      "Destination / Output Stock ID",
      "Batch Number",
      "Dimensions",
      "Quantity",
      "Unit",
      "Import File",
      "Source Sheet",
      "Excel Row",
      "Supplier",
      "Temper",
      "Tin Coating",
      "KG",
      "Price",
      "Total Amount",
      "Date Received"
    ];
    const rows = [headings];
    records.forEach(function(record) {
      const lines = record.lines && record.lines.length ? record.lines : [{}];
      lines.forEach(function(line) {
        rows.push([
          record.id,
          record.type,
          record.status,
          record.createdAt,
          locationLabel(record.sourceLocation),
          recordDestinationLabel(record),
          record.picName,
          record.purpose && PURPOSE_LABELS[record.purpose.type],
          record.purpose && record.purpose.customer,
          record.purpose && record.purpose.brand,
          record.purpose && record.purpose.coatingDescription,
          record.description,
          line.sourceLotId || record.sourceLotId || "",
          line.destinationLotId || line.lotId || "",
          line.batchNumber || "",
          line.dimensions || "",
          line.quantity == null ? "" : line.quantity,
          line.unit || "",
          record.fileName || "",
          record.sourceSheet || "",
          line.sourceRow || "",
          line.supplierName || "",
          line.temper || "",
          line.tinCoating || "",
          line.kg == null ? "" : line.kg,
          line.price == null ? "" : line.price,
          line.totalAmount == null ? "" : line.totalAmount,
          line.dateReceived || ""
        ]);
      });
    });
    const csv = rows.map(function(row) {
      return row.map(function(value) {
        return '"' + String(value == null ? "" : value).replaceAll('"', '""') + '"';
      }).join(",");
    }).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "tinplate-stock-and-movement-records-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".csv";
    link.click();
    setTimeout(function() {
      URL.revokeObjectURL(link.href);
    }, 0);
  });
  function parseDimensions(value) {
    const match = String(value || "").match(/^(0\.\d+)\*(\d+)\*(\d+)$/);
    if (!match) return null;
    return { thickness: match[1], width: Number(match[2]), length: Number(match[3]) };
  }
  function purposeSummary(purpose) {
    if (!purpose) return "\u2014";
    if (purpose.type === "CUSTOMER_BRAND") return [purpose.customer, purpose.brand].filter(Boolean).join(" / ") || "Customer / Brand";
    if (purpose.type === "COATING") return purpose.coatingDescription || "Coating";
    return "Stock / Internal";
  }
  function recordTypeLabel(type) {
    if (type === "STOCK_IMPORT") return "Stock Import";
    if (type === "SLITTING") return "Slitting";
    return type === "TRANSFER" ? "Transfer" : titleCase(type);
  }
  function recordDestinationLabel(record) {
    return record.type === "SLITTING" ? "Slitting conversion" : locationLabel(record.destinationLocation);
  }
  function detailCell(label, value) {
    const display = value == null || value === "" ? "\u2014" : value;
    return "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(display) + "</dd></div>";
  }
  function locationLabel(location) {
    return LOCATION_LABELS[location] || location || "\u2014";
  }
  function unitLabel(unit) {
    return unit === "SHEETS" ? "Sheets" : unit === "BLANKS" ? "Blanks" : titleCase(unit);
  }
  function titleCase(value) {
    return String(value || "").toLowerCase().replaceAll("_", " ").replace(/\b\w/g, function(character) {
      return character.toUpperCase();
    });
  }
  function formatNumber(value) {
    return new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 }).format(Number(value || 0));
  }
  function formatDecimal(value) {
    if (value == null || value === "") return "\u2014";
    return new Intl.NumberFormat("en-MY", { maximumFractionDigits: 3 }).format(Number(value));
  }
  function formatMoney(value) {
    if (value == null || value === "") return "\u2014";
    return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 4 }).format(Number(value));
  }
  function formatDate(value) {
    if (!value) return "\u2014";
    return new Intl.DateTimeFormat("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur"
    }).format(new Date(value));
  }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }
  (async function boot() {
    setupPurposeFields($("#transferPurposeFields"));
    setupPurposeFields($("#slittingPurposeFields"));
    const savedPin = getPin();
    if (savedPin) {
      const success = await authenticate(savedPin, true);
      if (!success) showToast("Saved login is no longer valid. Enter the application PIN.", true);
    } else {
      setLoggedIn(false);
    }
  })();
})();
