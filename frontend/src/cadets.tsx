import React, { useEffect, useState } from "react";
import "./cadets.css";
import Filter from "./components/filter";
import CadetDetails from './components/CadetDetails';

interface Cadet {
  regimentalNo: string;
  rank: string;
  name: string;
  platoon: string;
  credit: number;
  bio: string;
  enrollmentYear: string;
  gender: string;
}

const CadetsList: React.FC = () => {
  const [cadets, setCadets] = useState<Cadet[]>([]);
  const [selectedCadet, setSelectedCadet] = useState<Cadet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedPlatoon, setSelectedPlatoon] = useState<string>('all');

  useEffect(() => {
    console.log("Fetching cadets from backend...");
    setIsLoading(true);
    fetch("http://localhost:5001/cadets")
      .then((res) => res.json())
      .then((data) => {
        console.log("Cadets received from backend:", data);
        setCadets(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cadets:", err);
        setError("Failed to load cadets");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="loading">Loading cadets...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Get unique years, genders, and platoons for filters
  const years = [...new Set(cadets.map(cadet => cadet.enrollmentYear))].sort();
  const genders = [...new Set(cadets.map(cadet => cadet.gender))];
  const platoons = [...new Set(cadets.map(cadet => cadet.platoon))].sort();


  // Filter cadets based on selections
  const filteredCadets = cadets.filter(cadet => {
    const yearMatch = selectedYear === 'all' || cadet.enrollmentYear === selectedYear;
    const genderMatch = selectedGender === 'all' || cadet.gender === selectedGender;
    const platoonMatch = selectedPlatoon === 'all' || cadet.platoon === selectedPlatoon;
    return yearMatch && genderMatch && platoonMatch;
  });

  return (
    <div className="cadets-container">
      <h1>NCC Cadets</h1>

      {/* Updated Filters section */}
      <div className="filters">
        <Filter
          options={years}
          onChange={setSelectedYear}
          defaultValue="all"
          label="Years"
        />

        <Filter
          options={genders}
          onChange={setSelectedGender}
          defaultValue="all"
          label="Genders"
        />

        <Filter
          options={platoons}
          onChange={setSelectedPlatoon}
          defaultValue="all"
          label="Platoons"
        />
      </div>

      <div className="content-wrapper">
        <ul className="cadets-list">
          {filteredCadets.map((cadet) => (
            <li
              key={cadet.regimentalNo}
              onClick={() => setSelectedCadet(cadet)}
              className={`cadet-item ${selectedCadet?.regimentalNo === cadet.regimentalNo ? 'selected' : ''}`}
            >
              {cadet.rank} {cadet.name}
            </li>
          ))}
        </ul>

        {selectedCadet && <CadetDetails cadet={selectedCadet} />}
      </div>
    </div>
  );
};

export default CadetsList;
