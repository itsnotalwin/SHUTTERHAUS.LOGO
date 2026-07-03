import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Palette, IconDef, LayoutDef, LogoConcept } from './types';

// --- DESIGN DATABASE ---

// 1. Color Palettes
const palettes: { dark: Palette; light: Palette } = {
  dark: { id: 'dark', bg: '#121110', fg: '#fcfaf7', cardBg: '#1a1817', cardBorder: '#242120', name: 'Dark Mode', desc: 'Cocoa & Alabaster' },
  light: { id: 'light', bg: '#faf6f0', fg: '#272421', cardBg: '#faf6f0', cardBorder: '#e6dac6', name: 'Light Mode', desc: 'Oatmeal & Espresso' }
};

// 2. Icon Paths & SVGs (Centered at 540,460)
const icons: IconDef[] = [
  {
    name: "Modern Aperture",
    render: (fg: string) => (
      <g className="draggable-group">
        <circle cx="540" cy="460" r="160" stroke={fg} strokeWidth="14" fill="none" />
        <g stroke={fg} strokeWidth="12" strokeLinecap="square">
          <line x1="500" y1="420" x2="680" y2="430" />
          <line x1="500" y1="420" x2="680" y2="430" transform="rotate(60 540 460)" />
          <line x1="500" y1="420" x2="680" y2="430" transform="rotate(120 540 460)" />
          <line x1="500" y1="420" x2="680" y2="430" transform="rotate(180 540 460)" />
          <line x1="500" y1="420" x2="680" y2="430" transform="rotate(240 540 460)" />
          <line x1="500" y1="420" x2="680" y2="430" transform="rotate(300 540 460)" />
        </g>
        <circle cx="540" cy="460" r="30" stroke={fg} strokeWidth="8" fill="none" />
      </g>
    )
  },
  {
    name: "Focus Viewfinder",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="16" fill="none" strokeLinejoin="miter">
        {/* Top Left */}
        <path d="M 400 320 L 340 320 L 340 380" />
        {/* Top Right */}
        <path d="M 680 320 L 740 320 L 740 380" />
        {/* Bottom Left */}
        <path d="M 400 600 L 340 600 L 340 540" />
        {/* Bottom Right */}
        <path d="M 680 600 L 740 600 L 740 540" />
        
        {/* Center Focus */}
        <circle cx="540" cy="460" r="80" strokeWidth="12" />
        <circle cx="540" cy="460" r="8" fill={fg} />
        <line x1="540" y1="360" x2="540" y2="400" strokeWidth="8" />
        <line x1="540" y1="520" x2="540" y2="560" strokeWidth="8" />
        <line x1="440" y1="460" x2="480" y2="460" strokeWidth="8" />
        <line x1="600" y1="460" x2="640" y2="460" strokeWidth="8" />
      </g>
    )
  },
  {
    name: "Minimalist Camera",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="14" fill="none" strokeLinejoin="round">
        {/* Camera Body */}
        <rect x="360" y="340" width="360" height="240" rx="20" />
        {/* Top Flashes/Dials */}
        <rect x="400" y="300" width="80" height="40" rx="8" />
        <line x1="640" y1="340" x2="640" y2="310" strokeWidth="16" strokeLinecap="round" />
        <line x1="680" y1="340" x2="680" y2="320" strokeWidth="12" strokeLinecap="round" />
        {/* Main Lens */}
        <circle cx="540" cy="460" r="70" />
        <circle cx="540" cy="460" r="30" strokeWidth="8" />
        {/* Flash/Sensor */}
        <circle cx="660" cy="390" r="12" fill={fg} />
      </g>
    )
  },
  {
    name: "Geometric Lenses",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="12" fill="none">
        <circle cx="480" cy="460" r="130" />
        <circle cx="600" cy="460" r="130" />
        {/* Intersection highlight */}
        <path d="M 540 344 L 540 576" strokeWidth="8" opacity="0.5" />
        <circle cx="540" cy="460" r="8" fill={fg} stroke="none" />
      </g>
    )
  },
  {
    name: "Abstract Iris",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="8" fill="none">
        <ellipse cx="540" cy="460" rx="180" ry="80" transform="rotate(0 540 460)" />
        <ellipse cx="540" cy="460" rx="180" ry="80" transform="rotate(60 540 460)" />
        <ellipse cx="540" cy="460" rx="180" ry="80" transform="rotate(120 540 460)" />
        <circle cx="540" cy="460" r="40" fill={fg} />
      </g>
    )
  },
  {
    name: "Prism Triangle",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="12" fill="none" strokeLinejoin="round">
        <polygon points="540,260 340,600 740,600" />
        <polygon points="540,320 400,560 680,560" />
        <line x1="540" y1="260" x2="540" y2="320" />
        <line x1="340" y1="600" x2="400" y2="560" />
        <line x1="740" y1="600" x2="680" y2="560" />
        <circle cx="540" cy="460" r="16" fill={fg} stroke="none" />
      </g>
    )
  },
  {
    name: "Minimalist Hexagon",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="14" fill="none" strokeLinejoin="miter">
        <polygon points="540,280 695.88,370 695.88,550 540,640 384.12,550 384.12,370" />
        <circle cx="540" cy="460" r="60" />
        <line x1="540" y1="280" x2="540" y2="400" />
        <line x1="695.88" y1="370" x2="592" y2="430" />
        <line x1="695.88" y1="550" x2="592" y2="490" />
        <line x1="540" y1="640" x2="540" y2="520" />
        <line x1="384.12" y1="550" x2="488" y2="490" />
        <line x1="384.12" y1="370" x2="488" y2="430" />
      </g>
    )
  },
  {
    name: "Cinematic Ratio",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="12" fill="none">
        <rect x="300" y="340" width="480" height="240" />
        <line x1="300" y1="460" x2="780" y2="460" strokeDasharray="20 20" />
        <circle cx="540" cy="460" r="50" />
        <rect x="320" y="360" width="20" height="20" fill={fg} stroke="none" />
        <rect x="740" y="540" width="20" height="20" fill={fg} stroke="none" />
      </g>
    )
  },
  {
    name: "Golden Spiral",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="8" fill="none">
        <circle cx="540" cy="460" r="160" />
        <circle cx="540" cy="420" r="120" />
        <circle cx="540" cy="390" r="90" />
        <circle cx="540" cy="370" r="70" />
        <circle cx="540" cy="355" r="55" />
        <circle cx="540" cy="345" r="45" />
        <circle cx="540" cy="338" r="38" fill={fg} stroke="none" />
      </g>
    )
  },
  {
    name: "Shutter Star",
    render: (fg: string) => (
      <g className="draggable-group" stroke={fg} strokeWidth="10" fill="none" strokeLinecap="round">
        <circle cx="540" cy="460" r="140" />
        <path d="M540 320 L570 430 L680 460 L570 490 L540 600 L510 490 L400 460 L510 430 Z" />
        <circle cx="540" cy="460" r="10" fill={fg} stroke="none" />
      </g>
    )
  }
];

// 3. Typography Layouts
const layouts: LayoutDef[] = [
  {
    name: "Standard Hierarchy",
    render: (fontStyle: string, fg: string) => (
      <>
        <g className="draggable-group">
          <text x="546" y="800" textAnchor="middle" fontFamily={fontStyle === 'Cinzel' ? 'Georgia, serif' : 'Helvetica Neue, Helvetica, Arial, sans-serif'} fontSize="82" fontWeight="600" fill={fg} letterSpacing="14">SHUTTERHAUS</text>
        </g>
        <g className="draggable-group">
          <text x="557" y="880" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="28" fontWeight="300" fill={fg} letterSpacing="34">VISUALS</text>
        </g>
        <g className="draggable-group">
          <text x="546" y="980" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="16" fontWeight="300" fill={fg} letterSpacing="8" opacity="0.5">@ITSNOTALWIN</text>
        </g>
      </>
    )
  },
  {
    name: "Bold Impact",
    render: (fontStyle: string, fg: string) => (
      <>
        <g className="draggable-group">
          <text x="546" y="830" textAnchor="middle" fontFamily={fontStyle === 'Cinzel' ? 'Georgia, serif' : 'Helvetica Neue, Helvetica, Arial, sans-serif'} fontSize="96" fontWeight="700" fill={fg} letterSpacing="18">SHUTTERHAUS</text>
        </g>
        <g className="draggable-group">
          <line x1="380" y1="890" x2="700" y2="890" stroke={fg} strokeWidth="2" opacity="0.3" />
        </g>
        <g className="draggable-group">
          <text x="552" y="960" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="22" fontWeight="400" fill={fg} letterSpacing="24">VISUALS</text>
        </g>
      </>
    )
  },
  {
    name: "Minimalist Border",
    render: (fontStyle: string, fg: string) => (
      <>
        <g className="draggable-group">
          <text x="546" y="780" textAnchor="middle" fontFamily={fontStyle === 'Cinzel' ? 'Georgia, serif' : 'Helvetica Neue, Helvetica, Arial, sans-serif'} fontSize="70" fontWeight="500" fill={fg} letterSpacing="20">SHUTTERHAUS</text>
        </g>
        <g className="draggable-group">
          <text x="554" y="840" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="20" fontWeight="300" fill={fg} letterSpacing="20">VISUALS</text>
        </g>
        <g className="draggable-group">
          {/* Border box framing the text */}
          <rect x="240" y="700" width="600" height="180" fill="none" stroke={fg} strokeWidth="2" opacity="0.2" />
        </g>
      </>
    )
  }
];

const fontOptions: ('Cinzel' | 'Montserrat')[] = ['Cinzel', 'Montserrat'];

const pickRandom = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Subcomponent for each logo card
interface LogoCardProps {
  concept: LogoConcept;
  index: number;
  icon: IconDef;
  layout: LayoutDef;
  isFavorited: boolean;
  onFavoriteToggle: (concept: LogoConcept) => void;
  onTransparentToggle: (id: string, transparent: boolean) => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ concept, index, icon, layout, isFavorited, onFavoriteToggle, onTransparentToggle }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let selectedElement: SVGElement | null = null;
    let offset = { x: 0, y: 0 };

    function getMousePosition(evt: any) {
      const CTM = svg.getScreenCTM();
      if (!CTM) return { x: 0, y: 0 };
      
      let clientX = evt.clientX;
      let clientY = evt.clientY;
      if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      }
      return {
        x: (clientX - CTM.e) / CTM.a,
        y: (clientY - CTM.f) / CTM.d
      };
    }

    function startDrag(evt: any) {
      const target = evt.target.closest('.draggable-group');
      if (!target) return;
      
      if (evt.type !== 'touchstart') {
        evt.preventDefault();
      }
      
      selectedElement = target;

      if (!selectedElement.hasAttribute('data-x')) {
        selectedElement.setAttribute('data-x', '0');
        selectedElement.setAttribute('data-y', '0');
      }

      const coords = getMousePosition(evt);
      offset.x = coords.x - parseFloat(selectedElement.getAttribute('data-x') || '0');
      offset.y = coords.y - parseFloat(selectedElement.getAttribute('data-y') || '0');
    }

    function drag(evt: any) {
      if (!selectedElement) return;
      evt.preventDefault();
      
      const coords = getMousePosition(evt);
      const newX = coords.x - offset.x;
      const newY = coords.y - offset.y;

      selectedElement.setAttribute('data-x', String(newX));
      selectedElement.setAttribute('data-y', String(newY));
      selectedElement.setAttribute('transform', `translate(${newX}, ${newY})`);
    }

    function endDrag() {
      selectedElement = null;
    }

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    svg.addEventListener('touchstart', startDrag, { passive: false });
    svg.addEventListener('touchmove', drag, { passive: false });
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchcancel', endDrag);

    return () => {
      svg.removeEventListener('mousedown', startDrag);
      svg.removeEventListener('mousemove', drag);
      svg.removeEventListener('mouseup', endDrag);
      svg.removeEventListener('mouseleave', endDrag);

      svg.removeEventListener('touchstart', startDrag);
      svg.removeEventListener('touchmove', drag);
      svg.removeEventListener('touchend', endDrag);
      svg.removeEventListener('touchcancel', endDrag);
    };
  }, []);

  const handleDownloadSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const bgRect = svgElement.querySelector('.svg-bg') as SVGElement | null;
    if (concept.transparent && bgRect) bgRect.style.display = 'none';

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    
    if (concept.transparent && bgRect) bgRect.style.display = ''; // Restore UI

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    triggerDownload(url, `Shutterhaus_Vector_${index + 1}.svg`);
  };

  const handleDownloadPNG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const bgRect = svgElement.querySelector('.svg-bg') as SVGElement | null;
    if (concept.transparent && bgRect) bgRect.style.display = 'none';
    
    // Temporarily scale SVG for high-quality rasterization (4K)
    const originalWidth = svgElement.getAttribute('width');
    const originalHeight = svgElement.getAttribute('height');
    svgElement.setAttribute('width', '4320');
    svgElement.setAttribute('height', '4320');

    const canvas = document.createElement("canvas");
    canvas.width = 4320;
    canvas.height = 4320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    // Restore original dimensions and UI
    if (originalWidth) svgElement.setAttribute('width', originalWidth);
    if (originalHeight) svgElement.setAttribute('height', originalHeight);
    if (concept.transparent && bgRect) bgRect.style.display = '';
    
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png", 1.0);
      triggerDownload(pngUrl, `Shutterhaus_4K_Image_${index + 1}.png`);
    };
    
    img.src = url;
  };

  const triggerDownload = (url: string, fileName: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const theme = concept.palette;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="generated-card flex flex-col p-5 rounded-lg border transition-all duration-300" 
      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
    >
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h3 className="text-[11px] font-bold tracking-widest uppercase font-sans text-neutral-200" style={{ color: theme.fg }}>
            {icon.name}
          </h3>
          <p className="text-[9px] tracking-wider uppercase mt-1 opacity-50 font-sans" style={{ color: theme.fg }}>
            {theme.name} • {concept.fontMain}
          </p>
        </div>
        
        {/* Heart Favorite Button */}
        <button 
          onClick={() => onFavoriteToggle(concept)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer focus:outline-none flex-shrink-0"
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart 
            className="w-4 h-4 transition-transform duration-200 hover:scale-110"
            style={{ 
              color: isFavorited ? '#f43f5e' : theme.fg,
              fill: isFavorited ? '#f43f5e' : 'none',
              opacity: isFavorited ? 1 : 0.6
            }}
          />
        </button>
      </div>
      
      <div className="svg-wrapper border mb-4 shadow-xl flex items-center justify-center" style={{ backgroundColor: theme.bg, borderColor: theme.cardBorder }}>
        <svg 
          ref={svgRef} 
          id={concept.id} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1080 1080" 
          width="1080" 
          height="1080"
          className="w-full h-full block"
        >
          {/* Background Base (Ensures correct export) */}
          <rect className="svg-bg" width="1080" height="1080" fill={theme.bg} />
          
          {/* Geometric Icon */}
          {icon.render(theme.fg)}
          
          {/* Typography Layout */}
          {layout.render(concept.fontMain, theme.fg)}
        </svg>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {/* Transparent Export Toggle */}
        <label 
          className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest cursor-pointer mb-2 transition-opacity hover:opacity-100 font-sans" 
          style={{ color: theme.fg, opacity: 0.7 }}
        >
          <input 
            type="checkbox" 
            checked={concept.transparent}
            onChange={(e) => onTransparentToggle(concept.id, e.target.checked)}
            className="cursor-pointer w-3 h-3 rounded border-gray-300 accent-[#e6dac6] focus:ring-0" 
          />
          Transparent Background
        </label>

        <button 
          onClick={() => { handleDownloadSVG(); handleDownloadPNG(); }} 
          className="btn-action w-full py-2.5 text-[10px] font-bold tracking-widest uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer font-sans"
          style={{ backgroundColor: theme.fg, color: theme.bg }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Deploy Logo
        </button>

        <div className="flex gap-2">
          <button 
            onClick={handleDownloadSVG} 
            className="btn-action w-full py-2 text-[8px] font-bold tracking-widest uppercase rounded border flex items-center justify-center gap-1.5 cursor-pointer font-sans transition-colors"
            style={{ borderColor: theme.fg, color: theme.fg, backgroundColor: 'transparent' }}
          >
            Export SVG
          </button>

          <button 
            onClick={handleDownloadPNG} 
            className="btn-action w-full py-2 text-[8px] font-bold tracking-widest uppercase rounded border flex items-center justify-center gap-1.5 cursor-pointer font-sans transition-colors"
            style={{ borderColor: theme.fg, color: theme.fg, backgroundColor: 'transparent' }}
          >
            Export 4K PNG
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [concepts, setConcepts] = useState<LogoConcept[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'favorites'>('discover');

  // Load favorites from local storage on mount
  const [favorites, setFavorites] = useState<LogoConcept[]>(() => {
    try {
      const saved = localStorage.getItem('shutterhaus_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shutterhaus_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  // Generator of 12 designs (6 unique concepts, each in Dark and Light mode)
  const generateLogos = () => {
    const list: LogoConcept[] = [];
    const runId = Math.floor(Math.random() * 1000000);
    for (let i = 0; i < 6; i++) {
      const rIconIndex = Math.floor(Math.random() * icons.length);
      const rLayoutIndex = Math.floor(Math.random() * layouts.length);
      const rFont = pickRandom(fontOptions);
      
      // Dark Version
      list.push({
        id: `generated-svg-dark-${i}-${runId}`,
        palette: palettes.dark,
        iconIndex: rIconIndex,
        layoutIndex: rLayoutIndex,
        fontMain: rFont,
        transparent: false
      });
      
      // Light Version
      list.push({
        id: `generated-svg-light-${i}-${runId}`,
        palette: palettes.light,
        iconIndex: rIconIndex,
        layoutIndex: rLayoutIndex,
        fontMain: rFont,
        transparent: false
      });
    }
    setConcepts(list);
  };

  // Run on mount
  useEffect(() => {
    generateLogos();
  }, []);

  const handleFavoriteToggle = (concept: LogoConcept) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === concept.id);
      if (exists) {
        return prev.filter(f => f.id !== concept.id);
      } else {
        return [...prev, concept];
      }
    });
  };

  const handleTransparentToggle = (id: string, transparent: boolean) => {
    setConcepts(prev => prev.map(c => c.id === id ? { ...c, transparent } : c));
    setFavorites(prev => prev.map(c => c.id === id ? { ...c, transparent } : c));
  };

  const handleGenerateClick = () => {
    if (activeTab !== 'discover') {
      setActiveTab('discover');
    }
    generateLogos();
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center selection:bg-[#e6dac6] selection:text-[#121110] bg-[#0a0a0a] text-[#fcfaf7]">
      <header className="text-center max-w-2xl mb-8 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold font-cinzel mb-2 uppercase tracking-[0.4em] text-[#fcfaf7]"
        >
          SHUTTERHAUS
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[10px] text-[#e6dac6] tracking-[0.5em] font-light uppercase border-b border-[#e6dac6]/30 pb-3 inline-block font-sans"
        >
          Aesthetic Brand Generator
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-xs font-sans text-gray-400 leading-relaxed max-w-lg font-light"
        >
          Bespoke Oatmeal & Cocoa logo concepts based on mathematically centered geometric optics.
        </motion.p>

        {/* Interactive Hint */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 px-3 py-1.5 bg-[#e6dac6]/10 border border-[#e6dac6]/20 text-[#e6dac6] rounded text-[9px] tracking-[0.2em] uppercase flex items-center gap-2 font-sans"
        >
          <svg className="w-3 h-3 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Interactive Canvas: Position-perfect vector outputs
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateClick} 
          className="btn-action mt-6 px-6 py-3 bg-[#e6dac6] text-[#121110] font-sans font-bold tracking-widest uppercase text-[10px] rounded shadow-lg cursor-pointer"
        >
          Generate New Concepts
        </motion.button>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-8 mb-8 border-b border-[#e6dac6]/15 w-full max-w-6xl justify-center font-sans">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`pb-3 text-[10px] tracking-[0.3em] uppercase transition-all relative font-bold cursor-pointer ${activeTab === 'discover' ? 'text-[#e6dac6]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Discover
          {activeTab === 'discover' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#e6dac6]" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 text-[10px] tracking-[0.3em] uppercase transition-all relative font-bold cursor-pointer flex items-center gap-1.5 ${activeTab === 'favorites' ? 'text-[#e6dac6]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Favorites
          {favorites.length > 0 && (
            <span className="px-1.5 py-0.5 bg-[#e6dac6] text-[#121110] text-[8px] font-bold rounded-full leading-none">
              {favorites.length}
            </span>
          )}
          {activeTab === 'favorites' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#e6dac6]" />
          )}
        </button>
      </div>

      {/* Grid container where generated/favorited logos are loaded */}
      {activeTab === 'discover' ? (
        <main id="logo-grid" className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 flex-1">
          {concepts.map((concept, index) => (
            <LogoCard 
              key={concept.id}
              concept={concept}
              index={index}
              icon={icons[concept.iconIndex]}
              layout={layouts[concept.layoutIndex]}
              isFavorited={favorites.some(f => f.id === concept.id)}
              onFavoriteToggle={handleFavoriteToggle}
              onTransparentToggle={handleTransparentToggle}
            />
          ))}
        </main>
      ) : (
        <div className="w-full max-w-6xl flex-1 pb-12 flex flex-col">
          {favorites.length > 0 ? (
            <main id="logo-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((concept, index) => (
                <LogoCard 
                  key={concept.id}
                  concept={concept}
                  index={index}
                  icon={icons[concept.iconIndex]}
                  layout={layouts[concept.layoutIndex]}
                  isFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                  onTransparentToggle={handleTransparentToggle}
                />
              ))}
            </main>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-[#e6dac6]/20 rounded-xl max-w-xl mx-auto my-8 bg-[#1a1817]/30"
            >
              <Heart className="w-8 h-8 text-[#e6dac6]/40 mb-4 stroke-[1.5]" />
              <h3 className="text-sm font-bold tracking-widest text-[#e6dac6] uppercase mb-2 font-sans">
                No Saved Concepts
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed font-light">
                Explore the Discover tab and click the heart icon on any design concept to save your bespoke favorites here.
              </p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="mt-6 px-4 py-2 bg-[#e6dac6]/10 hover:bg-[#e6dac6]/20 border border-[#e6dac6]/30 text-[#e6dac6] rounded text-[9px] tracking-[0.2em] uppercase cursor-pointer font-sans"
              >
                Start Exploring
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Editorial Aesthetic Footer */}
      <footer className="w-full text-center py-4 border-t border-[#e6dac6]/10 mt-auto">
        <p className="text-[8px] font-sans uppercase tracking-[0.4em] text-gray-500">
          Vector Engine v2.4 • Curated for Visual Excellence
        </p>
      </footer>
    </div>
  );
}
