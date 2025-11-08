import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    Check,
    ChevronDown,
    ChevronRight,
    CircleX,
    EllipsisVertical,
    Hammer,
    LoaderIcon,
    SearchIcon,
} from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';

type Location = {
    id: number;
    name: string;
    slug: string;
    company?: { name: string };
};

type Equipment = {
    id: number;
    name: string;
    slug: string;
    type?: string;
    serial_number?: string;
};

type Props = {
    location: Location;
    equipment: Equipment;
};

type EquipmentRecord = {
    id: number;
    location_id: number;
    equipment_id: number;
    myconveyor_id: string;
    local_id: string;
    area: string;
    section: string;
    sub_section: string;
    track: string;
    category_id: number;
    customer_erp: string;
    oem_code: string;
    oem_name: string;
    oem_description: string;
    supplier_name: string;
    supplier_description: string;
    supplier_code: string;
    quantity: number;
    unit: string;
    status_id: number;
    status_date: string;
    pdf_file: string;
    note: string;
};

export default function EquipmentShow({ location, equipment }: Props) {
    const { records } = usePage<{ records: EquipmentRecord[] }>().props;

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] =
        useState<keyof EquipmentRecord>('myconveyor_id');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const excludedColumns = [
        'id',
        'location_id',
        'equipment_id',
        'myconveyor_id',
    ];

    // Filter and sort
    const filteredData = useMemo(() => {
        return records
            .filter((record) =>
                Object.entries(record)
                    .filter(([key]) => !excludedColumns.includes(key))
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .some(([_, val]) =>
                        val
                            ?.toString()
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                    ),
            )
            .sort((a, b) => {
                const aVal = a[sortKey] ?? '';
                const bVal = b[sortKey] ?? '';
                if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
    }, [records, excludedColumns, search, sortKey, sortDir]);

    // Group by myconveyor_id
    const groupedData = useMemo(() => {
        const groups: Record<string, EquipmentRecord[]> = {};
        filteredData.forEach((record) => {
            if (!groups[record.myconveyor_id])
                groups[record.myconveyor_id] = [];
            groups[record.myconveyor_id].push(record);
        });
        return groups;
    }, [filteredData]);

    const toggleSort = (key: keyof EquipmentRecord) => {
        if (excludedColumns.includes(key)) return;
        if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const renderStatusBadge = (statusId: number) => {
        switch (statusId) {
            case 1:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-white text-blue-800"
                    >
                        <LoaderIcon className="text-primary" /> To be defined
                    </Badge>
                );
            case 2:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-white text-green-700"
                    >
                        <Check className="text-green-700" /> Operating condition
                    </Badge>
                );
            case 3:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-white text-red-700"
                    >
                        <CircleX className="text-red-700" /> Out of
                        specification
                    </Badge>
                );
            case 4:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-white text-orange-800"
                    >
                        <Hammer className="text-orange-500" /> Plan replacement
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="bg-white">
                        Unknown
                    </Badge>
                );
        }
    };

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locations', href: '/locations' },
        { title: location.name, href: `/locations/${location.slug}` },
        {
            title: equipment.name,
            href: `/locations/${location.slug}/${equipment.slug}`,
        },
    ];

    const tableColumns = Object.keys(records[0] || {}).filter(
        (col) => !excludedColumns.includes(col),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equipment Records" />
            <div className="p-6">
                <div className="mb-4 flex gap-3">
                    <InputGroup className="w-60">
                        <InputGroupInput
                            placeholder="Search equipment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <Card className="overflow-auto rounded-md p-0 shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-8 bg-primary hover:bg-primary dark:bg-sidebar">
                                <TableHead className="px-4 text-white">
                                    MyConveyor ID
                                </TableHead>
                                {tableColumns.map((col) => (
                                    <TableHead
                                        key={col}
                                        onClick={() =>
                                            toggleSort(
                                                col as keyof EquipmentRecord,
                                            )
                                        }
                                        className="cursor-pointer px-4 text-white capitalize"
                                    >
                                        {col.replace(/_/g, ' ')}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                ))}
                                <TableHead className="px-4 text-white"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {Object.entries(groupedData).length > 0 ? (
                                Object.entries(groupedData).map(
                                    ([myconveyorId, records]) => (
                                        <Fragment key={myconveyorId}>
                                            {/* Parent Row */}
                                            <TableRow
                                                className="h-12 cursor-pointer hover:bg-primary-hover dark:hover:bg-sidebar-accent"
                                                onClick={() =>
                                                    toggleExpand(myconveyorId)
                                                }
                                            >
                                                <TableCell className="flex items-center gap-2 px-4">
                                                    {expanded[myconveyorId] ? (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <ChevronDown />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <ChevronRight />
                                                        </Button>
                                                    )}
                                                    {myconveyorId}
                                                </TableCell>
                                                {tableColumns.map((col) => (
                                                    <TableCell
                                                        key={col}
                                                        className="px-4"
                                                    >
                                                        {records[0][
                                                            col as keyof EquipmentRecord
                                                        ]?.toString() || '-'}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="px-4 text-right"></TableCell>
                                            </TableRow>

                                            {/* Expanded Rows */}
                                            {expanded[myconveyorId] &&
                                                records.map((record) => (
                                                    <TableRow
                                                        key={record.id}
                                                        className="h-10 bg-sidebar hover:bg-primary-hover dark:hover:bg-sidebar-accent"
                                                    >
                                                        <TableCell className="px-4 text-muted-foreground">
                                                            {myconveyorId}
                                                        </TableCell>
                                                        {tableColumns.map(
                                                            (col) => (
                                                                <TableCell
                                                                    key={col}
                                                                    className="px-4 text-sm"
                                                                >
                                                                    {col ===
                                                                    'status_id'
                                                                        ? renderStatusBadge(
                                                                              record.status_id,
                                                                          )
                                                                        : record[
                                                                              col as keyof EquipmentRecord
                                                                          ]?.toString() ||
                                                                          '-'}
                                                                </TableCell>
                                                            ),
                                                        )}
                                                        <TableCell className="px-4 text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <EllipsisVertical />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel className="text-sm text-muted-foreground">
                                                                        Actions
                                                                    </DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem>
                                                                        View
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </Fragment>
                                    ),
                                )
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={tableColumns.length + 2}
                                        className="h-12 text-center"
                                    >
                                        No results found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
