import "./App.css";
import { useApp } from "./components/AppProvider";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { DesignView } from "./components/DesignView";
import { FilterModal } from "./components/FilterModal";
import { Lightbox } from "./components/Lightbox";
import { DesignModalDisplay, Modal } from "./components/Modal";
import { SearchArea } from "./components/SearchArea";

function App() {
  const { modalDisplay, lightboxData, setLightboxData } = useApp();
  const searchParams = new URLSearchParams(window.location.search);
  const viewDesign = searchParams.get("viewDesign");

  if (viewDesign && !isNaN(+viewDesign))
    return (
      <div className="root">
        <DesignPage designId={+viewDesign} />
      </div>
    );

  return (
    <div className="root">
      <DesignLibrary />
      {modalDisplay instanceof DesignModalDisplay && (
        <Modal heightType="tall">
          <DesignView designId={modalDisplay.designId} />
        </Modal>
      )}
      {modalDisplay === "search" && (
        <Modal>
          <SearchArea />
        </Modal>
      )}
      {modalDisplay === "filters" && <FilterModal />}
      {lightboxData && setLightboxData && (
        <Lightbox
          data={lightboxData}
          onClickClose={() => setLightboxData(null)}
        />
      )}
    </div>
  );
}

export default App;
