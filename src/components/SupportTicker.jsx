import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchLink } from "./fetchComponent";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

// ── Shared palette (matches SMTraders.js) ───────────────────────────────
const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#f5f0eb";

const PRIORITY_COLORS = {
  Low: "#6FA98A",
  Medium: "#D6A340",
  High: "#E76F51",
  Urgent: "#B23A48",
};

const STATUS_STYLES = {
  open: { bg: "#fbeee9", color: "#a8442f" },
  assigned: { bg: "#eaf1ec", color: "#2f6f62" },
  resolved: { bg: "#efeae0", color: "#8a8378" },
};

const CATEGORY_OPTIONS = [
  "Order issue",
  "Billing / payment",
  "App or POS bug",
  "Delivery",
  "Account access",
  "Other",
];

// ─────────────────────────────────────────────────────────────────────────
// TicketRow
// ─────────────────────────────────────────────────────────────────────────
function TicketRow({ ticket, showCustomer, onClick }) {
  const statusStyle = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        flexWrap: "wrap",
        border: "1px solid #e8ddd4",
        cursor: "pointer",
        transition: "box-shadow 0.15s ease, transform 0.1s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 700,
            background: "#f0e6d8",
            color: BROWN_DARK,
            padding: "6px 10px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {ticket.id}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "14.5px",
              color: BROWN_DARK,
              marginBottom: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {ticket.subject}
          </div>
          <div style={{ fontSize: "12px", color: "#8a8378", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {showCustomer && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: BROWN,
                  background: "#e8ded2",
                  padding: "2px 8px",
                  borderRadius: "999px",
                }}
              >
                {ticket.customerName}
              </span>
            )}
            <span>{ticket.category}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: PRIORITY_COLORS[ticket.priority] || "#999",
                  display: "inline-block",
                }}
              />
              {ticket.priority}
            </span>
            <span>{ticket.date}</span>
          </div>
        </div>
      </div>

      <span
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          padding: "6px 12px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          background: statusStyle.bg,
          color: statusStyle.color,
        }}
      >
        {ticket.status}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CreateTicketModal
// ─────────────────────────────────────────────────────────────────────────
function CreateTicketModal({
  open,
  onClose,
  role,
  currentCustomer,
  staffCustomers,
  onSubmitted,
}) {
  const [customerId, setCustomerId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmTicketId, setConfirmTicketId] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 5;

  useEffect(() => {
    if (!open) return;
    setConfirmTicketId(null);
    setErrors({});
    setImages([]);
    setCategory("");
    setOrderRef("");
    setSubject("");
    setPriority("Medium");
    setDescription("");
    setCustomerId("");

    if (role === "staff") {
      setFullName("");
      setPhone("");
      setEmail("");
    } else {
      setFullName(currentCustomer?.name || "");
      setPhone(currentCustomer?.mobile || "");
      setEmail("");
    }
  }, [open, role, currentCustomer]);

  const isCustomerLocked = role === "staff" && customerId && customerId !== "__new__";

  const handleCustomerSelect = (val) => {
    setCustomerId(val);
    setErrors((e) => ({ ...e, customer: false }));
    if (val === "__new__") {
      setFullName("");
      setPhone("");
    } else if (val) {
      const c = staffCustomers.find((x) => String(x.id) === String(val));
      setFullName(c?.name || "");
      setPhone(c?.mobile || "");
    } else {
      setFullName("");
      setPhone("");
    }
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    for (const file of files) {
      if (images.length >= MAX_IMAGES) break;
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) =>
          prev.length >= MAX_IMAGES ? prev : [...prev, { name: file.name, dataUrl: reader.result }]
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const next = {};
    if (role === "staff" && !customerId) next.customer = true;
    if (!fullName.trim() || fullName.trim().length < 2) next.name = true;
    if (!/^[0-9+\-\s]{7,15}$/.test(phone.trim())) next.phone = true;
    if (!category) next.category = true;
    if (!subject.trim() || subject.trim().length < 4) next.subject = true;
    if (!description.trim() || description.trim().length < 10) next.description = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextTicketId = () => {
    const year = new Date().getFullYear();
    const n = Math.floor(1000 + Math.random() * 9000);
    return `TCK-${year}-${n}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      let resolvedCustomerId = currentCustomer?.id || "me";
      let resolvedCustomerName = fullName.trim();

      if (role === "staff") {
        if (customerId && customerId !== "__new__") {
          const c = staffCustomers.find((x) => String(x.id) === String(customerId));
          resolvedCustomerId = c?.id || customerId;
          resolvedCustomerName = c?.name || fullName.trim();
        } else {
          resolvedCustomerId = "walkin-" + Date.now();
        }
      }

      const payload = {
        customerId: resolvedCustomerId,
        customerName: resolvedCustomerName,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        category,
        orderRef: orderRef.trim(),
        subject: subject.trim(),
        priority,
        description: description.trim(),
        images: images.map((i) => i.dataUrl),
        filedByRole: role,
      };

      // Attempt to reach the backend; fall back to a locally generated id
      // so the flow still works if the endpoint isn't wired up yet.
      let ticketId = nextTicketId();
      try {
        const response = await fetchLink({
          address: `support/tickets/create`,
          method: "POST",
          bodyData: payload,
        });
        if (response?.success && response.data?.ticketId) {
          ticketId = response.data.ticketId;
        }
      } catch (err) {
        console.warn("Ticket API unavailable, using local id.", err);
      }

      onSubmitted &&
        onSubmitted({
          id: ticketId,
          customerId: resolvedCustomerId,
          customerName: resolvedCustomerName,
          subject: subject.trim(),
          category,
          priority,
          status: "open",
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });

      setConfirmTicketId(ticketId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const fieldStyle = (hasError) => ({
    width: "100%",
    fontSize: "14px",
    color: BROWN_DARK,
    background: "#fff",
    border: `1.5px solid ${hasError ? PRIORITY_COLORS.Urgent : "#e4dcc9"}`,
    borderRadius: "10px",
    padding: "10px 12px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  });

  const labelStyle = { display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px", color: BROWN_DARK };
  const errorText = { color: PRIORITY_COLORS.Urgent, fontSize: "12px", marginTop: "5px" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(31,26,20,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fdf8f3",
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            background: BROWN_DARK,
            color: "#fff",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 600 }}>
            {confirmTicketId ? "Ticket submitted" : "New support ticket"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon style={{ fontSize: "18px" }} />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "24px 26px 28px" }}>
          {confirmTicketId ? (
            <div style={{ textAlign: "center", padding: "10px 4px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: `3px solid ${BROWN}`,
                  color: BROWN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "26px",
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", color: BROWN_DARK }}>We've logged your issue</h3>
              <p style={{ color: "#8a8378", fontSize: "13.5px", lineHeight: 1.5, margin: "0 0 18px" }}>
                Keep this number to track the ticket.
              </p>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  background: "#f0e6d8",
                  border: "1.5px dashed #e4dcc9",
                  borderRadius: "11px",
                  padding: "12px",
                  marginBottom: "18px",
                  color: BROWN_DARK,
                }}
              >
                {confirmTicketId}
              </div>
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  background: BROWN_DARK,
                  color: "#fff",
                  border: "none",
                  padding: "13px",
                  borderRadius: "11px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {role === "staff" && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                    background: "#eaf1ec",
                    color: "#2f6f62",
                    border: "1px solid #cfe3d8",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    padding: "12px 14px",
                    borderRadius: "11px",
                    marginBottom: "20px",
                  }}
                >
                  <span>👤</span>
                  <span>You're filing this as staff. Pick the customer it's for, or add one that isn't listed.</span>
                </div>
              )}

              <div style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BROWN,
                    marginBottom: "12px",
                  }}
                >
                  Who this is for
                </div>

                {role === "staff" && (
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Customer</label>
                    <select
                      value={customerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      style={fieldStyle(errors.customer)}
                    >
                      <option value="">Select a customer</option>
                      {staffCustomers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                          {c.city ? ` — ${c.city}` : ""}
                        </option>
                      ))}
                      <option value="__new__">+ Customer not listed (enter manually)</option>
                    </select>
                    {errors.customer && <div style={errorText}>Please select a customer.</div>}
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      disabled={isCustomerLocked}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((er) => ({ ...er, name: false }));
                      }}
                      placeholder="e.g. Ramesh Kumar"
                      style={{
                        ...fieldStyle(errors.name),
                        background: isCustomerLocked ? "#f3eee3" : "#fff",
                        color: isCustomerLocked ? "#8a8378" : BROWN_DARK,
                      }}
                    />
                    {errors.name && <div style={errorText}>Please enter a name.</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone number</label>
                    <input
                      type="tel"
                      value={phone}
                      disabled={isCustomerLocked}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors((er) => ({ ...er, phone: false }));
                      }}
                      placeholder="10-digit mobile number"
                      style={{
                        ...fieldStyle(errors.phone),
                        background: isCustomerLocked ? "#f3eee3" : "#fff",
                        color: isCustomerLocked ? "#8a8378" : BROWN_DARK,
                      }}
                    />
                    {errors.phone && <div style={errorText}>Please enter a valid phone number.</div>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Email <span style={{ fontWeight: 400, color: "#8a8378", fontSize: "11.5px" }}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={fieldStyle(false)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BROWN,
                    marginBottom: "12px",
                  }}
                >
                  The issue
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setErrors((er) => ({ ...er, category: false }));
                      }}
                      style={fieldStyle(errors.category)}
                    >
                      <option value="">Select a category</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <div style={errorText}>Please choose a category.</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Order / invoice no. <span style={{ fontWeight: 400, color: "#8a8378", fontSize: "11.5px" }}>(if any)</span>
                    </label>
                    <input
                      type="text"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                      placeholder="e.g. INV-10432"
                      style={fieldStyle(false)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setErrors((er) => ({ ...er, subject: false }));
                    }}
                    placeholder="One line describing the issue"
                    style={fieldStyle(errors.subject)}
                  />
                  {errors.subject && <div style={errorText}>Please add a short subject.</div>}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Priority</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["Low", "Medium", "High", "Urgent"].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          padding: "8px 14px",
                          borderRadius: "999px",
                          border: `1.5px solid ${priority === p ? "transparent" : "#e4dcc9"}`,
                          background: priority === p ? PRIORITY_COLORS[p] : "#fff",
                          color: priority === p ? "#fff" : "#8a8378",
                          cursor: "pointer",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Describe what happened</label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((er) => ({ ...er, description: false }));
                    }}
                    placeholder="What did you expect, and what happened instead?"
                    style={{ ...fieldStyle(errors.description), minHeight: "90px", resize: "vertical", lineHeight: 1.5 }}
                  />
                  {errors.description && <div style={errorText}>Please add a bit more detail.</div>}
                </div>
              </div>

              <div style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BROWN,
                    marginBottom: "12px",
                  }}
                >
                  Attach photos
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  style={{
                    border: `2px dashed ${dragging ? ACCENT : "#e4dcc9"}`,
                    borderRadius: "14px",
                    padding: "22px 16px",
                    textAlign: "center",
                    background: dragging ? "#fff7f0" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ margin: "8px 0 2px", fontSize: "13.5px", fontWeight: 600, color: BROWN_DARK }}>
                    Drag photos here, or click to browse
                  </p>
                  <span style={{ display: "block", fontSize: "12px", color: "#8a8378" }}>
                    PNG or JPG, up to {MAX_IMAGES} images
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>

                {images.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: "72px",
                          height: "72px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1.5px solid #e4dcc9",
                        }}
                      >
                        <img src={img.dataUrl} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                          style={{
                            position: "absolute",
                            top: "3px",
                            right: "3px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(31,26,20,0.75)",
                            color: "#fff",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  fontWeight: 700,
                  fontSize: "14.5px",
                  color: "#fff",
                  background: submitting ? BROWN_LIGHT : BROWN_DARK,
                  border: "none",
                  padding: "14px",
                  borderRadius: "11px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={16} style={{ color: "#fff" }} />
                    Submitting...
                  </>
                ) : (
                  "Submit ticket"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SupportTickets — main exported component
// ─────────────────────────────────────────────────────────────────────────
export default function SupportTickets({ onBack, isMobile: isMobileProp }) {
  const [isMobile, setIsMobile] = useState(isMobileProp ?? window.innerWidth <= 768);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("customer");
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [staffCustomers, setStaffCustomers] = useState([]);

  useEffect(() => {
    if (isMobileProp !== undefined) return;
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobileProp]);

  // Determine role + customer context from the same localStorage the rest
  // of the app already uses.
  useEffect(() => {
    const userType = localStorage.getItem("userType") || "customer";
    setRole(userType === "employee" ? "staff" : "customer");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      setCurrentCustomer({
        id: user?.Ret_Id || user?.UserId || "me",
        name: user?.Name || session?.username || "Customer",
        mobile: user?.A1 || user?.Mobile_No || "",
      });

      if (Array.isArray(session?.customer)) {
        setStaffCustomers(
          session.customer.map((c) => ({
            id: c.Ret_Id,
            name: c.Ledger_Name || c.Party_Mailing_Name || c.A1 || "Unnamed",
            mobile: c.A1 || "",
            city: c.Party_Location || "",
          }))
        );
      }
    } catch (e) {
      console.error("Error reading user context:", e);
    }
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.UserId || user?.Ret_Id || "";
      const response = await fetchLink({
        address: `support/tickets?Created_by=${userId}`,
        method: "GET",
      });
      if (response?.success && Array.isArray(response.data)) {
        setTickets(
          response.data.map((t) => ({
            id: t.Ticket_Id || t.id,
            customerId: t.Customer_Id || t.customerId,
            customerName: t.Customer_Name || t.customerName || "—",
            subject: t.Subject || t.subject || "",
            category: t.Category || t.category || "",
            priority: t.Priority || t.priority || "Medium",
            status: (t.Status || t.status || "open").toLowerCase(),
            date:
              t.Created_On || t.date
                ? new Date(t.Created_On || t.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "",
          }))
        );
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.warn("Ticket list API unavailable:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const visibleTickets = useMemo(() => {
    const base = role === "staff" ? tickets : tickets.filter((t) => String(t.customerId) === String(currentCustomer?.id));
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (t) =>
        t.id?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [tickets, role, currentCustomer, search]);

  const handleTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setModalOpen(false);
    toast.success(`Ticket ${newTicket.id} submitted`);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: BG_COLOR, minHeight: "100vh", paddingBottom: isMobile ? "40px" : "0" }}>
      {/* Header */}
      <div
        style={{
          padding: isMobile ? "16px 20px" : "20px 32px",
          backgroundColor: BROWN_DARK,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? "13px" : "14px", opacity: 0.8 }}>Support desk</div>
          <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "bold" }}>Tickets</div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "16px" : "24px 32px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Title row + search + create */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: isMobile ? "19px" : "22px", margin: 0, color: BROWN_DARK }}>
              {role === "staff" ? "All tickets" : "Your tickets"}
            </h2>
            <div style={{ fontSize: "13px", color: "#8a8378", marginTop: "4px" }}>
              {role === "staff" ? "Showing tickets across every customer." : "Tickets you or your outlet have raised."}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: BROWN_DARK,
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 20px",
              borderRadius: "11px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BROWN)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BROWN_DARK)}
          >
            + Create new ticket
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: "18px" }}>
          <SearchIcon style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#aaa" }} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px 11px 38px",
              borderRadius: "10px",
              border: "1.5px solid #e4dcc9",
              fontSize: "14px",
              outline: "none",
              background: "#fff",
              color: BROWN_DARK,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Ticket list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8a8378" }}>
            <CircularProgress style={{ color: BROWN }} />
            <p style={{ marginTop: "12px" }}>Loading tickets...</p>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div
            style={{
              border: "1.5px dashed #e4dcc9",
              borderRadius: "16px",
              padding: "40px 20px",
              textAlign: "center",
              color: "#8a8378",
              fontSize: "14px",
            }}
          >
            {search.trim() ? "No tickets match your search." : "No tickets yet. Create one to get started."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {visibleTickets.map((t) => (
              <TicketRow key={t.id} ticket={t} showCustomer={role === "staff"} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>

      <CreateTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        role={role}
        currentCustomer={currentCustomer}
        staffCustomers={staffCustomers}
        onSubmitted={handleTicketCreated}
      />
    </div>
  );
}