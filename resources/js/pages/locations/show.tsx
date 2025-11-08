import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export default function LocationShow({ location }: { location: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locations', href: '/locations' },
        { title: location.name, href: `/locations/${location.slug}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={location.name} />

            <div className="p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {location.equipments.map((equipment: any) => (
                        <Card
                            key={equipment.id}
                            className="relative flex flex-col gap-2 p-4 shadow-none"
                        >
                            <CardTitle>{equipment.name}</CardTitle>

                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="size-4" />
                                {location.name}
                            </p>

                            <Link
                                href={`/locations/${location.slug}/${equipment.slug}`}
                                className="mt-2 w-fit"
                            >
                                <Button variant="outline">
                                    View Equipment
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
