export {};

declare module "socket.io" {
  interface Socket {
    username: string;
  }
}
