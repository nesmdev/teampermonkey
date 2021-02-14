// ==UserScript==
// @name AnimeFLV
// @namespace AnimeFLV Scripts
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match https://www3.animeflv.net/
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require https://nesmdev.github.io/ndev/ndev.1.0.1.js?a=4
// @resource animatecss https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css
// @grant        GM_getResourceText
// ==/UserScript==

$("head").append(`<style>${GM_getResourceText("animatecss")}</style>`).append(`
	<style>
		.nanimate {
		  display: inline-block;
		  animation-duration: 2s; /* don't forget to set a duration! */
		}
	</style>`);

const $favs = Array.from($(".ListAnmsTp.ClFx:first li"));
async function renderFavs() {
	for (var fav of $favs) {
		var link = $(fav).find("a").prop("href");
		var path = new URL(link).pathname;
		$(fav).attr({ "data-path": path, "data-type": "anime" });

		try {
			await $.get(link).then((html) => {
				var $scripts = $(html).filter("script");
				var script = Array.from($scripts).find((script) =>
					$(script).text().includes("anime_info")
				);
				if (!script) {
					console.log("noscript....");
					return false;
				}

				var fn = $(script).text().trim().split("\n")[0];
				eval(fn);
				var date_ = anime_info.pop();
				var date = new ndate(date_).getDate();
				if (!new ndate(date).valid()) return false;
				const days = moment
					.duration(moment(date).diff(moment(new ndate().getDate())))
					.as("days");

				const week = [
					"Domingo",
					"Lunes",
					"Martes",
					"Miércoles",
					"Jueves",
					"Viernes",
					"Sábado",
				];
				const months = [
					"Enero",
					"Febrero",
					"Marzo",
					"Abril",
					"Mayo",
					"Junio",
					"Julio",
					"Agosto",
					"Septiembre",
					"Octubre",
					"Noviembre",
					"Diciembre",
				];

				const fecha = `${week[date.getDay()]}, ${date.getDate()} de ${
					months[date.getMonth()]
				} de ${date.getFullYear()}`;
				console.log("fecha", fecha);

				$(fav)
					.append(
						$(
							`<span class="nanimate">${
								days != 0
									? `En ${days} ${days == 1 ? "día" : "días"}`
									: "Hoy"
							}</span>`
						).hide()
					)
					.attr("title", fecha);
				$(fav).attr("data-next", days);

				$(".nanimate")
					.show()
					.addClass("animate__animated animate__backInUp");
			});
		} catch (err) {
			console.log("error", err);
		}
	}

	sortFavs();
}

function sortFavs() {
	$(".ListAnmsTp.ClFx:first li")
		.sort((a, b) => {
			var nextA = $(a).data("next");
			var nextB = $(b).data("next");
			console.log("nextA", nextA);
			if (typeof nextA === "undefined") {
				$(a).hide();
			}
			return parseInt(nextA || 0) - parseInt(nextB || 0);
		})
		.appendTo(".ListAnmsTp.ClFx:first");
}

$(document).ready(function () {
	renderFavs();
});
