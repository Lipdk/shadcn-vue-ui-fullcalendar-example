# FullCalendar + Shadcn-Vue Example

A flexible calendar application built with Vue 3, Vite, Shadcn-Vue, and FullCalendar. This project demonstrates how to integrate a modern calendar component with a beautiful UI library in a Vue ecosystem.

![FullCalendar with Shadcn-Vue](https://github.com/user-attachments/assets/02abdeac-e681-4147-9e8c-48c2c3d21791)

## Features

- 🗓️ **Full-Featured Calendar**: Week, day, and month views with event management
- 🎨 **Modern UI**: Built with Shadcn-Vue components for a polished interface
- 🌙 **Dark Mode Support**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works beautifully on desktop and mobile devices
- ⚡ **Fast Development**: Powered by Vite for instant hot reload
- 🔧 **TypeScript**: Full type safety throughout the application
- 🎯 **Event Management**: Add, edit, delete, and view calendar events
- 📅 **Scheduling Assistant**: Find available time slots (coming soon)

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) with Composition API
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Components**: [Shadcn-Vue](https://www.shadcn-vue.com/)
- **Calendar**: [FullCalendar](https://fullcalendar.io/) with Vue 3 integration
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Lipdk/shadcn-vue-ui-fullcalendar-example.git
cd shadcn-vue-ui-fullcalendar-example
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # Shadcn-Vue UI components
│   ├── Calendar.vue    # Main calendar component
│   ├── CalendarNav.vue # Calendar navigation
│   └── ...
├── stores/             # Pinia stores
├── utils/              # Utility functions
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Calendar Features

- **Multiple Views**: Switch between day, week, and month views
- **Event Management**: Create, edit, and delete events
- **Drag & Drop**: Move events between time slots
- **Event Styling**: Custom colors and styling for different event types
- **Time Range**: Configurable business hours display
- **Responsive**: Adapts to different screen sizes

## Customization

### Adding New Event Types

1. Update the `CalendarEvent` interface in `src/utils/data.ts`
2. Add new event creation logic in the events store
3. Customize styling in the calendar component

### Theming

The project uses Tailwind CSS with CSS variables for theming. Customize colors and styling in:
- `src/styles/main.css` - CSS variables for themes
- `tailwind.config.ts` - Tailwind configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [FullCalendar](https://fullcalendar.io/) for the excellent calendar library
- [Shadcn-Vue](https://www.shadcn-vue.com/) for the beautiful UI components
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Vite](https://vitejs.dev/) for the fast build tool
