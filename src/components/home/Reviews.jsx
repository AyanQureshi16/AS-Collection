import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Ayesha Malik",
    location: "Lahore",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
    text: "I ordered the Silk Gharara for my sister's walima and I was absolutely blown away by the quality. The fabric is incredibly luxurious and the embroidery is even more beautiful in person. Will definitely be ordering again!",
    product: "Silk Gharara — Bridal Luxe",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Hassan Iqbal",
    location: "Karachi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    text: "The Automatique Royale watch is stunning. I've been wearing it for a month now and get compliments every day. The leather strap is premium and the movement is incredibly smooth. Worth every rupee!",
    product: "Automatique Royale — Steel",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Fatima Zahra",
    location: "Islamabad",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    rating: 5,
    text: "Oud Royale is my absolute favorite fragrance now. The longevity is insane — I applied it in the morning and could still smell it clearly the next day. A true luxury attar at a reasonable price.",
    product: "Oud Royale — Attar",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Ahmed Raza",
    location: "Lahore",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 5,
    text: "Bought the Obsidian Slim-Fit Kurta for Eid and it was perfect. The fit is immaculate, the fabric breathes well, and the gold buttons are a classy touch. The packaging was also very premium.",
    product: "Obsidian Slim-Fit Kurta",
    date: "1 month ago",
  },
  {
    id: 5,
    name: "Sara Abdullah",
    location: "Faisalabad",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
    text: "The Cashmere Wrap Shawl is the most beautiful thing I own. The hand-knotted embroidery is so intricate and the pashmina is so soft. I've received so many compliments. AS Collection is my go-to brand now.",
    product: "Cashmere Wrap Shawl — Heritage",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Bilal Chaudhry",
    location: "Multan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    rating: 5,
    text: "The Skeleton Tourbillon watch arrived in a stunning box. The watch itself is a masterpiece of horology. The skeletonized dial is mesmerizing and the finishing is flawless. A true collector's piece.",
    product: "Skeleton Tourbillon — Prestige",
    date: "3 weeks ago",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-dark-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="section-title mb-4">
            What Our <span className="gold-text">Clients Say</span>
          </h2>

          {/* Overall rating */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={22} className="text-gold fill-gold" />
              ))}
            </div>
            <span className="font-poppins font-bold text-white text-xl">5.0</span>
            <span className="text-white/30 font-inter text-sm">/ 2,400+ reviews</span>
          </div>
        </motion.div>

        {/* Reviews Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass gold-border rounded-2xl p-6 h-full flex flex-col gap-4"
    >
      <Quote size={28} className="text-gold/30" />

      <p className="font-inter text-white/60 text-sm leading-relaxed flex-1">
        "{review.text}"
      </p>

      <div>
        <p className="text-white/30 text-xs font-inter mb-3">
          Reviewed: <span className="text-gold/60">{review.product}</span>
        </p>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={13}
              className={s <= review.rating ? "text-gold fill-gold" : "text-white/20"}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/20"
          />
          <div>
            <p className="font-poppins font-semibold text-white text-sm">{review.name}</p>
            <p className="text-white/30 text-xs">{review.location} · {review.date}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
