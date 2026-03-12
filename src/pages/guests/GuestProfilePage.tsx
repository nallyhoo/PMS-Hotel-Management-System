import React, { useState, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  History, 
  Settings, 
  FileText, 
  CreditCard, 
  Award,
  MoreVertical,
  Edit2,
  ExternalLink,
  Plus,
  Download,
  Trash2,
  ShieldCheck,
  Heart,
  Coffee,
  Wifi,
  Wind,
  Loader2,
  X,
  MessageSquare,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import guestService from '../../api/guests';
import billingService from '../../api/billing';
import { toastSuccess, toastError } from '../../lib/toast';
import { format, parseISO } from 'date-fns';
import type { Guest, GuestDocument, GuestLoyalty } from '../../types/database';

interface ReservationData {
  reservationId: number;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  roomTypeName: string;
  adults: number;
  children: number;
}

type Tab = 'history' | 'notes' | 'preferences' | 'documents' | 'loyalty' | 'billing';

export default function GuestProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const guestId = id ? Number(id) : null;
  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddPreference, setShowAddPreference] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newNote, setNewNote] = useState({ noteType: 'General', noteContent: '' });
  const [newPreference, setNewPreference] = useState({ preferenceType: '', preferenceValue: '', notes: '' });
  const [newDocument, setNewDocument] = useState({ 
    documentType: '', 
    documentNumber: '', 
    imageUrl: '',
    issueDate: '',
    expiryDate: ''
  });

  const generateDocumentNumber = (docType: string) => {
    const typePrefix: Record<string, string> = {
      'Passport': 'PAS',
      'ID Card': 'ID',
      'Driver License': 'DL',
      'Business Card': 'BC',
      'Company ID': 'CI',
      'Visa': 'VISA',
      'Other': 'DOC'
    };
    const prefix = typePrefix[docType] || 'DOC';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleDocumentTypeChange = (docType: string) => {
    setNewDocument(prev => ({ 
      ...prev, 
      documentType: docType,
      documentNumber: generateDocumentNumber(docType)
    }));
  };

  // Fetch guest notes
  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['guestNotes', guestId],
    queryFn: () => guestService.getGuestNotes(guestId!),
    enabled: activeTab === 'notes' || activeTab === 'preferences',
  });

  // Fetch guest preferences
  const { data: preferences, isLoading: loadingPreferences } = useQuery({
    queryKey: ['guestPreferences', guestId],
    queryFn: () => guestService.getGuestPreferences(guestId!),
    enabled: activeTab === 'notes' || activeTab === 'preferences',
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: () => guestService.addGuestNote(guestId!, newNote),
    onSuccess: () => {
      toastSuccess('Note added successfully');
      queryClient.invalidateQueries({ queryKey: ['guestNotes', guestId] });
      setShowAddNote(false);
      setNewNote({ noteType: 'General', noteContent: '' });
    },
    onError: (err: any) => toastError(err.message || 'Failed to add note'),
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => guestService.deleteGuestNote(noteId),
    onSuccess: () => {
      toastSuccess('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['guestNotes', guestId] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to delete note'),
  });

  // Add preference mutation
  const addPreferenceMutation = useMutation({
    mutationFn: () => guestService.addGuestPreference(guestId!, newPreference),
    onSuccess: () => {
      toastSuccess('Preference added successfully');
      queryClient.invalidateQueries({ queryKey: ['guestPreferences', guestId] });
      setShowAddPreference(false);
      setNewPreference({ preferenceType: '', preferenceValue: '', notes: '' });
    },
    onError: (err: any) => toastError(err.message || 'Failed to add preference'),
  });

  // Delete preference mutation
  const deletePreferenceMutation = useMutation({
    mutationFn: (prefId: number) => guestService.deleteGuestPreference(prefId),
    onSuccess: () => {
      toastSuccess('Preference deleted');
      queryClient.invalidateQueries({ queryKey: ['guestPreferences', guestId] });
    },
    onError: (err: any) => toastError(err.message || 'Failed to delete preference'),
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: () => guestService.addGuestDocument(guestId!, {
      documentType: newDocument.documentType,
      documentNumber: newDocument.documentNumber,
      imageUrl: newDocument.imageUrl || undefined,
      issueDate: newDocument.issueDate || undefined,
      expiryDate: newDocument.expiryDate || undefined,
    }),
    onSuccess: () => {
      toastSuccess('Document added successfully');
      queryClient.invalidateQueries({ queryKey: ['guestDocuments', guestId] });
      setShowAddDocument(false);
      setNewDocument({ documentType: '', documentNumber: '', imageUrl: '', issueDate: '', expiryDate: '' });
    },
    onError: (err: any) => toastError(err.message || 'Failed to add document'),
  });

  const documentFileRef = useRef<HTMLInputElement>(null);

  const handleDocumentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDocument(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Fetch guest details
  const { data: guestData, isLoading: loadingGuest, error: guestError } = useQuery<Guest>({
    queryKey: ['guest', guestId],
    queryFn: () => guestService.getGuest(guestId!),
    enabled: !!guestId && !isNaN(guestId),
  });

  // Fetch guest reservations (stay history)
  const { data: reservations, isLoading: loadingReservations } = useQuery<any[]>({
    queryKey: ['guestReservations', guestId],
    queryFn: () => guestService.getGuestReservations(guestId!),
    enabled: !!guestId && !isNaN(guestId),
  });

  // Fetch guest loyalty
  const { data: loyalty, isLoading: loadingLoyalty } = useQuery<GuestLoyalty>({
    queryKey: ['guestLoyalty', guestId],
    queryFn: () => guestService.getGuestLoyalty(guestId!),
    enabled: !!guestId && !isNaN(guestId),
  });

  // Fetch guest documents
  const { data: documents, isLoading: loadingDocuments } = useQuery<GuestDocument[]>({
    queryKey: ['guestDocuments', guestId],
    queryFn: () => guestService.getGuestDocuments(guestId!),
    enabled: !!guestId && !isNaN(guestId),
  });

  // Build billing data from reservations (since Payments table is empty)
  const billingData = useMemo(() => {
    if (!reservations || reservations.length === 0) return [];
    return reservations.map((r: any) => ({
      id: r.reservationId,
      reservationCode: r.reservationCode,
      checkInDate: r.checkInDate,
      checkOutDate: r.checkOutDate,
      totalAmount: r.totalAmount || 0,
      depositAmount: r.depositAmount || 0,
      depositPaid: r.depositPaid,
      status: r.status,
      paymentStatus: r.status === 'Checked Out' ? 'Paid' : 
                    r.depositPaid ? 'Partial' : 
                    r.totalAmount > 0 ? 'Pending' : 'Paid',
    }));
  }, [reservations]);

  // Calculate totals from reservations
  const totalStays = reservations?.length || 0;
  const totalSpent = reservations?.reduce((sum, r) => sum + (r.totalAmount || 0), 0) || 0;
  const totalPaid = billingData.reduce((sum, b) => sum + (b.depositPaid ? b.depositAmount : 0), 0);
  const lastStay = reservations?.[0];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'history', label: 'Stay History', icon: History },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'preferences', label: 'Preferences', icon: Heart },
    { id: 'loyalty', label: 'Loyalty & Points', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'billing', label: 'Payment History', icon: CreditCard },
  ];

  if (!guestId || isNaN(guestId)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#1a1a1a]/40">Invalid guest ID</p>
      </div>
    );
  }

  if (loadingGuest) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
      </div>
    );
  }

  if (guestError || !guestData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">Failed to load guest data</p>
        <button 
          onClick={() => navigate('/guests')}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm"
        >
          Back to Guests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-6">
          <button 
            onClick={() => navigate('/guests')}
            className="mt-2 p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
            <div className="flex items-center gap-6">
            {guestData?.imageUrl ? (
              <img 
                src={guestData.imageUrl} 
                alt={`${guestData.firstName} ${guestData.lastName}`}
                className="w-24 h-24 rounded-3xl object-cover shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-[#1a1a1a] text-white flex items-center justify-center text-3xl font-serif shadow-xl">
                {guestData?.firstName?.[0]}{guestData?.lastName?.[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-serif">{guestData?.firstName || 'Guest'} {guestData?.lastName || ''}</h1>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                  {loyalty?.tierLevel || 'Regular'} Member
                </span>
              </div>
              <p className="text-sm text-[#1a1a1a]/40 font-medium uppercase tracking-widest">G-{guestData?.guestId || '—'} • Member since {guestData?.createdDate ? format(parseISO(guestData.createdDate), 'MMM yyyy') : 'N/A'}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/60">
                  <Mail size={14} /> {guestData?.email || 'N/A'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/60">
                  <Phone size={14} /> {guestData?.phone || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/guests/edit/${id}`}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <Edit2 size={14} /> Edit Profile
          </Link>
          <button className="p-2 border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <MoreVertical size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Stays', value: totalStays, sub: `Nights: ${reservations?.reduce((sum, r) => {
            if (!r.checkInDate || !r.checkOutDate) return sum;
            const checkIn = parseISO(r.checkInDate);
            const checkOut = parseISO(r.checkOutDate);
            return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) || 0}` },
          { label: 'Total Revenue', value: `$${totalSpent.toLocaleString()}`, sub: `Avg: $${totalStays > 0 ? Math.round(totalSpent / totalStays) : 0} / night` },
          { label: 'Loyalty Points', value: (loyalty?.points || 0).toLocaleString(), sub: 'Next Tier: 2,500 pts' },
          { label: 'Last Stay', value: lastStay?.checkInDate ? format(parseISO(lastStay.checkInDate), 'MMM d, yyyy') : 'N/A', sub: lastStay?.roomTypeName || 'N/A' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-serif mb-1">{stat.value}</p>
            <p className="text-[10px] text-[#1a1a1a]/60 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#1a1a1a]/5 flex items-center gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 text-xs font-medium uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                      <th className="px-6 py-4">Stay Dates</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Reservation ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/5">
                    {loadingReservations ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <Loader2 className="animate-spin text-[#1a1a1a]/40 mx-auto" size={24} />
                        </td>
                      </tr>
                    ) : reservations && reservations.length > 0 ? (
                      reservations.map((stay: any) => (
                        <tr key={stay.reservationId} className="text-sm hover:bg-[#f8f9fa] transition-colors">
                          <td className="px-6 py-4 font-medium">
                            {stay.checkInDate ? format(parseISO(stay.checkInDate), 'MMM d') : 'N/A'} - {stay.checkOutDate ? format(parseISO(stay.checkOutDate), 'MMM d, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-[#1a1a1a]/60">{stay.roomTypeName || 'N/A'}</td>
                          <td className="px-6 py-4 text-[#1a1a1a]/40 font-mono text-xs">{stay.reservationCode || 'N/A'}</td>
                          <td className="px-6 py-4 font-medium">${(stay.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              stay.status === 'Checked Out' || stay.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : stay.status === 'Checked In'
                                ? 'bg-blue-50 text-blue-600'
                                : stay.status === 'Cancelled'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {stay.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-[#1a1a1a]/40">
                          No stay history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div 
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-serif">Guest Notes</h3>
                  <button 
                    onClick={() => setShowAddNote(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium hover:bg-[#333]"
                  >
                    <Plus size={14} /> Add Note
                  </button>
                </div>
                
                {loadingNotes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-[#1a1a1a]/40" size={24} />
                  </div>
                ) : notes && notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note: any) => (
                      <div key={note.noteId || note.NoteID} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600">{note.noteType || note.NoteType}</span>
                            <p className="text-xs text-amber-900 leading-relaxed mt-1">"{note.noteContent || note.NoteContent}"</p>
                            <p className="text-[10px] text-amber-700/60 mt-2 font-medium uppercase tracking-widest">
                              {(note.createdDate || note.CreatedDate) ? format(parseISO(note.createdDate || note.CreatedDate), 'MMM d, yyyy HH:mm') : ''}
                            </p>
                          </div>
                          <button 
                            onClick={() => deleteNoteMutation.mutate(note.noteId || note.NoteID)}
                            className="p-1 hover:bg-amber-100 rounded"
                          >
                            <Trash2 size={14} className="text-amber-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1a1a1a]/40">
                    <MessageSquare size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div 
              key="preferences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-serif">Guest Preferences</h3>
                  <button 
                    onClick={() => setShowAddPreference(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium hover:bg-[#333]"
                  >
                    <Plus size={14} /> Add Preference
                  </button>
                </div>
                
                {loadingPreferences ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-[#1a1a1a]/40" size={24} />
                  </div>
                ) : preferences && preferences.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {preferences.map((pref: any) => (
                      <div key={pref.preferenceId || pref.PreferenceID} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{pref.preferenceType || pref.PreferenceType}</p>
                          <p className="text-sm font-medium">{(pref.preferenceValue || pref.PreferenceValue) || '—'}</p>
                        </div>
                        <button 
                          onClick={() => deletePreferenceMutation.mutate(pref.preferenceId || pref.PreferenceID)}
                          className="p-1 hover:bg-white rounded"
                        >
                          <Trash2 size={14} className="text-[#1a1a1a]/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1a1a1a]/40">
                    <Heart size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No preferences yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'loyalty' && (
            <motion.div 
              key="loyalty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {loadingLoyalty ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#1a1a1a]/40" size={24} />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-[#1a1a1a] text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Current Tier</p>
                          <h3 className="text-4xl font-serif">{loyalty?.tierLevel || 'Bronze'} Member</h3>
                        </div>
                        <Award size={48} className="text-purple-400 opacity-50" />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-xs font-medium">Progress to Next Tier</p>
                          <p className="text-xs font-medium">{(loyalty?.points || 0).toLocaleString()} / {(loyalty?.totalPointsEarned || 15000).toLocaleString()} pts</p>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.5)]" 
                            style={{ width: `${Math.min(((loyalty?.points || 0) / (loyalty?.totalPointsEarned || 15000)) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Available Points</p>
                          <p className="text-2xl font-serif">{(loyalty?.points || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Points Expiring</p>
                          <p className="text-2xl font-serif">0</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Lifetime Points</p>
                          <p className="text-2xl font-serif">{(loyalty?.totalPointsEarned || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
                    <h3 className="text-lg font-serif">Tier Benefits</h3>
                    <div className="space-y-4">
                      {[
                        'Complimentary Room Upgrades',
                        'Late Checkout (until 4 PM)',
                        'Welcome Amenity & Drink',
                        '25% Bonus Points on Stays',
                        'Executive Lounge Access',
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-[#1a1a1a]/60">
                          <ShieldCheck size={16} className="text-emerald-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div 
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loadingDocuments ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#1a1a1a]/40" size={24} />
                </div>
              ) : documents && documents.length > 0 ? (
                documents.map((doc: any) => (
                  <div key={doc.documentId || doc.DocumentID} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm group hover:border-[#1a1a1a]/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      {doc.imageUrl ? (
                        <img src={doc.imageUrl} alt={doc.documentType} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="p-3 bg-[#f8f9fa] rounded-xl text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors">
                          <FileText size={24} />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {doc.imageUrl && (
                          <a href={doc.imageUrl} download className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/40">
                            <Download size={16} />
                          </a>
                        )}
                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium mb-1">{doc.documentType || doc.DocumentType || 'Document'}</h4>
                    <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">
                      <span>{doc.documentNumber || doc.DocumentNumber || 'N/A'}</span>
                      <span>{(doc.createdDate || doc.CreatedDate) ? format(parseISO(doc.createdDate || doc.CreatedDate), 'MMM d, yyyy') : 'N/A'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-[#1a1a1a]/40">
                  <FileText size={32} className="mx-auto mb-2" />
                  <p className="text-sm">No documents found</p>
                </div>
              )}
              <button 
                onClick={() => setShowAddDocument(true)}
                className="bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#1a1a1a]/30 transition-all group"
              >
                <div className="p-3 bg-white rounded-xl text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/40 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-medium text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/60">Upload New Document</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div 
              key="billing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 p-6 border-b border-[#1a1a1a]/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Total Revenue</p>
                    <p className="text-xl font-serif">${totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Amount Paid</p>
                    <p className="text-xl font-serif text-emerald-600">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Balance</p>
                    <p className="text-xl font-serif text-amber-600">${(totalSpent - totalPaid).toLocaleString()}</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                      <th className="px-6 py-4">Reservation</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Deposit</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/5">
                    {loadingReservations ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <Loader2 className="animate-spin text-[#1a1a1a]/40 mx-auto" size={24} />
                        </td>
                      </tr>
                    ) : billingData && billingData.length > 0 ? (
                      billingData.map((bill: any) => (
                        <tr key={bill.id} className="text-sm hover:bg-[#f8f9fa] transition-colors">
                          <td className="px-6 py-4 font-medium">
                            {bill.reservationCode || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-[#1a1a1a]/60">
                            {bill.checkInDate ? format(parseISO(bill.checkInDate), 'MMM d') : ''} - {bill.checkOutDate ? format(parseISO(bill.checkOutDate), 'MMM d, yyyy') : ''}
                          </td>
                          <td className="px-6 py-4 font-medium">${(bill.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-[#1a1a1a]/60">
                            ${(bill.depositAmount || 0).toLocaleString()} {bill.depositPaid ? '(Paid)' : '(Pending)'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              bill.status === 'Checked Out' || bill.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : bill.status === 'Checked In'
                                ? 'bg-blue-50 text-blue-600'
                                : bill.status === 'Cancelled'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {bill.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              bill.paymentStatus === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : bill.paymentStatus === 'Partial'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {bill.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-[#1a1a1a]/40">
                          No billing history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Add Guest Note</h3>
              <button onClick={() => setShowAddNote(false)} className="p-1 hover:bg-[#f8f9fa] rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Note Type</label>
                <select 
                  value={newNote.noteType}
                  onChange={(e) => setNewNote(prev => ({ ...prev, noteType: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="General">General</option>
                  <option value="Preference">Preference</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Compliment">Compliment</option>
                  <option value="Special Request">Special Request</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Note Content *</label>
                <textarea 
                  value={newNote.noteContent}
                  onChange={(e) => setNewNote(prev => ({ ...prev, noteContent: e.target.value }))}
                  rows={4}
                  placeholder="Enter note details..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddNote(false)}
                className="flex-1 px-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
              >
                Cancel
              </button>
              <button
                onClick={() => addNoteMutation.mutate()}
                disabled={!newNote.noteContent.trim() || addNoteMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
              >
                {addNoteMutation.isPending ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Preference Modal */}
      {showAddPreference && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Add Guest Preference</h3>
              <button onClick={() => setShowAddPreference(false)} className="p-1 hover:bg-[#f8f9fa] rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Preference Type *</label>
                <select 
                  value={newPreference.preferenceType}
                  onChange={(e) => setNewPreference(prev => ({ ...prev, preferenceType: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="">Select Type</option>
                  <option value="Room Type">Room Type</option>
                  <option value="Bed Type">Bed Type</option>
                  <option value="Floor">Floor</option>
                  <option value="Dietary">Dietary</option>
                  <option value="Smoking">Smoking</option>
                  <option value="Pillow">Pillow</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Preference Value</label>
                <input 
                  type="text"
                  value={newPreference.preferenceValue}
                  onChange={(e) => setNewPreference(prev => ({ ...prev, preferenceValue: e.target.value }))}
                  placeholder="e.g. High floor, King bed, Non-smoking..."
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Notes</label>
                <textarea 
                  value={newPreference.notes}
                  onChange={(e) => setNewPreference(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddPreference(false)}
                className="flex-1 px-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
              >
                Cancel
              </button>
              <button
                onClick={() => addPreferenceMutation.mutate()}
                disabled={!newPreference.preferenceType || addPreferenceMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
              >
                {addPreferenceMutation.isPending ? 'Saving...' : 'Save Preference'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Upload Document</h3>
              <button onClick={() => setShowAddDocument(false)} className="p-1 hover:bg-[#f8f9fa] rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Document Type *</label>
                <select
                  value={newDocument.documentType}
                  onChange={(e) => handleDocumentTypeChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="">Select Type</option>
                  <option value="Passport">Passport</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Driver License">Driver License</option>
                  <option value="Business Card">Business Card</option>
                  <option value="Company ID">Company ID</option>
                  <option value="Visa">Visa</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Document Number</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newDocument.documentNumber}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, documentNumber: e.target.value }))}
                    placeholder="Auto-generated"
                    className="flex-1 px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setNewDocument(prev => ({ ...prev, documentNumber: generateDocumentNumber(prev.documentType) }))}
                    disabled={!newDocument.documentType}
                    className="px-3 py-2 bg-[#f8f9fa] rounded-xl text-xs font-medium hover:bg-[#e9e9e9] disabled:opacity-50"
                    title="Regenerate"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Issue Date</label>
                  <input 
                    type="date"
                    value={newDocument.issueDate}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Expiry Date</label>
                  <input 
                    type="date"
                    value={newDocument.expiryDate}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Document Image</label>
                <input
                  type="file"
                  ref={documentFileRef}
                  onChange={handleDocumentImageUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                {newDocument.imageUrl ? (
                  <div className="relative">
                    <img src={newDocument.imageUrl} alt="Document" className="w-full h-40 object-contain rounded-xl border border-[#1a1a1a]/10" />
                    <button
                      type="button"
                      onClick={() => setNewDocument(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => documentFileRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-[#1a1a1a]/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#1a1a1a]/40 transition-colors"
                  >
                    <Upload size={24} className="text-[#1a1a1a]/40" />
                    <span className="text-xs text-[#1a1a1a]/60">Click to upload</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddDocument(false)}
                className="flex-1 px-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
              >
                Cancel
              </button>
              <button
                onClick={() => addDocumentMutation.mutate()}
                disabled={!newDocument.documentType || addDocumentMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
              >
                {addDocumentMutation.isPending ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
