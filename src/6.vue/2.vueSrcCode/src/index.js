import Vue from "vue";

const vm = new Vue({
  el: "#root",
  data() {
    return {
      firstName: "rg",
      lastName: "xmg",
      msg: "hello",
      school: {
        name: "xmg",
        age: 18
      },
      arr: [[[5]], 1, 2, 3]
    };
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    }
  },
  watch: {
    msg(n, o) {
      console.log("msg:::", n, o);
    },
    "school.name": {
      immediate: true,
      handler(n, o) {
        console.log("msg immediate:::", n, o);
      }
    }
  }
});
window.vm = vm;
console.log(vm);

/**
 * 对象劫持：
 * NOTE 1. Array:
 *    1)：对原生的7大方法进行劫持(能改变数组本身的方法)，push/shift/unshift/splice/slice/pop/reverse，对其中能新增元素三个方法(unshift/push/splice(vm.$set如果改变数组的话就是调用的Array的splice方法))进行特殊处理，如果新增的元素为对象，则进行递归观测；
 *    2)：对数组的每一项进行遍历，如果项为复合类型，则对项进行递归观测；
 *    3): 缺点一：数组的索引未被观测，即直接改变数组的索引不会被检测到；在设计时是想避免性能消耗过大从而放弃观测；
 *    4)：缺点二：数组的长度length未被观测，即直接改变length属性不会被检测到；
 *
 * NOTE 2. Object：
 *    1)：遍历对象，对每一项进行观测，如果为复合类型，则进行递归观测；
 *    2)：直接改变对象的值，会直接再次调用observe递归观测；
 */
