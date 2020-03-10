Sugar = require "sugar"
require('sugar-inflections')
Sugar.extend()
{ create, all } = require 'mathjs'
math = create(all, { number: 'number'})

class ExpressionParser





  tagSpec: ()->
    return
      notA: "Noun"
      notA: "Adjective"
      notA: "Conjunction"
      notA: "Singular"
      notA: "Preposition"
      notA: "Acronym"
      notA: "Noun"



  dictionary:
    TimeUnits: ["millisecond","second","minute","hour","day","week","weekend","month","quarter","year","decade","century","millennium"]
    TimeFunction: ["time","date"]
    RelativeDate: ["today","tomorrow","tommorrow","tmr","yesterday","yday","ago","next week"]
    DateSeparator: ["/",".","-"," "]
    ConversionOperator: ["from","to","in","as"]
    RangeOperator: ["from","to","between","and"]
    MathConstant: ["e","pi"]
    DateFunction: ["fromunix"]
    MathFunction: [
      "abs"
      "acos"
      "acosh"
      "acot"
      "acoth"
      "acsc"
      "acsch"
      "add"
      "apply"
      "arg"
      "asec"
      "asech"
      "asin"
      "asinh"
      "atan"
      "atan2"
      "atanh"
      "bellNumbers"
      "bitAnd"
      "bitNot"
      "bitOr"
      "bitXor"
      "catalan"
      "cbrt"
      "ceil"
      "clone"
      "column"
      "combinations"
      "combinationsWithRep"
      "compare"
      "compareNatural"
      "compareText"
      "composition"
      "concat"
      "conj"
      "cos"
      "cosh"
      "cot"
      "coth"
      "cross"
      "csc"
      "csch"
      "ctranspose"
      "cube"
      "deepEqual"
      "det"
      "diag"
      "distance"
      "divide"
      "dot"
      "dotDivide"
      "dotMultiply"
      "dotPow"
      "eigs"
      "equal"
      "equalText"
      "erf"
      "exp"
      "expm"
      "expm1"
      "factorial"
      "filter"
      "fix"
      "flatten"
      "floor"
      "forEach"
      "format"
      "gamma"
      "gcd"
      "getMatrixDataType"
      "hasNumericValue"
      "hypot"
      "identity"
      "im"
      "intersect"
      "inv"
      "isInteger"
      "isNaN"
      "isNegative"
      "isNumeric"
      "isPositive"
      "isPrime"
      "isZero"
      "kldivergence"
      "kron"
      "larger"
      "largerEq"
      "lcm"
      "leftShift"
      "log"
      "log10"
      "log1p"
      "log2"
      "mad"
      "map"
      "max"
      "mean"
      "median"
      "min"
      "mod"
      "mode"
      "multinomial"
      "multiply"
      "norm"
      "nthRoot"
      "nthRoots"
      "numeric"
      "ones"
      "partitionSelect"
      "permutations"
      "pickRandom"
      "pow"
      "print"
      "prod"
      "quantileSeq"
      "random"
      "randomInt"
      "range"
      "re"
      "reshape"
      "resize"
      "rightArithShift"
      "rightLogShift"
      "round"
      "row"
      "sec"
      "sech"
      "setCartesian"
      "setDifference"
      "setDistinct"
      "setIntersect"
      "setIsSubset"
      "setMultiplicity"
      "setPowerset"
      "setSize"
      "setSymDifference"
      "setUnion"
      "sign"
      "sin"
      "sinh"
      "size"
      "smaller"
      "smallerEq"
      "sort"
      "sqrt"
      "sqrtm"
      "square"
      "squeeze"
      "std"
      "stirlingS2"
      "subset"
      "subtract"
      "sum"
      "tan"
      "tanh"
      "to"
      "trace"
      "transpose"
      "typeOf"
      "unaryMinus"
      "unaryPlus"
      "unequal"
      "variance"
      "xgcd"
      "zeros"
    ]
    Fraction: ["/","%","percent","percentage"]
    MathOperator: ["+", "*", "-", "/", "x", "×", "÷", "%","plus","minus","divide","divided","times","multiply","multiplied"]
    Currency: ["US dollars"]

  tags: {}

  constructor: ()->
    that = @
    @nlp = require "compromise"

    compromiseNumbers = require "compromise-numbers"
    #compromiseDates = require "compromise-dates"

    @nlp.extend(compromiseNumbers)
    #@nlp.extend(compromiseDates)

    @nlp.extend (Doc, world)->
      world.addTags that.tags

      wordlist = {}
      Object.keys(that.dictionary).forEach (tag)->
        unless ["Currency"].includes(tag) # blacklist
          that.tags[tag] = that.tagSpec()

        that.dictionary[tag].forEach (word)->
          if wordlist[word]?
            console.log wordlist[word]
            wordlist[word].append tag
          else
            wordlist[word] = [tag]

      world.addWords wordlist

      # console.log wordlist


  options:
    terms:
      clean: true
      bestTag: true






  parser: ()->


  # work around compromise's limitations with respect to these words
  # * slashes
  #   - ignored when separated with a space on either side
  # * dashes
  #   - ignored between words
  # By adding a period to the end of / and -, it forces compromise to recognize them as words

  preparse: (string)->
    string.replace(/ \/ /g , " /. ").replace(/ - /g," -. ")



  terms: (val)->
    @nlp(val).join().json(@options)[0].terms

  nodes: (val)=>
    @terms(@preparse(val))

  nodeTags: (val)=>
    output = []
    @terms(@preparse(val)).forEach (item)->
      output.append item.tags
    output.unique()

  analyzeType: (expression)->
    # overrides
    guesses = []
    tags = @nodeTags(expression)
    suffix = ""
    checks = ["Date","Unit","HashTag","Time","MathOperator","Currency","Time"]


    if expression.includes(":")
      guesses.append "Time"

    checks.forEach (item)->
      if tags.includes(item)
        if item == "MathOperator"
          guesses.append "Math"
        else
          guesses.append item


    return guesses.unique()

  # translate the expression further before applying calculation

  translatedExpression: (expression)->

    switch @guessedType(@analyzeType(expression))
      when "Math"
        expression.replace(/times/g,"*")
        .replace(/divided by/g,"/")
      else
        return expression

  guessedType: (types)->
    type = "unknown"
    if types.includes("Math")
      type = "Math"

    type

  evaluate: (expression)->
    switch @guessedType(@analyzeType(expression))
      when "Math"
        try
          return math.evaluate(@translatedExpression(expression))
        catch e
          return e.toString()

      else
        return "i dunno"




module.exports = new ExpressionParser
