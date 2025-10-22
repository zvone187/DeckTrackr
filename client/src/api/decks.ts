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
    // Use fetch with native FormData to avoid axios/proxy body size limits
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('/api/decks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to upload deck' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to upload deck');
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
  try {
    const response = await api.get(`/api/decks/${deckId}/analytics`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get detailed viewer information
// Endpoint: GET /api/decks/:deckId/viewers/:viewerId
// Request: {}
// Response: { viewerDetails: ViewerDetails }
export const getViewerDetails = async (deckId: string, viewerId: string) => {
  try {
    const response = await api.get(`/api/decks/${deckId}/viewers/${viewerId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
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