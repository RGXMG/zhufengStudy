const tags = {
  one: 'one',
  two: 'two'
};
const onPress = (tag) => {
  // TODO 判断tag
};
const render = () => [
  {
    tag: tags.one,
    src: require('...')
  },
  {
    tag: tags.two,
    src: require('...')
  }
].map(
  ({ tag, src }) => (
    <div onPress={() => onPress(tag)}>
      <img src={src} alt=""/>
    </div>
  ));