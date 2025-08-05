import React from 'react';
import { updatePaymentStatus } from '../../service/LoanDetailService';
import {PaymentRow} from "../../types/common";

interface Props {
    data: PaymentRow[];
    contractId?: number;
    onStatusChange?: () => void;
    startDate?: string; // Thêm startDate để tính paymentDate
}

const ResultTable: React.FC<Props> = ({ data, contractId, onStatusChange, startDate }) => {
    const currentDate = new Date('2025-08-03');

    const handleToggleStatus = async (index: number, currentStatus: string) => {
        if (contractId) {
            try {
                const newStatus = currentStatus === 'Đã trả' ? 'Chưa trả' : 'Đã trả';
                await updatePaymentStatus(contractId, index, newStatus);
                if (onStatusChange) {
                    onStatusChange();
                }
            } catch (err: any) {
                console.error('Lỗi khi cập nhật trạng thái:', err.message);
            }
        }
    };

    return (
        <div className="card p-3 table-container">
            <h3 className="card-title mb-3">Kế hoạch trả lãi</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Kỳ</th>
                    <th>Ngày trả lãi</th>
                    <th>Số tiền lãi (VNĐ)</th>
                    <th>Số tiền gốc (VNĐ)</th>
                    <th>Tổng cộng (VNĐ)</th>
                    <th>Dư nợ còn lại (VNĐ)</th>
                    <th>Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => {
                    const paymentDate = new Date(row.paymentDate);
                    const isFutureDate = paymentDate > currentDate;
                    return (
                        <tr key={index}>
                            <td>{row.period}</td>
                            <td>{row.paymentDate}</td>
                            <td>{row.interest.toLocaleString()}</td>
                            <td>{row.principal.toLocaleString()}</td>
                            <td>{row.total.toLocaleString()}</td>
                            <td>{row.remainingBalance.toLocaleString()}</td>
                            <td className="status-checkbox">
                                <input
                                    type="checkbox"
                                    checked={row.paymentStatus === 'Đã trả'}
                                    disabled={contractId ? isFutureDate : true} // Readonly trong Home.tsx
                                    onChange={contractId ? () => handleToggleStatus(index, row.paymentStatus) : undefined}
                                />
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable;