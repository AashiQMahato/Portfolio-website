import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { EASE, DUR } from "./tokens";

// Single registration point — import gsap and plugins from here, never from
// "gsap" directly, so every module shares one configured instance.
gsap.registerPlugin(ScrollTrigger, Flip);
gsap.defaults({ ease: EASE.out, duration: DUR.base });
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, Flip };
