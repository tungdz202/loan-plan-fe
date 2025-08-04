import React from 'react';

interface PaymentRow {
    period: string;
    interest: number;
    principal: number;
    total: number;
    remainingBalance: number;
}

interface Props {
    data: PaymentRow[];
}

const ResultTable: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;
    return (
        <div className="card p-3">
            <h3 className="card-title mb-3">Kế hoạch trả lãi</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Kỳ</th>
                    <th>Số tiền lãi (VNĐ)</th>
                    <th>Số tiền gốc (VNĐ)</th>
                    <th>Tổng cộng (VNĐ)</th>
                    <th>Dư nợ còn lại (VNĐ)</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.period}</td>
                        <td>{row.interest.toLocaleString()}</td>
                        <td>{row.principal.toLocaleString()}</td>
                        <td>{row.total.toLocaleString()}</td>
                        <td>{row.remainingBalance.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable;