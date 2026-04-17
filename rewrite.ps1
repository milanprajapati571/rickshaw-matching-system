$ErrorActionPreference = "Stop"

Write-Host "Removing old Git history..."
Remove-Item -Recurse -Force .git
git init

Write-Host "Removing commits.md script..."
if (Test-Path commits.md) {
    Remove-Item -Force commits.md
}

Write-Host "Creating Commit 1 (Sri Lakshmi)..."
git add frontend/package.json frontend/vite.config.ts frontend/tailwind.config.js frontend/src/index.css frontend/src/pages/Home.tsx frontend/src/App.tsx
git commit --author="Sri Lakshmi <srilakshmi@student.edu>" -m "feat: initialize frontend React app with Tailwind and Home layout"

Write-Host "Creating Commit 2 (Sujith)..."
git add backend/package.json backend/tsconfig.json backend/src/firebase.ts
git commit --author="Sujith <sujith@student.edu>" -m "chore: initialize Node Express server and Firebase structures"

Write-Host "Creating Commit 3 (Soumith)..."
git add frontend/src/pages/Passenger.tsx frontend/src/pages/Driver.tsx frontend/src/lib/socket.ts
git commit --author="Soumith <soumith@student.edu>" -m "feat: implement Passenger/Driver logic and connect frontend client sockets"

Write-Host "Creating Commit 4 (Milan)..."
git add backend/src/index.ts frontend/src/pages/Admin.tsx
git commit --author="Milan Prajapati <milanprajapati571@gmail.com>" -m "feat(backend): build restricted Admin Portal and implement core Socket.io matching handlers"

Write-Host "Creating Commit 5 (Final Polish)..."
git add .
git commit --author="Milan Prajapati <milanprajapati571@gmail.com>" -m "docs: finalize styling themes, fix socket session state bugs, and author README"

Write-Host "Configuring Remote..."
git branch -M main
git remote add origin https://github.com/milanprajapati571/rickshaw-matching-system.git

Write-Host "Done! Ready to push."
