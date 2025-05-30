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
        const expoConfig = Constants.expoConfig;
        const socketUrl = expoConfig?.extra?.SOCKET_URL;
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

        this.socket = io(url, {
            transports: ['websocket'],   // force WS
            reconnectionAttempts: 5,
        });

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
