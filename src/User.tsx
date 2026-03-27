import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import loadingAnimation from './assets/loading.json';

const LoadingAnimation = () => {
  // Handle potential ESM/CJS interop issues in experimental Vite/Node environments
  const LottieComponent = (Lottie as any).default || Lottie;

  return (
    <div className="relative flex items-center justify-center" style={{ width: '180px', height: '180px' }}>
      <div className="absolute inset-0 bg-[#00b894] blur-[40px] opacity-10 animate-pulse-soft"></div>
      <div className="w-full h-full relative z-10 flex items-center justify-center">
        <LottieComponent 
          animationData={loadingAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

interface PublishedLink {
  _id: string; // MongoDB uses _id
  subject: string;
  link: string;
  date: string;
}

export default function User() {
  const [links, setLinks] = useState<PublishedLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const startTime = Date.now();
        const res = await fetch('https://for-venilla-bend.vercel.app/api/links');
        const data = await res.json();
        
        // Ensure at least 3 seconds of loading
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        setLinks(data);
      } catch (err) {
        console.error('Failed to fetch links:', err);
        // Even on error, stay for 3s
        await new Promise(resolve => setTimeout(resolve, 3000));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <LoadingAnimation />
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container-full min-h-screen"
        >
          <header className="mb-24 flex flex-col items-center text-center">
            <div className="badge">
              Access Granted
            </div>
            <h1 className="header-title tracking-tighter">
              Vennila <span className="text-[#00b894]">Accessories</span>
            </h1>
            <div className="flex items-center gap-6 mt-4">
              <div className="h-[1px] w-12 bg-black/10"></div>
              <p className="text-zinc-400 font-bold uppercase tracking-[0.5em] text-[10px]">Premium Experience</p>
              <div className="h-[1px] w-12 bg-black/10"></div>
            </div>
          </header>

          <main className="min-h-[500px]">
            <AnimatePresence mode="popLayout">
              <div className="grid-layout">
                {links.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full text-center py-40 card border-dashed"
                  >
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <ShieldCheck className="text-zinc-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-widest mb-4">No Active Portals</h3>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Awaiting system synchronisation</p>
                  </motion.div>
                ) : (
                  links.map((item, index) => (
                    <motion.a
                      key={item._id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, ease: "easeOut" }}
                      className="card group flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-10">
                          <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-500">
                            <Sparkles size={18} className="text-zinc-600 group-hover:text-white" />
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-[#00b894]">
                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-black uppercase leading-[1.1] mb-6 tracking-tight group-hover:text-[#00b894] transition-colors">
                          {item.subject}
                        </h3>
                        
                        <div className="flex gap-2 mb-4">
                          <div className="h-1 w-8 bg-black/5 rounded-full group-hover:w-16 group-hover:bg-[#00b894]/20 transition-all duration-500"></div>
                          <div className="h-1 w-2 bg-black/5 rounded-full"></div>
                        </div>
                        
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                          Verified Document Access Node
                        </p>
                      </div>

                      <div className="mt-12 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Portal</span>
                          <div className="w-6 h-[1px] bg-black/10 group-hover:w-12 group-hover:bg-[#00b894]/30 transition-all duration-500"></div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:border-black group-hover:translate-x-2 transition-all duration-500">
                          <ExternalLink size={16} className="text-zinc-400 group-hover:text-black" />
                        </div>
                      </div>
                    </motion.a>
                  ))
                )}
              </div>
            </AnimatePresence>
          </main>
          
          <footer className="mt-40 pt-16 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-16 pb-20">
            <div className="md:col-span-1">
              <h4 className="font-black uppercase tracking-[0.3em] mb-6 text-sm">Vennila <span className="text-[#00b894]">Accessories</span></h4>
              <p className="text-[10px] font-medium text-zinc-400 uppercase leading-loose tracking-widest max-w-xs">
                Premium digital gateway for modern mobile solutions.
              </p>
            </div>
            
            <div className="md:col-span-2 flex justify-between md:justify-end gap-24">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Navigation</p>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                  <li><a href="#" className="text-zinc-600 hover:text-[#00b894] transition-colors">Digital Vault</a></li>
                  <li><a href="#" className="text-zinc-600 hover:text-[#00b894] transition-colors">Support Node</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Legal Core</p>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                  <li><a href="#" className="text-zinc-600 hover:text-[#00b894] transition-colors">Security Protocol</a></li>
                  <li><a href="#" className="text-zinc-600 hover:text-[#00b894] transition-colors">Usage Terms</a></li>
                </ul>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
