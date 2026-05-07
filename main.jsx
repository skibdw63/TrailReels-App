import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { starterReelers, starterPosts, starterBadges } from "./data";
import "./styles.css";

const creatorIcon = {
  music: "♪",
  archive: "▣",
  film: "🎥",
  gaming: "🎮",
  art: "🎨",
  none: ""
};

function load(key, fallback) {
  try {
    const found = localStorage.getItem(key);
    return found ? JSON.parse(found) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function Avatar({ user, size = "" }) {
  return (
    <div className={`avatarFrame ${size} ${user.role === "owner" ? "ownerFrame" : ""} ${user.role === "admin" ? "adminFrame" : ""}`}>
      <div className="avatarCore">{(user.displayName || user.username || "?")[0].toUpperCase()}</div>
      {user.role === "owner" && <div className="crown">♛</div>}
      {user.role === "admin" && <div className="hammer">🔨</div>}
      {user.creatorType !== "none" && <div className="creatorBadge">{creatorIcon[user.creatorType] || "✓"}</div>}
    </div>
  );
}

function App() {
  const [page, setPage] = useState("feed");
  const [reelers, setReelers] = useState(load("tr_reelers", starterReelers));
  const [posts, setPosts] = useState(load("tr_posts", starterPosts));
  const [badges, setBadges] = useState(load("tr_badges", starterBadges));
  const [reports, setReports] = useState(load("tr_reports", []));
  const [follows, setFollows] = useState(load("tr_follows", []));
  const [currentUserId, setCurrentUserId] = useState(load("tr_currentUserId", "owner"));

  useEffect(() => save("tr_reelers", reelers), [reelers]);
  useEffect(() => save("tr_posts", posts), [posts]);
  useEffect(() => save("tr_badges", badges), [badges]);
  useEffect(() => save("tr_reports", reports), [reports]);
  useEffect(() => save("tr_follows", follows), [follows]);
  useEffect(() => save("tr_currentUserId", currentUserId), [currentUserId]);

  const currentUser = reelers.find(r => r.id === currentUserId) || null;
  const canPanel = currentUser && ["owner", "admin", "moderator"].includes(currentUser.role);

  function makeAccount(email, username) {
    const existing = reelers.find(r => r.email === email || r.username === username);
    if (existing) return setCurrentUserId(existing.id);
    const user = {
      id: crypto.randomUUID(),
      email,
      username,
      displayName: username,
      role: "user",
      creatorType: "none",
      bio: "New TrailReels user.",
      followers: 0,
      banner: "New Trail"
    };
    setReelers([user, ...reelers]);
    setCurrentUserId(user.id);
  }

  function follow(id) {
    if (!currentUser) return alert("Log in first.");
    const key = `${currentUser.id}:${id}`;
    setFollows(follows.includes(key) ? follows.filter(f => f !== key) : [key, ...follows]);
  }

  function report(targetType, targetId) {
    if (!currentUser) return alert("Log in first.");
    const reason = prompt(`Why are you reporting this ${targetType}?`);
    if (!reason) return;
    setReports([{
      id: crypto.randomUUID(),
      targetType,
      targetId,
      reason,
      reporter: currentUser.username,
      status: "pending",
      createdAt: new Date().toLocaleString()
    }, ...reports]);
    alert("Report sent to the TrailReels staff panel.");
  }

  function addUpload(type) {
    if (!currentUser) return alert("Log in first.");
    const title = prompt(type === "trail" ? "Trail video title?" : "Reel title?");
    if (!title) return;
    const caption = prompt("Caption?") || "";
    const newPost = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      type,
      title,
      caption,
      length: type === "trail" ? "12:00" : "0:24",
      echoes: 0,
      comments: 0,
      tags: ["new"]
    };
    setPosts([newPost, ...posts]);
    setPage("profile");
  }

  function deleteReeler(id) {
    if (currentUser?.role !== "owner") return alert("Only owner can delete Reelers.");
    if (id === currentUser.id) return alert("Owner cannot delete themselves.");
    setReelers(reelers.filter(r => r.id !== id));
    setPosts(posts.filter(p => p.authorId !== id));
  }

  function deletePost(id) {
    if (!canPanel) return;
    setPosts(posts.filter(p => p.id !== id));
  }

  function changeRole(id, role) {
    if (currentUser?.role !== "owner") return alert("Only owner can change roles.");
    setReelers(reelers.map(r => r.id === id ? { ...r, role } : r));
  }

  function changeCreatorType(id, creatorType) {
    if (!canPanel) return;
    setReelers(reelers.map(r => r.id === id ? { ...r, creatorType } : r));
  }

  function createBadge() {
    const name = prompt("Badge name?");
    if (!name) return;
    const icon = prompt("Icon/emoji/symbol?", "⭐") || "⭐";
    setBadges([{ id: crypto.randomUUID(), name, icon, type: "custom", color: "sunset" }, ...badges]);
  }

  function clearDemo() {
    localStorage.clear();
    location.reload();
  }

  return (
    <div className="appShell">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <header className="topBar">
        <button className="brand" onClick={() => setPage("feed")}>
          <span className="logo">▶</span>
          <span><b>TrailReels</b><small>Every file leaves a trail.</small></span>
        </button>
        <button className="userButton" onClick={() => setPage(currentUser ? "profile" : "login")}>
          {currentUser ? <><Avatar user={currentUser} size="tiny" /> @{currentUser.username}</> : "Log in"}
        </button>
      </header>

      <main className="main">
        {page === "feed" && <Feed title="Home Feed" posts={posts} reelers={reelers} follows={follows} currentUser={currentUser} follow={follow} report={report} />}
        {page === "reels" && <Feed title="Reels" posts={posts.filter(p => p.type === "reel")} reelers={reelers} follows={follows} currentUser={currentUser} follow={follow} report={report} />}
        {page === "trails" && <Feed title="Long Trails" posts={posts.filter(p => p.type === "trail")} reelers={reelers} follows={follows} currentUser={currentUser} follow={follow} report={report} />}
        {page === "memories" && <Memories addUpload={addUpload} />}
        {page === "archive" && <Archive posts={posts} reelers={reelers} />}
        {page === "reelers" && <Reelers reelers={reelers} follows={follows} currentUser={currentUser} follow={follow} report={report} />}
        {page === "profile" && <Profile user={currentUser} posts={posts.filter(p => p.authorId === currentUser?.id)} addUpload={addUpload} />}
        {page === "login" && <Login makeAccount={makeAccount} reelers={reelers} setCurrentUserId={setCurrentUserId} />}
        {page === "panel" && <Panel currentUser={currentUser} reelers={reelers} posts={posts} reports={reports} badges={badges} createBadge={createBadge} deleteReeler={deleteReeler} deletePost={deletePost} changeRole={changeRole} changeCreatorType={changeCreatorType} />}
        {page === "settings" && <Settings clearDemo={clearDemo} />}
      </main>

      <nav className="navBar">
        <button className={page === "feed" ? "active" : ""} onClick={() => setPage("feed")}>🏠<span>Feed</span></button>
        <button className={page === "reels" ? "active" : ""} onClick={() => setPage("reels")}>🎞<span>Reels</span></button>
        <button className={page === "trails" ? "active" : ""} onClick={() => setPage("trails")}>📺<span>Trails</span></button>
        <button className={page === "memories" ? "active" : ""} onClick={() => setPage("memories")}>🕰<span>Memories</span></button>
        <button className={page === "reelers" ? "active" : ""} onClick={() => setPage("reelers")}>🎥<span>Reelers</span></button>
        {canPanel && <button className={page === "panel" ? "active" : ""} onClick={() => setPage("panel")}>👑<span>Panel</span></button>}
      </nav>
    </div>
  );
}

function Feed({ title, posts, reelers, follows, currentUser, follow, report }) {
  return (
    <section>
      <div className="hero">
        <h1>{title}</h1>
        <p>Scroll Reels, watch long Trails, follow Reelers, and report unsafe content.</p>
      </div>
      <div className="feedGrid">
        {posts.map(post => {
          const author = reelers.find(r => r.id === post.authorId) || reelers[0];
          const key = currentUser ? `${currentUser.id}:${author.id}` : "";
          return <VideoCard key={post.id} post={post} author={author} following={follows.includes(key)} onFollow={() => follow(author.id)} onReport={() => report("reel", post.id)} onReportReeler={() => report("reeler", author.id)} />
        })}
      </div>
    </section>
  );
}

function VideoCard({ post, author, following, onFollow, onReport, onReportReeler }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className={`videoCard ${post.type}`}>
      <div className="videoWindow" onClick={() => setPlaying(!playing)}>
        <div className="videoTop">{post.type === "trail" ? "📺 TRAIL" : "🎞 REEL"} · {post.length}</div>
        <div className={`playFlash ${playing ? "playing" : ""}`}>{playing ? "⏸" : "▶"}</div>
        <div className="waveLine" />
      </div>
      <div className="videoInfo">
        <Avatar user={author} />
        <div>
          <h3>{post.title}</h3>
          <p>{post.caption}</p>
          <small>@{author.username} · {post.echoes} Echoes · {post.comments} comments</small>
          <div className="tagRow">{post.tags.map(t => <span key={t}>#{t}</span>)}</div>
        </div>
      </div>
      <div className="actionRow">
        <button>❤️ Echo</button>
        <button onClick={onFollow}>{following ? "Following" : "Follow"}</button>
        <button>💬 Comment</button>
        <button onClick={onReport}>⚠ Reel</button>
        <button onClick={onReportReeler}>⚠ Reeler</button>
      </div>
    </article>
  );
}

function Memories({ addUpload }) {
  return (
    <section>
      <div className="hero memoryHero">
        <h1>Memories</h1>
        <p>This is the emotional section. Later your Memories button can play the KinitoPET “Bliss” vibe/audio when clicked.</p>
        <button className="primary" onClick={() => addUpload("reel")}>Upload Memory Reel</button>
      </div>
      <div className="memoryGrid">
        <div className="memoryCard">🌅 Recovered Reels<br/><small>Soft orange/yellow glow.</small></div>
        <div className="memoryCard">🎵 Memory Sounds<br/><small>Music-driven posts and edits.</small></div>
        <div className="memoryCard">📁 Old Drive Files<br/><small>Inspired by school-drive file vibes.</small></div>
        <div className="memoryCard">🌌 Blue Hour<br/><small>Some abandoned feeling, but not full horror.</small></div>
      </div>
    </section>
  );
}

function Archive({ posts, reelers }) {
  return (
    <section>
      <div className="hero archiveHero">
        <h1>Archive</h1>
        <p>Older Trails, recovered Reels, quiet profiles, and forgotten uploads.</p>
      </div>
      <div className="archiveList">
        {posts.slice().reverse().map(p => {
          const author = reelers.find(r => r.id === p.authorId) || {};
          return <div className="archiveItem" key={p.id}><b>{p.title}</b><span>@{author.username} · {p.type} · archived glow</span></div>
        })}
      </div>
    </section>
  );
}

function Reelers({ reelers, follows, currentUser, follow, report }) {
  return (
    <section>
      <div className="hero">
        <h1>Reelers</h1>
        <p>Creators/channels with profile-frame badges, role icons, and creator verified marks.</p>
      </div>
      <div className="reelerGrid">
        {reelers.map(r => {
          const key = currentUser ? `${currentUser.id}:${r.id}` : "";
          return (
            <article className="reelerCard" key={r.id}>
              <div className="miniBanner">{r.banner}</div>
              <Avatar user={r} size="big" />
              <h3>{r.displayName}</h3>
              <p>@{r.username}</p>
              <small>{r.role} · {r.creatorType} · {r.followers.toLocaleString()} followers</small>
              <p>{r.bio}</p>
              <div className="actionRow">
                <button onClick={() => follow(r.id)}>{follows.includes(key) ? "Following" : "Follow"}</button>
                <button onClick={() => report("reeler", r.id)}>Report</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Profile({ user, posts, addUpload }) {
  if (!user) return <div className="hero"><h1>Log in first</h1></div>;
  return (
    <section className="profilePage">
      <div className="profileHeader">
        <div className="profileBanner">{user.banner}</div>
        <Avatar user={user} size="huge" />
        <h1>{user.displayName}</h1>
        <p>@{user.username}</p>
        <span className="rolePill">{user.role} · {user.creatorType}</span>
        <p>{user.bio}</p>
        <div className="actionRow center">
          <button className="primary" onClick={() => addUpload("reel")}>Upload Reel</button>
          <button className="primary" onClick={() => addUpload("trail")}>Upload Trail</button>
        </div>
      </div>
      <h2>Your uploads</h2>
      <div className="archiveList">
        {posts.length ? posts.map(p => <div className="archiveItem" key={p.id}><b>{p.title}</b><span>{p.type} · {p.length}</span></div>) : <p>No uploads yet.</p>}
      </div>
    </section>
  );
}

function Login({ makeAccount, reelers, setCurrentUserId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  return (
    <section className="loginBox">
      <h1>Log in / Create Account</h1>
      <p>Demo mode: you can switch into existing demo accounts or create a local account.</p>
      <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="username" value={username} onChange={e => setUsername(e.target.value.replaceAll(" ", "").toLowerCase())} />
      <button className="primary" onClick={() => email && username ? makeAccount(email, username) : alert("Type email and username.")}>Create / Log in</button>
      <h3>Demo accounts</h3>
      <div className="demoAccounts">
        {reelers.map(r => <button key={r.id} onClick={() => setCurrentUserId(r.id)}>@{r.username} · {r.role}</button>)}
      </div>
    </section>
  );
}

function Panel({ currentUser, reelers, posts, reports, badges, createBadge, deleteReeler, deletePost, changeRole, changeCreatorType }) {
  if (!currentUser || !["owner", "admin", "moderator"].includes(currentUser.role)) return <div className="hero"><h1>No panel access</h1></div>;
  const owner = currentUser.role === "owner";
  return (
    <section>
      <div className="hero panelHero">
        <h1>{owner ? "Owner Panel 👑" : "Staff Panel"}</h1>
        <p>Manage Reelers, reports, badges, creator types, Reels, and long Trails.</p>
      </div>
      <div className="panelGrid">
        <div className="panelCard"><h3>Stats</h3><p>{reelers.length} Reelers</p><p>{posts.length} videos</p><p>{reports.length} reports</p><p>{badges.length} badges</p></div>
        <div className="panelCard"><h3>Badge Manager</h3><button className="primary" onClick={createBadge}>Create Badge</button>{badges.map(b => <p key={b.id}>{b.icon} {b.name} · {b.color}</p>)}</div>
        <div className="panelCard wide"><h3>Reports Inbox</h3>{reports.length ? reports.map(r => <div className="reportItem" key={r.id}><b>{r.targetType}</b> — {r.reason}<br/><small>reported by @{r.reporter} · {r.createdAt}</small></div>) : <p>No reports yet.</p>}</div>
        <div className="panelCard wide"><h3>Reeler Manager</h3>{reelers.map(r => <div className="manageRow" key={r.id}><Avatar user={r} size="tiny" /><b>@{r.username}</b><select value={r.creatorType} onChange={e => changeCreatorType(r.id, e.target.value)}><option value="none">none</option><option value="music">music</option><option value="archive">archive</option><option value="film">film</option><option value="gaming">gaming</option><option value="art">art</option></select>{owner && <select value={r.role} onChange={e => changeRole(r.id, e.target.value)}><option value="user">user</option><option value="reeler">reeler</option><option value="moderator">moderator</option><option value="admin">admin</option><option value="owner">owner</option></select>}{owner && <button onClick={() => deleteReeler(r.id)}>Delete</button>}</div>)}</div>
        <div className="panelCard wide"><h3>Reel / Trail Manager</h3>{posts.map(p => <div className="manageRow" key={p.id}><b>{p.title}</b><span>{p.type}</span><button onClick={() => deletePost(p.id)}>Remove</button></div>)}</div>
      </div>
    </section>
  );
}

function Settings({ clearDemo }) {
  return (
    <section className="loginBox">
      <h1>Settings</h1>
      <button onClick={clearDemo}>Reset demo data</button>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
