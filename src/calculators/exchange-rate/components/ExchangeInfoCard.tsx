import React from 'react';
import { Info } from 'lucide-react';

export const ExchangeInfoCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-[#e5e7eb] text-xs text-[#64748b] shadow-2xs">
      <div className="space-y-1.5 leading-relaxed">
        <p className="font-bold text-[#112220] text-xs pb-1.5 border-b border-[#e5e7eb] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#112220] shrink-0" />
          <span>환전 상식 및 유의사항 안내</span>
        </p>
        <p>
          • <strong>환전 우대율(스프레드 할인)</strong>: 은행이 매매기준율에 붙이는 환전 수수료를 깎아주는 비율입니다. 90% 우대 시 수수료의 10%만 부담하게 됩니다.
        </p>
        <p>
          • <strong>모바일 환전 vs 공항 환전</strong>: 시중은행 모바일 앱에서 사전 신청 후 수령하면 최대 90% 우대를 받을 수 있으나, 공항 영업점 현장 환전은 우대율이 거의 없거나 매우 낮습니다.
        </p>
        <p>
          • <strong>해외여행 면세 한도</strong>: 대한민국 입국 시 기본 여행자 휴대품 면세 한도는 1인당 <strong>미화 800달러</strong>입니다. (술 2병/400달러 이하, 담배 200개비, 향수 100mL는 별도 면세)
        </p>
        <p>
          • <strong>해외 직구 면세 한도</strong>: 미국 발 물품(목록통관)은 <strong>미화 200달러</strong> 이하, 그 외 국가는 150달러 이하일 때 관세 및 부가세가 면제됩니다.
        </p>
        <p className="pt-1.5 border-t border-[#e5e7eb] text-[#94a3b8] text-[11px] leading-normal">
          ※ <strong>환율 데이터 안내 및 법적 고지</strong>: 본 계산기의 환율 정보는 글로벌 금융 시장 및 공시 매매기준율(Open Exchange Rates API)을 바탕으로 실시간 자동 동기화되는 참고용 데이터입니다. 실제 은행별 환전 시점, 거래 지점, 우대 쿠폰 및 실시간 시장 변동성에 따라 실제 체결 금액과 차이가 발생할 수 있으므로, 최종 거래 시에는 해당 금융기관의 고시 환율을 반드시 확인하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};
