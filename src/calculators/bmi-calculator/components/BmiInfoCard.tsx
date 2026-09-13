import React from 'react';
import { Info, AlertCircle, HeartPulse, CheckCircle2 } from 'lucide-react';

export const BmiInfoCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 shadow-sm transition-colors space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e7eb] dark:border-slate-800">
        <HeartPulse className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100">
          BMI 체질량지수 및 건강 관리 상식
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {/* 1. 대한비만학회(KSSO) 한국인 기준 */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#112220] dark:text-slate-100">
            <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>왜 한국인 기준(KSSO)은 다를까요?</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            서양인 기준(WHO)은 BMI 30 이상을 비만으로 보지만, 동양인은 동일한 BMI에서도 체지방률이 높고 내장지방이 많아 당뇨 및 심혈관 질환 위험이 더 빠르게 증가합니다. 따라서 대한비만학회는 <strong>BMI 25 이상</strong>을 1단계 비만으로 엄격히 관리합니다.
          </p>
        </div>

        {/* 2. BMI의 한계점과 체지방률 */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#112220] dark:text-slate-100">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>근육량이 많은 경우 주의하세요</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            BMI는 신장과 체중만으로 산출되므로 근육과 지방을 구분하지 못합니다. 웨이트 트레이닝으로 골격근량이 많은 사람은 체지방이 적어도 비만으로 판정될 수 있으므로, 인바디 등 체성분 분석을 함께 참고하는 것이 좋습니다.
          </p>
        </div>

        {/* 3. 복부비만 허리둘레 기준 */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#112220] dark:text-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>복부비만 허리둘레 기준치</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            한국 성인 기준 허리둘레가 <strong>남성 90cm(약 35.4인치) 이상, 여성 85cm(약 33.5인치) 이상</strong>인 경우 복부비만으로 진단됩니다. 복부 내장지방은 대사증후군과 직결되므로 BMI가 정상이더라도 허리둘레를 정기 점검하세요.
          </p>
        </div>

        {/* 4. 건강한 체중 조절 팁 */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#112220] dark:text-slate-100">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>지속 가능한 감량 속도</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            급격한 단식 다이어트는 근손실과 요요 현상을 유발합니다. 일주일에 0.5kg, 한 달에 1 ~ 2kg 내외로 서서히 체중을 줄여나가는 것이 장기적인 건강과 기초대사량 유지에 가장 이상적입니다.
          </p>
        </div>
      </div>
    </div>
  );
};
