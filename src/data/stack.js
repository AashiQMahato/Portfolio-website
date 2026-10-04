import { CV, projects, techPills } from "./portfolioData";
import { blogPosts } from "./blogPosts";

/**
 * Technology map for the Skills section. Each tech lists the patterns that
 * identify it in project data, CV roles and blog posts, so every
 * "where was this used" answer is derived from real content rather than
 * hand-maintained (and never from self-rated percentages).
 */
const STACK = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      ["React", /\breact(\.js)?\b(?! three)/i],
      ["Next.js", /next\.?js/i],
      ["TypeScript", /typescript/i],
      ["Tailwind CSS", /tailwind/i],
      ["Framer Motion", /framer motion/i],
      ["React Three Fiber", /react three fiber/i],
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      ["Node.js", /node(\.js| js)/i],
      ["Express", /express/i],
      ["MongoDB", /mongo/i],
      ["JWT auth", /\bjwt\b/i],
      ["REST APIs", /\brest\b|\bapi\b/i],
    ],
  },
  {
    id: "programming",
    label: "Programming",
    items: [
      ["JavaScript", /javascript|react|node/i],
      ["Python", /python|yolo|facenet/i],
      ["C / C++", /arduino|\bc\+\+|\bc\/c\+\+/i],
    ],
  },
  {
    id: "embedded",
    label: "Embedded",
    items: [
      ["Arduino", /arduino/i],
      ["ESP32", /\besp(32)?\b/i],
      ["Raspberry Pi", /raspberry/i],
      ["Power management", /battery|sleep states|power/i],
    ],
  },
  {
    id: "iot",
    label: "IoT",
    items: [
      ["MQTT", /mqtt/i],
      ["GSM", /\bgsm\b|sim800/i],
      ["GPS", /\bgps\b|neo-6m/i],
      ["Sensors", /sensor|ultrasonic/i],
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    items: [
      ["YOLOv8", /yolo/i],
      ["FaceNet", /facenet|face recognition/i],
      ["OpenAI API", /openai/i],
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      ["Git & GitHub", /\bgit\b|github/i],
      ["Vite", /\bvite\b/i],
      ["Linux", /linux/i],
    ],
  },
];

const projectText = (p) =>
  [p.title, p.shortDesc, p.fullDesc, ...(p.tags || []), ...(p.architecture || []).map((a) => a.desc)].join(" ");

const roleText = (e) => [e.role, ...e.bullets].join(" ");

export const stackCategories = STACK.map(({ id, label }) => ({ id, label }));

export const stack = STACK.flatMap(({ id, label, items }) =>
  items.map(([name, pattern]) => ({
    name,
    category: id,
    categoryLabel: label,
    projects: projects
      .filter((p) => pattern.test(projectText(p)))
      .map((p) => ({ title: p.title, href: `/projects/${p.slug}` })),
    roles: CV.experience
      .filter((e) => pattern.test(roleText(e)))
      .map((e) => `${e.role} — ${e.company}`),
    posts: blogPosts
      .filter((b) => pattern.test(`${b.title} ${b.excerpt}`))
      .map((b) => ({ title: b.title, href: `/blog/${b.slug}` })),
    listed: [...CV.skills, ...techPills].some((s) => pattern.test(s)),
  })),
);
