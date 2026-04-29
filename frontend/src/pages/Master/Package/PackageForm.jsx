import React from 'react'
import { useLocation } from 'react-router-dom';
import CommonMasterForm from '../../Custom/CommonMasterForm';

const PackageForm = () => {
 const location = useLocation();

    const rowData = location.state?.rowData || null;
    const isEdit = !!rowData;

    return (
        <CommonMasterForm
            module="package"
            mode={isEdit ? "edit" : "add"}
            initialData={rowData || {}}
        />
    );
}

export default PackageForm