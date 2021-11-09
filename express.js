/* eslint-disable no-console */
const express = require('express');
const app = express();
const path = require('path');

app.use(
	'/',
	express.static(path.join(__dirname, 'build'), {
		setHeaders: res => {
			res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
			res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
		}
	}),
);

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
