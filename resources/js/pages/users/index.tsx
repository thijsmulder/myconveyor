import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
    Pagination,
    PaginationContent,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    CircleCheck,
    CircleX,
    EllipsisVertical,
    Plus,
    SearchIcon,
    Settings2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    active: number;
};

export default function Users() {
    const { users } = usePage().props as unknown as { users: User[] };

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof User>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [visibleCols, setVisibleCols] = useState<Record<keyof User, boolean>>(
        {
            id: false,
            name: true,
            email: true,
            role: true,
            active: true,
        },
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Filter + Sort
    const filteredData = useMemo(() => {
        const activeCols = Object.keys(visibleCols).filter(
            (k) => visibleCols[k as keyof User],
        ) as (keyof User)[];

        return users
            .filter((user) =>
                activeCols.some((col) =>
                    String(user[col])
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
    }, [users, search, sortKey, sortDir, visibleCols]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    const toggleSort = (key: keyof User) => {
        if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const toggleColumn = (key: keyof typeof visibleCols) => {
        setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                {/* Search + Column Toggle */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex gap-3">
                        <InputGroup className="w-60">
                            <InputGroupInput
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Settings2 /> View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-sm text-muted-foreground">
                                    Toggle columns
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.keys(visibleCols)
                                    .filter((col) => col !== 'id') // remove 'id'
                                    .map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col}
                                            checked={
                                                visibleCols[
                                                    col as keyof typeof visibleCols
                                                ]
                                            }
                                            onCheckedChange={() =>
                                                toggleColumn(
                                                    col as keyof typeof visibleCols,
                                                )
                                            }
                                        >
                                            {col.charAt(0).toUpperCase() +
                                                col.slice(1)}{' '}
                                            {/* Capitalized */}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button>
                            <Plus /> Add user
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-hidden rounded-md p-0 shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-8 bg-primary hover:bg-primary dark:bg-sidebar">
                                {visibleCols.name && (
                                    <TableHead
                                        onClick={() => toggleSort('name')}
                                        className="cursor-pointer px-4 text-white"
                                    >
                                        Name{' '}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                )}
                                {visibleCols.email && (
                                    <TableHead
                                        onClick={() => toggleSort('email')}
                                        className="cursor-pointer px-4 text-white"
                                    >
                                        Email{' '}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                )}
                                {visibleCols.role && (
                                    <TableHead
                                        onClick={() => toggleSort('role')}
                                        className="cursor-pointer px-4 text-white"
                                    >
                                        Role{' '}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                )}
                                {visibleCols.active && (
                                    <TableHead
                                        onClick={() => toggleSort('active')}
                                        className="cursor-pointer px-4 text-white"
                                    >
                                        Active{' '}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                )}
                                <TableHead className="px-4 text-white"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="h-12 hover:bg-primary-hover dark:border-b dark:even:bg-transparent dark:hover:bg-sidebar"
                                    >
                                        {visibleCols.name && (
                                            <TableCell className="px-4">
                                                {user.name}
                                            </TableCell>
                                        )}
                                        {visibleCols.email && (
                                            <TableCell className="px-4">
                                                {user.email}
                                            </TableCell>
                                        )}
                                        {visibleCols.role && (
                                            <TableCell className="px-4">
                                                {user.role === 'RO' && (
                                                    <Badge variant="secondary" className="bg-sidebar">
                                                        Read Only
                                                    </Badge>
                                                )}
                                                {user.role === 'RW' && (
                                                    <Badge variant="secondary" className="bg-sidebar">
                                                        Read/Write
                                                    </Badge>
                                                )}
                                                {user.role === 'A' && (
                                                    <Badge variant="secondary" className="bg-sidebar">
                                                        Admin
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        )}

                                        {visibleCols.active && (
                                            <TableCell className="px-4">
                                                {user.active === 1 ? (
                                                    <Badge variant="secondary" className="bg-sidebar">
                                                        <CircleCheck className="fill-green-500 text-muted dark:text-muted" />
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-sidebar">
                                                        <CircleX className="fill-red-600 text-muted dark:text-muted" />
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        )}

                                        <TableCell className="px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/users/${user.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Are you sure you want to delete this user?',
                                                                )
                                                            ) {
                                                                // replace with your Inertia delete request
                                                                // e.g. router.delete(`/users/${user.id}`)
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            Object.values(visibleCols).filter(
                                                Boolean,
                                            ).length
                                        }
                                        className="h-12 text-center"
                                    >
                                        No results found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Pagination + Summary */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Rows per page selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Rows
                        </span>
                        <Select
                            value={rowsPerPage.toString()}
                            onValueChange={(val) => {
                                setRowsPerPage(Number(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((num) => (
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

                    {/* Pagination + summary */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-nowrap text-muted-foreground">
                            Showing {startItem}-{endItem} of{' '}
                            {filteredData.length} items
                        </span>
                        <Pagination>
                            <PaginationPrevious
                                onClick={() => goToPage(currentPage - 1)}
                                className={
                                    currentPage === 1
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                            <PaginationContent>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <PaginationLink
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`rounded px-3 py-1 ${
                                            page === currentPage
                                                ? 'bg-primary text-white'
                                                : 'bg-background text-foreground'
                                        }`}
                                    >
                                        {page}
                                    </PaginationLink>
                                ))}
                            </PaginationContent>
                            <PaginationNext
                                onClick={() => goToPage(currentPage + 1)}
                                className={
                                    currentPage === totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </Pagination>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
