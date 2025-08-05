import {PaymentRow} from "../types/common";

export interface ApiResponse {
    summary: {
        totalPrincipal: number;
        totalInterest: number;
        totalPayment: number;
    };
    data: PaymentRow[];
    recommendation?: {
        method: string;
        reason: string;
        comparison: {
            fixed: { monthlyPayment: number; totalInterest: number };
            decreasing: { maxMonthlyPayment: number; totalInterest: number };
        };
    };
}

interface FormData {
    amount: number;
    interestPeriod: number;
    loanTerm: number;
    interestMethod: string;
    customerType: string;
    startDate: string;
    monthlyFixedAmount?: number;
}

export const calculateInterest = async (formData: FormData): Promise<ApiResponse> => {
    const { amount, interestPeriod, loanTerm, interestMethod, customerType, startDate, monthlyFixedAmount } = formData;
    const annualInterestRate = customerType === 'Cá nhân' ? 0.06 : 0.08;
    const monthlyRate = annualInterestRate / 12;
    const periods = Math.floor(loanTerm / interestPeriod);
    let data: PaymentRow[] = [];
    let totalInterest = 0;
    let totalPrincipal = amount;
    let monthlyPayment = 0;
    let maxMonthlyPaymentDecreasing = 0;

    // Lãi cố định
    const fixedData: PaymentRow[] = [];
    if (interestMethod === 'Lãi cố định' || monthlyFixedAmount) {
        monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
            (Math.pow(1 + monthlyRate, loanTerm) - 1);
        let remainingBalance = amount;
        for (let i = 1; i <= periods; i++) {
            const interest = remainingBalance * monthlyRate * interestPeriod;
            const principal = monthlyPayment * interestPeriod - interest;
            const total = monthlyPayment * interestPeriod;
            remainingBalance -= principal;
            totalInterest += interest;
            fixedData.push({
                period: `Kỳ ${i}`,
                interest: Math.round(interest),
                principal: Math.round(principal),
                total: Math.round(total),
                remainingBalance: Math.round(remainingBalance),
                paymentDate: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + i * interestPeriod))
                    .toISOString().split('T')[0],
                paymentStatus: i <= 2 ? 'Đã trả' : 'Chưa trả',
            });
        }
    }

    // Lãi giảm dần
    const decreasingData: PaymentRow[] = [];
    let decreasingTotalInterest = 0;
    if (interestMethod === 'Lãi giảm dần' || monthlyFixedAmount) {
        let remainingBalance = amount;
        const principalPerPeriod = amount / periods;
        for (let i = 1; i <= periods; i++) {
            const interest = remainingBalance * monthlyRate * interestPeriod;
            const principal = principalPerPeriod;
            const total = principal + interest;
            if (i === 1) maxMonthlyPaymentDecreasing = total;
            remainingBalance -= principal;
            decreasingTotalInterest += interest;
            decreasingData.push({
                period: `Kỳ ${i}`,
                interest: Math.round(interest),
                principal: Math.round(principal),
                total: Math.round(total),
                remainingBalance: Math.round(remainingBalance),
                paymentDate: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + i * interestPeriod))
                    .toISOString().split('T')[0],
                paymentStatus: i <= 2 ? 'Đã trả' : 'Chưa trả',
            });
        }
    }

    // Logic AI đề xuất
    let recommendation = undefined;
    if (monthlyFixedAmount) {
        const fixedMonthly = monthlyPayment * interestPeriod;
        const canPayFixed = fixedMonthly <= monthlyFixedAmount;
        const canPayDecreasing = maxMonthlyPaymentDecreasing <= monthlyFixedAmount;
        let method = '';
        let reason = '';

        if (canPayFixed && canPayDecreasing) {
            method = totalInterest < decreasingTotalInterest ? 'Lãi cố định' : 'Lãi giảm dần';
            reason = method === 'Lãi cố định'
                ? `Phương thức lãi cố định phù hợp vì số tiền trả hàng tháng (${fixedMonthly.toLocaleString()} VNĐ) ổn định và thấp hơn số tiền cố định của bạn (${monthlyFixedAmount.toLocaleString()} VNĐ), đồng thời tổng lãi (${totalInterest.toLocaleString()} VNĐ) thấp hơn.`
                : `Phương thức lãi giảm dần phù hợp vì tổng lãi (${decreasingTotalInterest.toLocaleString()} VNĐ) thấp hơn, và số tiền trả tối đa mỗi kỳ (${maxMonthlyPaymentDecreasing.toLocaleString()} VNĐ) nằm trong khả năng chi trả (${monthlyFixedAmount.toLocaleString()} VNĐ).`;
        } else if (canPayFixed) {
            method = 'Lãi cố định';
            reason = `Phương thức lãi cố định phù hợp vì số tiền trả hàng tháng (${fixedMonthly.toLocaleString()} VNĐ) nằm trong khả năng chi trả (${monthlyFixedAmount.toLocaleString()} VNĐ).`;
        } else if (canPayDecreasing) {
            method = 'Lãi giảm dần';
            reason = `Phương thức lãi giảm dần phù hợp vì số tiền trả tối đa mỗi kỳ (${maxMonthlyPaymentDecreasing.toLocaleString()} VNĐ) nằm trong khả năng chi trả (${monthlyFixedAmount.toLocaleString()} VNĐ).`;
        } else {
            const suggestedTerm = Math.ceil(amount / monthlyFixedAmount * interestPeriod);
            method = 'Không khả thi';
            reason = `Số tiền cố định hàng tháng (${monthlyFixedAmount.toLocaleString()} VNĐ) không đủ để chi trả cho cả hai phương thức. Gợi ý: Kéo dài kỳ hạn vay lên ${suggestedTerm} tháng hoặc tăng số tiền cố định hàng tháng.`;
        }

        recommendation = {
            method,
            reason,
            comparison: {
                fixed: { monthlyPayment: Math.round(fixedMonthly), totalInterest: Math.round(totalInterest) },
                decreasing: { maxMonthlyPayment: Math.round(maxMonthlyPaymentDecreasing), totalInterest: Math.round(decreasingTotalInterest) },
            },
        };
    }

    // Trả về dữ liệu theo phương thức chọn
    const finalData = interestMethod === 'Lãi cố định' ? fixedData : decreasingData;
    const finalTotalInterest = interestMethod === 'Lãi cố định' ? totalInterest : decreasingTotalInterest;

    return {
        summary: {
            totalPrincipal: amount,
            totalInterest: Math.round(finalTotalInterest),
            totalPayment: Math.round(amount + finalTotalInterest),
        },
        data: finalData,
        recommendation,
    };
};