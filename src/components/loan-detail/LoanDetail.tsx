import React, { useState } from 'react';

interface LoanContractInput {
    email: string;
    contractName: string;
    startDate: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: (contract: LoanContractInput) => void;
}

const LoanTrackingModal: React.FC<Props> = ({ show, onClose, onSave }) => {
    const [formData, setFormData] = useState<LoanContractInput>({
        email: '',
        contractName: '',
        startDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.contractName || !formData.startDate) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        try {
            await onSave(formData);
            onClose();
            setFormData({ email: '', contractName: '', startDate: '' });
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm hợp đồng vay</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contractName" className="form-label">Tên hợp đồng:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="contractName"
                                name="contractName"
                                value={formData.contractName}
                                onChange={handleChange}
                                placeholder="Nhập tên hợp đồng"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Thời gian bắt đầu vay:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanTrackingModal;