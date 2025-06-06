import { createRequire } from "module";
import fsp, { lstat, readFile, readdir, stat } from "node:fs/promises";
import path from "path";
import { join, relative, resolve } from "node:path/posix";
import { basename, extname, relative as relative$1, resolve as resolve$1 } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { execSync } from "child_process";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import VueInspector from "vite-plugin-inspect";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys$1 = __getOwnPropNames(from), i = 0, n = keys$1.length, key; i < n; i++) {
		key = keys$1[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k$1) => from[k$1]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target$1) => (target$1 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target$1, "default", {
	value: mod,
	enumerable: true
}) : target$1, mod));
var __require = /* @__PURE__ */ createRequire(import.meta.url);

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/array.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitWhen = exports.flatten = void 0;
	function flatten(items) {
		return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	exports.flatten = flatten;
	function splitWhen(items, predicate) {
		const result = [[]];
		let groupIndex = 0;
		for (const item of items) if (predicate(item)) {
			groupIndex++;
			result[groupIndex] = [];
		} else result[groupIndex].push(item);
		return result;
	}
	exports.splitWhen = splitWhen;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/errno.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEnoentCodeError = void 0;
	function isEnoentCodeError(error) {
		return error.code === "ENOENT";
	}
	exports.isEnoentCodeError = isEnoentCodeError;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/fs.js
var require_fs$3 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/fs.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats$1 = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats$1(name, stats) {
		return new DirentFromStats$1(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/path.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPosixPathToPattern = exports.convertWindowsPathToPattern = exports.convertPathToPattern = exports.escapePosixPath = exports.escapeWindowsPath = exports.escape = exports.removeLeadingDotSegment = exports.makeAbsolute = exports.unixify = void 0;
	const os$1 = __require("os");
	const path$11 = __require("path");
	const IS_WINDOWS_PLATFORM = os$1.platform() === "win32";
	const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
	/**
	* All non-escaped special characters.
	* Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	* Windows: (){}[], !+@ before (, ! at the beginning.
	*/
	const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	* The device path (\\.\ or \\?\).
	* https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	*/
	const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	* All backslashes except those escaping special characters.
	* Windows: !()+@{}
	* https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	*/
	const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	* Designed to work only with simple paths: `dir\\file`.
	*/
	function unixify(filepath) {
		return filepath.replace(/\\/g, "/");
	}
	exports.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
		return path$11.resolve(cwd, filepath);
	}
	exports.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
		if (entry.charAt(0) === ".") {
			const secondCharactery = entry.charAt(1);
			if (secondCharactery === "/" || secondCharactery === "\\") return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
		}
		return entry;
	}
	exports.removeLeadingDotSegment = removeLeadingDotSegment;
	exports.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern$1) {
		return pattern$1.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern$1) {
		return pattern$1.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapePosixPath = escapePosixPath;
	exports.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
		return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
	}
	exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
		return escapePosixPath(filepath);
	}
	exports.convertPosixPathToPattern = convertPosixPathToPattern;
} });

//#endregion
//#region ../../node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({ "../../node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js"(exports, module) {
	/*!
	* is-extglob <https://github.com/jonschlinkert/is-extglob>
	*
	* Copyright (c) 2014-2016, Jon Schlinkert.
	* Licensed under the MIT License.
	*/
	module.exports = function isExtglob$1(str) {
		if (typeof str !== "string" || str === "") return false;
		var match$1;
		while (match$1 = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
			if (match$1[2]) return true;
			str = str.slice(match$1.index + match$1[0].length);
		}
		return false;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js
var require_is_glob = __commonJS({ "../../node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js"(exports, module) {
	/*!
	* is-glob <https://github.com/jonschlinkert/is-glob>
	*
	* Copyright (c) 2014-2017, Jon Schlinkert.
	* Released under the MIT License.
	*/
	var isExtglob = require_is_extglob();
	var chars = {
		"{": "}",
		"(": ")",
		"[": "]"
	};
	var strictCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		var pipeIndex = -2;
		var closeSquareIndex = -2;
		var closeCurlyIndex = -2;
		var closeParenIndex = -2;
		var backSlashIndex = -2;
		while (index < str.length) {
			if (str[index] === "*") return true;
			if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) return true;
			if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
				if (closeSquareIndex < index) closeSquareIndex = str.indexOf("]", index);
				if (closeSquareIndex > index) {
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
				}
			}
			if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
				closeCurlyIndex = str.indexOf("}", index);
				if (closeCurlyIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) return true;
				}
			}
			if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
				closeParenIndex = str.indexOf(")", index);
				if (closeParenIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
				}
			}
			if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
				if (pipeIndex < index) pipeIndex = str.indexOf("|", index);
				if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
					closeParenIndex = str.indexOf(")", pipeIndex);
					if (closeParenIndex > pipeIndex) {
						backSlashIndex = str.indexOf("\\", pipeIndex);
						if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
					}
				}
			}
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	var relaxedCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		while (index < str.length) {
			if (/[*?{}()[\]]/.test(str[index])) return true;
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	module.exports = function isGlob$1(str, options) {
		if (typeof str !== "string" || str === "") return false;
		if (isExtglob(str)) return true;
		var check = strictCheck;
		if (options && options.strict === false) check = relaxedCheck;
		return check(str);
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({ "../../node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js"(exports, module) {
	var isGlob = require_is_glob();
	var pathPosixDirname = __require("path").posix.dirname;
	var isWin32 = __require("os").platform() === "win32";
	var slash = "/";
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
	/**
	* @param {string} str
	* @param {Object} opts
	* @param {boolean} [opts.flipBackslashes=true]
	* @returns {string}
	*/
	module.exports = function globParent$1(str, opts) {
		var options = Object.assign({ flipBackslashes: true }, opts);
		if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) str = str.replace(backslash, slash);
		if (enclosure.test(str)) str += slash;
		str += "a";
		do
			str = pathPosixDirname(str);
		while (isGlob(str) || globby.test(str));
		return str.replace(escaped, "$1");
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/utils.js
var require_utils$4 = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/utils.js"(exports) {
	exports.isInteger = (num) => {
		if (typeof num === "number") return Number.isInteger(num);
		if (typeof num === "string" && num.trim() !== "") return Number.isInteger(Number(num));
		return false;
	};
	/**
	* Find a node of the given type
	*/
	exports.find = (node, type) => node.nodes.find((node$1) => node$1.type === type);
	/**
	* Find a node of the given type
	*/
	exports.exceedsLimit = (min, max, step = 1, limit) => {
		if (limit === false) return false;
		if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
		return (Number(max) - Number(min)) / Number(step) >= limit;
	};
	/**
	* Escape the given node with '\\' before node.value
	*/
	exports.escapeNode = (block, n = 0, type) => {
		const node = block.nodes[n];
		if (!node) return;
		if (type && node.type === type || node.type === "open" || node.type === "close") {
			if (node.escaped !== true) {
				node.value = "\\" + node.value;
				node.escaped = true;
			}
		}
	};
	/**
	* Returns true if the given brace node should be enclosed in literal braces
	*/
	exports.encloseBrace = (node) => {
		if (node.type !== "brace") return false;
		if (node.commas >> 0 + node.ranges >> 0 === 0) {
			node.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a brace node is invalid.
	*/
	exports.isInvalidBrace = (block) => {
		if (block.type !== "brace") return false;
		if (block.invalid === true || block.dollar) return true;
		if (block.commas >> 0 + block.ranges >> 0 === 0) {
			block.invalid = true;
			return true;
		}
		if (block.open !== true || block.close !== true) {
			block.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a node is an open or close node
	*/
	exports.isOpenOrClose = (node) => {
		if (node.type === "open" || node.type === "close") return true;
		return node.open === true || node.close === true;
	};
	/**
	* Reduce an array of text nodes.
	*/
	exports.reduce = (nodes) => nodes.reduce((acc, node) => {
		if (node.type === "text") acc.push(node.value);
		if (node.type === "range") node.type = "text";
		return acc;
	}, []);
	/**
	* Flatten an array
	*/
	exports.flatten = (...args) => {
		const result = [];
		const flat = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				const ele = arr[i];
				if (Array.isArray(ele)) {
					flat(ele);
					continue;
				}
				if (ele !== void 0) result.push(ele);
			}
			return result;
		};
		flat(args);
		return result;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/stringify.js"(exports, module) {
	const utils$17 = require_utils$4();
	module.exports = (ast, options = {}) => {
		const stringify$5 = (node, parent = {}) => {
			const invalidBlock = options.escapeInvalid && utils$17.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			let output = "";
			if (node.value) {
				if ((invalidBlock || invalidNode) && utils$17.isOpenOrClose(node)) return "\\" + node.value;
				return node.value;
			}
			if (node.value) return node.value;
			if (node.nodes) for (const child of node.nodes) output += stringify$5(child);
			return output;
		};
		return stringify$5(ast);
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js
var require_is_number = __commonJS({ "../../node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js"(exports, module) {
	module.exports = function(num) {
		if (typeof num === "number") return num - num === 0;
		if (typeof num === "string" && num.trim() !== "") return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
		return false;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({ "../../node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js"(exports, module) {
	const isNumber$2 = require_is_number();
	const toRegexRange$1 = (min, max, options) => {
		if (isNumber$2(min) === false) throw new TypeError("toRegexRange: expected the first argument to be a number");
		if (max === void 0 || min === max) return String(min);
		if (isNumber$2(max) === false) throw new TypeError("toRegexRange: expected the second argument to be a number.");
		let opts = {
			relaxZeros: true,
			...options
		};
		if (typeof opts.strictZeros === "boolean") opts.relaxZeros = opts.strictZeros === false;
		let relax = String(opts.relaxZeros);
		let shorthand = String(opts.shorthand);
		let capture = String(opts.capture);
		let wrap = String(opts.wrap);
		let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
		if (toRegexRange$1.cache.hasOwnProperty(cacheKey)) return toRegexRange$1.cache[cacheKey].result;
		let a = Math.min(min, max);
		let b = Math.max(min, max);
		if (Math.abs(a - b) === 1) {
			let result = min + "|" + max;
			if (opts.capture) return `(${result})`;
			if (opts.wrap === false) return result;
			return `(?:${result})`;
		}
		let isPadded$1 = hasPadding(min) || hasPadding(max);
		let state = {
			min,
			max,
			a,
			b
		};
		let positives = [];
		let negatives = [];
		if (isPadded$1) {
			state.isPadded = isPadded$1;
			state.maxLen = String(state.max).length;
		}
		if (a < 0) {
			let newMin = b < 0 ? Math.abs(b) : 1;
			negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
			a = state.a = 0;
		}
		if (b >= 0) positives = splitToPatterns(a, b, state, opts);
		state.negatives = negatives;
		state.positives = positives;
		state.result = collatePatterns(negatives, positives, opts);
		if (opts.capture === true) state.result = `(${state.result})`;
		else if (opts.wrap !== false && positives.length + negatives.length > 1) state.result = `(?:${state.result})`;
		toRegexRange$1.cache[cacheKey] = state;
		return state.result;
	};
	function collatePatterns(neg, pos, options) {
		let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
		let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
		let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
		let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
		return subpatterns.join("|");
	}
	function splitToRanges(min, max) {
		let nines = 1;
		let zeros$1 = 1;
		let stop = countNines(min, nines);
		let stops = new Set([max]);
		while (min <= stop && stop <= max) {
			stops.add(stop);
			nines += 1;
			stop = countNines(min, nines);
		}
		stop = countZeros(max + 1, zeros$1) - 1;
		while (min < stop && stop <= max) {
			stops.add(stop);
			zeros$1 += 1;
			stop = countZeros(max + 1, zeros$1) - 1;
		}
		stops = [...stops];
		stops.sort(compare);
		return stops;
	}
	/**
	* Convert a range to a regex pattern
	* @param {Number} `start`
	* @param {Number} `stop`
	* @return {String}
	*/
	function rangeToPattern(start, stop, options) {
		if (start === stop) return {
			pattern: start,
			count: [],
			digits: 0
		};
		let zipped = zip(start, stop);
		let digits = zipped.length;
		let pattern$1 = "";
		let count = 0;
		for (let i = 0; i < digits; i++) {
			let [startDigit, stopDigit] = zipped[i];
			if (startDigit === stopDigit) pattern$1 += startDigit;
			else if (startDigit !== "0" || stopDigit !== "9") pattern$1 += toCharacterClass(startDigit, stopDigit, options);
			else count++;
		}
		if (count) pattern$1 += options.shorthand === true ? "\\d" : "[0-9]";
		return {
			pattern: pattern$1,
			count: [count],
			digits
		};
	}
	function splitToPatterns(min, max, tok, options) {
		let ranges = splitToRanges(min, max);
		let tokens = [];
		let start = min;
		let prev;
		for (let i = 0; i < ranges.length; i++) {
			let max$1 = ranges[i];
			let obj = rangeToPattern(String(start), String(max$1), options);
			let zeros$1 = "";
			if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
				if (prev.count.length > 1) prev.count.pop();
				prev.count.push(obj.count[0]);
				prev.string = prev.pattern + toQuantifier(prev.count);
				start = max$1 + 1;
				continue;
			}
			if (tok.isPadded) zeros$1 = padZeros(max$1, tok, options);
			obj.string = zeros$1 + obj.pattern + toQuantifier(obj.count);
			tokens.push(obj);
			start = max$1 + 1;
			prev = obj;
		}
		return tokens;
	}
	function filterPatterns(arr, comparison, prefix, intersection, options) {
		let result = [];
		for (let ele of arr) {
			let { string: string$1 } = ele;
			if (!intersection && !contains(comparison, "string", string$1)) result.push(prefix + string$1);
			if (intersection && contains(comparison, "string", string$1)) result.push(prefix + string$1);
		}
		return result;
	}
	/**
	* Zip strings
	*/
	function zip(a, b) {
		let arr = [];
		for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
		return arr;
	}
	function compare(a, b) {
		return a > b ? 1 : b > a ? -1 : 0;
	}
	function contains(arr, key, val) {
		return arr.some((ele) => ele[key] === val);
	}
	function countNines(min, len) {
		return Number(String(min).slice(0, -len) + "9".repeat(len));
	}
	function countZeros(integer, zeros$1) {
		return integer - integer % Math.pow(10, zeros$1);
	}
	function toQuantifier(digits) {
		let [start = 0, stop = ""] = digits;
		if (stop || start > 1) return `{${start + (stop ? "," + stop : "")}}`;
		return "";
	}
	function toCharacterClass(a, b, options) {
		return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
	}
	function hasPadding(str) {
		return /^-?(0+)\d/.test(str);
	}
	function padZeros(value, tok, options) {
		if (!tok.isPadded) return value;
		let diff = Math.abs(tok.maxLen - String(value).length);
		let relax = options.relaxZeros !== false;
		switch (diff) {
			case 0: return "";
			case 1: return relax ? "0?" : "0";
			case 2: return relax ? "0{0,2}" : "00";
			default: return relax ? `0{0,${diff}}` : `0{${diff}}`;
		}
	}
	/**
	* Cache
	*/
	toRegexRange$1.cache = {};
	toRegexRange$1.clearCache = () => toRegexRange$1.cache = {};
	/**
	* Expose `toRegexRange`
	*/
	module.exports = toRegexRange$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/fill-range@7.1.1/node_modules/fill-range/index.js
var require_fill_range = __commonJS({ "../../node_modules/.pnpm/fill-range@7.1.1/node_modules/fill-range/index.js"(exports, module) {
	const util$1 = __require("util");
	const toRegexRange = require_to_regex_range();
	const isObject$1 = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	const transform = (toNumber) => {
		return (value) => toNumber === true ? Number(value) : String(value);
	};
	const isValidValue = (value) => {
		return typeof value === "number" || typeof value === "string" && value !== "";
	};
	const isNumber$1 = (num) => Number.isInteger(+num);
	const zeros = (input) => {
		let value = `${input}`;
		let index = -1;
		if (value[0] === "-") value = value.slice(1);
		if (value === "0") return false;
		while (value[++index] === "0");
		return index > 0;
	};
	const stringify$4 = (start, end, options) => {
		if (typeof start === "string" || typeof end === "string") return true;
		return options.stringify === true;
	};
	const pad = (input, maxLength, toNumber) => {
		if (maxLength > 0) {
			let dash = input[0] === "-" ? "-" : "";
			if (dash) input = input.slice(1);
			input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
		}
		if (toNumber === false) return String(input);
		return input;
	};
	const toMaxLen = (input, maxLength) => {
		let negative = input[0] === "-" ? "-" : "";
		if (negative) {
			input = input.slice(1);
			maxLength--;
		}
		while (input.length < maxLength) input = "0" + input;
		return negative ? "-" + input : input;
	};
	const toSequence = (parts, options, maxLen) => {
		parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		let prefix = options.capture ? "" : "?:";
		let positives = "";
		let negatives = "";
		let result;
		if (parts.positives.length) positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
		if (parts.negatives.length) negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
		if (positives && negatives) result = `${positives}|${negatives}`;
		else result = positives || negatives;
		if (options.wrap) return `(${prefix}${result})`;
		return result;
	};
	const toRange = (a, b, isNumbers, options) => {
		if (isNumbers) return toRegexRange(a, b, {
			wrap: false,
			...options
		});
		let start = String.fromCharCode(a);
		if (a === b) return start;
		let stop = String.fromCharCode(b);
		return `[${start}-${stop}]`;
	};
	const toRegex = (start, end, options) => {
		if (Array.isArray(start)) {
			let wrap = options.wrap === true;
			let prefix = options.capture ? "" : "?:";
			return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
		}
		return toRegexRange(start, end, options);
	};
	const rangeError = (...args) => {
		return new RangeError("Invalid range arguments: " + util$1.inspect(...args));
	};
	const invalidRange = (start, end, options) => {
		if (options.strictRanges === true) throw rangeError([start, end]);
		return [];
	};
	const invalidStep = (step, options) => {
		if (options.strictRanges === true) throw new TypeError(`Expected step "${step}" to be a number`);
		return [];
	};
	const fillNumbers = (start, end, step = 1, options = {}) => {
		let a = Number(start);
		let b = Number(end);
		if (!Number.isInteger(a) || !Number.isInteger(b)) {
			if (options.strictRanges === true) throw rangeError([start, end]);
			return [];
		}
		if (a === 0) a = 0;
		if (b === 0) b = 0;
		let descending = a > b;
		let startString = String(start);
		let endString = String(end);
		let stepString = String(step);
		step = Math.max(Math.abs(step), 1);
		let padded = zeros(startString) || zeros(endString) || zeros(stepString);
		let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
		let toNumber = padded === false && stringify$4(start, end, options) === false;
		let format = options.transform || transform(toNumber);
		if (options.toRegex && step === 1) return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
		let parts = {
			negatives: [],
			positives: []
		};
		let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
		let range$1 = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			if (options.toRegex === true && step > 1) push(a);
			else range$1.push(pad(format(a, index), maxLen, toNumber));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range$1, null, {
			wrap: false,
			...options
		});
		return range$1;
	};
	const fillLetters = (start, end, step = 1, options = {}) => {
		if (!isNumber$1(start) && start.length > 1 || !isNumber$1(end) && end.length > 1) return invalidRange(start, end, options);
		let format = options.transform || ((val) => String.fromCharCode(val));
		let a = `${start}`.charCodeAt(0);
		let b = `${end}`.charCodeAt(0);
		let descending = a > b;
		let min = Math.min(a, b);
		let max = Math.max(a, b);
		if (options.toRegex && step === 1) return toRange(min, max, false, options);
		let range$1 = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			range$1.push(format(a, index));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return toRegex(range$1, null, {
			wrap: false,
			options
		});
		return range$1;
	};
	const fill$2 = (start, end, step, options = {}) => {
		if (end == null && isValidValue(start)) return [start];
		if (!isValidValue(start) || !isValidValue(end)) return invalidRange(start, end, options);
		if (typeof step === "function") return fill$2(start, end, 1, { transform: step });
		if (isObject$1(step)) return fill$2(start, end, 0, step);
		let opts = { ...options };
		if (opts.capture === true) opts.wrap = true;
		step = step || opts.step || 1;
		if (!isNumber$1(step)) {
			if (step != null && !isObject$1(step)) return invalidStep(step, opts);
			return fill$2(start, end, 1, step);
		}
		if (isNumber$1(start) && isNumber$1(end)) return fillNumbers(start, end, step, opts);
		return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
	};
	module.exports = fill$2;
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/compile.js
var require_compile = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/compile.js"(exports, module) {
	const fill$1 = require_fill_range();
	const utils$16 = require_utils$4();
	const compile$1 = (ast, options = {}) => {
		const walk$1 = (node, parent = {}) => {
			const invalidBlock = utils$16.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			const invalid = invalidBlock === true || invalidNode === true;
			const prefix = options.escapeInvalid === true ? "\\" : "";
			let output = "";
			if (node.isOpen === true) return prefix + node.value;
			if (node.isClose === true) {
				console.log("node.isClose", prefix, node.value);
				return prefix + node.value;
			}
			if (node.type === "open") return invalid ? prefix + node.value : "(";
			if (node.type === "close") return invalid ? prefix + node.value : ")";
			if (node.type === "comma") return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
			if (node.value) return node.value;
			if (node.nodes && node.ranges > 0) {
				const args = utils$16.reduce(node.nodes);
				const range$1 = fill$1(...args, {
					...options,
					wrap: false,
					toRegex: true,
					strictZeros: true
				});
				if (range$1.length !== 0) return args.length > 1 && range$1.length > 1 ? `(${range$1})` : range$1;
			}
			if (node.nodes) for (const child of node.nodes) output += walk$1(child, node);
			return output;
		};
		return walk$1(ast);
	};
	module.exports = compile$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/expand.js
var require_expand = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/expand.js"(exports, module) {
	const fill = require_fill_range();
	const stringify$3 = require_stringify();
	const utils$15 = require_utils$4();
	const append = (queue = "", stash = "", enclose = false) => {
		const result = [];
		queue = [].concat(queue);
		stash = [].concat(stash);
		if (!stash.length) return queue;
		if (!queue.length) return enclose ? utils$15.flatten(stash).map((ele) => `{${ele}}`) : stash;
		for (const item of queue) if (Array.isArray(item)) for (const value of item) result.push(append(value, stash, enclose));
		else for (let ele of stash) {
			if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
			result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
		}
		return utils$15.flatten(result);
	};
	const expand$2 = (ast, options = {}) => {
		const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
		const walk$1 = (node, parent = {}) => {
			node.queue = [];
			let p$1 = parent;
			let q = parent.queue;
			while (p$1.type !== "brace" && p$1.type !== "root" && p$1.parent) {
				p$1 = p$1.parent;
				q = p$1.queue;
			}
			if (node.invalid || node.dollar) {
				q.push(append(q.pop(), stringify$3(node, options)));
				return;
			}
			if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
				q.push(append(q.pop(), ["{}"]));
				return;
			}
			if (node.nodes && node.ranges > 0) {
				const args = utils$15.reduce(node.nodes);
				if (utils$15.exceedsLimit(...args, options.step, rangeLimit)) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
				let range$1 = fill(...args, options);
				if (range$1.length === 0) range$1 = stringify$3(node, options);
				q.push(append(q.pop(), range$1));
				node.nodes = [];
				return;
			}
			const enclose = utils$15.encloseBrace(node);
			let queue = node.queue;
			let block = node;
			while (block.type !== "brace" && block.type !== "root" && block.parent) {
				block = block.parent;
				queue = block.queue;
			}
			for (let i = 0; i < node.nodes.length; i++) {
				const child = node.nodes[i];
				if (child.type === "comma" && node.type === "brace") {
					if (i === 1) queue.push("");
					queue.push("");
					continue;
				}
				if (child.type === "close") {
					q.push(append(q.pop(), queue, enclose));
					continue;
				}
				if (child.value && child.type !== "open") {
					queue.push(append(queue.pop(), child.value));
					continue;
				}
				if (child.nodes) walk$1(child, node);
			}
			return queue;
		};
		return utils$15.flatten(walk$1(ast));
	};
	module.exports = expand$2;
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/constants.js
var require_constants$3 = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/constants.js"(exports, module) {
	module.exports = {
		MAX_LENGTH: 1e4,
		CHAR_0: "0",
		CHAR_9: "9",
		CHAR_UPPERCASE_A: "A",
		CHAR_LOWERCASE_A: "a",
		CHAR_UPPERCASE_Z: "Z",
		CHAR_LOWERCASE_Z: "z",
		CHAR_LEFT_PARENTHESES: "(",
		CHAR_RIGHT_PARENTHESES: ")",
		CHAR_ASTERISK: "*",
		CHAR_AMPERSAND: "&",
		CHAR_AT: "@",
		CHAR_BACKSLASH: "\\",
		CHAR_BACKTICK: "`",
		CHAR_CARRIAGE_RETURN: "\r",
		CHAR_CIRCUMFLEX_ACCENT: "^",
		CHAR_COLON: ":",
		CHAR_COMMA: ",",
		CHAR_DOLLAR: "$",
		CHAR_DOT: ".",
		CHAR_DOUBLE_QUOTE: "\"",
		CHAR_EQUAL: "=",
		CHAR_EXCLAMATION_MARK: "!",
		CHAR_FORM_FEED: "\f",
		CHAR_FORWARD_SLASH: "/",
		CHAR_HASH: "#",
		CHAR_HYPHEN_MINUS: "-",
		CHAR_LEFT_ANGLE_BRACKET: "<",
		CHAR_LEFT_CURLY_BRACE: "{",
		CHAR_LEFT_SQUARE_BRACKET: "[",
		CHAR_LINE_FEED: "\n",
		CHAR_NO_BREAK_SPACE: "\xA0",
		CHAR_PERCENT: "%",
		CHAR_PLUS: "+",
		CHAR_QUESTION_MARK: "?",
		CHAR_RIGHT_ANGLE_BRACKET: ">",
		CHAR_RIGHT_CURLY_BRACE: "}",
		CHAR_RIGHT_SQUARE_BRACKET: "]",
		CHAR_SEMICOLON: ";",
		CHAR_SINGLE_QUOTE: "'",
		CHAR_SPACE: " ",
		CHAR_TAB: "	",
		CHAR_UNDERSCORE: "_",
		CHAR_VERTICAL_LINE: "|",
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: "﻿"
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/parse.js
var require_parse$1 = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/parse.js"(exports, module) {
	const stringify$2 = require_stringify();
	/**
	* Constants
	*/
	const { MAX_LENGTH: MAX_LENGTH$1, CHAR_BACKSLASH, CHAR_BACKTICK, CHAR_COMMA: CHAR_COMMA$1, CHAR_DOT: CHAR_DOT$1, CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1, CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1, CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1, CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1, CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1, CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE } = require_constants$3();
	/**
	* parse
	*/
	const parse$5 = (input, options = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		const opts = options || {};
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
		if (input.length > max) throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
		const ast = {
			type: "root",
			input,
			nodes: []
		};
		const stack = [ast];
		let block = ast;
		let prev = ast;
		let brackets = 0;
		const length = input.length;
		let index = 0;
		let depth$1 = 0;
		let value;
		/**
		* Helpers
		*/
		const advance = () => input[index++];
		const push = (node) => {
			if (node.type === "text" && prev.type === "dot") prev.type = "text";
			if (prev && prev.type === "text" && node.type === "text") {
				prev.value += node.value;
				return;
			}
			block.nodes.push(node);
			node.parent = block;
			node.prev = prev;
			prev = node;
			return node;
		};
		push({ type: "bos" });
		while (index < length) {
			block = stack[stack.length - 1];
			value = advance();
			/**
			* Invalid chars
			*/
			if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) continue;
			/**
			* Escaped chars
			*/
			if (value === CHAR_BACKSLASH) {
				push({
					type: "text",
					value: (options.keepEscaping ? value : "") + advance()
				});
				continue;
			}
			/**
			* Right square bracket (literal): ']'
			*/
			if (value === CHAR_RIGHT_SQUARE_BRACKET$1) {
				push({
					type: "text",
					value: "\\" + value
				});
				continue;
			}
			/**
			* Left square bracket: '['
			*/
			if (value === CHAR_LEFT_SQUARE_BRACKET$1) {
				brackets++;
				let next;
				while (index < length && (next = advance())) {
					value += next;
					if (next === CHAR_LEFT_SQUARE_BRACKET$1) {
						brackets++;
						continue;
					}
					if (next === CHAR_BACKSLASH) {
						value += advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
						brackets--;
						if (brackets === 0) break;
					}
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === CHAR_LEFT_PARENTHESES$1) {
				block = push({
					type: "paren",
					nodes: []
				});
				stack.push(block);
				push({
					type: "text",
					value
				});
				continue;
			}
			if (value === CHAR_RIGHT_PARENTHESES$1) {
				if (block.type !== "paren") {
					push({
						type: "text",
						value
					});
					continue;
				}
				block = stack.pop();
				push({
					type: "text",
					value
				});
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Quotes: '|"|`
			*/
			if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
				const open = value;
				let next;
				if (options.keepQuotes !== true) value = "";
				while (index < length && (next = advance())) {
					if (next === CHAR_BACKSLASH) {
						value += next + advance();
						continue;
					}
					if (next === open) {
						if (options.keepQuotes === true) value += next;
						break;
					}
					value += next;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Left curly brace: '{'
			*/
			if (value === CHAR_LEFT_CURLY_BRACE$1) {
				depth$1++;
				const dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
				const brace = {
					type: "brace",
					open: true,
					close: false,
					dollar,
					depth: depth$1,
					commas: 0,
					ranges: 0,
					nodes: []
				};
				block = push(brace);
				stack.push(block);
				push({
					type: "open",
					value
				});
				continue;
			}
			/**
			* Right curly brace: '}'
			*/
			if (value === CHAR_RIGHT_CURLY_BRACE$1) {
				if (block.type !== "brace") {
					push({
						type: "text",
						value
					});
					continue;
				}
				const type = "close";
				block = stack.pop();
				block.close = true;
				push({
					type,
					value
				});
				depth$1--;
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Comma: ','
			*/
			if (value === CHAR_COMMA$1 && depth$1 > 0) {
				if (block.ranges > 0) {
					block.ranges = 0;
					const open = block.nodes.shift();
					block.nodes = [open, {
						type: "text",
						value: stringify$2(block)
					}];
				}
				push({
					type: "comma",
					value
				});
				block.commas++;
				continue;
			}
			/**
			* Dot: '.'
			*/
			if (value === CHAR_DOT$1 && depth$1 > 0 && block.commas === 0) {
				const siblings = block.nodes;
				if (depth$1 === 0 || siblings.length === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
				if (prev.type === "dot") {
					block.range = [];
					prev.value += value;
					prev.type = "range";
					if (block.nodes.length !== 3 && block.nodes.length !== 5) {
						block.invalid = true;
						block.ranges = 0;
						prev.type = "text";
						continue;
					}
					block.ranges++;
					block.args = [];
					continue;
				}
				if (prev.type === "range") {
					siblings.pop();
					const before = siblings[siblings.length - 1];
					before.value += prev.value + value;
					prev = before;
					block.ranges--;
					continue;
				}
				push({
					type: "dot",
					value
				});
				continue;
			}
			/**
			* Text
			*/
			push({
				type: "text",
				value
			});
		}
		do {
			block = stack.pop();
			if (block.type !== "root") {
				block.nodes.forEach((node) => {
					if (!node.nodes) {
						if (node.type === "open") node.isOpen = true;
						if (node.type === "close") node.isClose = true;
						if (!node.nodes) node.type = "text";
						node.invalid = true;
					}
				});
				const parent = stack[stack.length - 1];
				const index$1 = parent.nodes.indexOf(block);
				parent.nodes.splice(index$1, 1, ...block.nodes);
			}
		} while (stack.length > 0);
		push({ type: "eos" });
		return ast;
	};
	module.exports = parse$5;
} });

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/index.js
var require_braces = __commonJS({ "../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/index.js"(exports, module) {
	const stringify$1 = require_stringify();
	const compile = require_compile();
	const expand$1 = require_expand();
	const parse$4 = require_parse$1();
	/**
	* Expand the given pattern or create a regex-compatible string.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
	* console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {String}
	* @api public
	*/
	const braces$1 = (input, options = {}) => {
		let output = [];
		if (Array.isArray(input)) for (const pattern$1 of input) {
			const result = braces$1.create(pattern$1, options);
			if (Array.isArray(result)) output.push(...result);
			else output.push(result);
		}
		else output = [].concat(braces$1.create(input, options));
		if (options && options.expand === true && options.nodupes === true) output = [...new Set(output)];
		return output;
	};
	/**
	* Parse the given `str` with the given `options`.
	*
	* ```js
	* // braces.parse(pattern, [, options]);
	* const ast = braces.parse('a/{b,c}/d');
	* console.log(ast);
	* ```
	* @param {String} pattern Brace pattern to parse
	* @param {Object} options
	* @return {Object} Returns an AST
	* @api public
	*/
	braces$1.parse = (input, options = {}) => parse$4(input, options);
	/**
	* Creates a braces string from an AST, or an AST node.
	*
	* ```js
	* const braces = require('braces');
	* let ast = braces.parse('foo/{a,b}/bar');
	* console.log(stringify(ast.nodes[2])); //=> '{a,b}'
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces$1.stringify = (input, options = {}) => {
		if (typeof input === "string") return stringify$1(braces$1.parse(input, options), options);
		return stringify$1(input, options);
	};
	/**
	* Compiles a brace pattern into a regex-compatible, optimized string.
	* This method is called by the main [braces](#braces) function by default.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.compile('a/{b,c}/d'));
	* //=> ['a/(b|c)/d']
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces$1.compile = (input, options = {}) => {
		if (typeof input === "string") input = braces$1.parse(input, options);
		return compile(input, options);
	};
	/**
	* Expands a brace pattern into an array. This method is called by the
	* main [braces](#braces) function when `options.expand` is true. Before
	* using this method it's recommended that you read the [performance notes](#performance))
	* and advantages of using [.compile](#compile) instead.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.expand('a/{b,c}/d'));
	* //=> ['a/b/d', 'a/c/d'];
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces$1.expand = (input, options = {}) => {
		if (typeof input === "string") input = braces$1.parse(input, options);
		let result = expand$1(input, options);
		if (options.noempty === true) result = result.filter(Boolean);
		if (options.nodupes === true) result = [...new Set(result)];
		return result;
	};
	/**
	* Processes a brace pattern and returns either an expanded array
	* (if `options.expand` is true), a highly optimized regex-compatible string.
	* This method is called by the main [braces](#braces) function.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
	* //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces$1.create = (input, options = {}) => {
		if (input === "" || input.length < 3) return [input];
		return options.expand !== true ? braces$1.compile(input, options) : braces$1.expand(input, options);
	};
	/**
	* Expose "braces"
	*/
	module.exports = braces$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/constants.js
var require_constants$2 = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/constants.js"(exports, module) {
	const path$10 = __require("path");
	const WIN_SLASH = "\\\\/";
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	/**
	* Posix glob regex
	*/
	const DOT_LITERAL = "\\.";
	const PLUS_LITERAL = "\\+";
	const QMARK_LITERAL = "\\?";
	const SLASH_LITERAL = "\\/";
	const ONE_CHAR = "(?=.)";
	const QMARK = "[^/]";
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const NO_DOT = `(?!${DOT_LITERAL})`;
	const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
	const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
	const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
	const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
	const STAR = `${QMARK}*?`;
	const POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT,
		NO_DOTS,
		NO_DOT_SLASH,
		NO_DOTS_SLASH,
		QMARK_NO_DOT,
		STAR,
		START_ANCHOR
	};
	/**
	* Windows glob regex
	*/
	const WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};
	/**
	* POSIX Bracket Regex
	*/
	const POSIX_REGEX_SOURCE$1 = {
		alnum: "a-zA-Z0-9",
		alpha: "a-zA-Z",
		ascii: "\\x00-\\x7F",
		blank: " \\t",
		cntrl: "\\x00-\\x1F\\x7F",
		digit: "0-9",
		graph: "\\x21-\\x7E",
		lower: "a-z",
		print: "\\x20-\\x7E ",
		punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
		space: " \\t\\r\\n\\v\\f",
		upper: "A-Z",
		word: "A-Za-z0-9_",
		xdigit: "A-Fa-f0-9"
	};
	module.exports = {
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		SEP: path$10.sep,
		extglobChars(chars$1) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars$1.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		globChars(win32$1) {
			return win32$1 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/utils.js
var require_utils$3 = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/utils.js"(exports) {
	const path$9 = __require("path");
	const win32 = process.platform === "win32";
	const { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants$2();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match$1) => {
			return match$1 === "\\" ? "" : match$1;
		});
	};
	exports.supportsLookbehinds = () => {
		const segs = process.version.slice(1).split(".").map(Number);
		if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) return true;
		return false;
	};
	exports.isWindows = (options) => {
		if (options && typeof options.windows === "boolean") return options.windows;
		return win32 === true || path$9.sep === "\\";
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		const prepend = options.contains ? "" : "^";
		const append$1 = options.contains ? "" : "$";
		let output = `${prepend}(?:${input})${append$1}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/scan.js"(exports, module) {
	const utils$14 = require_utils$3();
	const { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants$2();
	const isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	const depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	const scan$1 = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob$1 = false;
		let isExtglob$1 = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces$2 = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces$2++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces$2++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob$1 = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob$1 = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces$2--;
						if (braces$2 === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
				if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob$1 = token.isGlob = true;
					isExtglob$1 = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob$1 = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob$1 = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob$1 = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob$1 = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob$1 = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob$1 === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob$1 = false;
			isGlob$1 = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob$1 === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob$1 === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils$14.removeBackslashes(glob);
			if (base && backslashes === true) base = utils$14.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob: isGlob$1,
			isExtglob: isExtglob$1,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/parse.js"(exports, module) {
	const constants$1 = require_constants$2();
	const utils$13 = require_utils$3();
	/**
	* Constants
	*/
	const { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants$1;
	/**
	* Helpers
	*/
	const expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils$13.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	const syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	const parse$3 = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const win32$1 = utils$13.isWindows(options);
		const PLATFORM_CHARS = constants$1.globChars(win32$1);
		const EXTGLOB_CHARS = constants$1.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL: DOT_LITERAL$1, PLUS_LITERAL: PLUS_LITERAL$1, SLASH_LITERAL: SLASH_LITERAL$1, ONE_CHAR: ONE_CHAR$1, DOTS_SLASH: DOTS_SLASH$1, NO_DOT: NO_DOT$1, NO_DOT_SLASH: NO_DOT_SLASH$1, NO_DOTS_SLASH: NO_DOTS_SLASH$1, QMARK: QMARK$1, QMARK_NO_DOT: QMARK_NO_DOT$1, STAR: STAR$1, START_ANCHOR: START_ANCHOR$1 } = PLATFORM_CHARS;
		const globstar = (opts$1) => {
			return `(${capture}(?:(?!${START_ANCHOR$1}${opts$1.dot ? DOTS_SLASH$1 : DOT_LITERAL$1}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT$1;
		const qmarkNoDot = opts.dot ? QMARK$1 : QMARK_NO_DOT$1;
		let star$2 = opts.bash === true ? globstar(opts) : STAR$1;
		if (opts.capture) star$2 = `(${star$2})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils$13.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces$2 = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value$1 = "", num = 0) => {
			state.consumed += value$1;
			state.index += num;
		};
		const append$1 = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob$1 = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob$1) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star$2;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append$1(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.value += tok.value;
				prev.output = (prev.output || "") + tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value$1) => {
			const token = {
				...EXTGLOB_CHARS[value$1],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value: value$1,
				output: state.output ? "" : ONE_CHAR$1
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star$2;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star$2 || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
					const expression = parse$3(rest, {
						...options,
						fastpaths: false
					}).output;
					output = token.close = `)${expression})${extglobStar})`;
				}
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars$1, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK$1.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK$1.repeat(rest.length) : "");
					return QMARK$1.repeat(chars$1.length);
				}
				if (first === ".") return DOT_LITERAL$1.repeat(chars$1.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star$2 : "");
					return star$2;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) if (opts.unescape === true) output = output.replace(/\\/g, "");
			else output = output.replace(/\\+/g, (m) => {
				return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
			});
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils$13.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match$1 = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match$1 && match$1[0].length > 2) {
					slashes = match$1[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const rest$1 = prev.value.slice(idx + 2);
							const posix = POSIX_REGEX_SOURCE[rest$1];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR$1;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append$1({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils$13.escapeRegex(value);
				prev.value += value;
				append$1({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append$1({ value });
				if (opts.literalBrackets === false || utils$13.hasRegexChars(prevValue)) continue;
				const escaped$1 = utils$13.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped$1;
					prev.value = escaped$1;
					continue;
				}
				prev.value = `(${capture}${escaped$1}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces$2.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces$2[braces$2.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range$1 = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range$1.unshift(arr[i].value);
					}
					output = expandRange(range$1, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces$2.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces$2[braces$2.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL$1
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL$1;
					const brace = braces$2[braces$2.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL$1
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL$1
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				const isGroup = prev && prev.value === "(";
				if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (next === "<" && !utils$13.supportsLookbehinds()) throw new Error("Node.js v10 or higher is required for regex lookbehinds");
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT$1
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK$1
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL$1
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL$1
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match$1 = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match$1) {
					value += match$1[0];
					state.index += match$1[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star$2;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob$1 = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob$1) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL$1}|${SLASH_LITERAL$1}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL$1}|${globstar(opts)}${SLASH_LITERAL$1})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star$2
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH$1;
					prev.output += NO_DOT_SLASH$1;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH$1;
					prev.output += NO_DOTS_SLASH$1;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR$1;
					prev.output += ONE_CHAR$1;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils$13.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils$13.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils$13.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL$1}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse$3.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const win32$1 = utils$13.isWindows(options);
		const { DOT_LITERAL: DOT_LITERAL$1, SLASH_LITERAL: SLASH_LITERAL$1, ONE_CHAR: ONE_CHAR$1, DOTS_SLASH: DOTS_SLASH$1, NO_DOT: NO_DOT$1, NO_DOTS: NO_DOTS$1, NO_DOTS_SLASH: NO_DOTS_SLASH$1, STAR: STAR$1, START_ANCHOR: START_ANCHOR$1 } = constants$1.globChars(win32$1);
		const nodot = opts.dot ? NO_DOTS$1 : NO_DOT$1;
		const slashDot = opts.dot ? NO_DOTS_SLASH$1 : NO_DOT$1;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star$2 = opts.bash === true ? ".*?" : STAR$1;
		if (opts.capture) star$2 = `(${star$2})`;
		const globstar = (opts$1) => {
			if (opts$1.noglobstar === true) return star$2;
			return `(${capture}(?:(?!${START_ANCHOR$1}${opts$1.dot ? DOTS_SLASH$1 : DOT_LITERAL$1}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR$1}${star$2}`;
				case ".*": return `${DOT_LITERAL$1}${ONE_CHAR$1}${star$2}`;
				case "*.*": return `${nodot}${star$2}${DOT_LITERAL$1}${ONE_CHAR$1}${star$2}`;
				case "*/*": return `${nodot}${star$2}${SLASH_LITERAL$1}${ONE_CHAR$1}${slashDot}${star$2}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL$1})?${slashDot}${ONE_CHAR$1}${star$2}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL$1})?${slashDot}${star$2}${DOT_LITERAL$1}${ONE_CHAR$1}${star$2}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL$1})?${DOT_LITERAL$1}${ONE_CHAR$1}${star$2}`;
				default: {
					const match$1 = /^(.*?)\.(\w+)$/.exec(str);
					if (!match$1) return;
					const source$1 = create(match$1[1]);
					if (!source$1) return;
					return source$1 + DOT_LITERAL$1 + match$1[2];
				}
			}
		};
		const output = utils$13.removePrefix(input, state);
		let source = create(output);
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL$1}?`;
		return source;
	};
	module.exports = parse$3;
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/picomatch.js"(exports, module) {
	const path$8 = __require("path");
	const scan = require_scan();
	const parse$2 = require_parse();
	const utils$12 = require_utils$3();
	const constants = require_constants$2();
	const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	const picomatch$1 = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch$1(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state$1 = isMatch(str);
					if (state$1) return state$1;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = utils$12.isWindows(options);
		const regex = isState ? picomatch$1.compileRe(glob, options) : picomatch$1.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch$1(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match: match$1, output } = picomatch$1.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match: match$1,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch$1.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils$12.toPosixSlashes : null);
		let match$1 = input === glob;
		let output = match$1 && format ? format(input) : input;
		if (match$1 === false) {
			output = format ? format(input) : input;
			match$1 = output === glob;
		}
		if (match$1 === false || opts.capture === true) if (opts.matchBase === true || opts.basename === true) match$1 = picomatch$1.matchBase(input, regex, options, posix);
		else match$1 = regex.exec(output);
		return {
			isMatch: Boolean(match$1),
			match: match$1,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch$1.matchBase = (input, glob, options, posix = utils$12.isWindows(options)) => {
		const regex = glob instanceof RegExp ? glob : picomatch$1.makeRe(glob, options);
		return regex.test(path$8.basename(input));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch$1.isMatch = (str, patterns, options) => picomatch$1(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch$1.parse = (pattern$1, options) => {
		if (Array.isArray(pattern$1)) return pattern$1.map((p$1) => picomatch$1.parse(p$1, options));
		return parse$2(pattern$1, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch$1.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch$1.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append$1 = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append$1}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch$1.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch$1.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse$2.fastpaths(input, options);
		if (!parsed.output) parsed = parse$2(input, options);
		return picomatch$1.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch$1.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch$1.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/index.js
var require_picomatch = __commonJS({ "../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/index.js"(exports, module) {
	module.exports = require_picomatch$1();
} });

//#endregion
//#region ../../node_modules/.pnpm/micromatch@4.0.8/node_modules/micromatch/index.js
var require_micromatch = __commonJS({ "../../node_modules/.pnpm/micromatch@4.0.8/node_modules/micromatch/index.js"(exports, module) {
	const util = __require("util");
	const braces = require_braces();
	const picomatch = require_picomatch();
	const utils$11 = require_utils$3();
	const isEmptyString = (v) => v === "" || v === "./";
	const hasBraces = (v) => {
		const index = v.indexOf("{");
		return index > -1 && v.indexOf("}", index) > -1;
	};
	/**
	* Returns an array of strings that match one or more glob patterns.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm(list, patterns[, options]);
	*
	* console.log(mm(['a.js', 'a.txt'], ['*.js']));
	* //=> [ 'a.js' ]
	* ```
	* @param {String|Array<string>} `list` List of strings to match.
	* @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options)
	* @return {Array} Returns an array of matches
	* @summary false
	* @api public
	*/
	const micromatch$1 = (list, patterns, options) => {
		patterns = [].concat(patterns);
		list = [].concat(list);
		let omit = new Set();
		let keep = new Set();
		let items = new Set();
		let negatives = 0;
		let onResult = (state) => {
			items.add(state.output);
			if (options && options.onResult) options.onResult(state);
		};
		for (let i = 0; i < patterns.length; i++) {
			let isMatch = picomatch(String(patterns[i]), {
				...options,
				onResult
			}, true);
			let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
			if (negated) negatives++;
			for (let item of list) {
				let matched = isMatch(item, true);
				let match$1 = negated ? !matched.isMatch : matched.isMatch;
				if (!match$1) continue;
				if (negated) omit.add(matched.output);
				else {
					omit.delete(matched.output);
					keep.add(matched.output);
				}
			}
		}
		let result = negatives === patterns.length ? [...items] : [...keep];
		let matches = result.filter((item) => !omit.has(item));
		if (options && matches.length === 0) {
			if (options.failglob === true) throw new Error(`No matches found for "${patterns.join(", ")}"`);
			if (options.nonull === true || options.nullglob === true) return options.unescape ? patterns.map((p$1) => p$1.replace(/\\/g, "")) : patterns;
		}
		return matches;
	};
	/**
	* Backwards compatibility
	*/
	micromatch$1.match = micromatch$1;
	/**
	* Returns a matcher function from the given glob `pattern` and `options`.
	* The returned function takes a string to match as its only argument and returns
	* true if the string is a match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matcher(pattern[, options]);
	*
	* const isMatch = mm.matcher('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @param {String} `pattern` Glob pattern
	* @param {Object} `options`
	* @return {Function} Returns a matcher function.
	* @api public
	*/
	micromatch$1.matcher = (pattern$1, options) => picomatch(pattern$1, options);
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.isMatch(string, patterns[, options]);
	*
	* console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(mm.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `[options]` See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch$1.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Backwards compatibility
	*/
	micromatch$1.any = micromatch$1.isMatch;
	/**
	* Returns a list of strings that _**do not match any**_ of the given `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.not(list, patterns[, options]);
	*
	* console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	* //=> ['b.b', 'c.c']
	* ```
	* @param {Array} `list` Array of strings to match.
	* @param {String|Array} `patterns` One or more glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array} Returns an array of strings that **do not match** the given patterns.
	* @api public
	*/
	micromatch$1.not = (list, patterns, options = {}) => {
		patterns = [].concat(patterns).map(String);
		let result = new Set();
		let items = [];
		let onResult = (state) => {
			if (options.onResult) options.onResult(state);
			items.push(state.output);
		};
		let matches = new Set(micromatch$1(list, patterns, {
			...options,
			onResult
		}));
		for (let item of items) if (!matches.has(item)) result.add(item);
		return [...result];
	};
	/**
	* Returns true if the given `string` contains the given pattern. Similar
	* to [.isMatch](#isMatch) but the pattern can match any part of the string.
	*
	* ```js
	* var mm = require('micromatch');
	* // mm.contains(string, pattern[, options]);
	*
	* console.log(mm.contains('aa/bb/cc', '*b'));
	* //=> true
	* console.log(mm.contains('aa/bb/cc', '*d'));
	* //=> false
	* ```
	* @param {String} `str` The string to match.
	* @param {String|Array} `patterns` Glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	* @api public
	*/
	micromatch$1.contains = (str, pattern$1, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		if (Array.isArray(pattern$1)) return pattern$1.some((p$1) => micromatch$1.contains(str, p$1, options));
		if (typeof pattern$1 === "string") {
			if (isEmptyString(str) || isEmptyString(pattern$1)) return false;
			if (str.includes(pattern$1) || str.startsWith("./") && str.slice(2).includes(pattern$1)) return true;
		}
		return micromatch$1.isMatch(str, pattern$1, {
			...options,
			contains: true
		});
	};
	/**
	* Filter the keys of the given object with the given `glob` pattern
	* and `options`. Does not attempt to match nested keys. If you need this feature,
	* use [glob-object][] instead.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matchKeys(object, patterns[, options]);
	*
	* const obj = { aa: 'a', ab: 'b', ac: 'c' };
	* console.log(mm.matchKeys(obj, '*b'));
	* //=> { ab: 'b' }
	* ```
	* @param {Object} `object` The object with keys to filter.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Object} Returns an object with only keys that match the given patterns.
	* @api public
	*/
	micromatch$1.matchKeys = (obj, patterns, options) => {
		if (!utils$11.isObject(obj)) throw new TypeError("Expected the first argument to be an object");
		let keys$1 = micromatch$1(Object.keys(obj), patterns, options);
		let res = {};
		for (let key of keys$1) res[key] = obj[key];
		return res;
	};
	/**
	* Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.some(list, patterns[, options]);
	*
	* console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // true
	* console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	* @api public
	*/
	micromatch$1.some = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern$1 of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern$1), options);
			if (items.some((item) => isMatch(item))) return true;
		}
		return false;
	};
	/**
	* Returns true if every string in the given `list` matches
	* any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.every(list, patterns[, options]);
	*
	* console.log(mm.every('foo.js', ['foo.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // false
	* console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	* @api public
	*/
	micromatch$1.every = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern$1 of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern$1), options);
			if (!items.every((item) => isMatch(item))) return false;
		}
		return true;
	};
	/**
	* Returns true if **all** of the given `patterns` match
	* the specified string.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.all(string, patterns[, options]);
	*
	* console.log(mm.all('foo.js', ['foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	* // false
	*
	* console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	* // true
	* ```
	* @param {String|Array} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch$1.all = (str, patterns, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		return [].concat(patterns).every((p$1) => picomatch(p$1, options)(str));
	};
	/**
	* Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.capture(pattern, string[, options]);
	*
	* console.log(mm.capture('test/*.js', 'test/foo.js'));
	* //=> ['foo']
	* console.log(mm.capture('test/*.js', 'foo/bar.css'));
	* //=> null
	* ```
	* @param {String} `glob` Glob pattern to use for matching.
	* @param {String} `input` String to match
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	* @api public
	*/
	micromatch$1.capture = (glob, input, options) => {
		let posix = utils$11.isWindows(options);
		let regex = picomatch.makeRe(String(glob), {
			...options,
			capture: true
		});
		let match$1 = regex.exec(posix ? utils$11.toPosixSlashes(input) : input);
		if (match$1) return match$1.slice(1).map((v) => v === void 0 ? "" : v);
	};
	/**
	* Create a regular expression from the given glob `pattern`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.makeRe(pattern[, options]);
	*
	* console.log(mm.makeRe('*.js'));
	* //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	* ```
	* @param {String} `pattern` A glob pattern to convert to regex.
	* @param {Object} `options`
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	micromatch$1.makeRe = (...args) => picomatch.makeRe(...args);
	/**
	* Scan a glob pattern to separate the pattern into segments. Used
	* by the [split](#split) method.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.scan(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	micromatch$1.scan = (...args) => picomatch.scan(...args);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.parse(pattern[, options]);
	* ```
	* @param {String} `glob`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as regex source string.
	* @api public
	*/
	micromatch$1.parse = (patterns, options) => {
		let res = [];
		for (let pattern$1 of [].concat(patterns || [])) for (let str of braces(String(pattern$1), options)) res.push(picomatch.parse(str, options));
		return res;
	};
	/**
	* Process the given brace `pattern`.
	*
	* ```js
	* const { braces } = require('micromatch');
	* console.log(braces('foo/{a,b,c}/bar'));
	* //=> [ 'foo/(a|b|c)/bar' ]
	*
	* console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	* //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	* ```
	* @param {String} `pattern` String with brace pattern to process.
	* @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	* @return {Array}
	* @api public
	*/
	micromatch$1.braces = (pattern$1, options) => {
		if (typeof pattern$1 !== "string") throw new TypeError("Expected a string");
		if (options && options.nobrace === true || !hasBraces(pattern$1)) return [pattern$1];
		return braces(pattern$1, options);
	};
	/**
	* Expand braces
	*/
	micromatch$1.braceExpand = (pattern$1, options) => {
		if (typeof pattern$1 !== "string") throw new TypeError("Expected a string");
		return micromatch$1.braces(pattern$1, {
			...options,
			expand: true
		});
	};
	/**
	* Expose micromatch
	*/
	micromatch$1.hasBraces = hasBraces;
	module.exports = micromatch$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/pattern.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.removeDuplicateSlashes = exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.isPatternRelatedToParentDirectory = exports.getPatternsOutsideCurrentDirectory = exports.getPatternsInsideCurrentDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
	const path$7 = __require("path");
	const globParent = require_glob_parent();
	const micromatch = require_micromatch();
	const GLOBSTAR$1 = "**";
	const ESCAPE_SYMBOL = "\\";
	const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	* Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	* The latter is due to the presence of the device path at the beginning of the UNC path.
	*/
	const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern$1, options = {}) {
		return !isDynamicPattern(pattern$1, options);
	}
	exports.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern$1, options = {}) {
		/**
		* A special case with an empty string is necessary for matching patterns that start with a forward slash.
		* An empty string cannot be a dynamic pattern.
		* For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
		*/
		if (pattern$1 === "") return false;
		/**
		* When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
		* filepath directly (without read directory).
		*/
		if (options.caseSensitiveMatch === false || pattern$1.includes(ESCAPE_SYMBOL)) return true;
		if (COMMON_GLOB_SYMBOLS_RE.test(pattern$1) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern$1) || REGEX_GROUP_SYMBOLS_RE.test(pattern$1)) return true;
		if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern$1)) return true;
		if (options.braceExpansion !== false && hasBraceExpansion(pattern$1)) return true;
		return false;
	}
	exports.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern$1) {
		const openingBraceIndex = pattern$1.indexOf("{");
		if (openingBraceIndex === -1) return false;
		const closingBraceIndex = pattern$1.indexOf("}", openingBraceIndex + 1);
		if (closingBraceIndex === -1) return false;
		const braceContent = pattern$1.slice(openingBraceIndex, closingBraceIndex);
		return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern$1) {
		return isNegativePattern(pattern$1) ? pattern$1.slice(1) : pattern$1;
	}
	exports.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern$1) {
		return "!" + pattern$1;
	}
	exports.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern$1) {
		return pattern$1.startsWith("!") && pattern$1[1] !== "(";
	}
	exports.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern$1) {
		return !isNegativePattern(pattern$1);
	}
	exports.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
		return patterns.filter(isNegativePattern);
	}
	exports.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns$1(patterns) {
		return patterns.filter(isPositivePattern);
	}
	exports.getPositivePatterns = getPositivePatterns$1;
	/**
	* Returns patterns that can be applied inside the current directory.
	*
	* @example
	* // ['./*', '*', 'a/*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsInsideCurrentDirectory(patterns) {
		return patterns.filter((pattern$1) => !isPatternRelatedToParentDirectory(pattern$1));
	}
	exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	* Returns patterns to be expanded relative to (outside) the current directory.
	*
	* @example
	* // ['../*', './../*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsOutsideCurrentDirectory(patterns) {
		return patterns.filter(isPatternRelatedToParentDirectory);
	}
	exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern$1) {
		return pattern$1.startsWith("..") || pattern$1.startsWith("./..");
	}
	exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern$1) {
		return globParent(pattern$1, { flipBackslashes: false });
	}
	exports.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern$1) {
		return pattern$1.includes(GLOBSTAR$1);
	}
	exports.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern$1) {
		return pattern$1.endsWith("/" + GLOBSTAR$1);
	}
	exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern$1) {
		const basename$1 = path$7.basename(pattern$1);
		return endsWithSlashGlobStar(pattern$1) || isStaticPattern(basename$1);
	}
	exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
		return patterns.reduce((collection, pattern$1) => {
			return collection.concat(expandBraceExpansion(pattern$1));
		}, []);
	}
	exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern$1) {
		const patterns = micromatch.braces(pattern$1, {
			expand: true,
			nodupes: true,
			keepEscaping: true
		});
		/**
		* Sort the patterns by length so that the same depth patterns are processed side by side.
		* `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
		*/
		patterns.sort((a, b) => a.length - b.length);
		/**
		* Micromatch can return an empty string in the case of patterns like `{a,}`.
		*/
		return patterns.filter((pattern$2) => pattern$2 !== "");
	}
	exports.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern$1, options) {
		let { parts } = micromatch.scan(pattern$1, Object.assign(Object.assign({}, options), { parts: true }));
		/**
		* The scan method returns an empty array in some cases.
		* See micromatch/picomatch#58 for more details.
		*/
		if (parts.length === 0) parts = [pattern$1];
		/**
		* The scan method does not return an empty part for the pattern with a forward slash.
		* This is another part of micromatch/picomatch#58.
		*/
		if (parts[0].startsWith("/")) {
			parts[0] = parts[0].slice(1);
			parts.unshift("");
		}
		return parts;
	}
	exports.getPatternParts = getPatternParts;
	function makeRe$1(pattern$1, options) {
		return micromatch.makeRe(pattern$1, options);
	}
	exports.makeRe = makeRe$1;
	function convertPatternsToRe(patterns, options) {
		return patterns.map((pattern$1) => makeRe$1(pattern$1, options));
	}
	exports.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
		return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	exports.matchAny = matchAny;
	/**
	* This package only works with forward slashes as a path separator.
	* Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	*/
	function removeDuplicateSlashes(pattern$1) {
		return pattern$1.replace(DOUBLE_SLASH_RE, "/");
	}
	exports.removeDuplicateSlashes = removeDuplicateSlashes;
} });

//#endregion
//#region ../../node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js
var require_merge2 = __commonJS({ "../../node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js"(exports, module) {
	const Stream = __require("stream");
	const PassThrough = Stream.PassThrough;
	const slice = Array.prototype.slice;
	module.exports = merge2$1;
	function merge2$1() {
		const streamsQueue = [];
		const args = slice.call(arguments);
		let merging = false;
		let options = args[args.length - 1];
		if (options && !Array.isArray(options) && options.pipe == null) args.pop();
		else options = {};
		const doEnd = options.end !== false;
		const doPipeError = options.pipeError === true;
		if (options.objectMode == null) options.objectMode = true;
		if (options.highWaterMark == null) options.highWaterMark = 64 * 1024;
		const mergedStream = PassThrough(options);
		function addStream() {
			for (let i = 0, len = arguments.length; i < len; i++) streamsQueue.push(pauseStreams(arguments[i], options));
			mergeStream();
			return this;
		}
		function mergeStream() {
			if (merging) return;
			merging = true;
			let streams = streamsQueue.shift();
			if (!streams) {
				process.nextTick(endStream);
				return;
			}
			if (!Array.isArray(streams)) streams = [streams];
			let pipesCount = streams.length + 1;
			function next() {
				if (--pipesCount > 0) return;
				merging = false;
				mergeStream();
			}
			function pipe(stream$1) {
				function onend() {
					stream$1.removeListener("merge2UnpipeEnd", onend);
					stream$1.removeListener("end", onend);
					if (doPipeError) stream$1.removeListener("error", onerror);
					next();
				}
				function onerror(err) {
					mergedStream.emit("error", err);
				}
				if (stream$1._readableState.endEmitted) return next();
				stream$1.on("merge2UnpipeEnd", onend);
				stream$1.on("end", onend);
				if (doPipeError) stream$1.on("error", onerror);
				stream$1.pipe(mergedStream, { end: false });
				stream$1.resume();
			}
			for (let i = 0; i < streams.length; i++) pipe(streams[i]);
			next();
		}
		function endStream() {
			merging = false;
			mergedStream.emit("queueDrain");
			if (doEnd) mergedStream.end();
		}
		mergedStream.setMaxListeners(0);
		mergedStream.add = addStream;
		mergedStream.on("unpipe", function(stream$1) {
			stream$1.emit("merge2UnpipeEnd");
		});
		if (args.length) addStream.apply(null, args);
		return mergedStream;
	}
	function pauseStreams(streams, options) {
		if (!Array.isArray(streams)) {
			if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options));
			if (!streams._readableState || !streams.pause || !streams.pipe) throw new Error("Only readable stream can be merged.");
			streams.pause();
		} else for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options);
		return streams;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/stream.js
var require_stream$3 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/stream.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	const merge2 = require_merge2();
	function merge(streams) {
		const mergedStream = merge2(streams);
		streams.forEach((stream$1) => {
			stream$1.once("error", (error) => mergedStream.emit("error", error));
		});
		mergedStream.once("close", () => propagateCloseEventToSources(streams));
		mergedStream.once("end", () => propagateCloseEventToSources(streams));
		return mergedStream;
	}
	exports.merge = merge;
	function propagateCloseEventToSources(streams) {
		streams.forEach((stream$1) => stream$1.emit("close"));
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/string.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmpty = exports.isString = void 0;
	function isString$1(input) {
		return typeof input === "string";
	}
	exports.isString = isString$1;
	function isEmpty(input) {
		return input === "";
	}
	exports.isEmpty = isEmpty;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/index.js
var require_utils$2 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
	const array = require_array();
	exports.array = array;
	const errno = require_errno();
	exports.errno = errno;
	const fs$6 = require_fs$3();
	exports.fs = fs$6;
	const path$6 = require_path();
	exports.path = path$6;
	const pattern = require_pattern();
	exports.pattern = pattern;
	const stream = require_stream$3();
	exports.stream = stream;
	const string = require_string();
	exports.string = string;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/managers/tasks.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
	const utils$10 = require_utils$2();
	function generate$1(input, settings) {
		const patterns = processPatterns(input, settings);
		const ignore = processPatterns(settings.ignore, settings);
		const positivePatterns = getPositivePatterns(patterns);
		const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
		const staticPatterns = positivePatterns.filter((pattern$1) => utils$10.pattern.isStaticPattern(pattern$1, settings));
		const dynamicPatterns = positivePatterns.filter((pattern$1) => utils$10.pattern.isDynamicPattern(pattern$1, settings));
		const staticTasks = convertPatternsToTasks(
			staticPatterns,
			negativePatterns,
			/* dynamic */
			false
);
		const dynamicTasks = convertPatternsToTasks(
			dynamicPatterns,
			negativePatterns,
			/* dynamic */
			true
);
		return staticTasks.concat(dynamicTasks);
	}
	exports.generate = generate$1;
	function processPatterns(input, settings) {
		let patterns = input;
		/**
		* The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
		* and some problems with the micromatch package (see fast-glob issues: #365, #394).
		*
		* To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
		* in matching in the case of a large set of patterns after expansion.
		*/
		if (settings.braceExpansion) patterns = utils$10.pattern.expandPatternsWithBraceExpansion(patterns);
		/**
		* If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
		* at any nesting level.
		*
		* We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
		* the pattern in the filter before creating a regular expression. There is no need to change the patterns
		* in the application. Only on the input.
		*/
		if (settings.baseNameMatch) patterns = patterns.map((pattern$1) => pattern$1.includes("/") ? pattern$1 : `**/${pattern$1}`);
		/**
		* This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
		*/
		return patterns.map((pattern$1) => utils$10.pattern.removeDuplicateSlashes(pattern$1));
	}
	/**
	* Returns tasks grouped by basic pattern directories.
	*
	* Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	* This is necessary because directory traversal starts at the base directory and goes deeper.
	*/
	function convertPatternsToTasks(positive, negative, dynamic) {
		const tasks = [];
		const patternsOutsideCurrentDirectory = utils$10.pattern.getPatternsOutsideCurrentDirectory(positive);
		const patternsInsideCurrentDirectory = utils$10.pattern.getPatternsInsideCurrentDirectory(positive);
		const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
		const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
		tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
		if ("." in insideCurrentDirectoryGroup) tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
		else tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
		return tasks;
	}
	exports.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
		return utils$10.pattern.getPositivePatterns(patterns);
	}
	exports.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
		const negative = utils$10.pattern.getNegativePatterns(patterns).concat(ignore);
		const positive = negative.map(utils$10.pattern.convertToPositivePattern);
		return positive;
	}
	exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
		const group = {};
		return patterns.reduce((collection, pattern$1) => {
			const base = utils$10.pattern.getBaseDirectory(pattern$1);
			if (base in collection) collection[base].push(pattern$1);
			else collection[base] = [pattern$1];
			return collection;
		}, group);
	}
	exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
		return Object.keys(positive).map((base) => {
			return convertPatternGroupToTask(base, positive[base], negative, dynamic);
		});
	}
	exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
		return {
			dynamic,
			positive,
			negative,
			base,
			patterns: [].concat(positive, negative.map(utils$10.pattern.convertToNegativePattern))
		};
	}
	exports.convertPatternGroupToTask = convertPatternGroupToTask;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async$5 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read$3(path$12, settings, callback) {
		settings.fs.lstat(path$12, (lstatError, lstat$1) => {
			if (lstatError !== null) {
				callFailureCallback$2(callback, lstatError);
				return;
			}
			if (!lstat$1.isSymbolicLink() || !settings.followSymbolicLink) {
				callSuccessCallback$2(callback, lstat$1);
				return;
			}
			settings.fs.stat(path$12, (statError, stat$2) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						callFailureCallback$2(callback, statError);
						return;
					}
					callSuccessCallback$2(callback, lstat$1);
					return;
				}
				if (settings.markSymbolicLink) stat$2.isSymbolicLink = () => true;
				callSuccessCallback$2(callback, stat$2);
			});
		});
	}
	exports.read = read$3;
	function callFailureCallback$2(callback, error) {
		callback(error);
	}
	function callSuccessCallback$2(callback, result) {
		callback(null, result);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync$5 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read$2(path$12, settings) {
		const lstat$1 = settings.fs.lstatSync(path$12);
		if (!lstat$1.isSymbolicLink() || !settings.followSymbolicLink) return lstat$1;
		try {
			const stat$2 = settings.fs.statSync(path$12);
			if (settings.markSymbolicLink) stat$2.isSymbolicLink = () => true;
			return stat$2;
		} catch (error) {
			if (!settings.throwErrorOnBrokenSymbolicLink) return lstat$1;
			throw error;
		}
	}
	exports.read = read$2;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs$5 = __require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$5.lstat,
		stat: fs$5.stat,
		lstatSync: fs$5.lstatSync,
		statSync: fs$5.statSync
	};
	function createFileSystemAdapter$1(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js
var require_settings$3 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fs$4 = require_fs$2();
	var Settings$3 = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
			this.fs = fs$4.createFileSystemAdapter(this._options.fs);
			this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings$3;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js
var require_out$3 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.statSync = exports.stat = exports.Settings = void 0;
	const async$1 = require_async$5();
	const sync$1 = require_sync$5();
	const settings_1$3 = require_settings$3();
	exports.Settings = settings_1$3.default;
	function stat$1(path$12, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async$1.read(path$12, getSettings$2(), optionsOrSettingsOrCallback);
			return;
		}
		async$1.read(path$12, getSettings$2(optionsOrSettingsOrCallback), callback);
	}
	exports.stat = stat$1;
	function statSync(path$12, optionsOrSettings) {
		const settings = getSettings$2(optionsOrSettings);
		return sync$1.read(path$12, settings);
	}
	exports.statSync = statSync;
	function getSettings$2(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1$3.default) return settingsOrOptions;
		return new settings_1$3.default(settingsOrOptions);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({ "../../node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js"(exports, module) {
	/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	let promise;
	module.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
		throw err;
	}, 0));
} });

//#endregion
//#region ../../node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({ "../../node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js"(exports, module) {
	/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	module.exports = runParallel;
	const queueMicrotask$1 = require_queue_microtask();
	function runParallel(tasks, cb) {
		let results, pending, keys$1;
		let isSync = true;
		if (Array.isArray(tasks)) {
			results = [];
			pending = tasks.length;
		} else {
			keys$1 = Object.keys(tasks);
			results = {};
			pending = keys$1.length;
		}
		function done(err) {
			function end() {
				if (cb) cb(err, results);
				cb = null;
			}
			if (isSync) queueMicrotask$1(end);
			else end();
		}
		function each(i, err, result) {
			results[i] = result;
			if (--pending === 0 || err) done(err);
		}
		if (!pending) done(null);
		else if (keys$1) keys$1.forEach(function(key) {
			tasks[key](function(err, result) {
				each(key, err, result);
			});
		});
		else tasks.forEach(function(task, i) {
			task(function(err, result) {
				each(i, err, result);
			});
		});
		isSync = false;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
	const NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
	if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
	const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
	const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
	const SUPPORTED_MAJOR_VERSION = 10;
	const SUPPORTED_MINOR_VERSION = 10;
	const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
	const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
	/**
	* IS `true` for Node.js 10.10 and greater.
	*/
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fs = void 0;
	const fs$3 = require_fs$1();
	exports.fs = fs$3;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = void 0;
	function joinPathSegments$1(a, b, separator) {
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async$4 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	const fsStat$5 = require_out$3();
	const rpl = require_run_parallel();
	const constants_1$1 = require_constants$1();
	const utils$9 = require_utils$1();
	const common$4 = require_common$1();
	function read$1(directory, settings, callback) {
		if (!settings.stats && constants_1$1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
			readdirWithFileTypes$1(directory, settings, callback);
			return;
		}
		readdir$2(directory, settings, callback);
	}
	exports.read = read$1;
	function readdirWithFileTypes$1(directory, settings, callback) {
		settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
			if (readdirError !== null) {
				callFailureCallback$1(callback, readdirError);
				return;
			}
			const entries = dirents.map((dirent) => ({
				dirent,
				name: dirent.name,
				path: common$4.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			}));
			if (!settings.followSymbolicLinks) {
				callSuccessCallback$1(callback, entries);
				return;
			}
			const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
			rpl(tasks, (rplError, rplEntries) => {
				if (rplError !== null) {
					callFailureCallback$1(callback, rplError);
					return;
				}
				callSuccessCallback$1(callback, rplEntries);
			});
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes$1;
	function makeRplTaskEntry(entry, settings) {
		return (done) => {
			if (!entry.dirent.isSymbolicLink()) {
				done(null, entry);
				return;
			}
			settings.fs.stat(entry.path, (statError, stats) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						done(statError);
						return;
					}
					done(null, entry);
					return;
				}
				entry.dirent = utils$9.fs.createDirentFromStats(entry.name, stats);
				done(null, entry);
			});
		};
	}
	function readdir$2(directory, settings, callback) {
		settings.fs.readdir(directory, (readdirError, names) => {
			if (readdirError !== null) {
				callFailureCallback$1(callback, readdirError);
				return;
			}
			const tasks = names.map((name) => {
				const path$12 = common$4.joinPathSegments(directory, name, settings.pathSegmentSeparator);
				return (done) => {
					fsStat$5.stat(path$12, settings.fsStatSettings, (error, stats) => {
						if (error !== null) {
							done(error);
							return;
						}
						const entry = {
							name,
							path: path$12,
							dirent: utils$9.fs.createDirentFromStats(name, stats)
						};
						if (settings.stats) entry.stats = stats;
						done(null, entry);
					});
				};
			});
			rpl(tasks, (rplError, entries) => {
				if (rplError !== null) {
					callFailureCallback$1(callback, rplError);
					return;
				}
				callSuccessCallback$1(callback, entries);
			});
		});
	}
	exports.readdir = readdir$2;
	function callFailureCallback$1(callback, error) {
		callback(error);
	}
	function callSuccessCallback$1(callback, result) {
		callback(null, result);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync$4 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	const fsStat$4 = require_out$3();
	const constants_1 = require_constants$1();
	const utils$8 = require_utils$1();
	const common$3 = require_common$1();
	function read(directory, settings) {
		if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) return readdirWithFileTypes(directory, settings);
		return readdir$1(directory, settings);
	}
	exports.read = read;
	function readdirWithFileTypes(directory, settings) {
		const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
		return dirents.map((dirent) => {
			const entry = {
				dirent,
				name: dirent.name,
				path: common$3.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			};
			if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) try {
				const stats = settings.fs.statSync(entry.path);
				entry.dirent = utils$8.fs.createDirentFromStats(entry.name, stats);
			} catch (error) {
				if (settings.throwErrorOnBrokenSymbolicLink) throw error;
			}
			return entry;
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes;
	function readdir$1(directory, settings) {
		const names = settings.fs.readdirSync(directory);
		return names.map((name) => {
			const entryPath = common$3.joinPathSegments(directory, name, settings.pathSegmentSeparator);
			const stats = fsStat$4.statSync(entryPath, settings.fsStatSettings);
			const entry = {
				name,
				path: entryPath,
				dirent: utils$8.fs.createDirentFromStats(name, stats)
			};
			if (settings.stats) entry.stats = stats;
			return entry;
		});
	}
	exports.readdir = readdir$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs$2 = __require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$2.lstat,
		stat: fs$2.stat,
		lstatSync: fs$2.lstatSync,
		statSync: fs$2.statSync,
		readdir: fs$2.readdir,
		readdirSync: fs$2.readdirSync
	};
	function createFileSystemAdapter(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$5 = __require("path");
	const fsStat$3 = require_out$3();
	const fs$1 = require_fs();
	var Settings$2 = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
			this.fs = fs$1.createFileSystemAdapter(this._options.fs);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$5.sep);
			this.stats = this._getValue(this._options.stats, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
			this.fsStatSettings = new fsStat$3.Settings({
				followSymbolicLink: this.followSymbolicLinks,
				fs: this.fs,
				throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings$2;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js
var require_out$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.scandirSync = exports.scandir = void 0;
	const async = require_async$4();
	const sync = require_sync$4();
	const settings_1$2 = require_settings$2();
	exports.Settings = settings_1$2.default;
	function scandir(path$12, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async.read(path$12, getSettings$1(), optionsOrSettingsOrCallback);
			return;
		}
		async.read(path$12, getSettings$1(optionsOrSettingsOrCallback), callback);
	}
	exports.scandir = scandir;
	function scandirSync(path$12, optionsOrSettings) {
		const settings = getSettings$1(optionsOrSettings);
		return sync.read(path$12, settings);
	}
	exports.scandirSync = scandirSync;
	function getSettings$1(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1$2.default) return settingsOrOptions;
		return new settings_1$2.default(settingsOrOptions);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/reusify@1.0.4/node_modules/reusify/reusify.js
var require_reusify = __commonJS({ "../../node_modules/.pnpm/reusify@1.0.4/node_modules/reusify/reusify.js"(exports, module) {
	function reusify$1(Constructor) {
		var head = new Constructor();
		var tail = head;
		function get() {
			var current = head;
			if (current.next) head = current.next;
			else {
				head = new Constructor();
				tail = head;
			}
			current.next = null;
			return current;
		}
		function release(obj) {
			tail.next = obj;
			tail = obj;
		}
		return {
			get,
			release
		};
	}
	module.exports = reusify$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/fastq@1.17.1/node_modules/fastq/queue.js
var require_queue = __commonJS({ "../../node_modules/.pnpm/fastq@1.17.1/node_modules/fastq/queue.js"(exports, module) {
	var reusify = require_reusify();
	function fastqueue(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		if (!(_concurrency >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
		var cache = reusify(Task);
		var queueHead = null;
		var queueTail = null;
		var _running = 0;
		var errorHandler = null;
		var self = {
			push,
			drain: noop$1,
			saturated: noop$1,
			pause,
			paused: false,
			get concurrency() {
				return _concurrency;
			},
			set concurrency(value) {
				if (!(value >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
				_concurrency = value;
				if (self.paused) return;
				for (; queueHead && _running < _concurrency;) {
					_running++;
					release();
				}
			},
			running,
			resume,
			idle,
			length,
			getQueue,
			unshift,
			empty: noop$1,
			kill,
			killAndDrain,
			error
		};
		return self;
		function running() {
			return _running;
		}
		function pause() {
			self.paused = true;
		}
		function length() {
			var current = queueHead;
			var counter = 0;
			while (current) {
				current = current.next;
				counter++;
			}
			return counter;
		}
		function getQueue() {
			var current = queueHead;
			var tasks = [];
			while (current) {
				tasks.push(current.value);
				current = current.next;
			}
			return tasks;
		}
		function resume() {
			if (!self.paused) return;
			self.paused = false;
			if (queueHead === null) {
				_running++;
				release();
				return;
			}
			for (; queueHead && _running < _concurrency;) {
				_running++;
				release();
			}
		}
		function idle() {
			return _running === 0 && self.length() === 0;
		}
		function push(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop$1;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self.paused) if (queueTail) {
				queueTail.next = current;
				queueTail = current;
			} else {
				queueHead = current;
				queueTail = current;
				self.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function unshift(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop$1;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self.paused) if (queueHead) {
				current.next = queueHead;
				queueHead = current;
			} else {
				queueHead = current;
				queueTail = current;
				self.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function release(holder) {
			if (holder) cache.release(holder);
			var next = queueHead;
			if (next && _running <= _concurrency) if (!self.paused) {
				if (queueTail === queueHead) queueTail = null;
				queueHead = next.next;
				next.next = null;
				worker.call(context, next.value, next.worked);
				if (queueTail === null) self.empty();
			} else _running--;
			else if (--_running === 0) self.drain();
		}
		function kill() {
			queueHead = null;
			queueTail = null;
			self.drain = noop$1;
		}
		function killAndDrain() {
			queueHead = null;
			queueTail = null;
			self.drain();
			self.drain = noop$1;
		}
		function error(handler) {
			errorHandler = handler;
		}
	}
	function noop$1() {}
	function Task() {
		this.value = null;
		this.callback = noop$1;
		this.next = null;
		this.release = noop$1;
		this.context = null;
		this.errorHandler = null;
		var self = this;
		this.worked = function worked(err, result) {
			var callback = self.callback;
			var errorHandler = self.errorHandler;
			var val = self.value;
			self.value = null;
			self.callback = noop$1;
			if (self.errorHandler) errorHandler(err, val);
			callback.call(self.context, err, result);
			self.release(self);
		};
	}
	function queueAsPromised(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		function asyncWrapper(arg, cb) {
			worker.call(this, arg).then(function(res) {
				cb(null, res);
			}, cb);
		}
		var queue = fastqueue(context, asyncWrapper, _concurrency);
		var pushCb = queue.push;
		var unshiftCb = queue.unshift;
		queue.push = push;
		queue.unshift = unshift;
		queue.drained = drained;
		return queue;
		function push(value) {
			var p$1 = new Promise(function(resolve$2, reject) {
				pushCb(value, function(err, result) {
					if (err) {
						reject(err);
						return;
					}
					resolve$2(result);
				});
			});
			p$1.catch(noop$1);
			return p$1;
		}
		function unshift(value) {
			var p$1 = new Promise(function(resolve$2, reject) {
				unshiftCb(value, function(err, result) {
					if (err) {
						reject(err);
						return;
					}
					resolve$2(result);
				});
			});
			p$1.catch(noop$1);
			return p$1;
		}
		function drained() {
			if (queue.idle()) return new Promise(function(resolve$2) {
				resolve$2();
			});
			var previousDrain = queue.drain;
			var p$1 = new Promise(function(resolve$2) {
				queue.drain = function() {
					previousDrain();
					resolve$2();
				};
			});
			return p$1;
		}
	}
	module.exports = fastqueue;
	module.exports.promise = queueAsPromised;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = exports.replacePathSegmentSeparator = exports.isAppliedFilter = exports.isFatalError = void 0;
	function isFatalError(settings, error) {
		if (settings.errorFilter === null) return true;
		return !settings.errorFilter(error);
	}
	exports.isFatalError = isFatalError;
	function isAppliedFilter(filter$1, value) {
		return filter$1 === null || filter$1(value);
	}
	exports.isAppliedFilter = isAppliedFilter;
	function replacePathSegmentSeparator(filepath, separator) {
		return filepath.split(/[/\\]/).join(separator);
	}
	exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
	function joinPathSegments(a, b, separator) {
		if (a === "") return b;
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const common$2 = require_common();
	var Reader$1 = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._root = common$2.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
		}
	};
	exports.default = Reader$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async$3 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const events_1 = __require("events");
	const fsScandir$2 = require_out$2();
	const fastq = require_queue();
	const common$1 = require_common();
	const reader_1$4 = require_reader$1();
	var AsyncReader = class extends reader_1$4.default {
		constructor(_root, _settings) {
			super(_root, _settings);
			this._settings = _settings;
			this._scandir = fsScandir$2.scandir;
			this._emitter = new events_1.EventEmitter();
			this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
			this._isFatalError = false;
			this._isDestroyed = false;
			this._queue.drain = () => {
				if (!this._isFatalError) this._emitter.emit("end");
			};
		}
		read() {
			this._isFatalError = false;
			this._isDestroyed = false;
			setImmediate(() => {
				this._pushToQueue(this._root, this._settings.basePath);
			});
			return this._emitter;
		}
		get isDestroyed() {
			return this._isDestroyed;
		}
		destroy() {
			if (this._isDestroyed) throw new Error("The reader is already destroyed");
			this._isDestroyed = true;
			this._queue.killAndDrain();
		}
		onEntry(callback) {
			this._emitter.on("entry", callback);
		}
		onError(callback) {
			this._emitter.once("error", callback);
		}
		onEnd(callback) {
			this._emitter.once("end", callback);
		}
		_pushToQueue(directory, base) {
			const queueItem = {
				directory,
				base
			};
			this._queue.push(queueItem, (error) => {
				if (error !== null) this._handleError(error);
			});
		}
		_worker(item, done) {
			this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
				if (error !== null) {
					done(error, void 0);
					return;
				}
				for (const entry of entries) this._handleEntry(entry, item.base);
				done(null, void 0);
			});
		}
		_handleError(error) {
			if (this._isDestroyed || !common$1.isFatalError(this._settings, error)) return;
			this._isFatalError = true;
			this._isDestroyed = true;
			this._emitter.emit("error", error);
		}
		_handleEntry(entry, base) {
			if (this._isDestroyed || this._isFatalError) return;
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common$1.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common$1.isAppliedFilter(this._settings.entryFilter, entry)) this._emitEntry(entry);
			if (entry.dirent.isDirectory() && common$1.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_emitEntry(entry) {
			this._emitter.emit("entry", entry);
		}
	};
	exports.default = AsyncReader;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const async_1$4 = require_async$3();
	var AsyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1$4.default(this._root, this._settings);
			this._storage = [];
		}
		read(callback) {
			this._reader.onError((error) => {
				callFailureCallback(callback, error);
			});
			this._reader.onEntry((entry) => {
				this._storage.push(entry);
			});
			this._reader.onEnd(() => {
				callSuccessCallback(callback, this._storage);
			});
			this._reader.read();
		}
	};
	exports.default = AsyncProvider;
	function callFailureCallback(callback, error) {
		callback(error);
	}
	function callSuccessCallback(callback, entries) {
		callback(null, entries);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1$5 = __require("stream");
	const async_1$3 = require_async$3();
	var StreamProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1$3.default(this._root, this._settings);
			this._stream = new stream_1$5.Readable({
				objectMode: true,
				read: () => {},
				destroy: () => {
					if (!this._reader.isDestroyed) this._reader.destroy();
				}
			});
		}
		read() {
			this._reader.onError((error) => {
				this._stream.emit("error", error);
			});
			this._reader.onEntry((entry) => {
				this._stream.push(entry);
			});
			this._reader.onEnd(() => {
				this._stream.push(null);
			});
			this._reader.read();
			return this._stream;
		}
	};
	exports.default = StreamProvider;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync$3 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsScandir$1 = require_out$2();
	const common = require_common();
	const reader_1$3 = require_reader$1();
	var SyncReader = class extends reader_1$3.default {
		constructor() {
			super(...arguments);
			this._scandir = fsScandir$1.scandirSync;
			this._storage = [];
			this._queue = new Set();
		}
		read() {
			this._pushToQueue(this._root, this._settings.basePath);
			this._handleQueue();
			return this._storage;
		}
		_pushToQueue(directory, base) {
			this._queue.add({
				directory,
				base
			});
		}
		_handleQueue() {
			for (const item of this._queue.values()) this._handleDirectory(item.directory, item.base);
		}
		_handleDirectory(directory, base) {
			try {
				const entries = this._scandir(directory, this._settings.fsScandirSettings);
				for (const entry of entries) this._handleEntry(entry, base);
			} catch (error) {
				this._handleError(error);
			}
		}
		_handleError(error) {
			if (!common.isFatalError(this._settings, error)) return;
			throw error;
		}
		_handleEntry(entry, base) {
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common.isAppliedFilter(this._settings.entryFilter, entry)) this._pushToStorage(entry);
			if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_pushToStorage(entry) {
			this._storage.push(entry);
		}
	};
	exports.default = SyncReader;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync$2 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const sync_1$3 = require_sync$3();
	var SyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new sync_1$3.default(this._root, this._settings);
		}
		read() {
			return this._reader.read();
		}
	};
	exports.default = SyncProvider;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js
var require_settings$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$4 = __require("path");
	const fsScandir = require_out$2();
	var Settings$1 = class {
		constructor(_options = {}) {
			this._options = _options;
			this.basePath = this._getValue(this._options.basePath, void 0);
			this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
			this.deepFilter = this._getValue(this._options.deepFilter, null);
			this.entryFilter = this._getValue(this._options.entryFilter, null);
			this.errorFilter = this._getValue(this._options.errorFilter, null);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$4.sep);
			this.fsScandirSettings = new fsScandir.Settings({
				followSymbolicLinks: this._options.followSymbolicLinks,
				fs: this._options.fs,
				pathSegmentSeparator: this._options.pathSegmentSeparator,
				stats: this._options.stats,
				throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js
var require_out$1 = __commonJS({ "../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.walkStream = exports.walkSync = exports.walk = void 0;
	const async_1$2 = require_async$2();
	const stream_1$4 = require_stream$2();
	const sync_1$2 = require_sync$2();
	const settings_1$1 = require_settings$1();
	exports.Settings = settings_1$1.default;
	function walk(directory, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			new async_1$2.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
			return;
		}
		new async_1$2.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
	}
	exports.walk = walk;
	function walkSync(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		const provider = new sync_1$2.default(directory, settings);
		return provider.read();
	}
	exports.walkSync = walkSync;
	function walkStream(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		const provider = new stream_1$4.default(directory, settings);
		return provider.read();
	}
	exports.walkStream = walkStream;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1$1.default) return settingsOrOptions;
		return new settings_1$1.default(settingsOrOptions);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/reader.js
var require_reader = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/reader.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$3 = __require("path");
	const fsStat$2 = require_out$3();
	const utils$7 = require_utils$2();
	var Reader = class {
		constructor(_settings) {
			this._settings = _settings;
			this._fsStatSettings = new fsStat$2.Settings({
				followSymbolicLink: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
			});
		}
		_getFullEntryPath(filepath) {
			return path$3.resolve(this._settings.cwd, filepath);
		}
		_makeEntry(stats, pattern$1) {
			const entry = {
				name: pattern$1,
				path: pattern$1,
				dirent: utils$7.fs.createDirentFromStats(pattern$1, stats)
			};
			if (this._settings.stats) entry.stats = stats;
			return entry;
		}
		_isFatalError(error) {
			return !utils$7.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
		}
	};
	exports.default = Reader;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/stream.js
var require_stream$1 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/stream.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1$3 = __require("stream");
	const fsStat$1 = require_out$3();
	const fsWalk$2 = require_out$1();
	const reader_1$2 = require_reader();
	var ReaderStream = class extends reader_1$2.default {
		constructor() {
			super(...arguments);
			this._walkStream = fsWalk$2.walkStream;
			this._stat = fsStat$1.stat;
		}
		dynamic(root, options) {
			return this._walkStream(root, options);
		}
		static(patterns, options) {
			const filepaths = patterns.map(this._getFullEntryPath, this);
			const stream$1 = new stream_1$3.PassThrough({ objectMode: true });
			stream$1._write = (index, _enc, done) => {
				return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
					if (entry !== null && options.entryFilter(entry)) stream$1.push(entry);
					if (index === filepaths.length - 1) stream$1.end();
					done();
				}).catch(done);
			};
			for (let i = 0; i < filepaths.length; i++) stream$1.write(i);
			return stream$1;
		}
		_getEntry(filepath, pattern$1, options) {
			return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern$1)).catch((error) => {
				if (options.errorFilter(error)) return null;
				throw error;
			});
		}
		_getStat(filepath) {
			return new Promise((resolve$2, reject) => {
				this._stat(filepath, this._fsStatSettings, (error, stats) => {
					return error === null ? resolve$2(stats) : reject(error);
				});
			});
		}
	};
	exports.default = ReaderStream;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/async.js
var require_async$1 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsWalk$1 = require_out$1();
	const reader_1$1 = require_reader();
	const stream_1$2 = require_stream$1();
	var ReaderAsync = class extends reader_1$1.default {
		constructor() {
			super(...arguments);
			this._walkAsync = fsWalk$1.walk;
			this._readerStream = new stream_1$2.default(this._settings);
		}
		dynamic(root, options) {
			return new Promise((resolve$2, reject) => {
				this._walkAsync(root, options, (error, entries) => {
					if (error === null) resolve$2(entries);
					else reject(error);
				});
			});
		}
		async static(patterns, options) {
			const entries = [];
			const stream$1 = this._readerStream.static(patterns, options);
			return new Promise((resolve$2, reject) => {
				stream$1.once("error", reject);
				stream$1.on("data", (entry) => entries.push(entry));
				stream$1.once("end", () => resolve$2(entries));
			});
		}
	};
	exports.default = ReaderAsync;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/matcher.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils$6 = require_utils$2();
	var Matcher = class {
		constructor(_patterns, _settings, _micromatchOptions) {
			this._patterns = _patterns;
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this._storage = [];
			this._fillStorage();
		}
		_fillStorage() {
			for (const pattern$1 of this._patterns) {
				const segments = this._getPatternSegments(pattern$1);
				const sections = this._splitSegmentsIntoSections(segments);
				this._storage.push({
					complete: sections.length <= 1,
					pattern: pattern$1,
					segments,
					sections
				});
			}
		}
		_getPatternSegments(pattern$1) {
			const parts = utils$6.pattern.getPatternParts(pattern$1, this._micromatchOptions);
			return parts.map((part) => {
				const dynamic = utils$6.pattern.isDynamicPattern(part, this._settings);
				if (!dynamic) return {
					dynamic: false,
					pattern: part
				};
				return {
					dynamic: true,
					pattern: part,
					patternRe: utils$6.pattern.makeRe(part, this._micromatchOptions)
				};
			});
		}
		_splitSegmentsIntoSections(segments) {
			return utils$6.array.splitWhen(segments, (segment) => segment.dynamic && utils$6.pattern.hasGlobStar(segment.pattern));
		}
	};
	exports.default = Matcher;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/partial.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const matcher_1 = require_matcher();
	var PartialMatcher = class extends matcher_1.default {
		match(filepath) {
			const parts = filepath.split("/");
			const levels = parts.length;
			const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
			for (const pattern$1 of patterns) {
				const section = pattern$1.sections[0];
				/**
				* In this case, the pattern has a globstar and we must read all directories unconditionally,
				* but only if the level has reached the end of the first group.
				*
				* fixtures/{a,b}/**
				*  ^ true/false  ^ always true
				*/
				if (!pattern$1.complete && levels > section.length) return true;
				const match$1 = parts.every((part, index) => {
					const segment = pattern$1.segments[index];
					if (segment.dynamic && segment.patternRe.test(part)) return true;
					if (!segment.dynamic && segment.pattern === part) return true;
					return false;
				});
				if (match$1) return true;
			}
			return false;
		}
	};
	exports.default = PartialMatcher;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/deep.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils$5 = require_utils$2();
	const partial_1 = require_partial();
	var DeepFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
		}
		getFilter(basePath, positive, negative) {
			const matcher = this._getMatcher(positive);
			const negativeRe = this._getNegativePatternsRe(negative);
			return (entry) => this._filter(basePath, entry, matcher, negativeRe);
		}
		_getMatcher(patterns) {
			return new partial_1.default(patterns, this._settings, this._micromatchOptions);
		}
		_getNegativePatternsRe(patterns) {
			const affectDepthOfReadingPatterns = patterns.filter(utils$5.pattern.isAffectDepthOfReadingPattern);
			return utils$5.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
		}
		_filter(basePath, entry, matcher, negativeRe) {
			if (this._isSkippedByDeep(basePath, entry.path)) return false;
			if (this._isSkippedSymbolicLink(entry)) return false;
			const filepath = utils$5.path.removeLeadingDotSegment(entry.path);
			if (this._isSkippedByPositivePatterns(filepath, matcher)) return false;
			return this._isSkippedByNegativePatterns(filepath, negativeRe);
		}
		_isSkippedByDeep(basePath, entryPath) {
			/**
			* Avoid unnecessary depth calculations when it doesn't matter.
			*/
			if (this._settings.deep === Infinity) return false;
			return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
		}
		_getEntryLevel(basePath, entryPath) {
			const entryPathDepth = entryPath.split("/").length;
			if (basePath === "") return entryPathDepth;
			const basePathDepth = basePath.split("/").length;
			return entryPathDepth - basePathDepth;
		}
		_isSkippedSymbolicLink(entry) {
			return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
		}
		_isSkippedByPositivePatterns(entryPath, matcher) {
			return !this._settings.baseNameMatch && !matcher.match(entryPath);
		}
		_isSkippedByNegativePatterns(entryPath, patternsRe) {
			return !utils$5.pattern.matchAny(entryPath, patternsRe);
		}
	};
	exports.default = DeepFilter;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/entry.js
var require_entry$1 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/entry.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils$4 = require_utils$2();
	var EntryFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this.index = new Map();
		}
		getFilter(positive, negative) {
			const positiveRe = utils$4.pattern.convertPatternsToRe(positive, this._micromatchOptions);
			const negativeRe = utils$4.pattern.convertPatternsToRe(negative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }));
			return (entry) => this._filter(entry, positiveRe, negativeRe);
		}
		_filter(entry, positiveRe, negativeRe) {
			const filepath = utils$4.path.removeLeadingDotSegment(entry.path);
			if (this._settings.unique && this._isDuplicateEntry(filepath)) return false;
			if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) return false;
			if (this._isSkippedByAbsoluteNegativePatterns(filepath, negativeRe)) return false;
			const isDirectory = entry.dirent.isDirectory();
			const isMatched = this._isMatchToPatterns(filepath, positiveRe, isDirectory) && !this._isMatchToPatterns(filepath, negativeRe, isDirectory);
			if (this._settings.unique && isMatched) this._createIndexRecord(filepath);
			return isMatched;
		}
		_isDuplicateEntry(filepath) {
			return this.index.has(filepath);
		}
		_createIndexRecord(filepath) {
			this.index.set(filepath, void 0);
		}
		_onlyFileFilter(entry) {
			return this._settings.onlyFiles && !entry.dirent.isFile();
		}
		_onlyDirectoryFilter(entry) {
			return this._settings.onlyDirectories && !entry.dirent.isDirectory();
		}
		_isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
			if (!this._settings.absolute) return false;
			const fullpath = utils$4.path.makeAbsolute(this._settings.cwd, entryPath);
			return utils$4.pattern.matchAny(fullpath, patternsRe);
		}
		_isMatchToPatterns(filepath, patternsRe, isDirectory) {
			const isMatched = utils$4.pattern.matchAny(filepath, patternsRe);
			if (!isMatched && isDirectory) return utils$4.pattern.matchAny(filepath + "/", patternsRe);
			return isMatched;
		}
	};
	exports.default = EntryFilter;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/error.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils$3 = require_utils$2();
	var ErrorFilter = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getFilter() {
			return (error) => this._isNonFatalError(error);
		}
		_isNonFatalError(error) {
			return utils$3.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
		}
	};
	exports.default = ErrorFilter;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/transformers/entry.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils$2 = require_utils$2();
	var EntryTransformer = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getTransformer() {
			return (entry) => this._transform(entry);
		}
		_transform(entry) {
			let filepath = entry.path;
			if (this._settings.absolute) {
				filepath = utils$2.path.makeAbsolute(this._settings.cwd, filepath);
				filepath = utils$2.path.unixify(filepath);
			}
			if (this._settings.markDirectories && entry.dirent.isDirectory()) filepath += "/";
			if (!this._settings.objectMode) return filepath;
			return Object.assign(Object.assign({}, entry), { path: filepath });
		}
	};
	exports.default = EntryTransformer;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/provider.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$2 = __require("path");
	const deep_1 = require_deep();
	const entry_1 = require_entry$1();
	const error_1 = require_error();
	const entry_2 = require_entry();
	var Provider = class {
		constructor(_settings) {
			this._settings = _settings;
			this.errorFilter = new error_1.default(this._settings);
			this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
			this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
			this.entryTransformer = new entry_2.default(this._settings);
		}
		_getRootDirectory(task) {
			return path$2.resolve(this._settings.cwd, task.base);
		}
		_getReaderOptions(task) {
			const basePath = task.base === "." ? "" : task.base;
			return {
				basePath,
				pathSegmentSeparator: "/",
				concurrency: this._settings.concurrency,
				deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
				entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
				errorFilter: this.errorFilter.getFilter(),
				followSymbolicLinks: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				stats: this._settings.stats,
				throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
				transform: this.entryTransformer.getTransformer()
			};
		}
		_getMicromatchOptions() {
			return {
				dot: this._settings.dot,
				matchBase: this._settings.baseNameMatch,
				nobrace: !this._settings.braceExpansion,
				nocase: !this._settings.caseSensitiveMatch,
				noext: !this._settings.extglob,
				noglobstar: !this._settings.globstar,
				posix: true,
				strictSlashes: false
			};
		}
	};
	exports.default = Provider;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/async.js
var require_async = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/async.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const async_1$1 = require_async$1();
	const provider_1$2 = require_provider();
	var ProviderAsync = class extends provider_1$2.default {
		constructor() {
			super(...arguments);
			this._reader = new async_1$1.default(this._settings);
		}
		async read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const entries = await this.api(root, task, options);
			return entries.map((entry) => options.transform(entry));
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderAsync;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/stream.js
var require_stream = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/stream.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1$1 = __require("stream");
	const stream_2 = require_stream$1();
	const provider_1$1 = require_provider();
	var ProviderStream = class extends provider_1$1.default {
		constructor() {
			super(...arguments);
			this._reader = new stream_2.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const source = this.api(root, task, options);
			const destination = new stream_1$1.Readable({
				objectMode: true,
				read: () => {}
			});
			source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
			destination.once("close", () => source.destroy());
			return destination;
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderStream;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/sync.js
var require_sync$1 = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsStat = require_out$3();
	const fsWalk = require_out$1();
	const reader_1 = require_reader();
	var ReaderSync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkSync = fsWalk.walkSync;
			this._statSync = fsStat.statSync;
		}
		dynamic(root, options) {
			return this._walkSync(root, options);
		}
		static(patterns, options) {
			const entries = [];
			for (const pattern$1 of patterns) {
				const filepath = this._getFullEntryPath(pattern$1);
				const entry = this._getEntry(filepath, pattern$1, options);
				if (entry === null || !options.entryFilter(entry)) continue;
				entries.push(entry);
			}
			return entries;
		}
		_getEntry(filepath, pattern$1, options) {
			try {
				const stats = this._getStat(filepath);
				return this._makeEntry(stats, pattern$1);
			} catch (error) {
				if (options.errorFilter(error)) return null;
				throw error;
			}
		}
		_getStat(filepath) {
			return this._statSync(filepath, this._fsStatSettings);
		}
	};
	exports.default = ReaderSync;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/sync.js
var require_sync = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/sync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const sync_1$1 = require_sync$1();
	const provider_1 = require_provider();
	var ProviderSync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new sync_1$1.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const entries = this.api(root, task, options);
			return entries.map(options.transform);
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderSync;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/settings.js
var require_settings = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/settings.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
	const fs = __require("fs");
	const os = __require("os");
	/**
	* The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
	* https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
	*/
	const CPU_COUNT = Math.max(os.cpus().length, 1);
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
		lstat: fs.lstat,
		lstatSync: fs.lstatSync,
		stat: fs.stat,
		statSync: fs.statSync,
		readdir: fs.readdir,
		readdirSync: fs.readdirSync
	};
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.absolute = this._getValue(this._options.absolute, false);
			this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
			this.braceExpansion = this._getValue(this._options.braceExpansion, true);
			this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
			this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
			this.cwd = this._getValue(this._options.cwd, process.cwd());
			this.deep = this._getValue(this._options.deep, Infinity);
			this.dot = this._getValue(this._options.dot, false);
			this.extglob = this._getValue(this._options.extglob, true);
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
			this.fs = this._getFileSystemMethods(this._options.fs);
			this.globstar = this._getValue(this._options.globstar, true);
			this.ignore = this._getValue(this._options.ignore, []);
			this.markDirectories = this._getValue(this._options.markDirectories, false);
			this.objectMode = this._getValue(this._options.objectMode, false);
			this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
			this.onlyFiles = this._getValue(this._options.onlyFiles, true);
			this.stats = this._getValue(this._options.stats, false);
			this.suppressErrors = this._getValue(this._options.suppressErrors, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
			this.unique = this._getValue(this._options.unique, true);
			if (this.onlyDirectories) this.onlyFiles = false;
			if (this.stats) this.objectMode = true;
			this.ignore = [].concat(this.ignore);
		}
		_getValue(option, value) {
			return option === void 0 ? value : option;
		}
		_getFileSystemMethods(methods = {}) {
			return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		}
	};
	exports.default = Settings;
} });

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js
var require_out = __commonJS({ "../../node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js"(exports, module) {
	const taskManager = require_tasks();
	const async_1 = require_async();
	const stream_1 = require_stream();
	const sync_1 = require_sync();
	const settings_1 = require_settings();
	const utils$1 = require_utils$2();
	async function FastGlob(source, options) {
		assertPatternsInput(source);
		const works = getWorks(source, async_1.default, options);
		const result = await Promise.all(works);
		return utils$1.array.flatten(result);
	}
	(function(FastGlob$1) {
		FastGlob$1.glob = FastGlob$1;
		FastGlob$1.globSync = sync$2;
		FastGlob$1.globStream = stream$1;
		FastGlob$1.async = FastGlob$1;
		function sync$2(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, sync_1.default, options);
			return utils$1.array.flatten(works);
		}
		FastGlob$1.sync = sync$2;
		function stream$1(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, stream_1.default, options);
			/**
			* The stream returned by the provider cannot work with an asynchronous iterator.
			* To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
			* This affects performance (+25%). I don't see best solution right now.
			*/
			return utils$1.stream.merge(works);
		}
		FastGlob$1.stream = stream$1;
		function generateTasks(source, options) {
			assertPatternsInput(source);
			const patterns = [].concat(source);
			const settings = new settings_1.default(options);
			return taskManager.generate(patterns, settings);
		}
		FastGlob$1.generateTasks = generateTasks;
		function isDynamicPattern$1(source, options) {
			assertPatternsInput(source);
			const settings = new settings_1.default(options);
			return utils$1.pattern.isDynamicPattern(source, settings);
		}
		FastGlob$1.isDynamicPattern = isDynamicPattern$1;
		function escapePath(source) {
			assertPatternsInput(source);
			return utils$1.path.escape(source);
		}
		FastGlob$1.escapePath = escapePath;
		function convertPathToPattern(source) {
			assertPatternsInput(source);
			return utils$1.path.convertPathToPattern(source);
		}
		FastGlob$1.convertPathToPattern = convertPathToPattern;
		let posix;
		(function(posix$1) {
			function escapePath$1(source) {
				assertPatternsInput(source);
				return utils$1.path.escapePosixPath(source);
			}
			posix$1.escapePath = escapePath$1;
			function convertPathToPattern$1(source) {
				assertPatternsInput(source);
				return utils$1.path.convertPosixPathToPattern(source);
			}
			posix$1.convertPathToPattern = convertPathToPattern$1;
		})(posix = FastGlob$1.posix || (FastGlob$1.posix = {}));
		let win32$1;
		(function(win32$2) {
			function escapePath$1(source) {
				assertPatternsInput(source);
				return utils$1.path.escapeWindowsPath(source);
			}
			win32$2.escapePath = escapePath$1;
			function convertPathToPattern$1(source) {
				assertPatternsInput(source);
				return utils$1.path.convertWindowsPathToPattern(source);
			}
			win32$2.convertPathToPattern = convertPathToPattern$1;
		})(win32$1 = FastGlob$1.win32 || (FastGlob$1.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
		const patterns = [].concat(source);
		const settings = new settings_1.default(options);
		const tasks = taskManager.generate(patterns, settings);
		const provider = new _Provider(settings);
		return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
		const source = [].concat(input);
		const isValidSource = source.every((item) => utils$1.string.isString(item) && !utils$1.string.isEmpty(item));
		if (!isValidSource) throw new TypeError("Patterns must be a string (non empty) or an array of strings");
	}
	module.exports = FastGlob;
} });
var import_out = __toESM(require_out(), 1);

//#endregion
//#region src/assets/index.ts
function getAssetsFunctions({ config }) {
	let cache = null;
	async function getAssetsFromPublicDir() {
		const dir = resolve(config.root);
		const baseURL = config.base;
		const publicDir = config.publicDir;
		const relativePublicDir = publicDir === "" ? "" : `${relative(dir, publicDir)}/`;
		const files = await (0, import_out.default)([
			"**/*.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp|tiff)",
			"**/*.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)",
			"**/*.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)",
			"**/*.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)",
			"**/*.(json|json5|jsonc|txt|text|tsx|jsx|md|mdx|mdc|markdown|yaml|yml|toml)",
			"**/*.wasm"
		], {
			cwd: publicDir,
			onlyFiles: true,
			caseSensitiveMatch: false,
			ignore: [
				"**/node_modules/**",
				"**/dist/**",
				"**/package-lock.*",
				"**/pnpm-lock.*",
				"**/pnpm-workspace.*"
			]
		});
		cache = await Promise.all(files.map(async (relativePath) => {
			const filePath = resolve(publicDir, relativePath);
			const stat$2 = await fsp.lstat(filePath);
			const path$12 = relativePath.replace(relativePublicDir, "");
			return {
				path: path$12,
				relativePath,
				publicPath: join(baseURL, path$12),
				filePath,
				type: guessType(relativePath),
				size: stat$2.size,
				mtime: stat$2.mtimeMs
			};
		}));
		return cache;
	}
	return { getAssetsFromPublicDir };
}
function guessType(path$12) {
	if (/\.(?:png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(path$12)) return "image";
	if (/\.(?:mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i.test(path$12)) return "video";
	if (/\.(?:mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i.test(path$12)) return "audio";
	if (/\.(?:woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i.test(path$12)) return "font";
	if (/\.(?:json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown|ya?ml|toml)/i.test(path$12)) return "text";
	if (/\.wasm/i.test(path$12)) return "wasm";
	return "other";
}

//#endregion
//#region ../../node_modules/.pnpm/balanced-match@1.0.2/node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({ "../../node_modules/.pnpm/balanced-match@1.0.2/node_modules/balanced-match/index.js"(exports, module) {
	module.exports = balanced$1;
	function balanced$1(a, b, str) {
		if (a instanceof RegExp) a = maybeMatch(a, str);
		if (b instanceof RegExp) b = maybeMatch(b, str);
		var r = range(a, b, str);
		return r && {
			start: r[0],
			end: r[1],
			pre: str.slice(0, r[0]),
			body: str.slice(r[0] + a.length, r[1]),
			post: str.slice(r[1] + b.length)
		};
	}
	function maybeMatch(reg, str) {
		var m = str.match(reg);
		return m ? m[0] : null;
	}
	balanced$1.range = range;
	function range(a, b, str) {
		var begs, beg, left, right, result;
		var ai = str.indexOf(a);
		var bi = str.indexOf(b, ai + 1);
		var i = ai;
		if (ai >= 0 && bi > 0) {
			if (a === b) return [ai, bi];
			begs = [];
			left = str.length;
			while (i >= 0 && !result) {
				if (i == ai) {
					begs.push(i);
					ai = str.indexOf(a, i + 1);
				} else if (begs.length == 1) result = [begs.pop(), bi];
				else {
					beg = begs.pop();
					if (beg < left) {
						left = beg;
						right = bi;
					}
					bi = str.indexOf(b, i + 1);
				}
				i = ai < bi && ai >= 0 ? ai : bi;
			}
			if (begs.length) result = [left, right];
		}
		return result;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/brace-expansion@2.0.1/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({ "../../node_modules/.pnpm/brace-expansion@2.0.1/node_modules/brace-expansion/index.js"(exports, module) {
	var balanced = require_balanced_match();
	module.exports = expandTop;
	var escSlash = "\0SLASH" + Math.random() + "\0";
	var escOpen = "\0OPEN" + Math.random() + "\0";
	var escClose = "\0CLOSE" + Math.random() + "\0";
	var escComma = "\0COMMA" + Math.random() + "\0";
	var escPeriod = "\0PERIOD" + Math.random() + "\0";
	function numeric(str) {
		return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
	}
	function escapeBraces(str) {
		return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
	}
	function unescapeBraces(str) {
		return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
	}
	function parseCommaParts(str) {
		if (!str) return [""];
		var parts = [];
		var m = balanced("{", "}", str);
		if (!m) return str.split(",");
		var pre = m.pre;
		var body = m.body;
		var post = m.post;
		var p$1 = pre.split(",");
		p$1[p$1.length - 1] += "{" + body + "}";
		var postParts = parseCommaParts(post);
		if (post.length) {
			p$1[p$1.length - 1] += postParts.shift();
			p$1.push.apply(p$1, postParts);
		}
		parts.push.apply(parts, p$1);
		return parts;
	}
	function expandTop(str) {
		if (!str) return [];
		if (str.substr(0, 2) === "{}") str = "\\{\\}" + str.substr(2);
		return expand(escapeBraces(str), true).map(unescapeBraces);
	}
	function embrace(str) {
		return "{" + str + "}";
	}
	function isPadded(el) {
		return /^-?0\d/.test(el);
	}
	function lte(i, y) {
		return i <= y;
	}
	function gte(i, y) {
		return i >= y;
	}
	function expand(str, isTop) {
		var expansions = [];
		var m = balanced("{", "}", str);
		if (!m) return [str];
		var pre = m.pre;
		var post = m.post.length ? expand(m.post, false) : [""];
		if (/\$$/.test(m.pre)) for (var k$1 = 0; k$1 < post.length; k$1++) {
			var expansion = pre + "{" + m.body + "}" + post[k$1];
			expansions.push(expansion);
		}
		else {
			var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
			var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
			var isSequence = isNumericSequence || isAlphaSequence;
			var isOptions = m.body.indexOf(",") >= 0;
			if (!isSequence && !isOptions) {
				if (m.post.match(/,.*\}/)) {
					str = m.pre + "{" + m.body + escClose + m.post;
					return expand(str);
				}
				return [str];
			}
			var n;
			if (isSequence) n = m.body.split(/\.\./);
			else {
				n = parseCommaParts(m.body);
				if (n.length === 1) {
					n = expand(n[0], false).map(embrace);
					if (n.length === 1) return post.map(function(p$1) {
						return m.pre + n[0] + p$1;
					});
				}
			}
			var N;
			if (isSequence) {
				var x$1 = numeric(n[0]);
				var y = numeric(n[1]);
				var width = Math.max(n[0].length, n[1].length);
				var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
				var test$1 = lte;
				var reverse = y < x$1;
				if (reverse) {
					incr *= -1;
					test$1 = gte;
				}
				var pad$1 = n.some(isPadded);
				N = [];
				for (var i = x$1; test$1(i, y); i += incr) {
					var c;
					if (isAlphaSequence) {
						c = String.fromCharCode(i);
						if (c === "\\") c = "";
					} else {
						c = String(i);
						if (pad$1) {
							var need = width - c.length;
							if (need > 0) {
								var z$1 = new Array(need + 1).join("0");
								if (i < 0) c = "-" + z$1 + c.slice(1);
								else c = z$1 + c;
							}
						}
					}
					N.push(c);
				}
			} else {
				N = [];
				for (var j = 0; j < n.length; j++) N.push.apply(N, expand(n[j], false));
			}
			for (var j = 0; j < N.length; j++) for (var k$1 = 0; k$1 < post.length; k$1++) {
				var expansion = pre + N[j] + post[k$1];
				if (!isTop || isSequence || expansion) expansions.push(expansion);
			}
		}
		return expansions;
	}
} });
var import_brace_expansion = __toESM(require_brace_expansion(), 1);

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/assert-valid-pattern.js
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern$1) => {
	if (typeof pattern$1 !== "string") throw new TypeError("invalid pattern");
	if (pattern$1.length > MAX_PATTERN_LENGTH) throw new TypeError("pattern is too long");
};

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/brace-expressions.js
const posixClasses = {
	"[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
	"[:alpha:]": ["\\p{L}\\p{Nl}", true],
	"[:ascii:]": ["\\x00-\\x7f", false],
	"[:blank:]": ["\\p{Zs}\\t", true],
	"[:cntrl:]": ["\\p{Cc}", true],
	"[:digit:]": ["\\p{Nd}", true],
	"[:graph:]": [
		"\\p{Z}\\p{C}",
		true,
		true
	],
	"[:lower:]": ["\\p{Ll}", true],
	"[:print:]": ["\\p{C}", true],
	"[:punct:]": ["\\p{P}", true],
	"[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
	"[:upper:]": ["\\p{Lu}", true],
	"[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
	"[:xdigit:]": ["A-Fa-f0-9", false]
};
const braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const rangesToString = (ranges) => ranges.join("");
const parseClass = (glob, position) => {
	const pos = position;
	/* c8 ignore start */
	if (glob.charAt(pos) !== "[") throw new Error("not in a brace expression");
	/* c8 ignore stop */
	const ranges = [];
	const negs = [];
	let i = pos + 1;
	let sawStart = false;
	let uflag = false;
	let escaping = false;
	let negate = false;
	let endPos = pos;
	let rangeStart = "";
	WHILE: while (i < glob.length) {
		const c = glob.charAt(i);
		if ((c === "!" || c === "^") && i === pos + 1) {
			negate = true;
			i++;
			continue;
		}
		if (c === "]" && sawStart && !escaping) {
			endPos = i + 1;
			break;
		}
		sawStart = true;
		if (c === "\\") {
			if (!escaping) {
				escaping = true;
				i++;
				continue;
			}
		}
		if (c === "[" && !escaping) {
			for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) if (glob.startsWith(cls, i)) {
				if (rangeStart) return [
					"$.",
					false,
					glob.length - pos,
					true
				];
				i += cls.length;
				if (neg) negs.push(unip);
				else ranges.push(unip);
				uflag = uflag || u;
				continue WHILE;
			}
		}
		escaping = false;
		if (rangeStart) {
			if (c > rangeStart) ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
			else if (c === rangeStart) ranges.push(braceEscape(c));
			rangeStart = "";
			i++;
			continue;
		}
		if (glob.startsWith("-]", i + 1)) {
			ranges.push(braceEscape(c + "-"));
			i += 2;
			continue;
		}
		if (glob.startsWith("-", i + 1)) {
			rangeStart = c;
			i += 2;
			continue;
		}
		ranges.push(braceEscape(c));
		i++;
	}
	if (endPos < i) return [
		"",
		false,
		0,
		false
	];
	if (!ranges.length && !negs.length) return [
		"$.",
		false,
		glob.length - pos,
		true
	];
	if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
		const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
		return [
			regexpEscape(r),
			false,
			endPos - pos,
			false
		];
	}
	const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
	const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
	const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
	return [
		comb,
		uflag,
		endPos - pos,
		true
	];
};

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/unescape.js
/**
* Un-escape a string that has been escaped with {@link escape}.
*
* If the {@link windowsPathsNoEscape} option is used, then square-brace
* escapes are removed, but not backslash escapes.  For example, it will turn
* the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
* becuase `\` is a path separator in `windowsPathsNoEscape` mode.
*
* When `windowsPathsNoEscape` is not set, then both brace escapes and
* backslash escapes are removed.
*
* Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
* or unescaped.
*/
const unescape = (s, { windowsPathsNoEscape = false } = {}) => {
	return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
};

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/ast.js
const types = new Set([
	"!",
	"?",
	"+",
	"*",
	"@"
]);
const isExtglobType = (c) => types.has(c);
const startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
const startNoDot = "(?!\\.)";
const addPatternStart = new Set(["[", "."]);
const justDots = new Set(["..", "."]);
const reSpecials = new Set("().*{}+?[]^$\\!");
const regExpEscape$1 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const qmark$1 = "[^/]";
const star$1 = qmark$1 + "*?";
const starNoEmpty = qmark$1 + "+?";
var AST = class AST {
	type;
	#root;
	#hasMagic;
	#uflag = false;
	#parts = [];
	#parent;
	#parentIndex;
	#negs;
	#filledNegs = false;
	#options;
	#toString;
	#emptyExt = false;
	constructor(type, parent, options = {}) {
		this.type = type;
		if (type) this.#hasMagic = true;
		this.#parent = parent;
		this.#root = this.#parent ? this.#parent.#root : this;
		this.#options = this.#root === this ? options : this.#root.#options;
		this.#negs = this.#root === this ? [] : this.#root.#negs;
		if (type === "!" && !this.#root.#filledNegs) this.#negs.push(this);
		this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
	}
	get hasMagic() {
		/* c8 ignore start */
		if (this.#hasMagic !== void 0) return this.#hasMagic;
		/* c8 ignore stop */
		for (const p$1 of this.#parts) {
			if (typeof p$1 === "string") continue;
			if (p$1.type || p$1.hasMagic) return this.#hasMagic = true;
		}
		return this.#hasMagic;
	}
	toString() {
		if (this.#toString !== void 0) return this.#toString;
		if (!this.type) return this.#toString = this.#parts.map((p$1) => String(p$1)).join("");
		else return this.#toString = this.type + "(" + this.#parts.map((p$1) => String(p$1)).join("|") + ")";
	}
	#fillNegs() {
		/* c8 ignore start */
		if (this !== this.#root) throw new Error("should only call on root");
		if (this.#filledNegs) return this;
		/* c8 ignore stop */
		this.toString();
		this.#filledNegs = true;
		let n;
		while (n = this.#negs.pop()) {
			if (n.type !== "!") continue;
			let p$1 = n;
			let pp = p$1.#parent;
			while (pp) {
				for (let i = p$1.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) for (const part of n.#parts) {
					/* c8 ignore start */
					if (typeof part === "string") throw new Error("string part in extglob AST??");
					/* c8 ignore stop */
					part.copyIn(pp.#parts[i]);
				}
				p$1 = pp;
				pp = p$1.#parent;
			}
		}
		return this;
	}
	push(...parts) {
		for (const p$1 of parts) {
			if (p$1 === "") continue;
			/* c8 ignore start */
			if (typeof p$1 !== "string" && !(p$1 instanceof AST && p$1.#parent === this)) throw new Error("invalid part: " + p$1);
			/* c8 ignore stop */
			this.#parts.push(p$1);
		}
	}
	toJSON() {
		const ret = this.type === null ? this.#parts.slice().map((p$1) => typeof p$1 === "string" ? p$1 : p$1.toJSON()) : [this.type, ...this.#parts.map((p$1) => p$1.toJSON())];
		if (this.isStart() && !this.type) ret.unshift([]);
		if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) ret.push({});
		return ret;
	}
	isStart() {
		if (this.#root === this) return true;
		if (!this.#parent?.isStart()) return false;
		if (this.#parentIndex === 0) return true;
		const p$1 = this.#parent;
		for (let i = 0; i < this.#parentIndex; i++) {
			const pp = p$1.#parts[i];
			if (!(pp instanceof AST && pp.type === "!")) return false;
		}
		return true;
	}
	isEnd() {
		if (this.#root === this) return true;
		if (this.#parent?.type === "!") return true;
		if (!this.#parent?.isEnd()) return false;
		if (!this.type) return this.#parent?.isEnd();
		/* c8 ignore start */
		const pl = this.#parent ? this.#parent.#parts.length : 0;
		/* c8 ignore stop */
		return this.#parentIndex === pl - 1;
	}
	copyIn(part) {
		if (typeof part === "string") this.push(part);
		else this.push(part.clone(this));
	}
	clone(parent) {
		const c = new AST(this.type, parent);
		for (const p$1 of this.#parts) c.copyIn(p$1);
		return c;
	}
	static #parseAST(str, ast, pos, opt) {
		let escaping = false;
		let inBrace = false;
		let braceStart = -1;
		let braceNeg = false;
		if (ast.type === null) {
			let i$1 = pos;
			let acc$1 = "";
			while (i$1 < str.length) {
				const c = str.charAt(i$1++);
				if (escaping || c === "\\") {
					escaping = !escaping;
					acc$1 += c;
					continue;
				}
				if (inBrace) {
					if (i$1 === braceStart + 1) {
						if (c === "^" || c === "!") braceNeg = true;
					} else if (c === "]" && !(i$1 === braceStart + 2 && braceNeg)) inBrace = false;
					acc$1 += c;
					continue;
				} else if (c === "[") {
					inBrace = true;
					braceStart = i$1;
					braceNeg = false;
					acc$1 += c;
					continue;
				}
				if (!opt.noext && isExtglobType(c) && str.charAt(i$1) === "(") {
					ast.push(acc$1);
					acc$1 = "";
					const ext$1 = new AST(c, ast);
					i$1 = AST.#parseAST(str, ext$1, i$1, opt);
					ast.push(ext$1);
					continue;
				}
				acc$1 += c;
			}
			ast.push(acc$1);
			return i$1;
		}
		let i = pos + 1;
		let part = new AST(null, ast);
		const parts = [];
		let acc = "";
		while (i < str.length) {
			const c = str.charAt(i++);
			if (escaping || c === "\\") {
				escaping = !escaping;
				acc += c;
				continue;
			}
			if (inBrace) {
				if (i === braceStart + 1) {
					if (c === "^" || c === "!") braceNeg = true;
				} else if (c === "]" && !(i === braceStart + 2 && braceNeg)) inBrace = false;
				acc += c;
				continue;
			} else if (c === "[") {
				inBrace = true;
				braceStart = i;
				braceNeg = false;
				acc += c;
				continue;
			}
			if (isExtglobType(c) && str.charAt(i) === "(") {
				part.push(acc);
				acc = "";
				const ext$1 = new AST(c, part);
				part.push(ext$1);
				i = AST.#parseAST(str, ext$1, i, opt);
				continue;
			}
			if (c === "|") {
				part.push(acc);
				acc = "";
				parts.push(part);
				part = new AST(null, ast);
				continue;
			}
			if (c === ")") {
				if (acc === "" && ast.#parts.length === 0) ast.#emptyExt = true;
				part.push(acc);
				acc = "";
				ast.push(...parts, part);
				return i;
			}
			acc += c;
		}
		ast.type = null;
		ast.#hasMagic = void 0;
		ast.#parts = [str.substring(pos - 1)];
		return i;
	}
	static fromGlob(pattern$1, options = {}) {
		const ast = new AST(null, void 0, options);
		AST.#parseAST(pattern$1, ast, 0, options);
		return ast;
	}
	toMMPattern() {
		/* c8 ignore start */
		if (this !== this.#root) return this.#root.toMMPattern();
		/* c8 ignore stop */
		const glob = this.toString();
		const [re$1, body, hasMagic, uflag] = this.toRegExpSource();
		const anyMagic = hasMagic || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob.toUpperCase() !== glob.toLowerCase();
		if (!anyMagic) return body;
		const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
		return Object.assign(new RegExp(`^${re$1}$`, flags), {
			_src: re$1,
			_glob: glob
		});
	}
	get options() {
		return this.#options;
	}
	toRegExpSource(allowDot) {
		const dot = allowDot ?? !!this.#options.dot;
		if (this.#root === this) this.#fillNegs();
		if (!this.type) {
			const noEmpty = this.isStart() && this.isEnd();
			const src = this.#parts.map((p$1) => {
				const [re$1, _, hasMagic, uflag] = typeof p$1 === "string" ? AST.#parseGlob(p$1, this.#hasMagic, noEmpty) : p$1.toRegExpSource(allowDot);
				this.#hasMagic = this.#hasMagic || hasMagic;
				this.#uflag = this.#uflag || uflag;
				return re$1;
			}).join("");
			let start$1 = "";
			if (this.isStart()) {
				if (typeof this.#parts[0] === "string") {
					const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
					if (!dotTravAllowed) {
						const aps = addPatternStart;
						const needNoTrav = dot && aps.has(src.charAt(0)) || src.startsWith("\\.") && aps.has(src.charAt(2)) || src.startsWith("\\.\\.") && aps.has(src.charAt(4));
						const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
						start$1 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
					}
				}
			}
			let end = "";
			if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") end = "(?:$|\\/)";
			const final$1 = start$1 + src + end;
			return [
				final$1,
				unescape(src),
				this.#hasMagic = !!this.#hasMagic,
				this.#uflag
			];
		}
		const repeated = this.type === "*" || this.type === "+";
		const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
		let body = this.#partsToRegExp(dot);
		if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
			const s = this.toString();
			this.#parts = [s];
			this.type = null;
			this.#hasMagic = void 0;
			return [
				s,
				unescape(this.toString()),
				false,
				false
			];
		}
		let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
		if (bodyDotAllowed === body) bodyDotAllowed = "";
		if (bodyDotAllowed) body = `(?:${body})(?:${bodyDotAllowed})*?`;
		let final = "";
		if (this.type === "!" && this.#emptyExt) final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
		else {
			const close = this.type === "!" ? "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star$1 + ")" : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
			final = start + body + close;
		}
		return [
			final,
			unescape(body),
			this.#hasMagic = !!this.#hasMagic,
			this.#uflag
		];
	}
	#partsToRegExp(dot) {
		return this.#parts.map((p$1) => {
			/* c8 ignore start */
			if (typeof p$1 === "string") throw new Error("string type in extglob ast??");
			/* c8 ignore stop */
			const [re$1, _, _hasMagic, uflag] = p$1.toRegExpSource(dot);
			this.#uflag = this.#uflag || uflag;
			return re$1;
		}).filter((p$1) => !(this.isStart() && this.isEnd()) || !!p$1).join("|");
	}
	static #parseGlob(glob, hasMagic, noEmpty = false) {
		let escaping = false;
		let re$1 = "";
		let uflag = false;
		for (let i = 0; i < glob.length; i++) {
			const c = glob.charAt(i);
			if (escaping) {
				escaping = false;
				re$1 += (reSpecials.has(c) ? "\\" : "") + c;
				continue;
			}
			if (c === "\\") {
				if (i === glob.length - 1) re$1 += "\\\\";
				else escaping = true;
				continue;
			}
			if (c === "[") {
				const [src, needUflag, consumed, magic] = parseClass(glob, i);
				if (consumed) {
					re$1 += src;
					uflag = uflag || needUflag;
					i += consumed - 1;
					hasMagic = hasMagic || magic;
					continue;
				}
			}
			if (c === "*") {
				if (noEmpty && glob === "*") re$1 += starNoEmpty;
				else re$1 += star$1;
				hasMagic = true;
				continue;
			}
			if (c === "?") {
				re$1 += qmark$1;
				hasMagic = true;
				continue;
			}
			re$1 += regExpEscape$1(c);
		}
		return [
			re$1,
			unescape(glob),
			!!hasMagic,
			uflag
		];
	}
};

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/escape.js
/**
* Escape all magic characters in a glob pattern.
*
* If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
* option is used, then characters are escaped by wrapping in `[]`, because
* a magic character wrapped in a character class can only be satisfied by
* that exact character.  In this mode, `\` is _not_ escaped, because it is
* not interpreted as a magic character, but instead as a path separator.
*/
const escape = (s, { windowsPathsNoEscape = false } = {}) => {
	return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

//#endregion
//#region ../../node_modules/.pnpm/minimatch@10.0.1/node_modules/minimatch/dist/esm/index.js
const minimatch = (p$1, pattern$1, options = {}) => {
	assertValidPattern(pattern$1);
	if (!options.nocomment && pattern$1.charAt(0) === "#") return false;
	return new Minimatch(pattern$1, options).match(p$1);
};
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext$1) => (f) => !f.startsWith(".") && f.endsWith(ext$1);
const starDotExtTestDot = (ext$1) => (f) => f.endsWith(ext$1);
const starDotExtTestNocase = (ext$1) => {
	ext$1 = ext$1.toLowerCase();
	return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext$1);
};
const starDotExtTestNocaseDot = (ext$1) => {
	ext$1 = ext$1.toLowerCase();
	return (f) => f.toLowerCase().endsWith(ext$1);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
const starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith(".");
const starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExt([$0]);
	if (!ext$1) return noext;
	ext$1 = ext$1.toLowerCase();
	return (f) => noext(f) && f.toLowerCase().endsWith(ext$1);
};
const qmarksTestNocaseDot = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExtDot([$0]);
	if (!ext$1) return noext;
	ext$1 = ext$1.toLowerCase();
	return (f) => noext(f) && f.toLowerCase().endsWith(ext$1);
};
const qmarksTestDot = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExtDot([$0]);
	return !ext$1 ? noext : (f) => noext(f) && f.endsWith(ext$1);
};
const qmarksTest = ([$0, ext$1 = ""]) => {
	const noext = qmarksTestNoExt([$0]);
	return !ext$1 ? noext : (f) => noext(f) && f.endsWith(ext$1);
};
const qmarksTestNoExt = ([$0]) => {
	const len = $0.length;
	return (f) => f.length === len && !f.startsWith(".");
};
const qmarksTestNoExtDot = ([$0]) => {
	const len = $0.length;
	return (f) => f.length === len && f !== "." && f !== "..";
};
/* c8 ignore start */
const defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
const path$1 = {
	win32: { sep: "\\" },
	posix: { sep: "/" }
};
/* c8 ignore stop */
const sep = defaultPlatform === "win32" ? path$1.win32.sep : path$1.posix.sep;
minimatch.sep = sep;
const GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
const qmark = "[^/]";
const star = qmark + "*?";
const twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
const twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
const filter = (pattern$1, options = {}) => (p$1) => minimatch(p$1, pattern$1, options);
minimatch.filter = filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
	if (!def || typeof def !== "object" || !Object.keys(def).length) return minimatch;
	const orig = minimatch;
	const m = (p$1, pattern$1, options = {}) => orig(p$1, pattern$1, ext(def, options));
	return Object.assign(m, {
		Minimatch: class Minimatch$1 extends orig.Minimatch {
			constructor(pattern$1, options = {}) {
				super(pattern$1, ext(def, options));
			}
			static defaults(options) {
				return orig.defaults(ext(def, options)).Minimatch;
			}
		},
		AST: class AST$1 extends orig.AST {
			/* c8 ignore start */
			constructor(type, parent, options = {}) {
				super(type, parent, ext(def, options));
			}
			/* c8 ignore stop */
			static fromGlob(pattern$1, options = {}) {
				return orig.AST.fromGlob(pattern$1, ext(def, options));
			}
		},
		unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
		escape: (s, options = {}) => orig.escape(s, ext(def, options)),
		filter: (pattern$1, options = {}) => orig.filter(pattern$1, ext(def, options)),
		defaults: (options) => orig.defaults(ext(def, options)),
		makeRe: (pattern$1, options = {}) => orig.makeRe(pattern$1, ext(def, options)),
		braceExpand: (pattern$1, options = {}) => orig.braceExpand(pattern$1, ext(def, options)),
		match: (list, pattern$1, options = {}) => orig.match(list, pattern$1, ext(def, options)),
		sep: orig.sep,
		GLOBSTAR
	});
};
minimatch.defaults = defaults;
const braceExpand = (pattern$1, options = {}) => {
	assertValidPattern(pattern$1);
	if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern$1)) return [pattern$1];
	return (0, import_brace_expansion.default)(pattern$1);
};
minimatch.braceExpand = braceExpand;
const makeRe = (pattern$1, options = {}) => new Minimatch(pattern$1, options).makeRe();
minimatch.makeRe = makeRe;
const match = (list, pattern$1, options = {}) => {
	const mm = new Minimatch(pattern$1, options);
	list = list.filter((f) => mm.match(f));
	if (mm.options.nonull && !list.length) list.push(pattern$1);
	return list;
};
minimatch.match = match;
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
	options;
	set;
	pattern;
	windowsPathsNoEscape;
	nonegate;
	negate;
	comment;
	empty;
	preserveMultipleSlashes;
	partial;
	globSet;
	globParts;
	nocase;
	isWindows;
	platform;
	windowsNoMagicRoot;
	regexp;
	constructor(pattern$1, options = {}) {
		assertValidPattern(pattern$1);
		options = options || {};
		this.options = options;
		this.pattern = pattern$1;
		this.platform = options.platform || defaultPlatform;
		this.isWindows = this.platform === "win32";
		this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
		if (this.windowsPathsNoEscape) this.pattern = this.pattern.replace(/\\/g, "/");
		this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
		this.regexp = null;
		this.negate = false;
		this.nonegate = !!options.nonegate;
		this.comment = false;
		this.empty = false;
		this.partial = !!options.partial;
		this.nocase = !!this.options.nocase;
		this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
		this.globSet = [];
		this.globParts = [];
		this.set = [];
		this.make();
	}
	hasMagic() {
		if (this.options.magicalBraces && this.set.length > 1) return true;
		for (const pattern$1 of this.set) for (const part of pattern$1) if (typeof part !== "string") return true;
		return false;
	}
	debug(..._) {}
	make() {
		const pattern$1 = this.pattern;
		const options = this.options;
		if (!options.nocomment && pattern$1.charAt(0) === "#") {
			this.comment = true;
			return;
		}
		if (!pattern$1) {
			this.empty = true;
			return;
		}
		this.parseNegate();
		this.globSet = [...new Set(this.braceExpand())];
		if (options.debug) this.debug = (...args) => console.error(...args);
		this.debug(this.pattern, this.globSet);
		const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
		this.globParts = this.preprocess(rawGlobParts);
		this.debug(this.pattern, this.globParts);
		let set = this.globParts.map((s, _, __) => {
			if (this.isWindows && this.windowsNoMagicRoot) {
				const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
				const isDrive = /^[a-z]:/i.test(s[0]);
				if (isUNC) return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
				else if (isDrive) return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
			}
			return s.map((ss) => this.parse(ss));
		});
		this.debug(this.pattern, set);
		this.set = set.filter((s) => s.indexOf(false) === -1);
		if (this.isWindows) for (let i = 0; i < this.set.length; i++) {
			const p$1 = this.set[i];
			if (p$1[0] === "" && p$1[1] === "" && this.globParts[i][2] === "?" && typeof p$1[3] === "string" && /^[a-z]:$/i.test(p$1[3])) p$1[2] = "?";
		}
		this.debug(this.pattern, this.set);
	}
	preprocess(globParts) {
		if (this.options.noglobstar) {
			for (let i = 0; i < globParts.length; i++) for (let j = 0; j < globParts[i].length; j++) if (globParts[i][j] === "**") globParts[i][j] = "*";
		}
		const { optimizationLevel = 1 } = this.options;
		if (optimizationLevel >= 2) {
			globParts = this.firstPhasePreProcess(globParts);
			globParts = this.secondPhasePreProcess(globParts);
		} else if (optimizationLevel >= 1) globParts = this.levelOneOptimize(globParts);
		else globParts = this.adjascentGlobstarOptimize(globParts);
		return globParts;
	}
	adjascentGlobstarOptimize(globParts) {
		return globParts.map((parts) => {
			let gs = -1;
			while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
				let i = gs;
				while (parts[i + 1] === "**") i++;
				if (i !== gs) parts.splice(gs, i - gs);
			}
			return parts;
		});
	}
	levelOneOptimize(globParts) {
		return globParts.map((parts) => {
			parts = parts.reduce((set, part) => {
				const prev = set[set.length - 1];
				if (part === "**" && prev === "**") return set;
				if (part === "..") {
					if (prev && prev !== ".." && prev !== "." && prev !== "**") {
						set.pop();
						return set;
					}
				}
				set.push(part);
				return set;
			}, []);
			return parts.length === 0 ? [""] : parts;
		});
	}
	levelTwoFileOptimize(parts) {
		if (!Array.isArray(parts)) parts = this.slashSplit(parts);
		let didSomething = false;
		do {
			didSomething = false;
			if (!this.preserveMultipleSlashes) {
				for (let i = 1; i < parts.length - 1; i++) {
					const p$1 = parts[i];
					if (i === 1 && p$1 === "" && parts[0] === "") continue;
					if (p$1 === "." || p$1 === "") {
						didSomething = true;
						parts.splice(i, 1);
						i--;
					}
				}
				if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
					didSomething = true;
					parts.pop();
				}
			}
			let dd = 0;
			while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
				const p$1 = parts[dd - 1];
				if (p$1 && p$1 !== "." && p$1 !== ".." && p$1 !== "**") {
					didSomething = true;
					parts.splice(dd - 1, 2);
					dd -= 2;
				}
			}
		} while (didSomething);
		return parts.length === 0 ? [""] : parts;
	}
	firstPhasePreProcess(globParts) {
		let didSomething = false;
		do {
			didSomething = false;
			for (let parts of globParts) {
				let gs = -1;
				while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
					let gss = gs;
					while (parts[gss + 1] === "**") gss++;
					if (gss > gs) parts.splice(gs + 1, gss - gs);
					let next = parts[gs + 1];
					const p$1 = parts[gs + 2];
					const p2 = parts[gs + 3];
					if (next !== "..") continue;
					if (!p$1 || p$1 === "." || p$1 === ".." || !p2 || p2 === "." || p2 === "..") continue;
					didSomething = true;
					parts.splice(gs, 1);
					const other = parts.slice(0);
					other[gs] = "**";
					globParts.push(other);
					gs--;
				}
				if (!this.preserveMultipleSlashes) {
					for (let i = 1; i < parts.length - 1; i++) {
						const p$1 = parts[i];
						if (i === 1 && p$1 === "" && parts[0] === "") continue;
						if (p$1 === "." || p$1 === "") {
							didSomething = true;
							parts.splice(i, 1);
							i--;
						}
					}
					if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
						didSomething = true;
						parts.pop();
					}
				}
				let dd = 0;
				while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
					const p$1 = parts[dd - 1];
					if (p$1 && p$1 !== "." && p$1 !== ".." && p$1 !== "**") {
						didSomething = true;
						const needDot = dd === 1 && parts[dd + 1] === "**";
						const splin = needDot ? ["."] : [];
						parts.splice(dd - 1, 2, ...splin);
						if (parts.length === 0) parts.push("");
						dd -= 2;
					}
				}
			}
		} while (didSomething);
		return globParts;
	}
	secondPhasePreProcess(globParts) {
		for (let i = 0; i < globParts.length - 1; i++) for (let j = i + 1; j < globParts.length; j++) {
			const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
			if (matched) {
				globParts[i] = [];
				globParts[j] = matched;
				break;
			}
		}
		return globParts.filter((gs) => gs.length);
	}
	partsMatch(a, b, emptyGSMatch = false) {
		let ai = 0;
		let bi = 0;
		let result = [];
		let which = "";
		while (ai < a.length && bi < b.length) if (a[ai] === b[bi]) {
			result.push(which === "b" ? b[bi] : a[ai]);
			ai++;
			bi++;
		} else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
			result.push(a[ai]);
			ai++;
		} else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
			result.push(b[bi]);
			bi++;
		} else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
			if (which === "b") return false;
			which = "a";
			result.push(a[ai]);
			ai++;
			bi++;
		} else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
			if (which === "a") return false;
			which = "b";
			result.push(b[bi]);
			ai++;
			bi++;
		} else return false;
		return a.length === b.length && result;
	}
	parseNegate() {
		if (this.nonegate) return;
		const pattern$1 = this.pattern;
		let negate = false;
		let negateOffset = 0;
		for (let i = 0; i < pattern$1.length && pattern$1.charAt(i) === "!"; i++) {
			negate = !negate;
			negateOffset++;
		}
		if (negateOffset) this.pattern = pattern$1.slice(negateOffset);
		this.negate = negate;
	}
	matchOne(file$1, pattern$1, partial = false) {
		const options = this.options;
		if (this.isWindows) {
			const fileDrive = typeof file$1[0] === "string" && /^[a-z]:$/i.test(file$1[0]);
			const fileUNC = !fileDrive && file$1[0] === "" && file$1[1] === "" && file$1[2] === "?" && /^[a-z]:$/i.test(file$1[3]);
			const patternDrive = typeof pattern$1[0] === "string" && /^[a-z]:$/i.test(pattern$1[0]);
			const patternUNC = !patternDrive && pattern$1[0] === "" && pattern$1[1] === "" && pattern$1[2] === "?" && typeof pattern$1[3] === "string" && /^[a-z]:$/i.test(pattern$1[3]);
			const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
			const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
			if (typeof fdi === "number" && typeof pdi === "number") {
				const [fd, pd] = [file$1[fdi], pattern$1[pdi]];
				if (fd.toLowerCase() === pd.toLowerCase()) {
					pattern$1[pdi] = fd;
					if (pdi > fdi) pattern$1 = pattern$1.slice(pdi);
					else if (fdi > pdi) file$1 = file$1.slice(fdi);
				}
			}
		}
		const { optimizationLevel = 1 } = this.options;
		if (optimizationLevel >= 2) file$1 = this.levelTwoFileOptimize(file$1);
		this.debug("matchOne", this, {
			file: file$1,
			pattern: pattern$1
		});
		this.debug("matchOne", file$1.length, pattern$1.length);
		for (var fi = 0, pi = 0, fl = file$1.length, pl = pattern$1.length; fi < fl && pi < pl; fi++, pi++) {
			this.debug("matchOne loop");
			var p$1 = pattern$1[pi];
			var f = file$1[fi];
			this.debug(pattern$1, p$1, f);
			/* c8 ignore start */
			if (p$1 === false) return false;
			/* c8 ignore stop */
			if (p$1 === GLOBSTAR) {
				this.debug("GLOBSTAR", [
					pattern$1,
					p$1,
					f
				]);
				var fr = fi;
				var pr = pi + 1;
				if (pr === pl) {
					this.debug("** at the end");
					for (; fi < fl; fi++) if (file$1[fi] === "." || file$1[fi] === ".." || !options.dot && file$1[fi].charAt(0) === ".") return false;
					return true;
				}
				while (fr < fl) {
					var swallowee = file$1[fr];
					this.debug("\nglobstar while", file$1, fr, pattern$1, pr, swallowee);
					if (this.matchOne(file$1.slice(fr), pattern$1.slice(pr), partial)) {
						this.debug("globstar found match!", fr, fl, swallowee);
						return true;
					} else {
						if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
							this.debug("dot detected!", file$1, fr, pattern$1, pr);
							break;
						}
						this.debug("globstar swallow a segment, and continue");
						fr++;
					}
				}
				/* c8 ignore start */
				if (partial) {
					this.debug("\n>>> no match, partial?", file$1, fr, pattern$1, pr);
					if (fr === fl) return true;
				}
				/* c8 ignore stop */
				return false;
			}
			let hit;
			if (typeof p$1 === "string") {
				hit = f === p$1;
				this.debug("string match", p$1, f, hit);
			} else {
				hit = p$1.test(f);
				this.debug("pattern match", p$1, f, hit);
			}
			if (!hit) return false;
		}
		if (fi === fl && pi === pl) return true;
		else if (fi === fl) return partial;
		else if (pi === pl) return fi === fl - 1 && file$1[fi] === "";
		else throw new Error("wtf?");
		/* c8 ignore stop */
	}
	braceExpand() {
		return braceExpand(this.pattern, this.options);
	}
	parse(pattern$1) {
		assertValidPattern(pattern$1);
		const options = this.options;
		if (pattern$1 === "**") return GLOBSTAR;
		if (pattern$1 === "") return "";
		let m;
		let fastTest = null;
		if (m = pattern$1.match(starRE)) fastTest = options.dot ? starTestDot : starTest;
		else if (m = pattern$1.match(starDotExtRE)) fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
		else if (m = pattern$1.match(qmarksRE)) fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
		else if (m = pattern$1.match(starDotStarRE)) fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
		else if (m = pattern$1.match(dotStarRE)) fastTest = dotStarTest;
		const re$1 = AST.fromGlob(pattern$1, this.options).toMMPattern();
		if (fastTest && typeof re$1 === "object") Reflect.defineProperty(re$1, "test", { value: fastTest });
		return re$1;
	}
	makeRe() {
		if (this.regexp || this.regexp === false) return this.regexp;
		const set = this.set;
		if (!set.length) {
			this.regexp = false;
			return this.regexp;
		}
		const options = this.options;
		const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
		const flags = new Set(options.nocase ? ["i"] : []);
		let re$1 = set.map((pattern$1) => {
			const pp = pattern$1.map((p$1) => {
				if (p$1 instanceof RegExp) for (const f of p$1.flags.split("")) flags.add(f);
				return typeof p$1 === "string" ? regExpEscape(p$1) : p$1 === GLOBSTAR ? GLOBSTAR : p$1._src;
			});
			pp.forEach((p$1, i) => {
				const next = pp[i + 1];
				const prev = pp[i - 1];
				if (p$1 !== GLOBSTAR || prev === GLOBSTAR) return;
				if (prev === void 0) if (next !== void 0 && next !== GLOBSTAR) pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
				else pp[i] = twoStar;
				else if (next === void 0) pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
				else if (next !== GLOBSTAR) {
					pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
					pp[i + 1] = GLOBSTAR;
				}
			});
			return pp.filter((p$1) => p$1 !== GLOBSTAR).join("/");
		}).join("|");
		const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
		re$1 = "^" + open + re$1 + close + "$";
		if (this.negate) re$1 = "^(?!" + re$1 + ").+$";
		try {
			this.regexp = new RegExp(re$1, [...flags].join(""));
		} catch (ex) {
			this.regexp = false;
		}
		/* c8 ignore stop */
		return this.regexp;
	}
	slashSplit(p$1) {
		if (this.preserveMultipleSlashes) return p$1.split("/");
		else if (this.isWindows && /^\/\/[^\/]+/.test(p$1)) return ["", ...p$1.split(/\/+/)];
		else return p$1.split(/\/+/);
	}
	match(f, partial = this.partial) {
		this.debug("match", f, this.pattern);
		if (this.comment) return false;
		if (this.empty) return f === "";
		if (f === "/" && partial) return true;
		const options = this.options;
		if (this.isWindows) f = f.split("\\").join("/");
		const ff = this.slashSplit(f);
		this.debug(this.pattern, "split", ff);
		const set = this.set;
		this.debug(this.pattern, "set", set);
		let filename = ff[ff.length - 1];
		if (!filename) for (let i = ff.length - 2; !filename && i >= 0; i--) filename = ff[i];
		for (let i = 0; i < set.length; i++) {
			const pattern$1 = set[i];
			let file$1 = ff;
			if (options.matchBase && pattern$1.length === 1) file$1 = [filename];
			const hit = this.matchOne(file$1, pattern$1, partial);
			if (hit) {
				if (options.flipNegate) return true;
				return !this.negate;
			}
		}
		if (options.flipNegate) return false;
		return this.negate;
	}
	static defaults(def) {
		return minimatch.defaults(def).Minimatch;
	}
};
/* c8 ignore stop */
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

//#endregion
//#region ../../node_modules/.pnpm/dree@5.1.5/node_modules/dree/bundled/lib/esm/index.esm.js
var re = ((n) => (n.DIRECTORY = "directory", n.FILE = "file", n))(re || {}), ne = ((l) => (l.ALPHABETICAL = "alpha", l.ALPHABETICAL_REVERSE = "antialpha", l.ALPHABETICAL_INSENSITIVE = "alpha-insensitive", l.ALPHABETICAL_INSENSITIVE_REVERSE = "antialpha-insensitive", l))(ne || {}), se = ((a) => (a.ALPHABETICAL = "alpha", a.ALPHABETICAL_REVERSE = "antialpha", a.ALPHABETICAL_INSENSITIVE = "alpha-insensitive", a.ALPHABETICAL_INSENSITIVE_REVERSE = "antialpha-insensitive", a.FOLDERS_FIRST = "folders-first", a.FILES_FIRST = "files-first", a))(se || {}), p = {
	stat: !1,
	normalize: !1,
	symbolicLinks: !0,
	followLinks: !1,
	sizeInBytes: !0,
	size: !0,
	hash: !0,
	hashAlgorithm: "md5",
	hashEncoding: "hex",
	showHidden: !0,
	depth: void 0,
	exclude: void 0,
	matches: void 0,
	extensions: void 0,
	emptyDirectory: !1,
	excludeEmptyDirectories: !1,
	descendants: !1,
	descendantsIgnoreDirectories: !1,
	sorted: !1,
	postSorted: !1,
	homeShortcut: !1,
	skipErrors: !0
}, ie = {
	dirChild: "─> ",
	fileChild: "── ",
	forkChild: "├",
	lastChild: "└",
	linkChild: ">>",
	tabIndent: "    ",
	pipeIndent: "│   "
}, be = {
	dirChild: "-\\ ",
	fileChild: "-- ",
	forkChild: "|",
	lastChild: "`",
	linkChild: "->",
	tabIndent: "    ",
	pipeIndent: "|   "
}, B = {
	symbolicLinks: !0,
	followLinks: !1,
	showHidden: !0,
	depth: void 0,
	exclude: void 0,
	extensions: void 0,
	sorted: !1,
	postSorted: !1,
	homeShortcut: !1,
	symbols: ie,
	skipErrors: !0
};
function w(r, t) {
	return resolve$1(t.homeShortcut ? r.replace(/^~($|\/|\\)/, homedir() + "$1") : r);
}
function S(r) {
	return (Array.isArray(r) ? r : [r]).map((t) => t instanceof RegExp ? t : makeRe(t, { dot: !0 })).filter((t) => t instanceof RegExp);
}
function V(r) {
	let t = {};
	if (r) {
		for (let n in p) t[n] = r[n] !== void 0 ? r[n] : p[n];
		t.depth < 0 && (t.depth = 0);
	} else t = p;
	return t;
}
function C(r) {
	let t = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	], n;
	for (n = 0; n < t.length && r > 1e3; n++) r /= 1e3;
	return Math.round(r * 100) / 100 + " " + t[n];
}
function x(r, t) {
	return r.localeCompare(t);
}
function A(r, t) {
	return r.toLowerCase().localeCompare(t.toLowerCase());
}
function k(r, t) {
	if (!t) return r;
	if (t === !0) return r.sort(x);
	if (typeof t == "string") switch (t) {
		case "alpha": return r.sort(x);
		case "antialpha": return r.sort(x).reverse();
		case "alpha-insensitive": return r.sort(A);
		case "antialpha-insensitive": return r.sort(A).reverse();
		default: return r;
	}
	else if (typeof t == "function") return r.sort(t);
}
function z(r, t) {
	return x(r.name, t.name);
}
function Y(r, t) {
	return A(r.name, t.name);
}
function le(r, t) {
	return r.type === "directory" && t.type === "file" ? -1 : r.type === "file" && t.type === "directory" ? 1 : 0;
}
function ae(r, t) {
	return r.type === "file" && t.type === "directory" ? -1 : r.type === "directory" && t.type === "file" ? 1 : 0;
}
function $(r, t) {
	if (!t) return r;
	if (t === !0) return r.sort(z);
	if (typeof t == "string") switch (t) {
		case "alpha": return r.sort(z);
		case "antialpha": return r.sort(z).reverse();
		case "alpha-insensitive": return r.sort(Y);
		case "antialpha-insensitive": return r.sort(Y).reverse();
		case "folders-first": return r.sort(le);
		case "files-first": return r.sort(ae);
		default: return r;
	}
	else if (typeof t == "function") return r.sort(t);
}
async function G(r, t, n, e, l, o) {
	if (e.depth !== void 0 && n > e.depth) return null;
	let a = r === t ? "." : relative$1(r, t);
	if (e.exclude && r !== t && S(e.exclude).some((b) => b.test(`/${a}`))) return null;
	let s = basename(t), h;
	try {
		h = await stat(t);
	} catch (c) {
		if (e.skipErrors) return null;
		throw c;
	}
	let i;
	try {
		i = await lstat(t);
	} catch (c) {
		if (e.skipErrors) return null;
		throw c;
	}
	let m = i.isSymbolicLink(), g = h.isFile() ? "file" : "directory";
	if (!e.showHidden && s.charAt(0) === "." || !e.symbolicLinks && m) return null;
	let E;
	if (e.hash) {
		let c = e.hashAlgorithm;
		E = createHash(c), E.update(s);
	}
	let u = {
		name: s,
		path: e.normalize ? t.replace(/\\/g, "/") : t,
		relativePath: e.normalize ? a.replace(/\\/g, "/") : a,
		type: g,
		isSymbolicLink: m,
		stat: e.followLinks ? h : i
	};
	switch (e.stat || delete u.stat, g) {
		case "directory":
			let c = [], b;
			if (e.followLinks || !m) {
				try {
					b = await readdir(t), b = k(b, e.sorted);
				} catch (d) {
					if (e.skipErrors) return null;
					throw d;
				}
				if (e.emptyDirectory && (u.isEmpty = !b.length), c = await Promise.all(b.map(async (d) => await G(r, resolve$1(t, d), n + 1, e, l, o))), c = c.filter((d) => d !== null), e.excludeEmptyDirectories && !c.length) return null;
			}
			if (e.matches && r !== t) {
				let d = S(e.matches);
				if (!c.length && d.some((f) => !f.test(`/${a}`))) return null;
			}
			if (e.sizeInBytes || e.size) {
				let d = c.reduce((f, y) => f + y.sizeInBytes, 0);
				u.sizeInBytes = d, u.size = e.size ? C(d) : void 0, e.sizeInBytes || c.forEach((f) => f.sizeInBytes = void 0);
			}
			if (e.hash) {
				c.forEach((f) => {
					E.update(f.hash);
				});
				let d = e.hashEncoding;
				u.hash = E.digest(d);
			}
			e.descendants && (u.descendants = c.reduce((d, f) => d + (f.type === "directory" && e.descendantsIgnoreDirectories ? 0 : 1) + (f.descendants ?? 0), 0)), c.length && (u.children = e.postSorted ? $(c, e.postSorted) : c);
			break;
		case "file":
			if (u.extension = extname(t).replace(".", ""), e.extensions && e.extensions.indexOf(u.extension) === -1 || e.matches && r !== t && S(e.matches).some((f) => !f.test(`/${a}`))) return null;
			if (e.sizeInBytes || e.size) {
				let d = e.followLinks ? h.size : i.size;
				u.sizeInBytes = d, u.size = e.size ? C(d) : void 0;
			}
			if (e.hash) {
				let d;
				try {
					d = await readFile(t);
				} catch (y) {
					if (e.skipErrors) return null;
					throw y;
				}
				E.update(d);
				let f = e.hashEncoding;
				u.hash = E.digest(f);
			}
			break;
		default: return null;
	}
	return l && g === "file" ? await l(u, e.followLinks ? h : i) : o && g === "directory" && await o(u, e.followLinks ? h : i), u;
}
async function Ie(r, t, n, e) {
	let l = V(t), o = w(r, l), a = await G(o, o, 0, l, n, e);
	return a && (a.sizeInBytes = l.sizeInBytes ? a.sizeInBytes : void 0), a;
}

//#endregion
//#region src/routes/index.ts
function getRouteFunctions({ config }) {
	const routesDir = `${config.root}/src/routes`;
	return { getRoutes: async () => {
		const routes = await Ie(routesDir, { extensions: ["tsx"] });
		return routes;
	} };
}

//#endregion
//#region src/npm/index.ts
async function detectPackageManager(projectRoot) {
	try {
		if (await fsp.access(path.join(projectRoot, "pnpm-lock.yaml")).then(() => true).catch(() => false)) return "pnpm";
		if (await fsp.access(path.join(projectRoot, "yarn.lock")).then(() => true).catch(() => false)) return "yarn";
		if (await fsp.access(path.join(projectRoot, "package-lock.json")).then(() => true).catch(() => false)) return "npm";
		return "pnpm";
	} catch {
		return "pnpm";
	}
}
function getNpmFunctions({ config }) {
	return {
		async getQwikPackages() {
			const pathToPackageJson = config.configFileDependencies.find((file$1) => file$1.endsWith("package.json"));
			if (!pathToPackageJson) return [];
			try {
				const pkgJson = await fsp.readFile(pathToPackageJson, "utf-8");
				const pkg = JSON.parse(pkgJson);
				return Object.entries(pkg.devDependencies).filter(([key]) => /@qwik/i.test(key));
			} catch (error) {
				return [];
			}
		},
		async installPackage(packageName, isDev = true) {
			try {
				const projectRoot = path.dirname(config.configFileDependencies[0]);
				const pm = await detectPackageManager(projectRoot);
				const devFlag = isDev ? pm === "npm" ? "--save-dev" : "-D" : "";
				const command = {
					npm: `npm install ${devFlag} ${packageName}`,
					pnpm: `pnpm add ${devFlag} ${packageName}`,
					yarn: `yarn add ${devFlag} ${packageName}`
				}[pm];
				execSync(command, {
					cwd: projectRoot,
					stdio: "pipe"
				});
				return { success: true };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error occurred"
				};
			}
		}
	};
}

//#endregion
//#region src/components/index.ts
const getComponentsFunctions = ({ config }) => {
	const getComponentName = (code) => {
		const exportDefaultRegex = /export\s+default\s+component\$\(\s*.*\s*\);/;
		if (exportDefaultRegex.test(code)) return "default";
		const namedExportRegex = /export\s+(const|let|var|function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*component\$\(/;
		const match$1 = code.match(namedExportRegex);
		return match$1 ? match$1[2] : "default";
	};
	const getComponents = async () => {
		const components = [];
		const filesOnSrc = await (0, import_out.default)(`${config.root}/src/**/*.tsx`, { onlyFiles: true });
		const componentsFiles = filesOnSrc.filter((file$1) => !file$1.includes("/src/routes/"));
		const componentsSourceCode = await Promise.all(componentsFiles.map(async (file$1) => {
			const sourceCode = await fsp.readFile(file$1, "utf-8");
			return {
				file: file$1,
				sourceCode
			};
		}));
		for (const { sourceCode, file: file$1 } of componentsSourceCode) {
			if (!sourceCode.includes("component$")) continue;
			const name = getComponentName(sourceCode);
			components.push({
				fileName: file$1.split("/").pop(),
				name,
				file: file$1
			});
		}
		return Promise.resolve(components);
	};
	return { getComponents };
};

//#endregion
//#region src/inspect/index.ts
function getInspectFunctions(ctx) {
	return { getComponentInfo: async (file$1, id) => {
		return {
			file: file$1,
			id
		};
	} };
}

//#endregion
//#region src/rpc/index.ts
function getServerFunctions(ctx) {
	return {
		healthCheck: () => true,
		...getAssetsFunctions(ctx),
		...getComponentsFunctions(ctx),
		...getRouteFunctions(ctx),
		...getNpmFunctions(ctx),
		...getInspectFunctions(ctx)
	};
}

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/double-indexed-kv.js
var DoubleIndexedKV = class {
	constructor() {
		this.keyToValue = new Map();
		this.valueToKey = new Map();
	}
	set(key, value) {
		this.keyToValue.set(key, value);
		this.valueToKey.set(value, key);
	}
	getByKey(key) {
		return this.keyToValue.get(key);
	}
	getByValue(value) {
		return this.valueToKey.get(value);
	}
	clear() {
		this.keyToValue.clear();
		this.valueToKey.clear();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/registry.js
var Registry = class {
	constructor(generateIdentifier) {
		this.generateIdentifier = generateIdentifier;
		this.kv = new DoubleIndexedKV();
	}
	register(value, identifier$1) {
		if (this.kv.getByValue(value)) return;
		if (!identifier$1) identifier$1 = this.generateIdentifier(value);
		this.kv.set(identifier$1, value);
	}
	clear() {
		this.kv.clear();
	}
	getIdentifier(value) {
		return this.kv.getByValue(value);
	}
	getValue(identifier$1) {
		return this.kv.getByKey(identifier$1);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/class-registry.js
var ClassRegistry = class extends Registry {
	constructor() {
		super((c) => c.name);
		this.classToAllowedProps = new Map();
	}
	register(value, options) {
		if (typeof options === "object") {
			if (options.allowProps) this.classToAllowedProps.set(value, options.allowProps);
			super.register(value, options.identifier);
		} else super.register(value, options);
	}
	getAllowedProps(value) {
		return this.classToAllowedProps.get(value);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/util.js
function valuesOfObj(record) {
	if ("values" in Object) return Object.values(record);
	const values = [];
	for (const key in record) if (record.hasOwnProperty(key)) values.push(record[key]);
	return values;
}
function find(record, predicate) {
	const values = valuesOfObj(record);
	if ("find" in values) return values.find(predicate);
	const valuesNotNever = values;
	for (let i = 0; i < valuesNotNever.length; i++) {
		const value = valuesNotNever[i];
		if (predicate(value)) return value;
	}
	return void 0;
}
function forEach(record, run) {
	Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
	return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
	for (let i = 0; i < record.length; i++) {
		const value = record[i];
		if (predicate(value)) return value;
	}
	return void 0;
}

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/custom-transformer-registry.js
var CustomTransformerRegistry = class {
	constructor() {
		this.transfomers = {};
	}
	register(transformer) {
		this.transfomers[transformer.name] = transformer;
	}
	findApplicable(v) {
		return find(this.transfomers, (transformer) => transformer.isApplicable(v));
	}
	findByName(name) {
		return this.transfomers[name];
	}
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/is.js
const getType$2 = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
const isUndefined$1 = (payload) => typeof payload === "undefined";
const isNull$1 = (payload) => payload === null;
const isPlainObject$2 = (payload) => {
	if (typeof payload !== "object" || payload === null) return false;
	if (payload === Object.prototype) return false;
	if (Object.getPrototypeOf(payload) === null) return true;
	return Object.getPrototypeOf(payload) === Object.prototype;
};
const isEmptyObject = (payload) => isPlainObject$2(payload) && Object.keys(payload).length === 0;
const isArray$1 = (payload) => Array.isArray(payload);
const isString = (payload) => typeof payload === "string";
const isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
const isBoolean = (payload) => typeof payload === "boolean";
const isRegExp$1 = (payload) => payload instanceof RegExp;
const isMap = (payload) => payload instanceof Map;
const isSet = (payload) => payload instanceof Set;
const isSymbol = (payload) => getType$2(payload) === "Symbol";
const isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
const isError = (payload) => payload instanceof Error;
const isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
const isPrimitive = (payload) => isBoolean(payload) || isNull$1(payload) || isUndefined$1(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
const isBigint = (payload) => typeof payload === "bigint";
const isInfinite = (payload) => payload === Infinity || payload === -Infinity;
const isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
const isURL = (payload) => payload instanceof URL;

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/pathstringifier.js
const escapeKey = (key) => key.replace(/\./g, "\\.");
const stringifyPath = (path$12) => path$12.map(String).map(escapeKey).join(".");
const parsePath = (string$1) => {
	const result = [];
	let segment = "";
	for (let i = 0; i < string$1.length; i++) {
		let char = string$1.charAt(i);
		const isEscapedDot = char === "\\" && string$1.charAt(i + 1) === ".";
		if (isEscapedDot) {
			segment += ".";
			i++;
			continue;
		}
		const isEndOfSegment = char === ".";
		if (isEndOfSegment) {
			result.push(segment);
			segment = "";
			continue;
		}
		segment += char;
	}
	const lastSegment = segment;
	result.push(lastSegment);
	return result;
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/transformer.js
function simpleTransformation(isApplicable, annotation, transform$1, untransform) {
	return {
		isApplicable,
		annotation,
		transform: transform$1,
		untransform
	};
}
const simpleRules = [
	simpleTransformation(isUndefined$1, "undefined", () => null, () => void 0),
	simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
		if (typeof BigInt !== "undefined") return BigInt(v);
		console.error("Please add a BigInt polyfill.");
		return v;
	}),
	simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
	simpleTransformation(isError, "Error", (v, superJson) => {
		const baseError = {
			name: v.name,
			message: v.message
		};
		superJson.allowedErrorProps.forEach((prop) => {
			baseError[prop] = v[prop];
		});
		return baseError;
	}, (v, superJson) => {
		const e = new Error(v.message);
		e.name = v.name;
		e.stack = v.stack;
		superJson.allowedErrorProps.forEach((prop) => {
			e[prop] = v[prop];
		});
		return e;
	}),
	simpleTransformation(isRegExp$1, "regexp", (v) => "" + v, (regex) => {
		const body = regex.slice(1, regex.lastIndexOf("/"));
		const flags = regex.slice(regex.lastIndexOf("/") + 1);
		return new RegExp(body, flags);
	}),
	simpleTransformation(
		isSet,
		"set",
		// (sets only exist in es6+)
		// eslint-disable-next-line es5/no-es6-methods
		(v) => [...v.values()],
		(v) => new Set(v)
),
	simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
	simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
		if (isNaNValue(v)) return "NaN";
		if (v > 0) return "Infinity";
		else return "-Infinity";
	}, Number),
	simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
		return "-0";
	}, Number),
	simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform$1, untransform) {
	return {
		isApplicable,
		annotation,
		transform: transform$1,
		untransform
	};
}
const symbolRule = compositeTransformation((s, superJson) => {
	if (isSymbol(s)) {
		const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
		return isRegistered;
	}
	return false;
}, (s, superJson) => {
	const identifier$1 = superJson.symbolRegistry.getIdentifier(s);
	return ["symbol", identifier$1];
}, (v) => v.description, (_, a, superJson) => {
	const value = superJson.symbolRegistry.getValue(a[1]);
	if (!value) throw new Error("Trying to deserialize unknown symbol");
	return value;
});
const constructorToName = [
	Int8Array,
	Uint8Array,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array,
	Uint8ClampedArray
].reduce((obj, ctor) => {
	obj[ctor.name] = ctor;
	return obj;
}, {});
const typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
	const ctor = constructorToName[a[1]];
	if (!ctor) throw new Error("Trying to deserialize unknown typed array");
	return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
	if (potentialClass?.constructor) {
		const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
		return isRegistered;
	}
	return false;
}
const classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
	const identifier$1 = superJson.classRegistry.getIdentifier(clazz.constructor);
	return ["class", identifier$1];
}, (clazz, superJson) => {
	const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
	if (!allowedProps) return { ...clazz };
	const result = {};
	allowedProps.forEach((prop) => {
		result[prop] = clazz[prop];
	});
	return result;
}, (v, a, superJson) => {
	const clazz = superJson.classRegistry.getValue(a[1]);
	if (!clazz) throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
	return Object.assign(Object.create(clazz.prototype), v);
});
const customRule = compositeTransformation((value, superJson) => {
	return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
	const transformer = superJson.customTransformerRegistry.findApplicable(value);
	return ["custom", transformer.name];
}, (value, superJson) => {
	const transformer = superJson.customTransformerRegistry.findApplicable(value);
	return transformer.serialize(value);
}, (v, a, superJson) => {
	const transformer = superJson.customTransformerRegistry.findByName(a[1]);
	if (!transformer) throw new Error("Trying to deserialize unknown custom value");
	return transformer.deserialize(v);
});
const compositeRules = [
	classRule,
	symbolRule,
	customRule,
	typedArrayRule
];
const transformValue = (value, superJson) => {
	const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
	if (applicableCompositeRule) return {
		value: applicableCompositeRule.transform(value, superJson),
		type: applicableCompositeRule.annotation(value, superJson)
	};
	const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
	if (applicableSimpleRule) return {
		value: applicableSimpleRule.transform(value, superJson),
		type: applicableSimpleRule.annotation
	};
	return void 0;
};
const simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
	simpleRulesByAnnotation[rule.annotation] = rule;
});
const untransformValue = (json, type, superJson) => {
	if (isArray$1(type)) switch (type[0]) {
		case "symbol": return symbolRule.untransform(json, type, superJson);
		case "class": return classRule.untransform(json, type, superJson);
		case "custom": return customRule.untransform(json, type, superJson);
		case "typed-array": return typedArrayRule.untransform(json, type, superJson);
		default: throw new Error("Unknown transformation: " + type);
	}
	else {
		const transformation = simpleRulesByAnnotation[type];
		if (!transformation) throw new Error("Unknown transformation: " + type);
		return transformation.untransform(json, superJson);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/accessDeep.js
const getNthKey = (value, n) => {
	if (n > value.size) throw new Error("index out of bounds");
	const keys$1 = value.keys();
	while (n > 0) {
		keys$1.next();
		n--;
	}
	return keys$1.next().value;
};
function validatePath(path$12) {
	if (includes(path$12, "__proto__")) throw new Error("__proto__ is not allowed as a property");
	if (includes(path$12, "prototype")) throw new Error("prototype is not allowed as a property");
	if (includes(path$12, "constructor")) throw new Error("constructor is not allowed as a property");
}
const getDeep = (object, path$12) => {
	validatePath(path$12);
	for (let i = 0; i < path$12.length; i++) {
		const key = path$12[i];
		if (isSet(object)) object = getNthKey(object, +key);
		else if (isMap(object)) {
			const row = +key;
			const type = +path$12[++i] === 0 ? "key" : "value";
			const keyOfRow = getNthKey(object, row);
			switch (type) {
				case "key":
					object = keyOfRow;
					break;
				case "value":
					object = object.get(keyOfRow);
					break;
			}
		} else object = object[key];
	}
	return object;
};
const setDeep = (object, path$12, mapper) => {
	validatePath(path$12);
	if (path$12.length === 0) return mapper(object);
	let parent = object;
	for (let i = 0; i < path$12.length - 1; i++) {
		const key = path$12[i];
		if (isArray$1(parent)) {
			const index = +key;
			parent = parent[index];
		} else if (isPlainObject$2(parent)) parent = parent[key];
		else if (isSet(parent)) {
			const row = +key;
			parent = getNthKey(parent, row);
		} else if (isMap(parent)) {
			const isEnd = i === path$12.length - 2;
			if (isEnd) break;
			const row = +key;
			const type = +path$12[++i] === 0 ? "key" : "value";
			const keyOfRow = getNthKey(parent, row);
			switch (type) {
				case "key":
					parent = keyOfRow;
					break;
				case "value":
					parent = parent.get(keyOfRow);
					break;
			}
		}
	}
	const lastKey = path$12[path$12.length - 1];
	if (isArray$1(parent)) parent[+lastKey] = mapper(parent[+lastKey]);
	else if (isPlainObject$2(parent)) parent[lastKey] = mapper(parent[lastKey]);
	if (isSet(parent)) {
		const oldValue = getNthKey(parent, +lastKey);
		const newValue = mapper(oldValue);
		if (oldValue !== newValue) {
			parent.delete(oldValue);
			parent.add(newValue);
		}
	}
	if (isMap(parent)) {
		const row = +path$12[path$12.length - 2];
		const keyToRow = getNthKey(parent, row);
		const type = +lastKey === 0 ? "key" : "value";
		switch (type) {
			case "key": {
				const newKey = mapper(keyToRow);
				parent.set(newKey, parent.get(keyToRow));
				if (newKey !== keyToRow) parent.delete(keyToRow);
				break;
			}
			case "value": {
				parent.set(keyToRow, mapper(parent.get(keyToRow)));
				break;
			}
		}
	}
	return object;
};

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/plainer.js
function traverse$2(tree, walker$1, origin = []) {
	if (!tree) return;
	if (!isArray$1(tree)) {
		forEach(tree, (subtree, key) => traverse$2(subtree, walker$1, [...origin, ...parsePath(key)]));
		return;
	}
	const [nodeValue, children] = tree;
	if (children) forEach(children, (child, key) => {
		traverse$2(child, walker$1, [...origin, ...parsePath(key)]);
	});
	walker$1(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
	traverse$2(annotations, (type, path$12) => {
		plain = setDeep(plain, path$12, (v) => untransformValue(v, type, superJson));
	});
	return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
	function apply(identicalPaths, path$12) {
		const object = getDeep(plain, parsePath(path$12));
		identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
			plain = setDeep(plain, identicalObjectPath, () => object);
		});
	}
	if (isArray$1(annotations)) {
		const [root, other] = annotations;
		root.forEach((identicalPath) => {
			plain = setDeep(plain, parsePath(identicalPath), () => plain);
		});
		if (other) forEach(other, apply);
	} else forEach(annotations, apply);
	return plain;
}
const isDeep = (object, superJson) => isPlainObject$2(object) || isArray$1(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path$12, identities) {
	const existingSet = identities.get(object);
	if (existingSet) existingSet.push(path$12);
	else identities.set(object, [path$12]);
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
	const result = {};
	let rootEqualityPaths = void 0;
	identitites.forEach((paths) => {
		if (paths.length <= 1) return;
		if (!dedupe) paths = paths.map((path$12) => path$12.map(String)).sort((a, b) => a.length - b.length);
		const [representativePath, ...identicalPaths] = paths;
		if (representativePath.length === 0) rootEqualityPaths = identicalPaths.map(stringifyPath);
		else result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
	});
	if (rootEqualityPaths) if (isEmptyObject(result)) return [rootEqualityPaths];
	else return [rootEqualityPaths, result];
	else return isEmptyObject(result) ? void 0 : result;
}
const walker = (object, identities, superJson, dedupe, path$12 = [], objectsInThisPath = [], seenObjects = new Map()) => {
	const primitive = isPrimitive(object);
	if (!primitive) {
		addIdentity(object, path$12, identities);
		const seen = seenObjects.get(object);
		if (seen) return dedupe ? { transformedValue: null } : seen;
	}
	if (!isDeep(object, superJson)) {
		const transformed$1 = transformValue(object, superJson);
		const result$1 = transformed$1 ? {
			transformedValue: transformed$1.value,
			annotations: [transformed$1.type]
		} : { transformedValue: object };
		if (!primitive) seenObjects.set(object, result$1);
		return result$1;
	}
	if (includes(objectsInThisPath, object)) return { transformedValue: null };
	const transformationResult = transformValue(object, superJson);
	const transformed = transformationResult?.value ?? object;
	const transformedValue = isArray$1(transformed) ? [] : {};
	const innerAnnotations = {};
	forEach(transformed, (value, index) => {
		if (index === "__proto__" || index === "constructor" || index === "prototype") throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
		const recursiveResult = walker(value, identities, superJson, dedupe, [...path$12, index], [...objectsInThisPath, object], seenObjects);
		transformedValue[index] = recursiveResult.transformedValue;
		if (isArray$1(recursiveResult.annotations)) innerAnnotations[index] = recursiveResult.annotations;
		else if (isPlainObject$2(recursiveResult.annotations)) forEach(recursiveResult.annotations, (tree, key) => {
			innerAnnotations[escapeKey(index) + "." + key] = tree;
		});
	});
	const result = isEmptyObject(innerAnnotations) ? {
		transformedValue,
		annotations: !!transformationResult ? [transformationResult.type] : void 0
	} : {
		transformedValue,
		annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
	};
	if (!primitive) seenObjects.set(object, result);
	return result;
};

//#endregion
//#region ../../node_modules/.pnpm/is-what@4.1.16/node_modules/is-what/dist/index.js
function getType$1(payload) {
	return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray(payload) {
	return getType$1(payload) === "Array";
}
function isPlainObject$1(payload) {
	if (getType$1(payload) !== "Object") return false;
	const prototype = Object.getPrototypeOf(payload);
	return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function isNull(payload) {
	return getType$1(payload) === "Null";
}
function isOneOf(a, b, c, d, e) {
	return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
function isUndefined(payload) {
	return getType$1(payload) === "Undefined";
}
const isNullOrUndefined = isOneOf(isNull, isUndefined);

//#endregion
//#region ../../node_modules/.pnpm/copy-anything@3.0.5/node_modules/copy-anything/dist/index.js
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
	const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
	if (propType === "enumerable") carry[key] = newVal;
	if (includeNonenumerable && propType === "nonenumerable") Object.defineProperty(carry, key, {
		value: newVal,
		enumerable: false,
		writable: true,
		configurable: true
	});
}
function copy(target$1, options = {}) {
	if (isArray(target$1)) return target$1.map((item) => copy(item, options));
	if (!isPlainObject$1(target$1)) return target$1;
	const props = Object.getOwnPropertyNames(target$1);
	const symbols = Object.getOwnPropertySymbols(target$1);
	return [...props, ...symbols].reduce((carry, key) => {
		if (isArray(options.props) && !options.props.includes(key)) return carry;
		const val = target$1[key];
		const newVal = copy(val, options);
		assignProp(carry, key, newVal, target$1, options.nonenumerable);
		return carry;
	}, {});
}

//#endregion
//#region ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.js
var SuperJSON = class {
	/**
	* @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
	*/
	constructor({ dedupe = false } = {}) {
		this.classRegistry = new ClassRegistry();
		this.symbolRegistry = new Registry((s) => s.description ?? "");
		this.customTransformerRegistry = new CustomTransformerRegistry();
		this.allowedErrorProps = [];
		this.dedupe = dedupe;
	}
	serialize(object) {
		const identities = new Map();
		const output = walker(object, identities, this, this.dedupe);
		const res = { json: output.transformedValue };
		if (output.annotations) res.meta = {
			...res.meta,
			values: output.annotations
		};
		const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
		if (equalityAnnotations) res.meta = {
			...res.meta,
			referentialEqualities: equalityAnnotations
		};
		return res;
	}
	deserialize(payload) {
		const { json, meta } = payload;
		let result = copy(json);
		if (meta?.values) result = applyValueAnnotations(result, meta.values, this);
		if (meta?.referentialEqualities) result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
		return result;
	}
	stringify(object) {
		return JSON.stringify(this.serialize(object));
	}
	parse(string$1) {
		return this.deserialize(JSON.parse(string$1));
	}
	registerClass(v, options) {
		this.classRegistry.register(v, options);
	}
	registerSymbol(v, identifier$1) {
		this.symbolRegistry.register(v, identifier$1);
	}
	registerCustom(transformer, name) {
		this.customTransformerRegistry.register({
			name,
			...transformer
		});
	}
	allowErrorProps(...props) {
		this.allowedErrorProps.push(...props);
	}
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
const serialize = SuperJSON.serialize;
const deserialize = SuperJSON.deserialize;
const stringify = SuperJSON.stringify;
const parse$1 = SuperJSON.parse;
const registerClass = SuperJSON.registerClass;
const registerCustom = SuperJSON.registerCustom;
const registerSymbol = SuperJSON.registerSymbol;
const allowErrorProps = SuperJSON.allowErrorProps;

//#endregion
//#region ../../node_modules/.pnpm/birpc@0.2.19/node_modules/birpc/dist/index.mjs
const DEFAULT_TIMEOUT = 6e4;
function defaultSerialize(i) {
	return i;
}
const defaultDeserialize = defaultSerialize;
const { clearTimeout, setTimeout: setTimeout$1 } = globalThis;
const random = Math.random.bind(Math);
function createBirpc(functions, options) {
	const { post, on, off = () => {}, eventNames = [], serialize: serialize$1 = defaultSerialize, deserialize: deserialize$1 = defaultDeserialize, resolver, bind = "rpc", timeout = DEFAULT_TIMEOUT } = options;
	const rpcPromiseMap = /* @__PURE__ */ new Map();
	let _promise;
	let closed = false;
	const rpc = new Proxy({}, { get(_, method) {
		if (method === "$functions") return functions;
		if (method === "$close") return close;
		if (method === "then" && !eventNames.includes("then") && !("then" in functions)) return void 0;
		const sendEvent = (...args) => {
			post(serialize$1({
				m: method,
				a: args,
				t: "q"
			}));
		};
		if (eventNames.includes(method)) {
			sendEvent.asEvent = sendEvent;
			return sendEvent;
		}
		const sendCall = async (...args) => {
			if (closed) throw new Error(`[birpc] rpc is closed, cannot call "${method}"`);
			if (_promise) try {
				await _promise;
			} finally {
				_promise = void 0;
			}
			return new Promise((resolve$2, reject) => {
				const id = nanoid();
				let timeoutId;
				if (timeout >= 0) {
					timeoutId = setTimeout$1(() => {
						try {
							options.onTimeoutError?.(method, args);
							throw new Error(`[birpc] timeout on calling "${method}"`);
						} catch (e) {
							reject(e);
						}
						rpcPromiseMap.delete(id);
					}, timeout);
					if (typeof timeoutId === "object") timeoutId = timeoutId.unref?.();
				}
				rpcPromiseMap.set(id, {
					resolve: resolve$2,
					reject,
					timeoutId,
					method
				});
				post(serialize$1({
					m: method,
					a: args,
					i: id,
					t: "q"
				}));
			});
		};
		sendCall.asEvent = sendEvent;
		return sendCall;
	} });
	function close() {
		closed = true;
		rpcPromiseMap.forEach(({ reject, method }) => {
			reject(new Error(`[birpc] rpc is closed, cannot call "${method}"`));
		});
		rpcPromiseMap.clear();
		off(onMessage);
	}
	async function onMessage(data, ...extra) {
		const msg = deserialize$1(data);
		if (msg.t === "q") {
			const { m: method, a: args } = msg;
			let result, error;
			const fn = resolver ? resolver(method, functions[method]) : functions[method];
			if (!fn) error = new Error(`[birpc] function "${method}" not found`);
			else try {
				result = await fn.apply(bind === "rpc" ? rpc : functions, args);
			} catch (e) {
				error = e;
			}
			if (msg.i) {
				if (error && options.onError) options.onError(error, method, args);
				post(serialize$1({
					t: "s",
					i: msg.i,
					r: result,
					e: error
				}), ...extra);
			}
		} else {
			const { i: ack, r: result, e: error } = msg;
			const promise$1 = rpcPromiseMap.get(ack);
			if (promise$1) {
				clearTimeout(promise$1.timeoutId);
				if (error) promise$1.reject(error);
				else promise$1.resolve(result);
			}
			rpcPromiseMap.delete(ack);
		}
	}
	_promise = on(onMessage);
	return rpc;
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid(size = 21) {
	let id = "";
	let i = size;
	while (i--) id += urlAlphabet[random() * 64 | 0];
	return id;
}

//#endregion
//#region ../kit/src/constants.ts
const DEVTOOLS_VITE_MESSAGING_EVENT = "qwik_tools:vite_messaging_event";

//#endregion
//#region ../kit/src/shared.ts
const target = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : {};

//#endregion
//#region ../kit/src/globals.ts
const SERVER_CTX = "__qwik_server_ctx__";
const SERVER_RPC = "__qwik_server_rpc__";

//#endregion
//#region ../kit/src/context.ts
function getViteServerContext() {
	return target[SERVER_CTX];
}
function setViteServerContext(ctx) {
	target[SERVER_CTX] = ctx;
}
function setViteServerRpc(rpc) {
	target[SERVER_RPC] = rpc;
}

//#endregion
//#region ../kit/src/server.ts
function createServerRpc(functions) {
	const server = getViteServerContext();
	const rpc = createBirpc(functions, {
		post: (data) => server.ws.send(DEVTOOLS_VITE_MESSAGING_EVENT, SuperJSON.stringify(data)),
		on: (fn) => server.ws.on(DEVTOOLS_VITE_MESSAGING_EVENT, (data) => {
			fn(SuperJSON.parse(data));
		}),
		timeout: 12e4
	});
	setViteServerRpc(rpc);
}

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/shallowEqual.js
var require_shallowEqual = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/shallowEqual.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = shallowEqual;
	function shallowEqual(actual, expected) {
		const keys$1 = Object.keys(expected);
		for (const key of keys$1) if (actual[key] !== expected[key]) return false;
		return true;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/deprecationWarning.js
var require_deprecationWarning = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/deprecationWarning.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = deprecationWarning;
	const warnings = new Set();
	function deprecationWarning(oldName, newName, prefix = "") {
		if (warnings.has(oldName)) return;
		warnings.add(oldName);
		const { internal, trace } = captureShortStackTrace(1, 2);
		if (internal) return;
		console.warn(`${prefix}\`${oldName}\` has been deprecated, please migrate to \`${newName}\`\n${trace}`);
	}
	function captureShortStackTrace(skip, length) {
		const { stackTraceLimit, prepareStackTrace } = Error;
		let stackTrace;
		Error.stackTraceLimit = 1 + skip + length;
		Error.prepareStackTrace = function(err, stack) {
			stackTrace = stack;
		};
		new Error().stack;
		Error.stackTraceLimit = stackTraceLimit;
		Error.prepareStackTrace = prepareStackTrace;
		if (!stackTrace) return {
			internal: false,
			trace: ""
		};
		const shortStackTrace = stackTrace.slice(1 + skip, 1 + skip + length);
		return {
			internal: /[\\/]@babel[\\/]/.test(shortStackTrace[1].getFileName()),
			trace: shortStackTrace.map((frame) => `    at ${frame}`).join("\n")
		};
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/generated/index.js
var require_generated$3 = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/generated/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAccessor = isAccessor;
	exports.isAnyTypeAnnotation = isAnyTypeAnnotation;
	exports.isArgumentPlaceholder = isArgumentPlaceholder;
	exports.isArrayExpression = isArrayExpression;
	exports.isArrayPattern = isArrayPattern;
	exports.isArrayTypeAnnotation = isArrayTypeAnnotation;
	exports.isArrowFunctionExpression = isArrowFunctionExpression;
	exports.isAssignmentExpression = isAssignmentExpression;
	exports.isAssignmentPattern = isAssignmentPattern;
	exports.isAwaitExpression = isAwaitExpression;
	exports.isBigIntLiteral = isBigIntLiteral;
	exports.isBinary = isBinary;
	exports.isBinaryExpression = isBinaryExpression;
	exports.isBindExpression = isBindExpression;
	exports.isBlock = isBlock;
	exports.isBlockParent = isBlockParent;
	exports.isBlockStatement = isBlockStatement;
	exports.isBooleanLiteral = isBooleanLiteral;
	exports.isBooleanLiteralTypeAnnotation = isBooleanLiteralTypeAnnotation;
	exports.isBooleanTypeAnnotation = isBooleanTypeAnnotation;
	exports.isBreakStatement = isBreakStatement;
	exports.isCallExpression = isCallExpression;
	exports.isCatchClause = isCatchClause;
	exports.isClass = isClass;
	exports.isClassAccessorProperty = isClassAccessorProperty;
	exports.isClassBody = isClassBody;
	exports.isClassDeclaration = isClassDeclaration;
	exports.isClassExpression = isClassExpression;
	exports.isClassImplements = isClassImplements;
	exports.isClassMethod = isClassMethod;
	exports.isClassPrivateMethod = isClassPrivateMethod;
	exports.isClassPrivateProperty = isClassPrivateProperty;
	exports.isClassProperty = isClassProperty;
	exports.isCompletionStatement = isCompletionStatement;
	exports.isConditional = isConditional;
	exports.isConditionalExpression = isConditionalExpression;
	exports.isContinueStatement = isContinueStatement;
	exports.isDebuggerStatement = isDebuggerStatement;
	exports.isDecimalLiteral = isDecimalLiteral;
	exports.isDeclaration = isDeclaration;
	exports.isDeclareClass = isDeclareClass;
	exports.isDeclareExportAllDeclaration = isDeclareExportAllDeclaration;
	exports.isDeclareExportDeclaration = isDeclareExportDeclaration;
	exports.isDeclareFunction = isDeclareFunction;
	exports.isDeclareInterface = isDeclareInterface;
	exports.isDeclareModule = isDeclareModule;
	exports.isDeclareModuleExports = isDeclareModuleExports;
	exports.isDeclareOpaqueType = isDeclareOpaqueType;
	exports.isDeclareTypeAlias = isDeclareTypeAlias;
	exports.isDeclareVariable = isDeclareVariable;
	exports.isDeclaredPredicate = isDeclaredPredicate;
	exports.isDecorator = isDecorator;
	exports.isDirective = isDirective;
	exports.isDirectiveLiteral = isDirectiveLiteral;
	exports.isDoExpression = isDoExpression;
	exports.isDoWhileStatement = isDoWhileStatement;
	exports.isEmptyStatement = isEmptyStatement;
	exports.isEmptyTypeAnnotation = isEmptyTypeAnnotation;
	exports.isEnumBody = isEnumBody;
	exports.isEnumBooleanBody = isEnumBooleanBody;
	exports.isEnumBooleanMember = isEnumBooleanMember;
	exports.isEnumDeclaration = isEnumDeclaration;
	exports.isEnumDefaultedMember = isEnumDefaultedMember;
	exports.isEnumMember = isEnumMember;
	exports.isEnumNumberBody = isEnumNumberBody;
	exports.isEnumNumberMember = isEnumNumberMember;
	exports.isEnumStringBody = isEnumStringBody;
	exports.isEnumStringMember = isEnumStringMember;
	exports.isEnumSymbolBody = isEnumSymbolBody;
	exports.isExistsTypeAnnotation = isExistsTypeAnnotation;
	exports.isExportAllDeclaration = isExportAllDeclaration;
	exports.isExportDeclaration = isExportDeclaration;
	exports.isExportDefaultDeclaration = isExportDefaultDeclaration;
	exports.isExportDefaultSpecifier = isExportDefaultSpecifier;
	exports.isExportNamedDeclaration = isExportNamedDeclaration;
	exports.isExportNamespaceSpecifier = isExportNamespaceSpecifier;
	exports.isExportSpecifier = isExportSpecifier;
	exports.isExpression = isExpression;
	exports.isExpressionStatement = isExpressionStatement;
	exports.isExpressionWrapper = isExpressionWrapper;
	exports.isFile = isFile;
	exports.isFlow = isFlow;
	exports.isFlowBaseAnnotation = isFlowBaseAnnotation;
	exports.isFlowDeclaration = isFlowDeclaration;
	exports.isFlowPredicate = isFlowPredicate;
	exports.isFlowType = isFlowType;
	exports.isFor = isFor;
	exports.isForInStatement = isForInStatement;
	exports.isForOfStatement = isForOfStatement;
	exports.isForStatement = isForStatement;
	exports.isForXStatement = isForXStatement;
	exports.isFunction = isFunction;
	exports.isFunctionDeclaration = isFunctionDeclaration;
	exports.isFunctionExpression = isFunctionExpression;
	exports.isFunctionParent = isFunctionParent;
	exports.isFunctionTypeAnnotation = isFunctionTypeAnnotation;
	exports.isFunctionTypeParam = isFunctionTypeParam;
	exports.isGenericTypeAnnotation = isGenericTypeAnnotation;
	exports.isIdentifier = isIdentifier;
	exports.isIfStatement = isIfStatement;
	exports.isImmutable = isImmutable$1;
	exports.isImport = isImport;
	exports.isImportAttribute = isImportAttribute;
	exports.isImportDeclaration = isImportDeclaration;
	exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
	exports.isImportExpression = isImportExpression;
	exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
	exports.isImportOrExportDeclaration = isImportOrExportDeclaration;
	exports.isImportSpecifier = isImportSpecifier;
	exports.isIndexedAccessType = isIndexedAccessType;
	exports.isInferredPredicate = isInferredPredicate;
	exports.isInterfaceDeclaration = isInterfaceDeclaration;
	exports.isInterfaceExtends = isInterfaceExtends;
	exports.isInterfaceTypeAnnotation = isInterfaceTypeAnnotation;
	exports.isInterpreterDirective = isInterpreterDirective;
	exports.isIntersectionTypeAnnotation = isIntersectionTypeAnnotation;
	exports.isJSX = isJSX;
	exports.isJSXAttribute = isJSXAttribute;
	exports.isJSXClosingElement = isJSXClosingElement;
	exports.isJSXClosingFragment = isJSXClosingFragment;
	exports.isJSXElement = isJSXElement;
	exports.isJSXEmptyExpression = isJSXEmptyExpression;
	exports.isJSXExpressionContainer = isJSXExpressionContainer;
	exports.isJSXFragment = isJSXFragment;
	exports.isJSXIdentifier = isJSXIdentifier;
	exports.isJSXMemberExpression = isJSXMemberExpression;
	exports.isJSXNamespacedName = isJSXNamespacedName;
	exports.isJSXOpeningElement = isJSXOpeningElement;
	exports.isJSXOpeningFragment = isJSXOpeningFragment;
	exports.isJSXSpreadAttribute = isJSXSpreadAttribute;
	exports.isJSXSpreadChild = isJSXSpreadChild;
	exports.isJSXText = isJSXText;
	exports.isLVal = isLVal;
	exports.isLabeledStatement = isLabeledStatement;
	exports.isLiteral = isLiteral;
	exports.isLogicalExpression = isLogicalExpression;
	exports.isLoop = isLoop;
	exports.isMemberExpression = isMemberExpression;
	exports.isMetaProperty = isMetaProperty;
	exports.isMethod = isMethod;
	exports.isMiscellaneous = isMiscellaneous;
	exports.isMixedTypeAnnotation = isMixedTypeAnnotation;
	exports.isModuleDeclaration = isModuleDeclaration;
	exports.isModuleExpression = isModuleExpression;
	exports.isModuleSpecifier = isModuleSpecifier;
	exports.isNewExpression = isNewExpression;
	exports.isNoop = isNoop;
	exports.isNullLiteral = isNullLiteral;
	exports.isNullLiteralTypeAnnotation = isNullLiteralTypeAnnotation;
	exports.isNullableTypeAnnotation = isNullableTypeAnnotation;
	exports.isNumberLiteral = isNumberLiteral;
	exports.isNumberLiteralTypeAnnotation = isNumberLiteralTypeAnnotation;
	exports.isNumberTypeAnnotation = isNumberTypeAnnotation;
	exports.isNumericLiteral = isNumericLiteral;
	exports.isObjectExpression = isObjectExpression;
	exports.isObjectMember = isObjectMember;
	exports.isObjectMethod = isObjectMethod;
	exports.isObjectPattern = isObjectPattern;
	exports.isObjectProperty = isObjectProperty;
	exports.isObjectTypeAnnotation = isObjectTypeAnnotation;
	exports.isObjectTypeCallProperty = isObjectTypeCallProperty;
	exports.isObjectTypeIndexer = isObjectTypeIndexer;
	exports.isObjectTypeInternalSlot = isObjectTypeInternalSlot;
	exports.isObjectTypeProperty = isObjectTypeProperty;
	exports.isObjectTypeSpreadProperty = isObjectTypeSpreadProperty;
	exports.isOpaqueType = isOpaqueType;
	exports.isOptionalCallExpression = isOptionalCallExpression;
	exports.isOptionalIndexedAccessType = isOptionalIndexedAccessType;
	exports.isOptionalMemberExpression = isOptionalMemberExpression;
	exports.isParenthesizedExpression = isParenthesizedExpression;
	exports.isPattern = isPattern;
	exports.isPatternLike = isPatternLike;
	exports.isPipelineBareFunction = isPipelineBareFunction;
	exports.isPipelinePrimaryTopicReference = isPipelinePrimaryTopicReference;
	exports.isPipelineTopicExpression = isPipelineTopicExpression;
	exports.isPlaceholder = isPlaceholder;
	exports.isPrivate = isPrivate;
	exports.isPrivateName = isPrivateName;
	exports.isProgram = isProgram;
	exports.isProperty = isProperty;
	exports.isPureish = isPureish;
	exports.isQualifiedTypeIdentifier = isQualifiedTypeIdentifier;
	exports.isRecordExpression = isRecordExpression;
	exports.isRegExpLiteral = isRegExpLiteral;
	exports.isRegexLiteral = isRegexLiteral;
	exports.isRestElement = isRestElement;
	exports.isRestProperty = isRestProperty;
	exports.isReturnStatement = isReturnStatement;
	exports.isScopable = isScopable;
	exports.isSequenceExpression = isSequenceExpression;
	exports.isSpreadElement = isSpreadElement;
	exports.isSpreadProperty = isSpreadProperty;
	exports.isStandardized = isStandardized;
	exports.isStatement = isStatement;
	exports.isStaticBlock = isStaticBlock;
	exports.isStringLiteral = isStringLiteral;
	exports.isStringLiteralTypeAnnotation = isStringLiteralTypeAnnotation;
	exports.isStringTypeAnnotation = isStringTypeAnnotation;
	exports.isSuper = isSuper;
	exports.isSwitchCase = isSwitchCase;
	exports.isSwitchStatement = isSwitchStatement;
	exports.isSymbolTypeAnnotation = isSymbolTypeAnnotation;
	exports.isTSAnyKeyword = isTSAnyKeyword;
	exports.isTSArrayType = isTSArrayType;
	exports.isTSAsExpression = isTSAsExpression;
	exports.isTSBaseType = isTSBaseType;
	exports.isTSBigIntKeyword = isTSBigIntKeyword;
	exports.isTSBooleanKeyword = isTSBooleanKeyword;
	exports.isTSCallSignatureDeclaration = isTSCallSignatureDeclaration;
	exports.isTSConditionalType = isTSConditionalType;
	exports.isTSConstructSignatureDeclaration = isTSConstructSignatureDeclaration;
	exports.isTSConstructorType = isTSConstructorType;
	exports.isTSDeclareFunction = isTSDeclareFunction;
	exports.isTSDeclareMethod = isTSDeclareMethod;
	exports.isTSEntityName = isTSEntityName;
	exports.isTSEnumBody = isTSEnumBody;
	exports.isTSEnumDeclaration = isTSEnumDeclaration;
	exports.isTSEnumMember = isTSEnumMember;
	exports.isTSExportAssignment = isTSExportAssignment;
	exports.isTSExpressionWithTypeArguments = isTSExpressionWithTypeArguments;
	exports.isTSExternalModuleReference = isTSExternalModuleReference;
	exports.isTSFunctionType = isTSFunctionType;
	exports.isTSImportEqualsDeclaration = isTSImportEqualsDeclaration;
	exports.isTSImportType = isTSImportType;
	exports.isTSIndexSignature = isTSIndexSignature;
	exports.isTSIndexedAccessType = isTSIndexedAccessType;
	exports.isTSInferType = isTSInferType;
	exports.isTSInstantiationExpression = isTSInstantiationExpression;
	exports.isTSInterfaceBody = isTSInterfaceBody;
	exports.isTSInterfaceDeclaration = isTSInterfaceDeclaration;
	exports.isTSIntersectionType = isTSIntersectionType;
	exports.isTSIntrinsicKeyword = isTSIntrinsicKeyword;
	exports.isTSLiteralType = isTSLiteralType;
	exports.isTSMappedType = isTSMappedType;
	exports.isTSMethodSignature = isTSMethodSignature;
	exports.isTSModuleBlock = isTSModuleBlock;
	exports.isTSModuleDeclaration = isTSModuleDeclaration;
	exports.isTSNamedTupleMember = isTSNamedTupleMember;
	exports.isTSNamespaceExportDeclaration = isTSNamespaceExportDeclaration;
	exports.isTSNeverKeyword = isTSNeverKeyword;
	exports.isTSNonNullExpression = isTSNonNullExpression;
	exports.isTSNullKeyword = isTSNullKeyword;
	exports.isTSNumberKeyword = isTSNumberKeyword;
	exports.isTSObjectKeyword = isTSObjectKeyword;
	exports.isTSOptionalType = isTSOptionalType;
	exports.isTSParameterProperty = isTSParameterProperty;
	exports.isTSParenthesizedType = isTSParenthesizedType;
	exports.isTSPropertySignature = isTSPropertySignature;
	exports.isTSQualifiedName = isTSQualifiedName;
	exports.isTSRestType = isTSRestType;
	exports.isTSSatisfiesExpression = isTSSatisfiesExpression;
	exports.isTSStringKeyword = isTSStringKeyword;
	exports.isTSSymbolKeyword = isTSSymbolKeyword;
	exports.isTSThisType = isTSThisType;
	exports.isTSTupleType = isTSTupleType;
	exports.isTSType = isTSType;
	exports.isTSTypeAliasDeclaration = isTSTypeAliasDeclaration;
	exports.isTSTypeAnnotation = isTSTypeAnnotation;
	exports.isTSTypeAssertion = isTSTypeAssertion;
	exports.isTSTypeElement = isTSTypeElement;
	exports.isTSTypeLiteral = isTSTypeLiteral;
	exports.isTSTypeOperator = isTSTypeOperator;
	exports.isTSTypeParameter = isTSTypeParameter;
	exports.isTSTypeParameterDeclaration = isTSTypeParameterDeclaration;
	exports.isTSTypeParameterInstantiation = isTSTypeParameterInstantiation;
	exports.isTSTypePredicate = isTSTypePredicate;
	exports.isTSTypeQuery = isTSTypeQuery;
	exports.isTSTypeReference = isTSTypeReference;
	exports.isTSUndefinedKeyword = isTSUndefinedKeyword;
	exports.isTSUnionType = isTSUnionType;
	exports.isTSUnknownKeyword = isTSUnknownKeyword;
	exports.isTSVoidKeyword = isTSVoidKeyword;
	exports.isTaggedTemplateExpression = isTaggedTemplateExpression;
	exports.isTemplateElement = isTemplateElement;
	exports.isTemplateLiteral = isTemplateLiteral;
	exports.isTerminatorless = isTerminatorless;
	exports.isThisExpression = isThisExpression;
	exports.isThisTypeAnnotation = isThisTypeAnnotation;
	exports.isThrowStatement = isThrowStatement;
	exports.isTopicReference = isTopicReference;
	exports.isTryStatement = isTryStatement;
	exports.isTupleExpression = isTupleExpression;
	exports.isTupleTypeAnnotation = isTupleTypeAnnotation;
	exports.isTypeAlias = isTypeAlias;
	exports.isTypeAnnotation = isTypeAnnotation;
	exports.isTypeCastExpression = isTypeCastExpression;
	exports.isTypeParameter = isTypeParameter;
	exports.isTypeParameterDeclaration = isTypeParameterDeclaration;
	exports.isTypeParameterInstantiation = isTypeParameterInstantiation;
	exports.isTypeScript = isTypeScript;
	exports.isTypeofTypeAnnotation = isTypeofTypeAnnotation;
	exports.isUnaryExpression = isUnaryExpression;
	exports.isUnaryLike = isUnaryLike;
	exports.isUnionTypeAnnotation = isUnionTypeAnnotation;
	exports.isUpdateExpression = isUpdateExpression;
	exports.isUserWhitespacable = isUserWhitespacable;
	exports.isV8IntrinsicIdentifier = isV8IntrinsicIdentifier;
	exports.isVariableDeclaration = isVariableDeclaration;
	exports.isVariableDeclarator = isVariableDeclarator;
	exports.isVariance = isVariance;
	exports.isVoidTypeAnnotation = isVoidTypeAnnotation;
	exports.isWhile = isWhile;
	exports.isWhileStatement = isWhileStatement;
	exports.isWithStatement = isWithStatement;
	exports.isYieldExpression = isYieldExpression;
	var _shallowEqual$2 = require_shallowEqual();
	var _deprecationWarning$3 = require_deprecationWarning();
	function isArrayExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ArrayExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isAssignmentExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "AssignmentExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBinaryExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "BinaryExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isInterpreterDirective(node, opts) {
		if (!node) return false;
		if (node.type !== "InterpreterDirective") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDirective(node, opts) {
		if (!node) return false;
		if (node.type !== "Directive") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDirectiveLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "DirectiveLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBlockStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "BlockStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBreakStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "BreakStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isCallExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "CallExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isCatchClause(node, opts) {
		if (!node) return false;
		if (node.type !== "CatchClause") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isConditionalExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ConditionalExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isContinueStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ContinueStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDebuggerStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "DebuggerStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDoWhileStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "DoWhileStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEmptyStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "EmptyStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExpressionStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ExpressionStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFile(node, opts) {
		if (!node) return false;
		if (node.type !== "File") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isForInStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ForInStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isForStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ForStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunctionDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "FunctionDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunctionExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "FunctionExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isIdentifier(node, opts) {
		if (!node) return false;
		if (node.type !== "Identifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isIfStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "IfStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isLabeledStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "LabeledStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStringLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "StringLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNumericLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "NumericLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNullLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "NullLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBooleanLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "BooleanLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isRegExpLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "RegExpLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isLogicalExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "LogicalExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isMemberExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "MemberExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNewExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "NewExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isProgram(node, opts) {
		if (!node) return false;
		if (node.type !== "Program") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectMethod(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectMethod") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isRestElement(node, opts) {
		if (!node) return false;
		if (node.type !== "RestElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isReturnStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ReturnStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSequenceExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "SequenceExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isParenthesizedExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ParenthesizedExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSwitchCase(node, opts) {
		if (!node) return false;
		if (node.type !== "SwitchCase") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSwitchStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "SwitchStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isThisExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ThisExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isThrowStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ThrowStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTryStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "TryStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isUnaryExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "UnaryExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isUpdateExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "UpdateExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isVariableDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "VariableDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isVariableDeclarator(node, opts) {
		if (!node) return false;
		if (node.type !== "VariableDeclarator") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isWhileStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "WhileStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isWithStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "WithStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isAssignmentPattern(node, opts) {
		if (!node) return false;
		if (node.type !== "AssignmentPattern") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isArrayPattern(node, opts) {
		if (!node) return false;
		if (node.type !== "ArrayPattern") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isArrowFunctionExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ArrowFunctionExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassBody(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportAllDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportAllDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportDefaultDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportDefaultDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportNamedDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportNamedDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isForOfStatement(node, opts) {
		if (!node) return false;
		if (node.type !== "ForOfStatement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportDefaultSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportDefaultSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportNamespaceSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportNamespaceSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isMetaProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "MetaProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassMethod(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassMethod") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectPattern(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectPattern") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSpreadElement(node, opts) {
		if (!node) return false;
		if (node.type !== "SpreadElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSuper(node, opts) {
		if (!node) return false;
		if (node.type !== "Super") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTaggedTemplateExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TaggedTemplateExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTemplateElement(node, opts) {
		if (!node) return false;
		if (node.type !== "TemplateElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTemplateLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "TemplateLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isYieldExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "YieldExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isAwaitExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "AwaitExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImport(node, opts) {
		if (!node) return false;
		if (node.type !== "Import") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBigIntLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "BigIntLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportNamespaceSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportNamespaceSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isOptionalMemberExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "OptionalMemberExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isOptionalCallExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "OptionalCallExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassAccessorProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassAccessorProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassPrivateProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassPrivateProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassPrivateMethod(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassPrivateMethod") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPrivateName(node, opts) {
		if (!node) return false;
		if (node.type !== "PrivateName") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStaticBlock(node, opts) {
		if (!node) return false;
		if (node.type !== "StaticBlock") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isAnyTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "AnyTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isArrayTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "ArrayTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBooleanTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "BooleanTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBooleanLiteralTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "BooleanLiteralTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNullLiteralTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "NullLiteralTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClassImplements(node, opts) {
		if (!node) return false;
		if (node.type !== "ClassImplements") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareClass(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareClass") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareFunction(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareFunction") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareInterface(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareInterface") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareModule(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareModule") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareModuleExports(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareModuleExports") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareTypeAlias(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareTypeAlias") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareOpaqueType(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareOpaqueType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareVariable(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareVariable") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareExportDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareExportDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclareExportAllDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclareExportAllDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclaredPredicate(node, opts) {
		if (!node) return false;
		if (node.type !== "DeclaredPredicate") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExistsTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "ExistsTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunctionTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "FunctionTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunctionTypeParam(node, opts) {
		if (!node) return false;
		if (node.type !== "FunctionTypeParam") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isGenericTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "GenericTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isInferredPredicate(node, opts) {
		if (!node) return false;
		if (node.type !== "InferredPredicate") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isInterfaceExtends(node, opts) {
		if (!node) return false;
		if (node.type !== "InterfaceExtends") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isInterfaceDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "InterfaceDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isInterfaceTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "InterfaceTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isIntersectionTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "IntersectionTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isMixedTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "MixedTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEmptyTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "EmptyTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNullableTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "NullableTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNumberLiteralTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "NumberLiteralTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNumberTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "NumberTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeInternalSlot(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeInternalSlot") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeCallProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeCallProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeIndexer(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeIndexer") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectTypeSpreadProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "ObjectTypeSpreadProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isOpaqueType(node, opts) {
		if (!node) return false;
		if (node.type !== "OpaqueType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isQualifiedTypeIdentifier(node, opts) {
		if (!node) return false;
		if (node.type !== "QualifiedTypeIdentifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStringLiteralTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "StringLiteralTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStringTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "StringTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSymbolTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "SymbolTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isThisTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "ThisTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTupleTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "TupleTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeofTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeofTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeAlias(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeAlias") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeCastExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeCastExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeParameter(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeParameter") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeParameterDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeParameterDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeParameterInstantiation(node, opts) {
		if (!node) return false;
		if (node.type !== "TypeParameterInstantiation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isUnionTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "UnionTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isVariance(node, opts) {
		if (!node) return false;
		if (node.type !== "Variance") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isVoidTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "VoidTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumBooleanBody(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumBooleanBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumNumberBody(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumNumberBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumStringBody(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumStringBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumSymbolBody(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumSymbolBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumBooleanMember(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumBooleanMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumNumberMember(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumNumberMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumStringMember(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumStringMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumDefaultedMember(node, opts) {
		if (!node) return false;
		if (node.type !== "EnumDefaultedMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isIndexedAccessType(node, opts) {
		if (!node) return false;
		if (node.type !== "IndexedAccessType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isOptionalIndexedAccessType(node, opts) {
		if (!node) return false;
		if (node.type !== "OptionalIndexedAccessType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXAttribute(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXAttribute") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXClosingElement(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXClosingElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXElement(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXEmptyExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXEmptyExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXExpressionContainer(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXExpressionContainer") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXSpreadChild(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXSpreadChild") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXIdentifier(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXIdentifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXMemberExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXMemberExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXNamespacedName(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXNamespacedName") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXOpeningElement(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXOpeningElement") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXSpreadAttribute(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXSpreadAttribute") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXText(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXText") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXFragment(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXFragment") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXOpeningFragment(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXOpeningFragment") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSXClosingFragment(node, opts) {
		if (!node) return false;
		if (node.type !== "JSXClosingFragment") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNoop(node, opts) {
		if (!node) return false;
		if (node.type !== "Noop") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPlaceholder(node, opts) {
		if (!node) return false;
		if (node.type !== "Placeholder") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isV8IntrinsicIdentifier(node, opts) {
		if (!node) return false;
		if (node.type !== "V8IntrinsicIdentifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isArgumentPlaceholder(node, opts) {
		if (!node) return false;
		if (node.type !== "ArgumentPlaceholder") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBindExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "BindExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportAttribute(node, opts) {
		if (!node) return false;
		if (node.type !== "ImportAttribute") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDecorator(node, opts) {
		if (!node) return false;
		if (node.type !== "Decorator") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDoExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "DoExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportDefaultSpecifier(node, opts) {
		if (!node) return false;
		if (node.type !== "ExportDefaultSpecifier") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isRecordExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "RecordExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTupleExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TupleExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDecimalLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "DecimalLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isModuleExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "ModuleExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTopicReference(node, opts) {
		if (!node) return false;
		if (node.type !== "TopicReference") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPipelineTopicExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "PipelineTopicExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPipelineBareFunction(node, opts) {
		if (!node) return false;
		if (node.type !== "PipelineBareFunction") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPipelinePrimaryTopicReference(node, opts) {
		if (!node) return false;
		if (node.type !== "PipelinePrimaryTopicReference") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSParameterProperty(node, opts) {
		if (!node) return false;
		if (node.type !== "TSParameterProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSDeclareFunction(node, opts) {
		if (!node) return false;
		if (node.type !== "TSDeclareFunction") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSDeclareMethod(node, opts) {
		if (!node) return false;
		if (node.type !== "TSDeclareMethod") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSQualifiedName(node, opts) {
		if (!node) return false;
		if (node.type !== "TSQualifiedName") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSCallSignatureDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSCallSignatureDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSConstructSignatureDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSConstructSignatureDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSPropertySignature(node, opts) {
		if (!node) return false;
		if (node.type !== "TSPropertySignature") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSMethodSignature(node, opts) {
		if (!node) return false;
		if (node.type !== "TSMethodSignature") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSIndexSignature(node, opts) {
		if (!node) return false;
		if (node.type !== "TSIndexSignature") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSAnyKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSAnyKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSBooleanKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSBooleanKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSBigIntKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSBigIntKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSIntrinsicKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSIntrinsicKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNeverKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNeverKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNullKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNullKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNumberKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNumberKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSObjectKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSObjectKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSStringKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSStringKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSSymbolKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSSymbolKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSUndefinedKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSUndefinedKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSUnknownKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSUnknownKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSVoidKeyword(node, opts) {
		if (!node) return false;
		if (node.type !== "TSVoidKeyword") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSThisType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSThisType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSFunctionType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSFunctionType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSConstructorType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSConstructorType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeReference(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeReference") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypePredicate(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypePredicate") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeQuery(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeQuery") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeLiteral(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSArrayType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSArrayType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTupleType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTupleType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSOptionalType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSOptionalType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSRestType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSRestType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNamedTupleMember(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNamedTupleMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSUnionType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSUnionType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSIntersectionType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSIntersectionType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSConditionalType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSConditionalType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSInferType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSInferType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSParenthesizedType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSParenthesizedType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeOperator(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeOperator") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSIndexedAccessType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSIndexedAccessType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSMappedType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSMappedType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSLiteralType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSLiteralType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSExpressionWithTypeArguments(node, opts) {
		if (!node) return false;
		if (node.type !== "TSExpressionWithTypeArguments") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSInterfaceDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSInterfaceDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSInterfaceBody(node, opts) {
		if (!node) return false;
		if (node.type !== "TSInterfaceBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeAliasDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeAliasDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSInstantiationExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TSInstantiationExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSAsExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TSAsExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSSatisfiesExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TSSatisfiesExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeAssertion(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeAssertion") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSEnumBody(node, opts) {
		if (!node) return false;
		if (node.type !== "TSEnumBody") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSEnumDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSEnumDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSEnumMember(node, opts) {
		if (!node) return false;
		if (node.type !== "TSEnumMember") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSModuleDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSModuleDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSModuleBlock(node, opts) {
		if (!node) return false;
		if (node.type !== "TSModuleBlock") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSImportType(node, opts) {
		if (!node) return false;
		if (node.type !== "TSImportType") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSImportEqualsDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSImportEqualsDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSExternalModuleReference(node, opts) {
		if (!node) return false;
		if (node.type !== "TSExternalModuleReference") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNonNullExpression(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNonNullExpression") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSExportAssignment(node, opts) {
		if (!node) return false;
		if (node.type !== "TSExportAssignment") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSNamespaceExportDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSNamespaceExportDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeAnnotation(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeAnnotation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeParameterInstantiation(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeParameterInstantiation") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeParameterDeclaration(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeParameterDeclaration") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeParameter(node, opts) {
		if (!node) return false;
		if (node.type !== "TSTypeParameter") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStandardized(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ArrayExpression":
			case "AssignmentExpression":
			case "BinaryExpression":
			case "InterpreterDirective":
			case "Directive":
			case "DirectiveLiteral":
			case "BlockStatement":
			case "BreakStatement":
			case "CallExpression":
			case "CatchClause":
			case "ConditionalExpression":
			case "ContinueStatement":
			case "DebuggerStatement":
			case "DoWhileStatement":
			case "EmptyStatement":
			case "ExpressionStatement":
			case "File":
			case "ForInStatement":
			case "ForStatement":
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "Identifier":
			case "IfStatement":
			case "LabeledStatement":
			case "StringLiteral":
			case "NumericLiteral":
			case "NullLiteral":
			case "BooleanLiteral":
			case "RegExpLiteral":
			case "LogicalExpression":
			case "MemberExpression":
			case "NewExpression":
			case "Program":
			case "ObjectExpression":
			case "ObjectMethod":
			case "ObjectProperty":
			case "RestElement":
			case "ReturnStatement":
			case "SequenceExpression":
			case "ParenthesizedExpression":
			case "SwitchCase":
			case "SwitchStatement":
			case "ThisExpression":
			case "ThrowStatement":
			case "TryStatement":
			case "UnaryExpression":
			case "UpdateExpression":
			case "VariableDeclaration":
			case "VariableDeclarator":
			case "WhileStatement":
			case "WithStatement":
			case "AssignmentPattern":
			case "ArrayPattern":
			case "ArrowFunctionExpression":
			case "ClassBody":
			case "ClassExpression":
			case "ClassDeclaration":
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ExportSpecifier":
			case "ForOfStatement":
			case "ImportDeclaration":
			case "ImportDefaultSpecifier":
			case "ImportNamespaceSpecifier":
			case "ImportSpecifier":
			case "ImportExpression":
			case "MetaProperty":
			case "ClassMethod":
			case "ObjectPattern":
			case "SpreadElement":
			case "Super":
			case "TaggedTemplateExpression":
			case "TemplateElement":
			case "TemplateLiteral":
			case "YieldExpression":
			case "AwaitExpression":
			case "Import":
			case "BigIntLiteral":
			case "ExportNamespaceSpecifier":
			case "OptionalMemberExpression":
			case "OptionalCallExpression":
			case "ClassProperty":
			case "ClassAccessorProperty":
			case "ClassPrivateProperty":
			case "ClassPrivateMethod":
			case "PrivateName":
			case "StaticBlock": break;
			case "Placeholder":
				switch (node.expectedNode) {
					case "Identifier":
					case "StringLiteral":
					case "BlockStatement":
					case "ClassBody": break;
					default: return false;
				}
				break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExpression(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ArrayExpression":
			case "AssignmentExpression":
			case "BinaryExpression":
			case "CallExpression":
			case "ConditionalExpression":
			case "FunctionExpression":
			case "Identifier":
			case "StringLiteral":
			case "NumericLiteral":
			case "NullLiteral":
			case "BooleanLiteral":
			case "RegExpLiteral":
			case "LogicalExpression":
			case "MemberExpression":
			case "NewExpression":
			case "ObjectExpression":
			case "SequenceExpression":
			case "ParenthesizedExpression":
			case "ThisExpression":
			case "UnaryExpression":
			case "UpdateExpression":
			case "ArrowFunctionExpression":
			case "ClassExpression":
			case "ImportExpression":
			case "MetaProperty":
			case "Super":
			case "TaggedTemplateExpression":
			case "TemplateLiteral":
			case "YieldExpression":
			case "AwaitExpression":
			case "Import":
			case "BigIntLiteral":
			case "OptionalMemberExpression":
			case "OptionalCallExpression":
			case "TypeCastExpression":
			case "JSXElement":
			case "JSXFragment":
			case "BindExpression":
			case "DoExpression":
			case "RecordExpression":
			case "TupleExpression":
			case "DecimalLiteral":
			case "ModuleExpression":
			case "TopicReference":
			case "PipelineTopicExpression":
			case "PipelineBareFunction":
			case "PipelinePrimaryTopicReference":
			case "TSInstantiationExpression":
			case "TSAsExpression":
			case "TSSatisfiesExpression":
			case "TSTypeAssertion":
			case "TSNonNullExpression": break;
			case "Placeholder":
				switch (node.expectedNode) {
					case "Expression":
					case "Identifier":
					case "StringLiteral": break;
					default: return false;
				}
				break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBinary(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BinaryExpression":
			case "LogicalExpression": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isScopable(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BlockStatement":
			case "CatchClause":
			case "DoWhileStatement":
			case "ForInStatement":
			case "ForStatement":
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "Program":
			case "ObjectMethod":
			case "SwitchStatement":
			case "WhileStatement":
			case "ArrowFunctionExpression":
			case "ClassExpression":
			case "ClassDeclaration":
			case "ForOfStatement":
			case "ClassMethod":
			case "ClassPrivateMethod":
			case "StaticBlock":
			case "TSModuleBlock": break;
			case "Placeholder": if (node.expectedNode === "BlockStatement") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBlockParent(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BlockStatement":
			case "CatchClause":
			case "DoWhileStatement":
			case "ForInStatement":
			case "ForStatement":
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "Program":
			case "ObjectMethod":
			case "SwitchStatement":
			case "WhileStatement":
			case "ArrowFunctionExpression":
			case "ForOfStatement":
			case "ClassMethod":
			case "ClassPrivateMethod":
			case "StaticBlock":
			case "TSModuleBlock": break;
			case "Placeholder": if (node.expectedNode === "BlockStatement") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isBlock(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BlockStatement":
			case "Program":
			case "TSModuleBlock": break;
			case "Placeholder": if (node.expectedNode === "BlockStatement") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isStatement(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BlockStatement":
			case "BreakStatement":
			case "ContinueStatement":
			case "DebuggerStatement":
			case "DoWhileStatement":
			case "EmptyStatement":
			case "ExpressionStatement":
			case "ForInStatement":
			case "ForStatement":
			case "FunctionDeclaration":
			case "IfStatement":
			case "LabeledStatement":
			case "ReturnStatement":
			case "SwitchStatement":
			case "ThrowStatement":
			case "TryStatement":
			case "VariableDeclaration":
			case "WhileStatement":
			case "WithStatement":
			case "ClassDeclaration":
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ForOfStatement":
			case "ImportDeclaration":
			case "DeclareClass":
			case "DeclareFunction":
			case "DeclareInterface":
			case "DeclareModule":
			case "DeclareModuleExports":
			case "DeclareTypeAlias":
			case "DeclareOpaqueType":
			case "DeclareVariable":
			case "DeclareExportDeclaration":
			case "DeclareExportAllDeclaration":
			case "InterfaceDeclaration":
			case "OpaqueType":
			case "TypeAlias":
			case "EnumDeclaration":
			case "TSDeclareFunction":
			case "TSInterfaceDeclaration":
			case "TSTypeAliasDeclaration":
			case "TSEnumDeclaration":
			case "TSModuleDeclaration":
			case "TSImportEqualsDeclaration":
			case "TSExportAssignment":
			case "TSNamespaceExportDeclaration": break;
			case "Placeholder":
				switch (node.expectedNode) {
					case "Statement":
					case "Declaration":
					case "BlockStatement": break;
					default: return false;
				}
				break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTerminatorless(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BreakStatement":
			case "ContinueStatement":
			case "ReturnStatement":
			case "ThrowStatement":
			case "YieldExpression":
			case "AwaitExpression": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isCompletionStatement(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "BreakStatement":
			case "ContinueStatement":
			case "ReturnStatement":
			case "ThrowStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isConditional(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ConditionalExpression":
			case "IfStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isLoop(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "DoWhileStatement":
			case "ForInStatement":
			case "ForStatement":
			case "WhileStatement":
			case "ForOfStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isWhile(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "DoWhileStatement":
			case "WhileStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExpressionWrapper(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ExpressionStatement":
			case "ParenthesizedExpression":
			case "TypeCastExpression": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFor(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ForInStatement":
			case "ForStatement":
			case "ForOfStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isForXStatement(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ForInStatement":
			case "ForOfStatement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunction(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "ObjectMethod":
			case "ArrowFunctionExpression":
			case "ClassMethod":
			case "ClassPrivateMethod": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFunctionParent(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "ObjectMethod":
			case "ArrowFunctionExpression":
			case "ClassMethod":
			case "ClassPrivateMethod":
			case "StaticBlock":
			case "TSModuleBlock": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPureish(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "FunctionDeclaration":
			case "FunctionExpression":
			case "StringLiteral":
			case "NumericLiteral":
			case "NullLiteral":
			case "BooleanLiteral":
			case "RegExpLiteral":
			case "ArrowFunctionExpression":
			case "BigIntLiteral":
			case "DecimalLiteral": break;
			case "Placeholder": if (node.expectedNode === "StringLiteral") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isDeclaration(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "FunctionDeclaration":
			case "VariableDeclaration":
			case "ClassDeclaration":
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ImportDeclaration":
			case "DeclareClass":
			case "DeclareFunction":
			case "DeclareInterface":
			case "DeclareModule":
			case "DeclareModuleExports":
			case "DeclareTypeAlias":
			case "DeclareOpaqueType":
			case "DeclareVariable":
			case "DeclareExportDeclaration":
			case "DeclareExportAllDeclaration":
			case "InterfaceDeclaration":
			case "OpaqueType":
			case "TypeAlias":
			case "EnumDeclaration":
			case "TSDeclareFunction":
			case "TSInterfaceDeclaration":
			case "TSTypeAliasDeclaration":
			case "TSEnumDeclaration":
			case "TSModuleDeclaration": break;
			case "Placeholder": if (node.expectedNode === "Declaration") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPatternLike(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "Identifier":
			case "RestElement":
			case "AssignmentPattern":
			case "ArrayPattern":
			case "ObjectPattern":
			case "TSAsExpression":
			case "TSSatisfiesExpression":
			case "TSTypeAssertion":
			case "TSNonNullExpression": break;
			case "Placeholder":
				switch (node.expectedNode) {
					case "Pattern":
					case "Identifier": break;
					default: return false;
				}
				break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isLVal(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "Identifier":
			case "MemberExpression":
			case "RestElement":
			case "AssignmentPattern":
			case "ArrayPattern":
			case "ObjectPattern":
			case "TSParameterProperty":
			case "TSAsExpression":
			case "TSSatisfiesExpression":
			case "TSTypeAssertion":
			case "TSNonNullExpression": break;
			case "Placeholder":
				switch (node.expectedNode) {
					case "Pattern":
					case "Identifier": break;
					default: return false;
				}
				break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSEntityName(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "Identifier":
			case "TSQualifiedName": break;
			case "Placeholder": if (node.expectedNode === "Identifier") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isLiteral(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "StringLiteral":
			case "NumericLiteral":
			case "NullLiteral":
			case "BooleanLiteral":
			case "RegExpLiteral":
			case "TemplateLiteral":
			case "BigIntLiteral":
			case "DecimalLiteral": break;
			case "Placeholder": if (node.expectedNode === "StringLiteral") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImmutable$1(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "StringLiteral":
			case "NumericLiteral":
			case "NullLiteral":
			case "BooleanLiteral":
			case "BigIntLiteral":
			case "JSXAttribute":
			case "JSXClosingElement":
			case "JSXElement":
			case "JSXExpressionContainer":
			case "JSXSpreadChild":
			case "JSXOpeningElement":
			case "JSXText":
			case "JSXFragment":
			case "JSXOpeningFragment":
			case "JSXClosingFragment":
			case "DecimalLiteral": break;
			case "Placeholder": if (node.expectedNode === "StringLiteral") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isUserWhitespacable(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ObjectMethod":
			case "ObjectProperty":
			case "ObjectTypeInternalSlot":
			case "ObjectTypeCallProperty":
			case "ObjectTypeIndexer":
			case "ObjectTypeProperty":
			case "ObjectTypeSpreadProperty": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isMethod(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ObjectMethod":
			case "ClassMethod":
			case "ClassPrivateMethod": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isObjectMember(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ObjectMethod":
			case "ObjectProperty": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isProperty(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ObjectProperty":
			case "ClassProperty":
			case "ClassAccessorProperty":
			case "ClassPrivateProperty": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isUnaryLike(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "UnaryExpression":
			case "SpreadElement": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPattern(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "AssignmentPattern":
			case "ArrayPattern":
			case "ObjectPattern": break;
			case "Placeholder": if (node.expectedNode === "Pattern") break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isClass(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ClassExpression":
			case "ClassDeclaration": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isImportOrExportDeclaration(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ImportDeclaration": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isExportDeclaration(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isModuleSpecifier(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ExportSpecifier":
			case "ImportDefaultSpecifier":
			case "ImportNamespaceSpecifier":
			case "ImportSpecifier":
			case "ExportNamespaceSpecifier":
			case "ExportDefaultSpecifier": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isAccessor(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ClassAccessorProperty": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isPrivate(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "ClassPrivateProperty":
			case "ClassPrivateMethod":
			case "PrivateName": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFlow(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "AnyTypeAnnotation":
			case "ArrayTypeAnnotation":
			case "BooleanTypeAnnotation":
			case "BooleanLiteralTypeAnnotation":
			case "NullLiteralTypeAnnotation":
			case "ClassImplements":
			case "DeclareClass":
			case "DeclareFunction":
			case "DeclareInterface":
			case "DeclareModule":
			case "DeclareModuleExports":
			case "DeclareTypeAlias":
			case "DeclareOpaqueType":
			case "DeclareVariable":
			case "DeclareExportDeclaration":
			case "DeclareExportAllDeclaration":
			case "DeclaredPredicate":
			case "ExistsTypeAnnotation":
			case "FunctionTypeAnnotation":
			case "FunctionTypeParam":
			case "GenericTypeAnnotation":
			case "InferredPredicate":
			case "InterfaceExtends":
			case "InterfaceDeclaration":
			case "InterfaceTypeAnnotation":
			case "IntersectionTypeAnnotation":
			case "MixedTypeAnnotation":
			case "EmptyTypeAnnotation":
			case "NullableTypeAnnotation":
			case "NumberLiteralTypeAnnotation":
			case "NumberTypeAnnotation":
			case "ObjectTypeAnnotation":
			case "ObjectTypeInternalSlot":
			case "ObjectTypeCallProperty":
			case "ObjectTypeIndexer":
			case "ObjectTypeProperty":
			case "ObjectTypeSpreadProperty":
			case "OpaqueType":
			case "QualifiedTypeIdentifier":
			case "StringLiteralTypeAnnotation":
			case "StringTypeAnnotation":
			case "SymbolTypeAnnotation":
			case "ThisTypeAnnotation":
			case "TupleTypeAnnotation":
			case "TypeofTypeAnnotation":
			case "TypeAlias":
			case "TypeAnnotation":
			case "TypeCastExpression":
			case "TypeParameter":
			case "TypeParameterDeclaration":
			case "TypeParameterInstantiation":
			case "UnionTypeAnnotation":
			case "Variance":
			case "VoidTypeAnnotation":
			case "EnumDeclaration":
			case "EnumBooleanBody":
			case "EnumNumberBody":
			case "EnumStringBody":
			case "EnumSymbolBody":
			case "EnumBooleanMember":
			case "EnumNumberMember":
			case "EnumStringMember":
			case "EnumDefaultedMember":
			case "IndexedAccessType":
			case "OptionalIndexedAccessType": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFlowType(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "AnyTypeAnnotation":
			case "ArrayTypeAnnotation":
			case "BooleanTypeAnnotation":
			case "BooleanLiteralTypeAnnotation":
			case "NullLiteralTypeAnnotation":
			case "ExistsTypeAnnotation":
			case "FunctionTypeAnnotation":
			case "GenericTypeAnnotation":
			case "InterfaceTypeAnnotation":
			case "IntersectionTypeAnnotation":
			case "MixedTypeAnnotation":
			case "EmptyTypeAnnotation":
			case "NullableTypeAnnotation":
			case "NumberLiteralTypeAnnotation":
			case "NumberTypeAnnotation":
			case "ObjectTypeAnnotation":
			case "StringLiteralTypeAnnotation":
			case "StringTypeAnnotation":
			case "SymbolTypeAnnotation":
			case "ThisTypeAnnotation":
			case "TupleTypeAnnotation":
			case "TypeofTypeAnnotation":
			case "UnionTypeAnnotation":
			case "VoidTypeAnnotation":
			case "IndexedAccessType":
			case "OptionalIndexedAccessType": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFlowBaseAnnotation(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "AnyTypeAnnotation":
			case "BooleanTypeAnnotation":
			case "NullLiteralTypeAnnotation":
			case "MixedTypeAnnotation":
			case "EmptyTypeAnnotation":
			case "NumberTypeAnnotation":
			case "StringTypeAnnotation":
			case "SymbolTypeAnnotation":
			case "ThisTypeAnnotation":
			case "VoidTypeAnnotation": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFlowDeclaration(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "DeclareClass":
			case "DeclareFunction":
			case "DeclareInterface":
			case "DeclareModule":
			case "DeclareModuleExports":
			case "DeclareTypeAlias":
			case "DeclareOpaqueType":
			case "DeclareVariable":
			case "DeclareExportDeclaration":
			case "DeclareExportAllDeclaration":
			case "InterfaceDeclaration":
			case "OpaqueType":
			case "TypeAlias": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isFlowPredicate(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "DeclaredPredicate":
			case "InferredPredicate": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumBody(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "EnumBooleanBody":
			case "EnumNumberBody":
			case "EnumStringBody":
			case "EnumSymbolBody": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isEnumMember(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "EnumBooleanMember":
			case "EnumNumberMember":
			case "EnumStringMember":
			case "EnumDefaultedMember": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isJSX(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "JSXAttribute":
			case "JSXClosingElement":
			case "JSXElement":
			case "JSXEmptyExpression":
			case "JSXExpressionContainer":
			case "JSXSpreadChild":
			case "JSXIdentifier":
			case "JSXMemberExpression":
			case "JSXNamespacedName":
			case "JSXOpeningElement":
			case "JSXSpreadAttribute":
			case "JSXText":
			case "JSXFragment":
			case "JSXOpeningFragment":
			case "JSXClosingFragment": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isMiscellaneous(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "Noop":
			case "Placeholder":
			case "V8IntrinsicIdentifier": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTypeScript(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "TSParameterProperty":
			case "TSDeclareFunction":
			case "TSDeclareMethod":
			case "TSQualifiedName":
			case "TSCallSignatureDeclaration":
			case "TSConstructSignatureDeclaration":
			case "TSPropertySignature":
			case "TSMethodSignature":
			case "TSIndexSignature":
			case "TSAnyKeyword":
			case "TSBooleanKeyword":
			case "TSBigIntKeyword":
			case "TSIntrinsicKeyword":
			case "TSNeverKeyword":
			case "TSNullKeyword":
			case "TSNumberKeyword":
			case "TSObjectKeyword":
			case "TSStringKeyword":
			case "TSSymbolKeyword":
			case "TSUndefinedKeyword":
			case "TSUnknownKeyword":
			case "TSVoidKeyword":
			case "TSThisType":
			case "TSFunctionType":
			case "TSConstructorType":
			case "TSTypeReference":
			case "TSTypePredicate":
			case "TSTypeQuery":
			case "TSTypeLiteral":
			case "TSArrayType":
			case "TSTupleType":
			case "TSOptionalType":
			case "TSRestType":
			case "TSNamedTupleMember":
			case "TSUnionType":
			case "TSIntersectionType":
			case "TSConditionalType":
			case "TSInferType":
			case "TSParenthesizedType":
			case "TSTypeOperator":
			case "TSIndexedAccessType":
			case "TSMappedType":
			case "TSLiteralType":
			case "TSExpressionWithTypeArguments":
			case "TSInterfaceDeclaration":
			case "TSInterfaceBody":
			case "TSTypeAliasDeclaration":
			case "TSInstantiationExpression":
			case "TSAsExpression":
			case "TSSatisfiesExpression":
			case "TSTypeAssertion":
			case "TSEnumBody":
			case "TSEnumDeclaration":
			case "TSEnumMember":
			case "TSModuleDeclaration":
			case "TSModuleBlock":
			case "TSImportType":
			case "TSImportEqualsDeclaration":
			case "TSExternalModuleReference":
			case "TSNonNullExpression":
			case "TSExportAssignment":
			case "TSNamespaceExportDeclaration":
			case "TSTypeAnnotation":
			case "TSTypeParameterInstantiation":
			case "TSTypeParameterDeclaration":
			case "TSTypeParameter": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSTypeElement(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "TSCallSignatureDeclaration":
			case "TSConstructSignatureDeclaration":
			case "TSPropertySignature":
			case "TSMethodSignature":
			case "TSIndexSignature": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSType(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "TSAnyKeyword":
			case "TSBooleanKeyword":
			case "TSBigIntKeyword":
			case "TSIntrinsicKeyword":
			case "TSNeverKeyword":
			case "TSNullKeyword":
			case "TSNumberKeyword":
			case "TSObjectKeyword":
			case "TSStringKeyword":
			case "TSSymbolKeyword":
			case "TSUndefinedKeyword":
			case "TSUnknownKeyword":
			case "TSVoidKeyword":
			case "TSThisType":
			case "TSFunctionType":
			case "TSConstructorType":
			case "TSTypeReference":
			case "TSTypePredicate":
			case "TSTypeQuery":
			case "TSTypeLiteral":
			case "TSArrayType":
			case "TSTupleType":
			case "TSOptionalType":
			case "TSRestType":
			case "TSUnionType":
			case "TSIntersectionType":
			case "TSConditionalType":
			case "TSInferType":
			case "TSParenthesizedType":
			case "TSTypeOperator":
			case "TSIndexedAccessType":
			case "TSMappedType":
			case "TSLiteralType":
			case "TSExpressionWithTypeArguments":
			case "TSImportType": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isTSBaseType(node, opts) {
		if (!node) return false;
		switch (node.type) {
			case "TSAnyKeyword":
			case "TSBooleanKeyword":
			case "TSBigIntKeyword":
			case "TSIntrinsicKeyword":
			case "TSNeverKeyword":
			case "TSNullKeyword":
			case "TSNumberKeyword":
			case "TSObjectKeyword":
			case "TSStringKeyword":
			case "TSSymbolKeyword":
			case "TSUndefinedKeyword":
			case "TSUnknownKeyword":
			case "TSVoidKeyword":
			case "TSThisType":
			case "TSLiteralType": break;
			default: return false;
		}
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isNumberLiteral(node, opts) {
		(0, _deprecationWarning$3.default)("isNumberLiteral", "isNumericLiteral");
		if (!node) return false;
		if (node.type !== "NumberLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isRegexLiteral(node, opts) {
		(0, _deprecationWarning$3.default)("isRegexLiteral", "isRegExpLiteral");
		if (!node) return false;
		if (node.type !== "RegexLiteral") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isRestProperty(node, opts) {
		(0, _deprecationWarning$3.default)("isRestProperty", "isRestElement");
		if (!node) return false;
		if (node.type !== "RestProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isSpreadProperty(node, opts) {
		(0, _deprecationWarning$3.default)("isSpreadProperty", "isSpreadElement");
		if (!node) return false;
		if (node.type !== "SpreadProperty") return false;
		return opts == null || (0, _shallowEqual$2.default)(node, opts);
	}
	function isModuleDeclaration(node, opts) {
		(0, _deprecationWarning$3.default)("isModuleDeclaration", "isImportOrExportDeclaration");
		return isImportOrExportDeclaration(node, opts);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/matchesPattern.js
var require_matchesPattern = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/matchesPattern.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = matchesPattern;
	var _index$41 = require_generated$3();
	function matchesPattern(member, match$1, allowPartial) {
		if (!(0, _index$41.isMemberExpression)(member)) return false;
		const parts = Array.isArray(match$1) ? match$1 : match$1.split(".");
		const nodes = [];
		let node;
		for (node = member; (0, _index$41.isMemberExpression)(node); node = node.object) nodes.push(node.property);
		nodes.push(node);
		if (nodes.length < parts.length) return false;
		if (!allowPartial && nodes.length > parts.length) return false;
		for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
			const node$1 = nodes[j];
			let value;
			if ((0, _index$41.isIdentifier)(node$1)) value = node$1.name;
			else if ((0, _index$41.isStringLiteral)(node$1)) value = node$1.value;
			else if ((0, _index$41.isThisExpression)(node$1)) value = "this";
			else return false;
			if (parts[i] !== value) return false;
		}
		return true;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/buildMatchMemberExpression.js
var require_buildMatchMemberExpression = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/buildMatchMemberExpression.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = buildMatchMemberExpression;
	var _matchesPattern$1 = require_matchesPattern();
	function buildMatchMemberExpression(match$1, allowPartial) {
		const parts = match$1.split(".");
		return (member) => (0, _matchesPattern$1.default)(member, parts, allowPartial);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/react/isReactComponent.js
var require_isReactComponent = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/react/isReactComponent.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _buildMatchMemberExpression$1 = require_buildMatchMemberExpression();
	const isReactComponent = (0, _buildMatchMemberExpression$1.default)("React.Component");
	var _default$5 = exports.default = isReactComponent;
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/react/isCompatTag.js
var require_isCompatTag = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/react/isCompatTag.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isCompatTag;
	function isCompatTag(tagName) {
		return !!tagName && /^[a-z]/.test(tagName);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isType.js
var require_isType = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isType.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isType;
	var _index$40 = require_definitions();
	function isType(nodeType, targetType) {
		if (nodeType === targetType) return true;
		if (nodeType == null) return false;
		if (_index$40.ALIAS_KEYS[targetType]) return false;
		const aliases = _index$40.FLIPPED_ALIAS_KEYS[targetType];
		if (aliases) {
			if (aliases[0] === nodeType) return true;
			for (const alias of aliases) if (nodeType === alias) return true;
		}
		return false;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isPlaceholderType.js
var require_isPlaceholderType = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isPlaceholderType.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isPlaceholderType;
	var _index$39 = require_definitions();
	function isPlaceholderType(placeholderType, targetType) {
		if (placeholderType === targetType) return true;
		const aliases = _index$39.PLACEHOLDERS_ALIAS[placeholderType];
		if (aliases) {
			for (const alias of aliases) if (targetType === alias) return true;
		}
		return false;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/is.js
var require_is = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/is.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = is;
	var _shallowEqual$1 = require_shallowEqual();
	var _isType$2 = require_isType();
	var _isPlaceholderType$1 = require_isPlaceholderType();
	var _index$38 = require_definitions();
	function is(type, node, opts) {
		if (!node) return false;
		const matches = (0, _isType$2.default)(node.type, type);
		if (!matches) {
			if (!opts && node.type === "Placeholder" && type in _index$38.FLIPPED_ALIAS_KEYS) return (0, _isPlaceholderType$1.default)(node.expectedNode, type);
			return false;
		}
		if (opts === void 0) return true;
		else return (0, _shallowEqual$1.default)(node, opts);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/identifier.js
var require_identifier = __commonJS({ "../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/identifier.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isIdentifierChar = isIdentifierChar;
	exports.isIdentifierName = isIdentifierName;
	exports.isIdentifierStart = isIdentifierStart;
	let nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
	let nonASCIIidentifierChars = "·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
	const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
	const astralIdentifierStartCodes = [
		0,
		11,
		2,
		25,
		2,
		18,
		2,
		1,
		2,
		14,
		3,
		13,
		35,
		122,
		70,
		52,
		268,
		28,
		4,
		48,
		48,
		31,
		14,
		29,
		6,
		37,
		11,
		29,
		3,
		35,
		5,
		7,
		2,
		4,
		43,
		157,
		19,
		35,
		5,
		35,
		5,
		39,
		9,
		51,
		13,
		10,
		2,
		14,
		2,
		6,
		2,
		1,
		2,
		10,
		2,
		14,
		2,
		6,
		2,
		1,
		4,
		51,
		13,
		310,
		10,
		21,
		11,
		7,
		25,
		5,
		2,
		41,
		2,
		8,
		70,
		5,
		3,
		0,
		2,
		43,
		2,
		1,
		4,
		0,
		3,
		22,
		11,
		22,
		10,
		30,
		66,
		18,
		2,
		1,
		11,
		21,
		11,
		25,
		71,
		55,
		7,
		1,
		65,
		0,
		16,
		3,
		2,
		2,
		2,
		28,
		43,
		28,
		4,
		28,
		36,
		7,
		2,
		27,
		28,
		53,
		11,
		21,
		11,
		18,
		14,
		17,
		111,
		72,
		56,
		50,
		14,
		50,
		14,
		35,
		39,
		27,
		10,
		22,
		251,
		41,
		7,
		1,
		17,
		2,
		60,
		28,
		11,
		0,
		9,
		21,
		43,
		17,
		47,
		20,
		28,
		22,
		13,
		52,
		58,
		1,
		3,
		0,
		14,
		44,
		33,
		24,
		27,
		35,
		30,
		0,
		3,
		0,
		9,
		34,
		4,
		0,
		13,
		47,
		15,
		3,
		22,
		0,
		2,
		0,
		36,
		17,
		2,
		24,
		20,
		1,
		64,
		6,
		2,
		0,
		2,
		3,
		2,
		14,
		2,
		9,
		8,
		46,
		39,
		7,
		3,
		1,
		3,
		21,
		2,
		6,
		2,
		1,
		2,
		4,
		4,
		0,
		19,
		0,
		13,
		4,
		31,
		9,
		2,
		0,
		3,
		0,
		2,
		37,
		2,
		0,
		26,
		0,
		2,
		0,
		45,
		52,
		19,
		3,
		21,
		2,
		31,
		47,
		21,
		1,
		2,
		0,
		185,
		46,
		42,
		3,
		37,
		47,
		21,
		0,
		60,
		42,
		14,
		0,
		72,
		26,
		38,
		6,
		186,
		43,
		117,
		63,
		32,
		7,
		3,
		0,
		3,
		7,
		2,
		1,
		2,
		23,
		16,
		0,
		2,
		0,
		95,
		7,
		3,
		38,
		17,
		0,
		2,
		0,
		29,
		0,
		11,
		39,
		8,
		0,
		22,
		0,
		12,
		45,
		20,
		0,
		19,
		72,
		200,
		32,
		32,
		8,
		2,
		36,
		18,
		0,
		50,
		29,
		113,
		6,
		2,
		1,
		2,
		37,
		22,
		0,
		26,
		5,
		2,
		1,
		2,
		31,
		15,
		0,
		328,
		18,
		16,
		0,
		2,
		12,
		2,
		33,
		125,
		0,
		80,
		921,
		103,
		110,
		18,
		195,
		2637,
		96,
		16,
		1071,
		18,
		5,
		26,
		3994,
		6,
		582,
		6842,
		29,
		1763,
		568,
		8,
		30,
		18,
		78,
		18,
		29,
		19,
		47,
		17,
		3,
		32,
		20,
		6,
		18,
		433,
		44,
		212,
		63,
		129,
		74,
		6,
		0,
		67,
		12,
		65,
		1,
		2,
		0,
		29,
		6135,
		9,
		1237,
		42,
		9,
		8936,
		3,
		2,
		6,
		2,
		1,
		2,
		290,
		16,
		0,
		30,
		2,
		3,
		0,
		15,
		3,
		9,
		395,
		2309,
		106,
		6,
		12,
		4,
		8,
		8,
		9,
		5991,
		84,
		2,
		70,
		2,
		1,
		3,
		0,
		3,
		1,
		3,
		3,
		2,
		11,
		2,
		0,
		2,
		6,
		2,
		64,
		2,
		3,
		3,
		7,
		2,
		6,
		2,
		27,
		2,
		3,
		2,
		4,
		2,
		0,
		4,
		6,
		2,
		339,
		3,
		24,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		7,
		1845,
		30,
		7,
		5,
		262,
		61,
		147,
		44,
		11,
		6,
		17,
		0,
		322,
		29,
		19,
		43,
		485,
		27,
		229,
		29,
		3,
		0,
		496,
		6,
		2,
		3,
		2,
		1,
		2,
		14,
		2,
		196,
		60,
		67,
		8,
		0,
		1205,
		3,
		2,
		26,
		2,
		1,
		2,
		0,
		3,
		0,
		2,
		9,
		2,
		3,
		2,
		0,
		2,
		0,
		7,
		0,
		5,
		0,
		2,
		0,
		2,
		0,
		2,
		2,
		2,
		1,
		2,
		0,
		3,
		0,
		2,
		0,
		2,
		0,
		2,
		0,
		2,
		0,
		2,
		1,
		2,
		0,
		3,
		3,
		2,
		6,
		2,
		3,
		2,
		3,
		2,
		0,
		2,
		9,
		2,
		16,
		6,
		2,
		2,
		4,
		2,
		16,
		4421,
		42719,
		33,
		4153,
		7,
		221,
		3,
		5761,
		15,
		7472,
		16,
		621,
		2467,
		541,
		1507,
		4938,
		6,
		4191
	];
	const astralIdentifierCodes = [
		509,
		0,
		227,
		0,
		150,
		4,
		294,
		9,
		1368,
		2,
		2,
		1,
		6,
		3,
		41,
		2,
		5,
		0,
		166,
		1,
		574,
		3,
		9,
		9,
		7,
		9,
		32,
		4,
		318,
		1,
		80,
		3,
		71,
		10,
		50,
		3,
		123,
		2,
		54,
		14,
		32,
		10,
		3,
		1,
		11,
		3,
		46,
		10,
		8,
		0,
		46,
		9,
		7,
		2,
		37,
		13,
		2,
		9,
		6,
		1,
		45,
		0,
		13,
		2,
		49,
		13,
		9,
		3,
		2,
		11,
		83,
		11,
		7,
		0,
		3,
		0,
		158,
		11,
		6,
		9,
		7,
		3,
		56,
		1,
		2,
		6,
		3,
		1,
		3,
		2,
		10,
		0,
		11,
		1,
		3,
		6,
		4,
		4,
		68,
		8,
		2,
		0,
		3,
		0,
		2,
		3,
		2,
		4,
		2,
		0,
		15,
		1,
		83,
		17,
		10,
		9,
		5,
		0,
		82,
		19,
		13,
		9,
		214,
		6,
		3,
		8,
		28,
		1,
		83,
		16,
		16,
		9,
		82,
		12,
		9,
		9,
		7,
		19,
		58,
		14,
		5,
		9,
		243,
		14,
		166,
		9,
		71,
		5,
		2,
		1,
		3,
		3,
		2,
		0,
		2,
		1,
		13,
		9,
		120,
		6,
		3,
		6,
		4,
		0,
		29,
		9,
		41,
		6,
		2,
		3,
		9,
		0,
		10,
		10,
		47,
		15,
		343,
		9,
		54,
		7,
		2,
		7,
		17,
		9,
		57,
		21,
		2,
		13,
		123,
		5,
		4,
		0,
		2,
		1,
		2,
		6,
		2,
		0,
		9,
		9,
		49,
		4,
		2,
		1,
		2,
		4,
		9,
		9,
		330,
		3,
		10,
		1,
		2,
		0,
		49,
		6,
		4,
		4,
		14,
		10,
		5350,
		0,
		7,
		14,
		11465,
		27,
		2343,
		9,
		87,
		9,
		39,
		4,
		60,
		6,
		26,
		9,
		535,
		9,
		470,
		0,
		2,
		54,
		8,
		3,
		82,
		0,
		12,
		1,
		19628,
		1,
		4178,
		9,
		519,
		45,
		3,
		22,
		543,
		4,
		4,
		5,
		9,
		7,
		3,
		6,
		31,
		3,
		149,
		2,
		1418,
		49,
		513,
		54,
		5,
		49,
		9,
		0,
		15,
		0,
		23,
		4,
		2,
		14,
		1361,
		6,
		2,
		16,
		3,
		6,
		2,
		1,
		2,
		4,
		101,
		0,
		161,
		6,
		10,
		9,
		357,
		0,
		62,
		13,
		499,
		13,
		245,
		1,
		2,
		9,
		726,
		6,
		110,
		6,
		6,
		9,
		4759,
		9,
		787719,
		239
	];
	function isInAstralSet(code, set) {
		let pos = 65536;
		for (let i = 0, length = set.length; i < length; i += 2) {
			pos += set[i];
			if (pos > code) return false;
			pos += set[i + 1];
			if (pos >= code) return true;
		}
		return false;
	}
	function isIdentifierStart(code) {
		if (code < 65) return code === 36;
		if (code <= 90) return true;
		if (code < 97) return code === 95;
		if (code <= 122) return true;
		if (code <= 65535) return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
		return isInAstralSet(code, astralIdentifierStartCodes);
	}
	function isIdentifierChar(code) {
		if (code < 48) return code === 36;
		if (code < 58) return true;
		if (code < 65) return false;
		if (code <= 90) return true;
		if (code < 97) return code === 95;
		if (code <= 122) return true;
		if (code <= 65535) return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
		return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
	}
	function isIdentifierName(name) {
		let isFirst = true;
		for (let i = 0; i < name.length; i++) {
			let cp = name.charCodeAt(i);
			if ((cp & 64512) === 55296 && i + 1 < name.length) {
				const trail = name.charCodeAt(++i);
				if ((trail & 64512) === 56320) cp = 65536 + ((cp & 1023) << 10) + (trail & 1023);
			}
			if (isFirst) {
				isFirst = false;
				if (!isIdentifierStart(cp)) return false;
			} else if (!isIdentifierChar(cp)) return false;
		}
		return !isFirst;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/keyword.js
var require_keyword = __commonJS({ "../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/keyword.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isKeyword = isKeyword;
	exports.isReservedWord = isReservedWord;
	exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
	exports.isStrictBindReservedWord = isStrictBindReservedWord;
	exports.isStrictReservedWord = isStrictReservedWord;
	const reservedWords = {
		keyword: [
			"break",
			"case",
			"catch",
			"continue",
			"debugger",
			"default",
			"do",
			"else",
			"finally",
			"for",
			"function",
			"if",
			"return",
			"switch",
			"throw",
			"try",
			"var",
			"const",
			"while",
			"with",
			"new",
			"this",
			"super",
			"class",
			"extends",
			"export",
			"import",
			"null",
			"true",
			"false",
			"in",
			"instanceof",
			"typeof",
			"void",
			"delete"
		],
		strict: [
			"implements",
			"interface",
			"let",
			"package",
			"private",
			"protected",
			"public",
			"static",
			"yield"
		],
		strictBind: ["eval", "arguments"]
	};
	const keywords = new Set(reservedWords.keyword);
	const reservedWordsStrictSet = new Set(reservedWords.strict);
	const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
	function isReservedWord(word, inModule) {
		return inModule && word === "await" || word === "enum";
	}
	function isStrictReservedWord(word, inModule) {
		return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
	}
	function isStrictBindOnlyReservedWord(word) {
		return reservedWordsStrictBindSet.has(word);
	}
	function isStrictBindReservedWord(word, inModule) {
		return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
	}
	function isKeyword(word) {
		return keywords.has(word);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/index.js
var require_lib$2 = __commonJS({ "../../node_modules/.pnpm/@babel+helper-validator-identifier@7.25.9/node_modules/@babel/helper-validator-identifier/lib/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "isIdentifierChar", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierChar;
		}
	});
	Object.defineProperty(exports, "isIdentifierName", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierName;
		}
	});
	Object.defineProperty(exports, "isIdentifierStart", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierStart;
		}
	});
	Object.defineProperty(exports, "isKeyword", {
		enumerable: true,
		get: function() {
			return _keyword.isKeyword;
		}
	});
	Object.defineProperty(exports, "isReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictBindOnlyReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictBindReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictBindReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictReservedWord;
		}
	});
	var _identifier = require_identifier();
	var _keyword = require_keyword();
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isValidIdentifier.js
var require_isValidIdentifier = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isValidIdentifier.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isValidIdentifier;
	var _helperValidatorIdentifier$2 = require_lib$2();
	function isValidIdentifier(name, reserved = true) {
		if (typeof name !== "string") return false;
		if (reserved) {
			if ((0, _helperValidatorIdentifier$2.isKeyword)(name) || (0, _helperValidatorIdentifier$2.isStrictReservedWord)(name, true)) return false;
		}
		return (0, _helperValidatorIdentifier$2.isIdentifierName)(name);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-string-parser@7.25.9/node_modules/@babel/helper-string-parser/lib/index.js
var require_lib$1 = __commonJS({ "../../node_modules/.pnpm/@babel+helper-string-parser@7.25.9/node_modules/@babel/helper-string-parser/lib/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readCodePoint = readCodePoint;
	exports.readInt = readInt;
	exports.readStringContents = readStringContents;
	var _isDigit = function isDigit(code) {
		return code >= 48 && code <= 57;
	};
	const forbiddenNumericSeparatorSiblings = {
		decBinOct: new Set([
			46,
			66,
			69,
			79,
			95,
			98,
			101,
			111
		]),
		hex: new Set([
			46,
			88,
			95,
			120
		])
	};
	const isAllowedNumericSeparatorSibling = {
		bin: (ch) => ch === 48 || ch === 49,
		oct: (ch) => ch >= 48 && ch <= 55,
		dec: (ch) => ch >= 48 && ch <= 57,
		hex: (ch) => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
	};
	function readStringContents(type, input, pos, lineStart, curLine, errors) {
		const initialPos = pos;
		const initialLineStart = lineStart;
		const initialCurLine = curLine;
		let out = "";
		let firstInvalidLoc = null;
		let chunkStart = pos;
		const { length } = input;
		for (;;) {
			if (pos >= length) {
				errors.unterminated(initialPos, initialLineStart, initialCurLine);
				out += input.slice(chunkStart, pos);
				break;
			}
			const ch = input.charCodeAt(pos);
			if (isStringEnd(type, ch, input, pos)) {
				out += input.slice(chunkStart, pos);
				break;
			}
			if (ch === 92) {
				out += input.slice(chunkStart, pos);
				const res = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors);
				if (res.ch === null && !firstInvalidLoc) firstInvalidLoc = {
					pos,
					lineStart,
					curLine
				};
				else out += res.ch;
				({pos, lineStart, curLine} = res);
				chunkStart = pos;
			} else if (ch === 8232 || ch === 8233) {
				++pos;
				++curLine;
				lineStart = pos;
			} else if (ch === 10 || ch === 13) if (type === "template") {
				out += input.slice(chunkStart, pos) + "\n";
				++pos;
				if (ch === 13 && input.charCodeAt(pos) === 10) ++pos;
				++curLine;
				chunkStart = lineStart = pos;
			} else errors.unterminated(initialPos, initialLineStart, initialCurLine);
			else ++pos;
		}
		return {
			pos,
			str: out,
			firstInvalidLoc,
			lineStart,
			curLine,
			containsInvalid: !!firstInvalidLoc
		};
	}
	function isStringEnd(type, ch, input, pos) {
		if (type === "template") return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
		return ch === (type === "double" ? 34 : 39);
	}
	function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
		const throwOnInvalid = !inTemplate;
		pos++;
		const res = (ch$1) => ({
			pos,
			ch: ch$1,
			lineStart,
			curLine
		});
		const ch = input.charCodeAt(pos++);
		switch (ch) {
			case 110: return res("\n");
			case 114: return res("\r");
			case 120: {
				let code;
				({code, pos} = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
				return res(code === null ? null : String.fromCharCode(code));
			}
			case 117: {
				let code;
				({code, pos} = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
				return res(code === null ? null : String.fromCodePoint(code));
			}
			case 116: return res("	");
			case 98: return res("\b");
			case 118: return res("\v");
			case 102: return res("\f");
			case 13: if (input.charCodeAt(pos) === 10) ++pos;
			case 10:
				lineStart = pos;
				++curLine;
			case 8232:
			case 8233: return res("");
			case 56:
			case 57: if (inTemplate) return res(null);
			else errors.strictNumericEscape(pos - 1, lineStart, curLine);
			default:
				if (ch >= 48 && ch <= 55) {
					const startPos = pos - 1;
					const match$1 = /^[0-7]+/.exec(input.slice(startPos, pos + 2));
					let octalStr = match$1[0];
					let octal = parseInt(octalStr, 8);
					if (octal > 255) {
						octalStr = octalStr.slice(0, -1);
						octal = parseInt(octalStr, 8);
					}
					pos += octalStr.length - 1;
					const next = input.charCodeAt(pos);
					if (octalStr !== "0" || next === 56 || next === 57) if (inTemplate) return res(null);
					else errors.strictNumericEscape(startPos, lineStart, curLine);
					return res(String.fromCharCode(octal));
				}
				return res(String.fromCharCode(ch));
		}
	}
	function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
		const initialPos = pos;
		let n;
		({n, pos} = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors, !throwOnInvalid));
		if (n === null) if (throwOnInvalid) errors.invalidEscapeSequence(initialPos, lineStart, curLine);
		else pos = initialPos - 1;
		return {
			code: n,
			pos
		};
	}
	function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors, bailOnError) {
		const start = pos;
		const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
		const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
		let invalid = false;
		let total = 0;
		for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
			const code = input.charCodeAt(pos);
			let val;
			if (code === 95 && allowNumSeparator !== "bail") {
				const prev = input.charCodeAt(pos - 1);
				const next = input.charCodeAt(pos + 1);
				if (!allowNumSeparator) {
					if (bailOnError) return {
						n: null,
						pos
					};
					errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
				} else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
					if (bailOnError) return {
						n: null,
						pos
					};
					errors.unexpectedNumericSeparator(pos, lineStart, curLine);
				}
				++pos;
				continue;
			}
			if (code >= 97) val = code - 97 + 10;
			else if (code >= 65) val = code - 65 + 10;
			else if (_isDigit(code)) val = code - 48;
			else val = Infinity;
			if (val >= radix) if (val <= 9 && bailOnError) return {
				n: null,
				pos
			};
			else if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) val = 0;
			else if (forceLen) {
				val = 0;
				invalid = true;
			} else break;
			++pos;
			total = total * radix + val;
		}
		if (pos === start || len != null && pos - start !== len || invalid) return {
			n: null,
			pos
		};
		return {
			n: total,
			pos
		};
	}
	function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
		const ch = input.charCodeAt(pos);
		let code;
		if (ch === 123) {
			++pos;
			({code, pos} = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
			++pos;
			if (code !== null && code > 1114111) if (throwOnInvalid) errors.invalidCodePoint(pos, lineStart, curLine);
			else return {
				code: null,
				pos
			};
		} else ({code, pos} = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
		return {
			code,
			pos
		};
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/constants/index.js
var require_constants = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/constants/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UPDATE_OPERATORS = exports.UNARY_OPERATORS = exports.STRING_UNARY_OPERATORS = exports.STATEMENT_OR_BLOCK_KEYS = exports.NUMBER_UNARY_OPERATORS = exports.NUMBER_BINARY_OPERATORS = exports.NOT_LOCAL_BINDING = exports.LOGICAL_OPERATORS = exports.INHERIT_KEYS = exports.FOR_INIT_KEYS = exports.FLATTENABLE_KEYS = exports.EQUALITY_BINARY_OPERATORS = exports.COMPARISON_BINARY_OPERATORS = exports.COMMENT_KEYS = exports.BOOLEAN_UNARY_OPERATORS = exports.BOOLEAN_NUMBER_BINARY_OPERATORS = exports.BOOLEAN_BINARY_OPERATORS = exports.BLOCK_SCOPED_SYMBOL = exports.BINARY_OPERATORS = exports.ASSIGNMENT_OPERATORS = void 0;
	const STATEMENT_OR_BLOCK_KEYS = exports.STATEMENT_OR_BLOCK_KEYS = [
		"consequent",
		"body",
		"alternate"
	];
	const FLATTENABLE_KEYS = exports.FLATTENABLE_KEYS = ["body", "expressions"];
	const FOR_INIT_KEYS = exports.FOR_INIT_KEYS = ["left", "init"];
	const COMMENT_KEYS = exports.COMMENT_KEYS = [
		"leadingComments",
		"trailingComments",
		"innerComments"
	];
	const LOGICAL_OPERATORS = exports.LOGICAL_OPERATORS = [
		"||",
		"&&",
		"??"
	];
	const UPDATE_OPERATORS = exports.UPDATE_OPERATORS = ["++", "--"];
	const BOOLEAN_NUMBER_BINARY_OPERATORS = exports.BOOLEAN_NUMBER_BINARY_OPERATORS = [
		">",
		"<",
		">=",
		"<="
	];
	const EQUALITY_BINARY_OPERATORS = exports.EQUALITY_BINARY_OPERATORS = [
		"==",
		"===",
		"!=",
		"!=="
	];
	const COMPARISON_BINARY_OPERATORS = exports.COMPARISON_BINARY_OPERATORS = [
		...EQUALITY_BINARY_OPERATORS,
		"in",
		"instanceof"
	];
	const BOOLEAN_BINARY_OPERATORS = exports.BOOLEAN_BINARY_OPERATORS = [...COMPARISON_BINARY_OPERATORS, ...BOOLEAN_NUMBER_BINARY_OPERATORS];
	const NUMBER_BINARY_OPERATORS = exports.NUMBER_BINARY_OPERATORS = [
		"-",
		"/",
		"%",
		"*",
		"**",
		"&",
		"|",
		">>",
		">>>",
		"<<",
		"^"
	];
	const BINARY_OPERATORS = exports.BINARY_OPERATORS = [
		"+",
		...NUMBER_BINARY_OPERATORS,
		...BOOLEAN_BINARY_OPERATORS,
		"|>"
	];
	const ASSIGNMENT_OPERATORS = exports.ASSIGNMENT_OPERATORS = [
		"=",
		"+=",
		...NUMBER_BINARY_OPERATORS.map((op) => op + "="),
		...LOGICAL_OPERATORS.map((op) => op + "=")
	];
	const BOOLEAN_UNARY_OPERATORS = exports.BOOLEAN_UNARY_OPERATORS = ["delete", "!"];
	const NUMBER_UNARY_OPERATORS = exports.NUMBER_UNARY_OPERATORS = [
		"+",
		"-",
		"~"
	];
	const STRING_UNARY_OPERATORS = exports.STRING_UNARY_OPERATORS = ["typeof"];
	const UNARY_OPERATORS = exports.UNARY_OPERATORS = [
		"void",
		"throw",
		...BOOLEAN_UNARY_OPERATORS,
		...NUMBER_UNARY_OPERATORS,
		...STRING_UNARY_OPERATORS
	];
	const INHERIT_KEYS = exports.INHERIT_KEYS = {
		optional: [
			"typeAnnotation",
			"typeParameters",
			"returnType"
		],
		force: [
			"start",
			"loc",
			"end"
		]
	};
	const BLOCK_SCOPED_SYMBOL = exports.BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
	const NOT_LOCAL_BINDING = exports.NOT_LOCAL_BINDING = Symbol.for("should not be considered a local binding");
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/utils.js
var require_utils = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/utils.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VISITOR_KEYS = exports.NODE_PARENT_VALIDATIONS = exports.NODE_FIELDS = exports.FLIPPED_ALIAS_KEYS = exports.DEPRECATED_KEYS = exports.BUILDER_KEYS = exports.ALIAS_KEYS = void 0;
	exports.arrayOf = arrayOf;
	exports.arrayOfType = arrayOfType;
	exports.assertEach = assertEach;
	exports.assertNodeOrValueType = assertNodeOrValueType;
	exports.assertNodeType = assertNodeType;
	exports.assertOneOf = assertOneOf;
	exports.assertOptionalChainStart = assertOptionalChainStart;
	exports.assertShape = assertShape;
	exports.assertValueType = assertValueType;
	exports.chain = chain;
	exports.default = defineType$5;
	exports.defineAliasedType = defineAliasedType;
	exports.validate = validate$2;
	exports.validateArrayOfType = validateArrayOfType;
	exports.validateOptional = validateOptional;
	exports.validateOptionalType = validateOptionalType;
	exports.validateType = validateType;
	var _is$4 = require_is();
	var _validate$2 = require_validate();
	const VISITOR_KEYS = exports.VISITOR_KEYS = {};
	const ALIAS_KEYS = exports.ALIAS_KEYS = {};
	const FLIPPED_ALIAS_KEYS = exports.FLIPPED_ALIAS_KEYS = {};
	const NODE_FIELDS$1 = exports.NODE_FIELDS = {};
	const BUILDER_KEYS = exports.BUILDER_KEYS = {};
	const DEPRECATED_KEYS = exports.DEPRECATED_KEYS = {};
	const NODE_PARENT_VALIDATIONS = exports.NODE_PARENT_VALIDATIONS = {};
	function getType(val) {
		if (Array.isArray(val)) return "array";
		else if (val === null) return "null";
		else return typeof val;
	}
	function validate$2(validate$3) {
		return { validate: validate$3 };
	}
	function validateType(...typeNames) {
		return validate$2(assertNodeType(...typeNames));
	}
	function validateOptional(validate$3) {
		return {
			validate: validate$3,
			optional: true
		};
	}
	function validateOptionalType(...typeNames) {
		return {
			validate: assertNodeType(...typeNames),
			optional: true
		};
	}
	function arrayOf(elementType) {
		return chain(assertValueType("array"), assertEach(elementType));
	}
	function arrayOfType(...typeNames) {
		return arrayOf(assertNodeType(...typeNames));
	}
	function validateArrayOfType(...typeNames) {
		return validate$2(arrayOfType(...typeNames));
	}
	function assertEach(callback) {
		const childValidator = process.env.BABEL_TYPES_8_BREAKING ? _validate$2.validateChild : () => {};
		function validator(node, key, val) {
			if (!Array.isArray(val)) return;
			for (let i = 0; i < val.length; i++) {
				const subkey = `${key}[${i}]`;
				const v = val[i];
				callback(node, subkey, v);
				childValidator(node, subkey, v);
			}
		}
		validator.each = callback;
		return validator;
	}
	function assertOneOf(...values) {
		function validate$3(node, key, val) {
			if (!values.includes(val)) throw new TypeError(`Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`);
		}
		validate$3.oneOf = values;
		return validate$3;
	}
	function assertNodeType(...types$1) {
		function validate$3(node, key, val) {
			for (const type of types$1) if ((0, _is$4.default)(type, val)) {
				(0, _validate$2.validateChild)(node, key, val);
				return;
			}
			throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types$1)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
		}
		validate$3.oneOfNodeTypes = types$1;
		return validate$3;
	}
	function assertNodeOrValueType(...types$1) {
		function validate$3(node, key, val) {
			for (const type of types$1) if (getType(val) === type || (0, _is$4.default)(type, val)) {
				(0, _validate$2.validateChild)(node, key, val);
				return;
			}
			throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types$1)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
		}
		validate$3.oneOfNodeOrValueTypes = types$1;
		return validate$3;
	}
	function assertValueType(type) {
		function validate$3(node, key, val) {
			const valid = getType(val) === type;
			if (!valid) throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
		}
		validate$3.type = type;
		return validate$3;
	}
	function assertShape(shape) {
		function validate$3(node, key, val) {
			const errors = [];
			for (const property of Object.keys(shape)) try {
				(0, _validate$2.validateField)(node, property, val[property], shape[property]);
			} catch (error) {
				if (error instanceof TypeError) {
					errors.push(error.message);
					continue;
				}
				throw error;
			}
			if (errors.length) throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
		}
		validate$3.shapeOf = shape;
		return validate$3;
	}
	function assertOptionalChainStart() {
		function validate$3(node) {
			var _current;
			let current = node;
			while (node) {
				const { type } = current;
				if (type === "OptionalCallExpression") {
					if (current.optional) return;
					current = current.callee;
					continue;
				}
				if (type === "OptionalMemberExpression") {
					if (current.optional) return;
					current = current.object;
					continue;
				}
				break;
			}
			throw new TypeError(`Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${(_current = current) == null ? void 0 : _current.type}`);
		}
		return validate$3;
	}
	function chain(...fns) {
		function validate$3(...args) {
			for (const fn of fns) fn(...args);
		}
		validate$3.chainOf = fns;
		if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1])) throw new Error(`An assertValueType("array") validator can only be followed by an assertEach(...) validator.`);
		return validate$3;
	}
	const validTypeOpts = new Set([
		"aliases",
		"builder",
		"deprecatedAlias",
		"fields",
		"inherits",
		"visitor",
		"validate"
	]);
	const validFieldKeys = new Set([
		"default",
		"optional",
		"deprecated",
		"validate"
	]);
	const store = {};
	function defineAliasedType(...aliases) {
		return (type, opts = {}) => {
			let defined = opts.aliases;
			if (!defined) {
				var _store$opts$inherits$, _defined;
				if (opts.inherits) defined = (_store$opts$inherits$ = store[opts.inherits].aliases) == null ? void 0 : _store$opts$inherits$.slice();
				(_defined = defined) != null || (defined = []);
				opts.aliases = defined;
			}
			const additional = aliases.filter((a) => !defined.includes(a));
			defined.unshift(...additional);
			defineType$5(type, opts);
		};
	}
	function defineType$5(type, opts = {}) {
		const inherits$1 = opts.inherits && store[opts.inherits] || {};
		let fields = opts.fields;
		if (!fields) {
			fields = {};
			if (inherits$1.fields) {
				const keys$1 = Object.getOwnPropertyNames(inherits$1.fields);
				for (const key of keys$1) {
					const field = inherits$1.fields[key];
					const def = field.default;
					if (Array.isArray(def) ? def.length > 0 : def && typeof def === "object") throw new Error("field defaults can only be primitives or empty arrays currently");
					fields[key] = {
						default: Array.isArray(def) ? [] : def,
						optional: field.optional,
						deprecated: field.deprecated,
						validate: field.validate
					};
				}
			}
		}
		const visitor = opts.visitor || inherits$1.visitor || [];
		const aliases = opts.aliases || inherits$1.aliases || [];
		const builder = opts.builder || inherits$1.builder || opts.visitor || [];
		for (const k$1 of Object.keys(opts)) if (!validTypeOpts.has(k$1)) throw new Error(`Unknown type option "${k$1}" on ${type}`);
		if (opts.deprecatedAlias) DEPRECATED_KEYS[opts.deprecatedAlias] = type;
		for (const key of visitor.concat(builder)) fields[key] = fields[key] || {};
		for (const key of Object.keys(fields)) {
			const field = fields[key];
			if (field.default !== void 0 && !builder.includes(key)) field.optional = true;
			if (field.default === void 0) field.default = null;
			else if (!field.validate && field.default != null) field.validate = assertValueType(getType(field.default));
			for (const k$1 of Object.keys(field)) if (!validFieldKeys.has(k$1)) throw new Error(`Unknown field key "${k$1}" on ${type}.${key}`);
		}
		VISITOR_KEYS[type] = opts.visitor = visitor;
		BUILDER_KEYS[type] = opts.builder = builder;
		NODE_FIELDS$1[type] = opts.fields = fields;
		ALIAS_KEYS[type] = opts.aliases = aliases;
		aliases.forEach((alias) => {
			FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
			FLIPPED_ALIAS_KEYS[alias].push(type);
		});
		if (opts.validate) NODE_PARENT_VALIDATIONS[type] = opts.validate;
		store[type] = opts;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/core.js
var require_core = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/core.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.patternLikeCommon = exports.importAttributes = exports.functionTypeAnnotationCommon = exports.functionDeclarationCommon = exports.functionCommon = exports.classMethodOrPropertyCommon = exports.classMethodOrDeclareMethodCommon = void 0;
	var _is$3 = require_is();
	var _isValidIdentifier$4 = require_isValidIdentifier();
	var _helperValidatorIdentifier$1 = require_lib$2();
	var _helperStringParser = require_lib$1();
	var _index$37 = require_constants();
	var _utils$7 = require_utils();
	const defineType$4 = (0, _utils$7.defineAliasedType)("Standardized");
	defineType$4("ArrayExpression", {
		fields: { elements: {
			validate: (0, _utils$7.arrayOf)((0, _utils$7.assertNodeOrValueType)("null", "Expression", "SpreadElement")),
			default: !process.env.BABEL_TYPES_8_BREAKING ? [] : void 0
		} },
		visitor: ["elements"],
		aliases: ["Expression"]
	});
	defineType$4("AssignmentExpression", {
		fields: {
			operator: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertValueType)("string") : Object.assign(function() {
				const identifier$1 = (0, _utils$7.assertOneOf)(..._index$37.ASSIGNMENT_OPERATORS);
				const pattern$1 = (0, _utils$7.assertOneOf)("=");
				return function(node, key, val) {
					const validator = (0, _is$3.default)("Pattern", node.left) ? pattern$1 : identifier$1;
					validator(node, key, val);
				};
			}(), { type: "string" }) },
			left: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertNodeType)("LVal", "OptionalMemberExpression") : (0, _utils$7.assertNodeType)("Identifier", "MemberExpression", "OptionalMemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression") },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") }
		},
		builder: [
			"operator",
			"left",
			"right"
		],
		visitor: ["left", "right"],
		aliases: ["Expression"]
	});
	defineType$4("BinaryExpression", {
		builder: [
			"operator",
			"left",
			"right"
		],
		fields: {
			operator: { validate: (0, _utils$7.assertOneOf)(..._index$37.BINARY_OPERATORS) },
			left: { validate: function() {
				const expression = (0, _utils$7.assertNodeType)("Expression");
				const inOp = (0, _utils$7.assertNodeType)("Expression", "PrivateName");
				const validator = Object.assign(function(node, key, val) {
					const validator$1 = node.operator === "in" ? inOp : expression;
					validator$1(node, key, val);
				}, { oneOfNodeTypes: ["Expression", "PrivateName"] });
				return validator;
			}() },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") }
		},
		visitor: ["left", "right"],
		aliases: ["Binary", "Expression"]
	});
	defineType$4("InterpreterDirective", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$7.assertValueType)("string") } }
	});
	defineType$4("Directive", {
		visitor: ["value"],
		fields: { value: { validate: (0, _utils$7.assertNodeType)("DirectiveLiteral") } }
	});
	defineType$4("DirectiveLiteral", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$7.assertValueType)("string") } }
	});
	defineType$4("BlockStatement", {
		builder: ["body", "directives"],
		visitor: ["directives", "body"],
		fields: {
			directives: {
				validate: (0, _utils$7.arrayOfType)("Directive"),
				default: []
			},
			body: (0, _utils$7.validateArrayOfType)("Statement")
		},
		aliases: [
			"Scopable",
			"BlockParent",
			"Block",
			"Statement"
		]
	});
	defineType$4("BreakStatement", {
		visitor: ["label"],
		fields: { label: {
			validate: (0, _utils$7.assertNodeType)("Identifier"),
			optional: true
		} },
		aliases: [
			"Statement",
			"Terminatorless",
			"CompletionStatement"
		]
	});
	defineType$4("CallExpression", {
		visitor: [
			"callee",
			"arguments",
			"typeParameters",
			"typeArguments"
		],
		builder: ["callee", "arguments"],
		aliases: ["Expression"],
		fields: Object.assign({
			callee: { validate: (0, _utils$7.assertNodeType)("Expression", "Super", "V8IntrinsicIdentifier") },
			arguments: (0, _utils$7.validateArrayOfType)("Expression", "SpreadElement", "ArgumentPlaceholder"),
			typeArguments: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterInstantiation"),
				optional: true
			}
		}, {
			optional: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			typeParameters: {
				validate: (0, _utils$7.assertNodeType)("TSTypeParameterInstantiation"),
				optional: true
			}
		}, process.env.BABEL_TYPES_8_BREAKING ? {} : { optional: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		} })
	});
	defineType$4("CatchClause", {
		visitor: ["param", "body"],
		fields: {
			param: {
				validate: (0, _utils$7.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") }
		},
		aliases: ["Scopable", "BlockParent"]
	});
	defineType$4("ConditionalExpression", {
		visitor: [
			"test",
			"consequent",
			"alternate"
		],
		fields: {
			test: { validate: (0, _utils$7.assertNodeType)("Expression") },
			consequent: { validate: (0, _utils$7.assertNodeType)("Expression") },
			alternate: { validate: (0, _utils$7.assertNodeType)("Expression") }
		},
		aliases: ["Expression", "Conditional"]
	});
	defineType$4("ContinueStatement", {
		visitor: ["label"],
		fields: { label: {
			validate: (0, _utils$7.assertNodeType)("Identifier"),
			optional: true
		} },
		aliases: [
			"Statement",
			"Terminatorless",
			"CompletionStatement"
		]
	});
	defineType$4("DebuggerStatement", { aliases: ["Statement"] });
	defineType$4("DoWhileStatement", {
		builder: ["test", "body"],
		visitor: ["body", "test"],
		fields: {
			test: { validate: (0, _utils$7.assertNodeType)("Expression") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		},
		aliases: [
			"Statement",
			"BlockParent",
			"Loop",
			"While",
			"Scopable"
		]
	});
	defineType$4("EmptyStatement", { aliases: ["Statement"] });
	defineType$4("ExpressionStatement", {
		visitor: ["expression"],
		fields: { expression: { validate: (0, _utils$7.assertNodeType)("Expression") } },
		aliases: ["Statement", "ExpressionWrapper"]
	});
	defineType$4("File", {
		builder: [
			"program",
			"comments",
			"tokens"
		],
		visitor: ["program"],
		fields: {
			program: { validate: (0, _utils$7.assertNodeType)("Program") },
			comments: {
				validate: !process.env.BABEL_TYPES_8_BREAKING ? Object.assign(() => {}, { each: { oneOfNodeTypes: ["CommentBlock", "CommentLine"] } }) : (0, _utils$7.assertEach)((0, _utils$7.assertNodeType)("CommentBlock", "CommentLine")),
				optional: true
			},
			tokens: {
				validate: (0, _utils$7.assertEach)(Object.assign(() => {}, { type: "any" })),
				optional: true
			}
		}
	});
	defineType$4("ForInStatement", {
		visitor: [
			"left",
			"right",
			"body"
		],
		aliases: [
			"Scopable",
			"Statement",
			"For",
			"BlockParent",
			"Loop",
			"ForXStatement"
		],
		fields: {
			left: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertNodeType)("VariableDeclaration", "LVal") : (0, _utils$7.assertNodeType)("VariableDeclaration", "Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression") },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		}
	});
	defineType$4("ForStatement", {
		visitor: [
			"init",
			"test",
			"update",
			"body"
		],
		aliases: [
			"Scopable",
			"Statement",
			"For",
			"BlockParent",
			"Loop"
		],
		fields: {
			init: {
				validate: (0, _utils$7.assertNodeType)("VariableDeclaration", "Expression"),
				optional: true
			},
			test: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			update: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		}
	});
	const functionCommon = () => ({
		params: (0, _utils$7.validateArrayOfType)("Identifier", "Pattern", "RestElement"),
		generator: { default: false },
		async: { default: false }
	});
	exports.functionCommon = functionCommon;
	const functionTypeAnnotationCommon = () => ({
		returnType: {
			validate: (0, _utils$7.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
			optional: true
		},
		typeParameters: {
			validate: (0, _utils$7.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
			optional: true
		}
	});
	exports.functionTypeAnnotationCommon = functionTypeAnnotationCommon;
	const functionDeclarationCommon = () => Object.assign({}, functionCommon(), {
		declare: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		},
		id: {
			validate: (0, _utils$7.assertNodeType)("Identifier"),
			optional: true
		}
	});
	exports.functionDeclarationCommon = functionDeclarationCommon;
	defineType$4("FunctionDeclaration", {
		builder: [
			"id",
			"params",
			"body",
			"generator",
			"async"
		],
		visitor: [
			"id",
			"typeParameters",
			"params",
			"predicate",
			"returnType",
			"body"
		],
		fields: Object.assign({}, functionDeclarationCommon(), functionTypeAnnotationCommon(), {
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") },
			predicate: {
				validate: (0, _utils$7.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
				optional: true
			}
		}),
		aliases: [
			"Scopable",
			"Function",
			"BlockParent",
			"FunctionParent",
			"Statement",
			"Pureish",
			"Declaration"
		],
		validate: !process.env.BABEL_TYPES_8_BREAKING ? void 0 : function() {
			const identifier$1 = (0, _utils$7.assertNodeType)("Identifier");
			return function(parent, key, node) {
				if (!(0, _is$3.default)("ExportDefaultDeclaration", parent)) identifier$1(node, "id", node.id);
			};
		}()
	});
	defineType$4("FunctionExpression", {
		inherits: "FunctionDeclaration",
		aliases: [
			"Scopable",
			"Function",
			"BlockParent",
			"FunctionParent",
			"Expression",
			"Pureish"
		],
		fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
			id: {
				validate: (0, _utils$7.assertNodeType)("Identifier"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") },
			predicate: {
				validate: (0, _utils$7.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
				optional: true
			}
		})
	});
	const patternLikeCommon = () => ({
		typeAnnotation: {
			validate: (0, _utils$7.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
			optional: true
		},
		optional: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		},
		decorators: {
			validate: (0, _utils$7.arrayOfType)("Decorator"),
			optional: true
		}
	});
	exports.patternLikeCommon = patternLikeCommon;
	defineType$4("Identifier", {
		builder: ["name"],
		visitor: ["typeAnnotation", "decorators"],
		aliases: [
			"Expression",
			"PatternLike",
			"LVal",
			"TSEntityName"
		],
		fields: Object.assign({}, patternLikeCommon(), { name: { validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertValueType)("string"), Object.assign(function(node, key, val) {
			if (!(0, _isValidIdentifier$4.default)(val, false)) throw new TypeError(`"${val}" is not a valid identifier name`);
		}, { type: "string" })) : (0, _utils$7.assertValueType)("string") } }),
		validate: process.env.BABEL_TYPES_8_BREAKING ? function(parent, key, node) {
			const match$1 = /\.(\w+)$/.exec(key);
			if (!match$1) return;
			const [, parentKey] = match$1;
			const nonComp = { computed: false };
			if (parentKey === "property") {
				if ((0, _is$3.default)("MemberExpression", parent, nonComp)) return;
				if ((0, _is$3.default)("OptionalMemberExpression", parent, nonComp)) return;
			} else if (parentKey === "key") {
				if ((0, _is$3.default)("Property", parent, nonComp)) return;
				if ((0, _is$3.default)("Method", parent, nonComp)) return;
			} else if (parentKey === "exported") {
				if ((0, _is$3.default)("ExportSpecifier", parent)) return;
			} else if (parentKey === "imported") {
				if ((0, _is$3.default)("ImportSpecifier", parent, { imported: node })) return;
			} else if (parentKey === "meta") {
				if ((0, _is$3.default)("MetaProperty", parent, { meta: node })) return;
			}
			if (((0, _helperValidatorIdentifier$1.isKeyword)(node.name) || (0, _helperValidatorIdentifier$1.isReservedWord)(node.name, false)) && node.name !== "this") throw new TypeError(`"${node.name}" is not a valid identifier`);
		} : void 0
	});
	defineType$4("IfStatement", {
		visitor: [
			"test",
			"consequent",
			"alternate"
		],
		aliases: ["Statement", "Conditional"],
		fields: {
			test: { validate: (0, _utils$7.assertNodeType)("Expression") },
			consequent: { validate: (0, _utils$7.assertNodeType)("Statement") },
			alternate: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("Statement")
			}
		}
	});
	defineType$4("LabeledStatement", {
		visitor: ["label", "body"],
		aliases: ["Statement"],
		fields: {
			label: { validate: (0, _utils$7.assertNodeType)("Identifier") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		}
	});
	defineType$4("StringLiteral", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$7.assertValueType)("string") } },
		aliases: [
			"Expression",
			"Pureish",
			"Literal",
			"Immutable"
		]
	});
	defineType$4("NumericLiteral", {
		builder: ["value"],
		deprecatedAlias: "NumberLiteral",
		fields: { value: { validate: (0, _utils$7.chain)((0, _utils$7.assertValueType)("number"), Object.assign(function(node, key, val) {
			if (1 / val < 0 || !Number.isFinite(val)) {
				const error = new Error(`NumericLiterals must be non-negative finite numbers. You can use t.valueToNode(${val}) instead.`);
			}
		}, { type: "number" })) } },
		aliases: [
			"Expression",
			"Pureish",
			"Literal",
			"Immutable"
		]
	});
	defineType$4("NullLiteral", { aliases: [
		"Expression",
		"Pureish",
		"Literal",
		"Immutable"
	] });
	defineType$4("BooleanLiteral", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$7.assertValueType)("boolean") } },
		aliases: [
			"Expression",
			"Pureish",
			"Literal",
			"Immutable"
		]
	});
	defineType$4("RegExpLiteral", {
		builder: ["pattern", "flags"],
		deprecatedAlias: "RegexLiteral",
		aliases: [
			"Expression",
			"Pureish",
			"Literal"
		],
		fields: {
			pattern: { validate: (0, _utils$7.assertValueType)("string") },
			flags: {
				validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertValueType)("string"), Object.assign(function(node, key, val) {
					const invalid = /[^gimsuy]/.exec(val);
					if (invalid) throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
				}, { type: "string" })) : (0, _utils$7.assertValueType)("string"),
				default: ""
			}
		}
	});
	defineType$4("LogicalExpression", {
		builder: [
			"operator",
			"left",
			"right"
		],
		visitor: ["left", "right"],
		aliases: ["Binary", "Expression"],
		fields: {
			operator: { validate: (0, _utils$7.assertOneOf)(..._index$37.LOGICAL_OPERATORS) },
			left: { validate: (0, _utils$7.assertNodeType)("Expression") },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") }
		}
	});
	defineType$4("MemberExpression", {
		builder: [
			"object",
			"property",
			"computed",
			...!process.env.BABEL_TYPES_8_BREAKING ? ["optional"] : []
		],
		visitor: ["object", "property"],
		aliases: ["Expression", "LVal"],
		fields: Object.assign({
			object: { validate: (0, _utils$7.assertNodeType)("Expression", "Super") },
			property: { validate: function() {
				const normal = (0, _utils$7.assertNodeType)("Identifier", "PrivateName");
				const computed = (0, _utils$7.assertNodeType)("Expression");
				const validator = function(node, key, val) {
					const validator$1 = node.computed ? computed : normal;
					validator$1(node, key, val);
				};
				validator.oneOfNodeTypes = [
					"Expression",
					"Identifier",
					"PrivateName"
				];
				return validator;
			}() },
			computed: { default: false }
		}, !process.env.BABEL_TYPES_8_BREAKING ? { optional: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		} } : {})
	});
	defineType$4("NewExpression", { inherits: "CallExpression" });
	defineType$4("Program", {
		visitor: ["directives", "body"],
		builder: [
			"body",
			"directives",
			"sourceType",
			"interpreter"
		],
		fields: {
			sourceType: {
				validate: (0, _utils$7.assertOneOf)("script", "module"),
				default: "script"
			},
			interpreter: {
				validate: (0, _utils$7.assertNodeType)("InterpreterDirective"),
				default: null,
				optional: true
			},
			directives: {
				validate: (0, _utils$7.arrayOfType)("Directive"),
				default: []
			},
			body: (0, _utils$7.validateArrayOfType)("Statement")
		},
		aliases: [
			"Scopable",
			"BlockParent",
			"Block"
		]
	});
	defineType$4("ObjectExpression", {
		visitor: ["properties"],
		aliases: ["Expression"],
		fields: { properties: (0, _utils$7.validateArrayOfType)("ObjectMethod", "ObjectProperty", "SpreadElement") }
	});
	defineType$4("ObjectMethod", {
		builder: [
			"kind",
			"key",
			"params",
			"body",
			"computed",
			"generator",
			"async"
		],
		visitor: [
			"decorators",
			"key",
			"typeParameters",
			"params",
			"returnType",
			"body"
		],
		fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
			kind: Object.assign({ validate: (0, _utils$7.assertOneOf)("method", "get", "set") }, !process.env.BABEL_TYPES_8_BREAKING ? { default: "method" } : {}),
			computed: { default: false },
			key: { validate: function() {
				const normal = (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
				const computed = (0, _utils$7.assertNodeType)("Expression");
				const validator = function(node, key, val) {
					const validator$1 = node.computed ? computed : normal;
					validator$1(node, key, val);
				};
				validator.oneOfNodeTypes = [
					"Expression",
					"Identifier",
					"StringLiteral",
					"NumericLiteral",
					"BigIntLiteral"
				];
				return validator;
			}() },
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") }
		}),
		aliases: [
			"UserWhitespacable",
			"Function",
			"Scopable",
			"BlockParent",
			"FunctionParent",
			"Method",
			"ObjectMember"
		]
	});
	defineType$4("ObjectProperty", {
		builder: [
			"key",
			"value",
			"computed",
			"shorthand",
			...!process.env.BABEL_TYPES_8_BREAKING ? ["decorators"] : []
		],
		fields: {
			computed: { default: false },
			key: { validate: function() {
				const normal = (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName");
				const computed = (0, _utils$7.assertNodeType)("Expression");
				const validator = Object.assign(function(node, key, val) {
					const validator$1 = node.computed ? computed : normal;
					validator$1(node, key, val);
				}, { oneOfNodeTypes: [
					"Expression",
					"Identifier",
					"StringLiteral",
					"NumericLiteral",
					"BigIntLiteral",
					"DecimalLiteral",
					"PrivateName"
				] });
				return validator;
			}() },
			value: { validate: (0, _utils$7.assertNodeType)("Expression", "PatternLike") },
			shorthand: {
				validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertValueType)("boolean"), Object.assign(function(node, key, shorthand) {
					if (!shorthand) return;
					if (node.computed) throw new TypeError("Property shorthand of ObjectProperty cannot be true if computed is true");
					if (!(0, _is$3.default)("Identifier", node.key)) throw new TypeError("Property shorthand of ObjectProperty cannot be true if key is not an Identifier");
				}, { type: "boolean" })) : (0, _utils$7.assertValueType)("boolean"),
				default: false
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			}
		},
		visitor: [
			"key",
			"value",
			"decorators"
		],
		aliases: [
			"UserWhitespacable",
			"Property",
			"ObjectMember"
		],
		validate: !process.env.BABEL_TYPES_8_BREAKING ? void 0 : function() {
			const pattern$1 = (0, _utils$7.assertNodeType)("Identifier", "Pattern", "TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression", "TSTypeAssertion");
			const expression = (0, _utils$7.assertNodeType)("Expression");
			return function(parent, key, node) {
				const validator = (0, _is$3.default)("ObjectPattern", parent) ? pattern$1 : expression;
				validator(node, "value", node.value);
			};
		}()
	});
	defineType$4("RestElement", {
		visitor: ["argument", "typeAnnotation"],
		builder: ["argument"],
		aliases: ["LVal", "PatternLike"],
		deprecatedAlias: "RestProperty",
		fields: Object.assign({}, patternLikeCommon(), { argument: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertNodeType)("LVal") : (0, _utils$7.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression") } }),
		validate: process.env.BABEL_TYPES_8_BREAKING ? function(parent, key) {
			const match$1 = /(\w+)\[(\d+)\]/.exec(key);
			if (!match$1) throw new Error("Internal Babel error: malformed key.");
			const [, listKey, index] = match$1;
			if (parent[listKey].length > +index + 1) throw new TypeError(`RestElement must be last element of ${listKey}`);
		} : void 0
	});
	defineType$4("ReturnStatement", {
		visitor: ["argument"],
		aliases: [
			"Statement",
			"Terminatorless",
			"CompletionStatement"
		],
		fields: { argument: {
			validate: (0, _utils$7.assertNodeType)("Expression"),
			optional: true
		} }
	});
	defineType$4("SequenceExpression", {
		visitor: ["expressions"],
		fields: { expressions: (0, _utils$7.validateArrayOfType)("Expression") },
		aliases: ["Expression"]
	});
	defineType$4("ParenthesizedExpression", {
		visitor: ["expression"],
		aliases: ["Expression", "ExpressionWrapper"],
		fields: { expression: { validate: (0, _utils$7.assertNodeType)("Expression") } }
	});
	defineType$4("SwitchCase", {
		visitor: ["test", "consequent"],
		fields: {
			test: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			consequent: (0, _utils$7.validateArrayOfType)("Statement")
		}
	});
	defineType$4("SwitchStatement", {
		visitor: ["discriminant", "cases"],
		aliases: [
			"Statement",
			"BlockParent",
			"Scopable"
		],
		fields: {
			discriminant: { validate: (0, _utils$7.assertNodeType)("Expression") },
			cases: (0, _utils$7.validateArrayOfType)("SwitchCase")
		}
	});
	defineType$4("ThisExpression", { aliases: ["Expression"] });
	defineType$4("ThrowStatement", {
		visitor: ["argument"],
		aliases: [
			"Statement",
			"Terminatorless",
			"CompletionStatement"
		],
		fields: { argument: { validate: (0, _utils$7.assertNodeType)("Expression") } }
	});
	defineType$4("TryStatement", {
		visitor: [
			"block",
			"handler",
			"finalizer"
		],
		aliases: ["Statement"],
		fields: {
			block: { validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertNodeType)("BlockStatement"), Object.assign(function(node) {
				if (!node.handler && !node.finalizer) throw new TypeError("TryStatement expects either a handler or finalizer, or both");
			}, { oneOfNodeTypes: ["BlockStatement"] })) : (0, _utils$7.assertNodeType)("BlockStatement") },
			handler: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("CatchClause")
			},
			finalizer: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("BlockStatement")
			}
		}
	});
	defineType$4("UnaryExpression", {
		builder: [
			"operator",
			"argument",
			"prefix"
		],
		fields: {
			prefix: { default: true },
			argument: { validate: (0, _utils$7.assertNodeType)("Expression") },
			operator: { validate: (0, _utils$7.assertOneOf)(..._index$37.UNARY_OPERATORS) }
		},
		visitor: ["argument"],
		aliases: ["UnaryLike", "Expression"]
	});
	defineType$4("UpdateExpression", {
		builder: [
			"operator",
			"argument",
			"prefix"
		],
		fields: {
			prefix: { default: false },
			argument: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertNodeType)("Expression") : (0, _utils$7.assertNodeType)("Identifier", "MemberExpression") },
			operator: { validate: (0, _utils$7.assertOneOf)(..._index$37.UPDATE_OPERATORS) }
		},
		visitor: ["argument"],
		aliases: ["Expression"]
	});
	defineType$4("VariableDeclaration", {
		builder: ["kind", "declarations"],
		visitor: ["declarations"],
		aliases: ["Statement", "Declaration"],
		fields: {
			declare: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			kind: { validate: (0, _utils$7.assertOneOf)("var", "let", "const", "using", "await using") },
			declarations: (0, _utils$7.validateArrayOfType)("VariableDeclarator")
		},
		validate: process.env.BABEL_TYPES_8_BREAKING ? (() => {
			const withoutInit = (0, _utils$7.assertNodeType)("Identifier");
			return function(parent, key, node) {
				if ((0, _is$3.default)("ForXStatement", parent, { left: node })) {
					if (node.declarations.length !== 1) throw new TypeError(`Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`);
				} else node.declarations.forEach((decl) => {
					if (!decl.init) withoutInit(decl, "id", decl.id);
				});
			};
		})() : void 0
	});
	defineType$4("VariableDeclarator", {
		visitor: ["id", "init"],
		fields: {
			id: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertNodeType)("LVal") : (0, _utils$7.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern") },
			definite: {
				optional: true,
				validate: (0, _utils$7.assertValueType)("boolean")
			},
			init: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("Expression")
			}
		}
	});
	defineType$4("WhileStatement", {
		visitor: ["test", "body"],
		aliases: [
			"Statement",
			"BlockParent",
			"Loop",
			"While",
			"Scopable"
		],
		fields: {
			test: { validate: (0, _utils$7.assertNodeType)("Expression") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		}
	});
	defineType$4("WithStatement", {
		visitor: ["object", "body"],
		aliases: ["Statement"],
		fields: {
			object: { validate: (0, _utils$7.assertNodeType)("Expression") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") }
		}
	});
	defineType$4("AssignmentPattern", {
		visitor: [
			"left",
			"right",
			"decorators"
		],
		builder: ["left", "right"],
		aliases: [
			"Pattern",
			"PatternLike",
			"LVal"
		],
		fields: Object.assign({}, patternLikeCommon(), {
			left: { validate: (0, _utils$7.assertNodeType)("Identifier", "ObjectPattern", "ArrayPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression") },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") },
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			}
		})
	});
	defineType$4("ArrayPattern", {
		visitor: ["elements", "typeAnnotation"],
		builder: ["elements"],
		aliases: [
			"Pattern",
			"PatternLike",
			"LVal"
		],
		fields: Object.assign({}, patternLikeCommon(), { elements: { validate: (0, _utils$7.chain)((0, _utils$7.assertValueType)("array"), (0, _utils$7.assertEach)((0, _utils$7.assertNodeOrValueType)("null", "PatternLike", "LVal"))) } })
	});
	defineType$4("ArrowFunctionExpression", {
		builder: [
			"params",
			"body",
			"async"
		],
		visitor: [
			"typeParameters",
			"params",
			"predicate",
			"returnType",
			"body"
		],
		aliases: [
			"Scopable",
			"Function",
			"BlockParent",
			"FunctionParent",
			"Expression",
			"Pureish"
		],
		fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
			expression: { validate: (0, _utils$7.assertValueType)("boolean") },
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement", "Expression") },
			predicate: {
				validate: (0, _utils$7.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
				optional: true
			}
		})
	});
	defineType$4("ClassBody", {
		visitor: ["body"],
		fields: { body: (0, _utils$7.validateArrayOfType)("ClassMethod", "ClassPrivateMethod", "ClassProperty", "ClassPrivateProperty", "ClassAccessorProperty", "TSDeclareMethod", "TSIndexSignature", "StaticBlock") }
	});
	defineType$4("ClassExpression", {
		builder: [
			"id",
			"superClass",
			"body",
			"decorators"
		],
		visitor: [
			"decorators",
			"id",
			"typeParameters",
			"superClass",
			"superTypeParameters",
			"mixins",
			"implements",
			"body"
		],
		aliases: [
			"Scopable",
			"Class",
			"Expression"
		],
		fields: {
			id: {
				validate: (0, _utils$7.assertNodeType)("Identifier"),
				optional: true
			},
			typeParameters: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("ClassBody") },
			superClass: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("Expression")
			},
			["superTypeParameters"]: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
				optional: true
			},
			implements: {
				validate: (0, _utils$7.arrayOfType)("TSExpressionWithTypeArguments", "ClassImplements"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			mixins: {
				validate: (0, _utils$7.assertNodeType)("InterfaceExtends"),
				optional: true
			}
		}
	});
	defineType$4("ClassDeclaration", {
		inherits: "ClassExpression",
		aliases: [
			"Scopable",
			"Class",
			"Statement",
			"Declaration"
		],
		fields: {
			id: {
				validate: (0, _utils$7.assertNodeType)("Identifier"),
				optional: true
			},
			typeParameters: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
				optional: true
			},
			body: { validate: (0, _utils$7.assertNodeType)("ClassBody") },
			superClass: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("Expression")
			},
			["superTypeParameters"]: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
				optional: true
			},
			implements: {
				validate: (0, _utils$7.arrayOfType)("TSExpressionWithTypeArguments", "ClassImplements"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			mixins: {
				validate: (0, _utils$7.assertNodeType)("InterfaceExtends"),
				optional: true
			},
			declare: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			abstract: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			}
		},
		validate: !process.env.BABEL_TYPES_8_BREAKING ? void 0 : function() {
			const identifier$1 = (0, _utils$7.assertNodeType)("Identifier");
			return function(parent, key, node) {
				if (!(0, _is$3.default)("ExportDefaultDeclaration", parent)) identifier$1(node, "id", node.id);
			};
		}()
	});
	const importAttributes = exports.importAttributes = {
		attributes: {
			optional: true,
			validate: (0, _utils$7.arrayOfType)("ImportAttribute")
		},
		assertions: {
			deprecated: true,
			optional: true,
			validate: (0, _utils$7.arrayOfType)("ImportAttribute")
		}
	};
	defineType$4("ExportAllDeclaration", {
		builder: ["source"],
		visitor: [
			"source",
			"attributes",
			"assertions"
		],
		aliases: [
			"Statement",
			"Declaration",
			"ImportOrExportDeclaration",
			"ExportDeclaration"
		],
		fields: Object.assign({
			source: { validate: (0, _utils$7.assertNodeType)("StringLiteral") },
			exportKind: (0, _utils$7.validateOptional)((0, _utils$7.assertOneOf)("type", "value"))
		}, importAttributes)
	});
	defineType$4("ExportDefaultDeclaration", {
		visitor: ["declaration"],
		aliases: [
			"Statement",
			"Declaration",
			"ImportOrExportDeclaration",
			"ExportDeclaration"
		],
		fields: {
			declaration: (0, _utils$7.validateType)("TSDeclareFunction", "FunctionDeclaration", "ClassDeclaration", "Expression"),
			exportKind: (0, _utils$7.validateOptional)((0, _utils$7.assertOneOf)("value"))
		}
	});
	defineType$4("ExportNamedDeclaration", {
		builder: [
			"declaration",
			"specifiers",
			"source"
		],
		visitor: process.env ? [
			"declaration",
			"specifiers",
			"source",
			"attributes"
		] : [
			"declaration",
			"specifiers",
			"source",
			"attributes",
			"assertions"
		],
		aliases: [
			"Statement",
			"Declaration",
			"ImportOrExportDeclaration",
			"ExportDeclaration"
		],
		fields: Object.assign({ declaration: {
			optional: true,
			validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertNodeType)("Declaration"), Object.assign(function(node, key, val) {
				if (val && node.specifiers.length) throw new TypeError("Only declaration or specifiers is allowed on ExportNamedDeclaration");
				if (val && node.source) throw new TypeError("Cannot export a declaration from a source");
			}, { oneOfNodeTypes: ["Declaration"] })) : (0, _utils$7.assertNodeType)("Declaration")
		} }, importAttributes, {
			specifiers: {
				default: [],
				validate: (0, _utils$7.arrayOf)(function() {
					const sourced = (0, _utils$7.assertNodeType)("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier");
					const sourceless = (0, _utils$7.assertNodeType)("ExportSpecifier");
					if (!process.env.BABEL_TYPES_8_BREAKING) return sourced;
					return Object.assign(function(node, key, val) {
						const validator = node.source ? sourced : sourceless;
						validator(node, key, val);
					}, { oneOfNodeTypes: [
						"ExportSpecifier",
						"ExportDefaultSpecifier",
						"ExportNamespaceSpecifier"
					] });
				}())
			},
			source: {
				validate: (0, _utils$7.assertNodeType)("StringLiteral"),
				optional: true
			},
			exportKind: (0, _utils$7.validateOptional)((0, _utils$7.assertOneOf)("type", "value"))
		})
	});
	defineType$4("ExportSpecifier", {
		visitor: ["local", "exported"],
		aliases: ["ModuleSpecifier"],
		fields: {
			local: { validate: (0, _utils$7.assertNodeType)("Identifier") },
			exported: { validate: (0, _utils$7.assertNodeType)("Identifier", "StringLiteral") },
			exportKind: {
				validate: (0, _utils$7.assertOneOf)("type", "value"),
				optional: true
			}
		}
	});
	defineType$4("ForOfStatement", {
		visitor: [
			"left",
			"right",
			"body"
		],
		builder: [
			"left",
			"right",
			"body",
			"await"
		],
		aliases: [
			"Scopable",
			"Statement",
			"For",
			"BlockParent",
			"Loop",
			"ForXStatement"
		],
		fields: {
			left: { validate: function() {
				if (!process.env.BABEL_TYPES_8_BREAKING) return (0, _utils$7.assertNodeType)("VariableDeclaration", "LVal");
				const declaration = (0, _utils$7.assertNodeType)("VariableDeclaration");
				const lval = (0, _utils$7.assertNodeType)("Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression");
				return Object.assign(function(node, key, val) {
					if ((0, _is$3.default)("VariableDeclaration", val)) declaration(node, key, val);
					else lval(node, key, val);
				}, { oneOfNodeTypes: [
					"VariableDeclaration",
					"Identifier",
					"MemberExpression",
					"ArrayPattern",
					"ObjectPattern",
					"TSAsExpression",
					"TSSatisfiesExpression",
					"TSTypeAssertion",
					"TSNonNullExpression"
				] });
			}() },
			right: { validate: (0, _utils$7.assertNodeType)("Expression") },
			body: { validate: (0, _utils$7.assertNodeType)("Statement") },
			await: { default: false }
		}
	});
	defineType$4("ImportDeclaration", {
		builder: ["specifiers", "source"],
		visitor: [
			"specifiers",
			"source",
			"attributes",
			"assertions"
		],
		aliases: [
			"Statement",
			"Declaration",
			"ImportOrExportDeclaration"
		],
		fields: Object.assign({}, importAttributes, {
			module: {
				optional: true,
				validate: (0, _utils$7.assertValueType)("boolean")
			},
			phase: {
				default: null,
				validate: (0, _utils$7.assertOneOf)("source", "defer")
			},
			specifiers: (0, _utils$7.validateArrayOfType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"),
			source: { validate: (0, _utils$7.assertNodeType)("StringLiteral") },
			importKind: {
				validate: (0, _utils$7.assertOneOf)("type", "typeof", "value"),
				optional: true
			}
		})
	});
	defineType$4("ImportDefaultSpecifier", {
		visitor: ["local"],
		aliases: ["ModuleSpecifier"],
		fields: { local: { validate: (0, _utils$7.assertNodeType)("Identifier") } }
	});
	defineType$4("ImportNamespaceSpecifier", {
		visitor: ["local"],
		aliases: ["ModuleSpecifier"],
		fields: { local: { validate: (0, _utils$7.assertNodeType)("Identifier") } }
	});
	defineType$4("ImportSpecifier", {
		visitor: ["imported", "local"],
		builder: ["local", "imported"],
		aliases: ["ModuleSpecifier"],
		fields: {
			local: { validate: (0, _utils$7.assertNodeType)("Identifier") },
			imported: { validate: (0, _utils$7.assertNodeType)("Identifier", "StringLiteral") },
			importKind: {
				validate: (0, _utils$7.assertOneOf)("type", "typeof", "value"),
				optional: true
			}
		}
	});
	defineType$4("ImportExpression", {
		visitor: ["source", "options"],
		aliases: ["Expression"],
		fields: {
			phase: {
				default: null,
				validate: (0, _utils$7.assertOneOf)("source", "defer")
			},
			source: { validate: (0, _utils$7.assertNodeType)("Expression") },
			options: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			}
		}
	});
	defineType$4("MetaProperty", {
		visitor: ["meta", "property"],
		aliases: ["Expression"],
		fields: {
			meta: { validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertNodeType)("Identifier"), Object.assign(function(node, key, val) {
				let property;
				switch (val.name) {
					case "function":
						property = "sent";
						break;
					case "new":
						property = "target";
						break;
					case "import":
						property = "meta";
						break;
				}
				if (!(0, _is$3.default)("Identifier", node.property, { name: property })) throw new TypeError("Unrecognised MetaProperty");
			}, { oneOfNodeTypes: ["Identifier"] })) : (0, _utils$7.assertNodeType)("Identifier") },
			property: { validate: (0, _utils$7.assertNodeType)("Identifier") }
		}
	});
	const classMethodOrPropertyCommon = () => ({
		abstract: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		},
		accessibility: {
			validate: (0, _utils$7.assertOneOf)("public", "private", "protected"),
			optional: true
		},
		static: { default: false },
		override: { default: false },
		computed: { default: false },
		optional: {
			validate: (0, _utils$7.assertValueType)("boolean"),
			optional: true
		},
		key: { validate: (0, _utils$7.chain)(function() {
			const normal = (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
			const computed = (0, _utils$7.assertNodeType)("Expression");
			return function(node, key, val) {
				const validator = node.computed ? computed : normal;
				validator(node, key, val);
			};
		}(), (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression")) }
	});
	exports.classMethodOrPropertyCommon = classMethodOrPropertyCommon;
	const classMethodOrDeclareMethodCommon = () => Object.assign({}, functionCommon(), classMethodOrPropertyCommon(), {
		params: (0, _utils$7.validateArrayOfType)("Identifier", "Pattern", "RestElement", "TSParameterProperty"),
		kind: {
			validate: (0, _utils$7.assertOneOf)("get", "set", "method", "constructor"),
			default: "method"
		},
		access: {
			validate: (0, _utils$7.chain)((0, _utils$7.assertValueType)("string"), (0, _utils$7.assertOneOf)("public", "private", "protected")),
			optional: true
		},
		decorators: {
			validate: (0, _utils$7.arrayOfType)("Decorator"),
			optional: true
		}
	});
	exports.classMethodOrDeclareMethodCommon = classMethodOrDeclareMethodCommon;
	defineType$4("ClassMethod", {
		aliases: [
			"Function",
			"Scopable",
			"BlockParent",
			"FunctionParent",
			"Method"
		],
		builder: [
			"kind",
			"key",
			"params",
			"body",
			"computed",
			"static",
			"generator",
			"async"
		],
		visitor: [
			"decorators",
			"key",
			"typeParameters",
			"params",
			"returnType",
			"body"
		],
		fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), { body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") } })
	});
	defineType$4("ObjectPattern", {
		visitor: [
			"properties",
			"typeAnnotation",
			"decorators"
		],
		builder: ["properties"],
		aliases: [
			"Pattern",
			"PatternLike",
			"LVal"
		],
		fields: Object.assign({}, patternLikeCommon(), { properties: (0, _utils$7.validateArrayOfType)("RestElement", "ObjectProperty") })
	});
	defineType$4("SpreadElement", {
		visitor: ["argument"],
		aliases: ["UnaryLike"],
		deprecatedAlias: "SpreadProperty",
		fields: { argument: { validate: (0, _utils$7.assertNodeType)("Expression") } }
	});
	defineType$4("Super", { aliases: ["Expression"] });
	defineType$4("TaggedTemplateExpression", {
		visitor: [
			"tag",
			"typeParameters",
			"quasi"
		],
		builder: ["tag", "quasi"],
		aliases: ["Expression"],
		fields: {
			tag: { validate: (0, _utils$7.assertNodeType)("Expression") },
			quasi: { validate: (0, _utils$7.assertNodeType)("TemplateLiteral") },
			["typeParameters"]: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
				optional: true
			}
		}
	});
	defineType$4("TemplateElement", {
		builder: ["value", "tail"],
		fields: {
			value: { validate: (0, _utils$7.chain)((0, _utils$7.assertShape)({
				raw: { validate: (0, _utils$7.assertValueType)("string") },
				cooked: {
					validate: (0, _utils$7.assertValueType)("string"),
					optional: true
				}
			}), function templateElementCookedValidator(node) {
				const raw = node.value.raw;
				let unterminatedCalled = false;
				const error = () => {
					throw new Error("Internal @babel/types error.");
				};
				const { str, firstInvalidLoc } = (0, _helperStringParser.readStringContents)("template", raw, 0, 0, 0, {
					unterminated() {
						unterminatedCalled = true;
					},
					strictNumericEscape: error,
					invalidEscapeSequence: error,
					numericSeparatorInEscapeSequence: error,
					unexpectedNumericSeparator: error,
					invalidDigit: error,
					invalidCodePoint: error
				});
				if (!unterminatedCalled) throw new Error("Invalid raw");
				node.value.cooked = firstInvalidLoc ? null : str;
			}) },
			tail: { default: false }
		}
	});
	defineType$4("TemplateLiteral", {
		visitor: ["quasis", "expressions"],
		aliases: ["Expression", "Literal"],
		fields: {
			quasis: (0, _utils$7.validateArrayOfType)("TemplateElement"),
			expressions: { validate: (0, _utils$7.chain)((0, _utils$7.assertValueType)("array"), (0, _utils$7.assertEach)((0, _utils$7.assertNodeType)("Expression", "TSType")), function(node, key, val) {
				if (node.quasis.length !== val.length + 1) throw new TypeError(`Number of ${node.type} quasis should be exactly one more than the number of expressions.\nExpected ${val.length + 1} quasis but got ${node.quasis.length}`);
			}) }
		}
	});
	defineType$4("YieldExpression", {
		builder: ["argument", "delegate"],
		visitor: ["argument"],
		aliases: ["Expression", "Terminatorless"],
		fields: {
			delegate: {
				validate: process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.chain)((0, _utils$7.assertValueType)("boolean"), Object.assign(function(node, key, val) {
					if (val && !node.argument) throw new TypeError("Property delegate of YieldExpression cannot be true if there is no argument");
				}, { type: "boolean" })) : (0, _utils$7.assertValueType)("boolean"),
				default: false
			},
			argument: {
				optional: true,
				validate: (0, _utils$7.assertNodeType)("Expression")
			}
		}
	});
	defineType$4("AwaitExpression", {
		builder: ["argument"],
		visitor: ["argument"],
		aliases: ["Expression", "Terminatorless"],
		fields: { argument: { validate: (0, _utils$7.assertNodeType)("Expression") } }
	});
	defineType$4("Import", { aliases: ["Expression"] });
	defineType$4("BigIntLiteral", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$7.assertValueType)("string") } },
		aliases: [
			"Expression",
			"Pureish",
			"Literal",
			"Immutable"
		]
	});
	defineType$4("ExportNamespaceSpecifier", {
		visitor: ["exported"],
		aliases: ["ModuleSpecifier"],
		fields: { exported: { validate: (0, _utils$7.assertNodeType)("Identifier") } }
	});
	defineType$4("OptionalMemberExpression", {
		builder: [
			"object",
			"property",
			"computed",
			"optional"
		],
		visitor: ["object", "property"],
		aliases: ["Expression"],
		fields: {
			object: { validate: (0, _utils$7.assertNodeType)("Expression") },
			property: { validate: function() {
				const normal = (0, _utils$7.assertNodeType)("Identifier");
				const computed = (0, _utils$7.assertNodeType)("Expression");
				const validator = Object.assign(function(node, key, val) {
					const validator$1 = node.computed ? computed : normal;
					validator$1(node, key, val);
				}, { oneOfNodeTypes: ["Expression", "Identifier"] });
				return validator;
			}() },
			computed: { default: false },
			optional: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertValueType)("boolean") : (0, _utils$7.chain)((0, _utils$7.assertValueType)("boolean"), (0, _utils$7.assertOptionalChainStart)()) }
		}
	});
	defineType$4("OptionalCallExpression", {
		visitor: [
			"callee",
			"arguments",
			"typeParameters",
			"typeArguments"
		],
		builder: [
			"callee",
			"arguments",
			"optional"
		],
		aliases: ["Expression"],
		fields: Object.assign({
			callee: { validate: (0, _utils$7.assertNodeType)("Expression") },
			arguments: (0, _utils$7.validateArrayOfType)("Expression", "SpreadElement", "ArgumentPlaceholder"),
			optional: { validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils$7.assertValueType)("boolean") : (0, _utils$7.chain)((0, _utils$7.assertValueType)("boolean"), (0, _utils$7.assertOptionalChainStart)()) },
			typeArguments: {
				validate: (0, _utils$7.assertNodeType)("TypeParameterInstantiation"),
				optional: true
			}
		}, { typeParameters: {
			validate: (0, _utils$7.assertNodeType)("TSTypeParameterInstantiation"),
			optional: true
		} })
	});
	defineType$4("ClassProperty", {
		visitor: [
			"decorators",
			"variance",
			"key",
			"typeAnnotation",
			"value"
		],
		builder: [
			"key",
			"value",
			"typeAnnotation",
			"decorators",
			"computed",
			"static"
		],
		aliases: ["Property"],
		fields: Object.assign({}, classMethodOrPropertyCommon(), {
			value: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			definite: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			typeAnnotation: {
				validate: (0, _utils$7.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			readonly: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			declare: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			variance: {
				validate: (0, _utils$7.assertNodeType)("Variance"),
				optional: true
			}
		})
	});
	defineType$4("ClassAccessorProperty", {
		visitor: [
			"decorators",
			"key",
			"typeAnnotation",
			"value"
		],
		builder: [
			"key",
			"value",
			"typeAnnotation",
			"decorators",
			"computed",
			"static"
		],
		aliases: ["Property", "Accessor"],
		fields: Object.assign({}, classMethodOrPropertyCommon(), {
			key: { validate: (0, _utils$7.chain)(function() {
				const normal = (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName");
				const computed = (0, _utils$7.assertNodeType)("Expression");
				return function(node, key, val) {
					const validator = node.computed ? computed : normal;
					validator(node, key, val);
				};
			}(), (0, _utils$7.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName")) },
			value: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			definite: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			typeAnnotation: {
				validate: (0, _utils$7.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			readonly: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			declare: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			variance: {
				validate: (0, _utils$7.assertNodeType)("Variance"),
				optional: true
			}
		})
	});
	defineType$4("ClassPrivateProperty", {
		visitor: [
			"decorators",
			"variance",
			"key",
			"typeAnnotation",
			"value"
		],
		builder: [
			"key",
			"value",
			"decorators",
			"static"
		],
		aliases: ["Property", "Private"],
		fields: {
			key: { validate: (0, _utils$7.assertNodeType)("PrivateName") },
			value: {
				validate: (0, _utils$7.assertNodeType)("Expression"),
				optional: true
			},
			typeAnnotation: {
				validate: (0, _utils$7.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$7.arrayOfType)("Decorator"),
				optional: true
			},
			static: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				default: false
			},
			readonly: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			definite: {
				validate: (0, _utils$7.assertValueType)("boolean"),
				optional: true
			},
			variance: {
				validate: (0, _utils$7.assertNodeType)("Variance"),
				optional: true
			}
		}
	});
	defineType$4("ClassPrivateMethod", {
		builder: [
			"kind",
			"key",
			"params",
			"body",
			"static"
		],
		visitor: [
			"decorators",
			"key",
			"typeParameters",
			"params",
			"returnType",
			"body"
		],
		aliases: [
			"Function",
			"Scopable",
			"BlockParent",
			"FunctionParent",
			"Method",
			"Private"
		],
		fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
			kind: {
				validate: (0, _utils$7.assertOneOf)("get", "set", "method"),
				default: "method"
			},
			key: { validate: (0, _utils$7.assertNodeType)("PrivateName") },
			body: { validate: (0, _utils$7.assertNodeType)("BlockStatement") }
		})
	});
	defineType$4("PrivateName", {
		visitor: ["id"],
		aliases: ["Private"],
		fields: { id: { validate: (0, _utils$7.assertNodeType)("Identifier") } }
	});
	defineType$4("StaticBlock", {
		visitor: ["body"],
		fields: { body: (0, _utils$7.validateArrayOfType)("Statement") },
		aliases: [
			"Scopable",
			"BlockParent",
			"FunctionParent"
		]
	});
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/flow.js
var require_flow = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/flow.js"() {
	var _core$2 = require_core();
	var _utils$6 = require_utils();
	const defineType$3 = (0, _utils$6.defineAliasedType)("Flow");
	const defineInterfaceishType = (name) => {
		const isDeclareClass$1 = name === "DeclareClass";
		defineType$3(name, {
			builder: [
				"id",
				"typeParameters",
				"extends",
				"body"
			],
			visitor: [
				"id",
				"typeParameters",
				"extends",
				...isDeclareClass$1 ? ["mixins", "implements"] : [],
				"body"
			],
			aliases: [
				"FlowDeclaration",
				"Statement",
				"Declaration"
			],
			fields: Object.assign({
				id: (0, _utils$6.validateType)("Identifier"),
				typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
				extends: (0, _utils$6.validateOptional)((0, _utils$6.arrayOfType)("InterfaceExtends"))
			}, isDeclareClass$1 ? {
				mixins: (0, _utils$6.validateOptional)((0, _utils$6.arrayOfType)("InterfaceExtends")),
				implements: (0, _utils$6.validateOptional)((0, _utils$6.arrayOfType)("ClassImplements"))
			} : {}, { body: (0, _utils$6.validateType)("ObjectTypeAnnotation") })
		});
	};
	defineType$3("AnyTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("ArrayTypeAnnotation", {
		visitor: ["elementType"],
		aliases: ["FlowType"],
		fields: { elementType: (0, _utils$6.validateType)("FlowType") }
	});
	defineType$3("BooleanTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("BooleanLiteralTypeAnnotation", {
		builder: ["value"],
		aliases: ["FlowType"],
		fields: { value: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")) }
	});
	defineType$3("NullLiteralTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("ClassImplements", {
		visitor: ["id", "typeParameters"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterInstantiation")
		}
	});
	defineInterfaceishType("DeclareClass");
	defineType$3("DeclareFunction", {
		builder: ["id"],
		visitor: ["id", "predicate"],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			predicate: (0, _utils$6.validateOptionalType)("DeclaredPredicate")
		}
	});
	defineInterfaceishType("DeclareInterface");
	defineType$3("DeclareModule", {
		builder: [
			"id",
			"body",
			"kind"
		],
		visitor: ["id", "body"],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier", "StringLiteral"),
			body: (0, _utils$6.validateType)("BlockStatement"),
			kind: (0, _utils$6.validateOptional)((0, _utils$6.assertOneOf)("CommonJS", "ES"))
		}
	});
	defineType$3("DeclareModuleExports", {
		visitor: ["typeAnnotation"],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: { typeAnnotation: (0, _utils$6.validateType)("TypeAnnotation") }
	});
	defineType$3("DeclareTypeAlias", {
		visitor: [
			"id",
			"typeParameters",
			"right"
		],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
			right: (0, _utils$6.validateType)("FlowType")
		}
	});
	defineType$3("DeclareOpaqueType", {
		visitor: [
			"id",
			"typeParameters",
			"supertype"
		],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
			supertype: (0, _utils$6.validateOptionalType)("FlowType"),
			impltype: (0, _utils$6.validateOptionalType)("FlowType")
		}
	});
	defineType$3("DeclareVariable", {
		visitor: ["id"],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: { id: (0, _utils$6.validateType)("Identifier") }
	});
	defineType$3("DeclareExportDeclaration", {
		visitor: [
			"declaration",
			"specifiers",
			"source",
			"attributes"
		],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: Object.assign({
			declaration: (0, _utils$6.validateOptionalType)("Flow"),
			specifiers: (0, _utils$6.validateOptional)((0, _utils$6.arrayOfType)("ExportSpecifier", "ExportNamespaceSpecifier")),
			source: (0, _utils$6.validateOptionalType)("StringLiteral"),
			default: (0, _utils$6.validateOptional)((0, _utils$6.assertValueType)("boolean"))
		}, _core$2.importAttributes)
	});
	defineType$3("DeclareExportAllDeclaration", {
		visitor: ["source", "attributes"],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: Object.assign({
			source: (0, _utils$6.validateType)("StringLiteral"),
			exportKind: (0, _utils$6.validateOptional)((0, _utils$6.assertOneOf)("type", "value"))
		}, _core$2.importAttributes)
	});
	defineType$3("DeclaredPredicate", {
		visitor: ["value"],
		aliases: ["FlowPredicate"],
		fields: { value: (0, _utils$6.validateType)("Flow") }
	});
	defineType$3("ExistsTypeAnnotation", { aliases: ["FlowType"] });
	defineType$3("FunctionTypeAnnotation", {
		builder: [
			"typeParameters",
			"params",
			"rest",
			"returnType"
		],
		visitor: [
			"typeParameters",
			"this",
			"params",
			"rest",
			"returnType"
		],
		aliases: ["FlowType"],
		fields: {
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
			params: (0, _utils$6.validateArrayOfType)("FunctionTypeParam"),
			rest: (0, _utils$6.validateOptionalType)("FunctionTypeParam"),
			this: (0, _utils$6.validateOptionalType)("FunctionTypeParam"),
			returnType: (0, _utils$6.validateType)("FlowType")
		}
	});
	defineType$3("FunctionTypeParam", {
		visitor: ["name", "typeAnnotation"],
		fields: {
			name: (0, _utils$6.validateOptionalType)("Identifier"),
			typeAnnotation: (0, _utils$6.validateType)("FlowType"),
			optional: (0, _utils$6.validateOptional)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("GenericTypeAnnotation", {
		visitor: ["id", "typeParameters"],
		aliases: ["FlowType"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier", "QualifiedTypeIdentifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterInstantiation")
		}
	});
	defineType$3("InferredPredicate", { aliases: ["FlowPredicate"] });
	defineType$3("InterfaceExtends", {
		visitor: ["id", "typeParameters"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier", "QualifiedTypeIdentifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterInstantiation")
		}
	});
	defineInterfaceishType("InterfaceDeclaration");
	defineType$3("InterfaceTypeAnnotation", {
		visitor: ["extends", "body"],
		aliases: ["FlowType"],
		fields: {
			extends: (0, _utils$6.validateOptional)((0, _utils$6.arrayOfType)("InterfaceExtends")),
			body: (0, _utils$6.validateType)("ObjectTypeAnnotation")
		}
	});
	defineType$3("IntersectionTypeAnnotation", {
		visitor: ["types"],
		aliases: ["FlowType"],
		fields: { types: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("FlowType")) }
	});
	defineType$3("MixedTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("EmptyTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("NullableTypeAnnotation", {
		visitor: ["typeAnnotation"],
		aliases: ["FlowType"],
		fields: { typeAnnotation: (0, _utils$6.validateType)("FlowType") }
	});
	defineType$3("NumberLiteralTypeAnnotation", {
		builder: ["value"],
		aliases: ["FlowType"],
		fields: { value: (0, _utils$6.validate)((0, _utils$6.assertValueType)("number")) }
	});
	defineType$3("NumberTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("ObjectTypeAnnotation", {
		visitor: [
			"properties",
			"indexers",
			"callProperties",
			"internalSlots"
		],
		aliases: ["FlowType"],
		builder: [
			"properties",
			"indexers",
			"callProperties",
			"internalSlots",
			"exact"
		],
		fields: {
			properties: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("ObjectTypeProperty", "ObjectTypeSpreadProperty")),
			indexers: {
				validate: (0, _utils$6.arrayOfType)("ObjectTypeIndexer"),
				optional: true,
				default: []
			},
			callProperties: {
				validate: (0, _utils$6.arrayOfType)("ObjectTypeCallProperty"),
				optional: true,
				default: []
			},
			internalSlots: {
				validate: (0, _utils$6.arrayOfType)("ObjectTypeInternalSlot"),
				optional: true,
				default: []
			},
			exact: {
				validate: (0, _utils$6.assertValueType)("boolean"),
				default: false
			},
			inexact: (0, _utils$6.validateOptional)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("ObjectTypeInternalSlot", {
		visitor: ["id", "value"],
		builder: [
			"id",
			"value",
			"optional",
			"static",
			"method"
		],
		aliases: ["UserWhitespacable"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			value: (0, _utils$6.validateType)("FlowType"),
			optional: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			static: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			method: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("ObjectTypeCallProperty", {
		visitor: ["value"],
		aliases: ["UserWhitespacable"],
		fields: {
			value: (0, _utils$6.validateType)("FlowType"),
			static: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("ObjectTypeIndexer", {
		visitor: [
			"variance",
			"id",
			"key",
			"value"
		],
		builder: [
			"id",
			"key",
			"value",
			"variance"
		],
		aliases: ["UserWhitespacable"],
		fields: {
			id: (0, _utils$6.validateOptionalType)("Identifier"),
			key: (0, _utils$6.validateType)("FlowType"),
			value: (0, _utils$6.validateType)("FlowType"),
			static: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			variance: (0, _utils$6.validateOptionalType)("Variance")
		}
	});
	defineType$3("ObjectTypeProperty", {
		visitor: [
			"key",
			"value",
			"variance"
		],
		aliases: ["UserWhitespacable"],
		fields: {
			key: (0, _utils$6.validateType)("Identifier", "StringLiteral"),
			value: (0, _utils$6.validateType)("FlowType"),
			kind: (0, _utils$6.validate)((0, _utils$6.assertOneOf)("init", "get", "set")),
			static: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			proto: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			optional: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			variance: (0, _utils$6.validateOptionalType)("Variance"),
			method: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("ObjectTypeSpreadProperty", {
		visitor: ["argument"],
		aliases: ["UserWhitespacable"],
		fields: { argument: (0, _utils$6.validateType)("FlowType") }
	});
	defineType$3("OpaqueType", {
		visitor: [
			"id",
			"typeParameters",
			"supertype",
			"impltype"
		],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
			supertype: (0, _utils$6.validateOptionalType)("FlowType"),
			impltype: (0, _utils$6.validateType)("FlowType")
		}
	});
	defineType$3("QualifiedTypeIdentifier", {
		visitor: ["qualification", "id"],
		builder: ["id", "qualification"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			qualification: (0, _utils$6.validateType)("Identifier", "QualifiedTypeIdentifier")
		}
	});
	defineType$3("StringLiteralTypeAnnotation", {
		builder: ["value"],
		aliases: ["FlowType"],
		fields: { value: (0, _utils$6.validate)((0, _utils$6.assertValueType)("string")) }
	});
	defineType$3("StringTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("SymbolTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("ThisTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("TupleTypeAnnotation", {
		visitor: ["types"],
		aliases: ["FlowType"],
		fields: { types: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("FlowType")) }
	});
	defineType$3("TypeofTypeAnnotation", {
		visitor: ["argument"],
		aliases: ["FlowType"],
		fields: { argument: (0, _utils$6.validateType)("FlowType") }
	});
	defineType$3("TypeAlias", {
		visitor: [
			"id",
			"typeParameters",
			"right"
		],
		aliases: [
			"FlowDeclaration",
			"Statement",
			"Declaration"
		],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			typeParameters: (0, _utils$6.validateOptionalType)("TypeParameterDeclaration"),
			right: (0, _utils$6.validateType)("FlowType")
		}
	});
	defineType$3("TypeAnnotation", {
		visitor: ["typeAnnotation"],
		fields: { typeAnnotation: (0, _utils$6.validateType)("FlowType") }
	});
	defineType$3("TypeCastExpression", {
		visitor: ["expression", "typeAnnotation"],
		aliases: ["ExpressionWrapper", "Expression"],
		fields: {
			expression: (0, _utils$6.validateType)("Expression"),
			typeAnnotation: (0, _utils$6.validateType)("TypeAnnotation")
		}
	});
	defineType$3("TypeParameter", {
		visitor: [
			"bound",
			"default",
			"variance"
		],
		fields: {
			name: (0, _utils$6.validate)((0, _utils$6.assertValueType)("string")),
			bound: (0, _utils$6.validateOptionalType)("TypeAnnotation"),
			default: (0, _utils$6.validateOptionalType)("FlowType"),
			variance: (0, _utils$6.validateOptionalType)("Variance")
		}
	});
	defineType$3("TypeParameterDeclaration", {
		visitor: ["params"],
		fields: { params: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("TypeParameter")) }
	});
	defineType$3("TypeParameterInstantiation", {
		visitor: ["params"],
		fields: { params: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("FlowType")) }
	});
	defineType$3("UnionTypeAnnotation", {
		visitor: ["types"],
		aliases: ["FlowType"],
		fields: { types: (0, _utils$6.validate)((0, _utils$6.arrayOfType)("FlowType")) }
	});
	defineType$3("Variance", {
		builder: ["kind"],
		fields: { kind: (0, _utils$6.validate)((0, _utils$6.assertOneOf)("minus", "plus")) }
	});
	defineType$3("VoidTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
	defineType$3("EnumDeclaration", {
		aliases: ["Statement", "Declaration"],
		visitor: ["id", "body"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			body: (0, _utils$6.validateType)("EnumBooleanBody", "EnumNumberBody", "EnumStringBody", "EnumSymbolBody")
		}
	});
	defineType$3("EnumBooleanBody", {
		aliases: ["EnumBody"],
		visitor: ["members"],
		fields: {
			explicitType: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			members: (0, _utils$6.validateArrayOfType)("EnumBooleanMember"),
			hasUnknownMembers: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("EnumNumberBody", {
		aliases: ["EnumBody"],
		visitor: ["members"],
		fields: {
			explicitType: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			members: (0, _utils$6.validateArrayOfType)("EnumNumberMember"),
			hasUnknownMembers: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("EnumStringBody", {
		aliases: ["EnumBody"],
		visitor: ["members"],
		fields: {
			explicitType: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean")),
			members: (0, _utils$6.validateArrayOfType)("EnumStringMember", "EnumDefaultedMember"),
			hasUnknownMembers: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("EnumSymbolBody", {
		aliases: ["EnumBody"],
		visitor: ["members"],
		fields: {
			members: (0, _utils$6.validateArrayOfType)("EnumDefaultedMember"),
			hasUnknownMembers: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
	defineType$3("EnumBooleanMember", {
		aliases: ["EnumMember"],
		builder: ["id"],
		visitor: ["id", "init"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			init: (0, _utils$6.validateType)("BooleanLiteral")
		}
	});
	defineType$3("EnumNumberMember", {
		aliases: ["EnumMember"],
		visitor: ["id", "init"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			init: (0, _utils$6.validateType)("NumericLiteral")
		}
	});
	defineType$3("EnumStringMember", {
		aliases: ["EnumMember"],
		visitor: ["id", "init"],
		fields: {
			id: (0, _utils$6.validateType)("Identifier"),
			init: (0, _utils$6.validateType)("StringLiteral")
		}
	});
	defineType$3("EnumDefaultedMember", {
		aliases: ["EnumMember"],
		visitor: ["id"],
		fields: { id: (0, _utils$6.validateType)("Identifier") }
	});
	defineType$3("IndexedAccessType", {
		visitor: ["objectType", "indexType"],
		aliases: ["FlowType"],
		fields: {
			objectType: (0, _utils$6.validateType)("FlowType"),
			indexType: (0, _utils$6.validateType)("FlowType")
		}
	});
	defineType$3("OptionalIndexedAccessType", {
		visitor: ["objectType", "indexType"],
		aliases: ["FlowType"],
		fields: {
			objectType: (0, _utils$6.validateType)("FlowType"),
			indexType: (0, _utils$6.validateType)("FlowType"),
			optional: (0, _utils$6.validate)((0, _utils$6.assertValueType)("boolean"))
		}
	});
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/jsx.js
var require_jsx = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/jsx.js"() {
	var _utils$5 = require_utils();
	const defineType$2 = (0, _utils$5.defineAliasedType)("JSX");
	defineType$2("JSXAttribute", {
		visitor: ["name", "value"],
		aliases: ["Immutable"],
		fields: {
			name: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier", "JSXNamespacedName") },
			value: {
				optional: true,
				validate: (0, _utils$5.assertNodeType)("JSXElement", "JSXFragment", "StringLiteral", "JSXExpressionContainer")
			}
		}
	});
	defineType$2("JSXClosingElement", {
		visitor: ["name"],
		aliases: ["Immutable"],
		fields: { name: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName") } }
	});
	defineType$2("JSXElement", {
		builder: [
			"openingElement",
			"closingElement",
			"children",
			"selfClosing"
		],
		visitor: [
			"openingElement",
			"children",
			"closingElement"
		],
		aliases: ["Immutable", "Expression"],
		fields: Object.assign({
			openingElement: { validate: (0, _utils$5.assertNodeType)("JSXOpeningElement") },
			closingElement: {
				optional: true,
				validate: (0, _utils$5.assertNodeType)("JSXClosingElement")
			},
			children: (0, _utils$5.validateArrayOfType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")
		}, { selfClosing: {
			validate: (0, _utils$5.assertValueType)("boolean"),
			optional: true
		} })
	});
	defineType$2("JSXEmptyExpression", {});
	defineType$2("JSXExpressionContainer", {
		visitor: ["expression"],
		aliases: ["Immutable"],
		fields: { expression: { validate: (0, _utils$5.assertNodeType)("Expression", "JSXEmptyExpression") } }
	});
	defineType$2("JSXSpreadChild", {
		visitor: ["expression"],
		aliases: ["Immutable"],
		fields: { expression: { validate: (0, _utils$5.assertNodeType)("Expression") } }
	});
	defineType$2("JSXIdentifier", {
		builder: ["name"],
		fields: { name: { validate: (0, _utils$5.assertValueType)("string") } }
	});
	defineType$2("JSXMemberExpression", {
		visitor: ["object", "property"],
		fields: {
			object: { validate: (0, _utils$5.assertNodeType)("JSXMemberExpression", "JSXIdentifier") },
			property: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier") }
		}
	});
	defineType$2("JSXNamespacedName", {
		visitor: ["namespace", "name"],
		fields: {
			namespace: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier") },
			name: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier") }
		}
	});
	defineType$2("JSXOpeningElement", {
		builder: [
			"name",
			"attributes",
			"selfClosing"
		],
		visitor: [
			"name",
			"typeParameters",
			"typeArguments",
			"attributes"
		],
		aliases: ["Immutable"],
		fields: Object.assign({
			name: { validate: (0, _utils$5.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName") },
			selfClosing: { default: false },
			attributes: (0, _utils$5.validateArrayOfType)("JSXAttribute", "JSXSpreadAttribute"),
			typeArguments: {
				validate: (0, _utils$5.assertNodeType)("TypeParameterInstantiation"),
				optional: true
			}
		}, { typeParameters: {
			validate: (0, _utils$5.assertNodeType)("TSTypeParameterInstantiation"),
			optional: true
		} })
	});
	defineType$2("JSXSpreadAttribute", {
		visitor: ["argument"],
		fields: { argument: { validate: (0, _utils$5.assertNodeType)("Expression") } }
	});
	defineType$2("JSXText", {
		aliases: ["Immutable"],
		builder: ["value"],
		fields: { value: { validate: (0, _utils$5.assertValueType)("string") } }
	});
	defineType$2("JSXFragment", {
		builder: [
			"openingFragment",
			"closingFragment",
			"children"
		],
		visitor: [
			"openingFragment",
			"children",
			"closingFragment"
		],
		aliases: ["Immutable", "Expression"],
		fields: {
			openingFragment: { validate: (0, _utils$5.assertNodeType)("JSXOpeningFragment") },
			closingFragment: { validate: (0, _utils$5.assertNodeType)("JSXClosingFragment") },
			children: (0, _utils$5.validateArrayOfType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")
		}
	});
	defineType$2("JSXOpeningFragment", { aliases: ["Immutable"] });
	defineType$2("JSXClosingFragment", { aliases: ["Immutable"] });
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/placeholders.js
var require_placeholders = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/placeholders.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PLACEHOLDERS_FLIPPED_ALIAS = exports.PLACEHOLDERS_ALIAS = exports.PLACEHOLDERS = void 0;
	var _utils$4 = require_utils();
	const PLACEHOLDERS = exports.PLACEHOLDERS = [
		"Identifier",
		"StringLiteral",
		"Expression",
		"Statement",
		"Declaration",
		"BlockStatement",
		"ClassBody",
		"Pattern"
	];
	const PLACEHOLDERS_ALIAS = exports.PLACEHOLDERS_ALIAS = {
		Declaration: ["Statement"],
		Pattern: ["PatternLike", "LVal"]
	};
	for (const type of PLACEHOLDERS) {
		const alias = _utils$4.ALIAS_KEYS[type];
		if (alias != null && alias.length) PLACEHOLDERS_ALIAS[type] = alias;
	}
	const PLACEHOLDERS_FLIPPED_ALIAS = exports.PLACEHOLDERS_FLIPPED_ALIAS = {};
	Object.keys(PLACEHOLDERS_ALIAS).forEach((type) => {
		PLACEHOLDERS_ALIAS[type].forEach((alias) => {
			if (!hasOwnProperty.call(PLACEHOLDERS_FLIPPED_ALIAS, alias)) PLACEHOLDERS_FLIPPED_ALIAS[alias] = [];
			PLACEHOLDERS_FLIPPED_ALIAS[alias].push(type);
		});
	});
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/misc.js
var require_misc = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/misc.js"() {
	var _utils$3 = require_utils();
	var _placeholders$1 = require_placeholders();
	var _core$1 = require_core();
	const defineType$1 = (0, _utils$3.defineAliasedType)("Miscellaneous");
	defineType$1("Noop", { visitor: [] });
	defineType$1("Placeholder", {
		visitor: [],
		builder: ["expectedNode", "name"],
		fields: Object.assign({
			name: { validate: (0, _utils$3.assertNodeType)("Identifier") },
			expectedNode: { validate: (0, _utils$3.assertOneOf)(..._placeholders$1.PLACEHOLDERS) }
		}, (0, _core$1.patternLikeCommon)())
	});
	defineType$1("V8IntrinsicIdentifier", {
		builder: ["name"],
		fields: { name: { validate: (0, _utils$3.assertValueType)("string") } }
	});
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/experimental.js
var require_experimental = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/experimental.js"() {
	var _utils$2 = require_utils();
	(0, _utils$2.default)("ArgumentPlaceholder", {});
	(0, _utils$2.default)("BindExpression", {
		visitor: ["object", "callee"],
		aliases: ["Expression"],
		fields: !process.env.BABEL_TYPES_8_BREAKING ? {
			object: { validate: Object.assign(() => {}, { oneOfNodeTypes: ["Expression"] }) },
			callee: { validate: Object.assign(() => {}, { oneOfNodeTypes: ["Expression"] }) }
		} : {
			object: { validate: (0, _utils$2.assertNodeType)("Expression") },
			callee: { validate: (0, _utils$2.assertNodeType)("Expression") }
		}
	});
	(0, _utils$2.default)("ImportAttribute", {
		visitor: ["key", "value"],
		fields: {
			key: { validate: (0, _utils$2.assertNodeType)("Identifier", "StringLiteral") },
			value: { validate: (0, _utils$2.assertNodeType)("StringLiteral") }
		}
	});
	(0, _utils$2.default)("Decorator", {
		visitor: ["expression"],
		fields: { expression: { validate: (0, _utils$2.assertNodeType)("Expression") } }
	});
	(0, _utils$2.default)("DoExpression", {
		visitor: ["body"],
		builder: ["body", "async"],
		aliases: ["Expression"],
		fields: {
			body: { validate: (0, _utils$2.assertNodeType)("BlockStatement") },
			async: {
				validate: (0, _utils$2.assertValueType)("boolean"),
				default: false
			}
		}
	});
	(0, _utils$2.default)("ExportDefaultSpecifier", {
		visitor: ["exported"],
		aliases: ["ModuleSpecifier"],
		fields: { exported: { validate: (0, _utils$2.assertNodeType)("Identifier") } }
	});
	(0, _utils$2.default)("RecordExpression", {
		visitor: ["properties"],
		aliases: ["Expression"],
		fields: { properties: (0, _utils$2.validateArrayOfType)("ObjectProperty", "SpreadElement") }
	});
	(0, _utils$2.default)("TupleExpression", {
		fields: { elements: {
			validate: (0, _utils$2.arrayOfType)("Expression", "SpreadElement"),
			default: []
		} },
		visitor: ["elements"],
		aliases: ["Expression"]
	});
	(0, _utils$2.default)("DecimalLiteral", {
		builder: ["value"],
		fields: { value: { validate: (0, _utils$2.assertValueType)("string") } },
		aliases: [
			"Expression",
			"Pureish",
			"Literal",
			"Immutable"
		]
	});
	(0, _utils$2.default)("ModuleExpression", {
		visitor: ["body"],
		fields: { body: { validate: (0, _utils$2.assertNodeType)("Program") } },
		aliases: ["Expression"]
	});
	(0, _utils$2.default)("TopicReference", { aliases: ["Expression"] });
	(0, _utils$2.default)("PipelineTopicExpression", {
		builder: ["expression"],
		visitor: ["expression"],
		fields: { expression: { validate: (0, _utils$2.assertNodeType)("Expression") } },
		aliases: ["Expression"]
	});
	(0, _utils$2.default)("PipelineBareFunction", {
		builder: ["callee"],
		visitor: ["callee"],
		fields: { callee: { validate: (0, _utils$2.assertNodeType)("Expression") } },
		aliases: ["Expression"]
	});
	(0, _utils$2.default)("PipelinePrimaryTopicReference", { aliases: ["Expression"] });
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/typescript.js
var require_typescript = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/typescript.js"() {
	var _utils$1 = require_utils();
	var _core = require_core();
	var _is$2 = require_is();
	const defineType = (0, _utils$1.defineAliasedType)("TypeScript");
	const bool = (0, _utils$1.assertValueType)("boolean");
	const tSFunctionTypeAnnotationCommon = () => ({
		returnType: {
			validate: (0, _utils$1.assertNodeType)("TSTypeAnnotation", "Noop"),
			optional: true
		},
		typeParameters: {
			validate: (0, _utils$1.assertNodeType)("TSTypeParameterDeclaration", "Noop"),
			optional: true
		}
	});
	defineType("TSParameterProperty", {
		aliases: ["LVal"],
		visitor: ["parameter"],
		fields: {
			accessibility: {
				validate: (0, _utils$1.assertOneOf)("public", "private", "protected"),
				optional: true
			},
			readonly: {
				validate: (0, _utils$1.assertValueType)("boolean"),
				optional: true
			},
			parameter: { validate: (0, _utils$1.assertNodeType)("Identifier", "AssignmentPattern") },
			override: {
				validate: (0, _utils$1.assertValueType)("boolean"),
				optional: true
			},
			decorators: {
				validate: (0, _utils$1.arrayOfType)("Decorator"),
				optional: true
			}
		}
	});
	defineType("TSDeclareFunction", {
		aliases: ["Statement", "Declaration"],
		visitor: [
			"id",
			"typeParameters",
			"params",
			"returnType"
		],
		fields: Object.assign({}, (0, _core.functionDeclarationCommon)(), tSFunctionTypeAnnotationCommon())
	});
	defineType("TSDeclareMethod", {
		visitor: [
			"decorators",
			"key",
			"typeParameters",
			"params",
			"returnType"
		],
		fields: Object.assign({}, (0, _core.classMethodOrDeclareMethodCommon)(), tSFunctionTypeAnnotationCommon())
	});
	defineType("TSQualifiedName", {
		aliases: ["TSEntityName"],
		visitor: ["left", "right"],
		fields: {
			left: (0, _utils$1.validateType)("TSEntityName"),
			right: (0, _utils$1.validateType)("Identifier")
		}
	});
	const signatureDeclarationCommon = () => ({
		typeParameters: (0, _utils$1.validateOptionalType)("TSTypeParameterDeclaration"),
		["parameters"]: (0, _utils$1.validateArrayOfType)("ArrayPattern", "Identifier", "ObjectPattern", "RestElement"),
		["typeAnnotation"]: (0, _utils$1.validateOptionalType)("TSTypeAnnotation")
	});
	const callConstructSignatureDeclaration = {
		aliases: ["TSTypeElement"],
		visitor: [
			"typeParameters",
			"parameters",
			"typeAnnotation"
		],
		fields: signatureDeclarationCommon()
	};
	defineType("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
	defineType("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);
	const namedTypeElementCommon = () => ({
		key: (0, _utils$1.validateType)("Expression"),
		computed: { default: false },
		optional: (0, _utils$1.validateOptional)(bool)
	});
	defineType("TSPropertySignature", {
		aliases: ["TSTypeElement"],
		visitor: ["key", "typeAnnotation"],
		fields: Object.assign({}, namedTypeElementCommon(), {
			readonly: (0, _utils$1.validateOptional)(bool),
			typeAnnotation: (0, _utils$1.validateOptionalType)("TSTypeAnnotation"),
			kind: { validate: (0, _utils$1.assertOneOf)("get", "set") }
		})
	});
	defineType("TSMethodSignature", {
		aliases: ["TSTypeElement"],
		visitor: [
			"key",
			"typeParameters",
			"parameters",
			"typeAnnotation"
		],
		fields: Object.assign({}, signatureDeclarationCommon(), namedTypeElementCommon(), { kind: { validate: (0, _utils$1.assertOneOf)("method", "get", "set") } })
	});
	defineType("TSIndexSignature", {
		aliases: ["TSTypeElement"],
		visitor: ["parameters", "typeAnnotation"],
		fields: {
			readonly: (0, _utils$1.validateOptional)(bool),
			static: (0, _utils$1.validateOptional)(bool),
			parameters: (0, _utils$1.validateArrayOfType)("Identifier"),
			typeAnnotation: (0, _utils$1.validateOptionalType)("TSTypeAnnotation")
		}
	});
	const tsKeywordTypes = [
		"TSAnyKeyword",
		"TSBooleanKeyword",
		"TSBigIntKeyword",
		"TSIntrinsicKeyword",
		"TSNeverKeyword",
		"TSNullKeyword",
		"TSNumberKeyword",
		"TSObjectKeyword",
		"TSStringKeyword",
		"TSSymbolKeyword",
		"TSUndefinedKeyword",
		"TSUnknownKeyword",
		"TSVoidKeyword"
	];
	for (const type of tsKeywordTypes) defineType(type, {
		aliases: ["TSType", "TSBaseType"],
		visitor: [],
		fields: {}
	});
	defineType("TSThisType", {
		aliases: ["TSType", "TSBaseType"],
		visitor: [],
		fields: {}
	});
	const fnOrCtrBase = {
		aliases: ["TSType"],
		visitor: [
			"typeParameters",
			"parameters",
			"typeAnnotation"
		]
	};
	defineType("TSFunctionType", Object.assign({}, fnOrCtrBase, { fields: signatureDeclarationCommon() }));
	defineType("TSConstructorType", Object.assign({}, fnOrCtrBase, { fields: Object.assign({}, signatureDeclarationCommon(), { abstract: (0, _utils$1.validateOptional)(bool) }) }));
	defineType("TSTypeReference", {
		aliases: ["TSType"],
		visitor: ["typeName", "typeParameters"],
		fields: {
			typeName: (0, _utils$1.validateType)("TSEntityName"),
			["typeParameters"]: (0, _utils$1.validateOptionalType)("TSTypeParameterInstantiation")
		}
	});
	defineType("TSTypePredicate", {
		aliases: ["TSType"],
		visitor: ["parameterName", "typeAnnotation"],
		builder: [
			"parameterName",
			"typeAnnotation",
			"asserts"
		],
		fields: {
			parameterName: (0, _utils$1.validateType)("Identifier", "TSThisType"),
			typeAnnotation: (0, _utils$1.validateOptionalType)("TSTypeAnnotation"),
			asserts: (0, _utils$1.validateOptional)(bool)
		}
	});
	defineType("TSTypeQuery", {
		aliases: ["TSType"],
		visitor: ["exprName", "typeParameters"],
		fields: {
			exprName: (0, _utils$1.validateType)("TSEntityName", "TSImportType"),
			["typeParameters"]: (0, _utils$1.validateOptionalType)("TSTypeParameterInstantiation")
		}
	});
	defineType("TSTypeLiteral", {
		aliases: ["TSType"],
		visitor: ["members"],
		fields: { members: (0, _utils$1.validateArrayOfType)("TSTypeElement") }
	});
	defineType("TSArrayType", {
		aliases: ["TSType"],
		visitor: ["elementType"],
		fields: { elementType: (0, _utils$1.validateType)("TSType") }
	});
	defineType("TSTupleType", {
		aliases: ["TSType"],
		visitor: ["elementTypes"],
		fields: { elementTypes: (0, _utils$1.validateArrayOfType)("TSType", "TSNamedTupleMember") }
	});
	defineType("TSOptionalType", {
		aliases: ["TSType"],
		visitor: ["typeAnnotation"],
		fields: { typeAnnotation: (0, _utils$1.validateType)("TSType") }
	});
	defineType("TSRestType", {
		aliases: ["TSType"],
		visitor: ["typeAnnotation"],
		fields: { typeAnnotation: (0, _utils$1.validateType)("TSType") }
	});
	defineType("TSNamedTupleMember", {
		visitor: ["label", "elementType"],
		builder: [
			"label",
			"elementType",
			"optional"
		],
		fields: {
			label: (0, _utils$1.validateType)("Identifier"),
			optional: {
				validate: bool,
				default: false
			},
			elementType: (0, _utils$1.validateType)("TSType")
		}
	});
	const unionOrIntersection = {
		aliases: ["TSType"],
		visitor: ["types"],
		fields: { types: (0, _utils$1.validateArrayOfType)("TSType") }
	};
	defineType("TSUnionType", unionOrIntersection);
	defineType("TSIntersectionType", unionOrIntersection);
	defineType("TSConditionalType", {
		aliases: ["TSType"],
		visitor: [
			"checkType",
			"extendsType",
			"trueType",
			"falseType"
		],
		fields: {
			checkType: (0, _utils$1.validateType)("TSType"),
			extendsType: (0, _utils$1.validateType)("TSType"),
			trueType: (0, _utils$1.validateType)("TSType"),
			falseType: (0, _utils$1.validateType)("TSType")
		}
	});
	defineType("TSInferType", {
		aliases: ["TSType"],
		visitor: ["typeParameter"],
		fields: { typeParameter: (0, _utils$1.validateType)("TSTypeParameter") }
	});
	defineType("TSParenthesizedType", {
		aliases: ["TSType"],
		visitor: ["typeAnnotation"],
		fields: { typeAnnotation: (0, _utils$1.validateType)("TSType") }
	});
	defineType("TSTypeOperator", {
		aliases: ["TSType"],
		visitor: ["typeAnnotation"],
		fields: {
			operator: (0, _utils$1.validate)((0, _utils$1.assertValueType)("string")),
			typeAnnotation: (0, _utils$1.validateType)("TSType")
		}
	});
	defineType("TSIndexedAccessType", {
		aliases: ["TSType"],
		visitor: ["objectType", "indexType"],
		fields: {
			objectType: (0, _utils$1.validateType)("TSType"),
			indexType: (0, _utils$1.validateType)("TSType")
		}
	});
	defineType("TSMappedType", {
		aliases: ["TSType"],
		visitor: [
			"typeParameter",
			"nameType",
			"typeAnnotation"
		],
		builder: [
			"typeParameter",
			"typeAnnotation",
			"nameType"
		],
		fields: Object.assign({}, { typeParameter: (0, _utils$1.validateType)("TSTypeParameter") }, {
			readonly: (0, _utils$1.validateOptional)((0, _utils$1.assertOneOf)(true, false, "+", "-")),
			optional: (0, _utils$1.validateOptional)((0, _utils$1.assertOneOf)(true, false, "+", "-")),
			typeAnnotation: (0, _utils$1.validateOptionalType)("TSType"),
			nameType: (0, _utils$1.validateOptionalType)("TSType")
		})
	});
	defineType("TSLiteralType", {
		aliases: ["TSType", "TSBaseType"],
		visitor: ["literal"],
		fields: { literal: { validate: function() {
			const unaryExpression$1 = (0, _utils$1.assertNodeType)("NumericLiteral", "BigIntLiteral");
			const unaryOperator = (0, _utils$1.assertOneOf)("-");
			const literal = (0, _utils$1.assertNodeType)("NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral");
			function validator(parent, key, node) {
				if ((0, _is$2.default)("UnaryExpression", node)) {
					unaryOperator(node, "operator", node.operator);
					unaryExpression$1(node, "argument", node.argument);
				} else literal(parent, key, node);
			}
			validator.oneOfNodeTypes = [
				"NumericLiteral",
				"StringLiteral",
				"BooleanLiteral",
				"BigIntLiteral",
				"TemplateLiteral",
				"UnaryExpression"
			];
			return validator;
		}() } }
	});
	defineType("TSExpressionWithTypeArguments", {
		aliases: ["TSType"],
		visitor: ["expression", "typeParameters"],
		fields: {
			expression: (0, _utils$1.validateType)("TSEntityName"),
			typeParameters: (0, _utils$1.validateOptionalType)("TSTypeParameterInstantiation")
		}
	});
	defineType("TSInterfaceDeclaration", {
		aliases: ["Statement", "Declaration"],
		visitor: [
			"id",
			"typeParameters",
			"extends",
			"body"
		],
		fields: {
			declare: (0, _utils$1.validateOptional)(bool),
			id: (0, _utils$1.validateType)("Identifier"),
			typeParameters: (0, _utils$1.validateOptionalType)("TSTypeParameterDeclaration"),
			extends: (0, _utils$1.validateOptional)((0, _utils$1.arrayOfType)("TSExpressionWithTypeArguments")),
			body: (0, _utils$1.validateType)("TSInterfaceBody")
		}
	});
	defineType("TSInterfaceBody", {
		visitor: ["body"],
		fields: { body: (0, _utils$1.validateArrayOfType)("TSTypeElement") }
	});
	defineType("TSTypeAliasDeclaration", {
		aliases: ["Statement", "Declaration"],
		visitor: [
			"id",
			"typeParameters",
			"typeAnnotation"
		],
		fields: {
			declare: (0, _utils$1.validateOptional)(bool),
			id: (0, _utils$1.validateType)("Identifier"),
			typeParameters: (0, _utils$1.validateOptionalType)("TSTypeParameterDeclaration"),
			typeAnnotation: (0, _utils$1.validateType)("TSType")
		}
	});
	defineType("TSInstantiationExpression", {
		aliases: ["Expression"],
		visitor: ["expression", "typeParameters"],
		fields: {
			expression: (0, _utils$1.validateType)("Expression"),
			["typeParameters"]: (0, _utils$1.validateOptionalType)("TSTypeParameterInstantiation")
		}
	});
	const TSTypeExpression = {
		aliases: [
			"Expression",
			"LVal",
			"PatternLike"
		],
		visitor: ["expression", "typeAnnotation"],
		fields: {
			expression: (0, _utils$1.validateType)("Expression"),
			typeAnnotation: (0, _utils$1.validateType)("TSType")
		}
	};
	defineType("TSAsExpression", TSTypeExpression);
	defineType("TSSatisfiesExpression", TSTypeExpression);
	defineType("TSTypeAssertion", {
		aliases: [
			"Expression",
			"LVal",
			"PatternLike"
		],
		visitor: ["typeAnnotation", "expression"],
		fields: {
			typeAnnotation: (0, _utils$1.validateType)("TSType"),
			expression: (0, _utils$1.validateType)("Expression")
		}
	});
	defineType("TSEnumBody", {
		visitor: ["members"],
		fields: { members: (0, _utils$1.validateArrayOfType)("TSEnumMember") }
	});
	defineType("TSEnumDeclaration", {
		aliases: ["Statement", "Declaration"],
		visitor: ["id", "members"],
		fields: {
			declare: (0, _utils$1.validateOptional)(bool),
			const: (0, _utils$1.validateOptional)(bool),
			id: (0, _utils$1.validateType)("Identifier"),
			members: (0, _utils$1.validateArrayOfType)("TSEnumMember"),
			initializer: (0, _utils$1.validateOptionalType)("Expression"),
			body: (0, _utils$1.validateOptionalType)("TSEnumBody")
		}
	});
	defineType("TSEnumMember", {
		visitor: ["id", "initializer"],
		fields: {
			id: (0, _utils$1.validateType)("Identifier", "StringLiteral"),
			initializer: (0, _utils$1.validateOptionalType)("Expression")
		}
	});
	defineType("TSModuleDeclaration", {
		aliases: ["Statement", "Declaration"],
		visitor: ["id", "body"],
		fields: Object.assign({
			kind: { validate: (0, _utils$1.assertOneOf)("global", "module", "namespace") },
			declare: (0, _utils$1.validateOptional)(bool)
		}, { global: (0, _utils$1.validateOptional)(bool) }, {
			id: (0, _utils$1.validateType)("Identifier", "StringLiteral"),
			body: (0, _utils$1.validateType)("TSModuleBlock", "TSModuleDeclaration")
		})
	});
	defineType("TSModuleBlock", {
		aliases: [
			"Scopable",
			"Block",
			"BlockParent",
			"FunctionParent"
		],
		visitor: ["body"],
		fields: { body: (0, _utils$1.validateArrayOfType)("Statement") }
	});
	defineType("TSImportType", {
		aliases: ["TSType"],
		builder: [
			"argument",
			"qualifier",
			"typeParameters"
		],
		visitor: [
			"argument",
			"options",
			"qualifier",
			"typeParameters"
		],
		fields: {
			argument: (0, _utils$1.validateType)("StringLiteral"),
			qualifier: (0, _utils$1.validateOptionalType)("TSEntityName"),
			["typeParameters"]: (0, _utils$1.validateOptionalType)("TSTypeParameterInstantiation"),
			options: {
				validate: (0, _utils$1.assertNodeType)("Expression"),
				optional: true
			}
		}
	});
	defineType("TSImportEqualsDeclaration", {
		aliases: ["Statement"],
		visitor: ["id", "moduleReference"],
		fields: {
			isExport: (0, _utils$1.validate)(bool),
			id: (0, _utils$1.validateType)("Identifier"),
			moduleReference: (0, _utils$1.validateType)("TSEntityName", "TSExternalModuleReference"),
			importKind: {
				validate: (0, _utils$1.assertOneOf)("type", "value"),
				optional: true
			}
		}
	});
	defineType("TSExternalModuleReference", {
		visitor: ["expression"],
		fields: { expression: (0, _utils$1.validateType)("StringLiteral") }
	});
	defineType("TSNonNullExpression", {
		aliases: [
			"Expression",
			"LVal",
			"PatternLike"
		],
		visitor: ["expression"],
		fields: { expression: (0, _utils$1.validateType)("Expression") }
	});
	defineType("TSExportAssignment", {
		aliases: ["Statement"],
		visitor: ["expression"],
		fields: { expression: (0, _utils$1.validateType)("Expression") }
	});
	defineType("TSNamespaceExportDeclaration", {
		aliases: ["Statement"],
		visitor: ["id"],
		fields: { id: (0, _utils$1.validateType)("Identifier") }
	});
	defineType("TSTypeAnnotation", {
		visitor: ["typeAnnotation"],
		fields: { typeAnnotation: { validate: (0, _utils$1.assertNodeType)("TSType") } }
	});
	defineType("TSTypeParameterInstantiation", {
		visitor: ["params"],
		fields: { params: (0, _utils$1.validateArrayOfType)("TSType") }
	});
	defineType("TSTypeParameterDeclaration", {
		visitor: ["params"],
		fields: { params: (0, _utils$1.validateArrayOfType)("TSTypeParameter") }
	});
	defineType("TSTypeParameter", {
		builder: [
			"constraint",
			"default",
			"name"
		],
		visitor: ["constraint", "default"],
		fields: {
			name: { validate: (0, _utils$1.assertValueType)("string") },
			in: {
				validate: (0, _utils$1.assertValueType)("boolean"),
				optional: true
			},
			out: {
				validate: (0, _utils$1.assertValueType)("boolean"),
				optional: true
			},
			const: {
				validate: (0, _utils$1.assertValueType)("boolean"),
				optional: true
			},
			constraint: {
				validate: (0, _utils$1.assertNodeType)("TSType"),
				optional: true
			},
			default: {
				validate: (0, _utils$1.assertNodeType)("TSType"),
				optional: true
			}
		}
	});
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/deprecated-aliases.js
var require_deprecated_aliases = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/deprecated-aliases.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEPRECATED_ALIASES = void 0;
	const DEPRECATED_ALIASES = exports.DEPRECATED_ALIASES = { ModuleDeclaration: "ImportOrExportDeclaration" };
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/index.js
var require_definitions = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/definitions/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "ALIAS_KEYS", {
		enumerable: true,
		get: function() {
			return _utils.ALIAS_KEYS;
		}
	});
	Object.defineProperty(exports, "BUILDER_KEYS", {
		enumerable: true,
		get: function() {
			return _utils.BUILDER_KEYS;
		}
	});
	Object.defineProperty(exports, "DEPRECATED_ALIASES", {
		enumerable: true,
		get: function() {
			return _deprecatedAliases.DEPRECATED_ALIASES;
		}
	});
	Object.defineProperty(exports, "DEPRECATED_KEYS", {
		enumerable: true,
		get: function() {
			return _utils.DEPRECATED_KEYS;
		}
	});
	Object.defineProperty(exports, "FLIPPED_ALIAS_KEYS", {
		enumerable: true,
		get: function() {
			return _utils.FLIPPED_ALIAS_KEYS;
		}
	});
	Object.defineProperty(exports, "NODE_FIELDS", {
		enumerable: true,
		get: function() {
			return _utils.NODE_FIELDS;
		}
	});
	Object.defineProperty(exports, "NODE_PARENT_VALIDATIONS", {
		enumerable: true,
		get: function() {
			return _utils.NODE_PARENT_VALIDATIONS;
		}
	});
	Object.defineProperty(exports, "PLACEHOLDERS", {
		enumerable: true,
		get: function() {
			return _placeholders.PLACEHOLDERS;
		}
	});
	Object.defineProperty(exports, "PLACEHOLDERS_ALIAS", {
		enumerable: true,
		get: function() {
			return _placeholders.PLACEHOLDERS_ALIAS;
		}
	});
	Object.defineProperty(exports, "PLACEHOLDERS_FLIPPED_ALIAS", {
		enumerable: true,
		get: function() {
			return _placeholders.PLACEHOLDERS_FLIPPED_ALIAS;
		}
	});
	exports.TYPES = void 0;
	Object.defineProperty(exports, "VISITOR_KEYS", {
		enumerable: true,
		get: function() {
			return _utils.VISITOR_KEYS;
		}
	});
	require_core();
	require_flow();
	require_jsx();
	require_misc();
	require_experimental();
	require_typescript();
	var _utils = require_utils();
	var _placeholders = require_placeholders();
	var _deprecatedAliases = require_deprecated_aliases();
	Object.keys(_deprecatedAliases.DEPRECATED_ALIASES).forEach((deprecatedAlias) => {
		_utils.FLIPPED_ALIAS_KEYS[deprecatedAlias] = _utils.FLIPPED_ALIAS_KEYS[_deprecatedAliases.DEPRECATED_ALIASES[deprecatedAlias]];
	});
	const TYPES = exports.TYPES = [].concat(Object.keys(_utils.VISITOR_KEYS), Object.keys(_utils.FLIPPED_ALIAS_KEYS), Object.keys(_utils.DEPRECATED_KEYS));
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/validate.js
var require_validate = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/validate.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = validate$1;
	exports.validateChild = validateChild;
	exports.validateField = validateField;
	exports.validateInternal = validateInternal;
	var _index$36 = require_definitions();
	function validate$1(node, key, val) {
		if (!node) return;
		const fields = _index$36.NODE_FIELDS[node.type];
		if (!fields) return;
		const field = fields[key];
		validateField(node, key, val, field);
		validateChild(node, key, val);
	}
	function validateInternal(field, node, key, val, maybeNode) {
		if (!(field != null && field.validate)) return;
		if (field.optional && val == null) return;
		field.validate(node, key, val);
		if (maybeNode) {
			var _NODE_PARENT_VALIDATI;
			const type = val.type;
			if (type == null) return;
			(_NODE_PARENT_VALIDATI = _index$36.NODE_PARENT_VALIDATIONS[type]) == null || _NODE_PARENT_VALIDATI.call(_index$36.NODE_PARENT_VALIDATIONS, node, key, val);
		}
	}
	function validateField(node, key, val, field) {
		if (!(field != null && field.validate)) return;
		if (field.optional && val == null) return;
		field.validate(node, key, val);
	}
	function validateChild(node, key, val) {
		var _NODE_PARENT_VALIDATI2;
		const type = val == null ? void 0 : val.type;
		if (type == null) return;
		(_NODE_PARENT_VALIDATI2 = _index$36.NODE_PARENT_VALIDATIONS[type]) == null || _NODE_PARENT_VALIDATI2.call(_index$36.NODE_PARENT_VALIDATIONS, node, key, val);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/generated/index.js
var require_generated$2 = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/generated/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.anyTypeAnnotation = anyTypeAnnotation;
	exports.argumentPlaceholder = argumentPlaceholder;
	exports.arrayExpression = arrayExpression;
	exports.arrayPattern = arrayPattern;
	exports.arrayTypeAnnotation = arrayTypeAnnotation;
	exports.arrowFunctionExpression = arrowFunctionExpression;
	exports.assignmentExpression = assignmentExpression;
	exports.assignmentPattern = assignmentPattern;
	exports.awaitExpression = awaitExpression;
	exports.bigIntLiteral = bigIntLiteral;
	exports.binaryExpression = binaryExpression;
	exports.bindExpression = bindExpression;
	exports.blockStatement = blockStatement;
	exports.booleanLiteral = booleanLiteral;
	exports.booleanLiteralTypeAnnotation = booleanLiteralTypeAnnotation;
	exports.booleanTypeAnnotation = booleanTypeAnnotation;
	exports.breakStatement = breakStatement;
	exports.callExpression = callExpression;
	exports.catchClause = catchClause;
	exports.classAccessorProperty = classAccessorProperty;
	exports.classBody = classBody;
	exports.classDeclaration = classDeclaration;
	exports.classExpression = classExpression;
	exports.classImplements = classImplements;
	exports.classMethod = classMethod;
	exports.classPrivateMethod = classPrivateMethod;
	exports.classPrivateProperty = classPrivateProperty;
	exports.classProperty = classProperty;
	exports.conditionalExpression = conditionalExpression;
	exports.continueStatement = continueStatement;
	exports.debuggerStatement = debuggerStatement;
	exports.decimalLiteral = decimalLiteral;
	exports.declareClass = declareClass;
	exports.declareExportAllDeclaration = declareExportAllDeclaration;
	exports.declareExportDeclaration = declareExportDeclaration;
	exports.declareFunction = declareFunction;
	exports.declareInterface = declareInterface;
	exports.declareModule = declareModule;
	exports.declareModuleExports = declareModuleExports;
	exports.declareOpaqueType = declareOpaqueType;
	exports.declareTypeAlias = declareTypeAlias;
	exports.declareVariable = declareVariable;
	exports.declaredPredicate = declaredPredicate;
	exports.decorator = decorator;
	exports.directive = directive;
	exports.directiveLiteral = directiveLiteral;
	exports.doExpression = doExpression;
	exports.doWhileStatement = doWhileStatement;
	exports.emptyStatement = emptyStatement;
	exports.emptyTypeAnnotation = emptyTypeAnnotation;
	exports.enumBooleanBody = enumBooleanBody;
	exports.enumBooleanMember = enumBooleanMember;
	exports.enumDeclaration = enumDeclaration;
	exports.enumDefaultedMember = enumDefaultedMember;
	exports.enumNumberBody = enumNumberBody;
	exports.enumNumberMember = enumNumberMember;
	exports.enumStringBody = enumStringBody;
	exports.enumStringMember = enumStringMember;
	exports.enumSymbolBody = enumSymbolBody;
	exports.existsTypeAnnotation = existsTypeAnnotation;
	exports.exportAllDeclaration = exportAllDeclaration;
	exports.exportDefaultDeclaration = exportDefaultDeclaration;
	exports.exportDefaultSpecifier = exportDefaultSpecifier;
	exports.exportNamedDeclaration = exportNamedDeclaration;
	exports.exportNamespaceSpecifier = exportNamespaceSpecifier;
	exports.exportSpecifier = exportSpecifier;
	exports.expressionStatement = expressionStatement;
	exports.file = file;
	exports.forInStatement = forInStatement;
	exports.forOfStatement = forOfStatement;
	exports.forStatement = forStatement;
	exports.functionDeclaration = functionDeclaration;
	exports.functionExpression = functionExpression;
	exports.functionTypeAnnotation = functionTypeAnnotation;
	exports.functionTypeParam = functionTypeParam;
	exports.genericTypeAnnotation = genericTypeAnnotation;
	exports.identifier = identifier;
	exports.ifStatement = ifStatement;
	exports.import = _import;
	exports.importAttribute = importAttribute;
	exports.importDeclaration = importDeclaration;
	exports.importDefaultSpecifier = importDefaultSpecifier;
	exports.importExpression = importExpression;
	exports.importNamespaceSpecifier = importNamespaceSpecifier;
	exports.importSpecifier = importSpecifier;
	exports.indexedAccessType = indexedAccessType;
	exports.inferredPredicate = inferredPredicate;
	exports.interfaceDeclaration = interfaceDeclaration;
	exports.interfaceExtends = interfaceExtends;
	exports.interfaceTypeAnnotation = interfaceTypeAnnotation;
	exports.interpreterDirective = interpreterDirective;
	exports.intersectionTypeAnnotation = intersectionTypeAnnotation;
	exports.jSXAttribute = exports.jsxAttribute = jsxAttribute;
	exports.jSXClosingElement = exports.jsxClosingElement = jsxClosingElement;
	exports.jSXClosingFragment = exports.jsxClosingFragment = jsxClosingFragment;
	exports.jSXElement = exports.jsxElement = jsxElement;
	exports.jSXEmptyExpression = exports.jsxEmptyExpression = jsxEmptyExpression;
	exports.jSXExpressionContainer = exports.jsxExpressionContainer = jsxExpressionContainer;
	exports.jSXFragment = exports.jsxFragment = jsxFragment;
	exports.jSXIdentifier = exports.jsxIdentifier = jsxIdentifier;
	exports.jSXMemberExpression = exports.jsxMemberExpression = jsxMemberExpression;
	exports.jSXNamespacedName = exports.jsxNamespacedName = jsxNamespacedName;
	exports.jSXOpeningElement = exports.jsxOpeningElement = jsxOpeningElement;
	exports.jSXOpeningFragment = exports.jsxOpeningFragment = jsxOpeningFragment;
	exports.jSXSpreadAttribute = exports.jsxSpreadAttribute = jsxSpreadAttribute;
	exports.jSXSpreadChild = exports.jsxSpreadChild = jsxSpreadChild;
	exports.jSXText = exports.jsxText = jsxText;
	exports.labeledStatement = labeledStatement;
	exports.logicalExpression = logicalExpression;
	exports.memberExpression = memberExpression;
	exports.metaProperty = metaProperty;
	exports.mixedTypeAnnotation = mixedTypeAnnotation;
	exports.moduleExpression = moduleExpression;
	exports.newExpression = newExpression;
	exports.noop = noop;
	exports.nullLiteral = nullLiteral;
	exports.nullLiteralTypeAnnotation = nullLiteralTypeAnnotation;
	exports.nullableTypeAnnotation = nullableTypeAnnotation;
	exports.numberLiteral = NumberLiteral;
	exports.numberLiteralTypeAnnotation = numberLiteralTypeAnnotation;
	exports.numberTypeAnnotation = numberTypeAnnotation;
	exports.numericLiteral = numericLiteral;
	exports.objectExpression = objectExpression;
	exports.objectMethod = objectMethod;
	exports.objectPattern = objectPattern;
	exports.objectProperty = objectProperty;
	exports.objectTypeAnnotation = objectTypeAnnotation;
	exports.objectTypeCallProperty = objectTypeCallProperty;
	exports.objectTypeIndexer = objectTypeIndexer;
	exports.objectTypeInternalSlot = objectTypeInternalSlot;
	exports.objectTypeProperty = objectTypeProperty;
	exports.objectTypeSpreadProperty = objectTypeSpreadProperty;
	exports.opaqueType = opaqueType;
	exports.optionalCallExpression = optionalCallExpression;
	exports.optionalIndexedAccessType = optionalIndexedAccessType;
	exports.optionalMemberExpression = optionalMemberExpression;
	exports.parenthesizedExpression = parenthesizedExpression;
	exports.pipelineBareFunction = pipelineBareFunction;
	exports.pipelinePrimaryTopicReference = pipelinePrimaryTopicReference;
	exports.pipelineTopicExpression = pipelineTopicExpression;
	exports.placeholder = placeholder;
	exports.privateName = privateName;
	exports.program = program;
	exports.qualifiedTypeIdentifier = qualifiedTypeIdentifier;
	exports.recordExpression = recordExpression;
	exports.regExpLiteral = regExpLiteral;
	exports.regexLiteral = RegexLiteral;
	exports.restElement = restElement;
	exports.restProperty = RestProperty;
	exports.returnStatement = returnStatement;
	exports.sequenceExpression = sequenceExpression;
	exports.spreadElement = spreadElement;
	exports.spreadProperty = SpreadProperty;
	exports.staticBlock = staticBlock;
	exports.stringLiteral = stringLiteral;
	exports.stringLiteralTypeAnnotation = stringLiteralTypeAnnotation;
	exports.stringTypeAnnotation = stringTypeAnnotation;
	exports.super = _super;
	exports.switchCase = switchCase;
	exports.switchStatement = switchStatement;
	exports.symbolTypeAnnotation = symbolTypeAnnotation;
	exports.taggedTemplateExpression = taggedTemplateExpression;
	exports.templateElement = templateElement;
	exports.templateLiteral = templateLiteral;
	exports.thisExpression = thisExpression;
	exports.thisTypeAnnotation = thisTypeAnnotation;
	exports.throwStatement = throwStatement;
	exports.topicReference = topicReference;
	exports.tryStatement = tryStatement;
	exports.tSAnyKeyword = exports.tsAnyKeyword = tsAnyKeyword;
	exports.tSArrayType = exports.tsArrayType = tsArrayType;
	exports.tSAsExpression = exports.tsAsExpression = tsAsExpression;
	exports.tSBigIntKeyword = exports.tsBigIntKeyword = tsBigIntKeyword;
	exports.tSBooleanKeyword = exports.tsBooleanKeyword = tsBooleanKeyword;
	exports.tSCallSignatureDeclaration = exports.tsCallSignatureDeclaration = tsCallSignatureDeclaration;
	exports.tSConditionalType = exports.tsConditionalType = tsConditionalType;
	exports.tSConstructSignatureDeclaration = exports.tsConstructSignatureDeclaration = tsConstructSignatureDeclaration;
	exports.tSConstructorType = exports.tsConstructorType = tsConstructorType;
	exports.tSDeclareFunction = exports.tsDeclareFunction = tsDeclareFunction;
	exports.tSDeclareMethod = exports.tsDeclareMethod = tsDeclareMethod;
	exports.tSEnumBody = exports.tsEnumBody = tsEnumBody;
	exports.tSEnumDeclaration = exports.tsEnumDeclaration = tsEnumDeclaration;
	exports.tSEnumMember = exports.tsEnumMember = tsEnumMember;
	exports.tSExportAssignment = exports.tsExportAssignment = tsExportAssignment;
	exports.tSExpressionWithTypeArguments = exports.tsExpressionWithTypeArguments = tsExpressionWithTypeArguments;
	exports.tSExternalModuleReference = exports.tsExternalModuleReference = tsExternalModuleReference;
	exports.tSFunctionType = exports.tsFunctionType = tsFunctionType;
	exports.tSImportEqualsDeclaration = exports.tsImportEqualsDeclaration = tsImportEqualsDeclaration;
	exports.tSImportType = exports.tsImportType = tsImportType;
	exports.tSIndexSignature = exports.tsIndexSignature = tsIndexSignature;
	exports.tSIndexedAccessType = exports.tsIndexedAccessType = tsIndexedAccessType;
	exports.tSInferType = exports.tsInferType = tsInferType;
	exports.tSInstantiationExpression = exports.tsInstantiationExpression = tsInstantiationExpression;
	exports.tSInterfaceBody = exports.tsInterfaceBody = tsInterfaceBody;
	exports.tSInterfaceDeclaration = exports.tsInterfaceDeclaration = tsInterfaceDeclaration;
	exports.tSIntersectionType = exports.tsIntersectionType = tsIntersectionType;
	exports.tSIntrinsicKeyword = exports.tsIntrinsicKeyword = tsIntrinsicKeyword;
	exports.tSLiteralType = exports.tsLiteralType = tsLiteralType;
	exports.tSMappedType = exports.tsMappedType = tsMappedType;
	exports.tSMethodSignature = exports.tsMethodSignature = tsMethodSignature;
	exports.tSModuleBlock = exports.tsModuleBlock = tsModuleBlock;
	exports.tSModuleDeclaration = exports.tsModuleDeclaration = tsModuleDeclaration;
	exports.tSNamedTupleMember = exports.tsNamedTupleMember = tsNamedTupleMember;
	exports.tSNamespaceExportDeclaration = exports.tsNamespaceExportDeclaration = tsNamespaceExportDeclaration;
	exports.tSNeverKeyword = exports.tsNeverKeyword = tsNeverKeyword;
	exports.tSNonNullExpression = exports.tsNonNullExpression = tsNonNullExpression;
	exports.tSNullKeyword = exports.tsNullKeyword = tsNullKeyword;
	exports.tSNumberKeyword = exports.tsNumberKeyword = tsNumberKeyword;
	exports.tSObjectKeyword = exports.tsObjectKeyword = tsObjectKeyword;
	exports.tSOptionalType = exports.tsOptionalType = tsOptionalType;
	exports.tSParameterProperty = exports.tsParameterProperty = tsParameterProperty;
	exports.tSParenthesizedType = exports.tsParenthesizedType = tsParenthesizedType;
	exports.tSPropertySignature = exports.tsPropertySignature = tsPropertySignature;
	exports.tSQualifiedName = exports.tsQualifiedName = tsQualifiedName;
	exports.tSRestType = exports.tsRestType = tsRestType;
	exports.tSSatisfiesExpression = exports.tsSatisfiesExpression = tsSatisfiesExpression;
	exports.tSStringKeyword = exports.tsStringKeyword = tsStringKeyword;
	exports.tSSymbolKeyword = exports.tsSymbolKeyword = tsSymbolKeyword;
	exports.tSThisType = exports.tsThisType = tsThisType;
	exports.tSTupleType = exports.tsTupleType = tsTupleType;
	exports.tSTypeAliasDeclaration = exports.tsTypeAliasDeclaration = tsTypeAliasDeclaration;
	exports.tSTypeAnnotation = exports.tsTypeAnnotation = tsTypeAnnotation;
	exports.tSTypeAssertion = exports.tsTypeAssertion = tsTypeAssertion;
	exports.tSTypeLiteral = exports.tsTypeLiteral = tsTypeLiteral;
	exports.tSTypeOperator = exports.tsTypeOperator = tsTypeOperator;
	exports.tSTypeParameter = exports.tsTypeParameter = tsTypeParameter;
	exports.tSTypeParameterDeclaration = exports.tsTypeParameterDeclaration = tsTypeParameterDeclaration;
	exports.tSTypeParameterInstantiation = exports.tsTypeParameterInstantiation = tsTypeParameterInstantiation;
	exports.tSTypePredicate = exports.tsTypePredicate = tsTypePredicate;
	exports.tSTypeQuery = exports.tsTypeQuery = tsTypeQuery;
	exports.tSTypeReference = exports.tsTypeReference = tsTypeReference;
	exports.tSUndefinedKeyword = exports.tsUndefinedKeyword = tsUndefinedKeyword;
	exports.tSUnionType = exports.tsUnionType = tsUnionType;
	exports.tSUnknownKeyword = exports.tsUnknownKeyword = tsUnknownKeyword;
	exports.tSVoidKeyword = exports.tsVoidKeyword = tsVoidKeyword;
	exports.tupleExpression = tupleExpression;
	exports.tupleTypeAnnotation = tupleTypeAnnotation;
	exports.typeAlias = typeAlias;
	exports.typeAnnotation = typeAnnotation;
	exports.typeCastExpression = typeCastExpression;
	exports.typeParameter = typeParameter;
	exports.typeParameterDeclaration = typeParameterDeclaration;
	exports.typeParameterInstantiation = typeParameterInstantiation;
	exports.typeofTypeAnnotation = typeofTypeAnnotation;
	exports.unaryExpression = unaryExpression;
	exports.unionTypeAnnotation = unionTypeAnnotation;
	exports.updateExpression = updateExpression;
	exports.v8IntrinsicIdentifier = v8IntrinsicIdentifier;
	exports.variableDeclaration = variableDeclaration;
	exports.variableDeclarator = variableDeclarator;
	exports.variance = variance;
	exports.voidTypeAnnotation = voidTypeAnnotation;
	exports.whileStatement = whileStatement;
	exports.withStatement = withStatement;
	exports.yieldExpression = yieldExpression;
	var _validate$1 = require_validate();
	var _deprecationWarning$2 = require_deprecationWarning();
	var utils = require_utils();
	const { validateInternal: validate } = _validate$1;
	const { NODE_FIELDS } = utils;
	function arrayExpression(elements = []) {
		const node = {
			type: "ArrayExpression",
			elements
		};
		const defs = NODE_FIELDS.ArrayExpression;
		validate(defs.elements, node, "elements", elements, 1);
		return node;
	}
	function assignmentExpression(operator, left, right) {
		const node = {
			type: "AssignmentExpression",
			operator,
			left,
			right
		};
		const defs = NODE_FIELDS.AssignmentExpression;
		validate(defs.operator, node, "operator", operator);
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function binaryExpression(operator, left, right) {
		const node = {
			type: "BinaryExpression",
			operator,
			left,
			right
		};
		const defs = NODE_FIELDS.BinaryExpression;
		validate(defs.operator, node, "operator", operator);
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function interpreterDirective(value) {
		const node = {
			type: "InterpreterDirective",
			value
		};
		const defs = NODE_FIELDS.InterpreterDirective;
		validate(defs.value, node, "value", value);
		return node;
	}
	function directive(value) {
		const node = {
			type: "Directive",
			value
		};
		const defs = NODE_FIELDS.Directive;
		validate(defs.value, node, "value", value, 1);
		return node;
	}
	function directiveLiteral(value) {
		const node = {
			type: "DirectiveLiteral",
			value
		};
		const defs = NODE_FIELDS.DirectiveLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function blockStatement(body, directives = []) {
		const node = {
			type: "BlockStatement",
			body,
			directives
		};
		const defs = NODE_FIELDS.BlockStatement;
		validate(defs.body, node, "body", body, 1);
		validate(defs.directives, node, "directives", directives, 1);
		return node;
	}
	function breakStatement(label = null) {
		const node = {
			type: "BreakStatement",
			label
		};
		const defs = NODE_FIELDS.BreakStatement;
		validate(defs.label, node, "label", label, 1);
		return node;
	}
	function callExpression(callee, _arguments) {
		const node = {
			type: "CallExpression",
			callee,
			arguments: _arguments
		};
		const defs = NODE_FIELDS.CallExpression;
		validate(defs.callee, node, "callee", callee, 1);
		validate(defs.arguments, node, "arguments", _arguments, 1);
		return node;
	}
	function catchClause(param = null, body) {
		const node = {
			type: "CatchClause",
			param,
			body
		};
		const defs = NODE_FIELDS.CatchClause;
		validate(defs.param, node, "param", param, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function conditionalExpression(test$1, consequent, alternate) {
		const node = {
			type: "ConditionalExpression",
			test: test$1,
			consequent,
			alternate
		};
		const defs = NODE_FIELDS.ConditionalExpression;
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.consequent, node, "consequent", consequent, 1);
		validate(defs.alternate, node, "alternate", alternate, 1);
		return node;
	}
	function continueStatement(label = null) {
		const node = {
			type: "ContinueStatement",
			label
		};
		const defs = NODE_FIELDS.ContinueStatement;
		validate(defs.label, node, "label", label, 1);
		return node;
	}
	function debuggerStatement() {
		return { type: "DebuggerStatement" };
	}
	function doWhileStatement(test$1, body) {
		const node = {
			type: "DoWhileStatement",
			test: test$1,
			body
		};
		const defs = NODE_FIELDS.DoWhileStatement;
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function emptyStatement() {
		return { type: "EmptyStatement" };
	}
	function expressionStatement(expression) {
		const node = {
			type: "ExpressionStatement",
			expression
		};
		const defs = NODE_FIELDS.ExpressionStatement;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function file(program$1, comments = null, tokens = null) {
		const node = {
			type: "File",
			program: program$1,
			comments,
			tokens
		};
		const defs = NODE_FIELDS.File;
		validate(defs.program, node, "program", program$1, 1);
		validate(defs.comments, node, "comments", comments, 1);
		validate(defs.tokens, node, "tokens", tokens);
		return node;
	}
	function forInStatement(left, right, body) {
		const node = {
			type: "ForInStatement",
			left,
			right,
			body
		};
		const defs = NODE_FIELDS.ForInStatement;
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function forStatement(init = null, test$1 = null, update = null, body) {
		const node = {
			type: "ForStatement",
			init,
			test: test$1,
			update,
			body
		};
		const defs = NODE_FIELDS.ForStatement;
		validate(defs.init, node, "init", init, 1);
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.update, node, "update", update, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function functionDeclaration(id = null, params, body, generator = false, async$2 = false) {
		const node = {
			type: "FunctionDeclaration",
			id,
			params,
			body,
			generator,
			async: async$2
		};
		const defs = NODE_FIELDS.FunctionDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.generator, node, "generator", generator);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function functionExpression(id = null, params, body, generator = false, async$2 = false) {
		const node = {
			type: "FunctionExpression",
			id,
			params,
			body,
			generator,
			async: async$2
		};
		const defs = NODE_FIELDS.FunctionExpression;
		validate(defs.id, node, "id", id, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.generator, node, "generator", generator);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function identifier(name) {
		const node = {
			type: "Identifier",
			name
		};
		const defs = NODE_FIELDS.Identifier;
		validate(defs.name, node, "name", name);
		return node;
	}
	function ifStatement(test$1, consequent, alternate = null) {
		const node = {
			type: "IfStatement",
			test: test$1,
			consequent,
			alternate
		};
		const defs = NODE_FIELDS.IfStatement;
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.consequent, node, "consequent", consequent, 1);
		validate(defs.alternate, node, "alternate", alternate, 1);
		return node;
	}
	function labeledStatement(label, body) {
		const node = {
			type: "LabeledStatement",
			label,
			body
		};
		const defs = NODE_FIELDS.LabeledStatement;
		validate(defs.label, node, "label", label, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function stringLiteral(value) {
		const node = {
			type: "StringLiteral",
			value
		};
		const defs = NODE_FIELDS.StringLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function numericLiteral(value) {
		const node = {
			type: "NumericLiteral",
			value
		};
		const defs = NODE_FIELDS.NumericLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function nullLiteral() {
		return { type: "NullLiteral" };
	}
	function booleanLiteral(value) {
		const node = {
			type: "BooleanLiteral",
			value
		};
		const defs = NODE_FIELDS.BooleanLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function regExpLiteral(pattern$1, flags = "") {
		const node = {
			type: "RegExpLiteral",
			pattern: pattern$1,
			flags
		};
		const defs = NODE_FIELDS.RegExpLiteral;
		validate(defs.pattern, node, "pattern", pattern$1);
		validate(defs.flags, node, "flags", flags);
		return node;
	}
	function logicalExpression(operator, left, right) {
		const node = {
			type: "LogicalExpression",
			operator,
			left,
			right
		};
		const defs = NODE_FIELDS.LogicalExpression;
		validate(defs.operator, node, "operator", operator);
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function memberExpression(object, property, computed = false, optional = null) {
		const node = {
			type: "MemberExpression",
			object,
			property,
			computed,
			optional
		};
		const defs = NODE_FIELDS.MemberExpression;
		validate(defs.object, node, "object", object, 1);
		validate(defs.property, node, "property", property, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.optional, node, "optional", optional);
		return node;
	}
	function newExpression(callee, _arguments) {
		const node = {
			type: "NewExpression",
			callee,
			arguments: _arguments
		};
		const defs = NODE_FIELDS.NewExpression;
		validate(defs.callee, node, "callee", callee, 1);
		validate(defs.arguments, node, "arguments", _arguments, 1);
		return node;
	}
	function program(body, directives = [], sourceType = "script", interpreter = null) {
		const node = {
			type: "Program",
			body,
			directives,
			sourceType,
			interpreter
		};
		const defs = NODE_FIELDS.Program;
		validate(defs.body, node, "body", body, 1);
		validate(defs.directives, node, "directives", directives, 1);
		validate(defs.sourceType, node, "sourceType", sourceType);
		validate(defs.interpreter, node, "interpreter", interpreter, 1);
		return node;
	}
	function objectExpression(properties) {
		const node = {
			type: "ObjectExpression",
			properties
		};
		const defs = NODE_FIELDS.ObjectExpression;
		validate(defs.properties, node, "properties", properties, 1);
		return node;
	}
	function objectMethod(kind = "method", key, params, body, computed = false, generator = false, async$2 = false) {
		const node = {
			type: "ObjectMethod",
			kind,
			key,
			params,
			body,
			computed,
			generator,
			async: async$2
		};
		const defs = NODE_FIELDS.ObjectMethod;
		validate(defs.kind, node, "kind", kind);
		validate(defs.key, node, "key", key, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.generator, node, "generator", generator);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function objectProperty(key, value, computed = false, shorthand = false, decorators = null) {
		const node = {
			type: "ObjectProperty",
			key,
			value,
			computed,
			shorthand,
			decorators
		};
		const defs = NODE_FIELDS.ObjectProperty;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.shorthand, node, "shorthand", shorthand);
		validate(defs.decorators, node, "decorators", decorators, 1);
		return node;
	}
	function restElement(argument) {
		const node = {
			type: "RestElement",
			argument
		};
		const defs = NODE_FIELDS.RestElement;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function returnStatement(argument = null) {
		const node = {
			type: "ReturnStatement",
			argument
		};
		const defs = NODE_FIELDS.ReturnStatement;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function sequenceExpression(expressions) {
		const node = {
			type: "SequenceExpression",
			expressions
		};
		const defs = NODE_FIELDS.SequenceExpression;
		validate(defs.expressions, node, "expressions", expressions, 1);
		return node;
	}
	function parenthesizedExpression(expression) {
		const node = {
			type: "ParenthesizedExpression",
			expression
		};
		const defs = NODE_FIELDS.ParenthesizedExpression;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function switchCase(test$1 = null, consequent) {
		const node = {
			type: "SwitchCase",
			test: test$1,
			consequent
		};
		const defs = NODE_FIELDS.SwitchCase;
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.consequent, node, "consequent", consequent, 1);
		return node;
	}
	function switchStatement(discriminant, cases) {
		const node = {
			type: "SwitchStatement",
			discriminant,
			cases
		};
		const defs = NODE_FIELDS.SwitchStatement;
		validate(defs.discriminant, node, "discriminant", discriminant, 1);
		validate(defs.cases, node, "cases", cases, 1);
		return node;
	}
	function thisExpression() {
		return { type: "ThisExpression" };
	}
	function throwStatement(argument) {
		const node = {
			type: "ThrowStatement",
			argument
		};
		const defs = NODE_FIELDS.ThrowStatement;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function tryStatement(block, handler = null, finalizer = null) {
		const node = {
			type: "TryStatement",
			block,
			handler,
			finalizer
		};
		const defs = NODE_FIELDS.TryStatement;
		validate(defs.block, node, "block", block, 1);
		validate(defs.handler, node, "handler", handler, 1);
		validate(defs.finalizer, node, "finalizer", finalizer, 1);
		return node;
	}
	function unaryExpression(operator, argument, prefix = true) {
		const node = {
			type: "UnaryExpression",
			operator,
			argument,
			prefix
		};
		const defs = NODE_FIELDS.UnaryExpression;
		validate(defs.operator, node, "operator", operator);
		validate(defs.argument, node, "argument", argument, 1);
		validate(defs.prefix, node, "prefix", prefix);
		return node;
	}
	function updateExpression(operator, argument, prefix = false) {
		const node = {
			type: "UpdateExpression",
			operator,
			argument,
			prefix
		};
		const defs = NODE_FIELDS.UpdateExpression;
		validate(defs.operator, node, "operator", operator);
		validate(defs.argument, node, "argument", argument, 1);
		validate(defs.prefix, node, "prefix", prefix);
		return node;
	}
	function variableDeclaration(kind, declarations) {
		const node = {
			type: "VariableDeclaration",
			kind,
			declarations
		};
		const defs = NODE_FIELDS.VariableDeclaration;
		validate(defs.kind, node, "kind", kind);
		validate(defs.declarations, node, "declarations", declarations, 1);
		return node;
	}
	function variableDeclarator(id, init = null) {
		const node = {
			type: "VariableDeclarator",
			id,
			init
		};
		const defs = NODE_FIELDS.VariableDeclarator;
		validate(defs.id, node, "id", id, 1);
		validate(defs.init, node, "init", init, 1);
		return node;
	}
	function whileStatement(test$1, body) {
		const node = {
			type: "WhileStatement",
			test: test$1,
			body
		};
		const defs = NODE_FIELDS.WhileStatement;
		validate(defs.test, node, "test", test$1, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function withStatement(object, body) {
		const node = {
			type: "WithStatement",
			object,
			body
		};
		const defs = NODE_FIELDS.WithStatement;
		validate(defs.object, node, "object", object, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function assignmentPattern(left, right) {
		const node = {
			type: "AssignmentPattern",
			left,
			right
		};
		const defs = NODE_FIELDS.AssignmentPattern;
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function arrayPattern(elements) {
		const node = {
			type: "ArrayPattern",
			elements
		};
		const defs = NODE_FIELDS.ArrayPattern;
		validate(defs.elements, node, "elements", elements, 1);
		return node;
	}
	function arrowFunctionExpression(params, body, async$2 = false) {
		const node = {
			type: "ArrowFunctionExpression",
			params,
			body,
			async: async$2,
			expression: null
		};
		const defs = NODE_FIELDS.ArrowFunctionExpression;
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function classBody(body) {
		const node = {
			type: "ClassBody",
			body
		};
		const defs = NODE_FIELDS.ClassBody;
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function classExpression(id = null, superClass = null, body, decorators = null) {
		const node = {
			type: "ClassExpression",
			id,
			superClass,
			body,
			decorators
		};
		const defs = NODE_FIELDS.ClassExpression;
		validate(defs.id, node, "id", id, 1);
		validate(defs.superClass, node, "superClass", superClass, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.decorators, node, "decorators", decorators, 1);
		return node;
	}
	function classDeclaration(id = null, superClass = null, body, decorators = null) {
		const node = {
			type: "ClassDeclaration",
			id,
			superClass,
			body,
			decorators
		};
		const defs = NODE_FIELDS.ClassDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.superClass, node, "superClass", superClass, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.decorators, node, "decorators", decorators, 1);
		return node;
	}
	function exportAllDeclaration(source) {
		const node = {
			type: "ExportAllDeclaration",
			source
		};
		const defs = NODE_FIELDS.ExportAllDeclaration;
		validate(defs.source, node, "source", source, 1);
		return node;
	}
	function exportDefaultDeclaration(declaration) {
		const node = {
			type: "ExportDefaultDeclaration",
			declaration
		};
		const defs = NODE_FIELDS.ExportDefaultDeclaration;
		validate(defs.declaration, node, "declaration", declaration, 1);
		return node;
	}
	function exportNamedDeclaration(declaration = null, specifiers = [], source = null) {
		const node = {
			type: "ExportNamedDeclaration",
			declaration,
			specifiers,
			source
		};
		const defs = NODE_FIELDS.ExportNamedDeclaration;
		validate(defs.declaration, node, "declaration", declaration, 1);
		validate(defs.specifiers, node, "specifiers", specifiers, 1);
		validate(defs.source, node, "source", source, 1);
		return node;
	}
	function exportSpecifier(local, exported) {
		const node = {
			type: "ExportSpecifier",
			local,
			exported
		};
		const defs = NODE_FIELDS.ExportSpecifier;
		validate(defs.local, node, "local", local, 1);
		validate(defs.exported, node, "exported", exported, 1);
		return node;
	}
	function forOfStatement(left, right, body, _await = false) {
		const node = {
			type: "ForOfStatement",
			left,
			right,
			body,
			await: _await
		};
		const defs = NODE_FIELDS.ForOfStatement;
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.await, node, "await", _await);
		return node;
	}
	function importDeclaration(specifiers, source) {
		const node = {
			type: "ImportDeclaration",
			specifiers,
			source
		};
		const defs = NODE_FIELDS.ImportDeclaration;
		validate(defs.specifiers, node, "specifiers", specifiers, 1);
		validate(defs.source, node, "source", source, 1);
		return node;
	}
	function importDefaultSpecifier(local) {
		const node = {
			type: "ImportDefaultSpecifier",
			local
		};
		const defs = NODE_FIELDS.ImportDefaultSpecifier;
		validate(defs.local, node, "local", local, 1);
		return node;
	}
	function importNamespaceSpecifier(local) {
		const node = {
			type: "ImportNamespaceSpecifier",
			local
		};
		const defs = NODE_FIELDS.ImportNamespaceSpecifier;
		validate(defs.local, node, "local", local, 1);
		return node;
	}
	function importSpecifier(local, imported) {
		const node = {
			type: "ImportSpecifier",
			local,
			imported
		};
		const defs = NODE_FIELDS.ImportSpecifier;
		validate(defs.local, node, "local", local, 1);
		validate(defs.imported, node, "imported", imported, 1);
		return node;
	}
	function importExpression(source, options = null) {
		const node = {
			type: "ImportExpression",
			source,
			options
		};
		const defs = NODE_FIELDS.ImportExpression;
		validate(defs.source, node, "source", source, 1);
		validate(defs.options, node, "options", options, 1);
		return node;
	}
	function metaProperty(meta, property) {
		const node = {
			type: "MetaProperty",
			meta,
			property
		};
		const defs = NODE_FIELDS.MetaProperty;
		validate(defs.meta, node, "meta", meta, 1);
		validate(defs.property, node, "property", property, 1);
		return node;
	}
	function classMethod(kind = "method", key, params, body, computed = false, _static = false, generator = false, async$2 = false) {
		const node = {
			type: "ClassMethod",
			kind,
			key,
			params,
			body,
			computed,
			static: _static,
			generator,
			async: async$2
		};
		const defs = NODE_FIELDS.ClassMethod;
		validate(defs.kind, node, "kind", kind);
		validate(defs.key, node, "key", key, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.static, node, "static", _static);
		validate(defs.generator, node, "generator", generator);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function objectPattern(properties) {
		const node = {
			type: "ObjectPattern",
			properties
		};
		const defs = NODE_FIELDS.ObjectPattern;
		validate(defs.properties, node, "properties", properties, 1);
		return node;
	}
	function spreadElement(argument) {
		const node = {
			type: "SpreadElement",
			argument
		};
		const defs = NODE_FIELDS.SpreadElement;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function _super() {
		return { type: "Super" };
	}
	function taggedTemplateExpression(tag, quasi) {
		const node = {
			type: "TaggedTemplateExpression",
			tag,
			quasi
		};
		const defs = NODE_FIELDS.TaggedTemplateExpression;
		validate(defs.tag, node, "tag", tag, 1);
		validate(defs.quasi, node, "quasi", quasi, 1);
		return node;
	}
	function templateElement(value, tail = false) {
		const node = {
			type: "TemplateElement",
			value,
			tail
		};
		const defs = NODE_FIELDS.TemplateElement;
		validate(defs.value, node, "value", value);
		validate(defs.tail, node, "tail", tail);
		return node;
	}
	function templateLiteral(quasis, expressions) {
		const node = {
			type: "TemplateLiteral",
			quasis,
			expressions
		};
		const defs = NODE_FIELDS.TemplateLiteral;
		validate(defs.quasis, node, "quasis", quasis, 1);
		validate(defs.expressions, node, "expressions", expressions, 1);
		return node;
	}
	function yieldExpression(argument = null, delegate = false) {
		const node = {
			type: "YieldExpression",
			argument,
			delegate
		};
		const defs = NODE_FIELDS.YieldExpression;
		validate(defs.argument, node, "argument", argument, 1);
		validate(defs.delegate, node, "delegate", delegate);
		return node;
	}
	function awaitExpression(argument) {
		const node = {
			type: "AwaitExpression",
			argument
		};
		const defs = NODE_FIELDS.AwaitExpression;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function _import() {
		return { type: "Import" };
	}
	function bigIntLiteral(value) {
		const node = {
			type: "BigIntLiteral",
			value
		};
		const defs = NODE_FIELDS.BigIntLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function exportNamespaceSpecifier(exported) {
		const node = {
			type: "ExportNamespaceSpecifier",
			exported
		};
		const defs = NODE_FIELDS.ExportNamespaceSpecifier;
		validate(defs.exported, node, "exported", exported, 1);
		return node;
	}
	function optionalMemberExpression(object, property, computed = false, optional) {
		const node = {
			type: "OptionalMemberExpression",
			object,
			property,
			computed,
			optional
		};
		const defs = NODE_FIELDS.OptionalMemberExpression;
		validate(defs.object, node, "object", object, 1);
		validate(defs.property, node, "property", property, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.optional, node, "optional", optional);
		return node;
	}
	function optionalCallExpression(callee, _arguments, optional) {
		const node = {
			type: "OptionalCallExpression",
			callee,
			arguments: _arguments,
			optional
		};
		const defs = NODE_FIELDS.OptionalCallExpression;
		validate(defs.callee, node, "callee", callee, 1);
		validate(defs.arguments, node, "arguments", _arguments, 1);
		validate(defs.optional, node, "optional", optional);
		return node;
	}
	function classProperty(key, value = null, typeAnnotation$1 = null, decorators = null, computed = false, _static = false) {
		const node = {
			type: "ClassProperty",
			key,
			value,
			typeAnnotation: typeAnnotation$1,
			decorators,
			computed,
			static: _static
		};
		const defs = NODE_FIELDS.ClassProperty;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		validate(defs.decorators, node, "decorators", decorators, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.static, node, "static", _static);
		return node;
	}
	function classAccessorProperty(key, value = null, typeAnnotation$1 = null, decorators = null, computed = false, _static = false) {
		const node = {
			type: "ClassAccessorProperty",
			key,
			value,
			typeAnnotation: typeAnnotation$1,
			decorators,
			computed,
			static: _static
		};
		const defs = NODE_FIELDS.ClassAccessorProperty;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		validate(defs.decorators, node, "decorators", decorators, 1);
		validate(defs.computed, node, "computed", computed);
		validate(defs.static, node, "static", _static);
		return node;
	}
	function classPrivateProperty(key, value = null, decorators = null, _static = false) {
		const node = {
			type: "ClassPrivateProperty",
			key,
			value,
			decorators,
			static: _static
		};
		const defs = NODE_FIELDS.ClassPrivateProperty;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.decorators, node, "decorators", decorators, 1);
		validate(defs.static, node, "static", _static);
		return node;
	}
	function classPrivateMethod(kind = "method", key, params, body, _static = false) {
		const node = {
			type: "ClassPrivateMethod",
			kind,
			key,
			params,
			body,
			static: _static
		};
		const defs = NODE_FIELDS.ClassPrivateMethod;
		validate(defs.kind, node, "kind", kind);
		validate(defs.key, node, "key", key, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.static, node, "static", _static);
		return node;
	}
	function privateName(id) {
		const node = {
			type: "PrivateName",
			id
		};
		const defs = NODE_FIELDS.PrivateName;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function staticBlock(body) {
		const node = {
			type: "StaticBlock",
			body
		};
		const defs = NODE_FIELDS.StaticBlock;
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function anyTypeAnnotation() {
		return { type: "AnyTypeAnnotation" };
	}
	function arrayTypeAnnotation(elementType) {
		const node = {
			type: "ArrayTypeAnnotation",
			elementType
		};
		const defs = NODE_FIELDS.ArrayTypeAnnotation;
		validate(defs.elementType, node, "elementType", elementType, 1);
		return node;
	}
	function booleanTypeAnnotation() {
		return { type: "BooleanTypeAnnotation" };
	}
	function booleanLiteralTypeAnnotation(value) {
		const node = {
			type: "BooleanLiteralTypeAnnotation",
			value
		};
		const defs = NODE_FIELDS.BooleanLiteralTypeAnnotation;
		validate(defs.value, node, "value", value);
		return node;
	}
	function nullLiteralTypeAnnotation() {
		return { type: "NullLiteralTypeAnnotation" };
	}
	function classImplements(id, typeParameters = null) {
		const node = {
			type: "ClassImplements",
			id,
			typeParameters
		};
		const defs = NODE_FIELDS.ClassImplements;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function declareClass(id, typeParameters = null, _extends = null, body) {
		const node = {
			type: "DeclareClass",
			id,
			typeParameters,
			extends: _extends,
			body
		};
		const defs = NODE_FIELDS.DeclareClass;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.extends, node, "extends", _extends, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function declareFunction(id) {
		const node = {
			type: "DeclareFunction",
			id
		};
		const defs = NODE_FIELDS.DeclareFunction;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function declareInterface(id, typeParameters = null, _extends = null, body) {
		const node = {
			type: "DeclareInterface",
			id,
			typeParameters,
			extends: _extends,
			body
		};
		const defs = NODE_FIELDS.DeclareInterface;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.extends, node, "extends", _extends, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function declareModule(id, body, kind = null) {
		const node = {
			type: "DeclareModule",
			id,
			body,
			kind
		};
		const defs = NODE_FIELDS.DeclareModule;
		validate(defs.id, node, "id", id, 1);
		validate(defs.body, node, "body", body, 1);
		validate(defs.kind, node, "kind", kind);
		return node;
	}
	function declareModuleExports(typeAnnotation$1) {
		const node = {
			type: "DeclareModuleExports",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.DeclareModuleExports;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function declareTypeAlias(id, typeParameters = null, right) {
		const node = {
			type: "DeclareTypeAlias",
			id,
			typeParameters,
			right
		};
		const defs = NODE_FIELDS.DeclareTypeAlias;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function declareOpaqueType(id, typeParameters = null, supertype = null) {
		const node = {
			type: "DeclareOpaqueType",
			id,
			typeParameters,
			supertype
		};
		const defs = NODE_FIELDS.DeclareOpaqueType;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.supertype, node, "supertype", supertype, 1);
		return node;
	}
	function declareVariable(id) {
		const node = {
			type: "DeclareVariable",
			id
		};
		const defs = NODE_FIELDS.DeclareVariable;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function declareExportDeclaration(declaration = null, specifiers = null, source = null, attributes = null) {
		const node = {
			type: "DeclareExportDeclaration",
			declaration,
			specifiers,
			source,
			attributes
		};
		const defs = NODE_FIELDS.DeclareExportDeclaration;
		validate(defs.declaration, node, "declaration", declaration, 1);
		validate(defs.specifiers, node, "specifiers", specifiers, 1);
		validate(defs.source, node, "source", source, 1);
		validate(defs.attributes, node, "attributes", attributes, 1);
		return node;
	}
	function declareExportAllDeclaration(source, attributes = null) {
		const node = {
			type: "DeclareExportAllDeclaration",
			source,
			attributes
		};
		const defs = NODE_FIELDS.DeclareExportAllDeclaration;
		validate(defs.source, node, "source", source, 1);
		validate(defs.attributes, node, "attributes", attributes, 1);
		return node;
	}
	function declaredPredicate(value) {
		const node = {
			type: "DeclaredPredicate",
			value
		};
		const defs = NODE_FIELDS.DeclaredPredicate;
		validate(defs.value, node, "value", value, 1);
		return node;
	}
	function existsTypeAnnotation() {
		return { type: "ExistsTypeAnnotation" };
	}
	function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
		const node = {
			type: "FunctionTypeAnnotation",
			typeParameters,
			params,
			rest,
			returnType
		};
		const defs = NODE_FIELDS.FunctionTypeAnnotation;
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.rest, node, "rest", rest, 1);
		validate(defs.returnType, node, "returnType", returnType, 1);
		return node;
	}
	function functionTypeParam(name = null, typeAnnotation$1) {
		const node = {
			type: "FunctionTypeParam",
			name,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.FunctionTypeParam;
		validate(defs.name, node, "name", name, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function genericTypeAnnotation(id, typeParameters = null) {
		const node = {
			type: "GenericTypeAnnotation",
			id,
			typeParameters
		};
		const defs = NODE_FIELDS.GenericTypeAnnotation;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function inferredPredicate() {
		return { type: "InferredPredicate" };
	}
	function interfaceExtends(id, typeParameters = null) {
		const node = {
			type: "InterfaceExtends",
			id,
			typeParameters
		};
		const defs = NODE_FIELDS.InterfaceExtends;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
		const node = {
			type: "InterfaceDeclaration",
			id,
			typeParameters,
			extends: _extends,
			body
		};
		const defs = NODE_FIELDS.InterfaceDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.extends, node, "extends", _extends, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function interfaceTypeAnnotation(_extends = null, body) {
		const node = {
			type: "InterfaceTypeAnnotation",
			extends: _extends,
			body
		};
		const defs = NODE_FIELDS.InterfaceTypeAnnotation;
		validate(defs.extends, node, "extends", _extends, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function intersectionTypeAnnotation(types$1) {
		const node = {
			type: "IntersectionTypeAnnotation",
			types: types$1
		};
		const defs = NODE_FIELDS.IntersectionTypeAnnotation;
		validate(defs.types, node, "types", types$1, 1);
		return node;
	}
	function mixedTypeAnnotation() {
		return { type: "MixedTypeAnnotation" };
	}
	function emptyTypeAnnotation() {
		return { type: "EmptyTypeAnnotation" };
	}
	function nullableTypeAnnotation(typeAnnotation$1) {
		const node = {
			type: "NullableTypeAnnotation",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.NullableTypeAnnotation;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function numberLiteralTypeAnnotation(value) {
		const node = {
			type: "NumberLiteralTypeAnnotation",
			value
		};
		const defs = NODE_FIELDS.NumberLiteralTypeAnnotation;
		validate(defs.value, node, "value", value);
		return node;
	}
	function numberTypeAnnotation() {
		return { type: "NumberTypeAnnotation" };
	}
	function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
		const node = {
			type: "ObjectTypeAnnotation",
			properties,
			indexers,
			callProperties,
			internalSlots,
			exact
		};
		const defs = NODE_FIELDS.ObjectTypeAnnotation;
		validate(defs.properties, node, "properties", properties, 1);
		validate(defs.indexers, node, "indexers", indexers, 1);
		validate(defs.callProperties, node, "callProperties", callProperties, 1);
		validate(defs.internalSlots, node, "internalSlots", internalSlots, 1);
		validate(defs.exact, node, "exact", exact);
		return node;
	}
	function objectTypeInternalSlot(id, value, optional, _static, method) {
		const node = {
			type: "ObjectTypeInternalSlot",
			id,
			value,
			optional,
			static: _static,
			method
		};
		const defs = NODE_FIELDS.ObjectTypeInternalSlot;
		validate(defs.id, node, "id", id, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.optional, node, "optional", optional);
		validate(defs.static, node, "static", _static);
		validate(defs.method, node, "method", method);
		return node;
	}
	function objectTypeCallProperty(value) {
		const node = {
			type: "ObjectTypeCallProperty",
			value,
			static: null
		};
		const defs = NODE_FIELDS.ObjectTypeCallProperty;
		validate(defs.value, node, "value", value, 1);
		return node;
	}
	function objectTypeIndexer(id = null, key, value, variance$1 = null) {
		const node = {
			type: "ObjectTypeIndexer",
			id,
			key,
			value,
			variance: variance$1,
			static: null
		};
		const defs = NODE_FIELDS.ObjectTypeIndexer;
		validate(defs.id, node, "id", id, 1);
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.variance, node, "variance", variance$1, 1);
		return node;
	}
	function objectTypeProperty(key, value, variance$1 = null) {
		const node = {
			type: "ObjectTypeProperty",
			key,
			value,
			variance: variance$1,
			kind: null,
			method: null,
			optional: null,
			proto: null,
			static: null
		};
		const defs = NODE_FIELDS.ObjectTypeProperty;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		validate(defs.variance, node, "variance", variance$1, 1);
		return node;
	}
	function objectTypeSpreadProperty(argument) {
		const node = {
			type: "ObjectTypeSpreadProperty",
			argument
		};
		const defs = NODE_FIELDS.ObjectTypeSpreadProperty;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function opaqueType(id, typeParameters = null, supertype = null, impltype) {
		const node = {
			type: "OpaqueType",
			id,
			typeParameters,
			supertype,
			impltype
		};
		const defs = NODE_FIELDS.OpaqueType;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.supertype, node, "supertype", supertype, 1);
		validate(defs.impltype, node, "impltype", impltype, 1);
		return node;
	}
	function qualifiedTypeIdentifier(id, qualification) {
		const node = {
			type: "QualifiedTypeIdentifier",
			id,
			qualification
		};
		const defs = NODE_FIELDS.QualifiedTypeIdentifier;
		validate(defs.id, node, "id", id, 1);
		validate(defs.qualification, node, "qualification", qualification, 1);
		return node;
	}
	function stringLiteralTypeAnnotation(value) {
		const node = {
			type: "StringLiteralTypeAnnotation",
			value
		};
		const defs = NODE_FIELDS.StringLiteralTypeAnnotation;
		validate(defs.value, node, "value", value);
		return node;
	}
	function stringTypeAnnotation() {
		return { type: "StringTypeAnnotation" };
	}
	function symbolTypeAnnotation() {
		return { type: "SymbolTypeAnnotation" };
	}
	function thisTypeAnnotation() {
		return { type: "ThisTypeAnnotation" };
	}
	function tupleTypeAnnotation(types$1) {
		const node = {
			type: "TupleTypeAnnotation",
			types: types$1
		};
		const defs = NODE_FIELDS.TupleTypeAnnotation;
		validate(defs.types, node, "types", types$1, 1);
		return node;
	}
	function typeofTypeAnnotation(argument) {
		const node = {
			type: "TypeofTypeAnnotation",
			argument
		};
		const defs = NODE_FIELDS.TypeofTypeAnnotation;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function typeAlias(id, typeParameters = null, right) {
		const node = {
			type: "TypeAlias",
			id,
			typeParameters,
			right
		};
		const defs = NODE_FIELDS.TypeAlias;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function typeAnnotation(typeAnnotation$1) {
		const node = {
			type: "TypeAnnotation",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TypeAnnotation;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function typeCastExpression(expression, typeAnnotation$1) {
		const node = {
			type: "TypeCastExpression",
			expression,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TypeCastExpression;
		validate(defs.expression, node, "expression", expression, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function typeParameter(bound = null, _default$6 = null, variance$1 = null) {
		const node = {
			type: "TypeParameter",
			bound,
			default: _default$6,
			variance: variance$1,
			name: null
		};
		const defs = NODE_FIELDS.TypeParameter;
		validate(defs.bound, node, "bound", bound, 1);
		validate(defs.default, node, "default", _default$6, 1);
		validate(defs.variance, node, "variance", variance$1, 1);
		return node;
	}
	function typeParameterDeclaration(params) {
		const node = {
			type: "TypeParameterDeclaration",
			params
		};
		const defs = NODE_FIELDS.TypeParameterDeclaration;
		validate(defs.params, node, "params", params, 1);
		return node;
	}
	function typeParameterInstantiation(params) {
		const node = {
			type: "TypeParameterInstantiation",
			params
		};
		const defs = NODE_FIELDS.TypeParameterInstantiation;
		validate(defs.params, node, "params", params, 1);
		return node;
	}
	function unionTypeAnnotation(types$1) {
		const node = {
			type: "UnionTypeAnnotation",
			types: types$1
		};
		const defs = NODE_FIELDS.UnionTypeAnnotation;
		validate(defs.types, node, "types", types$1, 1);
		return node;
	}
	function variance(kind) {
		const node = {
			type: "Variance",
			kind
		};
		const defs = NODE_FIELDS.Variance;
		validate(defs.kind, node, "kind", kind);
		return node;
	}
	function voidTypeAnnotation() {
		return { type: "VoidTypeAnnotation" };
	}
	function enumDeclaration(id, body) {
		const node = {
			type: "EnumDeclaration",
			id,
			body
		};
		const defs = NODE_FIELDS.EnumDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function enumBooleanBody(members) {
		const node = {
			type: "EnumBooleanBody",
			members,
			explicitType: null,
			hasUnknownMembers: null
		};
		const defs = NODE_FIELDS.EnumBooleanBody;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function enumNumberBody(members) {
		const node = {
			type: "EnumNumberBody",
			members,
			explicitType: null,
			hasUnknownMembers: null
		};
		const defs = NODE_FIELDS.EnumNumberBody;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function enumStringBody(members) {
		const node = {
			type: "EnumStringBody",
			members,
			explicitType: null,
			hasUnknownMembers: null
		};
		const defs = NODE_FIELDS.EnumStringBody;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function enumSymbolBody(members) {
		const node = {
			type: "EnumSymbolBody",
			members,
			hasUnknownMembers: null
		};
		const defs = NODE_FIELDS.EnumSymbolBody;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function enumBooleanMember(id) {
		const node = {
			type: "EnumBooleanMember",
			id,
			init: null
		};
		const defs = NODE_FIELDS.EnumBooleanMember;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function enumNumberMember(id, init) {
		const node = {
			type: "EnumNumberMember",
			id,
			init
		};
		const defs = NODE_FIELDS.EnumNumberMember;
		validate(defs.id, node, "id", id, 1);
		validate(defs.init, node, "init", init, 1);
		return node;
	}
	function enumStringMember(id, init) {
		const node = {
			type: "EnumStringMember",
			id,
			init
		};
		const defs = NODE_FIELDS.EnumStringMember;
		validate(defs.id, node, "id", id, 1);
		validate(defs.init, node, "init", init, 1);
		return node;
	}
	function enumDefaultedMember(id) {
		const node = {
			type: "EnumDefaultedMember",
			id
		};
		const defs = NODE_FIELDS.EnumDefaultedMember;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function indexedAccessType(objectType, indexType) {
		const node = {
			type: "IndexedAccessType",
			objectType,
			indexType
		};
		const defs = NODE_FIELDS.IndexedAccessType;
		validate(defs.objectType, node, "objectType", objectType, 1);
		validate(defs.indexType, node, "indexType", indexType, 1);
		return node;
	}
	function optionalIndexedAccessType(objectType, indexType) {
		const node = {
			type: "OptionalIndexedAccessType",
			objectType,
			indexType,
			optional: null
		};
		const defs = NODE_FIELDS.OptionalIndexedAccessType;
		validate(defs.objectType, node, "objectType", objectType, 1);
		validate(defs.indexType, node, "indexType", indexType, 1);
		return node;
	}
	function jsxAttribute(name, value = null) {
		const node = {
			type: "JSXAttribute",
			name,
			value
		};
		const defs = NODE_FIELDS.JSXAttribute;
		validate(defs.name, node, "name", name, 1);
		validate(defs.value, node, "value", value, 1);
		return node;
	}
	function jsxClosingElement(name) {
		const node = {
			type: "JSXClosingElement",
			name
		};
		const defs = NODE_FIELDS.JSXClosingElement;
		validate(defs.name, node, "name", name, 1);
		return node;
	}
	function jsxElement(openingElement, closingElement = null, children, selfClosing = null) {
		const node = {
			type: "JSXElement",
			openingElement,
			closingElement,
			children,
			selfClosing
		};
		const defs = NODE_FIELDS.JSXElement;
		validate(defs.openingElement, node, "openingElement", openingElement, 1);
		validate(defs.closingElement, node, "closingElement", closingElement, 1);
		validate(defs.children, node, "children", children, 1);
		validate(defs.selfClosing, node, "selfClosing", selfClosing);
		return node;
	}
	function jsxEmptyExpression() {
		return { type: "JSXEmptyExpression" };
	}
	function jsxExpressionContainer(expression) {
		const node = {
			type: "JSXExpressionContainer",
			expression
		};
		const defs = NODE_FIELDS.JSXExpressionContainer;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function jsxSpreadChild(expression) {
		const node = {
			type: "JSXSpreadChild",
			expression
		};
		const defs = NODE_FIELDS.JSXSpreadChild;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function jsxIdentifier(name) {
		const node = {
			type: "JSXIdentifier",
			name
		};
		const defs = NODE_FIELDS.JSXIdentifier;
		validate(defs.name, node, "name", name);
		return node;
	}
	function jsxMemberExpression(object, property) {
		const node = {
			type: "JSXMemberExpression",
			object,
			property
		};
		const defs = NODE_FIELDS.JSXMemberExpression;
		validate(defs.object, node, "object", object, 1);
		validate(defs.property, node, "property", property, 1);
		return node;
	}
	function jsxNamespacedName(namespace, name) {
		const node = {
			type: "JSXNamespacedName",
			namespace,
			name
		};
		const defs = NODE_FIELDS.JSXNamespacedName;
		validate(defs.namespace, node, "namespace", namespace, 1);
		validate(defs.name, node, "name", name, 1);
		return node;
	}
	function jsxOpeningElement(name, attributes, selfClosing = false) {
		const node = {
			type: "JSXOpeningElement",
			name,
			attributes,
			selfClosing
		};
		const defs = NODE_FIELDS.JSXOpeningElement;
		validate(defs.name, node, "name", name, 1);
		validate(defs.attributes, node, "attributes", attributes, 1);
		validate(defs.selfClosing, node, "selfClosing", selfClosing);
		return node;
	}
	function jsxSpreadAttribute(argument) {
		const node = {
			type: "JSXSpreadAttribute",
			argument
		};
		const defs = NODE_FIELDS.JSXSpreadAttribute;
		validate(defs.argument, node, "argument", argument, 1);
		return node;
	}
	function jsxText(value) {
		const node = {
			type: "JSXText",
			value
		};
		const defs = NODE_FIELDS.JSXText;
		validate(defs.value, node, "value", value);
		return node;
	}
	function jsxFragment(openingFragment, closingFragment, children) {
		const node = {
			type: "JSXFragment",
			openingFragment,
			closingFragment,
			children
		};
		const defs = NODE_FIELDS.JSXFragment;
		validate(defs.openingFragment, node, "openingFragment", openingFragment, 1);
		validate(defs.closingFragment, node, "closingFragment", closingFragment, 1);
		validate(defs.children, node, "children", children, 1);
		return node;
	}
	function jsxOpeningFragment() {
		return { type: "JSXOpeningFragment" };
	}
	function jsxClosingFragment() {
		return { type: "JSXClosingFragment" };
	}
	function noop() {
		return { type: "Noop" };
	}
	function placeholder(expectedNode, name) {
		const node = {
			type: "Placeholder",
			expectedNode,
			name
		};
		const defs = NODE_FIELDS.Placeholder;
		validate(defs.expectedNode, node, "expectedNode", expectedNode);
		validate(defs.name, node, "name", name, 1);
		return node;
	}
	function v8IntrinsicIdentifier(name) {
		const node = {
			type: "V8IntrinsicIdentifier",
			name
		};
		const defs = NODE_FIELDS.V8IntrinsicIdentifier;
		validate(defs.name, node, "name", name);
		return node;
	}
	function argumentPlaceholder() {
		return { type: "ArgumentPlaceholder" };
	}
	function bindExpression(object, callee) {
		const node = {
			type: "BindExpression",
			object,
			callee
		};
		const defs = NODE_FIELDS.BindExpression;
		validate(defs.object, node, "object", object, 1);
		validate(defs.callee, node, "callee", callee, 1);
		return node;
	}
	function importAttribute(key, value) {
		const node = {
			type: "ImportAttribute",
			key,
			value
		};
		const defs = NODE_FIELDS.ImportAttribute;
		validate(defs.key, node, "key", key, 1);
		validate(defs.value, node, "value", value, 1);
		return node;
	}
	function decorator(expression) {
		const node = {
			type: "Decorator",
			expression
		};
		const defs = NODE_FIELDS.Decorator;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function doExpression(body, async$2 = false) {
		const node = {
			type: "DoExpression",
			body,
			async: async$2
		};
		const defs = NODE_FIELDS.DoExpression;
		validate(defs.body, node, "body", body, 1);
		validate(defs.async, node, "async", async$2);
		return node;
	}
	function exportDefaultSpecifier(exported) {
		const node = {
			type: "ExportDefaultSpecifier",
			exported
		};
		const defs = NODE_FIELDS.ExportDefaultSpecifier;
		validate(defs.exported, node, "exported", exported, 1);
		return node;
	}
	function recordExpression(properties) {
		const node = {
			type: "RecordExpression",
			properties
		};
		const defs = NODE_FIELDS.RecordExpression;
		validate(defs.properties, node, "properties", properties, 1);
		return node;
	}
	function tupleExpression(elements = []) {
		const node = {
			type: "TupleExpression",
			elements
		};
		const defs = NODE_FIELDS.TupleExpression;
		validate(defs.elements, node, "elements", elements, 1);
		return node;
	}
	function decimalLiteral(value) {
		const node = {
			type: "DecimalLiteral",
			value
		};
		const defs = NODE_FIELDS.DecimalLiteral;
		validate(defs.value, node, "value", value);
		return node;
	}
	function moduleExpression(body) {
		const node = {
			type: "ModuleExpression",
			body
		};
		const defs = NODE_FIELDS.ModuleExpression;
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function topicReference() {
		return { type: "TopicReference" };
	}
	function pipelineTopicExpression(expression) {
		const node = {
			type: "PipelineTopicExpression",
			expression
		};
		const defs = NODE_FIELDS.PipelineTopicExpression;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function pipelineBareFunction(callee) {
		const node = {
			type: "PipelineBareFunction",
			callee
		};
		const defs = NODE_FIELDS.PipelineBareFunction;
		validate(defs.callee, node, "callee", callee, 1);
		return node;
	}
	function pipelinePrimaryTopicReference() {
		return { type: "PipelinePrimaryTopicReference" };
	}
	function tsParameterProperty(parameter) {
		const node = {
			type: "TSParameterProperty",
			parameter
		};
		const defs = NODE_FIELDS.TSParameterProperty;
		validate(defs.parameter, node, "parameter", parameter, 1);
		return node;
	}
	function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
		const node = {
			type: "TSDeclareFunction",
			id,
			typeParameters,
			params,
			returnType
		};
		const defs = NODE_FIELDS.TSDeclareFunction;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.returnType, node, "returnType", returnType, 1);
		return node;
	}
	function tsDeclareMethod(decorators = null, key, typeParameters = null, params, returnType = null) {
		const node = {
			type: "TSDeclareMethod",
			decorators,
			key,
			typeParameters,
			params,
			returnType
		};
		const defs = NODE_FIELDS.TSDeclareMethod;
		validate(defs.decorators, node, "decorators", decorators, 1);
		validate(defs.key, node, "key", key, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.params, node, "params", params, 1);
		validate(defs.returnType, node, "returnType", returnType, 1);
		return node;
	}
	function tsQualifiedName(left, right) {
		const node = {
			type: "TSQualifiedName",
			left,
			right
		};
		const defs = NODE_FIELDS.TSQualifiedName;
		validate(defs.left, node, "left", left, 1);
		validate(defs.right, node, "right", right, 1);
		return node;
	}
	function tsCallSignatureDeclaration(typeParameters = null, parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSCallSignatureDeclaration",
			typeParameters,
			parameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSCallSignatureDeclaration;
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsConstructSignatureDeclaration(typeParameters = null, parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSConstructSignatureDeclaration",
			typeParameters,
			parameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSConstructSignatureDeclaration;
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsPropertySignature(key, typeAnnotation$1 = null) {
		const node = {
			type: "TSPropertySignature",
			key,
			typeAnnotation: typeAnnotation$1,
			kind: null
		};
		const defs = NODE_FIELDS.TSPropertySignature;
		validate(defs.key, node, "key", key, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsMethodSignature(key, typeParameters = null, parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSMethodSignature",
			key,
			typeParameters,
			parameters,
			typeAnnotation: typeAnnotation$1,
			kind: null
		};
		const defs = NODE_FIELDS.TSMethodSignature;
		validate(defs.key, node, "key", key, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsIndexSignature(parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSIndexSignature",
			parameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSIndexSignature;
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsAnyKeyword() {
		return { type: "TSAnyKeyword" };
	}
	function tsBooleanKeyword() {
		return { type: "TSBooleanKeyword" };
	}
	function tsBigIntKeyword() {
		return { type: "TSBigIntKeyword" };
	}
	function tsIntrinsicKeyword() {
		return { type: "TSIntrinsicKeyword" };
	}
	function tsNeverKeyword() {
		return { type: "TSNeverKeyword" };
	}
	function tsNullKeyword() {
		return { type: "TSNullKeyword" };
	}
	function tsNumberKeyword() {
		return { type: "TSNumberKeyword" };
	}
	function tsObjectKeyword() {
		return { type: "TSObjectKeyword" };
	}
	function tsStringKeyword() {
		return { type: "TSStringKeyword" };
	}
	function tsSymbolKeyword() {
		return { type: "TSSymbolKeyword" };
	}
	function tsUndefinedKeyword() {
		return { type: "TSUndefinedKeyword" };
	}
	function tsUnknownKeyword() {
		return { type: "TSUnknownKeyword" };
	}
	function tsVoidKeyword() {
		return { type: "TSVoidKeyword" };
	}
	function tsThisType() {
		return { type: "TSThisType" };
	}
	function tsFunctionType(typeParameters = null, parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSFunctionType",
			typeParameters,
			parameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSFunctionType;
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsConstructorType(typeParameters = null, parameters, typeAnnotation$1 = null) {
		const node = {
			type: "TSConstructorType",
			typeParameters,
			parameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSConstructorType;
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.parameters, node, "parameters", parameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsTypeReference(typeName, typeParameters = null) {
		const node = {
			type: "TSTypeReference",
			typeName,
			typeParameters
		};
		const defs = NODE_FIELDS.TSTypeReference;
		validate(defs.typeName, node, "typeName", typeName, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function tsTypePredicate(parameterName, typeAnnotation$1 = null, asserts = null) {
		const node = {
			type: "TSTypePredicate",
			parameterName,
			typeAnnotation: typeAnnotation$1,
			asserts
		};
		const defs = NODE_FIELDS.TSTypePredicate;
		validate(defs.parameterName, node, "parameterName", parameterName, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		validate(defs.asserts, node, "asserts", asserts);
		return node;
	}
	function tsTypeQuery(exprName, typeParameters = null) {
		const node = {
			type: "TSTypeQuery",
			exprName,
			typeParameters
		};
		const defs = NODE_FIELDS.TSTypeQuery;
		validate(defs.exprName, node, "exprName", exprName, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function tsTypeLiteral(members) {
		const node = {
			type: "TSTypeLiteral",
			members
		};
		const defs = NODE_FIELDS.TSTypeLiteral;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function tsArrayType(elementType) {
		const node = {
			type: "TSArrayType",
			elementType
		};
		const defs = NODE_FIELDS.TSArrayType;
		validate(defs.elementType, node, "elementType", elementType, 1);
		return node;
	}
	function tsTupleType(elementTypes) {
		const node = {
			type: "TSTupleType",
			elementTypes
		};
		const defs = NODE_FIELDS.TSTupleType;
		validate(defs.elementTypes, node, "elementTypes", elementTypes, 1);
		return node;
	}
	function tsOptionalType(typeAnnotation$1) {
		const node = {
			type: "TSOptionalType",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSOptionalType;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsRestType(typeAnnotation$1) {
		const node = {
			type: "TSRestType",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSRestType;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsNamedTupleMember(label, elementType, optional = false) {
		const node = {
			type: "TSNamedTupleMember",
			label,
			elementType,
			optional
		};
		const defs = NODE_FIELDS.TSNamedTupleMember;
		validate(defs.label, node, "label", label, 1);
		validate(defs.elementType, node, "elementType", elementType, 1);
		validate(defs.optional, node, "optional", optional);
		return node;
	}
	function tsUnionType(types$1) {
		const node = {
			type: "TSUnionType",
			types: types$1
		};
		const defs = NODE_FIELDS.TSUnionType;
		validate(defs.types, node, "types", types$1, 1);
		return node;
	}
	function tsIntersectionType(types$1) {
		const node = {
			type: "TSIntersectionType",
			types: types$1
		};
		const defs = NODE_FIELDS.TSIntersectionType;
		validate(defs.types, node, "types", types$1, 1);
		return node;
	}
	function tsConditionalType(checkType, extendsType, trueType, falseType) {
		const node = {
			type: "TSConditionalType",
			checkType,
			extendsType,
			trueType,
			falseType
		};
		const defs = NODE_FIELDS.TSConditionalType;
		validate(defs.checkType, node, "checkType", checkType, 1);
		validate(defs.extendsType, node, "extendsType", extendsType, 1);
		validate(defs.trueType, node, "trueType", trueType, 1);
		validate(defs.falseType, node, "falseType", falseType, 1);
		return node;
	}
	function tsInferType(typeParameter$1) {
		const node = {
			type: "TSInferType",
			typeParameter: typeParameter$1
		};
		const defs = NODE_FIELDS.TSInferType;
		validate(defs.typeParameter, node, "typeParameter", typeParameter$1, 1);
		return node;
	}
	function tsParenthesizedType(typeAnnotation$1) {
		const node = {
			type: "TSParenthesizedType",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSParenthesizedType;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsTypeOperator(typeAnnotation$1) {
		const node = {
			type: "TSTypeOperator",
			typeAnnotation: typeAnnotation$1,
			operator: null
		};
		const defs = NODE_FIELDS.TSTypeOperator;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsIndexedAccessType(objectType, indexType) {
		const node = {
			type: "TSIndexedAccessType",
			objectType,
			indexType
		};
		const defs = NODE_FIELDS.TSIndexedAccessType;
		validate(defs.objectType, node, "objectType", objectType, 1);
		validate(defs.indexType, node, "indexType", indexType, 1);
		return node;
	}
	function tsMappedType(typeParameter$1, typeAnnotation$1 = null, nameType = null) {
		const node = {
			type: "TSMappedType",
			typeParameter: typeParameter$1,
			typeAnnotation: typeAnnotation$1,
			nameType
		};
		const defs = NODE_FIELDS.TSMappedType;
		validate(defs.typeParameter, node, "typeParameter", typeParameter$1, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		validate(defs.nameType, node, "nameType", nameType, 1);
		return node;
	}
	function tsLiteralType(literal) {
		const node = {
			type: "TSLiteralType",
			literal
		};
		const defs = NODE_FIELDS.TSLiteralType;
		validate(defs.literal, node, "literal", literal, 1);
		return node;
	}
	function tsExpressionWithTypeArguments(expression, typeParameters = null) {
		const node = {
			type: "TSExpressionWithTypeArguments",
			expression,
			typeParameters
		};
		const defs = NODE_FIELDS.TSExpressionWithTypeArguments;
		validate(defs.expression, node, "expression", expression, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
		const node = {
			type: "TSInterfaceDeclaration",
			id,
			typeParameters,
			extends: _extends,
			body
		};
		const defs = NODE_FIELDS.TSInterfaceDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.extends, node, "extends", _extends, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function tsInterfaceBody(body) {
		const node = {
			type: "TSInterfaceBody",
			body
		};
		const defs = NODE_FIELDS.TSInterfaceBody;
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation$1) {
		const node = {
			type: "TSTypeAliasDeclaration",
			id,
			typeParameters,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSTypeAliasDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsInstantiationExpression(expression, typeParameters = null) {
		const node = {
			type: "TSInstantiationExpression",
			expression,
			typeParameters
		};
		const defs = NODE_FIELDS.TSInstantiationExpression;
		validate(defs.expression, node, "expression", expression, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function tsAsExpression(expression, typeAnnotation$1) {
		const node = {
			type: "TSAsExpression",
			expression,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSAsExpression;
		validate(defs.expression, node, "expression", expression, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsSatisfiesExpression(expression, typeAnnotation$1) {
		const node = {
			type: "TSSatisfiesExpression",
			expression,
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSSatisfiesExpression;
		validate(defs.expression, node, "expression", expression, 1);
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsTypeAssertion(typeAnnotation$1, expression) {
		const node = {
			type: "TSTypeAssertion",
			typeAnnotation: typeAnnotation$1,
			expression
		};
		const defs = NODE_FIELDS.TSTypeAssertion;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function tsEnumBody(members) {
		const node = {
			type: "TSEnumBody",
			members
		};
		const defs = NODE_FIELDS.TSEnumBody;
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function tsEnumDeclaration(id, members) {
		const node = {
			type: "TSEnumDeclaration",
			id,
			members
		};
		const defs = NODE_FIELDS.TSEnumDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.members, node, "members", members, 1);
		return node;
	}
	function tsEnumMember(id, initializer = null) {
		const node = {
			type: "TSEnumMember",
			id,
			initializer
		};
		const defs = NODE_FIELDS.TSEnumMember;
		validate(defs.id, node, "id", id, 1);
		validate(defs.initializer, node, "initializer", initializer, 1);
		return node;
	}
	function tsModuleDeclaration(id, body) {
		const node = {
			type: "TSModuleDeclaration",
			id,
			body,
			kind: null
		};
		const defs = NODE_FIELDS.TSModuleDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function tsModuleBlock(body) {
		const node = {
			type: "TSModuleBlock",
			body
		};
		const defs = NODE_FIELDS.TSModuleBlock;
		validate(defs.body, node, "body", body, 1);
		return node;
	}
	function tsImportType(argument, qualifier = null, typeParameters = null) {
		const node = {
			type: "TSImportType",
			argument,
			qualifier,
			typeParameters
		};
		const defs = NODE_FIELDS.TSImportType;
		validate(defs.argument, node, "argument", argument, 1);
		validate(defs.qualifier, node, "qualifier", qualifier, 1);
		validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
		return node;
	}
	function tsImportEqualsDeclaration(id, moduleReference) {
		const node = {
			type: "TSImportEqualsDeclaration",
			id,
			moduleReference,
			isExport: null
		};
		const defs = NODE_FIELDS.TSImportEqualsDeclaration;
		validate(defs.id, node, "id", id, 1);
		validate(defs.moduleReference, node, "moduleReference", moduleReference, 1);
		return node;
	}
	function tsExternalModuleReference(expression) {
		const node = {
			type: "TSExternalModuleReference",
			expression
		};
		const defs = NODE_FIELDS.TSExternalModuleReference;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function tsNonNullExpression(expression) {
		const node = {
			type: "TSNonNullExpression",
			expression
		};
		const defs = NODE_FIELDS.TSNonNullExpression;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function tsExportAssignment(expression) {
		const node = {
			type: "TSExportAssignment",
			expression
		};
		const defs = NODE_FIELDS.TSExportAssignment;
		validate(defs.expression, node, "expression", expression, 1);
		return node;
	}
	function tsNamespaceExportDeclaration(id) {
		const node = {
			type: "TSNamespaceExportDeclaration",
			id
		};
		const defs = NODE_FIELDS.TSNamespaceExportDeclaration;
		validate(defs.id, node, "id", id, 1);
		return node;
	}
	function tsTypeAnnotation(typeAnnotation$1) {
		const node = {
			type: "TSTypeAnnotation",
			typeAnnotation: typeAnnotation$1
		};
		const defs = NODE_FIELDS.TSTypeAnnotation;
		validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation$1, 1);
		return node;
	}
	function tsTypeParameterInstantiation(params) {
		const node = {
			type: "TSTypeParameterInstantiation",
			params
		};
		const defs = NODE_FIELDS.TSTypeParameterInstantiation;
		validate(defs.params, node, "params", params, 1);
		return node;
	}
	function tsTypeParameterDeclaration(params) {
		const node = {
			type: "TSTypeParameterDeclaration",
			params
		};
		const defs = NODE_FIELDS.TSTypeParameterDeclaration;
		validate(defs.params, node, "params", params, 1);
		return node;
	}
	function tsTypeParameter(constraint = null, _default$6 = null, name) {
		const node = {
			type: "TSTypeParameter",
			constraint,
			default: _default$6,
			name
		};
		const defs = NODE_FIELDS.TSTypeParameter;
		validate(defs.constraint, node, "constraint", constraint, 1);
		validate(defs.default, node, "default", _default$6, 1);
		validate(defs.name, node, "name", name);
		return node;
	}
	function NumberLiteral(value) {
		(0, _deprecationWarning$2.default)("NumberLiteral", "NumericLiteral", "The node type ");
		return numericLiteral(value);
	}
	function RegexLiteral(pattern$1, flags = "") {
		(0, _deprecationWarning$2.default)("RegexLiteral", "RegExpLiteral", "The node type ");
		return regExpLiteral(pattern$1, flags);
	}
	function RestProperty(argument) {
		(0, _deprecationWarning$2.default)("RestProperty", "RestElement", "The node type ");
		return restElement(argument);
	}
	function SpreadProperty(argument) {
		(0, _deprecationWarning$2.default)("SpreadProperty", "SpreadElement", "The node type ");
		return spreadElement(argument);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/react/cleanJSXElementLiteralChild.js
var require_cleanJSXElementLiteralChild = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/react/cleanJSXElementLiteralChild.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = cleanJSXElementLiteralChild;
	var _index$35 = require_generated$2();
	var _index2$10 = require_lib();
	function cleanJSXElementLiteralChild(child, args) {
		const lines = child.value.split(/\r\n|\n|\r/);
		let lastNonEmptyLine = 0;
		for (let i = 0; i < lines.length; i++) if (/[^ \t]/.exec(lines[i])) lastNonEmptyLine = i;
		let str = "";
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const isFirstLine = i === 0;
			const isLastLine = i === lines.length - 1;
			const isLastNonEmptyLine = i === lastNonEmptyLine;
			let trimmedLine = line.replace(/\t/g, " ");
			if (!isFirstLine) trimmedLine = trimmedLine.replace(/^ +/, "");
			if (!isLastLine) trimmedLine = trimmedLine.replace(/ +$/, "");
			if (trimmedLine) {
				if (!isLastNonEmptyLine) trimmedLine += " ";
				str += trimmedLine;
			}
		}
		if (str) args.push((0, _index2$10.inherits)((0, _index$35.stringLiteral)(str), child));
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/react/buildChildren.js
var require_buildChildren = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/react/buildChildren.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = buildChildren;
	var _index$34 = require_generated$3();
	var _cleanJSXElementLiteralChild = require_cleanJSXElementLiteralChild();
	function buildChildren(node) {
		const elements = [];
		for (let i = 0; i < node.children.length; i++) {
			let child = node.children[i];
			if ((0, _index$34.isJSXText)(child)) {
				(0, _cleanJSXElementLiteralChild.default)(child, elements);
				continue;
			}
			if ((0, _index$34.isJSXExpressionContainer)(child)) child = child.expression;
			if ((0, _index$34.isJSXEmptyExpression)(child)) continue;
			elements.push(child);
		}
		return elements;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isNode.js
var require_isNode = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isNode.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isNode;
	var _index$33 = require_definitions();
	function isNode(node) {
		return !!(node && _index$33.VISITOR_KEYS[node.type]);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/asserts/assertNode.js
var require_assertNode = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/asserts/assertNode.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = assertNode;
	var _isNode$1 = require_isNode();
	function assertNode(node) {
		if (!(0, _isNode$1.default)(node)) {
			var _node$type;
			const type = (_node$type = node == null ? void 0 : node.type) != null ? _node$type : JSON.stringify(node);
			throw new TypeError(`Not a valid node of type "${type}"`);
		}
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/asserts/generated/index.js
var require_generated$1 = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/asserts/generated/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assertAccessor = assertAccessor;
	exports.assertAnyTypeAnnotation = assertAnyTypeAnnotation;
	exports.assertArgumentPlaceholder = assertArgumentPlaceholder;
	exports.assertArrayExpression = assertArrayExpression;
	exports.assertArrayPattern = assertArrayPattern;
	exports.assertArrayTypeAnnotation = assertArrayTypeAnnotation;
	exports.assertArrowFunctionExpression = assertArrowFunctionExpression;
	exports.assertAssignmentExpression = assertAssignmentExpression;
	exports.assertAssignmentPattern = assertAssignmentPattern;
	exports.assertAwaitExpression = assertAwaitExpression;
	exports.assertBigIntLiteral = assertBigIntLiteral;
	exports.assertBinary = assertBinary;
	exports.assertBinaryExpression = assertBinaryExpression;
	exports.assertBindExpression = assertBindExpression;
	exports.assertBlock = assertBlock;
	exports.assertBlockParent = assertBlockParent;
	exports.assertBlockStatement = assertBlockStatement;
	exports.assertBooleanLiteral = assertBooleanLiteral;
	exports.assertBooleanLiteralTypeAnnotation = assertBooleanLiteralTypeAnnotation;
	exports.assertBooleanTypeAnnotation = assertBooleanTypeAnnotation;
	exports.assertBreakStatement = assertBreakStatement;
	exports.assertCallExpression = assertCallExpression;
	exports.assertCatchClause = assertCatchClause;
	exports.assertClass = assertClass;
	exports.assertClassAccessorProperty = assertClassAccessorProperty;
	exports.assertClassBody = assertClassBody;
	exports.assertClassDeclaration = assertClassDeclaration;
	exports.assertClassExpression = assertClassExpression;
	exports.assertClassImplements = assertClassImplements;
	exports.assertClassMethod = assertClassMethod;
	exports.assertClassPrivateMethod = assertClassPrivateMethod;
	exports.assertClassPrivateProperty = assertClassPrivateProperty;
	exports.assertClassProperty = assertClassProperty;
	exports.assertCompletionStatement = assertCompletionStatement;
	exports.assertConditional = assertConditional;
	exports.assertConditionalExpression = assertConditionalExpression;
	exports.assertContinueStatement = assertContinueStatement;
	exports.assertDebuggerStatement = assertDebuggerStatement;
	exports.assertDecimalLiteral = assertDecimalLiteral;
	exports.assertDeclaration = assertDeclaration;
	exports.assertDeclareClass = assertDeclareClass;
	exports.assertDeclareExportAllDeclaration = assertDeclareExportAllDeclaration;
	exports.assertDeclareExportDeclaration = assertDeclareExportDeclaration;
	exports.assertDeclareFunction = assertDeclareFunction;
	exports.assertDeclareInterface = assertDeclareInterface;
	exports.assertDeclareModule = assertDeclareModule;
	exports.assertDeclareModuleExports = assertDeclareModuleExports;
	exports.assertDeclareOpaqueType = assertDeclareOpaqueType;
	exports.assertDeclareTypeAlias = assertDeclareTypeAlias;
	exports.assertDeclareVariable = assertDeclareVariable;
	exports.assertDeclaredPredicate = assertDeclaredPredicate;
	exports.assertDecorator = assertDecorator;
	exports.assertDirective = assertDirective;
	exports.assertDirectiveLiteral = assertDirectiveLiteral;
	exports.assertDoExpression = assertDoExpression;
	exports.assertDoWhileStatement = assertDoWhileStatement;
	exports.assertEmptyStatement = assertEmptyStatement;
	exports.assertEmptyTypeAnnotation = assertEmptyTypeAnnotation;
	exports.assertEnumBody = assertEnumBody;
	exports.assertEnumBooleanBody = assertEnumBooleanBody;
	exports.assertEnumBooleanMember = assertEnumBooleanMember;
	exports.assertEnumDeclaration = assertEnumDeclaration;
	exports.assertEnumDefaultedMember = assertEnumDefaultedMember;
	exports.assertEnumMember = assertEnumMember;
	exports.assertEnumNumberBody = assertEnumNumberBody;
	exports.assertEnumNumberMember = assertEnumNumberMember;
	exports.assertEnumStringBody = assertEnumStringBody;
	exports.assertEnumStringMember = assertEnumStringMember;
	exports.assertEnumSymbolBody = assertEnumSymbolBody;
	exports.assertExistsTypeAnnotation = assertExistsTypeAnnotation;
	exports.assertExportAllDeclaration = assertExportAllDeclaration;
	exports.assertExportDeclaration = assertExportDeclaration;
	exports.assertExportDefaultDeclaration = assertExportDefaultDeclaration;
	exports.assertExportDefaultSpecifier = assertExportDefaultSpecifier;
	exports.assertExportNamedDeclaration = assertExportNamedDeclaration;
	exports.assertExportNamespaceSpecifier = assertExportNamespaceSpecifier;
	exports.assertExportSpecifier = assertExportSpecifier;
	exports.assertExpression = assertExpression;
	exports.assertExpressionStatement = assertExpressionStatement;
	exports.assertExpressionWrapper = assertExpressionWrapper;
	exports.assertFile = assertFile;
	exports.assertFlow = assertFlow;
	exports.assertFlowBaseAnnotation = assertFlowBaseAnnotation;
	exports.assertFlowDeclaration = assertFlowDeclaration;
	exports.assertFlowPredicate = assertFlowPredicate;
	exports.assertFlowType = assertFlowType;
	exports.assertFor = assertFor;
	exports.assertForInStatement = assertForInStatement;
	exports.assertForOfStatement = assertForOfStatement;
	exports.assertForStatement = assertForStatement;
	exports.assertForXStatement = assertForXStatement;
	exports.assertFunction = assertFunction;
	exports.assertFunctionDeclaration = assertFunctionDeclaration;
	exports.assertFunctionExpression = assertFunctionExpression;
	exports.assertFunctionParent = assertFunctionParent;
	exports.assertFunctionTypeAnnotation = assertFunctionTypeAnnotation;
	exports.assertFunctionTypeParam = assertFunctionTypeParam;
	exports.assertGenericTypeAnnotation = assertGenericTypeAnnotation;
	exports.assertIdentifier = assertIdentifier;
	exports.assertIfStatement = assertIfStatement;
	exports.assertImmutable = assertImmutable;
	exports.assertImport = assertImport;
	exports.assertImportAttribute = assertImportAttribute;
	exports.assertImportDeclaration = assertImportDeclaration;
	exports.assertImportDefaultSpecifier = assertImportDefaultSpecifier;
	exports.assertImportExpression = assertImportExpression;
	exports.assertImportNamespaceSpecifier = assertImportNamespaceSpecifier;
	exports.assertImportOrExportDeclaration = assertImportOrExportDeclaration;
	exports.assertImportSpecifier = assertImportSpecifier;
	exports.assertIndexedAccessType = assertIndexedAccessType;
	exports.assertInferredPredicate = assertInferredPredicate;
	exports.assertInterfaceDeclaration = assertInterfaceDeclaration;
	exports.assertInterfaceExtends = assertInterfaceExtends;
	exports.assertInterfaceTypeAnnotation = assertInterfaceTypeAnnotation;
	exports.assertInterpreterDirective = assertInterpreterDirective;
	exports.assertIntersectionTypeAnnotation = assertIntersectionTypeAnnotation;
	exports.assertJSX = assertJSX;
	exports.assertJSXAttribute = assertJSXAttribute;
	exports.assertJSXClosingElement = assertJSXClosingElement;
	exports.assertJSXClosingFragment = assertJSXClosingFragment;
	exports.assertJSXElement = assertJSXElement;
	exports.assertJSXEmptyExpression = assertJSXEmptyExpression;
	exports.assertJSXExpressionContainer = assertJSXExpressionContainer;
	exports.assertJSXFragment = assertJSXFragment;
	exports.assertJSXIdentifier = assertJSXIdentifier;
	exports.assertJSXMemberExpression = assertJSXMemberExpression;
	exports.assertJSXNamespacedName = assertJSXNamespacedName;
	exports.assertJSXOpeningElement = assertJSXOpeningElement;
	exports.assertJSXOpeningFragment = assertJSXOpeningFragment;
	exports.assertJSXSpreadAttribute = assertJSXSpreadAttribute;
	exports.assertJSXSpreadChild = assertJSXSpreadChild;
	exports.assertJSXText = assertJSXText;
	exports.assertLVal = assertLVal;
	exports.assertLabeledStatement = assertLabeledStatement;
	exports.assertLiteral = assertLiteral;
	exports.assertLogicalExpression = assertLogicalExpression;
	exports.assertLoop = assertLoop;
	exports.assertMemberExpression = assertMemberExpression;
	exports.assertMetaProperty = assertMetaProperty;
	exports.assertMethod = assertMethod;
	exports.assertMiscellaneous = assertMiscellaneous;
	exports.assertMixedTypeAnnotation = assertMixedTypeAnnotation;
	exports.assertModuleDeclaration = assertModuleDeclaration;
	exports.assertModuleExpression = assertModuleExpression;
	exports.assertModuleSpecifier = assertModuleSpecifier;
	exports.assertNewExpression = assertNewExpression;
	exports.assertNoop = assertNoop;
	exports.assertNullLiteral = assertNullLiteral;
	exports.assertNullLiteralTypeAnnotation = assertNullLiteralTypeAnnotation;
	exports.assertNullableTypeAnnotation = assertNullableTypeAnnotation;
	exports.assertNumberLiteral = assertNumberLiteral;
	exports.assertNumberLiteralTypeAnnotation = assertNumberLiteralTypeAnnotation;
	exports.assertNumberTypeAnnotation = assertNumberTypeAnnotation;
	exports.assertNumericLiteral = assertNumericLiteral;
	exports.assertObjectExpression = assertObjectExpression;
	exports.assertObjectMember = assertObjectMember;
	exports.assertObjectMethod = assertObjectMethod;
	exports.assertObjectPattern = assertObjectPattern;
	exports.assertObjectProperty = assertObjectProperty;
	exports.assertObjectTypeAnnotation = assertObjectTypeAnnotation;
	exports.assertObjectTypeCallProperty = assertObjectTypeCallProperty;
	exports.assertObjectTypeIndexer = assertObjectTypeIndexer;
	exports.assertObjectTypeInternalSlot = assertObjectTypeInternalSlot;
	exports.assertObjectTypeProperty = assertObjectTypeProperty;
	exports.assertObjectTypeSpreadProperty = assertObjectTypeSpreadProperty;
	exports.assertOpaqueType = assertOpaqueType;
	exports.assertOptionalCallExpression = assertOptionalCallExpression;
	exports.assertOptionalIndexedAccessType = assertOptionalIndexedAccessType;
	exports.assertOptionalMemberExpression = assertOptionalMemberExpression;
	exports.assertParenthesizedExpression = assertParenthesizedExpression;
	exports.assertPattern = assertPattern;
	exports.assertPatternLike = assertPatternLike;
	exports.assertPipelineBareFunction = assertPipelineBareFunction;
	exports.assertPipelinePrimaryTopicReference = assertPipelinePrimaryTopicReference;
	exports.assertPipelineTopicExpression = assertPipelineTopicExpression;
	exports.assertPlaceholder = assertPlaceholder;
	exports.assertPrivate = assertPrivate;
	exports.assertPrivateName = assertPrivateName;
	exports.assertProgram = assertProgram;
	exports.assertProperty = assertProperty;
	exports.assertPureish = assertPureish;
	exports.assertQualifiedTypeIdentifier = assertQualifiedTypeIdentifier;
	exports.assertRecordExpression = assertRecordExpression;
	exports.assertRegExpLiteral = assertRegExpLiteral;
	exports.assertRegexLiteral = assertRegexLiteral;
	exports.assertRestElement = assertRestElement;
	exports.assertRestProperty = assertRestProperty;
	exports.assertReturnStatement = assertReturnStatement;
	exports.assertScopable = assertScopable;
	exports.assertSequenceExpression = assertSequenceExpression;
	exports.assertSpreadElement = assertSpreadElement;
	exports.assertSpreadProperty = assertSpreadProperty;
	exports.assertStandardized = assertStandardized;
	exports.assertStatement = assertStatement;
	exports.assertStaticBlock = assertStaticBlock;
	exports.assertStringLiteral = assertStringLiteral;
	exports.assertStringLiteralTypeAnnotation = assertStringLiteralTypeAnnotation;
	exports.assertStringTypeAnnotation = assertStringTypeAnnotation;
	exports.assertSuper = assertSuper;
	exports.assertSwitchCase = assertSwitchCase;
	exports.assertSwitchStatement = assertSwitchStatement;
	exports.assertSymbolTypeAnnotation = assertSymbolTypeAnnotation;
	exports.assertTSAnyKeyword = assertTSAnyKeyword;
	exports.assertTSArrayType = assertTSArrayType;
	exports.assertTSAsExpression = assertTSAsExpression;
	exports.assertTSBaseType = assertTSBaseType;
	exports.assertTSBigIntKeyword = assertTSBigIntKeyword;
	exports.assertTSBooleanKeyword = assertTSBooleanKeyword;
	exports.assertTSCallSignatureDeclaration = assertTSCallSignatureDeclaration;
	exports.assertTSConditionalType = assertTSConditionalType;
	exports.assertTSConstructSignatureDeclaration = assertTSConstructSignatureDeclaration;
	exports.assertTSConstructorType = assertTSConstructorType;
	exports.assertTSDeclareFunction = assertTSDeclareFunction;
	exports.assertTSDeclareMethod = assertTSDeclareMethod;
	exports.assertTSEntityName = assertTSEntityName;
	exports.assertTSEnumBody = assertTSEnumBody;
	exports.assertTSEnumDeclaration = assertTSEnumDeclaration;
	exports.assertTSEnumMember = assertTSEnumMember;
	exports.assertTSExportAssignment = assertTSExportAssignment;
	exports.assertTSExpressionWithTypeArguments = assertTSExpressionWithTypeArguments;
	exports.assertTSExternalModuleReference = assertTSExternalModuleReference;
	exports.assertTSFunctionType = assertTSFunctionType;
	exports.assertTSImportEqualsDeclaration = assertTSImportEqualsDeclaration;
	exports.assertTSImportType = assertTSImportType;
	exports.assertTSIndexSignature = assertTSIndexSignature;
	exports.assertTSIndexedAccessType = assertTSIndexedAccessType;
	exports.assertTSInferType = assertTSInferType;
	exports.assertTSInstantiationExpression = assertTSInstantiationExpression;
	exports.assertTSInterfaceBody = assertTSInterfaceBody;
	exports.assertTSInterfaceDeclaration = assertTSInterfaceDeclaration;
	exports.assertTSIntersectionType = assertTSIntersectionType;
	exports.assertTSIntrinsicKeyword = assertTSIntrinsicKeyword;
	exports.assertTSLiteralType = assertTSLiteralType;
	exports.assertTSMappedType = assertTSMappedType;
	exports.assertTSMethodSignature = assertTSMethodSignature;
	exports.assertTSModuleBlock = assertTSModuleBlock;
	exports.assertTSModuleDeclaration = assertTSModuleDeclaration;
	exports.assertTSNamedTupleMember = assertTSNamedTupleMember;
	exports.assertTSNamespaceExportDeclaration = assertTSNamespaceExportDeclaration;
	exports.assertTSNeverKeyword = assertTSNeverKeyword;
	exports.assertTSNonNullExpression = assertTSNonNullExpression;
	exports.assertTSNullKeyword = assertTSNullKeyword;
	exports.assertTSNumberKeyword = assertTSNumberKeyword;
	exports.assertTSObjectKeyword = assertTSObjectKeyword;
	exports.assertTSOptionalType = assertTSOptionalType;
	exports.assertTSParameterProperty = assertTSParameterProperty;
	exports.assertTSParenthesizedType = assertTSParenthesizedType;
	exports.assertTSPropertySignature = assertTSPropertySignature;
	exports.assertTSQualifiedName = assertTSQualifiedName;
	exports.assertTSRestType = assertTSRestType;
	exports.assertTSSatisfiesExpression = assertTSSatisfiesExpression;
	exports.assertTSStringKeyword = assertTSStringKeyword;
	exports.assertTSSymbolKeyword = assertTSSymbolKeyword;
	exports.assertTSThisType = assertTSThisType;
	exports.assertTSTupleType = assertTSTupleType;
	exports.assertTSType = assertTSType;
	exports.assertTSTypeAliasDeclaration = assertTSTypeAliasDeclaration;
	exports.assertTSTypeAnnotation = assertTSTypeAnnotation;
	exports.assertTSTypeAssertion = assertTSTypeAssertion;
	exports.assertTSTypeElement = assertTSTypeElement;
	exports.assertTSTypeLiteral = assertTSTypeLiteral;
	exports.assertTSTypeOperator = assertTSTypeOperator;
	exports.assertTSTypeParameter = assertTSTypeParameter;
	exports.assertTSTypeParameterDeclaration = assertTSTypeParameterDeclaration;
	exports.assertTSTypeParameterInstantiation = assertTSTypeParameterInstantiation;
	exports.assertTSTypePredicate = assertTSTypePredicate;
	exports.assertTSTypeQuery = assertTSTypeQuery;
	exports.assertTSTypeReference = assertTSTypeReference;
	exports.assertTSUndefinedKeyword = assertTSUndefinedKeyword;
	exports.assertTSUnionType = assertTSUnionType;
	exports.assertTSUnknownKeyword = assertTSUnknownKeyword;
	exports.assertTSVoidKeyword = assertTSVoidKeyword;
	exports.assertTaggedTemplateExpression = assertTaggedTemplateExpression;
	exports.assertTemplateElement = assertTemplateElement;
	exports.assertTemplateLiteral = assertTemplateLiteral;
	exports.assertTerminatorless = assertTerminatorless;
	exports.assertThisExpression = assertThisExpression;
	exports.assertThisTypeAnnotation = assertThisTypeAnnotation;
	exports.assertThrowStatement = assertThrowStatement;
	exports.assertTopicReference = assertTopicReference;
	exports.assertTryStatement = assertTryStatement;
	exports.assertTupleExpression = assertTupleExpression;
	exports.assertTupleTypeAnnotation = assertTupleTypeAnnotation;
	exports.assertTypeAlias = assertTypeAlias;
	exports.assertTypeAnnotation = assertTypeAnnotation;
	exports.assertTypeCastExpression = assertTypeCastExpression;
	exports.assertTypeParameter = assertTypeParameter;
	exports.assertTypeParameterDeclaration = assertTypeParameterDeclaration;
	exports.assertTypeParameterInstantiation = assertTypeParameterInstantiation;
	exports.assertTypeScript = assertTypeScript;
	exports.assertTypeofTypeAnnotation = assertTypeofTypeAnnotation;
	exports.assertUnaryExpression = assertUnaryExpression;
	exports.assertUnaryLike = assertUnaryLike;
	exports.assertUnionTypeAnnotation = assertUnionTypeAnnotation;
	exports.assertUpdateExpression = assertUpdateExpression;
	exports.assertUserWhitespacable = assertUserWhitespacable;
	exports.assertV8IntrinsicIdentifier = assertV8IntrinsicIdentifier;
	exports.assertVariableDeclaration = assertVariableDeclaration;
	exports.assertVariableDeclarator = assertVariableDeclarator;
	exports.assertVariance = assertVariance;
	exports.assertVoidTypeAnnotation = assertVoidTypeAnnotation;
	exports.assertWhile = assertWhile;
	exports.assertWhileStatement = assertWhileStatement;
	exports.assertWithStatement = assertWithStatement;
	exports.assertYieldExpression = assertYieldExpression;
	var _is$1 = require_is();
	var _deprecationWarning$1 = require_deprecationWarning();
	function assert(type, node, opts) {
		if (!(0, _is$1.default)(type, node, opts)) throw new Error(`Expected type "${type}" with option ${JSON.stringify(opts)}, but instead got "${node.type}".`);
	}
	function assertArrayExpression(node, opts) {
		assert("ArrayExpression", node, opts);
	}
	function assertAssignmentExpression(node, opts) {
		assert("AssignmentExpression", node, opts);
	}
	function assertBinaryExpression(node, opts) {
		assert("BinaryExpression", node, opts);
	}
	function assertInterpreterDirective(node, opts) {
		assert("InterpreterDirective", node, opts);
	}
	function assertDirective(node, opts) {
		assert("Directive", node, opts);
	}
	function assertDirectiveLiteral(node, opts) {
		assert("DirectiveLiteral", node, opts);
	}
	function assertBlockStatement(node, opts) {
		assert("BlockStatement", node, opts);
	}
	function assertBreakStatement(node, opts) {
		assert("BreakStatement", node, opts);
	}
	function assertCallExpression(node, opts) {
		assert("CallExpression", node, opts);
	}
	function assertCatchClause(node, opts) {
		assert("CatchClause", node, opts);
	}
	function assertConditionalExpression(node, opts) {
		assert("ConditionalExpression", node, opts);
	}
	function assertContinueStatement(node, opts) {
		assert("ContinueStatement", node, opts);
	}
	function assertDebuggerStatement(node, opts) {
		assert("DebuggerStatement", node, opts);
	}
	function assertDoWhileStatement(node, opts) {
		assert("DoWhileStatement", node, opts);
	}
	function assertEmptyStatement(node, opts) {
		assert("EmptyStatement", node, opts);
	}
	function assertExpressionStatement(node, opts) {
		assert("ExpressionStatement", node, opts);
	}
	function assertFile(node, opts) {
		assert("File", node, opts);
	}
	function assertForInStatement(node, opts) {
		assert("ForInStatement", node, opts);
	}
	function assertForStatement(node, opts) {
		assert("ForStatement", node, opts);
	}
	function assertFunctionDeclaration(node, opts) {
		assert("FunctionDeclaration", node, opts);
	}
	function assertFunctionExpression(node, opts) {
		assert("FunctionExpression", node, opts);
	}
	function assertIdentifier(node, opts) {
		assert("Identifier", node, opts);
	}
	function assertIfStatement(node, opts) {
		assert("IfStatement", node, opts);
	}
	function assertLabeledStatement(node, opts) {
		assert("LabeledStatement", node, opts);
	}
	function assertStringLiteral(node, opts) {
		assert("StringLiteral", node, opts);
	}
	function assertNumericLiteral(node, opts) {
		assert("NumericLiteral", node, opts);
	}
	function assertNullLiteral(node, opts) {
		assert("NullLiteral", node, opts);
	}
	function assertBooleanLiteral(node, opts) {
		assert("BooleanLiteral", node, opts);
	}
	function assertRegExpLiteral(node, opts) {
		assert("RegExpLiteral", node, opts);
	}
	function assertLogicalExpression(node, opts) {
		assert("LogicalExpression", node, opts);
	}
	function assertMemberExpression(node, opts) {
		assert("MemberExpression", node, opts);
	}
	function assertNewExpression(node, opts) {
		assert("NewExpression", node, opts);
	}
	function assertProgram(node, opts) {
		assert("Program", node, opts);
	}
	function assertObjectExpression(node, opts) {
		assert("ObjectExpression", node, opts);
	}
	function assertObjectMethod(node, opts) {
		assert("ObjectMethod", node, opts);
	}
	function assertObjectProperty(node, opts) {
		assert("ObjectProperty", node, opts);
	}
	function assertRestElement(node, opts) {
		assert("RestElement", node, opts);
	}
	function assertReturnStatement(node, opts) {
		assert("ReturnStatement", node, opts);
	}
	function assertSequenceExpression(node, opts) {
		assert("SequenceExpression", node, opts);
	}
	function assertParenthesizedExpression(node, opts) {
		assert("ParenthesizedExpression", node, opts);
	}
	function assertSwitchCase(node, opts) {
		assert("SwitchCase", node, opts);
	}
	function assertSwitchStatement(node, opts) {
		assert("SwitchStatement", node, opts);
	}
	function assertThisExpression(node, opts) {
		assert("ThisExpression", node, opts);
	}
	function assertThrowStatement(node, opts) {
		assert("ThrowStatement", node, opts);
	}
	function assertTryStatement(node, opts) {
		assert("TryStatement", node, opts);
	}
	function assertUnaryExpression(node, opts) {
		assert("UnaryExpression", node, opts);
	}
	function assertUpdateExpression(node, opts) {
		assert("UpdateExpression", node, opts);
	}
	function assertVariableDeclaration(node, opts) {
		assert("VariableDeclaration", node, opts);
	}
	function assertVariableDeclarator(node, opts) {
		assert("VariableDeclarator", node, opts);
	}
	function assertWhileStatement(node, opts) {
		assert("WhileStatement", node, opts);
	}
	function assertWithStatement(node, opts) {
		assert("WithStatement", node, opts);
	}
	function assertAssignmentPattern(node, opts) {
		assert("AssignmentPattern", node, opts);
	}
	function assertArrayPattern(node, opts) {
		assert("ArrayPattern", node, opts);
	}
	function assertArrowFunctionExpression(node, opts) {
		assert("ArrowFunctionExpression", node, opts);
	}
	function assertClassBody(node, opts) {
		assert("ClassBody", node, opts);
	}
	function assertClassExpression(node, opts) {
		assert("ClassExpression", node, opts);
	}
	function assertClassDeclaration(node, opts) {
		assert("ClassDeclaration", node, opts);
	}
	function assertExportAllDeclaration(node, opts) {
		assert("ExportAllDeclaration", node, opts);
	}
	function assertExportDefaultDeclaration(node, opts) {
		assert("ExportDefaultDeclaration", node, opts);
	}
	function assertExportNamedDeclaration(node, opts) {
		assert("ExportNamedDeclaration", node, opts);
	}
	function assertExportSpecifier(node, opts) {
		assert("ExportSpecifier", node, opts);
	}
	function assertForOfStatement(node, opts) {
		assert("ForOfStatement", node, opts);
	}
	function assertImportDeclaration(node, opts) {
		assert("ImportDeclaration", node, opts);
	}
	function assertImportDefaultSpecifier(node, opts) {
		assert("ImportDefaultSpecifier", node, opts);
	}
	function assertImportNamespaceSpecifier(node, opts) {
		assert("ImportNamespaceSpecifier", node, opts);
	}
	function assertImportSpecifier(node, opts) {
		assert("ImportSpecifier", node, opts);
	}
	function assertImportExpression(node, opts) {
		assert("ImportExpression", node, opts);
	}
	function assertMetaProperty(node, opts) {
		assert("MetaProperty", node, opts);
	}
	function assertClassMethod(node, opts) {
		assert("ClassMethod", node, opts);
	}
	function assertObjectPattern(node, opts) {
		assert("ObjectPattern", node, opts);
	}
	function assertSpreadElement(node, opts) {
		assert("SpreadElement", node, opts);
	}
	function assertSuper(node, opts) {
		assert("Super", node, opts);
	}
	function assertTaggedTemplateExpression(node, opts) {
		assert("TaggedTemplateExpression", node, opts);
	}
	function assertTemplateElement(node, opts) {
		assert("TemplateElement", node, opts);
	}
	function assertTemplateLiteral(node, opts) {
		assert("TemplateLiteral", node, opts);
	}
	function assertYieldExpression(node, opts) {
		assert("YieldExpression", node, opts);
	}
	function assertAwaitExpression(node, opts) {
		assert("AwaitExpression", node, opts);
	}
	function assertImport(node, opts) {
		assert("Import", node, opts);
	}
	function assertBigIntLiteral(node, opts) {
		assert("BigIntLiteral", node, opts);
	}
	function assertExportNamespaceSpecifier(node, opts) {
		assert("ExportNamespaceSpecifier", node, opts);
	}
	function assertOptionalMemberExpression(node, opts) {
		assert("OptionalMemberExpression", node, opts);
	}
	function assertOptionalCallExpression(node, opts) {
		assert("OptionalCallExpression", node, opts);
	}
	function assertClassProperty(node, opts) {
		assert("ClassProperty", node, opts);
	}
	function assertClassAccessorProperty(node, opts) {
		assert("ClassAccessorProperty", node, opts);
	}
	function assertClassPrivateProperty(node, opts) {
		assert("ClassPrivateProperty", node, opts);
	}
	function assertClassPrivateMethod(node, opts) {
		assert("ClassPrivateMethod", node, opts);
	}
	function assertPrivateName(node, opts) {
		assert("PrivateName", node, opts);
	}
	function assertStaticBlock(node, opts) {
		assert("StaticBlock", node, opts);
	}
	function assertAnyTypeAnnotation(node, opts) {
		assert("AnyTypeAnnotation", node, opts);
	}
	function assertArrayTypeAnnotation(node, opts) {
		assert("ArrayTypeAnnotation", node, opts);
	}
	function assertBooleanTypeAnnotation(node, opts) {
		assert("BooleanTypeAnnotation", node, opts);
	}
	function assertBooleanLiteralTypeAnnotation(node, opts) {
		assert("BooleanLiteralTypeAnnotation", node, opts);
	}
	function assertNullLiteralTypeAnnotation(node, opts) {
		assert("NullLiteralTypeAnnotation", node, opts);
	}
	function assertClassImplements(node, opts) {
		assert("ClassImplements", node, opts);
	}
	function assertDeclareClass(node, opts) {
		assert("DeclareClass", node, opts);
	}
	function assertDeclareFunction(node, opts) {
		assert("DeclareFunction", node, opts);
	}
	function assertDeclareInterface(node, opts) {
		assert("DeclareInterface", node, opts);
	}
	function assertDeclareModule(node, opts) {
		assert("DeclareModule", node, opts);
	}
	function assertDeclareModuleExports(node, opts) {
		assert("DeclareModuleExports", node, opts);
	}
	function assertDeclareTypeAlias(node, opts) {
		assert("DeclareTypeAlias", node, opts);
	}
	function assertDeclareOpaqueType(node, opts) {
		assert("DeclareOpaqueType", node, opts);
	}
	function assertDeclareVariable(node, opts) {
		assert("DeclareVariable", node, opts);
	}
	function assertDeclareExportDeclaration(node, opts) {
		assert("DeclareExportDeclaration", node, opts);
	}
	function assertDeclareExportAllDeclaration(node, opts) {
		assert("DeclareExportAllDeclaration", node, opts);
	}
	function assertDeclaredPredicate(node, opts) {
		assert("DeclaredPredicate", node, opts);
	}
	function assertExistsTypeAnnotation(node, opts) {
		assert("ExistsTypeAnnotation", node, opts);
	}
	function assertFunctionTypeAnnotation(node, opts) {
		assert("FunctionTypeAnnotation", node, opts);
	}
	function assertFunctionTypeParam(node, opts) {
		assert("FunctionTypeParam", node, opts);
	}
	function assertGenericTypeAnnotation(node, opts) {
		assert("GenericTypeAnnotation", node, opts);
	}
	function assertInferredPredicate(node, opts) {
		assert("InferredPredicate", node, opts);
	}
	function assertInterfaceExtends(node, opts) {
		assert("InterfaceExtends", node, opts);
	}
	function assertInterfaceDeclaration(node, opts) {
		assert("InterfaceDeclaration", node, opts);
	}
	function assertInterfaceTypeAnnotation(node, opts) {
		assert("InterfaceTypeAnnotation", node, opts);
	}
	function assertIntersectionTypeAnnotation(node, opts) {
		assert("IntersectionTypeAnnotation", node, opts);
	}
	function assertMixedTypeAnnotation(node, opts) {
		assert("MixedTypeAnnotation", node, opts);
	}
	function assertEmptyTypeAnnotation(node, opts) {
		assert("EmptyTypeAnnotation", node, opts);
	}
	function assertNullableTypeAnnotation(node, opts) {
		assert("NullableTypeAnnotation", node, opts);
	}
	function assertNumberLiteralTypeAnnotation(node, opts) {
		assert("NumberLiteralTypeAnnotation", node, opts);
	}
	function assertNumberTypeAnnotation(node, opts) {
		assert("NumberTypeAnnotation", node, opts);
	}
	function assertObjectTypeAnnotation(node, opts) {
		assert("ObjectTypeAnnotation", node, opts);
	}
	function assertObjectTypeInternalSlot(node, opts) {
		assert("ObjectTypeInternalSlot", node, opts);
	}
	function assertObjectTypeCallProperty(node, opts) {
		assert("ObjectTypeCallProperty", node, opts);
	}
	function assertObjectTypeIndexer(node, opts) {
		assert("ObjectTypeIndexer", node, opts);
	}
	function assertObjectTypeProperty(node, opts) {
		assert("ObjectTypeProperty", node, opts);
	}
	function assertObjectTypeSpreadProperty(node, opts) {
		assert("ObjectTypeSpreadProperty", node, opts);
	}
	function assertOpaqueType(node, opts) {
		assert("OpaqueType", node, opts);
	}
	function assertQualifiedTypeIdentifier(node, opts) {
		assert("QualifiedTypeIdentifier", node, opts);
	}
	function assertStringLiteralTypeAnnotation(node, opts) {
		assert("StringLiteralTypeAnnotation", node, opts);
	}
	function assertStringTypeAnnotation(node, opts) {
		assert("StringTypeAnnotation", node, opts);
	}
	function assertSymbolTypeAnnotation(node, opts) {
		assert("SymbolTypeAnnotation", node, opts);
	}
	function assertThisTypeAnnotation(node, opts) {
		assert("ThisTypeAnnotation", node, opts);
	}
	function assertTupleTypeAnnotation(node, opts) {
		assert("TupleTypeAnnotation", node, opts);
	}
	function assertTypeofTypeAnnotation(node, opts) {
		assert("TypeofTypeAnnotation", node, opts);
	}
	function assertTypeAlias(node, opts) {
		assert("TypeAlias", node, opts);
	}
	function assertTypeAnnotation(node, opts) {
		assert("TypeAnnotation", node, opts);
	}
	function assertTypeCastExpression(node, opts) {
		assert("TypeCastExpression", node, opts);
	}
	function assertTypeParameter(node, opts) {
		assert("TypeParameter", node, opts);
	}
	function assertTypeParameterDeclaration(node, opts) {
		assert("TypeParameterDeclaration", node, opts);
	}
	function assertTypeParameterInstantiation(node, opts) {
		assert("TypeParameterInstantiation", node, opts);
	}
	function assertUnionTypeAnnotation(node, opts) {
		assert("UnionTypeAnnotation", node, opts);
	}
	function assertVariance(node, opts) {
		assert("Variance", node, opts);
	}
	function assertVoidTypeAnnotation(node, opts) {
		assert("VoidTypeAnnotation", node, opts);
	}
	function assertEnumDeclaration(node, opts) {
		assert("EnumDeclaration", node, opts);
	}
	function assertEnumBooleanBody(node, opts) {
		assert("EnumBooleanBody", node, opts);
	}
	function assertEnumNumberBody(node, opts) {
		assert("EnumNumberBody", node, opts);
	}
	function assertEnumStringBody(node, opts) {
		assert("EnumStringBody", node, opts);
	}
	function assertEnumSymbolBody(node, opts) {
		assert("EnumSymbolBody", node, opts);
	}
	function assertEnumBooleanMember(node, opts) {
		assert("EnumBooleanMember", node, opts);
	}
	function assertEnumNumberMember(node, opts) {
		assert("EnumNumberMember", node, opts);
	}
	function assertEnumStringMember(node, opts) {
		assert("EnumStringMember", node, opts);
	}
	function assertEnumDefaultedMember(node, opts) {
		assert("EnumDefaultedMember", node, opts);
	}
	function assertIndexedAccessType(node, opts) {
		assert("IndexedAccessType", node, opts);
	}
	function assertOptionalIndexedAccessType(node, opts) {
		assert("OptionalIndexedAccessType", node, opts);
	}
	function assertJSXAttribute(node, opts) {
		assert("JSXAttribute", node, opts);
	}
	function assertJSXClosingElement(node, opts) {
		assert("JSXClosingElement", node, opts);
	}
	function assertJSXElement(node, opts) {
		assert("JSXElement", node, opts);
	}
	function assertJSXEmptyExpression(node, opts) {
		assert("JSXEmptyExpression", node, opts);
	}
	function assertJSXExpressionContainer(node, opts) {
		assert("JSXExpressionContainer", node, opts);
	}
	function assertJSXSpreadChild(node, opts) {
		assert("JSXSpreadChild", node, opts);
	}
	function assertJSXIdentifier(node, opts) {
		assert("JSXIdentifier", node, opts);
	}
	function assertJSXMemberExpression(node, opts) {
		assert("JSXMemberExpression", node, opts);
	}
	function assertJSXNamespacedName(node, opts) {
		assert("JSXNamespacedName", node, opts);
	}
	function assertJSXOpeningElement(node, opts) {
		assert("JSXOpeningElement", node, opts);
	}
	function assertJSXSpreadAttribute(node, opts) {
		assert("JSXSpreadAttribute", node, opts);
	}
	function assertJSXText(node, opts) {
		assert("JSXText", node, opts);
	}
	function assertJSXFragment(node, opts) {
		assert("JSXFragment", node, opts);
	}
	function assertJSXOpeningFragment(node, opts) {
		assert("JSXOpeningFragment", node, opts);
	}
	function assertJSXClosingFragment(node, opts) {
		assert("JSXClosingFragment", node, opts);
	}
	function assertNoop(node, opts) {
		assert("Noop", node, opts);
	}
	function assertPlaceholder(node, opts) {
		assert("Placeholder", node, opts);
	}
	function assertV8IntrinsicIdentifier(node, opts) {
		assert("V8IntrinsicIdentifier", node, opts);
	}
	function assertArgumentPlaceholder(node, opts) {
		assert("ArgumentPlaceholder", node, opts);
	}
	function assertBindExpression(node, opts) {
		assert("BindExpression", node, opts);
	}
	function assertImportAttribute(node, opts) {
		assert("ImportAttribute", node, opts);
	}
	function assertDecorator(node, opts) {
		assert("Decorator", node, opts);
	}
	function assertDoExpression(node, opts) {
		assert("DoExpression", node, opts);
	}
	function assertExportDefaultSpecifier(node, opts) {
		assert("ExportDefaultSpecifier", node, opts);
	}
	function assertRecordExpression(node, opts) {
		assert("RecordExpression", node, opts);
	}
	function assertTupleExpression(node, opts) {
		assert("TupleExpression", node, opts);
	}
	function assertDecimalLiteral(node, opts) {
		assert("DecimalLiteral", node, opts);
	}
	function assertModuleExpression(node, opts) {
		assert("ModuleExpression", node, opts);
	}
	function assertTopicReference(node, opts) {
		assert("TopicReference", node, opts);
	}
	function assertPipelineTopicExpression(node, opts) {
		assert("PipelineTopicExpression", node, opts);
	}
	function assertPipelineBareFunction(node, opts) {
		assert("PipelineBareFunction", node, opts);
	}
	function assertPipelinePrimaryTopicReference(node, opts) {
		assert("PipelinePrimaryTopicReference", node, opts);
	}
	function assertTSParameterProperty(node, opts) {
		assert("TSParameterProperty", node, opts);
	}
	function assertTSDeclareFunction(node, opts) {
		assert("TSDeclareFunction", node, opts);
	}
	function assertTSDeclareMethod(node, opts) {
		assert("TSDeclareMethod", node, opts);
	}
	function assertTSQualifiedName(node, opts) {
		assert("TSQualifiedName", node, opts);
	}
	function assertTSCallSignatureDeclaration(node, opts) {
		assert("TSCallSignatureDeclaration", node, opts);
	}
	function assertTSConstructSignatureDeclaration(node, opts) {
		assert("TSConstructSignatureDeclaration", node, opts);
	}
	function assertTSPropertySignature(node, opts) {
		assert("TSPropertySignature", node, opts);
	}
	function assertTSMethodSignature(node, opts) {
		assert("TSMethodSignature", node, opts);
	}
	function assertTSIndexSignature(node, opts) {
		assert("TSIndexSignature", node, opts);
	}
	function assertTSAnyKeyword(node, opts) {
		assert("TSAnyKeyword", node, opts);
	}
	function assertTSBooleanKeyword(node, opts) {
		assert("TSBooleanKeyword", node, opts);
	}
	function assertTSBigIntKeyword(node, opts) {
		assert("TSBigIntKeyword", node, opts);
	}
	function assertTSIntrinsicKeyword(node, opts) {
		assert("TSIntrinsicKeyword", node, opts);
	}
	function assertTSNeverKeyword(node, opts) {
		assert("TSNeverKeyword", node, opts);
	}
	function assertTSNullKeyword(node, opts) {
		assert("TSNullKeyword", node, opts);
	}
	function assertTSNumberKeyword(node, opts) {
		assert("TSNumberKeyword", node, opts);
	}
	function assertTSObjectKeyword(node, opts) {
		assert("TSObjectKeyword", node, opts);
	}
	function assertTSStringKeyword(node, opts) {
		assert("TSStringKeyword", node, opts);
	}
	function assertTSSymbolKeyword(node, opts) {
		assert("TSSymbolKeyword", node, opts);
	}
	function assertTSUndefinedKeyword(node, opts) {
		assert("TSUndefinedKeyword", node, opts);
	}
	function assertTSUnknownKeyword(node, opts) {
		assert("TSUnknownKeyword", node, opts);
	}
	function assertTSVoidKeyword(node, opts) {
		assert("TSVoidKeyword", node, opts);
	}
	function assertTSThisType(node, opts) {
		assert("TSThisType", node, opts);
	}
	function assertTSFunctionType(node, opts) {
		assert("TSFunctionType", node, opts);
	}
	function assertTSConstructorType(node, opts) {
		assert("TSConstructorType", node, opts);
	}
	function assertTSTypeReference(node, opts) {
		assert("TSTypeReference", node, opts);
	}
	function assertTSTypePredicate(node, opts) {
		assert("TSTypePredicate", node, opts);
	}
	function assertTSTypeQuery(node, opts) {
		assert("TSTypeQuery", node, opts);
	}
	function assertTSTypeLiteral(node, opts) {
		assert("TSTypeLiteral", node, opts);
	}
	function assertTSArrayType(node, opts) {
		assert("TSArrayType", node, opts);
	}
	function assertTSTupleType(node, opts) {
		assert("TSTupleType", node, opts);
	}
	function assertTSOptionalType(node, opts) {
		assert("TSOptionalType", node, opts);
	}
	function assertTSRestType(node, opts) {
		assert("TSRestType", node, opts);
	}
	function assertTSNamedTupleMember(node, opts) {
		assert("TSNamedTupleMember", node, opts);
	}
	function assertTSUnionType(node, opts) {
		assert("TSUnionType", node, opts);
	}
	function assertTSIntersectionType(node, opts) {
		assert("TSIntersectionType", node, opts);
	}
	function assertTSConditionalType(node, opts) {
		assert("TSConditionalType", node, opts);
	}
	function assertTSInferType(node, opts) {
		assert("TSInferType", node, opts);
	}
	function assertTSParenthesizedType(node, opts) {
		assert("TSParenthesizedType", node, opts);
	}
	function assertTSTypeOperator(node, opts) {
		assert("TSTypeOperator", node, opts);
	}
	function assertTSIndexedAccessType(node, opts) {
		assert("TSIndexedAccessType", node, opts);
	}
	function assertTSMappedType(node, opts) {
		assert("TSMappedType", node, opts);
	}
	function assertTSLiteralType(node, opts) {
		assert("TSLiteralType", node, opts);
	}
	function assertTSExpressionWithTypeArguments(node, opts) {
		assert("TSExpressionWithTypeArguments", node, opts);
	}
	function assertTSInterfaceDeclaration(node, opts) {
		assert("TSInterfaceDeclaration", node, opts);
	}
	function assertTSInterfaceBody(node, opts) {
		assert("TSInterfaceBody", node, opts);
	}
	function assertTSTypeAliasDeclaration(node, opts) {
		assert("TSTypeAliasDeclaration", node, opts);
	}
	function assertTSInstantiationExpression(node, opts) {
		assert("TSInstantiationExpression", node, opts);
	}
	function assertTSAsExpression(node, opts) {
		assert("TSAsExpression", node, opts);
	}
	function assertTSSatisfiesExpression(node, opts) {
		assert("TSSatisfiesExpression", node, opts);
	}
	function assertTSTypeAssertion(node, opts) {
		assert("TSTypeAssertion", node, opts);
	}
	function assertTSEnumBody(node, opts) {
		assert("TSEnumBody", node, opts);
	}
	function assertTSEnumDeclaration(node, opts) {
		assert("TSEnumDeclaration", node, opts);
	}
	function assertTSEnumMember(node, opts) {
		assert("TSEnumMember", node, opts);
	}
	function assertTSModuleDeclaration(node, opts) {
		assert("TSModuleDeclaration", node, opts);
	}
	function assertTSModuleBlock(node, opts) {
		assert("TSModuleBlock", node, opts);
	}
	function assertTSImportType(node, opts) {
		assert("TSImportType", node, opts);
	}
	function assertTSImportEqualsDeclaration(node, opts) {
		assert("TSImportEqualsDeclaration", node, opts);
	}
	function assertTSExternalModuleReference(node, opts) {
		assert("TSExternalModuleReference", node, opts);
	}
	function assertTSNonNullExpression(node, opts) {
		assert("TSNonNullExpression", node, opts);
	}
	function assertTSExportAssignment(node, opts) {
		assert("TSExportAssignment", node, opts);
	}
	function assertTSNamespaceExportDeclaration(node, opts) {
		assert("TSNamespaceExportDeclaration", node, opts);
	}
	function assertTSTypeAnnotation(node, opts) {
		assert("TSTypeAnnotation", node, opts);
	}
	function assertTSTypeParameterInstantiation(node, opts) {
		assert("TSTypeParameterInstantiation", node, opts);
	}
	function assertTSTypeParameterDeclaration(node, opts) {
		assert("TSTypeParameterDeclaration", node, opts);
	}
	function assertTSTypeParameter(node, opts) {
		assert("TSTypeParameter", node, opts);
	}
	function assertStandardized(node, opts) {
		assert("Standardized", node, opts);
	}
	function assertExpression(node, opts) {
		assert("Expression", node, opts);
	}
	function assertBinary(node, opts) {
		assert("Binary", node, opts);
	}
	function assertScopable(node, opts) {
		assert("Scopable", node, opts);
	}
	function assertBlockParent(node, opts) {
		assert("BlockParent", node, opts);
	}
	function assertBlock(node, opts) {
		assert("Block", node, opts);
	}
	function assertStatement(node, opts) {
		assert("Statement", node, opts);
	}
	function assertTerminatorless(node, opts) {
		assert("Terminatorless", node, opts);
	}
	function assertCompletionStatement(node, opts) {
		assert("CompletionStatement", node, opts);
	}
	function assertConditional(node, opts) {
		assert("Conditional", node, opts);
	}
	function assertLoop(node, opts) {
		assert("Loop", node, opts);
	}
	function assertWhile(node, opts) {
		assert("While", node, opts);
	}
	function assertExpressionWrapper(node, opts) {
		assert("ExpressionWrapper", node, opts);
	}
	function assertFor(node, opts) {
		assert("For", node, opts);
	}
	function assertForXStatement(node, opts) {
		assert("ForXStatement", node, opts);
	}
	function assertFunction(node, opts) {
		assert("Function", node, opts);
	}
	function assertFunctionParent(node, opts) {
		assert("FunctionParent", node, opts);
	}
	function assertPureish(node, opts) {
		assert("Pureish", node, opts);
	}
	function assertDeclaration(node, opts) {
		assert("Declaration", node, opts);
	}
	function assertPatternLike(node, opts) {
		assert("PatternLike", node, opts);
	}
	function assertLVal(node, opts) {
		assert("LVal", node, opts);
	}
	function assertTSEntityName(node, opts) {
		assert("TSEntityName", node, opts);
	}
	function assertLiteral(node, opts) {
		assert("Literal", node, opts);
	}
	function assertImmutable(node, opts) {
		assert("Immutable", node, opts);
	}
	function assertUserWhitespacable(node, opts) {
		assert("UserWhitespacable", node, opts);
	}
	function assertMethod(node, opts) {
		assert("Method", node, opts);
	}
	function assertObjectMember(node, opts) {
		assert("ObjectMember", node, opts);
	}
	function assertProperty(node, opts) {
		assert("Property", node, opts);
	}
	function assertUnaryLike(node, opts) {
		assert("UnaryLike", node, opts);
	}
	function assertPattern(node, opts) {
		assert("Pattern", node, opts);
	}
	function assertClass(node, opts) {
		assert("Class", node, opts);
	}
	function assertImportOrExportDeclaration(node, opts) {
		assert("ImportOrExportDeclaration", node, opts);
	}
	function assertExportDeclaration(node, opts) {
		assert("ExportDeclaration", node, opts);
	}
	function assertModuleSpecifier(node, opts) {
		assert("ModuleSpecifier", node, opts);
	}
	function assertAccessor(node, opts) {
		assert("Accessor", node, opts);
	}
	function assertPrivate(node, opts) {
		assert("Private", node, opts);
	}
	function assertFlow(node, opts) {
		assert("Flow", node, opts);
	}
	function assertFlowType(node, opts) {
		assert("FlowType", node, opts);
	}
	function assertFlowBaseAnnotation(node, opts) {
		assert("FlowBaseAnnotation", node, opts);
	}
	function assertFlowDeclaration(node, opts) {
		assert("FlowDeclaration", node, opts);
	}
	function assertFlowPredicate(node, opts) {
		assert("FlowPredicate", node, opts);
	}
	function assertEnumBody(node, opts) {
		assert("EnumBody", node, opts);
	}
	function assertEnumMember(node, opts) {
		assert("EnumMember", node, opts);
	}
	function assertJSX(node, opts) {
		assert("JSX", node, opts);
	}
	function assertMiscellaneous(node, opts) {
		assert("Miscellaneous", node, opts);
	}
	function assertTypeScript(node, opts) {
		assert("TypeScript", node, opts);
	}
	function assertTSTypeElement(node, opts) {
		assert("TSTypeElement", node, opts);
	}
	function assertTSType(node, opts) {
		assert("TSType", node, opts);
	}
	function assertTSBaseType(node, opts) {
		assert("TSBaseType", node, opts);
	}
	function assertNumberLiteral(node, opts) {
		(0, _deprecationWarning$1.default)("assertNumberLiteral", "assertNumericLiteral");
		assert("NumberLiteral", node, opts);
	}
	function assertRegexLiteral(node, opts) {
		(0, _deprecationWarning$1.default)("assertRegexLiteral", "assertRegExpLiteral");
		assert("RegexLiteral", node, opts);
	}
	function assertRestProperty(node, opts) {
		(0, _deprecationWarning$1.default)("assertRestProperty", "assertRestElement");
		assert("RestProperty", node, opts);
	}
	function assertSpreadProperty(node, opts) {
		(0, _deprecationWarning$1.default)("assertSpreadProperty", "assertSpreadElement");
		assert("SpreadProperty", node, opts);
	}
	function assertModuleDeclaration(node, opts) {
		(0, _deprecationWarning$1.default)("assertModuleDeclaration", "assertImportOrExportDeclaration");
		assert("ModuleDeclaration", node, opts);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/flow/createTypeAnnotationBasedOnTypeof.js
var require_createTypeAnnotationBasedOnTypeof = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/flow/createTypeAnnotationBasedOnTypeof.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _index$32 = require_generated$2();
	var _default$4 = exports.default = createTypeAnnotationBasedOnTypeof;
	function createTypeAnnotationBasedOnTypeof(type) {
		switch (type) {
			case "string": return (0, _index$32.stringTypeAnnotation)();
			case "number": return (0, _index$32.numberTypeAnnotation)();
			case "undefined": return (0, _index$32.voidTypeAnnotation)();
			case "boolean": return (0, _index$32.booleanTypeAnnotation)();
			case "function": return (0, _index$32.genericTypeAnnotation)((0, _index$32.identifier)("Function"));
			case "object": return (0, _index$32.genericTypeAnnotation)((0, _index$32.identifier)("Object"));
			case "symbol": return (0, _index$32.genericTypeAnnotation)((0, _index$32.identifier)("Symbol"));
			case "bigint": return (0, _index$32.anyTypeAnnotation)();
		}
		throw new Error("Invalid typeof value: " + type);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/flow/removeTypeDuplicates.js
var require_removeTypeDuplicates$1 = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/flow/removeTypeDuplicates.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removeTypeDuplicates$1;
	var _index$31 = require_generated$3();
	function getQualifiedName$1(node) {
		return (0, _index$31.isIdentifier)(node) ? node.name : `${node.id.name}.${getQualifiedName$1(node.qualification)}`;
	}
	function removeTypeDuplicates$1(nodesIn) {
		const nodes = Array.from(nodesIn);
		const generics = new Map();
		const bases = new Map();
		const typeGroups = new Set();
		const types$1 = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (!node) continue;
			if (types$1.includes(node)) continue;
			if ((0, _index$31.isAnyTypeAnnotation)(node)) return [node];
			if ((0, _index$31.isFlowBaseAnnotation)(node)) {
				bases.set(node.type, node);
				continue;
			}
			if ((0, _index$31.isUnionTypeAnnotation)(node)) {
				if (!typeGroups.has(node.types)) {
					nodes.push(...node.types);
					typeGroups.add(node.types);
				}
				continue;
			}
			if ((0, _index$31.isGenericTypeAnnotation)(node)) {
				const name = getQualifiedName$1(node.id);
				if (generics.has(name)) {
					let existing = generics.get(name);
					if (existing.typeParameters) {
						if (node.typeParameters) {
							existing.typeParameters.params.push(...node.typeParameters.params);
							existing.typeParameters.params = removeTypeDuplicates$1(existing.typeParameters.params);
						}
					} else existing = node.typeParameters;
				} else generics.set(name, node);
				continue;
			}
			types$1.push(node);
		}
		for (const [, baseType] of bases) types$1.push(baseType);
		for (const [, genericName] of generics) types$1.push(genericName);
		return types$1;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/flow/createFlowUnionType.js
var require_createFlowUnionType = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/flow/createFlowUnionType.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = createFlowUnionType;
	var _index$30 = require_generated$2();
	var _removeTypeDuplicates$2 = require_removeTypeDuplicates$1();
	function createFlowUnionType(types$1) {
		const flattened = (0, _removeTypeDuplicates$2.default)(types$1);
		if (flattened.length === 1) return flattened[0];
		else return (0, _index$30.unionTypeAnnotation)(flattened);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/typescript/removeTypeDuplicates.js
var require_removeTypeDuplicates = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/typescript/removeTypeDuplicates.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removeTypeDuplicates;
	var _index$29 = require_generated$3();
	function getQualifiedName(node) {
		return (0, _index$29.isIdentifier)(node) ? node.name : (0, _index$29.isThisExpression)(node) ? "this" : `${node.right.name}.${getQualifiedName(node.left)}`;
	}
	function removeTypeDuplicates(nodesIn) {
		const nodes = Array.from(nodesIn);
		const generics = new Map();
		const bases = new Map();
		const typeGroups = new Set();
		const types$1 = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (!node) continue;
			if (types$1.includes(node)) continue;
			if ((0, _index$29.isTSAnyKeyword)(node)) return [node];
			if ((0, _index$29.isTSBaseType)(node)) {
				bases.set(node.type, node);
				continue;
			}
			if ((0, _index$29.isTSUnionType)(node)) {
				if (!typeGroups.has(node.types)) {
					nodes.push(...node.types);
					typeGroups.add(node.types);
				}
				continue;
			}
			const typeArgumentsKey = "typeParameters";
			if ((0, _index$29.isTSTypeReference)(node) && node[typeArgumentsKey]) {
				const typeArguments = node[typeArgumentsKey];
				const name = getQualifiedName(node.typeName);
				if (generics.has(name)) {
					let existing = generics.get(name);
					const existingTypeArguments = existing[typeArgumentsKey];
					if (existingTypeArguments) {
						existingTypeArguments.params.push(...typeArguments.params);
						existingTypeArguments.params = removeTypeDuplicates(existingTypeArguments.params);
					} else existing = typeArguments;
				} else generics.set(name, node);
				continue;
			}
			types$1.push(node);
		}
		for (const [, baseType] of bases) types$1.push(baseType);
		for (const [, genericName] of generics) types$1.push(genericName);
		return types$1;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/typescript/createTSUnionType.js
var require_createTSUnionType = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/typescript/createTSUnionType.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = createTSUnionType;
	var _index$28 = require_generated$2();
	var _removeTypeDuplicates$1 = require_removeTypeDuplicates();
	var _index2$9 = require_generated$3();
	function createTSUnionType(typeAnnotations) {
		const types$1 = typeAnnotations.map((type) => {
			return (0, _index2$9.isTSTypeAnnotation)(type) ? type.typeAnnotation : type;
		});
		const flattened = (0, _removeTypeDuplicates$1.default)(types$1);
		if (flattened.length === 1) return flattened[0];
		else return (0, _index$28.tsUnionType)(flattened);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/generated/uppercase.js
var require_uppercase = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/generated/uppercase.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "AnyTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.anyTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ArgumentPlaceholder", {
		enumerable: true,
		get: function() {
			return _index$27.argumentPlaceholder;
		}
	});
	Object.defineProperty(exports, "ArrayExpression", {
		enumerable: true,
		get: function() {
			return _index$27.arrayExpression;
		}
	});
	Object.defineProperty(exports, "ArrayPattern", {
		enumerable: true,
		get: function() {
			return _index$27.arrayPattern;
		}
	});
	Object.defineProperty(exports, "ArrayTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.arrayTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ArrowFunctionExpression", {
		enumerable: true,
		get: function() {
			return _index$27.arrowFunctionExpression;
		}
	});
	Object.defineProperty(exports, "AssignmentExpression", {
		enumerable: true,
		get: function() {
			return _index$27.assignmentExpression;
		}
	});
	Object.defineProperty(exports, "AssignmentPattern", {
		enumerable: true,
		get: function() {
			return _index$27.assignmentPattern;
		}
	});
	Object.defineProperty(exports, "AwaitExpression", {
		enumerable: true,
		get: function() {
			return _index$27.awaitExpression;
		}
	});
	Object.defineProperty(exports, "BigIntLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.bigIntLiteral;
		}
	});
	Object.defineProperty(exports, "BinaryExpression", {
		enumerable: true,
		get: function() {
			return _index$27.binaryExpression;
		}
	});
	Object.defineProperty(exports, "BindExpression", {
		enumerable: true,
		get: function() {
			return _index$27.bindExpression;
		}
	});
	Object.defineProperty(exports, "BlockStatement", {
		enumerable: true,
		get: function() {
			return _index$27.blockStatement;
		}
	});
	Object.defineProperty(exports, "BooleanLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.booleanLiteral;
		}
	});
	Object.defineProperty(exports, "BooleanLiteralTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.booleanLiteralTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "BooleanTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.booleanTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "BreakStatement", {
		enumerable: true,
		get: function() {
			return _index$27.breakStatement;
		}
	});
	Object.defineProperty(exports, "CallExpression", {
		enumerable: true,
		get: function() {
			return _index$27.callExpression;
		}
	});
	Object.defineProperty(exports, "CatchClause", {
		enumerable: true,
		get: function() {
			return _index$27.catchClause;
		}
	});
	Object.defineProperty(exports, "ClassAccessorProperty", {
		enumerable: true,
		get: function() {
			return _index$27.classAccessorProperty;
		}
	});
	Object.defineProperty(exports, "ClassBody", {
		enumerable: true,
		get: function() {
			return _index$27.classBody;
		}
	});
	Object.defineProperty(exports, "ClassDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.classDeclaration;
		}
	});
	Object.defineProperty(exports, "ClassExpression", {
		enumerable: true,
		get: function() {
			return _index$27.classExpression;
		}
	});
	Object.defineProperty(exports, "ClassImplements", {
		enumerable: true,
		get: function() {
			return _index$27.classImplements;
		}
	});
	Object.defineProperty(exports, "ClassMethod", {
		enumerable: true,
		get: function() {
			return _index$27.classMethod;
		}
	});
	Object.defineProperty(exports, "ClassPrivateMethod", {
		enumerable: true,
		get: function() {
			return _index$27.classPrivateMethod;
		}
	});
	Object.defineProperty(exports, "ClassPrivateProperty", {
		enumerable: true,
		get: function() {
			return _index$27.classPrivateProperty;
		}
	});
	Object.defineProperty(exports, "ClassProperty", {
		enumerable: true,
		get: function() {
			return _index$27.classProperty;
		}
	});
	Object.defineProperty(exports, "ConditionalExpression", {
		enumerable: true,
		get: function() {
			return _index$27.conditionalExpression;
		}
	});
	Object.defineProperty(exports, "ContinueStatement", {
		enumerable: true,
		get: function() {
			return _index$27.continueStatement;
		}
	});
	Object.defineProperty(exports, "DebuggerStatement", {
		enumerable: true,
		get: function() {
			return _index$27.debuggerStatement;
		}
	});
	Object.defineProperty(exports, "DecimalLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.decimalLiteral;
		}
	});
	Object.defineProperty(exports, "DeclareClass", {
		enumerable: true,
		get: function() {
			return _index$27.declareClass;
		}
	});
	Object.defineProperty(exports, "DeclareExportAllDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.declareExportAllDeclaration;
		}
	});
	Object.defineProperty(exports, "DeclareExportDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.declareExportDeclaration;
		}
	});
	Object.defineProperty(exports, "DeclareFunction", {
		enumerable: true,
		get: function() {
			return _index$27.declareFunction;
		}
	});
	Object.defineProperty(exports, "DeclareInterface", {
		enumerable: true,
		get: function() {
			return _index$27.declareInterface;
		}
	});
	Object.defineProperty(exports, "DeclareModule", {
		enumerable: true,
		get: function() {
			return _index$27.declareModule;
		}
	});
	Object.defineProperty(exports, "DeclareModuleExports", {
		enumerable: true,
		get: function() {
			return _index$27.declareModuleExports;
		}
	});
	Object.defineProperty(exports, "DeclareOpaqueType", {
		enumerable: true,
		get: function() {
			return _index$27.declareOpaqueType;
		}
	});
	Object.defineProperty(exports, "DeclareTypeAlias", {
		enumerable: true,
		get: function() {
			return _index$27.declareTypeAlias;
		}
	});
	Object.defineProperty(exports, "DeclareVariable", {
		enumerable: true,
		get: function() {
			return _index$27.declareVariable;
		}
	});
	Object.defineProperty(exports, "DeclaredPredicate", {
		enumerable: true,
		get: function() {
			return _index$27.declaredPredicate;
		}
	});
	Object.defineProperty(exports, "Decorator", {
		enumerable: true,
		get: function() {
			return _index$27.decorator;
		}
	});
	Object.defineProperty(exports, "Directive", {
		enumerable: true,
		get: function() {
			return _index$27.directive;
		}
	});
	Object.defineProperty(exports, "DirectiveLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.directiveLiteral;
		}
	});
	Object.defineProperty(exports, "DoExpression", {
		enumerable: true,
		get: function() {
			return _index$27.doExpression;
		}
	});
	Object.defineProperty(exports, "DoWhileStatement", {
		enumerable: true,
		get: function() {
			return _index$27.doWhileStatement;
		}
	});
	Object.defineProperty(exports, "EmptyStatement", {
		enumerable: true,
		get: function() {
			return _index$27.emptyStatement;
		}
	});
	Object.defineProperty(exports, "EmptyTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.emptyTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "EnumBooleanBody", {
		enumerable: true,
		get: function() {
			return _index$27.enumBooleanBody;
		}
	});
	Object.defineProperty(exports, "EnumBooleanMember", {
		enumerable: true,
		get: function() {
			return _index$27.enumBooleanMember;
		}
	});
	Object.defineProperty(exports, "EnumDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.enumDeclaration;
		}
	});
	Object.defineProperty(exports, "EnumDefaultedMember", {
		enumerable: true,
		get: function() {
			return _index$27.enumDefaultedMember;
		}
	});
	Object.defineProperty(exports, "EnumNumberBody", {
		enumerable: true,
		get: function() {
			return _index$27.enumNumberBody;
		}
	});
	Object.defineProperty(exports, "EnumNumberMember", {
		enumerable: true,
		get: function() {
			return _index$27.enumNumberMember;
		}
	});
	Object.defineProperty(exports, "EnumStringBody", {
		enumerable: true,
		get: function() {
			return _index$27.enumStringBody;
		}
	});
	Object.defineProperty(exports, "EnumStringMember", {
		enumerable: true,
		get: function() {
			return _index$27.enumStringMember;
		}
	});
	Object.defineProperty(exports, "EnumSymbolBody", {
		enumerable: true,
		get: function() {
			return _index$27.enumSymbolBody;
		}
	});
	Object.defineProperty(exports, "ExistsTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.existsTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ExportAllDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.exportAllDeclaration;
		}
	});
	Object.defineProperty(exports, "ExportDefaultDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.exportDefaultDeclaration;
		}
	});
	Object.defineProperty(exports, "ExportDefaultSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.exportDefaultSpecifier;
		}
	});
	Object.defineProperty(exports, "ExportNamedDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.exportNamedDeclaration;
		}
	});
	Object.defineProperty(exports, "ExportNamespaceSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.exportNamespaceSpecifier;
		}
	});
	Object.defineProperty(exports, "ExportSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.exportSpecifier;
		}
	});
	Object.defineProperty(exports, "ExpressionStatement", {
		enumerable: true,
		get: function() {
			return _index$27.expressionStatement;
		}
	});
	Object.defineProperty(exports, "File", {
		enumerable: true,
		get: function() {
			return _index$27.file;
		}
	});
	Object.defineProperty(exports, "ForInStatement", {
		enumerable: true,
		get: function() {
			return _index$27.forInStatement;
		}
	});
	Object.defineProperty(exports, "ForOfStatement", {
		enumerable: true,
		get: function() {
			return _index$27.forOfStatement;
		}
	});
	Object.defineProperty(exports, "ForStatement", {
		enumerable: true,
		get: function() {
			return _index$27.forStatement;
		}
	});
	Object.defineProperty(exports, "FunctionDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.functionDeclaration;
		}
	});
	Object.defineProperty(exports, "FunctionExpression", {
		enumerable: true,
		get: function() {
			return _index$27.functionExpression;
		}
	});
	Object.defineProperty(exports, "FunctionTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.functionTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "FunctionTypeParam", {
		enumerable: true,
		get: function() {
			return _index$27.functionTypeParam;
		}
	});
	Object.defineProperty(exports, "GenericTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.genericTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "Identifier", {
		enumerable: true,
		get: function() {
			return _index$27.identifier;
		}
	});
	Object.defineProperty(exports, "IfStatement", {
		enumerable: true,
		get: function() {
			return _index$27.ifStatement;
		}
	});
	Object.defineProperty(exports, "Import", {
		enumerable: true,
		get: function() {
			return _index$27.import;
		}
	});
	Object.defineProperty(exports, "ImportAttribute", {
		enumerable: true,
		get: function() {
			return _index$27.importAttribute;
		}
	});
	Object.defineProperty(exports, "ImportDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.importDeclaration;
		}
	});
	Object.defineProperty(exports, "ImportDefaultSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.importDefaultSpecifier;
		}
	});
	Object.defineProperty(exports, "ImportExpression", {
		enumerable: true,
		get: function() {
			return _index$27.importExpression;
		}
	});
	Object.defineProperty(exports, "ImportNamespaceSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.importNamespaceSpecifier;
		}
	});
	Object.defineProperty(exports, "ImportSpecifier", {
		enumerable: true,
		get: function() {
			return _index$27.importSpecifier;
		}
	});
	Object.defineProperty(exports, "IndexedAccessType", {
		enumerable: true,
		get: function() {
			return _index$27.indexedAccessType;
		}
	});
	Object.defineProperty(exports, "InferredPredicate", {
		enumerable: true,
		get: function() {
			return _index$27.inferredPredicate;
		}
	});
	Object.defineProperty(exports, "InterfaceDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.interfaceDeclaration;
		}
	});
	Object.defineProperty(exports, "InterfaceExtends", {
		enumerable: true,
		get: function() {
			return _index$27.interfaceExtends;
		}
	});
	Object.defineProperty(exports, "InterfaceTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.interfaceTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "InterpreterDirective", {
		enumerable: true,
		get: function() {
			return _index$27.interpreterDirective;
		}
	});
	Object.defineProperty(exports, "IntersectionTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.intersectionTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "JSXAttribute", {
		enumerable: true,
		get: function() {
			return _index$27.jsxAttribute;
		}
	});
	Object.defineProperty(exports, "JSXClosingElement", {
		enumerable: true,
		get: function() {
			return _index$27.jsxClosingElement;
		}
	});
	Object.defineProperty(exports, "JSXClosingFragment", {
		enumerable: true,
		get: function() {
			return _index$27.jsxClosingFragment;
		}
	});
	Object.defineProperty(exports, "JSXElement", {
		enumerable: true,
		get: function() {
			return _index$27.jsxElement;
		}
	});
	Object.defineProperty(exports, "JSXEmptyExpression", {
		enumerable: true,
		get: function() {
			return _index$27.jsxEmptyExpression;
		}
	});
	Object.defineProperty(exports, "JSXExpressionContainer", {
		enumerable: true,
		get: function() {
			return _index$27.jsxExpressionContainer;
		}
	});
	Object.defineProperty(exports, "JSXFragment", {
		enumerable: true,
		get: function() {
			return _index$27.jsxFragment;
		}
	});
	Object.defineProperty(exports, "JSXIdentifier", {
		enumerable: true,
		get: function() {
			return _index$27.jsxIdentifier;
		}
	});
	Object.defineProperty(exports, "JSXMemberExpression", {
		enumerable: true,
		get: function() {
			return _index$27.jsxMemberExpression;
		}
	});
	Object.defineProperty(exports, "JSXNamespacedName", {
		enumerable: true,
		get: function() {
			return _index$27.jsxNamespacedName;
		}
	});
	Object.defineProperty(exports, "JSXOpeningElement", {
		enumerable: true,
		get: function() {
			return _index$27.jsxOpeningElement;
		}
	});
	Object.defineProperty(exports, "JSXOpeningFragment", {
		enumerable: true,
		get: function() {
			return _index$27.jsxOpeningFragment;
		}
	});
	Object.defineProperty(exports, "JSXSpreadAttribute", {
		enumerable: true,
		get: function() {
			return _index$27.jsxSpreadAttribute;
		}
	});
	Object.defineProperty(exports, "JSXSpreadChild", {
		enumerable: true,
		get: function() {
			return _index$27.jsxSpreadChild;
		}
	});
	Object.defineProperty(exports, "JSXText", {
		enumerable: true,
		get: function() {
			return _index$27.jsxText;
		}
	});
	Object.defineProperty(exports, "LabeledStatement", {
		enumerable: true,
		get: function() {
			return _index$27.labeledStatement;
		}
	});
	Object.defineProperty(exports, "LogicalExpression", {
		enumerable: true,
		get: function() {
			return _index$27.logicalExpression;
		}
	});
	Object.defineProperty(exports, "MemberExpression", {
		enumerable: true,
		get: function() {
			return _index$27.memberExpression;
		}
	});
	Object.defineProperty(exports, "MetaProperty", {
		enumerable: true,
		get: function() {
			return _index$27.metaProperty;
		}
	});
	Object.defineProperty(exports, "MixedTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.mixedTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ModuleExpression", {
		enumerable: true,
		get: function() {
			return _index$27.moduleExpression;
		}
	});
	Object.defineProperty(exports, "NewExpression", {
		enumerable: true,
		get: function() {
			return _index$27.newExpression;
		}
	});
	Object.defineProperty(exports, "Noop", {
		enumerable: true,
		get: function() {
			return _index$27.noop;
		}
	});
	Object.defineProperty(exports, "NullLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.nullLiteral;
		}
	});
	Object.defineProperty(exports, "NullLiteralTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.nullLiteralTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "NullableTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.nullableTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "NumberLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.numberLiteral;
		}
	});
	Object.defineProperty(exports, "NumberLiteralTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.numberLiteralTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "NumberTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.numberTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "NumericLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.numericLiteral;
		}
	});
	Object.defineProperty(exports, "ObjectExpression", {
		enumerable: true,
		get: function() {
			return _index$27.objectExpression;
		}
	});
	Object.defineProperty(exports, "ObjectMethod", {
		enumerable: true,
		get: function() {
			return _index$27.objectMethod;
		}
	});
	Object.defineProperty(exports, "ObjectPattern", {
		enumerable: true,
		get: function() {
			return _index$27.objectPattern;
		}
	});
	Object.defineProperty(exports, "ObjectProperty", {
		enumerable: true,
		get: function() {
			return _index$27.objectProperty;
		}
	});
	Object.defineProperty(exports, "ObjectTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ObjectTypeCallProperty", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeCallProperty;
		}
	});
	Object.defineProperty(exports, "ObjectTypeIndexer", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeIndexer;
		}
	});
	Object.defineProperty(exports, "ObjectTypeInternalSlot", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeInternalSlot;
		}
	});
	Object.defineProperty(exports, "ObjectTypeProperty", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeProperty;
		}
	});
	Object.defineProperty(exports, "ObjectTypeSpreadProperty", {
		enumerable: true,
		get: function() {
			return _index$27.objectTypeSpreadProperty;
		}
	});
	Object.defineProperty(exports, "OpaqueType", {
		enumerable: true,
		get: function() {
			return _index$27.opaqueType;
		}
	});
	Object.defineProperty(exports, "OptionalCallExpression", {
		enumerable: true,
		get: function() {
			return _index$27.optionalCallExpression;
		}
	});
	Object.defineProperty(exports, "OptionalIndexedAccessType", {
		enumerable: true,
		get: function() {
			return _index$27.optionalIndexedAccessType;
		}
	});
	Object.defineProperty(exports, "OptionalMemberExpression", {
		enumerable: true,
		get: function() {
			return _index$27.optionalMemberExpression;
		}
	});
	Object.defineProperty(exports, "ParenthesizedExpression", {
		enumerable: true,
		get: function() {
			return _index$27.parenthesizedExpression;
		}
	});
	Object.defineProperty(exports, "PipelineBareFunction", {
		enumerable: true,
		get: function() {
			return _index$27.pipelineBareFunction;
		}
	});
	Object.defineProperty(exports, "PipelinePrimaryTopicReference", {
		enumerable: true,
		get: function() {
			return _index$27.pipelinePrimaryTopicReference;
		}
	});
	Object.defineProperty(exports, "PipelineTopicExpression", {
		enumerable: true,
		get: function() {
			return _index$27.pipelineTopicExpression;
		}
	});
	Object.defineProperty(exports, "Placeholder", {
		enumerable: true,
		get: function() {
			return _index$27.placeholder;
		}
	});
	Object.defineProperty(exports, "PrivateName", {
		enumerable: true,
		get: function() {
			return _index$27.privateName;
		}
	});
	Object.defineProperty(exports, "Program", {
		enumerable: true,
		get: function() {
			return _index$27.program;
		}
	});
	Object.defineProperty(exports, "QualifiedTypeIdentifier", {
		enumerable: true,
		get: function() {
			return _index$27.qualifiedTypeIdentifier;
		}
	});
	Object.defineProperty(exports, "RecordExpression", {
		enumerable: true,
		get: function() {
			return _index$27.recordExpression;
		}
	});
	Object.defineProperty(exports, "RegExpLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.regExpLiteral;
		}
	});
	Object.defineProperty(exports, "RegexLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.regexLiteral;
		}
	});
	Object.defineProperty(exports, "RestElement", {
		enumerable: true,
		get: function() {
			return _index$27.restElement;
		}
	});
	Object.defineProperty(exports, "RestProperty", {
		enumerable: true,
		get: function() {
			return _index$27.restProperty;
		}
	});
	Object.defineProperty(exports, "ReturnStatement", {
		enumerable: true,
		get: function() {
			return _index$27.returnStatement;
		}
	});
	Object.defineProperty(exports, "SequenceExpression", {
		enumerable: true,
		get: function() {
			return _index$27.sequenceExpression;
		}
	});
	Object.defineProperty(exports, "SpreadElement", {
		enumerable: true,
		get: function() {
			return _index$27.spreadElement;
		}
	});
	Object.defineProperty(exports, "SpreadProperty", {
		enumerable: true,
		get: function() {
			return _index$27.spreadProperty;
		}
	});
	Object.defineProperty(exports, "StaticBlock", {
		enumerable: true,
		get: function() {
			return _index$27.staticBlock;
		}
	});
	Object.defineProperty(exports, "StringLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.stringLiteral;
		}
	});
	Object.defineProperty(exports, "StringLiteralTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.stringLiteralTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "StringTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.stringTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "Super", {
		enumerable: true,
		get: function() {
			return _index$27.super;
		}
	});
	Object.defineProperty(exports, "SwitchCase", {
		enumerable: true,
		get: function() {
			return _index$27.switchCase;
		}
	});
	Object.defineProperty(exports, "SwitchStatement", {
		enumerable: true,
		get: function() {
			return _index$27.switchStatement;
		}
	});
	Object.defineProperty(exports, "SymbolTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.symbolTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "TSAnyKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsAnyKeyword;
		}
	});
	Object.defineProperty(exports, "TSArrayType", {
		enumerable: true,
		get: function() {
			return _index$27.tsArrayType;
		}
	});
	Object.defineProperty(exports, "TSAsExpression", {
		enumerable: true,
		get: function() {
			return _index$27.tsAsExpression;
		}
	});
	Object.defineProperty(exports, "TSBigIntKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsBigIntKeyword;
		}
	});
	Object.defineProperty(exports, "TSBooleanKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsBooleanKeyword;
		}
	});
	Object.defineProperty(exports, "TSCallSignatureDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsCallSignatureDeclaration;
		}
	});
	Object.defineProperty(exports, "TSConditionalType", {
		enumerable: true,
		get: function() {
			return _index$27.tsConditionalType;
		}
	});
	Object.defineProperty(exports, "TSConstructSignatureDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsConstructSignatureDeclaration;
		}
	});
	Object.defineProperty(exports, "TSConstructorType", {
		enumerable: true,
		get: function() {
			return _index$27.tsConstructorType;
		}
	});
	Object.defineProperty(exports, "TSDeclareFunction", {
		enumerable: true,
		get: function() {
			return _index$27.tsDeclareFunction;
		}
	});
	Object.defineProperty(exports, "TSDeclareMethod", {
		enumerable: true,
		get: function() {
			return _index$27.tsDeclareMethod;
		}
	});
	Object.defineProperty(exports, "TSEnumBody", {
		enumerable: true,
		get: function() {
			return _index$27.tsEnumBody;
		}
	});
	Object.defineProperty(exports, "TSEnumDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsEnumDeclaration;
		}
	});
	Object.defineProperty(exports, "TSEnumMember", {
		enumerable: true,
		get: function() {
			return _index$27.tsEnumMember;
		}
	});
	Object.defineProperty(exports, "TSExportAssignment", {
		enumerable: true,
		get: function() {
			return _index$27.tsExportAssignment;
		}
	});
	Object.defineProperty(exports, "TSExpressionWithTypeArguments", {
		enumerable: true,
		get: function() {
			return _index$27.tsExpressionWithTypeArguments;
		}
	});
	Object.defineProperty(exports, "TSExternalModuleReference", {
		enumerable: true,
		get: function() {
			return _index$27.tsExternalModuleReference;
		}
	});
	Object.defineProperty(exports, "TSFunctionType", {
		enumerable: true,
		get: function() {
			return _index$27.tsFunctionType;
		}
	});
	Object.defineProperty(exports, "TSImportEqualsDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsImportEqualsDeclaration;
		}
	});
	Object.defineProperty(exports, "TSImportType", {
		enumerable: true,
		get: function() {
			return _index$27.tsImportType;
		}
	});
	Object.defineProperty(exports, "TSIndexSignature", {
		enumerable: true,
		get: function() {
			return _index$27.tsIndexSignature;
		}
	});
	Object.defineProperty(exports, "TSIndexedAccessType", {
		enumerable: true,
		get: function() {
			return _index$27.tsIndexedAccessType;
		}
	});
	Object.defineProperty(exports, "TSInferType", {
		enumerable: true,
		get: function() {
			return _index$27.tsInferType;
		}
	});
	Object.defineProperty(exports, "TSInstantiationExpression", {
		enumerable: true,
		get: function() {
			return _index$27.tsInstantiationExpression;
		}
	});
	Object.defineProperty(exports, "TSInterfaceBody", {
		enumerable: true,
		get: function() {
			return _index$27.tsInterfaceBody;
		}
	});
	Object.defineProperty(exports, "TSInterfaceDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsInterfaceDeclaration;
		}
	});
	Object.defineProperty(exports, "TSIntersectionType", {
		enumerable: true,
		get: function() {
			return _index$27.tsIntersectionType;
		}
	});
	Object.defineProperty(exports, "TSIntrinsicKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsIntrinsicKeyword;
		}
	});
	Object.defineProperty(exports, "TSLiteralType", {
		enumerable: true,
		get: function() {
			return _index$27.tsLiteralType;
		}
	});
	Object.defineProperty(exports, "TSMappedType", {
		enumerable: true,
		get: function() {
			return _index$27.tsMappedType;
		}
	});
	Object.defineProperty(exports, "TSMethodSignature", {
		enumerable: true,
		get: function() {
			return _index$27.tsMethodSignature;
		}
	});
	Object.defineProperty(exports, "TSModuleBlock", {
		enumerable: true,
		get: function() {
			return _index$27.tsModuleBlock;
		}
	});
	Object.defineProperty(exports, "TSModuleDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsModuleDeclaration;
		}
	});
	Object.defineProperty(exports, "TSNamedTupleMember", {
		enumerable: true,
		get: function() {
			return _index$27.tsNamedTupleMember;
		}
	});
	Object.defineProperty(exports, "TSNamespaceExportDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsNamespaceExportDeclaration;
		}
	});
	Object.defineProperty(exports, "TSNeverKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsNeverKeyword;
		}
	});
	Object.defineProperty(exports, "TSNonNullExpression", {
		enumerable: true,
		get: function() {
			return _index$27.tsNonNullExpression;
		}
	});
	Object.defineProperty(exports, "TSNullKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsNullKeyword;
		}
	});
	Object.defineProperty(exports, "TSNumberKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsNumberKeyword;
		}
	});
	Object.defineProperty(exports, "TSObjectKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsObjectKeyword;
		}
	});
	Object.defineProperty(exports, "TSOptionalType", {
		enumerable: true,
		get: function() {
			return _index$27.tsOptionalType;
		}
	});
	Object.defineProperty(exports, "TSParameterProperty", {
		enumerable: true,
		get: function() {
			return _index$27.tsParameterProperty;
		}
	});
	Object.defineProperty(exports, "TSParenthesizedType", {
		enumerable: true,
		get: function() {
			return _index$27.tsParenthesizedType;
		}
	});
	Object.defineProperty(exports, "TSPropertySignature", {
		enumerable: true,
		get: function() {
			return _index$27.tsPropertySignature;
		}
	});
	Object.defineProperty(exports, "TSQualifiedName", {
		enumerable: true,
		get: function() {
			return _index$27.tsQualifiedName;
		}
	});
	Object.defineProperty(exports, "TSRestType", {
		enumerable: true,
		get: function() {
			return _index$27.tsRestType;
		}
	});
	Object.defineProperty(exports, "TSSatisfiesExpression", {
		enumerable: true,
		get: function() {
			return _index$27.tsSatisfiesExpression;
		}
	});
	Object.defineProperty(exports, "TSStringKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsStringKeyword;
		}
	});
	Object.defineProperty(exports, "TSSymbolKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsSymbolKeyword;
		}
	});
	Object.defineProperty(exports, "TSThisType", {
		enumerable: true,
		get: function() {
			return _index$27.tsThisType;
		}
	});
	Object.defineProperty(exports, "TSTupleType", {
		enumerable: true,
		get: function() {
			return _index$27.tsTupleType;
		}
	});
	Object.defineProperty(exports, "TSTypeAliasDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeAliasDeclaration;
		}
	});
	Object.defineProperty(exports, "TSTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "TSTypeAssertion", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeAssertion;
		}
	});
	Object.defineProperty(exports, "TSTypeLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeLiteral;
		}
	});
	Object.defineProperty(exports, "TSTypeOperator", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeOperator;
		}
	});
	Object.defineProperty(exports, "TSTypeParameter", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeParameter;
		}
	});
	Object.defineProperty(exports, "TSTypeParameterDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeParameterDeclaration;
		}
	});
	Object.defineProperty(exports, "TSTypeParameterInstantiation", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeParameterInstantiation;
		}
	});
	Object.defineProperty(exports, "TSTypePredicate", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypePredicate;
		}
	});
	Object.defineProperty(exports, "TSTypeQuery", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeQuery;
		}
	});
	Object.defineProperty(exports, "TSTypeReference", {
		enumerable: true,
		get: function() {
			return _index$27.tsTypeReference;
		}
	});
	Object.defineProperty(exports, "TSUndefinedKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsUndefinedKeyword;
		}
	});
	Object.defineProperty(exports, "TSUnionType", {
		enumerable: true,
		get: function() {
			return _index$27.tsUnionType;
		}
	});
	Object.defineProperty(exports, "TSUnknownKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsUnknownKeyword;
		}
	});
	Object.defineProperty(exports, "TSVoidKeyword", {
		enumerable: true,
		get: function() {
			return _index$27.tsVoidKeyword;
		}
	});
	Object.defineProperty(exports, "TaggedTemplateExpression", {
		enumerable: true,
		get: function() {
			return _index$27.taggedTemplateExpression;
		}
	});
	Object.defineProperty(exports, "TemplateElement", {
		enumerable: true,
		get: function() {
			return _index$27.templateElement;
		}
	});
	Object.defineProperty(exports, "TemplateLiteral", {
		enumerable: true,
		get: function() {
			return _index$27.templateLiteral;
		}
	});
	Object.defineProperty(exports, "ThisExpression", {
		enumerable: true,
		get: function() {
			return _index$27.thisExpression;
		}
	});
	Object.defineProperty(exports, "ThisTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.thisTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "ThrowStatement", {
		enumerable: true,
		get: function() {
			return _index$27.throwStatement;
		}
	});
	Object.defineProperty(exports, "TopicReference", {
		enumerable: true,
		get: function() {
			return _index$27.topicReference;
		}
	});
	Object.defineProperty(exports, "TryStatement", {
		enumerable: true,
		get: function() {
			return _index$27.tryStatement;
		}
	});
	Object.defineProperty(exports, "TupleExpression", {
		enumerable: true,
		get: function() {
			return _index$27.tupleExpression;
		}
	});
	Object.defineProperty(exports, "TupleTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.tupleTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "TypeAlias", {
		enumerable: true,
		get: function() {
			return _index$27.typeAlias;
		}
	});
	Object.defineProperty(exports, "TypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.typeAnnotation;
		}
	});
	Object.defineProperty(exports, "TypeCastExpression", {
		enumerable: true,
		get: function() {
			return _index$27.typeCastExpression;
		}
	});
	Object.defineProperty(exports, "TypeParameter", {
		enumerable: true,
		get: function() {
			return _index$27.typeParameter;
		}
	});
	Object.defineProperty(exports, "TypeParameterDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.typeParameterDeclaration;
		}
	});
	Object.defineProperty(exports, "TypeParameterInstantiation", {
		enumerable: true,
		get: function() {
			return _index$27.typeParameterInstantiation;
		}
	});
	Object.defineProperty(exports, "TypeofTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.typeofTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "UnaryExpression", {
		enumerable: true,
		get: function() {
			return _index$27.unaryExpression;
		}
	});
	Object.defineProperty(exports, "UnionTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.unionTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "UpdateExpression", {
		enumerable: true,
		get: function() {
			return _index$27.updateExpression;
		}
	});
	Object.defineProperty(exports, "V8IntrinsicIdentifier", {
		enumerable: true,
		get: function() {
			return _index$27.v8IntrinsicIdentifier;
		}
	});
	Object.defineProperty(exports, "VariableDeclaration", {
		enumerable: true,
		get: function() {
			return _index$27.variableDeclaration;
		}
	});
	Object.defineProperty(exports, "VariableDeclarator", {
		enumerable: true,
		get: function() {
			return _index$27.variableDeclarator;
		}
	});
	Object.defineProperty(exports, "Variance", {
		enumerable: true,
		get: function() {
			return _index$27.variance;
		}
	});
	Object.defineProperty(exports, "VoidTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _index$27.voidTypeAnnotation;
		}
	});
	Object.defineProperty(exports, "WhileStatement", {
		enumerable: true,
		get: function() {
			return _index$27.whileStatement;
		}
	});
	Object.defineProperty(exports, "WithStatement", {
		enumerable: true,
		get: function() {
			return _index$27.withStatement;
		}
	});
	Object.defineProperty(exports, "YieldExpression", {
		enumerable: true,
		get: function() {
			return _index$27.yieldExpression;
		}
	});
	var _index$27 = require_generated$2();
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/productions.js
var require_productions = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/builders/productions.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.buildUndefinedNode = buildUndefinedNode;
	var _index$26 = require_generated$2();
	function buildUndefinedNode() {
		return (0, _index$26.unaryExpression)("void", (0, _index$26.numericLiteral)(0), true);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneNode.js
var require_cloneNode = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneNode.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = cloneNode;
	var _index$25 = require_definitions();
	var _index2$8 = require_generated$3();
	const { hasOwn } = { hasOwn: Function.call.bind(Object.prototype.hasOwnProperty) };
	function cloneIfNode(obj, deep, withoutLoc, commentsCache) {
		if (obj && typeof obj.type === "string") return cloneNodeInternal(obj, deep, withoutLoc, commentsCache);
		return obj;
	}
	function cloneIfNodeOrArray(obj, deep, withoutLoc, commentsCache) {
		if (Array.isArray(obj)) return obj.map((node) => cloneIfNode(node, deep, withoutLoc, commentsCache));
		return cloneIfNode(obj, deep, withoutLoc, commentsCache);
	}
	function cloneNode(node, deep = true, withoutLoc = false) {
		return cloneNodeInternal(node, deep, withoutLoc, new Map());
	}
	function cloneNodeInternal(node, deep = true, withoutLoc = false, commentsCache) {
		if (!node) return node;
		const { type } = node;
		const newNode = { type: node.type };
		if ((0, _index2$8.isIdentifier)(node)) {
			newNode.name = node.name;
			if (hasOwn(node, "optional") && typeof node.optional === "boolean") newNode.optional = node.optional;
			if (hasOwn(node, "typeAnnotation")) newNode.typeAnnotation = deep ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc, commentsCache) : node.typeAnnotation;
			if (hasOwn(node, "decorators")) newNode.decorators = deep ? cloneIfNodeOrArray(node.decorators, true, withoutLoc, commentsCache) : node.decorators;
		} else if (!hasOwn(_index$25.NODE_FIELDS, type)) throw new Error(`Unknown node type: "${type}"`);
		else for (const field of Object.keys(_index$25.NODE_FIELDS[type])) if (hasOwn(node, field)) if (deep) newNode[field] = (0, _index2$8.isFile)(node) && field === "comments" ? maybeCloneComments(node.comments, deep, withoutLoc, commentsCache) : cloneIfNodeOrArray(node[field], true, withoutLoc, commentsCache);
		else newNode[field] = node[field];
		if (hasOwn(node, "loc")) if (withoutLoc) newNode.loc = null;
		else newNode.loc = node.loc;
		if (hasOwn(node, "leadingComments")) newNode.leadingComments = maybeCloneComments(node.leadingComments, deep, withoutLoc, commentsCache);
		if (hasOwn(node, "innerComments")) newNode.innerComments = maybeCloneComments(node.innerComments, deep, withoutLoc, commentsCache);
		if (hasOwn(node, "trailingComments")) newNode.trailingComments = maybeCloneComments(node.trailingComments, deep, withoutLoc, commentsCache);
		if (hasOwn(node, "extra")) newNode.extra = Object.assign({}, node.extra);
		return newNode;
	}
	function maybeCloneComments(comments, deep, withoutLoc, commentsCache) {
		if (!comments || !deep) return comments;
		return comments.map((comment) => {
			const cache = commentsCache.get(comment);
			if (cache) return cache;
			const { type, value, loc } = comment;
			const ret = {
				type,
				value,
				loc
			};
			if (withoutLoc) ret.loc = null;
			commentsCache.set(comment, ret);
			return ret;
		});
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/clone.js
var require_clone = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/clone.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = clone;
	var _cloneNode$6 = require_cloneNode();
	function clone(node) {
		return (0, _cloneNode$6.default)(node, false);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneDeep.js
var require_cloneDeep = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneDeep.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = cloneDeep;
	var _cloneNode$5 = require_cloneNode();
	function cloneDeep(node) {
		return (0, _cloneNode$5.default)(node);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneDeepWithoutLoc.js
var require_cloneDeepWithoutLoc = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneDeepWithoutLoc.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = cloneDeepWithoutLoc;
	var _cloneNode$4 = require_cloneNode();
	function cloneDeepWithoutLoc(node) {
		return (0, _cloneNode$4.default)(node, true, true);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneWithoutLoc.js
var require_cloneWithoutLoc = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/clone/cloneWithoutLoc.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = cloneWithoutLoc;
	var _cloneNode$3 = require_cloneNode();
	function cloneWithoutLoc(node) {
		return (0, _cloneNode$3.default)(node, false, true);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/addComments.js
var require_addComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/addComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = addComments;
	function addComments(node, type, comments) {
		if (!comments || !node) return node;
		const key = `${type}Comments`;
		if (node[key]) if (type === "leading") node[key] = comments.concat(node[key]);
		else node[key].push(...comments);
		else node[key] = comments;
		return node;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/addComment.js
var require_addComment = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/addComment.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = addComment;
	var _addComments$1 = require_addComments();
	function addComment(node, type, content, line) {
		return (0, _addComments$1.default)(node, type, [{
			type: line ? "CommentLine" : "CommentBlock",
			value: content
		}]);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/inherit.js
var require_inherit = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/utils/inherit.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inherit;
	function inherit(key, child, parent) {
		if (child && parent) child[key] = Array.from(new Set([].concat(child[key], parent[key]).filter(Boolean)));
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritInnerComments.js
var require_inheritInnerComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritInnerComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inheritInnerComments;
	var _inherit$2 = require_inherit();
	function inheritInnerComments(child, parent) {
		(0, _inherit$2.default)("innerComments", child, parent);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritLeadingComments.js
var require_inheritLeadingComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritLeadingComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inheritLeadingComments;
	var _inherit$1 = require_inherit();
	function inheritLeadingComments(child, parent) {
		(0, _inherit$1.default)("leadingComments", child, parent);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritTrailingComments.js
var require_inheritTrailingComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritTrailingComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inheritTrailingComments;
	var _inherit = require_inherit();
	function inheritTrailingComments(child, parent) {
		(0, _inherit.default)("trailingComments", child, parent);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritsComments.js
var require_inheritsComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/inheritsComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inheritsComments;
	var _inheritTrailingComments$1 = require_inheritTrailingComments();
	var _inheritLeadingComments$1 = require_inheritLeadingComments();
	var _inheritInnerComments$1 = require_inheritInnerComments();
	function inheritsComments(child, parent) {
		(0, _inheritTrailingComments$1.default)(child, parent);
		(0, _inheritLeadingComments$1.default)(child, parent);
		(0, _inheritInnerComments$1.default)(child, parent);
		return child;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/removeComments.js
var require_removeComments = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/comments/removeComments.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removeComments;
	var _index$24 = require_constants();
	function removeComments(node) {
		_index$24.COMMENT_KEYS.forEach((key) => {
			node[key] = null;
		});
		return node;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/constants/generated/index.js
var require_generated = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/constants/generated/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WHILE_TYPES = exports.USERWHITESPACABLE_TYPES = exports.UNARYLIKE_TYPES = exports.TYPESCRIPT_TYPES = exports.TSTYPE_TYPES = exports.TSTYPEELEMENT_TYPES = exports.TSENTITYNAME_TYPES = exports.TSBASETYPE_TYPES = exports.TERMINATORLESS_TYPES = exports.STATEMENT_TYPES = exports.STANDARDIZED_TYPES = exports.SCOPABLE_TYPES = exports.PUREISH_TYPES = exports.PROPERTY_TYPES = exports.PRIVATE_TYPES = exports.PATTERN_TYPES = exports.PATTERNLIKE_TYPES = exports.OBJECTMEMBER_TYPES = exports.MODULESPECIFIER_TYPES = exports.MODULEDECLARATION_TYPES = exports.MISCELLANEOUS_TYPES = exports.METHOD_TYPES = exports.LVAL_TYPES = exports.LOOP_TYPES = exports.LITERAL_TYPES = exports.JSX_TYPES = exports.IMPORTOREXPORTDECLARATION_TYPES = exports.IMMUTABLE_TYPES = exports.FUNCTION_TYPES = exports.FUNCTIONPARENT_TYPES = exports.FOR_TYPES = exports.FORXSTATEMENT_TYPES = exports.FLOW_TYPES = exports.FLOWTYPE_TYPES = exports.FLOWPREDICATE_TYPES = exports.FLOWDECLARATION_TYPES = exports.FLOWBASEANNOTATION_TYPES = exports.EXPRESSION_TYPES = exports.EXPRESSIONWRAPPER_TYPES = exports.EXPORTDECLARATION_TYPES = exports.ENUMMEMBER_TYPES = exports.ENUMBODY_TYPES = exports.DECLARATION_TYPES = exports.CONDITIONAL_TYPES = exports.COMPLETIONSTATEMENT_TYPES = exports.CLASS_TYPES = exports.BLOCK_TYPES = exports.BLOCKPARENT_TYPES = exports.BINARY_TYPES = exports.ACCESSOR_TYPES = void 0;
	var _index$23 = require_definitions();
	const STANDARDIZED_TYPES = exports.STANDARDIZED_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Standardized"];
	const EXPRESSION_TYPES = exports.EXPRESSION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Expression"];
	const BINARY_TYPES = exports.BINARY_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Binary"];
	const SCOPABLE_TYPES = exports.SCOPABLE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Scopable"];
	const BLOCKPARENT_TYPES = exports.BLOCKPARENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["BlockParent"];
	const BLOCK_TYPES = exports.BLOCK_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Block"];
	const STATEMENT_TYPES = exports.STATEMENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Statement"];
	const TERMINATORLESS_TYPES = exports.TERMINATORLESS_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Terminatorless"];
	const COMPLETIONSTATEMENT_TYPES = exports.COMPLETIONSTATEMENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["CompletionStatement"];
	const CONDITIONAL_TYPES = exports.CONDITIONAL_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Conditional"];
	const LOOP_TYPES = exports.LOOP_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Loop"];
	const WHILE_TYPES = exports.WHILE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["While"];
	const EXPRESSIONWRAPPER_TYPES = exports.EXPRESSIONWRAPPER_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ExpressionWrapper"];
	const FOR_TYPES = exports.FOR_TYPES = _index$23.FLIPPED_ALIAS_KEYS["For"];
	const FORXSTATEMENT_TYPES = exports.FORXSTATEMENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ForXStatement"];
	const FUNCTION_TYPES = exports.FUNCTION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Function"];
	const FUNCTIONPARENT_TYPES = exports.FUNCTIONPARENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["FunctionParent"];
	const PUREISH_TYPES = exports.PUREISH_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Pureish"];
	const DECLARATION_TYPES = exports.DECLARATION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Declaration"];
	const PATTERNLIKE_TYPES = exports.PATTERNLIKE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["PatternLike"];
	const LVAL_TYPES = exports.LVAL_TYPES = _index$23.FLIPPED_ALIAS_KEYS["LVal"];
	const TSENTITYNAME_TYPES = exports.TSENTITYNAME_TYPES = _index$23.FLIPPED_ALIAS_KEYS["TSEntityName"];
	const LITERAL_TYPES = exports.LITERAL_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Literal"];
	const IMMUTABLE_TYPES = exports.IMMUTABLE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Immutable"];
	const USERWHITESPACABLE_TYPES = exports.USERWHITESPACABLE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["UserWhitespacable"];
	const METHOD_TYPES = exports.METHOD_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Method"];
	const OBJECTMEMBER_TYPES = exports.OBJECTMEMBER_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ObjectMember"];
	const PROPERTY_TYPES = exports.PROPERTY_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Property"];
	const UNARYLIKE_TYPES = exports.UNARYLIKE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["UnaryLike"];
	const PATTERN_TYPES = exports.PATTERN_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Pattern"];
	const CLASS_TYPES = exports.CLASS_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Class"];
	const IMPORTOREXPORTDECLARATION_TYPES = exports.IMPORTOREXPORTDECLARATION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ImportOrExportDeclaration"];
	const EXPORTDECLARATION_TYPES = exports.EXPORTDECLARATION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ExportDeclaration"];
	const MODULESPECIFIER_TYPES = exports.MODULESPECIFIER_TYPES = _index$23.FLIPPED_ALIAS_KEYS["ModuleSpecifier"];
	const ACCESSOR_TYPES = exports.ACCESSOR_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Accessor"];
	const PRIVATE_TYPES = exports.PRIVATE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Private"];
	const FLOW_TYPES = exports.FLOW_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Flow"];
	const FLOWTYPE_TYPES = exports.FLOWTYPE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["FlowType"];
	const FLOWBASEANNOTATION_TYPES = exports.FLOWBASEANNOTATION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["FlowBaseAnnotation"];
	const FLOWDECLARATION_TYPES = exports.FLOWDECLARATION_TYPES = _index$23.FLIPPED_ALIAS_KEYS["FlowDeclaration"];
	const FLOWPREDICATE_TYPES = exports.FLOWPREDICATE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["FlowPredicate"];
	const ENUMBODY_TYPES = exports.ENUMBODY_TYPES = _index$23.FLIPPED_ALIAS_KEYS["EnumBody"];
	const ENUMMEMBER_TYPES = exports.ENUMMEMBER_TYPES = _index$23.FLIPPED_ALIAS_KEYS["EnumMember"];
	const JSX_TYPES = exports.JSX_TYPES = _index$23.FLIPPED_ALIAS_KEYS["JSX"];
	const MISCELLANEOUS_TYPES = exports.MISCELLANEOUS_TYPES = _index$23.FLIPPED_ALIAS_KEYS["Miscellaneous"];
	const TYPESCRIPT_TYPES = exports.TYPESCRIPT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["TypeScript"];
	const TSTYPEELEMENT_TYPES = exports.TSTYPEELEMENT_TYPES = _index$23.FLIPPED_ALIAS_KEYS["TSTypeElement"];
	const TSTYPE_TYPES = exports.TSTYPE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["TSType"];
	const TSBASETYPE_TYPES = exports.TSBASETYPE_TYPES = _index$23.FLIPPED_ALIAS_KEYS["TSBaseType"];
	const MODULEDECLARATION_TYPES = exports.MODULEDECLARATION_TYPES = IMPORTOREXPORTDECLARATION_TYPES;
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toBlock.js
var require_toBlock = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toBlock.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toBlock;
	var _index$22 = require_generated$3();
	var _index2$7 = require_generated$2();
	function toBlock(node, parent) {
		if ((0, _index$22.isBlockStatement)(node)) return node;
		let blockNodes = [];
		if ((0, _index$22.isEmptyStatement)(node)) blockNodes = [];
		else {
			if (!(0, _index$22.isStatement)(node)) if ((0, _index$22.isFunction)(parent)) node = (0, _index2$7.returnStatement)(node);
			else node = (0, _index2$7.expressionStatement)(node);
			blockNodes = [node];
		}
		return (0, _index2$7.blockStatement)(blockNodes);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/ensureBlock.js
var require_ensureBlock = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/ensureBlock.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ensureBlock;
	var _toBlock$1 = require_toBlock();
	function ensureBlock(node, key = "body") {
		const result = (0, _toBlock$1.default)(node[key], node);
		node[key] = result;
		return result;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toIdentifier.js
var require_toIdentifier = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toIdentifier.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toIdentifier;
	var _isValidIdentifier$3 = require_isValidIdentifier();
	var _helperValidatorIdentifier = require_lib$2();
	function toIdentifier(input) {
		input = input + "";
		let name = "";
		for (const c of input) name += (0, _helperValidatorIdentifier.isIdentifierChar)(c.codePointAt(0)) ? c : "-";
		name = name.replace(/^[-0-9]+/, "");
		name = name.replace(/[-\s]+(.)?/g, function(match$1, c) {
			return c ? c.toUpperCase() : "";
		});
		if (!(0, _isValidIdentifier$3.default)(name)) name = `_${name}`;
		return name || "_";
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toBindingIdentifierName.js
var require_toBindingIdentifierName = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toBindingIdentifierName.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toBindingIdentifierName;
	var _toIdentifier$1 = require_toIdentifier();
	function toBindingIdentifierName(name) {
		name = (0, _toIdentifier$1.default)(name);
		if (name === "eval" || name === "arguments") name = "_" + name;
		return name;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toComputedKey.js
var require_toComputedKey = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toComputedKey.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toComputedKey;
	var _index$21 = require_generated$3();
	var _index2$6 = require_generated$2();
	function toComputedKey(node, key = node.key || node.property) {
		if (!node.computed && (0, _index$21.isIdentifier)(key)) key = (0, _index2$6.stringLiteral)(key.name);
		return key;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toExpression.js
var require_toExpression = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toExpression.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _index$20 = require_generated$3();
	var _default$3 = exports.default = toExpression;
	function toExpression(node) {
		if ((0, _index$20.isExpressionStatement)(node)) node = node.expression;
		if ((0, _index$20.isExpression)(node)) return node;
		if ((0, _index$20.isClass)(node)) node.type = "ClassExpression";
		else if ((0, _index$20.isFunction)(node)) node.type = "FunctionExpression";
		if (!(0, _index$20.isExpression)(node)) throw new Error(`cannot turn ${node.type} to an expression`);
		return node;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/traverse/traverseFast.js
var require_traverseFast = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/traverse/traverseFast.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = traverseFast;
	var _index$19 = require_definitions();
	function traverseFast(node, enter, opts) {
		if (!node) return;
		const keys$1 = _index$19.VISITOR_KEYS[node.type];
		if (!keys$1) return;
		opts = opts || {};
		enter(node, opts);
		for (const key of keys$1) {
			const subNode = node[key];
			if (Array.isArray(subNode)) for (const node$1 of subNode) traverseFast(node$1, enter, opts);
			else traverseFast(subNode, enter, opts);
		}
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/removeProperties.js
var require_removeProperties = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/removeProperties.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removeProperties;
	var _index$18 = require_constants();
	const CLEAR_KEYS = [
		"tokens",
		"start",
		"end",
		"loc",
		"raw",
		"rawValue"
	];
	const CLEAR_KEYS_PLUS_COMMENTS = [
		..._index$18.COMMENT_KEYS,
		"comments",
		...CLEAR_KEYS
	];
	function removeProperties(node, opts = {}) {
		const map = opts.preserveComments ? CLEAR_KEYS : CLEAR_KEYS_PLUS_COMMENTS;
		for (const key of map) if (node[key] != null) node[key] = void 0;
		for (const key of Object.keys(node)) if (key[0] === "_" && node[key] != null) node[key] = void 0;
		const symbols = Object.getOwnPropertySymbols(node);
		for (const sym of symbols) node[sym] = null;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/removePropertiesDeep.js
var require_removePropertiesDeep = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/removePropertiesDeep.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removePropertiesDeep;
	var _traverseFast$1 = require_traverseFast();
	var _removeProperties$1 = require_removeProperties();
	function removePropertiesDeep(tree, opts) {
		(0, _traverseFast$1.default)(tree, _removeProperties$1.default, opts);
		return tree;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toKeyAlias.js
var require_toKeyAlias = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toKeyAlias.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toKeyAlias;
	var _index$17 = require_generated$3();
	var _cloneNode$2 = require_cloneNode();
	var _removePropertiesDeep$1 = require_removePropertiesDeep();
	function toKeyAlias(node, key = node.key) {
		let alias;
		if (node.kind === "method") return toKeyAlias.increment() + "";
		else if ((0, _index$17.isIdentifier)(key)) alias = key.name;
		else if ((0, _index$17.isStringLiteral)(key)) alias = JSON.stringify(key.value);
		else alias = JSON.stringify((0, _removePropertiesDeep$1.default)((0, _cloneNode$2.default)(key)));
		if (node.computed) alias = `[${alias}]`;
		if (node.static) alias = `static:${alias}`;
		return alias;
	}
	toKeyAlias.uid = 0;
	toKeyAlias.increment = function() {
		if (toKeyAlias.uid >= Number.MAX_SAFE_INTEGER) return toKeyAlias.uid = 0;
		else return toKeyAlias.uid++;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toStatement.js
var require_toStatement = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toStatement.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _index$16 = require_generated$3();
	var _index2$5 = require_generated$2();
	var _default$2 = exports.default = toStatement;
	function toStatement(node, ignore) {
		if ((0, _index$16.isStatement)(node)) return node;
		let mustHaveId = false;
		let newType;
		if ((0, _index$16.isClass)(node)) {
			mustHaveId = true;
			newType = "ClassDeclaration";
		} else if ((0, _index$16.isFunction)(node)) {
			mustHaveId = true;
			newType = "FunctionDeclaration";
		} else if ((0, _index$16.isAssignmentExpression)(node)) return (0, _index2$5.expressionStatement)(node);
		if (mustHaveId && !node.id) newType = false;
		if (!newType) if (ignore) return false;
		else throw new Error(`cannot turn ${node.type} to a statement`);
		node.type = newType;
		return node;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/valueToNode.js
var require_valueToNode = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/valueToNode.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _isValidIdentifier$2 = require_isValidIdentifier();
	var _index$15 = require_generated$2();
	var _default$1 = exports.default = valueToNode;
	const objectToString = Function.call.bind(Object.prototype.toString);
	function isRegExp(value) {
		return objectToString(value) === "[object RegExp]";
	}
	function isPlainObject(value) {
		if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]") return false;
		const proto = Object.getPrototypeOf(value);
		return proto === null || Object.getPrototypeOf(proto) === null;
	}
	function valueToNode(value) {
		if (value === void 0) return (0, _index$15.identifier)("undefined");
		if (value === true || value === false) return (0, _index$15.booleanLiteral)(value);
		if (value === null) return (0, _index$15.nullLiteral)();
		if (typeof value === "string") return (0, _index$15.stringLiteral)(value);
		if (typeof value === "number") {
			let result;
			if (Number.isFinite(value)) result = (0, _index$15.numericLiteral)(Math.abs(value));
			else {
				let numerator;
				if (Number.isNaN(value)) numerator = (0, _index$15.numericLiteral)(0);
				else numerator = (0, _index$15.numericLiteral)(1);
				result = (0, _index$15.binaryExpression)("/", numerator, (0, _index$15.numericLiteral)(0));
			}
			if (value < 0 || Object.is(value, -0)) result = (0, _index$15.unaryExpression)("-", result);
			return result;
		}
		if (isRegExp(value)) {
			const pattern$1 = value.source;
			const flags = /\/([a-z]*)$/.exec(value.toString())[1];
			return (0, _index$15.regExpLiteral)(pattern$1, flags);
		}
		if (Array.isArray(value)) return (0, _index$15.arrayExpression)(value.map(valueToNode));
		if (isPlainObject(value)) {
			const props = [];
			for (const key of Object.keys(value)) {
				let nodeKey;
				if ((0, _isValidIdentifier$2.default)(key)) nodeKey = (0, _index$15.identifier)(key);
				else nodeKey = (0, _index$15.stringLiteral)(key);
				props.push((0, _index$15.objectProperty)(nodeKey, valueToNode(value[key])));
			}
			return (0, _index$15.objectExpression)(props);
		}
		throw new Error("don't know how to turn this value into a node");
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/appendToMemberExpression.js
var require_appendToMemberExpression = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/appendToMemberExpression.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = appendToMemberExpression;
	var _index$14 = require_generated$2();
	function appendToMemberExpression(member, append$1, computed = false) {
		member.object = (0, _index$14.memberExpression)(member.object, member.property, member.computed);
		member.property = append$1;
		member.computed = !!computed;
		return member;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/inherits.js
var require_inherits = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/inherits.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = inherits;
	var _index$13 = require_constants();
	var _inheritsComments$1 = require_inheritsComments();
	function inherits(child, parent) {
		if (!child || !parent) return child;
		for (const key of _index$13.INHERIT_KEYS.optional) if (child[key] == null) child[key] = parent[key];
		for (const key of Object.keys(parent)) if (key[0] === "_" && key !== "__clone") child[key] = parent[key];
		for (const key of _index$13.INHERIT_KEYS.force) child[key] = parent[key];
		(0, _inheritsComments$1.default)(child, parent);
		return child;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/prependToMemberExpression.js
var require_prependToMemberExpression = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/modifications/prependToMemberExpression.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = prependToMemberExpression;
	var _index$12 = require_generated$2();
	var _index2$4 = require_lib();
	function prependToMemberExpression(member, prepend) {
		if ((0, _index2$4.isSuper)(member.object)) throw new Error("Cannot prepend node to super property access (`super.foo`).");
		member.object = (0, _index$12.memberExpression)(prepend, member.object);
		return member;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getAssignmentIdentifiers.js
var require_getAssignmentIdentifiers = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getAssignmentIdentifiers.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = getAssignmentIdentifiers;
	function getAssignmentIdentifiers(node) {
		const search = [].concat(node);
		const ids = Object.create(null);
		while (search.length) {
			const id = search.pop();
			if (!id) continue;
			switch (id.type) {
				case "ArrayPattern":
					search.push(...id.elements);
					break;
				case "AssignmentExpression":
				case "AssignmentPattern":
				case "ForInStatement":
				case "ForOfStatement":
					search.push(id.left);
					break;
				case "ObjectPattern":
					search.push(...id.properties);
					break;
				case "ObjectProperty":
					search.push(id.value);
					break;
				case "RestElement":
				case "UpdateExpression":
					search.push(id.argument);
					break;
				case "UnaryExpression":
					if (id.operator === "delete") search.push(id.argument);
					break;
				case "Identifier":
					ids[id.name] = id;
					break;
				default: break;
			}
		}
		return ids;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getBindingIdentifiers.js
var require_getBindingIdentifiers = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getBindingIdentifiers.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = getBindingIdentifiers;
	var _index$11 = require_generated$3();
	function getBindingIdentifiers(node, duplicates, outerOnly, newBindingsOnly) {
		const search = [].concat(node);
		const ids = Object.create(null);
		while (search.length) {
			const id = search.shift();
			if (!id) continue;
			if (newBindingsOnly && ((0, _index$11.isAssignmentExpression)(id) || (0, _index$11.isUnaryExpression)(id) || (0, _index$11.isUpdateExpression)(id))) continue;
			if ((0, _index$11.isIdentifier)(id)) {
				if (duplicates) {
					const _ids = ids[id.name] = ids[id.name] || [];
					_ids.push(id);
				} else ids[id.name] = id;
				continue;
			}
			if ((0, _index$11.isExportDeclaration)(id) && !(0, _index$11.isExportAllDeclaration)(id)) {
				if ((0, _index$11.isDeclaration)(id.declaration)) search.push(id.declaration);
				continue;
			}
			if (outerOnly) {
				if ((0, _index$11.isFunctionDeclaration)(id)) {
					search.push(id.id);
					continue;
				}
				if ((0, _index$11.isFunctionExpression)(id)) continue;
			}
			const keys$1 = getBindingIdentifiers.keys[id.type];
			if (keys$1) for (let i = 0; i < keys$1.length; i++) {
				const key = keys$1[i];
				const nodes = id[key];
				if (nodes) if (Array.isArray(nodes)) search.push(...nodes);
				else search.push(nodes);
			}
		}
		return ids;
	}
	const keys = {
		DeclareClass: ["id"],
		DeclareFunction: ["id"],
		DeclareModule: ["id"],
		DeclareVariable: ["id"],
		DeclareInterface: ["id"],
		DeclareTypeAlias: ["id"],
		DeclareOpaqueType: ["id"],
		InterfaceDeclaration: ["id"],
		TypeAlias: ["id"],
		OpaqueType: ["id"],
		CatchClause: ["param"],
		LabeledStatement: ["label"],
		UnaryExpression: ["argument"],
		AssignmentExpression: ["left"],
		ImportSpecifier: ["local"],
		ImportNamespaceSpecifier: ["local"],
		ImportDefaultSpecifier: ["local"],
		ImportDeclaration: ["specifiers"],
		TSImportEqualsDeclaration: ["id"],
		ExportSpecifier: ["exported"],
		ExportNamespaceSpecifier: ["exported"],
		ExportDefaultSpecifier: ["exported"],
		FunctionDeclaration: ["id", "params"],
		FunctionExpression: ["id", "params"],
		ArrowFunctionExpression: ["params"],
		ObjectMethod: ["params"],
		ClassMethod: ["params"],
		ClassPrivateMethod: ["params"],
		ForInStatement: ["left"],
		ForOfStatement: ["left"],
		ClassDeclaration: ["id"],
		ClassExpression: ["id"],
		RestElement: ["argument"],
		UpdateExpression: ["argument"],
		ObjectProperty: ["value"],
		AssignmentPattern: ["left"],
		ArrayPattern: ["elements"],
		ObjectPattern: ["properties"],
		VariableDeclaration: ["declarations"],
		VariableDeclarator: ["id"]
	};
	getBindingIdentifiers.keys = keys;
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getOuterBindingIdentifiers.js
var require_getOuterBindingIdentifiers = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getOuterBindingIdentifiers.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _getBindingIdentifiers$3 = require_getBindingIdentifiers();
	var _default = exports.default = getOuterBindingIdentifiers;
	function getOuterBindingIdentifiers(node, duplicates) {
		return (0, _getBindingIdentifiers$3.default)(node, duplicates, true);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getFunctionName.js
var require_getFunctionName = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/retrievers/getFunctionName.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = getFunctionName;
	var _index$10 = require_generated$3();
	function getNameFromLiteralId(id) {
		if ((0, _index$10.isNullLiteral)(id)) return "null";
		if ((0, _index$10.isRegExpLiteral)(id)) return `/${id.pattern}/${id.flags}`;
		if ((0, _index$10.isTemplateLiteral)(id)) return id.quasis.map((quasi) => quasi.value.raw).join("");
		if (id.value !== void 0) return String(id.value);
		return null;
	}
	function getObjectMemberKey(node) {
		if (!node.computed || (0, _index$10.isLiteral)(node.key)) return node.key;
	}
	function getFunctionName(node, parent) {
		if ("id" in node && node.id) return {
			name: node.id.name,
			originalNode: node.id
		};
		let prefix = "";
		let id;
		if ((0, _index$10.isObjectProperty)(parent, { value: node })) id = getObjectMemberKey(parent);
		else if ((0, _index$10.isObjectMethod)(node) || (0, _index$10.isClassMethod)(node)) {
			id = getObjectMemberKey(node);
			if (node.kind === "get") prefix = "get ";
			else if (node.kind === "set") prefix = "set ";
		} else if ((0, _index$10.isVariableDeclarator)(parent, { init: node })) id = parent.id;
		else if ((0, _index$10.isAssignmentExpression)(parent, {
			operator: "=",
			right: node
		})) id = parent.left;
		if (!id) return null;
		const name = (0, _index$10.isLiteral)(id) ? getNameFromLiteralId(id) : (0, _index$10.isIdentifier)(id) ? id.name : (0, _index$10.isPrivateName)(id) ? id.id.name : null;
		if (name == null) return null;
		return {
			name: prefix + name,
			originalNode: id
		};
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/traverse/traverse.js
var require_traverse = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/traverse/traverse.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = traverse$1;
	var _index$9 = require_definitions();
	function traverse$1(node, handlers, state) {
		if (typeof handlers === "function") handlers = { enter: handlers };
		const { enter, exit } = handlers;
		traverseSimpleImpl(node, enter, exit, state, []);
	}
	function traverseSimpleImpl(node, enter, exit, state, ancestors) {
		const keys$1 = _index$9.VISITOR_KEYS[node.type];
		if (!keys$1) return;
		if (enter) enter(node, ancestors, state);
		for (const key of keys$1) {
			const subNode = node[key];
			if (Array.isArray(subNode)) for (let i = 0; i < subNode.length; i++) {
				const child = subNode[i];
				if (!child) continue;
				ancestors.push({
					node,
					key,
					index: i
				});
				traverseSimpleImpl(child, enter, exit, state, ancestors);
				ancestors.pop();
			}
			else if (subNode) {
				ancestors.push({
					node,
					key
				});
				traverseSimpleImpl(subNode, enter, exit, state, ancestors);
				ancestors.pop();
			}
		}
		if (exit) exit(node, ancestors, state);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isBinding.js
var require_isBinding = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isBinding.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isBinding;
	var _getBindingIdentifiers$2 = require_getBindingIdentifiers();
	function isBinding(node, parent, grandparent) {
		if (grandparent && node.type === "Identifier" && parent.type === "ObjectProperty" && grandparent.type === "ObjectExpression") return false;
		const keys$1 = _getBindingIdentifiers$2.default.keys[parent.type];
		if (keys$1) for (let i = 0; i < keys$1.length; i++) {
			const key = keys$1[i];
			const val = parent[key];
			if (Array.isArray(val)) {
				if (val.includes(node)) return true;
			} else if (val === node) return true;
		}
		return false;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isLet.js
var require_isLet = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isLet.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isLet;
	var _index$8 = require_generated$3();
	var _index2$3 = require_constants();
	function isLet(node) {
		return (0, _index$8.isVariableDeclaration)(node) && (node.kind !== "var" || node[_index2$3.BLOCK_SCOPED_SYMBOL]);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isBlockScoped.js
var require_isBlockScoped = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isBlockScoped.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isBlockScoped;
	var _index$7 = require_generated$3();
	var _isLet$1 = require_isLet();
	function isBlockScoped(node) {
		return (0, _index$7.isFunctionDeclaration)(node) || (0, _index$7.isClassDeclaration)(node) || (0, _isLet$1.default)(node);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isImmutable.js
var require_isImmutable = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isImmutable.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isImmutable;
	var _isType$1 = require_isType();
	var _index$6 = require_generated$3();
	function isImmutable(node) {
		if ((0, _isType$1.default)(node.type, "Immutable")) return true;
		if ((0, _index$6.isIdentifier)(node)) if (node.name === "undefined") return true;
		else return false;
		return false;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isNodesEquivalent.js
var require_isNodesEquivalent = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isNodesEquivalent.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isNodesEquivalent;
	var _index$5 = require_definitions();
	function isNodesEquivalent(a, b) {
		if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) return a === b;
		if (a.type !== b.type) return false;
		const fields = Object.keys(_index$5.NODE_FIELDS[a.type] || a.type);
		const visitorKeys = _index$5.VISITOR_KEYS[a.type];
		for (const field of fields) {
			const val_a = a[field];
			const val_b = b[field];
			if (typeof val_a !== typeof val_b) return false;
			if (val_a == null && val_b == null) continue;
			else if (val_a == null || val_b == null) return false;
			if (Array.isArray(val_a)) {
				if (!Array.isArray(val_b)) return false;
				if (val_a.length !== val_b.length) return false;
				for (let i = 0; i < val_a.length; i++) if (!isNodesEquivalent(val_a[i], val_b[i])) return false;
				continue;
			}
			if (typeof val_a === "object" && !(visitorKeys != null && visitorKeys.includes(field))) {
				for (const key of Object.keys(val_a)) if (val_a[key] !== val_b[key]) return false;
				continue;
			}
			if (!isNodesEquivalent(val_a, val_b)) return false;
		}
		return true;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isReferenced.js
var require_isReferenced = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isReferenced.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isReferenced;
	function isReferenced(node, parent, grandparent) {
		switch (parent.type) {
			case "MemberExpression":
			case "OptionalMemberExpression":
				if (parent.property === node) return !!parent.computed;
				return parent.object === node;
			case "JSXMemberExpression": return parent.object === node;
			case "VariableDeclarator": return parent.init === node;
			case "ArrowFunctionExpression": return parent.body === node;
			case "PrivateName": return false;
			case "ClassMethod":
			case "ClassPrivateMethod":
			case "ObjectMethod":
				if (parent.key === node) return !!parent.computed;
				return false;
			case "ObjectProperty":
				if (parent.key === node) return !!parent.computed;
				return !grandparent || grandparent.type !== "ObjectPattern";
			case "ClassProperty":
			case "ClassAccessorProperty":
				if (parent.key === node) return !!parent.computed;
				return true;
			case "ClassPrivateProperty": return parent.key !== node;
			case "ClassDeclaration":
			case "ClassExpression": return parent.superClass === node;
			case "AssignmentExpression": return parent.right === node;
			case "AssignmentPattern": return parent.right === node;
			case "LabeledStatement": return false;
			case "CatchClause": return false;
			case "RestElement": return false;
			case "BreakStatement":
			case "ContinueStatement": return false;
			case "FunctionDeclaration":
			case "FunctionExpression": return false;
			case "ExportNamespaceSpecifier":
			case "ExportDefaultSpecifier": return false;
			case "ExportSpecifier":
				if (grandparent != null && grandparent.source) return false;
				return parent.local === node;
			case "ImportDefaultSpecifier":
			case "ImportNamespaceSpecifier":
			case "ImportSpecifier": return false;
			case "ImportAttribute": return false;
			case "JSXAttribute": return false;
			case "ObjectPattern":
			case "ArrayPattern": return false;
			case "MetaProperty": return false;
			case "ObjectTypeProperty": return parent.key !== node;
			case "TSEnumMember": return parent.id !== node;
			case "TSPropertySignature":
				if (parent.key === node) return !!parent.computed;
				return true;
		}
		return true;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isScope.js
var require_isScope = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isScope.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isScope;
	var _index$4 = require_generated$3();
	function isScope(node, parent) {
		if ((0, _index$4.isBlockStatement)(node) && ((0, _index$4.isFunction)(parent) || (0, _index$4.isCatchClause)(parent))) return false;
		if ((0, _index$4.isPattern)(node) && ((0, _index$4.isFunction)(parent) || (0, _index$4.isCatchClause)(parent))) return true;
		return (0, _index$4.isScopable)(node);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isSpecifierDefault.js
var require_isSpecifierDefault = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isSpecifierDefault.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isSpecifierDefault;
	var _index$3 = require_generated$3();
	function isSpecifierDefault(specifier) {
		return (0, _index$3.isImportDefaultSpecifier)(specifier) || (0, _index$3.isIdentifier)(specifier.imported || specifier.exported, { name: "default" });
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isValidES3Identifier.js
var require_isValidES3Identifier = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isValidES3Identifier.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isValidES3Identifier;
	var _isValidIdentifier$1 = require_isValidIdentifier();
	const RESERVED_WORDS_ES3_ONLY = new Set([
		"abstract",
		"boolean",
		"byte",
		"char",
		"double",
		"enum",
		"final",
		"float",
		"goto",
		"implements",
		"int",
		"interface",
		"long",
		"native",
		"package",
		"private",
		"protected",
		"public",
		"short",
		"static",
		"synchronized",
		"throws",
		"transient",
		"volatile"
	]);
	function isValidES3Identifier(name) {
		return (0, _isValidIdentifier$1.default)(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isVar.js
var require_isVar = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/validators/isVar.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isVar;
	var _index$2 = require_generated$3();
	var _index2$2 = require_constants();
	function isVar(node) {
		return (0, _index$2.isVariableDeclaration)(node, { kind: "var" }) && !node[_index2$2.BLOCK_SCOPED_SYMBOL];
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/gatherSequenceExpressions.js
var require_gatherSequenceExpressions = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/gatherSequenceExpressions.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = gatherSequenceExpressions;
	var _getBindingIdentifiers$1 = require_getBindingIdentifiers();
	var _index$1 = require_generated$3();
	var _index2$1 = require_generated$2();
	var _productions$1 = require_productions();
	var _cloneNode$1 = require_cloneNode();
	function gatherSequenceExpressions(nodes, declars) {
		const exprs = [];
		let ensureLastUndefined = true;
		for (const node of nodes) {
			if (!(0, _index$1.isEmptyStatement)(node)) ensureLastUndefined = false;
			if ((0, _index$1.isExpression)(node)) exprs.push(node);
			else if ((0, _index$1.isExpressionStatement)(node)) exprs.push(node.expression);
			else if ((0, _index$1.isVariableDeclaration)(node)) {
				if (node.kind !== "var") return;
				for (const declar of node.declarations) {
					const bindings = (0, _getBindingIdentifiers$1.default)(declar);
					for (const key of Object.keys(bindings)) declars.push({
						kind: node.kind,
						id: (0, _cloneNode$1.default)(bindings[key])
					});
					if (declar.init) exprs.push((0, _index2$1.assignmentExpression)("=", declar.id, declar.init));
				}
				ensureLastUndefined = true;
			} else if ((0, _index$1.isIfStatement)(node)) {
				const consequent = node.consequent ? gatherSequenceExpressions([node.consequent], declars) : (0, _productions$1.buildUndefinedNode)();
				const alternate = node.alternate ? gatherSequenceExpressions([node.alternate], declars) : (0, _productions$1.buildUndefinedNode)();
				if (!consequent || !alternate) return;
				exprs.push((0, _index2$1.conditionalExpression)(node.test, consequent, alternate));
			} else if ((0, _index$1.isBlockStatement)(node)) {
				const body = gatherSequenceExpressions(node.body, declars);
				if (!body) return;
				exprs.push(body);
			} else if ((0, _index$1.isEmptyStatement)(node)) {
				if (nodes.indexOf(node) === 0) ensureLastUndefined = true;
			} else return;
		}
		if (ensureLastUndefined) exprs.push((0, _productions$1.buildUndefinedNode)());
		if (exprs.length === 1) return exprs[0];
		else return (0, _index2$1.sequenceExpression)(exprs);
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toSequenceExpression.js
var require_toSequenceExpression = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/converters/toSequenceExpression.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = toSequenceExpression;
	var _gatherSequenceExpressions = require_gatherSequenceExpressions();
	function toSequenceExpression(nodes, scope) {
		if (!(nodes != null && nodes.length)) return;
		const declars = [];
		const result = (0, _gatherSequenceExpressions.default)(nodes, declars);
		if (!result) return;
		for (const declar of declars) scope.push(declar);
		return result;
	}
} });

//#endregion
//#region ../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/index.js
var require_lib = __commonJS({ "../../node_modules/.pnpm/@babel+types@7.26.7/node_modules/@babel/types/lib/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _exportNames = {
		react: true,
		assertNode: true,
		createTypeAnnotationBasedOnTypeof: true,
		createUnionTypeAnnotation: true,
		createFlowUnionType: true,
		createTSUnionType: true,
		cloneNode: true,
		clone: true,
		cloneDeep: true,
		cloneDeepWithoutLoc: true,
		cloneWithoutLoc: true,
		addComment: true,
		addComments: true,
		inheritInnerComments: true,
		inheritLeadingComments: true,
		inheritsComments: true,
		inheritTrailingComments: true,
		removeComments: true,
		ensureBlock: true,
		toBindingIdentifierName: true,
		toBlock: true,
		toComputedKey: true,
		toExpression: true,
		toIdentifier: true,
		toKeyAlias: true,
		toStatement: true,
		valueToNode: true,
		appendToMemberExpression: true,
		inherits: true,
		prependToMemberExpression: true,
		removeProperties: true,
		removePropertiesDeep: true,
		removeTypeDuplicates: true,
		getAssignmentIdentifiers: true,
		getBindingIdentifiers: true,
		getOuterBindingIdentifiers: true,
		getFunctionName: true,
		traverse: true,
		traverseFast: true,
		shallowEqual: true,
		is: true,
		isBinding: true,
		isBlockScoped: true,
		isImmutable: true,
		isLet: true,
		isNode: true,
		isNodesEquivalent: true,
		isPlaceholderType: true,
		isReferenced: true,
		isScope: true,
		isSpecifierDefault: true,
		isType: true,
		isValidES3Identifier: true,
		isValidIdentifier: true,
		isVar: true,
		matchesPattern: true,
		validate: true,
		buildMatchMemberExpression: true,
		__internal__deprecationWarning: true
	};
	Object.defineProperty(exports, "__internal__deprecationWarning", {
		enumerable: true,
		get: function() {
			return _deprecationWarning.default;
		}
	});
	Object.defineProperty(exports, "addComment", {
		enumerable: true,
		get: function() {
			return _addComment.default;
		}
	});
	Object.defineProperty(exports, "addComments", {
		enumerable: true,
		get: function() {
			return _addComments.default;
		}
	});
	Object.defineProperty(exports, "appendToMemberExpression", {
		enumerable: true,
		get: function() {
			return _appendToMemberExpression.default;
		}
	});
	Object.defineProperty(exports, "assertNode", {
		enumerable: true,
		get: function() {
			return _assertNode.default;
		}
	});
	Object.defineProperty(exports, "buildMatchMemberExpression", {
		enumerable: true,
		get: function() {
			return _buildMatchMemberExpression.default;
		}
	});
	Object.defineProperty(exports, "clone", {
		enumerable: true,
		get: function() {
			return _clone.default;
		}
	});
	Object.defineProperty(exports, "cloneDeep", {
		enumerable: true,
		get: function() {
			return _cloneDeep.default;
		}
	});
	Object.defineProperty(exports, "cloneDeepWithoutLoc", {
		enumerable: true,
		get: function() {
			return _cloneDeepWithoutLoc.default;
		}
	});
	Object.defineProperty(exports, "cloneNode", {
		enumerable: true,
		get: function() {
			return _cloneNode.default;
		}
	});
	Object.defineProperty(exports, "cloneWithoutLoc", {
		enumerable: true,
		get: function() {
			return _cloneWithoutLoc.default;
		}
	});
	Object.defineProperty(exports, "createFlowUnionType", {
		enumerable: true,
		get: function() {
			return _createFlowUnionType.default;
		}
	});
	Object.defineProperty(exports, "createTSUnionType", {
		enumerable: true,
		get: function() {
			return _createTSUnionType.default;
		}
	});
	Object.defineProperty(exports, "createTypeAnnotationBasedOnTypeof", {
		enumerable: true,
		get: function() {
			return _createTypeAnnotationBasedOnTypeof.default;
		}
	});
	Object.defineProperty(exports, "createUnionTypeAnnotation", {
		enumerable: true,
		get: function() {
			return _createFlowUnionType.default;
		}
	});
	Object.defineProperty(exports, "ensureBlock", {
		enumerable: true,
		get: function() {
			return _ensureBlock.default;
		}
	});
	Object.defineProperty(exports, "getAssignmentIdentifiers", {
		enumerable: true,
		get: function() {
			return _getAssignmentIdentifiers.default;
		}
	});
	Object.defineProperty(exports, "getBindingIdentifiers", {
		enumerable: true,
		get: function() {
			return _getBindingIdentifiers.default;
		}
	});
	Object.defineProperty(exports, "getFunctionName", {
		enumerable: true,
		get: function() {
			return _getFunctionName.default;
		}
	});
	Object.defineProperty(exports, "getOuterBindingIdentifiers", {
		enumerable: true,
		get: function() {
			return _getOuterBindingIdentifiers.default;
		}
	});
	Object.defineProperty(exports, "inheritInnerComments", {
		enumerable: true,
		get: function() {
			return _inheritInnerComments.default;
		}
	});
	Object.defineProperty(exports, "inheritLeadingComments", {
		enumerable: true,
		get: function() {
			return _inheritLeadingComments.default;
		}
	});
	Object.defineProperty(exports, "inheritTrailingComments", {
		enumerable: true,
		get: function() {
			return _inheritTrailingComments.default;
		}
	});
	Object.defineProperty(exports, "inherits", {
		enumerable: true,
		get: function() {
			return _inherits.default;
		}
	});
	Object.defineProperty(exports, "inheritsComments", {
		enumerable: true,
		get: function() {
			return _inheritsComments.default;
		}
	});
	Object.defineProperty(exports, "is", {
		enumerable: true,
		get: function() {
			return _is.default;
		}
	});
	Object.defineProperty(exports, "isBinding", {
		enumerable: true,
		get: function() {
			return _isBinding.default;
		}
	});
	Object.defineProperty(exports, "isBlockScoped", {
		enumerable: true,
		get: function() {
			return _isBlockScoped.default;
		}
	});
	Object.defineProperty(exports, "isImmutable", {
		enumerable: true,
		get: function() {
			return _isImmutable.default;
		}
	});
	Object.defineProperty(exports, "isLet", {
		enumerable: true,
		get: function() {
			return _isLet.default;
		}
	});
	Object.defineProperty(exports, "isNode", {
		enumerable: true,
		get: function() {
			return _isNode.default;
		}
	});
	Object.defineProperty(exports, "isNodesEquivalent", {
		enumerable: true,
		get: function() {
			return _isNodesEquivalent.default;
		}
	});
	Object.defineProperty(exports, "isPlaceholderType", {
		enumerable: true,
		get: function() {
			return _isPlaceholderType.default;
		}
	});
	Object.defineProperty(exports, "isReferenced", {
		enumerable: true,
		get: function() {
			return _isReferenced.default;
		}
	});
	Object.defineProperty(exports, "isScope", {
		enumerable: true,
		get: function() {
			return _isScope.default;
		}
	});
	Object.defineProperty(exports, "isSpecifierDefault", {
		enumerable: true,
		get: function() {
			return _isSpecifierDefault.default;
		}
	});
	Object.defineProperty(exports, "isType", {
		enumerable: true,
		get: function() {
			return _isType.default;
		}
	});
	Object.defineProperty(exports, "isValidES3Identifier", {
		enumerable: true,
		get: function() {
			return _isValidES3Identifier.default;
		}
	});
	Object.defineProperty(exports, "isValidIdentifier", {
		enumerable: true,
		get: function() {
			return _isValidIdentifier.default;
		}
	});
	Object.defineProperty(exports, "isVar", {
		enumerable: true,
		get: function() {
			return _isVar.default;
		}
	});
	Object.defineProperty(exports, "matchesPattern", {
		enumerable: true,
		get: function() {
			return _matchesPattern.default;
		}
	});
	Object.defineProperty(exports, "prependToMemberExpression", {
		enumerable: true,
		get: function() {
			return _prependToMemberExpression.default;
		}
	});
	exports.react = void 0;
	Object.defineProperty(exports, "removeComments", {
		enumerable: true,
		get: function() {
			return _removeComments.default;
		}
	});
	Object.defineProperty(exports, "removeProperties", {
		enumerable: true,
		get: function() {
			return _removeProperties.default;
		}
	});
	Object.defineProperty(exports, "removePropertiesDeep", {
		enumerable: true,
		get: function() {
			return _removePropertiesDeep.default;
		}
	});
	Object.defineProperty(exports, "removeTypeDuplicates", {
		enumerable: true,
		get: function() {
			return _removeTypeDuplicates.default;
		}
	});
	Object.defineProperty(exports, "shallowEqual", {
		enumerable: true,
		get: function() {
			return _shallowEqual.default;
		}
	});
	Object.defineProperty(exports, "toBindingIdentifierName", {
		enumerable: true,
		get: function() {
			return _toBindingIdentifierName.default;
		}
	});
	Object.defineProperty(exports, "toBlock", {
		enumerable: true,
		get: function() {
			return _toBlock.default;
		}
	});
	Object.defineProperty(exports, "toComputedKey", {
		enumerable: true,
		get: function() {
			return _toComputedKey.default;
		}
	});
	Object.defineProperty(exports, "toExpression", {
		enumerable: true,
		get: function() {
			return _toExpression.default;
		}
	});
	Object.defineProperty(exports, "toIdentifier", {
		enumerable: true,
		get: function() {
			return _toIdentifier.default;
		}
	});
	Object.defineProperty(exports, "toKeyAlias", {
		enumerable: true,
		get: function() {
			return _toKeyAlias.default;
		}
	});
	Object.defineProperty(exports, "toStatement", {
		enumerable: true,
		get: function() {
			return _toStatement.default;
		}
	});
	Object.defineProperty(exports, "traverse", {
		enumerable: true,
		get: function() {
			return _traverse$1.default;
		}
	});
	Object.defineProperty(exports, "traverseFast", {
		enumerable: true,
		get: function() {
			return _traverseFast.default;
		}
	});
	Object.defineProperty(exports, "validate", {
		enumerable: true,
		get: function() {
			return _validate.default;
		}
	});
	Object.defineProperty(exports, "valueToNode", {
		enumerable: true,
		get: function() {
			return _valueToNode.default;
		}
	});
	var _isReactComponent = require_isReactComponent();
	var _isCompatTag = require_isCompatTag();
	var _buildChildren = require_buildChildren();
	var _assertNode = require_assertNode();
	var _index = require_generated$1();
	Object.keys(_index).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index[key];
			}
		});
	});
	var _createTypeAnnotationBasedOnTypeof = require_createTypeAnnotationBasedOnTypeof();
	var _createFlowUnionType = require_createFlowUnionType();
	var _createTSUnionType = require_createTSUnionType();
	var _index2 = require_generated$2();
	Object.keys(_index2).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index2[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index2[key];
			}
		});
	});
	var _uppercase = require_uppercase();
	Object.keys(_uppercase).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _uppercase[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _uppercase[key];
			}
		});
	});
	var _productions = require_productions();
	Object.keys(_productions).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _productions[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _productions[key];
			}
		});
	});
	var _cloneNode = require_cloneNode();
	var _clone = require_clone();
	var _cloneDeep = require_cloneDeep();
	var _cloneDeepWithoutLoc = require_cloneDeepWithoutLoc();
	var _cloneWithoutLoc = require_cloneWithoutLoc();
	var _addComment = require_addComment();
	var _addComments = require_addComments();
	var _inheritInnerComments = require_inheritInnerComments();
	var _inheritLeadingComments = require_inheritLeadingComments();
	var _inheritsComments = require_inheritsComments();
	var _inheritTrailingComments = require_inheritTrailingComments();
	var _removeComments = require_removeComments();
	var _index3 = require_generated();
	Object.keys(_index3).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index3[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index3[key];
			}
		});
	});
	var _index4 = require_constants();
	Object.keys(_index4).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index4[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index4[key];
			}
		});
	});
	var _ensureBlock = require_ensureBlock();
	var _toBindingIdentifierName = require_toBindingIdentifierName();
	var _toBlock = require_toBlock();
	var _toComputedKey = require_toComputedKey();
	var _toExpression = require_toExpression();
	var _toIdentifier = require_toIdentifier();
	var _toKeyAlias = require_toKeyAlias();
	var _toStatement = require_toStatement();
	var _valueToNode = require_valueToNode();
	var _index5 = require_definitions();
	Object.keys(_index5).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index5[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index5[key];
			}
		});
	});
	var _appendToMemberExpression = require_appendToMemberExpression();
	var _inherits = require_inherits();
	var _prependToMemberExpression = require_prependToMemberExpression();
	var _removeProperties = require_removeProperties();
	var _removePropertiesDeep = require_removePropertiesDeep();
	var _removeTypeDuplicates = require_removeTypeDuplicates$1();
	var _getAssignmentIdentifiers = require_getAssignmentIdentifiers();
	var _getBindingIdentifiers = require_getBindingIdentifiers();
	var _getOuterBindingIdentifiers = require_getOuterBindingIdentifiers();
	var _getFunctionName = require_getFunctionName();
	var _traverse$1 = require_traverse();
	Object.keys(_traverse$1).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _traverse$1[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _traverse$1[key];
			}
		});
	});
	var _traverseFast = require_traverseFast();
	var _shallowEqual = require_shallowEqual();
	var _is = require_is();
	var _isBinding = require_isBinding();
	var _isBlockScoped = require_isBlockScoped();
	var _isImmutable = require_isImmutable();
	var _isLet = require_isLet();
	var _isNode = require_isNode();
	var _isNodesEquivalent = require_isNodesEquivalent();
	var _isPlaceholderType = require_isPlaceholderType();
	var _isReferenced = require_isReferenced();
	var _isScope = require_isScope();
	var _isSpecifierDefault = require_isSpecifierDefault();
	var _isType = require_isType();
	var _isValidES3Identifier = require_isValidES3Identifier();
	var _isValidIdentifier = require_isValidIdentifier();
	var _isVar = require_isVar();
	var _matchesPattern = require_matchesPattern();
	var _validate = require_validate();
	var _buildMatchMemberExpression = require_buildMatchMemberExpression();
	var _index6 = require_generated$3();
	Object.keys(_index6).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _index6[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function() {
				return _index6[key];
			}
		});
	});
	var _deprecationWarning = require_deprecationWarning();
	const react = exports.react = {
		isReactComponent: _isReactComponent.default,
		isCompatTag: _isCompatTag.default,
		buildChildren: _buildChildren.default
	};
	exports.toSequenceExpression = require_toSequenceExpression().default;
	if (process.env.BABEL_TYPES_8_BREAKING) console.warn("BABEL_TYPES_8_BREAKING is not supported anymore. Use the latest Babel 8.0.0 pre-release instead!");
} });
var import_lib = __toESM(require_lib(), 1);

//#endregion
//#region src/index.ts
const traverse = _traverse.default;
const generate = _generate.default;
function qwikDevtools() {
	let _config;
	const qwikDevtoolsPlugin = {
		name: "vite-plugin-qwik-devtools",
		apply: "serve",
		configResolved(viteConfig) {
			_config = viteConfig;
		},
		transform: {
			order: "pre",
			handler(code, id) {
				const mode = process.env.MODE;
				if (id.endsWith("root.tsx")) {
					const importPath = mode === "dev" ? "@devtools/ui" : "@qwik.dev/devtools/ui";
					if (!code.includes(importPath)) code = `import { QwikDevtools } from '${importPath}';\n${code}`;
					const match$1 = code.match(/<body[^>]*>([\s\S]*?)<\/body>/);
					if (match$1) {
						const bodyContent = match$1[1];
						const newBodyContent = bodyContent.replace(/{!isDev && <ServiceWorkerRegister \/>}/, `{!isDev && <ServiceWorkerRegister />}\n        {isDev && <QwikDevtools />}`);
						code = code.replace(bodyContent, newBodyContent);
					}
					return {
						code,
						map: null
					};
				}
				return test(code, id);
			}
		},
		configureServer(server) {
			setViteServerContext(server);
			const rpcFunctions = getServerFunctions({
				server,
				config: _config
			});
			createServerRpc(rpcFunctions);
		}
	};
	return [qwikDevtoolsPlugin, VueInspector()];
}
function test(code, id) {
	if (!id.endsWith(".tsx") || !code.includes("component$")) return;
	const ast = parse(code, {
		sourceType: "module",
		plugins: ["typescript", "jsx"]
	});
	let hasSignalsOrStores = false;
	const signalsAndStores = [];
	let lastDeclarationPath = null;
	const componentPath = id.split("/src/")[1] || id;
	traverse(ast, { VariableDeclarator(path$12) {
		const init = path$12.node.init;
		if (import_lib.isCallExpression(init)) {
			const callee = init.callee;
			if (import_lib.isIdentifier(callee)) {
				if (callee.name === "useSignal" || callee.name === "useStore") {
					hasSignalsOrStores = true;
					signalsAndStores.push({
						name: path$12.node.id.name,
						type: callee.name === "useSignal" ? "signal" : "store"
					});
					lastDeclarationPath = path$12.parentPath;
				}
			}
		}
	} });
	if (hasSignalsOrStores && lastDeclarationPath) {
		traverse(ast, { Program(path$12) {
			const imports = [import_lib.importSpecifier(import_lib.identifier("useOnDocument"), import_lib.identifier("useOnDocument")), import_lib.importSpecifier(import_lib.identifier("$"), import_lib.identifier("$"))];
			let qwikImport = path$12.node.body.find(
				// @ts-expect-error any
				(node) => import_lib.isImportDeclaration(node) && node.source.value === "@qwik.dev/core"
);
			if (qwikImport) qwikImport.specifiers.push(...imports);
			else {
				qwikImport = import_lib.importDeclaration(imports, import_lib.stringLiteral("@qwik.dev/core"));
				path$12.node.body.unshift(qwikImport);
			}
		} });
		const trackingCode = import_lib.expressionStatement(import_lib.callExpression(import_lib.identifier("useOnDocument"), [import_lib.stringLiteral("qinit"), import_lib.callExpression(import_lib.identifier("$"), [import_lib.arrowFunctionExpression([], import_lib.blockStatement([import_lib.ifStatement(import_lib.unaryExpression("!", import_lib.memberExpression(import_lib.identifier("window"), import_lib.identifier("__QWIK_DEVTOOLS__"))), import_lib.blockStatement([import_lib.expressionStatement(import_lib.assignmentExpression("=", import_lib.memberExpression(import_lib.identifier("window"), import_lib.identifier("__QWIK_DEVTOOLS__")), import_lib.objectExpression([import_lib.objectProperty(import_lib.identifier("appState"), import_lib.objectExpression([]))])))])), import_lib.expressionStatement(import_lib.assignmentExpression("=", import_lib.memberExpression(import_lib.memberExpression(import_lib.memberExpression(import_lib.identifier("window"), import_lib.identifier("__QWIK_DEVTOOLS__")), import_lib.identifier("appState")), import_lib.stringLiteral(componentPath), true), import_lib.objectExpression([import_lib.objectProperty(import_lib.identifier("path"), import_lib.stringLiteral(componentPath)), import_lib.objectProperty(import_lib.identifier("state"), import_lib.objectExpression(signalsAndStores.map(({ name, type }) => import_lib.objectProperty(import_lib.identifier(name), import_lib.objectExpression([import_lib.objectProperty(import_lib.identifier("value"), import_lib.identifier(name)), import_lib.objectProperty(import_lib.identifier("type"), import_lib.stringLiteral(type))])))))])))]))])]));
		lastDeclarationPath.insertAfter(trackingCode);
	}
	const output = generate(ast);
	return {
		code: output.code,
		map: output.map
	};
}

//#endregion
export { qwikDevtools };