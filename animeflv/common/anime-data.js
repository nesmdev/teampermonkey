//https://nesmdev.github.io/ndev/ndev.1.0.1.js
//https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
var anime_info, episodes, last_seen;
async function getAnimeData(url) {
	return $.get(url).then((html) => {
		var nextChapter = getNextChapter(html);
		const title = $(html).find("h1").text().trim();
		const image = $(html).find(".Image img").prop("src");
		const description = $(html).find(".Description p").text().trim();
		const followers = $(html).find(".Top > .Title > span").text();
		const rating = $(html).find(".Votes #votes_prmd").text();
		const votes = $(html).find(".Votes #votes_nmbr").text();
		const info = getAnime_Info(html);

		return {
			nextChapter: nextChapter,
			title: title,
			image: image,
			description: description,
			followers: followers && parseInt(followers),
			rating:
				rating &&
				parseFloat(rating) &&
				Math.round(parseFloat(rating) * 20),
			votes: votes && parseInt(votes),
			episodes: info && info.episodes && info.episodes.length,
			last_seen: info && info.last_seen,
		};
	});
}

function getAnime_Info(html) {
	var $scripts = $(html).filter("script");
	var script = Array.from($scripts).find((script) =>
		$(script).text().includes("anime_info")
	);

	if (!script) return false;
	var fn = $(script).text().trim().split("\n\n")[0];
	eval(fn);
	// console.log("anime_info", anime_info);
	return {
		anime_info: anime_info,
		episodes: episodes,
		last_seen: last_seen,
	};
}

function getNextChapter(html) {
	const info = getAnime_Info(html);
	if (!info) return false;
	let anime_info = info.anime_info;
	var date_ = anime_info.pop();
	// console.log("date", date_);
	var date = new ndate(date_).getDate();
	var valid = moment(date_, "YYYY-MM-DD", true).isValid();
	// console.log("valid", valid);
	if (!valid) return false;

	const Days = moment
		.duration(moment(date).diff(moment(new ndate().getDate())))
		.as("days");

	const week = new ndate().week();
	const months = new ndate().months();

	const Fecha = `${week[date.getDay()]}, ${date.getDate()} de ${
		months[date.getMonth()]
	} de ${date.getFullYear()}`;

	return {
		days: Days,
		fecha: Fecha,
		unix: date.getTime(),
		date: date.toLocaleDateString(),
	};
}
