<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Select from "../../components/Form/Select/Select.svelte"

  import Solver from "./Solver.svelte"
  import nlp from "compromise"
  import compromiseNumbers from "compromise-numbers"
  import compromiseDates from "compromise-dates"

  nlp.extend(compromiseNumbers)
  nlp.extend(compromiseDates)

  nlp.extend (Doc, world)->
    world.addTags
      Operator:
        isNotA: "Noun"
        isNotA: "Adjective"
        isNotA: "Conjunction"
    world.addTags
      Separator:
        isNotA: "Noun"
        isNotA: "Adjective"
        isNotA: "Conjunction"

    world.addWords
      "+": "Operator"
      "*": "Operator"
      "-": ["Operator","Separator"]
      "/": ["Operator","Separator"]
      "x": "Operator"
      "plus": "Operator"
      "minus": "Operator"
      "times": ["Operator","Plural"]
      "US dollars": "Currency"



  expressions = [
    "10 percent off 100"
    "5 times 1"
    "35% off 400k"
    "$30 a night x 3 nights"
    "$30CAD in USD"
    "$30CAD in US Dollars"
    "$30CAD + $20USD"
    "line1 + 5%"
    "5 / 10"
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
    converted =  nlp(val).join().json(
        terms:
          clean: true,
          bestTag: true
      )[0].terms

    return converted




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
    <nodes va="top">
      {#each nodes(expression) as item}
          <node>
            <div><h1><code>{item.text}</code></h1></div>
            <div>{@html item.tags.join("<br/>")}</div>
          </node>
      {/each}
    </nodes>
    <!--<pre>{JSON.stringify(nodes(expression), null, 2)}</pre>-->
  {/each}
  </div>

  <!--

  <div>

      <Solver/>



  </div>
  -->
</Group>
