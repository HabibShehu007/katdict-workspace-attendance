import { CalendarDays, Users, UserCheck, Activity } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface AdminStatCardsProps {
  dayName: string;
  formattedDate: string;
  totalUsers: number;
  presentUsers: number;
  activeLogs: number;
}

export default function AdminStatCards({
  dayName,
  formattedDate,
  totalUsers,
  presentUsers,
  activeLogs,
}: AdminStatCardsProps) {
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
      id: "total-users",
      label: "Total Users",
      title: totalUsers.toString(),
      desc: "Registered users in Workspace",
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    },
    {
      id: "present",
      label: "Present Today",
      title: presentUsers.toString(),
      desc: "Users who marked attendance",
      icon: <UserCheck className="w-5 h-5" />,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-500",
    },
    {
      id: "active",
      label: "Active Logs",
      title: activeLogs.toString(),
      desc: "Logs submitted today",
      icon: <Activity className="w-5 h-5" />,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Slider */}
      <div className="block md:hidden pb-12">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
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
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
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
