import React, { useState } from 'react';

interface FormData {
    amount: number;
    interestPeriod: number;
    loanTerm: number;
    interestMethod: string;
    customerType: string;
    startDate: string;
}

interface Props {
    onCalculate: (formData: FormData) => void;
}

const InputForm: React.FC<Props> = ({ onCalculate }) => {
    const [formData, setFormData] = useState<FormData>({
        amount: 0,
        interestPeriod: 1,
        loanTerm: 12,
        interestMethod: 'fixed',
        customerType: 'individual',
        startDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'amount' || name === 'loanTerm' || name === 'interestPeriod' ? Number(value) : value });
    };

    return (
        <div className="card p-3 mb-4">
            <h3 className="card-title mb-3">Nhập thông tin vay</h3>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Số tiền vay (VNĐ)</label>
                        <input
                            type="number"
                            name="amount"
                            className="form-control"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Nhập số tiền vay"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Kỳ hạn trả lãi</label>
                        <select name="interestPeriod" className="form-select" value={formData.interestPeriod} onChange={handleChange}>
                            <option value={1}>Hàng tháng</option>
                            <option value={3}>Hàng quý</option>
                            <option value={12}>Hàng năm</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Thời hạn vay (tháng)</label>
                        <input
                            type="number"
                            name="loanTerm"
                            className="form-control"
                            value={formData.loanTerm}
                            onChange={handleChange}
                            placeholder="Nhập thời hạn vay"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Phương thức tính lãi</label>
                        <select name="interestMethod" className="form-select" value={formData.interestMethod} onChange={handleChange}>
                            <option value="fixed">Lãi cố định</option>
                            <option value="reducing">Lãi trên dư nợ giảm dần</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Loại khách hàng</label>
                        <select name="customerType" className="form-select" value={formData.customerType} onChange={handleChange}>
                            <option value="individual">Cá nhân</option>
                            <option value="business">Doanh nghiệp</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Ngày bắt đầu</label>
                        <input
                            type="date"
                            name="startDate"
                            className="form-control"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">Tính toán</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InputForm;