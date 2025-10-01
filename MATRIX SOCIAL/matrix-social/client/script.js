function postMessage() {
  const textarea = document.querySelector("textarea");
  const postsDiv = document.getElementById("posts");
  const fileInput = document.getElementById("postImage");

  if (textarea.value.trim() === "" && !fileInput.files[0]) return;

  const post = document.createElement("div");
  post.classList.add("post");

  let content = `<p>${textarea.value}</p>`;

  if (fileInput.files[0]) {
    const imgURL = URL.createObjectURL(fileInput.files[0]);
    content += `<img src="${imgURL}" style="max-width:100%; margin-top:10px; border-radius:8px;">`;
  }

  content += `
    <div class="post-actions">
      <span class="like-btn" onclick="likePost(this)">👍 Like (<span class="like-count">0</span>)</span>
      <span class="comment-btn" onclick="toggleComments(this)">💬 Comment</span>
    </div>
    <div class="comments" style="display:none;">
      <input type="text" placeholder="Write a comment..." onkeypress="addComment(event, this)">
      <div class="comment-list"></div>
    </div>
  `;

  post.innerHTML = content;
  postsDiv.prepend(post);

  textarea.value = "";
  fileInput.value = "";
}

function likePost(el) {
  const countSpan = el.querySelector(".like-count");
  let count = parseInt(countSpan.innerText);
  count++;
  countSpan.innerText = count;
}

function toggleComments(el) {
  const commentBox = el.parentElement.nextElementSibling;
  commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
}

function addComment(e, input) {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const commentList = input.nextElementSibling;
    const comment = document.createElement("div");
    comment.classList.add("comment");
    comment.innerText = input.value;
    commentList.appendChild(comment);
    input.value = "";
  }
}

function postMessage() {
  const textarea = document.querySelector("textarea");
  const postsDiv = document.getElementById("posts");
  const fileInput = document.getElementById("postImage");

  if (!textarea || !postsDiv) return;

  if (textarea.value.trim() === "" && !fileInput.files[0]) return;

  const post = document.createElement("div");
  post.classList.add("post");

  let content = `<p>${textarea.value}</p>`;
  if (fileInput.files[0]) {
    const imgURL = URL.createObjectURL(fileInput.files[0]);
    content += `<img src="${imgURL}" style="max-width:100%; border-radius:8px;">`;
  }

  post.innerHTML = content;
  postsDiv.prepend(post);

  textarea.value = "";
  fileInput.value = "";
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem("matrixUser", JSON.stringify({
      username, email, password
    }));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  });
}

function searchMatrix() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Enter something to search!");
  alert("Searching for: " + query);
}
function toggleNews(el) {
  const next = el.nextElementSibling;
  if (next.style.display === "block") {
    next.style.display = "none";
    el.querySelector(".expand").innerText = "+";
  } else {
    next.style.display = "block";
    el.querySelector(".expand").innerText = "-";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}



const searchInput = document.getElementById("friendSearch");
if (searchInput) {
  searchInput.addEventListener("keyup", function() {
    const filter = searchInput.value.toLowerCase();
    const friends = document.querySelectorAll(".friend-card");

    friends.forEach(friend => {
      const name = friend.querySelector("h3").innerText.toLowerCase();
      if (name.includes(filter)) {
        friend.style.display = "flex";
      } else {
        friend.style.display = "none";
      }
    });
  });
}


const marketSearch = document.getElementById("marketSearch");
if (marketSearch) {
  marketSearch.addEventListener("keyup", function() {
    const filter = marketSearch.value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
      const text = product.innerText.toLowerCase();
      if (text.includes(filter)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
}




document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

     
      localStorage.setItem("matrixUser", JSON.stringify({ username, email, password }));

      alert("✅ Registration successful! You can now login.");
      window.location.href = "login.html";
    });
  }

  
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const savedUser = JSON.parse(localStorage.getItem("matrixUser"));

      if (savedUser && savedUser.email === email && savedUser.password === password) {
        alert("✅ Login successful! Welcome, " + savedUser.username);
        window.location.href = "index.html"; // redirect after login
      } else {
        alert("❌ Invalid email or password!");
      }
    });
  }
});


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Registered successfully!");
    window.location.href = "login.html";
  } else {
    alert("❌ " + data.error);
  }
});


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("✅ Welcome " + data.user.username);
    window.location.href = "home.html";
  } else {
    alert("❌ " + data.error);
  }
});


function openTab(tabName) {
            const contents = document.querySelectorAll(".tab-content");
            const buttons = document.querySelectorAll(".tab-btn");

            contents.forEach(c => c.classList.remove("active"));
            buttons.forEach(b => b.classList.remove("active"));

            document.getElementById(tabName).classList.add("active");
            event.target.classList.add("active");
        }