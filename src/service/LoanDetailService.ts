import {LoanContract, PaymentRow, Summary} from "../types/common";

interface ApiResponse {
    summary: Summary;
    data: PaymentRow[];
}

interface LoanContractInput {
    email: string;
    contractName: string;
    startDate: string;
}

const mockContracts: LoanContract[] = [
    {
        id: 1,
        email: "customer1@example.com",
        contractName: "Hợp đồng vay 001",
        startDate: "2025-06-15",
        interestPeriod: 1
    },
    {
        id: 2,
        email: "customer2@example.com",
        contractName: "Hợp đồng vay 002",
        startDate: "2025-05-15",
        interestPeriod: 1
    },
    {
        id: 3,
        email: "customer1@example.com",
        contractName: "Hợp đồng vay 003",
        startDate: "2025-09-01",
        interestPeriod: 1
    }
];

const mockLoanDetails: LoanContract['loanDetails'] = {
    summary: {
        totalPrincipal: 100000000,
        totalInterest: 4595860,
        totalPayment: 104595860
    },
    data: [
        {"period": "Kỳ 1", "interest": 500000, "principal": 8216155, "total": 8716155, "remainingBalance": 91783845, "paymentDate": "2024-09-01", "paymentStatus": "Đã trả"},
        {"period": "Kỳ 2", "interest": 458919, "principal": 8257236, "total": 8716155, "remainingBalance": 83526609, "paymentDate": "2024-10-01", "paymentStatus": "Đã trả"},
        {"period": "Kỳ 3", "interest": 417633, "principal": 8298522, "total": 8716155, "remainingBalance": 75228087, "paymentDate": "2024-11-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 4", "interest": 376140, "principal": 8340015, "total": 8716155, "remainingBalance": 66888072, "paymentDate": "2024-12-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 5", "interest": 334440, "principal": 8381715, "total": 8716155, "remainingBalance": 58506357, "paymentDate": "2025-01-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 6", "interest": 292532, "principal": 8423623, "total": 8716155, "remainingBalance": 50082734, "paymentDate": "2025-02-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 7", "interest": 250414, "principal": 8465741, "total": 8716155, "remainingBalance": 41616993, "paymentDate": "2025-03-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 8", "interest": 208085, "principal": 8508070, "total": 8716155, "remainingBalance": 33108923, "paymentDate": "2025-04-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 9", "interest": 165545, "principal": 8550610, "total": 8716155, "remainingBalance": 24558313, "paymentDate": "2025-05-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 10", "interest": 122792, "principal": 8593363, "total": 8716155, "remainingBalance": 15964950, "paymentDate": "2025-06-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 11", "interest": 79825, "principal": 8636330, "total": 8716155, "remainingBalance": 7328620, "paymentDate": "2025-07-01", "paymentStatus": "Chưa trả"},
        {"period": "Kỳ 12", "interest": 36643, "principal": 8679512, "total": 8716155, "remainingBalance": 0, "paymentDate": "2025-08-01", "paymentStatus": "Chưa trả"}
    ]
};

export const saveLoanContract = async (contract: LoanContractInput): Promise<LoanContract> => {
    const newContract: LoanContract = {
        id: mockContracts.length + 1,
        ...contract,
        interestPeriod: 1
    };
    mockContracts.push(newContract);
    localStorage.setItem('mockContracts', JSON.stringify(mockContracts));
    return Promise.resolve(newContract);
};

export const getLoanContracts = async (email?: string): Promise<LoanContract[]> => {
    const stored = localStorage.getItem('mockContracts');
    const contracts = stored ? JSON.parse(stored) : mockContracts;
    if (!email) {
        return Promise.resolve([]);
    }
    return Promise.resolve(contracts.filter((contract: { email: string; }) => contract.email.toLowerCase() === email.toLowerCase()));
};

export const getLoanContractById = async (id: number): Promise<LoanContract> => {
    const stored = localStorage.getItem('mockContracts');
    const contracts = stored ? JSON.parse(stored) : mockContracts;
    const contract = contracts.find((c: LoanContract) => c.id === id);
    if (!contract) {
        throw new Error('Không tìm thấy hợp đồng.');
    }
    const startDate = new Date(contract.startDate);
    return Promise.resolve({
        ...contract,
        loanDetails: {
            summary: mockLoanDetails.summary,
            data: mockLoanDetails.data.map((row, index) => ({
                ...row,
                paymentDate: new Date(startDate.getFullYear(), startDate.getMonth() + index + 1, startDate.getDate()).toISOString().split('T')[0]
            }))
        }
    });
};

export const updatePaymentStatus = async (contractId: number, periodIndex: number, status: string): Promise<void> => {
    const stored = localStorage.getItem('mockContracts');
    const contracts = stored ? JSON.parse(stored) : mockContracts;
    const contract = contracts.find((c: LoanContract) => c.id === contractId);
    if (!contract) {
        throw new Error('Không tìm thấy hợp đồng.');
    }
    if (!contract.loanDetails) {
        contract.loanDetails = { ...mockLoanDetails };
    }
    contract.loanDetails.data[periodIndex].paymentStatus = status;
    localStorage.setItem('mockContracts', JSON.stringify(contracts));
};