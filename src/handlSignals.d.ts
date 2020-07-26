export type CloseableServer = {
  close(callback?: (err?: Error) => void): CloseableServer;
}
export type StoppableServer = {
  stop(): Promise<StoppableServer>;
}