import {id as pluginId} from './manifest';

const PLUGIN_PREFIX = 'plugins-';

// The state here is whatever I'm receveing in the index.ts of each component
const getPluginState = (state: any) => state[PLUGIN_PREFIX + pluginId] || {};

export const getSelectErrorMessage = (state: any) => getPluginState(state).selectErrorMessage;

export const getNameErrorMessage = (state: any) => getPluginState(state).nameErrorMessage;
