import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3000').replace(/\/$/, '');
const SOCKET_ENABLED = import.meta.env.VITE_ENABLE_SOCKET !== 'false';
const RECONNECT_ATTEMPTS = Number(import.meta.env.VITE_SOCKET_RECONNECT_ATTEMPTS || 5);
const RECONNECT_DELAY = Number(import.meta.env.VITE_SOCKET_RECONNECT_DELAY || 1000);

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!SOCKET_ENABLED || this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: RECONNECT_ATTEMPTS,
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Subscribe to a specific event
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  on(event, callback) {
    if (!this.socket) this.connect();

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  /**
   * Unsubscribe from a specific event
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  off(event, callback) {
    if (!this.socket) return;

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }

    this.socket.off(event, callback);
  }

  /**
   * Listen for monitor updates
   */
  onMonitorUpdate(callback) {
    this.on('logUpdate', callback);
  }

  /**
   * Listen for status changes
   */
  onStatusChange(callback) {
    this.on('logUpdate', callback);
  }

  /**
   * Listen for new incidents
   */
  onIncidentCreated(callback) {
    this.on('incidentUpdate', callback);
  }

  /**
   * Listen for incident resolution
   */
  onIncidentResolved(callback) {
    this.on('incidentUpdate', callback);
  }

  /**
   * Listen for alerts
   */
  onAlert(callback) {
    this.on('alert', callback);
  }

  // Cleanup all listeners
  removeAllListeners() {
    if (!this.socket) return;
    for (const event of this.listeners.keys()) {
      this.socket.removeAllListeners(event);
    }
    this.listeners.clear();
  }
}

export default new SocketService();
