// Function to be set to our fetchCommand in our WasmTerminal Config
import wasmInit, { lowerI64Imports } from "../assets/wasm-transformer";
import WAPM from '../services/wapm/wapm';

const commandBinaryCache = {};
let didInitWasmTransformer = false;
export const wapm = new WAPM(commandBinaryCache);

const fetchCommand = async (commandName) => {
  if (window.gtag) {
    window.gtag('event', 'run command', {
      // 'event_category': '',
      'event_label': commandName,
      // 'value': '<here the command args and environment>'
    });
  }
  
  // Check the Cache
  if (wapm.isCommandCached(commandName) && commandBinaryCache[commandName]) {
    return commandBinaryCache[commandName];
  }

  const wapmCommand = await wapm.getCommand(commandName);

  if (typeof wapmCommand === 'function') {
    return wapmCommand;
  }

  if (!didInitWasmTransformer) {
    await wasmInit('/assets/wasm-transformer/wasm_transformer_bg.wasm');
    didInitWasmTransformer = true;
  }

  const loweredBinary = lowerI64Imports(wapmCommand);

  // Cache the result
  commandBinaryCache[commandName] = loweredBinary;

  // Return the binary
  return loweredBinary;
};

export default fetchCommand;

