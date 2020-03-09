<template>
  <div id="app">
    <virtual-list
      :size="80"
      :remain="8"
      :items="items"
      :variable="true"
    >
      <Item 
        slot-scope="{item}" 
        :item="item"/>
    </virtual-list>
  </div>
</template>
<script>
import VirtualList from './components/virtual-list';
import Item from './components/item';
import Mock from 'mockjs'
let items = [];
for(let i = 0 ; i<1000 ; i++){
  items.push({id:i,value:Mock.Random.sentence()});
}
export default {
  name: 'App',
  data(){
    return {items}
  },
  components:{
    VirtualList,
    Item
  }
}
</script>
<style lang="stylus">
*{
  margin 0; 
  padding:0;
  box-sizing: border-box;
}
</style>
