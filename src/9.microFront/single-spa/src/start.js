/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 11:03
 *
 */
import { reroute } from "./navigations/reroute";

let started = false;
export function start() {
  if (started) return;
  started = true;
  reroute();
}
export function isStarted() {
  return started;
}
