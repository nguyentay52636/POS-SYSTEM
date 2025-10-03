"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface PaginationState {
    currentPage: number;
    rowsPerPage: number;
    totalItems: number;
    totalPages: number;
}

interface PaginationContextType {
    paginationState: PaginationState;
    setCurrentPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;
    setTotalItems: (total: number) => void;
    setTotalPages: (pages: number) => void;
    resetPagination: () => void;
}

const defaultPaginationState: PaginationState = {
    currentPage: 1,
    rowsPerPage: 8,
    totalItems: 0,
    totalPages: 1,
};

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

interface PaginationProviderProps {
    children: ReactNode;
    initialRowsPerPage?: number;
}

export function PaginationProvider({
    children,
    initialRowsPerPage = 8
}: PaginationProviderProps) {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        ...defaultPaginationState,
        rowsPerPage: initialRowsPerPage,
    });

    const setCurrentPage = useCallback((page: number) => {
        setPaginationState(prev => ({
            ...prev,
            currentPage: page,
        }));
    }, []);

    const setRowsPerPage = useCallback((rows: number) => {
        setPaginationState(prev => ({
            ...prev,
            rowsPerPage: rows,
            currentPage: 1,
        }));
    }, []);

    const setTotalItems = useCallback((total: number) => {
        setPaginationState(prev => {
            const nextTotalPages = Math.max(1, Math.ceil(total / prev.rowsPerPage));
            if (prev.totalItems === total && prev.totalPages === nextTotalPages) {
                return prev;
            }
            return {
                ...prev,
                totalItems: total,
                totalPages: nextTotalPages,
            };
        });
    }, []);

    const setTotalPages = useCallback((pages: number) => {
        setPaginationState(prev => ({
            ...prev,
            totalPages: pages,
        }));
    }, []);

    const resetPagination = useCallback(() => {
        setPaginationState({
            ...defaultPaginationState,
            rowsPerPage: initialRowsPerPage,
        });
    }, [initialRowsPerPage]);

    const value: PaginationContextType = useMemo(() => ({
        paginationState,
        setCurrentPage,
        setRowsPerPage,
        setTotalItems,
        setTotalPages,
        resetPagination,
    }), [paginationState, setCurrentPage, setRowsPerPage, setTotalItems, setTotalPages, resetPagination]);

    return (
        <PaginationContext.Provider value={value}>
            {children}
        </PaginationContext.Provider>
    );
}

export function usePagination(): PaginationContextType {
    const context = useContext(PaginationContext);
    if (!context) {
        throw new Error('usePagination must be used within PaginationProvider');
    }
    return context;
}