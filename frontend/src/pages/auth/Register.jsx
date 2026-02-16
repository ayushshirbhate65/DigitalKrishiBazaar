import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCalendarAlt,
  FaGlobeAsia,
  FaBuilding,
  FaUserPlus,
  FaSeedling
} from "react-icons/fa"
import "../../styles/auth.css"

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const [states, setStates] = useState([])
  const [divisions, setDivisions] = useState([])

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    stateId: "",
    divisionId: "",
    gender: "",
    dob: ""
  })

  useEffect(() => {
    api.get("/states")
      .then(res => setStates(res.data))
      .catch(err => console.error("Failed to load states", err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStateChange = async (e) => {
    const stateId = e.target.value
    setForm({ ...form, stateId: stateId, divisionId: "" })

    if (stateId) {
      try {
        const res = await api.get(`/divisions/state/${stateId}`)
        setDivisions(res.data)
      } catch (err) {
        console.error("Failed to load divisions", err)
      }
    } else {
      setDivisions([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.stateId || !form.divisionId) {
      setError("Please select State and Division")
      return
    }

    try {
      await api.post("/users", {
        userName: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        address: form.address,
        stateId: form.stateId,
        divisionId: form.divisionId,
        gender: form.gender,
        dob: form.dob,
        status: "ACTIVE",
        credit: 0
      })

      navigate("/login")
    } catch (err) {
      setError("Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">

        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-logo">
            <FaSeedling />
          </div>
          <h2>Create Account</h2>
          <p>Join us and start your journey</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>

          {/* ── Personal Info ── */}
          <div className="form-section-label">Personal Information</div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <FaVenusMars className="input-icon" />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                name="dob"
                type="date"
                placeholder="Date of Birth"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Contact Details ── */}
          <div className="form-section-label">Contact Details</div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Location ── */}
          <div className="form-section-label">Location</div>

          <div className="input-row">
            <div className="input-group">
              <FaGlobeAsia className="input-icon" />
              <select
                name="stateId"
                value={form.stateId}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <FaBuilding className="input-icon" />
              <select
                name="divisionId"
                value={form.divisionId}
                onChange={handleChange}
                disabled={!form.stateId}
              >
                <option value="">Select Division</option>
                {divisions.map(div => (
                  <option key={div.divisionId} value={div.divisionId}>
                    {div.divisionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* ── Submit ── */}
          <button className="auth-btn" type="submit">
            <FaUserPlus />
            Register
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register