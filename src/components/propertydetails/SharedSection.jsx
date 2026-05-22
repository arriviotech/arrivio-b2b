import React from 'react';
import { Users } from 'lucide-react';
import UnitTypeCard from './UnitTypeCard';

const SharedSection = ({ property, sharedOptions = [] }) => {
  if (sharedOptions.length === 0) return null;

  return (
    <div className="space-y-5">
      {sharedOptions.map((option, i) => {
        const optionUnits = option.units || [];
        const unitTypeKey = optionUnits[0]?.unit_type;
        if (!unitTypeKey) return null;

        return (
          <UnitTypeCard
            key={i}
            property={property}
            units={optionUnits}
            unitTypeKey={unitTypeKey}
            title={option.title}
            description={option.description}
            icon={Users}
          />
        );
      })}
    </div>
  );
};

export default SharedSection;
