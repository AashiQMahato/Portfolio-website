/**
 * Layout position of `el` inside `root`, ignoring transforms — the glowing
 * wires measure with this, so motion on the plates never bends the wire.
 */
export const offsetBox = (el, root) => {
  let x = 0;
  let y = 0;
  let n = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};
