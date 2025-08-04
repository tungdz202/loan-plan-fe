import { ApiService } from './ApiService';

interface PaymentRow {
    period: string;
    interest: number;
    principal: number;
    total: number;
    remainingBalance: number;
}

interface Summary {
    totalPrincipal: number;
    totalInterest: number;
    totalPayment: number;
}

interface FormData {
    amount: number;
    interestPeriod: number;
    loanTerm: number;
    interestMethod: string;
    customerType: string;
}

interface ApiResponse {
    summary: Summary;
    data: PaymentRow[];
}

export const calculateInterest = async (formData: FormData): Promise<ApiResponse> => {
    // return ApiService<ApiResponse>({
    //     url: '/api/calculate-interest',
    //     method: 'POST',
    //     body: formData,
    // });
    return Promise.resolve(mockData);
};

const mockData: ApiResponse = {
    summary: {
        totalPrincipal: 100000000,
        totalInterest: 4595860,
        totalPayment: 104595860
    },
    data: [
        {
            period: "Kỳ 1",
            interest: 500000,
            principal: 8216155,
            total: 8716155,
            remainingBalance: 91783845
        },
        {
            period: "Kỳ 2",
            interest: 458919,
            principal: 8257236,
            total: 8716155,
            remainingBalance: 83526609
        },
        {
            period: "Kỳ 3",
            interest: 417633,
            principal: 8298522,
            total: 8716155,
            remainingBalance: 75228087
        },
        {
            period: "Kỳ 4",
            interest: 376140,
            principal: 8340015,
            total: 8716155,
            remainingBalance: 66888072
        },
        {
            period: "Kỳ 5",
            interest: 334440,
            principal: 8381715,
            total: 8716155,
            remainingBalance: 58506357
        },
        {
            period: "Kỳ 6",
            interest: 292532,
            principal: 8423623,
            total: 8716155,
            remainingBalance: 50082734
        },
        {
            period: "Kỳ 7",
            interest: 250414,
            principal: 8465741,
            total: 8716155,
            remainingBalance: 41616993
        },
        {
            period: "Kỳ 8",
            interest: 208085,
            principal: 8508070,
            total: 8716155,
            remainingBalance: 33108923
        },
        {
            period: "Kỳ 9",
            interest: 165545,
            principal: 8550610,
            total: 8716155,
            remainingBalance: 24558313
        },
        {
            period: "Kỳ 10",
            interest: 122792,
            principal: 8593363,
            total: 8716155,
            remainingBalance: 15964950
        },
        {
            period: "Kỳ 11",
            interest: 79825,
            principal: 8636330,
            total: 8716155,
            remainingBalance: 7328620
        },
        {
            period: "Kỳ 12",
            interest: 36643,
            principal: 8679512,
            total: 8716155,
            remainingBalance: 0
        }
    ]
};