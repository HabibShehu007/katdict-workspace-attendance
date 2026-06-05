import { CalendarDays, Flame, MapPin, MapPinOff } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
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
  streakCount = 0,
}: StatCardsProps) {
  // Organic streak logic: dynamic messages
  const getStreakMessage = (count: number) => {
    if (count === 0) return "Start your streak today!";
    if (count === 1) return "Great start, keep it going!";
    if (count >= 5) return "You're on fire! 🔥";
    return "Consistent progress!";
  };

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
      label: "Current Streak",
      title: `${streakCount} Day${streakCount !== 1 ? "s" : ""}`,
      desc: getStreakMessage(streakCount),
      // Adding pulse animation only if streak is active (>0)
      icon: (
        <Flame
          className={`w-5 h-5 ${streakCount > 0 ? "fill-amber-500 text-amber-500 animate-pulse" : "text-zinc-400"}`}
        />
      ),
      iconBg:
        streakCount > 0 ? "bg-amber-500/10" : "bg-zinc-100 dark:bg-zinc-800",
      cardBg:
        streakCount > 0
          ? "bg-gradient-to-br from-white to-amber-50/50 dark:from-zinc-900 dark:to-amber-950/10 border-amber-200 dark:border-amber-900/50"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      titleColor:
        streakCount > 0
          ? "text-amber-700 dark:text-amber-400"
          : "text-zinc-900 dark:text-zinc-400",
    },
    {
      id: "location",
      label: "Location",
      title: isWithinWorkspace ? "Katdict Office" : "Remote Mode",
      desc: isWithinWorkspace ? "Verified connection" : "Working remotely",
      icon: isWithinWorkspace ? (
        <MapPin className="w-5 h-5" />
      ) : (
        <MapPinOff className="w-5 h-5" />
      ),
      iconBg: isWithinWorkspace
        ? "bg-emerald-500/10 text-emerald-600"
        : "bg-zinc-100 text-zinc-500",
      cardBg: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      titleColor: "text-zinc-900 dark:text-white",
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Slider */}
      <div className="block sm:hidden pb-8 custom-stat-swiper">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          className="w-full"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              <div
                className={`p-5 rounded-2xl border ${card.cardBg} transition-all duration-500`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${card.iconBg}`}
                >
                  {card.icon}
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {card.label}
                </h4>
                <h2 className={`text-lg font-black mt-1 ${card.titleColor}`}>
                  {card.title}
                </h2>
                <p className="text-xs text-zinc-500">{card.desc}</p>
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
            className={`p-5 rounded-2xl border ${card.cardBg} flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className={`p-3 rounded-xl ${card.iconBg}`}>{card.icon}</div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {card.label}
              </h4>
              <h2 className={`text-sm font-black mt-0.5 ${card.titleColor}`}>
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
