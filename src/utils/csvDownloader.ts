/**
 * UTF-8 BOM을 포함한 CSV 파일 다운로드 유틸리티
 * Excel에서 한글 깨짐을 방지하기 위해 \uFEFF(BOM)을 추가합니다.
 *
 * @param filename 저장할 파일명 (확장자 .csv 포함 또는 자동 부착)
 * @param headers CSV 헤더 배열
 * @param rows 2차원 데이터 배열
 */
export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void {
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
