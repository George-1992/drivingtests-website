'use client';

import { useState, useMemo } from 'react';
import jsonData from './erc_panel_db.json'; // Ensure this path matches your file structure

export default function ErcPanelMembers() {
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('review_panel_member_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPanel, setSelectedPanel] = useState(null);

    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

    // Extract unique filter categories
    const uniqueCategories = useMemo(() => {
        const categories = new Set();
        jsonData.forEach(item => {
            if (item.category) {
                categories.add(item.category);
            }
        });
        return Array.from(categories).sort();
    }, []);

    // Extract unique filter panels
    const uniquePanels = useMemo(() => {
        const panels = new Set();
        jsonData.forEach(item => {
            if (item.review_panel) {
                panels.add(item.review_panel);
            }
        });
        return Array.from(panels).sort();
    }, []);

    // 1. Handle Sorting Toggle
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
        setCurrentPage(1); // Reset to page 1 on sort change
    };

    // 2. Filter & Sort Data Memoized for Performance
    const processedData = useMemo(() => {
        let filtered = jsonData.filter((item) => {
            // Apply category filter if one is selected
            if (selectedCategory && item.category !== selectedCategory) {
                return false;
            }

            // Apply panel filter if one is selected
            if (selectedPanel && item.review_panel !== selectedPanel) {
                return false;
            }

            // Apply search term filtering
            const searchLower = searchTerm.toLowerCase();
            return (
                item.review_panel_member_name.toLowerCase().includes(searchLower) ||
                item.review_panel.toLowerCase().includes(searchLower) ||
                item.category.toLowerCase().includes(searchLower)
            );
        });

        // Handle structural sorting
        filtered.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            // Convert booleans to numbers for easy sorting (true = 1, false = 0)
            if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                valA = valA ? 1 : 0;
                valB = valB ? 1 : 0;
            }

            // Fallbacks for null/undefined string values
            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [searchTerm, sortKey, sortOrder, selectedCategory, selectedPanel]);

    // 3. Pagination Calculations
    const totalItems = processedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Helper to render sorting chevron icons
    const renderSortIcon = (key) => {
        if (sortKey !== key) return <span className="text-gray-300 ml-1 text-xs">↕</span>;
        return sortOrder === 'asc' ? <span className="text-indigo-600 ml-1 text-xs">↑</span> : <span className="text-indigo-600 ml-1 text-xs">↓</span>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 my-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">ERC Panel Members Dashboard</h1>

            {/* Filter Section: Category & Panel Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-full sm:w-64">
                    <label htmlFor="category" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Filter by Category
                    </label>
                    <select
                        id="category"
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value || null);
                            setCurrentPage(1);
                        }}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700"
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-64">
                    <label htmlFor="panel" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Filter by Review Panel
                    </label>
                    <select
                        id="panel"
                        value={selectedPanel || ''}
                        onChange={(e) => {
                            setSelectedPanel(e.target.value || null);
                            setCurrentPage(1);
                        }}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700"
                    >
                        <option value="">All Panels</option>
                        {uniquePanels.map((panel) => (
                            <option key={panel} value={panel}>
                                {panel}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Top Bar: Search & Page Entries Count */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search name, panel, category..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
                    />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 self-end sm:self-auto">
                    <span>Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 select-none border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3.5 font-semibold cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('review_panel_member_name')}>
                                Member Name {renderSortIcon('review_panel_member_name')}
                            </th>
                            <th scope="col" className="px-4 py-3.5 font-semibold cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('review_panel')}>
                                Review Panel {renderSortIcon('review_panel')}
                            </th>
                            <th scope="col" className="px-4 py-3.5 font-semibold cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('category')}>
                                Category {renderSortIcon('category')}
                            </th>
                            {years.map((year) => (
                                <th scope="col" key={year} className="px-3 py-3.5 font-semibold cursor-pointer text-center hover:bg-gray-200 transition" onClick={() => handleSort(year)}>
                                    {year} {renderSortIcon(year)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="bg-white even:bg-gray-50/70 border-b border-gray-100 hover:bg-indigo-50/40 transition duration-150 ease-in-out"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {item.review_panel_member_name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                                        {item.review_panel}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-gray-200/60 rounded text-xs font-semibold text-gray-700">
                                            {item.category}
                                        </span>
                                    </td>
                                    {years.map((year) => (
                                        <td key={year} className="px-3 py-4 text-center whitespace-nowrap">
                                            {item[year] ? (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs" title="Active">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={years.length + 3} className="text-center py-10 text-gray-400 font-medium">
                                    No results found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-1 text-sm text-gray-600">
                    <div>
                        Showing <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-semibold text-gray-800">
                            {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
                        </span>{' '}
                        of <span className="font-semibold text-gray-800">{totalItems}</span> entries
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>

                        <div className="flex items-center max-w-[200px] sm:max-w-xs overflow-x-auto px-1">
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md mx-0.5 min-w-[32px] transition ${currentPage === pageNum
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}