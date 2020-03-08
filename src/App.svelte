<script lang="coffeescript">

  `export let environment`



  import TopSplit from "./components/Layout/TopSplit.svelte"

  import TopNavigator from "./pages/_page_components/TopNavigator.svelte"



  import Router from 'svelte-spa-router'
  import {push,pop, location, link, replace} from 'svelte-spa-router'



  import Main from './pages/Main/Group.svelte'



  pages = [
    {
      ordinal: 0
      url: "/"
      text: "main"
      context: "styles"
      component: Main
    }

  ]


  routes = {}

  pages.sortBy('ordinal').forEach (page)->
    routes[page.url] = page.component




  appName = "NLP POC"





</script>
<style lang="sass">
  div[slot="content"]
    padding: var(--spacing-xxl)
</style>


<svelte:head>
    <title>{ appName }</title>

</svelte:head>

<TopSplit header={true} headerSize="42px" footer={false}>
  <div slot="header">
    <TopNavigator {pages}/>
  </div>
  <div slot="content">
    <Router {routes}/>
  </div>
</TopSplit>
