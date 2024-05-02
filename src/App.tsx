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
  const searchParams = new URLSearchParams(window.location.search);
  const viewDesign = searchParams.get("viewDesign");

  return (
    <div className="root">
      <DesignView designId={viewDesign ? +viewDesign : 0} />
    </div>
  );
}

export default App;
