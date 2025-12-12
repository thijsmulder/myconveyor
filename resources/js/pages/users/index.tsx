import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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

// Definiëren welke kolommen we filteren. Id is uitgesloten.
const FILTERABLE_COLUMNS: (keyof User)[] = ['name', 'email', 'role', 'active'];

export default function Users() {
    const { users } = usePage().props as unknown as { users: User[] };

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof User>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Filter + Sort Logic
    const filteredData = useMemo(() => {
        return users
            .filter((user) =>
                FILTERABLE_COLUMNS.some((col) =>
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
    }, [users, search, sortKey, sortDir]);

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

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

    // Helper om de sorteer-icoon klassen te genereren
    const getSortIconClasses = (key: keyof User) => {
        const baseClasses = 'ml-1 inline h-3 w-3 transition-opacity';
        // Altijd zichtbaar als de kolom de actieve sorteersleutel is, anders verberg op non-hover
        const visibilityClasses =
            sortKey === key
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-50';
        return `${baseClasses} ${visibilityClasses}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                {/* Search + Add Button Toolbar */}
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
                        <Button>
                            <Plus className="mr-2 size-4" /> Add user
                        </Button>
                    </div>
                </div>

                {/* Users Table */}
                <Card className="overflow-hidden rounded-md p-0 shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-8 bg-primary hover:bg-primary dark:bg-sidebar">
                                {/* Name */}
                                <TableHead
                                    onClick={() => toggleSort('name')}
                                    className="group cursor-pointer px-4 text-xs font-black tracking-wider text-white uppercase"
                                >
                                    Name{' '}
                                    <ArrowUpDown
                                        className={getSortIconClasses('name')}
                                    />
                                </TableHead>

                                {/* Email */}
                                <TableHead
                                    onClick={() => toggleSort('email')}
                                    className="group cursor-pointer px-4 text-xs font-black tracking-wider text-white uppercase"
                                >
                                    Email{' '}
                                    <ArrowUpDown
                                        className={getSortIconClasses('email')}
                                    />
                                </TableHead>

                                {/* Role */}
                                <TableHead
                                    onClick={() => toggleSort('role')}
                                    className="group cursor-pointer px-4 text-xs font-black tracking-wider text-white uppercase"
                                >
                                    Role{' '}
                                    <ArrowUpDown
                                        className={getSortIconClasses('role')}
                                    />
                                </TableHead>

                                {/* Status */}
                                <TableHead
                                    onClick={() => toggleSort('active')}
                                    className="group cursor-pointer px-4 text-xs font-black tracking-wider text-white uppercase"
                                >
                                    Status{' '}
                                    <ArrowUpDown
                                        className={getSortIconClasses('active')}
                                    />
                                </TableHead>

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
                                        {/* Name */}
                                        <TableCell className="px-4 font-medium">
                                            {user.name}
                                        </TableCell>

                                        {/* Email */}
                                        <TableCell className="px-4">
                                            {user.email}
                                        </TableCell>

                                        {/* Role */}
                                        <TableCell className="px-4">
                                            <Badge
                                                variant="outline"
                                                className="font-normal"
                                            >
                                                {user.role === 'RO'
                                                    ? 'Read Only'
                                                    : user.role === 'RW'
                                                      ? 'Read/Write'
                                                      : 'Admin'}
                                            </Badge>
                                        </TableCell>

                                        {/* Active Status Badge */}
                                        <TableCell className="px-4">
                                            {user.active === 1 ? (
                                                <Badge
                                                    className="flex w-fit items-center gap-1.5 border-green-300 bg-green-200 px-2 py-0.5 text-xs font-medium text-green-900 hover:bg-green-200"
                                                    variant="secondary"
                                                >
                                                    <CircleCheck className="size-3.5 fill-none stroke-[2.5]" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    className="flex w-fit items-center gap-1.5 border-red-300 bg-red-200 px-2 py-0.5 text-xs font-medium text-red-900 hover:bg-red-200"
                                                    variant="secondary"
                                                >
                                                    <CircleX className="size-3.5 fill-none stroke-[2.5]" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <EllipsisVertical className="size-4" />
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
                                                            Edit User
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            confirm(
                                                                'Are you sure?',
                                                            )
                                                        }
                                                    >
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Footer: Pagination & Rows per page */}
                <div className="mt-4 flex items-center justify-between">
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

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-muted-foreground">
                            Showing {startItem}-{endItem} of{' '}
                            {filteredData.length} items
                        </span>
                        <Pagination>
                            <PaginationPrevious
                                onClick={() => goToPage(currentPage - 1)}
                                className={
                                    currentPage === 1
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
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
                                        className={`cursor-pointer rounded px-3 py-1 ${
                                            page === currentPage
                                                ? 'bg-primary text-white'
                                                : ''
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
                                        : 'cursor-pointer'
                                }
                            />
                        </Pagination>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
