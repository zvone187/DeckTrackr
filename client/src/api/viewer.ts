import api from './api';

// Description: Submit email to view deck (for investors)
// Endpoint: POST /api/viewer/access
// Request: { deckId: string, email: string }
// Response: { success: boolean, viewerId: string }
export const submitViewerEmail = async (data: { deckId: string; email: string }) => {
  // Mocking the response
  return new Promise<{ success: boolean; viewerId: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        viewerId: 'viewer123',
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/viewer/access', data);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get deck for viewing (public endpoint)
// Endpoint: GET /api/viewer/deck/:deckId
// Request: {}
// Response: { deck: { name: string, pageCount: number, fileUrl: string, isActive: boolean } }
export const getPublicDeck = async (deckId: string) => {
  // Mocking the response
  return new Promise<{ deck: { name: string; pageCount: number; fileUrl: string; isActive: boolean } }>((resolve) => {
    setTimeout(() => {
      resolve({
        deck: {
          name: 'Series A Pitch Deck',
          pageCount: 15,
          fileUrl: '/uploads/deck1.pdf',
          isActive: true,
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/viewer/deck/${deckId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Track slide navigation
// Endpoint: POST /api/viewer/track
// Request: { deckId: string, viewerId: string, slideNumber: number, fromSlide?: number }
// Response: { success: boolean }
export const trackSlideNavigation = async (data: {
  deckId: string;
  viewerId: string;
  slideNumber: number;
  fromSlide?: number;
}) => {
  // Mocking the response
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 100);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/viewer/track', data);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Start viewing session
// Endpoint: POST /api/viewer/session/start
// Request: { deckId: string, viewerId: string }
// Response: { sessionId: string }
export const startViewingSession = async (data: { deckId: string; viewerId: string }) => {
  // Mocking the response
  return new Promise<{ sessionId: string }>((resolve) => {
    setTimeout(() => {
      resolve({ sessionId: 'session123' });
    }, 100);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/viewer/session/start', data);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: End viewing session
// Endpoint: POST /api/viewer/session/end
// Request: { sessionId: string }
// Response: { success: boolean }
export const endViewingSession = async (sessionId: string) => {
  // Mocking the response
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 100);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/viewer/session/end', { sessionId });
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};