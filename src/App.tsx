import "./App.css";
import { useApp } from "./components/AppProvider";
import { CartView } from "./components/CartView";
import { ComparisonArea } from "./components/ComparisonArea";
import { ComparisonBar } from "./components/ComparisonBar";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { DesignView } from "./components/DesignView";
import { FilterModal } from "./components/FilterModal";
import { Lightbox } from "./components/Lightbox";
import { DesignModalDisplay, Modal } from "./components/Modal";
import { SearchArea } from "./components/SearchArea";

function App() {
  const { modalDisplay, lightboxData, setLightboxData, compareModeData } =
    useApp();
  const searchParams = new URLSearchParams(window.location.search);
  const viewDesign = searchParams.get("viewDesign");
  const viewCart = searchParams.get("viewCart");

  if (viewCart === "true")
    return (
      <div className="root">
        <CartView />
      </div>
    );

  if (viewDesign && !isNaN(+viewDesign))
    return (
      <div className="root">
        <DesignPage designId={+viewDesign} />
        {lightboxData && setLightboxData && (
          <Lightbox
            data={lightboxData}
            onClickClose={() => setLightboxData(null)}
          />
        )}
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
      {modalDisplay === "comparison" && (
        <Modal maxHeight={730}>
          <ComparisonArea />
        </Modal>
      )}
      {lightboxData && setLightboxData && (
        <Lightbox
          data={lightboxData}
          onClickClose={() => setLightboxData(null)}
        />
      )}
      {compareModeData?.active && <ComparisonBar />}
    </div>
  );
}

export default App;
