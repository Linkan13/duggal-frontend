import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SidebarContextType = {
  isExpanded: boolean;              // Sidebar expanded on desktop
  isMobileOpen: boolean;            // Sidebar open on mobile
  isHovered: boolean;               // Hover state
  activeItem: string | null;        // Currently active item
  openSubmenu: string | null;       // Currently open submenu
  toggleSidebar: () => void;        // Toggle desktop sidebar
  toggleMobileSidebar: () => void;  // Toggle mobile sidebar
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle desktop sidebar
  const toggleSidebar = () => {
    if (!isMobile) setIsExpanded(prev => !prev);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    if (isMobile) setIsMobileOpen(prev => !prev);
  };

  // Toggle submenu
  const toggleSubmenu = (item: string) => {
    setOpenSubmenu(prev => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
