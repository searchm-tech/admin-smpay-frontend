// NO_ASC 정렬 시 배열을 reverse하는 유틸 함수
export function applyNoAscOrder<T>(arr: T[], orderType: string): T[] {
  if (orderType === "NO_ASC") {
    return [...arr].reverse();
  }
  return arr;
}
