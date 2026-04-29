import React from 'react'
import { useLocation } from 'react-router-dom';
import CommonMasterForm from '../../Custom/CommonMasterForm';

const DocumentForm = () => {
    const location = useLocation();

    const rowData = location.state?.rowData || null;
    const isEdit = !!rowData;

    return (
        <CommonMasterForm
            module="document"
            mode={isEdit ? "edit" : "add"}
            initialData={rowData || {}}
        />
    );
}

export default DocumentForm