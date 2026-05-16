const PanelBackground = document.getElementById("Background");

// Main
// ----------------------------------------------------------------

async function InitPage() {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const Content = document.getElementById("Content");

	Content.style.opacity = "1";

	InitBackground();
	InitGameFeatures();
	InitGameMechanics();
}

async function CreateTemplate(TemplateID) {
	const response = await fetch("assets/templates.html");
	const html = await response.text();

	const Container = document.createElement("div");
	Container.innerHTML = html;

	return Container.querySelector(`template#${TemplateID}`);
}

async function InitBackground() {
	new rive.Rive({
		src: "assets/background.riv",
		canvas: PanelBackground,
		autoplay: true,
		stateMachines: "IDLE",
		onLoad: OnBackgroundLoaded,
	});
}

async function InitGameFeatures() {
	try {
		const Response = await fetch(`data/game_features.yaml?v=${Date.now()}`, {
			cache: "no-store"
		});
		const YamlText = await Response.text();
		const Data = jsyaml.load(YamlText);

		const Parent = document.getElementById("BlockGameFeaturesContainer");
		Parent.innerHTML = "";

		for (const Item of Data.GameFeatures) {
			const Template = await CreateTemplate("GameFeatures");
			const Clone = Template.content.cloneNode(true);

			// Clone.querySelector("img").src = Item.Icon;
			Clone.querySelector(".GameFeaturesImage").src = Item.Image;
			Clone.querySelector(".GameFeaturesTitle").textContent = Item.Title;
			Clone.querySelector(".GameFeaturesText").innerHTML = Item.Text;

			Parent.appendChild(Clone);
		}
	} catch (Err) {
		console.error("Failed to load game features", Err);
	}
}

async function InitGameMechanics() {
	const StatusTitles = {
		Completed: "Завершено",
		InDev: "В разработке",
		Planning: "Планируется",
		Rework: "На переработке",
	};

	try {
		const Response = await fetch(`data/game_mechanics.yaml?v=${Date.now()}`, {
			cache: "no-store"
		});
		const YamlText = await Response.text();
		const Data = jsyaml.load(YamlText);

		const Parent = document.getElementById("BlockGameMechanicsContainer");
		Parent.innerHTML = "";

		for (const Item of Data.GameMechanics) {
			const Template = await CreateTemplate("GameMechanics");
			const Clone = Template.content.cloneNode(true);

			const Status = Clone.querySelector(".GameMechanicsStatus");

			Status.classList.add(Item.Status);
			Status.textContent = StatusTitles[Item.Status];

			Clone.querySelector(".GameMechanicsTitle").textContent = Item.Title;
			Clone.querySelector(".GameMechanicsText").textContent = Item.Text;

			Parent.appendChild(Clone);
		}
	} catch (Err) {
		console.error("Failed to load game features", Err);
	}
}

// On Events
// ----------------------------------------------------------------

function OnBackgroundLoaded() {
	const Background = document.getElementById("Background");

	Background.style.opacity = "1";
}

// Init
// ----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", InitPage);
