import { h, render, patch } from "./lib/index.js";

let oldVnode = h(
  "div",
  { id: "root", style: "color: red" },
  h("li", { key: 1, style: { color: "white", backgroundColor: "red" } }, "A"),
  h("li", { key: 2, style: { color: "white", backgroundColor: "red" } }, "B"),
  h("li", { key: 3, style: { color: "white", backgroundColor: "red" } }, "C"),
  h("input", { key: 4 }, "D")
);
render(oldVnode, app);
setTimeout(() => {
  let newVnode = h(
    "div",
    { id: "root", style: "color: red" },
    h("input", { key: 4 }),
    h("input", { key: 4 }),
    h("input", { key: 4 }),
    h("li", { key: 5, style: { color: "white", backgroundColor: "red" } }, "E"),
    h("li", { key: 6, style: { color: "white", backgroundColor: "red" } }, "D"),
    h("li", { key: 1, style: { color: "white", backgroundColor: "red" } }, "A"),
    h("li", { key: 3, style: { color: "white", backgroundColor: "red" } }, "C"),
    h("input", { key: 9 }, "G")
  );
  patch(oldVnode, newVnode);
}, 2000);
