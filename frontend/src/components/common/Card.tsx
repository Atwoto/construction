import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-soft',
  lg: 'shadow-medium',
};

function Card({ 
  children, 
  className,
  padding = 'none',
  shadow = 'md',
  hover = false 
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200',
        shadowClasses[shadow],
        paddingClasses[padding],
        hover && 'hover:shadow-strong transition-shadow duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl', className)}>
      {children}
    </div>
  );
}

// Attach sub-components to main Card component
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;