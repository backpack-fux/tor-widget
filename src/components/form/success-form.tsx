import React, { useEffect, useState } from "react";
import { Modal, ModalContent } from "@nextui-org/modal";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  fadeOutOpts: {
    autoFadeOut?: boolean;
    fadeoutTime?: number;
  };
};

export default function SuccessForm({
  isOpen,
  onClose,
  title,
  message,
  fadeOutOpts: { autoFadeOut = false, fadeoutTime = 3000 },
}: SuccessModalProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoFadeOut) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.max(
          0,
          100 - (elapsedTime / fadeoutTime) * 100
        );
        setProgress(newProgress);

        if (newProgress === 0) {
          clearInterval(timer);
          onClose();
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose, autoFadeOut, fadeoutTime]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="sm"
          classNames={{
            base: "bg-background",
            header: "border-b-[1px] border-default-200",
            footer: "border-t-[1px] border-default-200",
            closeButton: "hover:bg-white/5 active:bg-white/10",
          }}
        >
          <ModalContent>
            {() => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  {title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center text-foreground-500 mb-4"
                >
                  {message}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-full"
                >
                  <Button
                    color="primary"
                    variant="shadow"
                    onPress={onClose}
                    className="w-full mb-4"
                  >
                    Close
                  </Button>
                  {autoFadeOut && (
                    <Progress
                      aria-label="Auto-close progress"
                      size="sm"
                      value={progress}
                      color="success"
                      className="max-w-md"
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
}
