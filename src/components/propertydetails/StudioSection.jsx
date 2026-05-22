import React from 'react';
import { User } from 'lucide-react';
import UnitTypeCard from './UnitTypeCard';

const StudioSection = ({ property, units = [] }) => {
  if (units.length === 0) return null;

  return (
    <UnitTypeCard
      property={property}
      units={units}
      unitTypeKey="studio"
      title="Private Studio"
      description="Self-contained studio apartment"
      icon={User}
    />
  );
};

export default StudioSection;
