// Construction CRM UI enums for modern design system

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress', 
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ClientStatus {
  LEAD = 'lead',
  OPPORTUNITY = 'opportunity', 
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ComponentVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary', 
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info'
}

export enum AnimationType {
  FADE_IN = 'fade-in',
  SLIDE_UP = 'slide-up',
  SCALE_IN = 'scale-in',
  BOUNCE = 'bounce'
}

export enum LayoutBreakpoint {
  MOBILE = 'mobile',
  TABLET = 'tablet', 
  DESKTOP = 'desktop',
  WIDE = 'wide'
}