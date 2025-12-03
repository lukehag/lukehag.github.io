addEventListener("load", (event) => {})

onload = (event) => {   
    async function loadComments() {
        const res = await fetch("/api/comments");
        const list = await res.json();

        document.getElementById("comments").innerHTML = list.map(c =>
        `<div class="comment">
            <div>${c.content}</div>
            <small>${new Date(c.createdAt).toLocaleString()}</small>
            <hr>
        </div>`
        ).join("");
    }

    document.getElementById("submit").addEventListener("click", async () => {
        const content = tinymce.get("editor").getContent();

        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });

        if (res.ok) {
            tinymce.get("editor").setContent(""); // clear tinymce
            loadComments();
        }
    });

    loadComments();
}