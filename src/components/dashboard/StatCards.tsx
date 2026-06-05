import { CalendarDays, Flame, MapPin, MapPinOff } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

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
  streakCount = 0,
}: StatCardsProps) {
  const getStreakMessage = (count: number) => {
    if (count === 0) return "Start your journey.";
    if (count === 1) return "Great start!";
    if (count >= 5) return "You're on fire!";
    return "Consistent progress!";
  };

  const cards = [
    {
      id: "date",
      label: "Today",
      title: dayName,
      desc: formattedDate,
      icon: <CalendarDays className="w-5 h-5" />,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
    },
    {
      id: "streak",
      label: "Current Streak",
      title: `${streakCount} Day${streakCount !== 1 ? "s" : ""}`,
      desc: getStreakMessage(streakCount),
      icon: (
        <Flame
          className={`w-5 h-5 ${streakCount > 0 ? "fill-amber-500 text-amber-500" : "text-zinc-400"}`}
        />
      ),
      iconBg:
        streakCount > 0
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
    },
    {
      id: "location",
      label: "Location",
      title: isWithinWorkspace ? "Verified" : "Remote",
      desc: isWithinWorkspace ? "Location Verified" : "Outside of Workspace",
      icon: isWithinWorkspace ? (
        <MapPin className="w-5 h-5" />
      ) : (
        <MapPinOff className="w-5 h-5" />
      ),
      iconBg: isWithinWorkspace
        ? "bg-sky-500/10 text-sky-600 dark:text-sky-500"
        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Slider */}
      <div className="block sm:hidden pb-12 custom-stat-swiper">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl mb-4 ${card.iconBg}`}
                >
                  {card.icon}
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {card.label}
                </h4>
                <h2 className="text-lg font-black mt-1 text-zinc-900 dark:text-white">
                  {card.title}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">{card.desc}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
          >
            <div className={`p-3 rounded-2xl ${card.iconBg}`}>{card.icon}</div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {card.label}
              </h4>
              <h2 className="text-sm font-black mt-0.5 text-zinc-900 dark:text-white">
                {card.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
