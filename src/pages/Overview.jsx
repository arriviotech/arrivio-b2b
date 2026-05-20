import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useReservation } from '../context/ReservationContext';
import { ArrowLeft, Building2 } from 'lucide-react';
import { generateNativePDF } from '../components/overview/Pdf';
import Summary from '../components/overview/Summary';
import PropertyCard from '../components/overview/PropertyCard';

const Overview = () => {
  const navigate = useNavigate();
  const { reservations, removeReservation, updateQuantity, clearReservations, addReservation } = useReservation();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const handleAddService = (property, serviceName) => {
    if (!serviceName.trim()) return;

    addReservation({
      propertyId: property.id,
      propertyName: property.name,
      propertyCity: property.city,
      propertyNeighborhood: property.neighborhood,
      propertyImage: property.image,
      unitType: serviceName.trim(),
      unitPrice: 0,
      quantity: 1,
      isService: true // Mark as service to distinguish if needed
    });
  };

  const propertiesData = reservations.reduce((acc, current) => {
    if (!acc[current.propertyId]) {
      acc[current.propertyId] = {
        id: current.propertyId,
        name: current.propertyName,
        image: current.propertyImage,
        city: current.propertyCity,
        neighborhood: current.propertyNeighborhood,
        units: []
      };
    }
    acc[current.propertyId].units.push(current);
    return acc;
  }, {});

  const groupedProperties = Object.values(propertiesData);

  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const handleCheckout = async () => {
    if (reservations.length === 0) return;

    setIsProcessingCheckout(true);
    try {
      // 1. Generate PDF as Blob
      const blob = await generateNativePDF(groupedProperties, true);

      // 2. Upload to temporary file host
      const formData = new FormData();
      formData.append('file', blob, `Arrivio_Proposal_${new Date().toISOString().slice(0, 10)}.pdf`);

      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.status === 'success') {
        const fileUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        const notes = `Here is my requested housing proposal:\n${fileUrl}\n(Note: Link expires in 60 minutes)`;

        clearReservations();
        navigate('/schedule', { state: { bookingNotes: notes } });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed! Could not generate or upload proposal.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };


  const handleDownloadPDF = async () => {
    if (groupedProperties.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      await generateNativePDF(groupedProperties);
    } catch (error) {
      console.error('PDF Error:', error);
      alert('PDF generation failed: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <PropertiesNavbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Overview</h1>

              <div className="mt-8">

                {groupedProperties.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                    <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No units selected yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Browse our available properties to find the perfect accommodation for your team's needs.</p>
                    <button
                      onClick={() => navigate('/properties')}
                      className="bg-[#1e6f50] hover:bg-[#185e43] text-white px-8 py-3 rounded-xl font-bold transition-colors inline-block"
                    >
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {groupedProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        navigate={navigate}
                        updateQuantity={updateQuantity}
                        removeReservation={removeReservation}
                        handleAddService={(serviceName) => handleAddService(property, serviceName)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="w-full lg:w-1/3">
              <Summary
                reservations={reservations}
                groupedProperties={groupedProperties}
                handleCheckout={handleCheckout}
                handleDownloadPDF={handleDownloadPDF}
                isGeneratingPDF={isGeneratingPDF}
                isProcessingCheckout={isProcessingCheckout}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Overview;
