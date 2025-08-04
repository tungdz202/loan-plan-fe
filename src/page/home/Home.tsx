import React, { useState } from 'react';
import InputForm from '../../components/input-table/InputFormTable';
import SummaryBox from '../../components/summary-box/SummaryBox';
import ResultTable from '../../components/result-table/ResultTable';
import {calculateInterest} from "../../service/HomeService";
import {Link} from "react-router-dom";
import LoanTrackingModal from "../../components/loan-detail/LoanDetail";
import {saveLoanContract} from "../../service/LoanDetailService";

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


    const handleCalculate = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await calculateInterest(formData);
            setSummary(response.summary);
            setResultData(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContract = async (contract: LoanContractInput) => {
        await saveLoanContract(contract);
    };


    return (
        <div className="container py-5">
            <InputForm onCalculate={handleCalculate} />
            <div className="mb-4">
                <button className="btn btn-success me-2" onClick={() => setShowModal(true)}>
                    Theo dõi hợp đồng
                </button>
                <Link to="/loan-tracking" className="btn btn-info">Xem danh sách hợp đồng</Link>
            </div>
            {loading && <div className="alert alert-info">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <SummaryBox summary={summary} />
            <ResultTable data={resultData} />
            <LoanTrackingModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveContract}
            />
        </div>
    );
};

export default Home;