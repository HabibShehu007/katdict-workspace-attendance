// import { Layers, ArrowUpRight, ExternalLink } from "lucide-react";

// interface WorkspaceLinkPreviewProps {
//   url?: string;
// }

// export default function WorkspaceLinkPreview({
//   url,
// }: WorkspaceLinkPreviewProps) {
//   if (!url) {
//     return (
//       <div className="p-5 bg-zinc-50/50 dark:bg-zinc-800/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
//         <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold italic block">
//           No website link attached for today.
//         </span>
//       </div>
//     );
//   }

//   // Detect platform details, brand colors, and friendly labels
//   const getPlatformDetails = (linkUrl: string) => {
//     const cleanUrl = linkUrl.toLowerCase();
//     if (cleanUrl.includes("figma.com")) {
//       return {
//         name: "Figma Link",
//         gradient: "from-[#F24E1E]/20 via-[#A259FF]/10 to-[#0ACF83]/15",
//         borderColor: "border-[#F24E1E]/30",
//         avatarBg: "bg-zinc-950 text-white",
//         avatarLetter: "F",
//         badgeText: "text-[#F24E1E]",
//         label: "Figma Project Link",
//       };
//     }
//     if (cleanUrl.includes("github.com")) {
//       return {
//         name: "GitHub Link",
//         gradient: "from-zinc-900 via-zinc-800 to-zinc-950",
//         borderColor: "border-zinc-700/60",
//         avatarBg: "bg-white text-zinc-950",
//         avatarLetter: "G",
//         badgeText: "text-zinc-400",
//         label: "GitHub Link",
//       };
//     }
//     // Default fallback configuration for general URLs
//     return {
//       name: "Website Link",
//       gradient: "from-emerald-500/10 via-teal-500/5 to-cyan-500/10",
//       borderColor: "border-emerald-500/30",
//       avatarBg: "bg-emerald-600 text-white",
//       avatarLetter:
//         linkUrl.replace(/^(https?:\/\/)?(www\.)?/, "")[0].toUpperCase() || "W",
//       badgeText: "text-emerald-500",
//       label: "Website Link Active",
//     };
//   };

//   const platform = getPlatformDetails(url);

//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noreferrer"
//       className={`group block border rounded-2xl transition-all overflow-hidden ${platform.borderColor} hover:scale-[1.01] hover:shadow-xs`}
//     >
//       {/* Dynamic Themed Canvas Container */}
//       <div
//         className={`aspect-video w-full bg-linear-to-br ${platform.gradient} relative flex flex-col justify-between p-4 overflow-hidden`}
//       >
//         {/* Top Header Row */}
//         <div className="flex items-center justify-between w-full">
//           {/* Mock Browser Controls */}
//           <div className="flex gap-1.5 opacity-60">
//             <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
//             <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
//             <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
//           </div>

//           {/* Friendly Status Tag */}
//           <span
//             className={`text-[9px] font-black uppercase tracking-widest bg-white/80 dark:bg-zinc-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs ${platform.badgeText}`}
//           >
//             {platform.label}
//           </span>
//         </div>

//         {/* Big Floating Letter Logo */}
//         <div className="flex flex-col items-center justify-center self-center text-center relative">
//           <div className="absolute inset-0 w-16 h-16 -m-4 bg-white/20 dark:bg-white/5 rounded-full blur-md scale-110 group-hover:scale-125 transition-transform duration-500" />

//           <div
//             className={`w-12 h-12 flex items-center justify-center font-black text-xl rounded-2xl shadow-md border border-white/10 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${platform.avatarBg}`}
//           >
//             {platform.avatarLetter}
//           </div>
//         </div>

//         {/* Footer Hints */}
//         <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between">
//           <span className="flex items-center gap-1">
//             <Layers className="w-3 h-3" /> Click to open link
//           </span>
//           <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-zinc-400" />
//         </div>
//       </div>

//       {/* Information Meta Footer Text */}
//       <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
//         <div className="min-w-0 flex-1">
//           <span className="text-xs font-black text-zinc-900 dark:text-white block truncate">
//             {platform.name}
//           </span>
//           <span className="text-[10px] sm:text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block truncate">
//             {url}
//           </span>
//         </div>
//         <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-2xs group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors shrink-0">
//           <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
//         </div>
//       </div>
//     </a>
//   );
// }
