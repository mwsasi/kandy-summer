
import { Attendee, Organizer } from '../types';

const ATTENDEES_KEY = 'kandy_fest_attendees';
const ORGANIZERS_KEY = 'kandy_fest_organizers';
const SESSION_KEY = 'kandy_fest_session';

export const storageService = {
  // Attendees
  getAttendees: (): Attendee[] => {
    const data = localStorage.getItem(ATTENDEES_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveAttendee: (attendee: Attendee) => {
    const attendees = storageService.getAttendees();
    attendees.push(attendee);
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));
  },

  updateAttendee: (updatedAttendee: Attendee) => {
    const attendees = storageService.getAttendees();
    const index = attendees.findIndex(a => a.id === updatedAttendee.id);
    if (index !== -1) {
      attendees[index] = updatedAttendee;
      localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));
    }
  },

  deleteAttendee: (id: string) => {
    const attendees = storageService.getAttendees();
    const filtered = attendees.filter(a => a.id !== id);
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(filtered));
  },

  // Organizers
  getOrganizers: (): Organizer[] => {
    const data = localStorage.getItem(ORGANIZERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveOrganizer: (organizer: Organizer) => {
    const organizers = storageService.getOrganizers();
    organizers.push(organizer);
    localStorage.setItem(ORGANIZERS_KEY, JSON.stringify(organizers));
  },

  // Auth Session
  setSession: (organizer: Organizer) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(organizer));
  },

  getSession: (): Organizer | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
