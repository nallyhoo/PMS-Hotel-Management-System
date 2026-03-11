import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  XCircle, 
  CheckCircle2, 
  Printer, 
  Mail, 
  CreditCard, 
  MessageSquare, 
  History,
  User,
  Calendar,
  Bed,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import type { Reservation, ReservationHistory, ReservationNote } from '../../types/database';

export default function ReservationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: !!id,
  });

  const { data: notes } = useQuery({
    queryKey: ['reservationNotes', id],
    queryFn: () => reservationService.getReservationNotes(Number(id)),
    enabled: !!id,
  });

  const { data: history } = useQuery({
    queryKey: ['reservationHistory', id],
    queryFn: () => reservationService.getReservationHistory(Number(id)),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      reservationService.cancelReservation(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', id] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setShowCancelModal(false);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => reservationService.confirmReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', id] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelMutation.mutate({ id: Number(id), reason: cancelReason });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[#1a1a1a]/40" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load reservation</h3>
        <p className="text-sm text-gray-500 mb-4">{error?.message || 'Reservation not found'}</p>
        <button 
          onClick={() => navigate('/reservations/list')}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333]"
        >
          Back to Reservations
        </button>
      </div>
    );
  }

  const reservation = data as any;
  const nights = differenceInDays(new Date(reservation.checkOutDate), new Date(reservation.checkInDate));

  const tabs = ['Overview', 'Guest Details', 'Billing', 'Notes', 'History'];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Checked In': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Checked Out': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/reservations/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-serif font-light">{reservation.reservationCode || `RES-${reservation.reservationId}`}</h1>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusStyles(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Created on {reservation.createdDate ? format(new Date(reservation.createdDate), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10" title="Print Invoice">
            <Printer size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10" title="Email Confirmation">
            <Mail size={18} className="text-[#1a1a1a]/60" />
          </button>
          <div className="h-8 w-px bg-[#1a1a1a]/10 mx-1"></div>
          
          {reservation.status === 'Pending' && (
            <button 
              onClick={() => confirmMutation.mutate(Number(id))}
              disabled={confirmMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              Confirm
            </button>
          )}
          
          <button 
            onClick={() => navigate(`/reservations/edit/${reservation.reservationId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <Edit2 size={14} />
            Edit
          </button>
          
          {reservation.status !== 'Cancelled' && reservation.status !== 'Checked Out' && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              <XCircle size={14} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-[#1a1a1a]/10 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-medium uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm min-h-[400px]">
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <Calendar size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Stay Dates</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Check-in</p>
                        <p className="text-sm font-medium">{reservation.checkInDate ? format(new Date(reservation.checkInDate), 'EEE, MMM dd, yyyy') : 'N/A'}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 mt-1">From 02:00 PM</p>
                      </div>
                      <ChevronRight size={16} className="text-[#1a1a1a]/20" />
                      <div className="flex-1 p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Check-out</p>
                        <p className="text-sm font-medium">{reservation.checkOutDate ? format(new Date(reservation.checkOutDate), 'EEE, MMM dd, yyyy') : 'N/A'}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 mt-1">Until 11:00 AM</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <Bed size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Room Assignment</span>
                    </div>
                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{reservation.roomTypeName || 'Standard'}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mt-1">
                          {reservation.assignedRoomId ? `Room ${reservation.assignedRoomId}` : 'Not Assigned'}
                        </p>
                      </div>
                      <button className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a] hover:underline">
                        Change Room
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                    <MessageSquare size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Special Requests</span>
                  </div>
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <p className="text-sm text-amber-900 font-light leading-relaxed italic">
                      {reservation.specialRequests || 'No special requests'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Guest Details' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 p-6 bg-[#f8f9fa] rounded-xl">
                  <div className="w-16 h-16 bg-[#1a1a1a]/5 rounded-full flex items-center justify-center">
                    <User size={32} className="text-[#1a1a1a]/40" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">{reservation.firstName} {reservation.lastName}</p>
                    <p className="text-sm text-[#1a1a1a]/60">{reservation.email}</p>
                    <p className="text-sm text-[#1a1a1a]/60">{reservation.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f8f9fa] rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Adults</p>
                    <p className="font-medium">{reservation.adults || 1}</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Children</p>
                    <p className="font-medium">{reservation.children || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-6 bg-[#f8f9fa] rounded-xl space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1a1a1a]/60">Room ({nights} nights)</span>
                    <span className="font-medium">${(reservation.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1a1a1a]/60">Taxes & Fees</span>
                    <span className="font-medium">${((reservation.totalAmount || 0) * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-serif font-medium">${((reservation.totalAmount || 0) * 1.12).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between p-4 border border-[#1a1a1a]/10 rounded-xl">
                  <span className="text-sm text-[#1a1a1a]/60">Deposit {reservation.depositPaid ? '(Paid)' : '(Pending)'}</span>
                  <span className={`font-medium ${reservation.depositPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ${(reservation.depositAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                {notes && notes.length > 0 ? (
                  notes.map((note: ReservationNote, idx: number) => (
                    <div key={idx} className="p-4 bg-[#f8f9fa] rounded-xl">
                      <p className="text-sm">{note.noteText || 'No note text'}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 mt-2">
                        {note.createdDate ? format(new Date(note.createdDate), 'MMM dd, yyyy HH:mm') : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#1a1a1a]/40 py-8">No notes yet</p>
                )}
                <button className="w-full p-4 border-2 border-dashed border-[#1a1a1a]/10 rounded-xl text-sm text-[#1a1a1a]/40 hover:border-[#1a1a1a]/20 hover:text-[#1a1a1a]/60 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} />
                  Add Note
                </button>
              </div>
            )}

            {activeTab === 'History' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {history && history.length > 0 ? (
                  history.map((item: ReservationHistory, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 text-right shrink-0">
                        <div className="w-2 h-2 bg-[#1a1a1a]/20 rounded-full mx-auto mt-1.5 relative z-10"></div>
                        {idx < history.length - 1 && <div className="w-px h-full bg-[#1a1a1a]/5 mx-auto -mt-1"></div>}
                      </div>
                      <div className="pb-6">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">
                          {item.actionDate ? format(new Date(item.actionDate), 'MMM dd, yyyy HH:mm') : 'Unknown date'}
                        </p>
                        <p className="text-sm font-medium mb-1">{item.action || 'Action'}</p>
                        {item.notes && <p className="text-xs text-[#1a1a1a]/40 font-light">{item.notes}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#1a1a1a]/40 py-8">No history yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-[#1a1a1a]/60">Booking Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Source</span>
                <span className="font-medium">{reservation.bookingSource || 'Direct'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Guests</span>
                <span className="font-medium">{(reservation.adults || 1) + (reservation.children || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Confirmation</span>
                <span className="font-medium font-mono">{reservation.confirmationDate ? 'Confirmed' : 'Pending'}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1a1a1a]/5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#1a1a1a]/60">Total Amount</span>
                <span className="text-xl font-serif font-medium">${(reservation.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {reservation.status === 'Confirmed' && (
            <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-[#1a1a1a]/60">Quick Actions</h3>
              <button 
                onClick={() => navigate(`/checkin/process/${reservation.reservationId}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 size={16} />
                Check-in Guest
              </button>
            </div>
          )}

          {reservation.status === 'Checked In' && (
            <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-[#1a1a1a]/60">Quick Actions</h3>
              <button 
                onClick={() => navigate(`/checkout/process/${reservation.reservationId}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-blue-700 transition-colors"
              >
                <CreditCard size={16} />
                Check-out Guest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-medium">Cancel Reservation</h3>
            <p className="text-sm text-[#1a1a1a]/60">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Cancellation Reason</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm"
                placeholder="Enter reason for cancellation..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
              >
                Keep Reservation
              </button>
              <button 
                onClick={handleCancel}
                disabled={!cancelReason.trim() || cancelMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
