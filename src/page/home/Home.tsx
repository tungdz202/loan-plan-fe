import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../../components/input-table/InputFormTable';
import SummaryBox from '../../components/summary-box/SummaryBox';
import ResultTable from '../../components/result-table/ResultTable';
import { calculateInterest } from '../../service/HomeService';
import { Link } from 'react-router-dom';
import LoanTrackingModal from '../../components/loan-detail/LoanDetail';
import { saveLoanContract } from '../../service/LoanDetailService';

interface PaymentRow {
    period: string;
    interest: number;
    principal: number;
    total: number;
    remainingBalance: number;
    paymentDate: string;
    paymentStatus: string;
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
    startDate: string;
}

interface LoanContractInput {
    email: string;
    contractName: string;
    startDate: string;
}

const Home: React.FC = () => {
    const [resultData, setResultData] = useState<PaymentRow[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const navigate = useNavigate();

    const handleCalculate = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await calculateInterest(formData);
            setSummary(response.summary);
            setResultData(response.data);
            setStartDate(formData.startDate);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContract = async (contract: LoanContractInput) => {
        try {
            await saveLoanContract(contract);
            setShowModal(false);
            navigate('/loan-tracking', { state: { email: contract.email } });
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lưu hợp đồng.');
        }
    };

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Tính toán lãi vay</h1>
            <InputForm onCalculate={handleCalculate} />
            <div className="action-buttons">
                <button className="btn btn-primary btn-custom" onClick={() => setShowModal(true)}>
                    Theo dõi hợp đồng
                </button>
                <Link to="/loan-tracking" className="btn btn-secondary btn-custom">Xem danh sách hợp đồng</Link>
            </div>
            {loading && <div className="alert alert-info">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {summary && <SummaryBox summary={summary} />}
            {resultData.length > 0 && <ResultTable data={resultData} startDate={startDate} />}
            <LoanTrackingModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveContract}
            />
        </div>
    );
};

export default Home;