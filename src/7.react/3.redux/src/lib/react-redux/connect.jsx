import React from "react";
import { bindActionCreators } from "../redux";
import context from "./context";
/**
 * NOTE  该方法为高阶函数，并会返回一个高阶组件，在该函数内，会将store中的state以及action映射到connect的组件中去
 *  之所以需要connect函数，则是因为希望能够以更小颗粒化的控制和获取store中数据，并且以最小范围和代价的监听state变化,
 *  如一个组件connect了一部分store中的数据，而当store中其他数据反生变化之后，connect就会可以通过比较得出需不需要重新渲染，如PureComponent的浅比较
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 * @param options
 */
export default function (mapStateToProps, mapDispatchToProps, mergeProps, options) {
  return (WrapperComponent) => {
    return class extends React.PureComponent {
      static contextType = context;
      constructor() {
        super();
        this.unsubscrible = null;
        this.dispatchProps = {};
      }
      updateState() {
        this.setState(mapStateToProps(this.context.getState()), this.props);
        this.dispatchProps = bindActionCreators(
          mapDispatchToProps(this.context.dispatch, this.props),
          this.context.dispatch
        );
        this._props = mergeProps?.(this.props) || this.props;
      }
      componentDidMount() {
        this.updateState();
        this.unsubscrible = this.context.subscribe(this.updateState.bind(this));
      }
      componentWillUnmount() {
        this.unsubscrible();
      }
      render() {
        return <WrapperComponent {...this.state} {...this.dispatchProps} {...this._props} />;
      }
    };
  };
}
