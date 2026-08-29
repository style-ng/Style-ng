import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const db = supabase;

// ── Palette (matches Style NG frontend) ────────────────────────────
const C = {
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDark: "#8B6914",
  cream: "#FAF7F2",
  bg: "#F4EFE6",
  charcoal: "#1A1814",
  warmGray: "#4A4540",
  midGray: "#7A7470",
  border: "rgba(201,168,76,0.25)",
  white: "#ffffff",
  darkBg: "#111009",
  cardBg: "rgba(255,255,255,0.04)"
};

// ── Small UI helpers ───────────────────────────────────────────────
const Badge = ({
  status
}) => {
  const cfg = {
    confirmed: {
      bg: "#16a34a22",
      color: "#16a34a",
      label: "Confirmed"
    },
    pending: {
      bg: "#ca8a0422",
      color: "#ca8a04",
      label: "Pending"
    },
    cancelled: {
      bg: "#dc262622",
      color: "#dc2626",
      label: "Cancelled"
    },
    completed: {
      bg: "#2563eb22",
      color: "#2563eb",
      label: "Completed"
    }
  }[status] || {
    bg: "#ccc2",
    color: "#777",
    label: status
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: cfg.bg,
      color: cfg.color,
      fontSize: ".72rem",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      padding: ".25rem .7rem",
      borderRadius: "2px",
      fontWeight: 600
    }
  }, cfg.label);
};
const Stars = ({
  n
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.gold,
    fontSize: ".85rem"
  }
}, "★".repeat(Math.floor(n || 0)), "☆".repeat(5 - Math.floor(n || 0)));
const Pill = ({
  children,
  onRemove
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: ".3rem",
    background: `${C.gold}22`,
    color: C.goldDark,
    border: `1px solid ${C.border}`,
    borderRadius: "2px",
    fontSize: ".72rem",
    letterSpacing: ".08em",
    padding: ".2rem .6rem"
  }
}, children, onRemove && /*#__PURE__*/React.createElement("button", {
  onClick: onRemove,
  style: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: C.midGray,
    fontSize: ".8rem",
    lineHeight: 1,
    padding: 0
  }
}, "\xD7"));
const Input = ({
  label,
  ...props
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: "1.1rem"
  }
}, label && /*#__PURE__*/React.createElement("label", {
  style: {
    display: "block",
    fontSize: ".72rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: C.warmGray,
    marginBottom: ".45rem"
  }
}, label), /*#__PURE__*/React.createElement("input", _extends({
  style: {
    width: "100%",
    padding: ".75rem 1rem",
    fontFamily: "inherit",
    fontSize: ".9rem",
    color: C.charcoal,
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: "0",
    outline: "none",
    boxSizing: "border-box"
  }
}, props)));
const Textarea = ({
  label,
  ...props
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: "1.1rem"
  }
}, label && /*#__PURE__*/React.createElement("label", {
  style: {
    display: "block",
    fontSize: ".72rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: C.warmGray,
    marginBottom: ".45rem"
  }
}, label), /*#__PURE__*/React.createElement("textarea", _extends({
  style: {
    width: "100%",
    padding: ".75rem 1rem",
    fontFamily: "inherit",
    fontSize: ".9rem",
    color: C.charcoal,
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: "0",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "80px"
  }
}, props)));
const Select = ({
  label,
  children,
  ...props
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: "1.1rem"
  }
}, label && /*#__PURE__*/React.createElement("label", {
  style: {
    display: "block",
    fontSize: ".72rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: C.warmGray,
    marginBottom: ".45rem"
  }
}, label), /*#__PURE__*/React.createElement("select", _extends({
  style: {
    width: "100%",
    padding: ".75rem 1rem",
    fontFamily: "inherit",
    fontSize: ".9rem",
    color: C.charcoal,
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: "0",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none"
  }
}, props), children));
const Btn = ({
  children,
  variant = "primary",
  style: s,
  ...props
}) => {
  const base = {
    padding: ".65rem 1.5rem",
    fontSize: ".78rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: "2px",
    transition: "background .2s, color .2s"
  };
  const variants = {
    primary: {
      background: C.charcoal,
      color: C.cream
    },
    gold: {
      background: C.gold,
      color: C.charcoal
    },
    ghost: {
      background: "transparent",
      color: C.warmGray,
      border: `1px solid ${C.border}`
    },
    danger: {
      background: "#dc262618",
      color: "#dc2626",
      border: "1px solid #dc262630"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...s
    }
  }, props), children);
};
const Modal = ({
  open,
  onClose,
  title,
  children,
  width = "560px"
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(26,24,20,.7)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.cream,
      width: "100%",
      maxWidth: width,
      maxHeight: "90vh",
      overflowY: "auto",
      borderLeft: `3px solid ${C.gold}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.5rem 2rem",
      borderBottom: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.3rem",
      fontWeight: 400,
      color: C.charcoal
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.4rem",
      color: C.midGray,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2rem"
    }
  }, children)));
};

// ── Login gate ──────────────────────────────────────────────────────
const Login = ({
  onLoggedIn
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      error
    } = await db.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onLoggedIn();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: C.bg,
      fontFamily: "'DM Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      background: "#fff",
      padding: "2.5rem",
      width: "100%",
      maxWidth: "360px",
      borderTop: `3px solid ${C.gold}`,
      boxShadow: "0 10px 40px rgba(0,0,0,.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.5rem",
      marginBottom: "1.75rem",
      color: C.charcoal
    }
  }, "Style", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold
    }
  }, "."), "NG Admin"), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    value: password,
    onChange: e => setPassword(e.target.value),
    required: true
  }), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#dc2626",
      fontSize: ".82rem",
      marginBottom: "1rem"
    }
  }, error), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    style: {
      width: "100%"
    },
    type: "submit",
    disabled: loading
  }, loading ? "Signing in…" : "Sign In")));
};

// ── Stylist editor modal ───────────────────────────────────────────
const StylistModal = ({
  open,
  onClose,
  stylist,
  onSave
}) => {
  const blank = {
    id: null,
    name: "",
    role: "",
    bio: "",
    img: "",
    specialties: [],
    available: true,
    rating: 5.0,
    bookings: 0
  };
  const [form, setForm] = useState(stylist || blank);
  const [newSpec, setNewSpec] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    setForm(stylist || blank);
    setUploadError("");
  }, [stylist]);
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const handlePhotoFile = async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeName = (form.name || "stylist").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "stylist";
    const path = `${safeName}-${Date.now()}.${ext}`;
    const {
      error: upErr
    } = await db.storage.from("stylist-photos").upload(path, file, {
      upsert: true,
      cacheControl: "3600"
    });
    if (upErr) {
      setUploadError(upErr.message || "Upload failed");
      setUploading(false);
      return;
    }
    const {
      data: pub
    } = db.storage.from("stylist-photos").getPublicUrl(path);
    set("img", pub.publicUrl);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const addSpec = () => {
    const s = newSpec.trim();
    if (s && !form.specialties.includes(s)) {
      set("specialties", [...form.specialties, s]);
      setNewSpec("");
    }
  };
  const removeSpec = i => set("specialties", form.specialties.filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: form.id ? "Edit Stylist Profile" : "Add New Stylist",
    width: "600px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0 1.25rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full Name",
    value: form.name,
    onChange: e => set("name", e.target.value),
    placeholder: "e.g. Adaeze Okafor"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Role / Title",
    value: form.role,
    onChange: e => set("role", e.target.value),
    placeholder: "e.g. Lead Stylist \xB7 Natural Hair Expert"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "Biography",
    value: form.bio,
    onChange: e => set("bio", e.target.value),
    placeholder: "Short professional bio\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: ".72rem",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.warmGray,
      marginBottom: ".45rem"
    }
  }, "Photo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: ".6rem"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: form.img || `https://placehold.co/80x80/2a2418/C9A84C?text=${encodeURIComponent((form.name || "?")[0])}`,
    alt: "Stylist photo preview",
    style: {
      width: "80px",
      height: "80px",
      objectFit: "cover",
      border: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/*",
    onChange: handlePhotoFile,
    style: {
      display: "none"
    },
    id: "stylistPhotoFile"
  }), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    type: "button",
    disabled: uploading,
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    style: {
      padding: ".55rem 1rem",
      fontSize: ".72rem"
    }
  }, uploading ? "Uploading\u2026" : "Upload Photo"), uploadError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#dc2626",
      fontSize: ".75rem",
      marginTop: ".4rem"
    }
  }, uploadError)))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Photo URL (auto-filled after upload, or paste your own link)",
    value: form.img,
    onChange: e => set("img", e.target.value),
    placeholder: "https://\u2026 or leave blank for placeholder"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, {
    label: "Star Rating (1\u20135)",
    type: "number",
    min: "1",
    max: "5",
    step: "0.1",
    value: form.rating,
    onChange: e => set("rating", parseFloat(e.target.value))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, {
    label: "Total Bookings",
    type: "number",
    min: "0",
    value: form.bookings,
    onChange: e => set("bookings", parseInt(e.target.value) || 0)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "1.1rem"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: ".72rem",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.warmGray,
      marginBottom: ".45rem"
    }
  }, "Specialties"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: ".4rem",
      marginBottom: ".6rem"
    }
  }, form.specialties.map((s, i) => /*#__PURE__*/React.createElement(Pill, {
    key: i,
    onRemove: () => removeSpec(i)
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".5rem"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: newSpec,
    onChange: e => setNewSpec(e.target.value),
    onKeyDown: e => e.key === "Enter" && (e.preventDefault(), addSpec()),
    placeholder: "Add specialty\u2026",
    style: {
      flex: 1,
      padding: ".65rem .9rem",
      fontFamily: "inherit",
      fontSize: ".88rem",
      color: C.charcoal,
      background: "#fff",
      border: `1px solid ${C.border}`,
      borderRadius: "0",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: addSpec,
    style: {
      padding: ".65rem 1rem"
    }
  }, "Add"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: ".75rem",
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "avail",
    checked: form.available,
    onChange: e => set("available", e.target.checked),
    style: {
      accentColor: C.gold,
      width: "1rem",
      height: "1rem"
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "avail",
    style: {
      fontSize: ".9rem",
      color: C.warmGray,
      cursor: "pointer"
    }
  }, "Currently available for bookings")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => {
      onSave(form);
      onClose();
    }
  }, "Save Stylist")));
};

// ── Appointment detail modal ───────────────────────────────────────
// ── Product editor modal ────────────────────────────────────────────
const ProductModal = ({
  open,
  onClose,
  product,
  onSave,
  onDelete
}) => {
  const blank = {
    id: null,
    name: "",
    description: "",
    price_naira: 0,
    img: "",
    active: true
  };
  const [form, setForm] = useState(product || blank);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    setForm(product || blank);
    setUploadError("");
  }, [product]);
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const handlePhotoFile = async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeName = (form.name || "product").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
    const path = `${safeName}-${Date.now()}.${ext}`;
    const { error: upErr } = await db.storage.from("product-photos").upload(path, file, {
      upsert: true,
      cacheControl: "3600"
    });
    if (upErr) {
      setUploadError(upErr.message || "Upload failed");
      setUploading(false);
      return;
    }
    const { data: pub } = db.storage.from("product-photos").getPublicUrl(path);
    set("img", pub.publicUrl);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: form.id ? "Edit Product" : "Add New Product",
    width: "560px"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Product Name",
    value: form.name,
    onChange: e => set("name", e.target.value),
    placeholder: "e.g. Deep Hydration Masque Kit"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Description",
    value: form.description,
    onChange: e => set("description", e.target.value),
    placeholder: "Short product description\u2026"
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: ".72rem",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.warmGray,
      marginBottom: ".45rem"
    }
  }, "Photo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: ".6rem"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: form.img || `https://placehold.co/300x300/ede8de/8B6914?text=${encodeURIComponent((form.name || "?")[0])}`,
    alt: "Product photo preview",
    style: {
      width: "80px",
      height: "80px",
      objectFit: "cover",
      border: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/*",
    onChange: handlePhotoFile,
    style: {
      display: "none"
    },
    id: "productPhotoFile"
  }), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    type: "button",
    disabled: uploading,
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    style: {
      padding: ".55rem 1rem",
      fontSize: ".72rem"
    }
  }, uploading ? "Uploading\u2026" : "Upload Photo"), uploadError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#dc2626",
      fontSize: ".75rem",
      marginTop: ".4rem"
    }
  }, uploadError))), /*#__PURE__*/React.createElement(Input, {
    label: "Photo URL (auto-filled after upload, or paste your own link)",
    value: form.img,
    onChange: e => set("img", e.target.value),
    placeholder: "https://\u2026 or leave blank for placeholder"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Price (\u20A6)",
    type: "number",
    min: "0",
    value: form.price_naira,
    onChange: e => set("price_naira", parseInt(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: ".75rem",
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "prodActive",
    checked: form.active,
    onChange: e => set("active", e.target.checked),
    style: {
      accentColor: C.gold,
      width: "1rem",
      height: "1rem"
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "prodActive",
    style: {
      fontSize: ".9rem",
      color: C.warmGray,
      cursor: "pointer"
    }
  }, "Visible on the public shop")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem",
      justifyContent: "space-between"
    }
  }, form.id ? /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      onDelete(form.id);
      onClose();
    }
  }, "Delete") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => {
      onSave(form);
      onClose();
    }
  }, "Save Product"))));
};
const ServiceModal = ({
  open,
  onClose,
  service,
  onSave,
  onDelete
}) => {
  const blank = {
    id: null,
    name: "",
    description: "",
    price_naira: 0,
    duration_minutes: 60
  };
  const [form, setForm] = useState(service || blank);
  useEffect(() => {
    setForm(service || blank);
  }, [service]);
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: form.id ? "Edit Service" : "Add New Service",
    width: "560px"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Service Name",
    value: form.name,
    onChange: e => set("name", e.target.value),
    placeholder: "e.g. Precision Haircut & Styling"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Description",
    value: form.description,
    onChange: e => set("description", e.target.value),
    placeholder: "Short service description\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0 1.25rem"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Price (\u20A6)",
    type: "number",
    min: "0",
    value: form.price_naira,
    onChange: e => set("price_naira", parseInt(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Duration (minutes)",
    type: "number",
    min: "0",
    value: form.duration_minutes,
    onChange: e => set("duration_minutes", parseInt(e.target.value) || 0)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem",
      justifyContent: "space-between",
      marginTop: "1rem"
    }
  }, form.id ? /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      onDelete(form.id);
      onClose();
    }
  }, "Delete") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => {
      onSave(form);
      onClose();
    }
  }, "Save Service"))));
};
const ApptModal = ({
  open,
  onClose,
  appt,
  stylists,
  services,
  onSave,
  onDelete
}) => {
  const [form, setForm] = useState(appt);
  useEffect(() => {
    setForm(appt);
  }, [appt]);
  if (!appt || !form) return null;
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "Appointment Details",
    width: "580px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0 1.25rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Client Name",
    value: form.client,
    onChange: e => set("client", e.target.value)
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Phone",
    value: form.phone,
    onChange: e => set("phone", e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    value: form.email,
    onChange: e => set("email", e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Assigned Stylist",
    value: form.stylist,
    onChange: e => set("stylist", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Unassigned \u2014"), stylists.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id
  }, s.name)))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Service",
    value: form.service,
    onChange: e => set("service", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select \u2014"), services.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id
  }, s.name)))), /*#__PURE__*/React.createElement(Input, {
    label: "Date",
    type: "date",
    value: form.date || "",
    onChange: e => set("date", e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Time",
    type: "time",
    value: form.time || "",
    onChange: e => set("time", e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Address",
    value: form.address,
    onChange: e => set("address", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "Notes",
    value: form.notes,
    onChange: e => set("notes", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Status",
    value: form.status,
    onChange: e => set("status", e.target.value)
  }, ["pending", "confirmed", "completed", "cancelled"].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      onDelete(form.id);
      onClose();
    }
  }, "Delete"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".75rem"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => {
      onSave(form);
      onClose();
    }
  }, "Save Changes"))));
};

// ── Dashboard stats ────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  sub,
  accent
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    padding: "1.5rem 1.75rem",
    borderLeft: accent ? `3px solid ${C.gold}` : "none"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "Georgia, serif",
    fontSize: "2.25rem",
    fontWeight: 300,
    color: C.charcoal,
    lineHeight: 1
  }
}, value), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: ".78rem",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: C.warmGray,
    marginTop: ".4rem"
  }
}, label), sub && /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: ".78rem",
    color: C.midGray,
    marginTop: ".3rem"
  }
}, sub));

// ── Data mapping helpers (DB rows -> UI shape) ───────────────────────
const mapAppt = row => ({
  id: row.id,
  client: row.client_name,
  phone: row.phone,
  email: row.email,
  service: row.services ? row.services.name : "",
  stylist: row.stylists ? row.stylists.name : "",
  date: row.appt_date,
  time: (row.appt_time || "").slice(0, 5),
  address: row.address,
  notes: row.notes || "",
  status: row.status
});

// ── Main app ───────────────────────────────────────────────────────
function Dashboard() {
  const [tab, setTab] = useState("dashboard");
  const [stylists, setStylists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [stylistModal, setStylistModal] = useState({
    open: false,
    data: null
  });
  const [productModal, setProductModal] = useState({
    open: false,
    data: null
  });
  const [serviceModal, setServiceModal] = useState({
    open: false,
    data: null
  });
  const [apptModal, setApptModal] = useState({
    open: false,
    data: null
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  const loadAll = useCallback(async () => {
    setLoading(true);
    const [{
      data: st
    }, {
      data: sv
    }, {
      data: ap
    }, {
      data: pr
    }] = await Promise.all([db.from('stylists').select('*').order('name'), db.from('services').select('*').order('name'), db.from('appointments').select('*, services(name, price_naira), stylists(name)').order('created_at', {
      ascending: false
    }), db.from('products').select('*').order('sort_order')]);
    setStylists(st || []);
    setServices(sv || []);
    setAppointments((ap || []).map(mapAppt));
    setProducts(pr || []);
    setLoading(false);
  }, []);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  const saveStylist = async form => {
    const payload = {
      name: form.name,
      role: form.role,
      bio: form.bio,
      img: form.img,
      specialties: form.specialties,
      available: form.available,
      rating: form.rating,
      bookings: form.bookings
    };
    if (form.id) {
      const {
        error
      } = await db.from('stylists').update(payload).eq('id', form.id);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("Stylist profile updated.");
    } else {
      const {
        error
      } = await db.from('stylists').insert(payload);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("New stylist added.");
    }
    loadAll();
  };
  const deleteStylist = async id => {
    const {
      error
    } = await db.from('stylists').delete().eq('id', id);
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    showToast("Stylist removed.");
    loadAll();
  };
  const saveService = async form => {
    const payload = {
      name: form.name,
      description: form.description,
      price_naira: form.price_naira,
      duration_minutes: form.duration_minutes
    };
    if (form.id) {
      const {
        error
      } = await db.from('services').update(payload).eq('id', form.id);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("Service updated.");
    } else {
      const {
        error
      } = await db.from('services').insert(payload);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("New service added.");
    }
    loadAll();
  };
  const deleteService = async id => {
    const {
      error
    } = await db.from('services').delete().eq('id', id);
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    showToast("Service removed.");
    loadAll();
  };
  const saveProduct = async form => {
    const payload = {
      name: form.name,
      description: form.description,
      price_naira: form.price_naira,
      img: form.img,
      active: form.active
    };
    if (form.id) {
      const {
        error
      } = await db.from('products').update(payload).eq('id', form.id);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("Product updated.");
    } else {
      const {
        error
      } = await db.from('products').insert(payload);
      if (error) {
        showToast('Error: ' + error.message);
        return;
      }
      showToast("New product added.");
    }
    loadAll();
  };
  const deleteProduct = async id => {
    const {
      error
    } = await db.from('products').delete().eq('id', id);
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    showToast("Product removed.");
    loadAll();
  };
  const saveAppt = async form => {
    const service = services.find(s => s.name === form.service);
    const stylist = stylists.find(s => s.name === form.stylist);
    const payload = {
      client_name: form.client,
      phone: form.phone,
      email: form.email,
      service_id: service ? service.id : null,
      stylist_id: stylist ? stylist.id : null,
      appt_date: form.date || null,
      appt_time: form.time || null,
      address: form.address,
      notes: form.notes,
      status: form.status
    };
    const {
      error
    } = await db.from('appointments').update(payload).eq('id', form.id);
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    showToast("Appointment updated.");
    loadAll();
  };
  const deleteAppt = async id => {
    const {
      error
    } = await db.from('appointments').delete().eq('id', id);
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    showToast("Appointment deleted.");
    loadAll();
  };
  const addAppt = async () => {
    const {
      data,
      error
    } = await db.from('appointments').insert({
      client_name: "New Client",
      phone: "",
      email: "",
      appt_date: new Date().toISOString().split("T")[0],
      appt_time: "10:00",
      address: "",
      notes: "",
      status: "pending"
    }).select('*, services(name, price_naira), stylists(name)').single();
    if (error) {
      showToast('Error: ' + error.message);
      return;
    }
    await loadAll();
    setApptModal({
      open: true,
      data: mapAppt(data)
    });
  };
  const logout = async () => {
    await db.auth.signOut();
    window.location.reload();
  };
  const filteredAppts = appointments.filter(a => {
    const q = search.toLowerCase();
    const match = (a.client || "").toLowerCase().includes(q) || (a.service || "").toLowerCase().includes(q) || (a.stylist || "").toLowerCase().includes(q);
    const statusOk = statusFilter === "all" || a.status === statusFilter;
    return match && statusOk;
  });
  const navItems = [{
    id: "dashboard",
    label: "Dashboard"
  }, {
    id: "appointments",
    label: "Appointments"
  }, {
    id: "stylists",
    label: "Stylists"
  }, {
    id: "services",
    label: "Services"
  }, {
    id: "products",
    label: "Products"
  }];
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        color: C.warmGray,
        fontFamily: "'DM Sans', sans-serif"
      }
    }, "Loading dashboard\u2026");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: C.charcoal
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.4); }
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      width: "220px",
      background: C.charcoal,
      display: "flex",
      flexDirection: "column",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.75rem 1.5rem 1.25rem",
      borderBottom: `1px solid rgba(201,168,76,.2)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.4rem",
      fontWeight: 600,
      color: C.cream,
      letterSpacing: ".04em"
    }
  }, "Style", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold
    }
  }, "."), "NG"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".15em",
      textTransform: "uppercase",
      color: "rgba(250,247,242,.35)",
      marginTop: ".25rem"
    }
  }, "Admin Portal")), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: "1rem 0"
    }
  }, navItems.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => setTab(n.id),
    style: {
      width: "100%",
      textAlign: "left",
      background: tab === n.id ? "rgba(201,168,76,.12)" : "transparent",
      border: "none",
      borderLeft: tab === n.id ? `3px solid ${C.gold}` : "3px solid transparent",
      padding: ".9rem 1.5rem",
      color: tab === n.id ? C.goldLight : "rgba(250,247,242,.5)",
      fontSize: ".83rem",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all .2s",
      fontFamily: "inherit"
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.25rem 1.5rem",
      borderTop: `1px solid rgba(201,168,76,.15)`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: logout,
    style: {
      background: "none",
      border: "none",
      color: "rgba(250,247,242,.5)",
      fontSize: ".75rem",
      letterSpacing: ".08em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "inherit",
      padding: 0
    }
  }, "Log Out"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "220px",
      padding: "2.5rem"
    }
  }, tab === "dashboard" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "2.5rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".5rem"
    }
  }, "Overview"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontWeight: 300
    }
  }, "Good day, Admin")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "1.25rem",
      marginBottom: "2.5rem"
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total Appointments",
    value: appointments.length,
    accent: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Pending Approval",
    value: appointments.filter(a => a.status === "pending").length,
    sub: "Needs your attention"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Confirmed",
    value: appointments.filter(a => a.status === "confirmed").length
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Active Stylists",
    value: stylists.filter(s => s.available).length,
    sub: `of ${stylists.length} total`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.25rem 1.75rem",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.1rem",
      fontWeight: 400
    }
  }, "Recent Appointments"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("appointments"),
    style: {
      fontSize: ".75rem",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: C.gold,
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, "View all \u2192")), appointments.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2rem",
      color: C.midGray,
      fontSize: ".85rem"
    }
  }, "No appointments yet."), appointments.slice(0, 4).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      padding: "1rem 1.75rem",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".9rem",
      fontWeight: 500,
      color: C.charcoal
    }
  }, a.client), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".78rem",
      color: C.midGray,
      marginTop: ".15rem"
    }
  }, (a.service || "").split(" & ")[0], " \xB7 ", a.date)), /*#__PURE__*/React.createElement(Badge, {
    status: a.status
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.25rem 1.75rem",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.1rem",
      fontWeight: 400
    }
  }, "Stylist Performance"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("stylists"),
    style: {
      fontSize: ".75rem",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: C.gold,
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, "Manage \u2192")), stylists.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      padding: "1rem 1.75rem",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: s.img || `https://placehold.co/60x60/2a2418/C9A84C?text=${s.name[0]}`,
    alt: s.name,
    style: {
      width: "40px",
      height: "40px",
      objectFit: "cover",
      borderRadius: "50%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".9rem",
      fontWeight: 500
    }
  }, s.name), /*#__PURE__*/React.createElement(Stars, {
    n: s.rating
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".85rem",
      fontWeight: 600,
      color: C.charcoal
    }
  }, s.bookings), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      color: C.midGray
    }
  }, "bookings")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".7rem",
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: s.available ? "#16a34a" : "#dc2626",
      background: s.available ? "#16a34a15" : "#dc262615",
      padding: ".2rem .6rem",
      borderRadius: "2px"
    }
  }, s.available ? "Active" : "Away")))))), tab === "appointments" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".5rem"
    }
  }, "Bookings"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontWeight: 300
    }
  }, "Appointments")), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: addAppt
  }, "+ New Appointment")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search client, service, stylist\u2026",
    style: {
      flex: 1,
      minWidth: "200px",
      padding: ".7rem 1rem",
      background: "#fff",
      border: `1px solid ${C.border}`,
      fontFamily: "inherit",
      fontSize: ".88rem",
      color: C.charcoal,
      outline: "none",
      borderRadius: "0"
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: statusFilter,
    onChange: e => setStatusFilter(e.target.value),
    style: {
      padding: ".7rem 1rem",
      background: "#fff",
      border: `1px solid ${C.border}`,
      fontFamily: "inherit",
      fontSize: ".88rem",
      color: C.charcoal,
      outline: "none",
      borderRadius: "0",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Statuses"), /*#__PURE__*/React.createElement("option", {
    value: "pending"
  }, "Pending"), /*#__PURE__*/React.createElement("option", {
    value: "confirmed"
  }, "Confirmed"), /*#__PURE__*/React.createElement("option", {
    value: "completed"
  }, "Completed"), /*#__PURE__*/React.createElement("option", {
    value: "cancelled"
  }, "Cancelled"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr .5fr",
      padding: ".75rem 1.5rem",
      borderBottom: `1px solid ${C.border}`,
      fontSize: ".7rem",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.midGray
    }
  }, /*#__PURE__*/React.createElement("span", null, "Client"), /*#__PURE__*/React.createElement("span", null, "Service"), /*#__PURE__*/React.createElement("span", null, "Stylist"), /*#__PURE__*/React.createElement("span", null, "Date"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", null)), filteredAppts.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "3rem",
      textAlign: "center",
      color: C.midGray,
      fontSize: ".9rem"
    }
  }, "No appointments match your filters."), filteredAppts.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr .5fr",
      padding: "1rem 1.5rem",
      borderBottom: `1px solid ${C.border}`,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".9rem",
      fontWeight: 500
    }
  }, a.client), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".78rem",
      color: C.midGray
    }
  }, a.phone)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".85rem",
      color: C.warmGray,
      paddingRight: "1rem"
    }
  }, a.service || " - "), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".85rem",
      color: C.warmGray
    }
  }, a.stylist || "Unassigned"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".82rem",
      color: C.midGray
    }
  }, a.date, /*#__PURE__*/React.createElement("br", null), a.time), /*#__PURE__*/React.createElement(Badge, {
    status: a.status
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setApptModal({
      open: true,
      data: a
    }),
    style: {
      background: "none",
      border: `1px solid ${C.border}`,
      color: C.warmGray,
      padding: ".4rem .7rem",
      cursor: "pointer",
      fontSize: ".75rem",
      letterSpacing: ".08em",
      fontFamily: "inherit"
    }
  }, "Edit"))))), tab === "stylists" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".5rem"
    }
  }, "Team"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontWeight: 300
    }
  }, "Stylist Profiles")), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => setStylistModal({
      open: true,
      data: null
    })
  }, "+ Add Stylist")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1.5rem"
    }
  }, stylists.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: s.img || `https://placehold.co/400x280/2a2418/C9A84C?text=${encodeURIComponent(s.name)}`,
    alt: s.name,
    style: {
      width: "100%",
      aspectRatio: "4/3",
      objectFit: "cover",
      display: "block",
      filter: "sepia(.15) saturate(.9)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: ".75rem",
      right: ".75rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".68rem",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      background: s.available ? "#16a34a" : "#6b7280",
      color: "#fff",
      padding: ".25rem .65rem",
      borderRadius: "2px"
    }
  }, s.available ? "Available" : "Away"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.25rem 1.5rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: ".4rem"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.15rem",
      fontWeight: 400
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: ".3rem"
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    n: s.rating
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".75rem",
      color: C.midGray
    }
  }, s.rating))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".75rem",
      letterSpacing: ".09em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".75rem"
    }
  }, s.role), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: ".84rem",
      color: C.midGray,
      lineHeight: 1.65,
      marginBottom: "1rem"
    }
  }, s.bio), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: ".35rem",
      marginBottom: "1.1rem"
    }
  }, (s.specialties || []).map((sp, i) => /*#__PURE__*/React.createElement(Pill, {
    key: i
  }, sp))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: ".75rem",
      borderTop: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".8rem",
      color: C.midGray
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.charcoal
    }
  }, s.bookings), " bookings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: ".5rem"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    style: {
      padding: ".45rem .9rem",
      fontSize: ".72rem"
    },
    onClick: () => setStylistModal({
      open: true,
      data: s
    })
  }, "Edit"), /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    style: {
      padding: ".45rem .9rem",
      fontSize: ".72rem"
    },
    onClick: () => {
      if (window.confirm(`Remove ${s.name}?`)) deleteStylist(s.id);
    }
  }, "Remove")))))))), tab === "services" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".5rem"
    }
  }, "Menu"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontWeight: 300
    }
  }, "Services")), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => setServiceModal({
      open: true,
      data: null
    })
  }, "+ Add Service")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr .5fr",
      padding: ".75rem 1.5rem",
      borderBottom: `1px solid ${C.border}`,
      fontSize: ".7rem",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.midGray
    }
  }, /*#__PURE__*/React.createElement("span", null, "Service"), /*#__PURE__*/React.createElement("span", null, "Price"), /*#__PURE__*/React.createElement("span", null, "Duration"), /*#__PURE__*/React.createElement("span", null)), services.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "3rem",
      textAlign: "center",
      color: C.midGray,
      fontSize: ".9rem"
    }
  }, "No services yet. Click \"+ Add Service\" to create one."), services.map(sv => /*#__PURE__*/React.createElement("div", {
    key: sv.id,
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr .5fr",
      padding: "1rem 1.5rem",
      borderBottom: `1px solid ${C.border}`,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".9rem",
      fontWeight: 500
    }
  }, sv.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".78rem",
      color: C.midGray
    }
  }, (sv.description || "").slice(0, 60))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".88rem",
      color: C.charcoal
    }
  }, "\u20A6", (sv.price_naira || 0).toLocaleString()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".85rem",
      color: C.midGray
    }
  }, sv.duration_minutes, " min"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setServiceModal({
      open: true,
      data: sv
    }),
    style: {
      background: "none",
      border: `1px solid ${C.border}`,
      color: C.warmGray,
      padding: ".4rem .7rem",
      cursor: "pointer",
      fontSize: ".75rem",
      letterSpacing: ".08em",
      fontFamily: "inherit"
    }
  }, "Edit"))))), tab === "products" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".72rem",
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: ".5rem"
    }
  }, "Shop"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "2rem",
      fontWeight: 300
    }
  }, "Products")), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: () => setProductModal({
      open: true,
      data: null
    })
  }, "+ Add Product")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "1.5rem"
    }
  }, products.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1/-1",
      padding: "3rem",
      textAlign: "center",
      color: C.midGray,
      background: "#fff",
      border: `1px solid ${C.border}`
    }
  }, "No products yet. Click \"+ Add Product\" to create one."), products.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      background: "#fff",
      border: `1px solid ${C.border}`,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img || `https://placehold.co/300x300/ede8de/8B6914?text=${encodeURIComponent(p.name)}`,
    alt: p.name,
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: ".6rem",
      right: ".6rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".65rem",
      letterSpacing: ".08em",
      textTransform: "uppercase",
      background: p.active ? "#16a34a" : "#6b7280",
      color: "#fff",
      padding: ".2rem .55rem",
      borderRadius: "2px"
    }
  }, p.active ? "Live" : "Hidden"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem 1.1rem"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1rem",
      fontWeight: 400,
      marginBottom: ".3rem"
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: ".78rem",
      color: C.midGray,
      lineHeight: 1.5,
      marginBottom: ".75rem",
      minHeight: "2.2em"
    }
  }, (p.description || "").slice(0, 70)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Georgia, serif",
      fontSize: "1.05rem",
      color: C.charcoal
    }
  }, "\u20A6", (p.price_naira || 0).toLocaleString()), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    style: {
      padding: ".4rem .8rem",
      fontSize: ".7rem"
    },
    onClick: () => setProductModal({
      open: true,
      data: p
    })
  }, "Edit")))))))), /*#__PURE__*/React.createElement(StylistModal, {
    open: stylistModal.open,
    onClose: () => setStylistModal({
      open: false,
      data: null
    }),
    stylist: stylistModal.data,
    onSave: saveStylist
  }), /*#__PURE__*/React.createElement(ServiceModal, {
    open: serviceModal.open,
    onClose: () => setServiceModal({
      open: false,
      data: null
    }),
    service: serviceModal.data,
    onSave: saveService,
    onDelete: deleteService
  }), /*#__PURE__*/React.createElement(ProductModal, {
    open: productModal.open,
    onClose: () => setProductModal({
      open: false,
      data: null
    }),
    product: productModal.data,
    onSave: saveProduct,
    onDelete: deleteProduct
  }), /*#__PURE__*/React.createElement(ApptModal, {
    open: apptModal.open,
    onClose: () => setApptModal({
      open: false,
      data: null
    }),
    appt: apptModal.data,
    stylists: stylists,
    services: services,
    onSave: saveAppt,
    onDelete: deleteAppt
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: "1.75rem",
      right: "1.75rem",
      background: C.charcoal,
      color: C.cream,
      padding: ".9rem 1.5rem",
      borderLeft: `3px solid ${C.gold}`,
      fontSize: ".88rem",
      zIndex: 2000,
      boxShadow: "0 8px 32px rgba(0,0,0,.25)"
    }
  }, "\u2713 ", toast));
}

// ── Root: auth gate ──────────────────────────────────────────────────
function Root() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    db.auth.getSession().then(({
      data
    }) => setSession(data.session));
    const {
      data: listener
    } = db.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => listener.subscription.unsubscribe();
  }, []);
  if (session === undefined) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        color: C.warmGray
      }
    }, "Loading\u2026");
  }
  if (!session) {
    return /*#__PURE__*/React.createElement(Login, {
      onLoggedIn: () => {}
    });
  }
  return /*#__PURE__*/React.createElement(Dashboard, null);
}

export default Root;
