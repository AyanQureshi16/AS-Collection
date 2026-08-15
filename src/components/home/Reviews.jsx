import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Hassan Iqbal",
    location: "Karachi",
    rating: 5,
    text: "The Automatique Royale watch is stunning. I've been wearing it for a month now and get compliments every day. The leather strap is premium and the movement is incredibly smooth.",
    product: "Automatique Royale",
  },
  {
    id: 2,
    name: "Bilal Chaudhry",
    location: "Multan",
    rating: 5,
    text: "The Skeleton Tourbillon watch arrived in a stunning box. The watch itself is a masterpiece of horology. The skeletonized dial is mesmerizing and the finishing is flawless.",
    product: "Skeleton Tourbillon",
  },
  {
    id: 3,
    name: "Ahmed Raza",
    location: "Lahore",
    rating: 5,
    text: "Exceptional quality and craftsmanship. The gold accents are perfectly balanced and the watch feels substantial on the wrist. ZELMIOR has become my go-to brand.",
    product: "Chronograph Elite",
  },
];

export default function Reviews() {
  return (
    <section className="py-28 md:py-36 bg-surface border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Testimonials</p>
          <h2 className="section-title">What They Say</h2>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-14"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-white/[0.06] p-8 h-full flex flex-col bg-ink/50"
              >
                <Quote size={20} strokeWidth={1} className="text-champagne/40 mb-6" />
                <p className="font-inter text-muted text-sm leading-relaxed flex-1 mb-8 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="text-champagne fill-champagne" />
                  ))}
                </div>
                <div>
                  <p className="font-display text-lg text-ivory font-light">{review.name}</p>
                  <p className="font-inter text-[10px] tracking-widest uppercase text-muted mt-1">
                    {review.location} · {review.product}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
