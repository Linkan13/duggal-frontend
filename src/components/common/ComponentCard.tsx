interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      {title && (
        <div className="card-header">
          <h5 className="card-title mb-1">{title}</h5>
          {desc && <p className="card-text text-muted mb-0">{desc}</p>}
        </div>
      )}

      {/* Card Body */}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default ComponentCard;
