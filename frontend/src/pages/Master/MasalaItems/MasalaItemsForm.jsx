import React from 'react'
import CommonMasterForm from '../../Custom/CommonMasterForm';
import { useLocation } from 'react-router-dom';

const MasalaItemsForm = () => {
  const location = useLocation();

  console.log(location)

    const rowData = location.state?.rowData || null;
    const isEdit = !!rowData;

    return (
        <CommonMasterForm
            module="masala_items"
            mode={isEdit ? "edit" : "add"}
            initialData={rowData || {}}
        />
    );
}

export default MasalaItemsForm