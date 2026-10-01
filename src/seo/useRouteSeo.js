import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE, getRouteMeta } from "./meta";

/** Find-or-create a head element matched by one attribute, then set attrs. */
const upsert = (tag, matchAttr, matchValue, attrs) => {
  let el = document.head.querySelector(`${tag}[${matchAttr}="${matchValue}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(matchAttr, matchValue);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const setMeta = (name, content) => upsert("meta", "name", name, { content });
const setProp = (property, content) => upsert("meta", "property", property, { content });

/**
 * Keeps <head> in sync with the current route: title, description,
 * canonical, robots, Open Graph, Twitter and JSON-LD. The prerendered HTML
 * already ships the same tags, so this only matters after client navigation.
 */
const useRouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const m = getRouteMeta(pathname);

    document.title = m.title;
    setMeta("description", m.description);
    setMeta("robots", m.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    upsert("link", "rel", "canonical", { href: m.canonical });

    setProp("og:type", m.type);
    setProp("og:title", m.title);
    setProp("og:description", m.description);
    setProp("og:url", m.canonical);
    setProp("og:image", m.image);
    setProp("og:image:alt", m.imageAlt);
    setProp("og:site_name", SITE.name);
    setMeta("twitter:title", m.title);
    setMeta("twitter:description", m.description);
    setMeta("twitter:image", m.image);

    const ld = document.getElementById("ld-json");
    if (m.jsonLd) {
      const script = ld || Object.assign(document.createElement("script"), { id: "ld-json", type: "application/ld+json" });
      script.textContent = JSON.stringify(m.jsonLd);
      if (!ld) document.head.appendChild(script);
    } else if (ld) {
      ld.remove();
    }
  }, [pathname]);
};

export default useRouteSeo;
