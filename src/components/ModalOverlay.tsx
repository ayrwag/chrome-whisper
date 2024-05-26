import ReactDOM from "react-dom"
const ModalOverlay = ({ children }: { children: React.ReactNode }) => {
  const portalRoot = document.getElementById("modal-placeholder")
  if(portalRoot)
  return ReactDOM.createPortal(
    children,
    portalRoot
  )
  else return (
    <div>
        Error loading portal.
    </div>
  )
};

export default ModalOverlay;
