// https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// https://nesmdev.github.io/ndev/ndev.1.0.1.js
// https://nesmdev.github.io/teampermonkey/animeflv/common/anime-data.js

// const followingAnimesUrl =
// 	"https://www3.animeflv.net/perfil/makinaface/siguiendo";
// $(document).ready(function () {
// 	getFollowingAnimesData(followingAnimesUrl, { solo_estrenos: true }).then(
// 		(animes) => (ANIMES = animes)
// 	);
// });

async function getFollowingAnimesData(username, options) {
	//options => solo_estrenos:boolean, max:number
	const url = `https://www3.animeflv.net/perfil/${username}/siguiendo`;
	async function response(html) {
		var animes = [];
		const $animes = Array.from($(html).find(".ListAnimes li"));

		for (let anime of $animes) {
			var estreno = $(anime).find(".Estreno").length;
			var title = $(anime).find(".Title:first").text().trim();
			var img = $(anime).find("img").prop("src");
			var desc = $(anime).find(".Description p").text().trim();
			var vts = $(anime).find(".Vts").text();
			var link = $(anime).find("a").prop("href");

			var animeData = {
				title: title,
				image: img,
				estreno: (estreno && true) || false,
				description: desc,
				vts: vts && parseInt(vts),
				link: link,
			};

			if (options && options.max && options.max <= animes.length) {
				break;
			}

			if (
				!options ||
				!options.solo_estrenos ||
				(options.solo_estrenos && animeData.estreno)
			) {
				await new Promise((solve) => {
					getAnimeData(link).then((data) => {
						var Anime = { ...animeData, ...data };
						// var Anime = data;
						animes.push(Anime);
						solve();
					});
				});
			}
		}
		return animes;
	}
	return $.get(url).then((html) => response(html));
}

function sortAnimes(animes, prop, desc, print) {
	//options => asc:boolean, prop:string

	const escape_ = (val) => {
		if (typeof val !== "number" && typeof val !== "string") {
			return Infinity;
		} else {
			return val;
		}
	};
	let animes_ = animes.sort((a, b) => {
		let escapeA = escape_(a[prop]);
		let escapeB = escape_(b[prop]);
		let res = escapeA < escapeB ? -1 : escapeA > escapeB ? 1 : 0;
		// let res = escape_(a[prop]) - escape_(b[prop]);
		if (print) {
			console.log("a", escapeA);
			console.log("b", escapeB);
			console.log("res", res);
		}
		return res;
	});
	return desc ? animes_.reverse() : [...animes_];
}
