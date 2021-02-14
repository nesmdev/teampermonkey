//https://nesmdev.github.io/ndev/ndev.1.0.1.js
//https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// const followingAnimesUrl= "https://www3.animeflv.net/perfil/makinaface/siguiendo";
async function getFollowingAnimesData(url) {
	
	return $.get(url).then((html) => {
		var animes = [];
		const $animes = Array.from($(".ListAnimes li"));

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
				estreno: estreno,
				description: desc,
				vts: vts && parseInt(vts),
				link: link,
			};
			await new Promise((solve) => {
				getAnimeData(link).then((data) => {
					var Anime = { ...animeData, ...data };
					animes.push(Anime);
					solve();
				});
			});
			 
		}
		return animes;
	});

 
}
