/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'

import './index.css'

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  GroupingState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { makeData } from '../../utils/makeData'
import { Player } from '../../types'
import { generateColumns } from '../../utils/generateColumns'
import DebouncedInput from './DebouncedInput'
import Filter from './Filter'
import { useSkipper } from '../../hooks/useSkipper'
import { defaultColumn, fuzzyFilter, getTableMeta } from './tableModels'
import { Button, Switch, TextField } from '@mui/material'

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

type TableProps = {
  data: Player[]
}
export const Table: React.FC<TableProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns = React.useMemo<ColumnDef<Player, any>[]>(() => generateColumns(), [])
  // const [year, setYear] = useState(new Date().getFullYear())
  // const [ trigger, { data: queryData = []} ] = useLazyGetStatsByTeamIdQuery()
  // const [data, setData] = React.useState<Player[]>([])

  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  // const [isSplit, setIsSplit] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnPinning, setColumnPinning] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [showSettings, setShowSettings] = React.useState(false)
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    autoResetPageIndex,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    // Provide our updateData function to our table meta
    // meta: getTableMeta(setData, skipAutoResetPageIndex),
    state: {
      grouping,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      rowSelection,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])
  // useEffect(() => {
  //   setData(queryData)
  // }, [queryData])
  // useEffect(() => {
  //   getData()
  // },[])
  // const handleYearChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   const onlyNums = Number(e.target.value.replace(/[^0-9]/g, ''));
  //   setYear(onlyNums)
  // }

  // const getData = () => {
  //   trigger({ teamId: 1, year: year })
  // }

  console.log('table', table.getHeaderGroups())
  return (
    <>
      <div className="flex items-center gap-2">
        <div>
          Search:
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="mx-1 p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </div>
        <div>
          <Switch
            color="primary"
            checked={showSettings}
            onChange={(value) => {
              setShowSettings(value.target.checked)
            }}
          />
        </div>
        {/* <div>
          <TextField label="Year" variant="outlined" value={year.toString()} onChange={(e) => {handleYearChange(e)}}/>
        </div>
        <div>
          <Button onClick={getData}>Get Data</Button>
        </div> */}
      </div>

      {showSettings && (
        <div className="grid grid-cols-5 p-2 inline-block border border-black shadow rounded mt-2">
          <div className="px-1 border-black">
            <label>
              <input
                type="checkbox"
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                className="mr-1"
              />
              Toggle All
            </label>
          </div>
          {table.getAllLeafColumns().map((column) => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="mr-1"
                  />
                  {column.id}
                </label>
              </div>
            )
          })}
        </div>
      )}
      <div className="max-w-full overflow-scroll max-h-[30rem]">
        <table>
          <thead className='sticky top-0 bg-slate-600 text-white'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        {/* <div>{table.getPrePaginationRowModel().rows.length} Rows</div> */}
        {/* <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div> */}
        {/* <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre> */}
      </div>
    </>
  )
}

// export default Table