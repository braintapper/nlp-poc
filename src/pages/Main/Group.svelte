<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Select from "../../components/Form/Select/Select.svelte"

  import Repl from "./Repl.svelte"
  import nlp from "compromise"
  import compromiseNumbers from "compromise-numbers"
  import compromiseDates from "compromise-dates"

  nlp.extend(compromiseNumbers)
  nlp.extend(compromiseDates)

  nlp.extend (Doc, world)->
    world.addTags
      Operator:
        notA: "Noun"
        notA: "Adjective"
        notA: "Conjunction"
        notA: "Singular"
    world.addTags
      Separator:
        notA: "Noun"
        notA: "Adjective"
        notA: "Conjunction"



    world.addWords
      "(": "Bracket"
      "+": "Operator"
      "*": "Operator"
      "#-#": ["Operator"]
      "./.": ["Operator"]
      "x": "Operator"
      "plus": "Operator"
      "minus": "Operator"
      "divide by": "Operator"
      "divided by": "Operator"
      "times": ["Operator","Plural"]
      "multiply by": "Operator"
      "multiplied by": "Operator"
      "US dollars": "Currency"
      "percentage": "Fraction"

    world.postProcess (doc)->
      doc.match("/\//").tag("#Operator")
      doc.match("/\-/").tag("#Operator")


  expressions = [
    "4 / 2 * 5 - 1 -1"
    ":49 45:"
    "2 * 5 + 2 - 1 / 2  :49  45: 12:00"
    ":49"
    "6 - 4 + 1"
    "5 / 10"
    "10 percent off 100"
    "5 times 1"
    "35% off 400k"
    "$30 a night x 3 nights"
    "$30CAD in USD"
    "$30CAD in US Dollars"
    "$30CAD + $20USD"
    "line1 + 5%"

    "line1 as a percentage of #line2"
    "line1 as a % of #line2"
    "5 days from now"
    "yesterday"
    "days between today and 12/25"
    "2015-01-1 plus 10 days"
    "2015-01-1 + 10 days"
    "hours between now and 5am"

  ]
  nodes = (val)=>

    transformedVal = val.replace(/ \/ /g , " ./. ").replace(/ - /g," #-# ")
    # transformedVal = val
    options =
      terms:
        clean: true
        bestTag: true


    converted =  nlp(transformedVal).join().json(options)[0].terms
    ###
    .json(
        terms:
          #clean: true,
        #  #bestTag: true
      )[0]
    ###

    return converted


  nodeTags = (val)=>

    transformedVal = val.replace(/ \/ /g , " ./. ").replace(/ - /g," #-# ")
    # transformedVal = val
    options =
      terms:
        clean: true
        bestTag: true


    converted =  nlp(transformedVal).join().json(options)[0].terms



    # return converted

    output = []
    converted.forEach (item)->
      output.append item.tags

    return output.unique()

  analyzeType = (expression)->
    # overrides
    guesses = []
    tags = nodeTags(expression)
    suffix = ""
    checks = ["Date","Unit","HashTag","Time","Operator","Currency","Time"]


    if expression.includes(":")
      guesses.append "Time"

    checks.forEach (item)->
      if tags.includes(item)
        guesses.append item


    if guesses.includes("HashTag")
      suffix = ", ##"
    if guesses.includes("Time")
      return "Time"
    else if guesses.includes("Date")
      return  "Date"
    else if guesses.includes("Unit")
      return "Conversion"
    else if guesses.includes("Currency")
      return "Forex"
    else
      return "Math"


  sanitizeMath = (val)->
    val.replace("times","*")

</script>
<style lang="sass">
  nodes
    display: table
    margin-bottom: 20px
  node
    display: table-cell
    vertical-align: top
    top: 0px
    left: auto
    display: inline-block
    margin-right: 24px
    h1
      color: var(--blue)
      text-decoration: underline
</style>
<Group title="Main">

    <div>
      {#each expressions as expression}

          <h1>{expression} <label type="tag" margin-left-s>{analyzeType(expression)}</label></h1>

          <p>Detected: {nodeTags(expression).join(",")}</p>
          <nodes>
            {#each nodes(expression) as item}
              <node>
                  <div><h1><code>{item.text}</code></h1></div>
                  <div>{@html item.tags.join("<br/>")}</div>
                </node>
            {/each}
          </nodes>

          <!--  <pre>{JSON.stringify(nodes(expression), null, 2)}</pre>-->

          <hr/>
      {/each}
    </div>

  <!--

  <div>

      <Repl/>



  </div>
  -->
</Group>
