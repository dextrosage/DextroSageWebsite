import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Cpu, Code2, Monitor } from 'lucide-react';

export const Landing: React.FC = () => {

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-screen pt-32 pb-24 flex items-center bg-transparent z-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full flex flex-col lg:flex-row items-center relative z-20">
          <div className="w-full lg:w-[60%] text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[52px] sm:text-[64px] lg:text-[80px] font-[400] tracking-tighter leading-[1.05] mb-8 text-white"
            >
              Beyond the<br/>Ordinary.<br/>Create. Innovate.<br/>Elevate.
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-row items-center justify-start gap-3 sm:gap-4 mt-8"
            >
              <a
                href="#services"
                className="px-6 py-4 text-[15px] font-bold bg-white text-black hover:bg-gray-200 rounded-xl transition-all flex items-center justify-between"
              >
                Learn More
                <div className="bg-black text-white rounded-full p-1 ml-2">
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </a>
            </motion.div>
          </div>
          <div className="flex-1 hidden lg:block"></div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 flex flex-col lg:flex-row justify-between items-end z-20">
          <div className="hidden lg:block text-[16px] font-[600] text-gray-200 tracking-wide drop-shadow-md">
            Scroll down
          </div>
          <div className="w-full lg:w-auto flex flex-col">
            <div className="lg:hidden text-[14px] text-gray-400 text-right w-full mb-4 font-semibold tracking-wider">
              Scroll down
            </div>
            <div className="text-[15px] sm:text-[18px] text-white lg:text-right text-left max-w-full lg:max-w-[500px] leading-[1.6]">
              DextroSage: Your partner in Custom AI & IoT, Cybersecurity & Cloud, and Software Architecture.
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISION & CLIENTS */}
      <section className="py-32 lg:py-48 bg-transparent z-10 relative">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-xs font-[500] text-blue-400/80 uppercase tracking-widest mb-16 lg:ml-8">
            DextroSage
          </div>
          <h2 className="text-[44px] md:text-[56px] font-[600] text-white leading-[1.3] tracking-wide max-w-[600px] lg:max-w-[750px] mb-48 lg:ml-8">
            To empower businesses with <em className="font-serif italic font-[400] text-blue-300">cutting-edge technology</em> solutions <br/> and <em className="font-serif italic font-[400] text-cyan-300">strategic digital transformation</em>.
          </h2>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section id="services" className="pt-32 lg:pt-48 pb-16 lg:pb-24 bg-[#FAFAFA] text-black z-20 relative rounded-t-[48px]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-32">
            <div className="lg:w-[55%]">
              <div className="text-sm font-extrabold text-blue-600 uppercase tracking-tight mb-12">Capabilities</div>
              <h2 className="text-[48px] lg:text-[64px] font-[300] leading-[1.2] tracking-tighter">
                We engineer resilient systems for the modern enterprise.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-16 bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)]">
              <Shield className="w-12 h-12 mb-12 text-black" strokeWidth={2} />
              <h3 className="text-[24px] font-[600] mb-6 tracking-tight">Zero-Trust Cloud Infrastructure</h3>
              <p className="text-gray-500 text-[16px] leading-[1.8] font-[400] max-w-[340px]">We design and deploy highly secure, scalable cloud environments with absolute data integrity and strict access controls.</p>
            </div>
            <div className="p-16 bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)]">
              <Cpu className="w-12 h-12 mb-12 text-black" strokeWidth={2} />
              <h3 className="text-[24px] font-[600] mb-6 tracking-tight">Custom LLM Pipelines</h3>
              <p className="text-gray-500 text-[16px] leading-[1.8] font-[400] max-w-[340px]">End-to-end integration of large language models, retrieval-augmented generation (RAG), and proprietary data indexing.</p>
            </div>
            <div className="p-16 bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)]">
              <Monitor className="w-12 h-12 mb-12 text-black" strokeWidth={2} />
              <h3 className="text-[24px] font-[600] mb-6 tracking-tight">Premium Web Experiences</h3>
              <p className="text-gray-500 text-[16px] leading-[1.8] font-[400] max-w-[340px]">Business-grade, high-performance web applications built with professional design and flawless user interactions.</p>
            </div>
            <div className="p-16 bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 cursor-pointer hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)]">
              <Code2 className="w-12 h-12 mb-12 text-black" strokeWidth={2} />
              <h3 className="text-[24px] font-[600] mb-6 tracking-tight">Enterprise Architecture</h3>
              <p className="text-gray-500 text-[16px] leading-[1.8] font-[400] max-w-[340px]">Monolith-to-microservice transitions, high-concurrency backend design, and future-proof system foundations.</p>
            </div>
          </div>
        </div>
      </section>


      {/* 5. OUR APPROACH */}
      <section className="pt-16 lg:pt-24 pb-32 lg:pb-48 bg-[#FAFAFA] text-black z-20 relative rounded-b-[48px]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-sm font-extrabold text-blue-600 uppercase tracking-tight mb-12">Our Approach</div>
          <h2 className="text-[48px] lg:text-[64px] font-[300] leading-[1.2] tracking-tighter mb-24 lg:w-[55%]">
            Where your ambition<br/>meets velocity.
          </h2>

          <div className="flex flex-col gap-8">
            {/* Row 1: Featured 2/3 + 1/3 */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Featured Left Card (2/3) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:w-2/3 h-[500px] rounded-[32px] relative overflow-hidden group shadow-[0_24px_64px_rgba(0,0,0,0.04)] hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)] transition-all duration-400 cursor-pointer hover:-translate-y-2"
              >
                <img src="/approach_featured.jpg" alt="Featured Approach" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 w-full text-white">
                  <h3 className="text-[32px] font-[500] mb-4 tracking-tight">Scalable Architecture</h3>
                  <p className="text-gray-300 text-[16px] leading-[1.8] font-[400] max-w-[400px]">We design robust software architectures that grow seamlessly with your enterprise, adapting to future technological shifts.</p>
                </div>
              </motion.div>
              
              {/* Vertical Feature Right (1/3) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:w-1/3 h-[500px] rounded-[32px] relative overflow-hidden group shadow-[0_24px_64px_rgba(0,0,0,0.02)] hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)] transition-all duration-400 cursor-pointer hover:-translate-y-2"
              >
                <img src="/approach_strategy.jpg" alt="Strategic Foresight" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 w-full flex flex-col justify-end">
                  <h3 className="text-[40px] font-[300] leading-[1.1] mb-6 tracking-tighter text-white drop-shadow-md">Strategic<br/>Foresight.</h3>
                  <p className="text-gray-300 text-[16px] leading-[1.8] font-[400]">Mapping the digital terrain before we build, ensuring every decision creates compounding long-term value.</p>
                </div>
              </motion.div>
            </div>

            {/* Row 2: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Image Minimal */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[400px] rounded-[32px] relative overflow-hidden group shadow-[0_24px_64px_rgba(0,0,0,0.02)] hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)] transition-all duration-400 cursor-pointer hover:-translate-y-2"
              >
                <img src="/approach_precision.jpg" alt="Precision" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full text-white">
                  <h3 className="text-[24px] font-[500] tracking-tight text-white drop-shadow-md">Elegant Precision</h3>
                  <p className="text-gray-300 text-[15px] leading-[1.8] font-[400] mt-2">Flawless execution driven by rigorous engineering standards.</p>
                </div>
              </motion.div>

              {/* Card 2: Editorial Text */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-[400px] rounded-[32px] relative overflow-hidden group shadow-[0_24px_64px_rgba(0,0,0,0.04)] hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)] transition-all duration-400 cursor-pointer hover:-translate-y-2"
              >
                <img src="/approach_innovation.jpg" alt="Innovation" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full text-white">
                  <h3 className="text-[24px] font-[500] tracking-tight mb-2">Innovation First</h3>
                  <p className="text-gray-300 text-[15px] leading-[1.8] font-[400]">We constantly explore emerging paradigms to deliver cutting-edge advantages.</p>
                </div>
              </motion.div>

              {/* Card 3: Geo Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-[400px] rounded-[32px] relative overflow-hidden group shadow-[0_24px_64px_rgba(0,0,0,0.02)] hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)] transition-all duration-400 cursor-pointer hover:-translate-y-2"
              >
                <img src="/approach_geo.jpg" alt="Geometric" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full text-white">
                  <h3 className="text-[24px] font-[500] tracking-tight mb-2">Deep Collaboration</h3>
                  <p className="text-gray-300 text-[15px] leading-[1.8] font-[400]">Working directly with founders and teams.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR PROCESS */}
      <section id="work" className="pt-32 lg:pt-48 pb-16 lg:pb-24 bg-transparent text-white z-10 relative">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-[12px] font-[500] text-slate-400 uppercase tracking-[0.25em] mb-24">How it works</div>
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-16 lg:mb-24">
            <h2 className="text-[64px] lg:text-[80px] font-[300] leading-[1.1] tracking-tighter lg:w-1/3">Our Process.</h2>
            <div className="lg:w-2/3 flex flex-col gap-4 mt-4 lg:mt-0">
              {[
                { title: "Initial Consultation", desc: "We begin with a detailed discussion to understand your unique business needs, market position, and technological challenges." },
                { title: "Solution Design", desc: "Our architects map out a comprehensive, scalable technical strategy and design system that aligns perfectly with your long-term objectives." },
                { title: "Implementation\n&\nDevelopment", desc: "We execute the plan, developing and integrating the solutions with precision, agile methodology, and rigorous quality assurance." },
                { title: "Support\n&\nOptimization", desc: "DextroSage provides ongoing support, continuous monitoring, and refines solutions to ensure peak performance and future growth." }
              ].map((step, i) => {
                const isLast = i === 3;
                return (
                  <div key={i} className={`w-full min-h-[220px] rounded-[28px] backdrop-blur-xl border shadow-lg p-10 lg:p-12 grid grid-cols-1 md:grid-cols-12 items-center gap-6 lg:gap-8 overflow-hidden ${
                    isLast 
                      ? 'bg-white/85 border-white/30 shadow-[0_8px_32px_rgba(255,255,255,0.05)]' 
                      : 'bg-gradient-to-br from-[#1c1c1c]/95 to-[#141414]/95 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                  }`}>
                    <div className="md:col-span-6 lg:col-span-5">
                      <h3 className={`text-[34px] lg:text-[38px] font-[600] tracking-tight leading-[1.1] pr-2 ${
                        isLast ? 'text-black' : 'text-white'
                      }`}>
                        {step.title.includes('\n') ? (
                          step.title.split('\n').map((line, idx) => (
                            <div key={idx} className={line === '&' ? "text-center opacity-30 text-[28px] my-1 font-light" : ""}>{line}</div>
                          ))
                        ) : step.title}
                      </h3>
                    </div>
                    <div className="md:col-span-6 lg:col-span-7 flex lg:pl-6">
                      <p className={`text-[18px] lg:text-[20px] leading-[1.6] font-[400] max-w-[340px] ${
                        isLast ? 'text-gray-800' : 'text-white/70'
                      }`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </section>

      {/* 6.5. KEY VALUES / WHY DEXTROSAGE */}
      <section className="pt-16 lg:pt-24 pb-32 lg:pb-48 bg-transparent z-10 relative">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Side */}
          <div className="lg:w-[40%] flex flex-col items-start z-20">
            <div className="text-[18px] font-[600] text-gray-400 uppercase tracking-widest mb-8">
              Key Values
            </div>
            <h2 className="text-[48px] lg:text-[56px] font-[700] text-white leading-[1.1] tracking-tight mb-8">
              We build technology with purpose.
            </h2>
            <p className="text-[15px] lg:text-[16px] text-white/70 leading-[1.8] mb-12 max-w-md">
              DextroSage is a founder-led engineering collective focused on AI, IoT, Cybersecurity, Cloud, and Software Architecture. We value quality, transparency, continuous learning, and modern engineering over inflated numbers.
            </p>
          </div>

          {/* Right Side: Floating Staggered Cards */}
          <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {/* Column 1 */}
            <div className="flex flex-col gap-6 mt-0">
              {[
                { val: "100%", label: "Founder-Led", desc: "Every solution is designed and reviewed by the founding engineering team." },
                { val: "AI", label: "Native", desc: "Artificial intelligence is integrated into every workflow where it creates real value." },
                { val: "Community", label: "Driven", desc: "Built by passionate engineers and students who learn, build and grow together." }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
                    className="group bg-[rgba(18,20,24,0.82)] backdrop-blur-[18px] border border-white/5 rounded-[26px] p-8 shadow-lg hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:border-white/10 hover:bg-[rgba(24,26,30,0.9)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className={`${card.val.length > 6 ? 'text-[36px] lg:text-[42px]' : 'text-[48px] lg:text-[56px]'} font-[700] text-white leading-none tracking-tight mb-2 drop-shadow-md break-words`}>
                        {card.val}
                      </div>
                      <div className="text-[18px] font-[600] text-blue-300 mb-6 drop-shadow-sm">
                        {card.label}
                      </div>
                    </div>
                    <p className="relative z-10 text-[15px] lg:text-[16px] text-white/70 leading-[1.6]">
                      {card.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-6 md:mt-16 lg:mt-24">
              {[
                { val: "0", label: "Compromises", desc: "Security, scalability and code quality are never sacrificed." },
                { val: "Open", label: "Source", desc: "We believe in open collaboration, transparency and community-driven innovation." },
                { val: "Future", label: "Ready", desc: "Modern architectures designed to evolve with tomorrow's technologies." }
              ].map((card, i) => (
                <motion.div
                  key={i + 3}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (i * 0.2) + 0.1 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
                    className="group bg-[rgba(18,20,24,0.82)] backdrop-blur-[18px] border border-white/5 rounded-[26px] p-8 shadow-lg hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:border-white/10 hover:bg-[rgba(24,26,30,0.9)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className={`${card.val.length > 6 ? 'text-[36px] lg:text-[42px]' : 'text-[48px] lg:text-[56px]'} font-[700] text-white leading-none tracking-tight mb-2 drop-shadow-md break-words`}>
                        {card.val}
                      </div>
                      <div className="text-[18px] font-[600] text-blue-300 mb-6 drop-shadow-sm">
                        {card.label}
                      </div>
                    </div>
                    <p className="relative z-10 text-[15px] lg:text-[16px] text-white/70 leading-[1.6]">
                      {card.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* 9. CTA & FOOTER */}
      <section id="contact" className="py-32 lg:py-48 bg-transparent text-white z-10 relative flex flex-col justify-between min-h-screen">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full text-center flex-1 flex flex-col justify-center items-center">
          <h2 className="text-[56px] md:text-[80px] font-[300] leading-[1.05] tracking-tighter mb-8">
            Build with purpose.
          </h2>
          <p className="text-[18px] lg:text-[20px] text-white/70 max-w-xl mx-auto leading-[1.6] mb-16">
            We only take on a select number of engineering partnerships per quarter. Let's discuss your architecture.
          </p>
          <a
            href="mailto:dextrosage.support@gmail.com?subject=DextroSage%20Partnership%20Inquiry"
            className="px-12 py-5 text-[16px] font-bold bg-white text-black hover:bg-gray-200 rounded-full transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Contact Us <ArrowRight size={20} strokeWidth={2.5} />
          </a>
        </div>

        <footer className="max-w-7xl mx-auto px-8 lg:px-12 w-full pt-48 border-t border-white/10 mt-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-4 mb-8">
              <img src="/Logo.jpeg" alt="Logo" className="w-10 h-10 rounded-xl" />
              <span className="text-xl font-bold tracking-tight text-white uppercase">DextroSage</span>
            </div>
            <p className="text-gray-400 text-[16px] leading-relaxed mb-6">
              Partner with DextroSage for advanced tech solutions.
            </p>
            <a href="mailto:dextrosage.support@gmail.com" className="text-[20px] font-[300] hover:text-blue-400 transition-colors">
              dextrosage.support@gmail.com
            </a>
          </div>

          <div className="flex gap-24">
            <div>
              <h4 className="text-white font-bold text-[16px] mb-6">Discover</h4>
              <ul className="space-y-4 text-gray-400 text-[15px]">
                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#work" className="hover:text-white transition-colors">Work</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-[16px] mb-6">Socials</h4>
              <ul className="space-y-4 text-gray-400 text-[15px]">
                <li><a href="https://www.instagram.com/dextrosage/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://www.linkedin.com/company/dextrosageofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </footer>
        <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full text-center text-gray-600 text-sm mt-16 pb-8">
          © 2026 DextroSage Inc. All rights reserved.
        </div>
      </section>
      
    </div>
  );
};
