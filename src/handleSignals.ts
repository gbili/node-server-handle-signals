export type CloseableServer = {
  close(callback?: (err?: Error) => void): CloseableServer;
}
export type StoppableServer = {
  stop(): Promise<void>;
}

const registerListener = function (shutdown: () => void) {
  process.on('SIGTERM', () => {
    console.log(`Got SIGTERM (docker container stop). Graceful shutdown.`, new Date().toISOString())
    shutdown();
  });

  process.on('SIGINT', () => {
    console.log(`Got SIGINT (aka ctrl-c in docker). Graceful shutdown.`, new Date().toISOString())
    shutdown();
  });
}

export const onShutdownClose = function (server: CloseableServer): CloseableServer {
  const shutdown = () => {
    server.close(function onServerClosed(err) {
      if (err) {
        console.log(err);
        process.exitCode = 1;
      }
      process.exit();
    });
  };

  registerListener(shutdown);

  return server;
}

export function onShutdownStop(server: StoppableServer): StoppableServer {
  const shutdown = async () => {
    try {
      await server.stop();
    } catch (err) {
      console.log(err);
      process.exitCode = 1;
    }
    process.exit();
  };

  registerListener(shutdown);

  return server;
};

export default onShutdownClose;