"use client";

import CreateJobModal from "@/components/modals/create-job-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateJobModal />
    </>
  );
};

export default ModalProvider;
