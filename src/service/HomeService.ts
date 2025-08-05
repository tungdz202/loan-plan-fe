import {PaymentRow} from "../types/common";

interface FormData {
    amount: number;
    interestPeriod: number;
    loanTerm: number;
    interestMethod: string;
    customerType: string;
    startDate: string;
}

interface CalculateResponse {
    summary: {
        totalPrincipal: number;
        totalInterest: number;
        totalPayment: number;
    };
    data: PaymentRow[];
}

export const calculateInterest = async (formData: FormData): Promise<CalculateResponse> => {
    const { amount, interestPeriod, loanTerm, interestMethod, startDate } = formData;
    const annualRate = formData.customerType === 'individual' ? 0.06 : 0.08; // 6% cá nhân, 8% doanh nghiệp
    const monthlyRate = annualRate / 12;

    const data: PaymentRow[] = [];
    let remainingBalance = amount;
    let totalInterest = 0;

    const periods = Math.ceil(loanTerm / interestPeriod);
    const monthlyPayment = interestMethod === 'fixed'
        ? amount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -loanTerm)))
        : amount / periods;

    const start = new Date(startDate);
    for (let i = 0; i < periods; i++) {
        const interest = interestMethod === 'fixed' ? amount * monthlyRate : remainingBalance * monthlyRate;
        const principal = interestMethod === 'fixed' ? monthlyPayment - interest : monthlyPayment;
        const total = interest + principal;
        remainingBalance -= principal;
        if (remainingBalance < 0) remainingBalance = 0;

        const paymentDate = new Date(start.getFullYear(), start.getMonth() + (i + 1) * interestPeriod, start.getDate()).toISOString().split('T')[0];
        const paymentStatus = paymentDate <= '2025-08-03' ? 'Đã trả' : 'Chưa trả'; // Giả lập trạng thái

        data.push({
            period: `Kỳ ${i + 1}`,
            interest: Math.round(interest),
            principal: Math.round(principal),
            total: Math.round(total),
            remainingBalance: Math.round(remainingBalance),
            paymentDate,
            paymentStatus,
        });
        totalInterest += interest;
    }

    return {
        summary: {
            totalPrincipal: amount,
            totalInterest: Math.round(totalInterest),
            totalPayment: Math.round(amount + totalInterest),
        },
        data,
    };
};