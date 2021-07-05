/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/5
 * Time: 11:49
 *
 */

export default class Menu {
  constructor() {
    this.disp = "name";
  }
  show() {
    return (this.disp = "dddsssccc");
    window.alert(this.disp);
  }
}
Array.prototype.Menu = Menu;
