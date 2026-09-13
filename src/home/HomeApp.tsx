import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CALCULATORS_LIST,
  CalculatorItem,
  CATEGORY_NAMES,
} from '../types/navigation';
import {
  TrendingUp,
  Ruler,
  ArrowLeftRight,
  Landmark,
  Calendar,
  Target,
  Calculator,
  Wallet,
  Search,
  X,
  ArrowRight,
  Zap,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { siteConfig } from '../config/site';

export const HomeApp: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 아이콘 렌더링 헬퍼
  const renderIcon = (id: string) => {
    const iconCls = 'w-5 h-5 transition-transform duration-200 group-hover:scale-110';
    switch (id) {
      case 'compound':
        return <TrendingUp className={`${iconCls} text-emerald-500 dark:text-[#d1ff19]`} />;
      case 'loan':
        return <Landmark className={`${iconCls} text-sky-500 dark:text-sky-400`} />;
      case 'salary':
        return <Wallet className={`${iconCls} text-indigo-500 dark:text-indigo-400`} />;
      case 'unit':
        return <Ruler className={`${iconCls} text-amber-500 dark:text-amber-400`} />;
      case 'exchange':
        return <ArrowLeftRight className={`${iconCls} text-teal-500 dark:text-teal-400`} />;
      case 'dividend':
        return <Calendar className={`${iconCls} text-slate-400`} />;
      case 'goal':
        return <Target className={`${iconCls} text-slate-400`} />;
      default:
        return <Calculator className={`${iconCls} text-slate-400`} />;
    }
  };

  // 실시간 검색 및 카테고리 필터링
  const filteredCalculators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/\s+/g, '');

    return CALCULATORS_LIST.filter((calc) => {
      // 1. 카테고리 필터
      if (selectedCategory !== 'all' && calc.category !== selectedCategory) {
        return false;
      }

      // 2. 검색어 필터
      if (!query) return true;

      const nameMatch = calc.name.toLowerCase().replace(/\s+/g, '').includes(query);
      const shortNameMatch = calc.shortName.toLowerCase().replace(/\s+/g, '').includes(query);
      const descMatch = calc.description.toLowerCase().replace(/\s+/g, '').includes(query);
      const keywordMatch = calc.keywords?.some((k) =>
        k.toLowerCase().replace(/\s+/g, '').includes(query)
      );

      return nameMatch || shortNameMatch || descMatch || keywordMatch;
    });
  }, [searchQuery, selectedCategory]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'finance', label: CATEGORY_NAMES.finance },
    { key: 'lifestyle', label: CATEGORY_NAMES.lifestyle },
    { key: 'global', label: CATEGORY_NAMES.global },
  ];

  return (
    <div className="w-full pb-16 space-y-8 sm:space-y-12">
      {/* 1. 히어로 브랜드 헤더 섹션 */}
      <section className="text-center pt-2 sm:pt-6 max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#112220] dark:text-slate-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19]" />
          <span>{siteConfig.name}</span>
          <span className="text-slate-400 dark:text-slate-500">·</span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            v{siteConfig.version}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#112220] dark:text-slate-100 leading-tight">
          일상과 금융을 위한 <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#112220] via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
            스마트 계산기
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto px-2">
          복잡한 수식을 한눈에 파악하세요. 광고 없이 쾌적하게, 설치 시 100% 오프라인에서도 작동하는 모바일 퍼스트 계산기 허브입니다.
        </p>

        {/* 통합 검색창 */}
        <div className="relative max-w-lg mx-auto pt-2 px-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="계산기 이름이나 키워드 검색 (예: 대출, 연봉, 평수, 환율, 복리)"
              className="pl-10 pr-9 py-2 sm:py-2.5 h-11 text-sm bg-white dark:bg-[#15171a] border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus-visible:ring-1 focus-visible:ring-[#112220] dark:focus-visible:ring-[#d1ff19] transition-all"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* 카테고리 퀵 필터 칩 */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <Button
                key={cat.key}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.key)}
                className={`h-8 px-3 text-xs rounded-full font-medium transition-all ${
                  isSelected
                    ? 'bg-[#15171a] dark:bg-[#d1ff19] text-white dark:text-[#112220] hover:bg-[#1e2329] dark:hover:bg-[#c2ed17] shadow-sm'
                    : 'bg-white dark:bg-[#15171a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </Button>
            );
          })}
        </div>
      </section>

      {/* 2. 계산기 카드 그리드 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight">
              {selectedCategory === 'all'
                ? '전체 계산기'
                : categories.find((c) => c.key === selectedCategory)?.label}
            </h2>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
              ({filteredCalculators.length})
            </span>
          </div>
        </div>

        {filteredCalculators.length === 0 ? (
          /* 검색 결과 없음 빈 상태 UI */
          <div className="w-full py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              검색 결과가 없습니다
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              '{searchQuery}'에 일치하는 계산기를 찾지 못했습니다.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs"
            >
              전체 목록 보기
            </Button>
          </div>
        ) : (
          /* 반응형 카드 그리드: 모바일 1열, 태블릿 2열, 데스크톱 3열 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredCalculators.map((item: CalculatorItem) => {
              const isComingSoon = item.status === 'coming-soon';

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/${item.id}`)}
                  className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                    isComingSoon
                      ? 'bg-slate-50/70 dark:bg-[#13171f]/50 border-slate-200/80 dark:border-slate-800/60 opacity-80 hover:opacity-100'
                      : 'bg-white dark:bg-[#15171a] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-[#d1ff19]/60 hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(209,255,25,0.06)]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* 상단: 아이콘 + 카테고리 뱃지 */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {renderIcon(item.id)}
                      </div>

                      {isComingSoon ? (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                        >
                          출시 예정
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {CATEGORY_NAMES[item.category]}
                        </Badge>
                      )}
                    </div>

                    {/* 중단: 타이틀 및 설명 */}
                    <div>
                      <h3 className="text-base sm:text-[17px] font-bold text-[#112220] dark:text-slate-100 tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* 키워드 해시태그 칩 */}
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.keywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 px-1.5 py-0.5 rounded"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 하단: 액션 링크 버튼 */}
                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span
                      className={
                        isComingSoon
                          ? 'text-slate-400 dark:text-slate-500'
                          : 'text-[#112220] dark:text-[#d1ff19] group-hover:underline flex items-center gap-1'
                      }
                    >
                      {isComingSoon ? '기획 안내 보기' : '계산기 시작하기'}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 ${
                        isComingSoon
                          ? 'text-slate-400'
                          : 'text-[#112220] dark:text-[#d1ff19]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. 플랫폼 특장점 배너 (3단 가치 제안) */}
      <section className="pt-4 sm:pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#12161f] border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#d1ff19] flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200">
                100% 오프라인 동작
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                PWA 지원으로 비행기나 지하철 등 인터넷이 없는 환경에서도 모든 계산기가 즉시 실행됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200">
                광고 없는 미니멀 환경
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                방해되는 배너 광고나 팝업 없이, 필요한 수식과 숫자에만 온전히 집중할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200">
                모바일 퍼스트 UX
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                스마트폰 한 손 조작에 최적화된 터치 키패드와 실시간 시뮬레이션 인터랙션을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeApp;
