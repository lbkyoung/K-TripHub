import { NextResponse } from 'next/server';
import { calculateRefund } from '@/lib/refundPolicy';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, travelDate, paidAmountKrw, paymentId, customCancelDate } = body;

    if (!bookingId || !travelDate || paidAmountKrw === undefined) {
      return NextResponse.json(
        { error: '필수 요청 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 테스트 시뮬레이션용 가상 취소일이 있으면 적용, 없으면 현재 시각
    const requestDate = customCancelDate ? new Date(customCancelDate) : new Date();

    // 1. 핵심 환불 정책 계산 엔진 실행 (3일 전 100%, 2~1일 전 50%, 당일 0%)
    const refundInfo = calculateRefund(travelDate, paidAmountKrw, requestDate);

    // 2. PG사 (포트원 / 토스페이먼츠) 결제 취소 API 연동 시뮬레이션
    let pgCancelResponse = null;

    if (refundInfo.refundAmount > 0) {
      /*
        [실제 포트원(PortOne) 연동 시 호출되는 백엔드 코드]:
        const tokenResponse = await fetch("https://api.iamport.kr/users/getToken", { ... });
        const cancelResponse = await fetch("https://api.iamport.kr/payments/cancel", {
          method: "POST",
          headers: { "Authorization": accessToken },
          body: JSON.stringify({
            imp_uid: paymentId,
            amount: refundInfo.refundAmount, // 부분 환불 또는 전액 환불 금액
            reason: refundInfo.message,
          }),
        });
      */
      pgCancelResponse = {
        success: true,
        provider: 'PortOne / TossPayments Test PG',
        transactionId: paymentId || `pg_cancel_${Date.now()}`,
        cancelledAmount: refundInfo.refundAmount,
        cancelledAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      bookingId,
      refundInfo,
      pgCancelResponse,
      message: refundInfo.message,
    });
  } catch (error: any) {
    console.error('취소/환불 처리 중 오류:', error);
    return NextResponse.json(
      { error: '환불 처리 중 서버 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
