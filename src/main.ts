let tiles: HTMLDivElement[] = [];

type Position = { x: number; y: number };

let size = 4;

let positions: Position[];
let shuffling = false;

const container = document.getElementById("container")!;
const shuffle = document.getElementById("shuffle")!;
const resize = document.getElementById("resize");

function setup(size = 4) {
	while (container.lastChild) {
		container.removeChild(container.lastChild);
	}
	const count = Math.pow(size, 2);
	positions = Array(count)
		.fill(null)
		.map((_, i) => ({
			x: i % size,
			y: Math.floor(i / size),
		}));

	for (let i = 0; i < count - 1; i++) {
		// const elm = document.getElementById((i + 1).toString()) as HTMLDivElement;
		const elm = document.createElement("div");
		elm.className = "tile";

		elm.id = elm.innerText = (i + 1).toString();
		elm.style.height = elm.style.width = `${100 / size}%`;
		elm.style.fontSize = `${800 / size}%`;
		elm.addEventListener("click", (e) => {
			const elm = e.target as HTMLDivElement;
			if (trySwitch(i)) update();
			else {
				elm.style.animation = `shake${
					elm.style.animationName == "shake" ? "2" : ""
				} 0.5s`;
			}
		});
		container.appendChild(elm);
		tiles.push(elm);
	}
}

function update() {
	positions.map((pos, i) => {
		if (i == Math.pow(size, 2) - 1) return;
		const elm = tiles[i];
		elm.style.left = `${(pos.x * 100) / size}%`;
		elm.style.top = `${(pos.y * 100) / size}%`;
	});
}

function canSwitch(target: Position): boolean {
	const space = positions.at(-1)!;
	const side = Math.abs(space.x - target.x);
	const upDown = Math.abs(space.y - target.y);

	return (upDown == 1 && side == 0) || (upDown == 0 && side == 1);
}

function trySwitch(idx: number): boolean {
	const space = positions.at(-1)!;
	const target = positions[idx];

	if (canSwitch(target)) {
		const temp = { ...space };
		space.x = target.x;
		space.y = target.y;
		target.x = temp.x;
		target.y = temp.y;

		return true;
	}
	return false;
}

async function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

shuffle.addEventListener("click", async (e) => {
	if (shuffling) return;
	let elm = e.target as HTMLButtonElement;
	elm.disabled = true;
	shuffling = true;

	const space = positions.at(-1)!;
	let last = -1;

	for (let i = 0; i < Math.pow(size, 2) * 4; i++) {
		const switchable = positions
			.map((tile, idx) => {
				if (canSwitch(tile) && idx !== Math.pow(size, 2) - 1 && idx !== last)
					return idx;
				return null;
			})
			.filter((i) => i !== null);

		trySwitch(
			(last = switchable[Math.floor(Math.random() * switchable.length)])
		);
		update();
		await sleep(50);
	}
	elm.disabled = false;
	shuffling = false;
});

resize?.addEventListener("click", async (e) => {
	tiles = [];

	let newSize = Number(prompt("Number", "4"));

	if (Number.isNaN(newSize) || newSize < 4 || newSize > 8) {
		return;
	}

	size = newSize;

	setup(newSize);

	update();
});

setup(size);
update();
