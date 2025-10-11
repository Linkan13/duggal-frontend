// pages/Roles/EditRoleForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { getRoleByIdRequest, updateRoleRequest } from "@/client/endpoints/roleService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface RoleData {
  id?: string;
  name: string;
  role_permissions: string; // JSON string
  description?: string;
  active: boolean;
}

export default function EditRoleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [roleData, setRoleData] = useState<RoleData>({
    id: "",
    name: "",
    role_permissions: '{"permissions":[]}',
    description: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== Fetch Role Data =====
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const res = await getRoleByIdRequest(id!);
        setRoleData({
          id: res?.data?.id,
          name: res?.data?.name,
          role_permissions: JSON.stringify(res?.data?.role_permissions, null, 2),
          description: res?.data?.description || "",
          active: res?.data?.active ?? true,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load role.";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRole();
  }, [id]);

  // ===== Handle Input Change =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setRoleData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // ===== Handle Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roleData.name) {
      const msg = "Role name is required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    try {
      JSON.parse(roleData.role_permissions); // validate JSON
    } catch {
      const msg = "Invalid JSON format in role permissions.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    try {
      await updateRoleRequest(roleData.id!, {
        name: roleData.name,
        role_permissions: roleData.role_permissions,
        description: roleData.description,
        active: roleData.active,
      });
      setAlertMessage("Role updated successfully!");
      showMessage("Role updated successfully!", MESSAGE_TYPE.SUCCESS);
      navigate("/roles");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !roleData.name || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="✏️ Edit Role" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/roles")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Role Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={roleData.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="active" className="form-label d-block">
                Active
              </label>
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={roleData.active}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="role_permissions" className="form-label">
                Role Permissions (JSON)
              </label>
              <textarea
                id="role_permissions"
                name="role_permissions"
                className="form-control"
                rows={4}
                value={roleData.role_permissions}
                onChange={handleChange}
              />
              <small className="text-muted">
                Example: {"{ \"permissions\": [\"create_user\", \"delete_user\"] }"}
              </small>
            </div>

            <div className="col-md-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={3}
                value={roleData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Updating..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
