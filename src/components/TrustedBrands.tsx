import { motion } from 'framer-motion';

const brands = [
    {
        name: 'Foodpanda',
        logo: 'https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/download.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9kb3dubG9hZC5wbmciLCJpYXQiOjE3NzMzNjk5OTEsImV4cCI6MTgwNDkwNTk5MX0.o3-pPATzyIyBMcrRvdj9-znmSng14KNAPwEDiJN_7cU',
    },
    {
        name: 'Finastra',
        logo: 'https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/finastra.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9maW5hc3RyYS5wbmciLCJpYXQiOjE3NzMzNzAwMTgsImV4cCI6MTgwNDkwNjAxOH0.mYQAtQi2A73GUm5IcMfpNs7lmskl926DpB3fS_UAj7U',
    },
    {
        name: 'HBL',
        logo: 'https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/hbl.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9oYmwucG5nIiwiaWF0IjoxNzczMzcwMDM3LCJleHAiOjE4MDQ5MDYwMzd9.nz2tRP5WA1RAMqJvpJP6GPwwCwh6tURD3OoLboYGiyc',
    },
    {
        name: 'Swifpack',
        logo: 'https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/swifpack.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9zd2lmcGFjay5wbmciLCJpYXQiOjE3NzMzNzAwNzgsImV4cCI6MTgwNDkwNjA3OH0.1aHA6eSIMI2gMCeUusnodeKhyUvm-HedAprw0CdieEo',
    },
    {
        name: 'Uber',
        logo: 'https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/uber.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi91YmVyLnBuZyIsImlhdCI6MTc3MzM3MDA4OSwiZXhwIjoxODA0OTA2MDg5fQ.kGql40b9uS1bbr7WWuhhGJvnFzNHgWNIajGX6tFLuZE',
    },
];

export default function TrustedBrands() {
    return (
        <section className="relative py-20 md:py-24 bg-[#060b18] overflow-hidden">
            {/* Subtle top/bottom border lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 max-w-6xl">
                {/* Heading */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-[11px] font-bold tracking-[0.25em] text-mint uppercase mb-4">
                        Our Clients
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                        Trusted by{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">
                            Leading Brands
                        </span>
                    </h2>
                </motion.div>

                {/* Logo Grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-center justify-items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {brands.map((brand, idx) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative flex items-center justify-center w-full px-6 py-8 cursor-default"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="relative z-10 h-14 md:h-20 w-auto max-w-[180px] object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-125 md:scale-150"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
