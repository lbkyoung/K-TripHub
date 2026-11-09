import { RefundCalculation } from './types';

/**
 * 취소/환불 핵심 정책 로직
 * - 취소 요청 시점과 '여행 시작일 00시' 사이의 남은 일수 계산
 * - 남은 일수가 3일 이상(>= 3일): 결제 금액의 100% 자동 결제 취소
 * - 남은 일수가 2일 ~ 1일: 결제 금액의 50%만 부분 취소 환불
 * - 남은 일수가 0일(당일) 또는 이미 지난 경우: 환불 불가 (0%)
 */
export function calculateRefund(
  travelDateStr: string,
  paidAmountKrw: number,
  requestDate: Date = new Date()
): RefundCalculation {
  // 1. 여행 시작일 당일 00시 00분 00초 기준
  const [year, month, day] = travelDateStr.split('-').map(Number);
  const travelMidnight = new Date(year, month - 1, day, 0, 0, 0, 0);

  // 2. 요청 시점의 오늘 00시 00분 00초 기준 (달력 일수 차이 계산)
  const todayMidnight = new Date(
    requestDate.getFullYear(),
    requestDate.getMonth(),
    requestDate.getDate(),
    0,
    0,
    0,
    0
  );

  // 3. 남은 일수(D-Day) 계산
  const diffMs = travelMidnight.getTime() - todayMidnight.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // 4. 구간별 환불 정책 적용
  if (daysLeft >= 3) {
    // 3일 전 이상: 100% 전액 환불
    return {
      daysLeft,
      refundRate: 1.0,
      refundAmount: paidAmountKrw,
      penaltyAmount: 0,
      status: 'FULL_REFUND',
      message: `여행 시작 ${daysLeft}일 전 취소 요청으로, 규정에 따라 결제 금액 100% 전액 환불 대상입니다.`,
      isCancelable: true,
    };
  } else if (daysLeft >= 1 && daysLeft <= 2) {
    // 2일 ~ 1일 전: 50% 부분 환불
    const refundAmount = Math.floor(paidAmountKrw * 0.5);
    const penaltyAmount = paidAmountKrw - refundAmount;
    return {
      daysLeft,
      refundRate: 0.5,
      refundAmount,
      penaltyAmount,
      status: 'PARTIAL_REFUND',
      message: `여행 시작 ${daysLeft}일 전 취소 요청으로, 여행사 사전 준비비용 50% 공제 후 50% 부분 환불 대상입니다.`,
      isCancelable: true,
    };
  } else {
    // 당일(0일) 또는 이미 경과한 경우: 환불 불가
    return {
      daysLeft,
      refundRate: 0.0,
      refundAmount: 0,
      penaltyAmount: paidAmountKrw,
      status: 'NO_REFUND',
      message: `여행 당일(D-Day) 취소 또는 여행일 경과로 인해 약관상 환불이 불가합니다.`,
      isCancelable: false,
    };
  }
}
