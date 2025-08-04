import React from 'react';

interface Summary {
    totalPrincipal: number;
    totalInterest: number;
    totalPayment: number;
}

interface Props {
    summary: Summary | null;
}

const SummaryBox: React.FC<Props> = ({ summary }) => {
    if (!summary) return null;
    return (
        <div className="card p-3 mb-4">
            <h3 className="card-title mb-3">Tổng hợp</h3>
            <p><strong>Tổng số tiền gốc:</strong> {summary.totalPrincipal.toLocaleString()} VNĐ</p>
            <p><strong>Tổng số tiền lãi:</strong> {summary.totalInterest.toLocaleString()} VNĐ</p>
            <p><strong>Tổng số tiền phải nộp:</strong> {summary.totalPayment.toLocaleString()} VNĐ</p>
        </div>
    );
};

export default SummaryBox;