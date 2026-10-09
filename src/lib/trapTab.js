/** Keep Tab focus inside `root` (modal dialogs and sheets). */
export default function trapTab(e, root) {
  if (e.key !== "Tab" || !root) return;
  const nodes = root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
