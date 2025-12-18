import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-Geist bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Why HouseRent? */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose HouseRent?
              </span>
            </h2>
            <p className="text-lg text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
              Save time and money by connecting directly with people in your area. 
              Whether you want to rent or earn from your property, HouseRent gives 
              you the tools to make it happen seamlessly.
            </p>
          </div>

          {/* Key benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: "🗺️",
                title: "Location-Based Search",
                desc: "Quickly find homes and rooms near your current location."
              },
              {
                icon: "⚡",
                title: "Direct Booking",
                desc: "Send booking requests instantly—no middleman."
              },
              {
                icon: "📱",
                title: "Advertise Easily",
                desc: "List your home/room in a few clicks and start earning."
              },
              {
                icon: "🛡️",
                title: "Safe & Transparent",
                desc: "Verified users and secure communication for peace of mind."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group hover:transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-xl mb-4 border border-emerald-400/30 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">{benefit.title}</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h4>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {[
                  "Register and set up your profile in minutes",
                  "Search nearby homes or rooms with smart filters",
                  "Send booking requests directly to owners",
                  "Advertise your property in simple steps",
                  "Stay updated with real-time confirmations & alerts"
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <span className="text-emerald-100/80 group-hover:text-white transition-colors">{step}</span>
                  </div>
                ))}
              </div>
              <div className="relative">
                <Image
                  src={`/Register.jpg`}
                  alt="Registration Process"
                  width={600}
                  height={400}
                  quality={100}
                  className="rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                  Easy Setup
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-white/10">
            <Link
              href="/dashboard/pages/property/addProperty"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-2xl group"
            >
              <span>List Your Property Now</span>
              <span className="group-hover:translate-x-1 transition-transform">🚀</span>
            </Link>
            <p className="text-emerald-100/60 text-sm mt-4">
              It takes just 2 minutes to start earning from your property.
            </p>
          </div>
        </div>
      </div>

      {/* Renting Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Renting Made Simple & Effective
              </span>
            </h2>
            <p className="text-lg text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
              HouseRent bridges the gap between tenants and homeowners. Post your
              listing, get visibility, and connect directly with people looking for
              homes in your area.
            </p>
          </div>

          {/* Alternating Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <Image
                src={`/rent1.webp`}
                alt="Property Search"
                width={600}
                height={500}
                quality={100}
                className="rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                Smart Search
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-white mb-6">Why Advertise Here?</h3>
              <p className="text-emerald-100/80 mb-6 text-lg leading-relaxed">
                Listing your home with HouseRent means reaching people actively
                searching in your area. No need for agents, extra costs, or waiting.
              </p>
              <ul className="space-y-3">
                {[
                  "Free & easy listing setup",
                  "Location-based reach to relevant audiences",
                  "Direct booking requests from interested tenants",
                  "More visibility with less hassle"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 text-emerald-100/80">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 border border-cyan-400/30">
                      ✓
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reversed Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Benefits for Tenants</h3>
              <p className="text-emerald-100/80 mb-6 text-lg leading-relaxed">
                Tenants can browse hundreds of verified listings near them and
                contact owners directly for bookings with complete transparency.
              </p>
              <ul className="space-y-3">
                {[
                  "Search by area, budget, and availability",
                  "Contact owners directly without intermediaries",
                  "View detailed property information & high-quality photos",
                  "Save favorites and compare options easily"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 text-emerald-100/80">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 border border-purple-400/30">
                      ✓
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <Image
                src={`/rent5.webp`}
                alt="Tenant Benefits"
                width={600}
                height={500}
                quality={100}
                className="rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                Happy Tenants
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center pt-8 border-t border-white/10">
            <Link
              href="/properties"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-2xl group"
            >
              <span>Explore Properties Now</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <p className="text-emerald-100/60 text-sm mt-4">
              Renting and advertising made completely effortless.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <Image
                src={`/rent4.webp`}
                alt="Modern Home"
                width={600}
                height={500}
                quality={100}
                className="rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                Premium Listings
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Find Homes & Rooms
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Near You
                </span>
              </h1>
              
              <h2 className="text-xl text-emerald-100/80 font-semibold capitalize">
                🌟 Search, Book, or Advertise with Ease
              </h2>
              
              <p className="text-lg text-emerald-100/70 leading-relaxed">
                Whether you are looking to rent a place or list your own, our
                platform makes it simple. Use location-based search to find 
                nearby homes, and advertise your property in minutes.
              </p>

              <div className="pt-4">
                <Link
                  href="/properties"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-2xl group"
                >
                  <span>Get Started Today</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Flow Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-cyan-400/20 p-8 md:p-12 shadow-2xl">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                How Booking Works ⏳
              </span>
            </h2>
            <p className="text-lg text-cyan-100/80 max-w-3xl mx-auto leading-relaxed">
              Our process is simple: find, connect, and confirm. No long forms, no
              hidden costs—just straightforward renting with complete transparency.
            </p>
          </div>

          {/* Alternating Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Why Book with HouseRent?</h3>
              <p className="text-cyan-100/80 mb-6 text-lg leading-relaxed">
                We provide clarity and convenience for tenants. See real-time availability,
                connect instantly with owners, and move in faster with our streamlined process.
              </p>
              <ul className="space-y-4">
                {[
                  "Search through verified, quality listings",
                  "Check comprehensive details & real-time availability",
                  "Send direct booking requests to property owners",
                  "Receive instant confirmations and updates"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-4 text-cyan-100/80">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 border border-cyan-400/30">
                      ✓
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <Image
                src={`/rent6.webp`}
                alt="Booking Process"
                width={600}
                height={500}
                quality={100}
                className="rounded-2xl shadow-2xl border border-cyan-400/20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                Easy Booking
              </div>
            </div>
          </div>

          {/* Reversed Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <Image
                src={`/rent7.webp`}
                alt="Booking Tips"
                width={600}
                height={500}
                quality={100}
                className="rounded-2xl shadow-2xl border border-cyan-400/20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                Pro Tips
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-white mb-6">Booking Tips</h3>
              <p className="text-cyan-100/80 mb-6 text-lg leading-relaxed">
                Make the most of your HouseRent booking experience with these expert tips:
              </p>
              <ul className="space-y-4">
                {[
                  "Book early to get the best property choices",
                  "Check all property details and amenities carefully",
                  "Communicate clearly and promptly with the owner",
                  "Use saved favorites for quick access to preferred listings"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-4 text-cyan-100/80">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-400/30">
                      💡
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center pt-8 border-t border-cyan-400/20">
            <Link
              href="/properties"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-2xl group"
            >
              <span>Start Booking Now</span>
              <span className="group-hover:translate-x-1 transition-transform">🏠</span>
            </Link>
            <p className="text-cyan-100/60 text-sm mt-4">
              Renting has never been this easy and transparent.
            </p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 backdrop-blur-lg rounded-3xl border border-teal-400/20 p-8 md:p-12 shadow-2xl">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                Rental Insights 📊
              </span>
            </h2>
            <p className="text-lg text-teal-100/80 max-w-3xl mx-auto leading-relaxed">
              Understand your areas rental market, get insights into average rents,
              and make smarter decisions whether you are renting or advertising.
            </p>
          </div>

          {/* Chart Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-teal-400/20 p-8 mb-16">
            <h3 className="text-2xl font-bold text-teal-300 mb-8 text-center">Average Rental Trends</h3>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-4xl">
                <Image
                  src={`/rent8.jpg`}
                  alt="Rental Market Insights"
                  width={800}
                  height={400}
                  quality={100}
                  className="rounded-xl shadow-lg border border-teal-400/20"
                />
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { value: "৳ 12,000", label: "Avg. Rent in Dhaka", gradient: "from-red-500 to-pink-600" },
              { value: "৳ 8,500", label: "Avg. Room Rent", gradient: "from-indigo-500 to-purple-600" },
              { value: "25%", label: "Cheaper in Suburbs", gradient: "from-green-500 to-emerald-600" }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-center shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}>
                <h4 className="text-3xl font-bold text-white mb-2">{stat.value}</h4>
                <p className="text-white/90 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Motivational Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-teal-300 mb-6">Make Data-Driven Choices</h3>
            <p className="text-teal-100/80 text-lg leading-relaxed">
              With HouseRent insights, you can compare prices across neighborhoods, 
              evaluate market trends, and choose the perfect property that matches 
              both your needs and budget.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-teal-400/20">
            <Link
              href="/properties"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-2xl group"
            >
              <span>Start Exploring Homes</span>
              <span className="group-hover:translate-x-1 transition-transform">📈</span>
            </Link>
            <p className="text-teal-100/60 text-sm mt-4">
              Smarter renting starts with the right information and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}