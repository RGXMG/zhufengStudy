/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/5
 * Time: 11:49
 *
 */

Array.prototype.Menu = function (a) {
  return a(() => {
    console.log("Menu:::");
    setTimeout(() => {
      console.log("Menu:::");
    }, 200);
  });
};
