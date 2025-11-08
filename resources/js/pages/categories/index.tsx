import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/categories' },
];

type Category = {
    id: number;
    name: string;
};

export default function Categories() {
    const { categories } = usePage().props as unknown as {
        categories: Category[];
    };

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof Category>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [visibleCols, setVisibleCols] = useState<Record<'name', boolean>>({
        name: true,
    });

    // --- Filtering & Sorting ---
    const filteredData = useMemo(() => {
        return categories
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const aVal = a[sortKey] ?? '';
                const bVal = b[sortKey] ?? '';
                if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
    }, [categories, search, sortKey, sortDir]);

    const toggleSort = (key: keyof Category) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const toggleColumn = (key: 'name') => {
        setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Input
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.keys(visibleCols).map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col}
                                    checked={visibleCols[col as 'name']}
                                    onCheckedChange={() =>
                                        toggleColumn(col as 'name')
                                    }
                                >
                                    {col}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-8 bg-primary hover:bg-primary">
                                {visibleCols.name && (
                                    <TableHead
                                        onClick={() => toggleSort('name')}
                                        className="cursor-pointer text-white px-4"
                                    >
                                        Category{' '}
                                        <ArrowUpDown className="ml-1 inline h-4 w-4 opacity-50" />
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((cat) => (
                                    <TableRow key={cat.id} className="h-12 border-b-0 dark:border-b dark:even:bg-transparent even:bg-sidebar">
                                        {visibleCols.name && (
                                            <TableCell className="px-4">{cat.name}</TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            Object.keys(visibleCols).length
                                        }
                                        className="py-6 text-center text-gray-500"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
