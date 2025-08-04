import React, { useState } from 'react';

interface FormData {
    amount: string;
    interestPeriod: string;
    loanTerm: string;
    interestMethod: string;
    customerType: string;
}

interface Props {
    onCalculate: (data: {
        amount: number;
        interestPeriod: number;
        loanTerm: number;
        interestMethod: string;
        customerType: string;
    }) => void;
}

const InputForm: React.FC<Props> = ({ onCalculate }) => {
    const [formData, setFormData] = useState<FormData>({
        amount: '',
        interestPeriod: '1',
        loanTerm: '',
        interestMethod: 'end',
        customerType: 'individual',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { amount, interestPeriod, loanTerm, interestMethod, customerType } = formData;
        if (!amount || !loanTerm || parseFloat(amount) <= 0 || parseInt(loanTerm) <= 0) {
            alert('Vui lòng nhập số tiền và thời hạn vay hợp lệ.');
            return;
        }
        onCalculate({
            amount: parseFloat(amount),
            interestPeriod: parseInt(interestPeriod),
            loanTerm: parseInt(loanTerm),
            interestMethod,
            customerType,
        });
    };

    return (
        <div className="card p-4 mb-4">
            <h1 className="text-center mb-4">Kế Hoạch Trả Lãi</h1>
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="amount" className="form-label">Số tiền vay (VNĐ):</label>
                    <input
                        type="number"
                        className="form-control"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Nhập số tiền"
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="interestPeriod" className="form-label">Kỳ hạn trả lãi:</label>
                    <select className="form-select" id="interestPeriod" name="interestPeriod" value={formData.interestPeriod} onChange={handleChange}>
                        <option value="1">Hàng tháng</option>
                        <option value="3">Hàng quý</option>
                        <option value="12">Hàng năm</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="loanTerm" className="form-label">Thời hạn vay (tháng):</label>
                    <input
                        type="number"
                        className="form-control"
                        id="loanTerm"
                        name="loanTerm"
                        value={formData.loanTerm}
                        onChange={handleChange}
                        placeholder="Nhập số tháng"
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="interestMethod" className="form-label">Phương thức trả lãi:</label>
                    <select className="form-select" id="interestMethod" name="interestMethod" value={formData.interestMethod} onChange={handleChange}>
                        <option value="end">Trả lãi cuối kỳ</option>
                        <option value="periodic">Trả lãi định kỳ</option>
                        <option value="annuity">Trả góp đều</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="customerType" className="form-label">Loại khách hàng:</label>
                    <select className="form-select" id="customerType" name="customerType" value={formData.customerType} onChange={handleChange}>
                        <option value="individual">Cá nhân (6%/năm)</option>
                        <option value="business">Doanh nghiệp (7%/năm)</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-primary w-100 mt-4" onClick={handleSubmit}>Tính toán</button>
        </div>
    );
};

export default InputForm;