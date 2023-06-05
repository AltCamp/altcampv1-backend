const Sentry = require('@sentry/node');
const config = require('../config');

function initializeSentry(app) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    tracesSampleRate: 1.0,
  });

  return Sentry;
}

module.exports = initializeSentry;
