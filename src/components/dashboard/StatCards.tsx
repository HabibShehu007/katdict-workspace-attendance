import { CalendarDays, Flame, MapPin, MapPinOff } from "lucide-react";
// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles in your project
import "swiper/css";
import "swiper/css/pagination";

interface StatCardsProps {
  dayName: string;
  formattedDate: string;
  isWithinWorkspace: boolean;
  streakCount?: number;
}

export default function StatCards({
  dayName,
  formattedDate,
  isWithinWorkspace,
  streakCount = 7,
}: StatCardsProps) {
  // Clean, reusable card layouts to keep our code DRY
  const cards = [
    {
      id: "date",
      label: "Today",
      title: dayName,
      desc: formattedDate,
      icon: <CalendarDays className="w-5 h-5" />,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      cardBg: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      titleColor: "text-zinc-900 dark:text-white",
    },
    {
      id: "streak",
      label: "Your Streak",
      title: `${streakCount} Days Active`,
      desc: "Keep up the great work!",
      icon: <Flame className="w-5 h-5 fill-amber-500/10" />,
      iconBg: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
      cardBg: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      titleColor: "text-zinc-900 dark:text-white",
    },
    {
      id: "location",
      label: "Location Status",
      title: isWithinWorkspace ? "Katdict Workspace" : "Outside Office",
      desc: isWithinWorkspace ? "Connected at office" : "Working remotely",
      icon: isWithinWorkspace ? (
        <MapPin className="w-5 h-5" />
      ) : (
        <MapPinOff className="w-5 h-5" />
      ),
      iconBg: isWithinWorkspace
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-amber-500/10 text-amber-500 dark:text-amber-400 animate-pulse",
      cardBg: isWithinWorkspace
        ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        : "bg-amber-500/5 dark:bg-amber-500/[0.02] border-amber-500/20",
      titleColor: isWithinWorkspace
        ? "text-zinc-900 dark:text-white"
        : "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="w-full">
      {/* MOBILE VIEW: Shows a smooth auto-playing slider with navigation dot indicators */}
      <div className="block sm:hidden pb-8 custom-stat-swiper">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="w-full"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              {/* flex-col items-center text-center balances everything cleanly over the center axis */}
              <div
                className={`p-6 rounded-2xl border flex flex-col items-center text-center shadow-xs ${card.cardBg}`}
              >
                <div className={`p-3 rounded-xl mb-3 ${card.iconBg}`}>
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {card.label}
                  </h4>
                  <h2
                    className={`text-base font-black tracking-tight mt-1 ${card.titleColor}`}
                  >
                    {card.title}
                  </h2>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {card.desc}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DESKTOP VIEW: Falls back to a clean, standard 3-column dashboard grid layout */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-2xl border flex items-center gap-4 shadow-xs ${card.cardBg}`}
          >
            <div className={`p-3 rounded-xl ${card.iconBg}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {card.label}
              </h4>
              <h2
                className={`text-sm font-black tracking-tight truncate mt-0.5 ${card.titleColor}`}
              >
                {card.title}
              </h2>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
