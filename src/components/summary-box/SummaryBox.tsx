import React from 'react';

interface Summary {
    totalPrincipal: number;
    totalInterest: number;
    totalPayment: number;
}

interface Props {
    summary: Summary;
}

const SummaryBox: React.FC<Props> = ({ summary }) => {
    return (
        <div className="summary-box mb-4">
            <div className="summary-item">
                <h4>Tổng số tiền gốc</h4>
                <p>{summary.totalPrincipal.toLocaleString()} VNĐ</p>
            </div>
            <div className="summary-item">
                <h4>Tổng số tiền lãi</h4>
                <p>{summary.totalInterest.toLocaleString()} VNĐ</p>
            </div>
            <div className="summary-item">
                <h4>Tổng số tiền phải nộp</h4>
                <p>{summary.totalPayment.toLocaleString()} VNĐ</p>
            </div>
        </div>
    );
};

export default SummaryBox;