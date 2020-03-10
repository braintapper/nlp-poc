var ExpressionParser, Sugar, all, create, math;

Sugar = require("sugar");

require('sugar-inflections');

Sugar.extend();

({create, all} = require('mathjs'));

math = create(all, {
  number: 'number'
});

ExpressionParser = (function() {
  class ExpressionParser {
    tagSpec() {
      return {
        notA: "Noun",
        notA: "Adjective",
        notA: "Conjunction",
        notA: "Singular",
        notA: "Preposition",
        notA: "Acronym",
        notA: "Noun"
      };
    }

    constructor() {
      var compromiseNumbers, that;
      this.nodes = this.nodes.bind(this);
      this.nodeTags = this.nodeTags.bind(this);
      that = this;
      this.nlp = require("compromise");
      compromiseNumbers = require("compromise-numbers");
      //compromiseDates = require "compromise-dates"
      this.nlp.extend(compromiseNumbers);
      //@nlp.extend(compromiseDates)
      this.nlp.extend(function(Doc, world) {
        var wordlist;
        world.addTags(that.tags);
        wordlist = {};
        Object.keys(that.dictionary).forEach(function(tag) {
          if (!["Currency"].includes(tag)) { // blacklist
            that.tags[tag] = that.tagSpec();
          }
          return that.dictionary[tag].forEach(function(word) {
            if (wordlist[word] != null) {
              console.log(wordlist[word]);
              return wordlist[word].append(tag);
            } else {
              return wordlist[word] = [tag];
            }
          });
        });
        return world.addWords(wordlist);
      });
    }

    parser() {}

    // work around compromise's limitations with respect to these words
    // * slashes
    //   - ignored when separated with a space on either side
    // * dashes
    //   - ignored between words
    // By adding a period to the end of / and -, it forces compromise to recognize them as words
    preparse(string) {
      return string.replace(/ \/ /g, " /. ").replace(/ - /g, " -. ");
    }

    terms(val) {
      return this.nlp(val).join().json(this.options)[0].terms;
    }

    nodes(val) {
      return this.terms(this.preparse(val));
    }

    nodeTags(val) {
      var output;
      output = [];
      this.terms(this.preparse(val)).forEach(function(item) {
        return output.append(item.tags);
      });
      return output.unique();
    }

    analyzeType(expression) {
      var checks, guesses, suffix, tags;
      // overrides
      guesses = [];
      tags = this.nodeTags(expression);
      suffix = "";
      checks = ["Date", "Unit", "HashTag", "Time", "MathOperator", "Currency", "Time"];
      if (expression.includes(":")) {
        guesses.append("Time");
      }
      checks.forEach(function(item) {
        if (tags.includes(item)) {
          if (item === "MathOperator") {
            return guesses.append("Math");
          } else {
            return guesses.append(item);
          }
        }
      });
      return guesses.unique();
    }

    // translate the expression further before applying calculation
    translatedExpression(expression) {
      switch (this.guessedType(this.analyzeType(expression))) {
        case "Math":
          return expression.replace(/times/g, "*").replace(/divided by/g, "/");
        default:
          return expression;
      }
    }

    guessedType(types) {
      var type;
      type = "unknown";
      if (types.includes("Math")) {
        type = "Math";
      }
      return type;
    }

    evaluate(expression) {
      var e;
      switch (this.guessedType(this.analyzeType(expression))) {
        case "Math":
          try {
            return math.evaluate(this.translatedExpression(expression));
          } catch (error) {
            e = error;
            return e.toString();
          }
          break;
        default:
          return "i dunno";
      }
    }

  };

  ExpressionParser.prototype.dictionary = {
    TimeUnits: ["millisecond", "second", "minute", "hour", "day", "week", "weekend", "month", "quarter", "year", "decade", "century", "millennium"],
    TimeFunction: ["time", "date"],
    RelativeDate: ["today", "tomorrow", "tommorrow", "tmr", "yesterday", "yday", "ago", "next week"],
    DateSeparator: ["/", ".", "-", " "],
    ConversionOperator: ["from", "to", "in", "as"],
    RangeOperator: ["from", "to", "between", "and"],
    MathConstant: ["e", "pi"],
    DateFunction: ["fromunix"],
    MathFunction: ["abs", "acos", "acosh", "acot", "acoth", "acsc", "acsch", "add", "apply", "arg", "asec", "asech", "asin", "asinh", "atan", "atan2", "atanh", "bellNumbers", "bitAnd", "bitNot", "bitOr", "bitXor", "catalan", "cbrt", "ceil", "clone", "column", "combinations", "combinationsWithRep", "compare", "compareNatural", "compareText", "composition", "concat", "conj", "cos", "cosh", "cot", "coth", "cross", "csc", "csch", "ctranspose", "cube", "deepEqual", "det", "diag", "distance", "divide", "dot", "dotDivide", "dotMultiply", "dotPow", "eigs", "equal", "equalText", "erf", "exp", "expm", "expm1", "factorial", "filter", "fix", "flatten", "floor", "forEach", "format", "gamma", "gcd", "getMatrixDataType", "hasNumericValue", "hypot", "identity", "im", "intersect", "inv", "isInteger", "isNaN", "isNegative", "isNumeric", "isPositive", "isPrime", "isZero", "kldivergence", "kron", "larger", "largerEq", "lcm", "leftShift", "log", "log10", "log1p", "log2", "mad", "map", "max", "mean", "median", "min", "mod", "mode", "multinomial", "multiply", "norm", "nthRoot", "nthRoots", "numeric", "ones", "partitionSelect", "permutations", "pickRandom", "pow", "print", "prod", "quantileSeq", "random", "randomInt", "range", "re", "reshape", "resize", "rightArithShift", "rightLogShift", "round", "row", "sec", "sech", "setCartesian", "setDifference", "setDistinct", "setIntersect", "setIsSubset", "setMultiplicity", "setPowerset", "setSize", "setSymDifference", "setUnion", "sign", "sin", "sinh", "size", "smaller", "smallerEq", "sort", "sqrt", "sqrtm", "square", "squeeze", "std", "stirlingS2", "subset", "subtract", "sum", "tan", "tanh", "to", "trace", "transpose", "typeOf", "unaryMinus", "unaryPlus", "unequal", "variance", "xgcd", "zeros"],
    Fraction: ["/", "%", "percent", "percentage"],
    MathOperator: ["+", "*", "-", "/", "x", "×", "÷", "%", "plus", "minus", "divide", "divided", "times", "multiply", "multiplied"],
    Currency: ["US dollars"]
  };

  ExpressionParser.prototype.tags = {};

  // console.log wordlist
  ExpressionParser.prototype.options = {
    terms: {
      clean: true,
      bestTag: true
    }
  };

  return ExpressionParser;

}).call(this);

module.exports = new ExpressionParser();
