import api from './api';
import { Deck, DeckAnalytics, ViewerDetails } from '@/types/deck';

// Description: Get all decks for the logged-in founder
// Endpoint: GET /api/decks
// Request: {}
// Response: { decks: Deck[] }
export const getDecks = async () => {
  try {
    const response = await api.get('/api/decks');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload a new deck
// Endpoint: POST /api/decks
// Request: FormData with { title: string, file: File }
// Response: { deck: Deck }
export const uploadDeck = async (data: FormData) => {
  try {
    const response = await api.post('/api/decks', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a deck
// Endpoint: DELETE /api/decks/:deckId
// Request: {}
// Response: { message: string }
export const deleteDeck = async (deckId: string) => {
  try {
    const response = await api.delete(`/api/decks/${deckId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update deck details
// Endpoint: PUT /api/decks/:deckId
// Request: { title?: string, isActive?: boolean }
// Response: { deck: Deck }
export const updateDeck = async (deckId: string, data: { title?: string; isActive?: boolean }) => {
  try {
    const response = await api.put(`/api/decks/${deckId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get analytics for a specific deck
// Endpoint: GET /api/decks/:deckId/analytics
// Request: {}
// Response: { analytics: DeckAnalytics }
export const getDeckAnalytics = async (deckId: string) => {
  // Mocking the response
  return new Promise<{ analytics: DeckAnalytics }>((resolve) => {
    setTimeout(() => {
      resolve({
        analytics: {
          deck: {
            _id: deckId,
            name: 'Series A Pitch Deck',
            fileName: 'series-a-deck.pdf',
            fileUrl: '/uploads/deck1.pdf',
            uploadDate: '2025-01-10T10:00:00Z',
            totalViewers: 12,
            totalOpens: 28,
            isActive: true,
            ownerId: 'user1',
            pageCount: 15,
          },
          totalViewers: 12,
          totalOpens: 28,
          averageTimeSpent: 342,
          mostViewedSlide: 5,
          dropOffSlide: 12,
          viewers: [
            {
              _id: 'v1',
              email: 'investor1@vc.com',
              deckId: deckId,
              firstOpened: '2025-01-11T09:00:00Z',
              lastOpened: '2025-01-15T14:30:00Z',
              totalOpens: 5,
              totalTimeSpent: 1200,
            },
            {
              _id: 'v2',
              email: 'investor2@fund.com',
              deckId: deckId,
              firstOpened: '2025-01-12T11:00:00Z',
              lastOpened: '2025-01-12T11:00:00Z',
              totalOpens: 1,
              totalTimeSpent: 180,
            },
            {
              _id: 'v3',
              email: 'partner@capital.com',
              deckId: deckId,
              firstOpened: '2025-01-13T15:00:00Z',
              lastOpened: '2025-01-18T10:00:00Z',
              totalOpens: 3,
              totalTimeSpent: 890,
            },
          ],
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/decks/${deckId}/analytics`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get detailed viewer information
// Endpoint: GET /api/decks/:deckId/viewers/:viewerId
// Request: {}
// Response: { viewerDetails: ViewerDetails }
export const getViewerDetails = async (deckId: string, viewerId: string) => {
  // Mocking the response
  return new Promise<{ viewerDetails: ViewerDetails }>((resolve) => {
    setTimeout(() => {
      resolve({
        viewerDetails: {
          viewer: {
            _id: viewerId,
            email: 'investor1@vc.com',
            deckId: deckId,
            firstOpened: '2025-01-11T09:00:00Z',
            lastOpened: '2025-01-15T14:30:00Z',
            totalOpens: 5,
            totalTimeSpent: 1200,
          },
          sessions: [
            {
              _id: 's1',
              viewerId: viewerId,
              deckId: deckId,
              startTime: '2025-01-11T09:00:00Z',
              endTime: '2025-01-11T09:08:00Z',
              duration: 480,
              slideNavigations: [
                { slideNumber: 1, timestamp: '2025-01-11T09:00:00Z', timeSpent: 30 },
                { slideNumber: 2, timestamp: '2025-01-11T09:00:30Z', timeSpent: 45, fromSlide: 1 },
                { slideNumber: 3, timestamp: '2025-01-11T09:01:15Z', timeSpent: 80, fromSlide: 2 },
                { slideNumber: 2, timestamp: '2025-01-11T09:02:35Z', timeSpent: 20, fromSlide: 3 },
                { slideNumber: 3, timestamp: '2025-01-11T09:02:55Z', timeSpent: 15, fromSlide: 2 },
                { slideNumber: 4, timestamp: '2025-01-11T09:03:10Z', timeSpent: 130, fromSlide: 3 },
                { slideNumber: 5, timestamp: '2025-01-11T09:05:20Z', timeSpent: 60, fromSlide: 4 },
              ],
            },
            {
              _id: 's2',
              viewerId: viewerId,
              deckId: deckId,
              startTime: '2025-01-15T14:30:00Z',
              endTime: '2025-01-15T14:42:00Z',
              duration: 720,
              slideNavigations: [
                { slideNumber: 1, timestamp: '2025-01-15T14:30:00Z', timeSpent: 20 },
                { slideNumber: 5, timestamp: '2025-01-15T14:30:20Z', timeSpent: 180, fromSlide: 1 },
                { slideNumber: 6, timestamp: '2025-01-15T14:33:20Z', timeSpent: 120, fromSlide: 5 },
                { slideNumber: 7, timestamp: '2025-01-15T14:35:20Z', timeSpent: 90, fromSlide: 6 },
              ],
            },
          ],
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/decks/${deckId}/viewers/${viewerId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get shareable link for a deck
// Endpoint: GET /api/decks/:deckId/link
// Request: {}
// Response: { link: string }
export const getDeckLink = async (deckId: string) => {
  // Mocking the response
  return new Promise<{ link: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        link: `${window.location.origin}/view/${deckId}`,
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/decks/${deckId}/link`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Export analytics to CSV
// Endpoint: GET /api/decks/:deckId/export
// Request: {}
// Response: Blob (CSV file)
export const exportAnalytics = async (deckId: string) => {
  // Mocking the response
  return new Promise<Blob>((resolve) => {
    setTimeout(() => {
      const csvContent = `Email,First Opened,Last Opened,Total Opens,Time Spent (seconds)
investor1@vc.com,2025-01-11 09:00,2025-01-15 14:30,5,1200
investor2@fund.com,2025-01-12 11:00,2025-01-12 11:00,1,180
partner@capital.com,2025-01-13 15:00,2025-01-18 10:00,3,890`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      resolve(blob);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/decks/${deckId}/export`, {
  //     responseType: 'blob',
  //   });
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};