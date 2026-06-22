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

interface NetworkingStack {
  protocols: string[];
  hardware: string[];
  automation: string[];
}

interface DataScienceStack {
  libraries: string[];
  tools: string[];
  concepts: string[];
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

export const NETWORKING_STACKS: NetworkingStack = {
  protocols: [
    "BGP",
    "OSPF",
    "EIGRP",
    "IPv6",
    "MPLS",
    "VLAN",
    "DNS",
    "DHCP",
    "VPN",
  ],
  hardware: [
    "Cisco",
    "Juniper",
    "Aruba",
    "Fortinet",
    "Palo Alto",
    "MikroTik",
    "Ubiquiti",
    "Switches",
    "Routers",
  ],
  automation: [
    "Ansible",
    "Terraform",
    "Python",
    "Bash",
    "Netmiko",
    "NAPALM",
    "YAML",
    "Git",
  ],
} as const;

export const DATA_SCIENCE_STACKS: DataScienceStack = {
  libraries: [
    "Python",
    "R",
    "Pandas",
    "NumPy",
    "Scikit-Learn",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Matplotlib",
    "Seaborn",
    "NLTK",
    "OpenCV",
    "SQL",
  ],
  tools: [
    "Jupyter Notebook",
    "Google Colab",
    "Kaggle",
    "Tableau",
    "Power BI",
    "Anaconda",
    "Hugging Face",
    "Streamlit",
    "Gradio",
    "Git/GitHub",
  ],
  concepts: [
    "Machine Learning",
    "Deep Learning",
    "Data Wrangling",
    "Exploratory Data Analysis (EDA)",
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Data Visualization",
    "Statistical Analysis",
    "Predictive Modeling",
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
  networking: [
    "Configuring OSPF routing protocols...",
    "Updating firewall access control lists...",
    "Automating switch port provisioning...",
    "Analyzing network traffic patterns...",
    "Deploying infrastructure as code...",
  ],
  data_science: [
    "Performing Exploratory Data Analysis on datasets...",
    "Training predictive machine learning models...",
    "Building interactive visualization dashboards...",
    "Preprocessing and cleaning unstructured text data...",
    "Deploying machine learning models using Streamlit...",
  ],
} as const;
