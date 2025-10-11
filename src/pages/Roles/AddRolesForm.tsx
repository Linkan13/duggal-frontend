import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  getRoleByIdRequest,
  createRoleRequest,
  updateRoleRequest,
} from "@/client/endpoints/roleService";
import { listPermissionRequest } from "@/client/endpoints/permissionService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// ---------------------- Types -----------------------
type PermissionAction = "create" | "read" | "update" | "delete";

interface ModulePermission {
  module: string;
  allowAll: boolean;
  actions: Record<PermissionAction, boolean>;
}

interface RoleData {
  name: string;
  description?: string;
  active: boolean;
  role_permissions: string; // JSON string
}

// ---------------------- Component -----------------------
export default function AddRolesForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [permission, setpermission] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [roleData, setRoleData] = useState<RoleData>({
    name: "",
    description: "",
    active: true,
    role_permissions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------- Fetch permission from DB -----------------------
  useEffect(() => {
    const fetchpermission = async () => {
      try {
        const moduleList: string[] = await listPermissionRequest({
          skip: 0,
          size: 100,
        });
        setpermission(moduleList);

        // Initialize permissions for all modules
        setPermissions(
          moduleList.map((m) => ({
            module: m,
            allowAll: false,
            actions: {
              create: false,
              read: false,
              update: false,
              delete: false,
            },
          }))
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to load permissions.";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      }
    };
    fetchpermission();
  }, []);

  // ---------------------- Fetch Role from DB -----------------------
  useEffect(() => {
    if (!id || permission.length === 0) return; // wait for permissions to load

    const fetchRole = async () => {
      setLoading(true);
      try {
        const role = await getRoleByIdRequest(id);

        setRoleData({
          name: role.name,
          description: role.description,
          active: role.active,
          role_permissions: role.role_permissions,
        });

        // Parse permissions JSON
        const perms: ModulePermission[] = JSON.parse(role.role_permissions);

        // Merge DB permission with role permissions
        const mergedPerms = permission.map((m) => {
          const found = perms.find((p) => p.module === m);
          return (
            found || {
              module: m,
              allowAll: false,
              actions: {
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            }
          );
        });

        setPermissions(mergedPerms);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load role.";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id, permission]);

  // ---------------------- Handlers -----------------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setRoleData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePermissionChange = (
    moduleIndex: number,
    action: PermissionAction | "allowAll"
  ) => {
    setPermissions((prev) =>
      prev.map((perm, idx) => {
        if (idx !== moduleIndex) return perm;

        if (action === "allowAll") {
          const newAllowAll = !perm.allowAll;
          return {
            ...perm,
            allowAll: newAllowAll,
            actions: Object.fromEntries(
              Object.keys(perm.actions).map((a) => [a, newAllowAll])
            ) as Record<PermissionAction, boolean>,
          };
        }

        return {
          ...perm,
          actions: { ...perm.actions, [action]: !perm.actions[action] },
          allowAll: Object.values({
            ...perm.actions,
            [action]: !perm.actions[action],
          }).every(Boolean),
        };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roleData.name) {
      const msg = "Role name is required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    const rolePayload = {
      ...roleData,
      role_permissions: JSON.stringify(permissions),
    };

    setLoading(true);
    try {
      if (id) {
        await updateRoleRequest(id, rolePayload);
        setAlertMessage("Role updated successfully!");
        showMessage("Role updated successfully!", MESSAGE_TYPE.SUCCESS);
      } else {
        await createRoleRequest(rolePayload);
        setAlertMessage("Role added successfully!");
        showMessage("Role added successfully!", MESSAGE_TYPE.SUCCESS);
      }
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

  // ---------------------- UI -----------------------
  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle={id ? "✏️ Edit Role" : "🛡️ Add New Role"} />
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
          {/* Role info */}
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
                className="form-check-input"
                id="active"
                name="active"
                checked={roleData.active}
                onChange={handleChange}
              />
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

          {/* Permissions Table */}
          <div className="card mt-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5>Permissions</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Module</th>
                      <th>Allow All</th>
                      <th>Create</th>
                      <th>Read</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, i) => (
                      <tr key={perm.module}>
                        <td>{perm.module}</td>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={perm.allowAll}
                            onChange={() =>
                              handlePermissionChange(i, "allowAll")
                            }
                          />
                        </td>
                        {Object.keys(perm.actions).map((action) => (
                          <td key={action}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={perm.actions[action as PermissionAction]}
                              onChange={() =>
                                handlePermissionChange(
                                  i,
                                  action as PermissionAction
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Saving..." : id ? "✏️ Update Role" : "➕ Add Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
