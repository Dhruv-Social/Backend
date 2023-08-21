export {};

declare module "socket.io" {
  interface Socket {
    uuid: string;
  }
}
