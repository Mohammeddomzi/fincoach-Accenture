import * as Sentry from "@sentry/react-native";

export const initSentry = () => {
  // Only initialize Sentry if DSN is provided
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (dsn && dsn !== "YOUR_SENTRY_DSN_HERE") {
    Sentry.init({
      dsn,
      debug: __DEV__,
      environment: __DEV__ ? "development" : "production",
    });
  }
};

export const captureException = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (
  message: string,
  level: "info" | "warning" | "error" = "info"
) => {
  Sentry.captureMessage(message, level);
};
