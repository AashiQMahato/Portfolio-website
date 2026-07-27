/**
 * Session-scoped boot state shared by BootLoader (writer) and the hero
 * entrance (reader) so the intro timeline waits for the overlay to clear.
 */
const KEY = "aashiq-boot-done";

export const BOOT_DONE_EVENT = "aashiq:boot-done";

let active = (() => {
  try {
    return !window.sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
})();

export const isBootActive = () => active;

export const markBootDone = () => {
  if (!active) return;
  active = false;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode — boot simply reruns next load */
  }
  window.dispatchEvent(new Event(BOOT_DONE_EVENT));
};
