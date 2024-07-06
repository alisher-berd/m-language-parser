const regexStringEnd = "$";
const regexOrStringOperatorOrPunctuator =
    ",|;|=>|=|<>|<=|>=|<|>|\\+|-|\\*|\\/|&|\\(|\\)|\\[|\\]|\\{|\\}|@|!|\\?\\?|\\?|\\.\\.\\.|\\.\\.";
const regexOrStringSpace = "\\p{Zs}|\\u0009|\\u000B|\\u000C|\\u000D\\u000A";
const regexOrStringNewLine = "\\u000D|\\u000A|\\u0085|\\u2028|\\u2029";
const regexOrStringKeyword =
    "and|as|each|else|error|false|if|in|is|let|meta|not|null|or|otherwise|section|shared|then|true|try|type|#binary|#datetimezone|#datetime|#date|#duration|#infinity|#nan|#sections|#shared|#table|#time";
const regexStringSeparator = `${regexStringEnd}|${regexOrStringSpace}|${regexOrStringNewLine}|${regexOrStringOperatorOrPunctuator}`;

// OPERATOR OR PUNCTUATOR

const regexOperatorOrPunctuator = new RegExp(
    `^(${regexOrStringOperatorOrPunctuator})`,
);

// KEYWORD

const regexStringKeyword = `^(${regexOrStringKeyword})(${regexStringSeparator})`;

const regexKeyword = new RegExp(regexStringKeyword, "u");

// COMMENT

// Single line comment

const regexSingleLineComment = new RegExp(
    `^//[^${regexOrStringNewLine}]*`,
    "u",
);

// Delimited comment

// const regexDelimitedCommentCharacters = /[^\*]/;

const regexDelimitedComment = new RegExp(`^\\/\\*(\\/|\\**[^\\*\\/])*\\*+\\/`);

// WHITESPACE

// Whitespace

const regexSpace = new RegExp(`^(${regexOrStringSpace})+`, "u");

// New line

const regexNewLine = new RegExp(`^(${regexOrStringNewLine})+`, "u");

// TEXT LITERAL

// escape-escape:
//   #
const regexStringEscapeEscape = "#";

// control-character-escape-sequence:
//   control-character
// control-character:
//   cr
//   lf
//   tab
const regexStringControlCharacterEscapeSequence = "cr|cf|tab";

// long-unicode-escape-sequence:
//   hex-digit hex-digit hex-digit hex-digit hex-digit hex-digit hex-digit hex-digit
const regexStringLongUnicodeEscapeSequence = "[0-9a-fA-F]{8}";

// short-unicode-escape-sequence:
//   hex-digit hex-digit hex-digit hex-digit
const regexStringShortUnicodeEscapeSequence = "[0-9a-fA-F]{4}";

// single-escape-sequence:
//   long-unicode-escape-sequence
//   short-unicode-escape-sequence
//   control-character-escape-sequence
//   escape-escape
const regexStringSingleEscapeSequence =
    `${regexStringEscapeEscape}` +
    `|${regexStringControlCharacterEscapeSequence}` +
    `|${regexStringLongUnicodeEscapeSequence}` +
    `|${regexStringShortUnicodeEscapeSequence}`;

// escape-sequence-list:
//   single-escape-sequence
//   single-escape-sequence , escape-sequence-list
const regexStringEscapeSequenceList = `((${regexStringSingleEscapeSequence}),)*(${regexStringSingleEscapeSequence})`;

// character-escape-sequence:
//   #( escape-sequence-list )
const regexStringCharacterEscapeSequence = `#\\(${regexStringEscapeSequenceList}\\)`;

// double-quote-escape-sequence:
//   "" (U+0022, U+0022)
const regexStringDoubleQuoteEscapeSequence = "\\u0022\\u0022";

// single-text-character:
//   Any character except " (U+0022) or # (U+0023) followed by ( (U+0028)
const regexStringSingleTextCharacter = "([^\\u0022\\u0023])|#(?!\\u0028)";

// text-literal-character:
//   single-text-character
//   character-escape-sequence
//   double-quote-escape-sequence
const regexStringTextLiteralCharacter = `${regexStringCharacterEscapeSequence}|${regexStringDoubleQuoteEscapeSequence}|${regexStringSingleTextCharacter}`;

// text-literal:
//   "text-literal-characters(opt)"
// text-literal-characters:
//   text-literal-character text-literal-charactersopt
const regexStringTextLiteral = `^"(${regexStringTextLiteralCharacter})*"`;

const regexTextLiteral = new RegExp(regexStringTextLiteral, "u");

// NUMBER LITERAL

// hex-digit: one of
//   0 1 2 3 4 5 6 7 8 9 A B C D E F a b c d e f
const regexStringHexDigit = "[\\dABCDEFabcdef]";

// hexadecimal-number-literal:
// 0x hex-digits
// 0X hex-digits
// hex-digits:
//   hex-digit hex-digits(opt)
const regexStringHexadecimalNumberLiteral = `0[xX]${regexStringHexDigit}+`;

// exponent-part:
//   e sign(opt) decimal-digits
// 	 E sign(opt) decimal-digits
// sign: one of
//   + -
const regexStringExponentPart = "[eE][+-]?\\d+";

// decimal-number-literal:
//   decimal-digits . decimal-digits exponent-part(opt)
//   . decimal-digits exponent-part(opt)
//   decimal-digits exponent-part(opt)
const regexStringDecimalNumberLiteral = `\\d*\\.?\\d+(${regexStringExponentPart})?`;

// number-literal:
//   decimal-number-literal
//   hexadecimal-number-literal
const regexStringNumberLiteral = `^((${regexStringHexadecimalNumberLiteral})|(${regexStringDecimalNumberLiteral}))(${regexStringSeparator})`;

const regexNumberLiteral = new RegExp(regexStringNumberLiteral, "u");

// IDENTIFIER

// identifier-part-character:
//   letter-character
//   decimal-digit-character
//   underscore-character
//   connecting-character
//   combining-character
//   formatting-character
// underscore-character:
//   _ (U+005F)
// letter-character:
//   A Unicode character of classes Lu, Ll, Lt, Lm, Lo, or Nl
// combining-character:
//   A Unicode character of classes Mn or Mc
// decimal-digit-character:
//   A Unicode character of the class Nd
// connecting-character:
//   A Unicode character of the class Pc
// formatting-character:
//   A Unicode character of the class Cf
const regexStringIdentifierPartCharacter = `[\\p{L}\\p{Nl}\\u005F\\p{Nd}\\p{Pc}\\p{Mn}\\p{Mc}\\p{Cf}]`;

// identifier-start-character:
//   letter-character
//   underscore-character
const regexStringIdentifierStartCharacter = `[\\p{L}\\p{Nl}\\u005F]`;

// keyword-or-identifier:
//   identifier-start-character identifier-part-characters(opt)
const regexStringKeywordOrIdentifier = `${regexStringIdentifierStartCharacter}${regexStringIdentifierPartCharacter}*`;

// available-identifier:
//   A keyword-or-identifier that is not a keyword
const regexStringNotKeywordLookAhead = `(?!(${regexOrStringKeyword})(${regexStringSeparator}|\\.))`;
const regexStringAvailableIdentifier = `${regexStringNotKeywordLookAhead}${regexStringKeywordOrIdentifier}`;

// regular-identifier:
//   available-identifier
//   available-identifier dot-character regular-identifier
const regexStringRegularIdentifier = `^(${regexStringAvailableIdentifier}(\\.${regexStringAvailableIdentifier})*)(${regexStringSeparator})`;

// quoted-identifier:
//   #" text-literal-characters(opt) "
const regexStringQuotedIdentifier = `^(#"(${regexStringTextLiteralCharacter})*")(${regexStringSeparator})`;

const regexRegularIdentifier = new RegExp(regexStringRegularIdentifier, "u");

const regexQuotedIdentifier = new RegExp(regexStringQuotedIdentifier, "u");

// GENERALIZED IDENTIFIER

// generalized-identifier:
// generalized-identifier-part
// generalized-identifier separated only by blanks (U+0020)
// generalized-identifier-part:
// generalized-identifier-segment
// decimal-digit-character generalized-identifier-segment
// generalized-identifier-segment:
// keyword-or-identifier
// keyword-or-identifier dot-character keyword-or-identifier

// generalized-identifier-segment:
//   keyword-or-identifier
//   keyword-or-identifier dot-character keyword-or-identifier
const regexStringGeneralizedIdentifierSegment = `${regexStringKeywordOrIdentifier}(\\.${regexStringKeywordOrIdentifier})?`;

// generalized-identifier-part:
//   generalized-identifier-segment
//   decimal-digit-character generalized-identifier-segment
const regexStringGeneralizedIdentifierPart = `\\p{Nd}?${regexStringGeneralizedIdentifierSegment}`;

// generalized-identifier:
//   generalized-identifier-part
//   generalized-identifier separated only by blanks (U+0020)
const regexStringGeneralizedIdentifier = `^(${regexStringGeneralizedIdentifierPart}(\\u0020${regexStringGeneralizedIdentifierPart})*)(${regexStringSeparator})`;

const regexGeneralizedIdentifier = new RegExp(
    regexStringGeneralizedIdentifier,
    "u",
);

export {
    regexOperatorOrPunctuator,
    regexKeyword,
    regexSingleLineComment,
    regexDelimitedComment,
    regexSpace,
    regexNewLine,
    regexTextLiteral,
    regexNumberLiteral,
    regexRegularIdentifier,
    regexQuotedIdentifier,
    regexGeneralizedIdentifier,
};
