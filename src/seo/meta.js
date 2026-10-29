import { CV, projects } from "../data/portfolioData";

/**
 * Single source of truth for per-route SEO metadata. Read at runtime by
 * useRouteSeo (document head on every navigation) and at build time by
 * scripts/seo-pages.mjs (static per-route HTML + sitemap for crawlers and
 * link-preview bots that never execute JavaScript).
 */
export const SITE = {
  url: "https://www.aashikkumarmahato.com.np",
  name: "Aashik Kumar Mahato",
  shortName: "Aashik Mahato",
  alternateNames: ["Aashiq Mahato", "Aashik Mahato", "AashiQMahato"],
  jobTitle: CV.title,
  locale: "en_US",
  image: "/og-image.png",
  imageAlt: "Aashik Kumar Mahato — Electronics Engineer & Full-Stack Developer",
  description:
    "Aashik Kumar Mahato is an Electronics Engineer and Full-Stack Developer in Kathmandu, Nepal, building React and Next.js web apps, IoT systems, and embedded hardware.",
};

const abs = (path = "/") =>
  /^https?:\/\//.test(path) ? path : `${SITE.url}${path === "/" ? "/" : path}`;

const person = {
  "@type": "Person",
  "@id": `${SITE.url}/#person`,
  name: SITE.name,
  alternateName: SITE.alternateNames,
  url: abs("/"),
  image: abs(SITE.image),
  jobTitle: SITE.jobTitle,
  description: CV.summary,
  email: `mailto:${CV.contact.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Advanced College of Engineering and Management",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "JavaScript",
    "Node.js",
    "MongoDB",
    "Python",
    "Internet of Things",
    "Embedded Systems",
    "Arduino",
    "Raspberry Pi",
  ],
  sameAs: [CV.contact.github, CV.contact.linkedin],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: abs("/"),
  name: `${SITE.name} — Portfolio`,
  inLanguage: "en",
  publisher: { "@id": person["@id"] },
};

const breadcrumbs = (trail) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: abs(path),
  })),
});

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

const titled = (title) => `${title} | ${SITE.shortName}`;

const STATIC_ROUTES = {
  "/": {
    title: `${SITE.name} — Electronics Engineer & Full-Stack Developer`,
    description: SITE.description,
    jsonLd: graph(website, person, {
      "@type": "ProfilePage",
      "@id": `${SITE.url}/#profile`,
      url: abs("/"),
      name: `${SITE.name} — Portfolio`,
      isPartOf: { "@id": website["@id"] },
      mainEntity: { "@id": person["@id"] },
    }),
  },
  "/projects": {
    title: titled("Projects — IoT, Embedded & Web Case Studies"),
    description:
      "Case studies from Aashik Kumar Mahato: face-recognition attendance, a GSM/GPS smart blind stick, school management and React/Next.js web apps.",
    crumbs: [["Projects", "/projects"]],
  },
  "/resume": {
    title: titled("Résumé — Experience, Education & Skills"),
    description:
      "Résumé of Aashik Kumar Mahato: frontend developer and electronics engineer with experience at WebX Nepal and Entegra Sources. Download the PDF CV.",
    crumbs: [["Résumé", "/resume"]],
  },
  "/now": {
    title: titled("Now — What I'm Working On"),
    description:
      "What Aashik Kumar Mahato is focused on right now: current projects, learning goals and what's next.",
    crumbs: [["Now", "/now"]],
  },
  "/timeline": {
    title: titled("Timeline — Career & Education Journey"),
    description:
      "A timeline of Aashik Kumar Mahato's education in electronics engineering and work as a full-stack and frontend developer.",
    crumbs: [["Timeline", "/timeline"]],
  },
  "/developer-dashboard": {
    title: titled("GitHub Dashboard — Open Source Activity"),
    description:
      "Live GitHub activity for Aashik Kumar Mahato: repositories, languages and recent contributions.",
    crumbs: [["GitHub Dashboard", "/developer-dashboard"]],
  },
  "/analytics": {
    title: titled("Analytics Dashboard Demo"),
    description: "A demo analytics dashboard UI built with React and Recharts.",
    noindex: true,
  },
};

const NOT_FOUND = {
  title: titled("Page not found"),
  description: "This page doesn't exist. Head back to the portfolio home.",
  noindex: true,
};

/** Paths that should appear in the sitemap (indexable routes only). */
export const indexablePaths = () => [
  ...Object.keys(STATIC_ROUTES).filter((p) => !STATIC_ROUTES[p].noindex),
  ...projects.map((p) => `/projects/${p.slug}`),
];

/** Every route that should get its own prerendered HTML head. */
export const allPaths = () => [
  ...Object.keys(STATIC_ROUTES),
  ...projects.map((p) => `/projects/${p.slug}`),
];

export const lastModified = () => undefined;

const normalize = (pathname) => {
  const p = pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
};

/**
 * Resolve full metadata for a pathname. Always returns an object with
 * absolute `canonical`/`image` URLs and a `jsonLd` graph.
 */
export const getRouteMeta = (pathname) => {
  const path = normalize(pathname);
  let meta = STATIC_ROUTES[path];
  let type = "website";

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);

  if (!meta && projectMatch) {
    const project = projects.find((p) => p.slug === projectMatch[1]);
    if (project) {
      const description = project.shortDesc || project.tagline;
      meta = {
        title: titled(`${project.title} — Case Study`),
        description,
        image: typeof project.image === "string" && /^https?:/.test(project.image) ? project.image : undefined,
        crumbs: [
          ["Projects", "/projects"],
          [project.title, path],
        ],
        extra: {
          "@type": "CreativeWork",
          name: project.title,
          headline: project.title,
          description,
          url: abs(path),
          creator: { "@id": person["@id"] },
          ...(project.year ? { dateCreated: String(project.year) } : {}),
          ...(Array.isArray(project.tags) ? { keywords: project.tags.join(", ") } : {}),
        },
      };
    }
  }

  meta = meta || NOT_FOUND;

  const jsonLd =
    meta.jsonLd ||
    (meta.noindex
      ? null
      : graph(
          website,
          person,
          breadcrumbs([["Home", "/"], ...(meta.crumbs || [])]),
          ...(meta.extra ? [meta.extra] : []),
        ));

  return {
    title: meta.title,
    description: meta.description,
    canonical: abs(path),
    image: abs(meta.image || SITE.image),
    imageAlt: SITE.imageAlt,
    type,
    published: meta.published,
    noindex: Boolean(meta.noindex),
    jsonLd,
  };
};
