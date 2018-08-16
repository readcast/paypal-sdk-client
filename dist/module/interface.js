import { extend } from './util';
import { getGlobal } from './global';
import { validateClientOptions } from './validation';
import { GLOBAL_NAMESPACE, DEFAULT_ENV } from './constants';


var exportBuilders = getGlobal('exportBuilders', {});

/**
 * Instantiate the public client
 */
export function client() {
    var clientOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { env: DEFAULT_ENV };

    clientOptions = JSON.parse(JSON.stringify(clientOptions));

    if (typeof __sdk__ !== 'undefined') {
        clientOptions.env = __sdk__.queryOptions.env;
    }

    validateClientOptions(clientOptions);

    var xports = {};

    Object.keys(exportBuilders).forEach(function (moduleName) {
        extend(xports, exportBuilders[moduleName]({ clientOptions: clientOptions }));
    });

    return xports;
}

/**
 * Attach an interface builder function
 */
export function attach(moduleName, exportBuilder) {
    if (exportBuilders[moduleName]) {
        throw new Error('Already attached ' + moduleName);
    }

    window[GLOBAL_NAMESPACE] = window[GLOBAL_NAMESPACE] || {};
    window[GLOBAL_NAMESPACE].client = window.client || client;

    exportBuilders[moduleName] = exportBuilder;
}