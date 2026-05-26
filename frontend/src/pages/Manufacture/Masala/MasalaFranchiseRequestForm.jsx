import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMasalaItems, useMasalaRequestStore, usePaymentModes } from "../../../store/store";

const MasalaFranchiseRequestForm = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { state } = useLocation();

  const { masalaItems, fetchMasalaItems } = useMasalaItems();
  const { createRequest, editRequest, loading } = useMasalaRequestStore();
  const { paymentModes, fetchPaymentModes } = usePaymentModes();

  const editData = state?.rowData;

  const isEdit = !!id;


  // ======================================================
  // FETCH ITEMS
  // ======================================================
  useEffect(() => {

    fetchMasalaItems();
    fetchPaymentModes();

  }, []);


  // ======================================================
  // FORM STATE
  // ======================================================
  const [formData, setFormData] = useState({

    requestId: "",

    orderDate: "",

    requiredDate: "",

    priority: "",

    paymentOption: "",

    remarks: "",

    items: [],
  });


  // ======================================================
  // EDIT / CREATE MODE
  // ======================================================
  useEffect(() => {

    if (isEdit && editData) {

      setFormData({

        requestId: editData.requestId || "",

        orderDate: editData.createdAt?.split("T")[0] || "",

        requiredDate: editData.requiredDate?.split("T")[0] || "",

        priority: editData.priority || "",

        paymentOption: editData.paymentOption || "",

        remarks: editData.remarks || "",

        items:

          editData.items?.map(
            (item) => ({

              itemId:
                item.itemId,

              itemName:
                item.itemName,

              packSize:
                item.packSize,

              unit:
                item.unit,

              stock:
                masalaItems.find(
                  (masala) =>
                    masala._id ===
                    item.itemId
                )?.stock || 0,

              price:
                item.price,

              quantity:
                item.quantity,
            })
          ) || [],
      });

    } else {


      setFormData((prev) => ({
        ...prev,

        requestId: "",

        orderDate:
          new Date()
            .toISOString()
            .split("T")[0],
      }));
    }

  }, [isEdit, editData]);


  // ======================================================
  // HANDLE CHANGE
  // ======================================================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ======================================================
  // HANDLE ITEM CHANGE
  // ======================================================
  const handleItemChange = (
    index,
    updatedFields
  ) => {

    const updated = [...formData.items];

    updated[index] = {
      ...updated[index],
      ...updatedFields,
    };

    setFormData((prev) => ({
      ...prev,
      items: updated,
    }));
  };


  // ======================================================
  // ADD ITEM ROW
  // ======================================================
  const addItemRow = () => {

    setFormData((prev) => ({
      ...prev,

      items: [
        ...prev.items,

        {
          itemId: "",
          itemName: "",
          packSize: "",
          unit: "",
          stock: 0,
          price: 0,
          quantity: "",
        },
      ],
    }));
  };


  // ======================================================
  // REMOVE ITEM ROW
  // ======================================================
  const removeItemRow = (index) => {

    const updated =
      formData.items.filter(
        (_, i) => i !== index
      );

    setFormData((prev) => ({
      ...prev,
      items: updated,
    }));
  };


  // ======================================================
  // VALIDATION
  // ======================================================
  const validateForm = () => {

    if (
      !formData.requiredDate ||
      !formData.priority ||
      !formData.paymentOption
    ) {

      toast.error(
        "Please fill all required fields"
      );

      return false;
    }


    if (formData.items.length === 0) {

      toast.error(
        "Please add at least one item"
      );

      return false;
    }


    const invalidItem =
      formData.items.some(
        (item) =>
          !item.itemId ||
          !item.quantity
      );


    if (invalidItem) {

      toast.error(
        "Please fill item details"
      );

      return false;
    }

    return true;
  };


  // ======================================================
  // SUBMIT
  // ======================================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      const payload = {

        requiredDate:
          formData.requiredDate,

        priority:
          formData.priority,

        paymentOption:
          formData.paymentOption,

        remarks:
          formData.remarks,

        items:
          formData.items,
      };


      let response;


      // =====================================
      // EDIT
      // =====================================
      if (isEdit) {

        response =
          await editRequest(
            id,
            payload
          );
      }

      // =====================================
      // CREATE
      // =====================================
      else {

        response =
          await createRequest(
            payload
          );
      }


      if (response.success) {

        toast.success(
          response.message
        );

        setTimeout(() => {

          navigate(
            "/manufacture-masala-franchise-request"
          );

        }, 1000);
      }

    } catch (error) {

      console.log(
        "MASALA REQUEST ERROR :",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };


  // ======================================================
  // TOTALS
  // ======================================================
  const totalQuantity =
    formData.items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );


  const totalAmount =
    formData.items.reduce(
      (sum, item) =>

        sum +

        (
          Number(item.quantity || 0) *
          Number(item.price || 0)
        ),

      0
    );


  return (

    <div className="page-content">

      <div className="container-fluid">

        {/* ====================================================== */}
        {/* TITLE */}
        {/* ====================================================== */}

        <div className="row">

          <div className="col-12">

            <div className="page-title-box d-sm-flex align-items-center justify-content-between">

              <h4 className="mb-sm-0 font-size-18">

                {
                  isEdit
                    ? "Edit Franchise Request"
                    : "Create Franchise Request"
                }

              </h4>

              <div className="page-title-right">

                <ol className="breadcrumb m-0">

                  <li className="breadcrumb-item">
                    <Link to="/dashboard">
                      Dashboard
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <Link to="/manufacture-masala-franchise-request">
                      Franchise Requests
                    </Link>
                  </li>

                  <li className="breadcrumb-item active">

                    {isEdit ? "Edit" : "Add"}

                  </li>

                </ol>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================================== */}
        {/* FORM */}
        {/* ====================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="row">

            {/* ====================================================== */}
            {/* LEFT */}
            {/* ====================================================== */}

            <div className="col-xl-8">

              {/* ====================================================== */}
              {/* REQUEST DETAILS */}
              {/* ====================================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Request Details
                  </h5>

                  <div className="row g-3">

                    {/* REQUEST ID */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Request ID
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          formData.requestId ||
                          "Auto Generated"
                        }
                        readOnly
                      />

                    </div>


                    {/* ORDER DATE */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Order Date
                      </label>

                      <input
                        type="date"
                        name="orderDate"
                        className="form-control"
                        value={formData.orderDate}
                        readOnly
                      />

                    </div>


                    {/* REQUIRED DATE */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Required Date
                        {" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="date"
                        name="requiredDate"
                        className="form-control"
                        value={formData.requiredDate}
                        onChange={handleChange}
                      />

                    </div>


                    {/* PRIORITY */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Priority
                        {" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <select
                        name="priority"
                        className="form-select"
                        value={formData.priority}
                        onChange={handleChange}
                      >

                        <option value="">
                          Select
                        </option>

                        <option>
                          Normal
                        </option>

                        <option>
                          Urgent
                        </option>

                      </select>

                    </div>


                    {/* PAYMENT OPTION */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Payment Option
                        {" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <select
                        name="paymentOption"
                        className="form-select"
                        value={formData.paymentOption}
                        onChange={handleChange}
                      >

                        <option value="">
                          Select
                        </option>

                        {
                          paymentModes?.map((payment) => (

                            <option
                              key={payment._id}
                              value={payment.paymentName}
                            >

                              {payment.paymentName}

                            </option>

                          ))
                        }

                      </select>

                    </div>


                    {/* REMARKS */}

                    <div className="col-md-12">

                      <label className="form-label">
                        Remarks
                      </label>

                      <textarea
                        rows="3"
                        name="remarks"
                        className="form-control"
                        value={formData.remarks}
                        onChange={handleChange}
                      ></textarea>

                    </div>

                  </div>

                </div>

              </div>


              {/* ====================================================== */}
              {/* ORDER ITEMS */}
              {/* ====================================================== */}

              <div className="card">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                      Order Items
                    </h5>

                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={addItemRow}
                    >

                      <i className="bx bx-plus me-1"></i>

                      Add Item

                    </button>

                  </div>


                  {/* EMPTY STATE */}

                  {
                    formData.items.length === 0 && (

                      <div className="text-center py-4 border rounded">

                        <i className="bx bx-package font-size-24 text-muted"></i>

                        <p className="text-muted mb-0 mt-2">
                          No items added
                        </p>

                      </div>

                    )
                  }


                  {/* ITEMS */}

                  {
                    formData.items.map((item, index) => (

                      <div
                        className="row g-3 align-items-end mb-3"
                        key={index}
                      >

                        {/* ITEM */}

                        <div className="col-md-7">

                          <label className="form-label">

                            Item Name
                            {" "}

                            <span className="text-danger">
                              *
                            </span>

                          </label>

                          <select
                            className="form-select"
                            value={item.itemId}
                            onChange={(e) => {

                              const selectedItem =
                                masalaItems.find(
                                  (masala) =>
                                    masala._id ===
                                    e.target.value
                                );

                              handleItemChange(index, {

                                itemId:
                                  selectedItem._id,

                                itemName:
                                  selectedItem.itemName,

                                packSize:
                                  selectedItem.packSize,

                                unit:
                                  selectedItem.unit,

                                stock:
                                  selectedItem.stock,

                                price:
                                  selectedItem.price,
                              });

                            }}
                          >

                            <option value="">
                              Select Item
                            </option>

                            {
                              masalaItems.map((masala) => {

                                const alreadySelected =
                                  formData.items.some(
                                    (
                                      selectedItem,
                                      selectedIndex
                                    ) =>

                                      selectedItem.itemId === masala._id &&
                                      selectedIndex !== index
                                  );

                                return (

                                  <option
                                    key={masala._id}
                                    value={masala._id}
                                    disabled={alreadySelected}
                                  >

                                    {masala.itemName}
                                    {" "}

                                    (
                                    {masala.packSize}
                                    {" "}
                                    {masala.unit}
                                    )

                                  </option>

                                );
                              })
                            }

                          </select>


                          {/* ITEM DETAILS */}

                          {
                            item.itemId && (

                              <div className="mt-2">

                                <small className="text-muted">

                                  Pack Size :
                                  {" "}

                                  <strong>

                                    {item.packSize}
                                    {" "}
                                    {item.unit}

                                  </strong>

                                </small>

                              </div>

                            )
                          }


                          <div>

                            <small className="text-muted">

                              Available Stock :
                              {" "}

                              <strong>
                                {item.stock}
                              </strong>

                            </small>

                          </div>


                          <div>

                            <small className="text-muted">

                              Price :
                              {" "}

                              <strong>
                                ₹{item.price}
                              </strong>

                            </small>

                          </div>

                        </div>


                        {/* QUANTITY */}

                        <div className="col-md-3">

                          <label className="form-label">

                            Quantity
                            {" "}

                            <span className="text-danger">
                              *
                            </span>

                          </label>

                          <input
                            type="number"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) => {

                              const value =
                                Number(e.target.value);

                              if (
                                value > item.stock
                              ) {

                                toast.error(
                                  `Only ${item.stock} stock available`
                                );

                                return;
                              }

                              handleItemChange(index, {
                                quantity: value,
                              });

                            }}
                          />


                          {/* ITEM AMOUNT */}

                          <div className="mt-2">

                            <small className="text-success">

                              Amount :
                              {" "}

                              ₹

                              {
                                Number(item.quantity || 0) *
                                Number(item.price || 0)
                              }

                            </small>

                          </div>

                        </div>


                        {/* DELETE */}

                        <div className="col-md-2">

                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={() =>
                              removeItemRow(index)
                            }
                          >

                            <i className="bx bx-trash"></i>

                          </button>

                        </div>

                      </div>

                    ))
                  }

                </div>

              </div>

            </div>


            {/* ====================================================== */}
            {/* RIGHT */}
            {/* ====================================================== */}

            <div className="col-xl-4">


              {/* SUMMARY */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Summary
                  </h5>


                  {/* TOTAL ITEMS */}

                  <div className="mb-3">

                    <label className="form-label text-muted">
                      Total Items
                    </label>

                    <div>
                      {formData.items.length}
                    </div>

                  </div>


                  {/* TOTAL QTY */}

                  <div className="mb-3">

                    <label className="form-label text-muted">
                      Total Quantity
                    </label>

                    <div>
                      {totalQuantity}
                    </div>

                  </div>


                  {/* TOTAL AMOUNT */}

                  <div className="mb-3">

                    <label className="form-label text-muted">
                      Total Amount
                    </label>

                    <div>
                      ₹{totalAmount}
                    </div>

                  </div>


                  {/* BUTTONS */}

                  <div className="d-grid gap-2 mt-4">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >

                      {
                        loading
                          ? "Please wait..."
                          : isEdit
                            ? "Update Request"
                            : "Create Request"
                      }

                    </button>

                    <Link
                      to="/manufacture-masala-franchise-request"
                      className="btn btn-light border"
                    >

                      Cancel

                    </Link>

                  </div>

                </div>

              </div>


              {/* PAYMENT HISTORY */}

              <div className="card mt-3">

                <div className="card-body">

                  <h5 className="mb-3">
                    Payment History
                  </h5>

                  <div className="text-center text-muted py-3">

                    No payment history available

                  </div>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default MasalaFranchiseRequestForm;