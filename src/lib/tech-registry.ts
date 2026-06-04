import {
  SiReact,
  SiNodedotjs,
  SiFastify,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiGit,
  SiPostgresql,
  SiNextdotjs,
  SiDocker,
  SiPrisma,
  SiGraphql,
  SiRedis,
  SiFirebase,
  SiVercel,
  SiPython,
  SiGo,
  SiRust,
  SiPhp,
  SiLaravel,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiMongodb,
  SiSqlite,
  SiMysql,
  SiCloudflare,
  SiFigma,
  SiJest,
  SiVitest,
  SiWebpack,
  SiVite,
  SiDeno,
  SiBun,
  SiKubernetes,
  SiTerraform,
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

export interface TechStack {
  label: string;
  color: string;
  icon: React.ElementType;
}

export const TECH_REGISTRY: Record<string, TechStack> = {
  // Core
  react: { label: "React", color: "blue", icon: SiReact },
  nextjs: { label: "Next.js", color: "zinc", icon: SiNextdotjs },
  typescript: { label: "TypeScript", color: "blue", icon: SiTypescript },
  javascript: { label: "JavaScript", color: "yellow", icon: SiJavascript },
  html: { label: "HTML5", color: "orange", icon: SiHtml5 },
  css: { label: "CSS3", color: "blue", icon: SiCss },

  // Backend & Runtime
  node: { label: "Node.js", color: "emerald", icon: SiNodedotjs },
  fastify: { label: "Fastify", color: "zinc", icon: SiFastify },
  bun: { label: "Bun", color: "amber", icon: SiBun },
  deno: { label: "Deno", color: "zinc", icon: SiDeno },
  python: { label: "Python", color: "blue", icon: SiPython },
  go: { label: "Go", color: "sky", icon: SiGo },
  rust: { label: "Rust", color: "orange", icon: SiRust },
  php: { label: "PHP", color: "indigo", icon: SiPhp },

  // Databases
  supabase: { label: "Supabase", color: "emerald", icon: SiSupabase },
  postgres: { label: "PostgreSQL", color: "blue", icon: SiPostgresql },
  mongodb: { label: "MongoDB", color: "green", icon: SiMongodb },
  redis: { label: "Redis", color: "red", icon: SiRedis },
  mysql: { label: "MySQL", color: "blue", icon: SiMysql },
  sqlite: { label: "SQLite", color: "sky", icon: SiSqlite },
  prisma: { label: "Prisma", color: "teal", icon: SiPrisma },

  // Frontend/Design
  tailwind: { label: "Tailwind", color: "sky", icon: SiTailwindcss },
  vue: { label: "Vue", color: "emerald", icon: SiVuedotjs },
  angular: { label: "Angular", color: "red", icon: SiAngular },
  svelte: { label: "Svelte", color: "orange", icon: SiSvelte },
  figma: { label: "Figma", color: "purple", icon: SiFigma },

  // DevOps & Cloud
  git: { label: "Git", color: "orange", icon: SiGit },
  docker: { label: "Docker", color: "blue", icon: SiDocker },
  kubernetes: { label: "Kubernetes", color: "blue", icon: SiKubernetes },
  aws: { label: "AWS", color: "orange", icon: SiFirebase },
  vercel: { label: "Vercel", color: "zinc", icon: SiVercel },
  cloudflare: { label: "Cloudflare", color: "orange", icon: SiCloudflare },
  terraform: { label: "Terraform", color: "purple", icon: SiTerraform },

  // Testing & Tooling
  jest: { label: "Jest", color: "red", icon: SiJest },
  vitest: { label: "Vitest", color: "yellow", icon: SiVitest },
  vite: { label: "Vite", color: "purple", icon: SiVite },
  webpack: { label: "Webpack", color: "blue", icon: SiWebpack },
  graphql: { label: "GraphQL", color: "pink", icon: SiGraphql },
  firebase: { label: "Firebase", color: "yellow", icon: SiFirebase },
  laravel: { label: "Laravel", color: "red", icon: SiLaravel },
};

export const getTechDetails = (key: string): TechStack => {
  return (
    TECH_REGISTRY[key.toLowerCase()] || {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: "zinc",
      icon: FaCode,
    }
  );
};
