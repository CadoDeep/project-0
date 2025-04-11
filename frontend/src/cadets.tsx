import React, { useEffect, useState } from "react";
import "./cadets.css";

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
      
      {/* Filters at the top */}
      <div className="filters">
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select 
          value={selectedGender} 
          onChange={(e) => setSelectedGender(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Genders</option>
          {genders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>

        <select 
          value={selectedPlatoon} 
          onChange={(e) => setSelectedPlatoon(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Platoons</option>
          {platoons.map(platoon => (
            <option key={platoon} value={platoon}>{platoon}</option>
          ))}
        </select>
      </div>
      
      {/* Content wrapper for list and details */}
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
        
        {selectedCadet && (
          <div className="cadet-details">
            <h2>{selectedCadet.rank} {selectedCadet.name}</h2>
            <p><strong>Platoon:</strong> {selectedCadet.platoon}</p>
            <p><strong>Regt-No:</strong> {selectedCadet.regimentalNo}</p>
            <p><strong>Enrollment Year:</strong> {selectedCadet.enrollmentYear}</p>
            <p><strong>Gender:</strong> {selectedCadet.gender}</p>
            <p><strong>Credit:</strong> {selectedCadet.credit}</p>
            <p><strong>Bio:</strong> {selectedCadet.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadetsList;
