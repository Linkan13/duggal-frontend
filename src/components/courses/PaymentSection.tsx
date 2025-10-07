// PaymentSection.tsx
import { useState, useCallback, useMemo } from "react";
import { Installment } from "../../types";
import DatePicker from "../form/date-picker";
import Swal from "sweetalert2";

interface PaymentSectionProps {
  totalFees: number;
  setTotalFees: (fees: number) => void;
  installments: Installment[];
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
  onInstallmentsChange?: (installments: Installment[]) => void;
}

export default function PaymentSection({
  totalFees,
  installments,
  setInstallments,
  onInstallmentsChange,
}: PaymentSectionProps) {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; dueDate?: string }>(
    {}
  );

  // Format date for UI
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date || date === "0" || date === "0000-00-00") return "-";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!amount) newErrors.amount = "Amount is required";
    else if (isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Amount must be a positive number";

    if (!dueDate) newErrors.dueDate = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add installment
  const handleAddInstallment = () => {
    if (!validate()) return;

    const newInstallment: Installment = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      dueDate: dueDate!.toISOString().split("T")[0],
      paid: false,
      comment,
    };

    const newInstallments = [...installments, newInstallment];
    setInstallments(newInstallments);
    onInstallmentsChange?.(newInstallments);

    setAmount("");
    setDueDate(null);
    setComment("");
    setErrors({});
  };

  // Mark as paid
  const markAsPaid = (id: string, method: "cash" | "online") => {
    const newInstallments = installments.map((inst) =>
      inst.id === id
        ? {
            ...inst,
            paid: true,
            paymentDate: new Date().toISOString(),
            paymentMethod: method,
          }
        : inst
    );
    setInstallments(newInstallments);
    onInstallmentsChange?.(newInstallments);
  };

  // Remove installment with confirmation
  const removeInstallment = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 🤔",
        text: "This installment will be permanently removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        const newInstallments = installments.filter((inst) => inst.id !== id);
        setInstallments(newInstallments);
        onInstallmentsChange?.(newInstallments);
      }
    },
    [installments, setInstallments, onInstallmentsChange]
  );

  // ✅ Normalize installments from DB/user input
  const normalizedInstallments = useMemo(
    () =>
      installments.map((i) => ({
        ...i,
        amount: Number(i.amount) || 0,
        paid: Boolean(i.paid),
      })),
    [installments]
  );

  // Calculations
  const totalPlanned = normalizedInstallments
    .filter((i) => !i.paid)
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = normalizedInstallments
    .filter((i) => i.paid)
    .reduce((sum, i) => sum + i.amount, 0);

  const balance = totalFees - totalPaid;

  console.log("Planned:", totalPlanned);
  console.log("Paid:", totalPaid);
  console.log("Balance:", balance);

  return (
    <>
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm border rounded p-3 text-center h-80 bg-light">
            <h6 className="text-muted mb-2">💰 Total Fees</h6>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="h5 mb-0">💵 ₹{totalFees.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border rounded p-3 text-center h-80 bg-warning bg-opacity-10">
            <h6 className="text-muted mb-2">📝 Planned</h6>
            <span className="h5 mb-0">📅 ₹{totalPlanned.toLocaleString()}</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border rounded p-3 text-center h-80 bg-success bg-opacity-10">
            <h6 className="text-muted mb-2">💸 Paid</h6>
            <span className="h5 mb-0">✅ ₹{totalPaid.toLocaleString()}</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border rounded p-3 text-center h-80 bg-danger bg-opacity-10">
            <h6 className="text-muted mb-2">⚖️ Balance</h6>
            <span className="h5 mb-0">💰 ₹{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border rounded p-3 h-80">
            <h6 className="fw-bold mb-4 pb-2 border-bottom">
              ➕ Add Installment
            </h6>

            <div className="mb-3">
              <label className="form-label small">💰 Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`form-control form-control-md ${
                  errors.amount ? "is-invalid" : ""
                }`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label small">📅 Due Date</label>
              <DatePicker
                id="due-date"
                value={dueDate ? [dueDate] : []}
                className="form-control rounded-start rounded-0"
                onChange={(dates) => setDueDate(dates[0] || null)}
              />
              {errors.dueDate && (
                <div className="text-danger small mt-1">{errors.dueDate}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label small">💬 Comment</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control form-control-md"
                placeholder="Optional"
              />
            </div>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-soft-primary btn-md"
                onClick={handleAddInstallment}
                disabled={
                  !amount || !dueDate || !!errors.amount || !!errors.dueDate
                }
              >
                ➕ Add Installment
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border rounded p-3 h-80">
            <h6 className="fw-bold mb-4 pb-2 border-bottom">📋 Installments</h6>
            <div className="list-group">
              {normalizedInstallments.map((inst) => (
                <div
                  key={inst.id}
                  className={`list-group-item d-flex justify-content-between align-items-start mb-2 shadow-sm rounded border ${
                    inst.paid ? "border-success" : "border-warning"
                  }`}
                >
                  <div>
                    <h6
                      className={`mb-1 ${
                        inst.paid ? "text-success" : "text-warning"
                      }`}
                    >
                      💰 ₹{inst.amount.toLocaleString()}
                    </h6>
                    <small className="d-block text-muted">
                      📅 Due: {formatDate(inst.dueDate)}
                    </small>
                    {inst.comment && (
                      <small className="d-block text-muted">
                        💬 {inst.comment}
                      </small>
                    )}
                    {inst.paid && (
                      <small className="d-block text-success">
                        ✅ Paid ({inst.paymentMethod || "-"}) on{" "}
                        {formatDate(inst.paymentDate)}
                      </small>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-1">
                    {!inst.paid ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => markAsPaid(inst.id, "cash")}
                        >
                          💵 Cash
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => markAsPaid(inst.id, "online")}
                        >
                          🌐 Online
                        </button>
                      </>
                    ) : null}

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeInstallment(inst.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
