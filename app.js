(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/can-promise.js
  var require_can_promise = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/can-promise.js"(exports, module) {
      module.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/utils.js
  var require_utils = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/utils.js"(exports) {
      var toSJISFunction;
      var CODEWORDS_COUNT = [
        0,
        // Not used
        26,
        44,
        70,
        100,
        134,
        172,
        196,
        242,
        292,
        346,
        404,
        466,
        532,
        581,
        655,
        733,
        815,
        901,
        991,
        1085,
        1156,
        1258,
        1364,
        1474,
        1588,
        1706,
        1828,
        1921,
        2051,
        2185,
        2323,
        2465,
        2611,
        2761,
        2876,
        3034,
        3196,
        3362,
        3532,
        3706
      ];
      exports.getSymbolSize = function getSymbolSize(version) {
        if (!version) throw new Error('"version" cannot be null or undefined');
        if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
        return version * 4 + 17;
      };
      exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
        return CODEWORDS_COUNT[version];
      };
      exports.getBCHDigit = function(data) {
        let digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      };
      exports.setToSJISFunction = function setToSJISFunction(f) {
        if (typeof f !== "function") {
          throw new Error('"toSJISFunc" is not a valid function.');
        }
        toSJISFunction = f;
      };
      exports.isKanjiModeEnabled = function() {
        return typeof toSJISFunction !== "undefined";
      };
      exports.toSJIS = function toSJIS(kanji) {
        return toSJISFunction(kanji);
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/error-correction-level.js
  var require_error_correction_level = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/bit-buffer.js
  var require_bit_buffer = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
      function BitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      BitBuffer.prototype = {
        get: function(index) {
          const bufIndex = Math.floor(index / 8);
          return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
        },
        put: function(num, length) {
          for (let i = 0; i < length; i++) {
            this.putBit((num >>> length - i - 1 & 1) === 1);
          }
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(bit) {
          const bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
          }
          if (bit) {
            this.buffer[bufIndex] |= 128 >>> this.length % 8;
          }
          this.length++;
        }
      };
      module.exports = BitBuffer;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/bit-matrix.js
  var require_bit_matrix = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
      function BitMatrix(size) {
        if (!size || size < 1) {
          throw new Error("BitMatrix size must be defined and greater than 0");
        }
        this.size = size;
        this.data = new Uint8Array(size * size);
        this.reservedBit = new Uint8Array(size * size);
      }
      BitMatrix.prototype.set = function(row, col, value, reserved) {
        const index = row * this.size + col;
        this.data[index] = value;
        if (reserved) this.reservedBit[index] = true;
      };
      BitMatrix.prototype.get = function(row, col) {
        return this.data[row * this.size + col];
      };
      BitMatrix.prototype.xor = function(row, col, value) {
        this.data[row * this.size + col] ^= value;
      };
      BitMatrix.prototype.isReserved = function(row, col) {
        return this.reservedBit[row * this.size + col];
      };
      module.exports = BitMatrix;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/alignment-pattern.js
  var require_alignment_pattern = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version) {
        if (version === 1) return [];
        const posCount = Math.floor(version / 7) + 2;
        const size = getSymbolSize(version);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version) {
        const coords = [];
        const pos = exports.getRowColCoords(version);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/finder-pattern.js
  var require_finder_pattern = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      var FINDER_PATTERN_SIZE = 7;
      exports.getPositions = function getPositions(version) {
        const size = getSymbolSize(version);
        return [
          // top-left
          [0, 0],
          // top-right
          [size - FINDER_PATTERN_SIZE, 0],
          // bottom-left
          [0, size - FINDER_PATTERN_SIZE]
        ];
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/mask-pattern.js
  var require_mask_pattern = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value) {
        return exports.isValid(value) ? parseInt(value, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data) {
        const size = data.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module2 = data.get(row, col);
            if (module2 === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module2;
              sameCountCol = 1;
            }
            module2 = data.get(col, row);
            if (module2 === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module2;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data) {
        const size = data.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data) {
        const size = data.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data) {
        let darkCount = 0;
        const modulesCount = data.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern, i, j) {
        switch (maskPattern) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }
      exports.applyMask = function applyMask(pattern, data) {
        const size = data.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data.isReserved(row, col)) continue;
            data.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data);
          const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
          exports.applyMask(p, data);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/error-correction-code.js
  var require_error_correction_code = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
      var ECLevel = require_error_correction_level();
      var EC_BLOCKS_TABLE = [
        // L  M  Q  H
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        4,
        1,
        2,
        4,
        4,
        2,
        4,
        4,
        4,
        2,
        4,
        6,
        5,
        2,
        4,
        6,
        6,
        2,
        5,
        8,
        8,
        4,
        5,
        8,
        8,
        4,
        5,
        8,
        11,
        4,
        8,
        10,
        11,
        4,
        9,
        12,
        16,
        4,
        9,
        16,
        16,
        6,
        10,
        12,
        18,
        6,
        10,
        17,
        16,
        6,
        11,
        16,
        19,
        6,
        13,
        18,
        21,
        7,
        14,
        21,
        25,
        8,
        16,
        20,
        25,
        8,
        17,
        23,
        25,
        9,
        17,
        23,
        34,
        9,
        18,
        25,
        30,
        10,
        20,
        27,
        32,
        12,
        21,
        29,
        35,
        12,
        23,
        34,
        37,
        12,
        25,
        34,
        40,
        13,
        26,
        35,
        42,
        14,
        28,
        38,
        45,
        15,
        29,
        40,
        48,
        16,
        31,
        43,
        51,
        17,
        33,
        45,
        54,
        18,
        35,
        48,
        57,
        19,
        37,
        51,
        60,
        19,
        38,
        53,
        63,
        20,
        40,
        56,
        66,
        21,
        43,
        59,
        70,
        22,
        45,
        62,
        74,
        24,
        47,
        65,
        77,
        25,
        49,
        68,
        81
      ];
      var EC_CODEWORDS_TABLE = [
        // L  M  Q  H
        7,
        10,
        13,
        17,
        10,
        16,
        22,
        28,
        15,
        26,
        36,
        44,
        20,
        36,
        52,
        64,
        26,
        48,
        72,
        88,
        36,
        64,
        96,
        112,
        40,
        72,
        108,
        130,
        48,
        88,
        132,
        156,
        60,
        110,
        160,
        192,
        72,
        130,
        192,
        224,
        80,
        150,
        224,
        264,
        96,
        176,
        260,
        308,
        104,
        198,
        288,
        352,
        120,
        216,
        320,
        384,
        132,
        240,
        360,
        432,
        144,
        280,
        408,
        480,
        168,
        308,
        448,
        532,
        180,
        338,
        504,
        588,
        196,
        364,
        546,
        650,
        224,
        416,
        600,
        700,
        224,
        442,
        644,
        750,
        252,
        476,
        690,
        816,
        270,
        504,
        750,
        900,
        300,
        560,
        810,
        960,
        312,
        588,
        870,
        1050,
        336,
        644,
        952,
        1110,
        360,
        700,
        1020,
        1200,
        390,
        728,
        1050,
        1260,
        420,
        784,
        1140,
        1350,
        450,
        812,
        1200,
        1440,
        480,
        868,
        1290,
        1530,
        510,
        924,
        1350,
        1620,
        540,
        980,
        1440,
        1710,
        570,
        1036,
        1530,
        1800,
        570,
        1064,
        1590,
        1890,
        600,
        1120,
        1680,
        1980,
        630,
        1204,
        1770,
        2100,
        660,
        1260,
        1860,
        2220,
        720,
        1316,
        1950,
        2310,
        750,
        1372,
        2040,
        2430
      ];
      exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/galois-field.js
  var require_galois_field = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/galois-field.js"(exports) {
      var EXP_TABLE = new Uint8Array(512);
      var LOG_TABLE = new Uint8Array(256);
      (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
          EXP_TABLE[i] = x;
          LOG_TABLE[x] = i;
          x <<= 1;
          if (x & 256) {
            x ^= 285;
          }
        }
        for (let i = 255; i < 512; i++) {
          EXP_TABLE[i] = EXP_TABLE[i - 255];
        }
      })();
      exports.log = function log(n) {
        if (n < 1) throw new Error("log(" + n + ")");
        return LOG_TABLE[n];
      };
      exports.exp = function exp(n) {
        return EXP_TABLE[n];
      };
      exports.mul = function mul(x, y) {
        if (x === 0 || y === 0) return 0;
        return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/polynomial.js
  var require_polynomial = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/polynomial.js"(exports) {
      var GF = require_galois_field();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/reed-solomon-encoder.js
  var require_reed_solomon_encoder = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
      var Polynomial = require_polynomial();
      function ReedSolomonEncoder(degree) {
        this.genPoly = void 0;
        this.degree = degree;
        if (this.degree) this.initialize(this.degree);
      }
      ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
        this.degree = degree;
        this.genPoly = Polynomial.generateECPolynomial(this.degree);
      };
      ReedSolomonEncoder.prototype.encode = function encode(data) {
        if (!this.genPoly) {
          throw new Error("Encoder not initialized");
        }
        const paddedData = new Uint8Array(data.length + this.degree);
        paddedData.set(data);
        const remainder = Polynomial.mod(paddedData, this.genPoly);
        const start = this.degree - remainder.length;
        if (start > 0) {
          const buff = new Uint8Array(this.degree);
          buff.set(remainder, start);
          return buff;
        }
        return remainder;
      };
      module.exports = ReedSolomonEncoder;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/version-check.js
  var require_version_check = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/version-check.js"(exports) {
      exports.isValid = function isValid(version) {
        return !isNaN(version) && version >= 1 && version <= 40;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/regex.js
  var require_regex = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/regex.js"(exports) {
      var numeric = "[0-9]+";
      var alphanumeric = "[A-Z $%*+\\-./:]+";
      var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
      kanji = kanji.replace(/u/g, "\\u");
      var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
      exports.KANJI = new RegExp(kanji, "g");
      exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
      exports.BYTE = new RegExp(byte, "g");
      exports.NUMERIC = new RegExp(numeric, "g");
      exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
      var TEST_KANJI = new RegExp("^" + kanji + "$");
      var TEST_NUMERIC = new RegExp("^" + numeric + "$");
      var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      exports.testKanji = function testKanji(str) {
        return TEST_KANJI.test(str);
      };
      exports.testNumeric = function testNumeric(str) {
        return TEST_NUMERIC.test(str);
      };
      exports.testAlphanumeric = function testAlphanumeric(str) {
        return TEST_ALPHANUMERIC.test(str);
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/mode.js
  var require_mode = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/mode.js"(exports) {
      var VersionCheck = require_version_check();
      var Regex = require_regex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
        if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid version: " + version);
        }
        if (version >= 1 && version < 10) return mode.ccBits[0];
        else if (version < 27) return mode.ccBits[1];
        return mode.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString(mode) {
        if (mode && mode.id) return mode.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode) {
        return mode && mode.bit && mode.ccBits;
      };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string);
        }
      }
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/version.js
  var require_version = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/version.js"(exports) {
      var Utils = require_utils();
      var ECCode = require_error_correction_code();
      var ECLevel = require_error_correction_level();
      var Mode = require_mode();
      var VersionCheck = require_version_check();
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode, version) {
        return Mode.getCharCountIndicator(mode, version) + 4;
      }
      function getTotalBitsFromDataArray(segments, version) {
        let totalBits = 0;
        segments.forEach(function(data) {
          const reservedBits = getReservedBitsCount(data.mode, version);
          totalBits += reservedBits + data.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length = getTotalBitsFromDataArray(segments, currentVersion);
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value, defaultValue) {
        if (VersionCheck.isValid(value)) {
          return parseInt(value, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode === "undefined") mode = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
        switch (mode) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
        if (Array.isArray(data)) {
          if (data.length > 1) {
            return getBestVersionForMixedData(data, ecl);
          }
          if (data.length === 0) {
            return 1;
          }
          seg = data[0];
        } else {
          seg = data;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version) {
        if (!VersionCheck.isValid(version) || version < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version << 12 | d;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/format-info.js
  var require_format_info = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/format-info.js"(exports) {
      var Utils = require_utils();
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var G15_BCH = Utils.getBCHDigit(G15);
      exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
        const data = errorCorrectionLevel.bit << 3 | mask;
        let d = data << 10;
        while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
          d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
        }
        return (data << 10 | d) ^ G15_MASK;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/numeric-data.js
  var require_numeric_data = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
      var Mode = require_mode();
      function NumericData(data) {
        this.mode = Mode.NUMERIC;
        this.data = data.toString();
      }
      NumericData.getBitsLength = function getBitsLength(length) {
        return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
      };
      NumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      NumericData.prototype.getBitsLength = function getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
      };
      NumericData.prototype.write = function write(bitBuffer) {
        let i, group, value;
        for (i = 0; i + 3 <= this.data.length; i += 3) {
          group = this.data.substr(i, 3);
          value = parseInt(group, 10);
          bitBuffer.put(value, 10);
        }
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
          group = this.data.substr(i);
          value = parseInt(group, 10);
          bitBuffer.put(value, remainingNum * 3 + 1);
        }
      };
      module.exports = NumericData;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/alphanumeric-data.js
  var require_alphanumeric_data = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
      var Mode = require_mode();
      var ALPHA_NUM_CHARS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        " ",
        "$",
        "%",
        "*",
        "+",
        "-",
        ".",
        "/",
        ":"
      ];
      function AlphanumericData(data) {
        this.mode = Mode.ALPHANUMERIC;
        this.data = data;
      }
      AlphanumericData.getBitsLength = function getBitsLength(length) {
        return 11 * Math.floor(length / 2) + 6 * (length % 2);
      };
      AlphanumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      AlphanumericData.prototype.getBitsLength = function getBitsLength() {
        return AlphanumericData.getBitsLength(this.data.length);
      };
      AlphanumericData.prototype.write = function write(bitBuffer) {
        let i;
        for (i = 0; i + 2 <= this.data.length; i += 2) {
          let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
          value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
          bitBuffer.put(value, 11);
        }
        if (this.data.length % 2) {
          bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
        }
      };
      module.exports = AlphanumericData;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/byte-data.js
  var require_byte_data = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
      var Mode = require_mode();
      function ByteData(data) {
        this.mode = Mode.BYTE;
        if (typeof data === "string") {
          this.data = new TextEncoder().encode(data);
        } else {
          this.data = new Uint8Array(data);
        }
      }
      ByteData.getBitsLength = function getBitsLength(length) {
        return length * 8;
      };
      ByteData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      ByteData.prototype.getBitsLength = function getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
      };
      ByteData.prototype.write = function(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
          bitBuffer.put(this.data[i], 8);
        }
      };
      module.exports = ByteData;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/kanji-data.js
  var require_kanji_data = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
      var Mode = require_mode();
      var Utils = require_utils();
      function KanjiData(data) {
        this.mode = Mode.KANJI;
        this.data = data;
      }
      KanjiData.getBitsLength = function getBitsLength(length) {
        return length * 13;
      };
      KanjiData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      KanjiData.prototype.getBitsLength = function getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
      };
      KanjiData.prototype.write = function(bitBuffer) {
        let i;
        for (i = 0; i < this.data.length; i++) {
          let value = Utils.toSJIS(this.data[i]);
          if (value >= 33088 && value <= 40956) {
            value -= 33088;
          } else if (value >= 57408 && value <= 60351) {
            value -= 49472;
          } else {
            throw new Error(
              "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
            );
          }
          value = (value >>> 8 & 255) * 192 + (value & 255);
          bitBuffer.put(value, 13);
        }
      };
      module.exports = KanjiData;
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/dijkstrajs/dijkstra.js
  var require_dijkstra = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
      "use strict";
      var dijkstra = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          var predecessor;
          while (u) {
            nodes.push(u);
            predecessor = predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
          return dijkstra.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value, cost) {
            var item = { value, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      if (typeof module !== "undefined") {
        module.exports = dijkstra;
      }
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/segments.js
  var require_segments = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/segments.js"(exports) {
      var Mode = require_mode();
      var NumericData = require_numeric_data();
      var AlphanumericData = require_alphanumeric_data();
      var ByteData = require_byte_data();
      var KanjiData = require_kanji_data();
      var Regex = require_regex();
      var Utils = require_utils();
      var dijkstra = require_dijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex, mode, str) {
        const segments = [];
        let result;
        while ((result = regex.exec(str)) !== null) {
          segments.push({
            data: result[0],
            index: result.index,
            mode,
            length: result[0].length
          });
        }
        return segments;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length, mode) {
        switch (mode) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length);
          case Mode.BYTE:
            return ByteData.getBitsLength(length);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data, modesHint) {
        let mode;
        const bestMode = Mode.getBestModeForData(data);
        mode = Mode.from(modesHint, bestMode);
        if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
          throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode = Mode.BYTE;
        }
        switch (mode) {
          case Mode.NUMERIC:
            return new NumericData(data);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data);
          case Mode.KANJI:
            return new KanjiData(data);
          case Mode.BYTE:
            return new ByteData(data);
        }
      }
      exports.fromArray = function fromArray(array) {
        return array.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data, version) {
        const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version);
        const path = dijkstra.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data) {
        return exports.fromArray(
          getSegmentsFromString(data, Utils.isKanjiModeEnabled())
        );
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/qrcode.js
  var require_qrcode = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/core/qrcode.js"(exports) {
      var Utils = require_utils();
      var ECLevel = require_error_correction_level();
      var BitBuffer = require_bit_buffer();
      var BitMatrix = require_bit_matrix();
      var AlignmentPattern = require_alignment_pattern();
      var FinderPattern = require_finder_pattern();
      var MaskPattern = require_mask_pattern();
      var ECCode = require_error_correction_code();
      var ReedSolomonEncoder = require_reed_solomon_encoder();
      var Version = require_version();
      var FormatInfo = require_format_info();
      var Mode = require_mode();
      var Segments = require_segments();
      function setupFinderPattern(matrix, version) {
        const size = matrix.size;
        const pos = FinderPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -1; r <= 7; r++) {
            if (row + r <= -1 || size <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
              if (col + c <= -1 || size <= col + c) continue;
              if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupTimingPattern(matrix) {
        const size = matrix.size;
        for (let r = 8; r < size - 8; r++) {
          const value = r % 2 === 0;
          matrix.set(r, 6, value, true);
          matrix.set(6, r, value, true);
        }
      }
      function setupAlignmentPattern(matrix, version) {
        const pos = AlignmentPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupVersionInfo(matrix, version) {
        const size = matrix.size;
        const bits2 = Version.getEncodedBits(version);
        let row, col, mod;
        for (let i = 0; i < 18; i++) {
          row = Math.floor(i / 3);
          col = i % 3 + size - 8 - 3;
          mod = (bits2 >> i & 1) === 1;
          matrix.set(row, col, mod, true);
          matrix.set(col, row, mod, true);
        }
      }
      function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
        const size = matrix.size;
        const bits2 = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
        let i, mod;
        for (i = 0; i < 15; i++) {
          mod = (bits2 >> i & 1) === 1;
          if (i < 6) {
            matrix.set(i, 8, mod, true);
          } else if (i < 8) {
            matrix.set(i + 1, 8, mod, true);
          } else {
            matrix.set(size - 15 + i, 8, mod, true);
          }
          if (i < 8) {
            matrix.set(8, size - i - 1, mod, true);
          } else if (i < 9) {
            matrix.set(8, 15 - i - 1 + 1, mod, true);
          } else {
            matrix.set(8, 15 - i - 1, mod, true);
          }
        }
        matrix.set(size - 8, 8, 1, true);
      }
      function setupData(matrix, data) {
        const size = matrix.size;
        let inc = -1;
        let row = size - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = size - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (!matrix.isReserved(row, col - c)) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                matrix.set(row, col - c, dark);
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || size <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
      function createData(version, errorCorrectionLevel, segments) {
        const buffer = new BitBuffer();
        segments.forEach(function(data) {
          buffer.put(data.mode.bit, 4);
          buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
          data.write(buffer);
        });
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 !== 0) {
          buffer.putBit(0);
        }
        const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
        for (let i = 0; i < remainingByte; i++) {
          buffer.put(i % 2 ? 17 : 236, 8);
        }
        return createCodewords(buffer, version, errorCorrectionLevel);
      }
      function createCodewords(bitBuffer, version, errorCorrectionLevel) {
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewords = totalCodewords - ecTotalCodewords;
        const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
        const blocksInGroup2 = totalCodewords % ecTotalBlocks;
        const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
        const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
        const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
        const rs = new ReedSolomonEncoder(ecCount);
        let offset = 0;
        const dcData = new Array(ecTotalBlocks);
        const ecData = new Array(ecTotalBlocks);
        let maxDataSize = 0;
        const buffer = new Uint8Array(bitBuffer.buffer);
        for (let b = 0; b < ecTotalBlocks; b++) {
          const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
          dcData[b] = buffer.slice(offset, offset + dataSize);
          ecData[b] = rs.encode(dcData[b]);
          offset += dataSize;
          maxDataSize = Math.max(maxDataSize, dataSize);
        }
        const data = new Uint8Array(totalCodewords);
        let index = 0;
        let i, r;
        for (i = 0; i < maxDataSize; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            if (i < dcData[r].length) {
              data[index++] = dcData[r][i];
            }
          }
        }
        for (i = 0; i < ecCount; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            data[index++] = ecData[r][i];
          }
        }
        return data;
      }
      function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
        let segments;
        if (Array.isArray(data)) {
          segments = Segments.fromArray(data);
        } else if (typeof data === "string") {
          let estimatedVersion = version;
          if (!estimatedVersion) {
            const rawSegments = Segments.rawSplit(data);
            estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
          }
          segments = Segments.fromString(data, estimatedVersion || 40);
        } else {
          throw new Error("Invalid data");
        }
        const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
        if (!bestVersion) {
          throw new Error("The amount of data is too big to be stored in a QR Code");
        }
        if (!version) {
          version = bestVersion;
        } else if (version < bestVersion) {
          throw new Error(
            "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
          );
        }
        const dataBits = createData(version, errorCorrectionLevel, segments);
        const moduleCount = Utils.getSymbolSize(version);
        const modules = new BitMatrix(moduleCount);
        setupFinderPattern(modules, version);
        setupTimingPattern(modules);
        setupAlignmentPattern(modules, version);
        setupFormatInfo(modules, errorCorrectionLevel, 0);
        if (version >= 7) {
          setupVersionInfo(modules, version);
        }
        setupData(modules, dataBits);
        if (isNaN(maskPattern)) {
          maskPattern = MaskPattern.getBestMask(
            modules,
            setupFormatInfo.bind(null, modules, errorCorrectionLevel)
          );
        }
        MaskPattern.applyMask(maskPattern, modules);
        setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
        return {
          modules,
          version,
          errorCorrectionLevel,
          maskPattern,
          segments
        };
      }
      exports.create = function create(data, options) {
        if (typeof data === "undefined" || data === "") {
          throw new Error("No input text");
        }
        let errorCorrectionLevel = ECLevel.M;
        let version;
        let mask;
        if (typeof options !== "undefined") {
          errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
          version = Version.from(options.version);
          mask = MaskPattern.from(options.maskPattern);
          if (options.toSJISFunc) {
            Utils.setToSJISFunction(options.toSJISFunc);
          }
        }
        return createSymbol(data, version, errorCorrectionLevel, mask);
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/utils.js
  var require_utils2 = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/utils.js"(exports) {
      function hex2rgba(hex) {
        if (typeof hex === "number") {
          hex = hex.toString();
        }
        if (typeof hex !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/canvas.js
  var require_canvas = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
      var Utils = require_utils2();
      function clearCanvas(ctx, canvas, size) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!canvas.style) canvas.style = {};
        canvas.height = size;
        canvas.width = size;
        canvas.style.height = size + "px";
        canvas.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render(qrData, canvas, options) {
        let opts = options;
        let canvasEl = canvas;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!canvas) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/svg-tag.js
  var require_svg_tag = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
      var Utils = require_utils2();
      function getColorAttrib(color, attrib) {
        const alpha = color.a / 255;
        const str = attrib + '="' + color.hex + '"';
        return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
      }
      function svgCmd(cmd, x, y) {
        let str = cmd + x;
        if (typeof y !== "undefined") str += " " + y;
        return str;
      }
      function qrToPath(data, size, margin) {
        let path = "";
        let moveBy = 0;
        let newRow = false;
        let lineLength = 0;
        for (let i = 0; i < data.length; i++) {
          const col = Math.floor(i % size);
          const row = Math.floor(i / size);
          if (!col && !newRow) newRow = true;
          if (data[i]) {
            lineLength++;
            if (!(i > 0 && col > 0 && data[i - 1])) {
              path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
              moveBy = 0;
              newRow = false;
            }
            if (!(col + 1 < size && data[i + 1])) {
              path += svgCmd("h", lineLength);
              lineLength = 0;
            }
          } else {
            moveBy++;
          }
        }
        return path;
      }
      exports.render = function render(qrData, options, cb) {
        const opts = Utils.getOptions(options);
        const size = qrData.modules.size;
        const data = qrData.modules.data;
        const qrcodesize = size + opts.margin * 2;
        const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
        const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
        const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
        const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
        const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
        if (typeof cb === "function") {
          cb(null, svgTag);
        }
        return svgTag;
      };
    }
  });

  // ../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/browser.js
  var require_browser = __commonJS({
    "../../../../../tmp/tinplate-web-build/node_modules/qrcode/lib/browser.js"(exports) {
      var canPromise = require_can_promise();
      var QRCode2 = require_qrcode();
      var CanvasRenderer = require_canvas();
      var SvgRenderer = require_svg_tag();
      function renderCanvas(renderFunc, canvas, text, opts, cb) {
        const args = [].slice.call(arguments, 1);
        const argsNum = args.length;
        const isLastArgCb = typeof args[argsNum - 1] === "function";
        if (!isLastArgCb && !canPromise()) {
          throw new Error("Callback required as last argument");
        }
        if (isLastArgCb) {
          if (argsNum < 2) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 2) {
            cb = text;
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 3) {
            if (canvas.getContext && typeof cb === "undefined") {
              cb = opts;
              opts = void 0;
            } else {
              cb = opts;
              opts = text;
              text = canvas;
              canvas = void 0;
            }
          }
        } else {
          if (argsNum < 1) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 1) {
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 2 && !canvas.getContext) {
            opts = text;
            text = canvas;
            canvas = void 0;
          }
          return new Promise(function(resolve, reject) {
            try {
              const data = QRCode2.create(text, opts);
              resolve(renderFunc(data, canvas, opts));
            } catch (e) {
              reject(e);
            }
          });
        }
        try {
          const data = QRCode2.create(text, opts);
          cb(null, renderFunc(data, canvas, opts));
        } catch (e) {
          cb(e);
        }
      }
      exports.create = QRCode2.create;
      exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
      exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
      exports.toString = renderCanvas.bind(null, function(data, _, opts) {
        return SvgRenderer.render(data, opts);
      });
    }
  });

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
  var import_qrcode = __toESM(require_browser(), 1);
  var API_URL = window.TINPLATE_API_URL || "https://tinplate-flow-api.eugenelim831-1b3.workers.dev";
  var APP_BUILD = "20260817-full-operations-1";
  var PIN_STORAGE_KEY = "movementAppPin";
  var STAFF_ID_STORAGE_KEY = "tinplateStaffId";
  var STAFF_PIN_STORAGE_KEY = "tinplateStaffPin";
  var LOCATIONS = ["STORAGE", "SLITTER", "PRODUCTION_LINE", "PRINTING"];
  var LOCATION_LABELS = {
    STORAGE: "Storage",
    PRINTING: "Printing",
    SLITTER: "Slitter",
    PRODUCTION_LINE: "Production Line",
    EXCEL_IMPORT: "Excel Import",
    MANUAL_ENTRY: "Manual Entry",
    PRODUCTION_USE: "Production Use / Waste"
  };
  var PURPOSE_LABELS = {
    CUSTOMER_BRAND: "Customer / Brand",
    COATING: "Coating",
    TRANSFER: "Transfer",
    INTERNAL: "Transfer"
  };
  var state = {
    lots: [],
    records: [],
    knownBatchNumbers: /* @__PURE__ */ new Set(),
    currentLocation: "STORAGE",
    selectedLotIds: /* @__PURE__ */ new Set(),
    selectedRecord: null,
    signatureUrls: [],
    importPreview: null,
    accountsEnabled: false,
    currentUser: { id: "APP_PIN", name: "", role: "SUPERVISOR" },
    pendingBatchQuery: new URLSearchParams(window.location.search).get("batch") || ""
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
  function getCredentials() {
    return {
      appPin: getPin(),
      staffId: localStorage.getItem(STAFF_ID_STORAGE_KEY) || "",
      staffPin: sessionStorage.getItem(STAFF_PIN_STORAGE_KEY) || ""
    };
  }
  async function api(path, options, credentialsOverride) {
    const settings = options || {};
    const credentials = typeof credentialsOverride === "string" ? { appPin: credentialsOverride, staffId: "", staffPin: "" } : credentialsOverride || getCredentials();
    const headers = Object.assign(
      {
        "Content-Type": "application/json",
        "X-App-Pin": credentials.appPin || "",
        "X-Staff-Id": credentials.staffId || "",
        "X-Staff-Pin": credentials.staffPin || ""
      },
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
        headers: {
          "X-App-Pin": getCredentials().appPin,
          "X-Staff-Id": getCredentials().staffId,
          "X-Staff-Pin": getCredentials().staffPin
        }
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
      $("#loginStaffPin").value = "";
      setTimeout(function() {
        $("#loginPin").focus();
      }, 50);
    }
  }
  async function authenticate(pin, quiet, staffId, staffPin) {
    const button = $("#loginButton");
    button.disabled = true;
    button.textContent = "Checking\u2026";
    try {
      const credentials = {
        appPin: pin,
        staffId: String(staffId || "").trim().toUpperCase(),
        staffPin: String(staffPin || "").trim()
      };
      const health = await api("/health", { method: "GET" }, credentials);
      localStorage.setItem(PIN_STORAGE_KEY, pin);
      if (credentials.staffId) localStorage.setItem(STAFF_ID_STORAGE_KEY, credentials.staffId);
      else localStorage.removeItem(STAFF_ID_STORAGE_KEY);
      if (credentials.staffPin) sessionStorage.setItem(STAFF_PIN_STORAGE_KEY, credentials.staffPin);
      else sessionStorage.removeItem(STAFF_PIN_STORAGE_KEY);
      state.accountsEnabled = Boolean(health.accountsEnabled);
      state.currentUser = health.user || { id: "APP_PIN", name: "", role: "SUPERVISOR" };
      renderSignedInUser();
      setLoggedIn(true);
      await Promise.all([loadInventory(), loadRecords(false)]);
      applyPendingBatchQuery();
      if (!quiet) showToast("Logged in successfully.");
      return true;
    } catch (error) {
      localStorage.removeItem(PIN_STORAGE_KEY);
      sessionStorage.removeItem(STAFF_PIN_STORAGE_KEY);
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
    authenticate($("#loginPin").value, false, $("#loginStaffId").value, $("#loginStaffPin").value);
  });
  $("#logoutButton").addEventListener("click", function() {
    localStorage.removeItem(PIN_STORAGE_KEY);
    localStorage.removeItem(STAFF_ID_STORAGE_KEY);
    sessionStorage.removeItem(STAFF_PIN_STORAGE_KEY);
    state.lots = [];
    state.records = [];
    state.knownBatchNumbers.clear();
    state.importPreview = null;
    state.selectedLotIds.clear();
    state.accountsEnabled = false;
    state.currentUser = { id: "APP_PIN", name: "", role: "SUPERVISOR" };
    setLoggedIn(false);
    showToast("Logged out.");
  });
  function renderSignedInUser() {
    const name = state.currentUser && state.currentUser.name ? state.currentUser.name : "APP PIN user";
    const role = state.accountsEnabled ? titleCase(state.currentUser.role) : "Shared access";
    $("#signedInUser").innerHTML = "<span>" + escapeHtml(role) + "</span><strong>" + escapeHtml(name) + "</strong>";
  }
  function applyPicIdentity(input) {
    if (!input) return;
    if (state.accountsEnabled && state.currentUser.name) {
      input.value = state.currentUser.name;
      input.readOnly = true;
    } else {
      input.readOnly = false;
    }
  }
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
    $("#dashboardPanel").classList.remove("active");
    $("#locationTitle").textContent = LOCATION_LABELS[location];
    $("#slitSelected").classList.toggle("hidden", location !== "SLITTER");
    $("#useSelected").classList.toggle("hidden", location !== "PRODUCTION_LINE");
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
    $("#dashboardPanel").classList.remove("active");
    $("#recordsPanel").classList.add("active");
    loadRecords(true);
  });
  $(".tab[data-view='dashboard']").addEventListener("click", function(event) {
    $$(".tab").forEach(function(button) {
      button.classList.toggle("active", button === event.currentTarget);
    });
    $("#inventoryPanel").classList.remove("active");
    $("#recordsPanel").classList.remove("active");
    $("#dashboardPanel").classList.add("active");
    loadDashboard();
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
        lot.itemDescription,
        lot.slittingFor,
        lot.coatingDescription,
        lot.supplierName,
        lot.temper,
        lot.tinCoating,
        lot.dateReceived,
        lot.workOrder,
        lot.artworkCode,
        lot.colours,
        lot.productType,
        lot.productDescription,
        lot.returnReason,
        lot.dueDate
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
        const description = [
          lot.slittingFor ? "Slitting for " + slittingForLabel(lot.slittingFor) : "",
          lot.itemDescription || lot.description,
          lot.coatingDescription,
          lot.productType ? titleCase(lot.productType) + ": " + (lot.productDescription || "") : "",
          lot.workOrder ? "Job " + lot.workOrder : "",
          lot.artworkCode ? "Artwork " + lot.artworkCode : "",
          lot.colours ? "Colours " + lot.colours : "",
          lot.returnReason ? "Returned: " + returnReasonLabel(lot.returnReason) : ""
        ].filter(Boolean).join(" \xB7 ") || "\u2014";
        const supplierSpec = [
          lot.supplierName,
          lot.temper ? "Temper " + lot.temper : "",
          lot.tinCoating ? "Tin " + lot.tinCoating : "",
          lot.dateReceived ? "Received " + formatReceivedDate(lot.dateReceived) : ""
        ].filter(Boolean).join(" \xB7 ") || "\u2014";
        return '<tr><td class="select-column"><input class="lot-checkbox" type="checkbox" data-lot-id="' + escapeHtml(lot.lotId) + '"' + (state.selectedLotIds.has(lot.lotId) ? " checked" : "") + ' aria-label="Select ' + escapeHtml(lot.lotId) + '"></td><td><strong>' + escapeHtml(lot.lotId) + '</strong></td><td><button class="batch-link" type="button" data-batch="' + escapeHtml(lot.batchNumber) + '">' + escapeHtml(lot.batchNumber) + "</button></td><td>" + escapeHtml(lot.dimensions) + '</td><td class="quantity-cell"><strong>' + formatNumber(lot.quantity) + "</strong><span>" + unitLabel(lot.unit) + '</span></td><td class="description-cell">' + escapeHtml(supplierSpec) + '</td><td class="description-cell">' + escapeHtml(customerBrand) + '</td><td class="description-cell">' + escapeHtml(description) + "</td><td>" + formatDate(lot.updatedAt) + "</td></tr>";
      }).join("");
      $$("#inventoryBody .lot-checkbox").forEach(function(checkbox) {
        checkbox.addEventListener("change", function() {
          if (checkbox.checked) state.selectedLotIds.add(checkbox.dataset.lotId);
          else state.selectedLotIds.delete(checkbox.dataset.lotId);
          updateSelectionControls();
        });
      });
      $$("#inventoryBody .batch-link").forEach(function(button) {
        button.addEventListener("click", function() {
          openBatchTimeline(button.dataset.batch);
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
    $("#adjustSelected").disabled = selected.length !== 1;
    $("#printLabelSelected").disabled = selected.length !== 1;
    $("#useSelected").disabled = state.currentLocation !== "PRODUCTION_LINE" || selected.length === 0;
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
    applyPicIdentity($("#manualPic"));
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
    stockId: ["STOCKID", "LOTID", "STOCKCODE"],
    batchNumber: ["BATCHNO", "BATCHNUMBER", "BATCH"],
    supplierName: ["SUPPLIERNAME", "SUPPLIER"],
    dimensions: ["SIZE", "DIMENSIONS", "DIMENSION"],
    temper: ["TEMP", "TEMPER"],
    tinCoating: ["TINCOATING", "COATING"],
    sheets: ["SHEETS", "BLANKS", "SHEETQUANTITY", "QUANTITY", "QTY", "BALANCE", "COUNTEDBALANCE", "ACTUALQUANTITY"],
    unit: ["UNIT", "UNITS", "STOCKUNIT"],
    kg: ["KG", "WEIGHTKG", "WEIGHT"],
    price: ["PRICE", "UNITPRICE"],
    totalAmount: ["TOTALAMOUNT", "AMOUNT", "TOTAL"],
    dateReceived: ["DATERECEIVED", "DATERECVED", "RECEIVEDDATE", "RECEIPTDATE"]
  };
  $("#importStock").addEventListener("click", openImportDialog);
  $("#stockFile").addEventListener("change", handleStockFile);
  $("#importMode").addEventListener("change", function() {
    configureImportMode();
    $("#stockFile").value = "";
    state.importPreview = null;
    $("#importPreview").classList.add("hidden");
    $("#importApproval").classList.add("hidden");
    $("#submitImport").disabled = true;
  });
  function openImportDialog() {
    $("#importForm").reset();
    $("#importMode").value = state.currentLocation === "STORAGE" ? "ADD_NEW" : "RECONCILE";
    $("#importLocation").value = locationLabel(state.currentLocation);
    $("#importSignature").clearSignature();
    $("#importPreview").classList.add("hidden");
    $("#importApproval").classList.add("hidden");
    $("#importReading").classList.add("hidden");
    $("#submitImport").disabled = true;
    $("#submitImport").textContent = "Import New Batches";
    state.importPreview = null;
    configureImportMode();
    applyPicIdentity($("#importPic"));
    $("#importDialog").showModal();
    $("#importSignature").prepareSignature();
  }
  function configureImportMode() {
    const reconcile = $("#importMode").value === "RECONCILE";
    $("#importLocation").value = locationLabel(state.currentLocation);
    $("#importInstructions").innerHTML = reconcile ? "Upload the physical stock count for <strong>" + escapeHtml(locationLabel(state.currentLocation)) + "</strong>. Match by Stock ID, or by a unique Batch + Size + Unit combination. Only differences are posted; rows that cannot be matched are safely ignored." : "Select an .xlsx stock-balance file. The system finds the header row automatically and requires <strong>Batch No</strong>, <strong>Size</strong> and <strong>Sheets</strong>. New batches are added to Storage; batches already present in current or historical records are ignored.";
    $("#stocktakeReasonLabel").classList.toggle("hidden", !reconcile);
    $("#stocktakeReason").required = reconcile;
    $("#importNewLabel").textContent = reconcile ? "Adjustments" : "New batches";
    $("#importIgnoredLabel").textContent = reconcile ? "No change / ignored" : "Ignored";
    $("#importInvalidLabel").textContent = "Invalid";
    $("#importSignatureText").textContent = reconcile ? "This signature confirms the physical stock count and every balance change shown in the preview. No second approval is required." : "This signature confirms the selected file and every new stock batch shown in the preview.";
    $("#submitImport").textContent = reconcile ? "Post Stocktake Reconciliation" : "Import New Batches";
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
      const preview = $("#importMode").value === "RECONCILE" ? buildStocktakePreview(workbook, file.name, state.currentLocation) : buildStockImportPreview(workbook, file.name);
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
      mode: "ADD_NEW",
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
  function buildStocktakePreview(workbook, fileName, location) {
    if (!Array.isArray(workbook) || workbook.length === 0) throw new Error("The Excel workbook contains no worksheets.");
    let match = null;
    workbook.some(function(sheet) {
      const data = Array.isArray(sheet.data) ? sheet.data : [];
      for (let rowIndex = 0; rowIndex < Math.min(data.length, 40); rowIndex += 1) {
        const headerMap = stockHeaderMap(data[rowIndex] || []);
        if (headerMap.sheets != null && (headerMap.stockId != null || headerMap.batchNumber != null)) {
          match = { sheet: sheet.sheet || "Sheet " + (workbook.indexOf(sheet) + 1), data, headerIndex: rowIndex, headerMap };
          return true;
        }
      }
      return false;
    });
    if (!match) throw new Error("No worksheet has a quantity column together with Stock ID or Batch No.");
    const rows = [];
    const matchedIds = /* @__PURE__ */ new Set();
    const activeLots = state.lots.filter(function(lot) {
      return lot.location === location;
    });
    const quantityHeader = normalizeStockHeader(stockCell(match.data[match.headerIndex], match.headerMap.sheets));
    const dataRows = match.data.slice(match.headerIndex + 1);
    if (dataRows.length > 1e3) throw new Error("The worksheet has more than 1,000 rows. Split it into smaller stocktake files.");
    dataRows.forEach(function(cells, offset) {
      const rawStockId = importedText(stockCell(cells, match.headerMap.stockId), 100).replace(/\s/g, "");
      const batchNumber = normalizeImportedBatch(stockCell(cells, match.headerMap.batchNumber));
      const dimensions = normalizeImportedDimensions(stockCell(cells, match.headerMap.dimensions));
      const countedQuantity = importedWholeNumber(stockCell(cells, match.headerMap.sheets));
      if (!rawStockId && !batchNumber && isBlankCell(stockCell(cells, match.headerMap.sheets))) return;
      const errors = [];
      if (!Number.isSafeInteger(countedQuantity) || countedQuantity < 0) errors.push("Counted balance must be zero or a positive whole number");
      let unit = importedText(stockCell(cells, match.headerMap.unit), 20).toUpperCase();
      if (unit.startsWith("SHEET")) unit = "SHEETS";
      else if (unit.startsWith("BLANK")) unit = "BLANKS";
      else if (quantityHeader.includes("BLANK")) unit = "BLANKS";
      else if (quantityHeader.includes("SHEET")) unit = "SHEETS";
      else unit = "";
      let candidates = activeLots;
      if (rawStockId) {
        candidates = candidates.filter(function(lot) {
          return lot.lotId === rawStockId;
        });
      } else {
        candidates = candidates.filter(function(lot) {
          return lot.batchNumber === batchNumber;
        });
        if (dimensions) candidates = candidates.filter(function(lot) {
          return lot.dimensions === dimensions;
        });
        if (unit) candidates = candidates.filter(function(lot) {
          return lot.unit === unit;
        });
      }
      let result = "CHANGE";
      let matchedLot = null;
      if (errors.length) result = "INVALID";
      else if (!candidates.length) result = "NO_MATCH";
      else if (candidates.length > 1) result = "AMBIGUOUS";
      else {
        matchedLot = candidates[0];
        if (matchedIds.has(matchedLot.lotId)) {
          result = "INVALID";
          errors.push("The same stock ID appears more than once in this file");
        } else {
          matchedIds.add(matchedLot.lotId);
          if (Number(matchedLot.quantity) === countedQuantity) result = "UNCHANGED";
        }
      }
      rows.push({
        sourceRow: match.headerIndex + offset + 2,
        stockId: rawStockId,
        sourceLotId: matchedLot ? matchedLot.lotId : "",
        batchNumber: matchedLot ? matchedLot.batchNumber : batchNumber,
        dimensions: matchedLot ? matchedLot.dimensions : dimensions,
        unit: matchedLot ? matchedLot.unit : unit,
        systemQuantity: matchedLot ? Number(matchedLot.quantity) : null,
        countedQuantity: Number.isSafeInteger(countedQuantity) ? countedQuantity : null,
        result,
        errors
      });
    });
    if (!rows.length) throw new Error("No stocktake rows were found below the worksheet headers.");
    return {
      mode: "RECONCILE",
      location,
      fileName: fileName.slice(0, 180),
      sourceSheet: String(match.sheet).slice(0, 120),
      headerRow: match.headerIndex + 1,
      rows,
      validRows: rows.filter(function(row) {
        return row.result === "CHANGE";
      }),
      invalidCount: rows.filter(function(row) {
        return row.result === "INVALID";
      }).length,
      newCount: rows.filter(function(row) {
        return row.result === "CHANGE";
      }).length,
      ignoredCount: rows.filter(function(row) {
        return row.result !== "CHANGE" && row.result !== "INVALID";
      }).length
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
    if (preview.mode === "RECONCILE") return renderStocktakePreview(preview);
    $("#importPreviewHead").innerHTML = "<tr><th>Excel row</th><th>Batch</th><th>Size</th><th>Sheets</th><th>Supplier</th><th>Result</th></tr>";
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
  function renderStocktakePreview(preview) {
    $("#importPreviewHead").innerHTML = "<tr><th>Excel row</th><th>Stock ID</th><th>Batch / Size</th><th>System</th><th>Counted</th><th>Result</th></tr>";
    $("#importFoundCount").textContent = formatNumber(preview.rows.length);
    $("#importNewCount").textContent = formatNumber(preview.newCount);
    $("#importIgnoredCount").textContent = formatNumber(preview.ignoredCount);
    $("#importInvalidCount").textContent = formatNumber(preview.invalidCount);
    $("#importSheetInfo").textContent = preview.fileName + " \xB7 " + preview.sourceSheet + " \xB7 " + locationLabel(preview.location) + " \xB7 headers on row " + preview.headerRow;
    $("#importPreviewBody").innerHTML = preview.rows.map(function(row) {
      let resultLabel;
      if (row.result === "CHANGE") resultLabel = "Adjust " + formatSignedNumber(Number(row.countedQuantity) - Number(row.systemQuantity));
      else if (row.result === "UNCHANGED") resultLabel = "No change";
      else if (row.result === "NO_MATCH") resultLabel = "Ignore \u2014 no current stock match";
      else if (row.result === "AMBIGUOUS") resultLabel = "Ignore \u2014 use Stock ID to identify the split lot";
      else resultLabel = "Invalid \u2014 " + row.errors.join("; ");
      return '<tr class="' + row.result + '"><td>' + row.sourceRow + "</td><td>" + escapeHtml(row.sourceLotId || row.stockId || "\u2014") + '</td><td class="stacked-cell"><strong>' + escapeHtml(row.batchNumber || "\u2014") + "</strong><span>" + escapeHtml(row.dimensions || "\u2014") + "</span></td><td>" + (row.systemQuantity == null ? "\u2014" : formatNumber(row.systemQuantity)) + "</td><td>" + (row.countedQuantity == null ? "\u2014" : formatNumber(row.countedQuantity)) + '</td><td class="import-result ' + row.result + '">' + escapeHtml(resultLabel) + "</td></tr>";
    }).join("");
    const ready = preview.invalidCount === 0 && preview.newCount > 0;
    const message = preview.invalidCount ? "Correct the invalid Excel rows before posting. No stock has been changed." : preview.newCount === 0 ? "Every matched count agrees with the system, or unmatched rows were safely ignored. There is nothing to reconcile." : preview.newCount + " balance change" + (preview.newCount === 1 ? " is" : "s are") + " ready. " + preview.ignoredCount + " unchanged or unmatched row" + (preview.ignoredCount === 1 ? " will" : "s will") + " be left untouched.";
    $("#importValidationMessage").textContent = message;
    $("#importValidationMessage").className = "info-banner" + (preview.invalidCount ? " error" : "");
    $("#importPreview").classList.remove("hidden");
    $("#importApproval").classList.toggle("hidden", !ready);
    $("#submitImport").disabled = !ready;
    if (ready) {
      applyPicIdentity($("#importPic"));
      $("#importSignature").prepareSignature();
    }
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
    button.textContent = preview.mode === "RECONCILE" ? "Reconciling\u2026" : "Importing\u2026";
    try {
      const payload = preview.mode === "RECONCILE" ? {
        type: "STOCKTAKE_RECONCILIATION",
        location: preview.location,
        fileName: preview.fileName,
        sourceSheet: preview.sourceSheet,
        items: preview.validRows.map(function(row) {
          return { sourceRow: row.sourceRow, sourceLotId: row.sourceLotId, countedQuantity: row.countedQuantity };
        }),
        description: $("#stocktakeReason").value.trim(),
        picName,
        signature
      } : {
        type: "STOCK_IMPORT",
        fileName: preview.fileName,
        sourceSheet: preview.sourceSheet,
        rows: preview.validRows.map(function(row) {
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
        }),
        picName,
        signature
      };
      const result = await api("/records", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      $("#importDialog").close();
      state.importPreview = null;
      state.selectedLotIds.clear();
      if (preview.mode === "RECONCILE") {
        const counts = result.record.stocktakeResult || {};
        showToast("Record " + result.record.id + " posted: " + formatNumber(counts.adjusted || 0) + " stock balance(s) reconciled.");
      } else {
        const counts = result.record.importResult || {};
        showToast("Record " + result.record.id + " posted: " + formatNumber(counts.added || 0) + " new batch(es), " + formatNumber(counts.ignored || 0) + " ignored.");
      }
      await Promise.all([loadInventory(), loadRecords(false)]);
    } catch (error) {
      showToast(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = preview.mode === "RECONCILE" ? "Post Stocktake Reconciliation" : "Import New Batches";
    }
  });
  function standardPurposeOptionsHtml() {
    return '<option value="CUSTOMER_BRAND">Customer / Brand</option><option value="COATING">Coating</option><option value="TRANSFER">Transfer</option>';
  }
  function purposeFieldsHtml() {
    return '<div class="form-grid purpose-block"><label>Purpose type<select class="purpose-type" required>' + standardPurposeOptionsHtml() + '</select></label><label class="purpose-customer">Customer<input class="customer" maxlength="160" required placeholder="Customer name"></label><label class="purpose-brand">Brand / design<input class="brand" maxlength="160" required placeholder="Brand or printed design"></label><label class="purpose-coating hidden">Coating description<input class="coating-description" maxlength="240" placeholder="e.g. White coat or epoxy gold"></label></div>';
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
  $("#transferDestination").addEventListener("change", configureTransferDestination);
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
      return '<article class="item-card transfer-item" data-lot-id="' + escapeHtml(lot.lotId) + '"><div class="item-card-head"><strong>Item ' + (index + 1) + " \u2014 " + escapeHtml(lot.lotId) + "</strong></div>" + stockSnapshotHtml(lot) + "<label>Quantity to transfer (" + unitLabel(lot.unit).toLowerCase() + ')<input class="transfer-quantity" type="number" inputmode="numeric" min="1" max="' + Number(lot.quantity) + '" step="1" value="' + Number(lot.quantity) + '" required></label><div class="slitter-item-fields form-grid hidden"><label>Slitting for<select class="slitting-for"><option value="">Select Component or Body</option><option value="COMPONENT">Component</option><option value="BODY">Body</option></select></label><label>Customer (optional)<input class="slitter-customer" maxlength="160" placeholder="Customer name"></label><label>Brand / design (optional)<input class="slitter-brand" maxlength="160" placeholder="Brand or item"></label><label>Job / work order (optional)<input class="slitter-work-order" maxlength="100"></label><label>Due date (optional)<input class="slitter-due-date" type="date"></label><label>Expected blank width (mm)<input class="slitter-expected-width" type="number" inputmode="numeric" min="1" step="1"></label><label>Expected blank length (mm)<input class="slitter-expected-length" type="number" inputmode="numeric" min="1" step="1"></label><label>Expected blanks per sheet<input class="slitter-expected-pieces" type="number" inputmode="numeric" min="1" step="1"></label><label class="wide">Item description<textarea class="slitter-item-description" rows="2" maxlength="300" placeholder="Describe the component or body this batch will be slitted for"></textarea></label></div></article>';
    }).join("");
    setupPurposeFields($("#transferPurposeFields"));
    configureTransferDestination();
    applyPicIdentity($("#transferPic"));
    $("#transferDialog").showModal();
    $("#transferSignature").prepareSignature();
  }
  function transferDestinationDetailsHtml(destination) {
    if (destination === "PRINTING") {
      return '<div class="form-grid destination-details"><label>Printing job / work order (optional)<input class="destination-work-order" maxlength="100"></label><label>Due date (optional)<input class="destination-due-date" type="date"></label><label>Artwork code (optional)<input class="destination-artwork-code" maxlength="120"></label><label>Colours (optional)<input class="destination-colours" maxlength="160" placeholder="e.g. CMYK + spot red"></label><label class="wide">Printing instructions (optional)<textarea class="destination-printing-instructions" rows="2" maxlength="300"></textarea></label></div>';
    }
    if (destination === "PRODUCTION_LINE") {
      return '<div class="form-grid destination-details"><label>Material is for<select class="destination-product-type" required><option value="">Select Body, Component, Blank or Other</option><option value="BODY">Body</option><option value="COMPONENT">Component</option><option value="BLANK">Blank</option><option value="OTHER">Other</option></select></label><label>Product / component<input class="destination-product-description" maxlength="240" required placeholder="e.g. 1 litre paint can body"></label><label>Job / work order<input class="destination-work-order" maxlength="100" required></label><label>Expected production quantity<input class="destination-expected-quantity" type="number" inputmode="numeric" min="1" step="1" required></label><label>Customer (optional)<input class="destination-customer" maxlength="160"></label><label>Brand / design (optional)<input class="destination-brand" maxlength="160"></label><label>Due date (optional)<input class="destination-due-date" type="date"></label></div>';
    }
    if (destination === "STORAGE" && state.currentLocation !== "STORAGE") {
      return '<div class="form-grid destination-details"><label class="wide">Reason for return to Storage<select class="destination-return-reason" required><option value="">Select return reason</option><option value="UNUSED">Unused material</option><option value="OVERPRODUCTION">Overproduction</option><option value="REJECTED_HOLD">Rejected / quality hold</option><option value="JOB_COMPLETE">Job completed</option><option value="OTHER">Other</option></select></label></div>';
    }
    return "";
  }
  function collectDestinationDetails(destination) {
    const container = $("#transferDestinationDetails");
    const value = function(selector) {
      const input = container.querySelector(selector);
      return input ? input.value.trim() : "";
    };
    const integer = function(selector, label, required) {
      const raw = value(selector);
      if (!raw && !required) return null;
      const number = Number(raw);
      if (!Number.isSafeInteger(number) || number <= 0) throw new Error(label + " must be a positive whole number.");
      return number;
    };
    const details = {
      workOrder: value(".destination-work-order"),
      dueDate: value(".destination-due-date"),
      artworkCode: value(".destination-artwork-code"),
      colours: value(".destination-colours"),
      printingInstructions: value(".destination-printing-instructions"),
      productType: value(".destination-product-type"),
      productDescription: value(".destination-product-description"),
      expectedQuantity: integer(".destination-expected-quantity", "Expected production quantity", destination === "PRODUCTION_LINE"),
      customer: value(".destination-customer"),
      brand: value(".destination-brand"),
      returnReason: value(".destination-return-reason")
    };
    if (destination === "PRODUCTION_LINE") {
      if (!["BODY", "COMPONENT", "BLANK", "OTHER"].includes(details.productType)) throw new Error("Select what the Production Line material is for.");
      if (!details.productDescription) throw new Error("Production item / product description is required.");
      if (!details.workOrder) throw new Error("Production job / work order is required.");
      if (details.customer && !details.brand || !details.customer && details.brand) throw new Error("Enter both customer and brand / design, or leave both blank.");
    }
    if (destination === "STORAGE" && !details.returnReason) throw new Error("Select why the material is returning to Storage.");
    return details;
  }
  function configureTransferDestination() {
    const destination = $("#transferDestination").value;
    const isSlitter = destination === "SLITTER";
    const fixedTransferPurpose = isSlitter || destination === "PRODUCTION_LINE" || destination === "STORAGE";
    const purposeContainer = $("#transferPurposeFields");
    const purposeSelect = purposeContainer.querySelector(".purpose-type");
    if (purposeSelect) {
      if (fixedTransferPurpose) {
        purposeSelect.innerHTML = '<option value="TRANSFER">Transfer</option>';
        purposeContainer.classList.add("hidden");
      } else {
        const hasStandardChoices = Array.from(purposeSelect.options).some(function(option) {
          return option.value === "COATING";
        });
        if (!hasStandardChoices) purposeSelect.innerHTML = standardPurposeOptionsHtml();
        purposeContainer.classList.remove("hidden");
      }
      updatePurposeFields(purposeContainer);
    }
    $("#transferDestinationDetails").innerHTML = transferDestinationDetailsHtml(destination);
    $$("#transferItems .transfer-item").forEach(function(card) {
      const fields = card.querySelector(".slitter-item-fields");
      const slittingFor = card.querySelector(".slitting-for");
      const description = card.querySelector(".slitter-item-description");
      fields.classList.toggle("hidden", !isSlitter);
      slittingFor.required = isSlitter;
      description.required = isSlitter;
      if (!isSlitter) {
        slittingFor.value = "";
        description.value = "";
        card.querySelectorAll(".slitter-item-fields input").forEach(function(input) {
          input.value = "";
        });
      }
    });
    $("#transferDescriptionLabel").textContent = isSlitter ? "Overall transfer remarks (optional)" : "Movement description / reason";
    $("#transferDescription").required = !isSlitter;
    $("#transferDescription").placeholder = isSlitter ? "Optional notes applying to the whole Slitter transfer" : "Describe why the material is being moved or what it will be used for";
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
    let description;
    let destinationDetails;
    try {
      const destinationLocation = $("#transferDestination").value;
      const isSlitter = destinationLocation === "SLITTER";
      purpose = isSlitter ? { type: "TRANSFER", customer: "", brand: "", coatingDescription: "" } : collectPurpose($("#transferPurposeFields"));
      items = $$("#transferItems .transfer-item").map(function(card, index) {
        const lot = state.lots.find(function(candidate) {
          return candidate.lotId === card.dataset.lotId;
        });
        const quantity = Number(card.querySelector(".transfer-quantity").value);
        if (!lot) throw new Error("Selected stock is no longer available. Refresh and try again.");
        if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Item " + (index + 1) + ": quantity must be a whole number.");
        if (quantity > Number(lot.quantity)) throw new Error("Item " + (index + 1) + ": quantity exceeds the available balance.");
        const slittingFor = isSlitter ? card.querySelector(".slitting-for").value : "";
        const itemDescription = isSlitter ? card.querySelector(".slitter-item-description").value.trim() : "";
        if (isSlitter && !["COMPONENT", "BODY"].includes(slittingFor)) {
          throw new Error("Item " + (index + 1) + ": select whether it is being slitted for a Component or Body.");
        }
        if (isSlitter && !itemDescription) throw new Error("Item " + (index + 1) + ": description is required.");
        const optionalInteger = function(selector, label) {
          const input = card.querySelector(selector);
          if (!isSlitter || !input || !input.value) return null;
          const value = Number(input.value);
          if (!Number.isSafeInteger(value) || value <= 0) throw new Error("Item " + (index + 1) + ": " + label + " must be a positive whole number.");
          return value;
        };
        return {
          sourceLotId: lot.lotId,
          quantity,
          slittingFor,
          itemDescription,
          customer: isSlitter ? card.querySelector(".slitter-customer").value.trim() : "",
          brand: isSlitter ? card.querySelector(".slitter-brand").value.trim() : "",
          workOrder: isSlitter ? card.querySelector(".slitter-work-order").value.trim() : "",
          dueDate: isSlitter ? card.querySelector(".slitter-due-date").value : "",
          expectedBlankWidth: optionalInteger(".slitter-expected-width", "expected blank width"),
          expectedBlankLength: optionalInteger(".slitter-expected-length", "expected blank length"),
          expectedBlanksPerSheet: optionalInteger(".slitter-expected-pieces", "expected blanks per sheet")
        };
      });
      destinationDetails = collectDestinationDetails(destinationLocation);
      description = $("#transferDescription").value.trim();
      if (!description && isSlitter) {
        const uses = Array.from(new Set(items.map(function(item) {
          return slittingForLabel(item.slittingFor);
        })));
        description = "Transfer to Slitter for " + uses.join(" and ");
      }
    } catch (error) {
      return showToast(error.message, true);
    }
    const payload = {
      type: "TRANSFER",
      sourceLocation: state.currentLocation,
      destinationLocation: $("#transferDestination").value,
      items,
      purpose,
      destinationDetails,
      description,
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
    applyPicIdentity($("#slittingPic"));
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
      scrapDescription: $("#slittingScrapDescription").value.trim(),
      picName: $("#slittingPic").value.trim(),
      signature
    };
    await submitMovement($("#submitSlitting"), payload, $("#slittingDialog"), "Post Slitting Record");
  });
  $("#useSelected").addEventListener("click", openProductionUsageDialog);
  function openProductionUsageDialog() {
    const lots = selectedLots();
    if (state.currentLocation !== "PRODUCTION_LINE" || !lots.length) {
      return showToast("Select at least one stock item from the Production Line tab.", true);
    }
    $("#productionUsageForm").reset();
    $("#productionUsageSignature").clearSignature();
    $("#productionUsageItems").innerHTML = lots.map(function(lot, index) {
      return '<article class="item-card production-usage-item" data-lot-id="' + escapeHtml(lot.lotId) + '"><div class="item-card-head"><strong>Item ' + (index + 1) + " \u2014 " + escapeHtml(lot.lotId) + "</strong></div>" + stockSnapshotHtml(lot) + '<div class="form-grid"><label>Used (' + unitLabel(lot.unit).toLowerCase() + ')<input class="production-used" type="number" inputmode="numeric" min="0" max="' + Number(lot.quantity) + '" step="1" value="0" required></label><label>Waste (' + unitLabel(lot.unit).toLowerCase() + ')<input class="production-waste" type="number" inputmode="numeric" min="0" max="' + Number(lot.quantity) + '" step="1" value="0" required></label><label class="wide">Balance after<input class="production-balance-after" type="text" value="' + formatNumber(lot.quantity) + " " + unitLabel(lot.unit) + '" readonly></label></div></article>';
    }).join("");
    $$("#productionUsageItems .production-used, #productionUsageItems .production-waste").forEach(function(input) {
      input.addEventListener("input", updateProductionUsageCalculations);
    });
    const first = lots[0];
    if (["BODY", "COMPONENT", "BLANK", "OTHER"].includes(first.productType)) $("#productionItemType").value = first.productType;
    $("#productionProductDescription").value = first.productDescription || first.itemDescription || "";
    $("#productionWorkOrder").value = first.workOrder || "";
    $("#productionExpectedQuantity").value = first.expectedQuantity || "";
    $("#productionCustomer").value = first.customer || "";
    $("#productionBrand").value = first.brand || "";
    $("#productionWasteReasonLabel").classList.add("hidden");
    $("#productionWasteReason").required = false;
    applyPicIdentity($("#productionUsagePic"));
    $("#productionUsageDialog").showModal();
    $("#productionUsageSignature").prepareSignature();
  }
  function updateProductionUsageCalculations() {
    let hasWaste = false;
    $$("#productionUsageItems .production-usage-item").forEach(function(card) {
      const lot = state.lots.find(function(candidate) {
        return candidate.lotId === card.dataset.lotId;
      });
      if (!lot) return;
      const used = Number(card.querySelector(".production-used").value || 0);
      const waste = Number(card.querySelector(".production-waste").value || 0);
      hasWaste = hasWaste || waste > 0;
      const after = Number(lot.quantity) - used - waste;
      card.querySelector(".production-balance-after").value = after < 0 ? "Exceeds balance by " + formatNumber(Math.abs(after)) : formatNumber(after) + " " + unitLabel(lot.unit);
    });
    $("#productionWasteReasonLabel").classList.toggle("hidden", !hasWaste);
    $("#productionWasteReason").required = hasWaste;
    if (!hasWaste) $("#productionWasteReason").value = "";
  }
  $("#productionUsageForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const signature = $("#productionUsageSignature").signatureData();
    if (!signature) return showToast("PIC signature is required.", true);
    let items;
    try {
      items = $$("#productionUsageItems .production-usage-item").map(function(card, index) {
        const lot = state.lots.find(function(candidate) {
          return candidate.lotId === card.dataset.lotId;
        });
        if (!lot) throw new Error("Item " + (index + 1) + " is no longer available.");
        const usedQuantity = Number(card.querySelector(".production-used").value);
        const wasteQuantity = Number(card.querySelector(".production-waste").value);
        if (![usedQuantity, wasteQuantity].every(function(value) {
          return Number.isSafeInteger(value) && value >= 0;
        })) {
          throw new Error("Item " + (index + 1) + ": used and waste must be zero or positive whole numbers.");
        }
        if (usedQuantity + wasteQuantity < 1) throw new Error("Item " + (index + 1) + ": record at least one used or wasted unit.");
        if (usedQuantity + wasteQuantity > Number(lot.quantity)) throw new Error("Item " + (index + 1) + ": used plus waste exceeds the available balance.");
        return { sourceLotId: lot.lotId, usedQuantity, wasteQuantity };
      });
      const customer = $("#productionCustomer").value.trim();
      const brand = $("#productionBrand").value.trim();
      if (customer && !brand || !customer && brand) throw new Error("Enter both customer and brand / design, or leave both blank.");
    } catch (error) {
      return showToast(error.message, true);
    }
    const payload = {
      type: "PRODUCTION_USAGE",
      sourceLocation: "PRODUCTION_LINE",
      items,
      production: {
        productType: $("#productionItemType").value,
        productDescription: $("#productionProductDescription").value.trim(),
        workOrder: $("#productionWorkOrder").value.trim(),
        expectedQuantity: Number($("#productionExpectedQuantity").value),
        actualQuantity: $("#productionActualQuantity").value ? Number($("#productionActualQuantity").value) : null,
        customer: $("#productionCustomer").value.trim(),
        brand: $("#productionBrand").value.trim()
      },
      wasteReason: $("#productionWasteReason").value.trim(),
      description: $("#productionUsageDescription").value.trim(),
      picName: $("#productionUsagePic").value.trim(),
      signature
    };
    await submitMovement($("#submitProductionUsage"), payload, $("#productionUsageDialog"), "Post Use / Waste Record");
  });
  $("#adjustSelected").addEventListener("click", openAdjustmentDialog);
  $("#adjustmentCounted").addEventListener("input", updateAdjustmentDifference);
  function openAdjustmentDialog() {
    const lots = selectedLots();
    if (lots.length !== 1) return showToast("Select exactly one stock item to adjust.", true);
    const lot = lots[0];
    $("#adjustmentForm").reset();
    $("#adjustmentSignature").clearSignature();
    $("#adjustmentLot").dataset.lotId = lot.lotId;
    $("#adjustmentLot").innerHTML = "<h3>" + escapeHtml(lot.lotId) + "</h3>" + stockSnapshotHtml(lot);
    $("#adjustmentBefore").value = formatNumber(lot.quantity) + " " + unitLabel(lot.unit);
    $("#adjustmentCounted").value = String(lot.quantity);
    $("#adjustmentDifference").value = "No change";
    applyPicIdentity($("#adjustmentPic"));
    $("#adjustmentDialog").showModal();
    $("#adjustmentSignature").prepareSignature();
  }
  function selectedAdjustmentLot() {
    return state.lots.find(function(lot) {
      return lot.lotId === $("#adjustmentLot").dataset.lotId;
    });
  }
  function updateAdjustmentDifference() {
    const lot = selectedAdjustmentLot();
    if (!lot) return;
    const counted = Number($("#adjustmentCounted").value);
    $("#adjustmentDifference").value = Number.isSafeInteger(counted) && counted >= 0 ? formatSignedNumber(counted - Number(lot.quantity)) + " " + unitLabel(lot.unit) : "Enter a valid whole number";
  }
  $("#adjustmentForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const lot = selectedAdjustmentLot();
    if (!lot) return showToast("The selected stock is no longer available.", true);
    const countedQuantity = Number($("#adjustmentCounted").value);
    if (!Number.isSafeInteger(countedQuantity) || countedQuantity < 0) return showToast("Corrected balance must be zero or a positive whole number.", true);
    if (countedQuantity === Number(lot.quantity)) return showToast("The corrected balance is unchanged.", true);
    const signature = $("#adjustmentSignature").signatureData();
    if (!signature) return showToast("PIC signature is required.", true);
    const payload = {
      type: "STOCK_ADJUSTMENT",
      location: lot.location,
      sourceLotId: lot.lotId,
      countedQuantity,
      description: $("#adjustmentReason").value.trim(),
      picName: $("#adjustmentPic").value.trim(),
      signature
    };
    await submitMovement($("#submitAdjustment"), payload, $("#adjustmentDialog"), "Post Stock Adjustment");
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
  $("#refreshDashboard").addEventListener("click", loadDashboard);
  async function loadDashboard() {
    await Promise.all([loadInventory(), loadRecords(false)]);
    renderDashboard();
  }
  function renderDashboard() {
    const currentMonth = malaysiaMonthKey(/* @__PURE__ */ new Date());
    const postedThisMonth = state.records.filter(function(record) {
      return record.status === "POSTED" && malaysiaMonthKey(new Date(record.createdAt)) === currentMonth;
    });
    const usageRecords = postedThisMonth.filter(function(record) {
      return record.type === "PRODUCTION_USAGE";
    });
    const used = usageRecords.reduce(function(total, record) {
      return total + Number(record.totals && record.totals.used || 0);
    }, 0);
    const waste = usageRecords.reduce(function(total, record) {
      return total + Number(record.totals && record.totals.waste || 0);
    }, 0);
    const yields = postedThisMonth.filter(function(record) {
      return record.type === "SLITTING" && Number.isFinite(Number(record.areaUtilizationPercent));
    }).map(function(record) {
      return Number(record.areaUtilizationPercent);
    });
    const totalValue = state.lots.reduce(function(total, lot) {
      return total + Number(lot.totalAmount || 0);
    }, 0);
    $("#dashboardLots").textContent = formatNumber(state.lots.length);
    $("#dashboardSheets").textContent = formatNumber(sumUnit(state.lots, "SHEETS"));
    $("#dashboardBlanks").textContent = formatNumber(sumUnit(state.lots, "BLANKS"));
    $("#dashboardValue").textContent = formatMoney2(totalValue);
    $("#dashboardUsed").textContent = formatNumber(used);
    $("#dashboardWaste").textContent = formatNumber(waste);
    $("#dashboardYield").textContent = yields.length ? (yields.reduce(function(total, value) {
      return total + value;
    }, 0) / yields.length).toFixed(1) + "%" : "\u2014";
    $("#dashboardAdjustments").textContent = formatNumber(postedThisMonth.filter(function(record) {
      return record.type === "MANUAL_ADDITION" || record.type === "STOCK_ADJUSTMENT" || record.type === "STOCKTAKE_RECONCILIATION";
    }).length);
    $("#dashboardLocationBody").innerHTML = LOCATIONS.map(function(location) {
      const lots = state.lots.filter(function(lot) {
        return lot.location === location;
      });
      const value = lots.reduce(function(total, lot) {
        return total + Number(lot.totalAmount || 0);
      }, 0);
      return "<tr><td><strong>" + escapeHtml(locationLabel(location)) + "</strong></td><td>" + formatNumber(lots.length) + "</td><td>" + formatNumber(sumUnit(lots, "SHEETS")) + "</td><td>" + formatNumber(sumUnit(lots, "BLANKS")) + "</td><td>" + escapeHtml(formatMoney2(value)) + "</td></tr>";
    }).join("");
    const alerts = [];
    const oldLots = state.lots.filter(function(lot) {
      return lot.updatedAt && Date.now() - new Date(lot.updatedAt).getTime() > 30 * 864e5;
    });
    if (oldLots.length) alerts.push({ type: "", title: oldLots.length + " lot(s) have not moved for 30+ days", text: "Review slow-moving stock in the location tabs." });
    const lowLots = state.lots.filter(function(lot) {
      return Number(lot.quantity) <= 10;
    });
    if (lowLots.length) alerts.push({ type: "", title: lowLots.length + " lot(s) have a balance of 10 or less", text: "Confirm whether these small balances are still physically present." });
    const wasteRate = used + waste > 0 ? waste / (used + waste) * 100 : 0;
    if (wasteRate > 5) alerts.push({ type: "danger", title: "Monthly waste rate is " + wasteRate.toFixed(1) + "%", text: "Open Production Use / Waste records to review the stated reasons." });
    if (!alerts.length) alerts.push({ type: "success", title: "No dashboard alerts", text: "Current stock and this month's activity have no automatic warnings." });
    $("#dashboardAlerts").innerHTML = alerts.map(function(alert) {
      return '<article class="dashboard-alert ' + escapeHtml(alert.type) + '"><strong>' + escapeHtml(alert.title) + "</strong><p>" + escapeHtml(alert.text) + "</p></article>";
    }).join("");
    const recent = state.records.slice().sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 10);
    $("#dashboardRecentBody").innerHTML = recent.length ? recent.map(function(record) {
      return '<tr><td><button class="batch-link dashboard-record" type="button" data-record-id="' + escapeHtml(record.id) + '">' + escapeHtml(record.id) + "</button></td><td>" + escapeHtml(recordTypeLabel(record.type)) + "</td><td>" + escapeHtml(recordDestinationLabel(record)) + "</td><td>" + escapeHtml(record.picName || "\u2014") + "</td><td>" + formatDate(record.createdAt) + '</td><td class="status-cell ' + escapeHtml(record.status) + '">' + escapeHtml(titleCase(record.status)) + "</td></tr>";
    }).join("") : '<tr><td colspan="6" class="empty-cell">No records have been posted.</td></tr>';
    $$("#dashboardRecentBody .dashboard-record").forEach(function(button) {
      button.addEventListener("click", function() {
        openRecord(button.dataset.recordId);
      });
    });
  }
  function malaysiaMonthKey(date) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit" }).formatToParts(date).reduce(function(result, part) {
      result[part.type] = part.value;
      return result;
    }, {});
    return parts.year + "-" + parts.month;
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
        record.sourceSheet,
        record.wasteReason,
        record.destinationDetails && record.destinationDetails.workOrder,
        record.destinationDetails && record.destinationDetails.artworkCode,
        record.destinationDetails && record.destinationDetails.productDescription,
        record.production && record.production.productDescription,
        record.production && record.production.workOrder,
        record.production && record.production.customer,
        record.production && record.production.brand
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
          line.dateReceived,
          line.slittingFor,
          line.itemDescription,
          line.customer,
          line.brand,
          line.workOrder,
          line.usedQuantity,
          line.wasteQuantity,
          line.quantityBefore,
          line.quantityAfter,
          line.difference
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
      const purpose = record.type === "STOCK_IMPORT" ? formatNumber(record.importResult && record.importResult.added) + " new \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored" : record.type === "MANUAL_ADDITION" ? "New batch added to " + locationLabel(record.destinationLocation) : record.type === "PRODUCTION_USAGE" ? formatNumber(record.totals && record.totals.used) + " used \xB7 " + formatNumber(record.totals && record.totals.waste) + " waste" : record.type === "STOCK_ADJUSTMENT" ? "Signed balance correction" : record.type === "STOCKTAKE_RECONCILIATION" ? formatNumber(record.stocktakeResult && record.stocktakeResult.adjusted) + " balance(s) reconciled" : recordPurposeSummary(record);
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
      const canCancel = !state.accountsEnabled || state.currentUser.role === "SUPERVISOR";
      $("#cancelSection").classList.toggle("hidden", record.status !== "POSTED" || !canCancel);
      $("#cancelForm").reset();
      applyPicIdentity($("#cancelPic"));
      $("#cancelSignature").clearSignature();
      $("#cancelSignature").prepareSignature();
      loadRecordSignatures(record);
    } catch (error) {
      $("#recordDetail").innerHTML = '<p class="info-banner error">' + escapeHtml(error.message) + "</p>";
    }
  }
  function renderRecordDetail(record) {
    const destination = recordDestinationLabel(record);
    let html = '<dl class="detail-grid">' + detailCell("Record ID", record.id) + detailCell("Type", recordTypeLabel(record.type)) + detailCell("Status", titleCase(record.status)) + detailCell("From", locationLabel(record.sourceLocation)) + detailCell("To / Process", destination) + detailCell("Worker date & time", formatDate(record.createdAt)) + detailCell("PIC", record.picName) + detailCell("Staff account", record.actor && record.actor.id ? record.actor.id + " \xB7 " + titleCase(record.actor.role) : "Shared APP PIN") + detailCell("Purpose", record.type === "STOCK_IMPORT" ? "Opening stock import" : record.type === "MANUAL_ADDITION" ? "Manual stock correction" : record.type === "PRODUCTION_USAGE" ? "Production use and waste" : record.type === "STOCK_ADJUSTMENT" ? "Signed stock adjustment" : record.type === "STOCKTAKE_RECONCILIATION" ? "Stocktake reconciliation" : recordPurposeSummary(record)) + detailCell("Description", record.description) + (record.type === "STOCK_IMPORT" ? detailCell("Excel file", record.fileName) + detailCell("Worksheet", record.sourceSheet) + detailCell("Import result", formatNumber(record.importResult && record.importResult.added) + " added \xB7 " + formatNumber(record.importResult && record.importResult.ignored) + " ignored") : "") + (record.type === "STOCKTAKE_RECONCILIATION" ? detailCell("Excel file", record.fileName) + detailCell("Worksheet", record.sourceSheet) + detailCell("Reconciliation result", formatNumber(record.stocktakeResult && record.stocktakeResult.adjusted) + " adjusted") : "") + destinationDetailsCells(record.destinationDetails) + "</dl>";
    if (record.type === "TRANSFER") {
      const slitterTransfer = record.destinationLocation === "SLITTER";
      html += '<section class="record-items"><h3>Transferred stock</h3><div class="table-wrap"><table><thead><tr><th>Source stock ID</th><th>Destination stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th>' + (slitterTransfer ? "<th>Slitting for</th><th>Customer / Brand</th><th>Job / Expected blank</th><th>Item description</th>" : "") + "</tr></thead><tbody>" + record.items.map(function(item) {
        return "<tr><td>" + escapeHtml(item.sourceLotId) + "</td><td>" + escapeHtml(item.destinationLotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + formatNumber(item.quantity) + " " + escapeHtml(unitLabel(item.unit)) + "</td>" + (slitterTransfer ? "<td>" + escapeHtml(slittingForLabel(item.slittingFor)) + "</td><td>" + escapeHtml([item.customer, item.brand].filter(Boolean).join(" / ") || "\u2014") + '</td><td class="description-cell">' + escapeHtml([item.workOrder, expectedBlankSummary(item)].filter(Boolean).join(" \xB7 ") || "\u2014") + '</td><td class="description-cell">' + escapeHtml(item.itemDescription || "\u2014") + "</td>" : "") + "</tr>";
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
    } else if (record.type === "SLITTING") {
      html += '<section class="record-items"><h3>Source sheets consumed</h3><div class="record-summary">' + stockSnapshotHtml({
        batchNumber: record.source.batchNumber,
        dimensions: record.source.dimensions,
        quantity: record.source.quantity,
        unit: record.source.unit,
        location: record.sourceLocation
      }) + "<strong>Source stock ID: " + escapeHtml(record.source.sourceLotId) + '</strong></div><h3>Blank outputs</h3><div class="table-wrap"><table><thead><tr><th>New stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th></tr></thead><tbody>' + record.outputs.map(function(output) {
        return "<tr><td>" + escapeHtml(output.lotId) + "</td><td>" + escapeHtml(output.batchNumber) + "</td><td>" + escapeHtml(output.dimensions) + "</td><td>" + formatNumber(output.quantity) + " Blanks</td></tr>";
      }).join("") + '</tbody></table></div><p class="info-banner">Material yield: ' + escapeHtml(Number(record.areaUtilizationPercent || 0).toFixed(1)) + "% \xB7 Scrap / offcut area: " + escapeHtml(Number(record.scrapPercent || 0).toFixed(1)) + "%" + (record.scrapDescription ? " \xB7 " + escapeHtml(record.scrapDescription) : "") + "</p></section>";
    } else if (record.type === "PRODUCTION_USAGE") {
      html += '<section class="record-items"><h3>Production job</h3><dl class="detail-grid">' + detailCell("Output type", titleCase(record.production && record.production.productType)) + detailCell("Product / component", record.production && record.production.productDescription) + detailCell("Job / work order", record.production && record.production.workOrder) + detailCell("Expected output", formatNumber(record.production && record.production.expectedQuantity)) + detailCell("Actual output", record.production && record.production.actualQuantity ? formatNumber(record.production.actualQuantity) : "\u2014") + detailCell("Customer / Brand", [record.production && record.production.customer, record.production && record.production.brand].filter(Boolean).join(" / ") || "\u2014") + detailCell("Waste reason", record.wasteReason || "No waste recorded") + '</dl><h3>Stock consumed</h3><div class="table-wrap"><table><thead><tr><th>Stock ID</th><th>Batch</th><th>Dimensions</th><th>Used</th><th>Waste</th><th>Before</th><th>After</th></tr></thead><tbody>' + record.items.map(function(item) {
        return "<tr><td>" + escapeHtml(item.sourceLotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + formatNumber(item.usedQuantity) + " " + escapeHtml(unitLabel(item.unit)) + "</td><td>" + formatNumber(item.wasteQuantity) + "</td><td>" + formatNumber(item.quantityBefore) + "</td><td>" + formatNumber(item.quantityAfter) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";
    } else if (record.type === "STOCK_ADJUSTMENT" || record.type === "STOCKTAKE_RECONCILIATION") {
      const heading = record.type === "STOCK_ADJUSTMENT" ? "Corrected stock balance" : "Reconciled stocktake balances";
      html += '<section class="record-items"><h3>' + heading + '</h3><div class="table-wrap"><table><thead><tr>' + (record.type === "STOCKTAKE_RECONCILIATION" ? "<th>Excel row</th>" : "") + "<th>Stock ID</th><th>Batch</th><th>Dimensions</th><th>Unit</th><th>Before</th><th>After</th><th>Change</th></tr></thead><tbody>" + record.items.map(function(item) {
        return "<tr>" + (record.type === "STOCKTAKE_RECONCILIATION" ? "<td>" + item.sourceRow + "</td>" : "") + "<td>" + escapeHtml(item.sourceLotId) + "</td><td>" + escapeHtml(item.batchNumber) + "</td><td>" + escapeHtml(item.dimensions) + "</td><td>" + escapeHtml(unitLabel(item.unit)) + "</td><td>" + formatNumber(item.quantityBefore) + "</td><td>" + formatNumber(item.quantityAfter) + "</td><td>" + escapeHtml(formatSignedNumber(item.difference)) + "</td></tr>";
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
      "Staff ID",
      "Staff Role",
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
      "Slitting For",
      "Item Description",
      "Used Quantity",
      "Waste Quantity",
      "Balance Before",
      "Balance After",
      "Difference",
      "Job / Work Order",
      "Due Date",
      "Artwork Code",
      "Colours",
      "Product Type",
      "Product / Component",
      "Expected Output",
      "Actual Output",
      "Return Reason",
      "Waste Reason",
      "Slitting Yield %",
      "Scrap %",
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
          record.actor && record.actor.id,
          record.actor && record.actor.role,
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
          line.slittingFor ? slittingForLabel(line.slittingFor) : "",
          line.itemDescription || "",
          line.usedQuantity == null ? "" : line.usedQuantity,
          line.wasteQuantity == null ? "" : line.wasteQuantity,
          line.quantityBefore == null ? "" : line.quantityBefore,
          line.quantityAfter == null ? "" : line.quantityAfter,
          line.difference == null ? "" : line.difference,
          line.workOrder || record.destinationDetails && record.destinationDetails.workOrder || record.production && record.production.workOrder || "",
          line.dueDate || record.destinationDetails && record.destinationDetails.dueDate || "",
          record.destinationDetails && record.destinationDetails.artworkCode,
          record.destinationDetails && record.destinationDetails.colours,
          record.destinationDetails && record.destinationDetails.productType || record.production && record.production.productType,
          record.destinationDetails && record.destinationDetails.productDescription || record.production && record.production.productDescription,
          record.destinationDetails && record.destinationDetails.expectedQuantity || record.production && record.production.expectedQuantity,
          record.production && record.production.actualQuantity,
          record.destinationDetails && record.destinationDetails.returnReason,
          record.wasteReason || "",
          record.areaUtilizationPercent == null ? "" : record.areaUtilizationPercent,
          record.scrapPercent == null ? "" : record.scrapPercent,
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
  $("#printLabelSelected").addEventListener("click", function() {
    const lots = selectedLots();
    if (lots.length !== 1) return showToast("Select exactly one stock item to print a QR label.", true);
    openBatchTimeline(lots[0].batchNumber, lots[0].lotId);
  });
  $("#printQrLabel").addEventListener("click", function() {
    window.print();
  });
  async function openBatchTimeline(batchNumber, preferredLotId) {
    if (!batchNumber) return;
    if (!state.records.length) await loadRecords(false);
    const currentLots = state.lots.filter(function(lot) {
      return lot.batchNumber === batchNumber;
    });
    const records = state.records.filter(function(record) {
      return (record.lines || []).some(function(line) {
        return line.batchNumber === batchNumber;
      });
    }).sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const preferredLot = currentLots.find(function(lot) {
      return lot.lotId === preferredLotId;
    }) || currentLots[0] || null;
    $("#timelineTitle").textContent = "Batch " + batchNumber;
    $("#timelineCurrentLots").innerHTML = currentLots.length ? currentLots.map(function(lot) {
      return "<article><strong>" + escapeHtml(lot.lotId) + "</strong>" + stockSnapshotHtml(lot) + "</article>";
    }).join("") : '<p class="empty-cell">No current balance remains. The historical records below are retained.</p>';
    $("#timelineEntries").innerHTML = records.length ? records.map(function(record) {
      const matching = (record.lines || []).filter(function(line) {
        return line.batchNumber === batchNumber;
      });
      const quantityText = matching.map(function(line) {
        if (record.type === "PRODUCTION_USAGE") return formatNumber(line.usedQuantity) + " used, " + formatNumber(line.wasteQuantity) + " waste";
        if (record.type === "STOCK_ADJUSTMENT" || record.type === "STOCKTAKE_RECONCILIATION") return formatNumber(line.quantityBefore) + " \u2192 " + formatNumber(line.quantityAfter);
        return formatNumber(line.quantity) + " " + unitLabel(line.unit);
      }).join(" \xB7 ");
      return '<article class="timeline-entry ' + escapeHtml(record.status) + '"><strong>' + escapeHtml(recordTypeLabel(record.type)) + " \xB7 " + escapeHtml(record.id) + "</strong><p>" + escapeHtml(locationLabel(record.sourceLocation)) + " \u2192 " + escapeHtml(recordDestinationLabel(record)) + "</p><p>" + escapeHtml(quantityText || record.description || "") + "</p><p>" + escapeHtml(record.picName || "\u2014") + " \xB7 " + formatDate(record.createdAt) + '</p><div class="actions"><button class="secondary table-action timeline-record" type="button" data-record-id="' + escapeHtml(record.id) + '">View record</button></div></article>';
    }).join("") : '<p class="empty-cell">No batch records were found.</p>';
    $$("#timelineEntries .timeline-record").forEach(function(button) {
      button.addEventListener("click", function() {
        openRecord(button.dataset.recordId);
      });
    });
    const labelValues = preferredLot || { batchNumber, lotId: "Historical batch", dimensions: "\u2014", quantity: 0, unit: "", location: "PRODUCTION_USE" };
    $("#labelDetails").innerHTML = labelDetail("Batch", batchNumber) + labelDetail("Stock ID", labelValues.lotId) + labelDetail("Size", labelValues.dimensions) + labelDetail("Balance", preferredLot ? formatNumber(preferredLot.quantity) + " " + unitLabel(preferredLot.unit) : "No current stock") + labelDetail("Location", preferredLot ? locationLabel(preferredLot.location) : "Historical / consumed") + labelDetail("Job", preferredLot && preferredLot.workOrder || "\u2014");
    const qrUrl = window.location.origin + window.location.pathname + "?batch=" + encodeURIComponent(batchNumber);
    $("#qrSvg").innerHTML = await import_qrcode.default.toString(qrUrl, { type: "svg", width: 230, margin: 1, errorCorrectionLevel: "M" });
    $("#timelineDialog").showModal();
  }
  function applyPendingBatchQuery() {
    if (!state.pendingBatchQuery) return;
    const batch = state.pendingBatchQuery;
    state.pendingBatchQuery = "";
    openBatchTimeline(batch).catch(function(error) {
      showToast(error.message, true);
    });
  }
  function labelDetail(label, value) {
    return "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value || "\u2014") + "</dd></div>";
  }
  function parseDimensions2(value) {
    const match = String(value || "").match(/^(0\.\d+)\*(\d+)\*(\d+)$/);
    if (!match) return null;
    return { thickness: match[1], width: Number(match[2]), length: Number(match[3]) };
  }
  function purposeSummary(purpose) {
    if (!purpose) return "\u2014";
    if (purpose.type === "CUSTOMER_BRAND") return [purpose.customer, purpose.brand].filter(Boolean).join(" / ") || "Customer / Brand";
    if (purpose.type === "COATING") return purpose.coatingDescription || "Coating";
    return "Transfer";
  }
  function recordPurposeSummary(record) {
    if (record && record.type === "TRANSFER" && record.destinationLocation === "SLITTER") {
      const uses = Array.from(new Set((record.lines || record.items || []).map(function(line) {
        return line.slittingFor ? slittingForLabel(line.slittingFor) : "";
      }).filter(Boolean)));
      return uses.length ? "Slitting \u2014 " + uses.join(", ") : "Transfer";
    }
    return purposeSummary(record && record.purpose);
  }
  function slittingForLabel(value) {
    if (value === "COMPONENT") return "Component";
    if (value === "BODY") return "Body";
    return value || "\u2014";
  }
  function returnReasonLabel(value) {
    const labels = {
      UNUSED: "Unused material",
      OVERPRODUCTION: "Overproduction",
      REJECTED_HOLD: "Rejected / quality hold",
      JOB_COMPLETE: "Job completed",
      OTHER: "Other"
    };
    return labels[value] || titleCase(value);
  }
  function expectedBlankSummary(item) {
    const size = item && item.expectedBlankWidth && item.expectedBlankLength ? item.expectedBlankWidth + "\xD7" + item.expectedBlankLength : "";
    const pieces = item && item.expectedBlanksPerSheet ? item.expectedBlanksPerSheet + " / sheet" : "";
    return [size, pieces].filter(Boolean).join(" \xB7 ");
  }
  function destinationDetailsCells(details) {
    if (!details) return "";
    let html = "";
    if (details.productType) html += detailCell("Production material", titleCase(details.productType));
    if (details.productDescription) html += detailCell("Product / component", details.productDescription);
    if (details.workOrder) html += detailCell("Job / work order", details.workOrder);
    if (details.expectedQuantity) html += detailCell("Expected quantity", formatNumber(details.expectedQuantity));
    if (details.customer || details.brand) html += detailCell("Customer / Brand", [details.customer, details.brand].filter(Boolean).join(" / "));
    if (details.dueDate) html += detailCell("Due date", formatReceivedDate(details.dueDate));
    if (details.artworkCode) html += detailCell("Artwork code", details.artworkCode);
    if (details.colours) html += detailCell("Colours", details.colours);
    if (details.printingInstructions) html += detailCell("Printing instructions", details.printingInstructions);
    if (details.returnReason) html += detailCell("Storage return reason", returnReasonLabel(details.returnReason));
    return html;
  }
  function recordTypeLabel(type) {
    if (type === "STOCK_IMPORT") return "Stock Import";
    if (type === "MANUAL_ADDITION") return "Manual Addition";
    if (type === "SLITTING") return "Slitting";
    if (type === "PRODUCTION_USAGE") return "Production Use / Waste";
    if (type === "STOCK_ADJUSTMENT") return "Stock Adjustment";
    if (type === "STOCKTAKE_RECONCILIATION") return "Stocktake Reconciliation";
    return type === "TRANSFER" ? "Transfer" : titleCase(type);
  }
  function recordDestinationLabel(record) {
    if (record.type === "SLITTING") return "Slitting conversion";
    if (record.type === "PRODUCTION_USAGE") return "Consumed / Waste";
    if (record.type === "STOCK_ADJUSTMENT") return "Balance adjustment at " + locationLabel(record.destinationLocation);
    if (record.type === "STOCKTAKE_RECONCILIATION") return "Stocktake at " + locationLabel(record.destinationLocation);
    return locationLabel(record.destinationLocation);
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
  function formatSignedNumber(value) {
    const number = Number(value || 0);
    return (number > 0 ? "+" : "") + formatNumber(number);
  }
  function formatDecimal(value) {
    if (value == null || value === "") return "\u2014";
    return new Intl.NumberFormat("en-MY", { maximumFractionDigits: 3 }).format(Number(value));
  }
  function formatMoney(value) {
    if (value == null || value === "") return "\u2014";
    return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 4 }).format(Number(value));
  }
  function formatMoney2(value) {
    return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));
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
    const saved = getCredentials();
    $("#loginStaffId").value = saved.staffId;
    if (saved.appPin) {
      const success = await authenticate(saved.appPin, true, saved.staffId, saved.staffPin);
      if (!success) showToast("Saved login is no longer valid. Enter the application PIN.", true);
    } else {
      setLoggedIn(false);
    }
  })();
})();
