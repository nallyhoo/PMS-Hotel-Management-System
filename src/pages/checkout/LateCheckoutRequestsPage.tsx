import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  User,
  MapPin,
  Loader2,
  Plus,
  X,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import { format, parseISO, differenceInHours } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

interface LateCheckoutRequest {
  id: number;
  reservationId: number;
  guestName: string;
  roomNumber: string;
  originalCheckout: string;
  requestedTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

export default function LateCheckoutRequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LateCheckoutRequest | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  // Mock data for late checkout requests
  const [requests, setRequests] = useState<LateCheckoutRequest[]>([
    {
      id: 1,
      reservationId: 101,
      guestName: 'John Smith',
      roomNumber: '205',
      originalCheckout: '2026-03-12 11:00',
      requestedTime: '2026-03-12 14:00',
      reason: 'Flight is at 6 PM, need more time to pack',
      status: 'pending',
      createdAt: '2026-03-12 09:30',
    },
    {
      id: 2,
      reservationId: 102,
      guestName: 'Maria Garcia',
      roomNumber: '308',
      originalCheckout: '2026-03-12 11:00',
      requestedTime: '2026-03-12 15:00',
      reason: 'Business meeting nearby, will return late evening',
      status: 'pending',
      createdAt: '2026-03-12 08:15',
    },
    {
      id: 3,
      reservationId: 103,
      guestName: 'David Chen',
      roomNumber: '410',
      originalCheckout: '2026-03-12 11:00',
      requestedTime: '2026-03-12 13:00',
      reason: 'Late checkout for personal reasons',
      status: 'approved',
      createdAt: '2026-03-12 07:00',
    },
  ]);

  const filteredRequests = requests.filter(req => 
    req.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.roomNumber.includes(searchTerm) ||
    req.reservationId.toString().includes(searchTerm)
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const deniedRequests = filteredRequests.filter(r => r.status === 'denied');

  const approveRequest = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    toastSuccess('Late checkout request approved');
    setShowApproveModal(false);
    setSelectedRequest(null);
  };

  const denyRequest = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'denied' as const } : req
    ));
    toastSuccess('Late checkout request denied');
    setShowDenyModal(false);
    setDenyReason('');
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'approved': return 'bg-emerald-50 text-emerald-700';
      case 'denied': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'approved': return <CheckCircle2 size={14} />;
      case 'denied': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Late Checkout Requests</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Manage guest requests for late checkouts
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Pending</p>
            <p className="text-xl font-serif">{pendingRequests.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Approved</p>
            <p className="text-xl font-serif">{approvedRequests.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <XCircle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Denied</p>
            <p className="text-xl font-serif">{deniedRequests.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name, room number, or reservation ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
        />
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Requests Found</h3>
            <p className="text-sm text-[#1a1a1a]/60">
              No late checkout requests match your search.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]/5">
            {filteredRequests.map((request) => (
              <div 
                key={request.id}
                className="p-4 hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                    {request.guestName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium">{request.guestName}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider mb-2">
                      <span>Res #{request.reservationId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> Room {request.roomNumber}</span>
                    </div>
                    <div className="p-3 bg-[#f8f9fa] rounded-lg text-sm">
                      <p className="text-[#1a1a1a]/60 mb-1">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                      <p className="text-xs text-[#1a1a1a]/40">
                        Original: {format(parseISO(request.originalCheckout), 'MMM d, HH:mm')} → 
                        Requested: {format(parseISO(request.requestedTime), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDenyModal(true);
                        }}
                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-serif">Approve Late Checkout</h3>
              <p className="text-sm text-[#1a1a1a]/60 mt-2">
                Approve late checkout request for {selectedRequest.guestName}?
              </p>
            </div>

            <div className="p-4 bg-[#f8f9fa] rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Guest</span>
                <span className="font-medium">{selectedRequest.guestName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Room</span>
                <span className="font-medium">{selectedRequest.roomNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/60">New Checkout</span>
                <span className="font-medium">{format(parseISO(selectedRequest.requestedTime), 'MMM d, HH:mm')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => approveRequest(selectedRequest.id)}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Modal */}
      {showDenyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-serif">Deny Late Checkout</h3>
              <p className="text-sm text-[#1a1a1a]/60 mt-2">
                Deny late checkout request for {selectedRequest.guestName}?
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for denial (optional)</label>
              <textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                rows={3}
                placeholder="e.g., Room is booked for next guest..."
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDenyModal(false)}
                className="flex-1 px-4 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => denyRequest(selectedRequest.id)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Deny Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
