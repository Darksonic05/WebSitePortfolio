const $apikey = "8377f9f5a34b4c099710d0e14db2bff7";

function searchGames(query) {
	const url = `https://api.rawg.io/api/games?key=${$apikey}&search=${encodeURIComponent(query)}`;
	return fetch(url)
		.then(response => {
			if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
			return response.json();
		})
		.then(data => {
			console.log('RAWG API response:', data);
			renderResults(data);
			return data;
		})
		.catch(error => {
			console.error('Fetch error:', error);
			renderError(error);
			throw error;
		});
}

function renderResults(data) {
	const container = document.getElementById('searchResults');
	if (!container) return;
	container.innerHTML = '';
	if (!data || !data.results || data.results.length === 0) {
		container.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
		return;
	}

	const grid = document.createElement('div');
	grid.className = 'results-grid';

	data.results.forEach(game => {
		const card = document.createElement('div');
		card.className = 'project-card';

		const thumbHtml = `<div class="thumb"><img src="${game.background_image || ''}" alt="${game.name}"></div>`;
		const infoHtml = `<div class="info"><h3>${game.name}</h3><p class="meta">${game.released || '—' } · Rating: ${game.rating || '—'}</p><p class="techs">${(game.genres || []).map(g=>g.name).join(' · ')}</p><a href="https://rawg.io/games/${game.slug}" target="_blank">Ver no RAWG</a></div>`;

		card.innerHTML = thumbHtml + infoHtml;
		grid.appendChild(card);
	});

	container.appendChild(grid);
}

function renderError(err) {
	const container = document.getElementById('searchResults');
	if (!container) return;
	container.innerHTML = `<p class="error">Erro: ${err.message}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('searchForm');
	if (form) {
		form.addEventListener('submit', e => {
			e.preventDefault();
			const q = document.getElementById('searchInput').value.trim();
			if (q) searchGames(q);
		});
	}
});
