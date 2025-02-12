const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    customLabels: { project_name: 'ms-appointments' },
    promClient: {
        collectDefaultMetrics: {},
    },
});

module.exports = metricsMiddleware;