// constants/techStacks.ts

// Define the shape of our stacks to ensure consistency
interface DevStack {
  frontend: string[];
  backend: string[];
}

interface DesignStack {
  tools: string[];
  categories: string[];
}

export const DEV_STACKS: DevStack = {
  frontend: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
  ],
  backend: [
    "Node.js",
    "Fastify",
    "Express",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "WebSockets",
    "REST APIs",
  ],
} as const;

export const DESIGN_STACKS: DesignStack = {
  tools: [
    "Figma",
    "Adobe XD",
    "Adobe Illustrator",
    "Photoshop",
    "After Effects",
    "Canva",
    "Sketch",
    "Blender",
    "Prototyping",
  ],
  categories: [
    "UI/UX Design",
    "Graphic Design",
    "Logo Design",
    "Brand Identity",
    "Motion Graphics",
    "Wireframing",
  ],
} as const;

export const PLACEHOLDER_SUGGESTIONS: Record<string, string[]> = {
  web_development: [
    "Building user authentication layers...",
    "Fixing secure connection routes...",
    "Designing responsive database schemas...",
    "Optimizing live data stream components...",
  ],
  ui_ux_design: [
    "Drafting wireframe layouts...",
    "Refining brand color palettes...",
    "Creating interactive prototypes...",
    "Optimizing vector assets for web...",
    "Polishing interface animation curves...",
  ],
} as const;
