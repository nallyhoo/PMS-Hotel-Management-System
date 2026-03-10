
export const businessAnalyticsData = {
  kpis: [
    { label: 'RevPAR', value: '$145.20', change: '+12.5%', trend: 'up' },
    { label: 'ADR', value: '$185.50', change: '+5.2%', trend: 'up' },
    { label: 'Occupancy', value: '78.4%', change: '+3.1%', trend: 'up' },
    { label: 'GOPPAR', value: '$92.15', change: '+8.4%', trend: 'up' },
  ],
  revenueBySource: [
    { name: 'Direct', value: 45000 },
    { name: 'OTA', value: 32000 },
    { name: 'Corporate', value: 18000 },
    { name: 'Groups', value: 12000 },
  ],
  monthlyPerformance: [
    { month: 'Jan', revenue: 45000, target: 42000 },
    { month: 'Feb', revenue: 52000, target: 48000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 58000 },
    { month: 'Jun', revenue: 67000, target: 62000 },
  ]
};

export const customerDemographicsData = {
  ageGroups: [
    { range: '18-24', count: 120 },
    { range: '25-34', count: 450 },
    { range: '35-44', count: 380 },
    { range: '45-54', count: 210 },
    { range: '55+', count: 140 },
  ],
  geographicDistribution: [
    { country: 'USA', value: 45 },
    { country: 'UK', value: 15 },
    { country: 'Germany', value: 12 },
    { country: 'France', value: 8 },
    { country: 'Others', value: 20 },
  ],
  guestType: [
    { name: 'Business', value: 40 },
    { name: 'Leisure', value: 50 },
    { name: 'Family', value: 10 },
  ],
  stayDuration: [
    { days: '1 night', count: 150 },
    { days: '2-3 nights', count: 420 },
    { days: '4-7 nights', count: 280 },
    { days: '8+ nights', count: 50 },
  ]
};

export const bookingTrendData = {
  bookingLeadTime: [
    { days: '0-7', bookings: 120 },
    { days: '8-14', bookings: 210 },
    { days: '15-30', bookings: 350 },
    { days: '31-60', bookings: 180 },
    { days: '60+', bookings: 90 },
  ],
  channelPerformance: [
    { date: '2024-01', Direct: 400, OTA: 300, Corporate: 200 },
    { date: '2024-02', Direct: 450, OTA: 320, Corporate: 210 },
    { date: '2024-03', Direct: 420, OTA: 350, Corporate: 190 },
    { date: '2024-04', Direct: 500, OTA: 380, Corporate: 230 },
  ],
  cancellationRate: [
    { month: 'Jan', rate: 4.2 },
    { month: 'Feb', rate: 3.8 },
    { month: 'Mar', rate: 5.1 },
    { month: 'Apr', rate: 4.5 },
  ]
};

export const seasonalRevenueData = {
  seasonalTrends: [
    { season: 'Winter', revenue: 120000, occupancy: 65 },
    { season: 'Spring', revenue: 180000, occupancy: 75 },
    { season: 'Summer', revenue: 250000, occupancy: 92 },
    { season: 'Autumn', revenue: 160000, occupancy: 70 },
  ],
  holidayImpact: [
    { holiday: 'Christmas', revenue: 45000, increase: 25 },
    { holiday: 'New Year', revenue: 52000, increase: 35 },
    { holiday: 'Easter', revenue: 38000, increase: 15 },
    { holiday: 'Summer Break', revenue: 85000, increase: 45 },
  ],
  yearOverYear: [
    { month: 'Jan', current: 45000, previous: 41000 },
    { month: 'Feb', current: 52000, previous: 47000 },
    { month: 'Mar', current: 48000, previous: 45000 },
    { month: 'Apr', current: 61000, previous: 54000 },
  ]
};
