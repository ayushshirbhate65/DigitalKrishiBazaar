import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProductById, updateProduct } from "../../services/product.service";
import { BACKEND_URL } from "../../utils/constants";
import api from "../../services/api";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
  FaTag,
  FaMoneyBillWave,
  FaCubes,
  FaMapMarkerAlt,
  FaStar,
  FaImage,
  FaCloudUploadAlt,
  FaListAlt,
  FaBalanceScale,
  FaAlignLeft,
  FaBoxOpen
} from "react-icons/fa";
import "../../styles/form.css";
import "../../styles/product-card.css";

const EditProduct = () => {
  const { productId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    quantityAvailable: "",
    unit: "PACK",
    quality: "",
    originPlace: "",
    categoryId: "",
    imageUrl: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("confirm");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getProductById(productId)
      .then(res => {
        const p = res.data;
        setForm({
          productName: p.productName,
          description: p.description,
          price: p.price,
          quantityAvailable: p.quantityAvailable,
          unit: p.unit,
          quality: p.quality,
          originPlace: p.originPlace,
          categoryId: p.categoryId,
          imageUrl: p.imageUrl
        });
        setImagePreview(`${BACKEND_URL}/${p.imageUrl}`);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
      `/images/upload/${user.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setForm(prev => ({ ...prev, imageUrl: res.data }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !form.productName ||
      !form.description ||
      !form.price ||
      !form.quantityAvailable ||
      !form.unit ||
      !form.quality ||
      !form.originPlace ||
      !form.categoryId
    ) {
      setModalType("error");
      setModalMessage("Please fill all required fields before updating.");
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalType("confirm");
    setModalMessage("Are you sure you want to update this product?");
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    try {
      await updateProduct(productId, {
        ...form,
        price: Number(form.price),
        quantityAvailable: Number(form.quantityAvailable)
      });
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      setModalType("error");
      setModalMessage("Failed to update product. Please try again.");
    }
  };

  if (loading) return <p className="center">Loading product...</p>;

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        {/* ── Header ── */}
        <div className="add-product-header">
          <div className="header-icon">
            <FaEdit />
          </div>
          <h2>Edit Product</h2>
          <p>Update your product details below</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {/* ── Section 1: Basic Info ── */}
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
                placeholder="Describe your product..."
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

          {/* ── Section 2: Pricing ── */}
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

          {/* ── Section 3: Category & Image ── */}
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

              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <span className="preview-badge">
                    <FaCheckCircle /> Current
                  </span>
                </div>
              )}

              <div className="image-upload-area" style={{ marginTop: "14px" }}>
                <label htmlFor="imageUpload" className="upload-label">
                  <FaCloudUploadAlt className="upload-icon" />
                  <span>Click to change image</span>
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
            </div>
          </div>

          {/* ── Submit ── */}
          <button type="submit" className="submit-btn">
            <FaCheckCircle />
            Update Product
          </button>
        </form>
      </div>

      {/* ── Modal ── */}
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
              {modalType === "confirm" ? "Confirm Update" : "Invalid Form"}
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
                <button className="primary-btn" onClick={confirmUpdate}>
                  Yes, Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;