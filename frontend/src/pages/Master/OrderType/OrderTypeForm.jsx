import React from 'react'
import CommonMasterForm from '../../Custom/CommonMasterForm';
import { useLocation } from 'react-router-dom';

const OrderTypeForm = () => {
    const location = useLocation();

    const rowData = location.state?.rowData || null;
    const isEdit = !!rowData;

    return (
        <CommonMasterForm
            module="order_type"
            mode={isEdit ? "edit" : "add"}
            initialData={rowData || {}}
        />
    )
}

export default OrderTypeForm