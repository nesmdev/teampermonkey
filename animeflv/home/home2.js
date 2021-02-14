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
// @require https://nesmdev.github.io/teampermonkey/animeflv/common/animes-data.js?v=4
// @grant        none
// ==/UserScript==

$("body").append(`
<style>
#box-thumbnails {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

#box-thumbnails li {
	border: 1px solid gray !important;
	/*padding-bottom:10px;*/
	padding-right: 0;
	padding-left: 0;
	margin: 1px;
	border-radius: 5px !important;
}

#box-thumbnails li span {
	padding-right: 10px;
	padding-left: 10px;
	padding-bottom: 5px;
	padding-top: 5px;
}

.day-past span,
.day-past small {
	color: #ff9dce !important;
	font-weight: bold;
}

.day-today,
.day-today span,
.day-today small {
	color: black !important;
	font-weight: bold;
	/*background: #8db2e5 !important;*/
	background: gray !important;
}

.day-tomorrow span,
.day-tomorrow small {
	font-weight: bold;
	color: #8db2e5 !important;
}

</style>
`);

const thumbTpl = `
<li class="{{dayClass}}" style="display: list-item">
	<a href="{{link}}">
		<figure>
			<img
				src="{{image}}"
				alt="{{title}}"
				title="{{title}}\n\n{{description}}"
			/>
			<figcaption>{{title}}</figcaption>
		</figure>
	</a>
	<span title="{{fecha}}" style="float: left" class="days">{{days}}</span>
	<span style="float: right"><small>Rating: {{rating}}%</small></span>
</li>


`.trim();

const $box = $(".ListAnmsTp.ClFx:first").attr("id", "box-thumbnails");
const $thumbnails = $box.children("li");

const username = $(".Login.Online strong").text().trim();

if (username) {
	getFollowingAnimesData(username, { solo_estrenos: true }).then((animes) => {
		var animes_ = sortAnimes(animes, "days");
		$thumbnails.remove();
		//ANIMES = animes_;
		animes_.forEach((anime, i) => {
			const days = anime.nextChapter && anime.nextChapter.days;

			const days_ =
				typeof days !== "number"
					? ""
					: days == 0
					? "Hoy"
					: days == 1
					? "Mañana"
					: days == -1
					? "Ayer"
					: days < -1
					? `Hace ${days} días`
					: `En ${days} días`;

			const dayClass =
				days < 0
					? "day-past"
					: days === 0
					? "day-today"
					: days === 3
					? "day-tomorrow"
					: "day-future";
			const thumb = new nhtml(thumbTpl)
				.setVal({
					...anime,
					days: days_,
					fecha: anime.nextChapter?.fecha,
					dayClass: dayClass,
				})
				.value();

			$box.append($(thumb).hide().fadeIn(3000));
			//$thumbnails.eq(i).hide().html(thumb).fadeIn(3000);
		});
	});
}
