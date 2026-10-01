"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/** Hero cinematográfico (sección 11): una sola entrada escalonada al cargar. */
export function HeroCinematic() {
  return (
    <section
      className="relative min-h-[78vh] flex items-center justify-center text-center px-5"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(10,10,10,.55), rgba(10,10,10,.92)), url('/hero-placeholder.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="eyebrow mb-5"
        >
          Perfumería importada y original
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-medium text-5xl md:text-6xl leading-tight text-luxury-warm"
        >
          Descubrí tu próxima fragancia
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/catalogo"
            className="rounded-full bg-gradient-to-br from-luxury-gold to-[#9c7a44] text-black font-semibold px-8 py-3 text-sm hover:-translate-y-0.5 transition-transform"
          >
            Explorar colección
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
