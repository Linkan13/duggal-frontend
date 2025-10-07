// components/common/ActionButtons.tsx
import { Eye, Pencil, Trash } from "tabler-icons-react";

interface ActionButtonsProps {
  id: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ActionButtons({ id, onView, onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="action-icon d-inline-flex gap-2">
      <button className="text-green-600" onClick={() => onView(id)}>
        <Eye size={18} />
      </button>
      <button className="text-blue-600" onClick={() => onEdit(id)}>
        <Pencil size={18} />
      </button>
      <button className="text-red-600" onClick={() => onDelete(id)}>
        <Trash size={18} />
      </button>
    </div>
  );
}
