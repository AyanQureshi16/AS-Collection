import { motion } from "framer-motion";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    alt: "Premium luxury watch close-up",
    className: "md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    alt: "Elegant women's timepiece",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    alt: "Classic gold watch",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    alt: "Luxury watch on wrist",
    className: "md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
    alt: "Men's chronograph watch",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80",
    alt: "Premium watch collection",
    className: "",
  },
];

export default function InstagramGallery() {
  return (
    <section className="py-28 md:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">@zelmiorwatches</p>
          <h2 className="section-title">Follow the Journey</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className={`relative overflow-hidden group ${img.className}`}
            >
              <div className={`${img.className.includes("row-span") ? "h-full min-h-[300px] md:min-h-[500px]" : "aspect-square"}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
