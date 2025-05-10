// hooks/useDeleteDialog.ts
import { useState } from "react";

export function useDeleteDialog<T = unknown>() {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const askDelete = (item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const cancel = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const confirm = () => {
    setIsOpen(false);
    const item = itemToDelete;
    setItemToDelete(null);
    return item;
  };

  return {
    isOpen,
    itemToDelete,
    askDelete,
    cancel,
    confirm,
    setIsOpen,
  };
}
