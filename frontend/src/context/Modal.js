import React, { useRef } from "react";

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();

  return (
    <>
      <ModalContext.Provider>{children}</ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}
