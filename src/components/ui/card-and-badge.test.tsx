import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Badge } from './badge';

describe('Seam 1-2: shadcn Card and Badge Components', () => {
  it('Card의 Title과 Content가 정상적으로 렌더링되어야 한다', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>카드 제목</CardTitle>
          <CardDescription>카드 설명</CardDescription>
        </CardHeader>
        <CardContent>카드 본문 내용</CardContent>
      </Card>
    );

    expect(screen.getByText('카드 제목')).toBeInTheDocument();
    expect(screen.getByText('카드 설명')).toBeInTheDocument();
    expect(screen.getByText('카드 본문 내용')).toBeInTheDocument();
  });

  it('Badge가 기본 및 variant 스타일을 반영하여 렌더링되어야 한다', () => {
    render(
      <div>
        <Badge>기본 뱃지</Badge>
        <Badge variant="secondary">보조 뱃지</Badge>
        <Badge variant="outline">아웃라인 뱃지</Badge>
      </div>
    );

    expect(screen.getByText('기본 뱃지')).toBeInTheDocument();
    expect(screen.getByText('보조 뱃지')).toBeInTheDocument();
    expect(screen.getByText('아웃라인 뱃지')).toBeInTheDocument();
  });
});
