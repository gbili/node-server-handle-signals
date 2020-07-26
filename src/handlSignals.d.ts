type CloseableServer = {
  close(callback?: (err?: Error) => void): CloseableServer;
}
type StoppableServer = {
  stop(): Promise<StoppableServer>;
}