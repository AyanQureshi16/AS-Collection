import { motion } from "framer-motion";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    alt: "Luxury fashion shoot",
    className: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    alt: "Watch collection",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
    alt: "Women's fashion",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
    alt: "Perfume collection",
    className: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    alt: "Men's formal",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
    alt: "Bridal collection",
    className: "",
  },
];

export default function InstagramGallery() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
            @ascollection.pk
          </p>
          <h2 className="section-title mb-4">
            Follow Our <span className="gold-text">Story</span>
          </h2>
          <p className="section-subtitle">
            Behind the scenes, lookbooks, and style inspiration on Instagram.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[500px]">
          {galleryImages.map((img, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <span className="text-white text-xl">📷</span>
                  </div>
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
