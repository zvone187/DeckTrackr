export interface Deck {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  totalViewers: number;
  totalOpens: number;
  isActive: boolean;
  ownerId: string;
  pageCount: number;
}

export interface DeckViewer {
  _id: string;
  email: string;
  deckId: string;
  firstOpened: string;
  lastOpened: string;
  totalOpens: number;
  totalTimeSpent: number;
}

export interface ViewingSession {
  _id: string;
  viewerId: string;
  deckId: string;
  startTime: string;
  endTime: string;
  duration: number;
  slideNavigations: SlideNavigation[];
}

export interface SlideNavigation {
  slideNumber: number;
  timestamp: string;
  timeSpent: number;
  fromSlide?: number;
}

export interface DeckAnalytics {
  deck: Deck;
  totalViewers: number;
  totalOpens: number;
  averageTimeSpent: number;
  mostViewedSlide: number;
  dropOffSlide: number;
  viewers: DeckViewer[];
}

export interface ViewerDetails {
  viewer: DeckViewer;
  sessions: ViewingSession[];
}