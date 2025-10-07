// components/common/ListPageWrapper.tsx
import { ReactNode } from "react";

interface ListPageWrapperProps {
  title: string;
  children: ReactNode;
  rightActions?: ReactNode;
}

export default function ListPageWrapper({ title, children, rightActions }: ListPageWrapperProps) {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>{title}</h5>
        <div>{rightActions}</div>
      </div>
      <div className="card-body p-0">{children}</div>
    </div>
  );
}
