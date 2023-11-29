import { FeaturedDesigns } from "./FeaturedDesigns";
import { SearchArea } from "./SearchArea";
import { Link } from "react-router-dom";
import styles from "./styles/Home.module.css";
import { useState } from "react";
import { SearchModal } from "./SearchModal";

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`inner-body ${styles["main"]}`}>
      <div>
        <h1>Union Designs For Every Occasion</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, qui
          odio? Perspiciatis fuga asperiores molestiae dolore aut, excepturi,
          ipsum vero necessitatibus voluptatum doloremque quae reiciendis, quo
          architecto quaerat autem a!
        </p>
        <SearchArea setModalOpen={setModalOpen} />
        <FeaturedDesigns />
        <div className={styles["buttons-flex"]}>
          <Link className="link-black" to="/designs">
            View Design Library
          </Link>
          <Link to="/">Art Services</Link>
        </div>
        {modalOpen && (
          <SearchModal clickAwayFunction={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
