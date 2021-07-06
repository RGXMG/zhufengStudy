/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 12:47
 *
 */
const lifecycle = [
  props =>
    new Promise((res, rej) => {
      console.log(props, "1");
      setTimeout(res, 1000);
    }),
  props =>
    new Promise((res, rej) => {
      console.log(props, "2");
      setTimeout(res, 1000);
    }),
  props =>
    new Promise((res, rej) => {
      console.log(props, "3");
      setTimeout(res, 1000);
    })
];
function load() {
  return props =>
    new Promise((res, rej) => {
      return lifecycle.reduce((a, b) => (resolve, reject) => {
        return a(props)
          .then(() => b(props))
          .then(resolve)
          .catch(reject);
      })(
        () => {
          console.log(99999);
          res();
        },
        () => {
          console.log("Error");
          rej();
        }
      );
    });
}
load()({ name: "xmg" }).then(() => {
  console.log("done");
});
