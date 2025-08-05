import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../../components/input-table/InputFormTable';
import SummaryBox from '../../components/summary-box/SummaryBox';
import ResultTable from '../../components/result-table/ResultTable';
import {ApiResponse, calculateInterest} from '../../service/HomeService';
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
    monthlyFixedAmount?: number;
}

interface LoanContractInput {
    email: string;
    contractName: string;
    startDate: string;
}

const Home: React.FC = () => {
    const [resultData, setResultData] = useState<PaymentRow[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [recommendation, setRecommendation] = useState<ApiResponse['recommendation']>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
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
            setRecommendation(response.recommendation);
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
            setNotification('Lưu hợp đồng thành công!');
            setTimeout(() => setNotification(null), 2000);
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
            {notification && (
                <div className="alert alert-success alert-dismissible fade show">
                    {notification}
                    <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
                </div>
            )}
            {loading && <div className="alert alert-info">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {recommendation && (
                <div className="card p-4 mb-4 recommendation-card">
                    <h3 className="card-title mb-3">Gợi ý phương thức trả lãi</h3>
                    <p><strong>Phương thức đề xuất:</strong> {recommendation.method}</p>
                    <p><strong>Lý do:</strong> {recommendation.reason}</p>
                    <h4 className="mt-3">So sánh:</h4>
                    <ul>
                        <li>
                            <strong>Lãi cố định:</strong>
                            Số tiền trả hàng tháng: {recommendation.comparison.fixed.monthlyPayment.toLocaleString()} VNĐ,
                            Tổng lãi: {recommendation.comparison.fixed.totalInterest.toLocaleString()} VNĐ
                        </li>
                        <li>
                            <strong>Lãi giảm dần:</strong>
                            Số tiền trả tối đa mỗi kỳ: {recommendation.comparison.decreasing.maxMonthlyPayment.toLocaleString()} VNĐ,
                            Tổng lãi: {recommendation.comparison.decreasing.totalInterest.toLocaleString()} VNĐ
                        </li>
                    </ul>
                </div>
            )}
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