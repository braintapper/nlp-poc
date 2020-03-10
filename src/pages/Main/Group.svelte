<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Select from "../../components/Form/Select/Select.svelte"
  import Expandable from "../../components/Expandable/Expandable.svelte"

  import parser from "../../helpers/nlp_classification.js"

  import Repl from "./Repl.svelte"

  # parser = new ExpressionParser


  expressions = [
    # { expression: "6 % 4", expectedResult: 2, expectedType: "Math" , expectedInterpretation: "Math"}
    # { expression: "4 / 2 * 5 - 1 -1", expectedResult: 8, expectedType: "Math" , expectedInterpretation: "Math"}
    { expression: "12 divided by 3", expectedResult: 4, expectedType: "Time" , expectedInterpretation: "Math"}
    { expression: "2 * 5 + 2 - 1 / 2  :49  45: 12:00", expectedResult: "Invalid", expectedType: "Invalid" , expectedInterpretation: ""}
    { expression: ":49", expectedResult: "00:49", expectedType: "Time" , expectedInterpretation: ""}
    # { expression: "6 - 4 + 1", expectedResult: 3, expectedType: "Math" , expectedInterpretation: ""}
    { expression: "5 / 10", expectedResult: 0.5, expectedType: "Math" , expectedInterpretation: ""}
    { expression: "10 percent off 100", expectedResult: 90, expectedType: "Math" , expectedInterpretation: ""}
    { expression: "5 times 1", expectedResult: 5, expectedType: "Math" , expectedInterpretation: ""}
    { expression: "35% off 400k", expectedResult: "", expectedType: "Math" , expectedInterpretation: ""}
    { expression: "$30 a night x 3 nights", expectedResult: 90, expectedType: "Math" , expectedInterpretation: ""}
    { expression: "$30CAD in USD", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$30CAD in US Dollars", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$30CAD + $20USD", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "line1 + 5%", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "line1 as a percentage of #line2", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "line1 as a % of #line2", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5 days from now", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "yesterday", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "days between today and 12/25", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "2015-01-1 plus 10 days", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "2015-01-1 + 10 days", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "hours between now and 5am", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$30 in Euro", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$30 CAD + 5 USD - 7EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "PST time", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "New York time", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "Time in Madrid", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "2:30 pm HKT in Berlin    ", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "8 times 9", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "1 meter 20 cm = 120 cm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "6 (3) = 18", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "0b110111011 ", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "0o1435343 in hex", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5 300 in sci", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "20% of $10", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5% on $30", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "6% off 40 EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$50 as a % of $100", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$70 as a % on $20", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$20 as a % off $70", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5% of what is 6 EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5% on what is 6 EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "5% off what is 6 EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$2k ", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "2M eur", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "Pi pi", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "E e", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "root 2 (8)", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "sqrt 16", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "cbrt 8", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "abs(-4)", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "log 2 (10)", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "ln 3", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "fact 5", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "round 3.45", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "ceil 3.76", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "floor 2.56", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "sin 45°", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "cos 3.45", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "tan 8", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "sinh 3", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "cosh 9", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "tanh 11", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "12 pt in px", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "em = 20px", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "1.2 em in px", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "1 inch in px = 96 px", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "ppi = 326", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "1 cm in px = 128,35 px", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "Cost: $20 + 56 EUR", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "Discounted: prev - 5% discount", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "1 mm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "2 picometers", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "3 GB", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "round(1 month in days) ", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "fromunix(1446587186)", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "20 sq cm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "30 square inches", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "11 sqm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "20 cu cm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "30 cubic inches", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "11 cbm", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "# This is header", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "$275 for the \"Model 227\"", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "// This is comment", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
    { expression: "Price: $11 + $34.45", expectedResult: "", expectedType: "" , expectedInterpretation: ""}
  ]


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

  [expression-type="Math"]
    background: var(--red)
</style>
<Group title="Main">

    <div>
      {#each expressions as item}
        {#if item.expectedType == "Math"}
          <h1>{item.expression} <label type="tag" expression-type={parser.analyzeType(item.expression)} margin-left-s>{parser.analyzeType(item.expression)}</label></h1>
          <h2>Result: {parser.evaluate(item.expression)} <label type="tag" margin-left-s>{item.expectedResult}</label></h2>
          <p>Detected: {parser.nodeTags(item.expression).join(",")}</p>
          <Expandable open={false}>
            <div slot="summary">Detailed Breakdown</div>
          <nodes>
            {#each parser.nodes(item.expression) as node}
              <node>
                  <div><h1><code>{node.text}</code></h1></div>
                  <div>{@html node.tags.join("<br/>")}</div>
                </node>
            {/each}
          </nodes>
          </Expandable>
          <hr/>
        {/if}
      {/each}
    </div>

  <!--

  <div>

      <Repl/>



  </div>
  -->
</Group>
