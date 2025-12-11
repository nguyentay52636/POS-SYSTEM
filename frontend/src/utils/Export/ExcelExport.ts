import * as XLSX from 'xlsx';

export interface ExcelColumn<T> {
    header: string;
    key: keyof T | string;
    width?: number;
    formatter?: (value: any, row: T) => string | number;
}

export interface ExcelExportOptions<T> {
    data: T[];
    columns: ExcelColumn<T>[];
    fileName: string;
    sheetName?: string;
    title?: string;
    includeTimestamp?: boolean;
}

/**
 * Export data to Excel file
 */
export function exportToExcel<T extends Record<string, any>>({
    data,
    columns,
    fileName,
    sheetName = 'Sheet1',
    title,
    includeTimestamp = true,
}: ExcelExportOptions<T>): void {
    // Prepare headers
    const headers = columns.map(col => col.header);

    // Prepare data rows
    const rows = data.map(item => {
        return columns.map(col => {
            const key = col.key as string;
            const value = getNestedValue(item, key);

            if (col.formatter) {
                return col.formatter(value, item);
            }

            return value ?? '';
        });
    });

    // Build worksheet data
    const worksheetData: (string | number)[][] = [];

    // Add title if provided
    if (title) {
        worksheetData.push([title]);
        worksheetData.push([]); // Empty row
    }

    // Add timestamp
    if (includeTimestamp) {
        const now = new Date();
        worksheetData.push([`Xuất ngày: ${now.toLocaleDateString('vi-VN')} lúc ${now.toLocaleTimeString('vi-VN')}`]);
        worksheetData.push([]); // Empty row
    }

    // Add headers and data
    worksheetData.push(headers);
    worksheetData.push(...rows);

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = columns.map(col => ({
        wch: col.width || Math.max(col.header.length + 2, 15)
    }));
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate filename with timestamp if needed
    const timestamp = new Date().toISOString().slice(0, 10);
    const finalFileName = `${fileName}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, finalFileName);
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'user.name') returns obj.user.name
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Format date to Vietnamese locale
 */
export function formatDateVN(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format currency to Vietnamese locale
 */
export function formatCurrencyVN(amount: number): string {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

/**
 * Format number to Vietnamese locale
 */
export function formatNumberVN(num: number): string {
    if (num === null || num === undefined) return '';
    return new Intl.NumberFormat('vi-VN').format(num);
}

