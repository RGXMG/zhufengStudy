<template>
  <div>
    <h2>我是父亲</h2>
    <div>父亲的钱数：{{ myMoney }}</div>

    <!-- NOTE .sync 语法糖，可以传递任意值，对同一个组件不限制使用个数 -->
    <!-- NOTE 将input方法绑定在Son1上，这里实际上是将下面的事件绑定解析成一个对象 -->
    <!-- NOTE { update: change }, 然后Son1会遍历该对象，将input方法使用$emit.on('update', change)，把input方法绑定到自己身上，但是处理函数确实父组件的 -->
    <Son1 @update="change" :value="myMoney" />
    <!-- NOTE 可以将上面的更加简化为下面的方式，使用行内函数 -->
    <Son1
      :value="myMoney"
      @update:value="
        v => {
          myMoney = v;
        }
      "
    ></Son1>
    <!-- NOTE vue提供了一个sync的语法糖，取代上面的方式，但是实际上原理还是上面一样 -->
    <!-- NOTE :value.sync时，子组件必须使用`update:value`作为this.$emit()的事件名 -->
    <Son1 :value.sync="myMoney"></Son1>

    <!-- NOTE v-model 语法糖，只能传递value值，也就是子组件必须声明props中的value，同一个组件只能使用一个 -->
    <!-- NOTE 将value传入子组件，然后向子组件注册一个input事件的处理方法 -->
    <Son1
      :value="myMoney"
      @input="
        v => {
          myMoney = v;
        }
      "
    ></Son1>
    <!-- NOTE 等同于v-model -->
    <Son1 v-model="myMoney"></Son1>
  </div>
</template>

<script>
import Son1 from "./Son1";
export default {
  components: {
    Son1
  },
  data() {
    return {
      myMoney: 100
    };
  },
  methods: {
    change(v) {
      this.myMoney = v;
    }
  }
};
</script>

<style scoped></style>
