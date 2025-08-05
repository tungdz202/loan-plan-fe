import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {LoanContract} from "../../types/common";
import {getLoanContracts} from "../../service/LoanDetailService";

const LoanTracking: React.FC = () => {
    const [contracts, setContracts] = useState<LoanContract[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const location = useLocation();

    const handleSearch = async (email: string) => {
        if (!email.trim()) {
            setError('Vui lòng nhập email để tìm kiếm.');
            setContracts([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getLoanContracts(email);
            setContracts(data);
        } catch (err: any) {
            setError(err.message);
            setContracts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const emailFromState = location.state?.email;
        if (emailFromState) {
            setSearchEmail(emailFromState);
            handleSearch(emailFromState);
        }
    }, [location.state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchEmail);
    };

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Theo dõi hợp đồng vay</h1>
            <div className="action-buttons">
                <Link to="/" className="btn btn-secondary btn-custom">Quay lại trang chủ</Link>
            </div>
            <div className="card p-4 mb-4">
                <h3 className="card-title mb-3">Tìm kiếm hợp đồng</h3>
                <form onSubmit={handleSubmit}>
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
                            <button type="submit" className="btn btn-primary btn-custom w-100">Tìm kiếm</button>
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
                <div className="card p-4 mb-4">
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
                                    <Link to={`/loan-tracking/${contract.id}`} className="btn btn-primary btn-custom btn-sm">
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