import { motion } from "framer-motion";
import { Award, Heart, Globe, Users } from "lucide-react";
import Layout from "../components/layout/Layout";

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "Every product is sourced or crafted to the highest standards. We work directly with master artisans across Pakistan and beyond.",
  },
  {
    icon: Heart,
    title: "Made with Passion",
    desc: "ZELMIOR was born from a deep love for premium timepieces and a desire to share exceptional craftsmanship with the world.",
  },
  {
    icon: Globe,
    title: "Globally Inspired",
    desc: "We draw inspiration from London, Milan, and Tokyo — filtered through a distinctly sophisticated lens.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "We employ local artisans, support fair wages, and reinvest in the communities that make our brand possible.",
  },
];

const team = [
  {
    name: "Ayaan Shahid",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "With 10 years in luxury timepieces, Ayaan founded ZELMIOR to bring world-class craftsmanship to Pakistan.",
  },
  {
    name: "Zara Malik",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    bio: "A graduate of Central Saint Martins, Zara brings a global perspective to every collection she creates.",
  },
  {
    name: "Omar Qureshi",
    role: "Chief of Curation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    bio: "Omar travels the world sourcing the finest fabrics, watches, and fragrances for the AS family.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative pt-24 pb-0 overflow-hidden">
        <div className="h-[60vh] relative flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
            alt="ZELMIOR brand story"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3"
            >
              Our Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl text-white mb-6"
            >
              Crafting <span className="gold-text">Luxury</span>{" "}
              <br className="hidden sm:block" />
              Timepieces
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-inter text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Since 2018, ZELMIOR has been redefining luxury timepieces —
              one meticulously crafted piece at a time.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Brand Story */}
        <section className="py-20 grid md:grid-cols-2 gap-12 items-center border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-4">
              The Beginning
            </p>
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-6">
              Born from a Love of <span className="gold-text">Craftsmanship</span>
            </h2>
            <div className="space-y-4 font-inter text-white/50 leading-relaxed">
              <p>
                ZELMIOR was founded in 2018 by Ayaan Shahid, a Lahore-born
                watch enthusiast who grew up appreciating the precision and beauty of fine timepieces.
              </p>
              <p>
                Frustrated by the gap between international luxury brands and the
                extraordinary craftsmanship available right here in Pakistan, Ayaan
                set out to create a brand that would celebrate local artistry while
                bringing a global, aspirational aesthetic to discerning customers.
              </p>
              <p>
                Today, ZELMIOR is home to over 10,000 satisfied customers across
                Pakistan, offering meticulously curated timepieces that tell a story of culture, craft, and luxury.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" alt="Luxury watch" className="rounded-2xl h-48 object-cover" />
            <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80" alt="Timepiece" className="rounded-2xl h-48 object-cover mt-6" />
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" alt="Watch" className="rounded-2xl h-48 object-cover -mt-6" />
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80" alt="Chronograph" className="rounded-2xl h-48 object-cover" />
          </motion.div>
        </section>

        {/* Values */}
        <section className="py-20 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl">
              Our <span className="gold-text">Values</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass gold-border rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 border border-gold/20">
                  <v.icon size={24} className="text-gold" />
                </div>
                <h3 className="font-poppins font-bold text-white text-base mb-3">
                  {v.title}
                </h3>
                <p className="font-inter text-white/40 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3">
              The People Behind
            </p>
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl">
              Meet Our <span className="gold-text">Team</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative mx-auto w-36 h-36 mb-5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover ring-4 ring-gold/20"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-gold/40" />
                </div>
                <h3 className="font-poppins font-bold text-white text-lg">{member.name}</h3>
                <p className="text-gold text-sm font-inter mb-3">{member.role}</p>
                <p className="text-white/40 text-sm font-inter leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
