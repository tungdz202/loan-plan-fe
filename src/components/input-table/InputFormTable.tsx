import React, { useState } from 'react';

interface FormData {
    amount: number;
    interestPeriod: number;
    loanTerm: number;
    interestMethod: string;
    customerType: string;
    startDate: string;
    monthlyFixedAmount?: number;
}

interface InputFormProps {
    onCalculate: (formData: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
    const [formData, setFormData] = useState<FormData>({
        amount: 0,
        interestPeriod: 1,
        loanTerm: 12,
        interestMethod: 'Lãi cố định',
        customerType: 'Cá nhân',
        startDate: '',
        monthlyFixedAmount: undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' || name === 'monthlyFixedAmount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount <= 0) {
            alert('Vui lòng nhập số tiền vay hợp lệ.');
            return;
        }
        if (!formData.startDate) {
            alert('Vui lòng chọn ngày bắt đầu.');
            return;
        }
        onCalculate(formData);
    };

    return (
        <div className="card p-4 mb-4">
            <h3 className="card-title mb-3">Nhập thông tin vay</h3>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="amount" className="form-label">Số tiền vay (VNĐ)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            placeholder="VD: 100000000"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="monthlyFixedAmount" className="form-label">Số tiền cố định hàng tháng (VNĐ)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="monthlyFixedAmount"
                            value={formData.monthlyFixedAmount || ''}
                            onChange={handleChange}
                            placeholder="VD: 10000000"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="interestPeriod" className="form-label">Kỳ hạn trả lãi</label>
                        <select
                            className="form-select"
                            name="interestPeriod"
                            value={formData.interestPeriod}
                            onChange={handleChange}
                        >
                            <option value={1}>Hàng tháng</option>
                            <option value={3}>Hàng quý</option>
                            <option value={12}>Hàng năm</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="loanTerm" className="form-label">Thời gian vay (tháng)</label>
                        <select
                            className="form-select"
                            name="loanTerm"
                            value={formData.loanTerm}
                            onChange={handleChange}
                        >
                            <option value={6}>6 tháng</option>
                            <option value={12}>12 tháng</option>
                            <option value={24}>24 tháng</option>
                            <option value={36}>36 tháng</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="interestMethod" className="form-label">Phương thức trả lãi</label>
                        <select
                            className="form-select"
                            name="interestMethod"
                            value={formData.interestMethod}
                            onChange={handleChange}
                        >
                            <option value="Lãi cố định">Lãi cố định</option>
                            <option value="Lãi giảm dần">Lãi giảm dần</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="customerType" className="form-label">Loại khách hàng</label>
                        <select
                            className="form-select"
                            name="customerType"
                            value={formData.customerType}
                            onChange={handleChange}
                        >
                            <option value="Cá nhân">Cá nhân</option>
                            <option value="Doanh nghiệp">Doanh nghiệp</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary btn-custom w-100 mt-3">
                            Tính toán
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InputForm;