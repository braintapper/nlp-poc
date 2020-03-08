<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Select from "../../components/Form/Select/Select.svelte"

  import Solver from "./Solver.svelte"
  import nlp from "compromise"
  import compromiseNumbers from "compromise-numbers"
  import compromiseDates from "compromise-dates"


  expressions = [


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
    converted =  nlp(val).join().json(
        terms:
          clean: true,
          bestTag: true
      )[0].terms

    return converted




</script>
<style lang="sass">
  field
    position: relative
    margin-top: 24px
  nodes

    display: table
  node
    display: table-cell
    vertical-align: top
    top: 0px
    left: auto
    display: inline-block
    margin-right: 20px
</style>
<Group title="Main">
  <div>
  {#each expressions as expression}
    <field>
      <label>Test Sentence</label>
      <input type="text" value={expression}/>
    </field>
    <nodes va="top">
      {#each nodes(expression) as item}
          <node>
            <div><h1>{item.text} ({item.clean})</h1></div>
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
