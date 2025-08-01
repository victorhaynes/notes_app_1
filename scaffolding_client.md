# 1) Initialize react app using react-router template (includes typescript)
```sh
npx npx create-next-app@latest
cd notes-client
npm install axios
```
# notes-client
# TS yes
# ESLint no
# Tailwind yes
# src yes
# app router yes
# turbopack no
# customize alias no

```sh
npm run dev
```

# 2) Clean out global.css leaving tailwind import and page.tsx (landing page), public/ .svg images and remove the favicon.ico if you want

# 4) make folders & page.tsx components for each of the routes you want to have. In Next
```txt
src/app/page.tsx    <----- this is the landing page. everything else goes in a folder
src/app/about/page.tsx
src/app/cars/page.tsx
src/app/cars/[id]/page.tsx
```

# 5) app/_lib create .ts wrapper for axios
# 6) make _components/ folder for shared components i.e. Navbar.tsx
# 7) use Link import to create a NavBar component and return in it in root.tsx's App component

# 8) Create app/_context folder for state management
```txt
create context providers for your state:
these define the variables and the operations on them
```
# 9) Wrap the content of your layout.tsx's JSX with the provider, now any child can consume it
# 10) import the useContext"() function from your context creator, destructure what you need and use it as desired in the component
