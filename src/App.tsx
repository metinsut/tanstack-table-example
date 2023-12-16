import { useState } from 'react';
import {
  ColumnDef,
  ColumnOrderState,
  ColumnResizeMode,
  ExpandedState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Person, makeData } from './makeData';
import dayjs from 'dayjs';
import IndeterminateCheckbox from './InderterminateCheckbox';

function App() {
  const [data] = useState(() => [...makeData(100, 5, 2)]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper<Person>();

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: 'qqq',
      header: ({ table }) => (
        <>
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
          <button
            {...{
              onClick: table.getToggleAllRowsExpandedHandler()
            }}>
            {table.getIsAllRowsExpanded() ? '👇' : '👉'}
          </button>
        </>
      ),
      cell: ({ row, getValue }) => (
        <div
          style={{
            // Since rows are flattened by default,
            // we can use the row.depth property
            // and paddingLeft to visually indicate the depth
            // of the row
            paddingLeft: `${row.depth * 2}rem`
          }}>
          <>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />{' '}
            {row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' }
                }}>
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            )}{' '}
            {getValue()}
          </>
        </div>
      ),
      footer: (props) => props.column.id
    },
    columnHelper.group({
      id: 'hello',
      header: () => <span>Hello</span>,
      // footer: (props) => props.column.id,
      columns: [
        columnHelper.accessor((row) => row.name, {
          id: 'name',
          cell: (info) => <i>{info.getValue()}</i>,
          header: () => <span>Name</span>,
          footer: (info) => info.column.id
        }),
        columnHelper.accessor('email', {
          cell: (info) => info.getValue(),
          header: () => <span>Email</span>,
          footer: () => 'mail'
        })
      ]
    }),
    columnHelper.group({
      id: 'great',
      header: () => <span>Great</span>,
      // footer: (props) => props.column.id,
      columns: [
        columnHelper.group({
          id: 'alan',
          header: () => <span>Alan</span>,
          // footer: (props) => props.column.id,
          columns: [
            columnHelper.accessor('country', {
              header: () => <span>Country</span>,
              footer: (info) => info.column.id
            }),
            columnHelper.accessor('birthdate', {
              header: () => <span>Birth Date</span>,
              footer: (info) => info.column.id,
              cell: (info) => dayjs(info.getValue()).format('YYYY')
            }),
            columnHelper.accessor('salary', {
              header: () => <span>Salary</span>,
              footer: (info) => info.column.id
            })
          ]
        }),
        columnHelper.group({
          id: 'merak',
          header: () => <span>Merak</span>,
          // footer: (props) => props.column.id,
          columns: [
            columnHelper.accessor('phone', {
              header: () => <span>Phone</span>,
              footer: (info) => info.column.id
            }),
            columnHelper.accessor('company', {
              header: () => <span>Company</span>,
              footer: (info) => info.column.id
            }),
            columnHelper.accessor('moli', {
              header: () => <span>Moli</span>,
              footer: (info) => info.column.id
            })
          ]
        })
      ]
    })
  ];

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    state: {
      columnVisibility,
      columnOrder,
      expanded,
      rowSelection
    },
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: (row) => row.subRows
  });

  console.log(rowSelection);

  return (
    <main className="p-4">
      <section className="flex gap-8">
        <div>
          {table.getAllLeafColumns().map((column) => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    {...{
                      type: 'checkbox',
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler()
                    }}
                  />
                  {column.id}
                </label>
              </div>
            );
          })}
        </div>
        <div>
          <select
            value={columnResizeMode}
            onChange={(e) => setColumnResizeMode(e.target.value as ColumnResizeMode)}
            className="border p-2 border-black rounded">
            <option value="onEnd">Resize: "onEnd"</option>
            <option value="onChange">Resize: "onChange"</option>
          </select>
        </div>
      </section>
      <div className="overflow-x-auto">
        <table
          {...{
            style: {
              width: table.getCenterTotalSize()
            }
          }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize()
                      }
                    }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' && header.column.getIsResizing()
                              ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                              : ''
                        }
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...{
                      key: cell.id,
                      style: {
                        width: cell.column.getSize()
                      }
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </main>
  );
}

export default App;
