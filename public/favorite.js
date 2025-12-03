fetch(`/api/favorites/${POST_ID}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("favorite-count").textContent = data.favorites;
    });

document.getElementById("favorite-button").addEventListener("click", () => {
    fetch(`/api/favorites/${POST_ID}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("favorite-count").textContent = data.favorites;
    });
});