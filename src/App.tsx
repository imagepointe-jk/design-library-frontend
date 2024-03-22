import "./App.css";
import { useApp } from "./components/AppProvider";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { DesignView } from "./components/DesignView";
import { FilterModal } from "./components/FilterModal";
import { DesignModalDisplay, Modal } from "./components/Modal";
import { SearchArea } from "./components/SearchArea";

function App() {
  const { modalDisplay } = useApp();
  const searchParams = new URLSearchParams(window.location.search);
  const viewDesign = searchParams.get("viewDesign");

  if (viewDesign && !isNaN(+viewDesign))
    return <DesignPage designId={+viewDesign} />;

  return (
    <div>
      <DesignLibrary />
      {modalDisplay instanceof DesignModalDisplay && (
        <Modal>
          <DesignView designId={modalDisplay.designId} />
        </Modal>
      )}
      {modalDisplay === "search" && (
        <Modal>
          <SearchArea />
        </Modal>
      )}
      {modalDisplay === "filters" && <FilterModal />}
    </div>
  );
}

export default App;
