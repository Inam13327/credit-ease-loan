Welcome to Your Credit Ease Loan Project
Project Info
GitHub URL: https://github.com/Inam13327/credit-ease-loan
Live Deployment: monthlyloan.netlify.app

How Can I Edit This Code?
There are several ways to edit your application.

Option 1 – Edit Locally in Your Preferred IDE
If you want to work locally using VS Code or another IDE:

Clone the Repository

sh
Copy
Edit
git clone https://github.com/Inam13327/credit-ease-loan.git
Navigate to the Project Directory

sh
Copy
Edit
cd credit-ease-loan
Install Dependencies

sh
Copy
Edit
npm install
Start the Development Server

sh
Copy
Edit
npm run dev
This will launch the app with hot-reload in your browser.

Option 2 – Edit Directly on GitHub
Open the repo on GitHub.

Navigate to the file you want to change.

Click the Edit (pencil) icon.

Make changes, scroll down, and commit.

Option 3 – Use GitHub Codespaces
On the repo page, click the green Code button.

Go to the Codespaces tab.

Click New Codespace to open an online development environment.

Edit, commit, and push directly from the browser.

What Technologies Are Used?
This project is built with:

Vite – Fast frontend build tool

TypeScript – Strongly typed JavaScript

React – UI library for building components

shadcn-ui – Prebuilt styled components

Tailwind CSS – Utility-first CSS framework

How to Deploy This Project
Deploy to Netlify (recommended):

Create a Netlify account at https://netlify.com

Connect your GitHub repo.

Select the main branch.

Set the build command to:

arduino
Copy
Edit
npm run build
and publish directory to:

nginx
Copy
Edit
dist
Custom Domain

In Netlify settings, go to Domain Management.

Add your domain and follow DNS setup instructions.

How to Push Changes to GitHub
Whenever you make updates locally:

sh
Copy
Edit
git add .
git commit -m "Describe your changes here"
git push origin main
