(() => {
  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xml/xmlBrowser.js
  var xmlBrowser_default = {
    createDocument: function createDocument(content) {
      return new DOMParser().parseFromString(content.trim(), "text/xml");
    }
  };

  // ../../../../../tmp/tinplate-web-build/node_modules/fflate/esm/browser.js
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
  var hMap = (function(cd, mb, r) {
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
  });
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
  var b2 = function(d, b) {
    return d[b] | d[b + 1] << 8;
  };
  var b4 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var b8 = function(d, b) {
    return b4(d, b) + b4(d, b + 4) * 4294967296;
  };
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
  function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 101010256; --e) {
      if (!e || data.length - e > 65558)
        err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
      return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
      var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_2
      })) {
        if (!c_2)
          files[fn] = slc(data, b, b + sc);
        else if (c_2 == 8)
          files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
        else
          err(14, "unknown compression type " + c_2);
      }
    }
    return files;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/unpackXlsxFileBrowser.js
  function unpackXlsxFile(input) {
    if (input instanceof File) {
      return input.arrayBuffer().then(unpackXlsxArrayBuffer);
    }
    if (input instanceof Blob) {
      return input.arrayBuffer().then(unpackXlsxArrayBuffer);
    }
    return unpackXlsxArrayBuffer(input);
  }
  function unpackXlsxArrayBuffer(arrayBuffer) {
    var archive = new Uint8Array(arrayBuffer);
    var contents = unzipSync(archive);
    return Promise.resolve(getContents(contents));
  }
  function getContents(contents) {
    var unzippedFiles = [];
    for (var _i = 0, _Object$keys = Object.keys(contents); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      unzippedFiles[key] = strFromU8(contents[key]);
    }
    return unzippedFiles;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xml/dom.js
  function findChild(node, tagName) {
    var i = 0;
    while (i < node.childNodes.length) {
      var childNode = node.childNodes[i];
      if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
        return childNode;
      }
      i++;
    }
  }
  function findChildren(node, tagName) {
    var results = [];
    var i = 0;
    while (i < node.childNodes.length) {
      var childNode = node.childNodes[i];
      if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
        results.push(childNode);
      }
      i++;
    }
    return results;
  }
  function forEach(node, tagName, func) {
    var i = 0;
    while (i < node.childNodes.length) {
      var childNode = node.childNodes[i];
      if (tagName) {
        if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
          func(childNode, i);
        }
      } else {
        func(childNode, i);
      }
      i++;
    }
  }
  function map(node, tagName, func) {
    var results = [];
    forEach(node, tagName, function(node2, i) {
      results.push(func(node2, i));
    });
    return results;
  }
  var NAMESPACE_REG_EXP = /.+\:/;
  function getTagName(element) {
    return element.tagName.replace(NAMESPACE_REG_EXP, "");
  }
  function getOuterXml(node) {
    if (node.nodeType !== 1) {
      return node.textContent;
    }
    var xml = "<" + getTagName(node);
    var j = 0;
    while (j < node.attributes.length) {
      xml += " " + node.attributes[j].name + '="' + node.attributes[j].value + '"';
      j++;
    }
    xml += ">";
    var i = 0;
    while (i < node.childNodes.length) {
      xml += getOuterXml(node.childNodes[i]);
      i++;
    }
    xml += "</" + getTagName(node) + ">";
    return xml;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/xml/xlsx.js
  function getCells(document2) {
    var worksheet = document2.documentElement;
    var sheetData = findChild(worksheet, "sheetData");
    var cells = [];
    forEach(sheetData, "row", function(row) {
      forEach(row, "c", function(cell) {
        cells.push(cell);
      });
    });
    return cells;
  }
  function getCellValue(document2, node) {
    return findChild(node, "v");
  }
  function getCellInlineStringValue(document2, node) {
    if (node.firstChild && getTagName(node.firstChild) === "is" && node.firstChild.firstChild && getTagName(node.firstChild.firstChild) === "t") {
      return node.firstChild.firstChild.textContent;
    }
  }
  function getDimensions(document2) {
    var worksheet = document2.documentElement;
    var dimensions = findChild(worksheet, "dimension");
    if (dimensions) {
      return dimensions.getAttribute("ref");
    }
  }
  function getBaseStyles(document2) {
    var styleSheet = document2.documentElement;
    var cellStyleXfs = findChild(styleSheet, "cellStyleXfs");
    if (cellStyleXfs) {
      return findChildren(cellStyleXfs, "xf");
    }
    return [];
  }
  function getCellStyles(document2) {
    var styleSheet = document2.documentElement;
    var cellXfs = findChild(styleSheet, "cellXfs");
    if (!cellXfs) {
      return [];
    }
    return findChildren(cellXfs, "xf");
  }
  function getNumberFormats(document2) {
    var styleSheet = document2.documentElement;
    var numberFormats = [];
    var numFmts = findChild(styleSheet, "numFmts");
    if (numFmts) {
      return findChildren(numFmts, "numFmt");
    }
    return [];
  }
  function getSharedStrings(document2) {
    var sst = document2.documentElement;
    return map(sst, "si", function(string) {
      var t = findChild(string, "t");
      if (t) {
        return t.textContent;
      }
      var value = "";
      forEach(string, "r", function(r) {
        value += findChild(r, "t").textContent;
      });
      return value;
    });
  }
  function getWorkbookProperties(document2) {
    var workbook = document2.documentElement;
    return findChild(workbook, "workbookPr");
  }
  function getRelationships(document2) {
    var relationships = document2.documentElement;
    return findChildren(relationships, "Relationship");
  }
  function getSheets(document2) {
    var workbook = document2.documentElement;
    var sheets = findChild(workbook, "sheets");
    return findChildren(sheets, "sheet");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseProperties.js
  function parseProperties(content, xml) {
    var book = xml.createDocument(content);
    var properties = {};
    var workbookProperties = getWorkbookProperties(book);
    if (workbookProperties && workbookProperties.getAttribute("date1904") === "1") {
      properties.epoch1904 = true;
    }
    properties.sheets = [];
    var addSheetInfo = function addSheetInfo2(sheet) {
      if (sheet.getAttribute("name")) {
        properties.sheets.push({
          id: sheet.getAttribute("sheetId"),
          name: sheet.getAttribute("name"),
          relationId: sheet.getAttribute("r:id")
        });
      }
    };
    getSheets(book).forEach(addSheetInfo);
    return properties;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseFilePaths.js
  function parseFilePaths(content, xml) {
    var document2 = xml.createDocument(content);
    var filePaths = {
      sheets: {},
      sharedStrings: void 0,
      styles: void 0
    };
    var addFilePathInfo = function addFilePathInfo2(relationship) {
      var filePath = relationship.getAttribute("Target");
      var fileType = relationship.getAttribute("Type");
      switch (fileType) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
          filePaths.styles = getFilePath(filePath);
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings":
          filePaths.sharedStrings = getFilePath(filePath);
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet":
          filePaths.sheets[relationship.getAttribute("Id")] = getFilePath(filePath);
          break;
      }
    };
    getRelationships(document2).forEach(addFilePathInfo);
    return filePaths;
  }
  function getFilePath(path) {
    if (path[0] === "/") {
      return path.slice("/".length);
    }
    return "xl/" + path;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseStyles.js
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
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
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function parseStyles(content, xml) {
    if (!content) {
      return {};
    }
    var doc = xml.createDocument(content);
    var baseStyles = getBaseStyles(doc).map(parseCellStyle);
    var numberFormats = getNumberFormats(doc).map(parseNumberFormatStyle).reduce(function(formats, format) {
      formats[format.id] = format;
      return formats;
    }, []);
    var getCellStyle = function getCellStyle2(xf) {
      if (xf.hasAttribute("xfId")) {
        return _objectSpread(_objectSpread({}, baseStyles[xf.xfId]), parseCellStyle(xf, numberFormats));
      }
      return parseCellStyle(xf, numberFormats);
    };
    return getCellStyles(doc).map(getCellStyle);
  }
  function parseNumberFormatStyle(numFmt) {
    return {
      id: numFmt.getAttribute("numFmtId"),
      template: numFmt.getAttribute("formatCode")
    };
  }
  function parseCellStyle(xf, numFmts) {
    var style = {};
    if (xf.hasAttribute("numFmtId")) {
      var numberFormatId = xf.getAttribute("numFmtId");
      if (numFmts[numberFormatId]) {
        style.numberFormat = numFmts[numberFormatId];
      } else {
        style.numberFormat = {
          id: numberFormatId
        };
      }
    }
    return style;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseSharedStrings.js
  function parseSharedStrings(content, xml) {
    if (!content) {
      return [];
    }
    return getSharedStrings(xml.createDocument(content));
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseDate.js
  function parseExcelDate(excelSerialDate, options) {
    if (options && options.epoch1904) {
      excelSerialDate += 1462;
    }
    var daysBeforeUnixEpoch = 70 * 365 + 19;
    var hour = 60 * 60 * 1e3;
    return new Date(Math.round((excelSerialDate - daysBeforeUnixEpoch) * 24 * hour));
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/isDateTimestamp.js
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
  function isDateTimestamp(styleId, styles, options) {
    if (styleId) {
      var style = styles[styleId];
      if (!style) {
        throw new Error("Cell style not found: ".concat(styleId));
      }
      if (!style.numberFormat) {
        return false;
      }
      if (
        // Whether it's a "number format" that's conventionally used for storing date timestamps.
        BUILT_IN_DATE_NUMBER_FORMAT_IDS.indexOf(Number(style.numberFormat.id)) >= 0 || // Whether it's a "number format" that uses a "formatting template"
        // that the developer is certain is a date formatting template.
        options.dateFormat && style.numberFormat.template === options.dateFormat || // Whether the "smart formatting template" feature is not disabled
        // and it has detected that it's a date formatting template by looking at it.
        options.smartDateParser !== false && style.numberFormat.template && isDateTemplate(style.numberFormat.template)
      ) {
        return true;
      }
    }
  }
  var BUILT_IN_DATE_NUMBER_FORMAT_IDS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57];
  var DATE_FORMAT_WEIRD_PREFIX = /^\[\$-414\]/;
  var DATE_FORMAT_WEIRD_POSTFIX = /;@$/;
  function isDateTemplate(template) {
    template = template.toLowerCase();
    template = template.replace(DATE_FORMAT_WEIRD_PREFIX, "");
    template = template.replace(DATE_FORMAT_WEIRD_POSTFIX, "");
    var tokens = template.split(/\W+/);
    for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done; ) {
      var token = _step.value;
      if (DATE_TEMPLATE_TOKENS.indexOf(token) < 0) {
        return false;
      }
    }
    return true;
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

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseCellValue.js
  function parseCellValue(value, type, _ref) {
    var getInlineStringValue = _ref.getInlineStringValue, getInlineStringXml = _ref.getInlineStringXml, getStyleId = _ref.getStyleId, styles = _ref.styles, values = _ref.values, properties = _ref.properties, options = _ref.options;
    if (!type) {
      type = "n";
    }
    switch (type) {
      // XLSX tends to store all strings as "shared" (indexed) ones
      // using "s" cell type (for saving on strage space).
      // "str" cell type is then generally only used for storing
      // formula-pre-calculated cell values.
      case "str":
        value = parseString(value, options);
        break;
      // Sometimes, XLSX stores strings as "inline" strings rather than "shared" (indexed) ones.
      // Perhaps the specification doesn't force it to use one or another.
      // Example: `<sheetData><row r="1"><c r="A1" s="1" t="inlineStr"><is><t>Test 123</t></is></c></row></sheetData>`.
      case "inlineStr":
        value = getInlineStringValue();
        if (value === void 0) {
          throw new Error('Unsupported "inline string" cell value structure: '.concat(getInlineStringXml()));
        }
        value = parseString(value, options);
        break;
      // XLSX tends to store string values as "shared" (indexed) ones.
      // "Shared" strings is a way for an Excel editor to reduce
      // the file size by storing "commonly used" strings in a dictionary
      // and then referring to such strings by their index in that dictionary.
      // Example: `<sheetData><row r="1"><c r="A1" s="1" t="s"><v>0</v></c></row></sheetData>`.
      case "s":
        var sharedStringIndex = Number(value);
        if (isNaN(sharedStringIndex)) {
          throw new Error('Invalid "shared" string index: '.concat(value));
        }
        if (sharedStringIndex >= values.length) {
          throw new Error('An out-of-bounds "shared" string index: '.concat(value));
        }
        value = values[sharedStringIndex];
        value = parseString(value, options);
        break;
      // Boolean (TRUE/FALSE) values are stored as either "1" or "0"
      // in cells of type "b".
      case "b":
        if (value === "1") {
          value = true;
        } else if (value === "0") {
          value = false;
        } else {
          throw new Error('Unsupported "boolean" cell value: '.concat(value));
        }
        break;
      // XLSX specification seems to support cells of type "z":
      // blank "stub" cells that should be ignored by data processing utilities.
      case "z":
        value = void 0;
        break;
      // XLSX specification also defines cells of type "e" containing a numeric "error" code.
      // It's not clear what that means though.
      // They also wrote: "and `w` property stores its common name".
      // It's unclear what they meant by that.
      case "e":
        value = decodeError(value);
        break;
      // XLSX supports date cells of type "d", though seems like it (almost?) never
      // uses it for storing dates, preferring "n" numeric timestamp cells instead.
      // The value of a "d" cell is supposedly a string in "ISO 8601" format.
      // I haven't seen an XLSX file having such cells.
      // Example: `<sheetData><row r="1"><c r="A1" s="1" t="d"><v>2021-06-10T00:47:45.700Z</v></c></row></sheetData>`.
      case "d":
        if (value === void 0) {
          break;
        }
        var parsedDate = new Date(value);
        if (isNaN(parsedDate.valueOf())) {
          throw new Error('Unsupported "date" cell value: '.concat(value));
        }
        value = parsedDate;
        break;
      // Numeric cells have type "n".
      case "n":
        if (value === void 0) {
          break;
        }
        var isDateTimestampNumber = isDateTimestamp(getStyleId(), styles, options);
        if (isDateTimestampNumber) {
          value = parseNumberDefault(value);
          value = parseExcelDate(value, properties);
        } else {
          value = (options.parseNumber || parseNumberDefault)(value);
        }
        break;
      default:
        throw new TypeError("Cell type not supported: ".concat(type));
    }
    if (value === void 0) {
      value = null;
    }
    return value;
  }
  function decodeError(errorCode) {
    switch (errorCode) {
      case 0:
        return "#NULL!";
      case 7:
        return "#DIV/0!";
      case 15:
        return "#VALUE!";
      case 23:
        return "#REF!";
      case 29:
        return "#NAME?";
      case 36:
        return "#NUM!";
      case 42:
        return "#N/A";
      case 43:
        return "#GETTING_DATA";
      default:
        return "#ERROR_".concat(errorCode);
    }
  }
  function parseString(value, options) {
    if (options.trim !== false) {
      value = value.trim();
    }
    if (value === "") {
      value = void 0;
    }
    return value;
  }
  function parseNumberDefault(stringifiedNumber) {
    var parsedNumber = Number(stringifiedNumber);
    if (isNaN(parsedNumber)) {
      throw new Error('Invalid "numeric" cell value: '.concat(stringifiedNumber));
    }
    return parsedNumber;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/coordinates.js
  var LETTERS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  function calculateDimensions(cells) {
    var comparator = function comparator2(a, b) {
      return a - b;
    };
    var allRows = cells.map(function(cell) {
      return cell.row;
    }).sort(comparator);
    var allCols = cells.map(function(cell) {
      return cell.column;
    }).sort(comparator);
    var minRow = allRows[0];
    var maxRow = allRows[allRows.length - 1];
    var minCol = allCols[0];
    var maxCol = allCols[allCols.length - 1];
    return [{
      row: minRow,
      column: minCol
    }, {
      row: maxRow,
      column: maxCol
    }];
  }
  function columnLettersToNumber(columnLetters) {
    var n = 0;
    var i = 0;
    while (i < columnLetters.length) {
      n *= 26;
      n += LETTERS.indexOf(columnLetters[i]);
      i++;
    }
    return n;
  }
  function parseCellCoordinates(coords) {
    coords = coords.split(/(\d+)/);
    return [
      // Row.
      parseInt(coords[1]),
      // Column.
      columnLettersToNumber(coords[0].trim())
    ];
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseCell.js
  function parseCell(node, sheet, xml, values, styles, properties, options) {
    var coords = parseCellCoordinates(node.getAttribute("r"));
    var valueElement = getCellValue(sheet, node);
    var value = valueElement && valueElement.textContent;
    var type;
    if (node.hasAttribute("t")) {
      type = node.getAttribute("t");
    }
    return {
      row: coords[0],
      column: coords[1],
      value: parseCellValue(value, type, {
        getInlineStringValue: function getInlineStringValue() {
          return getCellInlineStringValue(sheet, node);
        },
        getInlineStringXml: function getInlineStringXml() {
          return getOuterXml(node);
        },
        getStyleId: function getStyleId() {
          return node.getAttribute("s");
        },
        styles,
        values,
        properties,
        options
      })
    };
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseCells.js
  function parseCells(sheet, xml, values, styles, properties, options) {
    var cells = getCells(sheet);
    if (cells.length === 0) {
      return [];
    }
    return cells.map(function(node) {
      return parseCell(node, sheet, xml, values, styles, properties, options);
    });
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseDimensions.js
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
  function parseDimensions(sheet) {
    var dimensions = getDimensions(sheet);
    if (dimensions) {
      dimensions = dimensions.split(":").map(parseCellCoordinates).map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), row = _ref2[0], column = _ref2[1];
        return {
          row,
          column
        };
      });
      if (dimensions.length === 1) {
        dimensions = [dimensions[0], dimensions[0]];
      }
      return dimensions;
    }
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/parseSheet.js
  function parseSheet(content, xml, values, styles, properties, options) {
    var sheet = xml.createDocument(content);
    var cells = parseCells(sheet, xml, values, styles, properties, options);
    var dimensions = parseDimensions(sheet) || calculateDimensions(cells);
    return {
      cells,
      dimensions
    };
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/dropEmptyRows.js
  function _createForOfIteratorHelperLoose2(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray3(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  function dropEmptyRows(data) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, rowIndexSourceMap = _ref.rowIndexSourceMap, _ref$accessor = _ref.accessor, accessor = _ref$accessor === void 0 ? function(_) {
      return _;
    } : _ref$accessor, onlyTrimAtTheEnd = _ref.onlyTrimAtTheEnd;
    var i = data.length - 1;
    while (i >= 0) {
      var empty = true;
      for (var _iterator = _createForOfIteratorHelperLoose2(data[i]), _step; !(_step = _iterator()).done; ) {
        var cell = _step.value;
        if (accessor(cell) !== null) {
          empty = false;
          break;
        }
      }
      if (empty) {
        data.splice(i, 1);
        if (rowIndexSourceMap) {
          rowIndexSourceMap.splice(i, 1);
        }
      } else if (onlyTrimAtTheEnd) {
        break;
      }
      i--;
    }
    return data;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/dropEmptyColumns.js
  function _createForOfIteratorHelperLoose3(o, allowArrayLike) {
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
  function dropEmptyColumns(data) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$accessor = _ref.accessor, accessor = _ref$accessor === void 0 ? function(_) {
      return _;
    } : _ref$accessor, onlyTrimAtTheEnd = _ref.onlyTrimAtTheEnd;
    var i = data[0].length - 1;
    while (i >= 0) {
      var empty = true;
      for (var _iterator = _createForOfIteratorHelperLoose3(data), _step; !(_step = _iterator()).done; ) {
        var row = _step.value;
        if (accessor(row[i]) !== null) {
          empty = false;
          break;
        }
      }
      if (empty) {
        var j = 0;
        while (j < data.length) {
          data[j].splice(i, 1);
          j++;
        }
      } else if (onlyTrimAtTheEnd) {
        break;
      }
      i--;
    }
    return data;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/getData.js
  function _createForOfIteratorHelperLoose4(o, allowArrayLike) {
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
  function _slicedToArray2(arr, i) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray5(arr, i) || _nonIterableRest2();
  }
  function _nonIterableRest2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  function getData(sheet, options) {
    var dimensions = sheet.dimensions, cells = sheet.cells;
    if (cells.length === 0) {
      return [];
    }
    var _dimensions = _slicedToArray2(dimensions, 2), leftTop = _dimensions[0], rightBottom = _dimensions[1];
    var colsCount = rightBottom.column;
    var rowsCount = rightBottom.row;
    var data = new Array(rowsCount);
    var i = 0;
    while (i < rowsCount) {
      data[i] = new Array(colsCount);
      var j = 0;
      while (j < colsCount) {
        data[i][j] = null;
        j++;
      }
      i++;
    }
    for (var _iterator = _createForOfIteratorHelperLoose4(cells), _step; !(_step = _iterator()).done; ) {
      var cell = _step.value;
      var rowIndex = cell.row - 1;
      var columnIndex = cell.column - 1;
      if (columnIndex < colsCount && rowIndex < rowsCount) {
        data[rowIndex][columnIndex] = cell.value;
      }
    }
    var rowIndexSourceMap = options.rowIndexSourceMap;
    if (rowIndexSourceMap) {
      var _i = 0;
      while (_i < data.length) {
        rowIndexSourceMap[_i] = _i;
        _i++;
      }
    }
    data = dropEmptyRows(dropEmptyColumns(data, {
      onlyTrimAtTheEnd: true
    }), {
      onlyTrimAtTheEnd: true,
      rowIndexSourceMap
    });
    if (options.transformData) {
      data = options.transformData(data);
    }
    return data;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/readXlsx.js
  function _typeof2(o) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof2(o);
  }
  function _createForOfIteratorHelperLoose5(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray6(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray6(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray6(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray6(o, minLen);
  }
  function _arrayLikeToArray6(arr, len) {
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
    key = _toPropertyKey2(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey2(arg) {
    var key = _toPrimitive2(arg, "string");
    return _typeof2(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive2(input, hint) {
    if (_typeof2(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof2(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function readXlsx(contents, xml) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!options.sheet) {
      options = _objectSpread2({
        sheet: 1
      }, options);
    }
    var getXmlFileContent = function getXmlFileContent2(filePath) {
      if (!contents[filePath]) {
        throw new Error('"'.concat(filePath, '" file not found inside the *.xlsx file zip archive'));
      }
      return contents[filePath];
    };
    var filePaths = parseFilePaths(getXmlFileContent("xl/_rels/workbook.xml.rels"), xml);
    var values = filePaths.sharedStrings ? parseSharedStrings(getXmlFileContent(filePaths.sharedStrings), xml) : [];
    var styles = filePaths.styles ? parseStyles(getXmlFileContent(filePaths.styles), xml) : {};
    var properties = parseProperties(getXmlFileContent("xl/workbook.xml"), xml);
    if (options.getSheets) {
      return properties.sheets.map(function(_ref) {
        var name = _ref.name;
        return {
          name
        };
      });
    }
    var sheetId = getSheetId(options.sheet, properties.sheets);
    if (!sheetId || !filePaths.sheets[sheetId]) {
      throw createSheetNotFoundError(options.sheet, properties.sheets);
    }
    var sheet = parseSheet(getXmlFileContent(filePaths.sheets[sheetId]), xml, values, styles, properties, options);
    options = _objectSpread2({
      // Create a `rowIndexSourceMap` for the original dataset, if not passed,
      // because "empty" rows will be dropped from the input data.
      rowIndexSourceMap: []
    }, options);
    var data = getData(sheet, options);
    if (options.properties) {
      return {
        data,
        properties
      };
    }
    return data;
  }
  function getSheetId(sheet, sheets) {
    if (typeof sheet === "number") {
      var _sheet = sheets[sheet - 1];
      return _sheet && _sheet.relationId;
    }
    for (var _iterator = _createForOfIteratorHelperLoose5(sheets), _step; !(_step = _iterator()).done; ) {
      var _sheet2 = _step.value;
      if (_sheet2.name === sheet) {
        return _sheet2.relationId;
      }
    }
  }
  function createSheetNotFoundError(sheet, sheets) {
    var sheetsList = sheets && sheets.map(function(sheet2, i) {
      return '"'.concat(sheet2.name, '" (#').concat(i + 1, ")");
    }).join(", ");
    return new Error("Sheet ".concat(typeof sheet === "number" ? "#" + sheet : '"' + sheet + '"', " not found in the *.xlsx file.").concat(sheets ? " Available sheets: " + sheetsList + "." : ""));
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/types/InvalidError.js
  function _typeof3(o) {
    "@babel/helpers - typeof";
    return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof3(o);
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey3(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey3(arg) {
    var key = _toPrimitive3(arg, "string");
    return _typeof3(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive3(input, hint) {
    if (_typeof3(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof3(res) !== "object") return res;
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
    if (call && (_typeof3(call) === "object" || typeof call === "function")) {
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
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
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
      _construct = function _construct2(Parent2, args2, Class2) {
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
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var InvalidError = /* @__PURE__ */ (function(_Error) {
    _inherits(InvalidError2, _Error);
    var _super = _createSuper(InvalidError2);
    function InvalidError2(reason) {
      var _this;
      _classCallCheck(this, InvalidError2);
      _this = _super.call(this, "invalid");
      _this.reason = reason;
      return _this;
    }
    return _createClass(InvalidError2);
  })(/* @__PURE__ */ _wrapNativeSuper(Error));

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/types/Number.js
  function NumberType(value) {
    if (typeof value === "string") {
      var stringifiedValue = value;
      value = Number(value);
      if (String(value) !== stringifiedValue) {
        throw new InvalidError("not_a_number");
      }
    }
    if (typeof value !== "number") {
      throw new InvalidError("not_a_number");
    }
    if (isNaN(value)) {
      throw new InvalidError("invalid_number");
    }
    if (!isFinite(value)) {
      throw new InvalidError("out_of_bounds");
    }
    return value;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/types/String.js
  function StringType(value) {
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      if (isNaN(value)) {
        throw new InvalidError("invalid_number");
      }
      if (!isFinite(value)) {
        throw new InvalidError("out_of_bounds");
      }
      return String(value);
    }
    throw new InvalidError("not_a_string");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/types/Boolean.js
  function BooleanType(value) {
    if (typeof value === "boolean") {
      return value;
    }
    throw new InvalidError("not_a_boolean");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/types/Date.js
  function DateType(value, _ref) {
    var properties = _ref.properties;
    if (value instanceof Date) {
      if (isNaN(value.valueOf())) {
        throw new InvalidError("out_of_bounds");
      }
      return value;
    }
    if (typeof value === "number") {
      if (isNaN(value)) {
        throw new InvalidError("invalid_number");
      }
      if (!isFinite(value)) {
        throw new InvalidError("out_of_bounds");
      }
      var date = parseExcelDate(value, properties);
      if (isNaN(date.valueOf())) {
        throw new InvalidError("out_of_bounds");
      }
      return date;
    }
    throw new InvalidError("not_a_date");
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/schema/mapToObjects.js
  var _excluded = ["isColumnOriented", "ignoreEmptyRows", "rowIndexSourceMap"];
  function _typeof4(o) {
    "@babel/helpers - typeof";
    return _typeof4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof4(o);
  }
  function _slicedToArray3(arr, i) {
    return _arrayWithHoles3(arr) || _iterableToArrayLimit3(arr, i) || _unsupportedIterableToArray7(arr, i) || _nonIterableRest3();
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
  function _createForOfIteratorHelperLoose6(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray7(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray7(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray7(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray7(o, minLen);
  }
  function _arrayLikeToArray7(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
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
  function ownKeys3(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread3(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys3(Object(t), true).forEach(function(r2) {
        _defineProperty3(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys3(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _defineProperty3(obj, key, value) {
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
    return _typeof4(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive4(input, hint) {
    if (_typeof4(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof4(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var DEFAULT_OPTIONS = {
    schemaPropertyValueForMissingColumn: void 0,
    schemaPropertyValueForMissingValue: null,
    schemaPropertyShouldSkipRequiredValidationForMissingColumn: function schemaPropertyShouldSkipRequiredValidationForMissingColumn() {
      return false;
    },
    // `getEmptyObjectValue(object, { path })` applies to both the top-level object
    // and any of its sub-objects.
    getEmptyObjectValue: function getEmptyObjectValue() {
      return null;
    },
    getEmptyArrayValue: function getEmptyArrayValue() {
      return null;
    },
    isColumnOriented: false,
    ignoreEmptyRows: true,
    arrayValueSeparator: ","
  };
  function mapToObjects(data, schema, options) {
    if (options) {
      options = _objectSpread3(_objectSpread3({}, DEFAULT_OPTIONS), options);
    } else {
      options = DEFAULT_OPTIONS;
    }
    var _options = options, isColumnOriented = _options.isColumnOriented, ignoreEmptyRows = _options.ignoreEmptyRows, rowIndexSourceMapOriginal = _options.rowIndexSourceMap, schemaTransformOptions = _objectWithoutProperties(_options, _excluded);
    var rowIndexSourceMap = rowIndexSourceMapOriginal && rowIndexSourceMapOriginal.slice();
    validateSchema(schema);
    if (isColumnOriented) {
      data = transpose(data);
    }
    if (ignoreEmptyRows) {
      data = data.filter(function(row, i2) {
        var isEmptyRow = row.every(function(cell) {
          return cell === null;
        });
        if (isEmptyRow) {
          if (rowIndexSourceMap) {
            rowIndexSourceMap.splice(i2, 1);
          }
          return false;
        }
        return true;
      });
    }
    var columns = data[0];
    var results = [];
    var errors = [];
    for (var i = 1; i < data.length; i++) {
      var result = read(schema, data[i], i, void 0, columns, errors, schemaTransformOptions);
      results.push(result);
    }
    if (rowIndexSourceMap) {
      for (var _iterator = _createForOfIteratorHelperLoose6(errors), _step; !(_step = _iterator()).done; ) {
        var error = _step.value;
        error.row = rowIndexSourceMap[error.row - 1] + 1;
      }
    }
    return {
      rows: results,
      errors
    };
  }
  function read(schema, row, rowIndex, path, columns, errors, options) {
    var object = {};
    var isEmptyObject = true;
    var createError = function createError2(_ref) {
      var schemaEntry2 = _ref.schemaEntry, value2 = _ref.value, errorMessage = _ref.error, reason = _ref.reason;
      var error = {
        error: errorMessage,
        row: rowIndex + 1,
        column: schemaEntry2.column,
        value: value2
      };
      if (reason) {
        error.reason = reason;
      }
      if (schemaEntry2.type) {
        error.type = schemaEntry2.type;
      }
      return error;
    };
    var pendingRequiredChecks = [];
    var _loop = function _loop2() {
      var key = _Object$keys[_i];
      var schemaEntry2 = schema[key];
      var propertyName = key;
      var columnTitle = schemaEntry2.column;
      var propertyPath = "".concat(path || "", ".").concat(propertyName);
      var cellValue;
      var columnIndex = columns.indexOf(columnTitle);
      var isMissingColumn2 = columnIndex < 0;
      if (!isMissingColumn2) {
        cellValue = row[columnIndex];
      }
      var value2;
      var error;
      var reason;
      if (schemaEntry2.schema) {
        value2 = read(schemaEntry2.schema, row, rowIndex, propertyPath, columns, errors, options);
      } else {
        if (isMissingColumn2) {
          if ("schemaPropertyValueForMissingColumn" in options) {
            value2 = options.schemaPropertyValueForMissingColumn;
          }
        } else if (cellValue === void 0) {
          if ("schemaPropertyValueForMissingValue" in options) {
            value2 = options.schemaPropertyValueForMissingValue;
          }
        } else if (cellValue === null) {
          if ("schemaPropertyValueForMissingValue" in options) {
            value2 = options.schemaPropertyValueForMissingValue;
          }
        } else if (Array.isArray(schemaEntry2.type)) {
          var array = parseArray(cellValue, options.arrayValueSeparator).map(function(_value) {
            if (error) {
              return;
            }
            var result2 = parseValue(_value, schemaEntry2, options);
            if (result2.error) {
              value2 = _value;
              error = result2.error;
              reason = result2.reason;
            }
            return result2.value;
          });
          if (!error) {
            var isEmpty = array.every(isEmptyValue);
            value2 = isEmpty ? options.getEmptyArrayValue(array, {
              path: propertyPath
            }) : array;
          }
        } else {
          var result = parseValue(cellValue, schemaEntry2, options);
          error = result.error;
          reason = result.reason;
          value2 = error ? cellValue : result.value;
        }
      }
      if (!error && isEmptyValue(value2)) {
        if (schemaEntry2.required) {
          pendingRequiredChecks.push({
            schemaEntry: schemaEntry2,
            value: value2,
            isMissingColumn: isMissingColumn2
          });
        }
      }
      if (error) {
        errors.push(createError({
          schemaEntry: schemaEntry2,
          value: value2,
          error,
          reason
        }));
      } else {
        if (isEmptyObject && !isEmptyValue(value2)) {
          isEmptyObject = false;
        }
        if (value2 !== void 0) {
          object[propertyName] = value2;
        }
      }
    };
    for (var _i = 0, _Object$keys = Object.keys(schema); _i < _Object$keys.length; _i++) {
      _loop();
    }
    if (isEmptyObject) {
      return options.getEmptyObjectValue(object, {
        path
      });
    }
    for (var _i2 = 0, _pendingRequiredCheck = pendingRequiredChecks; _i2 < _pendingRequiredCheck.length; _i2++) {
      var _pendingRequiredCheck2 = _pendingRequiredCheck[_i2], schemaEntry = _pendingRequiredCheck2.schemaEntry, value = _pendingRequiredCheck2.value, isMissingColumn = _pendingRequiredCheck2.isMissingColumn;
      var skipRequiredValidation = isMissingColumn && options.schemaPropertyShouldSkipRequiredValidationForMissingColumn(schemaEntry.column, {
        object
      });
      if (!skipRequiredValidation) {
        var required = schemaEntry.required;
        var isRequired = typeof required === "boolean" ? required : required(object);
        if (isRequired) {
          errors.push(createError({
            schemaEntry,
            value,
            error: "required"
          }));
        }
      }
    }
    return object;
  }
  function parseValue(value, schemaEntry, options) {
    if (value === null) {
      return {
        value: null
      };
    }
    var result;
    if (schemaEntry.parse) {
      throw new Error("`schemaEntry.parse` property was renamed to `schemaEntry.type`");
    } else if (schemaEntry.type) {
      result = parseValueOfType(
        value,
        // Supports parsing array types.
        // See `parseArray()` function for more details.
        // Example `type`: String[]
        // Input: 'Barack Obama, "String, with, colons", Donald Trump'
        // Output: ['Barack Obama', 'String, with, colons', 'Donald Trump']
        Array.isArray(schemaEntry.type) ? schemaEntry.type[0] : schemaEntry.type,
        options
      );
    } else {
      result = {
        value
      };
    }
    if (result.error) {
      return result;
    }
    if (result.value !== null) {
      if (schemaEntry.oneOf && schemaEntry.oneOf.indexOf(result.value) < 0) {
        return {
          error: "invalid",
          reason: "unknown"
        };
      }
      if (schemaEntry.validate) {
        try {
          schemaEntry.validate(result.value);
        } catch (error) {
          return {
            error: error.message
          };
        }
      }
    }
    return result;
  }
  function parseCustomValue(value, parse) {
    try {
      var parsedValue = parse(value);
      if (parsedValue === void 0) {
        return {
          value: null
        };
      }
      return {
        value: parsedValue
      };
    } catch (error) {
      var result = {
        error: error.message
      };
      if (error.reason) {
        result.reason = error.reason;
      }
      return result;
    }
  }
  function parseValueOfType(value, type, options) {
    switch (type) {
      case String:
        return parseCustomValue(value, StringType);
      case Number:
        return parseCustomValue(value, NumberType);
      case Date:
        return parseCustomValue(value, function(value2) {
          return DateType(value2, {
            properties: options.properties
          });
        });
      case Boolean:
        return parseCustomValue(value, BooleanType);
      default:
        if (typeof type === "function") {
          return parseCustomValue(value, type);
        }
        throw new Error("Unsupported schema type: ".concat(type && type.name || type));
    }
  }
  function getBlock(string, endCharacter, startIndex) {
    var i = 0;
    var substring = "";
    var character;
    while (startIndex + i < string.length) {
      var _character = string[startIndex + i];
      if (_character === endCharacter) {
        return [substring, i];
      } else if (_character === '"') {
        var block = getBlock(string, '"', startIndex + i + 1);
        substring += block[0];
        i += '"'.length + block[1] + '"'.length;
      } else {
        substring += _character;
        i++;
      }
    }
    return [substring, i];
  }
  function parseArray(string, arrayValueSeparator) {
    var blocks = [];
    var index = 0;
    while (index < string.length) {
      var _getBlock = getBlock(string, arrayValueSeparator, index), _getBlock2 = _slicedToArray3(_getBlock, 2), substring = _getBlock2[0], length = _getBlock2[1];
      index += length + arrayValueSeparator.length;
      blocks.push(substring.trim());
    }
    return blocks;
  }
  var transpose = function transpose2(array) {
    return array[0].map(function(_, i) {
      return array.map(function(row) {
        return row[i];
      });
    });
  };
  function validateSchema(schema) {
    for (var _i3 = 0, _Object$keys2 = Object.keys(schema); _i3 < _Object$keys2.length; _i3++) {
      var key = _Object$keys2[_i3];
      var schemaEntry = schema[key];
      if (_typeof4(schemaEntry.type) === "object" && !Array.isArray(schemaEntry.type)) {
        throw new Error("When defining a nested schema, use a `schema` property instead of a `type` property");
      }
      if (!schemaEntry.schema) {
        if (!schemaEntry.column) {
          throw new Error('"column" not defined for schema entry "'.concat(key, '".'));
        }
      }
    }
  }
  function isEmptyValue(value) {
    return value === void 0 || value === null;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/readXlsxFileContents.js
  function _typeof5(o) {
    "@babel/helpers - typeof";
    return _typeof5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof5(o);
  }
  var _excluded2 = ["schema"];
  function ownKeys4(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread4(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys4(Object(t), true).forEach(function(r2) {
        _defineProperty4(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys4(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _defineProperty4(obj, key, value) {
    key = _toPropertyKey5(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey5(arg) {
    var key = _toPrimitive5(arg, "string");
    return _typeof5(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive5(input, hint) {
    if (_typeof5(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof5(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _objectWithoutProperties2(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose2(source, excluded);
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
  function _objectWithoutPropertiesLoose2(source, excluded) {
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
  function readXlsxFileContents(entries, xml, _ref) {
    var schema = _ref.schema, options = _objectWithoutProperties2(_ref, _excluded2);
    if (options.map) {
      throw new Error("`map` option was removed. Pass a `schema` option instead.");
    }
    var result = readXlsx(entries, xml, _objectSpread4(_objectSpread4({}, options), {}, {
      properties: schema || options.properties
    }));
    if (schema) {
      return mapToObjects(result.data, schema, _objectSpread4(_objectSpread4({}, options), {}, {
        properties: result.properties
      }));
    }
    return result;
  }

  // ../../../../../tmp/tinplate-web-build/node_modules/read-excel-file/modules/read/readXlsxFileBrowser.js
  function readXlsxFile(file) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return unpackXlsxFile(file).then(function(entries) {
      return readXlsxFileContents(entries, xmlBrowser_default, options);
    });
  }

  // app.source.js
  var API_URL = window.TINPLATE_API_URL || "https://tinplate-flow-api.eugenelim831-1b3.workers.dev";
  var APP_BUILD = "20260805-manual-stock-1";
  var PIN_STORAGE_KEY = "movementAppPin";
  var LOCATIONS = ["STORAGE", "SLITTER", "PRODUCTION_LINE", "PRINTING"];
  var LOCATION_LABELS = {
    STORAGE: "Storage",
    PRINTING: "Printing",
    SLITTER: "Slitter",
    PRODUCTION_LINE: "Production Line",
    EXCEL_IMPORT: "Excel Import",
    MANUAL_ENTRY: "Manual Entry"
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
    let response;
    try {
      response = await fetch(API_URL.replace(/\/$/, "") + path, Object.assign({}, settings, { headers }));
    } catch (error) {
      throw new Error("Cannot connect to the Tinplate Flow API. Confirm the tinplate-flow-api Worker is deployed and try again.");
    }
    const body = await response.json().catch(function() {
      return {};
    });
    if (!response.ok) throw new Error(body.error || "Request failed (" + response.status + ").");
    return body;
  }
  async function apiBlob(path) {
    let response;
    try {
      response = await fetch(API_URL.replace(/\/$/, "") + path, {
        headers: { "X-App-Pin": getPin() }
      });
    } catch (error) {
      throw new Error("Cannot connect to the Tinplate Flow API.");
    }
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
          lot.dateReceived ? "Received " + formatReceivedDate(lot.dateReceived) : ""
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
  $("#addTinplate").addEventListener("click", openManualStockDialog);
  $("#manualBatch").addEventListener("input", function(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 12);
    event.target.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
    updateManualBatchStatus();
  });
  [$("#manualThickness"), $("#manualWidth"), $("#manualLength")].forEach(function(input) {
    input.addEventListener("input", function() {
      if (input === $("#manualThickness")) input.value = input.value.replace(/\D/g, "").slice(0, 2);
      updateManualDimensions();
    });
  });
  [$("#manualWidth"), $("#manualLength"), $("#manualSheets"), $("#manualKg")].forEach(setupWholeNumberInput);
  setupConditionalOther($("#manualSupplier"), $("#manualSupplierOtherLabel"), $("#manualSupplierOther"));
  setupConditionalOther($("#manualTemper"), $("#manualTemperOtherLabel"), $("#manualTemperOther"));
  setupConditionalOther($("#manualCoating"), $("#manualCoatingOtherLabel"), $("#manualCoatingOther"));
  [$("#manualPrice"), $("#manualTotalAmount")].forEach(setupCurrencyInput);
  $("#manualDateReceived").addEventListener("input", function(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
    event.target.value = digits.length > 4 ? digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4) : digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });
  function openManualStockDialog() {
    $("#manualStockForm").reset();
    $("#manualStockDialog").dataset.location = state.currentLocation;
    $("#manualLocation").value = locationLabel(state.currentLocation);
    $("#manualPrice").value = "0.00";
    $("#manualPrice").dataset.cents = "0";
    $("#manualTotalAmount").value = "0.00";
    $("#manualTotalAmount").dataset.cents = "0";
    $("#manualDimensions").value = "";
    $("#manualBatchStatus").textContent = "Enter a new batch number.";
    $("#manualBatchStatus").className = "field-status wide";
    $("#submitManualStock").disabled = false;
    [
      [$("#manualSupplier"), $("#manualSupplierOtherLabel"), $("#manualSupplierOther")],
      [$("#manualTemper"), $("#manualTemperOtherLabel"), $("#manualTemperOther")],
      [$("#manualCoating"), $("#manualCoatingOtherLabel"), $("#manualCoatingOther")]
    ].forEach(function(entry) {
      updateConditionalOther(entry[0], entry[1], entry[2]);
    });
    $("#manualSignature").clearSignature();
    $("#manualStockDialog").showModal();
    $("#manualSignature").prepareSignature();
  }
  function updateManualBatchStatus() {
    const batch = $("#manualBatch").value;
    const status = $("#manualBatchStatus");
    if (!/^\d{2}\/\d+$/.test(batch)) {
      status.textContent = batch ? "Complete the batch number after the automatically inserted slash." : "Enter a new batch number.";
      status.className = "field-status wide";
      $("#submitManualStock").disabled = false;
      return;
    }
    if (state.knownBatchNumbers.has(batch)) {
      status.textContent = "Duplicate blocked: batch " + batch + " already exists in current stock or record history.";
      status.className = "field-status wide error";
      $("#submitManualStock").disabled = true;
      return;
    }
    status.textContent = "Batch " + batch + " is available to add.";
    status.className = "field-status wide success";
    $("#submitManualStock").disabled = false;
  }
  function updateManualDimensions() {
    const thicknessCode = Number($("#manualThickness").value);
    const width = Number($("#manualWidth").value);
    const length = Number($("#manualLength").value);
    $("#manualDimensions").value = Number.isSafeInteger(thicknessCode) && thicknessCode > 0 && Number.isSafeInteger(width) && width > 0 && Number.isSafeInteger(length) && length > 0 ? (thicknessCode / 100).toFixed(2) + "*" + width + "*" + length : "";
  }
  function setupWholeNumberInput(input) {
    input.addEventListener("input", function() {
      const digits = input.value.replace(/\D/g, "");
      if (input.value !== digits) input.value = digits;
    });
  }
  function setupConditionalOther(select, label, input) {
    select.addEventListener("change", function() {
      updateConditionalOther(select, label, input);
    });
    updateConditionalOther(select, label, input);
  }
  function updateConditionalOther(select, label, input) {
    const show = select.value === "OTHER";
    label.classList.toggle("hidden", !show);
    input.required = show;
    if (!show) input.value = "";
  }
  function selectedOrOther(select, otherInput, label) {
    if (!select.value) throw new Error("Select " + label.toLowerCase() + ".");
    if (select.value !== "OTHER") return select.value;
    const value = otherInput.value.trim();
    if (!value) throw new Error("Enter the other " + label.toLowerCase() + ".");
    return value;
  }
  function setupCurrencyInput(input) {
    input.dataset.cents = "0";
    input.addEventListener("focus", function() {
      requestAnimationFrame(function() {
        input.setSelectionRange(input.value.length, input.value.length);
      });
    });
    input.addEventListener("input", function() {
      const digits = input.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 11);
      const cents = Number(digits || 0);
      input.dataset.cents = String(cents);
      input.value = (cents / 100).toFixed(2);
      requestAnimationFrame(function() {
        input.setSelectionRange(input.value.length, input.value.length);
      });
    });
  }
  function parseManualDate(value) {
    const match = String(value || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) throw new Error("Date received must contain day, month and four-digit year.");
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (year < 2e3 || year > 2100 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new Error("Enter a valid date received in day/month/year order.");
    }
    return String(year) + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }
  $("#manualStockForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const signature = $("#manualSignature").signatureData();
    if (!signature) return showToast("PIC signature is required.", true);
    let payload;
    try {
      const batchNumber = $("#manualBatch").value;
      if (!/^\d{2}\/\d+$/.test(batchNumber)) throw new Error("Batch number must start with two digits followed by the automatically inserted slash.");
      if (state.knownBatchNumbers.has(batchNumber)) throw new Error("Batch " + batchNumber + " already exists and cannot be added again.");
      const dimensions = $("#manualDimensions").value;
      if (!parseDimensions2(dimensions)) throw new Error("Complete all three size boxes with positive whole numbers.");
      const sheets = Number($("#manualSheets").value);
      const kg = Number($("#manualKg").value);
      if (!Number.isSafeInteger(sheets) || sheets <= 0) throw new Error("Sheets must be a positive whole number.");
      if (!Number.isSafeInteger(kg) || kg <= 0) throw new Error("KG must be a positive whole number.");
      payload = {
        type: "MANUAL_ADDITION",
        location: $("#manualStockDialog").dataset.location,
        batchNumber,
        supplierName: selectedOrOther($("#manualSupplier"), $("#manualSupplierOther"), "Supplier"),
        dimensions,
        temper: selectedOrOther($("#manualTemper"), $("#manualTemperOther"), "Temper"),
        tinCoating: selectedOrOther($("#manualCoating"), $("#manualCoatingOther"), "Tin coating"),
        sheets,
        kg,
        price: Number($("#manualPrice").dataset.cents || 0) / 100,
        totalAmount: Number($("#manualTotalAmount").dataset.cents || 0) / 100,
        dateReceived: parseManualDate($("#manualDateReceived").value),
        description: $("#manualReason").value.trim(),
        picName: $("#manualPic").value.trim(),
        signature
      };
    } catch (error) {
      return showToast(error.message, true);
    }
    const button = $("#submitManualStock");
    button.disabled = true;
    button.textContent = "Adding\u2026";
    try {
      const result = await api("/records", { method: "POST", body: JSON.stringify(payload) });
      $("#manualStockDialog").close();
      state.selectedLotIds.clear();
      showToast("Batch " + payload.batchNumber + " added to " + locationLabel(payload.location) + " under record " + result.record.id + ".");
      await Promise.all([loadInventory(), loadRecords(false)]);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = "Add New Batch";
    }
  });
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
      const workbook = await readExcelWorkbook(await readFileAsArrayBuffer(file));
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
  async function readExcelWorkbook(arrayBuffer) {
    const sheets = await readXlsxFile(arrayBuffer, { getSheets: true });
    return Promise.all(sheets.map(async function(sheet) {
      return {
        sheet: sheet.name,
        data: await readXlsxFile(arrayBuffer, { sheet: sheet.name })
      };
    }));
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
      if (!/^\d{2}\/\d+$/.test(batchNumber)) errors.push("Batch must start with two digits followed by / and whole numbers");
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
    const parts = parseDimensions2(lot.dimensions);
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
      const dimensions = parseDimensions2(lot.dimensions);
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
      const purpose = record.type === "STOCK_IMPORT" ? formatNumber(record.importResult && record.importResult.added) + " new \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored" : record.type === "MANUAL_ADDITION" ? "New batch added to " + locationLabel(record.destinationLocation) : purposeSummary(record.purpose);
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
    let html = '<dl class="detail-grid">' + detailCell("Record ID", record.id) + detailCell("Type", recordTypeLabel(record.type)) + detailCell("Status", titleCase(record.status)) + detailCell("From", locationLabel(record.sourceLocation)) + detailCell("To / Process", destination) + detailCell("Worker date & time", formatDate(record.createdAt)) + detailCell("PIC", record.picName) + detailCell("Purpose", record.type === "STOCK_IMPORT" ? "Opening stock import" : record.type === "MANUAL_ADDITION" ? "Manual stock correction" : purposeSummary(record.purpose)) + detailCell("Description", record.description) + (record.type === "STOCK_IMPORT" ? detailCell("Excel file", record.fileName) + detailCell("Worksheet", record.sourceSheet) + detailCell("Import result", formatNumber(record.importResult && record.importResult.added) + " added \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored") : "") + "</dl>";
    if (record.type === "TRANSFER") {
      html += '<section class="record-items"><h3>Transferred stock</h3><div class="table-wrap"><table><thead><tr><th>Source stock ID</th><th>Destination stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + escapeHtml(item.sourceLotId) + "</td><td>" + escapeHtml(item.destinationLotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + formatNumber(item.quantity) + " " + escapeHtml(unitLabel(item.unit)) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";
    } else if (record.type === "MANUAL_ADDITION") {
      html += '<section class="record-items"><h3>Batch added to ' + escapeHtml(locationLabel(record.destinationLocation)) + '</h3><div class="table-wrap"><table><thead><tr><th>Stock ID</th><th>Batch</th><th>Supplier</th><th>Size</th><th>Temper</th><th>Tin coating</th><th>Sheets</th><th>KG</th><th>Price</th><th>Total amount</th><th>Date received</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + escapeHtml(item.lotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.supplierName || "\u2014") + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + escapeHtml(item.temper || "\u2014") + "</td><td>" + escapeHtml(item.tinCoating || "\u2014") + "</td><td>" + formatNumber(item.quantity) + "</td><td>" + formatNumber(item.kg) + "</td><td>" + formatMoney(item.price) + "</td><td>" + formatMoney(item.totalAmount) + "</td><td>" + escapeHtml(formatReceivedDate(item.dateReceived)) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";
    } else if (record.type === "STOCK_IMPORT") {
      html += '<section class="record-items"><h3>Stock batches added to Storage</h3><div class="table-wrap"><table><thead><tr><th>Excel row</th><th>Stock ID</th><th>Batch</th><th>Supplier</th><th>Size</th><th>Temper</th><th>Tin coating</th><th>Sheets</th><th>KG</th><th>Price</th><th>Total amount</th><th>Date received</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + item.sourceRow + "</td><td>" + escapeHtml(item.lotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.supplierName || "\u2014") + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + escapeHtml(item.temper || "\u2014") + "</td><td>" + escapeHtml(item.tinCoating || "\u2014") + "</td><td>" + formatNumber(item.quantity) + "</td><td>" + formatDecimal(item.kg) + "</td><td>" + formatMoney(item.price) + "</td><td>" + formatMoney(item.totalAmount) + "</td><td>" + escapeHtml(formatReceivedDate(item.dateReceived)) + "</td></tr>";
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
          line.dateReceived ? formatReceivedDate(line.dateReceived) : ""
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
  function parseDimensions2(value) {
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
    if (type === "MANUAL_ADDITION") return "Manual Addition";
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
  function formatReceivedDate(value) {
    if (!value) return "\u2014";
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? match[3] + "/" + match[2] + "/" + match[1] : String(value);
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
