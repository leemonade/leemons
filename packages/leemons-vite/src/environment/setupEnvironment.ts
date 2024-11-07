interface SetupEnvironmentOptions {
  environment?: string;
  port?: string;
}

export default function setupEnvironment({
  environment = 'development',
  port = '3000',
}: SetupEnvironmentOptions) {
  process.env.NODE_ENV = environment;
  process.env.PORT = port;
}
