import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // shadcn button

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locations',
        href: '/locations',
    },
];

export default function Dashboard() {
    const { locations } = usePage<{
        locations: {
            id: number;
            name: string;
            slug: string;
            company?: { name: string };
            equipments_count: number;
        }[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {locations.map((location) => (
                        <Card key={location.id} className="shadow-none p-4 gap-2 relative flex flex-col">
                            {/* Company name */}
                            <p className="text-sm text-muted-foreground">
                                {location.company?.name || 'N/A'}
                            </p>

                            {/* Location name */}
                            <CardTitle>{location.name || 'N/A'}</CardTitle>

                            {/* Equipment count badge */}
                            <Badge
                                variant="secondary"
                                className="absolute top-4 right-4 text-xs bg-sidebar"
                            >
                                {location.equipments_count}{' '}
                                {location.equipments_count === 1 ? 'equipment' : 'equipments'}
                            </Badge>

                            {/* Button to go to location/{slug} */}
                            <Link href={`/locations/${location.slug}`} className="mt-2 w-fit">
                                <Button variant="outline">
                                    View Location
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
