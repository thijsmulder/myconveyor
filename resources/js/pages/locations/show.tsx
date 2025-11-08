import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

export default function LocationShow({ location }: { location: any }) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locations', href: '/locations' },
        { title: location.name, href: `/locations/${location.slug}` }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={location.name} />

            <div className="p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {location.equipments.map((equipment: any) => (
                        <Card key={equipment.id} className="shadow-none p-4 gap-2 relative flex flex-col">
                            <p className="text-sm text-muted-foreground">{location.name}</p>

                            <CardTitle>{equipment.name}</CardTitle>

                            <Link href={`/locations/${location.slug}/${equipment.slug}`} className="mt-2 w-fit">
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
