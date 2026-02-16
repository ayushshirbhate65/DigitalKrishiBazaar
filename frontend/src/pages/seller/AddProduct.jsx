import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaBoxOpen,
  FaTag,
  FaMoneyBillWave,
  FaCubes,
  FaMapMarkerAlt,
  FaStar,
  FaImage,
  FaCloudUploadAlt,
  FaListAlt,
  FaBalanceScale,
  FaAlignLeft
} from "react-icons/fa";
import "../../styles/form.css";
import "../../styles/product-card.css";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    quality: "",
    originPlace: "",
    quantityAvailable: "",
    unit: "PACK",
    categoryId: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("confirm");
  const [modalMessage, setModalMessage] = useState("");

  /* IMAGE UPLOAD */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/images/upload/${user.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setForm((prev) => ({ ...prev, imageUrl: res.data }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* VALIDATION */
  const validateForm = () => {
    if (
      !form.productName ||
      !form.description ||
      !form.price ||
      !form.quantityAvailable ||
      !form.quality ||
      !form.originPlace ||
      !form.unit ||
      !form.categoryId ||
      !form.imageUrl
    ) {
      setModalType("error");
      setModalMessage(
        "Please fill all fields and upload an image before submitting."
      );
      setShowModal(true);
      return false;
    }
    return true;
  };

  /* SUBMIT (ASK FIRST) */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalType("confirm");
    setModalMessage(
      "Are you sure you want to submit this product for approval?"
    );
    setShowModal(true);
  };

  /* CONFIRM SUBMIT */
  const confirmSubmit = async () => {
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        quantityAvailable: Number(form.quantityAvailable),
        sellerId: user.id,
      });
      navigate("/seller/products");
    } catch (err) {
      setModalType("error");
      setModalMessage("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        {/* ───────── HEADER ───────── */}
        <div className="add-product-header">
          <div className="header-icon">
            <FaBoxOpen />
          </div>
          <h2>Add New Product</h2>
          <p>Fill in the details below to list your product for approval</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {/* ───────── SECTION 1 : Basic Info ───────── */}
          <div className="form-section">
            <h3 className="section-title">
              <FaTag className="section-icon" />
              Basic Information
            </h3>

            <div className="form-group">
              <label htmlFor="productName">
                <FaBoxOpen className="label-icon" />
                Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                placeholder="e.g. Organic Basmati Rice"
                value={form.productName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <FaAlignLeft className="label-icon" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your product in detail..."
                rows="4"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quality">
                  <FaStar className="label-icon" />
                  Quality
                </label>
                <input
                  id="quality"
                  name="quality"
                  type="text"
                  placeholder="e.g. Premium, Grade A"
                  value={form.quality}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="originPlace">
                  <FaMapMarkerAlt className="label-icon" />
                  Origin Place
                </label>
                <input
                  id="originPlace"
                  name="originPlace"
                  type="text"
                  placeholder="e.g. Punjab, India"
                  value={form.originPlace}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ───────── SECTION 2 : Pricing & Stock ───────── */}
          <div className="form-section">
            <h3 className="section-title">
              <FaMoneyBillWave className="section-icon" />
              Pricing & Stock
            </h3>

            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="price">
                  <FaMoneyBillWave className="label-icon" />
                  Price (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantityAvailable">
                  <FaCubes className="label-icon" />
                  Quantity
                </label>
                <input
                  id="quantityAvailable"
                  name="quantityAvailable"
                  type="number"
                  placeholder="0"
                  min="1"
                  value={form.quantityAvailable}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">
                  <FaBalanceScale className="label-icon" />
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                >
                  <option value="PACK">Pack</option>
                  <option value="KG">Kg</option>
                  <option value="LITER">Liter</option>
                </select>
              </div>
            </div>
          </div>

          {/* ───────── SECTION 3 : Category & Image ───────── */}
          <div className="form-section">
            <h3 className="section-title">
              <FaListAlt className="section-icon" />
              Category & Image
            </h3>

            <div className="form-group">
              <label htmlFor="categoryId">
                <FaListAlt className="label-icon" />
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                <option value="1">Crop</option>
                <option value="2">Seed</option>
                <option value="3">Fertilizer</option>
                <option value="4">Medicine</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaImage className="label-icon" />
                Product Image
              </label>

              <div className="image-upload-area">
                <label htmlFor="imageUpload" className="upload-label">
                  <FaCloudUploadAlt className="upload-icon" />
                  <span>Click to upload image</span>
                  <small>PNG, JPG, WEBP (Max 5MB)</small>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <span className="preview-badge">
                    <FaCheckCircle /> Uploaded
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ───────── SUBMIT BUTTON ───────── */}
          <button type="submit" className="submit-btn">
            <FaCheckCircle />
            Submit for Approval
          </button>
        </form>
      </div>

      {/* ───────── CONFIRM / ERROR MODAL ───────── */}
      {showModal && (
        <div className="cart-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className={`cart-modal ${modalType}`}
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "confirm" ? (
              <FaCheckCircle className="modal-success-icon" />
            ) : (
              <FaExclamationCircle className="modal-error-icon" />
            )}

            <h3>
              {modalType === "confirm" ? "Confirm Submission" : "Form Incomplete"}
            </h3>
            <p>{modalMessage}</p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {modalType === "confirm" && (
                <button className="primary-btn" onClick={confirmSubmit}>
                  Yes, Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;