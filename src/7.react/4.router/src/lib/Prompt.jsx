import React from "react";
import RouterContext from "./context";

/**
 * 提示组件
 * 当when为true，页面跳转时，会弹出confirm(message),让用户确认是否跳转
 *
 * 原理是通过在context上的history上定义一个block方法，接受message，
 * 当用户调用history的push时，判断message是否不等于null，不等于就弹出提示。
 * @param when
 * @param message
 * @returns {*}
 * @constructor
 */
function Prompt({ when, message }) {
  return (
    <RouterContext.Consumer>
      {context => (
        when ? context.history.block(message) : context.history.block(null),
        null
      )}
    </RouterContext.Consumer>
  );
}

export default Prompt;
