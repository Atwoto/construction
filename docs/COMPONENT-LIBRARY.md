# Construction CRM - Enhanced Component Library Documentation

## 📚 Component Reference Guide

This document provides detailed information about all reusable components in the Construction CRM system, including the new enhanced UX/UI components with animations, real-time features, and modern interactions.

## 🎯 New Enhanced Components

### **AnimatedStatCard.tsx**

Enhanced statistics cards with counting animations and trend indicators.

**Features:**

- Animated number counting from 0 to target value
- Trend arrows with percentage changes
- Hover lift effects with shadows
- Gradient backgrounds for icons
- Customizable colors and formatting
- Optional "View details" links

**Props:**

```tsx
interface AnimatedStatCardProps {
  title: string;
  value: number | string;
  icon: string | React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  link?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
    label: string;
  };
  prefix?: string;
  suffix?: string;
  animationDelay?: number;
  formatValue?: (value: number) => string;
}
```

**Usage:**

```tsx
<AnimatedStatCard
  title="Active Projects"
  value={42}
  icon={<Building className="h-6 w-6" />}
  color="primary"
  trend={{ value: 12, direction: "up", label: "vs last month" }}
  animationDelay={100}
/>
```

### **NotificationCenter.tsx**

Comprehensive notification system with real-time updates.

**Features:**

- Real-time notification updates
- Mark as read functionality
- Different notification types (success, error, warning, info)
- Action buttons for quick navigation
- Animated notification badges
- Toast integration

**Usage:**

```tsx
<NotificationCenter />
```

### **FloatingActionButton.tsx**

Floating action button with expandable quick actions.

**Features:**

- Expandable action menu
- Smooth animations and transitions
- Customizable quick actions
- Backdrop blur overlay
- Touch-friendly design

**Usage:**

```tsx
<FloatingActionButton />
```

### **CircularProgress.tsx**

Animated circular progress indicators.

**Features:**

- Smooth progress animations
- Color-coded progress (red/yellow/blue/green based on value)
- Customizable size and stroke width
- Optional labels and values
- Drop shadow effects

**Props:**

```tsx
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  animationDelay?: number;
}
```

### **MiniChart.tsx & Sparkline**

Mini chart components for trend visualization.

**Features:**

- Line, bar, and area chart types
- Animated drawing effects
- Hover interactions
- Trend indicators
- Responsive design

**Usage:**

```tsx
<MiniChart
  data={[{value: 100}, {value: 120}, {value: 90}]}
  type="area"
  color="#22c55e"
  showDots={true}
  animated={true}
/>

<Sparkline data={[65, 72, 68, 75, 82]} color="#3b82f6" />
```

### **ActivityFeed.tsx**

Enhanced activity feed with avatars and real-time updates.

**Features:**

- User avatars with fallback initials
- Color-coded activity icons
- Real-time activity simulation
- Mark as read functionality
- Metadata display (status, amounts, dates)
- Responsive design

**Usage:**

```tsx
<ActivityFeed showMarkAsRead={true} maxItems={8} realTime={true} />
```

### **LiveClockWidget.tsx**

Live clock with weather integration for construction sites.

**Features:**

- Real-time clock updates
- Weather information display
- Weather alerts for construction
- Multiple time zones
- Gradient backgrounds based on weather
- Temperature and wind speed tracking

**Usage:**

```tsx
<LiveClockWidget
  showWeather={true}
  location="Main Construction Site"
  format24Hour={false}
  showSeconds={true}
/>
```

### **GlobalSearch.tsx**

Advanced search component with filters and autocomplete.

**Features:**

- Global search across all content types
- Advanced filtering options
- Real-time search results
- Keyboard navigation
- Result categorization
- Search history and suggestions

**Usage:**

```tsx
<GlobalSearch />
```

### **DarkModeToggle.tsx**

Theme switcher with light/dark/system modes.

**Features:**

- Light, dark, and system theme options
- Smooth theme transitions
- Persistent theme storage
- System preference detection

**Usage:**

```tsx
<DarkModeToggle />
```

### **EnhancedDashboard.tsx**

Complete dashboard implementation using all enhanced components.

**Features:**

- Animated statistics cards
- Progress visualizations
- Activity feeds
- Live widgets
- Floating actions
- Responsive grid layout

## 🎯 Component Categories

### **1. Layout Components**

#### **Layout.tsx**

Main application layout with sidebar navigation and header.

**Props:**

- No props (uses context for user data)

**Features:**

- Responsive sidebar with mobile overlay
- User authentication integration
- Navigation state management
- Glass morphism design

**Usage:**

```tsx
<Layout>
  <Outlet /> // React Router outlet for page content
</Layout>
```

---

### **2. UI Components (Shadcn-based)**

#### **Card Components**

Enhanced card system with glass morphism effects.

**Available Components:**

- `Card` - Main container
- `CardHeader` - Header section with title
- `CardContent` - Main content area
- `CardFooter` - Footer section
- `CardTitle` - Styled title component
- `CardDescription` - Subtitle/description

**Styling Classes:**

- `enhanced-card` - Glass morphism with hover effects
- `dashboard-card` - Specific dashboard styling
- `stat-card` - Statistics card variant
- `metric-card` - Metrics display variant

**Example:**

```tsx
<Card className="enhanced-card">
  <CardHeader>
    <CardTitle>Project Statistics</CardTitle>
    <CardDescription>Overview of current projects</CardDescription>
  </CardHeader>
  <CardContent>{/* Content here */}</CardContent>
</Card>
```

#### **Button Components**

Consistent button system with multiple variants.

**Variants:**

- `default` - Primary blue button
- `secondary` - Gray outline button
- `ghost` - Transparent button
- `outline` - Bordered button
- `destructive` - Red danger button

**Sizes:**

- `sm` - Small button
- `default` - Standard size
- `lg` - Large button
- `icon` - Icon-only button

**Example:**

```tsx
<Button variant="default" size="lg">
  Create Project
</Button>
```

#### **Form Components**

**Input Component:**

```tsx
<Input
  placeholder="Enter company name"
  value={value}
  onChange={handleChange}
  disabled={loading}
/>
```

**Select Component:**

```tsx
<Select onValueChange={handleChange} value={selectedValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Label Component:**

```tsx
<Label htmlFor="input-id">Field Label</Label>
```

---

### **3. Business Logic Components**

#### **Client Components**

**ClientTable**

- Sortable columns
- Pagination support
- Row selection
- Action buttons (Edit, View, Delete)
- Status updates

**ClientCard**

- Card-based client display
- Quick actions
- Status indicators
- Responsive design

**ClientFilters**

- Advanced filtering system
- Search functionality
- Status, source, and assignment filters
- Company size and rating filters

**ClientForm**

- Create/edit client forms
- Validation with React Hook Form
- File upload support
- Auto-save functionality

**ClientStats**

- Statistics display
- Charts and metrics
- Performance indicators
- Conversion tracking

#### **Project Components**

**ProjectTable**

- Project listing with sorting
- Progress indicators
- Team member display
- Budget tracking




