import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { NEWS } from '../data/newsData';
import { useLang } from '../contexts/LanguageContext';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const [imgError, setImgError] = useState(false);

  const news = NEWS.find(n => n.slug === slug);

  useEffect(() => {
    if (!news) navigate('/');
    window.scrollTo(0, 0);
  }, [slug]);

  if (!news) return null;

  const title = lang === 'kn' 
    ? news.titleKannada : news.title;
  const summary = lang === 'kn' 
    ? news.summaryKannada : news.summary;
  const content = lang === 'kn' 
    ? news.contentKannada : news.content;
  const chartTitle = lang === 'kn' 
    ? news.chartTitleKannada : news.chartTitle;
  const tableHeaders = lang === 'kn' 
    ? news.tableHeadersKannada : news.tableHeaders;
  const date = lang === 'kn' 
    ? news.dateKannada : news.date;
  const tags = lang === 'kn' 
    ? news.tagsKannada : news.tags;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-teal-400 font-black text-sm uppercase tracking-widest hover:text-teal-300 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          KrishiManas Agriculture News
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider"
            style={{ backgroundColor: news.categoryColor }}
          >
            {lang === 'kn' 
              ? news.categoryKannada 
              : news.category
            }
          </span>
          <span className="text-slate-500 text-[11px] font-bold uppercase">
            {date}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter mb-6">
          {title}
        </h1>

        {/* Summary box */}
        <div className="p-5 bg-teal-500/5 border border-teal-500/20 rounded-2xl mb-8">
          <p className="text-slate-300 text-base font-medium leading-relaxed italic">
            {summary}
          </p>
        </div>

        {/* Hero Image */}
        <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
          {imgError ? (
            <div className="w-full h-full bg-gradient-to-br from-[#0D7377] to-[#1A1A2E] flex items-center justify-center">
              <span className="text-8xl">🌾</span>
            </div>
          ) : (
            <img
              src={news.image}
              alt={news.imageAlt}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-10">
          {content.split('\n\n').map((para, i) => (
            para.trim() && (
              <p key={i} className="text-slate-300 text-base leading-relaxed mb-4 font-medium">
                {para.trim()}
              </p>
            )
          ))}
        </div>

        {/* Chart Section */}
        {news.chartData && (
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 mb-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6">
              {chartTitle}
            </h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {news.chartType === 'area' ? (
                  <AreaChart data={news.chartData}>
                    <defs>
                      <linearGradient id="newsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D7377" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0D7377" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey={news.chartXKey} stroke="#ffffff20" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px' }} />
                    {news.chartBars.map(bar => (
                      <Area key={bar.key} type="monotone" dataKey={bar.key} name={bar.name} stroke={bar.color} strokeWidth={3} fillOpacity={1} fill="url(#newsGrad)" />
                    ))}
                  </AreaChart>
                ) : (
                  <BarChart data={news.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey={news.chartXKey} stroke="#ffffff20" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px' }} />
                    {news.chartBars.map(bar => (
                      <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color} radius={[4, 4, 0, 0]} barSize={28} />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        {news.tableRows && (
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                {lang === 'kn' ? 'ಪ್ರಮುಖ ಮಾಹಿತಿ' : 'Key Data'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    {tableHeaders.map((h, i) => (
                      <th key={i} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {news.tableRows.map((row, i) => (
                    <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-6 py-3 text-sm font-medium text-slate-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-[11px] font-black uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {/* Related News */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6">
            {lang === 'kn' ? 'ಇನ್ನಷ್ಟು ಸುದ್ದಿ' : 'More News'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {NEWS
              .filter(n => n.id !== news.id)
              .slice(0, 3)
              .map(related => (
                <div
                  key={related.id}
                  onClick={() => navigate(`/news/${related.slug}`)}
                  className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-teal-500/20 transition-all"
                >
                  <div className="h-28 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.imageAlt}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display='none'; }}
                    />
                  </div>
                  <div className="p-3">
                    <div
                      className="text-[9px] font-black uppercase tracking-wider mb-1"
                      style={{ color: related.categoryColor }}
                    >
                      {lang === 'kn' 
                        ? related.categoryKannada 
                        : related.category
                      }
                    </div>
                    <p className="text-white text-xs font-bold leading-snug line-clamp-2">
                      {lang === 'kn' 
                        ? related.titleKannada 
                        : related.title
                      }
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
