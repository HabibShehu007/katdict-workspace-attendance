import { FaCode } from "react-icons/fa";

export interface TechStack {
  label: string;
  color: string;
  slug: string; // The Simple Icons identifier
}

export const TECH_REGISTRY: Record<string, TechStack> = {
  // Core & Web
  react: { label: "React", color: "blue", slug: "react" },
  nextjs: { label: "Next.js", color: "zinc", slug: "nextdotjs" },
  typescript: { label: "TypeScript", color: "blue", slug: "typescript" },
  javascript: { label: "JavaScript", color: "yellow", slug: "javascript" },
  html: { label: "HTML5", color: "orange", slug: "html5" },
  css: { label: "CSS3", color: "blue", slug: "css3" },
  tailwind: { label: "Tailwind", color: "sky", slug: "tailwindcss" },

  // Backend & Runtimes
  node: { label: "Node.js", color: "emerald", slug: "nodedotjs" },
  fastify: { label: "Fastify", color: "zinc", slug: "fastify" },
  bun: { label: "Bun", color: "amber", slug: "bun" },
  deno: { label: "Deno", color: "zinc", slug: "deno" },
  python: { label: "Python", color: "blue", slug: "python" },
  go: { label: "Go", color: "sky", slug: "go" },
  rust: { label: "Rust", color: "orange", slug: "rust" },
  php: { label: "PHP", color: "indigo", slug: "php" },
  laravel: { label: "Laravel", color: "red", slug: "laravel" },

  // Databases
  supabase: { label: "Supabase", color: "emerald", slug: "supabase" },
  postgres: { label: "PostgreSQL", color: "blue", slug: "postgresql" },
  mongodb: { label: "MongoDB", color: "green", slug: "mongodb" },
  redis: { label: "Redis", color: "red", slug: "redis" },
  mysql: { label: "MySQL", color: "blue", slug: "mysql" },
  sqlite: { label: "SQLite", color: "sky", slug: "sqlite" },
  prisma: { label: "Prisma", color: "teal", slug: "prisma" },

  // Design Tools
  figma: { label: "Figma", color: "purple", slug: "figma" },
  photoshop: { label: "Photoshop", color: "blue", slug: "adobephotoshop" },
  illustrator: {
    label: "Illustrator",
    color: "orange",
    slug: "adobeillustrator",
  },
  xd: { label: "Adobe XD", color: "pink", slug: "adobexd" },
  sketch: { label: "Sketch", color: "orange", slug: "sketch" },
  blender: { label: "Blender", color: "orange", slug: "blender" },
  inkscape: { label: "Inkscape", color: "green", slug: "inkscape" },

  // DevOps & Cloud
  git: { label: "Git", color: "orange", slug: "git" },
  docker: { label: "Docker", color: "blue", slug: "docker" },
  kubernetes: { label: "Kubernetes", color: "blue", slug: "kubernetes" },
  aws: { label: "AWS", color: "orange", slug: "amazonaws" },
  vercel: { label: "Vercel", color: "zinc", slug: "vercel" },
  cloudflare: { label: "Cloudflare", color: "orange", slug: "cloudflare" },
  terraform: { label: "Terraform", color: "purple", slug: "terraform" },

  // Testing & Tooling
  jest: { label: "Jest", color: "red", slug: "jest" },
  vitest: { label: "Vitest", color: "yellow", slug: "vitest" },
  vite: { label: "Vite", color: "purple", slug: "vite" },
  graphql: { label: "GraphQL", color: "pink", slug: "graphql" },
  firebase: { label: "Firebase", color: "yellow", slug: "firebase" },

  // Networking: Protocols
  tcp: { label: "TCP/IP", color: "sky", slug: "transmissioncontrolprotocol" },
  dns: { label: "DNS", color: "blue", slug: "dns" },
  http: { label: "HTTP/HTTPS", color: "zinc", slug: "http" },
  ssh: { label: "SSH", color: "amber", slug: "ssh" },
  vpn: { label: "VPN", color: "indigo", slug: "wireguard" },

  // Networking: Hardware / Infra
  cisco: { label: "Cisco", color: "sky", slug: "cisco" },
  mikrotik: { label: "MikroTik", color: "blue", slug: "mikrotik" },
  ubiquiti: { label: "Ubiquiti", color: "sky", slug: "ubiquiti" },
  juniper: { label: "Juniper", color: "red", slug: "junipernetworks" },
  firewall: { label: "Firewall", color: "red", slug: "pfsense" },

  // Networking: Automation & Monitoring
  ansible: { label: "Ansible", color: "red", slug: "ansible" },
  zabbix: { label: "Zabbix", color: "blue", slug: "zabbix" },
  grafana: { label: "Grafana", color: "orange", slug: "grafana" },
  prometheus: { label: "Prometheus", color: "orange", slug: "prometheus" },
  wireshark: { label: "Wireshark", color: "blue", slug: "wireshark" },
};

/**
 * Returns registry info or defaults to a generic code icon
 */
export const getTechDetails = (key: string): TechStack => {
  return (
    TECH_REGISTRY[key.toLowerCase()] || {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: "zinc",
      slug: "code",
      icon: FaCode,
    }
  );
};
