import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NEWS } from '../../data/newsData';

export default function NewsCarousel({ lang = 'en' }) {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const intervalRef = useRef(null);

  const VISIBLE = 4;

  const next = () => {
    setStartIndex(prev => (prev + 1) % NEWS.length);
  };

  const prev = () => {
    setStartIndex(prev => 
      prev === 0 ? NEWS.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 2000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const getVisibleNews = () => {
    const items = [];
    for (let i = 0; i < VISIBLE; i++) {
      items.push(NEWS[(startIndex + i) % NEWS.length]);
    }
    return items;
  };

  const handleImgError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getVisibleNews().map((news) => (
          <div
            key={news.id + startIndex}
            onClick={() => navigate(`/news/${news.slug}`)}
            className="
              bg-[#0f172a] border border-white/5 
              rounded-2xl overflow-hidden cursor-pointer
              hover:-translate-y-1 hover:border-teal-500/30
              hover:shadow-xl hover:shadow-teal-500/10
              transition-all duration-300
              flex flex-col
            "
          >
            {/* Image */}
            <div className="h-44 overflow-hidden relative flex-shrink-0">
              {imgErrors[news.id] ? (
                <div className="w-full h-full bg-gradient-to-br from-[#0D7377] to-[#1A1A2E] flex items-center justify-center">
                  <span className="text-5xl">🌾</span>
                </div>
              ) : (
                <img
                  src={news.image}
                  alt={news.imageAlt}
                  loading="lazy"
                  onError={() => handleImgError(news.id)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
              {/* Category badge */}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider"
                style={{ backgroundColor: news.categoryColor }}
              >
                {lang === 'kn' 
                  ? news.categoryKannada 
                  : news.category
                }
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Date */}
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {lang === 'kn' 
                  ? news.dateKannada 
                  : news.date
                }
              </div>

              {/* Title */}
              <h3 className="
                font-black text-white text-sm 
                leading-snug mb-2
                line-clamp-2
              ">
                {lang === 'kn' 
                  ? news.titleKannada 
                  : news.title
                }
              </h3>

              {/* Summary */}
              <p className="
                text-[11px] text-slate-400 
                leading-relaxed flex-1
                line-clamp-3
              ">
                {lang === 'kn' 
                  ? news.summaryKannada 
                  : news.summary
                }
              </p>

              {/* Read more */}
              <div className="
                mt-3 text-[11px] font-black 
                text-teal-400 uppercase tracking-wider
              ">
                {lang === 'kn' 
                  ? 'ಇನ್ನಷ್ಟು ಓದಿ →' 
                  : 'Read more →'
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="
          absolute -left-4 top-1/2 -translate-y-1/2
          w-8 h-8 rounded-full bg-[#0f172a] 
          border border-white/10
          flex items-center justify-center
          text-white hover:bg-teal-500/20 
          hover:border-teal-500/30
          transition-all z-10
        "
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="
          absolute -right-4 top-1/2 -translate-y-1/2
          w-8 h-8 rounded-full bg-[#0f172a] 
          border border-white/10
          flex items-center justify-center
          text-white hover:bg-teal-500/20 
          hover:border-teal-500/30
          transition-all z-10
        "
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {NEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i)}
            className={`
              w-1.5 h-1.5 rounded-full transition-all
              ${i === startIndex 
                ? 'bg-teal-500 w-4' 
                : 'bg-white/20'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
