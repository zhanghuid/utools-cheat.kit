const https = require('https')

function httpsGet({ body, ...options }) {
	return new Promise((resolve, reject) => {
		const req = https.request({
			method: 'GET',
			...options,
		}, res => {
			const chunks = [];
			res.on('data', data => chunks.push(data))
			res.on('end', () => {
				let body = Buffer.concat(chunks)
				switch (res.headers['content-type']) {
					case 'application/json':
						body = JSON.parse(body);
						break;
				}
				resolve(body)
			})
		})
		req.on('error', reject)
		if (body) {
			req.write(body);
		}
		req.end()
	})
}

wrapHtml = function (html) {
	let regex1 = /<a [^>]+>.+<\/a>/gm;
	html = html.replace(regex1, function (a) {
		return ''
	});

	let regex2 = /<script\b[^>]*>[\s\S]*<\/script>/gm;
	html = html.replace(regex2, function (a) {
		return ''
	});

	let regex3 = /(<link.*\s+href=(?:"[^"]*"|'[^']*')[^<]*>)/gm;
	html = html.replace(regex3, function (a) {
		return ''
	});

	let regex4 = /<form [\s\S]*<\/form>/gm;
	html = html.replace(regex4, function (a) {
		return ''
	});

	return html;
}

window.getHtml = async function (text) {
	const res = await httpsGet({
		hostname: 'cheat.sh',
		path: `/${text}`,
	});
	
	return wrapHtml(res.toString());
};
