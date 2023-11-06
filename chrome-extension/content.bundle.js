/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/.pnpm/n-gram@2.0.2/node_modules/n-gram/index.js
const bigram = nGram(2)
const trigram = nGram(3)

/**
 * Factory returning a function that converts a value string to n-grams.
 *
 * @param {number} n
 */
function nGram(n) {
  if (
    typeof n !== 'number' ||
    Number.isNaN(n) ||
    n < 1 ||
    n === Number.POSITIVE_INFINITY
  ) {
    throw new Error('`' + n + '` is not a valid argument for `n-gram`')
  }

  return grams

  /**
   * Create n-grams from a given value.
   *
   * @template {string|Array<unknown>} T
   * @param {T} [value]
   * @returns {T extends any[] ? T : Array<string>}
   */
  function grams(value) {
    /** @type {T extends any[] ? T : Array<string>} */
    // @ts-expect-error: pretty sure this is fine.
    const nGrams = []

    if (value === null || value === undefined) {
      return nGrams
    }

    const source = typeof value.slice === 'function' ? value : String(value)
    let index = source.length - n + 1

    if (index < 1) {
      return nGrams
    }

    while (index--) {
      nGrams[index] = source.slice(index, index + n)
    }

    return nGrams
  }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/collapse-white-space@2.1.0/node_modules/collapse-white-space/index.js
/**
 * @typedef {'html'|'js'} Style
 *
 * @typedef Options
 *   Configuration.
 * @property {Style} [style='js']
 *   Style of white space to support.
 * @property {boolean} [preserveLineEndings=false]
 *   Whether to collapse white space containing a line ending to that line
 *   ending.
 *   The default is to collapse to a single space.
 * @property {boolean} [trim=false]
 *   Whether to drop white space at the start and end of `value`.
 *   The default is to keep it.
 */

const js = /\s+/g
const html = /[\t\n\v\f\r ]+/g

/**
 * Collapse white space.
 *
 * @param {string} value
 *   Value to collapse white space in.
 * @param {Style|Options} [options='js']
 *   Configuration.
 * @returns {string}
 *   Value with collapsed white space.
 */
function collapseWhiteSpace(value, options) {
  if (!options) {
    options = {}
  } else if (typeof options === 'string') {
    options = {style: options}
  }

  const replace = options.preserveLineEndings ? replaceLineEnding : replaceSpace

  return String(value).replace(
    options.style === 'html' ? html : js,
    options.trim ? trimFactory(replace) : replace
  )
}

/**
 * Replace white space with a line ending as that line ending and otherwise a
 * space.
 *
 * @param {string} value
 * @returns {string}
 */
function replaceLineEnding(value) {
  const match = /\r?\n|\r/.exec(value)
  return match ? match[0] : ' '
}

/**
 * Replace white space with a space.
 *
 * @returns {string}
 */
function replaceSpace() {
  return ' '
}

/**
 * @param {(value: string) => string} replace
 */
function trimFactory(replace) {
  return dropOrReplace

  /**
   * Replace white space with nothing if it starts or ends the string.
   * Calls `replace` otherwise.
   *
   * @param {string} value
   * @param {number} index
   * @param {string} all
   * @returns {string}
   */
  function dropOrReplace(value, index, all) {
    return index === 0 || index + value.length === all.length
      ? ''
      : replace(value)
  }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/trigram-utils@2.0.1/node_modules/trigram-utils/index.js
/**
 * @typedef {[string, number]} TrigramTuple
 * @typedef {TrigramTuple[]} TrigramTuples
 * @typedef {Record<string, number>} TrigramDictionary
 */




const own = {}.hasOwnProperty

/**
 * Clean `value`.
 * Removed general non-important (as in, for language detection) punctuation
 * marks, symbols, and digits.
 *
 * @param {string|null} [value]
 * @returns {string}
 */
function clean(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return collapseWhiteSpace(String(value).replace(/[\u0021-\u0040]+/g, ' '))
    .trim()
    .toLowerCase()
}

/**
 * Get clean, padded, trigrams.
 *
 * @param {string} [value]
 * @returns {string[]}
 */
function trigrams(value) {
  return trigram(' ' + clean(value) + ' ')
}

/**
 * Get an `Object` with trigrams as its attributes, and their occurence count as
 * their values.
 *
 * @param {string} value
 * @returns {TrigramDictionary}
 */
function asDictionary(value) {
  const values = trigrams(value)
  /** @type {TrigramDictionary} */
  const dictionary = {}
  let index = -1

  while (++index < values.length) {
    if (own.call(dictionary, values[index])) {
      dictionary[values[index]]++
    } else {
      dictionary[values[index]] = 1
    }
  }

  return dictionary
}

/**
 * Get an `Array` containing trigram--count tuples from a given value.
 *
 * @param {string} value
 * @returns {TrigramTuples}
 */
function asTuples(value) {
  const dictionary = asDictionary(value)
  /** @type {TrigramTuples} */
  const tuples = []
  /** @type {string} */
  let trigram

  for (trigram in dictionary) {
    if (own.call(dictionary, trigram)) {
      tuples.push([trigram, dictionary[trigram]])
    }
  }

  tuples.sort(sort)

  return tuples
}

/**
 * Get an `Array` containing trigram--count tuples from a given value.
 *
 * @param {TrigramTuples} tuples
 * @returns {TrigramDictionary}
 */
function tuplesAsDictionary(tuples) {
  /** @type {TrigramDictionary} */
  const dictionary = {}
  let index = -1

  while (++index < tuples.length) {
    dictionary[tuples[index][0]] = tuples[index][1]
  }

  return dictionary
}

/**
 * Deep regular sort on item at `1` in both `Object`s.
 *
 * @param {TrigramTuple} a
 * @param {TrigramTuple} b
 * @returns {number}
 */
function sort(a, b) {
  return a[1] - b[1]
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/franc@6.1.0/node_modules/franc/expressions.js
// This file is generated by `build.js`.
/** @type {Record<string, RegExp>} */
const expressions = {
  cmn: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]/g,
  Latin:
    /[A-Za-z\u00AA\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]|\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]/g,
  Cyrillic:
    /[\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F]|\uD838[\uDC30-\uDC6D\uDC8F]/g,
  Arabic:
    /[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C-\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u0870-\u088E\u0890\u0891\u0898-\u08E1\u08E3-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD40-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFDFF\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E\uDEFD-\uDEFF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]/g,
  ben: /[\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE]/g,
  Devanagari:
    /[\u0900-\u0950\u0955-\u0963\u0966-\u097F\uA8E0-\uA8FF]|\uD806[\uDF00-\uDF09]/g,
  jpn: /[\u3041-\u3096\u309D-\u309F]|\uD82C[\uDC01-\uDD1F\uDD32\uDD50-\uDD52]|\uD83C\uDE00|[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00\uDD20-\uDD22\uDD55\uDD64-\uDD67]|[㐀-䶵一-龯]/g,
  jav: /[\uA980-\uA9CD\uA9D0-\uA9D9\uA9DE\uA9DF]/g,
  kor: /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g,
  tel: /[\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C7F]/g,
  tam: /[\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA]|\uD807[\uDFC0-\uDFF1\uDFFF]/g,
  guj: /[\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF]/g,
  kan: /[\u0C80-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3]/g,
  mal: /[\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F]/g,
  Myanmar: /[\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F]/g,
  pan: /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76]/g,
  Ethiopic:
    /[\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]/g,
  tha: /[\u0E01-\u0E3A\u0E40-\u0E5B]/g,
  sin: /[\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4]|\uD804[\uDDE1-\uDDF4]/g,
  ell: /[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45]/g,
  khm: /[\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF]/g,
  hye: /[\u0531-\u0556\u0559-\u058A\u058D-\u058F\uFB13-\uFB17]/g,
  sat: /[\u1C50-\u1C7F]/g,
  bod: /[\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA]/g,
  Hebrew:
    /[\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F]/g,
  kat: /[\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u1C90-\u1CBA\u1CBD-\u1CBF\u2D00-\u2D25\u2D27\u2D2D]/g,
  lao: /[\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF]/g,
  zgh: /[\u2D30-\u2D67\u2D6F\u2D70\u2D7F]/g,
  iii: /[\uA000-\uA48C\uA490-\uA4C6]/g,
  aii: /[\u0700-\u070D\u070F-\u074A\u074D-\u074F\u0860-\u086A]/g
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/franc@6.1.0/node_modules/franc/data.js
/** @type {Record<string, Record<string, string>>} */
const data = {
  Latin: {
    spa: ' de|de |os | la| a |la | y |ón |ión|es |ere|rec|ien|o a|der|ció|a p|cho|ech|en |ent|a l|aci|e d|el |ona|na | co|as |al |da | to|ene|e l| en| el| pe|nte|tod|ho | su|per|ad | ti|a t|ers|tie| se|rso| pr|son|e s|te |oda|cia|n d|o d|dad|ida| in|ne | es|ion|cio|s d|con|est|a e| po|men| li|res|nci|su |to |tra| re|n e| lo|tad| na|los|a s| o |ia |que| pa|rá |pro| un|s y|ual|s e|lib|nac|do |ra |er |nal|ue | qu|e e|a d|ar |nes|ica|a c|sta|ser|or |ter|se |por|cci|io |des|ado|les|one|a a|del|l d|ndi| so| cu|s p|ale|s n|ame|par|ici|oci|una|ber|s t|rta|com| di|e a|imi|o s|e c|ert|o e|dos|las|o p|ant|dic|nto| al|ara|ibe|enc|cas| as|e p|ten|ali|o t|soc|y l|n c|s l|l t|pre|nta|so |tos|y a|ria|n t|die|a u| fu|no |l p|ial|qui|dis|s o|hos|gua|igu| ig| ca|sar| ma|l e| ac|tiv|s a|re |nad|vid|era| tr|ier|cua|n p|cla|ade|bre|s s|esa|ntr|ecc|a i| le|lid|das|d d|ido|ari|ind|ada|nda|fun|mie|ca |tic|eli|ta |y d|nid|e i|n l|ios|o y|esp|iva|y e|mat|bli|r a|drá|tri|cti|tal|rim|ont|erá|us |sus|end|pen|tor|ito|ond|ori|uie|lig|n a|ist|rac|lar|rse|tar|mo |omo|ibr|odo|edi|med| me|nio|a y|eda|isf|lo |aso|l m|ias|ico|lic|ple|ste|act|tec|ote|rot|ele|ura| ni|ie |adi|u p|seg|s i|un |und|a n|lqu|alq|o i|inc|sti| si|n s|ern',
    eng: 'the| th| an|he |nd |ion|and| to|to |tio| of|on |of | in|al |ati|or |ght|igh|rig| ri|ne |ent|one|ll |is |as |ver|ed | be|e r|in |t t|all|eve|ht | or|ery|s t|ty | ev|e h|yon| ha|ryo|e a|be |his| fr|ng |d t|has| sh|ing| hi|sha| pr| co| re|hal|nal|y a|s a|n t|ce |men|ree|fre|e s|l b|nat|for|ts |nt |n a|ity|ry |her|nce|ect|d i| pe|pro|n o|cti| fo|e e|ly |es | no|ona|ny |any|er |re |f t|e o| de|s o| wi|ter|nte|e i|ons| en| ar|res|ers|y t|per|d f| a | on|ith|l a|e t|oci|soc|lit| as| se|dom|edo|eed|nti|s e|t o|oth|wit| di|equ|t a|ted|st |y o|int|e p| ma| so| na|l o|e c|ch |d a|enc|th |are|ns |ic | un| fu|tat|ial|cia| ac|hts|nit|qua| eq| al|om |e w|d o|f h|ali|ote|n e| wh|r t|sta|ge |thi|o a|tit|ual|an |te |ess| ch|le |ary|e f|by | by|y i|tec|uni|o t|o o| li|no | la|s r| su|inc|led|rot|con| pu| he|ere|imi|r a|ntr| st| ot|eli|age|dis|s d|tle|itl|hou|son|duc|edu| wo|ate|ble|ces|at | at| fa|com|ive|o s|eme|o e|aw |law|tra|und|pen|nde|unt|oun|n s|s f|f a|tho|ms | is|act|cie|cat|uca| ed|anc|wor|ral|t i| me|o f|ily|pri|ren|ose|s c|en |d n|l c|ful|rar|nta|nst| ag|l p|min|din|sec|y e| tr|rso|ich|hic|whi|cou|ern|uri|r o|tic|iti|igi|lig|rat|rth|t f|oms|rit|d r|ee |e b|era|rou|se |ay |rs | ho|abl|e u',
    por: 'de | de| se|ão |os |to |em | e |do |o d| di|er |ito|eit|ser|ent|ção| a |dir|ire|rei|o s|ade|dad|uma|as |no |e d| to|nte| co|o t|tod| ou|men|que|s e|man| pr| in| qu|es | te|hum|odo|e a|da | hu|ano|te |al |tem|o e|s d|ida|m d| pe| re|o a|ou |r h|e s|cia|a e| li|o p| es|res| do| da| à |ual| em| su|açã|dos|a p|tra|est|ia |con|pro|ar |e p|is | na|rá |qua|a d| pa|com|ais|o c|ame|erá| po|uer|sta|ber|ter| o |ess|ra |e e|das|o à|nto|nal|o o|a c|ido|rda|erd| as|nci|sua|ona|des|ibe|lib|e t|ado|s n|ua |s t|ue | so|ica|ma |lqu|alq|tos|m s|a l|per|ada|oci|soc|cio|a n|par|aci|s a|pre|ont|m o|ura|a s| um|ion|e o|or |e r|pel|nta|ntr|a i|io |nac|ênc|str|ali|ria|nst| tr|a q|int|o n|a o|ca |ela|uçã|lid|e l| at|sen|ese|r d|s p|egu|seg|vid|pri|sso|ém |ime|tic|dis|raç|eci|ara| ca|nid|tru|ões|ass|seu|por|a a|m p| ex|so |r i|eçã|teç|ote|rot| le| ma|ing|a t|ran|era|rio|l d|eli|ça |sti| ne|cid|ern|utr|out|r e|e c|tad|gua|igu| ig| os|s o|ruç|ins|çõe|ios| fa|e n|sse| no|re |art|r p|rar|u p|inc|lei|cas|ico|uém|gué|ngu|nin| ni|gur|la |pen|nça|na |içã|ião|cie|ist|sem|ta |ele|e f|om |tro| ao|rel|m a|s s|tar|eda|ied|uni|e m|s i|a f|ias| cu| ac|r a|á a|rem|ei |omo|rec|for|s f|esc|ant|à s| vi|o q|ver|a u|nda|und|fun',
    ind: 'an |ang|ng | da|ak | pe|ata| se| ke| me|dan| di| be|ber|kan|ran|hak|per|yan| ya|nga|nya|gan| at|ara| ha|eng|asa|ora|men|n p|n k|erh|rha|n d|ya |ap |at |as |tan|n b|ala|a d| or|a s|san|tas|eti|uk |pen|g b|set|ntu|n y|tia|iap|k m|eba|aan| un|n s|tuk|k a|p o|am |lam| ma|unt| de|ter|bas|beb|dak|end|i d|pun|mem|tau|dal|ama|keb|aka|ika|n m| ba|di |ma | sa|den|au |nda|n h|eri| ti|ela|k d|un |n a|ebe|ana|ah |ra |ida|uka| te|al |ada|ri |ole|tid|ngg|lak|leh|dap|a p|dil|g d|ena|eh |gar|na |ert|apa|um |tu |atu|a m|sam|ila|har|n t|asi|ban|erl|t d|bat|uat|ta |lan|adi|h d|neg| ne|kum|mas|nan|pat|aha| in|l d|emp|sem|rus|sua|ser|uan|era|ari|erb|kat|man|a b|g s|rta|ai |nny|n u|ung|ndi|han|uku|huk| hu|sa |ers|in | la|ka | su|ann|car|kes|aku|dip|i s|a a|erk|n i|lai|rga|aru|k h|i m|rka|a u|us |nak|emb|gga|nta|iba| pu|ind|s p|ent|mel|ina|min|ian|dar|ni |rma|lua|rik|ndu|lin|sia|rbu|g p|k s|da |aya|ese|u d|ega|nas|ar |ipe|yar|sya|ik |aga| ta|ain|ua |arg|uar|iny|pem|ut |si |dun|eor|seo|rak|ngs|ami|kel|ini|g t|dik|mer|emu|aks|rat|uru|ewa|il |enu|any|kep|pel|asu|rli|ia |dir|jam|mba|mat|pan|g m|ses|sar|das|kuk|bol|ili|u k|gsa|u p|a k|ern|ant|raa|t p|ema|mua|idi|did|t s|i k|rin|erm|esu|ger|elu|nja|enj|ga |dit',
    fra: ' de|es |de |ion|nt |tio|et |ne |on | et|ent|le |oit|e d| la|e p|la |it | à |t d|roi|dro| dr| le|té |e s|ati|te |re | to|s d|men|tou|e l|ns | pe| co|son|que| au| so|e a|onn|out| un| qu| sa| pr|ute|eme| l’|t à| a |e e|con|des| pa|ue |ers|e c| li|a d|per|ont|s e|t l|les|ts |tre|s l|ant| ou|cti|rso|ou |ce |ux |à l|nne|ons|ité|en |un | en|er |une|n d|sa |lle| in|nte|e t| se|lib|res|a l|ire| d’| re|é d|nat|iqu|ur |r l|t a|s s|aux|par|nal|a p|ans|dan|qui|t p| dé|pro|s p|air| ne| fo|ert|s a|nce|au |ui |ect|du |ond|ale|lit| po|san| ch|és | na|us |com|our|ali|tra| ce|al |e o|e n|rté|ber|ibe|tes|r d|e r|its| di|êtr|pou|été|s c|à u|ell|int|fon|oci|soc|ut |ter| da|aut|ien|rai| do|iss|s n| ma|bli|ge |est|s o| du|ona|n p|pri|rs |éga| êt|ous|ens|ar |age|s t| su|cia|u d|cun|rat| es|ir |n c|e m| ét|t ê|a c| ac|ote|n t|ein| tr|a s|ndi|e q|sur|ée |ser|l n| pl|anc|lig|t s|n e|s i|t e| ég|ain|omm|act|ntr|tec|gal|ul | nu| vi|me |nda|ind|soi|st | te|pay|tat|era|il |rel|n a|dis|n s|pré|peu|rit|é e|t é|bre|sen|ill|l’a|d’a| mo|ass|lic|art| pu|abl|nta|t c|rot| on| lo|ure|l’e|ava|ten|nul|ivi|t i|ess|ys |ays| fa|ine|eur|rés|cla|tés|oir|eut|e f|utr|doi|ibr|ais|ins|éra|’en|iét|l e|s é|nté| ré|ssi| as|nse|ces|é a',
    deu: 'en |er |der|ein| un|nd |und|ung|cht|ich| de|sch|ng | ge|ine|ech|gen|rec|che|ie | re|eit| au|ht |die| di| ha|ch | da|ver| zu|lic|t d|in |auf| ei| in| be|hen|nde|n d|uf |ede| ve|it |ten|n s|sei|at |jed| je| se|and|rei|s r|den|ter|ne |hat|t a|r h|zu |das|ode| od|as |es | an|fre|nge| we|n u|run| fr|ere|e u|lle|ner|nte|hei|ese| so|rde|wer|ige| al|ers|n g|hte|d d| st|n j|lei|all|n a|nen|ege|ent|bei|g d|erd|t u|ren|nsc|chu| gr|kei|ens|le |ben|aft|haf|cha|tli|ges|e s| si|men| vo|lun|em |r s|ion|te |len|gru|gun|tig|unt|uch|spr|n e|ft |ei |e f| wi| sc|r d|n n|geh|r g|dar|sta|erk| er|r e|sen|eic|gle| gl|lie|e e|tz |fen|n i|nie|f g|t w|des|chl|ite|ihe|eih|ies|ruc|st |ist|n w|h a|n z|e a| ni|ang|rf |arf|gem|ale|ati|on |he |t s|ach| na|end|n o|pru|ans|sse|ern|aat|taa|ehe|e d|hli|hre|int|tio|her|nsp|de |mei| ar|r a|ffe|e b|wie|erf|abe|hab|ndl|n v|sic|t i|han|ema|nat|ber|ied|geg|d s|nun|d f|ind| me|gke|igk|ieß| fa|igu|hul|r v|dig|rch|urc|dur| du|utz|hut|tra|aus|alt|bes|str|ell|ste|ger|r o|esc|e g|rbe|arb|ohn|r b|mit|d g|r w|ntl|sow|n h|nne|etz|raf|dlu| ih|lte|man|iem|erh|eru| is|dem|lan|rt |son|isc|eli|rel|n r|e i|rli|r i| mi|e m|ild|bil| bi|eme| en|ins|für| fü|gel|öff| öf|owi|ill|wil|e v|ric|f e',
    jav: 'ng |an | ka|ang|ing|kan| sa|ak |lan| la|hak| pa| ha|ara|ne |abe| in|n k|ngg|ong|ane|nga|ant|won|uwo| an| uw|nin|ata|n u|en |ra |tan| da|ran|ana| ma|nth|ake|ben|beb|hi |ke |sab|nda| ng|adi|thi|nan|a k| ba|san|asa|ni |e h|e k|g k| ut|pan|awa| be|eba|gan|g p|dan| wa|bas|aka|dha|yan|sa |arb|man| di|wa |g d| na|g n|ban| tu|n s|ung|wen|g s|rbe|dar|dak|di |g u|ora|aya|be |ah |a s|eni| or|han|as | pr|a n|na |iya|a a|kar|at |a l|mar|uwe|duw|uta|und|n p|asi|pa | si|ala|n n| un|kab|oni|ya |i h|gar|g b|yat|tum|ta |n m|i k|apa|taw| li|ani| ke|al |ka |kal|ngk|ega| ne|nal|n i|g a|ggo|ina|we |ena|dad|iba|awi|aga|a p| ta|sar|adh|awe|and|uju|ind|min|sin|ndu|uwa|gge|n l|ggu|ngs|n b|a b|pra|iji|n a|ha | bi|kat|go | ku|e p|ron|kak|ngu|a u|gsa|war|nya|g t|pad|bis|k b|i w|ae |wae| nd|ali|a m|er |sak|e s|ku |liy|ama|i l|eh |isa|arg|n t|a d|kap|i s|ayo|gay| pe|ndh|bad|pri|neg|tow|uto|eda|bed|il |ih | ik|ur |k k|rta|art|i p|rga|lak|ami|ro |aro|yom|r k|e d|a w|kon|rib|eng|ger|g l|ras|dil| ti|k l|rap|mra|uma| pi|k h|n d|gaw|wat|ga |k n|ar |per| we|oma|k p|jro|ajr|saj|ase|ini|ken|saw|ona|nas|kas|h k|i t| um|tin|wo | me|aba|rak|pag|yar|sya|t k| te| mu|ngl| ni|i b|men|ate|a i|aku|ebu|a t| du|g m|owo|mat| lu|amp',
    vie: 'ng |̣c |́c | qu|à | th|nh | ng|̣i |̀n |và| va| nh|uyê| ph|quy| ca|ền|yề|̀nh|̀i |̣t | ch|ó | tr|ngư|i n| gi|gươ|ời|ườ|́t | co|ượ| cu|ác|ự |ợc| kh| đư|đươ| tư|có| ha|ông|c t| đê|n t|i đ|ìn|̀u |cá|gia|́i |ọi|mọ| mo|ều|iệ|đề|u c|như|pha| ba| bi|ất|̉a |ủa|củ|hôn| đô|g t|́ q|̃ng| ti|tự|t c|̣n | la|n đ|n c|n n|hiê|ch |ay |hay| vi|ân | đi| na|bả| ho|do | do| tô| hi|ội|há|ị |nà|̀ t|ới|hân| mô|́p |àn|̣ d|́ch|̣p |̀o |ào|khô|́n |ột|mộ| hô|ia |ốc|c h|hữ|i v|g n|́ng|uố|quô|h t|ôn |ên |n v|nhâ|̣ t| bâ|i c|g v|̉ng|iế|c c|ật|thư|hư |ướ|̉n | vơ| cô|c đ| đo| sư|t t|ộc|ữn|vớ| vê|ả |̣ng|g đ|̉o |ảo|uậ| đa|bị|là|sự|bấ|hà|hộ|i t|ản|hươ|̀ng|tro|̉m |o v| mi|ể |ục|i h|ức|áp|g c|̃ h|iá|n b|̉i |a m|h c|côn|ện|ớc|hạ|độ| du| cư|a c|n h|tha|ã | xa|́o |áo|ín|̀y |g b| hư|g h|ong|ron|̀ c|cho|̀ n|mì|ực|h v|c b| lu|i b|ệ |ai |ế |̣ c|xã|kha|c q|iể|tộ|ối|đố|á |hoa|o h|h đ|cả|n l|họ|tiê|y t|̉ c|ại|án|̀ đ|oà|y đ|chi|̉ n|phâ|ề |thu|iên|dụ|o c|i m|luâ|c p|ốn|c l|́ c|ũn|cũ|c g|c n|qua|n g|c m|o n|ải|hả|́ t|ho |về| tâ| hơ|o t|ở |hứ|hì|viê|̀m |̉ t|đó|thô|ứ |cứ|hí|́nh|ày|ởn|ưở| bă|tri| ta|m v|c v|ợp|hợ|h m| nư|ết|thi|ặc|ngh|uy ',
    ita: ' di|to | in|ion|la | de|di |re |e d|ne | e |zio|rit|a d|one|o d|ni |le |lla|itt|ess| al|iri|dir|tto|ent|ell|i i|del|ndi|ere|ind|o a| co|te |tà |ti |a s|uo |e e|gni|azi| pr|idu|ivi|duo|vid|div|ogn| og| es|i e| ha|all|ale|nte|e a|men|ser| su| ne|e l|za |i d|per|a p|ha | pe| un|con|no |sse|li |e i| o | so| li| la|pro|ia |o i|e p|o s|i s|in |ato|o h|na |e s|a l|e o|nza|ali|tti|o p|ta |so |ber|ibe|lib|o e|un | a | ri|ua |il | il|nto|pri|el | po|una|are|ame| qu|a c|ro |oni|nel|e n| ad|ual|gli|sua|ond| re|a a|i c|ri |o o|sta|ita|i o| le|ad |i a|ers|enz|ssi|à e|ità|gua|i p|e c|io | pa|ter|soc|nal|ona|naz|ist|cia|rso|ver|a e|i r|tat|lle|sia| si|rio|tra|che| se|rtà|ert|anz|eri|tut|à d|he | da|al |ant|qua|on |ari|o c| st|oci|er |dis|tri|si |ed | ed|ono| tu|ei |dei|uzi|com|att|a n|opr|rop|par|nes|i l|zza|ese|res|ien|son| eg|n c|ont|nti|pos|int|ico|rà |sun|ial|lit|sen|pre|tta|dev|nit|era|eve|ll |l i| l |nda|ina|non| no|o n|ria|str|d a|art|se |ssu|ica|raz|ett|sci|gio|ati|egu| na|i u|utt|ve | ma|do |e r|ssa|sa |a f|n p|fon| ch|d u|rim| fo|a t| sc|trà|otr|pot|n i| cu|l p|ra |ezz|a o|ini|sso|dic|ltr|uni|cie| ra|i n|ruz|tru|ste| is|der|l m|a r|pie|lia|est|dal|nta| at|tal|ntr| pu|nno|ann|ten|vit|a v',
    tur: ' ve| ha|ve |ir |ler|hak| he|her|in |lar|r h|bir|ya |er |ak |kkı|akk|eti| ka| bi|eya|an |eri|iye|yet|ara|ek | ol|de |vey|ın |ır |nda|arı|esi|ını|dır| ta|tle|e h|ası|etl|e k| va|ı v|sın|ile|ne |rke|erk|ard|ine| sa|ınd|ini|k h|kın|ama|le |tin|rdı|var|a v| me|e m|na |sin|ere|k v| şa| bu|lan|kes|dir|rin|dan| ma|kı |mak|şah|da | te|mek| ge|nı | hi|nin|en |n h| se|lik|rle|ana|lma|e a|ı h|r ş|ill|si | de|aya|zdi|izd|aiz|hai|ret|hiç|ına| iş|e b| ba|kla|et | hü|rın|n k|ola|nma|e t| ya|eme|riy|n v|e i|a h|li |mil|eli|ket|ik |kar|irl|hür|im |evl|mes|e d|ahs|ma |rak|ala|let|lle|un | ed|rri|ürr|bu | mi|i v|dil| il| eş|n i|la |el |mal| mü| ko|e g|se | ki|mas|lek|mle|mem|n b|ili|e e|ser| iç|n s|din| di|es |mel|eke|tir|şit|eşi|r b|akl|yla|n m|len| ke|edi|oru|nde|re |ele|ni |tür|a k|eye|ık |ken|uğu| uy|eml|erd|ede|ame| gö|e s|i m|tim|i b|rde|rşı|arş|a s|it |t v|siy|ar |rme|est|bes|rbe|erb|te |alı| an|ndi|end|hsı|unm|rı |kor|nın| ce|maz|mse|ims|kim|iç | ay|a m|lam|ri |sız|a b|ade|n t|nam|lme|ilm|k g|il |tme|etm|r v|e v|n e|ğre|öğr| öğ|al |ıyl|olm|vle|şma|i s|ger|me | da|ind|lem|i o|may|cak|çin|içi|nun|kan|ye |e y|r t|az |ç k|ece|sı |eni| mu|ulu|und|den|lun| fa|şı |ahi|l v|r a|san|kat| so|enm| ev|iş ',
    pol: ' pr|nie|pra| i |nia|ie |go |ani|raw|ia | po|ego| do|wie|iek|awo| ni|owi|ch |ek |do | ma|wo |a p|ści|ci |ej | cz| za| w |ych|ośc|rze|prz| ka|wa |eni| na| je|ażd|każ|ma |zło|czł|noś|o d|łow|y c|dy |żdy|i p|wol| lu|ny |oln| wy|stw| wo|ub |lub|lno|rod|k m|twa|dzi|na | sw|rzy|ają|ecz|czn|sta| sp|owa|o p|spo|i w|kie|a w|zys|obo|est|neg|ać |mi |cze|e w|nyc|nic|jak| ja|wsz| z |jeg|wan|ńst|o s|a i|awa|e p|yst|pos|pow| ró|o o|jąc|ony|nej|owo|dow|ów | ko|kol|aki|bez|rac|sze|iej| in|zen|pod|i i|ni | ro|cy |o w|zan|eńs|no |zne|a s|lwi|olw|ez |odn|rów|odz|o u|ne |i n|i k|czy| be|acj|wob|inn| ob|ówn|zie| ws|aln|orz|nik|o n|icz|zyn|łec|ołe|poł|aro|nar|a j|i z|tęp|stę|ien|cza|o z|ym |zec|ron|i l|ami| os|kra| kr|owe| od|ji |cji|mie|a z|bod|swo|dni|zes|ełn|peł|iu |edn|iko|a n|raj| st|odo|zna|wyc|em |lni|szy|wia|nym|ą p|ją |zeń|iec|pie|st |jes| to|sob|któ|ale|y w|ieg|och|du |ini|war|zaw|nny|roz|i o|wej|ię |się| si|nau| or|o r|kor|e s|pop|zas|niu|z p|owy|w k|ywa| ta|ymi|hro|chr| oc|jed|ki |o t|ogo|oby|ran|any|oso|a o|tór| kt|w z|dne|to |tan|h i|nan|ejs|ada|a k|iem|aw |h p|wni|ucz|ora|a d| wł|ian| dz| mo|e m|awi|ć s|gan|zez|mu |taw|dst|wią|w c|y p|kow|o j|i m|y s|bow|kog|by |j o|ier|mow|sza|b o|ju |yna',
    swh: 'a k| ya|na |wa |ya | ku|a m| na| ha|i y| wa|a h|a n|ana|aki|ki |la |hak| ka|kwa|tu | kw| ma|li |a a|ila|i k| ki|ni |a w|ali|a u| an| mt|ke |mtu|a y|ake|ati|kil|ka |ika|kat|ili|te |ote|we |a s|e k|ia |zi |u a|za |azi|ifa|ma |yak|yo |i n|ama| yo|au | au|e a|kut|amb|o y|ha |asi|fa |u w|hal|ara|sha|ish|ata|ayo| as|tik|u k| za|i z|ina|u n|mba|uhu|hi |hur|cha|yot|ru |uru|wat| ch|eri|ngi|e y|u y|i a|aif|tai| sh|nay|chi|ra |ani| bi| uh|sa | hi|i h|awa|iwa|a j|ti |mu |o k|ja |kan|uli|iwe|any|i w| am|e n|end|atu|kaz|o h|ria|her|she|shi|nch| nc|uta|ye |wak|ii |ele|ami|adh|eza| wo|iki|oja|moj|jam| ja|aka|bu |kam|kul|mat|fan|a l|agu|ind|ne |iri|lim|wen|da |kup|uto|i m|a b|ini|wan|bil| ta|sta|dha| sa| ni|ao | hu|e w|wot| zi|rik|kuf|aji|ta |wez|nya|har| ye|e m|si |lin| ut|ine|gin|ing| la|a t|zim|imu|ima|tak|e b|uni|ibu|azo|kos|yan|nye|uba|ari|ahi|nde|asa|ri |ham|dhi|eli|hir|ush|pat| nd|kus|maa|di |nda|oa |bar|bo |mbo|oka|tok|ndw|ala|wal| si|uzi|hii|tah|i s|o n|liw| el|upa|zin|hag|a c|ndi|ais|mai|eny|mwe|aa |ewe| al|ndo|e h|lo |umi|kuh|jib|osa|mam|a z|ufu|dwa|u i| in|iyo|nyi| ny|u m|sil|ang|o w|guz|zwa|uwa|kuw|hil|saw|uch|ufa|laz|und|aha|ua | mw|bal| lo|o l|a i|del|nun|anu|nji| ba|lik|le |uku|i i',
    sun: 'an |na |eun|ng | ka|ana| sa| di|ang|ung|un |nga|ak | ha|keu| ba|a b| an|nu |hak| bo|anu|ata|nan|a h|ina| je|aha|ga |ah |awa|jeu| na|ara|ing|oga|bog|gan| ng|asa|kan|a s|ha |ae |bae|n k|a k| pa|a p|sah|g s|sar| si|sin|a n|din|n s|ma | at|aga|a a|tan| ku| ma|n a|san|man|wa |lah|pan|taw|u d|ra |ari|eu | pi|gar| pe|kat| te|n p|sa |per|a d|a m|e b|aan|ban|ran|ala|ike|n n|kum| ti|ama|a j|pik|ima|n d|al |at | ja|ila|ta |nda|bas|rim|teu|n b|eba|beb|udu|aya|ika|ngg|nag|kab|rta|art| me|ola|k n|uma|atu|aba|g k|adi|aca| po|ngt|nar|una|ate|oh |boh|awe|di |tin|asi|uku|n h|dan|aka|iba|car|sac|gaw|are|ent|um |jen|abe|u s|dil|pol|ar |ku |kud|u m|upa|han| hu|ake|bar|ur |hna|aru|h s|a t|sak|wat|kaw| so|n t|pa |mpa|du |ngk|g d|ena|huk| mi|mas|ngs|ti |n j|ka |aku|ren|n m| ta|law|isa| tu|und|a u|h a|tay|ula|aja|ali|nte|gsa|en |gam| wa|ieu|ere|k h|jal|h b|il |dit|ngu|lan|asu|yun|ayu|gta|k d|a r|g n|mah|uda|dip|kas|rup|geu| be|ter|sej|min|ri |ern|u p|k k|amp|ura|kal|e a|k a|ut |g b|nak|bis| bi|k p|tes|end|we |h k|tun|uan| un| de|u n|h t|ksa|u k|ian|wil|u b|ona|nas|uka|rak|eje| se|ami| ke|war| ra| ie|k j|eh |ya |lma|alm|pen|tur|wan|lak|h j|g a|ean|up |rga|arg|r k|u t| ne|deu|gal|gke|e t|h p| ge|g t| da|i n',
    ron: ' de|re | în|și |are|de | și|te |ul | sa|rep|e d|ea |ept|dre|tul|e a| dr|ie |în |ptu|le |ate|la |e p| la| pe|ori| pr|ce |e s| or|au |tat| ar|ice|ii |or |a s| fi| a |ric|ale|per| co|nă |ă a|rea|ers|i s| li|sau| ca|rso|ent|lor|ați|al |a d|e o|men|l l|ei |e c|pri|ană| ac| re|uri|ber|ibe|lib|a p|oan|soa| in|i l|ter| al| să|tea|lă |car|tăț|să |tur|i a|i d|nal| ni|ri |ita|e î|e ș|se |ilo|in |ia |ție|pre|fie|ții|ăți|con|ere|e f|a o|eni|nte| nu| se|ace|ire|ici| cu|i î|a c|i n|a l|pen|ui |nu |ări|ală|ona|l d|ră |ert|ril| su|ntr|n c|rin| as|ni |i o|eri|tă |că |ile|ă d|i c|e n|ele|sa | mo|i p|fi |sal|tor|va |oci|soc|nic|pro| un| tr|est|inț|a î|uni|n m|a a| di|ecu|lui|sta|lit| po|tre|gal|ega|oat|ra |act|ă î|leg|u d|e l|nde|int|a f|n a| so|naț|ara|i f|uie|iun| to|tar|ste|ces|rar|at | ce|eme|i ș|rec|dep| că| o | îm|bui|ebu|reb| eg| na|mân|ntu|ili|văț|ând|iei|r ș|bil|pli|od |mod|res|din|e e|cți| au|ali|ă p|ă f|împ|ial|cia|ion|ă c|dec|nta| om|ită| fa|ță |cu |tra|ăță|nvă|înv|ât |ite|i i|lic| pu| ex|riv|tri|rot|ța |ți |l c|rta|imi|ulu|țio|ică|lig|rel|ta |cla|t î|nt |nit|e m|ânt|ămâ|țăm|ger|nța|ru |tru|gur|u c|bli|abi|ată|art|par|ar |rim|iva|l ș| sc|ime|nim|era|sup|ind|u a|dic|ic | st| va|ini|igi|e r',
    hau: 'da | da|in |a k|ya |a d| ya|an |a a| ko| wa|na | a |sa | ha|kin|wan|ta | ba|a s| ta|a y|a h|wa |ko | na|n d|a t|ba |ma |n a| ma|iya|hak|asa| sa|ar |ata|yan| za|akk|a w|ama| ka|i d|iki|a m|owa|a b| ci| mu| sh|anc|nci|kow|a z|ai |nsa|a c|shi| ƙa|cik|ne |ana|i k|ci |kki|e d|a ƙ| ku|su |n y|uma|ka |uwa|kum|hi |a n|utu| yi|ani| ga| ra|aka|ali|mut|‘ya|tar| do|ɗan|ars| ‘y|sam|ƙas|nda|ane|man|tum|i a|yi |ni | du|ada| su|and|a g|cin| ad|a i|ke | ɗa|n k|yin|um |e m| ab|ins|nan|ki |mi |ami|yar|min|oka|re |i b|kam|mas|i y|mat|za |ann|en |aɗa| ja|m n|li |duk|dai|e s|n s|ra |n w|n h|aik| ai|ida|ga |san|rsa|aba|sar|ce |nin| la|o n|ban|nna|kan|abi|una|dam|me |ara|i m|hal|a r|add|are|n j|abu| ne|zai|a ɗ|wat|ari| ƙu|on |ans|waɗ|ame|ake|kar|din|zam| fa|a l|ƙun|buw|r d| hu|oki|kok|a ‘|u d|n t|abb|aur| id|rin|yak|dok|kiy|ray|jam|n b|ubu|bub|n m|i s| an|am |ili|bba|omi|dan|gam|ayu|ash|nce|tsa|ayi|har|yya|ika|bin|han|kko|rsu|aif|imi|fa | am|i i|dom| ki|yuw|dun|o a|fan|n ƙ|aya|fi |n r|she|uni|bay|riy|n ‘|sab| iy|bat|tab|aga| ir|mar|o w|i w|sha|awa| ak|uns|unc|tun|u k| il|ɗin|mfa|amf|aci|ewa|kas|lin|n n|don|n i|ure|ifi|lai|dda| ts|iri|aye|un |tan|wad|gwa|afi| ay|ace|mba|amb|aid|nta|ant|war|lim|kya| al|aɗi',
    fuv: 'de | e |e n| ha|nde|la | wa|ina| ka|akk| nd|ɗo |na | in|e e|hak|al |di |i h|kke|ii |um |ko |ala|ndi| mu| ne|lla| jo|wal|eɗɗ|neɗ|all|mum| fo|kal|jog|ke |aaw|taa| ko|eed|ɗɗo|aa | le|ji |ade|aad|laa|o k| ng|e h| ta|re |ogi|a j|e w|e m|nnd|gii|e l|ley|awa|aag|ede|waa|e k|gu |e d| go|gal|ɓe |ti |fot|aan|eyd|ydi|ɗe |ee | re|ol |oto|i e|oti|m e|taw|nga|a i|kee|to |ann|eji|am |ni | wo|een|goo|eej|e f| he|enn|gol|agu|pot| po|dee|ay | fa|ka |a k|ond|oot| de|a f|o f|a n|wa |maa|ota|le |hay|i k|o n|ngo|e j|o t| ja|ñaa|hee|nka|i w|awi|a w|ngu|der| to|e t|dim|i n|fof|i f|e g|tee|naa|aak| do|too|a e|ndo|ren|dii|oor|er |o e|i m|of | sa| so|gaa|ani|kam| ma| ña|o w|i l|u m|kaa|ima|dir| ba|igg|lig| li|aar| ɓe|o i|e s| o |e r|so |ooj| nj| la|won|awo|dow|woo|faw|and|e i|ore|nge|nan|are|a t|tin|aam| mo|ɗee|ita|ira|aaɗ|e p|nng|ma |ank|yan|nda|oo |e ɓ|njo|ude|nee|e y|e a|je | ya|en |ine|iin| di|ral| na|ɗi |und| hu|inn|ŋde|aŋd|jaŋ|a d|den| fe| te|go | su|a h|haa|tal|eɗe|e b|y g|baa|tde| yi|ɗɗa|o h|iiɗ|ow | da|do |l n|alt| ho|l e|aga|mii| aa|a a|ama|nna|m t| ke|edd|oga|m w|l m|o j|aɗe|ree|oje|yee| no|ele|ne |ago| pa| al|guu|wi |ge |aaɓ|daa|ind|dew|i j|jey| je|ent|tan|o ɗ|geɗ| ge|ñee|a l| ɗu|kko|mak|a s| ga',
    bos: ' pr| i |je |rav|na |ma |pra| na|ima| sv|a s|da |a p|vo |nje|ko |ako|anj|o i| po|avo|ja |e s|a i|ti | im| da| u |sva|no |ju | za|o n|va |i p|ili|vak|li | ko|ne | il|koj| ne|nja| dr|ost| sl|van|im |i s|u s|i i|a n|ava|ije|a u| bi|stv|se |a d|om |jed|bod|obo|lob|slo| se| ra|ih |sti| ob| je|pri|enj|dru|u i|o d|iti|voj|raz|ova|dje| os|e i|lo |e p| nj|uje|i d|bra|tre| tr| su|jeg|i n|u z|a k|og |u p|oje|cij|reb|a o|a b|lju|i u|ran|mij|ni |nos|jen|ba |edn|svo| iz|jel|pro|e d|žav|bit| ni|i o|sta|a z|avn|vje| ka|bil|ovo|a j|aju|ist|nih|tu |red|gov| od|e o|oji| sm|lje|o k|ilo|ji |aci|e u|e n|pre|o p|eba|u o|su |vim|ičn| sa|u n| dj|a t|ija|čno|jem|rža|drž|elj|stu|dna|odn|eni|za |iva|olj|šti|nom|em |du |vno|smi|jer|e b|de |pos|m i| do|u d|nak|a r|obr| mo|lja|nim|ego| kr|tit|kri|ve |nju|an |iko|nik|nu |i m|nog|eno|sno| st|e k|tup|rug|ka |oda|riv|vol|aln|m s|itu|ašt|zaš|ani|sam|akv|ovi|osn|rod|aro| mi|tva|dno|nst|jan|ak |ite|vič|rad|u m| ta|dst|tiv|nac|rim|kon|ku |odu|živ|amo|tvo|tel|pod|g p|nov|ina|nar| vj|o s|i b|oj | ov|ave|vu |ans|oja|zov|azo|ude|bud| bu|e t|i v|din|edi|nic|tan|nap|mje| is|jal|slu|pun|eds|o o|zak|jav|i k|m p|tno|ivo|ere|nič|m n|jim|kak|ada|vni|ugi| ro|mov|ven|pol|to |te | vr',
    hrv: ' pr| i |ma |rav|ima|pra|je |na | sv|ti | na|a p|vo |vat|ko |a s|nje| po|anj|avo|o i|tko| im|a i|sva|no |i p|e s|ja |o n| za|ju |ili| u |va |li | bi|ne |i s|atk| il|iti|da | ne| ko| dr| sl|van|nja|koj|ije| ra|ova| os|u s|i i|ost|bod|obo|lob|slo|pri|a n|om |jed|ati|ih |im |voj|ava| ob|stv|se | mo|i u|bit|dru| je| se|dje|i o|enj| ka|i n|sti|lo |u i|svo|mij|ni |e i|raz|a o|e n|bra|o p| su|a b|u p|ran|a k|og |i d|bil|ako|e p|a d|edn|aju|mor|eni| nj|iva|jel|žav| ni|a z|avn|ovi|eno|ra |oje|a j| da|a u|ora|jeg| iz|nih|rža|drž|oji|sno|nit|jen|vje|ilo|cij|oda|nim| dj|pro|tit|u z|e d|red|nom|jem| od|nos|sta|nov|osn| sm|lje|o s|ji |ovo|stu|pos|vim| do|odn|rad|ist| sa|e o|tu |nju|em |gov|o d|rod|i m|jer|aci|oj |pre|m i|nak|dna|a r|lju|uje|e m|obr|za |olj|ve |o o|m s|an |nu |du |aro|vno|smi|aln|e k|o k|i b|e u|tva|u u|tup|rug|dno|u o|su |u d|ka |vol| ta|ija|itu|šti|ašt|zaš|itk|živ|ani|sam|elj| st|sob|oso|nar|akv|ada| mi|te |ona|nst|jan|lja|i v|ite|ego|elo|rim|ku |odu|amo|tvo|tel|jim|pod|nog|vi |ina| vj|to |e b|ans|zov|azo|ak | sk|edi|tan|oju|pun|pot|oti|kon|zak|i k|m p|tno|ivo|ere|nič|kak|vni|ugi| ro|mov|ven|štv| be|ara|kla|ave|u b|avi|oja|jal|u m|dni|mje|rak|din|ći |juč|klj|nic|u k|nap|obi|atn',
    nld: 'en |an |de | de| he|ing|cht| en|der|van| va|ng |een|et |ech| ge| ee|n e|rec| re|n v|n d|nde|ver| be|er |ede|den| op|het|n i| te|lij|gen|zij| zi|ht |ijk|eli| in|t o| ve|op |and|ten|ke |ijn|e v|jn |ied| on|eft| ie|sch|n z|n o|aan|ft |eid|te |oor| we|ond|eef|ere|hee|id |in |rde|n w|t r|aar|rij|ord|wor|ens|of | of|hei|n g| vr| vo| aa|r h|hte| wo|n h|al |nd |vri|e o|ren|le |or |n a|jke|lle|eni|n b|ij |e e|g v| st|ige|die|e g|men|nge|t h|e b| za|e s|om |t e|ati|wel|erk|sta|ers| al| om|n t|zal|dig| me|ste|voo|ter|gin|re |ege|ge |g e|bes|nat| na|eke|che|ig |gel|nie|nst|e a|nig|est|e w|erw|r d|end|ona|d v|jhe|ijh|d e|ele| di|ie | do|del|n n|at |it | da|tie|e r|elk|ich|jk |vol|ijd|tel|min|len|str|lin|n s|per|t d|han| zo|hap|cha|wet| to|ven| ni|aat|ion|tio|taa|lke|eze|met|ard|waa|uit|sti|e n|doo|pen|eve|el |toe|ale|ien|ach|st |ns | wa|eme|nin|e d|bij| gr|n m|p v|esc|t w|ont|ite|man|ema| ma|nal|g o|rin|hed|t a|t v|beg|all|ijs|wij|rwi|e h| bi|gro|p d|rmi|erm|her|oon| pe|eit|kin|t z|iet|iem|e i|gem|igi| an|d o|r e|ete|e m|js | hu|oep|g z|edi|arb|zen|tin|ron|daa|teg|g t|raf|tra|eri|soo|nsc|t b| er|lan| la|ern|ar |lit|zon|d z|ze |dez|eho|d m|tig|loo|mee|ger|ali|gev|ije|ezi|gez|nli|l v|tij|eer| ar',
    srp: ' pr| i |rav|na |pra| na|ma | sv|ima|da |ja |a p|vo |je |ko |ti |avo| po|a i|ako|a s| za| u |ju |o i| im|nje|i p|va |sva|anj|vak| da|o n|nja|e s|ost| ko|a n|li |ili|ne |om | ne|i s| sl| il| dr|no |koj|u s|ava| ra|og |slo|im |enj|sti|bod|obo|lob|iti|a o|stv|i u|a d|ni |jed|u p|pri|edn| bi|i i|a k|o d|sta|ih |dru|a u| je| os| ni|nos|pro|aju|i o|ran| de| su|u i|se |van|ova|i d|cij| ob|uje|red|žav|e i|i n|voj|e p|a j|dna| se| od|ve | ka|eni|rža|drž|a z|avn|aci|ovo|u u|m i|oja| iz|lja| nj|ija|u z|e o|rod|jen|lje|e b|raz|jan|lju|svo|za |gov|ičn| st|nov|sno|osn|du |ji |pre| tr|su |vu |odn|a b|jeg|nim|nih|tu |tit|šti|ku |nom|bit|e d|me |iko|čno|oji|lo |vno|nik|e n|đen|ika|bez|ara|de |u o|vim|nak| sa|u n|riv|ave|an |olj|vol| kr|o p|sme|e k|nog| ov|e u|tva|bra|rug|reb|tre|u d|oda| mo| vr|vlj|avl|ego|jav|del|m s|kri|o k|ašt|zaš|nju| sm|ani| li|dno|eđu|aln|la |akv|oj |šen|kom|stu|ugi|avi|a r|ka |rad|oju|tan|odi|vič|tav|itu|ude|bud| bu|pot|odu|živ|ere|m n|tvo|ilo|bil|aro|ovi|por|eno|štv|nac|ove|m p|tup|pos|rem|dni|ba |nst|a t|ast|iva|e m|vre|nu |beđ|ist|pun|en |te |dst|rot|zak|ao |kao|i k|juć|o s|st |sam|ter|nar| me|i m|kol|e r|ušt|ruš|ver|kak| be|i b|kla|ada|eba|ena|ona| on|tvu|ans| do|rak|slu',
    ckb: ' he| û |ên | bi| ma|na |in |maf| di|an |xwe| xw|ku | ku|kes| de| ji|her|kir|iya|ya |rin|iri|ji |bi |es | ne|ye |yên|e b|er |afê|tin|ke | an|iyê|eye|rke|erk|we | be|e h|de | we|hey|fê |i b|yê |ina| bê| li|diy|ber|li |re |î û|nê |ê d| se| ci|eke|di |wî | na|î y|af |ete|hem| wî|sti| ki|rî |kî |î a|yek|n d|kar| te|ne |yî |i h|e k|tî |tê |a w|e d|î b|s m|ast|n b|be |yan|ser|tew|net| tu| ew|hev|aza|ara|û b|n k|adi|ev |zad| az|ras|est|anê| ya|n h|n û|wed| tê|wek|bat|bo | bo| yê|st |n n|ê k|dan|ê h|ema|ê b|iye|î h|din|bûn|r k|ekî| me|par|ûna|ta |wle|ewl|î m| ke|nav|ewe|man|ê t|dî |û m|mû |emû|a m|ika|e û|n w|a x|ê m|e n| ta|ela|n j|eyê|n x|civ|wey|ana| re|khe|ekh|bik|kê |jî |f h|erî| pa|îna|bin|erb|vak|iva|a s| ni|cih|vê |e j|ari| pê|î d|nên|ike|e t|a k|ê x| ye|n a|eyî|n e|ama|bê |ar |ewa|atê|bes|rbe|av |ibe|ist|mî |tem|awa|are|hî |geh|nge|ing|nek|nûn|anû|qan| qa|vî |rti|uke|tuk| şe|eza| da|u d|û a|f û|edi| ra|tu |tiy|tên| mi|xeb| ge|hîn| hî|etê|î j|stî|mal|bib|ra |i d|e m|mam|i a|nik|i m|î k| wi|ûn | ko|a ş|ê j|riy|lat|wel|e e|ine|ane|û h|în |a d|siy|end|aye| za|ija|a n|î n|ek |tek|yet|mbe|emb|û d|rov|iro|mir|eba| xe|mên| ên| hu|nîn|anî|t û|ten|n m|dem|ê û|enê|te |art|i r| jî|u j|ekê|dew',
    yor: ' ní|ti |ọ́ |ní | lá| ẹ̀|àn |ẹ́ |kan|tí | tí|an |ẹ̀ |tọ́|ọ̀ | ẹn|ọn |wọn|í ẹ|bí |áti|lát|̀tọ|ẹ̀t| gb| àt| àw|n l|àti| a |lẹ̀|ẹnì| ó |kọ̀| ló|ì k|sí |ọ̀k| kọ|ra |ni |àbí|tàb| tà|nì | sí|̀ka|ọ̀ọ|n ẹ|àwọ|n t|ó n|̀ọ̀|ílẹ|orí|ló | wọ|tó |dè |ìyà|ún | tó| or|í ì|èdè|kò |‐èd|̀‐è|ẹ̀‐|ríl|í ó|rẹ̀|í à| sì|yàn|gbo|ṣe | kò|í a| rẹ| jẹ|sì | bá|ràn| ṣe|wọ́|nìy|fún| fú|n à|ba |n n|gbà|gbọ|jẹ́|un |ìí | kí|gba|ènì| èn|bá |́ l|a k| ka|dọ̀|kí | òm|in | fi|bò |fi |bẹ́|ọdọ|bọd|́ s|hun|nú |nín|wà |ira|nir|òmì|ìgb| ìg|́ t|ẹni|ínú|i l|ìni|mìn|bà |áà |i ì|ohu| oh|í i|ara| ti|bo |ò l| pé|rú |írà| ọ̀|í ò|ogb|kọ́|pọ̀|ó b|à t|i n|lọ́|ẹ́n| ìb|yìí|gbé|gẹ́|bog|óò |yóò| yó|n k|pé |dá |́wọ|ọ́w|à l|í k| wà|n o|jọ | ir|ọ̀r|ú ì|́ à|ó s|i t|ṣẹ́|̀kọ|í t|yé |lè | lè|fin|àbò| lọ|à n|ùjọ|wùj|irú|ó j| ar|í w|a w| ìm|ú à|̀ t|òfi| òf| àà|fẹ́|àwù|́ni|wù |ìír|mìí| mì|láì| yì|í g|ọ́n|n s|i ẹ|ẹ̀k|àgb|ígb|níg|a n| kú|láà|í o|náà| ná|kẹ́|ípa|níp|ìn | ìk|bé |i g|ọmọ| ọm|i à|iṣẹ|̀ à|ìmọ|n a|n f|jẹ |yí |́ ọ|ó d|́ ò| dá| mú|ààb|ábẹ|láb|ìbá|ò g|jú |i o|lú | èt|̀ ẹ|tọ̀|de |̀ n|i ò| ìy|kàn|́n | bí| iṣ|mọ̀|e ẹ|̀ l| fà|èyí| èy| ìd|mọ́|dé |̀ k|́ p|ò t|mú | fẹ| ìj|rí |ìkẹ|nìk|ìní|n ì|n è|sìn|è ẹ| i |rọ̀| àn|́ b|ùn |́gb|ọ́g|dọ́| dọ|í n|rin|̀ j',
    uzn: 'ish|an |lar|ga |ir | bi|ar | va|da |iga| hu|va |bir|sh |uqu|quq|huq| ha|shi| bo|r b|gan|a e|ida| ta|ini|lis|adi|ng |dir|lik|iy |ili|oʻl|har|ari| oʻ|uqi|ins|lan|hi |ing|dan|nin|kin| yo|son|nso| in| mu|on |qig| ma|ega|r i|boʻ| eg|oʻz|ni |gad|ash|i b|ki |oki|ila|yok|a b|n b|osh|ala|at |in |r h|erk| er|lga| qa|rki|h h| sh|i h|ara|n m| ba|nis|ik |igi|lig|bos|ri |qil|a t|bil|las|eti| et|n o|ani|nli|kla|i v|a q|a h|a o|yat| qo|im |a s|i m|iya|atl|oli|osi|siy|qla|cha|til| ol|ati|a y|mas|qar|inl|lat| qi|taʼ|ham|gi |ib |ʻli|mla|h v|ʻz |hun|n e|mum| da| bu| to|un |mki|umk|sha|tla|ris|iro|ha |rch|bar|iri|oya|ali| be|i o|asi|aro| ke|i t|rla| te|arc|hda|shu|tis|n h|tga| sa| xa|rak|lin|ada|ola|imo|hqa|shq|li | tu|aml|lla|sid| as|nid|a i| ki|ch |n t|nda|k b|era|siz|or |hla|a m|r v|eng|ten|mat|mda|amd|lim|miy|y t|ayo|i a|ino|ilg|tni| is|ana|as |ema| em|ech|a a|tar|kat|aka|ak |rat| de|aza|ill| si| so|gʻi|uql|n q|oda|ʼli|aʼl|nik| ni|tda|uch|gin|a u|him|uni|sit|ay |qon| ja|atn|kim|h k|hec| he|ʻzi|lak|ker|ikl| ch|liy|lli|chi|ur |zar|shl|rig|irl|dam|koh|iko|a d|am |n v|rti|tib|yot|tal|chu| uc|sla|rin|sos|aso| un|na | ka|muh|dig|asl|lma|ra |bu |ush|xal|ʻlg|i k|ekl|r d|qat|aga|i q|oiy|mil| mi|qa |i s|jin',
    zlm: 'an |ang| ke|ng | se| da|ada|ara|dan| pe|ran| be|ak |ber|hak|ata|ala|a s|ah |nya| me|da |per|n s|ya | di|kan|lah|n k|aan|gan|dal|pad|kep|a p|n d|erh|eba|nga|yan|rha| ya|nda|ora|tia|asa| ha|ama|epa| or|iap|ap |a b| at| ma|eti|ra |tau|n a|set|au | ba|pa | ad|n p|tan|p o|eng|a d|men|apa|h b|h d|dak|man|a a|ter| te|k k| sa|n b|ana|g a|end|leh|ole|a k|am |n y|aka|eh |lam|bas|beb|n m| un|pen|sa |keb|sam|n t| ti|ela|san|car|uan|ma |di |han|ega|ban|eri|at |sia|a m|ika|kes|ian|gar|seb|ta |mas|und|neg|nan|ngs|i d|erl|na |epe|emb|bar| la|atu|kla|pem|mem|emu|eca|sec|ngg|nny|any|bol|al |aha|gsa|ebe|ind|akl|n h|erk|ung|ena| bo|a t| ap|ers| de|in |tu |pun|as |agi|ann|g b|bag| ne|ain|hen| he|era|rat|sem| su|adi|lan|g s|dia|mat|ses|iad| ta|iha|g t|tin|k m|k h|i k|gi |i s|ing|uka|enu|den|lai|k d|ert|ti |rka|aja|rga|lua|ker|mel|dun|ndu|lin|rli|nak|ntu|esi|aya|un |uat|jua| in|rma|erm|ai |emp|kem|ri |dil|ua |uk |h m|l d|g m|mba|kat|ese|tik|ni |ini| an|mpu|ka |dar|mar|rja|erj|arg|u k|sua| ol|esa|dap|ar |g u|si |ent|g d| pu|awa|iri|dir|sal|gam|mbe|n i|har|a h|raa|ema|tar|i a|saa|ira|ari|pel|jar|laj|uju|tuj|rak|ura|uar|elu|t d|unt|il |wen|asi|gga|ipa|ksa|tuk|ula|sek|sas|ibu|rta|sep|rsa|nta|ati|ila|mua|yar',
    ibo: 'a n|e n|ke | na| ọ |na | bụ|ọ b|nwe|nye|ere|re | n |ya |la | nk|ye | nw| ma|e ọ| ya| ik|a o|a ọ|ma |ụla|bụl|ike| on|nke|e i|a m|ony|ụ n|kik|iki|bụ | a |ka |wer|ta |i n|do |di | nd| ga|a a|e a|a i|he |kwa| ok| ob|e o|hi |any|ga‐|ha |dụ | mm|ndi|ọ n|wa |rụ |e m|che|a e|oke|wu |aka|ite|o n|a g|odo|bod|obo| dị| ez|ara|we | ih|a‐e|hị |ri |n o|zi |mma|chi|dị |ghi|ụta|iri|ihe| an| oh|a y|gba|ụ ọ| ọz| ak| iw|nya|te |iwu| nt|ro |oro|e ị|zọ |ezi|me |e e|u n|her|ohe| si|a‐a|i m|ala|ụ i| ka|akw| in|ghị|kpe|n e|pụt| e |i i|i o|ide|inw|ụ o|hụ |ahụ|weg|ra |o i|kpa|adụ|mad|si |sit|a s| me|sor|i ọ|gid|edo|u o|e y|n a| en|tar|ozu|toz|bi |be |ụ m|ụrụ|ọrụ| ọr|mak|uso|ama|de |ị o| ọn|ọzọ|chị|egh|enw|apụ|ru | to|i a|a ụ|osi|rị |wet|hed|nch| nc| eb| al|nọd|ọnọ|uru|sir| kw|yer|ji |eny| mk|ịrị|eta| us|tu |ọ d|u ọ| o |ba | mb|ọdụ|ịch| ch|a d|pa | ag|kwe| ha|a u|e s|mkp|n u|nta|ebe|n ọ|o m|kwu|nkw|nwa|obi| ịk|esi|i e|nha| nh|le |ile|nil| ni|eme| og|e k|n i|chọ|o y|asị|otu| ot|ram|u m|ịgh|dịg|zu |nọ |mba| gb|e g|ị m|ọch|ich|pe |agb|i ị|uch|zụz|uny|wun|ọrọ| nn|na‐| di|ge |oge|iji| ij|ọha| ọh|ikp|egi|meg|o o|ụhụ|hụh|mah|n ụ|ọ g|ọta|ekọ|ị n|kwụ|agh|ụmụ|ban|kpu|okp| ah|ịkp|a k|ime| im|zụ |ụzụ|ọzụ| ụz|lit|ali|nat',
    ceb: 'sa | sa|ng |ang| ka| pa|an |ga |nga| ma|pag| ng|on |a p|od |kat|ay | an|g m|a k|ug |ana| ug|ung|ata|ngo|atu|n s|ala|san|d s|tun|ag |a m|god|g s|a a|a s|g k|g p|yon|n u|ong|tag|usa|pan|ing|una|mat|g u|mga| mg|y k| us|ali|syo| o |aga|tan|iya|kin|dun|nay|man|nan|a i| na|ina|nsa|isa|bis|a b|adu| ad|n n| bi|asy|asa|lay|awa|lan|non|a n|nas|o s|al |agp|lin|nal|wal| wa|ili|was|gaw|han| iy| ki|nah|ban|nag|yan|ahi|n k|gan| gi|him| di|a u| ba| un|ini|ama|ya |kas|asu|n a|g a|gka|agk|kan|ags|agt|l n|a g|kag| ta|imo|uns|sam| su|g n|n o|gal|kal|og |taw|aho|uka|gpa|ipo|ika|o p|a t| og| si|gsa|g t|aba|ano|gla|y s|o a|aki|hat|kau|sud|gpi|a w|g i|aha|ot |ran|i s|n m|bal|lip|gon|ud | ga|li |uba|ig |ara|g d|na |kab|aka|gba|ngl|ayo| la| hu|a h|ati|d a|d n| pu| in|uga|ok |ihi|d u|ma |may|awo|agb|ami|say|apa|pod|uha|t n|agh|buh|ins|ad | ub| bu|at |iin|a d|ip |uta|sal|hon|wo |ho |tra|lak|iko|as |aod|bah|mo |aug|ona|dil|gik|sos|lih|pin| pi|k s|nin|oon|abu|la |rab|hun| ti|mah|tar|t s|ngb|uma|hin|bat|lao|mak|it | at|s s|sno|asn|ni |aan|ahu| hi|agi|n p|inu|ulo|y p| ni|iha|mag|o n|duk|edu| ed|a e|til|ura|tin|kip|agl|gay|g h|g b|ato|ghi|nab|kon|in |ter|o u|o o|yal|sya|osy| so|tik| re| tr|hig|a o|ha |but|pak|aya',
    tgl: 'ng |ang| pa|an |sa | ka| sa|at | ma| ng|apa|ala|ata|g p|pan|pag|ay | an| na|ara| at|tan|a p|pat|n a| ba|ga |awa|rap|kar|g k|aya|lan|g m|n n|g b|nga|mga| mg|a k|na |ama|n s|a a|gan|yan|gka| ta|may|tao|agk|asa|man|aka|ao |y m|ana|g a|nan|aha|kan|y k|baw|kal|a m|g n|ing|wat| y |t t|pam|a n|o y|ban| la|ali|san|wal|mag| o |g i|aga|lay|any|g s|in |nya|yon|kas|a s|isa|una|ong|aan|kat|t p| wa|ina|tay|ya |on |o m|ila|ag |nta|t n|aba|ili| ay|o a| ga|no |a i|gal|ant|han|t s|kap|kak|lah|ari|agt|agp|ran|g l|lin|as |lal|gaw|ans|to |ito| it|hay|wa |t m| is|pap|mam|nsa|ahi|nag|bat|lip|gta| di|gay|gpa|pin| si|ngk|ung|aki|y n|iti|tat|ano|yaa|y s|mal|hat|kai|sal|hin|uma|mak|di |agi|pun|ihi|a l|i a|ira|gga|nah|s n|ap | ha|usa|nin|o p|gin|ipu|ika|ngi|i n|lag|la |y p|ini|g t|uka|nap| tu|a g|tas|aru|ipa| ip|li |al |n o|a o|t k|alo| pi|sin|syo|asy|ita|aho|nar|par|o s|pak|t a|uha|sas|gsa|ags|kin|a h|iba|lit|ula|o n|nak|a t| bu|duk|kab|sam|g e|ain|ami|mas|lab|ani|kil|it | al|agb|buh|a b|g g|ba | ib|iyo|ri |yag|ad | da|edu| ed|anl|ma |ais|iga|mba|tun|ipi| ki|od |ayu| li|lih|sar|gi |g w|pah|wir|oob|loo|agg|nli|bay|map|git|mil|ok |hon|ngg|sah|iya|pas|g h|agl|tar|ngu|amb|uku|ayo|s a|p n|n m|rus|i m|l a|abu| aa',
    hun: 'en | sz| va| a |és |min|ek | és| mi|jog| jo|an |ind|nek|sze|ság|nde|a v|den|oga|sza|val|ga |mél|ala|emé|gy |n a|van|zem|ele| me|egy|ély| eg|zab|tás| az|n s|bad|aba|ni |az |gye| el|ak | se|meg|sen|ény|ség|k j|yne|lyn| ne|ben|lam|tt |t a|et |agy|oz |hoz|vag|zet| te|n m|ez |nak|int|re |eté|tet|mel|tel|s a|em |ely|let|hez| al|s s| ki|ete|atá|z a| le|yen|es |ra |tés|ell|nt |sem|t s|len|nem|a s|ese|nki|enk|a m|ásá|i m|ban|kin|k m|szt| ál|ame|köz|k a|dsá|ads|ló | kö|ás |ly |on |ébe|tat|a t|n v|áll|mén| vé|nye|kül|lő |a n| cs|i é|ok |ész|ért|lla|lap|ágo|gok|nyi|tek| ke|nd |éte|ami|zés|yes|szo|t m|a a|het|fel|lat|lem|lle|el |z e|s e|k é|mbe|emb|elé|ot |lis|vet|kor|ág |olg| am|szá|ehe|leh|ogo|ott|ül |nte|éle|i v|ogy|hog| ho|kel|n k|tes|nlő|enl|ssá|áza|ház|ég |vel|ába|lek|ége| ha|a h|rés| fe|ány|del|elő|át |alá|art|tar|zto|zás|tő |yil|koz|tko|aló|s k|i e|árs|tár|mze|emz| ny|más|ett|ny |fej|ass|zas| há|d a|t é|is |ésé|ezé|téb| mu|áso|sít|lye|elm|éde|véd|ine|t k|os |it |izt|biz| bi|y a|m l|tot|a j|atk|nél|t n|ti | má|ai |lás|eve|nev|zte| bá|sel|ll |al |ere|n e|unk|mun|t e| ak|ife|kif|ako|s é| ér|ána| es|s t|got|sül| be|vál|csa|se |ése|ad |ges|tos|ja | gy|asz|ten|lmé| tá|eze|árm|bár|ess|l s|üle',
    azj: ' və|və |ər |ir | hə| bi| hü| ol|üqu|hüq|quq|na |in |lar|hər|də | şə|bir|lər|lik|mal|r b|lma|r h| tə|əxs|şəx|ən |dir|uqu|una|an |ali|a m| ma|ikd|ini|r ş|dən|ar |ilə|qun|aq |ası| ya|mək|yət| mə| mü|kdi|əsi|ək |ilm|nin|ndə|olm|əti|ə y|sin|xs |nda|lmə|yyə|i v| qa| az|olu|iyy|ya |ind|zad|qla|ün |ni |lə |tin|n m|aza|arı|ət |n t|maq|lun|lıq|ə b|un |nun|q v|n h|dan|ın | et|tmə|ərə| öz|da |ə v| on|ə a|ına|ını|bil|a b|sı |il |əmi|ara|si | di|ə m|əri|rlə| va|ə h|etm|ığı|ama|dlı|adl|rin|bər|rın|n i|müd|nın| he|mas|ik |n a|dil|alı|irl|ələ|üda|sın|ınd|xsi|li |ə d|nə | bə|əya| in|ə i|lət| sə|nı | iş|anı|eç |heç|q h|eyn|ə e|dır| da|asi|rı |iş |ifa|lığ|i s|fiə|afi|daf| ed|məz|u v|kil| ha|ola|n v|əni|ır |uq |unm| bu| as|sia|osi|sos|ili|ıdı|lıd|nma|ıq |inə|əra|sil|xil|axi|dax|adə|man|a h|ə o|onu|a q|əz | ki|seç| se|ı h|min|lan|ədə|bu |raq|lı |ılı|al |ə q|r v|nla|hsi|əhs|təh|öz |ist| is|məs| əs|ina|ə t|ətl|a v|iə |n b|tər| ta| cə|edi|ala|kim|qu |i t|ulm|məh|n o|aya|ı o|ial| so|ill|siy| də|var|ins|mi |ğı |nik|r i|aql|k h|təm|tam|çün|üçü| üç|ğın|sas|əsa|z h|əmə|zam| za|sti|rəf|n e|r a|ild|həm|ıql|yan|may|n ə|mən|mil| mi|əqi|din|n d|tün| dö|miy|kah|ika| ni|fad|tif|l o|sər|yni| ey|ana|lən|am |ril|ayə|aşı',
    ces: ' pr|ní | a | ne|prá|ráv|na |ost| po|ho | sv|o n| na|vo |neb|ávo|bo |ebo|nos|má | má|ažd|kaž| ka| ro|ch |dý |ždý|ti |ou |a s| př| za|ání|á p| je| v |svo|ého| st|ý m|sti|ně | by|obo|vob|ter|pro|ení|bod| zá| sp|í a|rod|kte|by |mu |u p|o p| ná|ván|jak| ja|a p|o v|í n|ová|oli|ví |spo|roz| kt|mi |í p|ny | ma|ím |i a|do | so|odn|áro|nár|li |né |tví|at |ých|a z| vy|byl|vol|en |ýt |být| bý|t s|tní|stn|o s|í b|to | do|své|vé |ran|ejn|zák|eho|jeh|nes|pří|mí |čin|kol|ají|sou| vš|ích|it |ným|ým |nu |hra|nou|u s|ému| k |du |žen|pod| ze|kla|a v|stv|pol|dní|eré|m p|stá|je |ci |ečn| ni|néh|a n|aké|áva|maj|em |rov|í m|ké |ole|nýc|ova| ve|ako| ta|i k|chr|och| oc|kon|i p|í v|smí|esm|kdo|st |i n|o z|ave|odu|bez| to|sta|ech|jí |o d|sob|se | se|í s|ými|i s| i |i v| vz|ním|pra|lně|při|tát|ste|a j|aby| ab| s |oln|a o|m n|čen|slu|řís| os|zem|mez| či|lní|áln|oci|jin| ji|y b|í z|y s|va |vše|t v|ovn|chn|děl|níc|leč| pl|vat| vo|vin|rav|vou|lad|inn|é v|anu|tej|u k|stu|est| tr|ky |ikd|nik|ivo|nit|zen|u o|ném|nez|iál|ího|len|ens|ože|oko|kéh|rac|ven|í k|e s|lán|ělá|zdě|vzd|t k|din|odi|tí | od|ré |tup|pov|pln|ště|ákl|nno|tak|erá|řed|o a|a t|res|jíc| mu|u z|rok| ob|čno|u a|y k|i j|é n|luš|ísl|oso|ciá|soc|níh|o j|cké',
    run: 'ra |we |wa |e a| mu|a k|se | n | um| ku|ira|ash|tu |ntu|a i|mu |umu|mun|unt|ere|zwa|ege|ye |ora|teg|a n|a a|ing|ko | bi|sho|iri| ar| we|shi|aba|e n|ese|go |a m|o a|gu |uba|ngo|nga|hir| ca|ugu|obo|hob|za |ndi|ish|gih| at|ara|wes| kw|ger|ate|a b| ba| gu|e k|can|ama|ung|bor|u w|mwe|di | ab|nke|ke |kwi|ka |ank|yo |ezw|n u|na |iwe|e m|rez|ri |a g|gir| am|igi|e i|ro |a u|ngi|e b|ban| ak| in|ari|n i|hug|ihu|e u|riz|ang|nta| vy|ata| ub|and|aka|rwa| nt|kur|ta |iki|kan|iza|u b|ran|sha|o n|i n| ig|ivy| iv|ahi|bah|u n|ana| bu| as|aku|ga |uko|o u|ho | ka|ose|ubu|ako|guk|ite|o y|ba |i b|any|kir|o k|aho|iye|kub|amw|nye|aha| ng|o m|nya| it|re | im|o b|izw|kun|hin|e c|vyo|o i|vyi|ngu|uri|imi|imw|gin|ene|u m|zi |ha |kug|bur|uru|jwe| zi|u g|era|aga|ron|abi| y |e y| uk|gek|ani| gi|eye|ind|wo |u a|i a| ib|i i|ras|bat|gan|amb|n a|onk|rik|ne |ihe|agi|kor| ic|ze |tun|ibi|wub|nge|o z|tse|nka|he |rek|twa|gen|eko|mat|ber| ah|ni |ush|umw| bw|mak|bik|ury|yiw|bwo| nk|ma |no |kiz|uro|gis|aro|ika| ya|gus|y i|wir|ugi|uki| ki|a c|ryo|bir| ma| yi|iro|bwa|mur|eng|ukw|hat|tan|utu|wit|w i| mw|y a|mbe| ha|uza|ham|rah| is|irw|o v|umv|ura|eny|him|eka|bak|bun| ny|bo |yig|kuv|wab|key|eke|yer|vye|i y|ita|ya |a r| ko|kwa|o c',
    plt: 'ny |na |ana| ny|a n|sy |y f|a a|aha|ra | ma|nan|n n|any|y n|a m|y m|y a| fi|an |tra|han|ara| fa| am|ka | ts| na|in |ami| mi|a t|olo|min|man|iza|lon| iz|fan| ol| ha| sy|aka|a i|reh|ay |ian|tsy|ina| ar|on |o a|etr|het|ona|y o|o h|zan|y t|a h|ala| hi|a f|y h|ehe|ira|a s|zo |y i|ndr|jo | jo|n j| an| az|ran|dia| dr|y s|fah|ena|ire|tan|dre| zo|mba| ka|m p|afa| di|n d|and|azo|zy |amp|ia |ren|iny|rah|y z|ry |ika|oan|ao |amb|lal|ho | ho|isy|ony|tsa|asa|a d|ha |fia|mis|ava|ray| pi|am |dra| to|rin| ta|ant|eo |zay|rai|tsi|itr|sa | fo| ra|van|ova|nen|azy| vo|mpi|ari|o f|tok|a k| ir|kan|oto|mah|ly |sia| la|n i|voa|haf|a r|ito|y k|oka|y r|y l|ano|ita|ene|its|ial|zon|aza|ain| re| as|fot|aro|fit|nat|nin|aly|har| ko|ham| no|fa |ary|atr|ila|ata|iha|nam|kon|oko| sa|elo|nja|anj|ive|isa|oa |dy |y d|o m|nto|ank|o n|otr|pan|fir|air|sir|ty |a v|sam|o s|tov|mit|rak|reo|o t|pia|tao| ao|no |y v|iar|a e|a z|hit|hoa| it|to |za |ton|eha|end|vy |idi|tin|ati|adi|lna|aln|rov|ban| za|nga|hah|oni|osi|sos|vah|ino|ity| at|hia|pir|ifa|omb|ame|era|vel|kar|va |tso|jak|fid|ifi|ais|o i|idy|la |ama|ba | pa|tot|ani|rar|mpa|haz|kam| eo| il|iva|aho|nao|n k|ato|lah|ovy| te|dro|lan|ela| mo| si|fin|miv|san|koa| he|aso| mb|sak|kav',
    qug: 'ta | ka|ka |na |una|cha|ash|ari|a k|ana|pak|ish|ach|hka|shk|mi |kta|hay|man| ch|apa|ak |rin|ata|kun|har|akt|ita| ha|ami|lla| pa|ama|pas|shp| ma|tak|ayñ|yñi|in |sh |ina|uku|nka|chi|aka|a c|yta|kuy|all|tap|a h|kan| tu|ñit|tuk| ru|run|chu|an |pay|ayt|ris| ki|aku|hpa|ank|a p|kam| sh|nam|a s|uy |i k|ayp|nak|pi |nta|a m| li|ay |lia|hin|kaw|nap|ant|tam|a t|iri|nat| wa|y r|kay|aws| ya|n t|ypa|wsa|pa |lak|shi|a a|lli|iku|hu |n k|iak|yay|kis| al|shu|a w|ipa| sa| il|api|kas|yku|yac|kat|a r|huk|i c|wan|hik|a i|ill|ush| ti|ayk|hpi| ku|kac|say|hun|uya|ila|ika|yuy|pir|ich|mac|ima|a y|yll|ayl|i p|kin|a l| wi|kus| yu|lan|tan|llu|kpi| ta| pi|aya|la |yan|awa| ni|kak|lat|rik|war|ull|kll|li |ink|nch|un |akp|n s|may| ay|uch|i s|nac|sha|iki|kik|h m|ukt|pip|tin|n p|iya|nal|aki| ri|ura|tik|mak|ypi|i m|i w|n m|his|k i|riy|iwa|y h| hu|han|akl|k t|mas|pik|kap| ña|u t|nmi|nis|k a|i y|k l|kar| im|i i|wil|yma|aym|ksi|iks|uma| su|h k|has| ak|unk|huc|kir|anc|k m|pal|k k|ik |iñi| iñ|ma |n y|mun| mu|mam|tac|a n|i t|k r|sam|ian|asi|k h|was|ywa|iyt|llp|san|sum|ray|si |pan|nki|tar| ii|u k|ñik|uk |iña|kuk|wpa|awp|akk|a u|wat|uri| mi|yar|uyk|ayw|h c|ha |tay|rmi|arm|uta|las|yka|llk|kul|wiñ|ati|ska| ll|kit|n h|uti|kic|mat',
    mad: 'an |eng|ng |ban| sa| ka|dha|ren| se| ba|ak | ha|adh|hak| dh|ang|se | pa|aba|a s|na |aga|ha | or|n s|ore|ara| ag|gad|are|ana|n o|ngg|ale|gan|a k|ala|dhu|tab|sar|ota|asa|eba| ot| ke|sab|ba |wi |uwi|abb|i h|huw|aan|n k|a b|bba| ta| ma|pan|hal|bas|ako|dhi|ra |kab|em |beb|ka |lak|gi |lem|g a|eka|n b|ama|nga|san|at |ong|ran|nge|a o|ggu|sa |a d|ane|n p|ken|par|aja|man|gar|ata|nek|apa| na|agi|abe| ga|e e|sal|a a|tan|g s|al |kal|gen|ta |i s|aka|e a|a p|a e| la| pe|nan| an|era|e d| e | be|n a| al|ena|uy |guy|n n|ate| bi|mas|e k|kat|uan|oan|kon|k k|a m|i d|g e|n t|g k|ada|koa|lan|ela| da|bad|ma |ne |as |lab|ega| mo|ar |car|one|i p|bi |kaa|bat|ri |on |pon| so|e b|le |ah |abi|ase|adi|epa| ep|k h|and|pam|te |ok |ste|aon|om |oko|aha|ari|ona|asi|ter| di|di |pad|e s|sad|yar|neg|ton|set|rga|ost|mos|gap|nda|a l|har|i k|ina| a | ng|kom|isa|si |a t|a h| kl|jan|daj|iga|hig|idh|hid|ndh|n m|ngs|tto|ett|arg|la |k b|ler|k d|nna| to|nao|n d|mat| ca|tad|bis|aya|epo|aen| po|bin|nya|kas|k s|n h|sya|nta|gsa|en |ant|n g|kar|i e|das|e t|e p|iba| pr|g p| ho| el|i a|hi |os |sao|uwa|tes| ja|nag|nas|lae|sia|t s|k o|nto|int|yat|arn|m p|duw|adu|eta| ko|i b|ni |g n|kla|rak|ame|mpo|jua|sok|aso|ggi|eja|pel|jam|ele| et|dil',
    nya: 'ali|ndi|a m|a k| nd|wa |na | al|yen| ku|nth|ra |di |se |nse| mu|a n|thu|hu |nga| wa|la |mun|u a|unt|iye| ka|ce |ace| lo|a l|ang|e a| la| pa|liy|a u|ens| ma|idw|ons|dwa|e m|i n|ala|kha|lo |li |ira|era|ene|ga |ana|za |o m| mo|yo |o w| ci|we |dzi|ko |o l|and|dan|hal|zik|chi|oyo|pa |ner|ulu|ena|moy| um|a p| da|ape|kap|ka |iko| an|pen|a c|to |ito|hit|nch| nc|iri|lir|wac|umo|e k|lu |a a|aye| dz|kuk|a z|dwe|tha|mal| za|ing|ufu|mu |ro |ful| uf|o c|i d|lin|e l|zo |edw| zo|o a|mwa|u w|iro|o n|lan|amu|ere| mw|nzi|dza|alo|ri | li|fun|lid|gan|so | ca|kul|ofu|nso|o z|ulo|unz|o k|mul|lam|i c|san|a b|kwa| na|a d| a |una|u k|i l|nkh|ant|aku|ca |cit|oli|ipo|dip|ama|lac|wir|han|yan|osa|uli|tsa|i m|pon|kup|u d|ti |gwi|ukh|ung|hun|lon|ank|nda|iki|ina| ko|ao |diz|phu|ati|oma|i a|tsi|pat|iya|siy|kut| ya|zid|eze|ma |i k|mer|ome|mol|u n|u o|aph|ogw|izo|mba|sid|ku |sam|awi|adz| ad|izi|ula|say|e n|khu| kh|rez|vom|bvo|okh|lok|win|akh|o o| am| on|zir|map| zi|eza|ja |go |ngo|ika|its|ats|osi|gwe| co|isa|ya |haw|ani|o p|zi |ndu|kho|ezo|kir|uni|i u| ay|lal|gal|sa |bom| bo|ola|amb|wak|ha |ba |nja|anj|ban| ba|iza| bu|udz|ngw|bun|oye|o d|nal|kus|i p|i o|i y|wi | nt|e p| si|aka|ne |men|jir|nji|sed|ets|end|eka|uma|du ',
    zyb: 'bou|iz |aeu|enz|eng|uz | bo|ih |oux|nz | di|ing|z g|ux |uq |dih|ngh| ca|ng |gen|ung|z c| mi|miz|ij |cae|z d| gi| de| ge|euq|you| ci|ngz|ouj|aen|uj | yi|ien|gya| gu|ngj|mbo| mb|zli|dae|gij|cin|ang|j d|nae| se| ba|z y|euz| cu|de |x m|oz |j g|ouz|x b|li |z b|h g| da| yo|nj |xna|oxn|rox| ro|h c|nzl|vei|yau|wz |z m|ix | si|i c|iq |gh |j b| cw|nda|yin| hi| nd|dan|vun|inh| ga|can|ei |cun|yie|q g|hoz|bau| li| gy|wyo|cwy|z h|gue|gz |gun|faz|unz|yen|uh |den|ciz| go|q c|gj | bi|ej |aej| fa|hin|zci| wn|j n|goz|gai|au |z s|q d| vu|h m|gva|hu |auj|ouq|az |h d|ya |uek|ci |nh |u d|ou |sou|jso|gjs|din|awz|enj| do|h s|eve|sev|z r|nq |sin|nhy|g g|g b|liz|kgy|ekg|sen|eix|wng|lij|ngq|bin|i d|ghc| ha|bae|hix|h y|j c|ghg|i b|ouh|en |n d|h f|j s|z v|j y|law|hci|anh|inz|q y|nei|anj|ozc|ez |enh|q s|aiq|uen|zsi|zda|hye|ujc|e c|siz|eiz|anz|g y|i g|q n|bie| ne| ae|giz|u c|hgy|g d|gda|ngd|cou| la|z l|auy|ai |in |iuz|zdi|jhu|ujh|yuz| du|j m| fu|cuz|eiq|g c|gzd| co|uyu|coz|zbi|biu| dw|i s|i n|aw |dun|yun|izy|daw| he|nho| ho|enq|x l|cie|q b|cij|uzl|x d|iuj|awj| ya|eij|dei|nde|sae|izc|wnq|wnh|sei|h b|aih|gzs|bwn|a d|u g|ngg|jca|e b|ran| ra|hcu| me|iet|van| bu|guh|hen|si |wnj| ve|u b|azl|inj|gak|gan|ozg|siu|yaw|i m',
    kin: 'ra | ku|se | mu|a k|ntu|tu |nga|umu|ye | um|unt|mun|e n| gu|we |ira|a n| n |wa |ere|mu |ko |gom|a b|e a| ab|li |e k|mba|a a|e b|aba|ga |e u|ba |omb|o k| ba|a u|ose|u b|o a| cy|ash|eng| ag|kwi| bu|za |gih|ren|ndi| ub|ang|yo |aka|gu |igi| ib|a g|a m| nt|uli|o b|ama|ihu|e i|nta| ak|ago|ro |ora| ka|ugu|hug|di |iye|ban| am|cya|ku |ta | bw|and|sha|re | ig|gan|ubu|na | kw|obo| by| bi|a i|yan|ka |sho|kub|era|ese| we|kan|aga|hob|bor|ana|byo|ura|uru|ibi|rwa|wes|u w|no |uko|i m|mo |u a|ure|ili|uba|o n|uha|uga|n a| im|ish|bwa|bwo|wiy|ali|ber|ze |ne |ush|are|o i|u m|ger|bur|ran| ki| no|ane|bye| y |ege|teg|guh| uk|n i|rag|i a|ya |u g|e m|anz|bo |abo|gar|wo |y i|ho |age|ind|o m|eke|a s|ara|zir|ite|kug|kim|aci| as|u n|ani|kir|mbe| gi|yos|kur|ugo|gir|e c|iza|aho|i b|tur|ata|o u| se|u u|zo |i i|aha|nge|mwe|iro|akw|any|eza|uki|imi|o y|ate|u k|iki|atu|bat| in|go |tan|n u|bos| bo| na|hak|iby| at|ihe|ung|ha |bul|kar|eye|eko|gek|nya|o g|shy|e y|awe|ngo|bit|mul|nzi|rer|bag|ge |imw|bah|cir|gac|bak|je |gez|imu|eze|tse|ets|mat| ru|irw|he | ni| ur| yi|ako|ngi| ng|i n|rez|ubi|gus|fit|afi|ugi|uka|amb|o c|utu|ufa|ruk|mug|bas|bis|uku|hin|e g|ige|amo|ing| af|yem|ni | ry|a r|gaz|te |erw|bwe|ubw|hwa|iko| al|ant|zi ',
    zul: 'nge|oku| ng|a n|lo |ung|nga|la |le | no|elo|lun| um|e n|wa |we |gel|e u|ele|nel|thi|ke |nom|ezi|ma |ntu|oma|hi |o n|ngo|tu |nke|onk|o l|uth|ni |a u|lek|unt| wo|o e| lo|mun|umu|pha| ku|ang|ho |kwe|ulu| ne|won|une|lul|elu| un|a i|gok|kul|ath|hla|lok|khe|eni|tho|ela|zwe|akh|kel|a k|enz|ana|ban|aka|u u|ing|ule|elw|kho|uku|ala|lwa|gen| uk|wen|ama|na |e k|ko |gan|a e|he |zin|enk|o y| ez|kat| kw|lan|eth|het|o o| ok|okw|i n|nzi|aba|e a|hak|lel|lwe|eko|ane|ka |so |yo |ayo|o a|uhl|nku|nye| na|thu|mph|do |ben|ise|kut|ike|kun| is| im|hol|obu|fan|i k|e w|nhl|nok|ini|and|kuh|ukh|kuk| ak|e i|isi|aph|zi |ile|eki|ekh| ba|eka|the|a a| le| ye|kwa|e e|fut| fu|za |mal| ab|ebe|isa| em|o w|kub|mth|i w|ndl|emp|any|olo|ga | ko|nen|nis|alu|ith|eli|ndo|seb|nda| ya|i i|eke|vik|ake|uba|abe|ezw|yok|ba |ale|zo |olu|ume|ye |esi|kil|khu|yen|emi|nez|hlo|a l|ase|ula|kek|a o|iph|o u|no |azw|kan|mel|uny|ne |ufa|ahl|lin|hul|ant|und|sa |enh|kus|kuv|lak| in|o i|din|kom|amb|zis|ind|ola|uph|wez|eng|yez|phe|phi|mba|nya|han|kuf|nem|isw|ani|iyo| iy|fun| yo|uvi|i a|ene|izi| el|cal|i e|eze|ano|nay|hwe|kup|lal|uyo|ubu|kol|oko|ulo| la|e l|tha|nan|mfu|hon|nza|hin| ey|omp|da |bo |ilu|wak|lon|iso|kug|nka|ink|i l|sek|eku| ek|thw|gez',
    swe: 'ar |er |tt |ch |och| oc|ing|ätt|ill|rät|en | ti|til|för|ll | rä|nde| fö|var|et |and| en|ell| ha|om |het|lle|lig|de |nin| de|ng | in| fr|as |ler| el|gen|nva|und|att|env|r h| i |r r|ska|fri| so|har|der| at|ör |ter|all|t t| ut|den|ka |lla|som|av |sam|ghe|ga | sk| vi| av|ete|la |ens|t a| si|r s|iga|igh|tig| va|ig |a s| st|ion|ra |tti|a o| är|ten|ns |t e|na | be|han| un| an| sa|a f| la| gr| må|nge|n s|vis|lan|må |ati|nat| åt|an |nna| li| al|t f|ans|nsk|sni|gru|äll|tio|ad | me|isk|kli|s f|t i|stä|t s|ri |med|sta|h r|lik|da |dig|ta |r o|run|on | re|lag|tta|är |kap|a i|a r|änd|erv|n e|kte|n f|rvi|nom|itt|id | mo|sky|r e|ver|äns|vil|gt |igt| na|tan|uta|dra|t o|ro |isn| fa|kal|ihe|rih|erk|r u|e s|per|l v|vid|one|rel|ber|ran|ot |mot|ndl|d f|ed |ika|män|l s|bet|t b|dd |ydd|kyd|n o|s s|str|n m|tet|sin|r f| om|rna|int|r i|end|nad|l a|ap |ers|nda|t v|ent|rbe|arb| hä|ets|häl|amh|ckl|gar|nga|r m|je |rje|arj|n i|s e|lin|r t|i s|rän| pe|ilk|t l|ern|på | på|täl|d e|dom|ege|g e|tni|r a|lit|ras| så|lln|kil|ski|enn|i o|a d|erä|n a|ara| ge|äro|a m| ar|t d|ilj|els|yck| ve|g o|frå|nas|tra|ess|del|m s|liv|l l|in |v s|g a|ast|e e|val|son|rso|e t|age|nd | eg|ial|cia|oci|soc|upp|igi|eli|g s|rkl|gad|ndr|nte|öra',
    lin: 'na | na| ya|ya |a m| mo|to | ko|li |a b| li|o n| bo|i n|a y|a n|ki |a l|kok|la | ma|zal|i y|oki| pe|ngo|ali|pe |so |nso|oto|ons| ba|ala|mot|a k|eng|nyo|eko|o e|nge|yon| ny|kol|lik|iko|a e|o y|ang|ye | ye|oko|ma |o a|go | ek|ko |e m|aza|te |olo|sal|ama|si | az|mak|e b|lo | te|ta |isa|ako|amb|sen|ong|e n|ela|oyo|i k|ani| es|o m|ni |osa| to|ban|bat|a t|mba|ing|yo | oy|eli|a p|mbo|o p|mi | mi| nd|ba |i m|bok|i p|isi|mok|lis|nga|ge |nde|koz|bo |gel|ato|o t|mos|aka|oba|ese|lam|kop| ez|lon|den|omb|o b|ota|sa |ga |e a|e y|eza|kos|lin|esa|e e|kob|e k|sam|kot|kan|bot|ika|ngi|kam|ka | po|gom|oli|ope|yan|elo| lo|ata| el|bon|oka|po |bik|ate| bi|a s|i t|i b|omi|pes|wa | se|oza|lok|bom|oke|som|zwa|mis|i e|bek|iki| at|ola|ti |ozw|lib|o l|osu|oso|e t|nda|ase|ele|kel|omo|bos|su |usu|sus|bal|i l|ami|o o|bak| nz|pon|tel|mob|mu | ep|nza|asi|mbi|ati|kat|le |gi |ana|oti|ndi|tan|a o|wan|obe|kum|nya|mab|bis|nis|opo|tal|mat| ka|bol|and|aye|baz|u y|eta| ta|ne |ene|emb|sem|e l|gis|ben| ak| en|mal|obo|gob|ike|se |ibo|’te| ’t|umb| so|mik|oku|be |mbe|bi |i a|eni|i o| mb|tey|san| et|abo|ebe|geb|eba|yeb|bu | as|ote|sik|ema|eya|ibe|mib|ai |pai|mwa|kes|da |may|boz|amu|a a|kom|mel|ona|ebi|ia |ina|tin| ti|bwa|sol|son',
    som: ' ka|ka |ay |uu |an |yo |oo |aan|aha| wa|da | qo| in| u |sha| xa|a i|ada|iyo| iy|ma |ama| ah| la|qof|aa |hay|ga |a a|a w|ah | dh|a s| da|in |xaq| oo|a d|aad|yah|eey| le|isa|lee|u l|q u|aq | si|taa|eya|ast|la |of |iya|sa |y i|u x|sta|kas|xuu|uxu|wux| wu|iis|nuu|inu|ro | am| ma|a q|wax|dha|ala|kal|nay|f k|a k|le |ku | ku| sh|o i|a l|ta |maa|a u|dii|loo| lo|o a|ale|ara|ana|iga|o d| uu|ha |lo |o m|o x|doo|aro|kar|yaa|gu |si |ima|na | xo| fa|adk|do |a x|ad |aas| qa| so|a o| ba|lag| aa| he|dka|adi|soo|o k|aqa| is|ash|u d|had| ga|eed|san|u k|a m|iin|i k| ca|u s|n l|yad|rka|axa|elo|hel|aga|hii|o h|o q| ha|id |n k| mi|baa| xu|har|xor|aar|ax |mad|add|nta|mid|aal|waa|haa|ina|qaa|daa|agu|ark|o w|nka|u h|dad|ihi| bu| ho|naa|n a|ays|haq|a h|o l| gu|o s|aya|saa|lka| ee| sa|dda|ab |nim|quu|gga|ank|kii|rci|arc|n s|a g| ji|gel| ge|eli|ysa|a f|siy|int|laa|uuq|uqu|xuq| mu|i a|uur|mar|ra |iri|o u| ci|riy|ya |ado|alk|dal|ee |al |rri|ayn|asa| di|ooc|aam|ofk|oon|to |ayo|dar| xi|dhi|jee|a c| ay|yih|a j|ban|caa|lad|sho|d k|ida|uqd|agg|sag|ras|bar|ar | ko| ra|o f|gaa|gal|fal|u a| de| ya|o c|ii |xay|eel|aab|sig|aba|orr|hoo|u q|y d|ed |ho |sad|qda|h q|fka|n i|xag|n x|qay|lsh|uls|bul|u w|jin| do|raa| ug|ido|ood',
    hms: 'ang|gd |ngd|ib | na|nan|ex | ji|eb |id |d n|b n|ud | li|nl |ad | le|jid|leb|l l| ga|ot | me|x n|anl|aot|mex|d g|b l|d d|ob |gs |ngs|jan| ne|ul | ni|nja| nj|lib|ong|nd | zh|jex| je|b j| sh|ngb| gh|gb | gu|gao|l n|han| ad|gan| da|t n| wu|il |x g|nb |b m| nh|she|is |l j|d l|nha|l g|d j|b g|el |end|wud|nex|gho|d s|d z|oul|hob|ub |nis| ch| ya|it |b y|eib| gi|s g|lie| yo| zi|oud|s j|d b|nx | de|es |d y| hu|uel|gue|ies|aob|you| ba|d m|chu|gia|dao|b d|s n|zib| go|zha|eit|hei|al |hud| do|nt |ol | fa|t g|hen|ut |gx |ngx|ab |fal|x j|b z|ian|d h|don|b w|t j|iad|nen| xi|gou|d c|b h|hao|x z|nib|anx|ant|gua| mi|s z|dan|ox |inl|hib|lil|uan|and| xa|b x| se|x m|uib|hui|d x|anb|enl| we|od |enb| du|at |ix |s m|bao| ho|hub| ng|zhi|jil|l s|yad|t m|t l|yan| ze| ju|heb|had|os |aos|t h|l d|nga| he|b a|xan|b s|sen|xin|dud|jul|d a|lou| lo|dei|d w| bi|b c| di|zhe|gt |ngt|x l|bad|x b| ja|hon|zho|blo| bl|d k| ma|deb|l z|wei| yi| qi|b b|x d|d p|eud| ge|x a|can| ca|t w|lol| si|hol|s w|aod|pao| pa|ren| re|x s|eut|pud| pu|aox|mis|gl |ngl|x w|zei|gon|enx|gha|s a|b f|l y|oub|eab|hea| to|did| ko|unb|ghu|t p|x c|geu|t s|x x|jao|ed |t c|l m|l h|jib|ax |l c|d f|nia| pi|eul|d r| no|min|l t|heu|ux |tou|ns |s y|iel|s l|hun',
    hnj: 'it | zh| ni|ab |at |ang| sh|nit| do|uat|os |ax |ox |ol |nx |ob | nd|t d|zhi|nf |x n|if |uax| mu|d n|tab| ta| cu|mua|cua|as |ad |ef |uf |id |dos|gd |ngd|hit|ib |us |enx|f n|she|s d|t l|nb |ux |x z|ed |inf|b n|l n|t n|aob|b z| lo|ong|ix |dol| go|zhe|f g| ho| yi|t z|d z|b d| le|euf|d s|ut |yao| yo| zi|gb |ngb|ndo|enb|len| dr|zha|uab|dro|hox| ge|nen| ne|han| ja|das|x d|x c|x j|f z|shi|f h|il | da|oux|nda|s n|nd |s z|b g| ny|heu| de|gf |ngf| du|od |gox| na|uad| gu|inx|b c| ya|uef| xa| ji|ous| ua| hu|xan|hen|zhu|nil|jai|rou|t g|f d| la|enf|ged|ik | bu|nya|you|f y|lob|af |bua|uk |is |yin|out|of |l m|ud |hua| qi|ot |t s| ba|ait| kh|s s|nad| di|aib|x l|lol| id|dou|ex |aod|bao| re| ga|d d|b y|las|hed|b h|b s|f b|t y|jua| ju| dl|x s|hue|b l| xi|zif|dus|b b|x g|hif|x y|hai| nz|sha| li|x t| be|d j|und|hun|ren|d y|hef|xin| ib|b t|l d|aos|s l| ha|gai|nzh|gx |ngx| ao|s b|s x|el |gt |ngt|hik|aid|s t|x m|f l|f t| pi|aof|t r|eb | gh|s y|d l|gua| bi| za| fu|t h| zu|hou|deu|lb | lb|d g| mo|b k| bo|iao|ros|gon|eut|x h|al |uaf|hab|t t|k n|f x|hix|pin|yua| no|t b|ak | zo|s m| nb| we|d b|gha|f s|mol|euk|dax|l b|nof| ko|lou|guk|end|uas|t k|dis|dan|yol|uan|d t|x b|lan|t m| ch|jix|x x| hl|aox|zis|x i|et | ro',
    ilo: 'ti |iti|an |nga|ga | ng| it| pa|en | ma| ka| a | ke| ti|ana|pan|ken|ang|a n|agi|a k|n a|gan|a m|a a|lin|ali|aya|man|int|teg|n t|i p|nte| na|awa|a p|na |kal|ng |dag|git|ega|sa |da |add|way|n i|n n|no |ysa|al |dda|n k|ada|aba|nag|nna|ngg|eys| me|a i|i a|mey|ann|pag|wen|i k|gal|gga| tu|enn| da| sa|nno| we|ung| ad|tun|mai| ba|l m| ag|ya |i s|i n|yan|nan|ata|nak| si|aka|kad|aan|kas|asa|wan|ami|aki|ay |li |i m|apa|yaw|a t|mak| an|i t|g k|a s|ina|eng|ala|ika|ama|ong|ara|ili|dad| aw|gpa|nai|et |yon|ani|aik|on |at |oma|sin|bal|ipa|n d|uma|g i|ket|ag |in |aen|n p|ram|sab|aga|nom|ino|lya|ily|syo|i b| ki|nia|agp|gim|kab|asi|kin|iam|ags|bab|oy |toy|n m|agt| ta|bag|sia|g a|gil|mil| um|o p|ngi|n w|i i|pad|pap|daa|iwa|naa|eg |ias|ed |nat|bae|o k|saa|san|pam|gsa|ta |kit|ma |dum|yto|tan|i e|t n|uka|t k|apu|lan|sta|sal| li|a b|ari|g n|den|mid|ad |o i|y a|ida|ar |aar|y n|dey| de| wa|a d|ak |bia|ao |tao|min|asy|mon|imo| gi|maa|sap|abi|i u|aib|kni|i l|gin|ged|o a| ar|kap|pul|eyt|abs|ibi| am|akn|i g|kip|isu|g t|bas|nay|ing|i d|kar|ban|iba|nib|t i|as |d n|y i|ura|a w|nal|aad|i w|lak|adu|kai|bsa|duk|edu| ed|may|agb|agk|tra|gge|sol|aso|agr|ngs|ian|ila|dde|edd|tal|aip|kua|umi|pay|sas|ita|pak|g d|ulo|inn|aw ',
    uig: 'ish| he|ini|gha|in |ili| bo|sh |bol| we|ing|nin|we |shq|quq|oqu|hoq| ho|ush|ng |qa |ni |qil|hqa|en |lis|n b|dem|shi| ad|lik|ade|hem| qi|nda|ki |em |e a|iy |din|qan|igh|uq |ge |et |han|and| bi|ige|her|tin|olu|aq |ash|idi|luq|daq|erq|ha | te|let| ya|iti|liq|kin|me |mme|emm|rqa|lus|iki| qa|de | ba|aki|yak|uql|a h|men|rim|an | er|qlu| be|shk|du |döl| dö|hri|ile|lgh|esh|q h|rki|erk|i w|uqi| me|öle|ime|ehr|nli|iq |ara|ar |lar|a b| öz|da |ik |i b|beh|hi |len|h h|ila|ayd|may|ke | ar|che|shl|nis|ydu|lin| ké|bil| mu|e q| ig|er |olm|éli|inl|tni|yet|lma|q a|ek |asi|hli|e b| as| sh|u h|hke|ali|ari|siy|shu|a i|e h| qo|rli|bir|emd| tu|ler|iye| is|ett|qi |i k|mde|he |bar|özi|etl|lid|tur|e t| al|nun|kil|tis|mni|qig|uru| je|ima|bas| ji|rek|ére|kér|r b|raw|awa| ma|a a|anu|éti|ida|emn| bu|iqi|i y|jin| sa|e e| xi|mus|k h|iri|tes|ayi|nay|ina|dil|adi|i h|zin| él|she|i q|n h|hek|n w|min|n q|tti|ti | ch|ip |iya|éri|tid|his|alg|pal|apa|les|sas|asa|e m|p q|uch|niy|qti|siz|isi|n a|il |rni|uni|chi|tim| ij|ris|i s| xa|ir |ghu|met|n i|m i| ta|atn| pa|tle|lim|gen| de|ich|kap| ka|g h|q b|i a|ün |hün|chü|üch|q q|und|sht|sit|rus|lig| to| iy|ale|y m|e d|aiy|mai|jti|ijt|eli|i d|i t|si |rqi|e i|arl|hu |ami|rin| hö|etn',
    hat: ' li|ou |an |wa |li |on | po|pou|yon|te | yo|oun| mo|un |mou|en |ak | na|n p|nan| dw|dwa| ki| fè|tou| pa| to| ak|ki |syo|se |yo |i p| ko|gen| ge|èt | sa| la| se|out|n d|ut |pa |u l|n s|ite|n n| ch|n k| de|t p|n l|cha|kon|e l|e d| re|asy|nn |fè |a a|i s|ans|fèt| a |a p|sa |swa|ni | ka|òt |n y|t m|n a|i k|hak|pi |n m|ote|men| me| so|i l|a l|lit|epi| pe| si|enn|e p|e s| ep|nm |i t|yen|k m|t l|eyi| an| ni|e n| lò|a f| ap|yi |pey|i a|son|lòt|ns |san|e k|n e|ay |n t|man|ali| os|a s|e a| pr|al |e m|osw|n f|enm|sou| ma|ap |e y| ba|ran|a k| tr|lwa|n g|aso|lib|i d| pè|ant|i g|la | ta|sos|i m|i n|ka |a c|a y|nal|anm| di|pwo| pw|ye |e t|je |k l|de | vi|ksy|t k|nen|ons|a t|alw|lal|ete| le|ta |res|ava|he |che|ati| fa|ken|oke| ok|tan|osy| pi|bli|le |tis|a g|kal|nas|a d|sye|lè |lek|a m|a n|u y|eks|re |è l|o p|tra|i f|onn|aye|way| en|ik |ze |kla|kou| sw|a r| za|ide|di |a b|vay|rav|pès|wot|ont|kot|k k|jan|o t|ona|ras|isy|sya|van|ib |è a| tè|k a|pòt| ne|pre|esp|òl |èso|ach|i o|it |ist|e r|is |s k|n o|ète|u f|nsa|t a|dev|las|u t|nte| lè|i r|l k| kò|sip|tek|ri |pas|pra|k p|nt | ja| te|ond|yal|pan|fas|iti|fan|si | ra|u d|ife|dek|bèt|ibè|u k|ret|kòl|ekò|lon|wen|s a|vle| vl|ent| aj|ibl|ini|npò|enp| as|è s',
    hil: 'nga|ang| ka|ng | sa|ga |an |sa | ng| pa| ma|ag |on |pag| an|a p|san|n s|ata|a k|ung|kag|n n|a m|kat| ta|gan|ags|ay |tar|gsa|tag|g p|run|aru|a s|ala|g k|kon|g m|man|a t|ing|agp|n k| si|may|y k|g t|mga| mg|g s|a i|a n|mag|ya |gpa|sin|n a|uko|yon|la |hil| uk|od |gin|ina|ahi|g i|kas|syo|ili|g a|iya| gi|pan|ban|way|ana|tan| pu| in|lwa|ilw|in |asa|lin|n p|gka|aya|nan|han| iy|at |g n|wal|aha|apa|o m|al |a g|lan|aba|gba| wa|kah| na|o s|a a|kab|agk|pat|ong|no |ano|ngs|pun|yan|aki|isa|o n|ali|ini|agb|nag|aga|a d|a h|ngk|i s|asy|abu|dap| hi| da|aho|agt|n m|di |n u|sal|til|sod|gso|ni |uga|mat|bah|bat|asu|a b|ato|ati| la|iba|sil|ngo|uha| su|nah|ulo|na | ba|pas| pr|ida| di|ngb|aka| ko|gay|lal|paa|o a|d s|ton|agh|pro|y n|uan|bis|ot |asi|i m|ka | is|ksy|atu|him|ila|y s|tao|gi |agi|aag|aan|o k|non|k s|ula|sul|tek|sug|gua| bi|gon|yo |n d| ib|uli| du|duk|ho |iko|hin| ed|a e|bot|ind|do |ron|aro|i a|abi|lab|eks|ote|rot|ugu|to |mak|as |s n|n b| o |n o|ad |m s|gal|una| hu| tu|but|kal|ika|a l|yag|hay|pah|nta|int|ama|pam|hat| al|uka|edu|ko |g e|ghi|lik|ami|ndi|sta|ok |tok|tra|os |abo|om |alo|dal|kin|n t|hi |a w|i n|da |kda|akd|tak|lig|inu|t n|d k|ao |kaa|par|aay|rab|awa|kau|mo |gla|gko|d a|ado|g o|lo |lon',
    sna: 'wa |a k|ana|na | mu|ro | ku|a m| zv|nhu|mun|hu |dze|oku|a n|aka|che|zer|unh| ch|chi|ero|kan|ka |odz|kod| ne|zvi|rwa| pa| an|se |ra |e a|nek|va |ane|o y| we|kut| ka|ke |ake|iri|dzi|eko| yo|cha|ese|ach|ika| no|zva|ngu|ano|yok|ri |wes|u w|ang|yik|nyi|eku|ung|idz|ech|uva| dz|ipi|a z|irw|van| va|nge|iro|wan|o i|ani|nga|ich|wo |eng|ti |udz|o n|tan|ira|a y|a c|dza|sun|vak|nok| ya|a p|kwa|i p|e k|ita|rir|ko |ga |hip|unu|hec|edz| ma|ara|bat|guk|nun|sha|zwa|dzw|hen|o m|zve|o c|mo |kuv|a d|eny|ema|uta|uti| rw|ta |ino|twa|o a|pac|dzo|yak|wak| kw|i z|kus|zir|kur|rus|ere|nem|e z|emo|tem|gar| ha| ak|o k|rwo|uko|mwe|ata|e n|we |o r|and|za |zo |a i|yo |da |pan|erw|ezv|pi |asi|rud|usu|hak|uka|han| ic|guv|pir|a a|ari|isi|emu|aan|uch|re |hur|kwe|ura| in|uru|oru|kub|fan|anh|ush|hek| ye|ute|ran| ac| iy|ong|mut|i m|a r|ina|sin|pas|ait|nor|uye| uy|a u|sa |asa|i i|era|nen|omu|uit|kui|u a| ny|kud|kuc|e m|aru|uwa|uba|nir|a s|cho|enz|ndi|aga|kun|i a|sva|ge |vin|get|hap|o z| wa|sar|o p|no |muk|itw|uri|mat|ama| ko|kuw|usa|ofa|nof|kuz|vo |a v|uma|mag|wen|e p|yor|pam|emh|swa| hu|ne |ye |ete|vic|uzv|ava|ose|si |ayo|mir|apa|ton|vem|nez|do |i h|adz|azv|zan|nza|zid|mum|imb|bas|mba|mus|iki|e c|osv|hos|mho|vis|ngo|ite',
    xho: 'lo |nge|lun|oku|elo|ye |ung|nye| ng|nga|e n|la |tu |ntu| ku|a n|o l|ele|e u|lek|yo |gel|o n|nel|ho | na|ke |wa |a k| um| lo|ko |ulu|o e| ne|nke|onk|elu|any|mnt|we |ama|lul| kw|umn| wo|kub|ngo|une| no|eko|won|enz|ule| un|a u|ela|le |kun|kan|ba |a i| ok|ang|lwa|eyo|oka|alu|uba|lok|lel|ukh|kuk|aku|ala|aph|akh|kwe|ley|eth|the|u u|khe|het|nok|pha|ezi|ile|uny|use|ath|eki|khu|zwe|kul|kho|e k|wen|gok|na |o y|sel|a e| ez| uk|o o|ane|ana|hul|e a|tho| in|enk|o k|nam|o w|uku|kil|he | yo|unt|ent|ni |obu|nku|esi|ing|o z|ayo|ya |hi |lwe|phi|ban|fun|ben|elw|o a|uhl|ndl|nzi|gan|eli|olu|eni|hus|kwa|aba|ha |und|gen|uth|lal|ntl|e o|ink|hla|ise|iph|seb|ebe|isw|thi| zo|ume|kut|a a|isa|kel|izw|e i|za | ba| ab|sha|tya|een|yal|mth|i k|uph|sa | lw|alo|lan|dle|tha|lin|zi |ase|nay|i n|pho| ak|man|mal|wak|zo |bel| im|mfu|int|swa|ngu|do |nee|ene|ulo|o u|a o|tla|ezo|ga |wan|han|sen|kuh|kus|ety| es| ya| le|eng| el|kup|azi|ka |e e|olo|ubu|bal|and| se|o s|fan|okw|ant|o i|tsh|li |lis|sis|ale| en|phu| ol|ham|iso|lak|bo |mny|okh|nte|mel|ziz|sek| am|zin| ul| ub|nen|e w|ong|zel|emf|nan|ndo|yok|ube|nya|yen|len|gal|ili|e l|be |abe|ali| ph|a y|wam|aka|amn|men|lum|rhu|urh|eka|dla|u k|oli|iba| ko|thw|imf| wa|nda| is|nza| be',
    min: 'an |ak |ang| ma| ka| da|yo |ara|nyo| sa| ha|ran|ng |nan|hak| pa| ba|dan| di|ata| pu|ura|pun|kan| na|man|ok |nda|ala|o h|uak|asa|k m|ntu|k u| ti|uny|ah | ur|n k| un|tua|n d|n b|and|n s|unt|ek |g p|iok|tio|jo |n p|tau| at|dak| ta|aka|pan|au |ind|ama|pek|dap|aan|ape|nga|k d|n m|uan|tan|lia|sua|gan|amo|bas|kat|gar|o p| in|n n| jo|mo |at |mar|ado|o t|ari|di |k s|n a|am |lam| su|o d|iah|par|ban|tu |sam|adi|o s|ika|lak|ian|ko |dal|um |san| la|ai |ega|neg| ne|k k|uka|al |asi|ant|aga|bat|dek|o m|mas|eba|beb|asu|mal|n u|tar|aku|ri |kal|ana|in |atu|ti |ato|sar|ngg|lan|alu|rad|aro|ali|un |ami|o u|k h|ro |car|o b|amp|mam| bu|dok|dia|aha|n t|to |rat|ka |ila|a d|sia|anu|yar|sya|i d|sur|sas|kum|as |pam|aca|k t|ati|kar|eka|dil|any|lo |i m|h d|iba|k b|u d|kab|u p|o a|o k|kam|lai|aba|ard|dua|ndu|lin|k p|ajo|raj|han|bai|ra |n i|uku|huk|itu|dar|aya|uli|mpa|amb|i k|ain|rde|abe|did|ili| li|sac|sti| mu|bul|n h|i p|nny|k a| ko|ras|bad|k n|ndi|rga|arg|iko|tam|a n|kaw|i j|ga | an|nta|k l|apa|ida|jam|alo|sal|l d|u k| hu|das|tik|mat|dik|ia |idi|uju|lua|pul|kuk| pi|ann|il |iny|i t|bak|ust|mus|uah|pri|aja| ja|n j|h p|sio|ar |ada|oka|ngk|sa |gam|min|ik |mbe| ad|si |m d|kaa|sat|i n|i a|usi|rak|asy|aki|rik|kny|ulo',
    afr: 'ie |die|en | di| en|an |ing|ng |van| re| va|reg|te |e r|et |e v|een|e e| ge| be| te|eg |n d|le |ens|n h| he|het|ver|t d|lke|nie| in|ke |lik|of | el|e o|nde| ve|al | to|elk| op| ni| of|g t|der|id |and|eid|aan|kee|ge |ot |tot|de |hei|e b| vr| we|om | sa| aa|ord|er |e w|ige|g v|n v|ers|in |sal|nd |erk|e s| vo|dig|vry|wor|n s|asi|eni| wa| om| de|bes|rd | wo|’n | ’n| on|ond|at |ska|ede|esk|sy |nig|e t|oor|ns |men|g o|aak|eli|kap| me|lle|vol|n a|edi|din|g e|uit|op |e g|gte|rdi|aar|ik |erd|el |ak |sta| st|ap |egt|se | sy|ele|gin|sie|min|ker|ere|is | so|yhe|ryh|es |ike|wat|e n|e d|del|wer|end|ale|n o|ur |eur|s o|per| hu|re |gel|ten|deu|e k| as|it |ema|gem|nas|ger|d s| is|rin|ewe|eme|ite|ter|as |n e|soo|oed|s v|ees|wet|red|e h|d v| al|ies| ma|nsk|ig |e i|ier|hie| hi|r d|t e|man|kin|nal|ona|d o|ske|ien|e a|eri|wee|ir |vir| vi| na|n w|iem|t v|s e|r e|ion|sio|nte|tel|eke| da|taa| gr|oon|rso| pe|tee|ort|n b|d e|lyk|ely|ese|e m|sia|ont|ans| ty|rde|ind|d t|nge|d d|g s|voe|n t|ndi|rmi|erm| sl|ren|maa|d w|lan|l g|hed|t a|n g|hul|n r|waa|t g|all|pvo|opv|ang|dee|nli|osi|sos|mee|wel|k o|kan| ka|raa|spr|nsp|nse|den|aat|gen|t s|g a|ste|est|str|lin|l v|sek|d n|ern|arb|daa|s d|ods|r m|t i|yke|met|rs |n i',
    lua: 'wa |ne | mu| ne|a m|a k| ku|di | di| bu|e b|bwa|tu |udi| bw|a d|a b|ntu|e m|nga|i b|i n|shi|la |mun|yi | ba|adi|unt|u b| dy|nde|ung|ons|ya |mu |na |ga |end|nsu|a n|buk|e k| ma|any|u m|nyi|esh|de |lu |idi|ika|u n|su |ku |yon|i m| ka| mw| yo|u y|we | ud|wen|ken|dya|ji | kw|u d|mwa| an| bi|dik|sha|tun| ci|ha |hi |kes|oke|kok|bwe|kwa|dit|nji|kan|ka |mwe|ibw|yen|itu|ba |u u|ena|ang|le |ban|ala|enj|a a|e n|uko|uke|ans|u a|ana|bul| wa|nda|did|umw|ish| a |ila|bad|e d|mbu|kal|du |ndu|hin|kum|aka|nso|nan|a c|ele|ela|kwi|bu |nsh|ind|i k|sun|i d|i a|ula|ye | na|dye|u w|mba|alu|mak|ant| pa|lon| by|kus| mi|amb|gan|dil|dim|mud| cy| ns|kub|lel|u k|da |bud|enz|ond|ako|ile|e c|umb|diy|mus|abu|ja |dis|aku|bid|mal|umu|kad|dib|imu|cya|kuk|kud|so | me|ilu|ulu|ngu|ta |bak|akw|u c|iba|ush| ke|wik|eng|uba|wil|elu|und|kwe| mo|a p|omb|nza|iye|pa |mum|man|bya|kup|wu |muk|aci|a u|som|atu|ukw|upe|uka|e a|bis|kak|ngi|nge|pet|ilo|ama|iko|iku|mik|utu|ong|ulo|iki|and| um|mat|kul|uja|isu|gil|ale|nka|ata| mb|san|dif|ifu|ole|lwi|ulw|za |cik|lam|bel|awu| ya|wab|lum|ubi|sam|isa|aa | aa|fun|kon|bum| lu|eta|mbe|wel|kol| be|ane|ame| ad| tu|men|upa|tup|uku|omu|mom| my|mul|ing|ma |o u|pik|kab|cil|aji|me |uyi|kuy|o b|bon| bo',
    fin: 'en |ise|on |ais|ja |ta |an | ja|sta|n o|ist|keu|ike|oik|ell|lla|een| oi|n t| on| va|n j|aan|kai|la | ta|lis| jo|sen|lli|a o|uks|sel|tai|a j| ka|us |in |n k|a t|eus|sa |ksi|n s|ään|än |kse|nen|jok|see|oka|ai |tta|ssa|taa|mis|aa |nsa|ses|apa|tä | se|ans|den|est|ttä|all|kan|tää| yh|lai|sia|ill|ä o|a v|itt|ett|vap|aik|ia |hän| hä|ast|a k| tu|n e|ust|kun|eis|ess|ti |sti|per|ä j|n v|ain|n y|kä |n p|n m| tä|ine|isi|äne|yks|ude|ä t|a m| pe|tei|tee| mi|a s|a p|val|unn|tuk|sä |a h|sek|utt|llä|ste|yht|ava|lta|ien| sa|lä |oll| ei|ssä|n a|n h|stä| ke|alt|suu|isu|sal|tet|ois|tav|a a|ikk|sty|ekä|a y|etu| ku|vaa| te|hte| mu|pau|stu|iin|toi| to|lle| he| ri|muk| la|n l|ää | ra| ol|nno| ma|ei |uut|iit| su|oma|ami|tam|ten|att|dis|tur|aut|mää|n r|ämä|maa|oon|jul| ju|ute|iaa|et |kki|tie|ide|ä m|kaa|suo| si|saa|i s|rva|urv|väl|lin|tus|rus|eru|nna|sku|isk|lii|oli|uol|a r|sii|ite|a e|hen| ko|sil|euk| sy| ty|työ|pet|ope|ali|avi|paa|si |iss|voi|tyk|ä v|oja|vat|vas| yk|joi|vai|täm|kil|enk|mai|mie|tti|iel|rii|nkä|min|hmi|yhd|lit|ens| pu|uka|ita|ka |omi|aas|kka|jaa|uoj| ed|ala|oit|täy|i t|int|ilö|nki|eel|ä s| al|eli|lee|un |kää|oht|koh|va |eid|tun|ttu|le |na |ihm| ih|aal| av|aat|i v|non|tte|ytt|yyt|ulk|eud|van',
    slk: ' pr| a |prá|ráv| po|ho |vo |na | na|ost| ro| ne|ie |nos|ch |ávo|kto|ebo|má | má|ažd|kaž| ka|bo |leb|ale| al|o n|ani|dý |ždý|ia |ne |om |ti |ého| v | je|ova| za|á p|ý m|mi |eni|to |né | sl|tor|van|a p|sti|voj|o v| kt|nia|lob|slo| sv|mu |rov|rod|ých|svo| zá| by|o p| ná|ať | ma|nie| sp|e s|ej |nu |je |néh|o a|áva|bod|obo|a s|e a|by |a n|oci| vy|o s|odn|a z|ný |ený|mie|áro|roz|ovn|spo|u p|eho|nes|u a|nár|kla|a v|i a| sa|jeh|yť |byť|e v|stn|va |a m|sa |nýc|ným| k |ran|och|pre|a o|ému|a k|iť |ajú| do| vš|ov |čin|hra|zák|tre| ni|sť |u s|prí|stv|pod| ob| sú|a r|vše|ými|oje|ým |pri|kon|i p|vna|est|e b|smi|esm|osť| či|oré|lad| in|pol|žen|bez|áci|a a|u k|maj|šet| vo|e z|ť s|tát|i k|pro|chr| oc|nak|bol| bo| tr|i s|iu |čen|ny |du | ho|ť v|jú |del|ami|dov|vať|ko | vz|rav|pra|lne|ré |štá| ta|anu|nom|aby| ab|res|voľ|ikt|nú |niu|slu|kra|edz|e p|odu|áln| so|ože| de|é v|etk|ní |ok | pl|kým|ako| št|vin|str|ou |é p|m p|inn|rís|kej|stu|nik|med|tvo|por| to| kr|de |sta|pov|iál|ens|aké|hoc|rác|o d|ené|m a|lan|ela|zde|vzd|očn|olo| ak|loč| st|iný|ím |ast|dne|ju |oju| od|aní|tup|i n|rej| ve|pln|adn|tak|ú p|júc| s |oľn|čno|ivo|obe|luš|sob|oso| os|jin|aji|raj|iná|ade| ži|ven|vod|ciá|soc|dno|bož|ábo|náb|o r|kéh',
    tuk: 'lar| bi| we|we |da | he|ada| ha|dyr|er |an |r b|ir |ydy| ýa|bir|yň |yna|na |yr | ad|ary|dam|lyd|de |kly|yny| öz|lan|r a|her|hak|akl|aga|kla|iň |am |ara|mag|ili|r h|ga |ala|ler|dan|en |a h|öz |ar |nyň|gyn|ini|ne |bil|li |len|atl|nda| ed| ga|‐da|ygy|a‐d|ine| de|uku|huk|e h|lyg|edi|a g|ýa‐|dil| bo|kuk|lma|eri|tly|ryn|asy|a d|eti|ny |ly |niň|dir| hu|‐de|aza|ge |ýan|ile|aýy|e d|zat| az|hem| gö|ama|lyk|ýet|den|nde|any|ynd|ykl|ukl|äge|mäg|im | du|a w|a ý|gin|m‐d|em‐|in | je|n e|bol| hi| di|e a| be|p b|ra |e ö|mak| go|ni |mez|ilm|aly|ril|n b|sy |syn|rla|esi|ryň|gal| ma|etm|nma|ede| sa|lme|iç |hiç|e g|a b|lin|igi|ele|rin|iri|deň| do|ak |lik|anm|dal| ka|mal|n h|kan| ba| ýe|iýa|gat| ge|al |y b|yýe|tiň|let|ard|tle|n ý|ere|agy|ora|gor|nme|inm| gu| ki|sas|esa| es|r e|bu | bu|gar|tla|ill|ýle|lig|sin|ň ý|mel|e b|end|n a|ýar|ň h|rda|y w| et|tyn| dö| iş|çin| ar|z h|r d|ýda|ň g|nun|ünd|yly|ň w|ez |yp |kim|ýaş|olm| çä|gör|dur| äh|siý|and|daý|eli|mil|eýl|beý|erk| er|aýa|kin|ek |ndi| yn|ola|ry |r w|lim|aýl|gyý|et |e m|i ý|agt|wag| se|dol|a ö|n w|i b|eň |n p|anu|zün|özü|m ö|i g|ç k|aşa|rma|ana|ldi|my |hal|ähl|asi|ram|kda|ýyn|gda|agd|şyn|ip |lip|gel| mi|din|rle| me|at |jün|pjü|üpj| üp|ýla|mgy|emg|jem|gur',
    dan: 'er |og | og|til|et | ti|der|en | de|for|il | re| fo|ret|ing| ha|lig|de |nde| en|lle|hed|els|ver|ar |und|ed |har|ell|den|ge |ler|lse|and|r h|t t|se |ng |hve| el|enh| fr|at |e e|e o|ig |nhv| i |gen|ede|ska|ige| at|es |le |ghe|r r| in|e f|fri| me|nge|al |igh|nne|nin|l a| be| sk| af|r e|ion|af |re |han| st|om | so|r s|e s| an|eli|ne |r o| på|tig|esk|or |del|ati|på |r f| er|enn| al|ens| un| he|tio|ndl|med| si|end|kal|nat|g f|ske|ns |tte|ent|ter|det|ke |lin|som|e r| ud|ett|g o|sky|e a| ve|nte|n s|r d|tti|sni|t s|lde|vil|ale|ind|ans|r a|kel| hv|dig| li|men|ren|old|hol| na| gr|ihe|rih|sam|vær|e i|e m|s f|age| vi|d d|g h|str|ære|te |ilk|g t|r i|nal|ona|e n|rel|run|gru|d e|nd |ers| sa|r u|ere|ger|e t|tel|bes| må|t i|per|lan|isk|dli|ors|rin|e d|kab| mo| væ|all|ejd|bej|rbe|arb|gte|mme|ved|e h|må |n m|igt|res|kke|l h|sig|ld |l e| fa| ar|n f|r k|ets|rsk|t o|t f|it |t d|t v|g i|ytt|kyt|ven|ove|g e|ste|r t|eri|tet|lke| om|øre|e g|fun|orm|d a|oge|nog| no|g a|erk|kra| kr|d h|od |mod|g d|g s|ie |erv|ene|em |sta|nst| ku|isn|vis|rvi|g m|t a|ner|tes|ræn|s s|n h|int| la|ikk|el | op|lit|n a|g u|av |rav|ts |dre|t m|e u|s o|ore|l f|rit|ndi|lag|l t|ffe|rli|n e| fu|yld|dan|n o|rke|ive|raf|tra|dom| tr|i s|l l',
    nob: 'er |og | og|en |til| ha| ti| re|ett| de|ing|ret|il |tt |et |lle|for|ar | en|ver|ell|om | fo|ng |har|r h|het|ler|lig| so|hve|t t| el|ter|nne|som|enh|and|de |av |nhv|ska| å | i |le |r r|den|e e| fr|ig |r s|nde|els|se |e o| er|enn| me| st|lse|al |re |fri|tte| sk|han|or | be| in|ke | av| ut|ghe|r e|esk|nge|te |es | på|ete|der|nin|ten|på |igh|ed |l å|kal|ge |unn| sa|ent|e s|eli|n s|rin|ne |g f|itt|sam|lik|gen|t s|end|jon|sjo|asj| an|r o|g s|t o|men| al| si|lin|mme|med|g o|ner|dig|n m|ren|nte|ige|inn|e f| gr|e r|r f| ve|sni|sky|g e|del|ens|und|res|det|isk|gru|ihe|rih|tig|tti|kte|ans|g t|tel| li| un|lan|nas|t i|m e|r u|ske|e m|ns |ekt|str|t e|ers|per|ale|kke| he|rel|run| ar|kap|mot| mo|all|eid|bei|rbe|arb|e t| vi|bes|g r|ven|s f|eri| må|n e|e g| na|nn |e d|kra| kr|ot |ndl|ere|erd|rit|ære|vis|ger|ffe|id |e a|ytt|kyt|g h| et|tes| sl|i s|må | la|dom|l e|n o| fa|rav|r k|t f|nes|vær|ta |sta|ste|å d|ndi|g d|bar|l f|isn|rvi|g a|vil|nnl|r m|t d|jen|dli|e b|gre|e h|ikk|el |l o|nal|ona|opp|r a|on |n a|noe| no|ute|erk|v p|ts |e i|dre|g m|ie |gan|erv|org|ser|tat|ang|at |t v|s o|tli|fen|an |e n|ik |g i|å s|lov| lo|r l|t a|lt |ove|aff|rdi|m s|l l|nse|r t|n h| pe|sli| gj| ik|d d|old|hol|ial|sia|osi|sos',
    suk: 'na | mu| bu|we | na|hu |a n|ya | gu|a b|nhu|wa |a g|a m|unh| ya|mun|li |ili|ali|bul|i m|ilw| ba| bo|uli|han|mu |lil| al|e n|u a|bo |la |ose|kwe|ang|ulu|lwe|kil| wi|i b| se|ga |ina|le |ge |kge|ekg|sek|bi |e b|e y|lo |and|i n|yo |ila|se |lu |a s|lin|gil|ngi|akw|aki|abi| gw|si |nsi| ns|dak| nu|ng’|gan|u b|o g|ilo|nul|e g|ka |nga|ile|a w|ada|u m|gwi| ka| ad|ubi|lwa|ani|ban|o a| ly|ndi|a l| ng|jo |g’w|a i|ho |ayo|ika|dik|e k| ma|anh|gul|u n|o b| ji|o n|yab|iya|wiy|lag|ula|yak|o l|ma |ing|gi |gub|biz|lan|shi|iwa|ja | li|iha|mo |o j|wen|o s|lya|a a|ola| ku|jil|win| ga| sh|agi|ha |iga|uga|a k|iti|oma| nd|uyo|iza|za |i a|a y|yos| ha| mi| lu|iko|ndu|pan|ji |nil|ala|bos|ene|a u|ele|nhy|u g|nik|o w|iki| mh|nda|uhu|duh|hay|aji|ana| ja|gwa|nay|i y|ong|aya|mil|o m|da |lug|man|e i|abo|aga|okw| ab|nek|ngh|dul|e m|aha|uma|ubu|bus|sol|wig|ki |nya|ung|iji| gi|wit|iso|som|twa|udu|imo|eki|’we|hya|gut|iku|e u|uso|u l| il|but|mha|any| um|bal|ujo|kuj|aka|tum|waj| we|ko |ugu|bud|lon|a h|utu| uy| is|jiw|ale|e a|a j|sha|ita|lit|ibi|lyo|u w|g’h| ij|upa|tog|ida|omb|yom|ajo|atw|mat|bok|ulo|gup|lik| ul|ize| at|uto|ze |kan|ulw|u u|sho|ish|hil|ike|kal|mah|umu|je |ule|mbi| ih|kaj| lo|ti |wik|’ha|eni|yiw|umo|ito|ba ',
    als: 'të | të|dhe|he | dh|ë d|në |et |ë t|imi|për|ejt|rej|dre|e t| dr|it | e | pë| në|gji|ë p|sht|jit| gj|jtë|ër |het|ith|ve | ve| li|ush| sh| ka| i |t t|a t|kus|hku|jë |sh | ku|e p|ka |se | pa|me |e n|mit|së | nj|ë n|thk|ën |ë k|e d|ë s|in |ose|lir|h k|etë| os| si|ara|n e|një|t d|tet| ba|jer|ohe|jet|ë m|rim| nd|ë b|e k|e s|eve|eti| du|ndë|rë |ë g|tën|vet|eri|ra | me| që|t n|do |es |iri|e l|duh|dër|shk|und|si | as|re |end| ng|uhe|ndi|ësi|ga |nga|min|që |hte|ime|ash|mi |tje|i n|jes|ris|ë v|ri | ar|nje|r n| pe|ë i|ur |uk |nuk| nu|tar|i p|at |en |anë|ta |jta|e m| pu|e v|ar |sim|isë|gje|art|ë l| ma|ë r| së|ht |ish|i d|or | mb| je|lim|e a| ko|uar|ë e|cil|bar|mar|tës|edh|ëm |shë|ave|shm|nal|t a|ë j|ari|htë| ci|k d|im |snj|asn|kom|igj|t p|ës |ërk| de| kë|a n|ë a|irë|bas|esë| pr|tim|hme|ke |per|pri|vep|mun|roh|t s|ojë|ë c|tit|lli|omb|lit|par|i s| tj|s s|ij |tij|shi| fa|le |ale| ti|roj|bro|mbr|ali|ë q|nim| mu| t |n k|ti |t i|ven|uri|qër|inë|ik |esi| ra|atë|ras|t m|ëri|je |hë |pun|i i|e b|nd |jen|mev|a g|ë f|n p|ona|son|rso|ers|epr|tes|ësh| ës|ftë|oft|ore|ror|oqë|hoq|sho|ëta|zim|arë|kur|rat|kët|ëzo|i t|ill|ars|ite|ind|r d|rin| pl|ie |ërf|ë z|a p|rte|hëm|r p|tyr|bli|res|ike|te |kun|m t|lig|a d|ia ',
    sag: 'tî | tî|na | na| ng|ngb|a n|lo | lo|nga|gö |ngö|gbi|bi |nî |zo |ang|la |î l| wa| sô|sô |gan| zo|a t|îng|o n|i t|lîn| al|gü |ngü|wal|ala|ö t|alî|a l| kû| nd|î k|ô a| lê|â t|î n|ë t|ûê |kûê|ê t| mb|î m|äng|ko | te|o k|örö|e n|o a|gë |lêg|gâ |ngâ|î b|ëpë|pëp| pë|ôko|a â|î â|êgë|mû |î s|dör|ödö|köd|ï n|a k|ëe |pëe|ü t| kö| ôk|ter|a z|kua|ke |eke|yek| ay|î t|ê n|ua |bên|o t|tï |ra | am|aye|î d|û n|ê a|rê |erê|â n|ênî|mbê|rö |âng|amû|a y|a m|ga | du| ku|î g| yâ|a s|ro |oro|dut| âl|yâ |ngô|ä t| nî| âm|utï|rä |arä|âla|bê |ö n|lï |öng|o s|a p|î z|önî|ten|i n|gba|ne |ene| sê|ba |e t| gb|ndo|iä |diä|ndi|ö k|ndö| gï|ara|ïng|î w|lë |do |ï t|a w|ûng|war| ân|a a|yê | âk| da|î a|ban|o w|tën| të|âra|sâr|në |dö |î p|o ô|zön|nzö| mä|ông|se |da |ndâ|sên|tön| tö|e a|ënë|ë s|üng| nz|o p|kân| kâ|a g|bâ | ko|o l|rös| bê|ôi |gôi|îrî|ênd|ana|ta |î f| po| sâ|mbâ|âmb| sï|ëng|mba|zar| za|ibê| mû|ëtï|bët|mbë|i p| as|fa |tän|e z|lê |sor|mar| ma|sï |i s|a b|amb|odë|kod|bûn|ë n|êse|sês|ösê|o m|du | af|dë |bor| bo|ê s|gê |ngê|ô n|ä s|ätä|bät|ü n|ë ô|ata|bat|älë|päl|kpä| kp|ö w|pë |rän|ärä|sär| sä|gï | âz| ad|ö m|gî |ïgî|bîr|mbî|afa|rë |erë|ûe |kûe| âs|ön |gbâ|e l| mo|âlï|wâl|ê w|ä w|i ô|ä a|pä |ü s|yam| ya|âzo| âb',
    nno: ' de| og|og | ha|er |lle|en |ar |til| ti|il | re|ett|et |ret|om |le |har|tt | al|all|re |ing| å |ell|and| sk|ska| i |det| fr|t t|an | ei| so|enn|ne |ler| el|den|e s|ver| me|l å|leg|e h| ve| på|al | fo|dom|for|på |av |ein| sa|ten|n s|som|sam|fri|nne|r r|ei |ere|men|gje| st|de |e o| gj|je |nde|kal|dei|st |eg |tte| in|han|i s|ast|r s|ski|t o|med|rid|or |lan|ter|t e| an|ed |r f|te |t s|kje|ge | sl| av|r k|ido|e t| er|ke |jon|sjo|asj|nas|unn| ut|g f|g s|n o|g o|nga|å f|e a|der|ng |e f| gr|kil| få|r d|ske|esk| si|lik|e i|n m|ste|at |ern|ona|n e|lag|kra| kr|e n|in |t a|ren| la|nte|e d|nin|e k|nn |tan|na |seg|v p|rav|nsk|ins|me |ame|nes|e m|bei|å v|itt|eid|a s|ege|få |e r|år |e v|lov|r a| fa|gru|sla|ld |rbe|arb|ome|kap|jen|n t|jel| mo|r l|sta|ane| tr| li| må| at|kkj|ikk| ik|kan| ka| lo| na|n a|dre|ndr|ha |g g| ar|n d|eld| se|id |ot |mot|å s|va |t i|gen|nle|t d|n i|ale|ige|nal|rel|run|ag |oko|nok| no|d a|nad|frå|l d|å a|ild|var| kv|ve |erd|e e|inn|e u|g i|r h|kte|dig|gar|lin|god| vi|str|i e|l h|nge|end|t h|r o|r g|bli| bl|int|eig|nna|on |se |uta|t f|l f|e g|nom|amf|sin|pet|kår|vil|ga |mål|ene|ent|ig |fer|are|d d|g a|rn |ova|ele|g e|ik |g t|per|ens|gre| om|rt |und| un|rna|øve|høv|l e|ial|sia',
    mos: ' n | a |ẽn| se|a t| ne|a s|̃n |sẽ| ye|e n| ta| pa|n t| tɩ| so|tɩ | la|nin| ni|ãa |fãa| fã| tõ| bu|ng |tõe| b |ye |a n|or | te|a a|la |õe |tar|ẽ | ya|ne |pa | to|ed |ned|sor|e t|tẽ|aan|uud|buu|g n|r n| ma|maa|n y|ud |a y|n m|ra |ã n|paa|n p|ara|em |a b| wa|d f|n b|n d|̃ng|sã | tʊ|eng|bã |n w|an |gã |og |me |ins| na|e b|bɩ | bɩ| ka|ɩ b|am |g a|d b|aam|gẽ|taa|mb |ore|ɩ n|yel|ʊʊm|ãmb|ab |a m|tʊʊ|wa |a l| bã| ba|tog|ga |m n|re |ba |ngã|nd |aab|aa |yaa| sã|na | tũ| sõ| da|aoo|n n| yɩ|ã y|ame| me|aal|dat|n s|b s|ing|ãng|d n|ɩ y|ã t|ã s| kã|lg |m t|oor|r s|d s|̃nd|nge|el |neb|b y|nga|ar |gr |kao| bʊ|dã |to |vɩɩ| vɩ|egd|seg|men|saa|nsa| le|a k|at |ngr|n k|wã | wã|g t|oog|bũm| bũ|a p|dɩ |ʊm |ren|ɩɩm|ãad|ʊmd|da |b t|ũmb|yɩ |bãm|b n|d a|ya |g s|eb |l s| yi|kẽ| ke|rã | sɩ|m s| ti| yã| we|oab|soa| f | zĩ|b k|m b|oga|go |gdɩ|a z|õng|sõn|aor|tũ |ɩm |b p|ã p|ilg| mi|in | ko|al |ka | no|ɩ s|pʊg| pʊ|gam|̃ n|lem|ĩnd|b b|ã f|le |te |iid|uii|bui|ell|wil| wi|s a|oa |r t|e y|a g|aas|e s|ɩ t|ik |wẽ| ra|g b|tũu|e p| yõ|oy |noy|a r| zã|aba|ull|ũ n|mã |kãa|eem|kat|aka|wak|s n|nda|ll |gre|kog|loa|alo|lal|ã k|mbã|md |ẽe|k n|ag |r b|o t|eg | gã|n g|seb|ʊge|ebã|o a|bãn|sul| su|m y|bao|n z|ate|ã w|kam|mik',
    cat: ' de| i | a |la | la|es | se|de | pe|per|tat|ió |ent|ret|dre|at |a p| dr|a l|ona|nt |men|ció|ts |na |aci|al |en |t a|ls | el| to|et |tot|a s|el | co|s d|ers|er |a t|que| en|s i|ta |e l| pr|t d|rso| qu| o | ll|son|ion|té | té|ns |é d|sev|ita|als|ota| in| l’|est|cio| re| al| un|cia|ons|ame|del|res|ar |ual|lli|s e|va |nal|ia |con|ser|les|i a|rà | no|pro|els|eva|nac|a c|s p|i l|nci| le|ue |no | so| ca|a d|sta|r a|s l|l’e|ert|s a|a i|re | d’|l d|una|ues|ter|rta|e c|ats|t i|n d|s n|a u|cci|s o| pa| es| na|l p|vol|sen|ber|ibe|lib|s t|t e|ure|l i|lit|erà|ant|da |ici|oci|soc|ra |tra|ens| di|gua|igu| ma|nta|ali|ene|tes| ni|a a|nte|a e|és |o s|tre|alt|r s|com|ets|i e|par|cti|ect|ten|cte|ote|us |eta|mit|ial|om |se |i d|s s|e d|i p|pre|un |ntr|r l|ecc| tr|seg|l t|ada|dic|eme|qua|ica|eli|ó d|aqu| aq|ènc| ig|ir |iva|ssi|lic|t t|des|o p| ac|ont|act|ing|egu|ria| te|int|ndi| fo|a m| po|lig|lle|inc|ist|nse|cla|hom|ltr|i i|cie|ess|ura|ass|a f|e t|bli|seu|tal|tec|rot|ú n|gú |ngú|nin|tac|pen|nde|t s|ic |s f|ó a|ol |evo|lse|tic|dis|cap|rac|mat|iur|liu|man|ll |itj| mi|olu|e i|art|uni|rti|esp|l s|le |ble|eri|os |sos|ies| as| ob|e p|n e|s q|tri|tiu|i c| ar|ni |tur|t n|gur|vid| vi|a v|ran|àri|ind| si|’es| fa',
    sot: ' le|le |ng |ho | mo| e | ho|a l|e m|ya | bo|a h|lo | ya|ong|ba | ba| ka|na | ts|e t|tho|a b|mon|o y|o e|a m|elo|la |ets|olo|sa |oth|g l|oke|eng|kel|a k|ka | na| di|ang|mot|tla|a t|tsa|tok| se| ha|e b|o t| o |wa | tl|o l|e e|o b| to|pa |e k|lok|ha |aba|apa| a |e h|o n|so |tse|a e|hab|jha|tjh|tso|tsh|kap|se |ana|oko|ela|g o|a s|o m|let|loh|a d|e l|kol|set| ma|a a|bol|ohi|tsw|ele|hi |dit|eth| ke|lan| kg|o s|o h|eo |bo |g m|ke |ala|phe| me|etj|ola|o k| ph|aha| mm|ohl|ebe|lwa|a n|g k|swa|e d|bot| th|di | sa|atl|ena|hle|mol|tlo|ae |hae|abe|g y|ats|lat|i b|seb|to |otl|ane|g b|moh|mel|edi|lek|a f|the|wan|efe|nan|g t|e s|o a|han|ito|me |hlo| hl|shi|rel|ire|lao|kgo|hel|g h| en|g e|nah|ona|bet|man| fu|ell|kga|eha|a p|its|get|kge|mme|swe|si |thu|mat|uma|fum| ef|bel|len|ume|lal|hat|ban|kan|we |bat|tsi|ing|ato|e n|ao |o f|lel|hir|hla|sen| eo|she|pha|ano|eka|ile|fen|i k|tlh|lap|ots|fet|hal|din| ko|hen| fe|heo|got|hwa|elw|a y|i m|o o|bon|hol|son|dis|o p|alo| lo|boh|uto|hut|ben|nya|tha|abo|ita|aka|ama|ose|mab|iso|shw|e y|i l|het|oho|o d|tum| tu|llo|oll| wa|hil|ath|mos|oka|mmo|ikg|mo |uso|hah|emo|adi|boi|llw|dik|nts|lle|non|sel|all| yo|tle|e i|ike|rab|wen|meh|ame|lho|mee|ken| si|eny|oph|yal|pan|g s',
    bcl: 'an | sa|in | na|ng |sa |na | pa|nin|ang| ni| ka| ma|pag| an|n s|ion|sin|asi| as|on |cio|n n|a m| de|n a|ban|a n|a p|kan|rec|ere|der|aro|cho|ech|aci|ga |a s|n d|o n| la|mga| mg|g s|n p|o s|man|sar| o |ho |n l|asa|n k|ay |n m|wa |gwa|igw|al | ig|mba|amb|kat|o i|sai|ong|lam|ata|ro |os |iya|a a|ara|o a|agk|apa|kas|tal|a k|yan|aiy|gka|nac|ali|may|g p|san|ina|aba|a d|lin| ba| da|ag |nka|ink|o m|yo |a i|iba|aka| in|ad |ing| ga|ent|no |ayo|nta|par| pr|ano|ini|hay|aha|iri|dap|ida|abo|han|sta|nal|kai|og |agt|at |pat| co|a g|ant|pro|g n|nte|n i|t n|ia |cia|con| si|dad|do |o k|a b|tan|ron|l n|s a|mag|ran|g m|aki|s n|men|es |g d|y n|tra| so|ona|a l|ra |min|agp|uha|n b|g o|a o|n o|a c|g k|mak|aya|hos|as |ado|o p|ter|bas|ags|i n|lan|ba |g i|bos|gab|bah|li |ico|l a|kap|cci|ecc|tec|ami|isa|imi|ton|ial| re|en |g a|tay|pin|n e|ili|rab|bal|hon|ote|rot|rim|cri|ast|gpa|y m|say|iis|sii|pan|sad|nag| se|ala|gan|bil|n c|nda|d a| di|nga|taw|gta|i a|ios| es|pak|bo |aan|res| pu|a e|sab|ey |ley| le|atu|buh|mit|om |abi|e s|kab|ika|rin|ici|gsa|ale|ica|ni |ipa|nci|ind|nan| ip|cac|waa|nwa|anw| ed|lid|nes|ura|le |ibo|uli| hu|sal| gi|awe|gaw|agi|y p|to |air| bu|rar|int|ito|ndi|kam|dir|agh|oci|soc|lig| li|aen|lar| bi',
    glg: ' de|de |os |ión| a | e |to |da |en |ció|ón |der|n d|ere|ito| se|a p|eit|rei|ent|as | co|ade| pe|dad|aci|per| te|do |o d|nte|e a|ten|men| to|e d|al | pr|rso|ers|s e|a t|tod|que|soa| ou|ida| da|te | in| po|s d|oa |cia|es |o a|est| á |ra |oda| do| li|a e| es|a s|ou |con|e e|res|tra| re|nci| o |súa| sú|pro|a d|o e| pa|ar |e c|tos|lib|ue | qu|rá | na|ser|a a|er |úa | ca|ter|ia |dos| en|erá|e s|ica|a c|sta|s p|ber|nac|s n|s s| no|e o|a o| ni|ns | un|ado|e p|o á|io |cci|era|nin|des|nal|is |óns|ame|nto| so|or |se |com|pre|par|no |o t|o p|ona|e n|sen|s t|por|ais|das| as|cto|á s|eme|cio|ha |nha|unh|ara|rda|erd|ant|ici|n p|n s|ibe|n e| di|cas|nta| ac|ont|n t|dic|ndi|oci|soc|ion|ing|s o|enc|tiv|so |ali| ma|o s|a u|ngu|tad|e i|ese| me|lic|seu|ect|n c|lid|vid|ria| tr|e t|eli|e l|gua|igu| ig|l e|o m|r a|re |cti|act|ntr|ecc|ual|rec|a l|ido|nde|ind|o n|a n|cal|dis|ta | os|o ó|r d|iva|ada|mat|ste|fun| fu|tri| ó |á p|tor|nda|pen|na |on |n a|o o|ori|uer|lqu|alq|ca |rac|n o|tar|nid|bre|ibr|lo |aso|esp|a v|a i|ode|pod|und|s a|tec|ote|rot|tes|ena|ura|ín |uín|guí|egu|seg|ita|ome|ari|s i|ase| fa|ond|ial|tic|ixi|inc|sti|ist|cla|cie|e r|omo|s c|man|bal|spe|ati|edi|med|uni|ios|isf| sa|ias|ren| mo|lle|co |ico',
    lit: 'as |ir | ir|eis|tei| te|uri|ti |s t|iek|is |os | ki|us |vie|ri |tur|ai | tu| pa|ien| vi|ali|i t|žmo|sę |isę| žm|mog|kie|ena|ais| ne|ini|kvi|ekv| la|gus|lai|ogu|nas|ės |mą | į | jo| bū|s ž|vis| ar|būt| su|ant|mo |ių | ka|s i| pr|s s|mas|pri|isv|ūti|oki|s k|s a|ar | sa|sav| ti| ap| ta|tin|kai|ę į|ama|i b|s v|inė|isi|imą|s n|val|imo|jo |aci|gal| nu|s p|rin|men|i p| ku|dar|cij|sta|kur|nim|je |li |i k|tas|ms |i i|arb|ina|sin|jos| na|mis|lyg|i v|i s|asi|tik|ijo|oti|vo |mok|tie| mo| va|tų |išk|aik|iam|tai|aut|s b|lin|kit|eik|r t| ly|ntu|jim| iš|tuo|sty|ą i|r p|ega|neg|ma | įs| re| be|i n|s j|isė|nės|si |ybė|din|įst|tat|aus|es |nti|kia|i a|mų |ara|oje|aud| ga|iai| at|tis|avo|r l|suo|isu|ek |tyb|ą k|am |mos|pag|aug|aty|ieš|rie|int|nt |sva| ve|gyv|ava|tar|šal| da|o n|ima|kal| sk|kla|omi|ip |aip|o a|ito|r j|avi|ų i|ven|yve|als|jų |kim|alt|ika|agr|nuo|sau|ymo|kio|tym|tu |ška|nam|eka|uti|lie| ša|oma|nac|kin|iki|tok| ši| ji|s g|s l|ksl|ink|vai|ome|pat|o l|rei|o p|o t|ios|psa|aps|io |san|nių|uo |min|nie| ni| as|vę |ver|o k|ikl|cia|oci|soc|r k|eli|yti| to|ų t|irt|kių|s š|pas|udo|u k| or|uom|uok|eny|eno|imų|sla|i į|ati|tą |a t|lst|vei|ran|ėji|ary|tim|usi|a k|lti|gas|uot|tos|ist|ndi|ėms|ją |o v|gą ',
    umb: 'kwe| om|e o|oku| ok|a o|a k|nda| kw|ko | ly|da |wen|la |end|nu |unu|mun|omu|wa |oko|ka |o l| ko|kwa|omo|mok|iwa|le |we |o y|i o|okw|te |eka|mwe|olo| vy|a v|osi|o k|ali|ete| ey|lyo|wet|si |yok| yo|lo |vo |ang|ong|kut|sok|iso|u e|u o|a e|a l|ye |oci|gi |eye|oka|fek|ofe|nde|iñg|nga|o o|ata|ñgi| li|eci| nd|i k|ngi|wat|kal|ilo|ovo|vyo| va|pan| oc|li |so |a y|owi|ci |kuk|e k|nge|wiñ| al|avo|kul|lon|ga |ing|ili|e l|ale|lom|ala|ge |ovi|ta |ngo|ati| ya|imw|go |eli|vya|a a|uli| ol|he |ahe|iha|ele|ika| wo| ku|lil|isa|a u|ti |yo |alo|kol|o v| ov|lis|i v|lya|lin|cih|uti| yi|yal|ako|ukw| lo|wav|ung|akw|ikw|yos|val|tiw|upa| ye|onj|i l|lim|and|uka| vo| el|gol|sa |su |kok|aka|e y|lyu|ñgo| ka|yov|vik|e v|eko|yah|gis|omw| wa| la|lik|e u|ava|tav|olw|ila|e e|vak|kov|omb|aso|a c|tis| ce|tat|iyo|epa|dec|a n|va |u c|eso|ela|ama|kat| ek|kup| ha|o e|co |ekw|asu|has|yon|asi|yow| ke|i c|upi| ci|wil|cit|ole|eyo| co|liw| yu| ca|kas| ec|uta|yim|wal|yol|kiy|e w|yuk|lye| of|o w|o c|i a|ita|ola|lwi|uva|lit|iti|njo| on|apo|ipa|sil| um|lof|wam|kun|i e|anj|cel|del|han| ak|u y|añg| up|o a|tun|atu|kak|yik|yof|iki|eti|fet|oñg|loñ|ulo|koc|yi |wiw|kwi| ow| os|kuv|ndu| es|vos|yel|uyu|mak|san|mbo|jon|i w|ngu|oco|lok|yas|e n',
    tsn: ' le|le | mo|ng |go | ts|we |gwe| go|ya |ong| ya|lo |ngw| bo| e | di|a l|tsh|sa |e t|elo|a g|tlh|tsa|e m|olo|a b|wa |na |e l|o y|o t|a t|wan| kg|eng|kgo|o n| tl|a k|mon|la | na|ets|ane|mo | o |hwa|shw|tse| ba|e e|nel|a m|ka | ga|tla|ots|o m| ka|ele|o l|ba |e d|dit|e g|got|di | a |se | se|ang|a d|otl|bot|e o|lho|o e|ga |lol|e b| nn|a n|lha|so |lel|tso|o b|seg|ose|let|ola|ego|gol|o o|g l|kan|eka|nng|e k| ma|aka|atl|mol|sen|o g|aba|ela|its|los|tho|ano|gat|oth|yo |agi|tsw|e n|e y|len| yo|hab|o k|to | th|o s| nt|lhe|ho |agw|gag|g y|kga|mel|rel|ire|tlo|o a|ana|lek|iwa|aga|bon|g m|tir|edi|šha|tšh|lao|g k|i k|tle|ntl| te|dir|ao |e s|lwa|hir|shi|a e|pe |o d|any|a a|i l|a s|ale|alo|a y|g t|jwa| jw|hol|mot|gi |kwa|dik|lon|etl|tet| wa|mai|swe|set|thu|ko |non|ats| me|han|ume|ala| mm|nya|iti|he |bat|hut|nna|ira|itl|no | ne|ro |iro|nan|elw|she|ona|i b|hot|oag|log|a p|wen|i t|ikg|adi| ti|o i|lat|g g|ame|mog|bo |okg|hel|tha| sa|nag|bod|emo|nyo|isi|ile|hok|ogo|uto|si |pa | it| ko|the|diw|ope| op|tek|itš|odi|rwa|sep| ph| kw|pol|gis|bok|me |o j|aag|baa|hop|yal|opa|are|kar|ing|oke|ato|lam|bak|leb|ke | ke|amo|eny|gwa|mok|g n|nye|swa|boa|tum| ja|gan|g a|hag|gon|lan|net|mme| la|ban| fe|ika|rag|ne |g e|nen',
    vec: ' de|de | ła|ła |el | el|ion|ar | e |sio|on |to |e ł|o d|rit| in|par| pa| co|a ł|eri|łe |ga |der|tà |a d| ga|un | a |a s|asi|n e| i |ito|e i|a e| on|te |onj|e d|ti |’l |ent|con|int|l d| re|nte|só | só|l g|o a|he | da|a p|e a| łe| pr|jun|nju|da |che| o |e c|sar|e e| ch|ałe|n c|na |e o|ità| na|e’l|art|ta |ens|èsa| ès|e p|men| po| se|tar|a c|sa |bar|ałi|o e|ona|e n| so| łi|i d|i e|pro|dar|e s|à d|nas|nał|sta|i i|sia|rà |ars|osi|ze |rso|n d|a n|eze|nji|se |ro |esi|nta|ara|iba|łib|nsa|tut| l’|tri|ame|o o|arà|ist|a g|usi|i s| cu|io |ita|nes| ne|rtà| tu|r ł| un|nto| ma| si|l p|ond|sos|tra|so |nsi|sun|esu|à p|e r|iti|ji |onp|ren|ont|tes|ste|in |ia |de’|l s|rio|isi|ra |dis|ras|ghe|łi |e f|sie|r d|i p|man|r e|nda|res|ca |nca|anc|a a|str|a i|o i|go | st| fa|n o|iał|sen|’st| ’s|i c|ntr|ien| di|o c|ver|est|r a|o p|nti|l m|pie|nde|son|ego|ega|ari|r i|var| an|rim|a’l|i o|e m|pod|imi| al|n p|pre|o s|co |ani|ri |uti|rus|tru|l’i|età|e l| ca|ato| fo|ó d|łit| a’|ant|dez| cr| me|ten|à è|oda|ó p|à o|den|en | vi|a v|o n|ne |rte|ltr|teg|nio|ini|or |sti|una|ełi|i g| ze|à e|npa|ni |ers|a r|a è| su|com| vo|ans|ja |à i| ar|fon|esp|tro|ote|rot|ura|re |o ł|cia|r t|à c|min|ene|alt|opi|eso|oło|n s|ute|e t|rse|anj',
    nso: 'go | le|le | go|a g|lo |ba |o y|ng | ma|ka | di|ya | ya| ka| mo|a m|etš|a l|elo| tš|a k|ang|e m|o l|na |e t|man|wa |o t| bo|tok| a |e g|la |a b| ga|a t|we |oke| se|gwe|kel| ba|ša |o a|o m|tša| na|e l|o k|tše|a s| to| o |ele|a d|o b|ago|ego|dit|tšh|o g|oba|gob|e d|tho| e |šo |ngw| ye|ong|g l|di |o n| tl|ga |swa|let|olo|tla|tšw|mo |ane|ho |še |oko|aba|šha| kg|tšo|wan|ela|hab| sw| th|g o|ola|ye |e b|a n|kgo|šwa|eo |set|ito|e s|ona|log|mol| wa|se |oth|ao |eth|ogo|thu|to |eng|a y|o d|hut|e k|o s|net|kol|lok|a a|gag|rel|ire|e e|nag|agw| wo|ana|o w| yo|hlo|lel| bj|šwe|alo|aga|leg|wag| ph|yo |lwa|mel|pha|wo |get|kge|ano|aka|ato|lat|din|o o|hir|šeg|o e|ala|mok|šom| la|mog|nya|e y|lao| ts|mot|i g|ke | ke|kan|iti| me|kar|g y|gwa|eba|ohl|šhi|hel|phe|oph|bo |bot|ume|pol|a w|sa | sa|gon| lo| am|are|gel|ale|a p|len|e n|atš|itš|rwa|o f|emo|edi|bon|bja|ta |tle|ban|no |ušo|tlh|amo|wel|išo|ing|ge | ge|the|leb|o š|ko |hla|bop|dir|e a|ahl|aem|mae|ntl|šon| mm|mon| fi|lek|oka|uto|omo|i b|ret|ape|oge|lal| nn|ošo|pel|okg|abo|gab|lon|lag|yeo|a f|ile|moš|kga|dik|ši |yal|i l|tlo|a e|tsh|otl|elw|odi|i t| fe|med|dum|mal|ora|oll|hol| nt|jo |boi|lwe|i s|bat|hom|lho|ikg|tha|nel|muš|mmu|ha |apa|ne |adi|eny|iri|šal',
    ban: 'ng |an | sa|ang|ing|san| ma|rin|ane| pa|ne |n s|ak | ka| ke| ha|hak| ri|nga|ma | ng| ja|in |sal|lan| pe|n k|uwe|iri|g s|ara|alu|lui|gan|uir|duw|adu|mad|adi|yan|nma|anm|jan|asa|n p|we |g p|g j|pun|a s|a m|man|e h|nge|tan|n m|awi| la|kan|nin|ra |uta| ne|pan|ur | tu|ih |ala|aya|n n|wan|eng|nte|un |ngg|tur|ah | da|en | ut|ana|bas|beb|nan|lih| wi|apa| ta|are|aha|ent|iad|wia|eba|han|ian|ani|ten|din|wi |taw|aan|a n|gar|asi|n w|pen|ebe|da |ika|ngk|a p|keb|ama|ata|aje|n r|aka|ipu|kal|e s|saj|g n|nen|g k|ado|oni|ron|ero|jer|ela|dan|ate|ka |anu|dos|dad|nya|al |aki|i k|a t| wa|ami|ren|ksa|ega|sak|gka|nay|ewa|mar|nik|ep |e p|aks|ndi|sar|iwa|upa|era|neg|oli|ina|uni| pu| se|h s|pat|ban|lak|h p|rep|os |ran|a k|ali|ngs|aga|sa |ar |e m|ung|atu|arg|n l|usa|sam|ngu|ewe|tat|nip|swa| sw|n t| pi|n d|i n|a u|kat|osa|eda| mu|ena|e k| me|r n|lah|k r|nda|ayo|ida|um |uku|k p|gsa|kew| ba|ras|r p|wen|par|pak|k h|eka| ny|i m|end|ari|yom|gay|kab|uan|pa |gi |kin|kum|huk| hu|n u|h r|war|dik|mal|g t|ta |ti |sti|sap| su|s k|per| in|ntu|pol| po|car|rga|pin|eh |r m|tah|ant|nus|mi |idi|did|rya|ary| pr|ngi|kar|pag|gew|ha |k k|min|uru|ut |tut|ita|eta|dil|oma|ri |ust|mus|ira|g d|sio|gam| ag|as |abi|i p|g h|g r|il |awa|lar',
    bug: 'na |ng | na|eng| ri|ang|nge|nna|ngn|gng|ge |sen| ma|app| si| ta|nap|ase|a r| pa|ddi|a n|ri |tau|a t|ale|edd|au |ega|ria| ha|ai |hak|len|e n|ias|ak |ga |a a|pun|inn|ing|ass|a s|nai|pa |nin|sin|ppu|ini|are|gen| ru|ngi|upa|g r|una|rup|ana|ye | ye|gi |ama|i h|lal|man|asa|enn|ara|le |i r|ila| de| ke|ssa|g n|ae | as|e a|san|a m|din|a p|di |sed|ane| se|e r|u n|ada|ann|ala|ren|e p| la|da |lan| we|nas|aga|ipa|i a|e s|pan| ad|wed|reg| ar|sal|pad|ole|i n|g a|lai|asi|pas|a k|i s|ung|rip|g s|ena|jam|ola| pe|ran|ppa|e m|i l|akk|gan|ngk|ong|map|ril|aji|ttu|kan|gar|neg| ne|gka|att|g m|ain| ja|nar|ett| e |k r|i p|nan|i t|ra |e d|ban|gag|bas|eba|beb|ata|sib|nen|i m|unn|iba| mo| wa|ebe|keb|uwe|de | te| sa|par|kel|g p| ba|kun|ura|a d|uru|mas|aka|bol| al|u r|ko |we |kol|tu |add|o r|e y| hu|pol| po|mak|deg| at|bbi|ian|elo|kko|ell|auw|nga|cen|iga|nat|g t|dan| di| tu|apa|uku|huk|ro |tte|ma |ngs|atu|leb|iko|sik|ssi|rga|arg|ekk|rel|uan|la |an |ece|pat|gau| to|ele|a w|e w|a y|lu |a b|gsa|sil|rus|ie |ire|ebb|oe |wet|rek|llu|ppi|tun|dec|wa |awa|baw|u w|ten|ter|ka |per|mat|g y|pak| an|lua|sse|pig|dde|nre|anr|ton|olo| ia|caj|nca|ona|nro|onr|sa |tur|k n|e h|u p|bir|lin|a e|eri|mae|e k|si |elu|a l|tam|ru |ntu|ade',
    knc: 'nzə|ro | a |be |ye | kə|zə |mbe| ka|a k| ha|akk|abe|kki|hak|ndu| nd|a n|a a| ya| la|adə|ben|aye|en |inz|kin|yay|əbe|ji | mb|lan|ma |də |eji|bej|ə a|o a|aro|əla|du |e m|kəl|əna|kən| ba| ga|ga |lar|e a|u y|an |rdə| ad|anz|shi| sh|ard|əga| ku|au | au|e h|n k|a s|uro|wa | na| ye|so |obe| sa|ara|iya|kal|ama| nə| su|amb|n n|in |ənd|ndo|kur|inb|dəg|u a|kam|na | fa| nz|and|ida|ba |ə k|awa|la |nyi|a b| fu|dəb|a l|nəm|sur|e s|aso|ana|gan| ci| ab|a d|tə |a g|kar|dən|uru|a y|baa|ə n|ru | da|wo |əra|ndi|ya | sə|tən|ade|gad|asa|ta |aar|aa |al | as|aya|i k| du|e n| ta|uwu|din| tə|nam|ata|e k|o k|am |a f|o n|təg|i a|əmk|ə s|nba|awu|iga|nga|wu |ala|utu|o w|da |nza|zəg|əli|gin|ima|zən|u k|adi|owu|cid|əwa| wa|san|əgi|laa|awo|de |bem|fut|n a|wan|rad|do |ali|i n|mka|e l|u s|zəb|o s|ayi|wur|n y|ibe|iwa|əgə|za |mar|a t|wal|mər| mə|tu |ndə|azə|wum|fuw|kun|gən|uma| ng|o g|ema|yir|gay|o h|on |tam|kat|ada|lmu|ilm| il|jam| ja|dob| ny|dəw|yaw| ay|ən |hir|i s|liw|ela|bel|how| ho|atə|nat|iro|aid|zəl|ltə|hi |tin|dum|nbe|o t|ə f|irt|rta|n d|kiw|a h| wo|mu |sad|ə h|ədə|taw|lil|dal|sha|n f|iwo|o f|enz|diy|ədi|səd|yi |əny|ang|nab|nya|wob|unz| aw| ra| ji|lam| al|nad|wow|ram|ə y|dar|a i|utə| yi|u n|di |kas|fan|ənz|təb',
    kng: ' ya|na |ya |a k| na|a y|a m| ku|a n|u y|and|a b| mu|wan| ba| lu|yin|tu |ve |yan| ki|ka | yi|nda| mp|a l|di |ndi|la |ana|ntu|si |so |da |ons|e n|mpe|nso|aka| ke|pe |mun|unt|lu |i y|alu|sal| ma|o m|luv|ta |ina|nza|ke |u m|e y|uve|ndu|ala|u n|i m|za |ban|amb|u k|isa|fwa| ko|to |kon|ayi|ma |du |kim|ulu|o y|kan| me|wa |usa|kus|anz|ama|ang|end| ve|yon|nyo| ny|a v|a d| to|i k|nsi|ins|i n|sa |mos| mo|mbu|e k|und| bi|osi| fw|ika|kuz|len|uti|imp|mab|uka|ata| le|ind|vwa|tin|pwa|mpw|kuk|ba | at|kis|adi|mba|olo|ngu|bu | di|uta|mut|lo |sam| sa|sik|isi|e m|su |ila|ula|e l|mu |usu|abu|nga| nz|lus|yi |yay|ngi|but|o n|ni | nt| ka|dya|kak|dil|esa|amu|ti |imv|o k| bu|bal|e b|wu |awu|kul|ant|gu |ngo|inz|bun|a t|mpa|utu|dis| dy|nka|ank|mvu|kin|u f|iku|ong|uzi|zwa|i l|bim|sad| mb|vuk|dik|uzw|lam|tan|mef|idi|kat|lwa|fun|kuv|ga |ken|bak|ing|luz|baw|bis|yal|uya|luy|bay|nsa|mak|usi|mus|nta|ibu|kub|a a|atu|ufu|uvw|i a|ani|swa|uza| ni|ela|tuk|kol|lak|uso|ola| ns|twa|uko|pam|kut|bam|i s|eng|ku |umb|don|ndo|yak|i t|iti|mbi|eta| nk|iki|gi |uku|a s|luk|sol|nzo|te |nak|oko|mam|tal|efw|pes|dib|u b|ati|gid|uke|nu | nd|umu| vw|ilw|dus|luf|zo |u t|mvw|met|bum| ng|sul|ima|wel|kwe|ukw|zol|yam|ota|kot|lan|zit|i b|i v|kun',
    ibb: ' nd|ke |e u| mm|ndi| ke|me |de |e n| em|o e|en |nye|mme|owo| en| ow|wo |yen|ene|mi |emi|ye |i e|e e|eny| un|nen|eke|une|edi| ek|e o| uk|et |n n|ne |e i|n e|e m| ed|e k| ye| es|ana|em | id|ede|esi| mb|un |di | nk|iet|kpo|na |ukp|sie|kem|kpu| in|kie|eme|did|ie |idu| nt|nam|am |ndo|o u|o o|mo |o n|mmo|yun|t e|din|dib|kpe| uf|o m|ked|nyu|no |ded|o k|an |on |nkp|e a|du |m e|iny|kpa|po |ho | kp|ade|om |ina|dut|ono| ub|m u|uke|bo |ikp|i o| ki|ini|bet|mbe|ida|t m|ode|in |oho|wem|uwe| uw|bio|ut | ot|ru |uru|pur|uto|ni |i m|do |fen|omo|dom|u u|ok | us|to |dik|iso| ut|mde|tom|ibo| is|n i|ri |o i|oki|mok|edu|ide| et|a n| on| ak|diy|ak |nek|a e|n o|i u|man|u o|puk|akp|pan|idi|m n| ob|ara| or|a m|op |a k|t k| ny|ema| as|io |kar|pon|nwa| ik|oto|boh|ubo|n k|ufo| an|i k|m k|k n|pem|uka|o a|i n|uk |ed |wed|nwe| nw|usu|uan|te |mad|ti |e y|a u|asa| mi|obi| ef|n m|m m|dud|sun|n y|ka |o y| ey|t i|ro |oro|ond| of|ra |aba|tod|fin|re |nte|nde|ko |efe| ab|k u|dis|n u| eb|ony|pa |nti|pe |med|da |ndu|mbo|eye|dem|aha|ban|ena|nka|san|i a|sop|ibi|sin|ion|eko|se |he |ruk|oru|eto|sua|d e|odu| od|a o|mba|ama|fok|iok|a a|anw|mek|so |ufe|m o|kon|k m|ha | se|si |asi|bas|ufi|ito|dit|ere|ike|son|ori|pep|fon|u n|a y|bon',
    lug: 'a o| ok| mu|wa |oku|nga|mu |ga | ob|a e|tu |ntu|bwa|na |a a|ba |ang|ra |a m| ng|wan|aba| n |a n|li |oba|a k|unt|la | ab|era|a b|ibw|mun|u n|ka |ali|tee|ate|i m|uli|bul|obu|eek|u a| bu|dde|za | ku|ana|ban|sa |edd|ala| eb|mbe|iri|ye |gwa|emb|omu| om| ek|u b|ant|ira|e o|n o|be |amu| en|eki|kwa| er|dem| ed| ki|nna|okw|ama|kuk|eer| ye|eri|kus| ba|ggw|kol| wa| em|usa|ula| am|inz| ly|eka|any|ola|i e|ina|kwe|o e| eg| ky|ekw|u m|mus| bw|kir|ere|ebi|u e|ri |n e|uyi|a y|y o|a l|onn|uso|u k|ger|e e|bal|egg|o o|mat|zib|izi|aan| at|awa|no |ko |yo |bwe|yin|kul|bir|zes|wal|aga|nge|ako|gan|ebw|nza|lin|esa|e m|oze| ma|riz| te|nyi|kut|ya |ufu|kub|sin|we |ngi|obo|kan|nka|yen|eby|y e|gir|eta|una|aka|lye|tuu|wo |bee|u o|ku |i y|ino|kin|e b|a w|isa|o b|sob|zi |e n|wam|imu|e l|uku|bon|de |san| by|ata|wat|iko|kuy| ag|boz| al|ngo|lwa|umu|ulu|utu|uki|ewa|taa|o n|ong|si |nsi|by |e k|muk|usi|rwa|ne |i o|i n|enk|bye|rir|ma |kug|mbi|iza|lal|uko|kis|enn| og|ole|kye|a g|asa|add|ani|nya|sib|ens|ni |ini|uka|i k| aw|uga|gi |yam|n a|tab|uma|umb|kyo|wen|uwa|bib|wee|ing|a z| ey|ze |emu|ete| et|tew|a t|yiz|mul|awo|u g|nzi| kw|tal|o a|o k|fun|afu|and|i b|ibi|ung|ro |amb|igi|aku|saa|baa|nyu|yig|ayi|gya|wet|kik|go |a s|ti ',
    ace: 'an |ng |eun| ha|ang|oe |peu|ak |on |ngo|gon|ah |nya| ta|na | ny|ung| ng|reu|yan| na| pe|ure|meu|roe| ke|eut|hak|keu| me| ba| ur|at |teu|ee |han|a h|dro|ban| di|ara| be|ata|g n|iep|tie|am |eur| sa|nan|jeu|ut |n n|ep |eug|tap|seu| la| te| ti|uga|e n|euk| da|ala| at|a n|eba|beb|awa|ong|ra |tan|n t|eum|eh |n b|p u|ih | se|nda|h n|a t|a b|h t|ape|eu | pi|oh |eub|e p|lam|e t|ai | ma|um | si|dan|eul|asa|t n|und|neu|ana|n p| wa|n a|bah|lah|and|lan|wa |euh|n k|nyo|n h|eus|ula| bu|k t| je| dr|anj| pa|ma |g s|n m|h p|eng|nga|ran|n d|om |hai|a s|yoe|e b|mas|san|ngg| ra|ta |beu|g d|nje|taw|uka|ek |a k|una|a m|ura|yar|sya|gan|soe|n s| li|sid|ya |sab|aka|k n|ka |dum|ndu|har|ot |di |idr|aya| ka|kat|e u|e d|ok |a p|bat|aba|euj|gah|adi|lak|pat|et |n j| ja|kom|uko|kan|en |asi|ari|t t|aan|un |h d|sa |ame|ate|ama|sia|oih|usa|h h|g k|i n|sal|ila|bue|dee|lin|h b|ieh|g p|bak|aja|huk|ade|k m|dip| in|lee|uny|uh |rak|dar|uta| so|gar| ne|nto|ant|rat|uja|h s|aro| le|g h|nta|ep‐|ina|k a|uma|t b| ji|don|gro| hu|k h|ile|t h|t s|ngs|gam|aga| ag|m p|n l|heu|e s|ahe|a l|ane|e a|ggr|‐ti|p‐t|g b|ue |toe|jam|oe‐|eud|k k|ngk|ika|ino|ute|ie |wah|ham|n u|taa|yat|k b|tam|sam|a d|ia |man|use|t l|uk | an|aso|ga |g m| ya|ri ',
    bam: ' ka|ka |ni |a k|an | ni|kan| bɛ| la|i k|la |ya |n k|ye | ye|ɔgɔ|na |li |ɛɛ |bɛɛ|ɛ k|ali| ma| i |man|sir|ra | da|en |ama|gɔ |wal| wa|ira|n n| kɛ|mɔg| ja|a n|a b| mi|ma |a d|ana| mɔ| ba|’i |ɔrɔ|min| o |iya| si| sa|in |ara| na| kɔ|i m|i j|dan| k’|i d|a s|len| jo|bɛ |jam|a m|ɛrɛ|i n| n’|a l|a y|kɔn| fɛ|kɛ | tɛ|iri|ari|’a |aw |ɛ s|a i|ɔnɔ|i t|ɛ b|n b|ani| an|riy|sar|ɛ m|tɛ |rɔ |ko |a w|i b|si |asi|a t|k’i|ɛn |o j|a f|a j| fa|den|aya|nɔ |n y|i s|ale| de|ang|aar|baa|ila|ala|kal| di|inn|tig|o b|ɛ j|ɲa |i f|olo|nu |nnu|osi|jos|raw|kun|ati|e k|w n|ɛ n|aga| se|ɔ m|nɛ |inɛ|nti| ta|lan|bɔ |i y|ɔ b|don|ga |ugu|a a|fɛn|da | jɛ|igɛ|ɔn |ɲɔg| ɲɔ|nɲa|u k|ada|bil|abi|rɛ |n’i|o l|ɔ k| fo| a | ti|aba|nw |jo |n i|a ɲ|go |ɔ s|iɲɛ|o m|yɔr|n o|n’a|ri |hɔr|i h|gɔn|afa|kab|un | ko|i l|aka|lak|on |e m|igi|a o| bɔ|o f| sɔ|n f| fi|ant| hɔ| cɛ|ɛ l|dam| ha|aay|maa|fur| fu| ku| tɔ|ti |ile|gu |mɛn|riw|e b|’o |e f|iwa|ɛ y|uya|nna|n m| do|ago|nga|kar|nka| du|o k|ɲɛ |n w| jɔ|iir|n d|fan|oma|lom|wol|nin|n j|cɛ |u b|ili|a h|nen|ɲɛn|ade|ɛɛr|u d|nba|ru |uru|tɔn|ɛku|jɛ |dil|gan|i i|sug| su|w l|ɛmɛ|w k|uma|ew |fɛ |aju|ɔ o|diɲ|ɛ i|ɔ n|sɔr|isi|ɛya|ank| t’|ɔnɲ|rɔn|i ɲ|wa | b’|taa|anb|mad|had|lu |yir| yi|amu|aam|lad|ɛna| ɲɛ|sag',
    tzm: 'en | ye| d |an | n |ur | s |ad | ad|ḥe|lḥ| lh| gh|agh|n i| i |̣eq|d y|n t|eqq| ta|ett|qq |s l|dan| is|gh |la |hur|ell|ra |d t|r s|ghu|is | na| am|nag|i t|mda|ll |n g|a y|yet|t i| te| ti|di |n a|l a| di|akk|in |ara|a d|n d| ar|ma |ghe|n l|ull|it |edd|dd |kul| ku|amd| ur| id| wa| we| ma|a n|q a|li |rt | yi| ak|d a|as |a t|lla|men|es |d i|a i| le|sen|lli|lel|a a|n s|t t|ar |na |n n|eg | tm|n y| dd|tta|t a| as|r a|ken|kw |kkw|twa|i w|n u|d u|deg|mur|t n| tu|s d| ag|at |wen|gar|i l|win|ttu|wak|n w| tl| de|s t|ḍe|i n|hel|d l|tam| se|rfa|wan|w d|urt|er |h d|iya|gi |sse|yes|erf|zer| tt| ik|ddu|q i|ḥu| in|tle|nt |hed|r i|wa |arw|mga|idd|sef|fan|ize|n m| im|ya |udd|ttw|i u|uḥ|mad|tim|s n|i d|emd|wem|tmu|ef |ame|rwa|i g|̣en|iḍ|ddi|iḥ|ili|ess| u |el |t d|awa|msa|lan|a l|kke|tte|ikh|em |wad|way|̣ud|s y|mma|s k|i i|ant| ya|siy|̣ṛ|un |agi|dda|til|khe|med|tes|ana|taw|l n|d n|chu|all|yek|am |g w|aḥ|r d| iz| ne|nun|anu|qan|lqa| lq|t l|iwi| ss|den|gha|ert|der|nes|man|tag|s u|hwa|ehw|yeh|ala|ila|lna|eln| la|ṛr|ray|ṣe|yed|iwe|n k| lâ|yen|ile| il|ha |ski|esk|lt |hul|ekh|del|i a|kra| kr|yn |ayn|a s|h a|ir |ezm|net|eḥ|awi|ki |u a|leq|fel| fe|ssi|use|ine|il |r t|tem|edm|hef|ail|aw |naw|yas|asi',
    kmb: 'a k|la | ku|ya |ala| mu| ki|a m|kal| o |u k|o k|ni | ni| ky|mu | dy|dya|a o|lu |ang| ya|tok|kya|nga|na |so |oso|a n|oka|nge|mba|i k|a d|kut|xi | wa|kwa| ka|mut|hu |elu|thu|ba |uth| kw|uka|gel|ka |a i|wal|wa |uto|ene|ban|ga |i m|kuk|ku | mb|e k|u m|ne |ana|kik|u n|a y|ngu|iji| ng|u y|ela|u w|i y|ixi| mw|kit|kel|ye |ika|wen|isa|nda|ji |oke|u i| ji|ena|and|und|kil|ilu|ung|ke |iba|ila|aka|a w|o w|yos|ten|kus|ulu|kub|e m|ta |alu|sa |oxi|mox|amb|olo|kum|gu |wos| wo|wat|ate|muk|gan|lo |tun|du |ndu| it|mwe|kan|san|kis|ita|o m|luk|imo|ong| ph|kye|a t|i d| ye|di |ato|nji|kij|sok|idi| ix|u d|kud|u u|ula|tes|we |e o| ke|a s|o i| di|uku|da |udi|ma |lun|lak|eng|ele|wij|yat| we|nu |wan|uba|e n|hal|pha| se|e y|yen|kib|a j|uke|ki |o n| yo|ito|itu|a u|i n|jin|kwe| im|lon|u o|uta|su |i w|ja | ja|utu|kat|iki|fol|ute| ut|kul|i u| en|kim|adi|ikw|tal|esa|nde|dal|yan|ngo|fun| ko|jil|eny|i o|uki|nen| ik|umu|lel|atu| uf|ing|uso|vwa|o y|esu|u j|ge |ufu|lan|o d|nyo|jya|uma|i j|jix|ukw|usa|unj|ite|o a|kuz|sak|dib|kyo|mun| os|mbo|imb|go |kos|u p|ijy| ib| tu|te |i i| a |han|xil|exi| il|kam|dit| un|a a|ilo|gam|kwi|tul|ivw|ubu|lul|a p| so|iku|uni|se |oko|o o|mwi|ote| to|kex| uk| bh|ufo|e a|ind|bul|sen|inu|ngh|kiv',
    lun: 'ng | mu|la | ku|a k|di |aku|tu |chi|g a| a |ntu|mun|ma | ch|a n|unt|a m|ndi|ela| we| na|aka|ima|ind|jim|eji| ni|i m| in|u w|a i|wu |i k|a w|shi|awu|hi |lon|u m|wej|sha|ing|kul|wa |nak|i n|ala| ja|na |ung| kw|muk|ulo|kum|ka |a c|hak|cha|iku|ewa|wen|a h| wa|g o|u j|kut| ha|ana|vu |ovu| ov|yi |idi|u c|him|nik|ong|adi|mbi|kwa|jak|kuk| an|ang|tun|bi |nsh|tel|ha |esh|amu|han|kus|kwi|ate|ila| he|uch|ula|imb|ilu|a a|kew|enk|uku|mu |u a|hin|a y|zat|nke|u n|kal|hel|ond|i a|ham|eka|eng|mwi|a d|itu|and|del|nde|wak|ins|nin|i c| ya|ona|mon|ina|nji|i h|ach| yi|ama| ak|nat| mw|nyi|kin|umo|lu |ata|uma|sak|ku |udi|ta |ati|uza|kuz|mul|wes|ich|i y|awa|u k|uta|muc|i j|wal|uka|kuy|uke|wit| di|yid|naw|kam|bul|ayi|wan| ko|i i|kad|waw|akw|ni |ken|ji |uki|iha|dik|u y|g e|ush|mbu|si |osi|kos|ahi|ika|ish|kud|ash|twe|atw|any|dil|hih| ye|da |eni|kwe|wil|imu|dim|li |ya |kun|yin|g i|nan|yan|win|iwa|din|tam|etu|ant|amb|mwe|his|nda|hik|til|ule|umu|was|inj|jin|hu |nam|mpi|iki|wah|hiw|kuh|jil| da|eyi|ney| ne|isa|hid|usa|jaw|wat|wun|tan|umb| ma|uya|una|end|lun|pin| ji|ahu|nka|omw| om| ny| i |hen|che|yej|wik|u h|eta|tal|kuc|ulu|sem|wet|fwe|twa|utw|uyi| hi|iji|iwu|mpe|omp|ilo|yil|nic| en|a e|iyi| at|haw|lek|mba|emb| ew',
    war: 'an |nga|ga | ng| pa| ha| ka|han|pag| hi|in | ma| an|ata|mga|hin| mg|kat|ay |ya |a m|a p|gan|on |da |n n|n h|ug |n p|n k|ung| ug|iya|a h|a k|ha |n i|adu|n m|dun|tad|ada| iy|sa | o |ara|may|a n| ta| di|a t|n a| na|y k|o h|pan|kad|tag|n u|yon|ags|ud |o n|ang|al |a s|ana|gsa|gad|a u|o p|man|syo|asa|ala| ba|ag | in|a i|g h|n b|agp|asy|awo|ray|war| wa|to |a d|wo |a a|usa| us|g a|nas|ina|was|taw|nal|ing|gpa|ali|iri|dir|agt|i h|ra |ng |aha|ri |bal|san|ad |kas|aka|g p|o a|a b|ida|awa|hat|no |g m|ini|uga|ahi|y h|o m|tan|ili| bu|uha|buh|gka|agi|bah|aba|i n| su|tal|him|at |pin| pi|hiy|kan|int|mo |n t|did|a o|aya|sya| ko| tu|nah|nan|iba| bi|n o|od |agb|la |kon|lwa|alw|gba|aho|tra|uro|o u|l n|ona|yo |ho |pam|o k|agk|ano|d a|sud|asu|gin|ngo|ni | la|hi |as |rab|uma|ton|os |par| sa|sal|ati|ko |iko|upa|lin|ami|gar|ban|n d|ern|gi |aag|abu|a g|kal|d h|aga|yan|n e|yal|d m|gtu|ak |mil|rin|ba |lip|mah|aud|lau|ka | so| ig|lig|ama| ki|ihi|tik|ras|aso|mag|gud|g i|tun|g k|duk|osy|sos|kau|uka| un|hon|n s| pu| ib|ro |imo|tub|mak|pak|ila|n w|yer|bye|ent|ito|ika|amo|it |sug|n g|dad|ira|edu| ed|tum|aup|ngb|til|non|anu|pod|upo|sak|sam|ari| pr|agh|alu|ato|ta |nta|gon|lik|bli|s h|d i|k h|uyo|ig |uli|bul|dto|adt|isa',
    dyu: 'a’ | ká| kà|ye | ye|kà | à |ni |la | bɛ|án |kán| la| ni|ya’| i |ɔgɔ|ya |ká |mɔg|a k| mɔ|bɛɛ|á k|ɛɛ |na |ɔrɔ|n k| mí|’ y|mín|ín |i y|’ k| be|’ l|be | ya| kɛ|te |ma |à k|’ m| te| jà| wá|n n|nya|ɛ k|ɛrɛ|i’ |a b|wál|ra |àma|áli| ò |ima| ní|jàm|ɛn |gɔ | mà|e k|à l|ɔ’ |lim|ní |n’ | lá|iya| kɔ|à à|o’ |e à|e b| há|rɛ |ana|man|rɔ |n b|i k| sà|ɛ y|à m|e s|à b|li’|ɔnɔ|kɔn|hák| dí|gbɛ| bá|n y|ara|bɛn|’ s|kɛ |mà | bɔ|’ n| kó|aw |’ b| sɔ|riy|à y|a m|nɔ |e m|sàr|a j| sí| fà|ɔ k|àni|à s| gb|kɛr|sɔr|yɛr| yɛ| fɛ|gɔ’|n m|báa| sì| tá|àri|na’|e w|yɔr|a d|i m|a s|a n|ákɛ| là|lá |áar|dí |à i|ali|a f|en | cɛ|bɔ |an’| dà|yaw|ólo|’ t|dén|ìgi|sìg| àn|’ f| sé|ɔ s|ána|ɛra|ógo|bɛr| ó |a t|w n|ɔn |ra’|e i|à t|i à|à d|si |se | se|’ d| a |aya| ɲá| tɔ|cóg| có|sí |fɛn|i b|àra| má|ɛya|lan|kàl|á d|ɛ l|ɔ à|nga|n s|a w|àng|li |a à|ɛ’ |à n|ko | í | dɔ|gɔn|e ò|a y|tá |í i|i t|àla| na| dò|so’|u’ |e’ |rɔ’|a i|a g|ina|kan|nin|ɔny|a h|kó | ù |ili|ɔ b|w l|kɛy|e n|den|ama| dé|fúr| fú|i n|i ɲ|úny|dún| dú|ma’|kùn| kù|òn |dòn|i l|e d|ga |nna|go |ò k|i s|len|kél| ké|í t| nà|ɛ n|a c|i f|ɛnn|dàn|í à| lɔ|dɔ |tig|áki|rɔn|hɔr| wó|da’|gid|ɲɔg| ɲɔ|la’|úru|ò b|ow | bè| fá|ɛ t| yɔ|ɔ y|jɔn|ìna|mìn| mì|ɲán|ɛ b|e j|in |í y|éle|ból|àga|íin|díi',
    wol: 'am | ci|ci | sa|sañ|añ | na|it | ak| am| mb|lu |ak |aa |ñ s|mu |na |m n|ne | ko|al | ku|baa|mba|te | mu|ko | wa|a s|ñu | ni|u n| te| ne|nit|u a|e a| lu|t k|i a|oo |u m|ar |ku |ay | it|pp | do|u k|gu |u y|éew|rée| ré|war| ta| ñu|i w| bu|xal|llu|épp|oom| li|u c|on | xa|ul |àll|wàl| wà|loo| yo| di|kk | ya| aa|u d| gu|yoo|oon|i d|i b|mën| më|fee|doo|bu |nn | bo|ew |e m|o c|r n| xe|eex|i m|boo| yi|nam|aay|m a| nj|ara| du|ju |xee|yu |en |een|naa|uy |ana|enn|aar|aju| bi|taa|ama|igg|oot| lé|yi | pa|di | aj|ti |ën |okk|k s|taw|lig|gée|ral|ee |u l|i l|m m|und|dun| de|li |u j|n w|an |w m|ala| me|eet| se|axa|ata| ba| so|n t|a a| dë|m c|yam|mi |éey|ggé|ota| gi|ir |ewa| an|a m|aam| ja| ke|ngu|om | su|a d|see|amu| ay|ax |ex |wfe|awf|dam| mi| ng|ey |p l|i n|o n|u t|a n|ool|jaa|ken|une| ye|la |n m|k l|kan|a l|et | yu|bok|mbo|u x|i t|àng|jàn| së|k i|nee|i j|e b|men|ok |em |ndi|i k|ñ ñ| lo|m g|nda|ñoo|kun|opp|ali| ti|laa|j a|l x|n n|lee|nd | da|ada|aad|are|njà|eem|y d| fe| jo|y a|lép|tee|aw |l c|wam|k c|n a|l l|nja|ëng|le |a b| mo|aan| fa|e n|m r|oxa|dox|n c|l a|ska|ask| as|aat|a c|mul|l b|aax|u s|y t|eg | jë|k n|ng |g m|gi |gir|k t|ëy |sëy|ëra|góo|kku|uñu| bé|tax|ba |e s|m s|i r|i c|k b|añu|t a|u w',
    nds: 'en |at |un | da|n d| de|een|dat| un|de |t d| ee| he|cht|n s|n e|sch|ht |er |ech| wa|rec|tt | si| to|vun| vu|ett|ten| re| ge|n h|ver|nne|k u|elk| el|t w|ien|lk |sie|to |het|gen|n u|t u|n w|orr| an|n v|r d| in| ve|ch |war|ann| or|ör |t r|rn | fö|it |rer|ner|för| st|rre|den|t g|n f|up | up|eit|t a|t e|rie| fr|aar|nd |ich| sc|chu|wat|n g|fri|nn |ege|on |oon|rrn|daa|t h| bi|is | is|rt |ell| se|hte|len|n o|n k| ma|kee|in |ik |lt |e s| mi|n i|aat| we| na|ven|hei|t s|t t|hn |lle|n t|n m| dr|ok | ok|doo|ers| ke|se |lie| sü|nsc|ken|n a|arr|sta|ünn|gel|r s|ren|rd |che|ll |ill|he |e a|nen|ene|men|ie |ins|ahn| gr| wi|ede|kt |öff|röf|drö|raa|sik|llt|n b|an |kan|ard|und|e g|gru|dee|ff |s d|sse|sün|all| ka|run| dö|eke|st | do|ere| ün|ehe|ebb|heb| gl|min|e e|ens|taa|rch|örc|dör|ig |nee|maa| so|al |aal|cho|tsc|e f|ieh|e v|t v|ünd|iet|t m|enn|p s|el |hör| wo|t o|t n| fa|iht|eih|hen| al| ar|bei|rbe|arb|pp |upp|hup|e w|ehr| eh|utt| be| ut|na |inn|nre|lan|nst|ats|huu|as |weg|t f|e r|öve|eel|et | ni|mut| mu|pen|t b|a d|wen|ul |uul|e d| ah|str|eve|lic|ert|aak|hee|t k|ste|erk|üss|düs| dü|t i|der|iek|e m|mit|d d|nic|ent|gt |anr|set| as|aaf|tra|art|oot|r t| eg|ach|t l|l s|ter|akt|and|ame|hon|nat|n ü|r e|ite',
    fuf: ' e | ka| ha|ndi|al |de |di |and| no|han|no | ma|o h|nde|e d|aa |e n|dyi|he |i e|un |a n|ala|dhi|yi |la |gol|re |dho|ka |eed|ho | wo|kal| dy|maa|dhe|o k| bh| ne|ko |ann|ni |hi | dh|bhe| nd|edd|won|ol |e e|ddh| mu|haa|ned|mun|e m| le| sa|i m| go|nnd|taa|aan|e h| fo|ede|eyd|ley|dan|e k|gal|aad|ii |i k|o n|sar|ond| fa|en |dya| ko|e b|tta|a k| he|ow |ana|uud|adh|iya|riy|yaa|bha|aak|ani|ett|het|ngu|aar|ydi|ari|i d|e f|i n|tal|le |ral|ira|ita|oni|ya |oo |na |nga|goo|dir|ndh|nda|ee |ydh| ta|e l|are|e g|ina|n n| wa|faa|fow| hu|i w| fi|akk|naa|ree|e w|udh|yan|ugo|i h|to |oto|nan| ng|oot|dyo|udy|oll|ore|fii|kko|mak|e s| da|a d|l m|on |dhu|dii|iid|ude|aam|i f|a e|o f|ady|den|n m|yee| on|e t|laa| la| na|l d|e a|idy|l n|l e|fot|ke |awt|lle|oor|in |o e| do|ubh|n k|a h|a b|a o|tan| ya|yng|att| ho|an |ake|nya|hen|a l|ewa|hun|i s|i t|mo |amu|te |n e|huu|taw|tor| o | ad|lli|onn|bon| bo|dee|bhu| an|ere|hoo|n h| ny|woo|iin|o w| mo|ku |er |der|ota|n f|dha|ant|l h|wti|tin| ke|tit|l l|yam|o b|aal|l s|a f|guu|ell|edy| se|und|n d| ga|ago|a t|eyn| ku|l g|gur|ama|a w|a m|oon|ndu|rew|waa|u m|nee|mu |tii|ri |nta|hin|wal|kaw|bhi| de|tug|dud|ure|uur|hey| fe|wad|do | si|too|o s|ing| te|tay|eta|o t|adu|ang|rda|urd',
    vmw: 'tth|la |thu|a e|na |a m|ana|we |hu |kha| mu|a o|awe|ela|wa | ed|to |ire|ala|hal|dir|edi|ito|eit|rei|ni |mut|aan| wa|a w|u o|akh| on|a n|haa|ya | ni|o y|a a| yo|wak|utt|nla| ot| oh|iwa|ka |okh|att|oha| n’|the|oth|mwa|mul|ari|ne | si|iya|aku|apo|lap|unl|kun|aka| el| wi|tha|ott| ok|ha |oni|e m|e a| at|ale|le | sa|e n| va|ene|ihi| aw|owa|o o|ett|e s|ele|hen|hav|oot|lel|ta |moo|ula|amu|iha| kh| en|e o|han|o n| ak|o a|ota| mo|i a|e w|po | mw|row|nro|ara|’we|anl|i m|e e|de |ade|aya|a s|waw|ihe|ra |hel|eli|dad|a i|o s|ina|vo |a’w|nak| ah|lan|i e|i o|ika|sin| et|wi |eri|n’a|onr| ya|ri |var|ona|liw|hiy|nna|aa |wal|u a|a v|kan|oli| so|ko |huk|her|hiw|riw|avo|u e|wan|thi|aha|kel| an|eko|tek|hwa|sa |yot|itt|e k|uku|laa|riy|una|hun|ntt|yar|khw|ane|ath|pon|e y|o e|iwe|lei|ali|kho|wih| ep|n’e| es|ida|ani| a |nih|n’h|vih|avi|him|ei |lo | ma|aki|kum|i n|i w|nkh|uth| nn|a y|ahi|ile|rda|erd|ber|ibe|lib|i v|ia |ute|ole| it|som|i s|yok| na|ola|nuw|nnu| eh| yi|va |mih|saa|lih|hop|’at|man|hik|a k|ikh|iri|nin|mu |elo|’el|yaw|tte|mur|ont|ila|lik|hol|u s|uma|ma |uwi|inn|ehi|u y|nal|kin|saw|enk|in’|nan| wo|tti|ena|mak| ek|pel|ope|oma|sik|epo|ulu|ro |ira|wir|nli|pwe|mpw|emp|lem|sil|pot|tel| oo|iko|esi|n’o|era',
    ewe: 'me |le |ame|e a|wo |kpɔ|ƒe | am| si|ɖe | me| wo| le|si |sia|e d|aɖe|esi|be |pɔ |e l|la |e w| ɖe| la| ƒe| kp|na |e e| mɔ| du| be|a a| aɖ|nye| dz|e s| ŋu|ukɔ|duk| na|e n|ome|ye |dzi|e m|kpl|e b|nya|ɔkp|pɔk|ɔ a|ple|ke |ɔ l|ɔnu|woa| o |iwo| nu|ɔ m| al|evi|u a|awo|mes|ɖek|nu |ŋu |o a|ɔwɔ|e ɖ|nɔ |ekp|gbe|mɔn|kɔ |ɔme|eƒe|eke|lo |alo| eƒ|i n| ny|o n|o m|ya |dze| ab|ia |e ŋ|e k|siw|iam|o d|ubu|bub| bu|o k|zi |ukp|li |a m|wɔ |nuk|mek| ha|i s|kpe|e ƒ|eny|any|ɔ s| go|e g| li|mev|ŋut|eme|akp|ã |anɔ|gom| ey|blɔ|dɔw|mɔ | wò|enɔ|tso|iny|ɔɖe|bɔ |oma|ɔna|a k| ta|e t|to |nɔn| gb|iaɖ|ɖes|ɔe |bu |egb|a s|vi | ƒo| dɔ| he| to|a ƒ|o e|ɖo | ɖo|ele|wɔw|awɔ|i l| an|lɔɖ|abl|ƒom|e h|i w|a n|wɔn|i d|ene|oto|yen|ɔ ɖ|meg|i a|ɔ ƒ|xɔ |ti | ts|afi|wom|agb| ag|nan|so |uwo|o g|ɔnɔ| vo|eɖo|tɔ |a l|etɔ| at|o ƒ| ad|ee |se | se|ne | xɔ|gbɔ|uti| ma|ovo|vov|vin|ɔwo|wòa|i b|i t|a ŋ|a d| af|ats|eŋu|e x|ɖok|o l| ne|ado|e v|de |ɔ b|ta |eye| ka|gɔm| gɔ|te |a e|ben| es|ana|a t|i ɖ|rɔ̃|mee|o t| ak|ewo|ɔ k|sɔ |i o|ɔ e|i m|ema|ded|ẽ |man| el|yi |ɖev|ata|odz|eɖe|u s|kɔm|ate|da | xe|axɔ| en| aw|edz|ui |buw|heh|uny|peɖ|o s|ze |i e| sɔ|bet|a g|udɔ|ehe|ada|o ŋ|o h|abe|he |o w|tsɔ|u ɖ|ku |isi|kui|oku|ɔ n| ke|ma |e o| tɔ|men|ade|dzɔ|oɖo',
    slv: ' pr|in |rav| in|do |pra|ti |avi|anj| do|nje|vic|je |o d|no |li |ih |a p|ega| vs|o i|ost| za|ne | po|ga |ja | dr|co |ico|ako|vsa| v |kdo|sak| ka|ali|ima| im|e s|sti| na|van|i s| ne|akd|svo| sv| al|nja|nih|ma |pri|i d|stv|nos|o p|dru|i p|o s|pre|e n|jo | iz|red|iti| de|i i|neg|o v|ki |avn|vo |ni |em |i v|oli|a v|a i| so| nj|jan|obo|vob|ova|na | ki|ati| bi| ob|ko |ego|i z|tva|gov|rža|drž|i n|kol|i k|e v|kak| ra|bod|se |eva|ruž|jeg|e i|vlj| sk|žen| mo|e p|sto|nak|ena| se|del|n p|ter|žav|jem|kon|sme|a d|voj|lja| ni|enj|pol| en|ovo| te| ta|va |imi|zak| st|bit| sm|var|a n|i o| z |mi |ve |kat|di |pos|lov|nsk|me |krš|aro| sp|o k|n s|en | je|tvo|odn|vat|ate|a z|vol|ri |ed |ju |sta|a s| va|ji |sam|a k|o a| s |ene|uži|rug|ora|mor|jen|ans|elo|avl|itv|e m|eja|dej|rst|vne|nan|ove|e b| me|lje|ršn|akr|nar|čin|živ|čen|i m|o z|so |eni|rod|pno|za |oln|dol|h i|olj|tak|ars|nju|ebn|mu |o o|ičn|cij|aci|šči|h p|vič| ve|raz|nst|ajo|ode|kup|sku|e d|v n|u s|otr|nim|jav|šne|vi |vni|rim|kaz|ta |ovi|ski|n n|če |ose|v s|o t|da |ev |nik|rem| ko|ara|n d|bra|e o|ijo|si |i u|ra |žev|raž|vez|dov|ons|zni|obr| ja| sa|ljn|elj|dst|dis|bre|i b|m v|zna|sod|nem|šni|ina|an |seb|pro|ere|oji|mej|amo|skr| bo|edn|med|iko|ust|mož',
    ayr: 'apa|nak| ja|aka|ata| ma|aki|asi|aña|ana|aqe|ñap|cha|aw |mar|ti |jha|iw |paw|pat|spa|ark|tak|ama| ch|ani| ta|una|jh |hat|kap|kan|a j|jaq|rka| uk|a m|aru|ki |kis|jan|taq| ar|pa |qe | wa|na |a a|niw|may|kas|iti|ach|i j| kh|ayn|ina|pan| mu| ya|ati|a u|yni|ha | am|amp|w k|as |uka|iña|sa |mun|at |hit|isp|t a|is |ch |ka |khi|ñan|e m|an |isi|oqa|ru |asp|siñ|ejh|ta |qha|kam|h a|ajh|pjh|atä| uñ|han|mpi|sis|sti| in|ita|qen|ham|ñat|äña|täñ|sin|rus| sa|ma |iri|ara|sit|yas|ñja|ska| ut|yat| ku|arj|qat|tis|tap|kha|pas| ji|ura|uñj|jam|a y|nin|nch|kañ| ju|hañ|ukh|nañ|kat|qas|i t|noq|rjh|lir|ili|ña |kun|tas| ka|ans|tha|kak|utj|w m|aya|pi | as|i u|nka|us |aqa|kiw|a t|has|jil| lu|tat|sna|tan|tay|w u|ino|i m|in |w j|rak|s a|apj|jas|nsa|asn|pis|i a|mas|wak| ay|w t|i c|njh|ipa| a |s j|s m|chi|kaj|sip|rañ|lur|mp |tañ|a k|uki|rin|upa|iru|hac|ena|uya|muy|amu|wa |a i|llu|yll|ayl|api|hap|nip|ak |aqh|yaq|n m|a c|tja|eqa|uch|ayk|isa|ank|asa|sap|k a|anq|awa|s u|lan|h j|pam|i y| pa|ask|h u|a w|ap |juc|anc|run|nap|ri |ali|auk|inc|nir| aj|tir|ast|ink|anj|isk|kar|jac|ist|ni |usk|khu|yan|mat|a s| ap|pka|en |ñas|sir|qer|i k|kit|heq|che|mä | mä|s k|e j|yt |ayt|way|qañ|naq|nas|n j|sar|war|s w|s c|ika|hik|a l|t u|hus|h k',
    bem: ' uk|uku|la |wa |a i|kwa|a u|ali|ta | mu|a n| na|ya |amb| ya| in|ata|sam|shi|ula|nsa|nga|ang| ku|bu |mbu|wat|se |nse| pa|ins|ons|kul| ba|li | no|aku|lo |ngu|nan|a m|gu | al|ala|mo |a a|fya|a k|ntu|yak| ca|ikw|ing|u u|lik|na |e a|ili|alo|nok| on|u y| um|tu |a p|ga |o n|mu |lwa|lin|sha|i n|ka |ila| ci|ku |uli|oku|ika|and|ulu|ukw|ana|kup|akw|ko |ama|we |cal|a c|amo|umu|aka|a b|aba|kus|lil|o u|cit|kan|yal|mbi|ndu|mul|pa |o a|ish|le |ile|o b|hi |u m|bal|kub|u c|kal|u a|uci|ba |ne |unt|e u|any|ton|kwe| sh|po |ha |yo |bul| fi| if|nsh| ab|du |kuc| fy|e n|abu|ung|u n|cil|nka| ne|kum|a l|fwa|o c|lan|o i|i u|a f|kut| am|und|ush|nda|kuk|afw|no |gan|pan|upo|a o|win|aya|ale|bi | ta|ify|utu| ng| ka|tun| bu|int|wil|fwi|u b|pam|lam|apo|way|ako| ic|bil|ans|uko|apa|wab|mun|ma |nya|cin|ban|tan|wal|ela|o y|ine| af|imi|lul|kap|ngw| li|ubu|e b|mas|nta| ma|ilw|ti |iti|gil|ngi|eka|imb| im|twa|e k|uma|umw|i k|tul|pat| ak|gwa|u k|ita|onk|ant|bom|usa|a s|but|eng|e p|iwa|umo|ici|o f|afu|sa |da |atu| ns| is| wa|mut|o m|nto|ont|uka|baf|ilo|min|mba|kuf|ini|u s|pok|ye |ily|men|kwi|hiw|pal|ind|ute|cak|mak|tak| at|ash|u i|lel|ina|alw|lu |asa|asu|kat|o o|aik|ubo|suk|ule|ufy|upe|e i|til|lya|pak|nam|mwi|efw|lef|ate|tek',
    emk: ' ka|a k|ka | a |an |la | la| ma|kan|na |a l|a a|n k|ya |ni |ama|a m|ma |ɛɛ | di|lu | ja| bɛ|ana|aka|man|di |a b|bɛɛ|iya|dɔ |a d|ara|jam| si|a s|mɔɔ| mɔ| sa| dɔ|en |ɔɔ | tɛ|alu|i s|da |tɛ |sar|den|a j|riy|ila| ye|ani| kɛ| i |i a|ye |ari| ni|n d|kak|ɛ k|ɛn |a t| ba| al|i d|ra |nna|len|ɲa |aar|n m| se| bo|olo|ɔn |sil|ele|ɔdɔ|n n| kɔ|i k|ank|ɔ a|baa|e k|a ɲ|se |bol|ɛ d|lo |u d|kel| sɔ| na| da|n s| ke|ɔnɔ|fan|a f| fa| de|nda|a i|ɛ s|ade|ada|mɛn|ala|i b| mi|and|ɔ s|lak|ɛ m|ɛ y|li | ha|dɔn|sɔd|nu | ko|ɔ b|kɔn|ina| su|ɛda|kɛd| wo|han| mɛ|kar|ko |aya|a n|ɔ m|i m|nɔ |ɔ k|ɲɔɔ|n a|ata|ɔya|nɲa|nnu| wa|n b|in |nka|kɛ |olu|a h|i l|dan| an|mad|le | le|ran| gb|a g|u l|e m|i j|si |kun| ku|u m|ɛnɛ|ii |suu|lat|enn|nad|nin|on |don| ɲa|ɛ l|aji|ɛ b|mak|u k|yan|a w|u s|ɛnn|i t|sii|n t| ɲɔ|wo |dam| ad|awa|law|u t|ɔnn|ɛdɛ|nba|enb|bɔ |ibi|jib|waj|gbɛ|ɲin| ɲi|o m|nan| lɔ|fɛ | fɛ|bɛn|din|kol|fɛn|afɛ|maf|su |usu|uus|taa|u y|e a|ta | ta|aba|ɔrɔ| dɛ|dɛɛ|asa|iri|mir|ba |udu|fud| fu|ini|bɛd|aha|dah|du | bɔ|ɔ j|tan|dal|te |ida|lan|biy|ant| do| te|i w|kɔd|ɲɛ |lɔn|ɔɔy|min|ɛ j|nal|nɛn|ɔɔn|aam|e b|ili|kil|nki|enɲ| du|nni|wan|tii|was|dɛ |a y|o s|ɛbɛ|bay|ali|lɔ |fɔl| fɔ|ɛ a|ɔ n| tɔ|bil| bi|e i|nfa|anf|iil|e f|ɔ l|san|ɔ d',
    bci: 'an | ɔ |be | be|un | i |wla|ran|kwl|la |sra| sr|in |n b| kw|n s|kɛ | kɛ|n k|le |a k|n n| nu| ng|lɛ |nun| a |n i|man|n ɔ|ɛ n|n m|kun|a b|e k|i s| ku|ɛn |nga| su|mun| n | ti| fa| mu|su |ga |ti | ni|e n|e a|ɔ f| li|ɛ ɔ|nin|a n|e s|a s|i n|ɔ n|a ɔ| le|tin| at|ɔ k|wa |ati|ɔ l|ɛ i| sɔ|ta |ata|fat|ɛ b| ma| mɔ| sa|mɔ |sɔ |a a|iɛ |akw|di | sɛ|vle|nvl| nv|lak| kl|ɛ m|i b|i k|liɛ|dɛ |ndɛ| nd|sɛ | wu| yo|lik|ɔ ɔ|n a| ka|ɔ t|ɛ s| mm|e w|yo | di|i a|ba |ngb|ke | an|und|sa |a m|mɛn|e t|uma| fi|ike| ju|e y| mɛ|mla|mml|ɔ b| ny|i i| bo| ye| si| aw| yɛ|e m|bo |e b|fa |n f|ndi|ɔ i|i f|e i|o n| tr|jum|ɛ a|a w|kan|i w|wie|wun|a y|n l|yɛ |awa|ɔ y|ge |nge|ing|uɛ |ie |ka | fɔ|b a| b | fl| o | wl| wi|fin|tra|klu|i m|lo | uf|a i|ang|ɔun|fɔu|n t|gba| wa|ua |uwa|luw|flu|o i|bɔ |wuk|uan|flɛ|e l|ye |n y|nan|n w| ba|ɔbɔ|bɔb|ɔ d|o ɔ|ufl|nzɛ|anz|kpa| kp|ɛ k|alɛ|dan| ak|e ɔ|sie|te | af| bɔ|lun|nyi|kle|nua|u m|lu | na|u i|ilɛ|i t|zɛ |fuɛ|ɛ w|a t|ika|u b|ɔ s|anm|bɛn|gbɛ| bl|ci |aci|i ɔ|n u|o m|wlɛ|i l| bu|se | se|e f|iɛn|wo | wo|bu |elɛ| yi|afi|uka|a j|i j|ian|nma|san|u n|aka|anu|u s|a l|unm|ɔ w|nda|ote|vot| vo|fiɛ|e j|wan| kɔ| ja|o b|usu|ɔn |n j|anw|ɔlɛ| jɔ|w a| w |kac|o s| ya|i y|ngu| e |u ɔ|dil|tua|yi |yan|nya|ja ',
    bum: 'e a|od |an | mo|e n|mod|ne |am |se | ab|e m| me| os|ai | ai| ng| ak|ose| y | an|e e|y a| nn|le |d o|nna|a a| be| en| dz|nam|ele|ane|i n|nde|i a|n a|de |a m|iñ |end| a |ie |na | na|a n|bel|abe|e d| as|nyi|ki |a b|ngu| ya| ay|ven|mve|ge |m a|ul |gul|da |li |ya | ki|asu|be | bo| e |su | et|oe |l y|i m|yiñ|dzi|ebe|yia|eny|ene| mv|i e|ian|ala|e b|nge|en |og | mb|ili|e y| mi|ege|bod|tob| ma|nda|ayi| at|e k|la |abo|ñ m|ban|bog|ñ a|ve |om |eti| to|bo | ny|fe | bi|e v|o a|g a|d m|fil| fi|dzo|mem|ben| se|abi| si|beb| nd|n e|woe| wo| fe| ek|zie|aye|oan| nt|emv|ia |bia|ato|e f| ad| da|ga |nga|n m|u m| ve|mbo|a e| te|ial|sie|me |ond|ug |lug|m e|obo| al|do |n b|uan|ae |n k|di |k m|e s|eñ |zia|e t|d b|to | ba|alu|ako|o m|si |a s| di|oba|ma |edz|man|ama|n y|m w| vo|n n|d a|bi |aka|m y|min|ōk |kōk|akō|zen|em | nk|ñ d|mis|tie|i b|ali|kom| es|eku| ze|ii |mam|ziñ| zi|ndo|o e|s a|i d|ye |añ |ake|vom|a f| ev| eb|m m|fam| fa|men|lu |ulu|ñ e| mf|dze|boa|gan|sog|tso|s m|is |sal|esa|ses|teg|ese|yeg|mon|u a|kua|any|ela|ad |lad|ete|und|kun|nku|uma|aku|o n|e o|bon|ui |dza|ó m|ñ n|adi|e z|die|tii|us |ebo|meb|a d|zo |u n|med|nye|kam|l a|voe|deg|dañ|ol |ke |l n|yae|kya|aky|m s|eki|d e|kal|m o|te |oga|nts|i s|omo',
    epo: 'aj | la|la |kaj| ka|oj |on | de|iu |raj| ra|as |ajt|de | ĉi|aŭ | li|j k|eco|ĉiu|ia |jn | pr|o k|e l| al|est| aŭ| ki| es|jto|co |kon| ko|en |tas|n k|an | en|pro| po|a p|ta |io |ere|ber|ibe|lib|j p|n a| ne| se|o d|to |aci|kiu| in|o e|a k|ajn|j l|ton| pe|do |o a|cio|j e|jta|iaj|eni|ro | ha|taj|ita|rec|lia|toj|ado|vas|hav|per| re|a a|o ĉ|sta|iuj| si|a l|stu|cia|j r|ala|n p| ri|ekt|je | je|ter|tu |nac|al |j d| di|tra|sia|ava|nta|a s| so| aj|sen| ti|ali|uj |a r|nec|int|n d|s r|ent|kto|oci|soc|por|ega|j a|n l|rim|ojn|u h|e s|s l|or |a e|u a|j ĉ|pri|ntr|ont|evi|u r|n j|re |nte|ata| fa| pl| na|ika|igi|tiu|laj|gal| eg|raŭ|cev|ice|ric|ne | ku|ĝi |lan| ju|nen|j s|n s|no |era|pre| el|ian|bla|ebl|vi |tek|e a| pu|don|u s|u e|ers|art| su|iĝo|j n|o p|igo|ren|e p|ons|li |j i|ena|er |len|ple|n r|ote|rot|sti|s e|for|n ĉ|niu|imi|son|tat|o n|o r|u l|con|ili|duk|bor|abo|lab|edu| ed|tan|iĝi|ioj|is |ni |uzi|lo | ek|res|men|un |dis|e e|el | ma|erv|i e|ern|ato|ĝo |a d|lig|go |ĉi |coj|unu|ti |laŭ|moj|hom| ho|kad|kun|edz| ce|ŝta| ŝt|i k|zo | ar|n i|u k|ra |kri| ag| kr|j f| vi|ura|nda|ono|rso|par|ndo|and|jur|far|ven|ŭ s|ka |eli|sek|ĉu | ĉu|kia|kla|ini|uka|r l|ele|rto| pa|i l|ora|edo|le | ge|l l|opr|ive|ziv|luz',
    pam: 'ng |ing|ang|an | ka| pa|g k| at|ala|at | ma|g p| ki|apa|kin|lan|g m|ata|yan|pam|kar|ara|pat|tan| in| ba|pan|n a|aya|ung| a |g a|g b|rap|ama|man| ni|nin|n k|tin|ati|n i|tun|a a|iya|bal| me|ami| la| di| iy|asa| o |etu|nga|mag|met|ban|in |din|a k|nan|a i|ya |mak| na|ari| mi|kay|aka|yun|ipa| sa|sa | al|rin|a m|na |kal|ant|g s|par|ana|al |ali|ika| da|t k|san|gan|ran|lay|u m|nu |g l|un |a n|atu|kat|awa|a p|t m|ti |iti|syu|mip|ila|aba|n n|la |kas|as |ili|nsa|wa |kap|mal|ra |n d|aki|g n|t p|g i|anu|t a|tas|ans|ita|iwa|uli|i a|mil|a d|bat|sal|ira|li |una|lal| it| pr|dap|ral|ad |usa|o p|kab| an|mik|tul|e p|nte|iba|tau|be |ag |s a|aga| e |lit|mas|wan|lir| ta|abe|g e|abi|n o|n p|lip| li|lam|pro|n l|te |au |kan|g g|ap | ar|ani|alu|e k|it |sab|ale|a b|t i|eng|tek|uri|lab|ail|l a|nti|mam|i i|gaw| tu|ily|ian|liw|inu|da |g d|g t|bra|obr|u i|mba|ina|aru|abu|ie |bie|mit|am |o k|lya|pun|o a|a o|asy|gga|lub|pag|gal|bla|abl|en |len|lat| bi|pak|tur|lin|ksy|eks|ote|rot|e m|ril|sar|u a|u n|tu |gpa|agp|n m| ke| pi|ipu|ka |wal| re|ta |tik|ngg|nap|rti|art|ema|gam|ko |kia|kai|aun|d a|tad|nta|amb|a l|rus|g o| ya|lak|bus| ga|gob|dan|sas|ags|nun| nu|sak| ag|e d|a e|agl|are|bil|ndi|and| pe|iyu|rel|kul|i k|upa|isa',
    tiv: 'an | u | na|nan| sh|en | a |shi|ha | i |sha|a i|or | er|er | ma|u n|n i|han|ar |n s|gh |r n|n u|a m|in |yô |n a|na |n n|hin| ha|u a|a u|a k|mba|n m|a n|nge| lu|kwa|man|n k|ana| ke| ve|r u| kw| mb| ga|ren|lu |a t|agh|ir |ga |aor|mao| yô|a s|nma|anm|ang|wag| ia|gen|a a|ba |ma | ci| ng| gb|i n|ken|ere|ian| or|aa | kp|e u| ta|ve |r i|ii |gu |ngu| la|ity| he|om |a h|hen|n g|ge |la | ts|n t|e n|oo |gba|kpa|u i|ese|se |aha|cii|r m|tar|r s| ka|ol | ne|tom|u k|ugh|ish| ku|ev | it|doo|ior|n e|on |ene|u s|hi | de|n h| te|yol|oug|a v| to|igh|u t|tyô|ind|i u|i d|ima|iyo|h u|paa|a l|ua |ndi|o u|him| is|r k|i m|ie |hie|tes|u e|yan|hir|ker|di |e s|uma|r a|a e| do|m u|nen|era| io|e a| ya|un | as|ne |tin|ee |mak|u h|tse|n y| za|a g| in|bar| mi|ka |i a|ron|ôro| iy|men|ase|e e|de |ô i|a o|nah|ave| zu|gbe|ran| ti|i v|io |u l| ik|r t|n l| ig| mk|nja|inj|eng|ant| wa|e h|mi |a d|ra |kur| ij|a y|end|hio|lun|l i|r l|av | fa|u z|h s|e i|do |ndo|i k|i i|ta |nta|ake|ash|uan|zua|u m|e m|i l|a w|ura|ôm |môm|vou| vo|i e|iji|e k| hi|da |nda|ghi|kig|iky|see|v s|a f|n c|was|ce |ace|mac|soo| so|r c| mt|vir|ivi|civ|zou|mzo| mz|a c|nev|ves|emb|sen|jir| mô|e l|e g|i y|een|uer|lue|alu| al|u u|ô u|zan| im|ônd|n z|e y|em ',
    tpi: 'ng |ong|lon| lo|im | ol| na|la |ela|pel| ma| yu|at |ait|gat|ri | ra|na | bi|ol |t l|it |rai| ka| o |mi |umi|bil|yum|ilo|man|t r| i |eri|ing|iga| ig|mer|ara| wa|i o|rap|tin|ta |eta|get|lge|olg| sa|wan|ap |ain|ape|nar|in |a m|ini|ant| no|i i|em |m o|g k|n o|sim|an |as |mas|i n| wo|yu |nme|anm|wok|g y| me|kai| ga|ok |tri| pa| ha|ntr|kan|g o|m n|a l| st|g s|i b|a i|g w|a k|g l|i m|g n|gut|ama|isi|o m|l n|sam|kim| in|lo |pim|aim|kam|p l|sin|amt|a s| gu|i l|tai|mti| ko|t w| la| ki|m l|en |g b|tpe|no |nog|m k|a t|utp|tap|sta|m y|nim|nap|api|g p|tu |ts |a p|nem|i y| tu|kis|lai|oga|tim|spe|isp|its|a o|a n|nka|map|nta|l i|usi|g g|o i|s b|sem|lse|ols| sk|n s|t n|m s|g t| ti|luk| lu|ni |iki|o b|sen|o l|os |et |iti|kin|dis| di|a y|asi|pas|ane|ari| pi|ili|ina|o k|aus|s i|ot |a h| ba|npe|anp|nin|aun|yet| ye|ik |lim|gti|ngt|m g|i g|pik|aik|u y|sai|kot|ut |k b|uti|aut|kau|pos|sap|un |a g|s o| ta|am |ve |ave|sav|i s|s n|t o|ank|a w| fr|ul |kul|sku|ti |m b|go | go|u n|g h|n i|ese|i w| ne|ati|vim|ivi|ali|t m|n b|gav|o n|apo|rau|n m|l m|hap|o w|oli|s l|es |les|ple|m m| em|l s|a r|m i|fri|liv|hal| si|bun|pai|dau|nsa|ins|upe| hu|g r|kom|ana|san|n r|nis|gar|aga|bag|n n| pe|m p|m w|s s|avm|uka| as|g m|g e',
    ven: 'na | na| mu|a m| vh| u |ha |we |a n|wa |tsh|hu |a u|ṅwe| ts| ya|lo |ya |ana|nga|vha|ho |o y|uṅw|a v|thu|ane|muṅ|shi|e n| dz|vhu| pf|elo| kh|nel|ga |a p|a t|fan|ne | zw| ng|pfa|sha|u n|uth|aho| a |a k|mut| ka| hu|a h|ele|kan|kha|o n|edz|wo |dza|zwa|la |u m|a z| mb|e u|dzi|hum|si |i n| wa|a d|mul|e a|zwi|u t|fho|ang|ḓo | ha|u s|o v|gan|olo|vho|ela| ḓo|lwa|o d|hol| i |ula|aka|o m|no |za |o k|hi |he |shu|han|o t|zo |ofh|lel|led|rel|low|u v|awe|tsi|hak| sh| ma|ka |mbo|ano|e k|yo |elw|a i|a s|bof|ngo|o i| te|nah|owo|iṅw|hil|its|o h|dzo|zi |dzw|mba|lan|e m|i k|sa | mi| si|ing|one|hon|and|ush|go |isa|li |het|e v|a l|swa|ire|sir|i h|i t|a ḓ| nd| lu|eth|umb|hat| fh|dzh| it|ine|wi |avh|khe|u k|ea |tea|unz|ni |ṱhe|ath|ndu|hen|ila|u a|mo |wah|kon|ulo|vhe|wan|o w|u w|mis|a a|a y|i ḓ|isw| an|iwa|hus|hel|e y| sa|alo|mbu| ḽa|oṱh|le |du |mus|o a|uts|ayo|tel|nda|amb|uvh| ho|vel|fun|i v|zan| ny|a w|zwo|o ḽ|pfu|u i|adz|hut| bv|kat|lay|hav|hit|afh| ḓi|evh|i m| ko| li|umi|aṅw|so |fha|ene|nyi|she| o |mal| iṅ|nḓa|mel|zhe|ivh|zit|hii|san|lis|ili|eli|ala|hul|u h|o u|ura|bul|nzo|umo|i i|mbi|haw|hin|o z|u ḓ| th|o f|oni|lus| yo|alu|lwo|ḓa |anḓ|fhe|zhi|u d|eah|usi|a ṱ| re|une|ite|ere|rer|hur|mbe|hal|lul|ule|thi',
    ssw: 'nge|ntf|e n| le|tfu|eku| ng|a n|o l|la |lo |fu |khe| ku|nga|tsi| ne|le |unt| lo|he |mun|a l|nkh|ma |si |ele|elo|ung|nom|oma| no| um|wa |ni |ent|lel|lek|eli|lun|kut|ko |nel|gel|eni|pha| ba|onk| la|e l| em|ats|tfo|a k|e u|o n|e k|nye|hla|ela|umu|ban|oku|ulu|aka|akh|lil|won|ema|lok|lul|hul|a e|eti|ala|tse|khu|uts|ilu|i l| wo|ane|ye |nti|ndl|ang| na|ule|ve |we |esi|nek|na |ke |any|aph|ana|fo |set| li| ye| un|ale|lan|u u|hat|une|te |e b|eko|aba| ka|kwe|and|gan|lwa|ka |gen|tin|nem|phi|fan|wen|ben|mph|nal|kan|i n|ile|lal| ek|i k|gek|kel|o y|lab|ant|seb|u l|len|ahl|‐ke|let|e e|ako|ebe|lom|ive|be |ing|a b|kha|etf|uhl|ba |isw|kus|kho|ukh|yel|wo | kw|ikh|o k| im|uma|kat|kub|ne |ndz|sit|alo|ise|ini|omu|uph|abe|ngu|e i|alu|mal|nak|a i|kuv|sen|tis|kun|elw|lwe|e w|iph| in|fun|enk|sek|eke|dle|ti |lin|ase|a a|sa |use|hak|gab|a‐k|e a|les|kul|nen|kuh|ta |cal| ti|isa|tfw|ona|swa|ene|ma‐|hol|jen|ali|eki|bon| se|to |fol|utf|yen|ula|o e|lon|kuk|ike|liv|sel|ute|sik|lak|eng|hi |ume|kuf|alw|int|sha|nhl| ya|its|i e|fut|i a|und| bu|i u| ab|ebu|emb|dza|ndv|kil|emp|had|yak|ets|ifa|vik|emt|phe|emi|ite| si|tsa|kwa|u n|dla|a u|olo|imi|o m|han|gap|nan|ufa|ata|wem|mts|end|uvi|i w|ekh|owo|low|ind|i i|uba|mel|vum|dvo',
    nyn: 'omu| om|a o| ku|tu |ntu|wa |ari| ob|ra |a k|obu|mun|uri|mu |unt|a n| mu|nga|ri | na|ho |e o|bwa|aba|rik|a e|gye|han|ga |ang|oku|a a|bur| bu|iku|re |ush|aha|iri|uga|ka |i m|ndi|sho|ain|kur|u a|we |ere|ira|ibw|ire|na |e n|ne |ine|iha|aho|ung|and|e k|ye | eb|a b|ban|eki|ing|bug| ni| ab|ba |kut|ura|uba|be |ro |u b|sa | kw|bir|ebi|u n|kwe|e b|gir| ok|i n|kir|zi |abe| bw| ah|o o|kub|i k|gab|ish|sha|era|o e| no| ai|u o|ate|tee| ek|di |rwa|ha |kuk|rin|mer|wah|kwa|i b|bwe| ba|ant|zib|u m|end|ngo|i a|ngi|bus|nib|ama|baa|kuh|iro|iki|eka|eek|i o|nar|o g|go |kug|ya |kan| ka|ngy|ana| ar|o b|agi| ti| or|hi |shi| gw|eme|ash|gan|bwo|o k|rag|uru|ute|ris|ja |mur|ora|tar| nk|she|o a|i e|oro|iba|yes|wee|tek|ara| en|bya|ija|mus| ha|kus|mwe|eir|hem| ne|obw| n |eih|rir|za | we|ekw|naa|yen|o n|uta|iho|rih|har| by|egy| er|e e|amb|da |nda|rei|gi |wen|kwi|aar|eby|rer|yam|a y|isa|yaa|nko| bi|aka|sib|aab|ind|riz|uku|irw|si |nsi|ens|iin|aij|mub|a r|ugi|oon|ata|ki |dii|nka|utu|bas|hob|aga|kor|uko|n o|eri|bye| am|amu|ika|ham|mut|umu|nok|aat|izi|uzi|o m|ebw|oba|emi| em|rim|azi|uka|rye|ona|okw|u k|e a|kum|tuu|ibi|ahu|gwa|bor|mo |aas| ya|ent|ete|u e|ori| ei|bo |ani|amw|aah| ky|uma|eer|der|nde|ugy|a z|ikw|tih|ong|yob',
    yao: 'ndu|chi| wa|du |akw|aku|a m|kwe| ch|und|ni | mu|wak|mun|la |e m| ak|wa |wan|amb| ku|ulu|mbo|ali|u w|we |ila|kut|lu |bo | ma|kwa|a n|ful|ufu|le |se |a k| ni|hil|nga|ose|ete|e u|ang|jwa| jw| ga|na |kul| uf|lam|ne |amu|aka|son| na|e a| pa|oni|u j| so|ngo|wal|and|go |mwa| yi|te |wet|ana|uti|nda|yak|che|lij|gan|i a|a c|ele|cha|o s|e n|jos| ya|o c|ijo|i m|ti |pa |ga | mw|kam|ya |ula|asa|ala|ind|yin|e k|isy|ich|kas|ile|li | ka|ili|o m|ani|si |ach|u a|nam|ela|jil|ikw|a w|mul|yo |uch|aga|a u|hak|asi|kap|gal|kus|mbi|mba|mal|ma |ule|ape|o a|lan|i w|imb|pe |his| al|e w|end|a p|usi|ika|uli| ng|ope|sye|a j|aji|kum|ase|i k|ine|pen| ja|lem|him|u y|e c|mas|ka |och|ena|ekw|sya|ako|kup|a y|any|man|ane|ten|kol|hel|i y|ola|i u|wo |wam|e y| ul|kwi| kw|awo|gam|cho|gak|o n|eng|sen|pel| mp|iwa|da |gwa|sop|jo | ji|mch|ite|ama| li|ngw|hik|syo|u g|mpe|je |oso|ye |emw|ujo|duj|uwa|kuw|bom|ja |i g|mus|waj| mc|iga|tam|upi|jak|ong|dan|a s|sa |was|ole|nde|nji|ene|oma|nya|poc|ons|lo |apo|a l|i n|alo|mka|ale|one|o k|lil|uma|lic|ung|i j|ban| bo|mag|ata|usa|win|lik|hos|o g|sik|lig|lek|kan|anj|iku|pan|ing|u m|wu | aw| mm|eje|uku| yo|omb|pak|a a|he |hin|e s|esy|nag|muc|iji|lwa|mma|kal|ba |nil|uta| nd|awa|i p|ipa|no |ano',
    lvs: 'as |ība|ies|tie|bas|ai |un | un| ti|sīb|esī|ien|ir | ir|vie| vi| va|bu |am |ību|iem|m i|em | ne|s u|r t|vai| uz| pa|uz |ena|ās |pie| pi| iz| sa|nam|dzī|šan|isk|ar | ar|kvi|ikv| ik|viņ|brī| br|es |rīv| ka| at|u u| ci|i i|s p|cij| no|edr|inā|āci|s v|iņa|drī|dar|s t|u p|u a|pār| pr|i a|ot |nu |s s| la|zīb|ska| ie|aiz|jas|ija|vīb| jā| ap|ībā|īgi|vis|arb|tīb|gu | st|kā |s i|val|īvī|ām |īdz|st |ied|bai|īgu|s b|ņa |t p|arī|lst|als|ana|s n|gi |līd|s l|mu |umu|kas|jum|ju |iju|kum|u i|ba |u n|izs|n p| ai|ā v| da|nīg|ama|u k|u v|i v|rdz|son| tā|kst|īks|rīk|ned| so|iec|s k|ajā|cit|sav|līt|stī|pil|u d|t v|per| pe|bā |nīb|i n|not|stā| dz|s d|m u|ras|tu |cie|n v|kat|ā a|mat|enā| li|evi|nev| kā|kur|aut|nas| pā|skā| re|a a|a v|kād|ebk|jeb| je|bez| be|jā |līb|i u|i p|bie|tik| ta|n i|pam|mie|ard|sar|zsa|nāc|iku|lik|iet|r j|būt|rso|ers|du |ikt|sta|ciā|oci|soc|cīb|tis|rīb|āda|tīt|ītī|glī|zgl|izg|abi|ulī|aul|lau|tra|atr| lī|ais|tot|atv|umi|nod|anu|t s|a u|ram|ier| ku|a p|tās|kt |klā|a s|ta |ant|iāl|ma | ve|n b|nāt|ekl|ret|pre|ā u|lvē|ilv|cil|jāb|sab|eja|oši|mēr|āti|roš|dro|pat|m k|kri|rie|ūt |m v|ēt |t t|zīv|īga|a i|kar|atk|nea|ts |ādu|āt |s m|lās|nāl| na|ecī|tas|iģi|liģ|eli|rel|uma|sas| ga|s g|et |m p',
    quz: 'una|an |nan|as |pas|apa|ana|cha| ka|lla|man| ru| ll|sqa|run|qa |aq | ma|ach|ta |pa |paq|npa|mi |taq|na | ch|a r|kun|hay|anp|tin|nta|nch|yta|chu|asq|chi|aku|lap|ant|qan|kuy|in |ama|aqm| wa|qmi|a a|ay | ya|ata|nap|ati|ipa|wan| ju|ina|a k|aqa| at|may| ja|a l|aqt|ayt|a m|kan|ima| pi|n k|s m|nin|ank|tap|anc|qta|his|hu |pip| mu|n j|all|a c|spa|uku|ypa|qpa|iku|yac|pi | pa|ion|uch|naq|pan|n m|a p|kam|un |han|ayp|a j|aci|nac|awa|n r|laq|s k|nma|anm|usa|aus|kau|isq|k a|n l|cio|asp|lan|n c|ayk|yan|nak|oq |yoq|ayn|inc|nat|uy |n p|yku| im|mun|jin| ji| yu|i k|has|q j|tan|inp|tuk| tu|n y|ura|kay|uyt|kus|ña | na| sa|is |nmi|s t|s w| qa|mac|tun|atu|jat|asi|yni|uya|api|pac|nk | ay|kaq|tiy|waw|inm|ech| de|n t| ri|q k|a y|ma |hik|nti|sin|kas|lin|lli| al|ari|nku|juc|was|nal| aj|i m|pay|rmi|arm|war|a q|yay|yuy|q y|say|i p| ti|usq| an| as|qti|n a|npi|pap|hur|a w|rec|ere|der|ita|q c|rim|s p|aqp|s y|yqa|iyo|niy|ani|i l|unt|s j|juj|kin|iya|q a|huy|a s|ywa|nka|sap|u l|ras|int|sta|uma|kuk|piq|iqp|hak|tay| ta|qas|q r|ypi|maq| su|ash|y r|uj |qsi|lak|heq|che|min|a t| ni|yma|t a|s a| ki|uyp|q q| re|muc|nqa|cho|unc|yas|s l|ayo|y l|qha| qh|ist|pur| pu|la |ill|mas|nam|pis|isp|hap|q w|lat| si|mik|y k|y s|ayq|pat|ali',
    src: ' de|de |e s| sa|os |tu | a | su|tzi|one|sa |ne |ent| in|ion| e |a s|su |der|zio|u d|ret|e d|as |ess|ere|es |men| pr| pe|et |ten|ade|etu|nte| cu|ale|er |re | so|s i|atz| te|in | un| s |ene|a p|zi |ida|e e| on|sos| es|e t|nzi|onz|are|chi| si|le |te |s d| is|dad|u s|a d|net|u a|e c|tad|sse|ame|sso|t d| ch| o |son|at |pro|e i|i p|e a|pes|e p|nt |ntu| co|na |a c|du |hi |u e| li|e o|s e|int|s a| at|sas|un |cun|nu |per| po|ter|n s|ber|ser|nes|tra|zia| di|res|ro |s c|si |adu|sta|nat|s p|unu|era|ia |t s|tos|t a|da |nal|pod|u c| re|s s|sua|ona|ica|ist|ibe|lib|rar|egu|ntr|s o|ua |a a|o s|pre|ntz|ant| ne|ust| da|ndi|una|rta| fa|ode|u p|a e| to|est|nta|a l| pa|u o|und|ra |ada|ert|iss| na|otu|con| ma|a u|ae |dae|o a|otz|dis|eru|cus|les|a i|pet|lid|ali|i s|iat|sia|u t|sot|rat|epe|s n|tot|ssi|t e|ime|unt| ca| as|a n|ind|sti|eto|st |etz|lic|ont|a b|a t|iu |fun|ta |ine|a o| se|nen|nid|suo|s f| tr|ass|e u|nda| fu|ial|ena|sen|das|ghe|e f|pen|ual|gua| eg|pri| fi|par|a f|ria|u i|for|t p|emo|seg|ner|icu|tut| no|eli|run|det|itu|dep|inn|man|tar|lu |dos|r p|art| pu| bo|cum|ina|i d|ura|u n|tes|mos|nem|gur| bi|idu|nde|cu |ata|us |o d|tic|e l|e r|cam|des|ènt|din|ral|cas|uni|ios|com|u l|ado|sio|fin|nsi|n a|ire',
    rup: 'ri | sh|ari|i s|hi |shi| a | ca|ti |ea |i a|tsi|rea|i c|tu | s |ndr|dre|i n|a a|ptu|ept|rep|câ | nd| un| di|la | la|i l|i u|a s| tu|ear|di |ui |lui| li|are|a l| ar|un |â s|li |caf|ati|tat|afi|lje|fi | lu|ats|icâ|â t|ei |râ |bâ |nâ |ibâ|car|i t|jei|si |ali| câ|tul|hib| hi|s h|tâ |or |u c|n a|â c| in| cu|ul |i d|ilj| ti|â a|a p|a c|a n|lor|tea|u s| al|int| co|u a|cu |tur|ber|ibe|lib| ic|lu |i p|eas|tsâ|i i|u p|sea|lji|min|u l| nu|â n|nal| pi| pr|ii |url|rar|nu |sta|ots|alâ|ji | po|â p|sti| ts|sii| si|al |oat|can|til|ura|â l|anâ|its|i f|lâ |nat|ina|ist|ert|sâ |i m| st|sia| so|pri|â d|poa|ips| fa|sht|tut|tse| ac| ap|ând|t c|ita|nts|gur|a d|sot|ent|sh |lip| su| as|ate| lj|urâ|pur| ân|at |ili|uni|a i|ona|â i| de|âts|ash|zea|i e|ucr|luc|itâ|unâ| ma|act|bli| pu|nit| sc|con|tar|alt| mi|nde|ind|tât|hti|ntu|rli|ilo|ntr|par|r s|a t|apu|imi|rim|mlu| ni|com|igu|sig|rta|i b|ial| na|tic|l l|ica|est|tsl|âlj|art|pse|chi|iti|unt|sun| ea|r a|adz|l s|tlu|atâ|ter|sit|asi|pi |apt|ia |rlo|ârâ|fâr| fâ|oml|uts|scu| ba|na |lit|ndu|pis|dit|gal|ega| eg|fac|s f|ru |acâ|câr|ead|atl|ra | ta|arâ|cul|rti|nte| cr|iil|i v|lic|ubl|pub|vre| vr|s l|cri|nom|scâ|asc|nji|ire|ion|aes| ae| du|rtâ|idi|ini|sin|eal|uti|cru|vit',
    sco: ' th|the|he |nd | an|and|al | o |ae | in|es |in |t t| ta|cht|or |tae|ich|ric| ri|ion| aw| be|is |s t|tio|ht |bod|dy |ody|s a|e a| he|e r|ent|on | co|his|hes| or| na|ati|wbo|awb|ty | fr| hi|be |e t|n t| sh|ts |sha|er |hal|nal| on|y h|ng |l b|ree|fre|ing|l a|e o|y a| pe|o t|it | ti|e s|ter|s o|air| ma|nat|for|n a|nt |il |til|aw | fo|ona|e c|ny |ony|tit|nti| a |men|ity|e w|at |d t|t o| wi|her|e f|dom|edo|eed|d f|d a|ce |con|an |e i|e e|r t|nte|ar |lit|oun| re|ic |n o|nae|t i| it|ont|sta|oci|soc| as|y i|r i|ith|ne |ane|ons|ed | di| so|ly | wa| fa| pr|y s|ers| ha| se|int|und|e g| st| de| fu| en|nce|hts|d o|o h|res|com| no|le |e h|nin|r a|ie |e p|ear|ial|r o| la|inc|ite|wi |re |ual|qua|equ| eq|ns | le|ess|ali| pu|en |per|e m|cia|as |thi|lt |elt|rit| is|d i| we|imi|din|ild|eil|nor|r h|t n|e b|tri|ntr|ir |iou|eli|ge |lan|s r|s f|ms |tel|cie| me|lea|fai|y t|hat|tha|l t|law|g a|om |y o|sec|e l|ver| tr|ds |r b|l o|iti|un |cti|dis|e d|s d|id |hei|ld |are|rou| un|omm|s c| at|ssi|war|n h|me | ac|ten|bei|t a|uni|eme|tho|rt | ga|s n|m o|hau| li|tie|g o|rni| wh|s w|rie|ern| gr|mai|tat|n n|ica|igi|age|n w|oms|s e|d s| ar|nit|ee |n f|man|arn|rk |ark|eri|ral|e u|k a|el |te |ose|pos|ak |ces|s h| ch|lic',
    tso: ' ku|ku |ni |a k|hi |i n| ni|a n| a |ka |i k|wa | ya|na |ya |fan| ma|la | ti| hi|nel|iwa|a m|ane|hu |a t| sv|ela| na| ka|lo |svi|u n|mbe|nhu| à | mu|u k|a w|eli|ndz|li |vi |be |kum|ihi|umb|i l|wu |ele|elo|mun| wu|a h|a l|nfa|u l| fa|liw| va|aka|wih| wi|unh|nga|lan| nf|a s| wa|u y|u h|iku|tik| ng|i m|u t| xi|va |o y|le |i a|nu |yel|amb|e k| le|anu|han| ha|isa|ana|eni|a x|lel|ma | kh|a a| la|ga |ndl|i h| li| nt|irh| ko| è |a y|ti |ani|ta |sa |in |kwe|u a|i w|any|lek|u v|pfu| ye|van|yen|u w|i s|yi |tir|à n|and| nd|mel|e y|eke|i t|a v|n k| lo|à k|isi| kw|hin|we |ang|è k|wan|aye|ko |a f|mah|rhu|i y|end|ham|mba|u f|lul|ulu|hul|khu|kwa|nti|hla|ngo|kel| si|eka|dle|dzi|may|ule|aha|u s|u m|i à|ati|thx| th|dze|nth|anh|eki|oko|eyi|u à| lè|mat|n w|xi |fum|vu |nye|zis|i f|thl|lok|rhi|ava|a è|lak|o n|mbi|tà |mu |ke |tin|ond|o l|ngu|e n| dj|ong| mi|siw|a à|vik|lwe| ts|uma|naw| tà|hak|èli|à m| là|xa |ume|u p|sik|gan|e a|wak|xiw|ind|u d|esv|les|ike|wey| lw|e h|awu|mha| hà| ta|za |dza|i x|nyi|ths|fun|avu|wav|kot|ki |jon|djo|rha|umu|ba |sin|ha |xih|kar|lon|hxu|àwu| nh|to |ung|a u|ola|kol|ali|fu |int|akw|nan|àkw|gul|sun|wen|ikw|gom|kon|sva|kho|hel|sem|tse|sek| y |zen|ìhi|là |mi |e w|hlo|e m|exi|lex|nya',
    men: ' ng|ɔɔ |a n|i n|ti | gb| ti| i |i l|ngi| ma|gi |aa | nu| kɔ|a k|ia |ma | na| ye| ta|kɔɔ|ɛɛ |ei | a |hu |bi |gbi|a m|na | hu|a t|i y| lɔ|u g|ya | nd|ii |i h|a h|i m|ɔny| kɛ|ɛ n|nya|lɔn|mia| mi|ɔ t|uu |ngɔ|ɔ i|ee |nga|lɔ |la |ao |tao| kp|i t|ye |nge|ɔ n|i g|gaa|gɔ |i k| le|hou|a y|ung|ni |ind| yɛ|e n|nuu|a l|nda| hi|umu|num|hin|mu |ugb|hug|oun|kɛɛ|eng|gba|a a|maa|a i| ɔɔ|da |ɔlɔ|ahu|le |i i| sa|ndɔ| ji|a w|ɔma|mah|yɛ |e t| lo|saw|o k| va|ta |gbɔ|u n|i w|li |va |u k|bat| ho| ya|sia|lei|ahi|e a|i j|nde|e m| ki|yei|isi| wo|kpa|dɔl|gbu|ɔ k|ge |awa| gu|wei|awe|e k|ila|ani| wa| ii|ji |aho|ale|ndu|kpɛ| ha|kɔl|a g|gbɛ|wa |nah|i b|yek|ein|yil|bua|atɛ| la| ny|tɛ |ɛ t|kpɔ|taa| ɛɛ|ɔ s|ie |ɛ k| we|bɔm|kpe|ekp|hei|nun|uni|ɛi |u t|ɛ y|ɛlɛ|gen|te |ote|wot|ɔ g|ama|i ɛ|ulɔ|gul|lee|kɛ |eke|pe |tii|ɔ y|pɛl|yen|bɛɛ|e y|ɛ g|ɔle|ga |a b| tɔ|u w|aah|baa|lek|o g|a v|bu | he|ili|kia|uvu|aal|jɔɔ|ajɔ|maj|nye| bɛ| sɔ|lɔl|ka |ɛmb| wi| ka|e h|iti|akp|ang|bɛm| ba|u m|u ɔ| yi|ɛ i|e g|lii|uah|nuv|lɛɛ|gua|yɛn|sɔɔ|ui | lɛ|dei| pe|i p|mbo|uam|ong|lon|ngo|oko|lok|a p|a s|haa|i v|ula|hii|yee|yan|u a|ati|wat|hi |ke |wee|e i|u i|ewɔ|ɔ h|wu |nyɛ|oi |ɔhu|ɛ h|u y|vuu|boi|paw|ɛng|wie|ɛ w| ga|lɛ |ɔɔh|bla|ɛ a|ɔli|ua |mɛi|amɛ|oma',
    fon: ' e |na | na| ɖo|ɔn |ɖo |nu |o n|kpo| nu| ɔ | kp|mɛ | mɛ| gb| é |tɔn|po |do |yi | si| tɔ| al| to|gbɛ|wɛ |bo |e n|ɖe |lɛ | lɛ| do|lo |in | bo|e ɖ|ɛn |o a| wɛ|ɛtɔ|to |tɔ |ɔ e|sin|o e|a n|ɛ b|acɛ| ac|o t|nyi| ny|ɔ ɖ|okp|nɔ |ee |bɛt|ɖok|cɛ |ɛ ɔ|bɔ |an |ɛ n|a ɖ| ɖe|ɛ ɖ|o ɔ|n e|ji |ɔ n| bɔ| ǎ | en|mɔ | mɔ|n b| hw|i ɖ|alo|lin|n n|ɔ é|n a|nɛ |ɛ e|un |o ɖ|bi | bi|mɛɖ| yi|i n| ye|kpl| jl| wa|ɛɖe|enɛ| ji|u e|i e| ɖɔ|alɔ|a d|n m|ɔ b|é n|nun|hɛn| hɛ|e m|e e|ɔ m|e k|ɖɔ | nɔ|lɔ |ɛ é|é ɖ|odo|gbɔ|wa |n k|a y|kpa|sɛn|a s|ɖee|ɛ k|a t|jlo|ɔ w|ɔ t| sɛ|e j|kɔn|ɔ g|nnu|inu|pod|bɔn|o g|e s|ɔ s|unɔ|n ɖ|ɔ a|o s|a b|n t|hwɛ|o j|e w|o m|i t|bɛ |xu |ixu|six|eɖe|etɔ|ɔ k|lɔn|bǐ | bǐ| we| ka|nuk|o h|n ɔ|ba |zɔn|ukɔ|a m|ɛ a|n d|ma |o l|hwe|si |u k|azɔ| az|ema|wem|ogu|tog|nmɛ|o y|sɔ | sɔ|ali|ɛ l|jɛ |n l|ayi| ay|ɛ s|plɔ| zɔ|a z|ɖè |i k|onu|n w|u w|u a|u m|a e|hun|o b| lo|gun|n s|e ɔ|ka |dan|o d|gan| i |a g|i w|ɖó | ɖó|n g|wu |u t|yet|ɛ g|su | su|oko|a j|ɛ w| hu|ɛnn|obo|u l|kwɛ| ga|a w|i s| fi|a l| ee|pan|lee| le|ɛ t| ɛ |e b|evo|ɖev| wu|u g|i a| ma|ɖi | ɖi|ye |o w|isi|sis|zɔ |ǐ ɖ|o k|nú | nú| vi|ple|emɛ|we | ɖ |wɛn| ba|o é|nya| da|ɔ h|gba|ɛ m|fi |ya |kan| jɛ|e g|i m|jij|mɛt|ɔnu|u n|nuɖ| eɖ|e t|xo |ɔ y| li|enu|wen|ɔmɛ',
    nhn: 'aj |tla| ti| tl|ej |j t| ma|li |a t|tij|an |i t|sej|kaj|eki|uan| to| no| te|ij |j m| ua|chi| se|noj| ki|ma |ika|laj|j k|j u|pa |tle|man|aka|oj |ka |lis|ech|tek|se |uaj|ano|ise|iaj|tec|amp|iua|ali|pia|j n|och| mo|pan|mpa|a k|kua| pa|n t|is |ya | am|uel| ue|eli|ual|ili|en |len|kit|ajt|a m|jto|j s|kin|ijp|amo|ia |jki|tim| ke|mo |hi |ant|ama|ani|noc|opa|oli|aua|j i|ase|tli|nek|itl| ik|ijk|tok|nij|imo|ati|kam|jpi|tik|ipa|one|tis| o |oua|tit|ra |ara|par|nop|tl |jya|a s|iti|lal|cht|ok |ojk| ku|o t|kiu| ka|maj|kej|lak|leu|alt|ijt|mej|lau|kia|ana|ki |kij| ak|jka|n n|lam|i m|mon|e t|til|s t|nti|j a|k t|ita|kip|kem|j p|lan|jtl|tep|lti|lat|ema|uat|ose|iki| ip|ats| ni|ntl|ajy|e a|stl|ach|tou|eua|tot|kat|uam|atl|eui|toj|ni |nau|nka|ist|epa|ite|ale|pal|oka|tia|ajk|ini|j o|tsa|n m|ipi|kui|eyi|uey|jua|a i|n k|mat|nit|i n|oju|a a|onk| on|o o|uik|uil|n s|ken|ijn|ank|a n|ote|i u|i k|otl| sa|kon|as |ino|hiu|xtl|tos|its|tsi|n a|oyo|eka|chp|san|mpo|uak|ko |a u|tol|oke|yek|yol| ya|uas|pam|nok|tin|aui|htl|o k|sij|yok| me|nem|las|jke|ejy|hti|jne|nko|jti| ax|mac|emi| in|i i|mot|oui|ame|yi |lit|i a|kol|jku|sek|epe|lte|pil|nan|axt|ami|ejk|ine|int|ojt|ate|ias|ela|mel|aku|ina|uis|etl|kis|mik|ito|ui |ak | ye|ona',
    dip: ' ku|en |ic | bi|bi |ku | yi| ke|yic|an | ci|aan|raa| th|c b| ka|n e|n a| eb|ci | ra|c k|ŋ y|kua|i l|i k|ka |in |th |ben|ny |ebe|kem| ek| al|eme|men| ye|k e|höm|nhö| nh|öm |ai |alɛ|lɛ̈|i y| lo|n k|t k|c e|thi| la| er|ɛ̈ŋ|ɔc |̈ŋ |kɔc|ek |yen|ua |m k|de |t e|ŋ k|a l|ok |aci| te|n b|at |u l|ith|n t| ep| ac|k k|it |i r| lu| e |uat|ke |u k|aai|oŋ |te |cin|ken|e y|eŋ |ui |epi|baa|ath| lɛ|tho|ɛŋ |hin|era|n c|e w| mi|a c|hii|lau|h k|ekɔ|n y|el | ti|u t|l k|au |kek|nde|lɛŋ| pa|n r|n l| et|h e|a k|u b|nhi|a t|thö|pio|la |c t|e k|ot |rot| kɔ|iny|pin|ŋ e|ak |loo| le| pi|i e|eba|ëk |ik |im |iim|ŋ n|oi | ro| ny| tu|kak| el|i m| kö|hok|y k|pan| we| ba|i t|iic|m e|u n|ye |oc |ioc|loi|k a|lui|wic| wi|e c|and|e l|eu |pir|i p|wen|ɛt | lö| li|mit|ëŋ |eth|yit| ey|öŋ |u m|nyo| aw|e e|i b| ew|i d|den|any|iit|iek| aa|k t|uc |köu| ko|leu|ir |r e|t t|e r| dh|ök |uee|tue|y b|e t|eny|uny|ooŋ|i c|cit|u c|n w| ya|l e| ec|kic|höŋ|eeŋ|dhi|a p|uan|m b|ut | ak|yii|y e|ewe|wuc|awu| mɛ|pat|i n|ien| ed|h t|uk |tii|öun|lie|ɛ̈n|elo|am |cii|r k|t c|wel|löi| wɛ|bai|thë|u y|tha|eku| en|k c|thɛ|hök|ɛɛt|il |hil| cɔ|ieŋ|cie|öny|kön|aku|m r|tic|oui|lou|ale|t a|war| wa|eka|ynh|nyn|kue|eke|eri|oth|yoo|loŋ|p k|up |k y|m a|y r|die',
    kde: 'na | na|la |nu | va| wa|a k| ku|ila|wa |a w|unu| mu|a v|chi|mun|e n|a m|a n|van|ya |ele|ana|le | ch|amb|ave|sa |lam|asa| vi|ohe|mbo|aka|u a|was|e v|bo | n’|ne |e m|ke |u v|vel| pa|ala|a u|ake| av|hil|ika|ng’|ing|ngo|he |a l|ve |ile|anu|ela|vak|any| ma|vil| li|a a|go |a i|wun|uku|ili|lan|bel|mbe|ene| mw|nda|kuw|ama|nya|ola|ali|kol|kan| di|g’a|au | au|emb|den|eng|lik|uni|wak|a d|’an|e a|lem|ong|o v|ulu|kuk|an’| ak|ach|a p|kal|ma |dya|n’n|lew|mad|aya|and|mwa|uwu|kum|ye |a c| vy|apa|va |ava|ane|hel|mbi|kut|o m|hi |we |ula|ole|u m|umi|din|ton|ji |nji|nil|ewa| il|voh|ade|und|ni |kul|dye|dan|kay|uko|idy|kav|tuk|nan|kam|ka |ia |lia|eli| dy| in|ndo|ond|hin| la|uva| ul|ani|vya|i n|o n|wen|mwe|da |e k|e u|o c|lel|pal|nje|yik|aha|uwa|lil|n’t|nga|ata| ka|she|pan|cho|ang|no |u i|lon|ulo|lim|uli|’ch|dil|hev|i w|u l|e w|mba|niw|mil|ba |yoh|uma| um| kw|u n|wal|vin|vyo| an|bi |a s| ya|dol|hoh|u c|awa|lin| al|ilo|’ni|e p|ale|n’c|mu |imu|lun|kup|yak|yac|’ma|n’m|mah|atu|wav|kuv|hon| lu|i v|hih|jel|utu|hap|uka|o l|u w|itu|ga |o a|i d|umb|a y|inj|taw|ita|lit|lek|val|e c|oko|aku|me |bu |paw|kuy|mak|e i|yen|iho|amw|woh| ih|iku|pil|kun|onj|tul|nah|awu|ahe|i a|kat|mat| wu|pac|ina|olo|uto|ech|kwa|i c|li |ngi',
    kbp: 'aa | pa|se | se|na |nɛ | nɛ| wa| yɔ|yʊ |ɖɛ |aɖɛ|a w|ɛwɛ|ɛna|ɛ s|ɩ ɛ|paa|a ɛ| ɛy| ɛw| ɛ |ɛ p|e ɛ|waɖ|ɛ ɛ|e p|a p|wɛn| pɩ|yɔ |yɩ |aɣ |ɛyʊ|ɔɔ |ʊʊ | ta|ala|yɔɔ|yɛ |ɔ p|a n| ɩ |yaa|taa|ʊ n|a a|ʊ ɛ| tɔ|ʊ w|zɩ |la |wɛɛ|nɩ | an|ɛ t| kɩ|anɩ|ɛ y|maɣ|ɛ n|nɔɔ| nɔ|ɛyɩ|ɔm |tɔm|ɩ t| we| pʊ|ɩ p|ɛ ɖ|ɩɣ | ŋg|ama|kpa|a t|ɩyɛ|ayɩ|a k| tʊ| kʊ| pɔ|daa| wɛ|pa |ʊ t|ʊ p|tʊ |ʊ y| ɛs|wal| pɛ| na|ɔɔy| ya|fɛy| ɖɩ|ɖɩ |ɔɖɔ|ɔ ɛ| ɛl|i ɛ|ɩ ɖ|wɛ |ɛ k|ɛɛ | tɩ|ɩ n|paɣ|ɩ s|ɛja| ɛj|ɖɔ | ɖɔ|ɔ s|ɛla| ɛk|a s| mb|ɩ y|ɛya|pal|a y|ʊma|ɔyʊ|a ɩ|jaɖ|ɖɔɖ|kpe|ɩzɩ|ɩna| ñɩ|yi |eyi|kɛ |bʊ |mbʊ|ʊ k|mɩy|tʊm|alɩ|ŋgb|ɛzɩ| fa|ʊyʊ|ɩ ɩ|ɩfɛ| ɛt|kɩ |wey|ma |lɩ |ɔɔl|nda|ɩma|gbɛ|sam| sa|li | lɛ|ɩsɩ|akp|pak|ɣtʊ|ya |lab|sɩ |ŋ p|pɩf|day|and|kan|ɣ ɛ|sɔɔ| ye|ɩm |kɩm| kp|uli|kul|ɛyɛ|ʊmɩ|laa|iya|ɩ k|e e| ɖo|ʊ s| ha|aʊ |maʊ| ɖe|aɣt|ɔ k|ɔ y|a l| ke|pɩz|ŋgʊ|ɣ p| kɛ|eki|ɔŋ |aŋ |tɩ |ɛhɛ|bɛy|ʊ ŋ|pʊ |ba | sɔ| ɛd|nʊm| nʊ| pe|ɖʊ |ada|pad|ɣna|le | le|ʊ ɖ|ñɩn|pe |zɩɣ|ɛpɩ|naa|gʊ |ñɩm|ɣ t|a ñ| la|hal|ɛda| ɛɖ|ndʊ|m n|zʊʊ|ɖe |ana|akɩ|bɩ |abɩ|lɛ |ɛɛn|m t|ɔyɔ|ekp| ɛp|dʊ |tɩŋ|ɛkɛ|ɖam| ɖa|ina|maŋ|alʊ|uku|suk| su|kʊ |ɛsɔ|ɛtɩ|lal|ɛ l|tɛ |e l|lʊ | kɔ|ɩlɩ|ɛɛk|i p|pan| tɛ|ŋŋ |aka|pɩw|bʊy|abʊ|nab|lak|ee |yee|e w|ʊna|m p|e t|ye |iye|uu |a ɖ|nɖɩ| nɖ|dɩ |eek|pee|ga |ŋga|yaɣ|a m',
    tem: 'a ʌ|uni| ɔ |ni |wun| wu| tə|yi | ka| yi| ʌŋ|ka | kə| kʌ|tək|kə |ɔŋ |əkə| aŋ|mar|nɛ | ʌm|ma |i t| th|ri | ɔw| a |i k|a k| ma|i m|ari| ba|wa |tha| kɔ| mʌ|ɔwa|thɔ|ba |ɔm | o |lɔm|ʌma|kɔ |i ɔ|a y|‐e |o w|ŋ k|a a|alɔ|te |i o|hal|ɔ b|aŋ |ɔ y|a m|ŋth|ŋ y| rʌ| ʌt| mə|kom|ema|yem|mʌ |ɔ k|om | ye|hɔf|ɔf | mɔ|th |e ɔ|ɛ t|ʌnɛ| ŋa| sɔ| gb| ro|ʌŋt|ɔ t|ʌth|a ɔ|ar |yɛ |ʌte|m k|ʌŋ |m ʌ|hɔ |ank|wan|ŋa |anɛ|ŋ ɔ|ŋɔŋ| ŋɔ|nko|rʌw|kʌm|ki |kət| yɛ| te|a t|ʌwa|ɔ ʌ|ʌmʌ|e a|kʌt|thi|i r|əm |ra |kəl|a w|ə k| yɔ|ʌme|me |a r|mɔ |kəp|aŋf|əŋ |e t|pa |əth|fəm|a‐e|ələ|ləŋ|ɛ k|ʌ k|ŋe |yɔ |ro |rʌ |ɔ m|gba|thə|ŋfə|li |ə b| ʌk|ə t| rə|m r|ɛ ʌ|i ʌ|ʌŋe|ta | ta|e m|bot|əpa|nʌn|m a|ma‐|sɔŋ|kəs|e w| ra|təm|ŋ t| tʌ|ath|gbə|ʌkə|ə s|ɛth|ɔ a| bo|i a|ŋ a|ŋ b|ɛ ŋ| bɛ|ʌrʌ|nth|ant|əli|bəl|o ɔ|ɔkɔ| pə| tɔ|əs |e y|kar|nka|ran|r k|ʌlə|əyi|m t|ə y|sɔ |ɔ ɔ|ŋgb|tʌŋ|ɔth|sɔt|mʌy|t k|ot |ith|ɛ m|tɔŋ|tət|ləs|mɔŋ|rək|ɔ r|thɛ| po|tə |wop| wo|gbʌ|f ʌ|ʌyi|ʌ ʌ|e k|ɛ a|mʌs|ə g|ənʌ|hən|bɛ |ara|pan|hit| ʌr|kɔŋ|a ɛ| wa|iki|ɔ g|to | to|lɔk|o t|ɛ r|eŋ |mʌl|gbɛ|ʌgb|hi |pi |tho|mə |ŋʌn|ər |oŋ |roŋ|m ŋ|hɛ |po |i‐e|mʌt|ʌ t|ʌy |ti |‐o |f ŋ|op |ɔ w|na |shɔ|nsh|ekr|sek|ʌse|aŋk|bas|mət|raŋ|kʌr|ʌtʌ|wat| ɛm|h k|i y|han|ək | ya|kəb|kɔn|yik|ayi|yir|pəy|ʌ ɔ|ɛŋ |əte',
    toi: ' ku|a k|wa |a m| mu|la |e k|a a|ula|ali|ya |i a|de |ang|aku|tu |kwa|aan|ntu|na |lim| al|ulu|lwa|mun|ngu|luk|ele|gul|mwi|wi |gwa|kub|imw|ons| oo|oon|se |nse|ant|zyi|unt|ela|si | ak| ba| an|and|a b|ala| ci|uki|isi|nyi|ide|kid|zya| lw|ba | kw|uny|eel|laa| ul|cis|yin|kun|uli| zy| ka|tel|nte|ina|kul|kuk| ma|ili|waa|uba|wee|kwe|ede|led|nda|we |mul|nga|kus|da |izy|kut|wab|ana|i m| ya|ukw|o k|amb|yan|ka |e a|lil| bu| am|uci|a l|ilw|a c|li |sal|ban|e m|e u|u o|ila|bwa|aka|bo |bul|akw|wak|ale|kal|o a|i k|amu|bil|umi|bel|mbu|lan|usa|egw|abi|lo |awo|kuy|kup|igw|ko |uko|kak|wo |law|aci|i b|u b|ati|o l|yig|asy|ubu|wii|ika| bw|le | mb|ga |ung|kum|kka|ku |ndi|aam|muk|cit|mal|bun|yo |ukk|ind| wa|i c|bi |aya|ne |ene|len|mo | ab|upe|a n|mbi|eya|kuc| lu|ndu|a y|syi|u z|uta|ile|abo|u a|a z|ita|uka|aba|bal|imo|ley|iin|yi |ti |u u|lik|du |asi|yak|o y|u k|ube|iko|cik|zum|muc|ani|ule|mil| mi|mbo|twa|e b|umu|was|di |o n|ngw|lwe|nzy|peg|zye|abu|buk|kwi|liz| nk|i n|bam|ta |kab|alw|eka|mas|u m|imb|onz|kon|sya|miz|gan|tal| we|uum|no |yil|int|lem|del|nde|end|mbe|uya|oba|azy|iyo|i z|lek| ng|o o|cii|i o|a u|mba|mu |a o|ako|yik|yeg|ezy|a w|mi |ni |omb|kom|o b|syo|iya|usi|min| ca|e c|aul|lau|uku| aa|yee|ama|yal|kam',
    ekk: 'sel|le |se |ja | ja|use|ise|mis|õig| va|ele|ste|ust|gus|us |igu|st | võ| õi|dus| on|on |el |te |ma |al |iga|või|a v| in|nim|ini|da |e j| te|ist| ig|ime|l o|lik|mes|e k|õi |est| ko|l i| ka|end|iku|ese|adu|gal| se|e v|tus|lt |ami|n õ|ema|aba|vab|a k| ra|lis|val|a i|atu| ku|tsi|ud | mi|ada|ali|e t| ta|ta |stu|ast|ks |ole|tam|sta|nda|es |ell|tes| pe|e s|ik |a t|is |i v|ahe|rah|t v|ava|bad|kul|ine|ne |t k|vah|ei | ei|e e|ga | ol|lus|kon|s v|ida|s t|gi |a r|mat|ioo|tud|tel|kus|oma| om|dse|kõi|teg|ees|i t|aal|ndu|a s|a j|ing|a a|iel|s k|vas|tse| ee|tem|ul |igi|lle|s s|i s|ili|vus|uta|elt| sa|aja|e a|eks|min|its|asu|a p|s o|sus|sli|i m|oni|oon|sio|ses|e o|ete|abi|ühi|ega| ki|ari|emi|si |i e| ke|uma| ri|usl|ahv|ats|eva|lev|ab |pea|eis|nis|rds|õrd|võr|sed| kõ|töö| ni| ab| üh|rid|nna|saa|teo|sek|ni |kor|ale|imi|ait|t i|sik|isi|eli|e õ|dis|ots| so|ata|lem|eab|üks|tum|dam| mõ|a o|õik|idu|har| tö|e h|nin|alt|onn|ite|ult|e m|mal|isk|kai|ead|sea|koh|d k|as |jal|põh| põ|aks|rit|hvu|dum|een|e p| ük|s j|set|ed |ng |bie|a ü|uri|s a|kin|ald|e r|t m|eri|i k| al|eel|lli|eta|dad|ule|elu|s p|i p|rii|hel| to|ndi|lse|als|iaa|sia|sot|rat|ara| kä| ve|and|umi| su|de |etu| vä|na | sü| ha|a m|e i|lit|lu |per|nud',
    snk: 'an | a |na | na|re |a n| su| ga|a k|ga | ka|a a|en |su | se|a s|ta |ma |e s| ta|ser|ere|ama| i |aan| ra|un |nta| ma|n s|do | ki| ja|a g|jam|ne |nan| do| nt|ana| da| ya|ane|wa |ŋa |n ŋ|ri |e k|u k|a d| ŋa|ndi|ni |ra |raa| ku|taq|maa| si| ba|a r|tan| ke|aaw| sa|ren|gan|and|a b| be|a i|awa|di |i s|oxo|aqu|oro|kit|me |lli| go|tta|ini|ya |a j|ari|a m| xa|iri|aar|oll|gol|a t|e m|i a|i k|xo |sir|n d|aax|lle|a y|be |on |baa|n g|ran|din|ara|u r|e d|u n|qu | so|axu|are|o a|a f|ke | wa| ko| an|man|xar|dan|kan|ron|sor|li |de |nu |fo | fo| no|kuu|n t|pa |nde|n k|i g|len| ña| du|n n|nme|aad|u b|ang|axa|e y| fa| mo|ppa|app|kap|o k|o s| fe|ell|a x|att|kat|ure|i x|xun|e n|aba|mox|ti |i t|n y|yan|enm|ada|n f| bo|n b|a ñ| yi|i m|u t| di|da |iti|qun|nga|u a|xu |itt| ha|le |i d|sel|i n| me|ill|e t|riy|o b|ro |u d|du |saa| re|dam|haa|ind|xa |n x|ono|i i|nen|lla| mu|ond| ro|o n|udo|uud|ant|aga|ku |la | wu|nma|eye| tu|edd|fed|nox|no |o d|uur|sar|gu |e g|kil|ñaa|ire| bi|inm|ken|e b|tey|ite|ira|yu |a w|ina|iin|yi | xo|n w|o t|taa|ka |u s|anŋ|uga|und|i r|ore|bur|i b|fan|iba|xib| xi|een|u m|ogu|bog|bag|oqu|noq|oor|e r|bir| ti|i j|ban|ye |dii|o m|anm|ene|kka| ye|ña |rey| le|iña|ita|mun|ura|kaf|ank|e i|liŋ| li',
    cjk: ' ku|a k|yi |nyi| ny|la | ci|a n|a c|wa |we | mu| ha|nga|i k|ga |ana|uli|kul|a m|esw|ela|ze |mwe| ka|ha |sa |tel|a h|swe|ung|ci |a u|ate|ma | wa|u m|kwa|han|e m|kut| mw|uci|mbu|mut|nji|nat|ya |uth|e k|na |pwa|kup|thu| ma|wes| ca|ji |kan| ya|lit|hu |i m|aku|asa|i n|mu | ul|ca |ang|e a|ina|anj|ali|imb|cip|amb|mba|i c|li |e n|i u|ka |muk|a i|awa|naw| na|fuc|ifu|uta|upw|ing|ize|ula|lin| xi|ukw|lim|ong| kw| an|ite|xim|ta |ita|umw|ulo|umu|has|kuh|kha|u c|ala|nge| mb|wo |ila| ce|cif|a a|kus|ama|tam|mwi|ili|te |imw|bu |o k| ng|ba |ipw|lo |bun|ikh|wik|ulu|mo |ufu| ak|o m|utu|ngu|imo|mil| mi|ko |a w|kun|ciz|i y|a y|kuk|eny|aze|aci|pwe|aka|o n|yum|uha|uka|e w|o y|lon|kum|e u|cim|ku |swa|e h|e c|mbi|emu|no |nal|a x|was|fun| un|uma| ja|usa| li|wil|uze| ye|o w|isa|o c|nda|ngi| es|kat|e y| in|aha|waz|yul|esa|yes|una|wen|aco|i h|cik|ema|pem|nyu|ika|kal|bi | ik|mah|zan|aso|so | uf|ata| iz|apw|tum|tal|o l|wam|iku|sak|ja | up|kwo|umb|oze|yoz|uni|ges|cen|kuz|wak|mul|wan|ulw|o u|cyu| cy|u i|e i|tan|mun| um|kuc|ngw|cin|co |go |ngo|da |ipe|ge |lem| uk| yo|lwi|nin|ikw|u k|kuf|uso|i w|upi|lum|gwe|uki|upu|and|pha|ces|ond|i j|man|ile|ule|uku|gik|akw|ino|ele| if|hac|tha|cil|eka|za |vul|uvu|hel|lu | it|ke |lya',
    ada: 'mi | e |nɛ | nɔ| nɛ|nɔ | he|he |ɔ n| a | ng|e n|a n|kɛ | kɛ|aa |ɛ e|blɔ| bl|i k|i n|gɛ |ngɛ|ɛ n|lɔ |e b| mi| ma| ko|ɛ h| ts|ko |ɛ a|e h| ni|hi |ɛɛ |ɔ k|a m|i h| ɔ |tsu|ma |ami|a k| ny|ɔ f|oo |loo|i a| be|ya |e m|be |ni | kp|o n| si|si |nya|emi|ɛ m|fɛɛ| fɛ|laa|a h|a b|e j|a t| hi|e k|umi| ka|kpa| je|ɔ h|e s| lo| ye|ɔ e|i t|pee|omi|mɛ | pe|mla|i m| wo|je | ha|ɔmi|ɔ m|maa|sum|ke |i b|o e|ɛ k|ɔ t|alo| ml|ee | sa|ɛ ɔ|ɔɔ |ha | na|lɛ | lɛ|a a|i l|ɔ́ |a s|ɛ s| hɛ| gb| su|nɔ́|e p| al|eɔ |ɛ b|ne |i s|ɛmi| fa|uaa|sua| bɔ|ɔ a| to| ji|o k|kaa|bɔ |a e|ihi|u n|e ɔ|o a|yem|ane|e w|suɔ|imi|e y| ke|ɛ y|ɛ t| hu|san| we| jɔ|ɔhi|lɔh|e e|ahi|i j| bu|ɛ j|pa | ja| ku|wom|ngɔ|a j|him| bi|ue |e a| ya|tom|ɔ b|gba|o m|jam|́ k|fa |ake|ɛ p|uu |ba |hla| hl|sa |ɔ s|hu |e f|hɛɛ|uɔ | tu|e t|ji |tsɔ|jɔm|i ɔ|kuu|kak|ɛ g|a l|wo | sɔ|tue|o h| gu|isi|ɔ y|sɛ |o b|sɔɔ|gɔ |ia | ju| kɔ|eem|e l|akp|pak|li |e g|sɔs|a p|uɛ | yi|ti |sis| sɛ|to |ɔ l|ɔ w|ɛ w|yɛm|na |hia| nu|ɔsɔ|ye | mɛ|sem|ase|kas|hiɔ|naa|íhi|níh| ní|kpe|usu|uam|onɛ|kon|nih|eeɔ|mah|o l|a w|lam|ɔɛ |sɔɛ| pu|hɛ | ba|gu |a g|a y|ɛti|pɛt|kpɛ|o s| fɔ|bi |nyu|o j|we |se |uo |suo|ade| ad|bua|su |ngm| fi|iɔ |u k|haa|oɔ |koj| am|ɔ ɔ|ɛpɛ|i p|i e|guɛ| wa|io |jio|bam|ɔ j|yo ',
    quy: 'chi|nch|hik|anc| ka|una|man|aq |pas|ana|kun|as |paq|nan|kan|ikp|cha|sqa|qa |ik |apa|aku|ech|kpa| de|cho|rec|ere|der|spa| ma|asq|am |an |taq|pa |nam| ru| ch|yoq|ta |na |a k|ina|mi |qan|ima| ll|aqa|lli|oyo|hoy|ant|ach|run|nap| im|pi |nak|hay|asp|ayn|wan|q k|ipa|nta|hin|oq |cio| hi|iw |liw|inc|ion|aci|chu|lla|pip|nas|npa|nin|qmi|kay|kas|ota|a m|anp| hu|all|nac| na|yna| ya|ari|api|i k|w r|nku|iku|in |a c|ama| pi|may|hu |kuy|ay |nma|has|onc|hon| ot| wa|aqm|anm|a p|n h|ata| li|ikm|hwa|chw|ma |awa|a d|qta|ara|pan|m d|pap|yku|yni|a l|kma|q l|ich|kin|huk|a r| ha|yan|uwa| ca|nqa|kta|ikt|q m|a i|n k|kpi|mun| sa|cas|usp|q h|wsa|aws|kaw|bre|ibr|lib|lin| al|k c| mu|ask|kus|a h|s l|ank|q d|yta|e k|tap|q c|mpa|pak|ski|qaq|ien|i c| qa|tin|re |nni|uch|isq|a s|was|ern|s m|a a|ayk|onn|s y|oqm|aqt|ruw|qpa|aqp|par|amp| am|nmi|ley| le|ayp|nat|i h|yma|onk|law|ier|map|a f|war|ita| ni|naq|yac|tar|naw|ayt|sak|n a|anq| pa|a q|aya|val| va|ypi|sti|ast|ura|n c|m p|s o|w n|rno|bie|obi|gob| go|rma|qar|nit|m i| ta|say|haw|s i|k l|asa|k h|rur|pun|wac|onm|tan| fa|tam|kap|oqt|i d|s c|ici| ju|a t|ras|ran|uy |uku| tu|qay|k k|ku |q i|arm|uk |a y|nti|awk|um |igu|esq|k m|sap|ati|aw |a o|asi|n p|sic|isp|aru|ukl|ten|pti|qku',
    rmn: 'aj | te|te |en | sa| le|el | si|si |aka|sar|pen|les|kaj|es |ipe|sav|qe |j t| ha| th|ja |hak| e |and| o |ave|i l|ar |ta |esq| an|a s|sqe| ma| ja|ia |nas| ta|imn|e t|as |mna|kas|e s|haj|tha|s s|ark|asq|e a|nd |i t|s h|rka| na| i | pe|mes|isa|vel|cia| bi|ne |bar|kan| aj| me|avo|utn|the|e k|lo |o s|est|qo |e p|n s|ard|hem|a a| av| so| ba| pr|õl |a t|mat|ima|l p|e r|e m|e o| ka|man|orr|e d| di|o t|rel|sqo|re | ov|ika| re|qi | ak|enq|ere|vor|e b|res|ove|avi|ve |ver|o a|n t|o m|akh|rak|rim|a p|no |ana| ra|sti|d o|len|aja|rre|but| va|sqi|ker|r s|de |ata|ren|ali|ara|ste|ti |e l|r t|vip| ke|na |i s|ang|àci|tim|nqe|kon| ph|n a|nip| de|j b|àlo|al | pa| bu|are|vi |dõl| ni|tar| ko|naś| pu|o k|n n|l a| po|śaj| śa|on |lim|er |ari|i a|ven|pe |śti|aśt|a l|o p|e n|dik|rdõ|nik|l s|tis|ast|tne|a m|a e|erd|ndi|ni |pes|rin|j s|e h|aba|rab|khe|tni|eme|uti|rip|uj |amu|ano|ćar|a j|ća |la |khl|l t|e z|do |o z|ri |mut|kri|alo|soc|i p|so |ran|del|kar|nuś|anu|pra|din|nge|nis|ută|rde|vo |muj|mam|i d|nća|enć|ate|uni| as|iko| zi|rdo|l o|j p|eri|emu|ane|i b|o j|oci|i r|a d|ing| je|iàl|e e|l l|ɵar| za|tes|ćha|pal| vi|l b|ɵe |l e|aća|one|kin|to |ziv|imi|a n|per|ter|ris| kr|s a| st|o b| ćh|a i|kla|da |nda|e j|ekh|jek',
    bin: 'e o|ne | ne|an |en |be | o |e e|wan|mwa|n n|vbe|mwe|emw|evb|na |omw|e n| em|in | na|ie |gha|n e| gh|re | om|wen|e a|ha | ke|e i|n o|gie|bo | vb|wee| kh|win| ir|vbo| ev|o n|gbe|he |hia|nmw|o r|a r|o k| no|ogi|nog|kev|tin|eti| et| mw|e u|mwi|a g|ra | ya|een|ee |a n|a o|ke | re| we|rri|ghe|ogh| og|a e|n k| a |ia |ya |o g|ien| uh| rr|ye |khi|ran|ira|ere|a m|a k|ian| ot|ro |n i|ovb|o m| ye|egb| ra|hi |de |kpa| eg| hi|n y|o e|hae| ok|a y|eke|mie| mi| gb|o y|ba |oto|rhi|n m| iw| ru| er|arr| ar|unm|rro| ov|e k|okp|aen|n a|hek|khe|nna|inn|ugi|hie|a u|ru |ae |to |wun|mwu|hun|otu|i k|i n|a v|nde|and| do| or|uem|rue|dom|n w|oba|iob|rio|e r|tu |ze |ehe|pa |e v| ma|aya|iru|iwi|ma | rh|un |uhu|yan|mo |gba|e y|o h| la|a i|rie|irr|ai |uhi|ho |u o|ren|yi | ni|egh|u e|u a| ug|ugh| al| iy|beh|aan|a d|n g|gho|ue |onm|ghi|anm|iko| ai|ene|i r|a a|aze| az|khu|i e|bi |vbi| i |yaa| yi| ek|hin|bie|on | ay|emo| od|aro|obo|e d|rov|o w|e g|ii |nii|se |kom| ow|ron|kha|o v| se|a s|rre| de|lug|alu|owa|wu |a w|aa |e w| bi|a b|n h|dia|fue|ifu| if|ebe| eb|ode|sa | os|nug|anu|wa |oo |gue|uwu| uw|ese|bug|vbu| en|n r| lo|n l|ugb|kug|la |uyi| uy|i v|o o|i g|rra|aku| ab| es|abe|aik|oro|enr| eh|eha|o a|a l|we |n u|i o|okh',
    gaa: 'mɔ | ni|ni |kɛ | ak|lɛ |ɛ a|ɛ m| mɔ|akɛ| ko| he|gbɛ|i a|ɛɛ | lɛ|ɔ n|ɛ e|ko |aa |bɛ |yɛ |i e| kɛ|ɔ k| yɛ|li |ɛ h| ml|egb|oo |fɛɛ| fɛ|shi|aŋ |heg|mli|ɔɔ |a a| es| gb|i n|loo|ɛ n|maŋ| ma|ɛ k|i k| nɔ|ɔ y|nɔ |ɔ f| al|he |esa| sh|alo| ek|ɔ m|ii |amɔ| eh| en|emɔ|ji |naa|bɔ |e n|fee|o a|oni|kon|o n|ee | hu|o e| bɔ|i m|hi | am|ɔ l|hu |tsu|umɔ|ɛi |aaa|na |nii|sum|sa |ɔmɔ|ena|i y|ɛji|nɛɛ| nɛ|ɛ g|baa|eem|ɔ e|a l|kwɛ|yɔɔ|eɔ |amɛ|tsɔ| sa|ana| ts|saa|kɛj|ɔ a|ehe|a m|toi|eli|yel|aji|i l| ah|mɛi| at|e e|gba|a n| an|ane|hiɛ| na|eko|eye| ey|o h|kom|mla| kr| ej| as|ŋ n|san| ay|i s|nit|ash|ekɛ|ha |e k|ne | hi|i h|ɛ t|esh|efe|iɔ |its|iaŋ|ku |o k|ats|kpa| kp|ome|gbɔ|ets| ab|ɔ b|ɛ b|ye | et|a e|shw|oko|a k| bɛ|ɔ h|ɛ y| af| ku|sɛ |tsɛ|ŋ h|uɔ |ŋŋ | to|ŋmɛ|ɛ s| mɛ|oi |mɔɔ|aye|hwe| ef|la |ehi|rok|kro| ji|ŋ k|o m|aka|akw|o y| lo|o s|jɛ | ny|e a|ŋmɔ| ba|bii|aan|ŋts|ɛŋt|iɛŋ|diɛ| di|ai |u k|o l|ŋ m| eb|ɔ s|aha|nyɔ|i j|a h|ɛ l|wɛ |usu| aw| ja|suɔ|eni|i f|agb| ag|bɔm|sem|bua|any|ɛ d|i b|maj|mɛb|a s|eŋm|awo|e b|afe|hik| yi|u e|e s|ish|nak|anɔ|hey|ŋ a|o g|jam|u m|o b|aŋm| yɔ|bɛi|yeɔ| su|nyɛ|hew|me |ɔ g|ɔse| ee|ilɛ|hil|ihi|hih|las|̃la|ãl|bã| ŋm|nyo|te |esu|kai|ate|ŋma|eee|ɛmɔ|ɛia| eg|alɛ|jia|ɔŋ |ala|wal|hiɔ|ɛ f|his',
    ndo: 'na |oku| na|wa |a o|a n| om| uu| ok|e o|ong|ka |uth|mba| ne|ntu|ba |tu |omu|nge|he |a u|the|uut|emb|hem|o o|o n|ehe|unt|e n|a w|nga|kal| wo| ke|ang| iy|lon|mun|no |lo |la |o i|ku | no|oka|keh|ulu|u n|we |shi|a m|ala|ko |ga |a k|ge |eng|nen|u k|ilo|osh|ngo|han|a y|elo|gwa|ngu|ye |li |ano|hil| mo|gul|ana|luk|a e|tha|dhi|uka| pa|lwa|go |ath|ho |man|kwa|ta |oma| sh|a p|wan|thi|uko| ko|wok| ta|ha |mwe|ya |wo |e p| yo|gel|a i|e m| os|nka|ika|uun|hi | ka|o g|sho|ema| li|kuk|iya|o w|i n|ith|and|men|ame|gam|ele|pan|opa|ash|ndj|po |hik|yom| po|le |ing|alo| el|olo|sha|kul|nok|ilw|kug|o k|a a|adh|aka|lat|aa |pam| ye|kan|iyo|mbo| we|kut|nin|e e|umb|onk|ndu| go|ike|ond|non|gan|omo|una|a s| e |mon| ga|ela|und|waa| ng|yok|ne |ulo|amw|oye| oy|aan|a l|iil|okw|eta| a |wen| ku|i k| gw|aku|igw|ila|a t| nd|ina|yuu|ene|ke | on| dh|iye|mo |pau|bo |him|lyo|o s|ula|wat|ota|yon|e t|eko|yaa|o e| me|a g|yop|e g|lun|alu|ngw|omb|ane| th|yi |o y| ii|nom|ili|dho|ono|mok|uga|vet|eho|ome|kun|iyu|i m|ali|epa| ni|lwe|opo|lok|oko|hok|i o|lol|djo|ung|oon|i t| yi|alw| ot|ukw|uuk|uki|egu|mii|o m| wu| mb|awa|naw|edh|ani|kat|nwa|enw|e k|taa|ont|a h|u t|lel|uni|ndo|wom| mw|she|ola|pwa|dyo|ndy|nem|ndi|yeh|aye|fut|nek|udh|omi'
  },
  Cyrillic: {
    rus: ' пр| и |рав| на|пра|ств|го |ени|во |ове| ка|на |ть | по|ия |о н| об|ет | в |сво| св|аво|ани|ост|ого|ый |ажд|лов|т п| им|ния| че| со|ело|име| не|льн|ли |чел|каж|ест|век|ать|ова|или| ра|ек |й ч|дый|жды| до|ие |еет|мее|но | ил|ии |ся |его|обо|и п|ние|к и| бы|и с|и и|ми |бод|воб|ван| за|ой |ых |ом |лен|аци|енн|о с|о п|ьно|тва|тво|при|ног|аль|ако|ва |и н|сти|ных|то |бра|олж|дол|сто|и в|ным|ое | ег|нов|их |ель|тел|ти |нос|не |пол|раз| вс|и о| ли|и р|ыть|быт|вле|ред|ию |тор| ос|ься|тьс|оди|щес|я и|как|про|жен|ым |пре|а с|сно|е д|нно|о и|ий | ко|о в| ни| де|сту|лжн|сов|е в|ном|оль|ран|оже|иче|ей |аст|нны| от|туп|м и|одн|зов|рес| мо|осу|ля |осн|а о|вен| то|о б|шен|тве|общ|а и|е м|ьны|обр|вер|чен|я н|жно|чес|ак |лич|нии|е и|все|бще|ват|есп|мож|й и|ное|о д|бес| во|я в|ду | ст|дно|она|нац|ден|ежд|х и| бе|и д|ны |дос|для| дл| та|льс|ате|ции|я п|ую |ите|е о|ной|под|ото|стр|ста| ме|ели| ре|я к|тоя|ами|ен |ь в|ю и|азо|гос|м п|ь п|т б|жет|уча|суд|ьст|дст|щит|ащи|защ|кон|нию|ам |оду|ере|гра|печ|о о|оро|кот|и к|тра|ник|уще|циа|оци|соц|нал|еск|о р|ког|дру| др|ни |ава|нст|ем |авн|ыми|едс|дин|дов| го| вы|в к|ые |обе|му |я е|слу|уда|так|кой|ту |иту|зак|ход|вол|раб|кто|икт|ичн|нич|от |ина| к |тер|род|нар',
    ukr: 'на | пр|пра| і |рав| на| по|ня |ння| за|ого|ти |во |го | ко|аво| ма|люд|о н| не| лю|юди|ожн|кож|льн|жна|дин|ати|ає |их |ина|пов|сво| св|анн|є п|має|або|а л| бу|не |енн|бо | аб|а м|ови|ні | ви| ос|аці|вин| та|без|обо| ві| як|ере| до|і п|ува|о п|аль|них|ом |ми |іль|ног|та |ий |при|ою |ть |ста| об|ван|инн|ті |ост| у |ся |ват|бут|ист| мо|езп|ути|нов|пер|ії |и п|бод|воб|ств| в |о в|від| бе|ако|під|тис|кон|но |ва |нні|і с|а п|сті| сп|ний|ду |ьно|она| ін|дно|ним|ій |а з|ну |мож|її | її|ля |соб|му |ої |яко| пе| ра|ід | де|і в|и і|чин|вно|ому|ном|у п|і н|а с| су|а о|нен|ися|ово|нан|одн|у в|і д|ава|ідн|рів| рі|і р|ими|віл|им |ції|о д|а в|сту|оду|буд|ова| пі| ні|я н|е п|нац|и с|нна| од| ро|нос|ьни|ють|и з|ки |і з|а б|спр|чен|же |оже|е м|овн|рим|е б|то |ніх|осо|удь|ві | ре| ст|рац|до | со|роз|лен|вни|івн|род| вс|спі|ков|зпе|ів |для| дл|ї о|хис|ахи|зах|‐як|ь‐я|дь‐|я і|так|зна|заб|сть|ту |ною|а н|тор|сно|о с|жен|ціа|оці|соц|інш|і м|кла|и в|тер| ді|іст|ові|у с|я в|аро|сі |віт|сві|осв|роб|піл|рес|за |печ|абе|ку |лив|ерж|дер|в і|авн|тав|ав |ами|ком|вле|о б|ь п| що|їх |тво|хто|іхт|ког| кр|ано|тан|іал|нал|нь |х п|жно|леж|але|про|тва|рат|о о|х в|нар|льс|цій|кор|час|ржа|ї с|ину|дст|о з|раз|мін|а р|зак',
    bos: ' пр| и |рав|на |ма |пра| на|има| св|а с|да |а п|во |је |ко |ако|о и| по|аво|е с|а и|ти | им| да| у |сва|но | за|о н|ва |и п|или|вак|ли | ко|не | ил|кој| не| др|ост| сл|ња |им |и с|у с|и и|ава|ије|а у| би|ств|се |вањ|а д|ом |јед|бод|обо|лоб|сло| се| ра|их |сти|а н|ње | об| је|при|дру|у и|ју |о д|ити|вој|раз|ање|ова|дје| ос|е и|ло |е п|ања|ује|и д|бра|тре| тр| су|у з|а к|ог |у п|оје|циј|реб|а о|а б| ње|и у|миј|ни |нос|ба |едн|сво|њег| из|про|е д|жав|бит| ни|и о|ста|а з|авн|вје| ка|бил|ово|а ј|ају|ист|и н|них|јел|ту |ред|гов| од|е о|оји| см|ја |о к|ило|аци|е у|пре|о п|еба|у о|су |вим|ичн| са| дј|а т|ија|шти|чно|ржа|држ|сту|дна|одн|ени|за |ива|ном|ем |ду |ран|вно|сми|јер|е б|е н|де |пос|м и| до|у д|нак|а р|обр| мо|ним|его| кр|тит|кри|ве |ан |ико|ник|ну |и м|ног|ено|сно|е к|туп|руг|ка |ода|рив|вољ|алн|м с|иту|ашт|заш|ани|сам| ст|акв|ови|осн|род|аро| ми|ји |тва|дно|нст|ак |ите|љу |вич|рад|у н|у м| та|дст|тив|нац|рим|кон|ку |њу |оду|жив|амо|тво|тељ|под|еђу|г п|нов|ина|нар| вј|и б|ој | ов|аве|ву |анс|оја|зов|азо|уде|буд| бу|е т|и в|ења|еди|ниц|нап|мје| ис|слу|едс|о о|зак|и к|м п|тно|иво|ере|нич|как|ада|вни|уги| ро|мов|вен|о с|то |те | вр| бе|ара|кла| бр|у б|у у|и т|она| он|ави|јал|дни| ск',
    srp: ' пр| и |рав|на |пра| на|ма | св|има|да |а п|во |ко |ти |аво| по|а и|ако|а с| за| у |о и| им|и п|ва |сва|вак| да|о н|е с|ост| ко|ња |ли |или|не |ом | не|а н| сл| ил|је | др|и с|но |кој|у с|ава| ра|ог |сло|ју |им |сти|бод|обо|лоб|ити|а о|ств|и у|а д|ни |јед|у п|при|едн| би|и и|а к|о д|ста|их |дру|а у| је|ања| ос| ни|нос|про|ају|и о| де| су|у и|се |ње |ја |ова|и д|циј| об|ује|ред|жав|е и|е п|а ј|дна| се| од|ве | ка|ени|ржа|држ|а з|авн|ења|аци|вој|ово|у у|м и|оја|вањ| из|ија|у з|ање|ран|е о|род|и н|е б|раз|за | ње|гов|ичн| ст|нов|сно|осн|ду |пре| тр|су |ву |одн|а б|сво|њег|ним|них|ту |тит|шти|ку |ном|бит|е д|ме |ико|чно|оји|ло |вно|ник|ика|без|ара|де |у о|вим|нак| са|рив|аве|ан |вољ| кр|о п|сме|е к|ног|ји | ов|е у|тва|бра|руг|реб|тре|у д|ода| мо| вр|ављ|у н|его|дел|м с|кри|о к|ашт|заш|њу | см|ани| ли|дно|еђу|алн|ла |акв|ој |ком|сту|уги|ави|а р|ка |рад|оди|вич|тав|иту|уде|буд| бу|пот|оду|жив|ере|тво|ило|бил|аро|е н|ови|пор|ено|штв|нац|ове|м п|туп|пос|рем|дни|ба |нст|а т|оју|аст|ива|е м|вре|вља|ну |беђ|ист|ен |те |дст|рот|зак|ао |као|и к|јућ|о с|ст |сам|м н|тер|нар| ме|и м|кол|е р|ушт|руш|вер|как| бе|и б|кла|ада|еба|ена|она| он|тву|анс| до|рак|слу|и в|ниц|у к|мен|врш|еме|едс|иви|о о|јав',
    uzn: 'ан |лар|га |ир | би|ар | ва|да |ига| ҳу|ва |бир|уқу|қуқ|ҳуқ| ҳа|р б|ган|иш |ида| та|а э|ини|ади|нг |дир|иши|лик|лиш|ий |или|ари|уқи|ҳар|лан|инг|ши |дан|нин|инс|кин|сон|нсо| ин| му|қиг| ма|он |р и| бў|эга| эг| ўз|ни |бўл|гад|и б|ки |ила|ёки| ёк|а б|н б|ин |р ҳ|ала|эрк| эр|лга| қа|рки|ш ҳ|и ҳ|н м| бо| ба|ик |ара|иги|лиг|ри |қил|а т|бил| эт|ниш|нли|кла|и в|бош|эти|ани|им |и м|оли|қла|а ҳ|лаш|атл|тил|а қ| ол|оси|мас|қар|инл|лат| қи|таъ|ҳам|ги |иб |мла|ўз |н э|мум| да| бу|ат |ш в|ун |ати|мки|умк|тла|иро|ўли|бар|ири|риш|ият|али| бе| қо|а ш|аро| ке|и т|рла| те|ча |рча|арч|а ў| шу|тиш|н ҳ|тга| са|аси| ха|рак|лин|ола|имо|шқа|ли | ту|амл|лла|сид|н ў| ас|нид|а и| ки|н т|нда|к б|ера|ошқ|сиз|ор |а м|р в|енг|тен|мат|мда|амд|лим|й т|ят |и а|ино|илг| то|тни|ана|ас |эма| эм|а ё| ша|аш |а а|тар|кат|ака|ак | де|аза|илл|сий| си| со|уқл|н қ|ода|ъли|аъл|ник|ада| ни|тда|гин|уни|сит|ай |қон|н о| жа|ким|еч |ҳеч| ҳе|ўзи|лак|кер|икл|лли|ур |зар|шла|риг|ирл|дам|коҳ|ико|а д|ам |н в|рти|тиб|тал| иш|чун|учу| уч|сла|а у|рин|сос|асо| ун|на | ка|муҳ|диг|ч к|асл|лма|ра |бу |хал|ўлг|и к|екл|р д|қат|ага|и қ|оий|мил| ми|қа |и с|жин| жи|син|рор|а в|лад|а о|тли|мия|н и|аб |тир|з м|дав|рга|аги|а к|нла|ақт|вақ|арт|аёт|лаб',
    azj: ' вә|вә |әр |ир | һә| би| һү| ол|үгу|һүг|гуг|на |ин |лар|һәр|дә | шә|бир|ләр|лик|мал|р б|лма|р һ| тә|әхс|шәх|ән |дир|угу|уна|ан |али|а м| ма|икд|ини|р ш|дән|ар |илә|гун|аг |асы| ја|мәк|јәт| мә| мү|кди|әси|әк |илм|нин|ндә|олм|әти|ә ј|син|хс |нда|лмә|јјә|и в| га| аз|олу|ијј|ја |инд|зад|гла|үн |ни |лә |тин|н м|аза|ары|әт |н т|маг|лун|лыг|ә б|ун |нун|г в|н һ|дан|ын | ет|тмә|әрә| өз|да |ә в| он|ә а|ына|ыны|бил|а б|сы |ил |әми|ара|си | ди|ә м|әри|рлә| ва|ә һ|етм|ығы|ама|длы|адл|рин|бәр|рын|н и|мүд|нын| һе|мас|ик |н а|дил|алы|ирл|әлә|үда|сын|ынд|хси|ли |ә д|нә | бә|әја| ин|ә и|ләт| сә|ны | иш|аны|еч |һеч|г һ|ејн|ә е|дыр| да|аси|ры |иш |ифа|лығ|и с|фиә|афи|даф| ед|мәз|у в|кил| һа|ола|н в|әни|ыр |уг |унм| бу| ас|сиа|оси|сос|или|ыды|лыд|нма|ыг |инә|әра|сил|хил|ахи|дах|адә|ман|а һ|ә о|ону|а г|әз | ки|сеч| се|ы һ|мин|лан|әдә|бу |раг|лы |ылы|ал |ә г|р в|нла|һси|әһс|тәһ|өз |ист| ис|мәс| әс|ина|ә т|әтл|а в|иә |н б|тәр| та| ҹә|еди|ала|ким|гу |и т|улм|мәһ|н о|аја|ы о|иал| со|илл|сиј| дә|вар|инс|ми |ғы |ник|р и|агл|к һ|тәм|там|чүн|үчү| үч|ғын|сас|әса|з һ|әмә|зам| за|сти|рәф|н е|р а|илд|һәм|ыгл|јан|мај|н ә|мән|мил| ми|әги|дин|н д|түн| дө|миј|каһ|ика| ни|фад|тиф|л о|сәр|јни| еј|ана|лән|ам |рил|ајә|ашы',
    koi: 'ны |ӧн | бы|да | пр|лӧн|рав| мо|пра| да|быд| ве|орт|лӧ |ӧй |мор|ӧм |аво| не|во |ыд |ыс |нӧй|ын |м п|д м|ыны|тны| ас|тӧм|льн| эм|вер|сь |ьнӧ|эм |н э|тлӧ| кы|сӧ | по|ерм|сьӧ|ртл|аль| кӧ|эз | ӧт|ӧ в|то |ето|нет|ылӧ| ко|тшӧ| от| и |ы с|бы |ӧ б|ств|кӧр| вӧ|шӧм|кыт|та |на |з в| се| до|вол|ӧс | сы|ы а|ола|рмӧ|ас |оз | оз| сі|а с|тво|с о| вы|ліс|ӧ к|ытш|ӧ д|ис |ісь|ӧтн|ась| ол| на|аци| эт|а в|злӧ|сет| во| чу|лас|лан|мӧ |тыс|рты|ӧрт|ы п|ӧтл|о с|эта|дз |кӧт|ӧдн|вны| мы|н н|удж| уд|выл|ӧ м|рті|орй|ись| со|воэ|ыдӧ|й о|кол| го|с с|сси|сыл|ысл|йын|кин|олӧ|тӧн| сь|ана|ӧр |ция|а д|ӧмӧ| ви|з к| эз|ы б|тӧг|ӧт |мӧд|ест|ост|ӧны|тир|оти|укӧ|чук|н п|онд|пон|слӧ|кер| ке| об|сис|суд|а н|дор|кон|нек|н б|лӧт|с в|ті |ьӧр|тра| ст|нал|она|нац|н к|кӧд|ӧг |скӧ|ть |етӧ|дӧс|быт|рны|ӧ н|тсӧ|рре|а б|нда|с д|асс|ы к|асл| ло|ьны|сьн|ы м|еки|ы д| мӧ|ь м|ы н|ытӧ| ме|рйӧ|иал|й д|итӧ|а к|ӧсь|мӧс|овн|зын|а п|отс| ли|оля|ӧ а|осу|ӧя |нӧя|езл|рез|мед|с м| сэ|ь к|рйы|ако|зак| за|ьын|ннё|мӧл|умӧ| ум|ы у|н в|м д|н с| дз|н о|ран|стр|озь|поз|з п|о д|циа|оци|соц|ион|а м|еск|чес|нӧ |з д|тсь|бӧр| бӧ| ов|вес|кыд|ӧ с|воы|код|тко|ӧтк|оль|дбы|едб|сьы|чын|тчы|ӧтч|тла|мӧн|сла|йӧз| йӧ|т в|ы и|ез |о в|оны|йӧ |анн|ӧль| пы|ан |нӧс|нит| су|м с',
    bel: ' пр|пра| і |ава|на |рав| на| па|ны |ва |або|ць | аб|ае | ма|аве|анн|ацы|сва| св|е п|льн| ча|не |ння|ала|а н|ай |лав|чал| ко| ад| не|га |ожн|кож|век|ня | як|жны|ы ч|мае|а п|ага|бо |ек |а а|ца |цца| ў | за|ых |пав|а с|го |він|дна|бод|мі |ваб|ван|ам | вы| са| да|ста|аві|нне|асц|най|цыя|наг|ара|і н|к м|яго| яг|ьна|пры|аць|і п|одн|ств|ама|ных| бы|тва|дзе|аль| ра|ні |і с|і а|ыць|а б|енн|лен|ці |оўн|ым |рац|інн|іх | ас| та|то |нас|які| дз|чын|оль|і д|аво|ад | ні|сці|ымі|ным|быц|я п|ьны|ыя |аро|ана|іна|і і|рад| гр|ля |ўле|о п|а ў|рым|пад|ыі | ін|амі|дзя|рам|цыі|аба|а і|ду |жна|ўна|нал|нац|ры |эта|гэт| гэ|нен|да |ах |гра|кац|ука|а з|кі |адс|ў і|нст|энн|я а|нні|оду|а р|нна|ход|нан|пер|х п| у |адз|і р|мад|м п|е м|аду|дст|для| дл|оў |нае|і м|ако| ка|ы ў|бар|е а|ацц|ую |ыцц|сам|яўл|але|род|раб| пе|што| ўс|адн| су|роў| ро|дук|люб|ь с| шл|раз|нав|зна|вол|удз|ада|жыц|чна|ве |а т|асн|сац|ера| рэ|яко|кла|аны| шт|ь у|аюц|нар| ус|соб|асо|пам|я ў|авя|чэн|воў|так|ну |ю а|ь п|зак|кар|е і|ь а|бес|ія |кія|х і|заб|аса|ім |жав|і з|леж|тан|ахо|яль|ыял|о с|яна|кан|ака|інш|алі|вы | мо|нах|я я|м н|ога| бе|й д|о а| ст|ены|і ў|а д|есп|шлю|цця|ы і|ыст|рыс|люч|клю|тац|уль|ынс|ачы|спр| сп|аў |ыма|ары|кам|е ў|і к|кон',
    bul: ' на|на | пр|то | и |рав|да | да|пра|ств|ва |а с|а п|во |но |ите|та |о и|ени| за|не | не| вс|ван|аво|а н|ото|е н|о н|а и|ки |ие |те |ни |има| им|ли |или|ия | по|ове|ане|чов|ма | чо|и ч|а д|ние|ани|и д|ест| ил|век|все| об|ек |еки|сек|ава|тво|сво| св|вот|а в|и с|ост| ра|ова|а о|е и|ват|и н|е п|к и|а б| в |и п|лно|о д| се| бъ|при|раз|ето|ъде|бъд|ата| ко| тр| ос|аци| съ|бод|обо|воб|ат |за |тел| е |о с|де |о п|ен |и в| от|се |ния|ран|алн| де|бра|его|нег| из|от |ята|как|оди|е с|и и|ден|пре|бва|ябв|ряб|тря|нит| ка|ява|про|ст |а з|гов|вен|тве|о о|а р|акв|о в|и з|ред|нос|ият|е д|щес|нов| ни|ция| до|йст|о т|е т|ржа|ърж|дър|ено|пол| с |обр|тва|нот|рес|ейс|и о|е в|кой|общ|лен|она|нац|иче|ез |без| бе|ежд|ува|вит|ри |зак|и к| ли|а е|под|ели|ник|си |е о|а т|и р|т с|ка |оет|елн|нен|ой |гра|жен|дру| ре|а к|сно|осн|лич|зи | та|са |нст|авн|чки|ичк|сич|вси|люч|клю|дно| мо|еме|тъп|а у|изв|тви|дей|я н|кри|ато|о р|й н|ико|ичн|жав| дъ| то|бще| со|лит|т н| си|т и|вни|одн|жда|зов|азо|уча| гр|кое|стъ|вол|лни|сре| ср|ква|кон|тно|ака|и у|ко |ган|ода|чен|лст|елс|стр| къ|ста|род|нар|и м|иал|нал|руг| др|чес|ди | са| те|сто|дос|раж|рез|чре|гат|еоб|а м|о е|ине|аст|ово|чно|аве|му | му|ано|ита|ими|ако|нак|лаг|ови|ан ',
    kaz: 'не | құ|ен |ұқы| ба| қа|құқ|ық |ға | жә|әне|жән| не| бо|де |дам|ада|а қ|тар|ына| ад|ылы| әр|ың |ан |ін |қыл|ар |еме|на |р а|лық|уға|ала|ықт| өз|мес|әр | жа|мен|ығы|лы | де|қта|ның|н қ|ған|іне|бас|ары| ме| қо|еке|ын |да |е қ|ды |асы|се |есе|ам |бол|анд|нем| бі|ара|ы б|ста|тан|нды|н б|ің |е б|ілі|тиі| ти|бар|ғы |нде|етт|иіс|қығ|іс |лар|ге |ы т|інд|ік |бір| бе| ке|алу|е а|алы|луы|а ж|ері|олы| те|қық|н к| та|н ж|ғын|тті|іні|тын| ер|нда|ім | са|е ж|аты| ар|рға|еті|ана|ы ә|уын|лға|өзі|ост|егі|тік|қа |сқа|рын|кін|луғ|ң қ|нің|уы |бос|асқ|қар|дық|нан|мыс|мны|амн|ы м|айд|ке | же|зін|рде|рін|е т|ген|ып |ры |ті |сын|қам|ден|і б|гіз|рал|е ө|лан|сы |ама|тта|тық|бер|ді |біл|ркі|өз |зде|кет|қор|дай|уге|ы е|ынд|нег|оны|ей |мет|аны|а т|жас|ауы|лге|аса|еге|дар|ру |ау |ерк|ы ж|рыл| то|н н|е н|тін|ір |сіз|тер|лма|і т|кім| ал|р м|лік| мү|е м|түр| тү|кел|лып|ең |тең|рлы|лім|рды|ард|атт|с б|ыры|сыз|ыс |елг|дал|йда|орғ|рқы|арқ| жү|тал|ылм|а б|ігі|лде|із |қты| еш|дей|ай |жағ|кті|ікт|гін| әл|тты|ұлт| ұл|е д|ыны|лін|р б|еле|кұқ| кұ|амд|м б| ет|оға|құр| кө|аға|тол|шін|айы| қы|қал|жек|і н|ес |ағы|е о|елі| ел|н е|зі |шкі|ешк|олу|ция|мас|ғда|ағд|лтт|імд|ным| да|а д|әсі|с ә|қат|ірі| со|ң б|аза|мда|айл| ас|ғам|қоғ',
    tat: ' һә|лар|га |кук|оку|хок| хо|әм |рга|һәм| ке| бе|ар |еше|әр |ан |кеш|ләр|гә | ба|ең |нең| бу|кла|ргә|ырг|һәр| ти| то|р к|да |ене|бер|ән |дә | үз|а т|тор|ен | ка|нә | ал|ы б|на |ган|ара|ире|бул| дә|бар|енә|укл|тие|а х| ит|иеш|ары|кы |ка |ә т|н б|укы| ир|екл|еле|ына|ше |ала|н т|лык|ле |шен|еш |кар|лы |лан|лән|рын|ә к|елә|ерг|нда|рек|тел|ез |ите|а к|бел| та|лыр|ә б|ын | га|ел |сә | як|алы|әрг|а б|яис| яи|тә |дан|а а|үз |ә х|ш т|е б|ынд|сез|клә|исә|р б|улы| эш|чен|а һ|ем | са|н и|шка|тен|үзе|ы һ|әт |ять|гез|иге|аны|ә һ|орм| тү| ха| тә| ни|р һ| ту|мәт|кле|үлә|лу |ть |м а|лга|штә| ки|м и| мә|не |лек|мыш|рмы|гел|түг|лер|ди |зен|уга|сен|гән|акы|клы|ләт|алу|ны |ешт|веш|әве|рәв| рә|тәр|рлә|үге|а я|ль |рен|баш|ә д|ә и|илл|ер |р а|циа|оци|соц|айл|рдә| аш|рак|рда|ард|рне|әрн|якл|лә | җә|н м|ың |ның|кка|әре|орг|тан|мас|сын|нди|инд|нин|рел| би|ык |лем|аль|ни |ин |кер|м т|әүл|шла|н я|тын|ндә| оч|бу |кон|а д|арт|кем|рке|ылы|кта|кә | ил|р и|ерә| җи|ң т|ция|а и|ашк| сә| ди|асы|ый |мил| ми| мө|та |л һ|нна|гын|иал| со|змә|езм|хез| хе|ыят|гыя|мгы|шыр|ә я|ерл|нлы|ере| кы|ек |уры|тыр|н х|елү|ако|зак| за|итә| да|чар|ныр| ко| ан|иле|әсе|ыш |аци| де|аер| ае|ану|ина|ә с| тө|әте|ана|н һ|бир|нан|ры |йла|ә а|әлә',
    tuk: ' би| ве|ве |да |лар|ир |бир| хе|ада|р б| ха|ер | ад|га |или|дыр|дам|ен |ыр |ара|ары|хер|лан|р а|ыды|р х|ам |кла|ага|ала|нда|бил|хак|клы|акл|лыд|лы | бо| өз|ың |ан |‐да|лен|ыны|маг|не |лер|ин |я‐д| я‐|ине|на | эд|а х|ына|ынд|дан|уку|хук| ху|ны |лма|е х|иле|ери| де|ге |иң |ли |атл|алы|ар |ден|ере| ба|дил|лиг| га|асы|лик|лыг|а г|кин|бол|кук|өз |е а|ама|де |эрк|рын| эр| хи|ини|гын|иги|айы|а д| ма|мак|п б|аны|эди|ни |ыгы|баш|лык|йда|рки|әге|ети|ич |хич| та|ак |шга|ашг|сын|мал| до|гда|ы б|ры |ги |мәг| җе|ыет|сас|эса| эс|лме|илм|мез|ип |ыкл|тлы|н э|дак|дай|ягд| яг|укл|хем|гал|ы в|чин|им |мек|рил|ян |рин| се|ал |ән |йән|ның|а б|дир|ола| ка|нде|ы д|сы |лин|е д|гин|зат|а в|екл|кы |акы|н м|кан|ылы| са| дә|хал|дол|чил| гө|тме| ге|н х|а а|айд|дең| ал|лет| дө| иш|н г|е б|уң | гу|дәл| го|ири|ик | он|ң д|сер|лип|ели| со|илл| ди|аза| аз|гар|и в|лим|ник|е в|еле|нли|үчи| үч|нме|з х|рап|тар|нуң|ону|мел|е г|кда|сиз|кле|ыз |сыз|ниң|дал|а я|циа|оци|соц|а с|мил| ми|кли|олм|и б| бе|н б|ра | дү|ең |еси|этм| эт|ы ө|ика| ни| ар|е м|дөв|ет |к э|тал|н а|гы |ез |инм|ып |олы|ора|гор|ч б|нун|ану|м х|алм|лйә| ки|ек |н я|анд|үни|рет|тла|гат|айл|ция|н д|ң х| ме|гые|мгы|емг|җем|ете|аха|мах|тле|тиң|а э|ң э|лам|пла|н в',
    tgk: 'ар | ҳа| ба|ад | да| ва|он | та|ва | ин|ба | до|дар|ти |аро|дор| ки|ои | як|д ҳ| бо|бар|ҳар|як |ора|ки | на|нсо|инс| ма|сон|и м|р я|и о|ҳақ|рад|аи |к и|уқу|ард|и ҳ|қ д|ин |ни | му| аз|ии | ҳу| ша|аз |ҳои|ақ |яд |она| ка|и д| ё |и б|ояд|дан|анд|қуқ|ҳуқ|зод|озо| оз|ият|д б|а б|нд |да |ди |н б|амо| ху|уда|оди|гар|дон|и и|ат |моя|нам|и с|ст |ҳам|н ҳ|рда|худ|ан |боя|ода|ава|и т|оша|бош|қи |и х|а ш|аст|ӣ в|мил| ди| он| ме|шав|они|е к|ила|шад|имо|и н|оба|оми|кор|д к|кар|рои|ри |вад|уд |ро |ӣ ё|оти| бе|ани|яти|таҳ|мин|н д|ят |та |на |ати|оси|бо |и а|роб|а ҳ|таъ|и ҷ|а м|д а|р к|и ӯ|а в|лат|ист| фа|и к|шуд|р ҳ| ас|ида|ига| со|а д|ара|иҳо|д в|одо|н м|т б| ӯ |т ҳ|ама|тар|ор |фи | са|вар| шу|лӣ | ми|ли |рон|диг|ҳо |и ш|дав|бот| ҳи|иро|уна| ни|кас|еҷ |а т|або| ақ|нҳо|раф|мон|н в|авр|ино| ко| су| ҷа|оҳ | ҳе|д т|маҳ|сти|сар|а о|д д|диҳ|р а|уни|р б|уқ |а а|ми | во|н и|р в|тав|ори|н н|мум|ари|яи |ояи| қо| эъ|ҳеҷ|рии|дӣ |рдо|оли| ис|уди|р д|асо|фар|киш|ӣ ҳ|наи|даа|лом| иҷ|ран|ахс|шта|р м|ӣ б|ита|сит|вос|у о|о д|аҳр|нти|инт|ифо|тиф|ибо|тҳо|қу |а к|ир |рра|рат|ҳим|ону|қон|зди|ун |офи|и қ|нда|ла | гу|наб|гон|а н|қар|оят|шва|ишв|лал|ия |мия|ами|тим|ҷти|иҷт|сӣ | за|ошт|янд|оян|атҳ|а и|аъл|ник|ққи|аққ|ихо',
    kir: ' жа|на |ана| би|жан|бир|уку|га | ук|ар |уу | ка|кук|укт|луу|ууг|тар|уга| ад|ан |ен |ык | ар|ада|ир |дам|олу|ган| бо|ам |р б| же| ме|туу|ын |ара|бол|мен|кту| ба|анд|нен|ене|ары|ына|р а|нда|н к|ин |үн |н б| өз|эрк| ко|а ж| ал| эр|да |кта|же | та|аны|а т|рки|а у|дык|ард|а к|кин|инд|иш |тий| ти|ийи|н ж|үү |гө |н а|ала|н э|алы|ук |или|н т|йиш|кыл|лар|рды|алу|нди|тер| ма|үгө|у а|кар|нын| кы|а а|баш|бар|лга|им |ун | эм| ээ|лык| ту|а б|а э| ан|нан|өз |тур|рүү|дай|алд|улу| са|рын|дар|тта|үүг|етт|рга| ки|кан|иги|н у|күн|ка |нды|у б| бе|м а|үчү|мес|эме|ры |дик|р м|ушу| мү| со|к ж|тук|үнө|не |ине|алг|кам|түү|үнү|эч |еке|ке |ес | эч|өзү|гин|икт|еги|лды|ө ж|ери|к м|уп |лим|бил|атт|кет|у м|чүн|тал|угу| ке|руу|к т|лук|ч к|е к|ээ |кте|у ж| де|ул | не|шка|дин| ди| тү|мда|амд|гон| иш|ы м|кал|к к| то|кор|рде|ыз |сыз|рго|орг|ай |уну| эл|е а|нүн|айд|зүн|ыгы|ге |ция|раб|ыкт|гиз|нег|ашк|ылу|е б|рин| те|ик |он |мкү|ү ж|ү ү|оо |н м|нуу|тык|ашт|уна|ей |дей|ирд|абы| мы|м ө|ерд|лоо|мсы|н н|ект|дыр|диг|акт|мак|ага|е э|лан|аци|тан|айы|циа|оци|соц|иле|рал|ынд|де |коо|ник|аты| өл|лго|олг|рди|амс|үмк|мүм|өсү|мду|н и|ш ж| үч|шты|гун|зги|бер|өн | бу|бын|сал|ким|у э|н с|өнү|ктө|а ө|дыг|ды |з к| кө|дан|ылы|рма| ай|иал',
    mkd: ' на|на | пр| и |во | се|рав|пра|та |а с| не|то |да | да|а п|ува|ите|те |о н|ва |а н|ој |кој|и с|но |а и|ата|аво| им|еко|ма | за| со|ств|ни |има|от |ње | во| по|ли |ја |а д|ост|сек|е н|ова|се |или| ил|о с|е п|а о|ање|и п| сл|ат |е и|вањ|ија|о д|ото|ен |о и|сло|ред|и д|обо|при| од|бод|лоб|ј и|и н|вот|ста|ст |и и|его|нег| би|а в|нос| ра| ќе|гов|пре| ни| ко|т и| об|е с|ава|акв|ќе |бид| де| др|со |тво|ват|ако|аци|што|раз|едн|аат|про|бра|иде|ани|а з|а б|как|циј|ест|де | е |а е| шт| ка|е б|одн|од |и о|нит|т с|ј н|ран|е д|и з|ено|ди |кон|ени| ед| си|еме|сно|осн| ос|тит|ови|јат|о п|вен|лно|алн| ја|ед |дру|ваа|сто|дна|за |нот|дно|е о| до|ви |ове|еди|држ|о в|ние|нов|чно|ник|жив|ето|а к|иот| ст|нац|ели|вни|д н|без|ара|о о|и в|т н|руг|ден|дни|сит|обр|а р|луч|а г| вр|не |пор|шти|ичн|чув|ка |авн|тве|ко | бе| оп|бот|або|раб|а м|цел| це|тен|ело|олн|дел|нув|е в|ита|ашт|заш|кри|род|нио|т п|зем|ема|нем|оја|ез |им | ов|оди|пшт|опш|он |ие |нст|нак|аѓа|ште|чов| чо|ван|зов|азо|кот|слу|жав|ржа| из|о к|рем|ист|ење|вол|оре|ги |н и| то|ти |ико|ода| жи|лас|аро| ме| зе|ло |бед|лит| ре|ипа|рип|еде|о ќ|ово| мо|нап|т д|вре|јст|ејс|ора|иви|рив|ри |зво|век|лни|кво|вно| сп|о е|ква|н н|жен|дат|нет|ине|иво|под|али|ика',
    khk: ' эр|эрх| хү|н б|эй |тэй|х э| бо|ах | бү|ний|ан |ийг|йн |хүн|бол| ба|эн |оло|ийн|уул|й х| ха|бүр|эх |бай| бу|гаа|рхт|хтэ|гүй|рх |үр |үн |аар|йг |ар |лах|он | хэ|ий |аа | за|н х|й б| ор|өлө|лэх|үй |лөө|ула| ху|ын |үнд|эл |эр | ул| ч | ёс|н э| ни|лон|хий| ту|р х|өөр| гэ|сан|чөл| чө|улс| үн|гээ|оро|ны |н т|юу |уюу|бую| ша|хан|эд |ох |ээ |нь | нь| тэ|сэн|н а|р э|ай |л х|хам|лаг| то|х ё| эд|ндэ|лга| тө|рол|ж б| ал|үлэ|х б|лий| хө|ол |л б|лс |эг |ээр|йгэ|ава|тай|гэм|гуу|д х|бус| өө|өтэ|өөт|төр|ыг |лго|луу|хуу|үүл|нд |хэн|сон|дэс| ял|лд |алд|хар|гий| нэ|лов|г б|рэг|эрэ|үйл|аал|н з|г х|х т|эни| ам|рла|гэр|үни|ой |той|ал | га|ад |рий|аан|й а| аж|вср| зо|ура|лла| ав| хи|эдэ|дсэ| үй|мга|амг|йх |айх|ч б| ол|рга|өрө|эс |ага| са|н д|оо |ана|ин |аг |н н|овс| со|олц|эгт|дэл|али|гөө|тэг|хээ|хэр|вах|арл|үү |хүү|лаа| дэ|с о| тү|мий|йгм| шү|н ш|арг|р ч|өр |аса|дил|ади| ад| мэ|сро| би|а х|илг|раа|й т|хүр| та|өх |ард|дээ|лох|лан|ваа|ива|лив|алу|тгэ|ори|лын| да| яв|л н|үрэ|айг|д б|огт|тог|айл|өри|аши|ялг|мар|лал|гла| эн|н ү|рон| хо|н г|н у|айд|х ч|длэ|р т|ата|бие|анг|й э|нэг| су|лцо|бүл|лж |д н|лөх|дах|рхи|лэл|г ү| ду|гох|тоо|эрг|олг|ас |эж |йлд|х а|гш |эгш|ули| ши|х ш|г н|игл|сгү|ёсг|дар|х х|амь|р а|о х',
    kbd: 'гъэ|ыгъ| къ| ху|ыху|ныг| зы|ну |хуи|эм |ъэ |хуэ| и |уит|тын|гъу|э з|къы|эхэ|ӏых|э и|эр | зэ|ъэр|ым |хьэ|ъуэ|цӏы| цӏ|эху|ыны|иты|зы |нэ |хэм|агъ|уэ |къэ|эну| дэ|эу |эгъ|м и|энэ|хъу|эщ |рал|тхэ|этх|эра|хэн|дэт|м х|игъ|э х|ӏэ |щхь|ы ц|ыну|эны|у х| хэ|у з| гъ|зэх|кӏэ|ъэх|ум |хум|іэ |эдэ|рэ | ик|ъун| щы|щӏэ|уэд|и х|уэн|э к|хэт|уэф|иіэ| иі|хэр|э щ| е |ми |лъы|экӏ|іэщ|эти|ти |хуа|м к|эры|у д|щіэ|къу|р з|зэр|мрэ|экі|кіэ|ъым|уну| хъ|ӏи |ауэ| нэ|ъэм|лъэ|эмр|э г|уэх|езы|ншэ|ъэп|зых|алъ|у к|ащэ|фащ|кӏи|икӏ|ъых|укъ|алы|ал |у и|бзэ|ъэщ| мы|эфа| пс|іуэ|абз| ха|ӏуэ| гу| лъ|зым| щӏ| щх|псо|умэ|ъум|хаб|нук|иӏэ| иӏ|щыт|ӏэщ| я |ри |ху | ез|риг|и к|м щ|у щ|и ц|лым|шэу|ъыщ|ыхэ|эпэ|эщӏ|щэх|ыхь|эн |хъэ| ун|ъэк|ъэж|ъыт|м е|уу |эпс|щӏы|у п|сэн|мал|ама| ам|пхъ| щі|щіа|мэн|эхъ|ьэ |эжы|ылъ|э е|эщх|іых|ціы| ці|м з|ту |ьэх|эсэ|ьэн|апщ|эри|жьэ|ъэз|ъэу|дэ |пщӏ|псэ|и н|ынш|жын|уэщ|нэг|ьэп|н х|ъуа|ыкӏ|хур|лъх|дэу|э я|ъэс|псы|э п|эты|э д| ир|р и|эщі|нэх|зэг|ызэ|и л|и и|ней|уне|ыт | зи|уна|энш|хэг|гуп|ыщы|хуе|ыр |иту|и щ|сом|сэх|эзэ|ыкъ|эгу| те|апх|къе| за|лхэ|алх|и д|э л|и у|уэт|ам |мы |ын |и з|эжь|жьы|щ е|уэм|м д|зэ |ъэг|егъ| іу|щ з|л х|бгъ|ытэ| пщ|наг|р щ|сэу|м я|кэ |т х|имы|оми|э а|эмы|тэн|мыл|хэк|у е|хуб|уиг|уей'
  },
  Arabic: {
    arb: ' ال|ية |في | في|الح| أو|أو | وا|وال|حق |ة ا|لحق|الت|كل |الم|لكل| لك|لى |ق ف|ته |و ا|ة و|شخص|ة ل|ات |الأ|ي أ|ون | شخ|م ا|أي | أي|ان |أن |مة |ي ا|الا|لا |ها |اء | أن| عل|خص |ن ا| لل|د ا|من |فرد|ما |الع|ت ا|حري|على|ل ف|رد |ل ش| لا|رية| إل|ة أ|ا ا|ن ي| ول|ا ل|ا ي| فر| من|ة م|الق|جتم|ن أ|ق ا|الإ| حر|له |ه ل|اية|لك |ه ا| دو|دة |اً |ين |ه و|لة |ي ح| عن|ماع|ي ت|ذا | حق|قوق|حقو|، و|ن ت|مع |ص ا|ام |د أ| كا|هذا|الو| إن|مل |امة|ع ا|إلى|ة ع|ماي|حما|ن و|لتع| وي|ير |نون|ي و|اسي|الج| هذ|نسا|وق |ترا|عية|ه أ| له|سية| يج| با|دول|انو|قان|لقا|ة ب|ة ت|تما|الد|يات|ع ب|سان|إنس|هم |علي| مت|لمج|ذلك|عمل|لأس|وز |جوز|يجو|بال|غير|ك ا|كان|ساس|أسا|دم |لاد|اعي|الر|تمي|دون|تمت|لتم| يع|ليه|ساو|اجت|ي م|لعا|لجم|تعل|ر و|تمع|مجت| مع|يه |ى أ|فيه|ى ا| كل|لات|ملا|ود |انت|الف|يها|ي إ|تي |الب|لي |قدم|ال |اد |ل ا|يز |ييز|ميي| تم|لحر|تع |متع|ا ب|عام|ا و|ق و|رام|ل ل|لاج|را |الش| وإ|يم |ليم|شتر|ا ح|واج|لزو|ول |ا ف|ولة|لحم|أسر| ذل|ه ف|اته|مسا|لمس| تع|عن |ه ع|وله|يته|ن ل|رة | وس|اة |يد | تح| مس|ي ي|لتي|عة |ولي|لدو| أس| وف|ل و|أية|ني |الس|لان|لإع|ة ف|ريا|ل إ|م ب|امل|كرا|تسا|ميع|جمي| جم|أول|بية|عيش|تحق|ادة|س ا| مم|معي|جما|عات|اعا|ارس|مار|مما|م و|راك|اشت|الط|اج |زوا|الز| وم|حدة|تحد|لمت|مم |لأم|ده |بلا| بل|ار |يار|تيا|ختي|اخت|ن م| مر',
    urd: 'ور | او|اور|کے | کے| کی| کا|یں | حق|کی |کا | کو|ئے |ے ک|یا |سے |کو |شخص| شخ|نے | اس| ہے|میں|حق | ہو| می|خص |ے ا| جا|اس | سے| یا|ہر |ی ا| کر| ہر|ے۔ |سی |ہیں|ا ح|ص ک|وں |ے م| ان|ر ش|۔ ہ|ائے|زاد|آزا| آز|ام |ر ا|ق ہ|ادی|جائ|ں ک|ہے۔|م ک| کس|ا ج|ی ک|س ک|کسی| پر|ے گ|ہے |ار |ت ک|دی |پر |و ا| حا| جو| ہی|ان |ی ج|ری | نہ| مع|جو |ل ک|ی ت|ن ک|کرن|ئی |ل ہ|تی |ہو |ہ ا| ای|صل |اصل|حاص|رنے|ی ش|نہ |۔ ا|ں۔ |یں۔|ر ک|ر م| مل|وہ |معا|رے |ں ا|نہی|ے ہ|ے ب|ایس|ے ل| تع| گا|یت |ی ح|ا ا|ی م|اپن| اپ|کیا|می |ی س| جس|ہ ک|نی |اشر|عاش| دو|لئے| لئ|انہ|وق |قوق|حقو|مل | قا|کہ | گی|ر ب|ہ م| وہ| بن|ی ب|ملک|جس |ا۔ |ریق|ر ن|ے ج|اد |ات |گی |د ک|ے ح|دار|ر ہ|گا۔|قوم| قو|ے، |ا س|دوس|ر پ| و | شا|ی آ|ں م|ق ح| پو| با|خلا|انے|یم |لیم|و ت|ون | کہ|ی، |۔ ک|ا پ|ن ا|لک |علا|ا م|ق ک|ائی|وسر|ی ہ|وئی|یر |ا ہ|علی|و گ|وری|دگی|ندگ|و ک|یسے| من|ائد|رائ| مر|پور| طر|ومی|ے خ|سب |نون|انو|قان| سک|وام|ین | رک|تعل|لاق|غیر|دان|، ا| بی| مس|یوں|نا | بھ| بر|رتی|ادا|امل|یہ | یہ|ہ و| عا|ی پ| بچ|اف |لاف| خل|ی۔ |گی۔| دی|ھی |بھی|دہ |جا |پنی|قوا|اقو|رکھ|ے ی| عل|کوئ|، م| چا|ے س|ر ع| پی|برا|ر س|ر ح|سان|م ا|کام|شرت| را|شام|من |زند| زن|ب ک|ت م|اہ |اری|س م|ر ج| مح|ورا|ے پ|طری|ہوں|ال |ں س|ی ن|کرے| مق|ت س|تحف| تح|و۔ |ہو۔|بند| اق|د ہ| ام|امی|الا|لت |شرے|ے ع|ا ک|فری',
    pes: ' و | حق| با|ند |رد |دار| دا|که |هر | در| که|در | هر|ر ک|حق |د ه|از |یت | از|یا |کس |ود |ارد| یا| کس|ای |د و| بر| خو|ق د|باش|شد |د ک|ار |د ب| را|ه ب|ان |آزا| آز|را |اشد|ی و|ه ا|ین |ید |زاد|س ح|خود|ی ب| اس|ده |دی |ور |اید|ه د|ری |و ا|تما|ات | نم|ی ک|ادی|نه |رای|د ا| آن|است|ر ا|ر م| اج|مای|ون |قوق|حقو|و م| ان|انه| هم|وق |ایت| شو|ی ا| مو| بی|با | تا|ورد|انو|ست |وان|برا|ام |شود|آن |جتم|ی ی| کن|ر ب|کند| مر|ت م|های|ت ا| مس|ی، |ماع|اجت|توا|یگر|و ب|دان|ت و|ا م| بد|عی |کار| من|مور| مق|ی د| زن|ی م|ن ب|ر خ|اه |ا ب|اری|د آ|مل | به|اعی|د، |دیگ|ت ب|بای|این| می|ن و|ق م| عم| کا|ن ا|و آ| حم|نون|ه و|و د|د ش| ای|شور|کشو| کش|لی |نی |ه م|بعی|ر ش|یه | مل|میت|ی ر|رند| شر|می |وی |ساو|قان| قا|مقا|او | او|د م|گی |نمی| اح| مح|مین|ئی |ادا| آم|خوا|گرد| گر|مند| شد|ائی| دی|ز ح|هیچ| هی|اده| مت|نما|ت ک|ران| بم|ن ح|ر ت|حما|ارن|مسا|دگی|ومی|ن ت|ملل|بر |هد |واه|بهر| اع|‌ها|ق و|، ا|عیت|یتو|ا ر|ن م| عق|همه|ا ه|زش |وزش|موز|آمو|انت|تی |جام|موم|عمو|تخا| فر|طور|د د|ه ح|ردا|اوی|نوا|انی|رار| مج|ی ن|حدی|احد|ندگ|زند|شخص| شخ|‌من|ه‌م|ره‌|هره|شده|ع ا|و ه|اسی|هٔ |یده|عقی|ا ا|مه | بش|اد |دیه|ا د|دوا|ی ح|ابع|ی ت|خاب|نتخ|رور|و ر|شرا| خا|ٔمی|أم|تأ|اً |امل|له |د ر|اسا|خور|بل |ابل|قاب|یک |سان|قرا|ا ن|خصی| ام| بو|یر |الم|بین|اهد|تبع| تب',
    zlm: ' دا|ان |دان| بر| او|ن س|رڠ |دال| ڤر|له |كن | كڤ|ن ا|ن ك|ن د|يڠ | يڠ|ڤد |حق |ورڠ|تيا|ياڤ|ارا|كڤد|اور|رحق|برح|اله|أن |ولي| ات|اتا|ڠن |تاو|اڤ |ستي|ليه|او | ست|ڤ ا|يه |را |ه ب|ه د|عدا| عد|ن ڤ|ن ب|ين | تر|ق ك|ن ي|يبس|بيب| تي| سو| كب| سا|ن م|ن ت|لم |الم|د س|ڠ ع| من|چار|د ڤ|رن |سام| ما|ڽ س|ن، | بو| اي|ندق| حق|ڬار|نڬا|بول|سبا| سب|اتو|ا س|قله| ڤم| مم|وان|سچا| سچ| كس|ا ب|سن | سم|ڤرل|اون|نڽ |تن | با|هن |سيا|ا ڤ|ارڠ|بار|ڤا |بسن|كبي|ام |يند|ي د|اڬي|ڠ ب|باڬ|ي ا|مان| لا| د |دقل|هند| هن|ت د|ادي|وين|يكن| نڬ|، ك|ن٢ | ڤو|بڠس|ق٢ |ات |اول|اكن|اڽ | سس|ون |اد | كو|اين|دڠن| دڠ|ائن|تو |تي |ن ه|ڬي |سي |ق م|وڠن|دوڠ|ندو|لين|رلي|نتو|ڤون|وات|ياد|تيك|ڠسا|ڤمب|ترم|٢ د|حق٢|وا |لوا|ماس|وق |ه م|ل د| مل|وند| ڤڠ|ا، |، ت|لائ|اي |مڤو|يك |ي ك|رات|مرا| بي|سمو|و ك|، د|سوا|ڠ م|ڠ س|ڠ٢ |ڤري|يري|دير|ا ا|اسا|ڤ٢ |تا |سوس|، س|جوا|ڠ ت|رأن| ان|سأن|ريك|يأن|ري | در|امر|كرج| ڤل|ا د|جرن|اجر|ارك|لاج|د ك|وار|برس|ونت|منو|سال|ينڠ|دڠ٢|ندڠ| مڠ|اڤا|سسي|ساس|نن |ڤول|اڬا| بڠ| سڤ|مبي| اڤ|ڠ ا|ارأ|ڤرا|ي س|بس | دل|ا م|موا|ڤلا|ملا|ڤرك|كور|وبو| كأ|وكن|أنڽ|كسا|ڠڬو|ادڤ|هاد|رها|تره|كوم|توق|م س|ڠ د|دي | دي|٢ س|ندي|اس |ادا|بوا| دب|ڠ ڤ|ڽ، |اڤ٢|رتا|ال |يال|وسي| كت|أن،|نڤا|تنڤ| تن|م ڤ|رسا|ممڤ| مر|ن ح| كم|نسي|جأن|ؤي |لؤي|الؤ|لال|كڤر|كت |ركت|شار|مشا| مش|جاد|رڬا',
    skr: 'تے |اں |دی |دے | ۔ |وں | تے| دا| کو|کوں| حق|دا | دی|یاں| دے|یں |ے ا|شخص| شخ|ہر |ے ۔|اصل| حا|حق |خص | ہر|صل |حاص|ہے | ہے|ال |ق ح|ل ہ| نا| کی| وچ|۔ ہ|یا |سی |ے م| او|وچ |اتے|کیت|ا ح|ادی|نال|ص ک| ات|ر ش|ہیں| یا|ں د| ای|یسی| مل|وند|کہی| کہ|ی ت|زاد|ازا| از|ندے|ں ک|ار | وی|ے ک|ئے | ان|ڻ د|نہ | کر|اون|ے و|دیا|ی د|ں ا|ے ب|ویس|وڻ |ی ن| ہو|تی |ی ۔| نہ|ی ا|یند|و ڄ|آپڻ| آپ|ا و|ے ج| کن|ے ن|ندی|ت د|ے ح|ی ک|ئی |ملک|یتے|ن ۔|تھی| تھ|ون |ں م| بچ|۔ ا|نوں|کنو|ڻے |اری|ا ا|ے ہ|ل ت| ڄئ|وق |قوق|حقو|ل ک|خلا| جی|لک |دار|یت |کرڻ|انہ|کو |ہکو| ہک|ن ا|مل | وس|ں و|پڻے| تع|ی م|اف |ے خ|نون|قنو| قن| لو|۔ ک|ری |لے |تا |یتا| قو| چا|ہاں|ڄئے|ق ت|ایہ|رڻ |ے د|ر ک| و |لاف| خل| جو|ی و|او |ہو |ئو |چئو|بچئ|یر |ہوو|ا م|ی ج|الا|ین | جا|می |نہا|ان |ات |سڱد| سڱ|یب |سیب|وسی| شا|ب د|یوڻ|ام |اوڻ|ے ت|ڻ ک| مط|ں ت| ون| کم|ن د|رکھ| رک|ڻی |ں آ|ریا|ی ہ|اد |یاد|علا|ر ہ|ں س|ی ح|جھی|ائد|ہی |لوک| ڋو| سم| سا| من| مع|بق |ابق|طاب|مطا|ھیو|ں ف|ہن | ہن|جو |و ک|ں ش|ر ت|کار|م د|ھیا| ٻا|غیر|و ل|وئی|جیا|وام|قوا|ی س| جھ|ل ا|قوم| سی|ذہب|مذہ| مذ|اے | اے|دن |ا ت|سان|نسا|انس|رے |لیم|علی|تعل|امل|ہ د|ے ر|د ا|کم |یہو|فائ|چ ا| کھ|م ت|را |ورا|پور|ں ب|ق د|ے ق|وکو|کھی|ا ک|و د|ے ذ|پڻی|بند| فر|کوئ|امی|ی ی|ائی|لاق|ایں|ہ ا| نظ|سما|ومی|ی، |ے س|ت و|ھین|ے ع|یم |سہو| سہ',
    pbu: ' د | او|او |په | په|ي۔ | حق|چې | چې|ره |ي ا|ې د| هر|نه |هر |حق | څو|وک |څوک|و ا|ه د|ه ا|۔ ه|ه و| شي| لر|ي چ|و د|ري |لري|ق ل| کښ|وي |ښې |کښې|ه ک|غه |لو |ر څ|سره| سر|ه پ| ټو|و پ|له |يت |ټول|يا |کړي| کو|خه |ي، |دي | له| از|د م| هي| وا| يا| څخ|ازا|د ا|ولو|ه ت|څخه| کړ|ول |هغه|ه ش|ي د| هغ|کول|زاد|نو | وي|و ي|ه ب|شي۔|دې |يو | دي|ته |خپل| پر|اد |د د|ک ح| تو|ه م|ګه |ه ه|قوق|حقو|و م|ه ح|د ه| تر| مس|شي | نه|ړي۔|ني |د پ|واد|ې پ|ادي|ولن| يو|د ت|ونو|وګه|ي و|لي | دا|يد | با|تون| خپ|ي پ|توګ|ار |اند|يوا|ې و|دان| بر|ړي | عم|انه| ده|يڅ |هيڅ|امي|لني|بعي|ډول| ډو|ه ل|ايد|باي|اتو|ه ګ| تا|پل | مل|ايت|وم |ون | لا|هيو| شو| دغ|م د|ده |ې ا|ان | ته|کار|تو |مي |اره|اوي|ساو|مسا|نون|دهغ|و ت|ي ش|انو| مح|ين |اخل| ګټ|شوي|دغه|و ح|وي،|نيز|سي |اسي|وند|قو |وقو|و ک|ونه|ومي| وک|ي ت| ان|قان|ندې|و ر|ک د|ه ي|مين|پر |ټه |لام|غو |هغو|د ټ|و ه|ل ت|لے |ولے|وون|کي |رو |ن ک|موم|وکړ|پار|ن ش|من | نو| وړ| قا|ې چ| وس|څ څ|شخص| شخ|ژون| ژو|تر |ګټه|و څ|هم |عقي|رته| ور|بل | بل|و ب|ه س|ښوو| ښو| کا|ې ک|و س|اده|ونک| غو|دو |و ن|ت ک|مل |عمو|ل ه| پي|وسي|ړان|وړا|يز |خصي|ي م|ا ب|ادا|ه ن|خلي|واخ|ديو|، د|د ق| هم|ا د| بي|تبع| تب|ه چ| عق|پلو|و ل| را|د ب|راي| دخ|نې |نکي|ت د|ابع| مق|د خ|وره|شرا| شر|ر م|رسر|تام|ه ټ| من|طه |سطه|اسط|واس|لې | اس|۔ د|برخ|ې ن',
    uig: ' ئا| ھە|ە ئ|ىنى| بو|ىلى| ئى|بول| ۋە|ۋە |ىن |نىڭ|قۇق|وقۇ|ھوق| ھو|شقا|قىل|ىڭ |نى |قا |لىش|ن ب|ەن |ئاد|ھەم|لىك|دەم| قى|ادە| ئە|كى |ندا|دىن|قان|ى ئ|گە |ەم |ىش |ىي |ۇق | بى|غان|ىغا|اند|تىن|ىگە|ولۇ|ەت |ھەر|ىشى|كىن|ىدى|اق |ىتى|لۇق|ەرق|ىكى|مە |لەت| يا|لۇش|لىق|ممە|ەمم| ئۆ|داق|رقا| تە| قا| با|ىشق|اكى|غا |ۇقل|ا ھ|ياك|مەن|رىم| بە|ا ئ|دە |ئەر|قلۇ|دۇ |دۆل| دۆ|ىلە|ان |ق ھ|ركى|ەرك|ۇقى| مە|ى ب|ىمە|ەھر|نلى|ىق |ن ئ|ارا|ئۆز|ى ۋ|ۆلە|ھرى|ار |لار| ئې|بەھ|لەن|لغا|ش ھ|ىلا|ۇشق|شى |نىش|ق ئ|ئار|لىن|بىل| ئۇ|ا ب|ايد|ماي|كە |ولم|يدۇ|ئىي| كې|اسى| مۇ|ە ق|ەر |، ئ|ىنل|يەت|ىك |لما| ئو|م ئ|ېلى|مائ|ە ب|ئىگ|تنى|ا، |ش ئ|ۇ ھ|شكە|الى|ڭ ئ|ارى|ەك | قو|سىي|رلى|ى ك|بىر|ەمد|ە ھ|لەر|ۆزى|ئال|ىيە|منى|ەتت|ائى|شلى|مدە| تۇ|بار|ەشك|ەتل|لىد|كىل|ئىش|قىغ|چە |ۇشى|ىما|اشق| جى|رەك|ېرە|كېر|ر ئ|ر ب|راۋ|ن، |اۋا| ما|ايى|ادى|تۇر|نۇن|انۇ|ېتى|تىش|ىشل|دا |ىدا|ۇرۇ|قى | جە|باش|جىن|ى، | سا| خى|ېرى|ناي|ىنا|ى ھ|زىن|ە ت|ى ق|ەمن| بۇ|رنى|ن ق|تتى|تى |ىقى|ى ي|ك ھ|ىرى|ائا|ي ئ|تەش|شىش|لەش|دىل|تىد|دا،|ساس|اسا|ە م|سىت|پ ق|ئېل|نىي|ن ۋ|سىز|ىسى|ىل |اش |ي، |مىن|ۇنى|ىپ |تىم|ەلى|رىش|ىيا|ۇش |مۇش| خا|ىر |مەت| تا| پا|تلە|الغ|لىم|پال|اپا|كاپ| كا|انل|ڭ ھ|ۇند| تو|قتى|الە|ن ھ|ە د|جتى|ىجت|ئىج|رقى|ىيى|ارل|امى| ھۆ| بې|ەتن|اتن|ىكا|ي م|اتى|شكى|سى | ئۈ|ە، |ت ئ|گەن| دە|ق ق|ولغ|ق ب',
    prs: ' و | حق|رد | با|ند |دار| دا| در|هر |که | هر|در | که|د ه| به|حق |ر ک| از|از |یت |به |کس |ود | کس|یا |ارد| یا| بر|د و|ق د|د ک| را|ار |ای | خو| اس|ه ب|باش|ید |آزا| آز|را |ین |ان |ه د|زاد|اشد|ی و|ه ا|اید|س ح|ده |د ب|ی ب|است|خود| آن|شد |ور | هم|تما|ی ا|ات |ر ا|ادی|نه |ری |رای|و ا|و م| نم|ی ک| مو| اج|د، |مای|ون |برا|قوق|حقو| شو| ان|انه| مس|ه م|ر ب|وق |ایت|آن |های|ر م|هیچ| هی| تا|ه و|ورد|شود|انو|ست | بی|ام |وان|یگر|با | مر|ن ا|ی د|دی |ی م|د آ|ر ش|ماع|جتم|اجت|ی ی|سی | کن|دیگ|بای|ت و|عی |کند|ت م|ت ا| من|مور| عم|و د|ر خ|اه |لی |ا ب|بر |نی | شد|ی، |اعی| دی|توا|ت ب|دان|کار|د ا|ن و| شر|می | کا|و آ| حم|ساو|مسا|نون| او| زن|د ش| مح|ن ب|ه ش|شور|کشو| کش|اری|مل |بعی|مند|یی | مل|ی ر|و ب|د م|وی |قان| قا| مق|او |انی|گی |این| ای|مین|ادا| آم|خوا|گرد| گر|ه ح|، ا|ز ح|میت|رند|ا ه|یل |اده|نما|ق م|ت ک|ران|ن ح|د د|حما|ارن|اوی|انت|شد،|چکس|یچک|دگی|ومی|ملل|هد |واه|‌من|ه‌م|ره‌|هره|بهر|، ب|یه | اع|دیه|ق و|عیت|هٔ |ا ر| عق|همه|ابر|راب| می|ا م|زش |وزش|موز|آمو|ا د|دوا|تی |جام|موم|عمو| مت| وس| فر|ق ا|ر ت|مقا|یک |نوا|رار|نمی|زند|شخص| شخ|ایی|ت، |و ه|اسی|یده|عقی|اً | بد|یتو|مه | تم|رش |طور|ازد|ی ح|ابع|ی ت|خاب|تخا|نتخ|رور|و ر|شرا| خا|اب |ٔمی|أم|تأ|‌ها|یرد|و ی|امل|له |اسا|ردا|خور|ا ا|سان|قرا| مج|ی ن|ا ن|کسی|خصی| ام|ندگ|دود'
  },
  Devanagari: {
    hin: 'के |प्र| प्| का| के| । |और | और|का | को|कार|ार |ति |या |को |ने |ों |िका|्रत| है| कि|ं क|है |धिक|व्य|अधि| अध|्ति| सम|्यक|ि क|क्त|ा अ|की |ा क| व्|ें | हो|यक्|सी |से |े क| या| की|में|न्त| मे|त्य|ै ।|ता |रत्|क्ष|ेक |येक|्ये|िक |र ह|भी |किस| जा| स्|क व|ा ज|िसी|मान| वि|र स|त्र|ी स|। प| कर|्रा|गा |ित | अप| पर|स्व|ी क| से|ा स|्य | अन|्त्|िया|ा ह| सा|ना |्त |प्त|समा|ान |र क|ाप्|तन्| भी| उस|राप|वतन|्वत|रों|वार|े स|था |हो |े अ|ा ।|न क| न |देश| रा|षा |अन्|त ह|्षा|्वा|जाए|ी प|करन|ा प|अपन|ष्ट| सं|े व|होग|िवा|ट्र|्ट्|ाष्|राष|सके| मा|ओं |ाओं|री |क स|े प| नि|ीय |रक्|ो स|ाएग|रने| इस|व क|पर |रता|र अ| सभ|तथा| तथ| ऐस|रा |पने|्री|िक्|किय|ा व|माज|ं औ|र उ|द्ध|सभी|श्य| जि|ाने|ार्|ारा|द्व| द्|एगा|सम्|ेश |िए |ाव |र प| दे|्तर|ा औ|ारो|यों|परा|पूर|चित|्ध |रूप| रू| सु| लि|त क|ो प|ं स|े ल|शिक| शि|वाह|े औ|जो |राध|जिस|ूर्|ी भ|ूप |ोगा|स्थ|रीय|तिक|्र |। इ|इस | उन|ले |े म|लिए|म क|कता|े य| जो|न म|अपर| पू|ो क|ा उ|ाह |नून|ानू|गी |दी |ारी|ं म|। क|तर्|ी र|श क|परि|स्त|ोई |कोई|र्य|ी अ|हित|भाव| भा|ताओ|ास |साम|विक|विव|म्म| सक|कर |ाना|ध क|निक|य क|उसक|कृत| क़ा|न स|जीव|्या|रका|्रक|ाज |न्य|्म |र्ण|क़ ह|हक़ | हक़|ी म|जिक|ाजि|ामा|क औ|मिल|ेने|लेन| ले|ये |ो अ|े ज|रिव|मय |समय|वश्|आवश| आव|ऐसी|ाध |र द|र्व|सार|प स|बन्| सह|िधा|विध|ी न|ून |क़ान',
    mar: '्या|या |त्य|याच|चा |ण्य|ाचा| व |कार|प्र| प्|िका|धिक|ार | अध|अधि|च्य|आहे| आह|ा अ|हे |ा क|ास |वा |्ये|्रत| स्|ता |ा स| अस| कर|स्व| का|ल्य|रत्|ाहि|कोण| को|िक |येक|्वा|ा व| त्|र आ|्य |त्र|ेका|क्ष|ा न| सं|ामा|ाच्|ंवा|िंव|किं| कि|ात |ष्ट|कास| या|यां|ांच|र्य|मिळ| मि| सा|व्य|ोणत|ने |े प|काम| सम|ंत्|ये | रा|समा|तंत|करण|ा आ|े क|हि |े स|ना |िळण|ून |ा प|ट्र|्ट्|ाष्|राष|ीय |व स|क्त|मान|र्व| आप|ळण्|्र्|ातं|वात|चे | वि|्षण|रण्| दे| व्|आपल|ही |ार्|नये| नय|मा |यास| जा|लेल| नि|े अ| पा|ा म|ले |ाही|बंध|े व|्यक| मा|शिक| शि|देश|ा द|माज|्री|ली |ान |ांन|पल्| हो|ा ह|षण |जे |िजे|हिज|पाह|ारा|यात|सर्| सर|रां|असल|ंबं|संब|िक्|ी प|ंच्|रक्|णत्| आण|ला |स्थ|रीय|ीत |ंना|त व|्व |क व|णे |ाचे|न क|त क|रता|्रा|याह|्त |ची |य क|द्ध|्वत|यक्|णि |आणि|स स|ंधा|क स|च्छ|य अ|त स|ीने|ोणा|करत|त्व|ील |ी अ|सार|र व|भाव|व त|थवा|अथव| अथ|े त|े ज|याय|ंचा|ेल्|ाने|ेण्|क आ|क्क|हक्| हक|ण म|ंरक|संर|न्य|ायद|ा त|त आ| उप|वस्|िवा|ेशा|साम|े य|े आ|ी व|व म|तीन|व आ|ध्य| अश|धात|कृत|्क |द्य|ित |सले|ेश |तो |ेल |ती |्ती|असे|इतर| इत|स्त|र्ण|ा ब|ेले| के|हीर|जाह|ा ज|ेत |ूर्|पूर|ेच | वा|ाजा|ी स|शा |य व| न्|याव|द्द|्ध |रून|यद्|काय|ा श|गण्|क क|राध| शा|यत्|ल अ|्यव|ी क|ाव |ा य|त्त|जिक|ाजि|रणा| धर|ा ध|भेद| बा|रका|्रक|केल|ि व|िष्|तील|योग|साध|ांत|विव|श्र| धे| मु|वतः',
    mai: 'ाक |प्र|कार| प्|ार |िका|्यक|धिक|क अ|्रत|्ति|व्य| अध|ेँ |अधि|िक | व्|आʼ | आʼ|क्त|यक्|तिक|केँ|क व|बाक|क स|छैक| छै|त्य|मे |ेक | सम|क्ष|हि |रत्|र छ|येक|्ये|न्त|वा |िके|क। |ैक।|। प| अप| स्| वि| जा|ित |सँ | हो|कोन| को|त्र|स्व| वा|क आ|ष्ट| कर|अपन|मान| का| अन|ति |्त्|नो |नहि| पर|ट्र|्य | एह|ि क|्ट्|ाष्|राष| रा|समा|ोनो|ल ज| नह|ताक|ार्|पन |तन्|वतन|्वत|्षा| कए| सा|्री| नि|ा आ|िवा| सं| दे|जाए|ीय |करब|था |एबा|ा प|ना |्वा|देश|त। |रक |क ह|ँ अ| सभ| आ |त क|चित|्त |वार|ता |ारक|माज|ा स|रीय|न्य|रता|ान |्रा|्या|रक्|ारण|परि|एल |कएल|अन्|रबा|क प|ओर |आओर| आओ|अछि| अछ|िर्|ान्|नक |होए|कर |धार|स्थ|ा अ|िमे|र आ|एहि| एक|े स|तथा| तथ| मा|िक्|शिक| शि|प्त|र्व|निर|च्छ|र्य|ँ स|क क|हो |ाहि|एत।|र प|ामा|साम|षा |ʼ स|ँ ए|ैक |द्ध|र अ|क ज|स्त|ाप्|ँ क| सक|यक |कान|हन |एहन|ेल |ोएत|त आ|ा व|। क|्तर|ाएत|्रक|हु |क उ|पूर|विव|ʼ अ|छि | ले|न प|ास |राप|धक |पएब| पए|रा |यता|रूप|न व| के|षाक|य प|त ह|जाह| ओ |भाव|पर |थवा|अथव| अथ|सम्|जिक|ाजि|ूर्|रति| दो|सभक|। स| जन|सभ |बाध|अनु|िसँ| सह|ँ व|ए स|रिव|तु |ेतु|हेत| हे|ाध |ेबा|न स|िष्|राध| अव|ित्|वास|चार| उच|ारा|न क|वक |ा क|नून|ानू|एत |री |ेओ |केओ|रण |्रस|ि द|ओ व| भे|नहु|ोनह|्थि|पत्|म्प|राज| भा|हिम| हक|ामे|्ण |र्ण|हार|ि स|क द|न अ|त अ|लेब| अभ|िश्|जक |ाजक|न आ|वाह|काज|श्य|वस्|ओहि| ओह|योग|। ए|कए |े ओ|अपर',
    bho: ' के|के |े क|ार |कार|िका|धिक|अधि| अध|ओर |आओर| आओ|े अ|े स|ा क| सं|िक |र ह|ा स| हो|र स|ें |में| मे| कर| से|नो |क्ष|से | का|। स|खे |ा। |रा | सम| सब|्रा| सक|र क|न क|वे |ौनो|कौन| कौ|चाह| चा| बा|प्र| प्|था |ि क|ति | जा| सा|े आ|पन |करे|ता |होख|त क|े। |े ब|तथा| तथ| आप|केल|सके| स्|रे |सबह|कर |आपन|े ओ|जा | पर|ष्ट| रा|ना |हवे| हव|ला |ेला|बहि| ओक|ोखे|र ब|ह। | ह।|न स|ाष्|राष|्त | और|े च|। क|संग|र आ|ट्र|्ट्|षा |मान|ा आ|ं क|ा प|्षा|रक्|हे |ाहे|ाति|ावे| जे|ही |ओकर|मिल|ित |ो स|ल ज|इखे|नइख| नइ|त्र|माज| बि|वे।|े ज|क स|िं |हिं|करा|और |े म|समा|हु | ओ |पर |े न|स्थ|रीय|्री|ला।|ाज |ान |कान|े त|िर |तिर|खात| खा|े उ|नून|ानू|ाम | सु| दे|ी क| मा|र म|प्त|िया|ाही|बा।|योग|ी स|ल ह|ून |व्य|ु क|ए क|े व|ंत्|स्व|केह|ीय |खल |साम|यता|तिक|े ह|ाप्|राप|र प|र अ| लो| सह|जे |ोग |म क|ले | नि|ेकर|ा ह|पूर|र न|ेहु|्य |या | या|देश|दी |ा म|ाव | दो|े द| पा|हि |िक्|शिक| शि|बा |िल | उप|्रत| वि| ही| ले|रो |े ख|ठन |गठन|ंगठ| मि|षण |्षण|ंरक|संर| आद| एक|ने | अप|तंत|वतं|्वत|्तर|्या|ेश |ादी|्ति|जिक|ाजि|क आ|्म |चार| उच| शा|री |ाह |याह|बिय|चित|क्त|पयो|उपय|रता|र व|न म|लोग|ह क|न प|काम| पू| इ |आदि|ईल | कई| व्|मी |ुरक|सुर| जी|धार|य स|तर्|भे |सभे| सभ|भाव|्थि|ामा|सर |र्म| को| बे|ोसर|दोस|ण क|ास |े प|जाद|आजा| आज|उचि|ग क|ारी| जर|गे |ज क|ी ब|सन |हो |ा त',
    npi: 'को |ने | र |ार |क्त|कार|प्र| प्|्यक|व्य| गर|िका| व्|्रत|धिक|्ति|यक्|अधि| अध|ाई |मा |लाई|त्य|िक | । | सम|वा | वा|क व|्ने|र्न|गर्|न्त|छ ।|तिल|रत्|त्र|ेक |येक|्ये|िला|र स|ो स| स्|मान|क्ष| वि|हुन|ा स| हु| छ |र छ|्त्|समा|स्व|। प| सं|नेछ|ुने|हरु|तन्|वतन|े अ|िने|ो अ|्वत| का|े छ|गरि| रा|्र |ति |ाको| कु|ष्ट|ना |स्त|क स|ुनै|कुन|ट्र|ले | नि|ान |छैन| छै|्ट्|ाष्|राष|तिक|छ। |ार्|ता |ित |नै |ा अ| सा|ा व|रु | मा| अन|ा र|रता|र र|हरू|ेछ |ा प|रक्|्त | पर|था | ला|परि|देश|सको| यस|माज|ामा|्रा|िवा|ाहर|ो प|्य |वार|न स|। क|नि |्षा| त्|द्ध|र ह|तथा| तथ|यस्|्यस|री |र व|पनि|रिन|ंरक|संर|भाव|ै व|सबै| सब| शि| सह|ताक|े र|त र|लाग| सु|्षण|द्द| अप|ैन |ो व|िक्|ाव |धार|्या|्रि|ा भ|एको|र म|न अ|ो ल| उस|शिक|ात्|स्थ|वाह|ूर्|श्य|ित्|रको|ारक|ुद्|तो |्तो|ाउन|कान|िएक|ा न| पन|न। |ैन।|का |ेछ।| भे|र्य|सम्|त्प|साम|रिय|चार|निज|ुन |गि |ागि|उसक| मत| अभ|पूर|र त| सक|सार|राध|परा|अपर|ुक्|जको| उप|रा |ारा|्वा|विध|्न |ा त|न ग|णको| पा| दि|क र|र प|अन्|भेद|ारम|ो आ| अर|जिक|ाजि|िय |षा |ाट |बाट| बा|ि र| छ।|त्व|त स|रू |छ र|रका|विक|र उ|ोग |्दे|रिव|सकि|ै प|रति|अनु| आव|युक|ा ग|नमा|योग|ग ग|क अ|द्व|्ध |रुद| बि|। स|उने|ान्|ा म|िको|र्द|ारी|्तर|ो ह|हित| दे|रिक|ा क| आध|राज|र्म|्ण |र्ण|ि व|्यव|विच|बै |सहि|रोज|र्स|ई उ|्प |रात|निक|मिक|च्छ|्था|विव|कता|अभि|्धा',
    mag: ' के|के |ार | हई|कार|ई। |हई।|िका|े अ|धिक|अधि| अध|र ह|े क|और | और|ा क|े स|सब | सब| कर|ें |था |में| मे|तथा| तथ|िक | हो| सम|क्ष|ना |ब क|र स| सं|ा स|कर | भी|। स| सा| से| का| अप|्रा|प्र| प्|से |भी | को|त क| पर|रा |क ह|पन |अपन| सक|या |ति |र क|ी क| या|करे| जा|रे | ओक|्त |सक |नो |ान |मान|ओकर|ा प|न क|ेल | ना|। क|रक्| स्|ही |होए| एक|पर |दी |ट्र|ता |व्य|हई | शा|े उ| दे|त्र|ादी| रा| ही|कान|ित |म क|ल ज|ाम |ी स|े भ|न स|माज|ष्ट|षा | ले|क स|बे |वे |ावे|मिल|र म|्य |ा ह|ला |प्त|नून|ानू|जा |ेकर|्षा|्रत|ंत्|र औ|ोई |कोई|्ट्|ाष्|राष| मा|रो | जे|करा|ोए |ाप्|राप|समा|ून |ो स|स्व|्ति|साम|ोनो|कोन| व्|र अ|्म | वि| सह|े म|क्त|योग|र व|काम|ल ह| नि|देश|पूर|वार| इ |ंरक|संर|ए क|र प| सु|तंत|वतं|्वत|ा म|व क|े व|ाथ |साथ| दो|होब| पा|ो क|े ब|ोग | उप|स्त|परि|न प|े त|्तर|लेल|े ओ|चाह| चा|य क|वा |ेश |य स|न ह|षण |ा ब|। त|एक |एल |ीय |केक|े ह|र आ|ि क|स्थ|जिक|ाजि|ामा|रीय|्री|तिक|ाति| बि|चार|े आ|ास | उच|ा त|यक्|्यक|िल |मय |समय|शाद|पयो|उपय|े ख|रिव| पू|े ल|े च|ौनो|कौन| कौ|ं क|संग|न द|ं स|ण प|्षण|र न|े न|ो भ|करो|ा औ|रता|ाव |भाव|क औ|र्म|ोसर|दोस|ण क|े प|न औ|ब ह|िक्|शिक| शि|ाबे|निय|चित|उचि|ित्|ग क|े। |त स|ी श|ं श|एकर|। ए|तन | ओ |री |्र |जे |क क| सी|सन |िवा| अन|ूरा| बच|ए। | बे|त ह| तक| मि|धार|थवा|अथव| अथ|िला|्वा|ि म| आद|ने |कएल| कए|्या'
  },
  Myanmar: {
    mya: 'င့်|င်း|ိုင|ုင်|သည်|့် |ွင့|ခွင|ကို|ည်း|ောင|သော|ာင်|ြစ်|တို|နို|်းက|ို |င် | အခ|ြင်|ဖြစ|လည်| လူ|် အ|ရှိ|ျား|မျာ|်ခွ|်။ |ည်။|ကော|းကေ|နှင|ှင့|ို့|ရေး|်း |င်ခ|း၊ |် လ|ော |ခြင|ွင်|မှု|်စေ|တွင|်း၊|ှိသ|ောက|ိသည|းကိ|ည့်|ော်|ာက်|တ်လ|စ်စ|လပ်|ွတ်|လွတ| မိ|လူတ|်လပ|ူတိ|်လည|်းမ| ဖြ|စွာ| လွ|င်ရ|ွာ |ုပ်|်၊ |့် |ထို|်သေ|းတွ|။ လ|ြား|အရေ|့်အ|အခွ|ိမိ|ွက်|ာ်လ|ေ၊ |ား |မည်| သေ|က် |ိုး|်ရှ|ည် |မိမ|်စွ|စေ၊|့်ရ| ထိ|်အရ|ြင့|န် |းနှ|်းတ|မ်း|ဖြင|် မ|အား|်သည| ပြ|န်း|အခြ|်ငံ|င်င|ပို|ာ အ|်မှ|ပ်စ|ရန်| နိ|ဆို|းမျ|ားက| ရှ|စေရ|ွယ်|းသည|လုပ|် ပ|တစ်|၊ အ|း အ|် ဖ|ုံး|ခြာ|ဝင်|ရမည|် ရ|ြည်|ုတ်|သို|းခြ|းဖြ|းမှ|အပြ|်ခြ|စား| လည|်းသ|်နိ|အတွ|ပြု|ပြည|်းပ|ခံစ| ခံ|း မ|ေးမ|ပြင|င်သ|ဟုတ|မဟု|ပ်ခ|့ အ|ားသ|ကြေ|တ် |က်မ|တွက|ားန|ပဒေ|ဥပဒ|ု အ|သား|် သ|်းခ|၊ မ|ပညာ|ိုက|မှ |မျှ|ည်သ|ြော|ရ။ |စည်|်ဖြ|တည်|ျက်|ကွယ| အာ|ေး | သိ|ားဖ| အလ|်မျ|သင်|ွဲ့|ဖွဲ|ရား|တရာ|်ကိ| ဥပ|ေးခ|ပြစ|တ်ခ|်ရန|က်သ|်ချ|ု့တ|၊ လ|ားလ|်ရွ|မိ၏|ု သ|ုက်|သက်| အက|ားရ|ခြေ|် န|်မြ|စ်မ|်းန|၊ န| ကိ|၊ သ|ျို|လူမ|းချ|်နှ|ူမျ|ူညီ|တူည| တူ|လို|ားစ| အတ|းသေ|ဆော|င်၊|ဒေအ|ပေး|ှု |ာ လ|်သူ|ှော|ိမ်|ားခ|ံစာ|် ခ|ျင်|ွေး|အလု|ါဝင|ပါဝ| နှ|ားတ|ပ် |း န|းစွ|ု လ|ေအရ| အပ|ားမ|်ရေ|ာ သ|ေးက|။ မ| လု|် ထ|်ရာ|ေရ။| အဆ|းမဟ|့တည|၊ က|ထား|် က|ိုသ|ပ်သ|် တ| ပါ|အဖွ|ရွက|အခါ|ေးရ|် စ|ခံရ|၏ အ|က်ခ|်းအ|းအဖ|အဖြ|ွန်|ျှ |ုမျ|ှင်|ုယ်|ိုယ|ာင့| တိ',
    shn: 'င်ႈ|ၼ်း|လႆႈ|င်း|်း |ူၼ်|ုၼ်|ၼ်ႉ|ူင်|ဝ်း|ွင်|ၼၼ်|ိူင|်ႇလ|မ်ႇ|ူဝ်|်ႈလ|ၼ်ႇ|ႇလႆ|်းၵ|တႃႇ|မိူ|ဢမ်|ၵူၼ|မီး|တ်ႈ|တ်း|သုၼ|ဝ်ႈ|လွင|လႄႈ|င်ႇ|ုင်|ၼႆႉ|ၢင်|ဢၼ်|ၵေႃ|်ႈ | လွ|ႆႉ |ႈ တ|ိူဝ|မ်း|ႆႈ | တႃ|ႄႈ |ၼ် |ွတ်|်းၼ| ၵူ|ိုင|းသု|ယူႇ|်းလ|ၢၼ်|ဵၼ်|ီးသ|ၵ်း|ႅဝ်|လႅဝ|လွတ|ုၵ်| မီ|ေႃႉ| ဢၼ|ၵ်ႇ| လႄ|ဵင်|ႈ လ|ၵၼ်|်ႈၵ|ပိူ|ၵူႊ|်းပ|ွၼ်|်းတ|်ႈတ|ႃႉၼ|်ႉ |်ႈမ|။ ၵ|်းသ|ႇ။ | တေ|ၸႂ်|်းမ|ူႇ။|ၵ်ႈ|သေ |်ႇ |ႉၼႆ|ႊၵေ|ူႊၵ|းၵူ|ႉ မ|ႈလႅ|်ႈပ|်ႇၼ|ပဵၼ|တီႈ|ႈမိ|ၵၢၼ|ေဢမ|ဝ်ႇ|ိုၼ|ၶဝ်|ဵတ်|ႁဵတ|လႂ်|ုမ်|းၼၼ|ၸို|ိင်|ႂ်ႈ|ၼ်ႈ|ပ်ႉ|မ်ႈ|ိူၼ|ၢႆး|်၊ |်းၶ|ႈလွ|င် |် လ|်ႇမ|်းၸ|်းယ|ႃႈ |တင်|တေႃ|ုဝ်|ိုဝ|ၼ်လ|်ႇၵ|ပၼ်|း လ|်ႉလ|ၾိင|်ႇပ|တ်ႇ|းပိ|ႁႂ်|မၼ်|ႃႇ |ေႃႈ|ၼႃႈ|်ၼၼ|်းႁ|ႈတႃ|ထုၵ|်ႈၼ| ဢမ|်ႉတ|်ႈႁ|တၢင|တေဢ|ေႃႇ|ူၺ်|ၼ်ၵ|ၵဝ်|ႉ တ|ႇၼၼ|းမိ|ၢမ်|ၢႆႇ|း ဢ|ပၢႆ|်ႈၸ|ႈ ဢ|ႃႇၶ|ႆႈတ|ွမ်|ေလႆ|တေလ|ူမ်|်ႈဢ|ၢဝ်|ၼ်ပ|သၢင|ၼ်ၼ|်ႈယ|လိူ|ဝ် |်သေ|ၽဵင|ၼ်ဢ|ၸွမ|ပ်း|ႈလႆ|ဢဝ်|သင်|ႉယူ|်ႉယ|်ႉၵ|်းဢ| မိ|် ဢ|ထို|ၶွင|ၼ်တ|ၾၢႆ|ႁပ်|ႂ်း|ၼႂ်|်ႉႁ|ၺ်ႈ|းလႅ|းသေ|်ႇၶ|ၼင်|ႂ်ႉ|်ႇၽ|ပို|ွၵ်|ၼ်မ|်ၼႆ|ပဵင|လူၺ| ပိ|ူပ်|လုၵ|ႇ လ|ႈသင|တူဝ|ႈ ပ|ႅင်|် တ|ႁူမ|်ႇႁ|ႃႇလ|ႇၶဝ| ၾၢ|်ႇၸ|်ႇတ|းလွ|ႆႈမ|ၼ်ၽ|ႃႇၵ|တို|းသၢ|ဝ်ၼ|ႇပဵ|ူၵ်|ၵ်ႉ|ႄႈသ|ယဵၼ|ႈထု|ႆႈထ|းၵၢ|ပၵ်|ႆႈပ|ႅတ်|ႉ လ|ၽူႈ|ဝႃႈ|်ၵူ|င်ၸ|ႉ။ |းၼႆ|ႈ မ|ႈမီ|ႁၼ်|းတေ|ၼ်သ|ဝႆႉ| သု|ူတ်|ၵိူ|်ဢၼ|မ်ႉ|ၸုမ| တီ|ႃႇႁ|ႉၼၼ|ၺ်း|်ႉသ|းၵေ|်ၸိ|ဝ်ႉ|၊ လ|ၼ်ႊ|း၊ |ိၵ်| ၼႂ|ႉႁၼ|ိတ်|ႇၵၼ|်။ |ႃႇၸ|င်သ|။ ပ|သွၼ|ၵတ်|ၸဝ်|်ၸႂ|င်ပ|ႂ်၊|ႅၼ်|သေဢ|်ဢမ'
  },
  Ethiopic: {
    amh: '፡መብ|ሰው፡|ት፡አ|ብት፡|፡ሰው|መብት|፡አለ|ይም፡|ወይም|፡ወይ|ነት፡|ለው።|አለው|ንዱ፡|ዳንዱ|ንዳን|ያንዳ|እያን|ዱ፡ሰ|፡እን|ት፡መ|ው። | እያ|፡የመ|። እ|እንዲ|፡ነጻ|፡የተ|ም፡በ|ው፡የ|ም፡የ|፡የሚ|ን፡የ|ና፡በ|ና፡የ|፡አይ|፡የማ|ነጻነ|ው፡በ|ሆነ፡|ቶች፡|ት፡የ|ው።፡|፡በሚ|ትና፡|ኀብረ|፡መን|ትን፡|ውም፡|ብቻ፡|፡ለመ|ም፡ሰ|ም። |ኛውም|ንኛው|ማንኛ|ንም፡|፡አገ|መብቶ|፡ያለ|እኩል|ረት፡|መንግ|፡ለማ|ት፡በ|ሆን፡|በት፡|፡በተ|ለት፡|፡እኩ|ጋብቻ|ዎች፡|ወንጀ|ህንነ|ደህን|ኩል፡|ማንም| ማን|። ማ|ጠበቅ|ጻነት|ብቶች|፡ልዩ|ራዊ፡|ሰብ፡|ም፡እ|ግኘት|ማግኘ|ች፡በ|ሥራ፡|ነጻ፡|ርድ፡|ፍርድ|፡በሆ|፡ድር|ል፡መ|፡ደህ|ተግባ|፡የሆ|ት፡ወ|በትም|ፈጸም|ር፡ወ|ይነት|ትም፡|፡በመ|፡ሁሉ|ቸው፡|ኘት፡|ማኀበ|የማግ|በር፡|ም፡መ|በኀብ|፡በኀ|ችና፡|፡ኑሮ|፡ሥራ|፡ጊዜ|፡ወን|መሠረ|፡መሠ|ቱን፡|ሕግ፡|ባር፡|ግባር|ነትና|ነቶች|ጻነቶ|ንና፡|ዩነት|ልዩነ|ደረጃ|፡ደረ|ብ፡የ|ዓይነ|፡ዓይ|ይማኖ|ሃይማ|ል። |ነው።|፡ነው|ሁሉ፡|ርት፡|ህርት|ምህር|ትምህ|ንነት|ና፡ለ|በት።|ለበት|አለበ|መሆን|ን፡አ|ን፡ወ|፡መሰ|ብረ፡|፡ብቻ|፡አላ|ርጅት|ድርጅ|ንግሥ|ተባበ|ሎች፡|ሌሎች|የሚያ|ቤተሰ|እንደ|ት፡ድ|፡መሆ|ች፡የ|ትክክ|፡ማን|በሆነ|ሆኑ፡|ን፡መ|።፡ |ት፡ለ|ረግ፡|፡ይህ|ዲጠበ|ንዲጠ|ት፡እ|ነቱ፡|፡በሕ|የሆነ|ጸም፡|በቅ፡|የመኖ|ትም።|ገር፡|፡ከሚ|ው፡ከ|ሩት፡|የኀብ|፡የኀ|ሔራዊ|ብሔራ|፡አስ|ር፡የ|ይገባ|ውን፡|ጥ፡የ|ንስ፡|፡ትም|ኑሮ፡|ን፡ለ|ች፡እ|ሁኔታ|፡ሁኔ|ስት፡|፡በአ|፡ማኀ|ብረሰ|መሰረ|ረ፡ሰ|የሚፈ|ላቸው|አላቸ|መፈጸ|፡ጋብ|ር፡በ|ዜግነ|ችን፡|ጅት፡|የተባ|ነትን|ዚህ፡|ብነት|ገብነ|፡ገብ|ስጥ፡|ውስጥ|፡ውስ|ሰቡ፡|መው፡|ፈጸመ|ጊዜ፡|ት፡ጊ|ሆኖ፡|፡ሆኖ|ፈላጊ|ው፡ለ|ሙሉ፡|ክለኛ|ክክለ|ጀል፡|ንጀል|ሁም፡|ዲሁም|ንዲሁ|፡በግ|ው፡ያ|ታዊ፡|ረታዊ|ንግስ|፡ እ|ደረግ|።፡ይ|ነ፡መ|ነቱን|ንነቱ|ሉ፡በ|በሕግ|፡ተግ|ዓዊ፡|ብዓዊ|ሰብዓ|ም፡ከ|ቅ፡መ|መጠበ|፡መጠ|በነጻ|፡በነ|መኖር|ምበት|አይፈ|ም፡ዓ|፡በማ|ቢሆን|፡ቢሆ|ር፡አ|ገሩ፡|አገሩ|ናል፡|ሽናል|ናሽና|ርናሽ|ተርና|ንተር|ኢንተ|፡የአ|አገር|ንድ፡|አንድ|ህም፡|ና፡ነ|፡ውሳ|ረጃ፡|ኖት፡',
    tir: '፡፡ | መሰ|ሰብ | ሰብ| ኦለ|ኦለዎ|ናይ | ናይ|ዎ፡፡|ለዎ፡|መሰል|ሰል |ሕድሕ|ሕድ |ድሕድ| ሕድ|ይ ም|ል ኦ| ኦብ|ድ ሰ|ትን |ውን |፡ ሕ|ካብ |ኦብ |ወይ | ወይ|ን መ|ብ ዝ| ካብ| መን| ነፃ|ነት |ብ መ|ዝኾነ|ብ ብ| እን|ኾነ | ዝኾ|ን ነ| ምር|ን፡፡|ኹን | እዚ|ርካብ|ምርካ| ኦይ|ይኹን| ይኹ|ታትን|ነፃነ|እዚ |ን ኦ|ሕጊ |ነ ይ|ታት |ት ኦ|ይ ብ|ን ም| ከም|ብ ኦ| ብሕ| ፣ |ንግስ|መንግ| ሃገ|፣ ብ|ዊ መ|ማዕሪ|ስራሕ|ን ን| ንም|ዕሪ | ንክ|ኦዊ |ን ብ|’ውን|መሰላ|ራዊ |ማሕበ|ኦት | ዝተ| ማዕ|ሎም |ርን | ስራ|ተሰብ|ዓት |ነቱ |ብኦዊ|ሰብኦ|ት ወ|ነታት|ላትን|ሕበራ|ልኦት|ካልኦ| ብዘ|ን ዝ|ም፡፡|ርቲ |ህርቲ|ምህር|ትምህ| ትም|ራሕ | ማሕ|ኸውን| ገበ|ብሕጊ|ቱ ን| ብዝ|ፃነታ|ሰላት|ዚ ድ| ኦድ|ዎም፡|ለዎም|ታዊ |እንት|ሪተሰ|ብሪተ|ሕብሪ| ሕብ|ብን |ራት |ን ሰ|ዋን |ኡ’ው|ምኡ’|ከምኡ|፣ ኦ|ርዓት|ስርዓ| ስር|ዕሊ |ን ና|ነትን|ት ና|ይ ኦ|ነፃ |ገሩ |ሃገሩ|ም መ|ንጋገ|ድንጋ| ድን|እንተ|በራዊ| ብማ|ይማኖ|ሃይማ|ኩሎም| ኩሎ|ልን |ክኸው| ክኸ|ት ስ|ን ሓ| ሃይ|ት መ|፡ እ| ካል|እን |ቤተሰ| ቤተ|እዋን| እዋ|በን |ን ዘ|ተደን|መሰሪ|ግስቲ|ን ካ|ሓለዋ| ሓለ|ብዘይ| ምዃ| ሕጊ|ን፣ |ዊ ወ|ፃነት| ዘይ|ሓደ |ን ተ|ት፣ |ናን | ምስ|ፃን |ነፃን| ክብ|፡ ት|ብማዕ|ት ብ|ታውን|ብነፃ| ብነ|ብ ና|ዜግነ| ዜግ|ስታት|ግስታ|ብ ሕ|ዊ ኦ|ብ ን|ባርን|፡ ዝ| ብሓ|ነቲ | ነቲ|ሪጋገ|ገበን|ፍትሓ|ላውን|፣ ከ|ፃኢ |ወፃኢ| ወፃ|ገ ስ|ገገ |ንገገ|ደንገ|ዝተደ|ጊ ካ|ሃገራ|ሰሪታ|ሉ መ|ስቲ |ዚ ብ|ለዋ |ዘይ |ልዕሊ| ልዕ|ድ ኦ|ክብሩ|ዊ ክ|ል እ|ት ክ| ድሕ| ምን|ህይወ|ይፍፀ|ዓለም|፣ ሕ|ብ እ| ምም|ር፣ | ሓደ|፡ ብ|ገ እ|ጋገ |ልዎ |ድልዎ|ኦድል| ብሃ| ብም|ም ብ|ት እ|ባት |ባለ |ዕባለ|ምዕባ| ምዕ| ብር|ድሕነ|ብ ሰ|ሪ ክ|ን ስ|ቱን |ቲ ብ|ዊ ው| ምጥ| መሪ|፣ ም| ምግ|ቱ ወ| ንብ|ር ን|ባር |ምስ |ጉጅለ| ጉጅ|ሕን | ፍት|ን ፍ|ሓዳር| ሓዳ|ንን |ቱ ክ|ገልግ|ተግባ| ተግ|ቡራት|ሕቡራ| ሕቡ|ድብ |ውድብ| ውድ|ዚ መ|ሕታት'
  },
  Hebrew: {
    heb: 'ות |ים |כל | כל|דם |אדם| זכ|ל א|יות| אד|ת ה|י ל|כאי|אי |זכא| של|לא | ול|ל ה|ית |של |רות|או | או|ת ו|ם ז| לא|ויו|ין |ירו|זכו|רה | לה|ת ל|ת ש|ם ל| המ|ון |ו ב| וה|ה ש| הח|ו ל|ותי|חיר|תו |יים|ת ב|נה |את |ת א| וב| במ|וך |ת כ|ה ה|על |א י|לה |ה א|יה | את|דה | על|ם ו|ם ב|ני |ו כ| שו| שה|כות|כוי| לב|בוד|בות|ם ה|בחי| בי|נות|ה ל| הא|אומ|ה ב|ה כ|ה ו|החי|לית|ירה|ת מ|ינו| לע|ן ש|ה מ|לאו|מי |פלי|וה |שוו|ן ו|חינ|ו א|ו ו| הכ|חוק|החו|י ה|ם א|דות|לו |בין|עה | אח|ליה| לפ|ן ל| חו| בנ|נוך|ופש|חופ|ור |וד |הגנ|וק | בכ|ילי| יה| הז|י ו| הי|וא |אלי|ו ה|פי |ולה|ומי|ל מ| הפ|וצי|ך ה|ן ב|ואי|רך |חות|אין|רצו|רבו|ם ש|ליל|יו |שוא| למ|ר א|ן ה| הד| בח|ווה|להג|פני|היה| לח| לו|יבו|לת |נתו| הו|מדי|לל |אחר|ה פ|יא |היא|ללא|זו | בה|רוי| אי|נו |תיה|דו |בני|ל ב|עבו|יאל|ציא|סוצ| סו|ודה| חי|שית|פשי|דרך| דר|הן | הע|חה | בש|וי |תוך|מעש|גנה|הכל|שיו|משפ| עב|יהי|לחי|גבל|שרי| שר|מנו|י ש|דינ| יו| מע|חבר|שהי| זו|זש |הכר|איש|לפי|הם |ם נ|י א|כלל|עות|נשו|ותו|יהן|גוד|יפו|א ב|ארצ| אר|כבו| בז|שה |שות|ק ב| פל|תיו|ריר|והח|סוד|יסו|ת ז|רים|עם |ל ז|אים|ום |ולא| לכ|ישי|ן א|הזכ|ם י|הגב| הג|ונו|ובי|הוא|תה |המד|ד א|ידה| לי|תי |א ל|פול| לש|הפל|א ה| לל| שנ|חרו| בת|ם כ| בע| וש|שר |ובח|השת|ידי| הר|בור|ציב| אמ|ברה|עית|ה ח|הנש| הנ|רחו|זרח|אזר|וחד|מות|ד ל',
    ydd: ' פֿ|ער |ון |ט א|דער| אַ|ן א| או|אַר|און| אױ|ען |ן פ| אי|פֿו|רעכ| רע|עכט|ֿון|ױף |אױף|פֿא| דע|כט |אַ | זײ|זײַ| גע|אָס|ונג|ֿאַ| הא|האָ|ן ד| אָ|ַן | די|אַל|װאָ| װא|נג |אַנ|ניט|אָט|די |ײַן|ָט |אָל|יט |עדע|יעד| יע|ן ז|אָר|רײַ|ָס |מען|באַ| מע| בא|נאַ|טן |זאָ|ַ ר|אָד|ר א|ין |אין|פֿר|ן ג|ר ה|ן װ|ֿרײ|ָדע|יז | זא| צו|ע א|אַצ|איז|ַצי|ַנד|ײַנ|לעכ| פּ|ַפֿ|אַפ| ני| װע|ײט |עזע|געז|טער|ראַ|ָל |אָנ|לאַ|פֿט|מיט|רן |דיק|לן |ן נ|ט ד|בן |ַלע|קט |טיק|שאַ| מי|ענט|ר מ|טלע|אַק|נען|ף א|כער|טאָ|ערע|יע |ַנע|רונ|עכע|יק | דא|יקע|ַרב|יט־|סער|הײט|ַהײ|ײַה|לע |ן ב| זי|ן מ|פּר|גן |עם |ר ג| קײ|ָר | טא|יאָ|ציא|ישע|ע פ|־אי|ט־א|־ני|טאַ|מענ|נגע|אױס|פֿע|דאָ|ן ק|ר פ|עט |ָנא|ר־נ|ער־|ָסע|ציע|ט פ|צו |ג א|ט צ|יקט|יך |זיך|נד |קן |לײַ| גל|װער|זעל|קײט|אָב|קע |כע |יקן| צי|ײנע|ענע|ערן| נא|נדע|נטע|ר ד|ֿט |ן י|ף פ|גען|דור|ס א|ן ל|ן ה|ט װ| שו|עס |ס ז|פּע| לא|קער|אַט|יטע|רע |שע |ונט|ַרא|ל ז|גלײ|לשא|עלש|בעט| דו|עפֿ|כן |שן |ים |שטע|ן ש|נעם|קײנ|אָפ|נט |טעט|ליט| שט|ײטן|ר װ|נטש|רבע|יונ|רך |ורך|ערצ|י פ|רעס| גר|ײַכ|ראָ|ג פ|צי |ם ט|רענ|ק א|ָפּ|לער|אינ|רעל|ֿאָ|ע ר|י א|ַרע|ר ז| כּ|ך א|ציו|רצי|ג ז|ר ב| מא|עמע|צן |נעמ|שפּ|אַן|נטל|ָבן|ַקט|ן צ|גער|ערי| קע|ן ע|עץ |זעץ|לױט| לױ| װי|ם א|אים|ום |טרא|פֿן|ַרז|אומ|מאָ| קו|ַלי|פּא|ליג|ז א|קלא|ף ד|ערש|פֿי|אַש'
  }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/franc@6.1.0/node_modules/franc/index.js
/**
 * @typedef {import('trigram-utils').TrigramTuple} TrigramTuple
 *
 * @typedef Options
 * @property {Array<string>} [only]
 *   Languages to allow.
 * @property {Array<string>} [ignore]
 *   Languages to ignore.
 * @property {number} [minLength=10]
 *   Minimum length to accept.
 */

/* Load `trigram-utils`. */


/* Load `expressions` (regular expressions matching
 * scripts). */


/* Load `data` (trigram information per language,
 * per script). */


/* Maximum sample length. */
const MAX_LENGTH = 2048

/* Minimum sample length. */
const MIN_LENGTH = 10

/* The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary. */
const MAX_DIFFERENCE = 300

const franc_own = {}.hasOwnProperty

/* Construct trigram dictionaries. */

/** @type {string} */
let script

/** @type {Record<string, Record<string, Record<string, number>>>} */
const numericData = {}

for (script in data) {
  if (franc_own.call(data, script)) {
    const languages = data[script]
    /** @type {string} */
    let name

    numericData[script] = {}

    for (name in languages) {
      if (franc_own.call(languages, name)) {
        const model = languages[name].split('|')
        /** @type {Record<string, number>} */
        const trigrams = {}
        let weight = model.length

        while (weight--) {
          trigrams[model[weight]] = weight
        }

        numericData[script][name] = trigrams
      }
    }
  }
}

/**
 * Get the most probable language for the given value.
 *
 * @param {string} [value]
 *   The value to test.
 * @param {Options} [options]
 *   Configuration.
 * @return {string}
 *  The most probable language.
 */
function franc(value, options) {
  return francAll(value, options)[0][0]
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} [value]
 *   The value to test.
 * @param {Options} [options]
 *   Configuration.
 * @return {Array<TrigramTuple>}
 *   An array containing language—distance tuples.
 */
function francAll(value, options = {}) {
  /** @type {Array<string>} */
  // @ts-expect-error: `whitelist` is from long ago.
  const only = [...(options.whitelist || []), ...(options.only || [])]
  /** @type {Array<string>} */
  // @ts-expect-error: `blacklist` is from long ago.
  const ignore = [...(options.blacklist || []), ...(options.ignore || [])]
  const minLength =
    options.minLength !== null && options.minLength !== undefined
      ? options.minLength
      : MIN_LENGTH

  if (!value || value.length < minLength) {
    return und()
  }

  value = value.slice(0, MAX_LENGTH)

  /* Get the script which characters occur the most
   * in `value`. */
  const script = getTopScript(value, expressions)

  /* One languages exists for the most-used script. */
  if (!script[0] || !(script[0] in numericData)) {
    /* If no matches occured, such as a digit only string,
     * or because the language is ignored, exit with `und`. */
    if (!script[0] || script[1] === 0 || !allow(script[0], only, ignore)) {
      return und()
    }

    return singleLanguageTuples(script[0])
  }

  /* Get all distances for a given script, and
   * normalize the distance values. */
  return normalize(
    value,
    getDistances(asTuples(value), numericData[script[0]], only, ignore)
  )
}

/**
 * Normalize the difference for each tuple in
 * `distances`.
 *
 * @param {string} value
 *   Value to normalize.
 * @param {Array<TrigramTuple>} distances
 *   List of distances.
 * @return {Array<TrigramTuple>}
 *   Normalized distances.
 */
function normalize(value, distances) {
  const min = distances[0][1]
  const max = value.length * MAX_DIFFERENCE - min
  let index = -1

  while (++index < distances.length) {
    distances[index][1] = 1 - (distances[index][1] - min) / max || 0
  }

  return distances
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value
 *   Value to check.
 * @param {Record<string, RegExp>} scripts
 *   Top-Scripts.
 * @return {[string|undefined, number]}
 *   Top script and its occurrence percentage.
 */
function getTopScript(value, scripts) {
  let topCount = -1
  /** @type {string|undefined} */
  let topScript
  /** @type {string} */
  let script

  for (script in scripts) {
    if (franc_own.call(scripts, script)) {
      const count = getOccurrence(value, scripts[script])

      if (count > topCount) {
        topCount = count
        topScript = script
      }
    }
  }

  return [topScript, topCount]
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value
 *   Value to check.
 * @param {RegExp} expression
 *   Code-point expression.
 * @return {number}
 *   Float between 0 and 1.
 */
function getOccurrence(value, expression) {
  const count = value.match(expression)

  return (count ? count.length : 0) / value.length || 0
}

/**
 * Get the distance between an array of trigram—count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array<TrigramTuple>} trigrams
 *   An array containing trigram—count tuples.
 * @param {Record<string, Record<string, number>>} languages
 *   Multiple trigrams to test against.
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {Array<TrigramTuple>} An array
 *   containing language—distance tuples.
 */
function getDistances(trigrams, languages, only, ignore) {
  languages = filterLanguages(languages, only, ignore)

  /** @type {Array<TrigramTuple>} */
  const distances = []
  /** @type {string} */
  let language

  if (languages) {
    for (language in languages) {
      if (franc_own.call(languages, language)) {
        distances.push([language, getDistance(trigrams, languages[language])])
      }
    }
  }

  return distances.length === 0 ? und() : distances.sort(franc_sort)
}

/**
 * Get the distance between an array of trigram—count
 * tuples, and a language dictionary.
 *
 * @param {Array<TrigramTuple>} trigrams
 *   An array containing trigram—count tuples.
 * @param {Record<string, number>} model
 *   Object containing weighted trigrams.
 * @return {number}
 *   The distance between the two.
 */
function getDistance(trigrams, model) {
  let distance = 0
  let index = -1

  while (++index < trigrams.length) {
    const trigram = trigrams[index]
    let difference = MAX_DIFFERENCE

    if (trigram[0] in model) {
      difference = trigram[1] - model[trigram[0]] - 1

      if (difference < 0) {
        difference = -difference
      }
    }

    distance += difference
  }

  return distance
}

/**
 * Filter `languages` by removing languages in
 * `ignore`, or including languages in `only`.
 *
 * @param {Record<string, Record<string, number>>} languages
 *   Languages to filter
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {Record<string, Record<string, number>>}
 *   Filtered array of languages.
 */
function filterLanguages(languages, only, ignore) {
  if (only.length === 0 && ignore.length === 0) {
    return languages
  }

  /** @type {Record<string, Record<string, number>>} */
  const filteredLanguages = {}
  /** @type {string} */
  let language

  for (language in languages) {
    if (allow(language, only, ignore)) {
      filteredLanguages[language] = languages[language]
    }
  }

  return filteredLanguages
}

/**
 * Check if `language` can match according to settings.
 *
 * @param {string} language
 *   Languages to filter
 * @param {Array<string>} only
 *   Allowed languages; if non-empty, only included languages are kept.
 * @param {Array<string>} ignore
 *   Disallowed languages; included languages are ignored.
 * @return {boolean}
 *   Whether `language` can match
 */
function allow(language, only, ignore) {
  if (only.length === 0 && ignore.length === 0) {
    return true
  }

  return (
    (only.length === 0 || only.includes(language)) && !ignore.includes(language)
  )
}

/**
 * Create a single `und` tuple.
 */
function und() {
  return singleLanguageTuples('und')
}

/**
 * Create a single tuple as a list of tuples from a given language code.
 *
 * @param {string} language
 * @returns {Array<TrigramTuple>}
 */
function singleLanguageTuples(language) {
  return [[language, 1]]
}

/**
 * Deep regular sort on the number at `1` in both objects.
 *
 * @param {TrigramTuple} a
 * @param {TrigramTuple} b
 */
function franc_sort(a, b) {
  return a[1] - b[1]
}

;// CONCATENATED MODULE: ./content.js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
// TALK TO CHATGPT
// ---------------
// Author		: C. NEDELCU
// Version		: 2.6.2
// Git repo 	: https://github.com/C-Nedelcu/talk-to-chatgpt
// Chat GPT URL	: https://chat.openai.com/chat
// How to use   : https://www.youtube.com/watch?v=VXkLQMEs3lA
// Credits		: C. NEDELCU (code), pixelsoda (GUI), S. James (GUI)

// ----------------------------
// SETTINGS (FEEL FREE TO EDIT)
// ----------------------------
// These are the default settings. Since v1.3, a 'settings' menu allows to change most of the below values in the UI
// Since v1.4, these settings are saved. So there is no need to edit them out anymore.

// Settings for the text-to-speech functionality (the bot's voice)
var CN_TEXT_TO_SPEECH_RATE = 1; // The higher the rate, the faster the bot will speak
var CN_TEXT_TO_SPEECH_PITCH = 1; // This will alter the pitch for the bot's voice

// Indicate a locale code such as 'fr-FR', 'en-US', to use a particular language for the speech recognition functionality (when you speak into the mic)
// If you leave this blank, the system's default language will be used
var CN_WANTED_LANGUAGE_SPEECH_REC = ""; //"fr-FR";

// Determine which word will cause this scrip to stop.
var CN_SAY_THIS_WORD_TO_STOP = "stop";

// Determine which word will cause this script to temporarily pause
var CN_SAY_THIS_WORD_TO_PAUSE = "pause";

// Do we keep listening even when paused, so that we can resume by a vocal command?
var CN_KEEP_LISTENING = true;

// Determine whether messages are sent immediately after speaing
var CN_AUTO_SEND_AFTER_SPEAKING = true;

// Determine whether commas should be ignored as sentence separators
var CN_IGNORE_COMMAS = false;

// Determine which word(s) will cause this script to send the current message (if auto-send disabled)
var CN_SAY_THIS_TO_SEND = "send message now";

// Indicate "locale-voice name" (the possible values are difficult to determine, you should just ignore this and use the settings menu instead)
var CN_WANTED_VOICE_NAME = "";

// Ignore code blocks - anything contained in <pre>
var CN_IGNORE_CODE_BLOCKS = false;

// Use ElevenLabs for TTS
var CN_TTS_ELEVENLABS = false;

// ElevenLabs API key
var CN_TTS_ELEVENLABS_APIKEY = "";

// ElevenLabs voice
var CN_TTS_ELEVENLABS_VOICE = "";

// Statically list ElevenLabs models (easier than to request from API)
var CN_TTS_ELEVENLABS_MODELS = {
  eleven_monolingual_v1: "English only",
  eleven_multilingual_v1: "Multi-language (autodetect)"
};

// Other ElevenLabs settings
var CN_TTS_ELEVENLABS_STABILITY = "";
var CN_TTS_ELEVENLABS_SIMILARITY = "";

// ----------------------------

// -------------------
// CODE (DO NOT ALTER)
// -------------------
var CN_MESSAGE_COUNT = 0;
var CN_CURRENT_MESSAGE = null;
var CN_CURRENT_MESSAGE_SENTENCES = [];
var CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = 0;
var CN_SPEECHREC = null;
var CN_IS_READING = false;
var CN_IS_LISTENING = false;
var CN_FINISHED = false;
var CN_PAUSED = false;
var CN_WANTED_VOICE = null;
var CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = null;
var CN_TIMEOUT_KEEP_SPEECHREC_WORKING = null;
var CN_SPEECH_REC_SUPPORTED = false;
var CN_SPEAKING_DISABLED = false;
var CN_SPEECHREC_DISABLED = false;
var CN_CONVERSATION_SUSPENDED = false;
var CN_BAR_COLOR_FLASH_GREY = false;
var CN_TTS_ELEVENLABS_QUEUE = [];
var CN_IS_CONVERTING = false;
var CN_IS_PLAYING = false;
var CN_CURRENT_AUDIO = null;

// This function will say the given text out loud using the browser's speech synthesis API, or send the message to the ElevenLabs conversion stack
function CN_SayOutLoud(_x) {
  return _CN_SayOutLoud.apply(this, arguments);
}
function _CN_SayOutLoud() {
  _CN_SayOutLoud = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(text) {
    var msgs, _loop2, index;
    return _regeneratorRuntime().wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!text || CN_SPEAKING_DISABLED)) {
            _context2.next = 5;
            break;
          }
          if (CN_SPEECH_REC_SUPPORTED && CN_SPEECHREC && !CN_IS_LISTENING && !CN_PAUSED && !CN_SPEECHREC_DISABLED && !CN_IS_READING) {
            // Check if speech recognition is already running to avoid error
            try {
              console.log("Attempting to start SpeechRecognition");
              CN_SPEECHREC.start();
              CN_IS_LISTENING = true; // Ensure this flag is set to true here
            } catch (error) {
              console.error("Failed to start SpeechRecognition:", error);
            }
          } else {
            console.log("Not starting SpeechRecognition because CN_IS_LISTENING is", CN_IS_LISTENING);
          }
          clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
          CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
          return _context2.abrupt("return");
        case 5:
          // If we are about to speak, stop speech recognition
          if (CN_SPEECHREC && text && !CN_SPEAKING_DISABLED) {
            clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
            console.log("Stopping SpeechRecognition");
            CN_SPEECHREC.stop();
            CN_IS_LISTENING = false; // Ensure this flag is set to false here
          }

          // What is the TTS method?
          if (!CN_TTS_ELEVENLABS) {
            _context2.next = 10;
            break;
          }
          // We are using ElevenLabs, so push message to queue
          DC_setSpokenTextAreaText(text);
          CN_SayOutLoudElevenLabs(text);
          return _context2.abrupt("return");
        case 10:
          // Let's speak out loud with the browser's text-to-speech API
          console.log("[BROWSER] Saying out loud: " + text);
          msgs = [new SpeechSynthesisUtterance()];
          if (!CN_WANTED_VOICE) {
            _context2.next = 17;
            break;
          }
          msgs[0].text = text;
          msgs[0].voice = CN_WANTED_VOICE;
          _context2.next = 24;
          break;
        case 17:
          _context2.next = 19;
          return getUtterances(text);
        case 19:
          msgs = _context2.sent;
          console.log("- CN_SayOutLoud -");
          console.log("Utterances with inferred voices by language:");
          console.log(msgs);
          console.log("- End logging from CN_SayOutLoud -");
        case 24:
          msgs = DC_PrepareUtterances(msgs);

          // chain the utterances together using the onend event callback
          _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2(index) {
            var msg, onend;
            return _regeneratorRuntime().wrap(function _loop2$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  msg = msgs[index];
                  onend = msg.onend;
                  msgs[index].onend = function () {
                    onend();
                    CN_IS_READING = true;
                    window.speechSynthesis.speak(msgs[index + 1]);
                  };
                case 3:
                case "end":
                  return _context.stop();
              }
            }, _loop2);
          });
          index = 0;
        case 27:
          if (!(index < msgs.length - 1)) {
            _context2.next = 32;
            break;
          }
          return _context2.delegateYield(_loop2(index), "t0", 29);
        case 29:
          index++;
          _context2.next = 27;
          break;
        case 32:
          CN_IS_READING = true;
          window.speechSynthesis.speak(msgs[0]);
        case 34:
        case "end":
          return _context2.stop();
      }
    }, _callee);
  }));
  return _CN_SayOutLoud.apply(this, arguments);
}
function DC_PrepareUtterances(utteranceList) {
  var _loop = function _loop(index) {
    utteranceList[index].rate = CN_TEXT_TO_SPEECH_RATE;
    utteranceList[index].pitch = CN_TEXT_TO_SPEECH_PITCH;
    utteranceList[index].onstart = function () {
      DC_setSpokenTextAreaText(utteranceList[index].text);
      // Make border green
      $("#CNStatusBar").css("background", "green");

      // If speech recognition is active, disable it
      if (CN_IS_LISTENING) CN_SPEECHREC.stop();
      if (CN_FINISHED) return;
      CN_IS_READING = true;
      clearTimeout(CN_TIMEOUT_KEEP_SYNTHESIS_WORKING);
      CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = setTimeout(function () {},
      //CN_KeepSpeechSynthesisActive,
      5000);
    };
    utteranceList[index].onpause = function () {
      DC_setSpokenTextAreaText("");
    };
    utteranceList[index].onerror = function () {
      DC_setSpokenTextAreaText("");
    };
    utteranceList[index].onend = function () {
      DC_setSpokenTextAreaText("");
      CN_AfterSpeakOutLoudFinished();
    };
  };
  for (var index = 0; index < utteranceList.length; index++) {
    _loop(index);
  }
  return utteranceList;
}

// Say a message out loud using ElevenLabs
function CN_SayOutLoudElevenLabs(text) {
  // Make border green
  $("#CNStatusBar").css("background", "green");

  // Push message into queue (sequentially)
  CN_TTS_ELEVENLABS_QUEUE.push({
    index: CN_TTS_ELEVENLABS_QUEUE.length,
    // message index
    text: text,
    // message text
    audio: null,
    // message blob / audio URL to be played
    converted: false,
    // has it been converted to audio yet?
    played: false // has it been played yet?
  });

  // If the TTS conversion task isn't running, run it
  if (!CN_IS_CONVERTING) CN_ConvertTTSElevenLabs();
}

// Process next item in conversion queue
function CN_ConvertTTSElevenLabs() {
  // Start converting TTS
  CN_IS_CONVERTING = true;

  // Identify next message to be converted
  var obj = null;
  var objIndex = null;
  for (var i in CN_TTS_ELEVENLABS_QUEUE) {
    if (!CN_TTS_ELEVENLABS_QUEUE[i].converted) {
      obj = CN_TTS_ELEVENLABS_QUEUE[i];
      objIndex = i;
      break;
    }
  }

  // If we didn't find an object to convert, then we are done
  if (obj === null) {
    CN_IS_CONVERTING = false;
    return;
  }

  // Get model and voice ID
  var parts = CN_TTS_ELEVENLABS_VOICE.split(".");
  var model = parts[0];
  var voiceId = typeof parts[1] == "undefined" ? "" : parts[1];

  // Tell the console for debugging
  console.log("[ELEVENLABS] Converting following text segment to audio using model " + model + " and voice " + voiceId + ": " + obj.text);

  // We found an object to convert
  // Prepare request and headers
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId);
  xhr.setRequestHeader("Accept", "audio/mpeg");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("xi-api-key", CN_TTS_ELEVENLABS_APIKEY);
  xhr.responseType = "arraybuffer";

  // Prepare request body
  var body = {
    text: obj.text,
    model_id: model
  };

  // Set voice settings
  if (CN_TTS_ELEVENLABS_STABILITY != "" || CN_TTS_ELEVENLABS_SIMILARITY != "") {
    // Prepare voice settings
    var voice_settings = {
      stability: 0,
      similarity_boost: 0
    };
    try {
      voice_settings["stability"] = parseFloat(CN_TTS_ELEVENLABS_STABILITY);
      voice_settings["similarity_boost"] = parseFloat(CN_TTS_ELEVENLABS_SIMILARITY);
    } catch (e) {
      voice_settings = {
        stability: 0,
        similarity_boost: 0
      };
    }

    // Control values
    if (voice_settings["stability"] === null || voice_settings["stability"] < 0 || voice_settings["stability"] > 1 || isNaN(voice_settings["stability"])) voice_settings["stability"] = 0;
    if (voice_settings["similarity_boost"] === null || voice_settings["similarity_boost"] < 0 || voice_settings["similarity_boost"] > 1 || isNaN(voice_settings["similarity_boost"])) voice_settings["similarity_boost"] = 0;

    // Set values into body
    body["voice_settings"] = voice_settings;
  }

  // What happens when we get the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      try {
        var status = xhr.status;
        console.log("Received status from ElevenLabs: " + status);

        // Read response and see what's inside
        var resp = this.response;

        // Was there an error?
        try {
          if (status !== 200) {
            // Decode the arrayBuffer into text
            var decoder = new TextDecoder("utf-8");
            var responseText = decoder.decode(resp);

            // Parse the JSON data
            var result = JSON.parse(responseText);

            // Problem?
            if (typeof result.detail != "undefined" && typeof result.detail.status != "undefined") {
              // Error! But what is it?
              if (result.detail.status == "too_many_concurrent_requests") {
                // Try again after 1 second
                setTimeout(function () {
                  console.log("[ELEVENLABS] Too many concurrent requests");
                  CN_ConvertTTSElevenLabs();
                }, 1000);
                return;
              } else {
                // Show error and stop everything
                CN_IS_CONVERTING = false;
                CN_IS_READING = false;
                CN_TTS_ELEVENLABS_QUEUE = [];
                alert("[1] ElevenLabs API error: " + result.detail.message);
                CN_AfterSpeakOutLoudFinished();
                return;
              }
            } else {
              CN_IS_CONVERTING = false;
              CN_IS_READING = false;
              CN_TTS_ELEVENLABS_QUEUE = [];
              alert("[2] ElevenLabs API error: " + responseText);
              CN_AfterSpeakOutLoudFinished();
              return;
            }
          }
        } catch (e) {
          CN_IS_CONVERTING = false;
          CN_IS_READING = false;
          CN_TTS_ELEVENLABS_QUEUE = [];
          alert("[3] ElevenLabs API error: " + e.toString());
          CN_AfterSpeakOutLoudFinished();
          return;
        }

        // No error. So we have blob data, we can make an audio file
        var blob = new Blob([resp], {
          type: "audio/mpeg"
        });
        var audioURL = window.URL.createObjectURL(blob);

        // Has the queue been reset? (if we clicked Skip, or if we stopped audio playback)
        if (CN_TTS_ELEVENLABS_QUEUE.length == 0) return;
        CN_TTS_ELEVENLABS_QUEUE[objIndex].audio = audioURL;
        CN_TTS_ELEVENLABS_QUEUE[objIndex].converted = true;
        console.log("[ELEVENLABS] Text converted to audio successfully");

        // What's next?
        setTimeout(function () {
          // Continue conversions if any
          CN_ConvertTTSElevenLabs();

          // Start audio playback if not already
          if (!CN_IS_PLAYING) CN_ContinueElevenLabsPlaybackQueue();
        }, 100);
      } catch (e) {
        alert("Error with ElevenLabs API text-to-speech conversion: " + e.toString());
      }
    }
  };

  // Sending to TTS API
  xhr.send(JSON.stringify(body));
}

// Process the next item in the audio queue
function CN_ContinueElevenLabsPlaybackQueue() {
  CN_IS_PLAYING = true;
  CN_IS_READING = true;

  // Identify next message to be played
  var obj = null;
  var objIndex = null;
  for (var i in CN_TTS_ELEVENLABS_QUEUE) {
    if (CN_TTS_ELEVENLABS_QUEUE[i].converted && !CN_TTS_ELEVENLABS_QUEUE[i].played) {
      obj = CN_TTS_ELEVENLABS_QUEUE[i];
      objIndex = i;
      break;
    }
  }

  // If we didn't find an object to play, then we are done
  if (obj === null) {
    CN_IS_PLAYING = false;
    CN_IS_READING = false;

    // Current audio stack complete
    console.log("[ELEVENLABS] Current stack of audio messages complete");

    // If there is no longer anything to convert or to play, we can resume listening
    var canResumeListening = true;
    for (var i in CN_TTS_ELEVENLABS_QUEUE) {
      if (!CN_TTS_ELEVENLABS_QUEUE[i].played || !CN_TTS_ELEVENLABS_QUEUE[i].converted) {
        canResumeListening = false;
        break;
      }
    }

    // Finished playing
    if (canResumeListening) {
      setTimeout(function () {
        CN_AfterSpeakOutLoudFinished();
      }, 250);
    }
    return;
  }
  console.log("[ELEVENLABS] Playback of message " + objIndex + ": " + obj.text);

  // Create audio object, set data
  CN_CURRENT_AUDIO = new Audio();
  CN_CURRENT_AUDIO.src = obj.audio;

  // What happens when ended?
  CN_CURRENT_AUDIO.onended = function () {
    setTimeout(function () {
      // Start audio playback if not already
      CN_ContinueElevenLabsPlaybackQueue();
    }, 100);
  };

  // Annnnd... action!
  CN_CURRENT_AUDIO.play();

  // Mark as played so it doesn't play twice
  CN_TTS_ELEVENLABS_QUEUE[objIndex].played = true;
  CN_TTS_ELEVENLABS_QUEUE[objIndex].audio = null; // Erase audio from memory
}

// Occurs when speaking out loud is finished
function CN_AfterSpeakOutLoudFinished() {
  if (CN_SPEECHREC_DISABLED) return;

  // Make border grey again
  $("#CNStatusBar").css("background", "grey");
  if (CN_FINISHED) return;

  // Finished speaking
  clearTimeout(CN_TIMEOUT_KEEP_SYNTHESIS_WORKING);
  console.log("Finished speaking out loud");

  // restart listening
  CN_IS_READING = false;
  setTimeout(function () {
    if (!window.speechSynthesis.speaking) {
      if (CN_SPEECH_REC_SUPPORTED && CN_SPEECHREC && !CN_IS_LISTENING && !CN_PAUSED && !CN_SPEECHREC_DISABLED && !CN_IS_READING) CN_SPEECHREC.start();
      clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
      CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
    }
  }, 500);
}

// This is a workaround for Chromium's bug in the speech synthesis API (https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts)
function CN_KeepSpeechSynthesisActive() {
  console.log("Keeping speech synthesis active...");
  window.speechSynthesis.pause();
  window.speechSynthesis.resume();
  CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = setTimeout(CN_KeepSpeechSynthesisActive, 5000);
}

// Split the text into sentences so the speech synthesis can start speaking as soon as possible
function CN_SplitIntoSentences(text) {
  var sentences = [];
  var currentSentence = "";
  for (var i = 0; i < text.length; i++) {
    //
    var currentChar = text[i];

    // Add character to current sentence
    currentSentence += currentChar;

    // is the current character a delimiter? if so, add current part to array and clear
    if (
    // Latin punctuation
    currentChar == (CN_IGNORE_COMMAS ? "." : ",") || currentChar == (CN_IGNORE_COMMAS ? "." : ":") || currentChar == "." || currentChar == "!" || currentChar == "?" || currentChar == (CN_IGNORE_COMMAS ? "." : ";") || currentChar == "…" ||
    // Chinese/japanese punctuation
    currentChar == (CN_IGNORE_COMMAS ? "." : "、") || currentChar == (CN_IGNORE_COMMAS ? "." : "，") || currentChar == "。" || currentChar == "．" || currentChar == "！" || currentChar == "？" || currentChar == (CN_IGNORE_COMMAS ? "." : "；") || currentChar == (CN_IGNORE_COMMAS ? "." : "：")) {
      if (currentSentence.trim() != "") sentences.push(currentSentence.trim());
      currentSentence = "";
    }
  }
  return sentences;
}

// Check for new messages the bot has sent. If a new message is found, it will be read out loud
function CN_CheckNewMessages() {
  // Any new messages?
  var currentMessageCount = jQuery(".text-base").length;
  if (currentMessageCount > CN_MESSAGE_COUNT) {
    // New message!
    console.log("New message detected! currentMessageCount: " + currentMessageCount);
    CN_MESSAGE_COUNT = currentMessageCount;
    CN_CURRENT_MESSAGE = jQuery(".text-base:last").find(".items-start");
    CN_CURRENT_MESSAGE_SENTENCES = []; // Reset list of parts already spoken
    CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = 0;
  }

  // Split current message into parts
  if (CN_CURRENT_MESSAGE && CN_CURRENT_MESSAGE.length) {
    var currentText = jQuery(".text-base:last").find(".items-start").text() + "";
    //console.log("currentText:" + currentText);

    // Remove code blocks?
    if (CN_IGNORE_CODE_BLOCKS) {
      currentText = jQuery(".text-base:last").find(".items-start").find(".markdown").contents().not("pre").text();
      //console.log("[CODE] currentText:" + currentText);
    }

    var newSentences = CN_SplitIntoSentences(currentText);
    if (newSentences != null && newSentences.length != CN_CURRENT_MESSAGE_SENTENCES.length) {
      //console.log("[NEW SENTENCES] newSentences:" + newSentences.length);
      // There is a new part of a sentence!
      var nextRead = CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ;
      for (var i = nextRead; i < newSentences.length; i++) {
        CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = i + 1;
        var lastPart = newSentences[i];
        //console.log("Will say sentence out loud: "+lastPart);
        CN_SayOutLoud(lastPart);
      }
      CN_CURRENT_MESSAGE_SENTENCES = newSentences;
    }
  }
  setTimeout(CN_CheckNewMessages, 100);
}
function DC_setSpokenTextAreaText(transcript) {
  try {
    var speechTransElement = document.getElementById("DCTTGPTSpokenTextArea");
    speechTransElement.innerHTML = transcript;
  } catch (error) {
    console.error("Couldn't dispay spoken text.");
  }
}

// Send a message to the bot (will simply put text in the textarea and simulate a send button click)
function CN_SendMessage(text) {
  // Put message in textarea
  jQuery("#prompt-textarea").focus();
  var existingText = jQuery("#prompt-textarea").val();

  // Is there already existing text?
  if (!existingText) CN_SetTextareaValue(text);else CN_SetTextareaValue(existingText + " " + text);

  // Change height in case
  var fullText = existingText + " " + text;
  var rows = Math.ceil(fullText.length / 88);
  var height = rows * 24;
  jQuery("#prompt-textarea").css("height", height + "px");

  // Send the message, if autosend is enabled
  jQuery("#prompt-textarea").closest("div").find("button").prop("disabled", false);
  if (CN_AUTO_SEND_AFTER_SPEAKING) {
    jQuery("#prompt-textarea").closest("div").find("button").click();

    // Stop speech recognition until the answer is received
    if (CN_SPEECHREC) {
      clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
      CN_SPEECHREC.stop();
    }
  } else {
    // No autosend, so continue recognizing
    clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
    CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
  }
}

// Flash the red bar
function CN_FlashRedBar() {
  clearTimeout(CN_TIMEOUT_FLASHBAR);

  // Conversation no longer suspended?
  if (!CN_CONVERSATION_SUSPENDED) {
    return;
  }

  // Is it green? don't do anything
  if (CN_IS_READING) {
    // Ignore
  } else if (CN_BAR_COLOR_FLASH_GREY) {
    // Grey? switch to red
    $("#CNStatusBar").css("background", "red");
    CN_BAR_COLOR_FLASH_GREY = false;
  } else {
    // Anything else? switch to grey
    $("#CNStatusBar").css("background", "grey");
    CN_BAR_COLOR_FLASH_GREY = true;
  }

  // Set another timeout
  CN_TIMEOUT_FLASHBAR = setTimeout(function () {
    CN_FlashRedBar();
  }, 500);
}

// Resume after suspension
function CN_ResumeAfterSuspension() {
  // Make a beep sound
  setTimeout(function () {
    // Credits: https://freesound.org/people/plasterbrain/sounds/419493/
    var snd = new Audio("data:audio/mpeg;base64,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OQAgKNwAUMrdjVn1//OEZAwMVMMuzzeyLxHJgoZeFqaKXlFPKH3UMEIXmJkbmIQPBAIr2eWTvwzssgYujuBheiNzev18A/vV3Uykchs5KYpgqPhuSTYDLClSJGqR76///U0oi4f/dkhmhs/9vb//////////9x9YDhAAgG0ww//XnAJD4T4sMIgNrH/1nBBpYAe8/smSK1LMKiaJlRsA4YHzothuz/b239X+ZFP/9ZASr/kf/89////2kPav/7UCA4AG4HH79MuS+HHL//OEZA0LqMEmKzeSPBKRhkweF06YToGhUdYqBxYqmGwIgqy6BYHYYDQiYHIphYALNgadtc7yGv/DPCNgAAiQEb4qAAwiizA9WA9kPgGXJgvmiD////of/y6e//////////T///oAVGoA/N+cFTtYMdQkDi8aFO26SVt0KgPmXUghAYBwAuNFabHLmv/+dsLLRLdVN0EDwa+DYnNBM1d1vvP///+d9vsgDgz//u+7/pUCALwAMAh/94V5RDbgICwA//OEZBAKoMEoLyuzLhW5hkmeFwSYFRljARjmBJeptYtO2rLlGRALmCgIsGh2mxyx7S/+9bmniU1cpUxgUKJjMOYLpFGJErHnX////R229bKHKKv////////rIQAwCyAbDtjc85A8YWOaOSBiQRphP7LqWedkCggwt3DDgXCAMy2HqW1S2pfrHWOVKXORGa6jyYHPR61vlrmuxql7////+/pqf0/aAjf6P/////27UcXSEhQeba6OwHOP+0xPswiC//OEZA8LbGsaBjRdBRNJglG+ByBcM15o02rHgw+BcDAklaxZghd8wQDA1XoozXCp44lXrb19b//WcsGQFFgDb1KcwMIg5aFhJx04hXqA+7/9dmQKu//1//////01//+uUSBAAIANsOAN4V6lPEGBiAKGB5oaTArBpbTXaSG1uGXUaAi04tNjlvLcs/+Z6rrtaZRvABRWYDSgDWMwX0E0P///tX9/raUm6v//9fVamiwBCuAYYAu/I84hTxhw05AC//N0ZBEK7MEivxe1OBMQ0lGWDvJqD5k85ZigASar9RmagNfAqEJgLGJiICCFLrS21ikyvUYhgYR8QURyACRAOkoULNEBLyKSf9Tf/+r7/W05///+39wr////vUEgBBfgAT+eAeFPLH7SxOr4ThSwHArEn9lVDBCO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");
    snd.play();
  }, 100);

  // Finish alternating colors, reset to grey
  clearTimeout(CN_TIMEOUT_FLASHBAR);
  $("#CNStatusBar").css("background", "grey");

  // Hide suspend area
  jQuery("#CNSuspendedArea").hide();

  // Say OK and resume conversation
  CN_PAUSED = false;
  CN_CONVERSATION_SUSPENDED = false;
}

// Start speech recognition using the browser's speech recognition API
function CN_StartSpeechRecognition() {
  if (CN_IS_READING) {
    clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
    CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
    return;
  }
  if (!CN_SPEECH_REC_SUPPORTED) return;
  CN_SPEECHREC = "webkitSpeechRecognition" in window ? new webkitSpeechRecognition() : new SpeechRecognition();
  CN_SPEECHREC.continuous = true;
  CN_SPEECHREC.lang = CN_WANTED_LANGUAGE_SPEECH_REC;
  CN_SPEECHREC.onstart = function () {
    // Make bar red
    $("#CNStatusBar").css("background", "red");
    CN_IS_LISTENING = true;
    console.log("I'm listening");
  };
  CN_SPEECHREC.onend = function () {
    // Make border grey again
    $("#CNStatusBar").css("background", "grey");
    CN_IS_LISTENING = false;
    console.log("I've stopped listening");
  };
  CN_SPEECHREC.onerror = function () {
    CN_IS_LISTENING = false;
    console.log("Error while listening");
  };
  CN_SPEECHREC.onresult = function (event) {
    var final_transcript = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) final_transcript += event.results[i][0].transcript;
    }
    DC_setSpokenTextAreaText(final_transcript);
    console.log("Voice recognition: '" + final_transcript + "'");

    // Empty? https://github.com/C-Nedelcu/talk-to-chatgpt/issues/72
    if (final_transcript.trim() == "") {
      console.log("Empty sentence detected, ignoring");
      return;
    }
    if (CN_RemovePunctuation(final_transcript) == CN_SAY_THIS_WORD_TO_STOP.toLowerCase().trim()) {
      if (CN_CONVERSATION_SUSPENDED) {
        console.log("Conversation is currently suspended, voice command ignored. Use the pause word to resume conversation.");
        return;
      }
      console.log("You said '" + CN_SAY_THIS_WORD_TO_STOP + "'. Conversation ended");
      CN_FINISHED = true;
      CN_PAUSED = false;
      CN_SPEECHREC.stop();
      CN_SayOutLoud("Bye bye");
      alert("Conversation ended. Click the Start button to resume");

      // Show start button, hide action buttons
      jQuery(".CNStartZone").show();
      jQuery(".CNActionButtons").hide();
      return;
    } else if (CN_RemovePunctuation(final_transcript) == CN_SAY_THIS_WORD_TO_PAUSE.toLowerCase().trim() ||
    // Below: allow to say the pause word twice
    CN_RemovePunctuation(final_transcript) == CN_SAY_THIS_WORD_TO_PAUSE.toLowerCase().trim() + " " + CN_SAY_THIS_WORD_TO_PAUSE.toLowerCase().trim()) {
      // Conversation was suspended: resume it
      if (CN_CONVERSATION_SUSPENDED) {
        console.log("You said '" + CN_SAY_THIS_WORD_TO_PAUSE + "' - Conversation resumed");
        CN_ResumeAfterSuspension();
        return;
      }

      // Conversation wasn't suspended;
      console.log("You said '" + CN_SAY_THIS_WORD_TO_PAUSE + "' - Conversation paused");

      // Make a beep sound
      setTimeout(function () {
        // Credits: https://freesound.org/people/BeezleFM/sounds/512135/
        var snd = new Audio("data:audio/mpeg;base64,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");
        snd.play();
      }, 100);

      // Do we keep listening?
      if (CN_KEEP_LISTENING) {
        // Yes, don't stop mic, just stop conversation
        CN_CONVERSATION_SUSPENDED = true;
        CN_TIMEOUT_FLASHBAR = setTimeout(function () {
          CN_FlashRedBar();
        }, 500);

        // Show suspend area
        jQuery("#CNSuspendedArea").show();
        return;
      } else {
        // No, stop mic, resume when OK button is clicked
        CN_PAUSED = true;
        if (CN_SPEECHREC) CN_SPEECHREC.stop();
        alert("Conversation paused, the browser is no longer listening. Click OK to resume");
        CN_PAUSED = false;
        console.log("Conversation resumed");
      }
      return;
    } else if (CN_RemovePunctuation(final_transcript) == CN_SAY_THIS_TO_SEND.toLowerCase().trim() && !CN_AUTO_SEND_AFTER_SPEAKING) {
      if (CN_CONVERSATION_SUSPENDED) {
        console.log("Conversation is currently suspended, voice command ignored. Use the pause word to resume conversation.");
        return;
      }
      console.log("You said '" + CN_SAY_THIS_TO_SEND + "' - the message will be sent");

      // Click button
      jQuery("#prompt-textarea").closest("div").find("button").click();

      // Stop speech recognition until the answer is received
      if (CN_SPEECHREC) {
        clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
        CN_SPEECHREC.stop();
      }
      return;
    }

    // Are we speaking?
    if (CN_CONVERSATION_SUSPENDED) {
      console.log("Conversation is currently suspended, voice command ignored. Use the pause word to resume conversation.");
      return;
    }

    // Send the message
    CN_SendMessage(final_transcript);
  };
  if (!CN_IS_LISTENING && CN_SPEECH_REC_SUPPORTED && !CN_SPEECHREC_DISABLED && !CN_IS_READING) CN_SPEECHREC.start();
  clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
  CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
}

// Make sure the speech recognition is turned on when the bot is not speaking
function CN_KeepSpeechRecWorking() {
  if (CN_FINISHED) return; // Conversation finished
  clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
  CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 100);
  if (!CN_IS_READING && !CN_IS_LISTENING && !CN_PAUSED) {
    if (!CN_SPEECHREC && !CN_IS_READING) CN_StartSpeechRecognition();else {
      if (!CN_IS_LISTENING) {
        try {
          if (CN_SPEECH_REC_SUPPORTED && !window.speechSynthesis.speaking && !CN_SPEECHREC_DISABLED && !CN_IS_READING) CN_SPEECHREC.start();
        } catch (e) {}
      }
    }
  }
}

// Toggle button clicks: settings, pause, skip...
function CN_ToggleButtonClick() {
  var action = $(this).data("cn");
  switch (action) {
    // Open settings menu
    case "settings":
      CN_OnSettingsIconClick();
      return;

    // The microphone is on. Turn it off
    case "micon":
      // Show other icon and hide this one
      $(this).css("display", "none");
      $(".CNToggle[data-cn=micoff]").css("display", "");

      // Disable speech rec
      CN_SPEECHREC_DISABLED = true;
      if (CN_SPEECHREC && CN_IS_LISTENING) CN_SPEECHREC.stop();
      return;

    // The microphone is off. Turn it on
    case "micoff":
      // Show other icon and hide this one
      $(this).css("display", "none");
      $(".CNToggle[data-cn=micon]").css("display", "");

      // Enable speech rec
      CN_SPEECHREC_DISABLED = false;
      if (CN_SPEECHREC && !CN_IS_LISTENING && !CN_IS_READING) CN_SPEECHREC.start();
      return;

    // The bot's voice is on. Turn it off
    case "speakon":
      // Show other icon and hide this one
      $(this).css("display", "none");
      $(".CNToggle[data-cn=speakoff]").css("display", "");
      CN_SPEAKING_DISABLED = true;

      // Is there anything in the CN_TTS_ELEVENLABS_QUEUE ? clear it
      if (CN_TTS_ELEVENLABS_QUEUE.length) {
        CN_TTS_ELEVENLABS_QUEUE = [];
        if (CN_CURRENT_AUDIO) CN_CURRENT_AUDIO.pause();
        CN_CURRENT_AUDIO = null;
        CN_IS_PLAYING = false;
        CN_IS_READING = false;
        CN_IS_CONVERTING = false;
      }

      // Stop current message (equivalent to 'skip')
      window.speechSynthesis.pause(); // Pause, and then...
      window.speechSynthesis.cancel(); // Cancel everything
      CN_CURRENT_MESSAGE = null; // Remove current message

      // Restart listening maybe?
      if (!CN_SPEECHREC_DISABLED) {
        setTimeout(function () {
          CN_AfterSpeakOutLoudFinished();
        }, 100);
      }
      return;

    // The bot's voice is off. Turn it on
    case "speakoff":
      // Show other icon and hide this one
      $(this).css("display", "none");
      $(".CNToggle[data-cn=speakon]").css("display", "");
      CN_SPEAKING_DISABLED = false;
      return;

    // Skip current message being read
    case "skip":
      // Is there anything in the CN_TTS_ELEVENLABS_QUEUE ?  clear it
      if (CN_TTS_ELEVENLABS_QUEUE.length) {
        CN_TTS_ELEVENLABS_QUEUE = [];
        if (CN_CURRENT_AUDIO) CN_CURRENT_AUDIO.pause();
        CN_CURRENT_AUDIO = null;
        CN_IS_PLAYING = false;
        CN_IS_READING = false;
        CN_IS_CONVERTING = false;
      }
      window.speechSynthesis.pause(); // Pause, and then...
      window.speechSynthesis.cancel(); // Cancel everything
      CN_CURRENT_MESSAGE = null; // Remove current message

      // Restart listening maybe?
      if (!CN_SPEECHREC_DISABLED) {
        setTimeout(function () {
          CN_AfterSpeakOutLoudFinished();
        }, 100);
      }
      return;
  }
}
function CN_SetTextareaValue(text) {
  var textarea = jQuery("#prompt-textarea")[0];
  function setNativeValue(element, value) {
    var _ref = Object.getOwnPropertyDescriptor(element, "value") || {},
      valueSetter = _ref.set;
    var prototype = Object.getPrototypeOf(element);
    var _ref2 = Object.getOwnPropertyDescriptor(prototype, "value") || {},
      prototypeValueSetter = _ref2.set;
    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error("The given element does not have a value setter");
    }
  }
  setNativeValue(textarea, text);
  textarea.dispatchEvent(new Event("input", {
    bubbles: true
  }));
}

// Start Talk-to-ChatGPT (Start button)
function CN_StartTTGPT() {
  // Play sound & start
  var snd = new Audio("data:audio/mpeg;base64,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");
  snd.play();
  CN_FINISHED = false;

  // Hide start button, show action buttons
  jQuery(".CNStartZone").hide();
  jQuery(".CNActionButtons").show();
  setTimeout(function () {
    // Start speech rec
    CN_StartSpeechRecognition();

    // Make sure message count starts from last; we don't want to read the latest message
    var currentMessageCount = jQuery(".text-base").length;
    if (currentMessageCount > CN_MESSAGE_COUNT) {
      // New message!
      CN_MESSAGE_COUNT = currentMessageCount;
      CN_CURRENT_MESSAGE = null; // Set current message to null
    }

    // Check for new messages
    CN_CheckNewMessages();
  }, 250);
}

// Check we are on the correct page
function CN_CheckCorrectPage() {
  console.log("Checking we are on the correct page...");
  var wrongPage = jQuery("#prompt-textarea").length == 0; // no textarea... login page?

  if (wrongPage) {
    // We are on the wrong page, keep checking
    setTimeout(CN_CheckCorrectPage, 1000);
  } else {
    // We are on the right page, let's go!
    CN_InitScript();
  }
}

/**
 * compares the x and y coordinates of the given object and returns an object, which has the lowest for each coordinate.
 *
 * ---
 * @param *Object* {**x**: *int*, **y**: *int*} p1 - An Object with x and y properties in px.
 * @param *Object* {**x**: *int*, **y**: *int*} p2 - An Object with x and y properties in px.
 * @param *int* x_offset - offset to be added after the minimum is calculated in px.
 * @param *int* y_offset - offset to be added after the minimum is calculated in px.
 *
 * ---
 * @returns {Object {**x**: *int*, **y**: *int*} - An Object with x and y properties in px.
 */
function DC_minPos(p1, p2) {
  var x_offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y_offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var result = {
    x: Math.min(p1.x, p2.x) + x_offset,
    y: Math.min(p1.y, p2.y) + y_offset
  };
  return result;
}

/**
 * compares the x and y coordinates of the given object and returns an object, which has the highest for each coordinate.
 *
 * ---
 * @param *Object* {**x**: *int*, **y**: *int*} p1 - An Object with x and y properties in px.
 * @param *Object* {**x**: *int*, **y**: *int*} p2 - An Object with x and y properties in px.
 * @param *int* x_offset - offset to be added after the maximum is calculated in px.
 * @param *int* y_offset - offset to be added after the maximum is calculated in px.
 *
 * ---
 * @returns {Object {**x**: *int*, **y**: *int*} - An Object with x and y properties in px.
 */
function DC_maxPos(p1, p2) {
  var x_offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y_offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var result = {
    x: Math.max(p1.x, p2.x) + x_offset,
    y: Math.max(p1.y, p2.y) + y_offset
  };
  return result;
}

/**
 * Gets the maximum x and y coordinates in pixels for the current viewport.
 *
 * ---
 * @returns {Object {**x**: *int*, **y**: *int*} - An Object with x and y properties in px.
 */
function DC_getMaxPos() {
  var maxX = window.innerWidth;
  var maxY = window.innerHeight;
  return {
    x: maxX,
    y: maxY
  };
}
/**
 * Retrieves the DOM element with the ID "#TTGPTSettings" if it exists, or returns undefined if not found.
 *
 * @returns *HTMLElement | undefined* - The DOM element with the ID "#TTGPTSettings", or undefined if not found.
 */
function DC_getTTGPTSettingsElOrUndefined() {
  var ttgptSettingsEl = document.getElementById("TTGPTSettings");
  if (ttgptSettingsEl === undefined || ttgptSettingsEl === null) {
    return undefined;
  }
  return ttgptSettingsEl;
}

/**
 * Retrieves the width and height of an element with the ID "TTGPTSettings".
 *
 * ---
 * @returns {Object {**width**: *int*, **height**: *int*} - An Object with width and height properties in px.
 */
function DC_getTTGPTSettingsSize() {
  var ttgptSettingsEl = DC_getTTGPTSettingsElOrUndefined();
  if (ttgptSettingsEl === undefined) {
    return {
      width: 0,
      height: 0
    };
  }

  // Get the width and height of the element
  var width = ttgptSettingsEl.offsetWidth;
  var height = ttgptSettingsEl.offsetHeight;

  // Return the width and height
  return {
    width: width,
    height: height
  };
}
/**
 * Retrieves position information for #TTGPTSettings from local storage.
 *
 * This function attempts to fetch the size information associated with the key
 * "#TTGPTSettings.size" from local storage. If the key is not present or the JSON parsing
 * fails, default values for position (width: 0, height: 0) are used.
 * ---
 * @returns {Object} Object {**width**: *int*, **height**: *int*} - An Object with width and height properties in px.
 */
function DC_getLocalStrageSize() {
  var sizeObj;
  var defaultSizeObject = {
    width: 0,
    height: 0
  };

  // Check if local storage is available in the browser
  if (typeof localStorage === "undefined") {
    // console.log("- Logging from DC_fetchPostitionFromLocalStrage -");
    // console.error("Tried getting the position of #TTGPTSettings but from local storage but Local storage is not supported in this browser.");
    // console.log("- End logging from DC_fetchPostitionFromLocalStrage -");
    return defaultSizeObject;
  }

  // Get the JSON string from local storage
  var jsonStr = localStorage.getItem("#TTGPTSettings.size");
  // Parse the JSON string to an object or use default values
  sizeObj = JSON.parse(jsonStr);
  if (sizeObj == null) {
    sizeObj = defaultSizeObject;
  }
  return sizeObj;
}

/**
 * Retrieves position information for #TTGPTSettings from local storage.
 *
 * This function attempts to fetch the position information associated with the key
 * "#TTGPTSettings.pos" from local storage. If the key is not present or the JSON parsing
 * fails, default values for position (x: 8, y: 16) are used.
 * ---
 * @returns {Object} Object {**x**: *int*, **y**: *int*} - An Object with x and y properties in px.
 */
function DC_getLocalStoragePostition() {
  var posObj;
  var defaultPosObject = {
    x: window.innerWidth - 8,
    y: 16
  };

  // Check if local storage is available in the browser
  if (typeof localStorage === "undefined") {
    // console.log("- Logging from DC_fetchPostitionFromLocalStrage -");
    // console.error("Tried getting the position of #TTGPTSettings but from local storage but Local storage is not supported in this browser.");
    // console.log("- End logging from DC_fetchPostitionFromLocalStrage -");
    return defaultPosObject;
  }

  // Get the JSON string from local storage
  var jsonStr = localStorage.getItem("#TTGPTSettings.pos");
  // Parse the JSON string to an object or use default values
  posObj = JSON.parse(jsonStr);
  if (posObj == null) {
    posObj = defaultPosObject;
  }
  // console.log("- Logging from DC_fetchPostitionFromLocalStrage -");
  // console.log(`Size: {w: ${ttgptSettingsSize.width}, h: ${ttgptSettingsSize.height}}, Pos: {x: ${posObj.x}, y: ${posObj.y}}, maxPos: {x: ${maxPos.x}, y: ${maxPos.y}}`);
  // console.log("- End logging from DC_fetchPostitionFromLocalStrage -");
  return posObj;
}

/**
 * Sets size information in local storage.
 *
 * Sets the size information associated with the key
 * "#TTGPTSettings.size" in local storage. The provided width and height values are expected
 * to be integers.
 * ---
 * @param {number} width - The width value for the element in px.
 * @param {number} height - height value for the element in px.
 */
function DC_setLocalStrageSize(width, height) {
  if (typeof localStorage !== "undefined") {
    // Create an object with x and y properties
    var sizeObj = {
      width: width,
      height: height
    };

    // Convert the object to a JSON string and store it in local storage
    localStorage.setItem("#TTGPTSettings.size", JSON.stringify(sizeObj));
    // console.log("- Logging from DC_setLocalStrageSize -");
    // console.log("DC_setLocalStrageSize: Size set successfully.");
    // console.log("- End logging from DC_setLocalStrageSize -");
  } else {
    // console.log("- Logging from DC_setLocalStrageSize -");
    // console.error("Tried setting the size of #TTGPTSettings in local storage, but Local storage is not supported in this browser.");
    // console.log("- End logging from DC_setLocalStrageSize -");
  }
}

/**
 * Sets position information in local storage.
 *
 * Sets the position information associated with the key
 * "#TTGPTSettings.pos" in local storage. The provided x and y values are expected
 * to be integers.
 * ---
 * @param {number} x - The x-coordinate value for the position in px.
 * @param {number} y - The y-coordinate value for the position in px.
 */
function DC_setLocalStragePostition(x, y) {
  if (typeof localStorage !== "undefined") {
    // Create an object with x and y properties
    var posObj = {
      x: Math.trunc(x),
      y: Math.trunc(y)
    };

    // Convert the object to a JSON string and store it in local storage
    localStorage.setItem("#TTGPTSettings.pos", JSON.stringify(posObj));
    // console.log("- Logging from DC_setLocalStragePostition -");
    // console.log("DC_setLocalStragePostition: Position set successfully.");
    // console.log("- End logging from DC_setLocalStragePostition -");
  } else {
    // console.log("- Logging from DC_setLocalStragePostition -");
    // console.error("Tried setting the position of #TTGPTSettings in local storage, but Local storage is not supported in this browser.");
    // console.log("- End logging from DC_setLocalStragePostition -");
  }
}

/**
 * Sets the visibility for the TTGPT logo to either visible (true) or invisible (false).
 *
 * ---
 * @param {bool} tf - boolean to determine visibility.
 */
function DC_setLocalStorageLogoVisibleStyle(tf) {
  if (typeof localStorage !== "undefined") {
    // Create an object with x and y properties
    var styleString = "";
    if (!tf) {
      styleString = "display: none; ";
    }
    localStorage.setItem("#TTGPTSettings.logoDisplayStyle", styleString);
  } else {
    // console.log("- Logging from DC_setLocalStorageLogoVisibleStyle -");
    // console.error("Tried setting the visibility of #TTGPTSettings' logo, but Local storage is not supported in this browser.");
    // console.log("- End logging from DC_setLocalStorageLogoVisibleStyle -");
  }
}

/**
 * Retrieves the CSS positioning style for the spoken text area based on the logo's visibility.
 *
 * The function checks the local storage for the logo display setting. If the logo display
 * setting is not defined or null, implying the logo is not meant to be visible, the text area
 * will have 'relative' positioning. Otherwise, the text area is set to 'absolute' positioning,
 * indicating the logo is displayed and the text area needs to be positioned accordingly.
 *
 * @returns {string} The CSS position property value for the spoken text area.
 */
function DC_getSpokenTextAreaPositionStyle() {
  var isLogoVisible = localStorage.getItem("#TTGPTSettings.logoDisplayStyle");
  if (isLogoVisible == undefined || isLogoVisible == null) {
    return "position: relative;";
  }
  return "position: absolute;";
}

/**
 * Retrieves an inline style string determining the visibility of the logo of #TTGPTSettings from local storage.
 *
 * This function attempts to fetch the style string associated with the key
 * "#TTGPTSettings.logoDisplayStyle" from local storage. If the key is not present,
 * defaults to empty string ("")
 * ---
 * @returns {String} *string* - A css inline style string like "display: none" or empty string
 */
function DC_getLocalStorageLogoVisibleStyle() {
  var styleString;
  var defaultStyleString = "";

  // Check if local storage is available in the browser
  if (typeof localStorage === "undefined") {
    // console.log("- Logging from DC_getLogoVisibleStyle -");
    // console.error("Tried getting the display style for the logo of #TTGPTSettings but from local storage is not supported in this browser.");
    // console.log("- End logging from DC_getLogoVisibleStyle -");
    return defaultStyleString;
  }

  // Get string from local storage
  var styleString = localStorage.getItem("#TTGPTSettings.logoDisplayStyle");
  if (styleString == undefined || styleString == null) {
    styleString = defaultStyleString;
  }
  return styleString;
}

/**
 * Ensures that the TTGPT settings element is fully visible within the viewport.
 *
 * ---
 * @param *int* posX - The current x-coordinate position for the TTGPT settings element in px.
 * @param *int* posY - The current y-coordinate position for the TTGPT settings element in px.
 */
function DC_ensureTtgptSettingsVisible() {
  var posX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var posY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var ttgptSettingsEl = DC_getTTGPTSettingsElOrUndefined();
  if (ttgptSettingsEl === undefined) {
    return;
  }
  if (posX === undefined) {
    posX = ttgptSettingsEl.offsetLeft;
  }
  if (posY === undefined) {
    posY = ttgptSettingsEl.offsetTop;
  }
  var ttgptSettingsSize = DC_getTTGPTSettingsSize();
  var maxPos = DC_getMaxPos();
  var ttgptSettingsBounds = {
    x: ttgptSettingsSize.width + posX,
    y: ttgptSettingsSize.height + posY
  };
  var newTtgptSettingsPos = DC_minPos(ttgptSettingsBounds, maxPos, -ttgptSettingsSize.width, -ttgptSettingsSize.height);
  newTtgptSettingsPos = DC_maxPos(newTtgptSettingsPos, {
    x: 32,
    y: 0
  });
  console.log("- Logging from DC_fetchPostitionFromLocalStrage -");
  console.log("Size: {width: ".concat(ttgptSettingsSize.width, ", height: ").concat(ttgptSettingsSize.height, "}, Pos: {x: ").concat(posX, ", y: ").concat(posY, "}, maxPos: {x: ").concat(maxPos.x, ", y: ").concat(maxPos.y, "}"));
  console.log("- End logging from DC_fetchPostitionFromLocalStrage -");
  if (ttgptSettingsEl !== undefined) {
    ttgptSettingsEl.style.left = newTtgptSettingsPos.x + "px";
    ttgptSettingsEl.style.top = newTtgptSettingsPos.y + "px";
    DC_setLocalStragePostition(newTtgptSettingsPos.x, newTtgptSettingsPos.y);
  }
}

/**
 * Adds snap event listeners to the buttons on the side of the settings that control the positioning of the settings area.
 */
function DC_addSnapEventListeners() {
  var snapToTextareaBtn = document.getElementById("DCTTGPTSnapToTextareaBtn");
  var snapToTopRightBtn = document.getElementById("DCTTGPTSnapToTopRightBtn");
  var eventNames = ["click", "touchstart"];
  for (var i = 0; i < eventNames.length; i++) {
    var eventName = eventNames[i];
    snapToTextareaBtn.addEventListener(eventName, function () {
      try {
        //snap the spoken text area to the top of the settings panel and grow upwards
        var spokenTextAreaElement = document.getElementById("DCTTGPTSpokenTextArea");
        spokenTextAreaElement.style.position = "absolute";
      } catch (error) {
        console.error("Couldn't snap DCTTGPT Spoken Text Area to the top of the TTGPT Settings area. Error was:");
        console.error(error);
      }
      try {
        //snap the text area
        var ttgptSettings = document.getElementById("TTGPTSettings");
        var ttgptSettingsBounds = ttgptSettings.getBoundingClientRect();
        var ttgptSettingsSize = {
          width: ttgptSettingsBounds.width,
          height: ttgptSettingsBounds.height
        };
        var promptArea = document.getElementById("prompt-textarea").parentElement;
        var promptAreaBounds = promptArea.getBoundingClientRect();
        var promptAreaPos = {
          x: promptAreaBounds.left,
          y: promptAreaBounds.top
        };
        var promptAreaSize = {
          width: promptAreaBounds.width,
          height: promptAreaBounds.height
        };
        ttgptSettings.style.top = promptAreaPos.y - promptAreaSize.height + "px";
        ttgptSettings.style.left = promptAreaPos.x + "px";
        ttgptSettings.style.width = promptAreaSize.width + "px";
        ttgptSettings.style.height = promptAreaSize.height + "px";
        DC_setLocalStragePostition(promptAreaPos.x, promptAreaPos.y);
        DC_setLocalStrageSize(promptAreaSize.width, promptAreaSize.height);
        DC_setLocalStorageLogoVisibleStyle(false);
        var logoArea = document.getElementById("DCTTGPTLogoArea");
        logoArea.style.display = "none";
      } catch (error) {
        console.error("Couldn't snap TTGPT Settings to the text area. Error was:");
        console.error(error);
      }
      DC_ensureTtgptSettingsVisible();
    });
    snapToTopRightBtn.addEventListener(eventName, function () {
      try {
        //snap the spoken text area to the bottom of the settings panel and grow downwards
        var spokenTextAreaElement = document.getElementById("DCTTGPTSpokenTextArea");
        spokenTextAreaElement.style.position = "relative";
      } catch (error) {
        console.error("Couldn't snap DCTTGPT Spoken Text Area to the top of the TTGPT Settings area. Error was:");
        console.error(error);
      }
      try {
        var logoArea = document.getElementById("DCTTGPTLogoArea");
        logoArea.style.display = "initial";
        var ttgptSettings = document.getElementById("TTGPTSettings");
        ttgptSettings.style.width = "initial";
        ttgptSettings.style.height = "initial";
        var ttgptSettingsBounds = ttgptSettings.getBoundingClientRect();
        var ttgptSettingsSize = {
          width: ttgptSettingsBounds.width,
          height: ttgptSettingsBounds.height
        };
        ttgptSettings.style.top = "16px";
        ttgptSettings.style.left = window.innerWidth - 8 - ttgptSettingsSize.width + "px";
        DC_setLocalStragePostition(window.innerWidth - 8 - ttgptSettingsSize.width, 16);
        DC_setLocalStrageSize(0, 0);
        DC_setLocalStorageLogoVisibleStyle(true);
      } catch (error) {
        console.error("Couldn't snap TTGPT Settings to the text area. Error was:");
        console.error(error);
      }
      DC_ensureTtgptSettingsVisible();
    });
  }
}

// Perform initialization after jQuery is loaded
function CN_InitScript() {
  if ((typeof $ === "undefined" ? "undefined" : _typeof($)) === null || (typeof $ === "undefined" ? "undefined" : _typeof($)) === undefined) $ = jQuery;
  var warning = "";
  if ("webkitSpeechRecognition" in window) {
    console.log("Speech recognition API supported");
    CN_SPEECH_REC_SUPPORTED = true;
  } else {
    console.log("speech recognition API not supported.");
    CN_SPEECH_REC_SUPPORTED = false;
    warning = "\n\nWARNING: speech recognition (speech-to-text) is only available in Chromium-based browsers - desktop version at the moment. If you are using another browser, you will not be able to dictate text, but you can still listen to the bot's responses.";
  }

  // Restore settings
  CN_RestoreSettings();

  // Wait on voices to be loaded before fetching list
  window.speechSynthesis.onvoiceschanged = function () {
    if (!CN_WANTED_VOICE_NAME) {
      console.log("Reading with default browser voice");
    } else {
      speechSynthesis.getVoices().forEach(function (voice) {
        //console.log("Found possible voice: " + voice.name + " (" + voice.lang + ")");
        if (voice.lang + "-" + voice.name == CN_WANTED_VOICE_NAME) {
          CN_WANTED_VOICE = voice;
          console.log("I will read using voice " + voice.name + " (" + voice.lang + ")");
          return false;
        }
      });
      if (!CN_WANTED_VOICE) console.log("No voice found for '" + CN_WANTED_VOICE_NAME + "', reading with default browser voice");
    }

    // Voice OK
    setTimeout(function () {
      //CN_SayOutLoud("OK");
    }, 1000);
  };
  // Load TTGPTSettings position from local storage
  var initialPositionData = DC_getLocalStoragePostition();
  var initialX = initialPositionData.x;
  var initialY = initialPositionData.y;
  var initialSizeData = DC_getLocalStrageSize();
  var initialWidth = initialSizeData.width;
  var initialHeight = initialSizeData.height;
  var widthInlineStyle = "";
  var heightInlineStyle = "";
  if (initialWidth > 0) {
    widthInlineStyle = "width: " + initialWidth + "px;";
  }
  if (initialHeight > 0) {
    heightInlineStyle = "height: " + initialHeight + "px;";
  }
  var logoVisibleInlineStyle = DC_getLocalStorageLogoVisibleStyle();

  // Add icons on the top right corner
  jQuery("body").append("<div style='" + widthInlineStyle + heightInlineStyle + " position: fixed; top: " + initialY + "px; left: " + initialX + "px; display: inline-block; " + "background: #41464c; color: white; padding: 0; font-size: 16px; border-radius: 8px; text-align: center;" + "cursor: move; font-weight: bold; z-index: 1111;' id='TTGPTSettings'>" + "<div style='position: absolute; width: 28px; left: -32px; background: #41464c; border-radius: 8px;'>" + "<button id='DCTTGPTSnapToTextareaBtn' style='margin: 4px; border-radius: 4px; overflow: auto;'>" + "<svg width='100%' viewBox='0 0 90 90' preserveAspectRatio='xMidYMid meet'>" + "<rect x='0' y='0' width='90' height='38' fill='#5e606f' style='opacity: 1;' rx='6' ry='6'></rect>" + "<rect x='0' y='52' width='90' height='38' fill='#b0b7bd' style='opacity: 1;' rx='6' ry='6'></rect>" + "</svg>" + "</button>" + "<button id='DCTTGPTSnapToTopRightBtn' style='margin: 4px; border-radius: 4px; overflow: auto;'>" + "<svg width='100%' viewBox='0 0 90 90' preserveAspectRatio='xMidYMid meet'>" + "<rect x='52' y='0' width='38' height='38' fill='#5e606f' style='opacity: 1;' rx='6' ry='6'></rect>" + "<rect x='0' y='52' width='90' height='38' fill='#b0b7bd' style='opacity: 1;' rx='6' ry='6'></rect>" + "<rect x='0' y='0' width='38' height='90' fill='#b0b7bd' style='opacity: 1;' rx='6' ry='6'></rect>" + "</svg>" + "</button>" + "</div>" +
  // Logo / title
  "<div id='DCTTGPTLogoArea' style='" + logoVisibleInlineStyle + " padding: 4px 40px; border-bottom: 1px solid grey;'>" +
  //4px
  "<a href='https://github.com/C-Nedelcu/talk-to-chatgpt' " + "style='display: inline-block; font-size: 20px; line-height: 80%; padding: 8px 0;' " +
  //20px + 8px
  "target=_blank title='Visit project website'>TALK-TO-ChatGPT<br />" + "<div style='text-align: right; font-size: 12px; color: grey'>V2.6.2</div>" +
  //12px
  "</a>" + "</div>" +
  // Below logo
  "<div>" +
  // Start button
  "<div style='font-size: 16px; padding: 8px;' class='CNStartZone'>" + "<button style='border: 2px solid grey; padding: 6px 40px; margin: 6px; border-radius: 6px; opacity: 0.7;' id='CNStartButton' title='ALT+SHIFT+S'><i class=\"fa-solid fa-play\"></i>&nbsp;&nbsp;START</button>" + "</div>" +
  // Action buttons
  "<div style='font-size: 20px; padding: 12px 8px; padding-bottom: 0px; display:none;' class='CNActionButtons'>" + "<table width='100%' cellpadding=0 cellspacing=0><tr>" + "<td width='24%' style='text-align: center;'>" + "<span class='CNToggle' title='Voice recognition enabled. Click to disable. (Shortcut: ALT+SHIFT+H)' data-cn='micon' style='opacity: 0.7;'><i class=\"fa-solid fa-microphone\"></i></span>" +
  // Microphone enabled
  "<span class='CNToggle' title='Voice recognition disabled. Click to enable. (Shortcut: ALT+SHIFT+H)' style='display:none; color: red; opacity: 0.7;' data-cn='micoff'><i class=\"fa-solid fa-microphone-slash\"></i></span>" +
  // Microphone disabled
  "</td>" + "<td width='1%' style='border-left: 1px solid grey; padding-left: 0 !important; padding-right: 0 !important; font-size: 1px; width: 1px;'>&nbsp;</td>" + "<td width='24%' style='text-align: center;'>" + "<span class='CNToggle' title='Text-to-speech (bot voice) enabled. Click to disable. This will skip the current message entirely. (Shortcut: ALT+SHIFT+V)' data-cn='speakon' style='opacity: 0.7;'><i class=\"fa-solid fa-volume-high\"></i></span>" +
  // Speak out loud
  "<span class='CNToggle' title='Text-to-speech (bot voice) disabled. Click to enable. (Shortcut: ALT+SHIFT+V)' style='display:none; color: red; opacity: 0.7;' data-cn='speakoff'><i class=\"fa-solid fa-volume-xmark\"></i></span>  " +
  // Mute
  "</td>" + "<td width='1%' style='border-left: 1px solid grey; padding-left: 0 !important; padding-right: 0 !important; font-size: 1px; width: 1px;'>&nbsp;</td>" + "<td width='24%' style='text-align: center;'>" + "<span class='CNToggle' title='Skip the message currently being read by the bot. (Shortcut: ALT+SHIFT+L)' data-cn='skip' style='opacity: 0.7;'><i class=\"fa-solid fa-angles-right\"></i></span>" +
  // Skip
  "</td>" + "<td width='1%' style='border-left: 1px solid grey; padding-left: 0 !important; padding-right: 0 !important; font-size: 1px; width: 1px;'>&nbsp;</td>" + "<td width='24%' style='text-align: center;'>" + "<span class='CNToggle' title='Open settings menu to change bot voice, language, and other settings' data-cn='settings' style='opacity: 0.7;'><i class=\"fa-solid fa-sliders\"></i></span>" +
  // Settings
  "</td>" + "</tr></table>" +
  // Colored bar - transparent by default, red when mic on, green when bot speaks
  "<div style='padding-top: 12px; padding-bottom: 6px;'>" + "<div id='CNStatusBar' style='background: grey; width: 100%; height: 8px; border-radius: 4px; overflow: hidden;'>&nbsp;</div>" + "</div>" +
  // Pause bar - click button to resume
  "<div style='padding-top: 12px; padding-bottom: 12px; display: none;' id='CNSuspendedArea'>" + "<div style='font-size: 11px; color: grey;'><b>CONVERSATION PAUSED</b><br />Click button below or speak the pause word to resume</div>" + "<div style='padding: 10px;'>" + "<button style='font-size: 13px; border: 2px solid grey; padding: 6px 40px; margin: 6px; border-radius: 6px; opacity: 0.7;' id='CNResumeButton'><i class=\"fa-solid fa-play\"></i>&nbsp;&nbsp;RESUME</button>" + "</div>" + "</div>" + "</div>" + "</div>" +
  //below below logo
  "<div id='DCTTGPTSpokenTextArea' style='" + DC_getSpokenTextAreaPositionStyle() + " width: 100%; bottom: 100%; font-family: monospace; background-color: #2f3237; line-break: auto; border-radius: 8px;'>" + "　" + "</div>" + "</div>");
  DC_ensureTtgptSettingsVisible();
  window.addEventListener("resize", function () {
    DC_ensureTtgptSettingsVisible();
  });
  DC_addSnapEventListeners();
  setTimeout(function () {
    // Try and get voices
    speechSynthesis.getVoices();

    // Make icons clickable
    jQuery(".CNToggle").css("cursor", "pointer");
    jQuery(".CNToggle").on("click", CN_ToggleButtonClick);
    jQuery("#CNStartButton").on("click", CN_StartTTGPT);
    jQuery("#CNResumeButton").on("click", CN_ResumeAfterSuspension);

    // Make icons change opacity on hover
    jQuery(".CNToggle, #CNStartButton, #CNResumeButton").on("mouseenter", function () {
      jQuery(this).css("opacity", 1);
    });
    jQuery(".CNToggle, #CNStartButton, #CNResumeButton").on("mouseleave", function () {
      jQuery(this).css("opacity", 0.7);
    });
    jQuery(document).on("mouseenter", ".TTGPTSave, .TTGPTCancel", function () {
      jQuery(this).css("opacity", 1);
    });
    jQuery(document).on("mouseleave", ".TTGPTSave, .TTGPTCancel", function () {
      jQuery(this).css("opacity", 0.7);
    });

    // Make TTGPTSettings draggable
    jQuery("#TTGPTSettings").mousedown(function (e) {
      window.my_dragging = {};
      my_dragging.pageX0 = e.pageX;
      my_dragging.pageY0 = e.pageY;
      my_dragging.elem = this;
      my_dragging.offset0 = $(this).offset();
      function handle_dragging(e) {
        var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
        var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
        jQuery(my_dragging.elem).css("right", "");
        jQuery(my_dragging.elem).offset({
          top: top,
          left: left
        });
        DC_ensureTtgptSettingsVisible();
        DC_setLocalStragePostition(left, top);
      }
      function handle_mouseup(e) {
        jQuery("body").off("mousemove", handle_dragging).off("mouseup", handle_mouseup);
      }
      jQuery("body").on("mouseup", handle_mouseup).on("mousemove", handle_dragging);
    });
  }, 100);

  // Start key detection
  jQuery(document).on("keydown", function (e) {
    // Conversation suspended? don't do anything
    if (CN_CONVERSATION_SUSPENDED) return;

    // ALT+SHIFT+S: Start
    if (e.altKey && e.shiftKey && e.which === 83) {
      console.log("ALT+SHIFT+S pressed, starting Talk-To-ChatGPT");
      CN_StartTTGPT();
    }

    // ALT+SHIFT+H: Hush
    if (e.altKey && e.shiftKey && e.which === 72) {
      // Is the current mode 'micon' or 'micoff'?
      var wantMicOff = jQuery(".CNToggle[data-cn=micon]").css("display") == "none";
      if (wantMicOff) {
        // Turn off bot voice
        console.log("ALT+SHIFT+H pressed, turning off speech recognition");
        jQuery(".CNToggle[data-cn=micoff]").click();
      } else {
        // Turn on bot voice
        console.log("ALT+SHIFT+H pressed, turning on speech recognition");
        jQuery(".CNToggle[data-cn=micon]").click();
      }
    }

    // ALT+SHIFT+V: suspend bot Voice
    if (e.altKey && e.shiftKey && e.which === 86) {
      // Is the current mode 'speakon' or 'speakoff'?
      var wantSpeakOff = jQuery(".CNToggle[data-cn=speakon]").css("display") == "none";
      if (wantSpeakOff) {
        // Turn off bot voice
        console.log("ALT+SHIFT+V pressed, turning bot voice off");
        jQuery(".CNToggle[data-cn=speakoff]").click();
      } else {
        // Turn on bot voice
        console.log("ALT+SHIFT+V pressed, turning bot voice on");
        jQuery(".CNToggle[data-cn=speakon]").click();
      }
    }

    // ALT+SHIFT+L: skip current message
    if (e.altKey && e.shiftKey && e.which === 76) {
      console.log("ALT+SHIFT+L pressed, skipping current message");
      jQuery(".CNToggle[data-cn=skip]").click();
    }
  });
}

// Open settings menu
function CN_OnSettingsIconClick() {
  console.log("Opening settings menu");

  // Stop listening
  CN_PAUSED = true;
  if (CN_SPEECHREC) CN_SPEECHREC.stop();

  // A short text at the beginning
  var desc = "<div style='text-align: left; margin: 8px;'>" + "<a href='https://github.com/C-Nedelcu/talk-to-chatgpt/wiki/Status-page' target=_blank style='font-size: 16px; color: orange;'>If something doesn't appear to work, click here for status and troubleshooting</a>." + "<br />Thank you for not instantly posting a 1-star review on the extension store if something doesn't work as expected :-) This is a free program I do in my spare time and I appreciate constructive criticism. Make sure to tell me what's wrong and I will look into it." + "</div>";

  // Prepare settings row
  var rows = "<h2>Language and speech settings</h2>";
  rows += "<table width='100%' cellpadding=6 cellspacing=2 style='margin-top: 15px;'>";

  // 1. Bot's voice
  var voices = "";
  var n = 0;
  SEL = !CN_WANTED_VOICE ? "selected=selected" : "";
  voices += "<option value='" + -1 + "' " + SEL + ">" + "Automatic" + "</option>";
  speechSynthesis.getVoices().forEach(function (voice) {
    var label = "".concat(voice.name, " (").concat(voice.lang, ")");
    if (voice["default"]) label += " — DEFAULT";
    var SEL = CN_WANTED_VOICE && CN_WANTED_VOICE.lang == voice.lang && CN_WANTED_VOICE.name == voice.name ? "selected=selected" : "";
    voices += "<option value='" + n + "' " + SEL + ">" + label + "</option>";
    n++;
  });

  // 4. Speech recognition language CN_WANTED_LANGUAGE_SPEECH_REC
  var languages = "<option value=''></option>";
  for (var i in CN_SPEECHREC_LANGS) {
    var languageName = CN_SPEECHREC_LANGS[i][0];
    for (var j in CN_SPEECHREC_LANGS[i]) {
      if (j == 0) continue;
      var languageCode = CN_SPEECHREC_LANGS[i][j][0];
      var SEL = languageCode == CN_WANTED_LANGUAGE_SPEECH_REC ? "selected='selected'" : "";
      languages += "<option value='" + languageCode + "' " + SEL + ">" + languageName + " - " + languageCode + "</option>";
    }
  }
  rows += "<tr><td style='white-space: nowrap'>Speech recognition language:</td><td><select id='TTGPTRecLang' style='width: 250px; padding: 2px; color: black;' >" + languages + "</select></td></tr>";
  rows += "<tr class='CNBrowserTTS' ><td style='white-space: nowrap'>AI voice and language:</td><td><select id='TTGPTVoice' style='width: 250px; padding: 2px; color: black'>" + voices + "</select></td></tr>";

  // 2. AI talking speed
  rows += "<tr class='CNBrowserTTS' ><td style='white-space: nowrap'>AI talking speed (speech rate):</td><td><input type=number step='.1' id='TTGPTRate' style='color: black; padding: 2px; width: 100px;' value='" + CN_TEXT_TO_SPEECH_RATE + "' /></td></tr>";

  // 3. AI voice pitch
  rows += "<tr class='CNBrowserTTS' ><td style='white-space: nowrap'>AI voice pitch:</td><td><input type=number step='.1' id='TTGPTPitch' style='width: 100px; padding: 2px; color: black;' value='" + CN_TEXT_TO_SPEECH_PITCH + "' /></td></tr>";

  // 4. ElevenLabs
  rows += "<tr><td style='white-space: nowrap'>ElevenLabs text-to-speech:</td><td><input type=checkbox id='TTGPTElevenLabs' " + (CN_TTS_ELEVENLABS ? "checked=checked" : "") + " /> <label for='TTGPTElevenLabs'> Use ElevenLabs API for text-to-speech (tick this to reveal additional settings)</label></td></tr>";

  // 5. ElevenLabs API key
  rows += "<tr class='CNElevenLabs' style='display: none;'><td style='white-space: nowrap'>ElevenLabs API Key:</td><td><input type=text style='width: 250px; padding: 2px; color: black;' id='TTGPTElevenLabsKey' value=\"" + CN_TTS_ELEVENLABS_APIKEY + '" /></td></tr>';

  // 6. ElevenLabs voice
  rows += "<tr class='CNElevenLabs' style='display: none;'><td style='white-space: nowrap'>ElevenLabs voice:</td><td><select id='TTGPTElevenLabsVoice' style='width: 250px; padding: 2px; color: black;' >" + "</select> <span style='cursor: pointer; text-decoration: underline;' id='TTGPTElevenLabsRefresh' title='This will refresh the list of voices using your API key'>Refresh list</span></span></td></tr>";

  // 7. ElevenLabs settings
  rows += "<tr class='CNElevenLabs' style='display: none;'><td style='white-space: nowrap'>ElevenLabs settings:</td>" + "<td>" + "Stability: <input type=number style='width: 100px; padding: 2px; color: black;' step='0.01' min='0' max='1' id='TTGPTElevenLabsStability' value=\"" + CN_TTS_ELEVENLABS_STABILITY + '" />' + "Similarity: <input type=number style='width: 100px; padding: 2px; color: black;' step='0.01' min='0' max='1' id='TTGPTElevenLabsSimilarity' value=\"" + CN_TTS_ELEVENLABS_SIMILARITY + '" />' + "<br />Leave blank for default, or set a number between 0 and 1 (example: 0.75)";
  "</td></tr>";

  // 7. ElevenLabs warning
  rows += "<tr class='CNElevenLabs' style='display: none;'><td colspan=2>Warning: the ElevenLabs API is experimental. It doesn't work with every language, make sure you check the list of supported language from their website. We will keep up with ElevenLabs progress to ensure all ElevenLabs API functionality is available in Talk-to-ChatGPT.</td></tr>";

  // Prepare save/close buttons
  rows += "<tr><td colspan=2 style='text-align: center'><br />" + "<button class='TTGPTSave' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; font-size: 18px; font-weight: bold; opacity: 0.7;'>✓ Save</button>&nbsp;" + "<button class='TTGPTCancel' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; margin-left: 40px; font-size: 18px; opacity: 0.7;'>✗ Cancel</button></td></tr></table>";

  // Header - vocal commands
  rows += "</table><br /><h2>Voice control</h2>";
  rows += "<table width='100%' cellpadding=6 cellspacing=2 style='margin-top: 15px;'>";

  // 5. 'Stop' word
  rows += "<tr><td style='white-space: nowrap'>'Stop' word:</td><td><input type=text id='TTGPTStopWord' style='width: 100px; padding: 2px; color: black;' value='" + CN_SAY_THIS_WORD_TO_STOP + "' /></td></tr>";

  // 6. 'Pause' word
  rows += "<tr><td style='white-space: nowrap'>'Pause' word:</td><td><input type=text id='TTGPTPauseWord' style='width: 100px; padding: 2px; color: black;' value='" + CN_SAY_THIS_WORD_TO_PAUSE + "' /></td></tr>";

  // 7. Keep listening until resume
  rows += "<tr><td style='white-space: nowrap'>Keep listening when paused:</td><td><input type=checkbox id='TTGPTKeepListening' " + (CN_KEEP_LISTENING ? "checked=checked" : "") + " /> <label for='TTGPTKeepListening'>When paused, keep the microphone open, and resume conversation when the 'pause' word (defined above) is spoken</label></td></tr>";

  // 8. Autosend
  rows += "<tr><td style='white-space: nowrap'>Automatic send:</td><td><input type=checkbox id='TTGPTAutosend' " + (CN_AUTO_SEND_AFTER_SPEAKING ? "checked=checked" : "") + " /> <label for='TTGPTAutosend'>Automatically send message to ChatGPT after speaking</label></td></tr>";

  // 9. Manual send word
  rows += "<tr><td style='white-space: nowrap'>Manual send word(s):</td><td><input type=text id='TTGPTSendWord' style='width: 250px; padding: 2px; color: black;' value='" + CN_SAY_THIS_TO_SEND + "' /><span style='font-size: 10px;'>If 'automatic send' is disabled, you can trigger the sending of the message by saying this word (or sequence of words)</span></td></tr>";

  // Prepare save/close buttons
  rows += "<tr><td colspan=2 style='text-align: center'><br />" + "<button class='TTGPTSave' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; font-size: 18px; font-weight: bold; opacity: 0.7;'>✓ Save</button>&nbsp;" + "<button class='TTGPTCancel' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; margin-left: 40px; font-size: 18px; opacity: 0.7;'>✗ Cancel</button></td></tr></table>";

  // Header - advanced options
  rows += "</table><br /><h2>Advanced settings</h2>";
  rows += "<table width='100%' cellpadding=6 cellspacing=2 style='margin-top: 15px;'>";

  // 10. Split sentences with commas
  rows += "<tr><td style='white-space: nowrap'>Punctuation in sentences:</td><td><input type=checkbox id='TTGPTIgnoreCommas' " + (CN_IGNORE_COMMAS ? "checked=checked" : "") + " /> <label for='TTGPTIgnoreCommas'>Don't use commas/semicolons/etc. to break down replies into sentences</label></td></tr>";

  // 11. Ignore code blocks
  rows += "<tr><td style='white-space: nowrap'>Ignore code blocks:</td><td><input type=checkbox id='TTGPTIgnoreCode' " + (CN_IGNORE_CODE_BLOCKS ? "checked=checked" : "") + " /> <label for='TTGPTIgnoreCode'>Don't read blocks of code out loud (ignore them altogether)</label></td></tr>";

  // Keyboard shortcuts
  rows += "<tr><td style='white-space: nowrap'>Keyboard shortcuts:</td><td><ul>" + "<li>ALT+SHIFT+S: <u>S</u>tart Talk-To-ChatGPT</li>" + "<li>ALT+SHIFT+H: suspend/resume speech recognition (<u>H</u>ush)</li>" + "<li>ALT+SHIFT+V: suspend/resume bot's voice (<u>V</u>oice)</li>" + "<li>ALT+SHIFT+L: skip current message (<u>L</u>eap)</li>" + "</ul></td></tr>";

  // Prepare save/close buttons
  rows += "<tr><td colspan=2 style='text-align: center'><br />" + "<button class='TTGPTSave' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; font-size: 18px; font-weight: bold; opacity: 0.7;'>✓ Save</button>&nbsp;" + "<button class='TTGPTCancel' style='border: 2px solid grey; border-radius: 4px; padding: 6px 24px; margin-left: 40px; font-size: 18px; opacity: 0.7;'>✗ Cancel</button></td></tr></table>";

  // Add donations frame
  var donations = "<br/><h2>Support the project</h2><p style='font-size: 15px; margin-top: 15px;'>Are you enjoying Talk-To-ChatGPT and want me to continue improving it? \n" + "\t\t<b>You can help by making a donation to the project.</b> \n" + "\t\tPlease click the button below to proceed.</p><br />\n" + "\t\t<center><a target=_blank href='https://www.paypal.com/donate/?business=BZ43BM7XSSKKW&no_recurring=0&item_name=Are+you+enjoying+Talk-To-ChatGPT?+If+so%2C+consider+making+a+donation+to+keep+the+project+going%2C+and+I%27ll+continue+improving+it%21&currency_code=EUR'>\n" + "\t\t\t<img src='https://edunext.com.sg/paypal.png' alt='' height=80 style='height: 80px;' />\n" + "\t\t</a></center>";

  // Open a whole screenful of settings
  jQuery("body").append("<div style='background: rgba(0,0,0,0.8); position: absolute; overflow-y: auto; top: 0; right: 0; left: 0; bottom: 0; z-index: 999999; padding: 20px; color: white; font-size: 13px;' id='TTGPTSettingsArea'>" + "<div style='width: 600px; margin-left: auto; margin-right: auto; overflow-y: auto;'><h1>⚙️ Talk-to-ChatGPT settings</h1>" + desc + rows + donations + "</div></div>");

  // Assign events
  setTimeout(function () {
    jQuery(".TTGPTSave").on("click", CN_SaveSettings);
    jQuery(".TTGPTCancel").on("click", CN_CloseSettingsDialog);

    // Is ElevenLabs enabled? toggle visibility, refresh voice list
    if (CN_TTS_ELEVENLABS) {
      jQuery(".CNElevenLabs").show();
      jQuery(".CNBrowserTTS").hide();
      CN_RefreshElevenLabsVoiceList(true);
    } else {
      jQuery(".CNElevenLabs").hide();
      jQuery(".CNBrowserTTS").show();
    }

    // When the ElevenLabs option is changed
    jQuery("#TTGPTElevenLabs").on("change", function () {
      if (jQuery(this).prop("checked")) {
        jQuery(".CNElevenLabs").show();
        jQuery(".CNBrowserTTS").hide();
        CN_RefreshElevenLabsVoiceList(true);
      } else {
        jQuery(".CNElevenLabs").hide();
        jQuery(".CNBrowserTTS").show();
      }
    });

    // When the 'Refresh list' button is clicked
    jQuery("#TTGPTElevenLabsRefresh").on("click", function () {
      CN_RefreshElevenLabsVoiceList(true);
    });

    // When the API key is changed
    jQuery("#TTGPTElevenLabsKey").on("change", function () {
      CN_RefreshElevenLabsVoiceList(true);
    });
  }, 100);
}

// Save settings and close dialog box
function CN_SaveSettings() {
  // Save settings
  try {
    // AI voice settings: voice/language, rate, pitch
    var wantedVoiceIndex = jQuery("#TTGPTVoice").val();
    var allVoices = speechSynthesis.getVoices();
    CN_WANTED_VOICE = allVoices[wantedVoiceIndex];
    CN_WANTED_VOICE_NAME = CN_WANTED_VOICE ? CN_WANTED_VOICE.lang + "-" + CN_WANTED_VOICE.name : "";
    CN_TEXT_TO_SPEECH_RATE = Number(jQuery("#TTGPTRate").val());
    CN_TEXT_TO_SPEECH_PITCH = Number(jQuery("#TTGPTPitch").val());

    // Speech recognition settings: language, stop, pause
    CN_WANTED_LANGUAGE_SPEECH_REC = jQuery("#TTGPTRecLang").val();
    CN_SAY_THIS_WORD_TO_STOP = CN_RemovePunctuation(jQuery("#TTGPTStopWord").val());
    CN_SAY_THIS_WORD_TO_PAUSE = CN_RemovePunctuation(jQuery("#TTGPTPauseWord").val());
    CN_KEEP_LISTENING = jQuery("#TTGPTKeepListening").prop("checked");
    CN_AUTO_SEND_AFTER_SPEAKING = jQuery("#TTGPTAutosend").prop("checked");
    CN_SAY_THIS_TO_SEND = CN_RemovePunctuation(jQuery("#TTGPTSendWord").val());
    CN_IGNORE_COMMAS = jQuery("#TTGPTIgnoreCommas").prop("checked");
    CN_IGNORE_CODE_BLOCKS = jQuery("#TTGPTIgnoreCode").prop("checked");

    // ElevenLabs
    CN_TTS_ELEVENLABS = jQuery("#TTGPTElevenLabs").prop("checked");
    CN_TTS_ELEVENLABS_APIKEY = CN_RemovePunctuation(jQuery("#TTGPTElevenLabsKey").val() + "");
    CN_TTS_ELEVENLABS_VOICE = jQuery("#TTGPTElevenLabsVoice").val() + "";
    CN_TTS_ELEVENLABS_STABILITY = jQuery("#TTGPTElevenLabsStability").val();
    CN_TTS_ELEVENLABS_SIMILARITY = jQuery("#TTGPTElevenLabsSimilarity").val();

    // If ElevenLabs is active, and that there is no voice, error out
    if (CN_TTS_ELEVENLABS && !CN_TTS_ELEVENLABS_VOICE) {
      alert("To enable ElevenLabs support, you must select a voice in the dropdown list. Click the Refresh List button. If no voice appears in the list, check your API key. If you are 100% sure your API key is valid, please report the issue on the Github project page, on the Issues tab.");
      return;
    }

    // Apply language to speech recognition instance
    if (CN_SPEECHREC) CN_SPEECHREC.lang = CN_WANTED_LANGUAGE_SPEECH_REC;

    // Save settings in cookie
    var settings = [CN_WANTED_VOICE_NAME, CN_TEXT_TO_SPEECH_RATE, CN_TEXT_TO_SPEECH_PITCH, CN_WANTED_LANGUAGE_SPEECH_REC, CN_SAY_THIS_WORD_TO_STOP, CN_SAY_THIS_WORD_TO_PAUSE, CN_AUTO_SEND_AFTER_SPEAKING ? 1 : 0, CN_SAY_THIS_TO_SEND, CN_IGNORE_COMMAS ? 1 : 0, CN_KEEP_LISTENING ? 1 : 0, CN_IGNORE_CODE_BLOCKS ? 1 : 0, CN_TTS_ELEVENLABS ? 1 : 0, CN_TTS_ELEVENLABS_APIKEY, CN_TTS_ELEVENLABS_VOICE, CN_TTS_ELEVENLABS_STABILITY, CN_TTS_ELEVENLABS_SIMILARITY];
    CN_SetCookie("CN_TTGPT", JSON.stringify(settings));
  } catch (e) {
    alert("Invalid settings values. " + e.toString());
    return;
  }

  // Close dialog
  console.log("Closing settings dialog");
  jQuery("#TTGPTSettingsArea").remove();

  // Resume listening
  CN_PAUSED = false;
}

// Restore settings from cookie
function CN_RestoreSettings() {
  var settingsRaw = CN_GetCookie("CN_TTGPT");
  try {
    var settings = JSON.parse(settingsRaw);
    if (_typeof(settings) == "object" && settings != null) {
      console.log("Reloading settings from cookie: " + settings);
      CN_WANTED_VOICE_NAME = settings[0];
      CN_TEXT_TO_SPEECH_RATE = settings[1];
      CN_TEXT_TO_SPEECH_PITCH = settings[2];
      CN_WANTED_LANGUAGE_SPEECH_REC = settings[3];
      CN_SAY_THIS_WORD_TO_STOP = settings[4];
      CN_SAY_THIS_WORD_TO_PAUSE = settings[5];
      if (settings.hasOwnProperty(6)) CN_AUTO_SEND_AFTER_SPEAKING = settings[6] == 1;
      if (settings.hasOwnProperty(7)) CN_SAY_THIS_TO_SEND = settings[7];
      if (settings.hasOwnProperty(8)) CN_IGNORE_COMMAS = settings[8] == 1;
      if (settings.hasOwnProperty(9)) CN_KEEP_LISTENING = settings[9] == 1;
      if (settings.hasOwnProperty(10)) CN_IGNORE_CODE_BLOCKS = settings[10] == 1;
      if (settings.hasOwnProperty(11)) CN_TTS_ELEVENLABS = settings[11] == 1;
      if (settings.hasOwnProperty(12)) CN_TTS_ELEVENLABS_APIKEY = settings[12];
      if (settings.hasOwnProperty(13)) CN_TTS_ELEVENLABS_VOICE = settings[13];
      if (settings.hasOwnProperty(14)) CN_TTS_ELEVENLABS_STABILITY = settings[14];
      if (settings.hasOwnProperty(15)) CN_TTS_ELEVENLABS_SIMILARITY = settings[15];
    }
  } catch (ex) {
    console.error(ex);
  }
}

// Close dialog: remove area altogether
function CN_CloseSettingsDialog() {
  console.log("Closing settings dialog");
  jQuery("#TTGPTSettingsArea").remove();

  // Resume listening
  CN_PAUSED = false;
}

// Remove punctuation in a sentence. This function was written by ChatGPT on the 9th of April 2023. Thanks Chatty!
function CN_RemovePunctuation(str) {
  var regexPonctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@\[\]^_`{|}~]/g;
  str = str.replace(regexPonctuation, "") + "";
  return str.toLowerCase().trim();
}

// Sets a cookie
function CN_SetCookie(name, value) {
  var days = 365;
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  var expires = "; expires=" + date.toGMTString();
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Reads a cookie
function CN_GetCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Refresh ElevenLabs voice list using current API key
function CN_RefreshElevenLabsVoiceList(useKeyFromTextField) {
  // Show loading thingy
  jQuery("#TTGPTElevenLabsRefresh").html("...");

  // Prepare headers & request
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.elevenlabs.io/v1/voices");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  var apikey = useKeyFromTextField ? jQuery("#TTGPTElevenLabsKey").val() : CN_TTS_ELEVENLABS_APIKEY;
  if (apikey) xhr.setRequestHeader("xi-api-key", apikey);

  // What happens when we receive the server response
  xhr.onreadystatechange = function () {
    var optionList = "<option value=''></option>";
    if (xhr.readyState === XMLHttpRequest.DONE) {
      jQuery("#TTGPTElevenLabsRefresh").html("Refresh list");
      var result = null;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (e) {
        jQuery("#TTGPTElevenLabsRefresh").html("Refresh list");
        alert("Error retrieving ElevenLabs voice list: " + e.toString() + ". Please ensure you have a valid API key and try clicking Refresh List again.");
        return;
      }

      // Check result type?
      if (typeof result.voices == "undefined") {
        if (typeof result.detail != "undefined" && typeof result.detail.message != "undefined") {
          // {"detail":{"status":"invalid_api_key","message":"Invalid API key: 'apikey'"}}
          alert("ElevenLabs returned the following while refreshing the voice list: " + result.detail.message);
          return;
        }
        // Other
        alert("Unexpected response from ElevenLabs API: " + JSON.stringify(result));
        return;
      }

      // Build list of models
      var found = false;
      for (var modelId in CN_TTS_ELEVENLABS_MODELS) {
        var modelName = CN_TTS_ELEVENLABS_MODELS[modelId];
        optionList += '<optgroup label="' + modelName + '">';
        for (var i = 0; i < result.voices.length; i++) {
          var name = result.voices[i].name;
          var id = modelId + "." + result.voices[i].voice_id;
          var sel = id == CN_TTS_ELEVENLABS_VOICE ? "selected=selected" : ""; // Restore selected voice
          if (sel) found = true;
          optionList += "<option value='" + id + "' " + sel + ">" + name + "</option>";
        }
        optionList += "</optgroup>";
      }
      jQuery("#TTGPTElevenLabsVoice").html(optionList);

      // The voice previously selected no longer seems to exist
      if (CN_TTS_ELEVENLABS_VOICE && !found) alert("The voice previously selected in the settings doesn't seem to be available in your ElevenLabs account anymore. Please select a new voice in the settings to restore ElevenLabs support. Voice ID: " + CN_TTS_ELEVENLABS_VOICE);
    }
  };

  // Let's go
  xhr.send();
}

// MAIN ENTRY POINT
// Load jQuery, then run initialization function
(function () {
  setTimeout(function () {
    typeof jQuery == "undefined" ? alert("[Talk-to-ChatGPT] Sorry, but jQuery was not able to load. The script cannot run. Try using Google Chrome or Edge on Windows 11") : CN_CheckCorrectPage();
  }, 500);
})();

// List of languages for speech recognition - Pulled from https://www.google.com/intl/en/chrome/demos/speech.html
var CN_SPEECHREC_LANGS = [["Afrikaans", ["af-ZA"]], ["አማርኛ", ["am-ET"]], ["Azərbaycanca", ["az-AZ"]], ["বাংলা", ["bn-BD", "বাংলাদেশ"], ["bn-IN", "ভারত"]], ["Bahasa Indonesia", ["id-ID"]], ["Bahasa Melayu", ["ms-MY"]], ["Català", ["ca-ES"]], ["Čeština", ["cs-CZ"]], ["Dansk", ["da-DK"]], ["Deutsch", ["de-DE"]], ["English", ["en-AU", "Australia"], ["en-CA", "Canada"], ["en-IN", "India"], ["en-KE", "Kenya"], ["en-TZ", "Tanzania"], ["en-GH", "Ghana"], ["en-NZ", "New Zealand"], ["en-NG", "Nigeria"], ["en-ZA", "South Africa"], ["en-PH", "Philippines"], ["en-GB", "United Kingdom"], ["en-US", "United States"]], ["Español", ["es-AR", "Argentina"], ["es-BO", "Bolivia"], ["es-CL", "Chile"], ["es-CO", "Colombia"], ["es-CR", "Costa Rica"], ["es-EC", "Ecuador"], ["es-SV", "El Salvador"], ["es-ES", "España"], ["es-US", "Estados Unidos"], ["es-GT", "Guatemala"], ["es-HN", "Honduras"], ["es-MX", "México"], ["es-NI", "Nicaragua"], ["es-PA", "Panamá"], ["es-PY", "Paraguay"], ["es-PE", "Perú"], ["es-PR", "Puerto Rico"], ["es-DO", "República Dominicana"], ["es-UY", "Uruguay"], ["es-VE", "Venezuela"]], ["Euskara", ["eu-ES"]], ["Filipino", ["fil-PH"]], ["Français", ["fr-FR"]], ["Basa Jawa", ["jv-ID"]], ["Galego", ["gl-ES"]], ["ગુજરાતી", ["gu-IN"]], ["Hrvatski", ["hr-HR"]], ["IsiZulu", ["zu-ZA"]], ["Íslenska", ["is-IS"]], ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]], ["ಕನ್ನಡ", ["kn-IN"]], ["ភាសាខ្មែរ", ["km-KH"]], ["Latviešu", ["lv-LV"]], ["Lietuvių", ["lt-LT"]], ["മലയാളം", ["ml-IN"]], ["मराठी", ["mr-IN"]], ["Magyar", ["hu-HU"]], ["ລາວ", ["lo-LA"]], ["Nederlands", ["nl-NL"]], ["नेपाली भाषा", ["ne-NP"]], ["Norsk bokmål", ["nb-NO"]], ["Polski", ["pl-PL"]], ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]], ["Română", ["ro-RO"]], ["සිංහල", ["si-LK"]], ["Slovenščina", ["sl-SI"]], ["Basa Sunda", ["su-ID"]], ["Slovenčina", ["sk-SK"]], ["Suomi", ["fi-FI"]], ["Svenska", ["sv-SE"]], ["Kiswahili", ["sw-TZ", "Tanzania"], ["sw-KE", "Kenya"]], ["ქართული", ["ka-GE"]], ["Հայերեն", ["hy-AM"]], ["தமிழ்", ["ta-IN", "இந்தியா"], ["ta-SG", "சிங்கப்பூர்"], ["ta-LK", "இலங்கை"], ["ta-MY", "மலேசியா"]], ["తెలుగు", ["te-IN"]], ["Tiếng Việt", ["vi-VN"]], ["Türkçe", ["tr-TR"]], ["اُردُو", ["ur-PK", "پاکستان"], ["ur-IN", "بھارت"]], ["Ελληνικά", ["el-GR"]], ["български", ["bg-BG"]], ["Pусский", ["ru-RU"]], ["Српски", ["sr-RS"]], ["Українська", ["uk-UA"]], ["한국어", ["ko-KR"]], ["中文", ["cmn-Hans-CN", "普通话 (中国大陆)"], ["cmn-Hans-HK", "普通话 (香港)"], ["cmn-Hant-TW", "中文 (台灣)"], ["yue-Hant-HK", "粵語 (香港)"]], ["日本語", ["ja-JP"]], ["हिन्दी", ["hi-IN"]], ["ภาษาไทย", ["th-TH"]]];
////////////////////////
// language detection //
////////////////////////



var crxToFranc = {
  en: "eng",
  ja: "jpn",
  de: "deu",
  zh: "cmn",
  es: "spa",
  ru: "rus",
  ar: "arb",
  bn: "ben",
  hi: "hin",
  pt: "por",
  id: "ind",
  fr: "fra",
  jv: "jav",
  ko: "kor",
  te: "tel",
  vi: "vie",
  mr: "mar",
  it: "ita",
  ta: "tam",
  tr: "tur",
  ur: "urd",
  gu: "guj",
  pl: "pol",
  uk: "ukr",
  kn: "kan",
  mai: "mai",
  ml: "mal",
  fa: "pes",
  my: "mya",
  sw: "swh",
  su: "sun",
  ro: "ron",
  pa: "pan",
  bh: "bho",
  am: "amh",
  ha: "hau",
  fuv: "fuv",
  bs_cyrl: "bos",
  bs_latn: "bos",
  hr: "hrv",
  nl: "nld",
  sr_cyrl: "srp",
  sr_latn: "srp",
  th: "tha",
  ckb: "ckb",
  yo: "yor",
  uz_cyrl: "uzn",
  uz_latn: "uzn",
  zlm_arab: "zlm",
  zlm_latn: "zlm",
  ig: "ibo",
  ne: "npi",
  ceb: "ceb",
  skr: "skr",
  tl: "tgl",
  hu: "hun",
  az_cyrl: "azj",
  az_latn: "azj",
  si: "sin",
  koi: "koi",
  el: "ell",
  cs: "ces",
  mag: "mag",
  rn: "run",
  be: "bel",
  plt: "plt",
  qug: "qug",
  mad: "mad",
  ny: "nya",
  zyb: "zyb",
  pbu: "pbu",
  rw: "kin",
  zu: "zul",
  bg: "bul",
  sv: "swe",
  ln: "lin",
  so: "som",
  hms: "hms",
  hnj: "hnj",
  ilo: "ilo",
  kk: "kaz"
};
var francToCrx = {
  cmn: "zh-CN",
  spa: "es-ES",
  eng: "en-US",
  rus: "ru-RU",
  arb: "ar-SA",
  ben: "bn-BD",
  hin: "hi-IN",
  por: "pt-PT",
  ind: "id-ID",
  jpn: "ja-JP",
  fra: "fr-FR",
  deu: "de-DE",
  jav: "jv-ID",
  kor: "ko-KR",
  tel: "te-IN",
  vie: "vi-VN",
  mar: "mr-IN",
  ita: "it-IT",
  tam: "ta-IN",
  tur: "tr-TR",
  urd: "ur-PK",
  guj: "gu-IN",
  pol: "pl-PL",
  ukr: "uk-UA",
  kan: "kn-IN",
  mai: "mai-IN",
  mal: "ml-IN",
  pes: "fa-IR",
  mya: "my-MM",
  swh: "sw-TZ",
  sun: "su-ID",
  ron: "ro-RO",
  pan: "pa-IN",
  bho: "bho-IN",
  amh: "am-ET",
  hau: "ha-NG",
  fuv: "fuv-NG",
  bos: "bs-Latn-BA",
  hrv: "hr-HR",
  nld: "nl-NL",
  srp: "sr-Cyrl-RS",
  tha: "th-TH",
  ckb: "ku-IQ",
  yor: "yo-NG",
  uzn: "uz-Cyrl-UZ",
  zlm: "ms-MY",
  ibo: "ig-NG",
  npi: "ne-NP",
  ceb: "ceb-PH",
  skr: "skr-PK",
  tgl: "tl-PH",
  hun: "hu-HU",
  azj: "az-Cyrl-AZ",
  sin: "si-LK",
  koi: "koi-RU",
  ell: "el-GR",
  ces: "cs-CZ",
  mag: "mag-IN",
  run: "rn-BI",
  bel: "be-BY",
  plt: "plt-MG",
  qug: "qug-EC",
  mad: "mad-ID",
  nya: "ny-MW",
  zyb: "none",
  pbu: "none",
  kin: "rw-RW",
  zul: "zu-ZA",
  bul: "ru-RU",
  swe: "sv-SE",
  lin: "ln-CD",
  som: "so-SO",
  hms: "zh-CN",
  hnj: "vi-VN",
  ilo: "ilo-PH",
  kaz: "kk-KZ"
};
function getLanguageDetector() {
  var langDetect = null;
  if (chrome && chrome.i18n && chrome.i18n.detectLanguage) {
    langDetect = chrome.i18n.detectLanguage;
  } else if (browser && browser.i18n && browser.i18n.detectLanguage) {
    langDetect = browser.i18n.detectLanguage;
  }
  return langDetect;
}
function splitIntoSentences(text) {
  return [text];
  // const textNodes = split(text);
  // let sentences = [];
  // textNodes.forEach((s) => {
  //   if (s.type === "Sentence") {
  //     if (s.raw.indexOf('"') !== -1) {
  //       const ss = s.raw.split('"');
  //       ss.forEach((se) => {
  //         sentences.push(se);
  //       });
  //     } else {
  //       let lb = s.raw.split("\n");
  //       for (const element of lb) {
  //         let paren = element.split("(");
  //         for (const element2 of paren) {
  //           let paren2 = element2.split(")");
  //           for (const p3 of paren2) {
  //             sentences.push(p3);
  //           }
  //         }
  //       }
  //     }
  //   }
  // });
  // return sentences;
}
function splitByLanguage(_x2) {
  return _splitByLanguage.apply(this, arguments);
}
function _splitByLanguage() {
  _splitByLanguage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(text) {
    var sentences, langDetect, config, lngs, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, sentence, francDetect, res, browserDetect, speechObj, _iterator2, _step2, s, lang, langIsUndefined;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sentences = splitIntoSentences(text);
          langDetect = getLanguageDetector();
          config = {
            ignore: ["und", "som", "tur"],
            only: []
          };
          lngs = [];
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context3.prev = 6;
          _iterator = _asyncIterator(sentences);
        case 8:
          _context3.next = 10;
          return _iterator.next();
        case 10:
          if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
            _context3.next = 28;
            break;
          }
          sentence = _step.value;
          if (langDetect) {
            _context3.next = 17;
            break;
          }
          francDetect = franc(sentence);
          lngs.push(francDetect);
          _context3.next = 25;
          break;
        case 17:
          _context3.next = 19;
          return langDetect(text);
        case 19:
          res = _context3.sent;
          res.languages.forEach(function (lng) {
            lngs.push(crxToFranc[lng.language]);
          });
          _context3.next = 23;
          return langDetect(sentence);
        case 23:
          browserDetect = _context3.sent;
          browserDetect.languages.forEach(function (lng) {
            lngs.push(crxToFranc[lng.language]);
          });
        case 25:
          _iteratorAbruptCompletion = false;
          _context3.next = 8;
          break;
        case 28:
          _context3.next = 34;
          break;
        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context3.t0;
        case 34:
          _context3.prev = 34;
          _context3.prev = 35;
          if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
            _context3.next = 39;
            break;
          }
          _context3.next = 39;
          return _iterator["return"]();
        case 39:
          _context3.prev = 39;
          if (!_didIteratorError) {
            _context3.next = 42;
            break;
          }
          throw _iteratorError;
        case 42:
          return _context3.finish(39);
        case 43:
          return _context3.finish(34);
        case 44:
          config.only = Array.from(new Set(lngs));
          speechObj = [{
            lang: "",
            sentence: ""
          }];
          _iterator2 = _createForOfIteratorHelper(sentences);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              s = _step2.value;
              lang = franc(s, config);
              langIsUndefined = lang === "und" || lang == undefined || lang == null;
              if (langIsUndefined) {
                lang = !(config.only[0] == undefined || config.only[0] == null) ? config.only[0] : "eng";
              }
              if (s !== "") {
                speechObj.push({
                  lang: francToCrx[lang],
                  sentence: s
                });
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          return _context3.abrupt("return", speechObj);
        case 49:
        case "end":
          return _context3.stop();
      }
    }, _callee2, null, [[6, 30, 34, 44], [35,, 39, 43]]);
  }));
  return _splitByLanguage.apply(this, arguments);
}
function getUtterances(_x3) {
  return _getUtterances.apply(this, arguments);
}
function _getUtterances() {
  _getUtterances = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(text) {
    var classifiedStrings, utterances;
    return _regeneratorRuntime().wrap(function _callee3$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return splitByLanguage(text);
        case 2:
          classifiedStrings = _context4.sent;
          utterances = [new SpeechSynthesisUtterance(classifiedStrings[0].sentence)];
          utterances[0].lang = classifiedStrings[0].lang;
          classifiedStrings.shift();
          classifiedStrings.forEach(function (_ref3) {
            var lang = _ref3.lang,
              sentence = _ref3.sentence;
            if (lang === undefined || lang === null || lang === "") {
              lang = navigator.language || navigator.userLanguage;
            }
            var utterance = new SpeechSynthesisUtterance(sentence);
            utterance.lang = lang.split("-")[0];
            var voices = window.speechSynthesis.getVoices();
            utterance.voice = voices.find(function (voice) {
              return voice.lang === lang;
            });
            utterances.push(utterance);
          });
          return _context4.abrupt("return", utterances);
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee3);
  }));
  return _getUtterances.apply(this, arguments);
}
/******/ })()
;