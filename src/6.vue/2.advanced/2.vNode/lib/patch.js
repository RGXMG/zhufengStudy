/**
 * 渲染vnode元素到真是的dom节点上
 * @param vnode
 * @param container
 */
function render(vnode, container) {
  const dom = createDomElementFormVnode(vnode);
  container.appendChild(dom);
}
function createDomElementFormVnode(vnode) {
  let dom = null;
  const { type, key, props = {}, children = [], text } = vnode;
  if (type) {
    dom = document.createElement(type);
    // NOTE 递归render children
    children.forEach(child => render(child, dom));
  } else if (text) {
    dom = document.createTextNode(text);
  }
  // 将生成的真是dom元素与vnode绑定
  vnode.domElement = dom;
  updateDomProperties(vnode);
  return dom;
}

/**
 * 更新dom元素的属性
 * @param vnode
 * @param oldProps
 */
function updateDomProperties(vnode, oldProps = Object.create(null)) {
  const domElement = vnode.domElement;
  const newProps = vnode.props || {};
  // 循环oldProps，比对在newProps上是否存在
  // 如果不存在，则设置取消
  // NOTE 需要特殊处理事件等，不存在则需要解除绑定
  for (const k in oldProps) {
    if (!k in newProps) {
      domElement.removeAttribute(k);
    }
  }

  // 循环newProps，设置props到元素上
  // 1. 处理style
  // 2. NOTE 需要特殊处理事件，
  //     如果该事件在oldProps上存在且事件名和处理函数相同则不处理，
  //     如果不相同则需要解除原来的绑定再次绑定新的处理函数
  for (const k in newProps) {
    if (k === "style") {
      // 处理style时，需要先删除原有的style设置
      domElement.removeAttribute("style");
      const styles = newProps.style;
      if (typeof styles === "string") {
        domElement.style = styles;
      } else if (typeof styles === "object") {
        Object.keys(styles).forEach(n => {
          domElement.style[n] = styles[n];
        });
      }
    } else {
      domElement.setAttribute(k, newProps[k]);
    }
  }
}

/**
 * 更新方法，会将比对并更新
 * @param oldVnode
 * @param newVnode
 */
function patch(oldVnode, newVnode) {
  // NOTE 1. old和new的type不相等，则证明俩个不是同一个元素，则直接替换即可
  if (oldVnode.type !== newVnode.type) {
    const oldDom = oldVnode.domElement;
    oldDom.parentNode.replaceChild(createDomElementFormVnode(newVnode), oldDom);
  }

  // NOTE 2. new的type为undefined，则表示为text值，
  //  如果old的type不等于undefined且text不等于new的text则直接替换
  if (!newVnode.type) {
    if (oldVnode.type || oldVnode.text !== newVnode.text) {
      oldVnode.domElement.textContent = newVnode.text;
    }
  }

  // NOTE 3. 俩者的type相等，则直接更新即可
  //  这种情况下不需要创建新的element，直接使用原有的domElement属性即可
  const domElement = (newVnode.domElement = oldVnode.domElement);
  updateDomProperties(newVnode, oldVnode.props);

  // NOTE 4. 比对俩者的children属性
  //  a. new不存在children，old存在，则直接删除
  //  b. new存在children，old不存在，则直接创建
  //  c. 俩者都存在children，则需要递归处理了(重点处理)
  if (newVnode.children.length > 0 && oldVnode.children.length > 0) {
    updateChildren(domElement, oldVnode.children, newVnode.children);
  } else if (newVnode.children.length > 0) {
    render(newVnode, domElement);
  } else {
    domElement.innerHTML = "";
  }
}

function isSameVnode(n, o) {
  return n.type === o.type && n.key === o.key;
}
function createKeyToIndexMap(children) {
  let res = {};
  for (let i = 0; i < children.length; i++) {
    if (children[i].key) {
      res[children[i].key] = i;
    }
  }
  return res;
}
/**
 * NOTE 更新子元素， 通过在新旧vnode元素头尾设置索引来进行比对，俩个新旧children中插入存在三种情况
 *   1. 尾部插入：从尾部开始进行比较，
 *   2. 头部插入：从头部开始进行比较
 *   3. 中间插入
 * @param parent
 * @param oldChildren
 * @param newChildren
 */
function updateChildren(parent, oldChildren, newChildren) {
  // newVnode的头尾索引
  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  // newVnode的头尾索引
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];
  // 每个元素的key值对应的index(位置)映射
  // 用于乱序比较中，通过找出相同的key对应的index，从而在oldChildren中通过index找出元素
  const oldKeyIndexMap = createKeyToIndexMap(oldChildren);

  // 开始进行移位比对
  // 将index索引每次循环向前移动一位，然后比对每个对应的child
  // NOTE 一旦新旧之中的index超出children的总长，就结束循环
  while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    // 因为比较key的过程会将元素置为undefined
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    }
    // 因为比较key的过程会将元素置为undefined
    if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    // NOTE 头部vnode相等的话，表示可能是在中间或者尾部插入的元素
    //  patch俩个vnode元素
    //  将start指针从当前位置向后移动一位
    if (isSameVnode(newStartVnode, oldStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      newStartVnode = newChildren[++newStartIndex];
      oldStartVnode = oldChildren[++oldStartIndex];
      // NOTE 尾部相等的话，可能就是从头部插入
      //  patch俩个vnode元素
      //  将end指针向前移动一位
    } else if (isSameVnode(newEndVnode, oldEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      newEndVnode = newChildren[--newEndIndex];
      oldEndVnode = oldChildren[--oldEndIndex];
      // NOTE old首和end尾相等 \/
      //  patch俩个vnode元素
      //  将当前的oldStart元素放到最后一个old元素的后面，
      //  然后将old的start指针向后移动，将new的end指针向前移动
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(
        oldStartVnode.domElement,
        oldEndVnode.domElement.nextSibling
      );
      oldStartVnode = oldChildren[++oldStartIndex];
      // newStartVnode = newChildren[++newStartIndex];
      newEndVnode = newChildren[--newEndIndex];
      // NOTE old的尾和new的头相等 / \
      //  patch俩个元素
      //  将当前的oldEnd元素移动到oldStart元素前面
      //  将old的end指针向前移动，将new的start指针向后移动
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
      // NOTE 首尾都没有匹配成功，表示顺序被打乱
      //  则需要通过key方式进行匹配，将匹配的元素选出来插入
    } else {
      // NOTE 尝试匹配俩个相同key的元素
      const toMoveVnode = oldChildren[oldKeyIndexMap[newStartVnode.key]];
      // NOTE 如果存在相同key的元素
      //  就将其移动到oldStartVnode之前
      //  因为这里将相同的key的元素置为了undefined，所以上面就需要做出判断
      if (toMoveVnode) {
        oldChildren[oldKeyIndexMap[newStartVnode.key]] = undefined;
        parent.insertBefore(toMoveVnode.domElement, oldStartVnode.domElement);
      } else {
        // NOTE 不存在相同key的元素
        //  就创建一个新元素添加到对应的newStartVnode前面
        parent.insertBefore(
          createDomElementFormVnode(newStartVnode),
          oldStartVnode.domElement
        );
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // NOTE 新增：当newEndIndex 大于等于 newStartIndex时,
  //  则表示在while中，oldEndIndex已经小于oldStartIndex，然后退出了循环
  //  也就是newChildren的length要大于oldChildren的length
  //  可能存在俩种情况，就是在头部新增、尾部新增
  if (newStartIndex <= newEndIndex) {
    // NOTE 1. 如果是在头部新增的话，则在while中是newEndIndex在递减,也就是说newStartIndex === 0
    //         而oldStartIndex <= oldEndIndex条件为满足结束循环，则oldEndIndex这个时候 === -1，
    //         而我们要做的就是讲newChildren中新增的元素插入到oldChildren的第一个元素中
    // NOTE 2. 如果实在尾部新增的话，则在while中是newStartIndex在递增,也就是说newStartIndex === oldChildren.length
    //         而oldStartIndex <= oldEndIndex条件为满足结束循环，则oldStartIndex === oldChildren.length
    //         这种情况下我们要做的就是在parent下新增即可
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 头部新增：oldChildren[i + 1] => oldChildren的第一个元素
      // 尾部新增：oldChildren[i + 1] => undefined
      const beforeElement = oldChildren[oldEndIndex + 1]
        ? oldChildren[oldEndIndex + 1].domElement
        : null;
      // 当为null时,会变为appendChild
      parent.insertBefore(
        createDomElementFormVnode(newChildren[i]),
        beforeElement
      );
    }
  }

  // NOTE 比较完成之后，如果没有将old的元素全部参与循环
  //  则表示old中存在new中不需要的元素，所以我们要将这中间得元素进行删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        parent.removeChild(oldChildren[i].domElement);
      }
    }
  }
}
export { render, patch };
