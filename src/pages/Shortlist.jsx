import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import PropertiesNavbar from '../components/layout/PropertiesNavbar';
import Footer from '../components/layout/Footer';
import { useWishlist } from '../context/WishlistContext';

const Shortlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();
    const [isNavHidden, setIsNavHidden] = useState(false);

    useEffect(() => {
        let lastY = 0;
        const onScroll = () => {
            const y = window.scrollY;
            if (y < 50) setIsNavHidden(false);
            else if (y > lastY) setIsNavHidden(true);
            else setIsNavHidden(false);
            lastY = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f2f2f2] font-sans text-gray-900">
            <PropertiesNavbar isHidden={isNavHidden} />

            <main className="flex-grow pt-28 pb-20 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#0f4c3a] transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <Link to="/properties" className="hover:text-[#0f4c3a] transition-colors">Properties</Link>
                            <span>/</span>
                            <span className="text-gray-700 font-medium">Your Shortlist</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-[#111827] font-medium mb-2">Your Shortlist</h1>
                        <p className="text-gray-500 text-base">
                            Properties you're considering. Pick units and add them to your Proposal when you're ready.
                        </p>
                    </div>

                    {/* Empty state */}
                    {wishlist.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No properties shortlisted yet</h3>
                            <p className="text-gray-400 text-sm max-w-sm mx-auto mt-1">
                                Tap the heart on a property to save it here for later.
                            </p>
                            <Link to="/properties">
                                <button className="mt-6 inline-flex items-center gap-2 bg-[#0f4c3a] hover:bg-[#1A2E22] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">
                                    Explore Properties
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-sm text-gray-500">
                                <span className="font-bold text-gray-900">{wishlist.length}</span> {wishlist.length === 1 ? 'property' : 'properties'} saved
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((property) => (
                                    <div
                                        key={property.id}
                                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={property.image}
                                                alt={property.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <button
                                                onClick={() => removeFromWishlist(property.id)}
                                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
                                                title="Remove from shortlist"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{property.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">{property.neighborhood || property.city}</span>
                                            </div>
                                            {property.description && (
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{property.description}</p>
                                            )}

                                            <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-50">
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starting from</div>
                                                    <div className="text-lg font-bold text-[#0f4c3a]">
                                                        €{property.price?.toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/property/${property.slug || property.id}`}
                                                    className="flex items-center gap-1 text-[#0f4c3a] font-bold text-sm hover:gap-2 transition-all"
                                                >
                                                    View
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shortlist;
