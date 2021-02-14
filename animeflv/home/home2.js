// ==UserScript==
// @name         AnimeFlvHome
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www3.animeflv.net/
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require https://nesmdev.github.io/ndev/ndev.1.0.1.js
// @require https://nesmdev.github.io/teampermonkey/animeflv/common/anime-data.js?v=3
// @require https://nesmdev.github.io/teampermonkey/animeflv/common/animes-data.js?v=3
// @grant        none
// ==/UserScript==

const thumbTpl = `
<a href="{{url}}">
	<figure>
		<img src="{{image}}" alt="{{title}}" title="{{message}}"/>
		<figcaption>{{title}}</figcaption>
	</figure>
</a>
<span title="{{fecha}}">{{days}}</span>
`;

const $thumbnails = $(".ListAnmsTp.ClFx:first li");

const username = $(".Login.Online strong").text().trim();


if (username) {
	getFollowingAnimesData(username, { solo_estrenos: false, max: 6 }).then(
		(animes) => {
			var animes_ = sortAnimes(animes, "days");
			ANIMES = animes_; 
			animes_.forEach((anime, i) => {
				const days = anime.nextChapter && anime.nextChapter.days;

				const days_ =
					typeof days !== "number"
						? ""
						: days == 0
						? "Hoy"
						: days == 1
						? "Mañana"
						: `En ${days} días`;
				const message = `${anime.title}\n\n${anime.description}`;
				const thumb = thumbTpl
					.replace("{{url}}", anime.link)
					.replace("{{image}}", anime.image)
					.replaceAll("{{title}}", anime.title)
					.replace("{{days}}", days_)
					.replace("{{fecha}}", anime.nextChapter.fecha)
					.replace("{{message}}", message);
				$thumbnails.eq(i).hide().html(thumb).fadeIn(3000);
			});
		}
	);
}
