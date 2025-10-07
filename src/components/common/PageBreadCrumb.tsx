import { Link } from "react-router";
import { Home } from "tabler-icons-react";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <>
      <div className="my-auto mb-2">
        <h5 className="mb-1">{pageTitle}</h5>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="https://smarthr.co.in/demo/html/template/index.html">
                <Home size={11} strokeWidth={2} color="currentColor" />
              </a>
            </li>
            <li className="breadcrumb-item">
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Administration
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {pageTitle}
            </li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default PageBreadcrumb;
