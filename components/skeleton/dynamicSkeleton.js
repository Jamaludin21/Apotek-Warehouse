import { Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";

export const DynamicSkeleton = () => {
  const containerRef = useRef(null);
  const [rows, setRows] = useState(10); // default

  useEffect(() => {
    const updateRows = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        const rowHeight = 24; // estimate height of one row
        const maxRows = Math.floor(height / rowHeight);
        setRows(maxRows);
      }
    };

    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "100%", minHeight: 300 }}>
      <Skeleton active paragraph={{ rows }} />
    </div>
  );
};
