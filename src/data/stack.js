import {
  siArduino,
  siCplusplus,
  siEspressif,
  siExpress,
  siFastapi,
  siFramer,
  siGit,
  siGithub,
  siJavascript,
  siJsonwebtokens,
  siLinux,
  siMongodb,
  siMqtt,
  siNextdotjs,
  siNodedotjs,
  siOpenai,
  siPython,
  siRaspberrypi,
  siReact,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons";
import { CV, projects, techPills } from "./portfolioData";
import { blogPosts } from "./blogPosts";

/**
 * Capabilities map. Each technology carries its official mark (Simple Icons:
 * path + brand hex), a one-line description of what the technology *is*, and
 * a pattern that finds it in project data, CV roles/projects and blog posts —
 * so every "where was this used" answer is derived from real content, never
 * hand-maintained and never a self-rated percentage. Technologies without an
 * official mark get a `code` monogram instead of an invented logo.
 */
const CAPABILITIES = [
  {
    id: "web",
    label: "Web Development",
    marker: "web",
    summary: "Interfaces and product sites in React and Next.js — typed, responsive and motion-aware.",
    items: [
      ["React", siReact, "Component-based UI library.", /\breact(\.js| js)?\b(?! three)/i],
      ["Next.js", siNextdotjs, "React framework for routing, rendering and deployment.", /next\.?js|next js/i],
      ["TypeScript", siTypescript, "JavaScript with static types.", /typescript/i],
      ["JavaScript", siJavascript, "The language of the web platform.", /javascript|react|node/i],
      ["Tailwind CSS", siTailwindcss, "Utility-first CSS framework.", /tailwind/i],
      ["Framer Motion", siFramer, "Declarative animation library for React.", /framer motion/i],
      ["React Three Fiber", "R3F", "React renderer for Three.js scenes.", /react three fiber/i],
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    marker: "backend",
    summary: "Services, data models and authenticated APIs behind the interfaces.",
    items: [
      ["Node.js", siNodedotjs, "JavaScript runtime for servers and tooling.", /node(\.js| js)/i],
      ["Express", siExpress, "Minimal HTTP framework for Node.js.", /express/i],
      ["MongoDB", siMongodb, "Document database.", /mongo/i],
      ["FastAPI", siFastapi, "Python framework for typed HTTP APIs.", /fastapi/i],
      ["JWT auth", siJsonwebtokens, "Signed tokens for stateless authentication.", /\bjwt\b/i],
      ["REST APIs", "API", "Resource-oriented HTTP interfaces.", /\brest\b|\bapi\b/i],
    ],
  },
  {
    id: "ai",
    label: "AI & Intelligent Systems",
    marker: "ai",
    summary: "Computer vision and language models wired into products people use.",
    items: [
      ["Python", siPython, "General-purpose language behind most ML tooling.", /python|yolo|facenet/i],
      ["YOLOv8", "YOLO", "Real-time object detection model.", /yolo/i],
      ["FaceNet", "FNET", "Face-embedding model for recognition.", /facenet|face recognition/i],
      ["OpenAI API", siOpenai, "Hosted large language models.", /openai/i],
    ],
  },
  {
    id: "embedded",
    label: "Embedded Systems",
    marker: "embedded",
    summary: "Firmware on microcontrollers and single-board computers, close to the metal.",
    items: [
      ["C / C++", siCplusplus, "Systems languages for firmware.", /arduino|\bc\+\+|\bc\/c\+\+/i],
      ["Arduino", siArduino, "Microcontroller boards and toolchain.", /arduino/i],
      ["ESP32", siEspressif, "Wi-Fi + Bluetooth microcontroller by Espressif.", /\besp(32)?\b/i],
      ["Raspberry Pi", siRaspberrypi, "Linux single-board computer.", /raspberry/i],
    ],
  },
  {
    id: "iot",
    label: "Electronics & IoT",
    marker: "iot",
    summary: "Sensors, radios and telemetry that put hardware on the network.",
    items: [
      ["MQTT", siMqtt, "Lightweight publish/subscribe messaging protocol.", /mqtt/i],
      ["GSM", "GSM", "Cellular link for SMS and calls from devices.", /\bgsm\b|sim800/i],
      ["GPS", "GPS", "Satellite positioning receivers.", /\bgps\b|neo-6m/i],
      ["Sensors", "SNS", "Ultrasonic, environmental and other transducers.", /sensor|ultrasonic/i],
      ["Power management", "PWR", "Batteries, regulation and sleep states.", /battery|sleep states|power management|low[- ]power/i],
    ],
  },
  {
    id: "tools",
    label: "Tools & Workflow",
    marker: "tools",
    summary: "The everyday kit for versioning, building and running the work.",
    items: [
      ["Git", siGit, "Distributed version control.", /\bgit\b/i],
      ["GitHub", siGithub, "Hosting and collaboration for Git repositories.", /github/i],
      ["Vite", siVite, "Fast frontend build tool and dev server.", /\bvite\b/i],
      ["Linux", siLinux, "The operating system under servers and boards.", /linux/i],
    ],
  },
];

// CV.projects hold extra stack detail (e.g. YOLOv8) for portfolio projects of the same name.
const cvProjectFor = (p) =>
  CV.projects?.find((c) => c.name.split(" ").slice(0, 2).join(" ") === p.title.split(" ").slice(0, 2).join(" "));

const projectText = (p) => {
  const cv = cvProjectFor(p);
  return [
    p.title,
    p.shortDesc,
    p.fullDesc,
    ...(p.tags || []),
    ...(p.architecture || []).map((a) => a.desc),
    cv?.stack,
    ...(cv?.bullets || []),
  ].join(" ");
};

const roleText = (e) => [e.role, ...e.bullets].join(" ");
const postText = (b) => `${b.title} ${b.excerpt} ${b.content ?? ""}`;
const listedSkills = [...CV.skills, ...techPills];

export const capabilities = CAPABILITIES.map(({ items, ...cap }, ci) => {
  const techs = items.map(([name, icon, blurb, pattern]) => ({
    name,
    blurb,
    capability: cap.id,
    // Official mark when one exists; otherwise a short monogram string.
    icon: typeof icon === "string" ? null : { path: icon.path, hex: `#${icon.hex}`, title: icon.title },
    code: typeof icon === "string" ? icon : null,
    projects: projects
      .filter((p) => pattern.test(projectText(p)))
      .map((p) => ({ title: p.title, href: `/projects/${p.slug}` })),
    roles: CV.experience.filter((e) => pattern.test(roleText(e))).map((e) => `${e.role} — ${e.company}`),
    posts: blogPosts.filter((b) => pattern.test(postText(b))).map((b) => ({ title: b.title, href: `/blog/${b.slug}` })),
    listed: listedSkills.some((s) => pattern.test(s)),
  }));
  // Projects that use anything in this capability, most-connected first.
  const projectHits = new Map();
  techs.forEach((t) =>
    t.projects.forEach((p) => projectHits.set(p.href, { ...p, n: (projectHits.get(p.href)?.n ?? 0) + 1 })),
  );
  return {
    ...cap,
    index: String(ci + 1).padStart(2, "0"),
    techs,
    projects: [...projectHits.values()].sort((a, b) => b.n - a.n).map(({ title, href }) => ({ title, href })),
  };
});
