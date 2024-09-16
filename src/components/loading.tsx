import { Spinner } from "@nextui-org/spinner";
import { useEffect } from "react";

export default function LoadingOverlay() {
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Spinner size="lg" color="white" />
    </div>
  );
}
