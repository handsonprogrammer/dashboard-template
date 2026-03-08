/**
 * Central barrel export for all UI primitives.
 * Add new components here as they are implemented.
 *
 * Usage: import { Button, Badge, Modal } from "@/components/ui";
 */

// Primitives
export { Button, type ButtonProps } from "./Button/Button";
export { Badge, type BadgeProps, type BadgeVariant } from "./Badge/Badge";
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "./Avatar/Avatar";
export { Spinner, type SpinnerProps } from "./Spinner/Spinner";
export { Progress, RingProgress, type ProgressProps, type RingProgressProps } from "./Progress/Progress";

// Feedback
export { Alert, type AlertProps } from "./Alert/Alert";
export {
    Skeleton,
    SkeletonCard,
    SkeletonTableRow,
    SkeletonChart,
    SkeletonAvatar,
    type SkeletonProps,
} from "./Skeleton/Skeleton";
export { EmptyState, type EmptyStateProps } from "./EmptyState/EmptyState";

// Overlay
export { Modal, ConfirmDialog, type ModalProps, type ConfirmDialogProps } from "./Modal/Modal";
export { Drawer, type DrawerProps } from "./Drawer/Drawer";
export { Tooltip, type TooltipProps } from "./Tooltip/Tooltip";

// Navigation
export { Tabs, type TabsProps, type TabItem } from "./Tabs/Tabs";
export { Accordion, type AccordionProps, type AccordionItem } from "./Accordion/Accordion";
export { Dropdown, type DropdownProps, type DropdownItem } from "./Dropdown/Dropdown";
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from "./Breadcrumbs/Breadcrumbs";
export { CommandPalette, type CommandPaletteProps, type CommandItem } from "./CommandPalette/CommandPalette";
export { NotificationBell } from "./NotificationBell/NotificationBell";
export { ThemeToggle, type ThemeToggleProps } from "./ThemeToggle/ThemeToggle";

// Form controls
export { Input, type InputProps } from "./Input/Input";
export { Textarea, type TextareaProps } from "./Textarea/Textarea";
export { Select, type SelectProps, type SelectOption } from "./Select/Select";
export { Checkbox, type CheckboxProps } from "./Checkbox/Checkbox";
export { RadioGroup, type RadioGroupProps, type RadioOption } from "./RadioGroup/RadioGroup";
export { Toggle, type ToggleProps } from "./Toggle/Toggle";
export { DatePicker, type DatePickerProps } from "./DatePicker/DatePicker";
export { DateRangePicker, type DateRangePickerProps, type DateRange } from "./DateRangePicker/DateRangePicker";

// Layout blocks
export {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    type CardProps,
    type CardHeaderProps,
    type CardBodyProps,
    type CardFooterProps,
} from "./Card/Card";
export { StatCard, type StatCardProps } from "./StatCard/StatCard";
export { TextCard, type TextCardProps } from "./TextCard/TextCard";
export { ImageCard, type ImageCardProps } from "./ImageCard/ImageCard";

// Complex
export { Stepper, type StepperProps, type StepperStep, type StepStatus } from "./Stepper/Stepper";
export { Timeline, type TimelineProps, type TimelineEvent } from "./Timeline/Timeline";
// export { Timeline, TimelineItem, type TimelineProps } from "./Timeline/Timeline";

// Utility display
export { CodeBlock, type CodeBlockProps } from "./CodeBlock/CodeBlock";
