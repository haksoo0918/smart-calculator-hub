import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from '../ui/toast';
import { RefreshCw } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const { toast } = useToast();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast({
        variant: 'lime',
        title: '새로운 버전이 준비되었습니다',
        description: '최신 계산 기능과 성능 최적화가 적용되었습니다.',
        action: (
          <ToastAction
            altText="지금 업데이트"
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(false);
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>지금 업데이트</span>
          </ToastAction>
        ),
      });
    }
  }, [needRefresh, toast, updateServiceWorker, setNeedRefresh]);

  return null;
};
