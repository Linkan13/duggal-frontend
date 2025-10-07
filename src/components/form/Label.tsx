import { FC, ReactNode } from "react";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "form-label", // Bootstrap class for labels
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;
