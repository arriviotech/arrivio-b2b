import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../supabase/hooks/useProperties';
import {
    ArrowLeft,
    MapPin,
    Building2,
    Users,
    Wrench,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ArrowUpDown,
    Mail,
    Phone,
    Banknote,
    FileText,
    X,
    Eye
} from 'lucide-react';

const DashboardPropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('units');

    // State for modal and allocation
    const [selectedUnitId, setSelectedUnitId] = useState(null);
    const [allocationEmail, setAllocationEmail] = useState('');
    const [allocationSuccess, setAllocationSuccess] = useState(false);

    // Filters
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Find the property from Supabase data
    const { properties, loading } = useProperties();
    const property = properties.find(p => p.id === id);

    // Generate mock unit data based on the property's breakdown
    const mockUnits = useMemo(() => {
        if (!property) return [];
        const units = [];
        let unitCounter = 1;

        Object.entries(property.breakdown).forEach(([type, count]) => {
            for (let i = 0; i < count; i++) {
                // Determine a fixed status based on counter so it doesn't change on re-renders, but looks varied
                const statusType = unitCounter % 4 === 0 ? 'vacant' : (unitCounter % 7 === 0 ? 'maintenance' : 'occupied');

                // Mocks for details
                const isShared = type.toLowerCase().includes('shared');
                const isApt2 = type.toLowerCase() === 'apartment2';
                const isApt3 = type.toLowerCase() === 'apartment3';

                let readableType = type.charAt(0).toUpperCase() + type.slice(1);
                if (isApt2) readableType = "2-Room Apartment";
                if (isApt3) readableType = "3-Room Apartment";

                const rent = isApt3 ? 1800 : (isApt2 ? 1400 : (type.toLowerCase().includes('studio') ? 1200 : 850));

                let rooms = [];
                if (isShared) {
                    const roomTypes = ['Master Bedroom (20 sqm)', 'Single Room (15 sqm)', 'Cozy Room (12 sqm)'];
                    for (let r = 0; r < roomTypes.length; r++) {
                        // Make only some rooms occupied if the unit is generally considered "occupied"
                        const isOccupied = statusType === 'occupied' ? r < 2 : false;
                        rooms.push({
                            id: r + 1,
                            name: roomTypes[r],
                            status: isOccupied ? 'occupied' : 'vacant',
                            resident: isOccupied ? `Resident ${unitCounter}-${r + 1}` : null,
                            moveInDate: isOccupied ? '2023-09-01' : null,
                            phone: isOccupied ? `+49 151 2345 67${unitCounter}${r + 1}` : null,
                        });
                    }
                }

                let tenants = [];
                let residentString = null;

                if (isShared) {
                    residentString = statusType === 'occupied' ? '2/3 Occupied' : 'Unassigned';
                } else if (isApt2 || isApt3) {
                    if (statusType === 'occupied') {
                        const tenantCount = isApt2 ? 2 : 3;
                        residentString = `${tenantCount} Residents`;
                        for (let t = 0; t < tenantCount; t++) {
                            tenants.push({
                                id: `t-${unitCounter}-${t}`,
                                name: `Resident ${unitCounter}-${t + 1}`,
                                phone: `+49 151 2345 67${unitCounter}${t}`,
                                email: `resident${unitCounter}.${t + 1}@example.com`,
                                initials: `R${t + 1}`,
                                status: 'Verified',
                                moveInDate: '2023-09-01'
                            });
                        }
                    } else if (statusType === 'vacant') {
                        residentString = 'Unassigned';
                    }
                } else {
                    residentString = statusType === 'occupied' ? `Resident ${unitCounter}` : null;
                }

                units.push({
                    id: `u-${unitCounter}`,
                    number: `${type.charAt(0).toUpperCase().substring(0, 1)}-${100 + unitCounter}`,
                    type: readableType,
                    rawType: type,
                    status: statusType,
                    resident: residentString,
                    tenants: tenants,
                    moveInDate: statusType === 'occupied' ? '2023-09-01' : null,
                    leaseEnd: statusType === 'occupied' ? '2024-08-31' : null,
                    rent: rent,
                    phone: statusType === 'occupied' ? `+49 151 2345 67${unitCounter.toString().padStart(2, '0')}` : null,
                    tickets: statusType === 'occupied' && unitCounter % 3 === 0 ? 1 : 0,
                    isShared: isShared,
                    isApt2: isApt2,
                    isApt3: isApt3,
                    rooms: rooms
                });
                unitCounter++;
            }
        });
        return units;
    }, [property]);

    // Apply filters
    const filteredUnits = useMemo(() => {
        return mockUnits.filter(unit => {
            const matchType = typeFilter === 'All' ||
                (typeFilter === 'Apartment' ? (unit.rawType === 'apartment2' || unit.rawType === 'apartment3') : unit.type.toLowerCase().includes(typeFilter.toLowerCase()));
            const matchStatus = statusFilter === 'All' || unit.status.toLowerCase() === statusFilter.toLowerCase();
            return matchType && matchStatus;
        });
    }, [mockUnits, typeFilter, statusFilter]);

    // Derived selected unit
    const selectedUnit = useMemo(() => {
        return mockUnits.find(u => u.id === selectedUnitId);
    }, [mockUnits, selectedUnitId]);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (selectedUnitId !== null) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedUnitId]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-10 h-10 border-4 border-[#1e6f50]/20 border-t-[#1e6f50] rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-bold text-xs tracking-wider uppercase">Loading property details...</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
                <button
                    onClick={() => navigate('/dashboard/properties')}
                    className="text-[#1e6f50] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft size={16} /> Back to Properties
                </button>
            </div>
        );
    }

    // Mock Ticket Data
    const mockTickets = [
        { id: 'TKT-1049', title: 'Heating issue in living room', status: 'open', date: 'Oct 24, 2023', priority: 'high', unit: 'S-104' },
        { id: 'TKT-1042', title: 'Window blind mechanism stuck', status: 'in-progress', date: 'Oct 20, 2023', priority: 'low', unit: 'S-102' },
        { id: 'TKT-1028', title: 'Keycard access intermittent', status: 'resolved', date: 'Oct 12, 2023', priority: 'medium', unit: 'I-108' }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'occupied':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Occupied</span>;
            case 'vacant':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Vacant</span>;
            case 'maintenance':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Maintenance</span>;
            default:
                return null;
        }
    };

    const getTicketStatusIcon = (status) => {
        switch (status) {
            case 'open': return <AlertCircle size={16} className="text-red-500" />;
            case 'in-progress': return <Clock size={16} className="text-amber-500" />;
            case 'resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
            default: return null;
        }
    };

    const openModal = (unitId) => {
        setSelectedUnitId(unitId);
        setAllocationSuccess(false);
        setAllocationEmail('');
    };

    const closeModal = () => {
        setSelectedUnitId(null);
    };

    const handleAllocate = (e) => {
        e.preventDefault();
        if (allocationEmail) {
            setAllocationSuccess(true);
            setTimeout(() => {
                closeModal();
                setAllocationSuccess(false);
                setAllocationEmail('');
            }, 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Nav & Header */}
            <button
                onClick={() => navigate('/dashboard/properties')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-colors shadow-sm">
                    <ArrowLeft size={16} />
                </div>
                Back to all properties
            </button>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8">
                <div className="h-64 relative">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 text-white/80 font-bold text-sm mb-3 uppercase tracking-wider">
                                <span className="bg-[#1e6f50] text-white px-3 py-1 rounded-full text-xs">Active Contract</span>
                                <span className="flex items-center gap-1 drop-shadow-md pb-0.5">
                                    <MapPin size={14} /> {property.neighborhood}, {property.city}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight pb-1" style={{ color: '#d4c3a3', textShadow: '0 2px 14px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' }}>
                                {property.name}
                            </h1>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-center min-w-[120px] shadow-lg">
                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Total Units</p>
                            <p className="text-3xl font-bold">{mockUnits.length}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-8">
                    <button
                        onClick={() => setActiveTab('units')}
                        className={`py-4 font-bold text-sm border-b-2 transition-colors mr-8 flex items-center gap-2 ${activeTab === 'units' ? 'border-[#1e6f50] text-[#1e6f50]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                    >
                        <Building2 size={16} /> Unit Management
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`py-4 font-bold text-sm border-b-2 transition-colors mr-8 flex items-center gap-2 ${activeTab === 'tickets' ? 'border-[#1e6f50] text-[#1e6f50]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                    >
                        <Wrench size={16} /> Support Tickets
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs ml-1">1</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                {activeTab === 'units' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Reserved Units ({filteredUnits.length})</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">Export List</button>
                                <button className="px-4 py-2 bg-[#1e6f50] text-white font-bold rounded-xl text-sm hover:bg-[#15543c] transition-colors shadow-sm">Assign Residents</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="py-4 px-4 font-bold">Unit</th>
                                        <th className="py-3 px-4">
                                            <div className="relative inline-block w-max">
                                                <select
                                                    value={typeFilter}
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                    className="appearance-none flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 pr-8 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-bold outline-none cursor-pointer"
                                                >
                                                    <option value="All">Type</option>
                                                    <option value="Studio">Studio</option>
                                                    <option value="Apartment">Apartment</option>
                                                    <option value="Shared">Shared</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="py-3 px-4">
                                            <div className="relative inline-block w-max">
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="appearance-none flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 pr-8 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-bold outline-none cursor-pointer"
                                                >
                                                    <option value="All">Status</option>
                                                    <option value="Occupied">Occupied</option>
                                                    <option value="Vacant">Vacant</option>
                                                    <option value="Maintenance">Maintenance</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="py-4 px-4 font-bold">Resident</th>
                                        <th className="py-4 px-4 font-bold">Lease End</th>
                                        <th className="py-4 px-4 font-bold text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUnits.length > 0 ? (
                                        filteredUnits.map((unit) => (
                                            <tr
                                                key={unit.id}
                                                onClick={() => openModal(unit.id)}
                                                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                            >
                                                <td className="py-4 px-4">
                                                    <span className="font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 block w-max shadow-sm">{unit.number}</span>
                                                </td>
                                                <td className="py-4 px-4 font-medium text-gray-700">{unit.type}</td>
                                                <td className="py-4 px-4">{getStatusBadge(unit.status)}</td>
                                                <td className="py-4 px-4">
                                                    {unit.isShared ? (
                                                        <span className={`font-medium text-sm ${unit.status === 'occupied' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-gray-500 bg-gray-50 border-gray-100'} px-2.5 py-1 rounded-lg border`}>
                                                            {unit.resident}
                                                        </span>
                                                    ) : unit.resident ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] text-[10px] font-bold">
                                                                {unit.resident.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{unit.resident}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 text-sm">{unit.leaseEnd || '-'}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button className="text-[#1e6f50] flex items-center justify-end w-full gap-1.5 font-bold text-sm hover:underline transition-opacity">
                                                        <Eye size={16} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-gray-500 font-medium">
                                                No units found matching the selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* List column */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
                                <button className="px-4 py-2 bg-[#1e6f50] text-white font-bold rounded-xl text-sm hover:bg-[#15543c] transition-colors shadow-sm flex gap-2 items-center">
                                    <MessageSquare size={16} /> Raise Ticket
                                </button>
                            </div>

                            <div className="space-y-4">
                                {mockTickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all bg-white cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                {getTicketStatusIcon(ticket.status)}
                                                <h3 className="font-bold text-gray-900 group-hover:text-[#1e6f50] transition-colors">{ticket.title}</h3>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{ticket.id}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 ml-7">
                                            <span className="flex items-center gap-1"><Building2 size={14} /> Unit {ticket.unit}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {ticket.date}</span>
                                            {ticket.priority === 'high' && (
                                                <span className="text-red-600 font-bold text-xs uppercase bg-red-50 px-2 py-0.5 rounded flex items-center">High Priority</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-max">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-[#1e6f50]" /> Support Overview</h3>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Use this portal to report maintenance issues or request support for this property. Our local property management team typically responds within 4 hours.
                            </p>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Open Tickets</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">4.2h</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Response Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Overlay */}
            {selectedUnit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-bold text-gray-900 border border-gray-200 bg-white px-4 py-1.5 rounded-xl shadow-sm">Unit {selectedUnit.number}</h3>
                                <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-100/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <Building2 size={18} />
                                    <span>{selectedUnit.type} Plan</span>
                                </div>
                                <div>{getStatusBadge(selectedUnit.status)}</div>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 p-2 rounded-full transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Info Panel */}
                                <div className="w-full md:w-1/3 space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-[#1e6f50]" /> Unit Details
                                    </h4>
                                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Monthly Rent</span>
                                            <span className="text-gray-900 font-bold text-lg">€{selectedUnit.rent}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Floor Plan</span>
                                            <span className="text-gray-900 font-bold">{selectedUnit.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Maintenance History</span>
                                            <span className="text-gray-900 font-bold flex items-center gap-1.5">
                                                {selectedUnit.tickets > 0 ? <AlertCircle size={14} className="text-amber-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
                                                {selectedUnit.tickets} Tickets
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Action/Resident Panel */}
                                <div className="w-full md:w-2/3">
                                    {selectedUnit.isShared ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Users size={16} className="text-[#1e6f50]" /> Shared Rooms ({selectedUnit.rooms.length})
                                            </h4>
                                            <div className="space-y-4">
                                                {selectedUnit.rooms.map((room) => (
                                                    <div key={room.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 transition-all hover:shadow-md hover:border-gray-200">
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="font-bold text-gray-900 flex items-center gap-2">{room.name}</h5>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${room.status === 'occupied' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                                    {room.status}
                                                                </span>
                                                            </div>
                                                            {room.status === 'occupied' ? (
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <div className="w-10 h-10 rounded-full bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] font-bold text-sm">
                                                                        {room.resident.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 text-sm">{room.resident}</p>
                                                                        <p className="text-xs text-gray-500 font-medium">{room.phone}</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="mt-2 text-sm text-gray-400 italic flex items-center gap-1.5"><Mail size={14} /> Available to allocate</div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-end sm:border-l border-gray-50 sm:pl-5 pt-4 sm:pt-0 mt-3 sm:mt-0 min-w-[120px]">
                                                            {room.status === 'occupied' ? (
                                                                <button className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 w-full">
                                                                    <MessageSquare size={14} /> Message
                                                                </button>
                                                            ) : (
                                                                <button className="px-4 py-2 bg-[#1e6f50] text-white font-bold rounded-xl text-sm hover:bg-[#15543c] shadow-sm transition-all flex items-center justify-center gap-2 w-full">
                                                                    Allocate
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : selectedUnit.status === 'occupied' ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Users size={16} className="text-[#1e6f50]" /> {selectedUnit.tenants.length > 0 ? `Resident Details (${selectedUnit.tenants.length})` : 'Tenant Information'}
                                            </h4>

                                            {selectedUnit.tenants.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedUnit.tenants.map((tenant) => (
                                                        <div key={tenant.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md hover:border-gray-200">
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <div className="w-12 h-12 rounded-full bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] font-bold shadow-sm ring-4 ring-[#1e6f50]/5">
                                                                    {tenant.initials}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-[15px]">{tenant.name}</p>
                                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md w-max border border-emerald-100">
                                                                        <CheckCircle2 size={10} /> {tenant.status}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-x-12 gap-y-1 sm:border-l border-gray-100 sm:pl-8 flex-shrink-0">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
                                                                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                                                        <Phone size={12} className="text-gray-400" /> {tenant.phone}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Lease Start</p>
                                                                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                                                        <Clock size={12} className="text-gray-400" /> {tenant.moveInDate}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center pl-4 border-l border-gray-50">
                                                                <button className="p-2.5 text-gray-400 hover:text-[#1e6f50] hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100" title="Message Resident">
                                                                    <MessageSquare size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-6">
                                                    <div className="space-y-5 flex-1">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-full bg-[#1e6f50]/10 flex items-center justify-center text-[#1e6f50] text-xl font-bold shadow-sm">
                                                                {selectedUnit.resident ? selectedUnit.resident.split(' ').map(n => n[0]).join('') : 'R'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-lg">{selectedUnit.resident}</p>
                                                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md w-max border border-emerald-100"><CheckCircle2 size={12} /> Verified Profile</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Contact Phone</p>
                                                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-max"><Phone size={14} className="text-gray-400" /> {selectedUnit.phone}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Lease Start</p>
                                                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-max"><Clock size={14} className="text-gray-400" /> {selectedUnit.moveInDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3 justify-center border-l border-gray-100 pl-6 border-t pt-4 mt-2 sm:border-t-0 sm:pt-0 sm:mt-0 min-w-[160px]">
                                                        <button className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all hover:shadow-sm flex items-center justify-center gap-2 w-full">
                                                            <MessageSquare size={16} /> Message
                                                        </button>
                                                        {selectedUnit.tickets > 0 && (
                                                            <button className="px-5 py-2.5 bg-amber-50/50 text-amber-700 font-bold rounded-xl text-sm border border-amber-100 hover:bg-amber-100 transition-all hover:shadow-sm flex items-center justify-center gap-2 w-full">
                                                                <AlertCircle size={16} /> View Ticket
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedUnit.status === 'vacant' ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Mail size={16} className="text-[#1e6f50]" /> Allocate Tenant
                                            </h4>
                                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
                                                {allocationSuccess ? (
                                                    <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in duration-300">
                                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                                                            <CheckCircle2 size={32} />
                                                        </div>
                                                        <h5 className="text-xl font-bold text-gray-900 mb-2">Invitation Sent!</h5>
                                                        <p className="text-gray-500 max-w-sm">A secure login email has been dispatched. They can now create an account and view their moving-in details.</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleAllocate}>
                                                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">Send an invitation to the incoming employee so they can create their account, view their floor plan, and prepare for move-in.</p>
                                                        <div className="flex gap-3">
                                                            <div className="relative flex-1">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                                                <input
                                                                    type="email"
                                                                    required
                                                                    placeholder="employee@acme-corp.com"
                                                                    value={allocationEmail}
                                                                    onChange={(e) => setAllocationEmail(e.target.value)}
                                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e6f50]/10 focus:border-[#1e6f50] transition-all font-medium text-gray-900 placeholder-gray-400 inset-y-0"
                                                                />
                                                            </div>
                                                            <button
                                                                type="submit"
                                                                className="px-8 py-3 bg-[#1e6f50] text-white font-bold rounded-xl hover:bg-[#15543c] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2 active:translate-y-0"
                                                            >
                                                                Send Invite <ArrowLeft size={16} className="rotate-180" />
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 h-full">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Wrench size={16} className="text-[#1e6f50]" /> Maintenance Status
                                            </h4>
                                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center justify-center text-center h-[calc(100%-2.5rem)] shadow-inner">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                                    <Wrench size={28} className="text-amber-500" />
                                                </div>
                                                <h5 className="text-lg font-bold text-amber-900 mb-2">Unit Under Maintenance</h5>
                                                <p className="text-amber-700 max-w-md leading-relaxed">This unit is currently undergoing routine maintenance/cleaning and is not ready for allocation.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPropertyDetails;
