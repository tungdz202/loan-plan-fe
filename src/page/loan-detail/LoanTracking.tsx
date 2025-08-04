import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {LoanContract} from "../../types/common";
import {getLoanContracts} from "../../service/LoanDetailService";


const LoanTracking: React.FC = () => {
    const [contracts, setContracts] = useState<LoanContract[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchEmail, setSearchEmail] = useState<string>('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchEmail.trim()) {
            setError('Vui lòng nhập email để tìm kiếm.');
            setContracts([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getLoanContracts(searchEmail);
            setContracts(data);
        } catch (err: any) {
            setError(err.message);
            setContracts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Theo dõi hợp đồng vay</h1>
            <Link to="/" className="btn btn-primary mb-4">Quay lại trang chủ</Link>
            <div className="card p-3 mb-4">
                <h3 className="card-title mb-3">Tìm kiếm hợp đồng</h3>
                <form onSubmit={handleSearch}>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <input
                                type="email"
                                className="form-control"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="Nhập email để tìm kiếm"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primary w-100">Tìm kiếm</button>
                        </div>
                    </div>
                </form>
            </div>
            {loading && <div className="alert alert-info">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {contracts.length === 0 && !loading && !error && (
                <div className="alert alert-warning">Vui lòng nhập email để xem danh sách hợp đồng.</div>
            )}
            {contracts.length > 0 && (
                <div className="card p-3 mb-4">
                    <h3 className="card-title mb-3">Danh sách hợp đồng</h3>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Tên hợp đồng</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Kỳ hạn trả lãi</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contracts.map((contract) => (
                            <tr key={contract.id}>
                                <td>{contract.email}</td>
                                <td>{contract.contractName}</td>
                                <td>{contract.startDate}</td>
                                <td>{contract.interestPeriod === 1 ? 'Hàng tháng' : contract.interestPeriod === 3 ? 'Hàng quý' : 'Hàng năm'}</td>
                                <td>
                                    <Link to={`/loan-tracking/${contract.id}`} className="btn btn-info btn-sm">
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LoanTracking;