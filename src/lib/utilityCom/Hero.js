import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-Geist">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Find Your Perfect
                </span>
                <br />
                <span className="text-white">Home Anywhere</span>
              </h1>
              
              <h2 className="text-xl lg:text-2xl text-emerald-100/80 font-semibold capitalize">
                HouseRent – Stay Where Life Takes You
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-emerald-100/70 leading-relaxed max-w-2xl">
                Whether you&apos;re moving to Dhaka for work, studying in Chattogram,
                or traveling abroad, HouseRent helps you find the right room or
                house. Search, book, and live comfortably — anytime, anywhere.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex items-center space-x-2 text-emerald-100/80">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-400/30">
                    ✅
                  </div>
                  <span className="text-sm font-medium">Verified Listings</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-100/80">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 border border-teal-400/30">
                    🔒
                  </div>
                  <span className="text-sm font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-100/80">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 border border-cyan-400/30">
                    🏠
                  </div>
                  <span className="text-sm font-medium">All Property Types</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-100/80">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 border border-purple-400/30">
                    ⭐
                  </div>
                  <span className="text-sm font-medium">5-Star Support</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/properties"
                className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Browse Beautiful Homes</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <Link
                href="/list-property"
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 border border-white/20 hover:border-emerald-400/30 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>List Your Property</span>
                <span className="group-hover:scale-110 transition-transform">🏠</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">500+</div>
                <div className="text-sm text-emerald-100/60">Happy Tenants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">200+</div>
                <div className="text-sm text-emerald-100/60">Verified Hosts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">50+</div>
                <div className="text-sm text-emerald-100/60">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src={`/12.webp`}
                alt="Luxury Modern Apartment"
                width={600}
                height={500}
                quality={100}
                className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                🏆 Trusted Platform
              </div>
              
              {/* Bottom Info */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="flex justify-between items-center text-white">
                  <div>
                    <h3 className="font-semibold">Modern Luxury Apartment</h3>
                    <p className="text-emerald-100/70 text-sm">Dhaka, Bangladesh</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">$850</p>
                    <p className="text-emerald-100/70 text-sm">per month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-400/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-400/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 -right-4 w-6 h-6 bg-cyan-400/20 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
