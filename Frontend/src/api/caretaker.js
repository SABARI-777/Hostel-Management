import { API, getAuthHeaders } from "./auth";

/* ================= CARETAKER ================= */

export const getCaretakerDashboardStats = (caretakerId) =>
  fetch(`${API}/caretaker/dashboard/stats`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ caretakerId }),
  }).then((res) => res.json());

export const approvePass = (id, type) =>
  fetch(`${API}/caretaker/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, Type: type }),
  }).then((res) => res.json());

export const cancelPass = (id, type) =>
  fetch(`${API}/caretaker/cancel`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, Type: type }),
  }).then((res) => res.json());

export const markEntry = (id, type) =>
  fetch(`${API}/caretaker/mark-entry`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, Type: type }),
  }).then((res) => res.json());

export const getCaretakerStudents = (caretakerId) =>
  fetch(`${API}/caretaker/students`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ caretakerId }),
  }).then((res) => res.json());

export const getCaretakerPasses = (caretakerId) =>
  fetch(`${API}/caretaker/passes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ caretakerId }),
  }).then((res) => res.json());

export const getCaretakerAttendance = (caretakerId) =>
  fetch(`${API}/caretaker/attendance`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ caretakerId }),
  }).then((res) => res.json());

export const getCaretakerPlacementAttendance = (caretakerId) =>
  fetch(`${API}/caretaker/placement-attendance`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ caretakerId }),
  }).then((res) => res.json());

export const updateCaretakerProfile = (data) =>
  fetch(`${API}/caretaker/update-profile`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getCaretakerDetails = (id) =>
  fetch(`${API}/caretaker/profile/details`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id }),
  }).then((res) => res.json());

export const addStudent = (data) =>
  fetch(`${API}/caretaker/student/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const updateStudent = (data) =>
  fetch(`${API}/caretaker/student/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteStudent = (id, caretakerId) =>
  fetch(`${API}/caretaker/student/delete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, caretakerId }),
  }).then((res) => res.json());

/* ================= ATTENDANCE ================= */

export const addAttendance = (data) =>
  fetch(`${API}/caretaker/attendance/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const updateAttendance = (data) =>
  fetch(`${API}/caretaker/attendance/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteAttendance = (id, caretakerId) =>
  fetch(`${API}/caretaker/attendance/delete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, caretakerId }),
  }).then((res) => res.json());

/* ================= PLACEMENT ================= */

export const addPlacementAttendance = (data) =>
  fetch(`${API}/caretaker/placement-attendance/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const updatePlacementAttendance = (data) =>
  fetch(`${API}/caretaker/placement-attendance/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deletePlacementAttendance = (id, caretakerId) =>
  fetch(`${API}/caretaker/placement-attendance/delete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ _id: id, caretakerId }),
  }).then((res) => res.json());