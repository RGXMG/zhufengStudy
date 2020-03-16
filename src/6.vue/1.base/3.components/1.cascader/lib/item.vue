<style lang="less" scoped>
.itemWrap {
  max-height: 300px;
  overflow-y: auto;
  display: inline-block;
}
.item {
  width: 150px;
  line-height: 40px;
  height: 40px;
  border-bottom: solid 1px #ddd;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
<template>
  <span>
    <div class="itemWrap">
      <div
        class="item"
        :style="isCheck(item) ? 'background-color: #00a8e6;' : ''"
        :key="item.key"
        @click="select(item)"
        v-for="item in options"
      >
        {{ item.label }}
      </div>
    </div>
    <Item
      v-if="currentSelectChildren"
      @change="onChange"
      :value="value"
      :options="currentSelectChildren"
      :level="level + 1"
    />
  </span>
</template>

<script>
export default {
  name: "Item",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: Array,
    level: Number
  },
  data() {
    return {
      selectedItem: []
    };
  },
  computed: {
    /**
     * NOTE 获取当前层选择的值对应的下一层数据
     * NOTE 给出下一级的options数据时使用$set给当前选择的selectedItem的children属性添加watcher
     * @returns {*}
     */
    currentSelectChildren() {
      this.$set(this.selectedItem, "children", this.selectedItem.children);
      return this.selectedItem.children ? this.selectedItem.children : null;
    },
    /**
     * NOTE 根据level判断当前层选择的值
     * @returns {*|{}}
     */
    currentLevelValue() {
      return this.value[this.level] || {};
    }
  },
  methods: {
    isCheck(item) {
      return item.key === this.currentLevelValue.key;
    },
    /**
     * NOTE 当发生onChange事件时，有俩种途径：
     *      1. 当前层选择发生改变，则直接创建一个数组，以level为索引，selectedItem为key向上传递；
     *      2. 当下层选择发生改变，则需要在传递上来的数组中添加自己level值，
     *  判断之后触发onChange，继续向上传递；
     * @param value
     */
    onChange(value) {
      let newV = [];
      newV[this.level] = this.selectedItem;
      if (value) {
        value[this.level] = this.selectedItem;
        newV = value;
      }
      this.$emit("change", newV);
    },
    /**
     * NOTE 当前层选择发生改变，触发onChange事件，向上级通知
     * @param item
     */
    select(item) {
      this.selectedItem = item;
      this.onChange(null);
    }
  }
};
</script>

<style scoped></style>
