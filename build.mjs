import fs from 'fs';
import { promisify } from 'util';
import rawResolve from 'resolve';
import cpy from 'cpy';

const resolve = promisify(rawResolve);

const pkgDir = async (name) => {
	let foundDir;

	const isDirectory = (dir, cb) => {
		fs.stat(dir, (err, stat) => {
			if (!err) {
				if (stat.isDirectory()) {
					foundDir = dir;
				}
				return cb(null, stat.isDirectory());
			}
			if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
			return cb(err);
		});
	};

	try {
		await resolve(name, { isDirectory });
	}
	catch (e) {
		if (!foundDir) {
			throw e;
		}
	}
	return foundDir;
};

const loggedCopy = (from, to) => {
	// eslint-disable-next-line no-console
	console.log(`Copying ${from} to ${to}`);
	return cpy(from, to);
};

(async() => {
	const wasmerDir = await pkgDir('@wasmer/wasm-terminal');
	await loggedCopy(`${wasmerDir}/wasm-terminal/lib/xterm/**/*`, 'src/assets/wasm-terminal');
	await loggedCopy(`${wasmerDir}/wasm-terminal/lib/workers/**/*`, `src/assets/wasm-terminal`);
	await loggedCopy(`${wasmerDir}/wasm-transformer/lib/wasm-transformer.wasm`, 'src/assets/wasm-transformer');
})();

