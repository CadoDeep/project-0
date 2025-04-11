import React from 'react';
import { Cadet } from '../types/cadet';
interface CadetDetailsProps {
    cadet: Cadet;
}

const CadetDetails: React.FC<CadetDetailsProps> = ({ cadet }) => {
    return (
        <div className="cadet-details">
            <h2>{cadet.rank} {cadet.name}</h2>
            <p><strong>Platoon:</strong> {cadet.platoon}</p>
            <p><strong>Regt-No:</strong> {cadet.regimentalNo}</p>
            <p><strong>Enrollment Year:</strong> {cadet.enrollmentYear}</p>
            <p><strong>Gender:</strong> {cadet.gender}</p>
            <p><strong>Credit:</strong> {cadet.credit}</p>
            <p><strong>Bio:</strong> {cadet.bio}</p>
        </div>
    );
};

export default CadetDetails;