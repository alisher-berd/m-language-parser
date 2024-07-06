// DEFINE TOKENS

const TokenType = {
    Whitespace: "whitespace",
    Comment: "comment",
    Identifier: "identifier",
    GeneralizedIdentifier: "generalized-identifier",
    Keyword: "keyword",
    Literal: "literal",
    OperatorOrPunctuator: "operator-or-punctuator",
};

const Whitespace = {
    Whitespace: "whitespace",
    NewLine: "new-line",
};

const Comment = {
    SingleLine: "single-line-comment",
    Delimited: "delimited-comment",
};

const Literal = {
    Text: "text-literal",
    Number: "number-literal",
    Logical: "logical-literal",
    Null: "null-literal",
    //Verbatim: this lexer assumes provided M code does not generate any runtime errors
};

const Identifier = {
    Quoted: "quoted-identifier",
    Regular: "regular-identifier",
};

const GeneralizedIdentifier = {
    GeneralizedIdentifier: "generalized-identifier",
};

const OperatorOrPunctuator = {
    Comma: "comma",
    Semicolon: "semicolon",
    Arrow: "arrow",
    Equal: "equal",
    NotEqual: "not-equal",
    LessThanOrEqual: "less-than-or-equal",
    GreaterThanOrEqual: "greater-than-or-equal",
    LessThan: "less-than",
    GreaterThan: "greater-than",
    Plus: "plus",
    Minus: "minus",
    Multiply: "multiply",
    Divide: "divide",
    Ampersand: "ampersand",
    OpeningParenthesis: "opening-parenthesis",
    ClosingParenthesis: "closing-parenthesis",
    OpeningBracket: "opening-bracket",
    ClosingBracket: "closing-bracket",
    OpeningBrace: "opening-brace",
    ClosingBrace: "closing-brace",
    AtSymbol: "at-symbol",
    ExclamationMark: "exclamation-mark",
    DoubleQuestionMark: "double-question-mark",
    QuestionMark: "question-mark",
    TripleDot: "triple-dot",
    DoubleDot: "double-dot",
};

const Keyword = {
    And: "and",
    As: "as",
    Each: "each",
    Else: "else",
    Error: "error",
    False: "false",
    If: "if",
    In: "in",
    Is: "is",
    Let: "let",
    Meta: "meta",
    Not: "not",
    Null: "null",
    Or: "or",
    Otherwise: "otherwise",
    Section: "section",
    Shared: "shared",
    Then: "then",
    True: "true",
    Try: "try",
    Type: "type",
    Binary: "#binary",
    Datetimezone: "#datetimezone",
    Datetime: "#datetime",
    Date: "#date",
    Duration: "#duration",
    Infinity: "#infinity",
    Nan: "#nan",
    Sections: "#sections",
    HashShared: "#shared",
    Table: "#table",
    Time: "#time",
};

const operatorOrPuctuatorToTokenMapping = {
    ",": OperatorOrPunctuator.Comma,
    ";": OperatorOrPunctuator.Semicolon,
    "=>": OperatorOrPunctuator.Arrow,
    "=": OperatorOrPunctuator.Equal,
    "<>": OperatorOrPunctuator.NotEqual,
    "<=": OperatorOrPunctuator.LessThanOrEqual,
    ">=": OperatorOrPunctuator.GreaterThanOrEqual,
    "<": OperatorOrPunctuator.LessThan,
    ">": OperatorOrPunctuator.GreaterThan,
    "+": OperatorOrPunctuator.Plus,
    "-": OperatorOrPunctuator.Minus,
    "*": OperatorOrPunctuator.Multiply,
    "/": OperatorOrPunctuator.Divide,
    "&": OperatorOrPunctuator.Ampersand,
    "(": OperatorOrPunctuator.OpeningParenthesis,
    ")": OperatorOrPunctuator.ClosingParenthesis,
    "[": OperatorOrPunctuator.OpeningBracket,
    "]": OperatorOrPunctuator.ClosingBracket,
    "{": OperatorOrPunctuator.OpeningBrace,
    "}": OperatorOrPunctuator.ClosingBrace,
    "@": OperatorOrPunctuator.AtSymbol,
    "!": OperatorOrPunctuator.ExclamationMark,
    "??": OperatorOrPunctuator.DoubleQuestionMark,
    "?": OperatorOrPunctuator.QuestionMark,
    "...": OperatorOrPunctuator.TripleDot,
    "..": OperatorOrPunctuator.DoubleDot,
};

const keywordToTokenMapping = {
    and: Keyword.And,
    as: Keyword.As,
    each: Keyword.Each,
    else: Keyword.Else,
    error: Keyword.Error,
    false: Keyword.False,
    if: Keyword.If,
    in: Keyword.In,
    is: Keyword.Is,
    let: Keyword.Let,
    meta: Keyword.Meta,
    not: Keyword.Not,
    null: Keyword.Null,
    or: Keyword.Or,
    otherwise: Keyword.Otherwise,
    section: Keyword.Section,
    shared: Keyword.Shared,
    then: Keyword.Then,
    true: Keyword.True,
    try: Keyword.Try,
    type: Keyword.Type,
    "#binary": Keyword.Binary,
    "#datetimezone": Keyword.Datetimezone,
    "#datetime": Keyword.Datetime,
    "#date": Keyword.Date,
    "#duration": Keyword.Duration,
    "#infinity": Keyword.Infinity,
    "#nan": Keyword.Nan,
    "#sections": Keyword.Sections,
    "#shared": Keyword.HashShared,
    "#table": Keyword.Table,
    "#time": Keyword.Time,
};

export {
    TokenType,
    Whitespace,
    Comment,
    Literal,
    Identifier,
    GeneralizedIdentifier,
    OperatorOrPunctuator,
    Keyword,
    operatorOrPuctuatorToTokenMapping,
    keywordToTokenMapping,
};
