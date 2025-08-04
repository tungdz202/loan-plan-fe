import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryBox from "../../components/summary-box/SummaryBox";
import ResultTableDetail from "../../components/result-table/ResultTableDetail";
import {getLoanContractById} from "../../service/LoanDetailService";
import {LoanContract} from "../../types/common";

const LoanTrackingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<LoanContract | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContract = async () => {
        setLoading(true);
        try {
            const selectedContract = await getLoanContractById(parseInt(id || '0'));
            setContract(selectedContract);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContract();
    }, [id]);

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Chi tiết hợp đồng vay</h1>
            <Link to="/loan-tracking" className="btn btn-primary mb-4">Quay lại danh sách hợp đồng</Link>
            {loading && <div className="alert alert-info">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {contract && (
                <>
                    <div className="card p-3 mb-4">
                        <h3 className="card-title mb-3">Thông tin hợp đồng</h3>
                        <p><strong>Email:</strong> {contract.email}</p>
                        <p><strong>Tên hợp đồng:</strong> {contract.contractName}</p>
                        <p><strong>Thời gian bắt đầu:</strong> {contract.startDate}</p>
                        <p><strong>Kỳ hạn trả lãi:</strong> {contract.interestPeriod === 1 ? 'Hàng tháng' : contract.interestPeriod === 3 ? 'Hàng quý' : 'Hàng năm'}</p>
                    </div>
                    {contract.loanDetails ? (
                        <>
                            <SummaryBox summary={contract.loanDetails.summary} />
                            <ResultTableDetail data={contract.loanDetails.data} contractId={contract.id} onStatusChange={fetchContract} />
                        </>
                    ) : (
                        <div className="alert alert-warning">Không có chi tiết hợp đồng.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default LoanTrackingDetail;