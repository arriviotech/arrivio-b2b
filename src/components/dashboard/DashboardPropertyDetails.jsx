import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../supabase/hooks/useProperties';
import { MOCK_EMPLOYEES } from '../../data/mockEmployees';
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

    // State for direct employee allocation dropdowns
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [activeAllocatingRoomId, setActiveAllocatingRoomId] = useState(null);
    const [selectedRoomEmployeeId, setSelectedRoomEmployeeId] = useState('');
    const [studioDropdownOpen, setStudioDropdownOpen] = useState(false);
    const [roomDropdownOpen, setRoomDropdownOpen] = useState(null); // stores roomId
    const [refreshTrigger, setRefreshTrigger] = useState(0);



    // Filters
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Mock Ticket Data based on Contract ID
    const mockTickets = useMemo(() => {
        if (id === 'CT-7041') {
            return [
                { id: 'TKT-1049', title: 'Request to upgrade cleaning package to weekly deep-cleans', status: 'open', date: 'Oct 24, 2026', priority: 'high', unit: 'S-104' },
                { id: 'TKT-1042', title: 'Can we customize the workspace furniture layout for this studio?', status: 'in-progress', date: 'Oct 20, 2026', priority: 'low', unit: 'S-102' },
                { id: 'TKT-1028', title: 'Can we schedule keycard collection for new employee arrivals on Monday?', status: 'resolved', date: 'Oct 12, 2026', priority: 'medium', unit: 'I-108' }
            ];
        } else if (id === 'CT-5921') {
            return [
                { id: 'TKT-2049', title: 'Inquiry about adding monthly flower service delivery to the lobby', status: 'open', date: 'Oct 25, 2026', priority: 'high', unit: 'S-101' },
                { id: 'TKT-2042', title: 'Can we request a second bike storage key for the garage?', status: 'in-progress', date: 'Oct 21, 2026', priority: 'low', unit: 'S-105' },
                { id: 'TKT-2028', title: 'Request to adjust high-speed internet tier for remote workers', status: 'resolved', date: 'Oct 15, 2026', priority: 'medium', unit: 'I-102' }
            ];
        } else {
            return [
                { id: 'TKT-3049', title: 'Inquiry about extra laundry service packages for our corporate tenants', status: 'open', date: 'Oct 26, 2026', priority: 'high', unit: 'S-106' },
                { id: 'TKT-3042', title: 'Can we coordinate a guided tour of the local community spaces?', status: 'in-progress', date: 'Oct 22, 2026', priority: 'low', unit: 'S-108' },
                { id: 'TKT-3028', title: 'Request for carbon offset reporting data on our building energy usage', status: 'resolved', date: 'Oct 18, 2026', priority: 'medium', unit: 'I-104' }
            ];
        }
    }, [id]);

    // Find the property from Supabase data
    const mockContracts = [
        {
            id: 'CT-7041',
            property: 'Berlin Central Hub',
            location: 'Mitte, Berlin',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Dec 15, 2026',
            checkOut: 'Dec 15, 2027',
            units: [
                { type: 'Shared Room', quantity: 3 },
                { type: 'Studio Apartment', quantity: 4 },
                { type: 'Individual Unit', quantity: 3 }
            ],
            status: 'Active',
            totalPrice: '€13,200'
        },
        {
            id: 'CT-5921',
            property: 'Frankfurt Sachsenhausen',
            location: 'Sachsenhausen, Frankfurt',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Oct 12, 2026',
            checkOut: 'Oct 12, 2027',
            units: [
                { type: 'Shared Room', quantity: 4 },
                { type: 'Studio Apartment', quantity: 5 },
                { type: 'Individual Unit', quantity: 3 }
            ],
            status: 'Active',
            totalPrice: '€11,200'
        },
        {
            id: 'CT-4102',
            property: 'Frankfurt Single Living',
            location: 'Central, Frankfurt',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
            checkIn: 'Nov 01, 2026',
            checkOut: 'Nov 01, 2027',
            units: [
                { type: 'Shared Room', quantity: 2 },
                { type: 'Studio Apartment', quantity: 3 },
                { type: 'Individual Unit', quantity: 5 }
            ],
            status: 'Active',
            totalPrice: '€8,100'
        }
    ];

    const contract = mockContracts.find(c => c.id === id);
    const { properties, loading } = useProperties();
    const dbProperty = properties.find(p => p.name === contract?.property);

    // Derived display property
    const displayProperty = dbProperty || (contract ? {
        name: contract.property,
        city: contract.location.split(', ')[1] || contract.location,
        neighborhood: contract.location.split(', ')[0] || contract.location,
        image: contract.image
    } : null);

    // Generate mock unit data based on the contract's units and employee assignments
    const units = useMemo(() => {
        if (!contract) return [];
        const unitsList = [];
        let unitCounter = 1;

        contract.units.forEach(({ type, quantity }) => {
            for (let i = 0; i < quantity; i++) {
                const unitNumber = `S-${100 + unitCounter}`;
                const isShared = type.toLowerCase().includes('shared');
                const isStudio = type.toLowerCase().includes('studio');
                const isIndividual = type.toLowerCase().includes('individual');
                
                const rawType = type.toLowerCase();
                const rent = isStudio ? 1200 : (isShared ? 850 : 850);

                // Find employees assigned to this specific property
                const propertyEmployees = MOCK_EMPLOYEES.filter(
                    emp => emp.property === contract.property
                );

                if (isShared) {
                    let rooms = [];
                    let occupiedCount = 0;
                    let assignedCount = 0;
                    // Shared rooms have Bed 1, Bed 2, Bed 3
                    for (let r = 1; r <= 3; r++) {
                        const bedUnitName = `${unitNumber} (Bed ${r})`;
                        const emp = propertyEmployees.find(e => e.unit === bedUnitName);
                        if (emp) {
                            if (emp.status === 'Assigned') {
                                assignedCount++;
                            } else {
                                occupiedCount++;
                            }
                            rooms.push({
                                id: r,
                                name: `Bed ${r}`,
                                status: emp.status === 'Assigned' ? 'assigned' : 'occupied',
                                resident: emp.name,
                                moveInDate: emp.arrivingOn,
                                phone: `+49 151 2345 67${emp.id.replace('emp_', '').padStart(2, '0')}`,
                                email: emp.email,
                                employeeId: emp.id
                            });
                        } else {
                            rooms.push({
                                id: r,
                                name: `Bed ${r}`,
                                status: 'vacant',
                                resident: null,
                                moveInDate: null,
                                phone: null,
                                email: null,
                                employeeId: null
                            });
                        }
                    }

                    const isUnitOccupiedOrAssigned = occupiedCount > 0 || assignedCount > 0;
                    const statusType = occupiedCount > 0 ? 'occupied' : (assignedCount > 0 ? 'assigned' : (unitCounter % 7 === 0 ? 'maintenance' : 'vacant'));
                    const residentString = isUnitOccupiedOrAssigned 
                        ? (occupiedCount > 0 ? `${occupiedCount + assignedCount}/3 Occupied` : `${assignedCount}/3 Assigned`) 
                        : 'Unassigned';

                    unitsList.push({
                        id: `u-${unitCounter}`,
                        number: unitNumber,
                        type: type,
                        rawType: rawType,
                        status: statusType,
                        resident: residentString,
                        tenants: [],
                        moveInDate: isUnitOccupiedOrAssigned ? rooms.find(rm => rm.status === 'occupied' || rm.status === 'assigned')?.moveInDate : null,
                        leaseEnd: isUnitOccupiedOrAssigned ? '2027-08-31' : null,
                        rent: rent,
                        phone: isUnitOccupiedOrAssigned ? rooms.find(rm => rm.status === 'occupied' || rm.status === 'assigned')?.phone : null,
                        tickets: (isUnitOccupiedOrAssigned && unitCounter % 3 === 0) ? 1 : 0,
                        isShared: true,
                        rooms: rooms
                    });
                } else {
                    const emp = propertyEmployees.find(e => e.unit === unitNumber);
                    const isUnitOccupiedOrAssigned = !!emp;
                    const statusType = isUnitOccupiedOrAssigned ? (emp.status === 'Assigned' ? 'assigned' : 'occupied') : (unitCounter % 7 === 0 ? 'maintenance' : 'vacant');
                    const residentString = isUnitOccupiedOrAssigned ? emp.name : null;
                    const tenants = isUnitOccupiedOrAssigned ? [{
                        id: emp.id,
                        name: emp.name,
                        phone: `+49 151 2345 67${emp.id.replace('emp_', '').padStart(2, '0')}`,
                        email: emp.email,
                        initials: emp.name.split(' ').map(n => n[0]).join(''),
                        status: emp.status === 'Assigned' ? 'Assigned' : 'Verified',
                        moveInDate: emp.arrivingOn
                    }] : [];

                    unitsList.push({
                        id: `u-${unitCounter}`,
                        number: unitNumber,
                        type: type,
                        rawType: rawType,
                        status: statusType,
                        resident: residentString,
                        tenants: tenants,
                        moveInDate: isUnitOccupiedOrAssigned ? emp.arrivingOn : null,
                        leaseEnd: isUnitOccupiedOrAssigned ? '2027-08-31' : null,
                        rent: rent,
                        phone: isUnitOccupiedOrAssigned ? `+49 151 2345 67${emp.id.replace('emp_', '').padStart(2, '0')}` : null,
                        tickets: (isUnitOccupiedOrAssigned && unitCounter % 3 === 0) ? 1 : 0,
                        isShared: false,
                        rooms: []
                    });
                }
                unitCounter++;
            }
        });
        return unitsList;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, refreshTrigger]);

    // Apply filters
    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchType = typeFilter === 'All' ||
                (typeFilter === 'Apartment' ? (unit.rawType === 'apartment2' || unit.rawType === 'apartment3') : unit.type.toLowerCase().includes(typeFilter.toLowerCase()));
            const matchStatus = statusFilter === 'All' || unit.status.toLowerCase() === statusFilter.toLowerCase();
            return matchType && matchStatus;
        });
    }, [units, typeFilter, statusFilter]);

    // Derived selected unit
    const selectedUnit = useMemo(() => {
        return units.find(u => u.id === selectedUnitId);
    }, [units, selectedUnitId]);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (selectedUnitId !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedUnitId]);

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
                <div className="w-10 h-10 border-4 border-[#0f4c3a]/20 border-t-[#0f4c3a] rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-bold text-xs tracking-wider uppercase">Loading property details...</p>
            </div>
        );
    }

    if (!displayProperty || !contract) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Not Found</h2>
                <button
                    onClick={() => navigate('/dashboard/contracts')}
                    className="text-[#0f4c3a] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft size={16} /> Back to Contracts
                </button>
            </div>
        );
    }


    const getStatusBadge = (status) => {
        switch (status) {
            case 'occupied':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Occupied</span>;
            case 'assigned':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Assigned</span>;
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
        setSelectedEmployeeId('');
        setActiveAllocatingRoomId(null);
        setSelectedRoomEmployeeId('');
        setStudioDropdownOpen(false);
        setRoomDropdownOpen(null);
    };

    const closeModal = () => {
        setSelectedUnitId(null);
        setSelectedEmployeeId('');
        setActiveAllocatingRoomId(null);
        setSelectedRoomEmployeeId('');
        setStudioDropdownOpen(false);
        setRoomDropdownOpen(null);
    };

    const handleDirectAllocate = () => {
        if (!selectedEmployeeId || !selectedUnit) return;
        const emp = MOCK_EMPLOYEES.find(e => e.id === selectedEmployeeId);
        if (emp) {
            emp.property = contract.property;
            emp.unit = selectedUnit.number;
            emp.status = 'Assigned';
            setAllocationSuccess(true);
            setRefreshTrigger(prev => prev + 1);
            setSelectedEmployeeId('');
            setTimeout(() => {
                closeModal();
                setAllocationSuccess(false);
            }, 3000);
        }
    };

    const handleAllocateRoom = (roomId) => {
        if (!selectedRoomEmployeeId || !selectedUnit) return;
        const emp = MOCK_EMPLOYEES.find(e => e.id === selectedRoomEmployeeId);
        if (emp) {
            emp.property = contract.property;
            emp.unit = `${selectedUnit.number} (Bed ${roomId})`;
            emp.status = 'Assigned';
            
            // Clean up state
            setActiveAllocatingRoomId(null);
            setSelectedRoomEmployeeId('');
            setRefreshTrigger(prev => prev + 1);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Nav & Header */}
            <button
                onClick={() => navigate('/dashboard/contracts')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-colors shadow-sm">
                    <ArrowLeft size={16} />
                </div>
                Back to all contracts
            </button>

            <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm mb-8">
                <div className="h-64 relative">
                    <img src={displayProperty.image} alt={displayProperty.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 text-white/80 font-bold text-sm mb-3 uppercase tracking-wider">
                                <span className="bg-[#0f4c3a] text-white px-3 py-1 rounded-full text-xs">Active Contract</span>
                                <span className="flex items-center gap-1 drop-shadow-md pb-0.5">
                                    <MapPin size={14} /> {displayProperty.neighborhood}, {displayProperty.city}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight pb-1" style={{ color: '#d4c3a3', textShadow: '0 2px 14px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' }}>
                                {displayProperty.name}
                            </h1>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-center min-w-[120px] shadow-lg">
                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Total Units</p>
                            <p className="text-3xl font-bold">{units.length}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-8">
                    <button
                        onClick={() => setActiveTab('units')}
                        className={`py-4 font-bold text-sm border-b-2 transition-colors mr-8 flex items-center gap-2 ${activeTab === 'units' ? 'border-[#0f4c3a] text-[#0f4c3a]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                    >
                        <Building2 size={16} /> Unit Management
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`py-4 font-bold text-sm border-b-2 transition-colors mr-8 flex items-center gap-2 ${activeTab === 'tickets' ? 'border-[#0f4c3a] text-[#0f4c3a]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                    >
                        <Wrench size={16} /> Support Tickets
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs ml-1">1</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 sm:p-8">
                {activeTab === 'units' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Reserved Units ({filteredUnits.length})</h2>
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
                                                    <option value="Assigned">Assigned</option>
                                                    <option value="Vacant">Vacant</option>
                                                    <option value="Maintenance">Maintenance</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="py-4 px-4 font-bold">Employee</th>
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
                                                        <span className={`font-medium text-sm ${unit.status === 'occupied' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : unit.status === 'assigned' ? 'text-blue-700 bg-blue-50 border-blue-100' : 'text-gray-500 bg-gray-50 border-gray-100'} px-2.5 py-1 rounded-lg border`}>
                                                            {unit.resident}
                                                        </span>
                                                    ) : unit.resident ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] text-[10px] font-bold">
                                                                {unit.resident.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{unit.resident}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 text-sm">{unit.leaseEnd || '-'}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button className="text-[#0f4c3a] flex items-center justify-end w-full gap-1.5 font-bold text-sm hover:underline transition-opacity">
                                                        <Users size={16} /> Manage Employee
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
                                <button className="px-4 py-2 bg-[#0f4c3a] text-white font-bold rounded-xl text-sm hover:bg-[#0a3a2b] transition-colors shadow-sm flex gap-2 items-center">
                                    <MessageSquare size={16} /> Raise Ticket
                                </button>
                            </div>

                            <div className="space-y-4">
                                {mockTickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-250 hover:shadow-md transition-all bg-white cursor-pointer group">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div className="flex items-start gap-3 flex-1 min-w-0 pt-0.5">
                                                <div className="shrink-0 mt-0.5">
                                                    {getTicketStatusIcon(ticket.status)}
                                                </div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-[#0f4c3a] transition-colors leading-snug break-words">
                                                    {ticket.title}
                                                </h3>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 shrink-0">
                                                {ticket.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 ml-7">
                                            <span className="flex items-center gap-1"><Building2 size={14} /> Unit {ticket.unit}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {ticket.date}</span>
                                            {ticket.priority === 'high' && (
                                                <span className="text-red-650 font-bold text-xs uppercase bg-red-50 px-2 py-0.5 rounded flex items-center">High Priority</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-max">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-[#0f4c3a]" /> Support Overview</h3>
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
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
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
                        <div className="p-8 overflow-y-auto arrivio-scrollbar flex-1">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Info Panel */}
                                <div className="w-full md:w-1/3 space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-[#0f4c3a]" /> Unit Details
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
                                                <Users size={16} className="text-[#0f4c3a]" /> Shared Rooms ({selectedUnit.rooms.length})
                                            </h4>
                                            <div className="space-y-4">
                                                {selectedUnit.rooms.map((room) => (
                                                    <div 
                                                        key={room.id} 
                                                        className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 transition-all hover:shadow-md hover:border-gray-200 relative ${roomDropdownOpen === room.id ? 'z-40' : 'z-10'}`}
                                                    >
                                                        <div className="space-y-3 flex-1 text-left">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="font-bold text-gray-900 flex items-center gap-2">{room.name}</h5>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${room.status === 'occupied' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : room.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                                    {room.status}
                                                                </span>
                                                            </div>
                                                            {room.status === 'occupied' || room.status === 'assigned' ? (
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <div className="w-10 h-10 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] font-bold text-sm">
                                                                        {room.resident.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 text-sm">{room.resident}</p>
                                                                        <p className="text-xs text-gray-500 font-medium">{room.phone}</p>
                                                                    </div>
                                                                </div>
                                                            ) : activeAllocatingRoomId === room.id ? (
                                                                <div className="mt-2 space-y-3 w-full animate-in fade-in duration-200">
                                                                    <div className="relative w-full text-left">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setRoomDropdownOpen(roomDropdownOpen === room.id ? null : room.id)}
                                                                            className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]/15 focus:border-[#0f4c3a] transition-all font-medium text-xs flex items-center justify-between cursor-pointer ${selectedRoomEmployeeId ? 'text-gray-900' : 'text-gray-400'}`}
                                                                        >
                                                                            <span>
                                                                                {selectedRoomEmployeeId 
                                                                                    ? (() => {
                                                                                        const emp = MOCK_EMPLOYEES.find(e => e.id === selectedRoomEmployeeId);
                                                                                        return emp ? `${emp.name} (${emp.role})` : "Select Employee...";
                                                                                      })()
                                                                                    : "Select Employee..."
                                                                                }
                                                                            </span>
                                                                            <ChevronDown size={14} className={`text-gray-400 transition-transform ${roomDropdownOpen === room.id ? 'rotate-180' : ''}`} />
                                                                        </button>

                                                                        {roomDropdownOpen === room.id && (
                                                                            <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto arrivio-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
                                                                                {MOCK_EMPLOYEES.map(emp => {
                                                                                    const isAssigned = !!(emp.property || emp.unit);
                                                                                    return (
                                                                                        <button
                                                                                            key={emp.id}
                                                                                            type="button"
                                                                                            disabled={isAssigned}
                                                                                            onClick={() => {
                                                                                                setSelectedRoomEmployeeId(emp.id);
                                                                                                setRoomDropdownOpen(null);
                                                                                            }}
                                                                                            className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${isAssigned ? 'text-gray-300 cursor-not-allowed opacity-50 bg-gray-50/30' : 'text-gray-700 font-medium hover:bg-[#0f4c3a]/5 hover:text-[#0f4c3a]'}`}
                                                                                        >
                                                                                            <span>{emp.name} ({emp.role})</span>
                                                                                            {isAssigned && (
                                                                                                <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 shrink-0 ml-2">
                                                                                                    {emp.unit || emp.property}
                                                                                                </span>
                                                                                            )}
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2 text-left">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAllocateRoom(room.id)}
                                                                            disabled={!selectedRoomEmployeeId}
                                                                            className="px-3 py-1.5 bg-[#0f4c3a] text-white font-bold rounded-lg text-xs hover:bg-[#0a3a2b] transition-all disabled:opacity-50"
                                                                        >
                                                                            Confirm
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setActiveAllocatingRoomId(null);
                                                                                setSelectedRoomEmployeeId('');
                                                                            }}
                                                                            className="px-3 py-1.5 border border-gray-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-50 transition-all"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="mt-2 text-sm text-gray-400 flex items-center gap-1.5"><Mail size={14} /> Available to allocate</div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-end sm:border-l border-gray-50 sm:pl-5 pt-4 sm:pt-0 mt-3 sm:mt-0 min-w-[120px]">
                                                            {room.status === 'occupied' || room.status === 'assigned' ? (
                                                                <button className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 w-full">
                                                                    <MessageSquare size={14} /> Message
                                                                </button>
                                                            ) : activeAllocatingRoomId === room.id ? (
                                                                null
                                                            ) : (
                                                                <button 
                                                                    onClick={() => {
                                                                        setActiveAllocatingRoomId(room.id);
                                                                        setSelectedRoomEmployeeId('');
                                                                    }}
                                                                    className="px-4 py-2 bg-[#0f4c3a] text-white font-bold rounded-xl text-sm hover:bg-[#0a3a2b] shadow-sm transition-all flex items-center justify-center gap-2 w-full"
                                                                >
                                                                    Allocate
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : selectedUnit.status === 'occupied' || selectedUnit.status === 'assigned' ? (
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Users size={16} className="text-[#0f4c3a]" /> {selectedUnit.tenants.length > 0 ? `Employee Details (${selectedUnit.tenants.length})` : 'Employee Information'}
                                            </h4>

                                            {selectedUnit.tenants.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedUnit.tenants.map((tenant) => (
                                                        <div key={tenant.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md hover:border-gray-200">
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <div className="w-12 h-12 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] font-bold shadow-sm ring-4 ring-[#0f4c3a]/5">
                                                                    {tenant.initials}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-[15px]">{tenant.name}</p>
                                                                    <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md w-max border ${tenant.status === 'Assigned' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
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
                                                                <button className="p-2.5 text-gray-400 hover:text-[#0f4c3a] hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100" title="Message Employee">
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
                                                            <div className="w-14 h-14 rounded-full bg-[#0f4c3a]/10 flex items-center justify-center text-[#0f4c3a] text-xl font-bold shadow-sm">
                                                                {selectedUnit.resident ? selectedUnit.resident.split(' ').map(n => n[0]).join('') : 'E'}
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
                                                <Mail size={16} className="text-[#0f4c3a]" /> Allocate Employee
                                            </h4>
                                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
                                                {allocationSuccess ? (
                                                    <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in duration-300">
                                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                                                            <CheckCircle2 size={32} />
                                                        </div>
                                                        <h5 className="text-xl font-bold text-gray-900 mb-2">Employee Allocated!</h5>
                                                        <p className="text-gray-500 max-w-sm text-sm">They have been assigned to this unit. The employee roster and unit details have been updated.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-5">
                                                        <p className="text-sm text-gray-500 leading-relaxed">Select an employee from your organization roster to allocate to this unit. They will receive access details automatically.</p>
                                                        <div className="space-y-4">
                                                            <div className="relative w-full text-left">
                                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Employee</label>
                                                                <div className="relative">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setStudioDropdownOpen(!studioDropdownOpen)}
                                                                        className={`relative w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0f4c3a]/10 focus:border-[#0f4c3a] transition-all font-medium flex items-center justify-between cursor-pointer text-sm ${selectedEmployeeId ? 'text-gray-900' : 'text-gray-400'}`}
                                                                    >
                                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                                                        <span>
                                                                            {selectedEmployeeId 
                                                                                ? (() => {
                                                                                    const emp = MOCK_EMPLOYEES.find(e => e.id === selectedEmployeeId);
                                                                                    return emp ? `${emp.name} (${emp.role})` : "Select Employee..."
                                                                                  })()
                                                                                : "Select Employee..."
                                                                            }
                                                                        </span>
                                                                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${studioDropdownOpen ? 'rotate-180' : ''}`} />
                                                                    </button>

                                                                    {studioDropdownOpen && (
                                                                        <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto arrivio-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
                                                                            {MOCK_EMPLOYEES.map(emp => {
                                                                                const isAssigned = !!(emp.property || emp.unit);
                                                                                return (
                                                                                    <button
                                                                                        key={emp.id}
                                                                                        type="button"
                                                                                        disabled={isAssigned}
                                                                                        onClick={() => {
                                                                                            setSelectedEmployeeId(emp.id);
                                                                                            setStudioDropdownOpen(false);
                                                                                        }}
                                                                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${isAssigned ? 'text-gray-300 cursor-not-allowed opacity-50 bg-gray-50/30' : 'text-gray-700 font-medium hover:bg-[#0f4c3a]/5 hover:text-[#0f4c3a]'}`}
                                                                                    >
                                                                                        <span>{emp.name} ({emp.role})</span>
                                                                                        {isAssigned && (
                                                                                            <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded border border-gray-100 shrink-0 ml-2">
                                                                                                {emp.unit || emp.property}
                                                                                            </span>
                                                                                        )}
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={handleDirectAllocate}
                                                                disabled={!selectedEmployeeId}
                                                                className="w-full sm:w-auto px-8 py-3 bg-[#0f4c3a] text-white font-bold rounded-xl hover:bg-[#0a3a2b] transition-all shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Allocate Employee <ArrowLeft size={16} className="rotate-180" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 h-full">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <Wrench size={16} className="text-[#0f4c3a]" /> Maintenance Status
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
