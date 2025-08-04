export interface PaymentRow {
    period: string;
    interest: number;
    principal: number;
    total: number;
    remainingBalance: number;
}

export interface Summary {
    totalPrincipal: number;
    totalInterest: number;
    totalPayment: number;
}


export interface FormData {
    amount: string;
    interestPeriod: string;
    loanTerm: string;
    interestMethod: string;
    customerType: string;
}

export interface Props {
    onCalculate: (data: {
        amount: number;
        interestPeriod: number;
        loanTerm: number;
        interestMethod: string;
        customerType: string;
    }) => void;
}

export interface PaymentRow {
    period: string;
    interest: number;
    principal: number;
    total: number;
    remainingBalance: number;
    paymentDate: string;
    paymentStatus: string;
}

export interface LoanContract {
    id: number;
    email: string;
    contractName: string;
    startDate: string;
    interestPeriod: number;
    loanDetails?: {
        summary: {
            totalPrincipal: number;
            totalInterest: number;
            totalPayment: number;
        };
        data: PaymentRow[];
    };
}
