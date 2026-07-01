const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const TECH_ICONS = {
  Arduino: `${DEVICON}/arduino/arduino-original.svg`,
  "GSM Module": null,
  GPS: null,
  Sensors: null,
  Python: `${DEVICON}/python/python-original.svg`,
  "Face Recognition": null,
  React: `${DEVICON}/react/react-original.svg`,
  "React.js": `${DEVICON}/react/react-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  "Next.js": `${DEVICON}/nextjs/nextjs-original.svg`,
  C: `${DEVICON}/c/c-original.svg`,
  "Raspberry Pi": `${DEVICON}/raspberrypi/raspberrypi-original.svg`,
  HTML: `${DEVICON}/html5/html5-original.svg`,
  CSS: `${DEVICON}/css3/css3-original.svg`,
  "VS Code": `${DEVICON}/vscode/vscode-original.svg`,
  "Framer Motion": null,
  MQTT: null,
  "REST API": null,
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  "Node.js": `${DEVICON}/nodejs/nodejs-original.svg`,
  "Express.js": `${DEVICON}/express/express-original.svg`,
  "C++": `${DEVICON}/cplusplus/cplusplus-original.svg`,
};

export const CV = {
  name: "Aashik Kumar Mahato",
  title: "Electronics Engineer & Full-Stack Developer",
  contact: {
    location: "Shantinagar, Kathmandu",
    phone: "+977-9808711811",
    email: "aashikkrmahatoo@gmail.com",
    github: "https://github.com/Aashik9567",
    linkedin: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/",
  },
  summary:
    "Dynamic IT professional with a strong foundation in modern web development and electronics engineering. Skilled in the React ecosystem, Next.js, TypeScript, and IoT systems. Adept at translating complex technical concepts into clear, user-friendly solutions.",
  experience: [
    {
      role: "Technical Writer – Electronics",
      company: "Entegra Sources Pvt. Ltd",
      location: "Buddhanagar",
      period: "Nov 2025 – Feb 2026",
      bullets: [
        "Prepared Career Episodes, technical reports, and engineering documentation.",
        "Drafted, edited, and designed technical content aligned with competency standards.",
        "Translated complex engineering narratives into structured professional documents.",
      ],
    },
    {
      role: "Frontend Developer",
      company: "WebX Nepal",
      location: "Lazimpat",
      period: "Jun 2025 – Sep 2025",
      bullets: [
        "Designed and developed responsive web interfaces using React and Tailwind CSS.",
        "Converted UI/UX designs into interactive web applications with performance optimization.",
        "Ensured cross-browser compatibility and visually appealing digital experiences.",
      ],
    },
  ],
  education: [
    {
      degree: "BE in Electronics, Communication & Information Engineering",
      institution: "Advanced College of Engineering and Management",
      location: "Kathmandu",
      period: "Jan 2021 – Jan 2025",
    },
    {
      degree: "Class 12",
      institution: "Prasadi Academy",
      location: "Kathmandu",
      period: "Jul 2018 – Jul 2019",
    },
    {
      degree: "SEE",
      institution: "Swastik Pathshala",
      location: "Mirchaiya",
      period: "Mar 2012 – Mar 2017",
    },
  ],
  projects: [
    {
      name: "Automated Attendance Management System",
      stack: "YOLOv8, FaceNet, React, Node.js, MongoDB",
      url: "https://github.com/Aashik9567/Automated_Attendance_Management_System",
      bullets: [
        "Automated attendance using YOLOv8 and FaceNet for real-time face recognition.",
        "Built a web platform with React, Node.js, and MongoDB for live tracking.",
        "Implemented email notifications for low attendance alerts.",
      ],
    },
    {
      name: "WeatherApp – AI-Enhanced Weather Dashboard",
      stack: "Next.js, OpenAI, Responsive UI",
      url: "https://github.com/Aashik9567/weather-app-NextJs",
      bullets: [
        "Real-time weather data with auto-refresh and AI-powered analysis.",
        "Interactive location search with GPS support and 10-day forecast.",
        "Dark theme with glassmorphism UI and fully responsive design.",
      ],
    },
    {
      name: "Smart School Management System",
      stack: "React, Node.js, Express, MongoDB",
      url: "https://github.com/Aashik9567/Smart-School-management-system-Frontend",
      bullets: [
        "Role-based dashboards for Admin, Teacher, Student, and Parent.",
        "Modules for attendance, timetable, marks, fee monitoring, and notifications.",
        "AI-powered analytics and student performance insights.",
      ],
    },
    {
      name: "Cable Network Website",
      stack: "Next.js, TypeScript, Tailwind CSS, Ant Design, React Three Fiber",
      url: "https://raghunathpurcable.com.np/",
      bullets: [
        "Modern ISP website with dark/light/system theme support.",
        "Animated 3D visuals using React Three Fiber and smooth transitions.",
        "Scalable frontend architecture with reusable components.",
      ],
    },
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React JS",
    "Next JS",
    "TypeScript",
    "Node JS (Express)",
    "MongoDB (Mongoose)",
    "Python",
    "C/C++",
    "Git/GitHub",
    "Arduino",
    "ESP",
    "Raspberry Pi",
  ],
  languages: ["English", "Nepali"],
};

export const projects = [
  {
    slug: "ultrasonic-blind-stick",
    title: "Ultrasonic Blind Stick with GSM/GPS",
    tagline:
      "Assistive IoT device for safer navigation + instant emergency location sharing.",
    shortDesc:
      "An assistive technology device that helps visually impaired individuals navigate with obstacle detection and emergency alerts.",
    fullDesc:
      "An Arduino-based smart blind stick that combines ultrasonic obstacle detection with GSM + GPS modules for emergency assistance. It provides real-time obstacle alerts via haptic feedback, supports location tracking, and is designed for everyday reliability with a weather-resistant build and rechargeable battery.",
    problemStatement:
      "Traditional sticks can't detect waist/head-level obstacles reliably, and emergency location sharing is hard. This project targets safer navigation and instant caregiver alerts in a cost-conscious build.",
    architecture: [
      {
        component: "Sensors",
        desc: "Ultrasonic sensor (HC-SR04) for obstacle distance measurement",
      },
      {
        component: "Microcontroller",
        desc: "Arduino Nano processing sensor data & triggering feedback",
      },
      {
        component: "Communication",
        desc: "SIM800L GSM + Neo-6M GPS for SMS-based location sharing",
      },
      {
        component: "Feedback",
        desc: "Vibration motors for haptic feedback based on distance",
      },
    ],
    challenges: [
      {
        title: "Power Management",
        problem: "GPS/GSM modules drain batteries quickly.",
        solution:
          "Optimized sensor cadence + sleep states to extend battery life to ~12 hours.",
      },
      {
        title: "Noisy Readings",
        problem: "Outdoor conditions caused false ultrasonic readings.",
        solution:
          "Added smoothing/outlier rejection to stabilize distance signals.",
      },
    ],
    lessons: [
      "Hardware-software co-design requires real-world testing.",
      "Assistive tech needs reliability-first decisions within tight budgets.",
    ],
    metrics: [
      {
        label: "Obstacle Detection",
        value: "2m",
        improvement: "Real-time ultrasonic sensing",
      },
      {
        label: "Battery Life",
        before: "4 hours",
        after: "12 hours",
        improvement: "+200%",
      },
      {
        label: "Emergency Alert Time",
        value: "< 5s",
        improvement: "Instant SMS via GSM",
      },
    ],
    gallery: [
      "https://media.springernature.com/lw685/springer-static/image/chp%3A10.1007%2F978-981-33-4866-0_23/MediaObjects/498359_1_En_23_Fig2_HTML.png",
    ],
    image:
      "https://media.springernature.com/lw685/springer-static/image/chp%3A10.1007%2F978-981-33-4866-0_23/MediaObjects/498359_1_En_23_Fig2_HTML.png",
    tags: ["Arduino", "GSM Module", "GPS", "Sensors"],
    features: [
      "2m ultrasonic obstacle detection",
      "12-hour rechargeable battery",
      "Haptic vibration feedback",
      "Weatherproof enclosure design",
    ],
    github: null,
    live: null,
    role: "Embedded systems + integration",
    scope: "Hardware prototype · Sensor + GSM/GPS integration",
    timeline: "6–8 weeks (prototype → field tests)",
    audience: ["Visually impaired users", "Caregivers/guardians"],
    whyItMatters: [
      "Reduces navigation risk with obstacle feedback.",
      "Sends emergency location instantly.",
      "Keeps assistive hardware affordable.",
    ],
    recruiterSummary:
      "Designed an end-to-end embedded prototype (sensing → logic → haptics/SMS) with real-world constraints like power, noise, and reliability.",
    futureImprovements: [
      "Add multi-sensor fusion (ultrasonic + IMU) to reduce false positives.",
      "Add a companion mobile app for caregiver settings.",
      "Improve enclosure sealing + charging UX.",
    ],
    category: "Hardware",
    cats: ["Hardware", "IoT"],
    status: "live",
    stars: 12,
    forks: 5,
    views: 340,
    year: "2023",
    teamSize: 3,
    featured: false,
    highlights: [
      "Power-aware sensing cadence and sleep states",
      "GSM+GPS emergency SMS workflow",
      "Haptic feedback tuned for usability",
    ],
  },
  {
    slug: "automated-attendance-system",
    title: "Automated Attendance System",
    tagline:
      "Face-recognition attendance that eliminates manual roll-calls and proxy attendance.",
    shortDesc:
      "A web-integrated attendance management system using facial recognition that streamlines tracking for educational institutions.",
    fullDesc:
      "Built to eliminate manual attendance headaches in educational institutions, this system uses a Python-based facial recognition engine. Students register once with a photo, and the system recognizes them in real-time via webcam. The React frontend provides a clean dashboard for teachers, while the MongoDB backend stores attendance logs with timestamps. Reports can be generated as CSV exports with filtering by date, class, and student.",
    problemStatement:
      "Manual roll-calls consume class time and can be manipulated via proxy attendance. Schools need a frictionless, auditable workflow without specialized biometric hardware.",
    architecture: [
      {
        component: "AI Engine",
        desc: "Python pipeline for face detection + embeddings",
      },
      {
        component: "Backend",
        desc: "Node.js + Express APIs bridging AI and database",
      },
      {
        component: "Database",
        desc: "MongoDB for students, embeddings, logs, and users",
      },
      {
        component: "Frontend",
        desc: "React dashboard for live monitoring + exports",
      },
    ],
    challenges: [
      {
        title: "Lighting Variations",
        problem: "Accuracy drops in poorly lit classrooms.",
        solution:
          "Added robustness improvements and capture guidance to reduce low-light failures.",
      },
      {
        title: "Real-time Load",
        problem: "Continuous processing caused lag and high CPU usage.",
        solution:
          "Optimized processing cadence and reduced redundant compute while keeping UX responsive.",
      },
    ],
    lessons: [
      "ML in production needs monitoring and graceful fallbacks.",
      "Auditability matters as much as accuracy for institutional tools.",
    ],
    metrics: [
      {
        label: "Time Saved",
        before: "15 mins/class",
        after: "0 mins",
        improvement: "-100%",
      },
      {
        label: "Recognition Accuracy",
        value: "99.5%",
        improvement: "High-confidence pipeline",
      },
      {
        label: "Proxy Attendance",
        before: "~5%",
        after: "0%",
        improvement: "Eliminated",
      },
    ],
    gallery: [
      "https://github.com/Aashik9567/Automated_Attendance_Management_System/raw/main/screenshots/dash.png",
    ],
    image:
      "https://github.com/Aashik9567/Automated_Attendance_Management_System/raw/main/screenshots/dash.png",
    tags: ["Python", "Face Recognition", "React", "MongoDB"],
    features: [
      "Real-time webcam-based attendance capture",
      "Exportable attendance logs (CSV)",
      "Role-based access for teachers/admins",
    ],
    github:
      "https://github.com/Aashik9567/Automated_Attendance_Management_System",
    live: "https://aams-frontend.onrender.com/",
    category: "Full-Stack",
    cats: ["Full-Stack", "AI/ML"],
    status: "live",
    stars: 24,
    forks: 8,
    views: 580,
    year: "2024",
    teamSize: 4,
    featured: true,
    highlights: [
      "Vector embeddings stored for fast matching",
      "Batch-friendly workflow for large classrooms",
      "Dashboard optimized for daily operations",
    ],
  },
  {
    slug: "weather-app",
    title: "WeatherApp - AI Weather Dashboard",
    shortDesc:
      "A modern weather application built with Next.js 14 featuring OpenAI integration for intelligent weather insights.",
    fullDesc:
      "A fully responsive Progressive Web App built with Next.js 14 that goes beyond basic weather data. It integrates OpenAI to provide natural language weather summaries and actionable suggestions like 'Bring an umbrella today' or 'Great day for a run.' Data is sourced from OpenWeatherMap API with accurate 10-day forecasts, hourly breakdowns, and interactive radar maps. The PWA capabilities allow offline cached access to the last fetched data.",
    problemStatement:
      "Most weather apps just dump numbers and charts. Users want to know what the weather means for their day. We needed an app that translates raw meteorological data into human-readable advice.",
    architecture: [
      {
        component: "Frontend",
        desc: "Next.js 14 App Router with Tailwind CSS for glassmorphism UI",
      },
      {
        component: "Data Layer",
        desc: "OpenWeatherMap API for real-time and forecast data",
      },
      {
        component: "AI Integration",
        desc: "OpenAI API taking JSON weather data and generating conversational summaries",
      },
    ],
    challenges: [
      {
        title: "API Rate Limits",
        problem:
          "Calling OpenAI on every page load was too slow and expensive.",
        solution:
          "Implemented Next.js Data Cache to store AI summaries for 1 hour per location.",
      },
    ],
    lessons: [
      "Next.js App Router caching is incredibly powerful for optimizing third-party API costs.",
      "Good UI relies heavily on micro-interactions and skeleton loaders for perceived performance.",
    ],
    metrics: [
      {
        label: "API Costs",
        before: "High (per request)",
        after: "Minimal (Cached)",
        improvement: "-90%",
      },
      {
        label: "Lighthouse Performance",
        value: "98/100",
        improvement: "Optimized Core Web Vitals",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "React", "OpenAI", "TypeScript"],
    features: [
      "AI-powered weather summaries in natural language",
      "10-day forecast with hourly breakdowns",
      "Interactive radar and satellite maps",
      "PWA with offline cached data",
      "Location-based auto-detection",
      "Beautiful animated weather icons",
    ],
    github: "https://github.com/Aashik9567/weather-app-NextJs",
    live: null,
    category: "Web Dev",
    cats: ["Web Dev", "AI/ML"],
    status: "live",
    stars: 18,
    forks: 6,
    views: 420,
    year: "2023",
    teamSize: 2,
    featured: false,
    highlights: [
      "Server-side rendering for instant first paint",
      "OpenAI integration for human-like weather analysis",
      "Geolocation API for automatic city detection",
    ],
  },
  {
    slug: "smart-school-management",
    title: "Smart School Management System",
    shortDesc:
      "A modern role-based school management platform for managing academics, attendance, schedules, fees, and student performance.",
    fullDesc:
      "Developed a full-stack Smart School Management System to streamline academic and administrative workflows for educational institutions. The platform features separate dashboards for Admin, Teacher, Student, and Parent with secure role-based authentication. Admins can manage users, schedules, fees, notifications, and academic structures, while teachers can handle attendance and marks. Students and parents can monitor academic progress, schedules, attendance, and announcements in real-time. The system also integrates AI-powered analytics and insights for performance monitoring and smart educational management.",
    problemStatement:
      "Educational management is often fragmented across multiple legacy tools or paper-based systems. A unified, modern, role-based platform was needed to connect admins, teachers, and parents efficiently.",
    architecture: [
      {
        component: "Frontend",
        desc: "React SPA with React Router and Tailwind CSS",
      },
      {
        component: "Backend",
        desc: "Node.js/Express providing robust REST APIs and JWT auth",
      },
      {
        component: "Database",
        desc: "MongoDB schemas with complex relational linking for students, grades, and classes",
      },
    ],
    challenges: [
      {
        title: "Complex Authorization",
        problem:
          "Ensuring users only access data relevant to their role (e.g., parents only seeing their children).",
        solution:
          "Built a robust middleware layer verifying JWT claims and ownership against database records before fulfilling requests.",
      },
    ],
    lessons: [
      "Designing database schemas for educational systems requires careful consideration of many-to-many relationships (e.g., Teachers to Classes, Students to Subjects).",
      "Centralized state management is crucial for large SPAs with complex user roles.",
    ],
    metrics: [
      {
        label: "Data Retrieval Time",
        before: "Manual lookup",
        after: "Instant via Dashboard",
        improvement: "100x Faster",
      },
      {
        label: "Role Separation",
        value: "4 Roles",
        improvement: "Secure JWT architecture",
      },
    ],
    gallery: [
      "https://img.freepik.com/premium-photo/3d-cartoon-back-school_1268653-382.jpg",
    ],
    image:
      "https://img.freepik.com/premium-photo/3d-cartoon-back-school_1268653-382.jpg",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    features: [
      "Role-based dashboards for Admin, Teacher, Student, and Parent",
      "Advanced class schedule and timetable management",
      "Attendance and marks management system",
      "Parent-child academic monitoring",
      "Responsive modern dashboard UI",
      "AI-powered analytics and student insights",
    ],
    github: "https://github.com/Aashik9567/Smart_School_Management_System",
    live: "https://smart-school-management-system-frontend.onrender.com/",
    category: "Full-Stack",
    cats: ["Full-Stack", "Web Dev", "AI/ML"],
    status: "live",
    stars: 32,
    forks: 11,
    views: 920,
    year: "2025",
    teamSize: 4,
    featured: true,
    highlights: [
      "Strict role-based access with profile-linked architecture",
      "Centralized schedule management with dynamic timetable views",
      "Modern responsive dashboard optimized for all devices",
    ],
  },
  {
    slug: "cable-network-website",
    title: "Raghunathpur Cable Network Website",
    shortDesc:
      "A modern and responsive ISP website built for showcasing internet services, plans, coverage areas, and customer engagement.",
    fullDesc:
      "Designed and developed a premium ISP business website for Raghunathpur Cable Network using Next.js, Tailwind CSS, TypeScript, and Ant Design. The platform features a highly modern UI with responsive layouts, animated sections, dark/light/system theme support, interactive pricing plans, service coverage pages, FAQs, and advanced hero animations powered by Framer Motion and React Three Fiber. The project focuses heavily on user experience, scalability, and modern frontend architecture.",
    problemStatement:
      "The local ISP lacked a modern digital presence, leading to low online conversions. They needed a high-performance, visually striking website that clearly communicates their pricing, coverage, and reliability.",
    architecture: [
      { component: "Framework", desc: "Next.js for SEO and fast page loads" },
      {
        component: "Styling",
        desc: "Tailwind CSS + Ant Design for rapid UI development",
      },
      {
        component: "Animations",
        desc: "Framer Motion and React Three Fiber for 3D interactions",
      },
    ],
    challenges: [
      {
        title: "3D Performance",
        problem:
          "React Three Fiber animations caused lag on low-end mobile devices.",
        solution:
          "Implemented dynamic degradation, disabling complex 3D scenes on mobile and substituting them with lightweight CSS animations.",
      },
    ],
    lessons: [
      "Performance optimization is crucial when combining 3D libraries with complex React apps.",
      "A great landing page needs to balance aesthetic flashiness with clear, accessible calls to action.",
    ],
    metrics: [
      {
        label: "Page Load Speed",
        before: "4.2s",
        after: "1.1s",
        improvement: "-73%",
      },
      {
        label: "Mobile Conversions",
        before: "1.5%",
        after: "4.8%",
        improvement: "+220%",
      },
      {
        label: "3D Rendering Frame Rate",
        value: "60 FPS",
        improvement: "Optimized for mobile",
      },
    ],
    gallery: [
      "https://i.ytimg.com/vi/wbBFNa1bTOQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBZkhFMn_FEh8DWV-gJI-uDJLeYiw",
    ],
    image:
      "https://i.ytimg.com/vi/wbBFNa1bTOQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBZkhFMn_FEh8DWV-gJI-uDJLeYiw",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Ant Design",
      "Framer Motion",
      "React Three Fiber",
    ],
    features: [
      "Modern responsive ISP landing pages",
      "Dark, light, and system theme support",
      "Animated hero section with 3D visuals",
      "Interactive pricing and coverage pages",
      "Smooth animations and micro-interactions",
      "Reusable scalable component architecture",
    ],
    github: "https://github.com/Aashik9567/raghunathpur-cable-network",
    live: "https://raghunathpurcable.com.np/",
    category: "Frontend",
    cats: ["Frontend", "Web Dev"],
    status: "live",
    stars: 18,
    forks: 5,
    views: 420,
    year: "2026",
    teamSize: 1,
    featured: true,
    highlights: [
      "Implemented modern SaaS-inspired ISP UI with advanced responsiveness",
      "Integrated Framer Motion and React Three Fiber for immersive animations",
      "Built scalable folder architecture with reusable components and theme system",
    ],
  },
];

export const projectCategories = [
  "All",
  "Web Dev",
  "Hardware",
  "IoT",
  "Full-Stack",
  "AI/ML",
];

export const skillCategories = [
  {
    title: "Programming Languages",
    iconName: "Code2",
    skills: [
      {
        name: "JavaScript",
        level: 90,
        icon: `${DEVICON}/javascript/javascript-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "Python",
        level: 85,
        icon: `${DEVICON}/python/python-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "C++",
        level: 80,
        icon: `${DEVICON}/cplusplus/cplusplus-original.svg`,
        tags: ["Intermediate", "2+ yrs"],
      },
      {
        name: "C",
        level: 85,
        icon: `${DEVICON}/c/c-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
    ],
  },
  {
    title: "Web Development",
    iconName: "Globe",
    skills: [
      {
        name: "React.js",
        level: 95,
        icon: `${DEVICON}/react/react-original.svg`,
        tags: ["Expert", "Daily Use", "3+ yrs"],
      },
      {
        name: "Node.js",
        level: 88,
        icon: `${DEVICON}/nodejs/nodejs-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "Express.js",
        level: 85,
        icon: `${DEVICON}/express/express-original.svg`,
        tags: ["Advanced", "2+ yrs"],
      },
      {
        name: "MongoDB",
        level: 80,
        icon: `${DEVICON}/mongodb/mongodb-original.svg`,
        tags: ["Intermediate", "2+ yrs"],
      },
    ],
  },
  {
    title: "Hardware & Embedded",
    iconName: "Cpu",
    skills: [
      {
        name: "Arduino",
        level: 92,
        icon: `${DEVICON}/arduino/arduino-original.svg`,
        tags: ["Expert", "Daily Use", "4+ yrs"],
      },
      {
        name: "Raspberry Pi",
        level: 85,
        icon: `${DEVICON}/raspberrypi/raspberrypi-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "Circuit Design",
        level: 78,
        iconName: "CircuitBoard",
        tags: ["Intermediate", "3+ yrs"],
      },
      {
        name: "IoT Protocols",
        level: 75,
        iconName: "Wifi",
        tags: ["Intermediate", "2+ yrs"],
      },
    ],
  },
  {
    title: "Professional Skills",
    iconName: "Users",
    skills: [
      {
        name: "Problem Solving",
        level: 95,
        iconName: "Brain",
        tags: ["Expert", "Core Strength"],
      },
      {
        name: "Quick Learning",
        level: 98,
        iconName: "Rocket",
        tags: ["Expert", "Adaptive"],
      },
      {
        name: "Team Leadership",
        level: 88,
        iconName: "Users",
        tags: ["Advanced", "Collaborative"],
      },
      {
        name: "Project Management",
        level: 82,
        iconName: "ClipboardList",
        tags: ["Intermediate", "Agile"],
      },
    ],
  },
];

export const radarData = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "HTML/CSS", level: 90 },
      { name: "Tailwind", level: 88 },
      { name: "Framer Motion", level: 85 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    category: "Hardware",
    skills: [
      { name: "Arduino", level: 92 },
      { name: "RPi", level: 85 },
      { name: "PCB", level: 78 },
      { name: "IoT", level: 75 },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: 88 },
      { name: "VS Code", level: 95 },
      { name: "Linux", level: 80 },
      { name: "Docker", level: 70 },
    ],
  },
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "C/C++", level: 82 },
      { name: "TypeScript", level: 75 },
    ],
  },
];

export const techPills = [
  "React",
  "Python",
  "Arduino",
  "Node.js",
  "MongoDB",
  "IoT",
  "C++",
  "Express",
  "Tailwind",
  "Git",
  "Linux",
  "MQTT",
  "HTML5",
  "CSS3",
  "REST API",
  "Raspberry Pi",
];

export const siteConfig = {
  status: "Available for Hire",
  statusColor: "bg-primary",
  availability: "Open to opportunities",
};

export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Skills", path: "/skills" },
  { label: "Projects", path: "/projects" },
  { label: "Education", path: "/education" },
  { label: "Contact", path: "/contactus" },
  { label: "Dashboard", path: "/developer-dashboard" },
  { label: "Blog", path: "/blog" },
  { label: "Now", path: "/now" },
];

export const nowPageData = {
  currentFocus:
    "Building a scalable AI-powered dashboard for portfolio analytics and contributing to open source hardware projects.",
  learning: [
    "Advanced IoT Systems",
    "WebRTC for real-time video",
    "Go for high-performance backends",
  ],
  reading: [
    "Clean Code by Robert C. Martin",
    "The Hardware Hacker by Andrew 'bunnie' Huang",
  ],
  experiments: [
    "Micro-frontend architecture",
    "LoRaWAN long-range communications",
  ],
  lastUpdated: "2026-05-20",
};
