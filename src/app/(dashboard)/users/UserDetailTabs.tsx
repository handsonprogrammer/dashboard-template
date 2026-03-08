"use client";

import { type User } from "@/data/users";
import {
    Avatar,
    Badge,
    Tabs,
    Card,
    CardHeader,
    CardBody,
    Input,
    Select,
    type BadgeVariant,
    type TabItem,
    Toggle,
    Timeline,
    type TimelineEvent,
} from "@/components/ui";
import { useState } from "react";

const ROLE_BADGE: Record<User["role"], BadgeVariant> = {
    admin: "primary",
    editor: "secondary",
    viewer: "outline",
};

const STATUS_BADGE: Record<User["status"], BadgeVariant> = {
    active: "success",
    inactive: "destructive",
    pending: "warning",
};

const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
];

const activityEvents: TimelineEvent[] = [
    { id: "a1", title: "Profile updated", description: "Changed display name", date: "2 days ago" },
    { id: "a2", title: "Password changed", description: "Password reset via email link", date: "1 week ago" },
    { id: "a3", title: "New login", description: "Sign-in from London, UK", date: "1 week ago" },
    { id: "a4", title: "Role changed", description: "Role updated to current role", date: "2 weeks ago" },
    { id: "a5", title: "Account created", description: "Joined the platform", date: "Account joined date" },
];

function ProfileTab({ user }: { user: User }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);

    return (
        <div className="space-y-6">
            {/* Avatar + name summary */}
            <Card>
                <div className="flex items-center gap-5">
                    <Avatar name={user.name} size="xl" />
                    <div>
                        <h2 className="text-lg font-semibold">{user.name}</h2>
                        <p className="text-sm text-(--color-muted-foreground)">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={ROLE_BADGE[user.role]}>{user.role}</Badge>
                            <Badge variant={STATUS_BADGE[user.status]} dot>{user.status}</Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Editable fields */}
            <Card>
                <CardHeader title="Profile Information" description="Update your display name, email, and role." />
                <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Select
                            label="Role"
                            options={ROLE_OPTIONS}
                            value={role}
                            onChange={(e) => setRole(e.target.value as User["role"])}
                        />
                        <div>
                            <p className="text-sm font-medium mb-1.5 text-(--color-foreground)">Member Since</p>
                            <p className="text-sm text-(--color-muted-foreground) mt-2">{user.joinedAt}</p>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            className="rounded-md bg-(--color-primary) text-(--color-primary-foreground) px-5 py-2 text-sm font-medium hover:opacity-90 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

function ActivityTab({ user }: { user: User }) {
    const events: TimelineEvent[] = activityEvents.map((e) =>
        e.id === "a5" ? { ...e, description: `Joined on ${user.joinedAt}` } : e
    );

    return (
        <Card>
            <CardHeader title="Account Activity" description="A history of recent actions and sign-ins." />
            <CardBody>
                <Timeline events={events} />
            </CardBody>
        </Card>
    );
}

function SettingsTab({ user }: { user: User }) {
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [securityAlerts, setSecurityAlerts] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader title="Notification Preferences" description={`Manage alerts for ${user.name}.`} />
                <CardBody className="space-y-5">
                    {[
                        { label: "Email Notifications", description: "Receive notifications via email", value: emailNotifs, set: setEmailNotifs },
                        { label: "Security Alerts", description: "Be notified of sign-ins and suspicious activity", value: securityAlerts, set: setSecurityAlerts },
                        { label: "Weekly Digest", description: "A weekly summary of platform activity", value: weeklyDigest, set: setWeeklyDigest },
                    ].map(({ label, description, value, set }) => (
                        <div key={label} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-xs text-(--color-muted-foreground)">{description}</p>
                            </div>
                            <Toggle checked={value} onChange={set} />
                        </div>
                    ))}
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Security" description="Two-factor authentication and session management." />
                <CardBody className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Two-Factor Authentication</p>
                            <p className="text-xs text-(--color-muted-foreground)">Require a second step at sign-in</p>
                        </div>
                        <Toggle checked={twoFactor} onChange={setTwoFactor} />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-(--color-border)">
                        <div>
                            <p className="text-sm font-medium text-(--color-destructive)">Deactivate Account</p>
                            <p className="text-xs text-(--color-muted-foreground)">This action cannot be undone</p>
                        </div>
                        <button
                            type="button"
                            className="rounded-md border border-(--color-destructive) text-(--color-destructive) px-4 py-1.5 text-sm font-medium hover:bg-(--color-destructive)/10 transition"
                        >
                            Deactivate
                        </button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export interface UserDetailTabsProps {
    user: User;
}

export function UserDetailTabs({ user }: UserDetailTabsProps) {
    const tabs: TabItem[] = [
        { key: "profile", label: "Profile", content: <ProfileTab user={user} /> },
        { key: "activity", label: "Activity", content: <ActivityTab user={user} /> },
        { key: "settings", label: "Settings", content: <SettingsTab user={user} /> },
    ];

    return <Tabs tabs={tabs} defaultTab="profile" className="mt-6" />;
}
