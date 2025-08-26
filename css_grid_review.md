# Tailwind CSS Grid Explanation

## Container Setup

```jsx
<div className="max-w-7xl mx-auto px-4 mt-4">
```

- `max-w-7xl` - Limits maximum width so it doesn't stretch too wide on large screens
- `mx-auto` - Centers the container horizontally
- `px-4` - Adds horizontal padding inside the container
- `mt-4` - Adds top margin

## Header

```jsx
<h1 className="font-bold text-xl mb-4">My Notes:</h1>
```

- `font-bold` - Makes the text bold
- `text-xl` - Sets text size to extra large
- `mb-4` - Adds bottom margin to separate from grid

## Grid Container

```jsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

- `grid` - Turns container into CSS grid
- `gap-4` - Adds spacing between grid items (rows and columns)
- `grid-cols-1` - 1 column on small screens (default)
- `sm:grid-cols-2` - 2 columns on screens ≥640px
- `lg:grid-cols-4` - 4 columns on screens ≥1024px

### Why it works well on various screen sizes

- Tailwind uses **mobile-first breakpoints** - starts with 1 column, then expands to 2 and 4 columns as screen width increases
- `gap-4` ensures spacing between items regardless of screen size
- Using relative units like `max-w-7xl` keeps the grid readable on very large screens

## Grid Items

```jsx
<div key={note.id} className="p-4 border rounded-md bg-amber-100 hover:brightness-90 transition">
```

- `p-4` - Padding inside each card
- `border` - Adds border around each card
- `rounded-md` - Slightly rounds corners
- `bg-amber-100` - Light amber background
- `hover:brightness-90` - Darkens card slightly on hover
- `transition` - Smoothly animates hover effect

## Dynamic Grid with Auto-Fit

Instead of hardcoding 1/2/4 columns, use **auto-fit with minmax**:

```jsx
<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
```

- `auto-fit` - Automatically fits as many columns as possible into available width
- `minmax(250px, 1fr)` - Each column minimum 250px wide, grows to fill remaining space
- Fully responsive and automatically adapts to screen width
- Shows maximum number of cards per row without hardcoding breakpoints

## Complete Example

```jsx
<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
  {notes.map((note) => (
    <div key={note.id} className="p-4 border rounded-md bg-amber-100 hover:brightness-90 transition">
      <div className="border-b border-amber-600 h-13">
        <Link className="font-bold" href={`/notes/${note.id}`}>{note.title}</Link>
      </div>
      <div className="mt-4">{note.content}</div>
    </div>
  ))}
</div>
```

This approach eliminates the need for `sm`/`lg` breakpoints and ensures the grid dynamically fills available space with as many cards per row as possible.