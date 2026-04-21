import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Star, ArrowLeft, PlayCircle, PauseCircle, Sparkles, Mic, Square, Send, Wind, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// Using external audio URLs to ensure the application compiles and runs successfully in the preview.
// (You can change these back to your local imports in your VS Code!)
import song from './music/s4.mp3';
import song2 from './music/s2.mp3';
import song3 from './music/s3.mp3';

// --- DATA ---
const EMOTIONS = [
  { id: 'sad', label: 'Sad 🌧️', color: 'bg-pink-300', float: 'animate-[bounce_3s_infinite]' },
  { id: 'frightened', label: 'Frightened 🥺', color: 'bg-pink-400', float: 'animate-[bounce_4s_infinite_0.5s]' },
  { id: 'happy', label: 'Happy ✨', color: 'bg-pink-200', float: 'animate-[bounce_2.5s_infinite_1s]' },
  { id: 'pressured', label: 'Pressured 🌪️', color: 'bg-rose-400', float: 'animate-[bounce_3.5s_infinite_0.2s]' },
  { id: 'anxiety', label: 'Anxious 🌫️', color: 'bg-fuchsia-300', float: 'animate-[bounce_3s_infinite_0.8s]' },
];

const ENCOURAGEMENTS = [
  "You are doing your best, and that's enough.",
  "Take a deep breath. You're safe.",
  "Every storm runs out of rain.",
  "You are stronger than you think.",
  "It's okay to rest.",
  "Your feelings are valid.",
  "Tomorrow is a new, bright day.",
  "You shine so brightly!"
];

const VALIDATIONS = [
  "Your voice is heard. The universe has taken your heavy thoughts. Breathe.",
  "Let it go. You don't have to carry this weight anymore.",
  "Your feelings are valid, and now they are free.",
  "It is safe to release this. You are doing so well.",
  "We sent those worries far away. Be kind to yourself today."
];

// Frightened Carousel Data
const FRIGHTENED_SLIDES = [
  {
    quote: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
    author: "Mary Anne Radmacher",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800"
  },
  {
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
  },
  {
    quote: "Breathe, darling. This is just a chapter, not your whole story.",
    author: "S.C. Lourie",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800"
  },
  {
    quote: "Nothing diminishes anxiety faster than action.",
    author: "Walter Anderson",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
  }
];

// Sequential melodies
const CAMPFIRE_MELODY = [
  392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63, // Phrase 1
  329.63, 392.00, 329.63, 293.66, 261.63, 293.66,         // Phrase 2
  392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63, // Phrase 3
  329.63, 392.00, 293.66, 261.63, 261.63                  // Phrase 4
];

const TWINKLE_MELODY = [
  261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // Twinkle twinkle little star
  349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63, // How I wonder what you are
  392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, // Up above the world so high
  392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, // Like a diamond in the sky
  261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // Twinkle twinkle little star
  349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63  // How I wonder what you are
];

// Fandom Member Data (Using aesthetic aesthetic placeholders for compilation safety, acts as members)
const SVT_MEMBERS = [
  { name: "S.Coups", quote: "You are doing your best. That's more than enough.", img: "https://i.pinimg.com/736x/76/77/cb/7677cb5eb7d22511af903d3b16b46b70.jpg" },
  { name: "Jeonghan", quote: "It's okay to rest when you're tired. Lean on us.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfqCCnJKE3ompCWagCtqzG6Toei8h8Rxif6w&s" },
  { name: "Hoshi", quote: "Shine brightly! Your existence is a star.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaOnR0kLc2zd80QUITi-89nsPKHdO0wIU5w&s" },
  { name: "Woozi", quote: "Your hard work will pay off, just take it step by step.", img: "https://pbs.twimg.com/media/CrmfACiUIAAOJd_.jpg" }
];

const TXT_MEMBERS = [
  { name: "Choi Soo-bin", quote: "You are more than enough just as you are.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyq7jo7hq3lQEnrvx6IKFwG-gJmfcpfSQSsA&s" },
  { name: "Yeonjun", quote: "Trust yourself and your own pace. You're doing great.", img: "https://pbs.twimg.com/media/FCUMVopUUAMTdk6.jpg" },
  { name: "Huening Kai", quote: "It's okay to lean on others sometimes. We are here.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcx7-0L3-7V8I-arQuOQPssCZqGsfYNyGPlw&s" },
  { name: "Taehyun", quote: "Every small step you take is a beautiful step forward.", img: "https://i.pinimg.com/736x/60/54/fb/6054fb64709839b76c298cab4b9d467a.jpg" }
];

// --- HELPER COMPONENTS ---

// 1. Playable Piano (Sequential Campfire Melody)
const Piano = () => {
  const [popup, setPopup] = useState("");
  const [noteIndex, setNoteIndex] = useState(0);
  
  const playNextNote = () => {
    const frequency = CAMPFIRE_MELODY[noteIndex];
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);

    setNoteIndex((prev) => (prev + 1) % CAMPFIRE_MELODY.length);
    setPopup(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    setTimeout(() => setPopup(""), 3000);
  };

  const keys = Array(12).fill(null).map((_, i) => ({ isBlack: [1, 3, 6, 8, 10].includes(i) }));

  return (
    <div className="flex flex-col items-center space-y-8 mt-8">
      <div className="h-16 text-center">
        {popup && (
          <div className="animate-fade-in text-xl font-bold text-pink-600 bg-white/90 px-6 py-3 rounded-full shadow-lg border border-pink-200">
            {popup}
          </div>
        )}
      </div>
      
      <div className="relative flex shadow-2xl rounded-b-xl overflow-hidden bg-pink-900 p-2 max-w-[100vw] overflow-x-auto">
        {keys.map((key, i) => (
          <div key={i} className="relative flex-shrink-0">
            {!key.isBlack ? (
              <button onClick={playNextNote} className="w-10 sm:w-12 h-32 sm:h-40 bg-white hover:bg-pink-50 border border-pink-200 rounded-b-md focus:outline-none active:bg-pink-100 transition-colors cursor-pointer" />
            ) : (
              <button onClick={playNextNote} className="absolute -left-2.5 sm:-left-3 w-5 sm:w-6 h-20 sm:h-24 bg-pink-800 hover:bg-pink-700 rounded-b-sm z-10 focus:outline-none active:bg-pink-600 border border-pink-900 cursor-pointer" style={{ marginLeft: '1.25rem' }} />
            )}
          </div>
        ))}
      </div>
      <p className="text-pink-500 text-sm italic text-center">Tap any keys randomly.</p>
    </div>
  );
};

// Playable Drums (Twinkle Twinkle Melody)
const DrumKit = () => {
  const [popup, setPopup] = useState("");
  const [noteIndex, setNoteIndex] = useState(0);
  const [activeDrum, setActiveDrum] = useState(null);

  const playDrum = (index) => {
    setActiveDrum(index);
    setTimeout(() => setActiveDrum(null), 150); // reset animation

    const frequency = TWINKLE_MELODY[noteIndex];
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Use a triangle wave and pitch drop for a warm percussive / synth-tom sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.9, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);

    setNoteIndex((prev) => (prev + 1) % TWINKLE_MELODY.length);
    
    // Only pop up sometimes so it isn't overwhelming on fast drumming
    if (Math.random() > 0.6) {
      setPopup(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
      setTimeout(() => setPopup(""), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-8 w-full">
      <div className="h-12 text-center">
        {popup && (
          <div className="animate-fade-in text-lg font-bold text-pink-600 bg-white/90 px-4 py-2 rounded-full shadow-md">
            {popup}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-sm">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => playDrum(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-pink-300 shadow-[0_5px_15px_rgba(244,143,177,0.4)] transition-all duration-75 outline-none
              ${activeDrum === i ? 'bg-pink-400 scale-95 shadow-inner' : 'bg-gradient-to-br from-pink-100 to-pink-200 hover:scale-105'}`}
          >
            <div className="w-full h-full rounded-full border-2 border-white/50 pointer-events-none"></div>
          </button>
        ))}
      </div>
      <p className="text-pink-500 text-sm italic text-center">Tap the drums to play a sweet lullaby.</p>
    </div>
  );
};

// 2. Music Box with Dancing Ballerina
const MusicBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(song);
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-6">
      <div onClick={toggleMusic} className="relative w-56 h-56 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-300 shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white/60 group overflow-hidden">
        <div className="absolute inset-2 border-2 border-pink-300 border-dashed rounded-xl"></div>
        <svg viewBox="0 0 100 120" className={`w-32 h-32 text-pink-500 drop-shadow-xl z-10 transition-transform duration-1000 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : 'group-hover:scale-105'}`}>
          <ellipse cx="50" cy="110" rx="25" ry="6" fill="rgba(236, 72, 153, 0.4)" />
          <path d="M 47 75 L 45 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 53 75 L 68 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 20 70 Q 50 85 80 70 Q 50 60 20 70" fill="currentColor" opacity="0.8" />
          <path d="M 30 65 Q 50 75 70 65 Q 50 55 30 65" fill="#fbcfe8" opacity="0.9" />
          <path d="M 50 35 Q 45 55 50 70" stroke="currentColor" strokeWidth="5" fill="none" />
          <path d="M 50 40 Q 20 20 45 15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 50 40 Q 80 20 55 15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="25" r="8" fill="currentColor" />
          <circle cx="58" cy="20" r="4" fill="currentColor" />
        </svg>
        {isPlaying && (
          <>
            <Sparkles className="absolute top-4 right-4 text-pink-400 animate-pulse" size={24} />
            <Sparkles className="absolute bottom-4 left-4 text-pink-400 animate-[pulse_1s_infinite_0.5s]" size={20} />
            <Music className="absolute top-6 left-6 text-pink-400 animate-[bounce_2s_infinite]" size={18} />
          </>
        )}
      </div>
      <button onClick={toggleMusic} className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow-lg flex items-center space-x-3">
        {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
        <span className="font-semibold text-lg">{isPlaying ? 'Close Music Box' : 'Wind the Music Box'}</span>
      </button>
    </div>
  );
};

const MusicBox2 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(song2);
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-6">
      <div onClick={toggleMusic} className="relative w-56 h-56 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-300 shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white/60 group overflow-hidden">
        <div className="absolute inset-2 border-2 border-pink-300 border-dashed rounded-xl"></div>
        <svg viewBox="0 0 100 120" className={`w-32 h-32 text-pink-500 drop-shadow-xl z-10 transition-transform duration-1000 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : 'group-hover:scale-105'}`}>
          <ellipse cx="50" cy="110" rx="25" ry="6" fill="rgba(236, 72, 153, 0.4)" />
          <path d="M 47 75 L 45 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 53 75 L 68 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 20 70 Q 50 85 80 70 Q 50 60 20 70" fill="currentColor" opacity="0.8" />
          <path d="M 30 65 Q 50 75 70 65 Q 50 55 30 65" fill="#fbcfe8" opacity="0.9" />
          <path d="M 50 35 Q 45 55 50 70" stroke="currentColor" strokeWidth="5" fill="none" />
          <path d="M 50 40 Q 20 20 45 15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 50 40 Q 80 20 55 15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="25" r="8" fill="currentColor" />
          <circle cx="58" cy="20" r="4" fill="currentColor" />
        </svg>
        {isPlaying && (
          <>
            <Sparkles className="absolute top-4 right-4 text-pink-400 animate-pulse" size={24} />
            <Sparkles className="absolute bottom-4 left-4 text-pink-400 animate-[pulse_1s_infinite_0.5s]" size={20} />
            <Music className="absolute top-6 left-6 text-pink-400 animate-[bounce_2s_infinite]" size={18} />
          </>
        )}
      </div>
      <button onClick={toggleMusic} className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow-lg flex items-center space-x-3">
        {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
        <span className="font-semibold text-lg">{isPlaying ? 'Close Music Box' : 'Wind the Music Box'}</span>
      </button>
    </div>
  );
};


// 3. Fandom Safe Space Switcher (Carat & MOA Zones)
const SafeSpaceSwitcher = () => {
  const [fandom, setFandom] = useState('carat'); // 'carat' | 'moa'

  return (
    <div className="w-full flex flex-col items-center space-y-8 md:space-y-12 animate-[fade-in_0.8s_ease-out]">
      
      {/* Grandiose Wrapper (Mobile Optimized) */}
      <div className="w-full max-w-5xl border-[8px] md:border-[16px] border-double border-pink-300 bg-white/70 rounded-[2rem] md:rounded-[3rem] p-4 sm:p-8 md:p-12 shadow-[0_0_40px_rgba(244,143,177,0.5)] relative overflow-hidden">
        
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 w-full h-6 md:h-8 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 flex items-center justify-center">
           <div className="flex gap-4">
              <Star size={12} className="text-white animate-pulse" />
              <Star size={12} className="text-white animate-pulse delay-75" />
              <Star size={12} className="text-white animate-pulse delay-150" />
           </div>
        </div>
        
        {/* Title Badge */}
        <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 sm:px-6 md:px-8 py-1.5 md:py-2 rounded-full shadow-lg font-serif font-bold tracking-wider md:tracking-widest border-2 border-white mt-8 md:mt-10 z-10 text-xs sm:text-sm md:text-base whitespace-nowrap">
          ✨ {fandom === 'carat' ? "CARAT SANCTUARY" : "MOA SANCTUARY"} ✨
        </div>

        <div className="mt-8 md:mt-10 w-full">
          {fandom === 'carat' ? <SVTZone /> : <TXTZone />}
        </div>
      </div>

      {/* Switcher Button */}
      <button 
        onClick={() => setFandom(fandom === 'carat' ? 'moa' : 'carat')}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm sm:text-lg font-bold rounded-full shadow-[0_10px_20px_rgba(244,143,177,0.5)] hover:scale-105 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 sm:gap-3 border-4 border-white"
      >
        <Heart className={fandom === 'carat' ? "text-blue-200" : "text-pink-200"} fill="currentColor" size={20} />
        {fandom === 'carat' ? "Go to MOA Space 💙" : "Return to Carat Space 💎"}
      </button>

    </div>
  );
};

// --- CARAT ZONE ---
const SVTZone = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-8 md:space-y-12 animate-[fade-in_0.5s_ease-out]">
      <div className="text-center space-y-2 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700 drop-shadow-sm mt-2 md:mt-4 leading-snug">Breathe. Let SEVENTEEN comfort you.</h2>
      </div>

      {/* Hologram of Jun */}
      <div className="relative group w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(244,143,177,0.6)] animate-[pulse_4s_infinite] border-4 border-pink-200">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/90 to-transparent z-10 flex flex-col justify-end p-4 md:p-6 text-center">
          <h3 className="text-white text-2xl md:text-3xl font-bold tracking-widest drop-shadow-md mb-1">JUN</h3>
          <p className="text-pink-100 text-xs sm:text-sm font-medium italic">"You did well today."</p>
        </div>
        <div className="absolute inset-0 bg-pink-200 flex items-center justify-center mix-blend-overlay">
           <div className="w-full h-full bg-[url('https://dispatch.cdnser.be/cms-content/uploads/2022/05/04/3fa4dbf3-f720-491d-8539-3ecc233c0024.JPG')] bg-cover bg-center opacity-70 filter brightness-110 contrast-125 hue-rotate-315"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none opacity-30"></div>
      </div>

      {/* Video & Album Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 w-full">
        {/* Healing Video */}
        <div className="bg-pink-50/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-sm border-2 border-pink-200">
          <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-3 sm:mb-4 flex items-center gap-2">
            <PlayCircle size={22}/> Healing Video
          </h3>
          <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-inner bg-pink-200 border-2 border-pink-300 relative group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/hybZ-akxuuA" 
              title="SEVENTEEN Healing Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Polaroid Images + Quotes */}
        <div className="bg-pink-50/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-sm border-2 border-pink-200">
          <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ImageIcon size={22}/> Comforting Words
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
             {SVT_MEMBERS.map((member, i) => (
               <div key={i} className="aspect-square bg-white p-1.5 sm:p-2 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:rotate-2 hover:z-10 group relative flex flex-col">
                 <div className="w-full h-2/3 bg-gray-200 rounded overflow-hidden">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover filter brightness-110" />
                 </div>
                 <div className="flex-1 flex flex-col justify-center items-center p-1 text-center">
                    <span className="font-bold text-pink-600 text-xs sm:text-sm">{member.name}</span>
                 </div>
                 {/* Hover Quote Overlay */}
                 <div className="absolute inset-0 bg-pink-500/90 text-white p-2 sm:p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center text-xs sm:text-sm font-medium italic backdrop-blur-sm">
                   "{member.quote}"
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MOA ZONE ---
const TXTZone = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-8 md:space-y-12 animate-[fade-in_0.5s_ease-out]">
      <div className="text-center space-y-2 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700 drop-shadow-sm mt-2 md:mt-4 leading-snug">Breathe. Let TXT comfort you.</h2>
      </div>

      {/* Hologram of Yeonjun */}
      <div className="relative group w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(244,143,177,0.6)] animate-[pulse_4s_infinite] border-4 border-pink-200">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-400/90 via-pink-400/60 to-transparent z-10 flex flex-col justify-end p-4 md:p-6 text-center">
          <h3 className="text-white text-2xl md:text-3xl font-bold tracking-widest drop-shadow-md mb-1">BEOMGYU</h3>
          <p className="text-pink-50 text-xs sm:text-sm font-medium italic">"It's okay to take a break."</p>
        </div>
        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center mix-blend-overlay">
           <div className="w-full h-full bg-[url('https://cdn.shopify.com/s/files/1/0469/3927/5428/files/7669fce149cdf8ae7b1e629457a51eae.jpg?v=1733737256')] bg-cover bg-center opacity-70 filter brightness-110 contrast-125 hue-rotate-315"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:100%_4px] z-20 pointer-events-none opacity-30"></div>
      </div>

      {/* Video & Album Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 w-full">
        {/* Healing Video */}
        <div className="bg-pink-50/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-sm border-2 border-pink-200">
          <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-3 sm:mb-4 flex items-center gap-2">
            <PlayCircle size={22}/> Healing Video
          </h3>
          <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-inner bg-blue-100 border-2 border-pink-300 relative group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/FVYjsfl5vfs" 
              title="TXT Healing Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Polaroid Images + Quotes */}
        <div className="bg-pink-50/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-sm border-2 border-pink-200">
          <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ImageIcon size={22}/> Comforting Words
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
             {TXT_MEMBERS.map((member, i) => (
               <div key={i} className="aspect-square bg-white p-1.5 sm:p-2 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:-rotate-2 hover:z-10 group relative flex flex-col">
                 <div className="w-full h-2/3 bg-gray-200 rounded overflow-hidden">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover filter brightness-110" />
                 </div>
                 <div className="flex-1 flex flex-col justify-center items-center p-1 text-center">
                    <span className="font-bold text-pink-600 text-xs sm:text-sm">{member.name}</span>
                 </div>
                 {/* Hover Quote Overlay */}
                 <div className="absolute inset-0 bg-blue-400/90 text-white p-2 sm:p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center text-xs sm:text-sm font-medium italic backdrop-blur-sm">
                   "{member.quote}"
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// 4. Rant Space to the Abyss
const RantSpace = () => {
  const [rantText, setRantText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [stage, setStage] = useState('input'); // 'input', 'flying', 'exploding', 'validating'
  const [validationMsg, setValidationMsg] = useState('');
  const validationAudioRef = useRef(null);

  // Initialize the validation stage audio
  useEffect(() => {
    validationAudioRef.current = new Audio(song3);
    validationAudioRef.current.loop = true; // Soothing music can loop gently
    return () => {
      if (validationAudioRef.current) {
        validationAudioRef.current.pause();
        validationAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Watch for stage changes to play/pause the validation audio
  useEffect(() => {
    if (stage === 'validating') {
      validationAudioRef.current?.play().catch(e => console.log("Audio play failed:", e));
    } else {
      if (validationAudioRef.current) {
        validationAudioRef.current.pause();
        validationAudioRef.current.currentTime = 0;
      }
    }
  }, [stage]);

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    // Note: We don't save the audio to preserve privacy & fit the "send to abyss" theme.
    // It's a symbolic action of speaking out loud.
  };

  const handleSendToAbyss = () => {
    if (!rantText.trim() && !isRecording) return;
    
    setIsRecording(false);
    setStage('flying');

    // Sequence of animations
    setTimeout(() => setStage('exploding'), 1500);
    setTimeout(() => {
      setValidationMsg(VALIDATIONS[Math.floor(Math.random() * VALIDATIONS.length)]);
      setStage('validating');
    }, 2500);
  };

  const resetRant = () => {
    setRantText('');
    setStage('input');
  };

  return (
    <div className="mt-20 w-full max-w-2xl mx-auto flex flex-col items-center px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-pink-700 flex items-center justify-center gap-2">
          <Wind className="text-pink-400" /> Let It Go to the Abyss
        </h2>
        <p className="text-pink-500 mt-2 text-sm sm:text-base">Write down your heavy thoughts, or say them out loud. We will send them far away.</p>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center">
        
        {/* Stage 1: Input Area */}
        {stage === 'input' && (
          <div className="w-full bg-white/60 backdrop-blur-md border border-pink-200 p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col animate-[fade-in_0.5s_ease-out]">
            <textarea
              className="w-full h-24 sm:h-28 bg-transparent text-pink-800 placeholder-pink-300 resize-none outline-none text-base sm:text-lg"
              placeholder="What's weighing on your mind today?..."
              value={rantText}
              onChange={(e) => setRantText(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-pink-100">
              <button 
                onClick={handleRecordToggle}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium transition-colors w-full sm:w-auto ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}`}
              >
                {isRecording ? <Square size={18} /> : <Mic size={18} />}
                {isRecording ? 'Recording...' : 'Speak it out'}
              </button>
              
              <button 
                onClick={handleSendToAbyss}
                disabled={!rantText.trim() && !isRecording}
                className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full shadow-md transition-all font-semibold w-full sm:w-auto"
              >
                <Send size={18} /> Send Away
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Airplane Flying */}
        {stage === 'flying' && (
          <div className="absolute animate-[flyAway_1.5s_cubic-bezier(0.4,0,0.2,1)_forwards]">
            <Send size={64} className="text-pink-400 fill-pink-300" />
          </div>
        )}

        {/* Stage 3: Fireworks Explosion */}
        {stage === 'exploding' && (
          <div className="absolute flex items-center justify-center">
            {/* Custom SVG Firework */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 animate-[firework_1s_ease-out_forwards]">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line key={i} x1="50" y1="50" x2="50" y2="10" 
                      stroke="#f472b6" strokeWidth="4" strokeLinecap="round"
                      transform={`rotate(${angle} 50 50)`} 
                      className="animate-[fireworkLines_1s_ease-out_forwards]" />
              ))}
              <circle cx="50" cy="50" r="5" fill="#fbcfe8" className="animate-ping" />
            </svg>
          </div>
        )}

        {/* Stage 4: Validation Message */}
        {stage === 'validating' && (
          <div className="absolute text-center animate-[fade-in_1s_ease-out] w-full bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-xl">
            <Heart className="mx-auto text-pink-400 mb-4" size={40} />
            <h3 className="text-xl sm:text-2xl font-serif text-pink-700 italic leading-relaxed mb-6">"{validationMsg}"</h3>
            <button 
              onClick={resetRant}
              className="text-pink-500 hover:text-pink-700 font-medium underline underline-offset-4 decoration-pink-300"
            >
              Write another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Frightened Carousel Component
const FrightenedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % FRIGHTENED_SLIDES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + FRIGHTENED_SLIDES.length) % FRIGHTENED_SLIDES.length);

  const slide = FRIGHTENED_SLIDES[currentIndex];

  return (
    <div className="w-full flex flex-col items-center animate-[fade-in_0.8s_ease-out]">
       <div className="p-4 sm:p-6 md:p-8 bg-white/70 rounded-3xl shadow-xl max-w-2xl w-full text-center border-2 border-pink-100 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200"></div>

          {/* Image Container */}
          <div className="w-full h-40 sm:h-48 md:h-64 rounded-2xl overflow-hidden mb-6 relative shadow-inner">
             <img key={slide.image} src={slide.image} alt="Comforting scenery" className="w-full h-full object-cover animate-[fade-in_0.5s_ease-out]" />
          </div>

          {/* Quote Container */}
          <div className="flex items-center justify-between w-full">
             <button onClick={prevSlide} className="p-1 sm:p-2 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                <ChevronLeft size={28} className="sm:w-8 sm:h-8" />
             </button>

             <div className="px-2 sm:px-4 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center animate-[fade-in_0.5s_ease-out]" key={slide.quote}>
                <h2 className="text-lg sm:text-xl md:text-2xl font-light text-pink-700 mb-2 sm:mb-4 italic">"{slide.quote}"</h2>
                <p className="text-pink-500 font-medium text-sm sm:text-base">— {slide.author}</p>
             </div>

             <button onClick={nextSlide} className="p-1 sm:p-2 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                <ChevronRight size={28} className="sm:w-8 sm:h-8" />
             </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-4 sm:mt-6">
            {FRIGHTENED_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${i === currentIndex ? 'bg-pink-500' : 'bg-pink-200 hover:bg-pink-300'}`} />
            ))}
          </div>
       </div>
       <p className="text-pink-500 mt-6 text-sm sm:text-base">— You are safe here.</p>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [emotion, setEmotion] = useState(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (!emotion) return;
    const quotes = {
      sad: "It's okay to let the tears fall. We're here to dry them.",
      frightened: "Wrap yourself in this safe pink bubble. Nothing can hurt you here.",
      happy: "Your smile lights up this entire dimension!",
      pressured: "Drop the weight of the world at the door. Just be.",
      anxiety: "Inhale peace, exhale worry. Let's find comfort together."
    };
    setQuote(quotes[emotion.id]);
  }, [emotion]);

  const renderDimensionContent = () => {
    switch (emotion.id) {
      case 'sad':
        return (
          <div className="w-full flex flex-col items-center animate-[fade-in_0.8s_ease-out] space-y-10 md:space-y-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-800 text-center max-w-lg px-4">
              Sometimes the best remedy is a gentle melody. Tap the piano keys or play the drums below...
            </h2>
            <Piano />
            <div className="w-full h-px bg-pink-200 max-w-lg mx-auto my-4 sm:my-8"></div>
            <DrumKit />
          </div>
        );
      case 'frightened':
        return <FrightenedCarousel />;
      case 'happy':
        return (
          <div className="w-full flex flex-col items-center animate-[fade-in_0.8s_ease-out]">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-800 text-center px-4">
              Let's celebrate your joy! Open the music box and watch the ballerina dance.
            </h2>
            <MusicBox />
          </div>
        );
      case 'pressured':
        return (
          <div className="w-full flex flex-col items-center animate-[fade-in_0.8s_ease-out] space-y-10 md:space-y-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-800 text-center max-w-lg px-4">
              Unclench your jaw. Drop your shoulders. Listen to the ballerina's lullaby.
            </h2>
            <MusicBox2 />
            <div className="w-full h-px bg-pink-200 max-w-lg mx-auto my-4 sm:my-8"></div>
            <h2 className="text-lg sm:text-xl font-medium text-pink-700 text-center max-w-lg px-4">
              Or tap out your stress on the keys below...
            </h2>
            <Piano />
          </div>
        );
      case 'anxiety':
        return (
          <div className="w-full flex flex-col items-center animate-[fade-in_0.8s_ease-out]">
             <SafeSpaceSwitcher />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans selection:bg-pink-200 transition-colors duration-1000 ease-in-out relative overflow-x-hidden flex flex-col">
      
      {/* Abstract Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-60 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-60 animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>

      {/* Global Navigation */}
      {emotion && (
        <button 
          onClick={() => setEmotion(null)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-1 sm:space-x-2 text-pink-600 hover:text-pink-800 transition bg-white/70 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm backdrop-blur-md z-50 border border-pink-100"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">Return</span>
        </button>
      )}

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 sm:p-6 w-full pb-20">
        
        {!emotion ? (
          // --- HOME: FLOATING BALLOONS & RANT SPACE ---
          <div className="text-center w-full max-w-4xl flex flex-col items-center animate-[fade-in_1s_ease-out]">
            
            {/* Balloons Area */}
            <div className="space-y-3 sm:space-y-4 pt-10 sm:pt-14">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 drop-shadow-sm px-2 leading-tight">
                How are you feeling today?
              </h1>
              <p className="text-lg sm:text-xl text-pink-500 font-medium tracking-wide">Select a feeling to enter your sanctuary.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 py-10 sm:py-12">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => setEmotion(emo)}
                  className={`
                    ${emo.float} ${emo.color} 
                    w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-48 rounded-full rounded-b-[40%]
                    shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),_0_10px_20px_rgba(244,143,177,0.4)]
                    hover:scale-110 transition-transform duration-300 cursor-pointer
                    flex items-center justify-center relative
                    group
                  `}
                >
                  <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 w-0.5 h-12 sm:h-14 bg-pink-300/80 transform -translate-x-1/2 group-hover:h-14 sm:group-hover:h-16 transition-all"></div>
                  <span className="text-white font-bold text-lg sm:text-xl drop-shadow-md z-10">{emo.label}</span>
                  <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-6 h-8 sm:w-8 sm:h-10 bg-white/30 rounded-full blur-[2px] sm:blur-[3px] transform rotate-45"></div>
                </button>
              ))}
            </div>

            {/* Rant Space Area */}
            <RantSpace />

          </div>
        ) : (
          // --- SELECTED DIMENSION ---
          <div className="w-full max-w-5xl flex flex-col items-center pt-16 sm:pt-20 pb-8 space-y-8 sm:space-y-12">
            <div className="text-center space-y-4 sm:space-y-6 animate-[fadeInDown_0.8s_ease-out] px-4">
              <span className={`inline-block px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-widest ${emotion.color} shadow-md`}>
                {emotion.label.replace(/[^a-zA-Z]/g, '')} Dimension
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-pink-700 max-w-3xl leading-relaxed italic">
                "{quote}"
              </h1>
            </div>

            <div className="w-full bg-transparent">
              {renderDimensionContent()}
            </div>
          </div>
        )}
      </main>

      {/* Global Inline Animations Setup */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flyAway {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(250px, -400px) scale(0.2) rotate(45deg); opacity: 0; }
        }
        @keyframes firework {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fireworkLines {
          0% { y2: 10; opacity: 1; }
          100% { y2: -30; opacity: 0; }
        }
      `}} />
    </div>
  );
}