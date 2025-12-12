import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locations',
        href: '/locations',
    },
];

export default function Dashboard() {
    const { locations } = usePage<{
        locations: {
            data: {
                id: number;
                name: string;
                slug: string;
                company?: { name: string };
                equipments_count: number;
            }[];
            links: never[];
            current_page: number;
            last_page: number;
        };
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {locations.data.map((location) => (
                        <Card
                            key={location.id}
                            className="relative flex flex-col gap-2 p-4 shadow-none"
                        >
                            <CardTitle>{location.name || 'N/A'}</CardTitle>

                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building className="size-4" />{' '}
                                {location.company?.name || 'N/A'}
                            </p>

                            <Badge
                                variant="secondary"
                                className="absolute top-4 right-4 bg-sidebar text-xs text-muted-foreground"
                            >
                                {location.equipments_count}{' '}
                                {location.equipments_count === 1
                                    ? 'equipment'
                                    : 'equipments'}
                            </Badge>

                            <Link
                                href={`/locations/${location.slug}`}
                                className="mt-2 w-fit"
                            >
                                <Button variant="outline">View Location</Button>
                            </Link>
                        </Card>
                    ))}
                </div>

                {locations.last_page > 1 && (
                    <div className="mt-6 flex gap-2">
                        <p className="text-sm text-muted-foreground">
                            Page {locations.current_page} of{' '}
                            {locations.last_page}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
