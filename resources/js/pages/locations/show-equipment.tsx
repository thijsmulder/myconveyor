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
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Filter,
    Hammer,
    LoaderIcon,
    SearchIcon,
    Settings2,
} from 'lucide-react';
import { Fragment, useCallback, useMemo, useState } from 'react';

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
type Props = { location: Location; equipment: Equipment };

type EquipmentRecord = {
    id: number;
    location_id: number;
    equipment_id: string;
    myconveyor_id: string;
    local_id: string;
    area: string;
    section: string;
    sub_section: string;
    track: string;
    category_id: string;
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
    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [sortKey, setSortKey] =
        useState<keyof EquipmentRecord>('myconveyor_id');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        'category_id',
        'quantity',
        'unit',
        'status_id',
        'status_date',
        'pdf_file',
    ]);

    const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const excludedColumns = [
        'id',
        'location_id',
        'equipment_id',
        'myconveyor_id',
    ];

    const allColumns = useMemo(
        () =>
            Object.keys(records[0] || {}).filter(
                (col) => !excludedColumns.includes(col),
            ),
        [records],
    );

    const filteredData = useMemo(() => {
        return records.filter((record) => {
            const searchableCols = ['myconveyor_id', ...visibleColumns];

            const matchesSearch = searchableCols.some((col) =>
                String(record[col as keyof EquipmentRecord] ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            );

            const matchesStatus = statusFilter
                ? record.status_id === statusFilter
                : true;

            const matchesColumnFilters = Object.entries(columnFilters).every(
                ([col, val]) =>
                    record[col as keyof EquipmentRecord]?.toString() ===
                    val.toString(),
            );

            return matchesSearch && matchesStatus && matchesColumnFilters;
        });
    }, [records, visibleColumns, search, statusFilter, columnFilters]);

    const groupedData = useMemo(() => {
        return filteredData.reduce<Record<string, EquipmentRecord[]>>(
            (groups, record) => {
                (groups[record.myconveyor_id] ||= []).push(record);
                return groups;
            },
            {},
        );
    }, [filteredData]);

    const sortedParentIds = useMemo(
        () =>
            Object.keys(groupedData).sort(
                (a, b) => parseFloat(a) - parseFloat(b),
            ),
        [groupedData],
    );

    const totalPages = Math.ceil(sortedParentIds.length / itemsPerPage);

    const paginatedParentIds = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return sortedParentIds.slice(start, end);
    }, [sortedParentIds, currentPage, itemsPerPage]);

    const toggleSort = useCallback(
        (key: keyof EquipmentRecord) => {
            if (excludedColumns.includes(key)) return;
            setSortDir((prev) =>
                sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'asc',
            );
            setSortKey(key);
        },
        [sortKey],
    );

    const toggleColumn = useCallback((col: string) => {
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );
    }, []);

    const toggleExpand = useCallback((id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const renderStatusBadge = useCallback((statusId: number) => {
        switch (statusId) {
            case 1:
                return (
                    <Badge
                        className="border border-blue-300 bg-blue-200 text-blue-900"
                        variant="secondary"
                    >
                        <LoaderIcon className="text-blue-900" /> To be defined
                    </Badge>
                );
            case 2:
                return (
                    <Badge
                        className="border border-green-400 bg-green-200 text-green-900"
                        variant="secondary"
                    >
                        <Check className="text-green-900" /> Operating condition
                    </Badge>
                );
            case 3:
                return (
                    <Badge
                        className="border border-red-300 bg-red-200 text-red-900"
                        variant="secondary"
                    >
                        <CircleX className="text-red-900" /> Out of
                        specification
                    </Badge>
                );
            case 4:
                return (
                    <Badge
                        className="border border-orange-300 bg-orange-200 text-orange-900"
                        variant="secondary"
                    >
                        <Hammer className="text-orange-900" /> Plan replacement
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="border border-gray-300 bg-white text-gray-900"
                    >
                        Unknown
                    </Badge>
                );
        }
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locations', href: '/locations' },
        { title: location.name, href: `/locations/${location.slug}` },
        {
            title: equipment.name,
            href: `/locations/${location.slug}/${equipment.slug}`,
        },
    ];

    const filterableColumns = [
        { key: 'myconveyor_id', label: 'MyConveyor ID' },
        { key: 'local_id', label: 'Local ID' },
        { key: 'area', label: 'Area' },
        { key: 'section', label: 'Section' },
        { key: 'sub_section', label: 'Sub Section' },
        { key: 'category_id', label: 'Category' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equipment Records" />
            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Bar */}
                        <InputGroup className="w-60">
                            <InputGroupInput
                                placeholder="Search items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        {/* Status Tabs */}
                        <Tabs
                            value={statusFilter?.toString() || 'all'}
                            onValueChange={(value) =>
                                setStatusFilter(
                                    value === 'all' ? null : parseInt(value),
                                )
                            }
                            className="max-w-md flex-1"
                        >
                            <TabsList className="gap-2">
                                <TabsTrigger
                                    value="all"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <span className="rounded-md border border-gray-300 bg-gray-200 px-1 py-1"></span>
                                    All
                                </TabsTrigger>
                                <TabsTrigger
                                    value="1"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <span className="flex items-center rounded-md border border-blue-300 bg-blue-200 px-1 py-1 text-blue-900"></span>
                                    Define
                                </TabsTrigger>
                                <TabsTrigger
                                    value="2"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <span className="flex items-center rounded-md border border-green-400 bg-green-200 px-1 py-1 text-green-900"></span>
                                    Operating
                                </TabsTrigger>
                                <TabsTrigger
                                    value="3"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <span className="flex items-center rounded-md border border-red-300 bg-red-200 px-1 py-1 text-red-900"></span>
                                    Out of spec
                                </TabsTrigger>
                                <TabsTrigger
                                    value="4"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <span className="flex items-center rounded-md border border-orange-300 bg-orange-200 px-1 py-1 text-orange-900"></span>
                                    Replace
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex items-center">
                        {/* Columns Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="rounded-r-none border-r-0"
                                >
                                    <Settings2 />
                                    View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    View columns
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {allColumns.map((col) => {
                                    const isSelected =
                                        visibleColumns.includes(col);
                                    return (
                                        <DropdownMenuItem
                                            key={col}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleColumn(col);
                                            }}
                                            className="flex items-center space-x-2"
                                        >
                                            <span className="flex w-4 justify-center">
                                                {isSelected && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </span>
                                            <span>
                                                {col
                                                    .replace(/_/g, ' ')
                                                    .replace(/^./, (c) =>
                                                        c.toUpperCase(),
                                                    )}
                                            </span>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="relative flex items-center gap-2 rounded-l-none"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Filter</span>
                                    {Object.keys(columnFilters).length > 0 && (
                                        <Badge
                                            variant="default"
                                            className="ml-1 h-5 rounded-full px-2 text-xs font-medium"
                                        >
                                            {Object.keys(columnFilters).length}{' '}
                                            active
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="flex w-96 flex-col"
                            >
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                    <SheetDescription>
                                        Select filters
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="flex-1 space-y-4 overflow-y-auto px-4">
                                    {filterableColumns.map((col) => {
                                        const uniqueValues = Array.from(
                                            new Set(
                                                records
                                                    .map(
                                                        (r) =>
                                                            r[
                                                                col.key as keyof EquipmentRecord
                                                            ],
                                                    )
                                                    .filter(
                                                        (v) =>
                                                            v !== undefined &&
                                                            v !== null &&
                                                            v !== '',
                                                    ),
                                            ),
                                        );

                                        return (
                                            <div key={col.key}>
                                                <Label>{col.label}</Label>
                                                <Select
                                                    value={
                                                        columnFilters[
                                                            col.key
                                                        ] ?? undefined
                                                    }
                                                    onValueChange={(val) =>
                                                        setColumnFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                [col.key]:
                                                                    val ??
                                                                    undefined,
                                                            }),
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={`Select ${col.label}`}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueValues.map(
                                                            (val) => (
                                                                <SelectItem
                                                                    key={val.toString()}
                                                                    value={val.toString()}
                                                                >
                                                                    {val.toString()}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        );
                                    })}
                                </div>

                                <SheetFooter className="flex justify-end gap-2">
                                    <SheetClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => setColumnFilters({})}
                                        >
                                            Clear all filters
                                        </Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button>Save filters</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-auto rounded-md p-0 shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-8 bg-primary hover:bg-primary dark:bg-sidebar">
                                <TableHead className="px-4 text-xs font-black tracking-wider text-white uppercase">
                                    MyConveyor ID
                                </TableHead>
                                {visibleColumns.map((col) => (
                                    <TableHead
                                        key={col}
                                        onClick={() =>
                                            toggleSort(
                                                col as keyof EquipmentRecord,
                                            )
                                        }
                                        className="group cursor-pointer px-4 text-xs font-black tracking-wider text-white uppercase"
                                    >
                                        {col.replace(/_/g, ' ')}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-50" />
                                    </TableHead>
                                ))}
                                <TableHead className="px-4 text-white"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sortedParentIds.length > 0 ? (
                                paginatedParentIds.map((myconveyorId) => {
                                    const records = groupedData[myconveyorId];
                                    const sortedChildren = [...records].sort(
                                        (a, b) => {
                                            const aVal = a[sortKey] ?? '';
                                            const bVal = b[sortKey] ?? '';
                                            if (aVal < bVal)
                                                return sortDir === 'asc'
                                                    ? -1
                                                    : 1;
                                            if (aVal > bVal)
                                                return sortDir === 'asc'
                                                    ? 1
                                                    : -1;
                                            return 0;
                                        },
                                    );

                                    return (
                                        <Fragment key={myconveyorId}>
                                            <TableRow
                                                className="h-12 cursor-pointer hover:bg-primary-hover dark:hover:bg-sidebar-accent"
                                                onClick={() =>
                                                    toggleExpand(myconveyorId)
                                                }
                                            >
                                                <TableCell className="flex items-center gap-2 px-4">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        {expanded[
                                                            myconveyorId
                                                        ] ? (
                                                            <ChevronDown />
                                                        ) : (
                                                            <ChevronRight />
                                                        )}
                                                    </Button>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {myconveyorId}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs font-normal text-muted-foreground"
                                                        >
                                                            {records.length}{' '}
                                                            item
                                                            {records.length !==
                                                            1
                                                                ? 's'
                                                                : ''}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    colSpan={
                                                        visibleColumns.length +
                                                        1
                                                    }
                                                    className="px-4 text-right"
                                                />
                                            </TableRow>

                                            {expanded[myconveyorId] &&
                                                sortedChildren.map((record) => (
                                                    <TableRow
                                                        key={record.id}
                                                        className="h-10 bg-sidebar/50 hover:bg-primary-hover dark:bg-accent/75 dark:hover:bg-sidebar-accent"
                                                    >
                                                        <TableCell className="px-4 text-muted-foreground">
                                                            {myconveyorId}
                                                        </TableCell>
                                                        {visibleColumns.map(
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
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={visibleColumns.length + 2}
                                        className="h-12 text-center"
                                    >
                                        No results found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor="rows-per-page"
                            className="text-sm font-medium"
                        >
                            Show
                        </Label>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(parseInt(value));
                                setCurrentPage(1); // reset to first page when user changes it
                            }}
                        >
                            <SelectTrigger
                                id="rows-per-page"
                                className="w-[100px]"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((num) => (
                                    <SelectItem
                                        key={num}
                                        value={num.toString()}
                                    >
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="justify-end">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(p - 1, 1),
                                            )
                                        }
                                        className={
                                            currentPage === 1
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() =>
                                                setCurrentPage(i + 1)
                                            }
                                            isActive={currentPage === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(p + 1, totalPages),
                                            )
                                        }
                                        className={
                                            currentPage === totalPages
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
