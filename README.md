# Super Calendar

A modern, responsive Calendar built with React that allows you to manage tasks as calendar events. Tasks can be marked as complete directly from the calendar interface.

## Features

- 📅 **Calendar Views**: Month, Week, and Day views (Month view implemented)
- ✅ **Task Management**: Create, edit, delete, and mark tasks as complete
- 💾 **Cloud Storage**: Tasks are automatically saved to cloud & sync across devices
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, Google-inspired design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd google-calendar-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding Tasks
- Click the "+" button in the bottom-right corner
- Fill in the task details (title, description, date, time)
- Click "Add Task" to save

### Managing Tasks
- Click on any task in the calendar to edit it
- Click the checkbox next to a task to mark it as complete
- Use the navigation arrows to move between months
- Click "Today" to quickly return to the current date

### Task Features
- **Title**: Required field for task identification
- **Description**: Optional detailed description
- **Date**: When the task is scheduled
- **Time**: Optional specific time
- **Completion Status**: Mark tasks as done with visual feedback

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx          # Main calendar component
│   ├── CalendarHeader.jsx    # Header with navigation and view controls
│   ├── MonthView.jsx         # Month view implementation
│   ├── DayCell.jsx           # Individual day cell component
│   ├── TaskItem.jsx          # Task display component
│   └── TaskModal.jsx         # Task creation/editing modal
├── hooks/
│   └── useLocalStorage.js    # Custom hook for local storage
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **date-fns**: Date manipulation library
- **CSS3**: Modern styling with flexbox and grid
- **Local Storage**: Browser storage for data persistence

## Future Enhancements

- [ ] Week and Day view implementations
- [ ] Task categories and colors
- [ ] Recurring tasks
- [ ] Task search and filtering
- [ ] Export/import functionality
- [ ] Dark mode support
- [ ] Drag and drop task scheduling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
