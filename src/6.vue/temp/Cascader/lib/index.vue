<style lang="less" scoped>
.result {
  width: 200px;
  border: solid 1px #ddd;
  height: 40px;
}
</style>
<template>
  <div>
    <div class="result">
      <span :key="item.key" v-for="item of value">{{ item.label }}/</span>
    </div>
    <Item :value="value" :options="options" :level="0" @change="onChange" />
  </div>
</template>

<script>
/**
 * NOTE Cascader级联选择组件
 *   1. 主要用到了组件的递归思想；
 *   2. 定义一个level属性，然后将value一层一层传递下去，每层都会根据自身的level去从value中获取当前层的选择；
 *   3. 在上层组件中就将下一级的options传入，这样下一层组件拿到了就可以直接渲染，注意用户传入的options属性不会依次向下传递；
 *   4. 需要在组件给出下一级options时就使用$set方法绑定children属性，这样异步获取数据才能更新
 */
import Item from "./item";
export default {
  props: {
    options: {
      type: Array,
      default: () => [
        {
          label: "1",
          key: "1",
          children: [
            {
              label: "1-1",
              key: "1-1",
              children: [
                {
                  label: "1-1-1",
                  key: "1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "2",
          key: "2",
          children: [
            {
              label: "2-1",
              key: "2-1",
              children: [
                {
                  label: "2-1-1",
                  key: "2-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "3",
          key: "3",
          children: [
            {
              label: "3-1",
              key: "3-1",
              children: [
                {
                  label: "3-1-1",
                  key: "3-1-1"
                }
              ]
            }
          ]
        }
      ]
    },
    lazyLoad: {
      type: Function
    },
    value: Array
  },
  components: {
    Item
  },
  methods: {
    handle(item, children) {
      item.children = children;
    },
    onChange(value) {
      this.$emit("input", value);
      const item = value[value.length - 1];
      this.$emit("change", value);
      this.lazyLoad(item.key, children => this.handle(item, children));
    }
  }
};
</script>

<style scoped></style>
