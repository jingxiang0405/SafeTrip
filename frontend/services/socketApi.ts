import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';


class SocketApi {
    private static instance: SocketApi;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketApi {
        if (!SocketApi.instance) {
            SocketApi.instance = new SocketApi();
        }
        return SocketApi.instance;
    }

    private getUrl(): string {
        const socketUrl = Constants.expoConfig?.extra?.SOCKET_URL;
        if (!socketUrl) {
            throw new Error(
                '⚠️ Missing SOCKET_URL in expoConfig.extra (check your app.json/app.config.js)'
            );
        }
        return socketUrl;
    }

    public connect(): void {
        if (this.socket) return;
        const url = this.getUrl();

        try {
            this.socket = io(url, {
                transports: ['websocket'],    // 只用 WebSocket，排除 long-polling
                reconnectionAttempts: 5,      // 可選：重試次數
                timeout: 5000,                // 可選：連線超時 ms
            });
        } catch (err) {
            console.error('Socket.IO init error:', err);
            return;
        }

        this.socket.on('connect', () => {
            console.log('🟢 Socket connected:', this.socket!.id);
        });
        this.socket.on('disconnect', (reason: string) => {
            console.log('🔴 Socket disconnected:', reason);
            this.socket = null;
        });
        this.socket.on('connect_error', (err: Error) => {
            console.error('❗ Socket connection error:', err.message);
        });
    }

    public emit<T = any>(event: string, payload?: T): void {
        if (!this.socket) {
            console.warn('[SocketApi] Socket not initialized');
            return;
        }
        this.socket.emit(event, payload);
    }

    public disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
    }

    public getId(): string | null {
        return this.socket?.id ?? null;
    }
}

export default SocketApi.getInstance();
